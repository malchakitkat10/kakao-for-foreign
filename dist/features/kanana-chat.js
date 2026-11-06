/* Kanana learning prototype: local scripted lessons, all interaction inside the chat room. */
'use strict';
const kananaKey='kakao-kanana-welcome-v1';
const kananaLessonIds=['hangul','first','coffee','group'];
const kananaTitles={hangul:'한글 기초',first:'첫 인사',coffee:'카페 주문',group:'모임 인사'};
const kananaBadge=()=>'<img class="avatar kanana-official-avatar" src="assets/official/kanana/kanana-wave.webp" alt="카나나">';
const knText=text=>esc(String(text).replaceAll('미나','상대방').replaceAll('어피치','상대방'));
let kananaState={version:1,serial:0,messages:[],session:null};
try{
 const saved=JSON.parse(localStorage.getItem(kananaKey)||'null');
 if(saved?.version===1&&Array.isArray(saved.messages)&&saved.messages.every(m=>m&&typeof m.id==='number'&&typeof m.type==='string')&&Number.isSafeInteger(saved.serial)){
  kananaState=saved;
  const s=saved.session;
  if(s&&(!kananaLessonIds.includes(s.lesson)||!Number.isInteger(s.step)||s.step<0||s.step>=lessons[s.lesson].steps.length||!['question','feedback','done'].includes(s.phase)||!Array.isArray(s.answers)))kananaState.session=null;
 }
}catch(_){}
function knAdd(type,extra={}){const m={id:++kananaState.serial,type,at:Date.now(),...extra};kananaState.messages.push(m);return m;}
function knSave(){try{localStorage.setItem(kananaKey,JSON.stringify(kananaState));}catch(_){toast('저장 공간이 부족해 이번 대화를 저장하지 못했습니다.');}}
function knMenu(){knAdd('menu');}
if(!kananaState.messages.length){knAdd('bot',{text:'Hi Alex! I’m Kanana. Welcome to KakaoTalk. 👋\nWhat would you like to explore?'});knAdd('interests');knSave();}
function knRefresh(){render();requestAnimationFrame(()=>{const box=document.getElementById('room-messages');if(box)box.scrollTop=box.scrollHeight;});}
function knQuestion(){const s=kananaState.session;const m=knAdd('question',{lesson:s.lesson,step:s.step});s.questionId=m.id;}
function knStart(id){
 if(!kananaLessonIds.includes(id))return;
 knAdd('user',{text:kananaTitles[id]+' 공부할래요.'});
 kananaState.session={lesson:id,step:0,phase:'question',answers:[],questionId:null};
 knAdd('bot',{text:id==='hangul'?'좋아요! 자음과 모음을 합쳐서 글자를 만들어봐요.':'좋아요! '+lessons[id].context.replaceAll('미나','상대방')});
 knQuestion();knSave();knRefresh();
}
function openKananaChat(lessonId){
 learningOpen=false;activeRoom='kanana';
 if(lessonId&&kananaLessonIds.includes(lessonId)&&(!kananaState.session||kananaState.session.lesson!==lessonId||kananaState.session.phase==='done'))knStart(lessonId);
 knBaseSetView('rooms',{openRoom:true});
 requestAnimationFrame(()=>{const box=document.getElementById('room-messages');if(box)box.scrollTop=box.scrollHeight;});
}
const knNormalize=text=>String(text).normalize('NFKC').toLowerCase().replace(/[\s.,!?。！？~:;“”"'…]/g,'');
// Free text is only graded when it matches a known answer; unknown wording gets help, not an invented AI assessment.
function knGrade(text,step){
 const normalized=knNormalize(text);
 const option=step.choices.findIndex(c=>knNormalize(c)===normalized);
 if(option>=0)return option===step.correct;
 const alternatives={
  '좋아요. 같이 가요.':['네 좋아요 같이 가요','네 같이 가요','좋습니다 같이 가요'],
  '5분 늦을 것 같아요. 죄송해요.':['죄송해요 5분 늦을 것 같아요','5분 늦어요 죄송합니다'],
  '고마워요. 곧 도착해요!':['감사해요 곧 도착해요','감사합니다 곧 도착해요'],
  '아이스 아메리카노 한 잔 주세요.':['아이스 아메리카노 한잔 부탁드려요','아이스 아메리카노 한 잔 부탁드립니다'],
  '네, 여기서 마실게요.':['여기서 마실게요','매장에서 마실게요'],
  '감사합니다.':['고맙습니다','고마워요','감사해요']
 };
 if((alternatives[step.choices[step.correct]]||[]).some(a=>knNormalize(a)===normalized))return true;
 return null;
}
function knReply(text,index=null,questionId=null){
 const s=kananaState.session;
 if(!s||s.phase!=='question'||(questionId!==null&&questionId!==s.questionId))return;
 const step=lessons[s.lesson].steps[s.step];
 if(index!==null&&(!Number.isInteger(index)||index<0||index>=step.choices.length))return;
 knAdd('user',{text});
 const good=index===null?knGrade(text,step):index===step.correct;
 if(good===null){knAdd('bot',{text:'아래 보기에서 골라볼까요? 답을 고르면 왜 그렇게 쓰는지 함께 알아볼게요.'});knQuestion();}
 else{s.answers.push({text,good});s.phase='feedback';knAdd('feedback',{lesson:s.lesson,step:s.step,good,questionId:s.questionId});}
 knSave();knRefresh();
}
function knNext(questionId){
 const s=kananaState.session;if(!s||s.phase!=='feedback'||questionId!==s.questionId)return;
 if(s.step<lessons[s.lesson].steps.length-1){s.step++;s.phase='question';knQuestion();}
 else{s.phase='done';if(!data.completedLessons.includes(s.lesson)){data.completedLessons.push(s.lesson);persist();}knAdd('summary',{lesson:s.lesson,correct:s.answers.filter(a=>a.good).length,total:s.answers.length});}
 knSave();knRefresh();
}
function knSend(text){
 text=text.trim().slice(0,500);if(!text)return;
 if(/^(주제|학습 주제|메뉴|시작|한국어|한글 공부)$/.test(text)){knAdd('user',{text});knMenu();knSave();knRefresh();return;}
 if(/^(그만|중단|그만할래요)$/.test(text)){knAdd('user',{text});kananaState.session=null;knAdd('bot',{text:'여기서 쉬어갈까요? 지금까지의 대화는 남겨둘게요. 원하실 때 다시 시작해요.'});knMenu();knSave();knRefresh();return;}
 const id=kananaLessonIds.find(id=>text===kananaTitles[id]||text===kananaTitles[id]+' 공부');
 if(id){knStart(id);return;}
 const s=kananaState.session;
 if(s?.phase==='question'){knReply(text);return;}
 knAdd('user',{text});
 if(s?.phase==='feedback'&&/^(다음|계속|계속하기)$/.test(text)){knNext(s.questionId);return;}
 knAdd('bot',{text:s?.phase==='feedback'?'방금 답변의 해설을 확인해 주세요. ‘다음 문제’를 누르거나 “다음”이라고 보내면 이어갈 수 있어요.':'저와 한글·한국어를 연습해봐요. 아래 주제를 고르면 바로 시작할 수 있어요.'});
 if(!s||s.phase==='done')knMenu();knSave();knRefresh();
}
function knSourceInputIcon(name){return `<img src="assets/katok/input-${name}.svg" alt="" aria-hidden="true">`;}
function knSourceRoomInput(){return `<div class="source-room-composer"><div class="room-inline-search" hidden><label for="room-text-search">대화 검색</label><input id="room-text-search" type="search" placeholder="검색어 입력"><button type="button" data-action="room-search-close" aria-label="검색 닫기">닫기</button><span id="room-search-count" aria-live="polite"></span></div><form id="room-message-form" class="source-input-bar"><button type="button" class="source-input-circle" data-action="room-attach" aria-label="첨부">${knSourceInputIcon('plus')}</button><label class="sr-only" for="room-message">메시지</label><textarea id="room-message" name="message" rows="1" maxlength="500" placeholder="메시지 입력" autocomplete="off"></textarea><button type="button" class="source-input-circle source-input-emoji" data-action="room-emoji" aria-label="이모티콘">${knSourceInputIcon('emoji')}</button><button type="button" class="source-input-circle" data-action="room-hash" id="room-hash-button" aria-label="샵검색">${knSourceInputIcon('hash')}</button><button type="submit" class="source-input-circle source-input-send" id="room-send-button" aria-label="전송" hidden>${knSourceInputIcon('send')}</button></form><input type="file" id="room-photo" accept="image/png,image/jpeg,image/webp,image/gif" aria-label="사진 첨부" hidden></div>`;}

function knMessage(m){
 const time=`<time class="message-time">${new Date(m.at).toLocaleTimeString('ko-KR',{hour:'numeric',minute:'2-digit'})}</time>`;
 if(m.type==='user')return `<div class="chat-line me">${time}<div class="message-content"><div class="bubble">${m.image?`<img class="room-message-photo" src="${esc(m.image)}" alt="첨부 사진">`:''}${esc(m.text)}</div></div></div>`;
 const s=kananaState.session;let text='',actions='';
 if(m.type==='bot')text=esc(m.text);
 if(m.type==='menu'){
  text='오늘은 무엇부터 배워볼까요?\n한 번에 3문제씩 함께 연습해요.';
  actions=kananaLessonIds.map(id=>`<button data-action="kn-start" data-id="${id}">${kananaTitles[id]}${data.completedLessons.includes(id)?' ✓':''}</button>`).join('');
 }
 if(m.type==='question'){
  const l=lessons[m.lesson],q=l?.steps[m.step];if(!q)return '';
  text=`${kananaTitles[m.lesson]} · ${m.step+1}/${l.steps.length}\n\n${knText(q.prompt)}\n\n${knText(q.text)}`;
  if(s?.questionId===m.id&&s.phase==='question')actions=q.choices.map((c,i)=>`<button data-action="kn-answer" data-id="${m.id}" data-index="${i}">${esc(c)}</button>`).join('');
 }
 if(m.type==='feedback'){
  const q=lessons[m.lesson]?.steps[m.step];if(!q)return '';
  text=`${m.good?'잘하셨어요!':'함께 다시 알아볼까요?'}\n\n${esc(q.explanation)}${!m.good?'\n\n이 문제의 답: '+esc(q.choices[q.correct]):''}`;
  if(s?.phase==='feedback'&&s.questionId===m.questionId)actions=`<button data-action="kn-next" data-id="${m.questionId}">${m.step===lessons[m.lesson].steps.length-1?'학습 마무리':'다음 문제'}</button>`;
 }
 if(m.type==='summary'){
  text=`${kananaTitles[m.lesson]} 연습을 마쳤어요! 🎉\n${m.total}문제 중 ${m.correct}문제를 맞혔어요.\n\n오늘 배운 표현\n${lessons[m.lesson].steps.map(q=>'• '+esc(q.choices[q.correct])).join('\n')}`;
  actions=`<button data-action="kn-menu">다른 주제 배우기</button><button data-action="kn-start" data-id="${m.lesson}">다시 연습하기</button>`;
 }
 return text?`<div class="chat-line">${kananaBadge()}<div class="message-content"><span class="message-name">카나나</span><div class="bubble">${text}</div></div>${time}</div>${actions?`<div class="quick-replies kanana-replies">${actions}</div>`:''}`:'';
}
function renderKananaRoom(){
 const s=kananaState.session,active=s&&s.phase!=='done';
 const input=(typeof renderRoomInput==='function'?renderRoomInput():knSourceRoomInput()).replaceAll('data-action="room-','data-action="kn-room-');
 return `<div class="split-view chat-view room-view room-open kanana-room"><section class="conversation ${data.chatTheme==='apeach'?'theme-apeach':''}" aria-label="카나나 한국어 학습 채팅방"><div class="conversation-header"><button class="icon-button back-button" data-action="room-back" aria-label="채팅 목록">${icon('back')}</button>${kananaBadge()}<div><h2>카나나</h2><p>한국어 학습</p></div><div class="conversation-actions"><button class="icon-button" data-action="toggle-theme" aria-label="채팅 테마 바꾸기">${icon('palette')}</button><button class="icon-button" data-action="kn-menu" aria-label="학습 주제">${icon('learn')}</button></div></div><button type="button" class="source-notice-banner" data-action="kn-menu"><img src="assets/katok/notice-megaphone.svg" alt="" aria-hidden="true"><span>${active?`${kananaTitles[s.lesson]} · ${s.step+1} / ${lessons[s.lesson].steps.length}문제`:'카나나와 한국어 공부하기'}</span></button><div class="messages" id="room-messages" role="log" aria-label="카나나와 학습 대화" aria-live="polite" aria-relevant="additions"><div class="system-line"><span>카나나와 나의 공부방</span></div>${kananaState.messages.map(knMessage).join('')}</div>${input}</section></div>`;
}
// Use the existing chat route and list; there is no separate learning window.
const knBaseSetView=setView;
setView=function(next,options){if(next==='learn'){openKananaChat(learningOpen?learning.lesson:null);return;}knBaseSetView(next,options);if(next==='rooms'&&activeRoom==='kanana'&&roomOpen)requestAnimationFrame(()=>{const box=document.getElementById('room-messages');if(box)box.scrollTop=box.scrollHeight;});};
const knBaseNavigation=updateNavigation;
updateNavigation=function(){knBaseNavigation();document.body.classList.toggle('kanana-chat-open',view==='rooms'&&roomOpen&&activeRoom==='kanana');};
const knBaseRoomRow=roomRow;
roomRow=function(r){if(r.id!=='kanana')return knBaseRoomRow(r);const last=kananaState.messages.at(-1);const preview=last?.text||'한글부터 일상 대화까지, 카나나와 함께 배워요.';return `<button class="list-row" data-action="select-room" data-id="kanana">${kananaBadge()}<span class="row-copy"><strong>카나나 </strong><p>${esc(preview)}</p></span><span class="row-side"><small>한국어</small></span></button>`;};
const knBaseRooms=renderRooms;
renderRooms=function(){if(activeRoom!=='kanana')return knBaseRooms();if(roomOpen)return renderKananaRoom();const filtered=roomData.filter(r=>matchText(r.title+' '+r.description));return `<div class="split-view chat-view room-view"><aside class="list-pane">${sectionTitle('채팅',filtered.length)}${filtered.map(roomRow).join('')}${!filtered.length?empty('채팅방을 찾을 수 없습니다.'):''}</aside></div>`;};
// Keep existing learning bookmarks and back/forward navigation in the same chat route.
function knRedirectLegacy(){if(view!=='learn')return;view='rooms';activeRoom='kanana';roomOpen=true;learningOpen=false;const url=new URL(location.href);url.hash='rooms';url.searchParams.set('room','kanana');history.replaceState(null,'',url);}
knRedirectLegacy();
renderLearn=function(){knRedirectLegacy();updateNavigation();return renderKananaRoom();};
const knHub=hubApps.find(a=>a.view==='learn');if(knHub){knHub.name='카나나 한국어 학습';knHub.short='카나나';knHub.art=kananaBadge();}
for(const item of (typeof oneContents!=='undefined'?oneContents:[])){if(item.category==='learn')item.title=item.title.replace('어피치와','카나나와');}
document.addEventListener('click',event=>{
 const el=event.target.closest('[data-action^="kn-"]');if(!el)return;
 if(el.dataset.action==='kn-start')knStart(el.dataset.id);
 if(el.dataset.action==='kn-menu'){knMenu();knSave();knRefresh();}
 if(el.dataset.action==='kn-next')knNext(Number(el.dataset.id));
 if(el.dataset.action==='kn-answer'){
  const s=kananaState.session,i=Number(el.dataset.index);if(!s)return;
  const text=lessons[s.lesson].steps[s.step]?.choices[i];if(text!==undefined)knReply(text,i,Number(el.dataset.id));
 }
});
function knUpdateInput(){
 const input=document.getElementById('room-message');if(!input)return;
 const hasText=!!input.value.trim();document.getElementById('room-send-button').hidden=!hasText;document.getElementById('room-hash-button').hidden=hasText;
 input.style.height='auto';input.style.height=Math.min(input.scrollHeight,112)+'px';
}
function knIsRoom(){return view==='rooms'&&roomOpen&&activeRoom==='kanana';}
document.addEventListener('submit',event=>{
 if(!knIsRoom()||event.target.id!=='room-message-form')return;
 event.preventDefault();event.stopImmediatePropagation();const input=event.target.elements.message;const text=input.value;input.value='';knSend(text);
},true);
document.addEventListener('keydown',event=>{
 if(!knIsRoom()||event.target.id!=='room-message')return;
 if(event.key==='Enter'&&!event.shiftKey&&!event.isComposing&&event.keyCode!==229){event.preventDefault();event.stopImmediatePropagation();event.target.form.requestSubmit();}
},true);
document.addEventListener('input',event=>{
 if(!knIsRoom())return;
 if(event.target.id==='room-message'){event.stopImmediatePropagation();knUpdateInput();}
 if(event.target.id==='room-text-search'){
  event.stopImmediatePropagation();const term=event.target.value.trim().toLocaleLowerCase();let found=0;
  document.querySelectorAll('#room-messages .chat-line').forEach(row=>{const matches=!!term&&row.textContent.toLocaleLowerCase().includes(term);row.classList.toggle('room-search-match',matches);if(matches)found++;});
  document.getElementById('room-search-count').textContent=term?`${found}개`:'';document.querySelector('.room-search-match')?.scrollIntoView({block:'nearest'});
 }
},true);
document.addEventListener('click',event=>{
 const el=event.target.closest('[data-action^="kn-room-"]');if(!el||!knIsRoom())return;
 const action=el.dataset.action;
 if(action==='kn-room-attach')document.getElementById('room-photo').click();
 if(action==='kn-room-emoji')openModal('이모티콘',`<div class="room-emoji-options">${['😊','👍','❤️','😂','👏','🎉','☕','👋'].map(x=>`<button type="button" data-action="kn-room-insert-emoji" data-value="${x}" aria-label="${x}">${x}</button>`).join('')}</div>`);
 if(action==='kn-room-insert-emoji'){const input=document.getElementById('room-message');input.setRangeText(el.dataset.value,input.selectionStart,input.selectionEnd,'end');closeModal();knUpdateInput();input.focus();}
 if(action==='kn-room-hash'){document.querySelector('.room-inline-search').hidden=false;document.getElementById('room-text-search').focus();}
 if(action==='kn-room-search-close'){document.querySelector('.room-inline-search').hidden=true;document.querySelectorAll('.room-search-match').forEach(x=>x.classList.remove('room-search-match'));document.getElementById('room-message').focus();}
});
document.addEventListener('change',event=>{
 if(!knIsRoom()||event.target.id!=='room-photo')return;
 event.stopImmediatePropagation();const file=event.target.files[0];event.target.value='';if(!file)return;
 if(!['image/png','image/jpeg','image/webp','image/gif'].includes(file.type)){toast('PNG, JPG, WebP, GIF 사진을 선택해 주세요.');return;}
 if(file.size>1024*1024){toast('1MB 이하의 사진을 선택해 주세요.');return;}
 const reader=new FileReader();reader.onload=()=>{knAdd('user',{text:'',image:reader.result});knAdd('bot',{text:'사진을 받았어요. 지금은 글자로 답하거나 보기를 골라 학습할 수 있어요.'});knSave();if(knIsRoom())knRefresh();};reader.onerror=()=>toast('사진을 읽지 못했습니다.');reader.readAsDataURL(file);
},true);

requestAnimationFrame(()=>{if(view==='rooms'&&roomOpen&&activeRoom==='kanana'){const box=document.getElementById('room-messages');if(box)box.scrollTop=box.scrollHeight;}});
