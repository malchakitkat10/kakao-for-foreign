/* One local player. The dungeon core and combat log are game rules, not remote users. */
(() => {
  'use strict';
  const E = window.ShadowRaidEngine, RECORD_KEY = 'playground-shadow-raid-v1';
  let dialog, session = null, raf = 0, previous = 0, origin = null, lang = 'ko';
  const copy = {
    ko:{title:'그림자 레이드 60',sub:'나 혼자만 레벨업 · 팬메이드 1인 게임',play:'60초 도전',
      intro:'공격하고, 피하고, 일어나라.',lead:'60초 안에 던전 코어를 파괴하세요.',
      rules:['공격으로 코어를 깎고 소환 게이지를 채우세요.','공격 예고가 「지금 회피」로 바뀌면 회피! 성공하면 다음 공격이 30 피해로 강화됩니다.','게이지 100에서 그림자를 소환하면 100 피해를 줍니다.'],
      solo:'1인 플레이 · 기록은 이 브라우저에 저장',attack:'공격',dodge:'회피',summon:'일어나라',
      attackHint:'12 피해 · 0.65초',dodgeHint:'0.6초 무적',summonHint:'게이지 100 필요',
      core:'던전 코어',hp:'내 체력',charge:'그림자',phase:'단계',close:'닫기',pause:'일시정지',resume:'계속하기',
      paused:'잠시 쉬어갑니다',pausedLine:'시간과 전투가 멈췄습니다.',ready:'공격 기회',warning:'공격 예고 · 기다리세요',now:'지금 회피!',counter:'회피 성공 · 반격 30 피해',
      won:'던전 클리어!',lost:'체력이 모두 소진됐습니다',timeout:'시간이 끝났습니다',
      retry:'같은 던전 재도전',new:'새 던전',share:'도전 링크 복사',copied:'도전 링크를 복사했습니다.',
      linkHelp:'복사가 안 되면 아래 링크를 직접 복사해 주세요.',linkLabel:'같은 패턴으로 도전할 링크',
      shareNote:'링크를 받은 친구도 같은 공격 패턴에 따로 도전합니다.',localNote:'실시간 멀티플레이·서버 순위는 지원하지 않습니다.',
      best:'이 던전의 내 최고',noBest:'이 던전의 첫 클리어에 도전하세요.',newBest:'개인 기록 갱신',unsaved:'기록을 저장할 수 없습니다. 이번 결과는 화면에서 확인해 주세요.',
      tip:'회피 성공 직후 반격하고, 게이지가 차면 소환해 보세요.',time:'플레이 시간',dodges:'회피 성공',remain:'코어 잔여 체력',
      command:'공격 / 회피 / 소환',send:'전송',commandLabel:'전투 명령',host:'던전 시스템',me:'나',
      startLog:'던전이 열렸습니다. 공격으로 게이지를 채우세요.',cueLog:'코어가 힘을 모읍니다. 예고 바의 마지막 구간에 회피하세요.',
      evadeLog:'회피 성공! 소환 게이지 +25 · 다음 공격 30 피해',dodgeLog:'회피 · 0.6초 무적',
      hurtLog:'피격',attackLog:'공격',counterLog:'반격',summonLog:'그림자 소환',damage:'피해',phaseLog:'코어가 더 빠르게 공격합니다.',
      unknown:'공격, 회피, 소환 중 하나를 입력해 주세요.',cooldown:'아직 준비 중입니다.',dodging:'회피가 끝나면 공격할 수 있습니다.',chargeNeed:'소환 게이지 100이 필요합니다.',
      log:'전투 기록',code:'던전 코드',practice:'버튼 또는 A · D · S 키로 조작',lang:'English'},
    en:{title:'Shadow Raid 60',sub:'Solo Leveling · Fan-made solo game',play:'Start 60-second raid',
      intro:'Strike. Evade. Arise.',lead:'Destroy the dungeon core within 60 seconds.',
      rules:['Attack to damage the core and charge your shadows.','Wait for “Evade now!” and dodge. A successful dodge powers up your next attack to 30 damage.','At 100 charge, summon shadows to deal 100 damage.'],
      solo:'Solo play · Records saved in this browser',attack:'Attack',dodge:'Evade',summon:'Arise',
      attackHint:'12 damage · 0.65s',dodgeHint:'Invincible for 0.6s',summonHint:'Needs 100 charge',
      core:'Dungeon core',hp:'Your HP',charge:'Shadows',phase:'Phase',close:'Close',pause:'Pause',resume:'Resume',
      paused:'Raid paused',pausedLine:'The clock and combat are stopped.',ready:'Attack opening',warning:'Incoming attack · wait',now:'Evade now!',counter:'Dodge successful · counter for 30',
      won:'Dungeon cleared!',lost:'Your HP ran out',timeout:'Time is up',
      retry:'Retry this dungeon',new:'New dungeon',share:'Copy challenge link',copied:'Challenge link copied.',
      linkHelp:'If copying fails, copy the link below.',linkLabel:'Link to the same dungeon pattern',
      shareNote:'Friends can try the same attack pattern in a separate solo run.',localNote:'No live multiplayer or server leaderboard.',
      best:'Your best in this dungeon',noBest:'Set your first clear time for this dungeon.',newBest:'New personal best',unsaved:'Record could not be saved. Your result is shown here.',
      tip:'Counter after a successful dodge, then summon when fully charged.',time:'Play time',dodges:'Dodges',remain:'Core HP left',
      command:'attack / dodge / summon',send:'Send',commandLabel:'Combat command',host:'Dungeon system',me:'You',
      startLog:'The dungeon is open. Attack to charge your shadows.',cueLog:'The core is charging. Evade in the final part of the warning bar.',
      evadeLog:'Dodge successful! +25 charge · next attack deals 30',dodgeLog:'Evade · invincible for 0.6s',
      hurtLog:'Hit taken',attackLog:'Attack',counterLog:'Counter',summonLog:'Shadow summon',damage:'damage',phaseLog:'The core attacks faster.',
      unknown:'Type attack, dodge, or summon.',cooldown:'Not ready yet.',dodging:'Wait until your dodge ends.',chargeNeed:'You need 100 shadow charge.',
      log:'Combat log',code:'Dungeon code',practice:'Use buttons or A · D · S keys',lang:'한국어'}
  };
  const t = key => copy[lang][key];
  const find = id => dialog.querySelector('#' + id);
  const seconds = ms => (ms / 1000).toFixed(2) + 's';
  function seed() { return [...crypto.getRandomValues(new Uint8Array(6))].map(n => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[n % 36]).join(''); }
  function records() {
    try {
      const saved = JSON.parse(localStorage.getItem(RECORD_KEY) || '{}');
      if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return {};
      return Object.fromEntries(Object.entries(saved).filter(([key,value]) => E.validSeed(key) && Number.isFinite(value) && value > 0 && value < E.LIMIT).slice(-20));
    } catch (_) { return {}; }
  }
  function header() {
    return `<header class="sr-head"><div><h2 id="sr-title">${t('title')}</h2><p>${t('sub')}</p></div><button type="button" data-raid="close" aria-label="${t('close')}">×</button></header>`;
  }
  function artwork() { return '<div class="sr-art" role="img" aria-label="나 혼자만 레벨업 · Solo Leveling"></div>'; }
  function open(code) {
    cleanup();
    origin = document.activeElement;
    if (modal.open) closeModal();
    if (!dialog) {
      dialog = document.createElement('dialog'); dialog.id = 'shadow-raid'; dialog.className = 'sr-dialog';
      dialog.setAttribute('aria-labelledby', 'sr-title'); document.body.append(dialog);
      dialog.addEventListener('cancel', () => cleanup());
      dialog.addEventListener('close', () => { cleanup(); session = null; dialog.innerHTML = ''; if (origin?.isConnected) origin.focus({preventScroll:true}); });
      dialog.addEventListener('click', onClick);
      dialog.addEventListener('submit', event => {
        if (event.target.id !== 'sr-command') return;
        event.preventDefault();
        const field = find('sr-input'), value = field.value.trim().toLowerCase().replace(/^\//, '');
        const action = {attack:'attack',a:'attack','공격':'attack',dodge:'dodge',evade:'dodge',d:'dodge','회피':'dodge',summon:'summon',arise:'summon',s:'summon','소환':'summon','일어나라':'summon'}[value];
        field.value = '';
        if (action) act(action); else find('sr-feedback').textContent = t('unknown');
      });
      dialog.addEventListener('keydown', event => {
        if (event.target.matches('input,textarea') || event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;
        const action = {a:'attack',d:'dodge',s:'summon'}[event.key.toLowerCase()];
        if (action && session?.state) { event.preventDefault(); act(action); }
      });
    }
    session = {seed:E.validSeed(code) ? code : seed(),state:null,paused:false,finished:false};
    intro(); if (!dialog.open) dialog.showModal(); find('sr-start').focus();
  }
  function intro() {
    dialog.lang = lang;
    const best = records()[session.seed];
    dialog.innerHTML = `${header()}<div class="sr-intro"><div class="sr-intro-art">${artwork()}<span>SHADOW RAID / 60</span></div><div class="sr-intro-copy"><div class="sr-intro-tools"><span>${t('solo')}</span><button type="button" data-raid="language">${t('lang')}</button></div><h3>${t('intro')}</h3><p>${t('lead')}</p><ol>${t('rules').map(rule => `<li>${rule}</li>`).join('')}</ol><p class="sr-best">${best ? `${t('best')} · ${seconds(best)}` : t('noBest')}</p><button type="button" class="sr-primary" id="sr-start" data-raid="start">${t('play')} ↗</button><p class="sr-note">${t('practice')}<br>${t('code')} ${session.seed}</p></div></div>`;
  }
  function start(code = session.seed) {
    cleanup();
    session = {seed:code,state:E.create(code),paused:false,finished:false};
    dialog.innerHTML = `${header()}<div class="sr-game"><section class="sr-stage" id="sr-stage">${artwork()}<div class="sr-stage-top"><span id="sr-phase"></span><strong id="sr-timer" aria-label="${t('time')}">60.0s</strong><button type="button" data-raid="pause" aria-label="${t('pause')}">Ⅱ</button></div><div class="sr-core" aria-hidden="true"><i></i></div><div class="sr-impact" id="sr-impact" aria-hidden="true"></div><div class="sr-enemy"><div><span>${t('core')}</span><strong id="sr-boss-value"></strong></div><progress id="sr-boss" max="720" value="720" aria-label="${t('core')}"></progress></div></section><section class="sr-hud"><div class="sr-resources"><label>${t('hp')} <b id="sr-hp-value"></b><progress id="sr-hp" max="100" value="100"></progress></label><label>${t('charge')} <b id="sr-charge-value"></b><progress id="sr-charge" max="100" value="0"></progress></label></div><div class="sr-cue" id="sr-cue"><strong id="sr-cue-text" role="status"></strong><div class="sr-warning-track" aria-hidden="true"><i id="sr-warning-fill"></i><span></span></div></div></section><div class="sr-thread" id="sr-thread" role="log" aria-label="${t('log')}" aria-live="off"></div><div class="sr-controls"><p id="sr-feedback" class="sr-feedback" role="status"></p><div class="sr-actions">${[['attack','A','attackHint'],['dodge','D','dodgeHint'],['summon','S','summonHint']].map(([action,key,hint]) => `<button type="button" id="sr-${action}" data-raid="${action}" aria-label="${t(action)}"><span>${t(action)} <kbd>${key}</kbd></span><small>${t(hint)}</small></button>`).join('')}</div><form id="sr-command"><label class="sr-only" for="sr-input">${t('commandLabel')}</label><input id="sr-input" autocomplete="off" maxlength="30" placeholder="${t('command')}"><button type="submit">${t('send')}</button></form></div></div><div class="sr-overlay" id="sr-overlay" hidden></div>`;
    log(t('startLog'));
    update(); previous = performance.now(); raf = requestAnimationFrame(frame);
    find('sr-attack').focus();
  }
  function cleanup() { cancelAnimationFrame(raf); raf = 0; previous = 0; }
  function sync(now = performance.now()) {
    if (!session?.state || session.paused || session.finished) return;
    E.advance(session.state, session.state.time + Math.max(0, now - previous)); previous = now;
    events(); update();
  }
  function frame(now) {
    if (!session?.state || session.paused || !dialog.open || session.finished) return;
    sync(now);
    if (!session.finished) raf = requestAnimationFrame(frame);
  }
  function act(action) {
    if (!session?.state || session.paused || session.finished) return;
    sync();
    if (session.finished) return;
    const result = E.act(session.state, action);
    find('sr-feedback').textContent = result.ok ? '' : t({charge:'chargeNeed',cooldown:'cooldown',dodging:'dodging',unknown:'unknown'}[result.reason] || 'cooldown');
    events(); update();
  }
  function log(text, me = false) {
    const thread = find('sr-thread'), row = document.createElement('p');
    row.className = me ? 'sr-bubble sr-me' : 'sr-bubble';
    const label = document.createElement('small'); label.textContent = me ? t('me') : t('host');
    const body = document.createElement('span'); body.textContent = text;
    row.append(label, body); thread.append(row);
    while (thread.children.length > 45) thread.firstElementChild.remove();
    thread.scrollTop = thread.scrollHeight;
  }
  function impact(text, kind) {
    const node = find('sr-impact'); node.textContent = text;
    node.className = 'sr-impact'; void node.offsetWidth; node.className = 'sr-impact sr-pop ' + kind;
  }
  function events() {
    for (const e of E.drain(session.state)) {
      if (e.type === 'cue') log(t('cueLog'));
      if (e.type === 'dodge') { log(t('dodgeLog'), true); impact('EVADE', 'evade'); }
      if (e.type === 'evaded') { log(t('evadeLog')); impact('PERFECT', 'evade'); }
      if (e.type === 'hurt') { log(`${t('hurtLog')} −${e.damage}`); impact(`−${e.damage} HP`, 'hurt'); }
      if (e.type === 'attack' || e.type === 'summon') {
        const name = e.type === 'summon' ? 'summonLog' : e.damage === 30 ? 'counterLog' : 'attackLog';
        log(`${t(name)} · ${e.damage} ${t('damage')}`, true); impact(`−${e.damage}`, e.type);
      }
      if (e.type === 'phase') log(`${t('phase')} ${session.state.phase} · ${t('phaseLog')}`);
      if (['won','lost','timeout'].includes(e.type)) finish();
    }
  }
  function update() {
    const s = session.state;
    find('sr-timer').textContent = ((E.LIMIT - s.time) / 1000).toFixed(1) + 's';
    find('sr-phase').textContent = `${t('phase')} ${s.phase} / 3`;
    for (const [id,value] of [['boss',s.bossHp],['hp',s.hp],['charge',s.gauge]]) {
      find('sr-' + id).value = value; find('sr-' + id + '-value').textContent = value;
    }
    const warning = s.hitAt !== null, evadeNow = warning && s.hitAt - s.time <= 550;
    const cue = session.finished ? s.status : evadeNow ? 'now' : warning ? 'warning' : s.time < s.counterUntil ? 'counter' : 'ready';
    const cueText = find('sr-cue-text'); if (cueText.textContent !== t(cue)) cueText.textContent = t(cue);
    find('sr-cue').className = 'sr-cue' + (evadeNow ? ' sr-now' : warning ? ' sr-warning' : '');
    find('sr-warning-fill').style.width = warning ? `${100 * (s.time - s.cueAt) / (s.hitAt - s.cueAt)}%` : '0%';
    dialog.querySelector('.sr-warning-track>span').style.width = warning ? `${55000 / (s.hitAt - s.cueAt)}%` : '25%';
    find('sr-stage').classList.toggle('sr-danger', evadeNow);
    find('sr-stage').classList.toggle('sr-dodging', !session.finished && s.time < s.dodgeUntil);
    find('sr-stage').dataset.phase = s.phase;
    for (const action of ['attack','dodge','summon']) {
      const unavailable = session.finished || session.paused || (action === 'dodge' ? s.time < s.dodgeReady : s.time < s.attackReady || s.time < s.dodgeUntil || (action === 'summon' && s.gauge < 100));
      // aria-disabled keeps keyboard focus on the same control as cooldowns change.
      find('sr-' + action).setAttribute('aria-disabled', String(unavailable));
    }
    find('sr-summon').classList.toggle('sr-charged', s.gauge >= 100 && !session.finished);
    find('sr-input').disabled = session.finished || session.paused;
  }
  function overlay(html) {
    const el = find('sr-overlay'); el.innerHTML = html; el.hidden = false;
    dialog.querySelector('.sr-game').inert = true;
    el.querySelector('button').focus();
  }
  function pause() {
    if (!session?.state || session.paused || session.finished) return;
    sync(); if (session.finished) return;
    session.paused = true; cleanup(); update();
    overlay(`<div class="sr-result"><h3>${t('paused')}</h3><p>${t('pausedLine')}</p><button type="button" class="sr-primary" data-raid="resume">${t('resume')}</button></div>`);
  }
  function resume() {
    if (!session?.paused) return;
    session.paused = false; find('sr-overlay').hidden = true; dialog.querySelector('.sr-game').inert = false;
    previous = performance.now(); raf = requestAnimationFrame(frame); find('sr-dodge').focus();
  }
  function finish() {
    if (session.finished) return;
    session.finished = true; cleanup();
    const s = session.state, saved = records(); let newBest = false, savedOk = true;
    if (s.status === 'won' && (!saved[s.seed] || s.time < saved[s.seed])) {
      newBest = true; delete saved[s.seed]; saved[s.seed] = s.time;
      try { localStorage.setItem(RECORD_KEY, JSON.stringify(Object.fromEntries(Object.entries(saved).slice(-20)))); } catch (_) { savedOk = false; }
    }
    log(t(s.status));
    overlay(`<div class="sr-result"><span class="sr-result-kicker">${s.status === 'won' ? 'DUNGEON CLEAR' : 'TRY AGAIN'}</span><h3>${t(s.status)}</h3><strong class="sr-result-time">${seconds(s.time)}</strong><dl><div><dt>${t('dodges')}</dt><dd>${s.dodges}</dd></div><div><dt>${t('remain')}</dt><dd>${s.bossHp} / ${E.BOSS_HP}</dd></div></dl><p>${!savedOk ? t('unsaved') : newBest ? t('newBest') : saved[s.seed] ? `${t('best')} · ${seconds(saved[s.seed])}` : t('tip')}</p><button type="button" class="sr-primary" data-raid="retry">${t('retry')}</button><div class="sr-result-actions"><button type="button" data-raid="new">${t('new')}</button><button type="button" data-raid="share">${t('share')}</button></div><p class="sr-note">${t('shareNote')}<br>${t('localNote')}</p><p id="sr-share-status" role="status"></p><input id="sr-link" aria-label="${t('linkLabel')}" readonly hidden></div>`);
  }
  async function share() {
    const current = session;
    const url = new URL(location.href); url.search = ''; url.searchParams.set('raid', current.seed); url.searchParams.set('raidLang', lang); url.hash = 'playground';
    const field = find('sr-link'); field.value = url.href; field.hidden = false;
    try { await navigator.clipboard.writeText(url.href); if (session === current && dialog.open) find('sr-share-status').textContent = t('copied'); }
    catch (_) { if (session === current && dialog.open) { find('sr-share-status').textContent = t('linkHelp'); field.focus(); field.select(); } }
  }
  function onClick(event) {
    const button = event.target.closest('[data-raid]'); if (!button) return;
    switch (button.dataset.raid) {
      case 'close': cleanup(); dialog.close(); break;
      case 'language': lang = lang === 'ko' ? 'en' : 'ko'; intro(); break;
      case 'start': case 'retry': start(); break;
      case 'new': start(seed()); break;
      case 'pause': pause(); break;
      case 'resume': resume(); break;
      case 'share': share(); break;
      default: act(button.dataset.raid);
    }
  }
  document.addEventListener('click', event => { if (event.target.closest('[data-action="shadow-raid"]')) open(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  window.addEventListener('pagehide', pause);
  window.addEventListener('hashchange', () => { if (dialog?.open) { cleanup(); dialog.close(); } });
  document.addEventListener('DOMContentLoaded', () => {
    const params = new URL(location.href).searchParams, code = params.get('raid');
    if (E.validSeed(code)) { lang = params.get('raidLang') === 'en' ? 'en' : 'ko'; open(code); }
  });
})();
