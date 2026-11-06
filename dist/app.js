'use strict';

const iconPaths = {
  explore:'<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
  play:'<rect x="3" y="5" width="18" height="14" rx="4"/><path d="M7 12h5m-2.5-2.5v5m6-3.5h.1m2.4 2h.1"/>',
  learn:'<path d="M12 5.5C8.5 3 4 4 3 4.5v14C6 17 9 17.5 12 20c3-2.5 6-3 9-1.5v-14c-1-.5-5.5-1.5-9 1Z"/><path d="M12 5.5V20M6 8h3m-3 4h3m6-4h3m-3 4h3"/>',
  visit:'<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  rooms:'<path d="M20.5 11c0 4.5-3.8 7.5-8.5 7.5-1.3 0-2.5-.2-3.6-.7L4 20l.9-4.4C3.7 14.4 3 12.8 3 11c0-4.3 4-7.5 9-7.5s8.5 3.2 8.5 7.5Z"/><path d="M8 11h.1m3.9 0h.1m3.9 0h.1"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>',
  search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  bookmark:'<path d="M6 3.5h12V21l-6-4-6 4V3.5Z"/>',
  spark:'<path d="m12 2 2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6L12 2Z"/>',
  globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3.5 9h17m-17 6h17"/>',
  check:'<path d="m5 12 4.5 4.5L19 7"/>',
  close:'<path d="m6 6 12 12M18 6 6 18"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M15 8V4H4v11h4"/>',
  send:'<path d="m3 3 18 9-18 9 4-9-4-9Zm4 9h14"/>',
  start:'<path d="m8 5 11 7-11 7V5Z"/>',
  coffee:'<path d="M4 8h12v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Zm12 1h2a3 3 0 0 1 0 6h-2M6 3v2m4-2v2m4-2v2"/>',
  ticket:'<path d="M3 7h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4V7Z"/><path d="M15 8v2m0 2v2m0 2v2"/>',
  leaf:'<path d="M19.5 3C9 2 3 7 5 14c1.5 5 8 6 11.5 1S20 5 19.5 3Z"/><path d="M3 21 16 8m-8 8v-5m0 5h5"/>',
  heart:'<path d="M12 20S3 14.5 3 8.7C3 3.5 9 2.5 12 7c3-4.5 9-3.5 9 1.7C21 14.5 12 20 12 20Z"/>',
  star:'<path d="m12 3 2.8 5.8 6.4.9-4.6 4.5 1.1 6.4-5.7-3-5.7 3 1.1-6.4L2.8 9.7l6.4-.9L12 3Z"/>',
  people:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m1-16a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 4v2"/>',
  book:'<path d="M5 3h14v18H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm0 14h14M7 7h8m-8 4h5"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>'
};
const kakaoIcons = {search:'icon-search.png',rooms:'icon-chat.svg',people:'icon-friends.svg',plus:'icon-plus.svg'};
const icon = (name) => kakaoIcons[name]
  ? `<img class="icon asset-icon" src="assets/kakao/${kakaoIcons[name]}" alt="" aria-hidden="true">`
  : `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.spark}</svg>`;
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

Object.assign(iconPaths, {
  settings:'<path d="m9 3-.8 2.5-2 .9L3.7 6l-1.2 2.1 1.8 1.9-.2 2.3L2.5 14l1.2 2.1 2.5-.4 1.9 1L9 19h2.5l.8-2.4 2-.9 2.4.4 1.3-2.2-1.8-1.8.1-2.3 1.7-1.8L16.7 6l-2.5.4-1.9-1L11.5 3Z"/><circle cx="10" cy="11" r="3"/>',
  back:'<path d="m15 5-7 7 7 7"/>',
  more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  palette:'<path d="M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 0-4h-1a2 2 0 0 1 0-4h5a4 4 0 0 0 4-4c0-3-4-6-9-6Z"/><path d="M7 8h.1M11 6h.1M16 7h.1M5 12h.1"/>'
});
const navItems = [
  {id:'explore',title:'발견',icon:'explore'},
  {id:'playground',title:'창작마당',icon:'play'},
  {id:'learn',title:'한국어',icon:'learn'},
  {id:'visit',title:'한국여행',icon:'visit'},
  {id:'rooms',title:'채팅',icon:'rooms'}
];
const kindLabels = {Characters:'캐릭터',Stories:'웹툰',Culture:'한국문화'};
const storageKey = 'kakao-world-concept-v1';
const initialData = {savedWorlds:[],completedLessons:[],completedQuest:false,creations:[],joinedRooms:[],messages:[],trip:[],chatTheme:'classic'};
let data = {...initialData};
try {
  const stored = JSON.parse(localStorage.getItem(storageKey) || 'null');
  if (stored && typeof stored === 'object') {
    for (const [key, value] of Object.entries(initialData)) {
      if (Array.isArray(value)) data[key] = Array.isArray(stored[key]) ? stored[key] : [];
      else if (typeof stored[key] === typeof value) data[key] = stored[key];
    }
  }
} catch (_) {}
if (!['classic','apeach'].includes(data.chatTheme)) data.chatTheme = 'classic';
let view = navItems.some(n=>n.id===location.hash.slice(1)) ? location.hash.slice(1) : 'explore';
let activeWorld = 'friends';
let activeRoom = new URL(location.href).searchParams.get('room') || 'cafe';
if (!roomData.some(r=>r.id===activeRoom)) activeRoom='cafe';
let roomOpen = view==='rooms' && new URL(location.href).searchParams.has('room');
let worldFilter='All', playFilter='All', visitFilter='all', searchQuery='';
let learning={lesson:'first',step:0,replies:[]};
let quest=null, creator=null, storyStep=0, lastFocused=null, toastTimer;
const content=document.getElementById('content');
const modal=document.getElementById('modal');
const search=document.getElementById('search');
const getWorld=id=>worlds.find(w=>w.id===id)||worlds[2];
const money=amount=>Number(amount).toLocaleString('ko-KR')+'원';
const isPhone=()=>window.matchMedia('(max-width:900px)').matches;
const matchText=text=>!searchQuery||String(text).toLowerCase().includes(searchQuery.toLowerCase());
const button=(label,action,id='',style='secondary')=>`<button type="button" class="button ${style}" data-action="${action}" ${id?`data-id="${esc(id)}"`:''}>${label}</button>`;
function persist(){try{localStorage.setItem(storageKey,JSON.stringify(data));return true;}catch(_){return false;}}
function toast(message){const node=document.getElementById('toast');node.textContent=message;node.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove('show'),2600);}
function avatar(id,size=''){
  const body=id==='friends'?'<img src="assets/kakao/friends.png" alt="">':id==='solo'?'<span>나혼렙</span>':icon('coffee');
  return `<span class="avatar avatar-world ${id} ${size}" aria-hidden="true">${body}</span>`;
}
function sectionTitle(title,count=''){return `<div class="section-title"><h2>${title}</h2>${count!==''?`<span>${count}</span>`:''}</div>`;}
function empty(text){return `<div class="empty-state"><p>${text}</p></div>`;}
function updateNavigation(){
  const nav=navItems.map(n=>`<a class="nav-link ${view===n.id?'active':''}" href="#${n.id}" data-view="${n.id}" ${view===n.id?'aria-current="page"':''}>${icon(n.icon)}<span>${n.title}</span></a>`).join('');
  document.getElementById('desktop-nav').innerHTML=nav;
  document.getElementById('mobile-nav').innerHTML=nav;
  document.getElementById('view-title').textContent=navItems.find(n=>n.id===view).title;
  document.getElementById('header-create').setAttribute('aria-label',view==='rooms'?'채팅방 찾기':'콘텐츠 만들기');
  document.body.classList.toggle('has-open-room',view==='rooms'&&roomOpen);
  search.placeholder={explore:'콘텐츠 검색',playground:'창작물 검색',learn:'학습 주제 검색',visit:'체험 검색',rooms:'채팅방 검색'}[view];
}
function setView(next,{keepSearch=false,openRoom=false}={}){
  if(!navItems.some(n=>n.id===next))return;
  closeModal();view=next;roomOpen=next==='rooms'&&openRoom;
  if(!keepSearch){searchQuery='';search.value='';}
  const url=new URL(location.href);url.hash=next;
  if(next==='rooms'&&roomOpen)url.searchParams.set('room',activeRoom);else url.searchParams.delete('room');
  history.replaceState(null,'',url);render();
}
function render(){updateNavigation();content.innerHTML={explore:renderExplore,playground:renderPlayground,learn:renderLearn,visit:renderVisit,rooms:renderRooms}[view]();}
function toggleSearch(open){
  const panel=document.getElementById('search-panel');panel.hidden=!open;
  document.getElementById('search-toggle').setAttribute('aria-expanded',String(open));
  if(open)search.focus();else{searchQuery='';search.value='';render();}
}
function worldRow(w){
  return `<button class="list-row ${activeWorld===w.id?'active':''}" type="button" data-action="world" data-id="${w.id}">${avatar(w.id)}<span class="row-copy"><strong>${w.name}</strong><p>${kindLabels[w.kind]||'콘텐츠'}</p></span><span class="row-side">${data.savedWorlds.includes(w.id)?icon('bookmark'):icon('arrow')}</span></button>`;
}
function worldCover(w){
  return `<div class="world-cover ${w.id}" aria-hidden="true">${w.id==='friends'?'<img src="assets/kakao/apeach-splash.png" alt="">':w.id==='solo'?'<div class="cover-type">나 혼자만<br>레벨업</div><span class="cover-symbol">✦</span>':'<div class="cover-type">서울 카페 모임</div>'+icon('coffee')}</div>`;
}
function contentRow(title,meta,action,id,world='cafe',glyph='play'){
  return `<button type="button" class="list-row content-row" data-action="${action}" data-id="${id}"><span class="thumbnail ${world}">${world==='friends'?'<img src="assets/kakao/friends.png" alt="">':icon(glyph)}</span><span class="row-copy"><strong>${title}</strong><p>${meta}</p></span><span class="row-side">${icon('arrow')}</span></button>`;
}
function worldDetails(w){
  return `${worldCover(w)}<div class="world-heading">${avatar(w.id)}<div><h2>${w.name}</h2><p>${kindLabels[w.kind]||'콘텐츠'}</p></div><button class="icon-button ${data.savedWorlds.includes(w.id)?'is-saved':''}" data-action="save-world" data-id="${w.id}" aria-label="${data.savedWorlds.includes(w.id)?'관심 콘텐츠 해제':'관심 콘텐츠 저장'}" aria-pressed="${data.savedWorlds.includes(w.id)}">${icon('bookmark')}</button></div>
    <div class="action-grid world-actions">${button(`${icon('play')} 미니게임`,'quest',w.id)}${button(`${icon('plus')} 만들기`,'create',w.id)}${button(`${icon('rooms')} 채팅방`,'world-room',w.id)}</div>
    ${sectionTitle('콘텐츠')}
    ${contentRow(worldQuests[w.id].title,'선택형 게임 · 약 2분','quest',w.id,w.id,'play')}
    ${contentRow('미나와 한국어','일상 대화 · 기초','go-learn','first','cafe','learn')}
    ${w.id==='solo'?'<a class="list-row content-row" href="https://tapas.io/series/solo-leveling-comic/info" target="_blank" rel="noopener noreferrer"><span class="thumbnail solo">'+icon('book')+'</span><span class="row-copy"><strong>웹툰 원작 보기</strong><p>타파스 · 영어판</p></span><span class="row-side">↗</span></a>':''}
    ${sectionTitle('오픈채팅')}${contentRow(roomData.find(r=>r.id===w.id).title,'체험 채팅 · 3명','world-room',w.id,w.id,'rooms')}`;
}
function renderExplore(){
  const filtered=worlds.filter(w=>(worldFilter==='All'||w.kind===worldFilter)&&matchText(w.name+' '+w.keywords));
  return `<div class="split-view discovery-view"><section class="list-pane"><div class="tabs" aria-label="콘텐츠 분류">${[['All','전체'],['Stories','웹툰'],['Characters','캐릭터'],['Culture','한국문화']].map(([key,label])=>`<button type="button" class="tab ${worldFilter===key?'active':''}" data-action="world-filter" data-value="${key}" aria-pressed="${worldFilter===key}">${label}</button>`).join('')}</div>
    ${sectionTitle('관심 콘텐츠',filtered.length)}${filtered.length?filtered.map(worldRow).join(''):empty('검색 결과가 없습니다.')}
    <div class="divider"></div>${sectionTitle('바로가기')}<div class="shortcut-grid">${[['playground','play','창작마당'],['learn','learn','한국어'],['visit','visit','한국여행'],['rooms','rooms','채팅']].map(([id,glyph,title])=>`<button type="button" data-view="${id}">${icon(glyph)}<span>${title}</span></button>`).join('')}</div>
    <div class="divider"></div>${sectionTitle('이어하기')}${contentRow('미나와 한국어','처음 만난 사람에게 인사하기','go-learn','first','cafe','learn')}${contentRow('성수 카페 퀘스트','선택형 게임 · 약 2분','quest','cafe','cafe','coffee')}
    <div class="mobile-feature"><div class="divider"></div>${sectionTitle('카카오프렌즈')}<button type="button" data-action="world" data-id="friends"><img src="assets/kakao/apeach-splash.png" alt="카카오프렌즈 콘텐츠 보기"></button></div></section>
    <section class="detail-pane">${worldDetails(getWorld(activeWorld))}</section></div>`;
}
function allGames(){
  return [{id:'friends-picnic',world:'friends',format:'game',title:worldQuests.friends.title,subtitle:'피크닉 장소와 준비물을 골라보세요.',meta:'2분 · 혼자 플레이'},
    {id:'solo-quest',world:'solo',format:'game',title:worldQuests.solo.title,subtitle:'진입로와 전투 방식을 선택하세요.',meta:'2분 · 혼자 플레이'},...sampleGames];
}
function gameCard(g,own=false){
  const world=getWorld(g.world),format=formats[g.format]||formats.game;
  return `<article class="content-card"><button type="button" class="card-art ${g.world} ${g.format}" data-action="${own?'open-creation':'sample-game'}" data-id="${esc(g.id)}" aria-label="${esc(g.title)} 열기">${g.world==='friends'?'<img src="assets/kakao/friends.png" alt="">':g.format==='chat'?'<img src="assets/kakao/profile-1.png" alt="">':icon(format.icon)}<span>${format.label}</span></button><div class="card-body"><h3>${esc(g.title)}</h3><p>${esc(world.name)}</p><div class="card-meta"><span>${own?'내 창작물':esc(g.meta)}</span>${button(own?'열기':'시작',''+(own?'open-creation':'sample-game'),g.id)}</div></div></article>`;
}
function renderPlayground(){
  const filtered=allGames().filter(g=>(playFilter==='All'||g.format===playFilter)&&matchText(g.title+' '+getWorld(g.world).name));
  const own=data.creations.filter(g=>(playFilter==='All'||g.format===playFilter)&&matchText(g.title));
  return `<div class="view-scroll"><div class="toolbar"><div class="tabs" aria-label="창작물 종류">${[['All','전체'],['game','게임'],['chat','캐릭터 대화'],['story','스토리']].map(([id,title])=>`<button type="button" class="tab ${playFilter===id?'active':''}" data-action="play-filter" data-value="${id}" aria-pressed="${playFilter===id}">${title}</button>`).join('')}</div>${button(`${icon('plus')} 만들기`,'create','','primary')}</div>
    ${own.length?sectionTitle('내 창작물',own.length)+`<div class="content-grid catalog-grid">${own.map(g=>gameCard(g,true)).join('')}</div>`:''}
    ${sectionTitle('플레이할 콘텐츠',filtered.length)}<div class="content-grid catalog-grid">${filtered.map(g=>gameCard(g)).join('')}</div>${!filtered.length?empty('검색 결과가 없습니다.'):''}</div>`;
}
function learningMessages(){
  const lesson=lessons[learning.lesson];let html='<div class="system-line"><span>대화 연습</span></div>';
  for(let i=0;i<=learning.step&&i<lesson.steps.length;i++){
    const step=lesson.steps[i];
    html+=`<div class="chat-line"><img class="avatar" src="assets/kakao/profile-1.png" alt=""><div class="message-content"><span class="message-name">미나</span><div class="bubble">${step.text}</div></div></div>`;
    if(learning.replies[i]){
      const reply=learning.replies[i];
      html+=`<div class="chat-line me"><div class="message-content"><div class="bubble">${esc(reply.text)}</div></div></div><div class="learning-feedback ${reply.good?'correct':'gentle'}"><strong>${reply.good?'자연스러운 표현이에요.':'이렇게 말해보세요.'}</strong><p>${step.explanation}</p></div>`;
    }
  }
  return html;
}
function lessonControls(){
  const lesson=lessons[learning.lesson];
  if(learning.step>=lesson.steps.length)return `<div class="lesson-done"><img src="assets/kakao/friends.png" alt=""><h3>연습 완료</h3><div class="button-row">${button('다시 연습','restart-lesson')}${button('채팅방으로','go-rooms','','primary')}</div></div>`;
  const step=lesson.steps[learning.step];
  return `<div class="reply-prompt">${step.prompt}</div><div class="quick-replies">${step.choices.map((text,i)=>`<button type="button" data-action="lesson-answer" data-index="${i}">${text}</button>`).join('')}</div><form id="practice-form" class="compose-row"><label class="sr-only" for="practice-input">한국어 답장</label><input id="practice-input" name="reply" autocomplete="off" maxlength="180" placeholder="직접 입력하기"><button type="submit" class="button primary">전송</button></form>`;
}
function renderLearn(){
  const lesson=lessons[learning.lesson];
  return `<div class="split-view chat-view learning-view"><aside class="list-pane">${sectionTitle('대화 연습','기초')}<div class="lesson-tabs">${Object.entries(lessons).filter(([id,l])=>matchText(l.name+' '+l.context)).map(([id,l],i)=>`<button class="list-row ${learning.lesson===id?'active':''}" type="button" data-action="select-lesson" data-id="${id}" aria-pressed="${learning.lesson===id}"><span class="lesson-number">${data.completedLessons.includes(id)?icon('check'):String(i+1).padStart(2,'0')}</span><span class="row-copy"><strong>${l.name}</strong><p>${l.short}</p></span></button>`).join('')}</div><div class="phrase-note">${sectionTitle('오늘의 표현')}<strong>ㄱㄱ</strong><p>친한 사이에서 쓰는 “가자”의 줄임말</p><div class="divider"></div><strong>좋아요. 같이 가요.</strong><p>처음 만난 사람에게 쓰는 정중한 표현</p></div></aside>
    <section class="conversation ${data.chatTheme==='apeach'?'theme-apeach':''}" aria-label="한국어 대화 연습"><div class="conversation-header"><img class="avatar" src="assets/kakao/profile-1.png" alt="미나"><div><h2>미나 <span class="tiny-badge">연습</span></h2><p>${lesson.name} · ${Math.min(learning.step+1,3)}/3</p></div><button class="icon-button" data-action="toggle-theme" aria-label="채팅 테마 바꾸기">${icon('palette')}</button></div><div class="chat-notice">${lesson.context}</div><div class="messages" id="lesson-messages" aria-live="polite">${learningMessages()}</div><div class="composer">${lessonControls()}</div></section></div>`;
}
function answerLesson(text,good){
  const lesson=lessons[learning.lesson];if(learning.step>=lesson.steps.length)return;
  const step=lesson.steps[learning.step];
  learning.replies[learning.step]={text,good:typeof good==='boolean'?good:step.keywords.some(k=>text.includes(k))};learning.step++;
  if(learning.step>=lesson.steps.length&&!data.completedLessons.includes(learning.lesson)){data.completedLessons.push(learning.lesson);persist();}
  render();requestAnimationFrame(()=>{const box=document.getElementById('lesson-messages');if(box)box.scrollTop=box.scrollHeight;});
}
function renderVisit(){
  const filtered=experiences.filter(e=>matchText(e.name+' '+e.location)&&(visitFilter!=='saved'||data.trip.some(t=>t.experience===e.id)));
  return `<div class="view-scroll"><div class="toolbar"><div class="tabs visit-filters"><button class="tab ${visitFilter==='all'?'active':''}" data-action="visit-filter" data-value="all">전체</button><button class="tab ${visitFilter==='saved'?'active':''}" data-action="visit-filter" data-value="saved">담은 체험</button></div>${button('내 일정','passport')}</div>${sectionTitle('서울 체험',filtered.length)}<div class="content-grid">${filtered.map(e=>`<article class="content-card travel-card"><div class="card-art ${e.art}">${icon(e.id==='cafe-walk'?'coffee':'book')}<span>${e.location}</span></div><div class="card-body"><h3>${e.name}</h3><p>${e.duration}</p><div class="price-line"><strong>${money(e.price)}</strong><span>1인 · 예시 가격</span></div>${button('일정 담기','experience',e.id,'primary')}</div></article>`).join('')}</div>${!filtered.length?empty(visitFilter==='saved'?'담은 체험이 없습니다.':'검색 결과가 없습니다.'):''}<div class="divider"></div>${sectionTitle('여행 한국어')}${contentRow('카페에서 주문하기','아이스 아메리카노 한 잔 주세요.','coffee-lesson','coffee','cafe','learn')}</div>`;
}
function roomRow(r){
  const last=r.messages[r.messages.length-1];
  return `<button type="button" class="list-row ${activeRoom===r.id?'active':''}" data-action="select-room" data-id="${r.id}">${avatar(r.id)}<span class="row-copy"><strong>${r.title} <em>3</em></strong><p>${last.text}</p></span><span class="row-side"><small>체험</small></span></button>`;
}
function roomMessages(){
  const room=roomData.find(r=>r.id===activeRoom);
  const messages=room.messages.map((m,i)=>`<div class="chat-line"><img class="avatar" src="assets/kakao/profile-${i%3+1}.png" alt=""><div class="message-content"><span class="message-name">${m.name}</span><div class="bubble">${m.text}</div></div><time class="message-time">오후 2:${String(30+i).padStart(2,'0')}</time></div>`).join('');
  const own=data.messages.filter(m=>m.room===activeRoom).map(m=>`<div class="chat-line me"><time class="message-time">${new Date(m.at||Date.now()).toLocaleTimeString('ko-KR',{hour:'numeric',minute:'2-digit'})}</time><div class="message-content"><div class="bubble">${esc(m.text)}</div></div></div>`).join('');
  return `<div class="system-line"><span>체험 대화</span></div>${messages}${own}`;
}
function renderRooms(){
  const room=roomData.find(r=>r.id===activeRoom),joined=data.joinedRooms.includes(activeRoom),filtered=roomData.filter(r=>matchText(r.title+' '+r.description));
  return `<div class="split-view chat-view room-view ${roomOpen?'room-open':''}"><aside class="list-pane">${sectionTitle('오픈채팅',filtered.length)}${filtered.map(roomRow).join('')}${!filtered.length?empty('채팅방을 찾을 수 없습니다.'):''}</aside><section class="conversation ${data.chatTheme==='apeach'?'theme-apeach':''}" aria-label="${room.title}"><div class="conversation-header"><button class="icon-button back-button" data-action="room-back" aria-label="채팅 목록">${icon('back')}</button>${avatar(room.id)}<div><h2>${room.title}</h2><p>3명 · 체험 채팅</p></div><div class="conversation-actions"><button class="icon-button" data-action="toggle-theme" aria-label="채팅 테마 바꾸기">${icon('palette')}</button><button class="icon-button" data-action="handoff" aria-label="채팅방 초대">${icon('plus')}</button></div></div><button type="button" class="chat-notice pinned-content" data-action="quest" data-id="${room.id}">${icon('play')}<span>${worldQuests[room.id].title}</span>${icon('arrow')}</button><div class="messages" id="room-messages" aria-live="polite">${roomMessages()}</div><div class="composer">${joined?`<form id="room-message-form" class="compose-row"><label class="sr-only" for="room-message">메시지</label><input id="room-message" name="message" autocomplete="off" maxlength="500" placeholder="메시지 입력"><button class="button primary" type="submit">전송</button></form>`:button('참여하기','join-room','','primary full')}</div></section></div>`;
}
function openModal(title,body){
  if(!modal.open)lastFocused=document.activeElement;
  modal.innerHTML=`<div class="modal-header"><h2 id="modal-title">${title}</h2><button class="icon-button modal-close" type="button" data-action="close-modal" aria-label="닫기">${icon('close')}</button></div><div class="modal-body">${body}</div>`;
  modal.setAttribute('aria-labelledby','modal-title');if(!modal.open)modal.showModal();modal.scrollTop=0;
}
function closeModal(){if(modal.open){modal.close();if(lastFocused&&document.contains(lastFocused))lastFocused.focus({preventScroll:true});}}
function openWorld(id){activeWorld=id;if(isPhone())openModal(getWorld(id).name,worldDetails(getWorld(id)));else render();}
function startQuest(id='cafe'){const valid=worldQuests[id]?id:'cafe';quest={world:valid,step:0,answers:[]};renderQuest();}
function renderQuest(){
  const config=worldQuests[quest.world];
  if(quest.step>=config.steps.length){data.completedQuest=true;persist();openModal(config.title,`<div class="quest-result"><img class="result-character" src="assets/kakao/${quest.world==='friends'?'friends':'more'}.png" alt=""><span class="result-label">플레이 완료</span><h3>${config.resultNames[quest.answers[0]]}</h3><div class="button-row">${button('다시 하기','quest',quest.world)}${button('채팅방으로','world-room',quest.world,'primary')}</div></div>`);return;}
  const step=config.steps[quest.step];
  openModal(config.title,`<div class="progress-dots" aria-label="${quest.step+1}/3">${[0,1,2].map(i=>`<span class="${i<=quest.step?'done':''}"></span>`).join('')}</div><div class="quest-copy"><span class="step-label">${quest.step+1}/3</span><h3>${step.title}</h3><p>${step.text}</p></div><div class="choice-list">${step.choices.map(([title,desc],i)=>`<button type="button" class="choice-row" data-action="quest-choice" data-index="${i}"><span class="choice-number">${i+1}</span><span><strong>${title}</strong><p>${desc}</p></span>${icon('arrow')}</button>`).join('')}</div>`);
}
function startStory(){storyStep=0;renderStory();}
function renderStory(){
  const scenes=[{title:'테이블 위의 편지',text:'단골 카페에서 낯선 편지를 발견했습니다. “오늘 3시, 창가 자리에서 만나요.”',choices:['편지를 열어본다','바리스타에게 물어본다']},{title:'편지를 쓴 사람',text:'편지 안에는 작은 카페 지도가 들어 있었습니다. 뒷면에는 “같이 가요?”라는 한마디가 적혀 있습니다.',choices:['약속 장소로 간다','함께 갈 친구를 부른다']}];
  if(storyStep>=scenes.length){openModal('카페에서 만난 편지',`<div class="quest-result"><img class="result-character" src="assets/kakao/chats.png" alt=""><h3>새로운 약속이 생겼어요.</h3><p>다음 이야기는 카페 모임에서 이어집니다.</p>${button('채팅방으로','go-rooms','','primary')}</div>`);return;}
  const s=scenes[storyStep];openModal('카페에서 만난 편지',`<div class="quest-copy"><span class="step-label">${storyStep+1}/2</span><h3>${s.title}</h3><p>${s.text}</p></div><div class="choice-list">${s.choices.map((x,i)=>`<button class="choice-row" data-action="story-choice"><span class="choice-number">${i+1}</span><strong>${x}</strong>${icon('arrow')}</button>`).join('')}</div>`);
}
function openCreator(world='cafe'){
  creator={world:worlds.some(w=>w.id===world)?world:'cafe',format:'game',prompt:'',title:'',preview:false,selected:null};renderCreator();
}
function rememberCreator(){const p=document.getElementById('creator-prompt'),w=document.getElementById('creator-world');if(p)creator.prompt=p.value.slice(0,600);if(w)creator.world=w.value;}
function renderCreator(){
  if(!creator.preview){
    openModal('콘텐츠 만들기',`<label class="field-label" for="creator-world">콘텐츠</label><select class="field-select" id="creator-world">${worlds.map(w=>`<option value="${w.id}" ${creator.world===w.id?'selected':''}>${w.name}</option>`).join('')}</select><span class="field-label">형식</span><div class="format-grid">${Object.entries(formats).map(([id,f])=>`<button type="button" class="format-option ${creator.format===id?'selected':''}" data-action="creator-format" data-id="${id}" aria-pressed="${creator.format===id}">${icon(f.icon)}<strong>${f.label}</strong></button>`).join('')}</div><label class="field-label" for="creator-prompt">어떤 내용을 만들까요?</label><textarea class="field-textarea" id="creator-prompt" rows="4" maxlength="600" placeholder="예: 친구들과 피크닉 장소를 고르는 게임">${esc(creator.prompt)}</textarea><div class="modal-footer"><span class="small-note">템플릿 미리보기</span>${button('미리보기','build-template','','primary')}</div>`);
  }else{
    const format=formats[creator.format];const first=creator.format==='chat'?'안녕하세요. 오늘은 어떤 이야기를 해볼까요?':creator.format==='story'?'테이블 위에 편지 한 통이 놓여 있습니다.':'오후에 함께 갈 장소를 골라주세요.';
    openModal('창작물 미리보기',`<label class="field-label" for="creation-title">제목</label><input class="field-input" id="creation-title" maxlength="70" value="${esc(creator.title)}"><div class="preview-box"><span class="tiny-badge">${getWorld(creator.world).name} · ${format.label}</span><p class="creator-request">${esc(creator.prompt)}</p><div class="preview-scene"><p>${first}</p><div class="choice-list">${(creator.format==='chat'?['한국어를 연습하고 싶어요.','카페를 추천해 주세요.']:creator.format==='story'?['편지를 열어본다','친구에게 보여준다']:['한적한 공원','동네 카페']).map((x,i)=>`<button class="choice-row" data-action="preview-choice" data-index="${i}"><strong>${x}</strong>${icon('arrow')}</button>`).join('')}</div><p id="creation-preview-feedback" class="preview-feedback" aria-live="polite"></p></div></div><div class="modal-footer"><span class="small-note">이 기기에 저장됩니다.</span>${button('저장','save-creation','','primary')}</div>`);
  }
}
function openCreation(id){
  const c=data.creations.find(x=>x.id===id);if(!c)return;
  openModal(esc(c.title),`<div class="preview-box"><span class="tiny-badge">${esc(getWorld(c.world).name)} · ${(formats[c.format]||formats.game).label}</span><p>${esc(c.prompt)}</p></div><div class="button-row">${button('삭제','remove-creation',id,'danger')}${button('실행','run-creation',id,'primary')}</div>`);
}
function today(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function defaultDate(){const d=new Date();d.setDate(d.getDate()+7);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function openExperience(id){
  const e=experiences.find(x=>x.id===id);if(!e)return;
  openModal(e.name,`<p class="detail-description">${e.description}</p><form id="trip-form" data-id="${id}"><label class="field-label" for="trip-date">날짜</label><input class="field-input" type="date" id="trip-date" name="date" required min="${today()}" value="${defaultDate()}"><label class="field-label" for="trip-people">인원</label><select class="field-select" id="trip-people" data-price="${e.price}">${[1,2,3,4,5].map(n=>`<option value="${n}">${n}명</option>`).join('')}</select><div class="booking-summary"><span>예상 금액</span><strong id="trip-total">${money(e.price)}</strong></div><p class="small-note">체험 일정입니다. 실제 예약은 진행되지 않습니다.</p><button class="button primary full" type="submit">내 일정에 담기</button></form>`);
}
function openPassport(){
  openModal('내 활동',`<div class="profile-summary"><img class="avatar" src="assets/kakao/apeach-profile.png" alt=""><div><h3>내 프로필</h3><p>저장한 콘텐츠와 일정</p></div></div><div class="stat-grid"><div class="stat"><strong>${data.savedWorlds.length}</strong><span>관심 콘텐츠</span></div><div class="stat"><strong>${data.completedLessons.length}</strong><span>완료한 학습</span></div><div class="stat"><strong>${data.creations.length}</strong><span>내 창작물</span></div></div>${sectionTitle('관심 콘텐츠')}<div class="saved-list">${data.savedWorlds.length?data.savedWorlds.filter(id=>worlds.some(w=>w.id===id)).map(id=>`<div class="saved-row">${avatar(id)}<strong>${getWorld(id).name}</strong>${button('열기','saved-world',id)}</div>`).join(''):empty('저장한 콘텐츠가 없습니다.')}</div>${sectionTitle('내 일정')}<div class="saved-list">${data.trip.length?data.trip.map(t=>{const e=experiences.find(x=>x.id===t.experience);return e?`<div class="saved-row"><div><strong>${e.name}</strong><p>${esc(t.date)} · ${t.people}명 · ${money(t.people*e.price)}</p><small>담은 일정</small></div><button class="icon-button" data-action="remove-trip" data-id="${esc(t.id)}" aria-label="${e.name} 일정 삭제">${icon('close')}</button></div>`:'';}).join(''):empty('담은 일정이 없습니다.')}</div>`);
}
function invitationUrl(){const url=new URL(location.href);url.search='';url.searchParams.set('room',activeRoom);url.hash='rooms';return url.href;}
function openHandoff(){
  const room=roomData.find(r=>r.id===activeRoom);
  openModal('채팅방 초대',`<div class="share-preview"><img src="assets/kakao/talk-share.svg" alt="카카오톡"><div><h3>${room.title}</h3><p>${worldQuests[activeRoom].title}</p><span class="tiny-badge">체험 채팅방</span></div></div><label class="field-label" for="copy-url">초대 링크</label><input class="field-input" id="copy-url" value="${esc(invitationUrl())}" readonly>${button(`${icon('copy')} 링크 복사`,'share-room','','primary full')}`);
}
async function copyInvitation(){
  try{await navigator.clipboard.writeText(invitationUrl());toast('초대 링크를 복사했습니다.');}catch(_){if(!document.getElementById('copy-url'))openHandoff();const input=document.getElementById('copy-url');input.focus();input.select();toast('링크를 선택했습니다. 복사해 주세요.');}
}
function openRoomPicker(){openModal('채팅방 찾기',roomData.map(r=>contentRow(r.title,'체험 채팅 · 3명','world-room',r.id,r.id,'rooms')).join(''));}
function openSettings(){openModal('설정',`<div class="setting-row"><span>화면 언어</span><strong>한국어</strong></div><div class="setting-row"><span>채팅 테마</span>${button(data.chatTheme==='classic'?'기본':'어피치','settings-theme')}</div><button class="setting-row setting-link" data-action="passport"><span>내 활동</span>${icon('arrow')}</button><details class="preview-info"><summary>미리보기 안내</summary><p>대화와 창작물은 이 기기에 저장됩니다. 한국어 대화와 창작물 제작은 준비된 예시로 동작하며, 실제 메시지 전송·예약은 연결되어 있지 않습니다.</p></details>`);}

document.addEventListener('click',async event=>{
  const nav=event.target.closest('[data-view]');if(nav){event.preventDefault();setView(nav.dataset.view);return;}
  const el=event.target.closest('[data-action]');if(!el)return;
  const {action,id,value,index}=el.dataset;
  switch(action){
    case 'toggle-search':toggleSearch(document.getElementById('search-panel').hidden);break;
    case 'close-search':toggleSearch(false);break;
    case 'settings':openSettings();break;
    case 'settings-theme':data.chatTheme=data.chatTheme==='classic'?'apeach':'classic';persist();render();openSettings();break;
    case 'toggle-theme':data.chatTheme=data.chatTheme==='classic'?'apeach':'classic';persist();render();toast(data.chatTheme==='classic'?'기본 테마':'어피치 테마');break;
    case 'header-create':view==='rooms'?openRoomPicker():openCreator(activeWorld);break;
    case 'close-modal':closeModal();break;
    case 'world':openWorld(id);break;
    case 'saved-world':activeWorld=id;setView('explore');if(isPhone())openModal(getWorld(id).name,worldDetails(getWorld(id)));break;
    case 'save-world':{const at=data.savedWorlds.indexOf(id);if(at>=0)data.savedWorlds.splice(at,1);else data.savedWorlds.push(id);persist();if(modal.open)openModal(getWorld(id).name,worldDetails(getWorld(id)));else render();toast(at>=0?'관심 콘텐츠에서 해제했습니다.':'관심 콘텐츠에 저장했습니다.');break;}
    case 'world-filter':worldFilter=value;render();break;
    case 'play-filter':playFilter=value;render();break;
    case 'visit-filter':visitFilter=value;render();break;
    case 'go-learn':learning={lesson:'first',step:0,replies:[]};setView('learn');break;
    case 'coffee-lesson':learning={lesson:'coffee',step:0,replies:[]};setView('learn');break;
    case 'go-rooms':activeRoom='cafe';setView('rooms',{openRoom:true});break;
    case 'world-room':activeRoom=roomData.some(r=>r.id===id)?id:'cafe';setView('rooms',{openRoom:true});break;
    case 'select-room':activeRoom=id;setView('rooms',{openRoom:true});break;
    case 'room-back':setView('rooms');break;
    case 'join-room':if(!data.joinedRooms.includes(activeRoom))data.joinedRooms.push(activeRoom);persist();render();document.getElementById('room-message')?.focus({preventScroll:true});break;
    case 'select-lesson':if(lessons[id]){learning={lesson:id,step:0,replies:[]};render();}break;
    case 'restart-lesson':learning={lesson:learning.lesson,step:0,replies:[]};render();break;
    case 'lesson-answer':{const step=lessons[learning.lesson].steps[learning.step];if(step)answerLesson(step.choices[Number(index)],Number(index)===step.correct);break;}
    case 'quest':startQuest(id||'cafe');break;
    case 'quest-choice':if(quest&&quest.step<3){quest.answers.push(Number(index));quest.step++;renderQuest();}break;
    case 'story-choice':storyStep++;renderStory();break;
    case 'sample-game':{const g=allGames().find(x=>x.id===id);if(!g)break;if(g.format==='chat'){learning={lesson:'first',step:0,replies:[]};setView('learn');}else if(g.format==='story')startStory();else startQuest(g.world);break;}
    case 'create':openCreator(id||activeWorld);break;
    case 'creator-format':rememberCreator();creator.format=id;renderCreator();break;
    case 'build-template':rememberCreator();if(!creator.prompt.trim()){document.getElementById('creator-prompt').focus();toast('만들 내용을 입력해 주세요.');break;}creator.preview=true;creator.title=`${getWorld(creator.world).short} ${formats[creator.format].label}`;renderCreator();break;
    case 'preview-choice':creator.selected=Number(index);document.getElementById('creation-preview-feedback').textContent=creator.format==='chat'?(index==='0'?'좋아요. “오늘 카페 같이 갈까요?”에 답해볼까요?':'오늘은 가까운 카페에서 만나볼까요?'):index==='0'?'새로운 장면이 열렸습니다. 다음 선택을 이어서 만들 수 있어요.':'친구와 함께하는 장면을 선택했습니다.';break;
    case 'save-creation':{const title=document.getElementById('creation-title').value.trim().slice(0,70);if(!title){toast('제목을 입력해 주세요.');break;}data.creations.unshift({id:'c'+Date.now().toString(36),title,world:creator.world,format:creator.format,prompt:creator.prompt});persist();playFilter='All';setView('playground');toast('내 창작물에 저장했습니다.');break;}
    case 'open-creation':openCreation(id);break;
    case 'run-creation':{const c=data.creations.find(x=>x.id===id);if(!c)break;if(c.format==='chat'){learning={lesson:'first',step:0,replies:[]};setView('learn');}else if(c.format==='story')startStory();else startQuest(c.world);break;}
    case 'remove-creation':data.creations=data.creations.filter(c=>c.id!==id);persist();setView('playground');toast('삭제했습니다.');break;
    case 'experience':openExperience(id);break;
    case 'passport':openPassport();break;
    case 'remove-trip':data.trip=data.trip.filter(t=>t.id!==id);persist();render();openPassport();break;
    case 'handoff':openHandoff();break;
    case 'share-room':await copyInvitation();break;
  }
});
document.addEventListener('submit',event=>{
  if(event.target.id==='practice-form'){event.preventDefault();const input=document.getElementById('practice-input');const text=input.value.trim();if(text)answerLesson(text.slice(0,180));return;}
  if(event.target.id==='room-message-form'){event.preventDefault();const input=document.getElementById('room-message');const text=input.value.trim();if(!text)return;data.messages.push({room:activeRoom,text:text.slice(0,500),at:Date.now()});persist();input.value='';const messages=document.getElementById('room-messages');messages.innerHTML=roomMessages();messages.scrollTop=messages.scrollHeight;input.focus();return;}
  if(event.target.id==='trip-form'){
    event.preventDefault();const date=document.getElementById('trip-date').value,people=Number(document.getElementById('trip-people').value),exp=experiences.find(e=>e.id===event.target.dataset.id);
    if(!exp||!date||date<today()||!Number.isInteger(people)||people<1||people>5){toast('날짜와 인원을 확인해 주세요.');return;}
    if(!data.trip.some(t=>t.experience===exp.id&&t.date===date&&t.people===people)){data.trip.push({id:'t'+Date.now().toString(36),experience:exp.id,date,people});persist();}
    openModal('일정에 담았습니다',`<div class="saved-confirm">${icon('check')}<h3>${exp.name}</h3><p>${esc(date)} · ${people}명</p><strong>${money(people*exp.price)}</strong></div><div class="button-row">${button('닫기','close-modal')}${button('내 일정 보기','passport','','primary')}</div>`);
  }
});
document.addEventListener('change',event=>{
  if(event.target.id==='trip-people')document.getElementById('trip-total').textContent=money(Number(event.target.dataset.price)*Number(event.target.value));
  if(event.target.id==='creator-world'&&creator)creator.world=event.target.value;
});
search.addEventListener('input',event=>{searchQuery=event.target.value.trim();render();});
document.addEventListener('keydown',event=>{if(event.key==='/'&&!modal.open&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){event.preventDefault();toggleSearch(true);}if(event.key==='Escape'&&!modal.open)toggleSearch(false);});
modal.addEventListener('click',event=>{if(event.target===modal){const r=modal.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeModal();}});
window.addEventListener('hashchange',()=>{const next=location.hash.slice(1);if(navItems.some(n=>n.id===next)){view=next;roomOpen=next==='rooms'&&new URL(location.href).searchParams.has('room');const room=new URL(location.href).searchParams.get('room');if(roomData.some(r=>r.id===room))activeRoom=room;closeModal();render();}});
document.getElementById('search-toggle').innerHTML=icon('search');
document.getElementById('header-create').innerHTML=icon('plus');
document.getElementById('settings-button').innerHTML=icon('settings');
render();
