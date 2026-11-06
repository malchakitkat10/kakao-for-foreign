/* First-install demo. Recommendations and group conversations are local scripted scenarios. */
'use strict';
const newcomerKey='kakao-newcomer-v1';
const newcomerCases={
 korean:{label:'Learn Korean',prompt:'I want to learn Korean.',image:'assets/official/kanana/kanana-wave.webp',title:'Korean Together',subtitle:'Language exchange · 한국어',reply:'Of course! You can learn Korean one-on-one with me, at your own pace.\n\nYou can also connect with KakaoTalk’s 50 million users in Korea and get help with real Korean conversations. Shall we start together, or meet a language partner?',seed:[['Minji','Hi Alex! 안녕하세요 means “hello”. You can ask me anything in English.'],['Daniel','I’m learning Korean too. Let’s practice together!']],channels:['Lounge','Practice','Questions']},
 webtoon:{label:'Webtoons',prompt:'I like webtoons.',image:'assets/official/solo-leveling.jpg',title:'Shadow Forge',subtitle:'Solo Leveling · 검 강화',reply:'Oh, you like webtoons? The Solo Leveling sword-upgrade group is the most popular game on our Playground right now!\n\nWant to join the hunters and upgrade your sword together?',seed:[['Noah','Welcome, hunter! I just upgraded my shadow sword to +7.'],['Yuna','Alex, try your first upgrade. We’ll cheer you on!']],channels:['Hunters’ lounge','Sword upgrades','Tips']},
 drama:{label:'K-dramas',prompt:'I love K-dramas.',image:'assets/official/onboarding/lovely-runner.jpg',title:'Back to Our First Scene',subtitle:'Lovely Runner · 상황극',reply:'You love K-dramas? Let’s step into a scene from Lovely Runner.\n\nFans are making their own story in this role-play chat. Pick a role and try a line in Korean — I can help with the words!',seed:[['Emma','We’re writing a new rainy-day scene inspired by Lovely Runner.'],['Jisoo','You meet someone at the bus stop. Will you offer your umbrella or ask to share one?']],channels:['Scene room','Cast','Story ideas']},
 squid:{label:'Squid Game',prompt:'I really enjoyed Squid Game.',image:'assets/official/squid-game.jpg',title:'Red Light Survival',subtitle:'Squid Game · 서바이벌',reply:'You enjoyed Squid Game? There’s a survival chat waiting for you!\n\nTwenty players from around the world are already in the lobby. Want to join them?',seed:[],channels:[]},
 tws:{label:'TWS',prompt:'I like TWS!',image:'assets/official/onboarding/tws.jpg',title:'TWS · Global 42',subtitle:'Global fan chat · 투어스',reply:'You’re a TWS fan? Meet other 42s from Korea and around the world!\n\nYou can talk about your favourite members, share performances, and learn Korean expressions together.',seed:[['Hana','Welcome, Alex! Who is your favourite TWS member?'],['Sophie','Hello from London! I’ve had plot twist on repeat all day.'],['Jiwoo','반가워요! That means “Nice to meet you!”']],channels:['Fan lounge','Music & stages','Korean with 42']}
};
let newcomer={joined:[],messages:[],sword:0,channels:{}};
try{const n=JSON.parse(localStorage.getItem(newcomerKey));if(n&&Array.isArray(n.joined)&&Array.isArray(n.messages))newcomer={...newcomer,...n,joined:n.joined.filter(id=>newcomerCases[id])};}catch(_){}
function ncSave(){try{localStorage.setItem(newcomerKey,JSON.stringify(newcomer));}catch(_){toast('Could not save this conversation.');}}
const ncRoomId=id=>'welcome-'+id;
for(const [id,c] of Object.entries(newcomerCases))roomData.push({id:ncRoomId(id),title:c.title,description:c.subtitle,messages:[],members:'Global chat'});
// Room IDs must be registered before restoring a direct room URL.
const ncRequested=new URL(location.href).searchParams.get('room');
if(ncRequested&&roomData.some(r=>r.id===ncRequested))activeRoom=ncRequested;
function ncPortrait(id){return `<img class="avatar nc-room-cover" src="${newcomerCases[id].image}" alt="">`;}
function ncBot(content){return `<div class="chat-line">${kananaBadge()}<div class="message-content"><span class="message-name">Kanana</span>${content}</div></div>`;}
function ncInterests(){return ncBot(`<div class="nc-interests" aria-label="Choose an interest">${Object.entries(newcomerCases).map(([id,c])=>`<button data-action="nc-interest" data-id="${id}"><img src="${c.image}" alt=""><span>${c.label}</span><img class="nc-chevron" src="assets/kiwi/components/back.svg" alt=""></button>`).join('')}</div>`);}
function ncRecommendation(id){const c=newcomerCases[id];if(!c)return '';return ncBot(`<div class="nc-recommendation"><img src="${c.image}" alt="${esc(c.subtitle)}"><div><strong>${c.title}</strong><p>${c.subtitle}</p></div>${id==='korean'?'<button data-action="nc-learn">Learn with Kanana</button>':''}<button data-action="nc-join" data-id="${id}">${id==='korean'?'Meet Korean speakers':'Open chat'}</button></div>`);}
const ncBaseMessage=knMessage;
knMessage=function(m){if(m.type==='interests')return ncInterests();if(m.type==='recommendation')return ncRecommendation(m.caseId);return ncBaseMessage(m).replaceAll('>카나나<','>Kanana<');};
function ncChoose(id,text){const c=newcomerCases[id];if(!c)return;kananaState.session=null;knAdd('user',{text:text||c.prompt});knAdd('bot',{text:c.reply});knAdd('recommendation',{caseId:id});knSave();knRefresh();}
const ncBaseSend=knSend;
knSend=function(text){
 const t=text.trim();
 const id=/투어스|\btws\b/i.test(t)?'tws':/오징어|squid/i.test(t)?'squid':/웹툰|webtoon|solo leveling|나혼렙/i.test(t)?'webtoon':/드라마|drama|lovely runner/i.test(t)?'drama':/한국어.*(배우|공부)|learn.*korean|study.*korean/i.test(t)?'korean':null;
 if(id){ncChoose(id,t);return;}
 if(/^(interests|menu|관심사|메뉴)$/i.test(t)){kananaState.session=null;knAdd('interests');knSave();knRefresh();return;}
 if(!kananaState.session){knAdd('user',{text:t});knAdd('bot',{text:'I can help you learn Korean and find people who share your interests. Choose one below to get started.'});knAdd('interests');knSave();knRefresh();return;}
 ncBaseSend(text);
};
const ncBaseKananaRoom=renderKananaRoom;
renderKananaRoom=function(){return ncBaseKananaRoom().replace('aria-label="카나나 한국어 학습 채팅방"','aria-label="Kanana chat"').replace('<h2>카나나</h2><p>한국어 학습</p>','<h2>Kanana</h2><p>Your Korean companion</p>').replace('data-action="kn-menu" aria-label="학습 주제"','data-action="nc-menu" aria-label="Choose interests"').replace('data-action="kn-menu"><img','data-action="nc-menu"><img').replace('카나나와 한국어 공부하기','Explore your interests').replace('카나나와 나의 공부방','Kanana · Only you').replace('placeholder="메시지 입력"','placeholder="Message Kanana"');};
function ncJoin(id){if(!newcomerCases[id])return;if(!newcomer.joined.includes(id)){newcomer.joined.push(id);ncSave();}if(id==='squid'){community='squid';communityOpen=true;channel='general';}activeRoom=ncRoomId(id);setView('rooms',{openRoom:true});}
function ncChatRow(id){const c=newcomerCases[id];return `<button class="list-row" data-action="nc-join" data-id="${id}">${ncPortrait(id)}<span class="row-copy"><strong>${c.title}</strong><p>${esc(newcomer.messages.filter(m=>m.caseId===id).at(-1)?.text||c.subtitle)}</p></span></button>`;}
function ncChatList(){const showKanana=matchText('Kanana 카나나 Korean');return `<div class="split-view chat-view room-view"><aside class="list-pane">${showKanana?`<button class="list-row" data-action="select-room" data-id="kanana">${kananaBadge()}<span class="row-copy"><strong>Kanana</strong><p>${esc(kananaState.messages.filter(m=>m.text).at(-1)?.text||'Hi Alex! Welcome to KakaoTalk.')}</p></span></button>`:''}${newcomer.joined.filter(id=>matchText(newcomerCases[id].title+' '+newcomerCases[id].subtitle)).map(ncChatRow).join('')}${!showKanana&&!newcomer.joined.some(id=>matchText(newcomerCases[id].title+' '+newcomerCases[id].subtitle))?empty('No chats found.'):''}</aside></div>`;}
const ncBaseRooms=renderRooms;
renderRooms=function(){if(!roomOpen)return ncChatList();const id=activeRoom.replace('welcome-','');if(newcomerCases[id])return ncRenderRoom(id);return ncBaseRooms();};
renderFriends=function(){return `<div class="friend-feed"><button class="classic-profile" data-action="passport"><img src="assets/kakao/profile-1.png" alt=""><span><strong>Alex Morgan</strong></span></button><section class="classic-section">${sectionTitle('Friends',0)}<div class="nc-no-friends"><img src="assets/kakao/icon-friends-idle.svg" alt=""><p>No friends yet</p></div></section></div>`;};
function ncLine(name,text,me=false,i=0){return `<div class="chat-line ${me?'me':''}">${me?'':`<img class="avatar" src="assets/kakao/profile-${i%3+1}.png" alt="">`}<div class="message-content">${me?'':`<span class="message-name">${esc(name)}</span>`}<div class="bubble">${esc(text)}</div></div></div>`;}
function ncMessages(id){const c=newcomerCases[id],ch=newcomer.channels[id]||c.channels[0];const main=ch===c.channels[0];return `<div class="system-line"><span>${esc(ch)}</span></div>${main?c.seed.map(([n,t],i)=>ncLine(n,t,false,i)).join(''):ncLine('Kanana','This is the '+ch+' channel. Start a conversation here.')}<div class="system-line"><span>Alex Morgan joined the chat.</span></div>${newcomer.messages.filter(m=>m.caseId===id&&m.channel===ch).map(m=>ncLine(m.name,m.text,m.name==='Alex Morgan',1)).join('')}`;}
function ncRenderRoom(id){if(id==='squid'){community='squid';communityOpen=true;return renderSquidRoom();}const c=newcomerCases[id];return `<div class="split-view chat-view room-view room-open nc-group"><section class="conversation" aria-label="${esc(c.title)}"><div class="conversation-header"><button class="icon-button back-button" data-action="room-back" aria-label="Chats">${icon('back')}</button>${ncPortrait(id)}<div><h2>${c.title}</h2><p>${c.seed.length+1} members · ${esc(newcomer.channels[id]||c.channels[0])}</p></div><button class="icon-button" data-action="nc-channels" data-id="${id}" aria-label="Channels">${icon('more')}</button></div><button class="source-notice-banner" data-action="nc-room-play" data-id="${id}"><img src="assets/katok/notice-megaphone.svg" alt=""><span>${{webtoon:'Upgrade your shadow sword · +'+newcomer.sword,drama:'Choose your role in the scene',korean:'Say your first hello',tws:'Who is your favourite member?'}[id]}</span></button><div class="messages" id="room-messages" role="log" aria-live="polite">${ncMessages(id)}</div>${renderRoomInput().replace('placeholder="메시지 입력"','placeholder="Message"')}</section></div>`;}
function ncPost(id,text,name='Alex Morgan'){if(!text.trim())return;newcomer.messages.push({caseId:id,text:text.trim().slice(0,500),name,channel:newcomer.channels[id]||newcomerCases[id].channels[0],at:Date.now()});ncSave();render();requestAnimationFrame(()=>{const box=document.getElementById('room-messages');if(box)box.scrollTop=box.scrollHeight;});}
function ncPlay(id){
 if(id==='webtoon'){newcomer.sword++;ncPost(id,'Upgrade!','Alex Morgan');ncPost(id,'Upgrade successful! Your shadow sword is now +'+newcomer.sword+'.','Kanana');return;}
 const choices={korean:['안녕하세요! 저는 Alex예요.','한국어를 배우고 있어요.'],drama:['Offer my umbrella','Ask to share an umbrella'],tws:['SHINYU','DOHOON','YOUNGJAE','HANJIN','JIHOON','KYUNGMIN']};
 openModal(id==='drama'?'Your first scene':id==='tws'?'Your favourite member':'Say hello',`<div class="choice-list">${choices[id].map((t,i)=>`<button class="choice-row" data-action="nc-prompt" data-id="${id}" data-index="${i}" data-text="${esc(t)}">${t}</button>`).join('')}</div>`);
}
const ncNavigation=updateNavigation;
updateNavigation=function(){ncNavigation();if(view==='rooms'&&roomOpen&&activeRoom==='welcome-squid')document.body.classList.add('kiwi-room-open');const labels={friends:'Friends',rooms:'Chats',openchat:'Open Chat',more:'More'};if(labels[view])document.getElementById('view-title').textContent=labels[view];document.querySelectorAll('.nav-link').forEach(a=>{const label=labels[a.dataset.view];if(label)a.querySelector('span').textContent=label;});};
// Local first-install reset is explicit and does not erase existing Playground creations.
function ncReset(){newcomer={joined:[],messages:[],sword:0,channels:{}};ncSave();kananaState={version:1,serial:0,messages:[],session:null};knAdd('bot',{text:'Hi Alex! I’m Kanana. Welcome to KakaoTalk. 👋\nWhat would you like to explore?'});knAdd('interests');knSave();activeRoom='kanana';setView('rooms');}
const ncSettings=openSettings;
openSettings=function(){ncSettings();modal.innerHTML=modal.innerHTML.replace('화면 언어','Language').replace('>한국어<','>English<');modal.insertAdjacentHTML('beforeend','<button class="button secondary full" data-action="nc-reset">Restart first-time demo</button>');};
document.addEventListener('click',event=>{const el=event.target.closest('[data-action^="nc-"]');if(!el)return;const {action,id}=el.dataset;
 if(action==='nc-interest')ncChoose(id);
 if(action==='nc-menu'){knAdd('interests');knSave();knRefresh();}
 if(action==='nc-join')ncJoin(id);
 if(action==='nc-learn'){knAdd('bot',{text:'Let’s start with “안녕하세요” (annyeonghaseyo) — hello. Choose a lesson below.'});knMenu();knSave();knRefresh();}
 if(action==='nc-room-play')ncPlay(id);
 if(action==='nc-channels')openModal('Channels',`<div class="nc-channel-menu">${newcomerCases[id].channels.map((ch,i)=>`<button data-action="nc-channel" data-id="${id}" data-index="${i}"># ${esc(ch)}</button>`).join('')}</div>`);
 if(action==='nc-channel'){const ch=newcomerCases[id]?.channels[Number(el.dataset.index)];if(ch){newcomer.channels[id]=ch;ncSave();closeModal();render();}}
 if(action==='nc-prompt'){closeModal();ncPost(id,el.dataset.text);ncPost(id,id==='drama'?(el.dataset.index==='0'?'Jisoo takes one step closer. “같이 써도 돼요?” — May I share your umbrella? What do you say?':'Emma smiles and moves her umbrella. “물론이죠!” — Of course! Your turn to continue the scene.'):id==='korean'?'반가워요, Alex! Nice to meet you. 어디에서 왔어요? — Where are you from?':'Great choice! What is your favourite '+el.dataset.text+' performance?',id==='tws'?'Hana':id==='drama'?'Jisoo':'Minji');}
 if(action==='nc-reset')ncReset();
});
document.addEventListener('submit',event=>{const id=activeRoom.replace('welcome-','');if(view!=='rooms'||!roomOpen||!newcomerCases[id]||event.target.id!=='room-message-form')return;event.preventDefault();event.stopImmediatePropagation();ncPost(id,event.target.elements.message.value);},true);
// Preserve existing list and new-chat controls while offering the welcome flow first.
openRoomPicker=function(){openModal('New chat',`<button class="list-row" data-action="select-room" data-id="kanana">${kananaBadge()}<strong>Kanana</strong></button>`);};
// English scaffolding, Korean target expressions: a beginner can understand the exercise.
Object.assign(kananaTitles,{hangul:'Hangul basics',first:'First greetings',coffee:'Ordering coffee',group:'Group introductions'});
const ncEnglishPrompts={hangul:['Combine ㄱ and ㅏ. Which syllable do they make?','Which vowel completes 나 (na)?','Join these three syllables to spell “banana”.'],first:['Accept the invitation politely.','Tell them you will be five minutes late.','Thank them and say you are nearly there.'],coffee:['Order one iced Americano politely.','Say you will drink it here.','Thank the barista.'],group:['Introduce yourself to the group.','Say you would like to join the photo.','Say you had fun and hope to meet again.']};
for(const id of kananaLessonIds)lessons[id].steps.forEach((q,i)=>q.prompt=ncEnglishPrompts[id][i]);
const ncLessonMessage=knMessage;
knMessage=function(m){return ncLessonMessage(m).replace('오늘은 무엇부터 배워볼까요?\n한 번에 3문제씩 함께 연습해요.','What would you like to practise?\nThree questions, one step at a time.');};
const ncOriginalRoomMessages=roomMessages;
roomMessages=function(){const id=activeRoom.replace('welcome-','');return newcomerCases[id]?ncMessages(id)+data.messages.filter(m=>m.room===activeRoom).map(m=>`<div class="chat-line me"><div class="message-content"><div class="bubble">${roomAttachment(m)}${esc(m.text)}</div></div></div>`).join(''):ncOriginalRoomMessages();};

document.addEventListener('click',event=>{if(view==='rooms'&&roomOpen&&activeRoom==='welcome-squid'&&event.target.closest('[data-action=community-back]')){event.preventDefault();event.stopImmediatePropagation();communityOpen=false;setView('rooms');}},true);
