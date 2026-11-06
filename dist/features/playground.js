'use strict';

let playgroundTab='discover';
let playgroundCategory='all';
const playgroundArtists=[
 {title:'IVE',subtitle:'포토 퀴즈',file:'ive-secret.jpg',kind:'ive',keywords:'아이브'},
 {title:'MONSTA X',subtitle:'팬 퀴즈',file:'monsta-x.jpg',kind:'monsta',keywords:'몬스타엑스'},
 {title:'IU',subtitle:'나의 플레이리스트',file:'iu.jpg',kind:'iu',keywords:'아이유'},
 {title:'KiiiKiii',subtitle:'포토 퀴즈',file:'rookies.jpg',kind:'kiiikiii',keywords:'키키'},
 {title:'WOODZ',subtitle:'최애 무대 고르기',file:'label-artists.jpg',kind:'woodz',keywords:'우즈'},
 {title:'Dragon Pony',subtitle:'밴드 취향 찾기',file:'label-artists.jpg',kind:'dragon',keywords:'드래곤포니'}
];
const playgroundStories=[
 ['56566288','이번 생은 가주가 되겠습니다','나의 가문 찾기'],
 ['61614855','철혈검가 사냥개의 회귀','캐릭터 퀴즈'],
 ['56714856','계모인데, 딸이 너무 귀여워','최애 캐릭터 고르기'],
 ['64007563','천재 궁수의 스트리밍','명장면 퀴즈'],
 ['59883324','만 년 만에 귀환한 플레이어','나의 플레이어 타입'],
 ['49793269','닥터 최태수','캐릭터 퀴즈'],
 ['60493041','이 결혼은 어차피 망하게 되어 있다','스토리 퀴즈'],
 ['66974798','남주가 제 건강에 집착합니다','최애 캐릭터 고르기'],
 ['57868498','변경백 서자는 황제였다','나의 캐릭터 찾기'],
 ['50353143','두 번 사는 랭커','랭커 유형 테스트']
].map(([id,title,subtitle])=>({id,title,subtitle,file:`page-${id}.jpg`,kind:'page'}));
// Fictional creator catalogue for the hackathon preview. Images retain their original IP attribution.
const artistFanGames=[
 ['스테이지 순간 포착','포토 퀴즈','별빛다이브'],
 ['몬스타 비트 챌린지','리듬 게임','비트메이커'],
 ['멜로디 조각 맞추기','음악 퍼즐','보랏빛공방'],
 ['키키 메모리 팝','카드 짝 맞추기','키키친구'],
 ['무대 위 숨은 장면','사진 찾기','숲속스튜디오'],
 ['밴드의 첫 앙코르','리듬 게임','포니아케이드']
];
const storyFanGames=[
 ['나의 가문을 세워라','선택형 게임','가문연구소'],
 ['회귀자의 검술 시험','서바이벌','리턴메이커'],
 ['공주님의 코디룸','코디 게임','복숭아공방'],
 ['궁수의 마지막 한 발','타이밍 게임','활잡이'],
 ['귀환자의 던전','던전 게임','던전작업실'],
 ['응급실 골든타임','시뮬레이션','밤샘개발자'],
 ['운명을 바꾸는 선택','스토리 게임','문장수집가'],
 ['두근두근 회복 퀘스트','선택형 게임','하트메이커'],
 ['왕좌까지 열 걸음','전략 게임','작은왕국'],
 ['탑의 두 번째 도전자','도전 게임','탑쌓는고양이']
];
[playgroundArtists,playgroundStories].forEach((items,group)=>items.forEach((item,i)=>{
 const [title,genre,creator]=(group?storyFanGames:artistFanGames)[i];
 item.ipTitle=item.title;item.title=title;item.genre=genre;item.creator=creator;item.subtitle=`by ${creator}`;
}));
function playgroundMatches(item){return matchText(`${item.title} ${item.ipTitle} ${item.keywords||''} ${item.genre} ${item.creator}`);}
function playgroundPreview(item){
 return `<article class="pg-preview"><div class="pg-photo ${item.kind}"><img src="assets/official/playground/${item.file}" alt="${esc(item.ipTitle)} 공식 ${item.kind==='page'?'작품 표지':'사진'}" loading="lazy"></div><h3>${esc(item.title)}</h3><p>${esc(item.subtitle)}</p></article>`;
}
function playgroundOwnCard(item){
 return `<button class="pg-own-card" data-action="open-creation" data-id="${esc(item.id)}"><strong>${esc(item.title)}</strong><span>${esc((formats[item.format]||formats.game).short)}</span></button>`;
}
function renderPlayground(){
 const isOwn=playgroundTab==='mine';
 const artists=playgroundArtists.filter(playgroundMatches);
 const stories=playgroundStories.filter(playgroundMatches);
 const own=data.creations.filter(item=>matchText(item.title));
 const showArtists=playgroundCategory!=='page'&&artists.length;
 const showStories=playgroundCategory!=='artist'&&stories.length;
 return `<div class="pg-page">
  <nav class="pg-tabs" aria-label="창작마당 메뉴"><button data-action="pg-tab" data-id="discover" class="${isOwn?'':'selected'}" aria-pressed="${!isOwn}">둘러보기</button><button data-action="pg-tab" data-id="mine" class="${isOwn?'selected':''}" aria-pressed="${isOwn}">내 창작물${data.creations.length?` <span>${data.creations.length}</span>`:''}</button><button class="pg-create" data-action="create">만들기</button></nav>
  ${isOwn?'':`<nav class="pg-filters" aria-label="콘텐츠 분류">${[['all','전체'],['artist','아티스트'],['page','카카오페이지']].map(([id,title])=>`<button data-action="pg-category" data-id="${id}" class="${playgroundCategory===id?'selected':''}" aria-pressed="${playgroundCategory===id}">${title}</button>`).join('')}<span>미리보기</span></nav>`}
  <div class="pg-scroll">
  ${isOwn?`<div class="pg-own-list">${own.map(playgroundOwnCard).join('')}</div>${!own.length?`<p class="pg-empty">${searchQuery?'검색 결과가 없습니다.':'아직 만든 콘텐츠가 없습니다.'}</p>`:''}`:`
   ${showArtists?`<section class="pg-section"><h2>아티스트 팬게임</h2><div class="pg-artists ${playgroundCategory==='all'&&!searchQuery?'pg-strip':''}">${artists.map(playgroundPreview).join('')}</div></section>`:''}
   ${showStories?`<section class="pg-section"><h2>웹툰·웹소설 팬게임</h2><div class="pg-covers">${stories.map(playgroundPreview).join('')}</div></section>`:''}
   ${!showArtists&&!showStories?'<p class="pg-empty">검색 결과가 없습니다.</p>':''}
   ${playgroundCategory==='all'&&!searchQuery?`<section class="pg-section"><h2>지금 플레이</h2><div class="pg-live-grid"><button class="pg-preview" data-action="sample-game" data-id="solo-quest"><span class="pg-photo solo"><img src="assets/official/solo-leveling.jpg" alt="나 혼자만 레벨업 성진우 공식 이미지" loading="lazy"></span><strong>그림자 던전</strong><span class="pg-caption">나 혼자만 레벨업 · 미니게임</span></button><button class="pg-preview" data-action="squid-room"><span class="pg-photo squid"><img src="assets/official/squid-game.jpg" alt="오징어 게임 공식 이미지" loading="lazy"></span><strong>무궁화 생존방</strong><span class="pg-caption">오픈채팅 · 20명</span></button></div></section>`:''}`}
  </div>
 </div>`;
}
document.addEventListener('click',event=>{
 const el=event.target.closest('[data-action="pg-tab"],[data-action="pg-category"]');if(!el)return;
 if(el.dataset.action==='pg-tab'){playgroundTab=el.dataset.id;playFilter='All';}
 else playgroundCategory=el.dataset.id;
 render();
});
