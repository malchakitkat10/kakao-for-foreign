const {test} = require('node:test');
const assert = require('node:assert/strict');
const E = require('../dist/features/shadow-raid-engine.js');

function run(strategy, seed = 'SHADOW') {
  const s = E.create(seed), trace = [];
  for (let at = 0; at <= E.LIMIT && s.status === 'playing'; at += 50) {
    E.advance(s, at);
    if (s.status !== 'playing') break;
    const danger = s.hitAt !== null && s.hitAt - s.time <= 450;
    if (strategy !== 'idle' && danger) E.act(s, 'dodge');
    else if (strategy === 'fighter') E.act(s, s.gauge >= 100 ? 'summon' : 'attack');
    trace.push(...E.drain(s));
  }
  return {s, trace};
}
test('a complete combat run can win with attacks, dodges, counters and summons', () => {
  const {s,trace} = run('fighter');
  assert.equal(s.status,'won'); assert.equal(s.bossHp,0);
  assert.ok(s.time < E.LIMIT && s.hp > 0 && s.dodges > 0 && s.summons > 0);
  assert.ok(trace.some(e => e.type === 'attack' && e.damage === 30));
  assert.ok(trace.some(e => e.type === 'phase')); assert.equal(s.phase,3);
});
test('inactivity loses, while evasive play without damage times out', () => {
  const idle = run('idle').s, evasive = run('evade').s;
  assert.equal(idle.status,'lost'); assert.equal(idle.hp,0);
  assert.equal(evasive.status,'timeout'); assert.equal(evasive.time,E.LIMIT);
  assert.equal(evasive.bossHp,E.BOSS_HP); assert.equal(evasive.hp,100);
});
test('one action cannot be repeated during cooldown and summon requires charge', () => {
  const s = E.create();
  assert.equal(E.act(s,'summon').reason,'charge');
  assert.equal(E.act(s,'attack').ok,true);
  for (let i=0;i<20;i++) assert.equal(E.act(s,'attack',100).reason,'cooldown');
  assert.equal(s.bossHp,E.BOSS_HP-12); assert.equal(s.gauge,12);
  assert.equal(E.act(s,'dodge',200).ok,true);
  assert.equal(E.act(s,'dodge',300).reason,'cooldown');
  assert.equal(E.act(s,'attack',650).reason,'dodging');
  assert.equal(E.act(s,'attack',800).ok,true);
});
test('early dodges miss; a dodge in the last 600ms earns a counter and charge', () => {
  const early=E.create(),late=E.create();
  E.advance(early,1500); E.advance(late,1500);
  E.act(early,'dodge'); E.advance(early,early.hitAt);
  assert.equal(early.hp,86); assert.equal(early.dodges,0);
  const impact=late.hitAt;
  E.act(late,'dodge',impact-400); E.advance(late,impact);
  assert.equal(late.hp,100); assert.equal(late.dodges,1); assert.equal(late.gauge,25);
  E.act(late,'attack',impact+201);
  assert.equal(late.bossHp,E.BOSS_HP-30);
});
test('counter bonus expires and cannot be used twice', () => {
  for (const delay of [201,1601]) {
    const s=E.create(); E.advance(s,1500); const impact=s.hitAt;
    E.act(s,'dodge',impact-400); E.advance(s,impact);
    E.act(s,'attack',impact+delay);
    assert.equal(s.bossHp,E.BOSS_HP-(delay===201?30:12));
    E.act(s,'attack',s.time+650);
    assert.equal(s.bossHp,E.BOSS_HP-(delay===201?42:24));
  }
});
test('large frame gaps process the same hits as small steps', () => {
  const big=E.create(),small=E.create(); E.advance(big,20000);
  for(let t=0;t<=20000;t+=50) E.advance(small,t);
  assert.deepEqual(big,small);
});
test('same code and inputs reproduce the run; a new seed changes the pattern', () => {
  assert.deepEqual(run('fighter'),run('fighter'));
  assert.notDeepEqual(run('fighter','ABC123').trace,run('fighter','XYZ789').trace);
  assert.deepEqual(E.create('bad<script>'),E.create('SHADOW'));
});
test('terminal states reject new actions, do not change and emit the result once', () => {
  for (const strategy of ['fighter','idle','evade']) {
    const s=run(strategy).s; E.drain(s); const before=structuredClone(s);
    assert.equal(E.act(s,'attack',999999).reason,'ended'); E.advance(s,999999);
    assert.deepEqual(s,before);
  }
});
test('deadline is enforced before an action, and malformed clocks are ignored', () => {
  const s=E.create(); s.nextCue=E.LIMIT+1;
  const before=structuredClone(s); E.advance(s,NaN); assert.deepEqual(s,before);
  E.advance(s,-1); assert.deepEqual(s,before);
  assert.equal(E.act(s,'attack',E.LIMIT).reason,'ended');
  assert.equal(s.status,'timeout'); assert.equal(s.bossHp,E.BOSS_HP);
  assert.equal(E.drain(s).filter(e=>e.type==='timeout').length,1);
});
test('restarting a seed resets all combat state, and a range of seeds is winnable', () => {
  const played=run('fighter').s, fresh=E.create(played.seed);
  assert.equal(fresh.time,0); assert.equal(fresh.hp,100); assert.equal(fresh.gauge,0);
  assert.equal(fresh.bossHp,E.BOSS_HP); assert.equal(fresh.status,'playing');
  for(let n=0;n<40;n++) assert.equal(run('fighter',String(n).padStart(6,'0')).s.status,'won');
});
