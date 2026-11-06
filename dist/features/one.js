'use strict';

const hubApps=[
 {name:'창작마당',short:'창작마당',category:'play',view:'playground',style:'play',art:'<img src="assets/kiwi/party.png" alt="">'},
 {name:'한국어 학습',short:'한국어',category:'learn',view:'learn',style:'learn',art:'<img src="assets/kakao/apeach-profile.png" alt="어피치">'},
 {name:'카카오페이지',short:'페이지',category:'play',url:'https://page.kakao.com/',style:'page official',service:'page',art:'<img src="assets/official/page-app.jpg" alt="카카오페이지 공식 로고">'},
 {name:'카카오웹툰',short:'웹툰',category:'play',url:'https://webtoon.kakao.com/',style:'webtoon official',service:'webtoon',art:'<img src="assets/official/webtoon.png" alt="카카오웹툰 공식 로고">'},
 {name:'멜론',short:'멜론',category:'play',url:'https://www.melon.com/',style:'melon official',service:'melon',art:'<img src="assets/official/melon.png" alt="멜론 공식 로고">'},
 {name:'카카오맵',short:'지도',category:'life',url:'https://map.kakao.com/',style:'map official',service:'map',art:'<img src="assets/official/map-app.jpg" alt="카카오맵 공식 로고">'},
 {name:'한국여행',short:'한국여행',category:'life',view:'visit',style:'travel',art:'<img src="assets/kiwi/tea.png" alt="">'},
 {name:'오픈채팅',short:'커뮤니티',category:'life',view:'openchat',style:'community',art:'<img src="assets/kakao/friends.png" alt="">'}
];
const officialServices={
 page:{web:'https://page.kakao.com/',mobile:'https://page.kakao.com/',androidPackage:'com.kakao.page'},
 webtoon:{web:'https://webtoon.kakao.com/',mobile:'https://kakaowebtoon.onelink.me/YAuT/yzshoo0x?deep_link_value='+encodeURIComponent('https://webtoon.kakao.com/linkapp/')},
 melon:{web:'https://www.melon.com/',mobile:'melonapp://home',fallback:'https://m.melon.com/'},
 map:{web:'https://map.kakao.com/',mobile:'https://m.map.kakao.com/scheme/open'}
};
function isMobileDevice(){return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);}
function officialHref(id){const a=officialServices[id];if(!isMobileDevice())return a.web;if(id==='page'&&/Android/i.test(navigator.userAgent))return 'intent://page.kakao.com/#Intent;scheme=https;package='+a.androidPackage+';S.browser_fallback_url='+encodeURIComponent(a.web)+';end';return a.mobile;}
let appFallbackCleanup=null;
document.addEventListener('click',e=>{
 const link=e.target.closest('[data-official]');if(!link||!isMobileDevice()||link.dataset.official!=='melon'||e.ctrlKey||e.metaKey||e.shiftKey)return;
 e.preventDefault();if(appFallbackCleanup)appFallbackCleanup();
 const started=Date.now(),fallback=officialServices.melon.fallback;
 const cleanup=()=>{clearTimeout(timer);document.removeEventListener('visibilitychange',onVisibility);window.removeEventListener('pagehide',cleanup);appFallbackCleanup=null;};
 const onVisibility=()=>{if(document.hidden)cleanup();};
 const timer=setTimeout(()=>{const shouldFallback=!document.hidden&&Date.now()-started<2500;cleanup();if(shouldFallback)location.assign(fallback);},1500);
 appFallbackCleanup=cleanup;document.addEventListener('visibilitychange',onVisibility);window.addEventListener('pagehide',cleanup,{once:true});location.assign(officialServices.melon.mobile);
});
let hubCategory='all';
const oneContents=[
 {id:'solo',title:'나 혼자만 레벨업',category:'play',label:'게임',image:'assets/official/solo-leveling.jpg',art:'solo',action:'quest'},
 {id:'friends',title:'프렌즈 피크닉',category:'play',label:'게임',image:'assets/kakao/apeach-splash.png',art:'friends',action:'quest'},
 {id:'coffee',title:'카나나와 카페 주문',category:'learn',label:'한국어',image:'assets/kiwi/tea.png',art:'tea',action:'coffee-lesson'},
 {id:'cafe-quest',title:'카페 고르기',category:'play',label:'게임',image:'assets/kiwi/cafe.png',art:'cafe',action:'sample-game'},
 {id:'story-demo',title:'카페에서 만난 편지',category:'play',label:'스토리',image:'assets/kiwi/cafe.png',art:'story',action:'sample-game'},
 {id:'first',title:'카나나와 첫 인사',category:'learn',label:'한국어',image:'assets/kakao/apeach-profile.png',art:'apeach',action:'one-lesson'},
 {id:'cafe-walk',title:'성수 카페 산책',category:'life',label:'한국여행',image:'assets/kiwi/cafe.png',art:'cafe',action:'experience'},
 {id:'group',title:'모임에서 인사하기',category:'learn',label:'한국어',image:'assets/kakao/friends.png',art:'friends-character',action:'one-lesson'},
 {id:'squid',title:'오징어 게임',category:'play',label:'오픈채팅',image:'assets/official/squid-game.jpg',art:'squid',action:'squid-room'}
];
function onePreviewLink(item,category){
 return `<button class="one-preview-link" data-action="one-preview" data-category="${category}" data-title="${esc(item.title)}" aria-label="${esc(item.title)} 창작마당에서 보기">${playgroundPreview(item)}</button>`;
}
function renderOne(){
 const artists=playgroundArtists.slice(0,2).filter(playgroundMatches);
 const stories=playgroundStories.slice(0,3).filter(playgroundMatches);
 const slides=[
 {rank:1,name:'그림자 던전',terms:'나 혼자만 레벨업 그림자 던전 플레이',art:'solo',image:'assets/official/solo-leveling.jpg',alt:'나 혼자만 레벨업 성진우 공식 이미지',action:'quest',id:'solo',cta:'던전 플레이'},
 {rank:2,name:'무궁화 생존방',terms:'무궁화 생존방 오징어 게임 Squid Game 오픈채팅',art:'squid',image:'assets/official/squid-game.jpg',alt:'오징어 게임 공식 이미지',action:'squid-room',cta:'게임방 입장'},
 {rank:3,name:playgroundArtists[0].title,terms:`${playgroundArtists[0].title} IVE 아이브`,art:'artist',image:'assets/official/playground/ive-secret.jpg',alt:'IVE 공식 사진',action:'one-preview',category:'artist',cta:'게임 보기'}
 ].filter(a=>matchText(a.terms)).map(a=>({...a,html:`<section class="hub-feature ranked-hero" aria-label="${a.rank}위 ${esc(a.name)}"><div class="ranked-hero-art ${a.art}"><img src="${a.image}" alt="${a.alt}"></div><div class="hub-feature-shade"></div><strong class="hero-rank" aria-label="${a.rank}위">${a.rank}</strong><div class="hub-feature-copy"><h2>${esc(a.name)}</h2><div class="hub-feature-actions"><button data-action="${a.action}" ${a.id?`data-id="${a.id}"`:''} ${a.category?`data-category="${a.category}" data-title="${esc(a.name)}"`:''}>${icon('start')} ${a.cta}</button></div></div></section>`}));
 return `<div class="one-dashboard st-scroll">
  ${slides.length?`<section class="one-carousel" aria-label="인기 게임 순위 · 시연용" aria-roledescription="슬라이드"><div class="one-hero-track" tabindex="0" aria-label="인기 게임 배너, 좌우 화살표로 이동">${slides.map((a,i)=>`<div class="one-hero-slide" role="group" aria-roledescription="슬라이드" aria-label="${a.rank}위 ${a.name}" ${i?'inert aria-hidden="true"':''}>${a.html}</div>`).join('')}</div><div class="one-carousel-controls"><div class="one-carousel-pages">${slides.map((a,i)=>`<button data-action="hero-slide" data-id="${i}" aria-label="${a.rank}위 ${a.name} 배너" aria-pressed="${i===0}"></button>`).join('')}</div><span class="one-slide-count" aria-live="polite">1 / ${slides.length}</span><button data-action="hero-step" data-id="prev" aria-label="이전 배너">‹</button><button data-action="hero-step" data-id="next" aria-label="다음 배너">›</button></div></section>`:''}
  ${!searchQuery?studioEntry():''}
  ${artists.length||stories.length?`<section class="hub-section one-playground-picks"><div class="hub-section-title"><h2>게임</h2><button data-action="one-preview-all">전체보기 ↗</button></div>${artists.length?`<div class="one-artist-picks">${artists.map(a=>onePreviewLink(a,'artist')).join('')}</div>`:''}${stories.length?`<div class="one-story-picks">${stories.map(a=>onePreviewLink(a,'page')).join('')}</div>`:''}</section>`:''}
  ${!slides.length&&!artists.length&&!stories.length?'<p class="pg-empty">검색 결과가 없습니다.</p>':''}
 </div>`;
}
function moveOneHero(index){
 const track=document.querySelector('.one-hero-track');if(!track)return;
 const count=track.children.length;
 const next=(index+count)%count;
 track.scrollTo({left:next*track.clientWidth,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
}
document.addEventListener('scroll',event=>{
 const track=event.target;if(!track.matches?.('.one-hero-track'))return;
 const index=Math.round(track.scrollLeft/track.clientWidth),carousel=track.closest('.one-carousel');
 carousel.querySelectorAll('.one-carousel-pages button').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
 Array.from(track.children).forEach((slide,i)=>{slide.inert=i!==index;slide.setAttribute('aria-hidden',String(i!==index));});
 carousel.querySelector('.one-slide-count').textContent=`${index+1} / ${track.children.length}`;
},true);
document.addEventListener('keydown',event=>{
 if(!event.target.matches('.one-hero-track')||!['ArrowLeft','ArrowRight'].includes(event.key))return;
 event.preventDefault();moveOneHero(Math.round(event.target.scrollLeft/event.target.clientWidth)+(event.key==='ArrowRight'?1:-1));
});
function openHubMenu(){
 openModal('메뉴',`<div class="one-service-menu">${hubApps.map(a=>`<a class="one-service-link" ${a.view?(a.view==='openchat'?'href="#openchat" data-action="hub-community"':`href="#${a.view}" data-view="${a.view}"`):`href="${officialHref(a.service)}" data-official="${a.service}" ${isMobileDevice()?'':'target="_blank" rel="noopener noreferrer"'}`} aria-label="${a.name}${a.url?' 공식 앱 열기':''}"><span class="one-service-logo">${a.art}</span><span>${a.short}</span>${a.url?'<small>↗</small>':''}</a>`).join('')}</div><div class="one-menu-account"><button data-action="passport">내 활동</button><button data-action="create">만들기</button><button data-action="settings">설정</button></div>`);
}
document.addEventListener('click',event=>{
 const el=event.target.closest('[data-action]');if(!el)return;
 if(el.dataset.action==='hero-slide')moveOneHero(Number(el.dataset.id));
 if(el.dataset.action==='hero-step'){const track=document.querySelector('.one-hero-track');if(track)moveOneHero(Math.round(track.scrollLeft/track.clientWidth)+(el.dataset.id==='next'?1:-1));}
 if(el.dataset.action==='one-preview'){playgroundTab='discover';playgroundCategory=el.dataset.category;setView('playground');toggleSearch(true);search.value=el.dataset.title;searchQuery=el.dataset.title;render();}
 if(el.dataset.action==='one-preview-all'){playgroundTab='discover';playgroundCategory='all';setView('playground');}
 if(el.dataset.action==='hub-menu')openHubMenu();
 if(el.dataset.action==='hub-community'){event.preventDefault();communityOpen=false;setView('openchat');}
 if(el.dataset.action==='one-lesson'&&lessons[el.dataset.id]){learningOpen=true;learning={lesson:el.dataset.id,step:0,replies:[]};setView('learn');}
});
