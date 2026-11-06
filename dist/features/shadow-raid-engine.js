/* Deterministic, DOM-free combat. Times are active-play milliseconds, not wall time. */
(function (root) {
  'use strict';
  const LIMIT = 60000, BOSS_HP = 720;
  function validSeed(value) { return typeof value === 'string' && /^[A-Z0-9]{6}$/.test(value); }
  function create(seed = 'SHADOW') {
    if (!validSeed(seed)) seed = 'SHADOW';
    let rng = 2166136261;
    for (const char of seed) rng = Math.imul(rng ^ char.charCodeAt(0), 16777619) >>> 0;
    return {seed, rng, status:'playing', time:0, hp:100, bossHp:BOSS_HP, gauge:0, phase:1,
      attackReady:0, dodgeReady:0, dodgeFrom:-1, dodgeUntil:-1, counterUntil:-1,
      nextCue:1500, hitAt:null, cueAt:null, hits:0, dodges:0, summons:0, events:[]};
  }
  function random(s) { s.rng = (Math.imul(s.rng, 1664525) + 1013904223) >>> 0; return s.rng / 4294967296; }
  function emit(s, type, extra = {}) { s.events.push({type, at:s.time, ...extra}); }
  function finish(s, status) { s.status = status; emit(s, status); }
  function advance(s, target) {
    if (s.status !== 'playing' || !Number.isFinite(target)) return s;
    const end = Math.min(LIMIT, Math.max(s.time, target));
    while (s.status === 'playing') {
      const next = s.hitAt === null ? s.nextCue : s.hitAt;
      if (next > end || next >= LIMIT) break;
      s.time = next;
      if (s.hitAt === null) {
        s.cueAt = next;
        s.hitAt = next + 1800 - (s.phase - 1) * 200 + Math.floor(random(s) * 5) * 100;
        emit(s, 'cue');
      } else {
        if (s.dodgeFrom >= 0 && s.dodgeFrom <= next && s.dodgeUntil >= next) {
          s.dodges++; s.gauge = Math.min(100, s.gauge + 25); s.counterUntil = next + 1600;
          emit(s, 'evaded');
        } else {
          const damage = 14 + (s.phase - 1) * 4;
          s.hp = Math.max(0, s.hp - damage); s.hits++; emit(s, 'hurt', {damage});
          if (!s.hp) finish(s, 'lost');
        }
        s.hitAt = null; s.cueAt = null;
        s.nextCue = next + 1100 + Math.floor(random(s) * 7) * 100;
      }
    }
    if (s.status === 'playing') {
      s.time = end;
      if (end === LIMIT) finish(s, 'timeout');
    }
    return s;
  }
  function act(s, action, at = s.time) {
    advance(s, at);
    if (s.status !== 'playing') return {ok:false, reason:'ended'};
    if (!['attack', 'dodge', 'summon'].includes(action)) return {ok:false, reason:'unknown'};
    if (action === 'dodge') {
      if (s.time < s.dodgeReady) return {ok:false, reason:'cooldown'};
      s.dodgeFrom = s.time; s.dodgeUntil = s.time + 600; s.dodgeReady = s.time + 1400;
      emit(s, 'dodge'); return {ok:true};
    }
    if (s.time < s.dodgeUntil) return {ok:false, reason:'dodging'};
    if (s.time < s.attackReady) return {ok:false, reason:'cooldown'};
    if (action === 'summon' && s.gauge < 100) return {ok:false, reason:'charge'};
    let damage;
    if (action === 'summon') { damage = 100; s.gauge = 0; s.summons++; }
    else {
      damage = s.time < s.counterUntil ? 30 : 12;
      s.counterUntil = -1; s.gauge = Math.min(100, s.gauge + 12);
    }
    s.attackReady = s.time + 650;
    s.bossHp = Math.max(0, s.bossHp - damage);
    emit(s, action, {damage});
    if (!s.bossHp) finish(s, 'won');
    else {
      const phase = s.bossHp <= 240 ? 3 : s.bossHp <= 480 ? 2 : 1;
      if (phase !== s.phase) { s.phase = phase; emit(s, 'phase'); }
    }
    return {ok:true};
  }
  function drain(s) { return s.events.splice(0); }
  const api = {LIMIT, BOSS_HP, validSeed, create, advance, act, drain};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ShadowRaidEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);
