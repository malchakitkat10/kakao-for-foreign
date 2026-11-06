'use strict';

function roomRow(r){
  const last=r.messages[r.messages.length-1];
  return `<button type="button" class="list-row ${activeRoom===r.id?'active':''}" data-action="select-room" data-id="${r.id}">${avatar(r.id)}<span class="row-copy"><strong>${r.title} <em>3</em></strong><p>${last.text}</p></span><span class="row-side"><small>체험</small></span></button>`;
}
function roomMessages(){
  const room=roomData.find(r=>r.id===activeRoom);
  const messages=room.messages.map((m,i)=>`<div class="chat-line"><img class="avatar" src="assets/kakao/profile-${i%3+1}.png" alt=""><div class="message-content"><span class="message-name">${m.name}</span><div class="bubble">${m.text}</div></div><time class="message-time">오후 2:${String(30+i).padStart(2,'0')}</time></div>`).join('');
  const own=data.messages.filter(m=>m.room===activeRoom).map(m=>`<div class="chat-line me"><time class="message-time">${new Date(m.at||Date.now()).toLocaleTimeString('ko-KR',{hour:'numeric',minute:'2-digit'})}</time><div class="message-content">${m.card?studioCardMessage(m.card,'room:'+activeRoom):`<div class="bubble">${roomAttachment(m)}${esc(m.text)}</div>`}</div></div>`).join('');
  return `<div class="system-line"><span>${new Date().toLocaleDateString('ko-KR',{month:'long',day:'numeric',weekday:'long'})}</span></div>${messages}${own}`;
}
function renderRooms(){
  const room=roomData.find(r=>r.id===activeRoom),filtered=roomData.filter(r=>matchText(r.title+' '+r.description));
  return `<div class="split-view chat-view room-view ${roomOpen?'room-open':''}"><aside class="list-pane">${sectionTitle('오픈채팅',filtered.length)}${filtered.map(roomRow).join('')}${!filtered.length?empty('채팅방을 찾을 수 없습니다.'):''}</aside><section class="conversation ${data.chatTheme==='apeach'?'theme-apeach':''}" aria-label="${room.title}"><div class="conversation-header"><button class="icon-button back-button" data-action="room-back" aria-label="채팅 목록">${icon('back')}</button>${avatar(room.id)}<div><h2>${room.title}</h2><p>4명</p></div><div class="conversation-actions"><button class="icon-button" data-action="toggle-theme" aria-label="채팅 테마 바꾸기">${icon('palette')}</button><button class="icon-button" data-action="handoff" aria-label="채팅방 초대">${icon('plus')}</button></div></div><button type="button" class="source-notice-banner" data-action="quest" data-id="${room.id}" aria-label="공지: ${esc(worldQuests[room.id].title)}"><img src="assets/katok/notice-megaphone.svg" alt="" aria-hidden="true"><span>${esc(worldQuests[room.id].title)}</span></button><div class="messages" id="room-messages" aria-live="polite">${roomMessages()}</div>${renderRoomInput()}</section></div>`;
}
