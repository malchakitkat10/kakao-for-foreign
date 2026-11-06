'use strict';
// Adapted from supplied Katok UI MessageInput. Original source is retained in assets/katok.
function sourceInputIcon(name){return `<img src="assets/katok/input-${name}.svg" alt="" aria-hidden="true">`;}
function renderRoomInput(){return `<div class="source-room-composer"><div class="room-inline-search" hidden><label for="room-text-search">대화 검색</label><input id="room-text-search" type="search" placeholder="검색어 입력"><button type="button" data-action="room-search-close" aria-label="검색 닫기">닫기</button><span id="room-search-count" aria-live="polite"></span></div><form id="room-message-form" class="source-input-bar"><button type="button" class="source-input-circle" data-action="room-attach" aria-label="첨부">${sourceInputIcon('plus')}</button><label class="sr-only" for="room-message">메시지</label><textarea id="room-message" name="message" rows="1" maxlength="500" placeholder="메시지 입력" autocomplete="off"></textarea><button type="button" class="source-input-circle source-input-emoji" data-action="room-emoji" aria-label="이모티콘">${sourceInputIcon('emoji')}</button><button type="button" class="source-input-circle" data-action="room-hash" id="room-hash-button" aria-label="샵검색">${sourceInputIcon('hash')}</button><button type="submit" class="source-input-circle source-input-send" id="room-send-button" aria-label="전송" hidden>${sourceInputIcon('send')}</button></form><input type="file" id="room-photo" accept="image/png,image/jpeg,image/webp,image/gif" aria-label="사진 첨부" hidden></div>`;}
function updateRoomInput(){
 const input=document.getElementById('room-message');if(!input)return;
 const hasText=!!input.value.trim();document.getElementById('room-send-button').hidden=!hasText;document.getElementById('room-hash-button').hidden=hasText;
 input.style.height='auto';input.style.height=Math.min(input.scrollHeight,112)+'px';
}
function roomAttachment(m){return typeof m.image==='string'&&/^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(m.image)?`<img class="room-message-photo" src="${m.image}" alt="첨부 사진">`:'';}
document.addEventListener('input',event=>{
 if(event.target.id==='room-message')updateRoomInput();
 if(event.target.id==='room-text-search'){
  const term=event.target.value.trim().toLocaleLowerCase();let found=0;
  document.querySelectorAll('#room-messages .chat-line').forEach(row=>{const matches=term&&row.textContent.toLocaleLowerCase().includes(term);row.classList.toggle('room-search-match',!!matches);if(matches)found++;});
  document.getElementById('room-search-count').textContent=term?`${found}개`:'';
  document.querySelector('.room-search-match')?.scrollIntoView({block:'nearest'});
 }
});
document.addEventListener('keydown',event=>{
 if(event.target.id==='room-message'&&event.key==='Enter'&&!event.shiftKey&&!event.isComposing&&event.keyCode!==229){event.preventDefault();event.target.form.requestSubmit();}
});
document.addEventListener('click',event=>{
 const el=event.target.closest('[data-action]');if(!el)return;
 if(el.dataset.action==='room-attach')document.getElementById('room-photo').click();
 if(el.dataset.action==='room-emoji')openModal('이모티콘',`<div class="room-emoji-options">${['😊','👍','❤️','😂','👏','🎉','☕','👋'].map(x=>`<button type="button" data-action="room-insert-emoji" data-value="${x}" aria-label="${x}">${x}</button>`).join('')}</div>`);
 if(el.dataset.action==='room-insert-emoji'){const input=document.getElementById('room-message');if(!input)return;input.setRangeText(el.dataset.value,input.selectionStart,input.selectionEnd,'end');closeModal();updateRoomInput();input.focus();}
 if(el.dataset.action==='room-hash'){const panel=document.querySelector('.room-inline-search');panel.hidden=false;document.getElementById('room-text-search').focus();}
 if(el.dataset.action==='room-search-close'){document.querySelector('.room-inline-search').hidden=true;document.querySelectorAll('.room-search-match').forEach(x=>x.classList.remove('room-search-match'));document.getElementById('room-message').focus();}
});
document.addEventListener('change',async event=>{
 if(event.target.id!=='room-photo')return;
 const file=event.target.files[0],room=activeRoom;event.target.value='';if(!file)return;
 if(!['image/png','image/jpeg','image/webp','image/gif'].includes(file.type)){toast('PNG, JPG, WebP, GIF 사진을 선택해 주세요.');return;}
 if(file.size>1024*1024){toast('1MB 이하의 사진을 선택해 주세요.');return;}
 const reader=new FileReader();reader.onload=()=>{
  const message={room,text:'',image:reader.result,at:Date.now()};data.messages.push(message);
  if(!persist()){data.messages.splice(data.messages.indexOf(message),1);toast('저장 공간이 부족해 사진을 보내지 못했습니다.');return;}
  if(view==='rooms'&&activeRoom===room){const list=document.getElementById('room-messages');list.innerHTML=roomMessages();list.scrollTop=list.scrollHeight;}
 };reader.onerror=()=>toast('사진을 읽지 못했습니다.');reader.readAsDataURL(file);
});
