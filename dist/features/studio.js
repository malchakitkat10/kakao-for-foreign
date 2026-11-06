'use strict';
/* 창작마당: 공식 IP 에셋 팩으로 템플릿 초안을 채우고, 채팅방·오픈채팅에 플레이 카드로 보냅니다.
   - 초안 생성은 아래 준비된 예시(studioDrafts)로 동작합니다. 실제 AI·공유 연동은 없습니다.
   - 표지는 assets.js의 기존 이미지를 CSS로만 잘라 씁니다. 새로 그린 그림은 없습니다. */

formats.quiz={label:'퀴즈',short:'퀴즈',title:'퀴즈',icon:'book',description:'선택형 퀴즈'};

Object.assign(iconPaths, {
  trash:'<path d="M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.5 1.5"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.5-1.5"/>',
  branch:'<path d="M7 4v7a4 4 0 0 0 4 4h8m-3-3 3 3-3 3"/>',
  pack:'<path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7Z"/><path d="M4 8.5 12 13l8-4.5M12 13v7"/>',
  shield:'<path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>'
});

/* 템플릿 4종: 기획안의 파일럿 순서(퀴즈 → 선택형 스토리 → 팬 챗봇 → 미니게임) */
const studioTemplates = {
  quiz:{name:'퀴즈', line:'“이 작품 얼마나 알아?” 5~10문항', unit:'문항', min:3, max:10, sec:12},
  story:{name:'선택형 스토리', line:'원작 장면에서 갈라지는 3~5컷 외전', unit:'컷', min:2, max:5, sec:20},
  chat:{name:'팬 챗봇', line:'‘만약 ~라면’ 설정으로 대화하는 캐릭터', unit:'대화', min:1, max:5, sec:0},
  game:{name:'미니게임', line:'성격 테스트처럼 규칙이 정해진 게임', unit:'질문', min:2, max:5, sec:10}
};

/* 표지: assets.js가 만든 CSS 변수(--assets-...)를 배경으로 쓰고 위치·크기로만 자릅니다.
   solo-leveling.jpg는 표지 4장이 든 보도 이미지라 위쪽 두 장(소설·웹툰)만 씁니다. */
const studioCovers = {
  'solo-webtoon':{img:'assets/official/solo-leveling.jpg', pos:'100% 11%', size:'200% auto', bg:'#1d1a33'},
  'solo-novel':{img:'assets/official/solo-leveling.jpg', pos:'0% 5%', size:'200% auto', bg:'#27303a'},
  'solo-face':{img:'assets/official/solo-leveling.jpg', pos:'80% 9%', size:'520% auto', bg:'#1d1a33'},
  'friends-duo':{img:'assets/kakao/friends.png', pos:'50% 62%', size:'auto 92%', bg:'#ffe1e4'},
  'friends-splash':{img:'assets/kakao/apeach-splash.png', pos:'50% 45%', size:'cover', bg:'#ffe1e4'},
  'friends-music':{img:'assets/kakao/local.png', pos:'50% 60%', size:'auto 90%', bg:'#efe7ff'},
  'apeach-face':{img:'assets/kakao/apeach-profile.png', pos:'50% 50%', size:'cover', bg:'#ffc5c7'},
  'cafe-room':{img:'assets/kiwi/cafe.png', pos:'50% 55%', size:'cover', bg:'#b9a089'},
  'cafe-tea':{img:'assets/kiwi/tea.png', pos:'50% 58%', size:'auto 80%', bg:'#e6eedc'},
  'cafe-party':{img:'assets/kiwi/party.png', pos:'50% 50%', size:'auto 80%', bg:'#eee8ff'},
  'mina-face':{img:'assets/kakao/profile-2.png', pos:'50% 50%', size:'cover', bg:'#9fc2e6'}
};

/* IP별 공식 에셋 팩: 이미지, 캐릭터 설정, 말투 가이드, 금지 목록 */
const studioOrder = ['solo'];
const studioPacks = {
  solo:{covers:['solo-webtoon','solo-novel'], character:{name:'성진우', cover:'solo-face'}, room:'solo', banned:['실존 인물 흉내','성적인 묘사','원작 결말 스포일러']},
  friends:{covers:['friends-duo','friends-splash','friends-music'], character:{name:'어피치', cover:'apeach-face'}, room:'friends', banned:['실존 인물 흉내','성적인 묘사','캐릭터 비하']},
  cafe:{covers:['cafe-room','cafe-tea','cafe-party'], character:{name:'미나', cover:'mina-face'}, room:'cafe', banned:['실존 인물 흉내','성적인 묘사','특정 가게 비방']}
};
const studioBlocked = ['실존 인물','실존인물','연예인','야한','19금','성적','섹시','노출'];
const studioDots = ['#fee500','#8fb6cc','#f2a7b5'];

/* 준비된 초안. ask는 요청 예시 칩, keys는 직접 쓴 요청과 맞춰 볼 낱말입니다.
   fromQuest가 있으면 data.js의 worldQuests 장면을 그대로 씁니다. */
const studioDrafts = {
  quiz:{
    solo:[
      {title:'그림자 던전 퀴즈', ask:'던전과 전투 위주로', keys:['던전','전투','어렵','찐팬','시스템'], cover:'solo-webtoon', items:[
        {q:'성진우가 처음 받은 헌터 등급은?', choices:['S급','E급','C급'], answer:1},
        {q:'성진우가 ‘시스템’을 얻게 된 곳은?', choices:['이중 던전','제주도','악마성'], answer:0},
        {q:'그림자 병사를 일으킬 때 외치는 말은?', choices:['돌아와라','멈춰라','일어나라'], answer:2},
        {q:'성진우의 여동생 이름은?', choices:['차해인','성진아','유진호'], answer:1},
        {q:'제주도 레이드에서 헌터들이 맞선 몬스터는?', choices:['개미','늑대','거미'], answer:0}]},
      {title:'나혼렙 입문 퀴즈', ask:'처음 보는 사람도 풀 수 있게 쉽게', keys:['쉽','입문','처음','기본','초보'], cover:'solo-novel', items:[
        {q:'성진우의 직업은?', choices:['헌터','기사','상인'], answer:0},
        {q:'나 혼자만 레벨업 웹툰을 볼 수 있는 곳은?', choices:['멜론','카카오페이지','카카오맵'], answer:1},
        {q:'헌터들이 몬스터와 싸우는 곳은?', choices:['던전','도서관','카페'], answer:0},
        {q:'그림자 병사들이 따르는 성진우의 칭호는?', choices:['검의 왕','그림자 군주','던전 마스터'], answer:1},
        {q:'던전으로 들어가는 입구를 부르는 말은?', choices:['터널','게이트','정류장'], answer:1}]}
    ],
    friends:[
      {title:'카카오프렌즈 찐팬 퀴즈', ask:'캐릭터 설정 위주로', keys:['캐릭터','설정','찐팬','어렵'], cover:'friends-duo', items:[
        {q:'라이언의 콤플렉스는?', choices:['꼬리가 짧다','갈기가 없다','키가 작다'], answer:1},
        {q:'단무지가 토끼 옷을 입은 캐릭터는?', choices:['무지','어피치','튜브'], answer:0},
        {q:'라이언이 데려와 함께 사는 고양이는?', choices:['네오','프로도','춘식이'], answer:2},
        {q:'화가 나면 얼굴이 초록색으로 변하는 오리는?', choices:['튜브','콘','제이지'], answer:0},
        {q:'어피치는 어떤 과일일까요?', choices:['딸기','복숭아','자두'], answer:1}]},
      {title:'프렌즈 피크닉 퀴즈', ask:'피크닉 상황 한국어로 쉽게', keys:['피크닉','한국어','쉽','표현'], cover:'friends-splash', items:[
        {q:'피크닉에 김밥을 가져가자고 공손하게 말하면?', choices:['김밥 가져갈까요?','김밥 가져가.','김밥이다.'], answer:0},
        {q:'“ㄱㄱ”는 어떤 뜻일까요?', choices:['고마워','가자','괜찮아'], answer:1},
        {q:'서울에서 돗자리 피크닉으로 유명한 곳은?', choices:['한강공원','인천공항','지하철역'], answer:0},
        {q:'춘식이가 좋아하는 간식은?', choices:['당근','고구마','바나나'], answer:1},
        {q:'밥 먹기 전에 하는 인사는?', choices:['잘 먹겠습니다','잘 가요','수고하세요'], answer:0}]}
    ],
    cafe:[
      {title:'카페 한국어 퀴즈', ask:'주문할 때 쓰는 표현 위주로', keys:['주문','표현','한국어','메뉴'], cover:'cafe-tea', items:[
        {q:'“아아”는 무엇의 줄임말일까요?', choices:['아이스 아메리카노','아침 아메리카노','아이스 아이스티'], answer:0},
        {q:'직원에게 공손하게 주문하는 말은?', choices:['아메리카노 줘.','아메리카노 한 잔 주세요.','아메리카노 하나.'], answer:1},
        {q:'“매장에서 드시나요?”에 알맞은 대답은?', choices:['응, 마셔.','먹는다.','네, 여기서 마실게요.'], answer:2},
        {q:'음료가 준비되면 울리는 물건은?', choices:['진동벨','초인종','알람시계'], answer:0},
        {q:'“ㄱㅅ”는 무슨 뜻일까요?', choices:['가자','감사','괜찮아'], answer:1}]},
      {title:'성수 카페 생활 퀴즈', ask:'카페 생활과 여행 상황으로', keys:['생활','여행','성수','쉽'], cover:'cafe-room', items:[
        {q:'성수동은 어느 도시에 있을까요?', choices:['부산','서울','제주'], answer:1},
        {q:'빈자리인지 물을 때 쓰는 말은?', choices:['여기 자리 있어요?','여기 내 자리.','비켜 주세요.'], answer:0},
        {q:'“포장해 갈게요”와 같은 뜻의 말은?', choices:['테이크아웃할게요','여기서 마실게요','환불해 주세요'], answer:0},
        {q:'따뜻한 음료를 고를 때 붙이는 말은?', choices:['아이스','핫','라지'], answer:1},
        {q:'“같이 가요?”에 공손하게 답하면?', choices:['가자.','ㄱㄱ','좋아요. 같이 가요.'], answer:2}]}
    ]
  },
  story:{
    solo:[
      {title:'그림자 던전 외전', ask:'던전 진입부터 전투까지', keys:['던전','전투','진입'], cover:'solo-webtoon', fromQuest:'solo'},
      {title:'헌터의 쉬는 날', ask:'던전 없는 날의 코믹한 일상', keys:['일상','쉬는','코믹','카페'], cover:'solo-novel', items:[
        {title:'던전이 없는 날', text:'오늘은 게이트가 열리지 않았어요. 진아가 카페에 가자고 해요.', choices:['같이 간다','집에서 쉰다','산책부터 한다']},
        {title:'몰래 따라온 그림자', text:'카페에 앉았는데 테이블 밑 그림자가 꿈틀거려요.', choices:['모른 척한다','조용히 돌려보낸다','같이 앉힌다']},
        {title:'주문할 차례', text:'진아가 “오빠가 주문해” 하며 메뉴판을 건넸어요.', choices:['아이스 아메리카노 두 잔 주세요','진아가 고른 걸로 할게요','케이크도 하나 주세요']}],
        endings:['카페에서 보낸 휴일','집에서 보낸 휴일','산책으로 시작한 휴일']}
    ],
    friends:[
      {title:'프렌즈 피크닉 이야기', ask:'피크닉 준비 이야기로', keys:['피크닉','준비','소풍'], cover:'friends-splash', fromQuest:'friends'},
      {title:'어피치의 비밀 레시피', ask:'디저트를 만드는 코믹한 외전', keys:['디저트','요리','코믹','레시피'], cover:'friends-music', items:[
        {title:'복숭아 파티 준비', text:'어피치가 친구들을 위해 디저트를 만들기로 했어요.', choices:['복숭아 빙수','복숭아 케이크','복숭아 쿠키']},
        {title:'사라진 복숭아', text:'냉장고를 열었더니 복숭아가 하나도 없어요! 누가 먹었을까요?', choices:['라이언에게 물어본다','무지를 찾아간다','시장에 간다']},
        {title:'초대 메시지', text:'디저트가 완성됐어요. 친구들에게 뭐라고 보낼까요?', choices:['다들 우리 집으로 와!','디저트 먹을 사람?','오늘 파티 어때?']}],
        endings:['시원한 빙수 파티','달콤한 케이크 파티','바삭한 쿠키 파티']}
    ],
    cafe:[
      {title:'성수 카페 이야기', ask:'카페 자리와 준비물 고르기', keys:['자리','준비물','성수'], cover:'cafe-room', fromQuest:'cafe'},
      {title:'카페에서 만난 편지', ask:'편지로 시작하는 미스터리', keys:['편지','미스터리','비밀'], cover:'cafe-tea', items:[
        {title:'테이블 위의 편지', text:'단골 카페에서 낯선 편지를 발견했어요. “오늘 3시, 창가 자리에서 만나요.”', choices:['편지를 열어본다','바리스타에게 물어본다']},
        {title:'편지를 쓴 사람', text:'편지 안에는 작은 카페 지도가 들어 있었어요. 뒷면에는 “같이 가요?”라는 한마디가 적혀 있어요.', choices:['약속 장소로 간다','함께 갈 친구를 부른다']},
        {title:'3시, 창가 자리', text:'창가 자리에 미나가 앉아 있어요. “와 주셨네요! 같이 카페 투어 해요.”', choices:['좋아요. 같이 가요.','친구도 불러도 될까요?']}],
        endings:['편지를 연 오후','바리스타가 알려 준 비밀']}
    ]
  },
  chat:{
    solo:[
      {title:'카페 알바생 성진우', ask:'카페 알바생 설정으로', keys:['카페','알바','주문'], cover:'solo-webtoon',
        bot:{ifLine:'성진우가 서울 카페 알바생이라면', tone:'존댓말', greeting:'어서 오세요. 오늘은 던전 대신 카페를 지키고 있어요. 주문하시겠어요?'}, items:[
        {ask:'추천 메뉴는요?', reply:'아이스 아메리카노요. 레이드 끝나고 마시면 제일 시원해요.'},
        {ask:'오늘 던전은 안 가요?', reply:'오늘은 쉬는 날이에요. 게이트가 열리면 바로 가야 하지만요.'},
        {ask:'그림자 병사들은 어디 있어요?', reply:'…주방에서 설거지를 돕고 있어요. 비밀이에요.'}]},
      {title:'신입 헌터 상담소', ask:'신입 헌터 고민 상담으로', keys:['상담','고민','신입','헌터'], cover:'solo-novel',
        bot:{ifLine:'성진우가 신입 헌터의 고민을 들어 준다면', tone:'존댓말', greeting:'처음 헌터가 됐다고요? 무엇이든 물어보세요.'}, items:[
        {ask:'처음 던전이 무서워요', reply:'저도 처음엔 E급이었어요. 혼자 들어가지 말고 꼭 팀과 함께 가세요.'},
        {ask:'강해지려면 어떻게 해요?', reply:'매일 조금씩이요. 저는 매일 퀘스트를 한 번도 빼먹지 않았어요.'},
        {ask:'쉬는 날엔 뭐 해요?', reply:'진아랑 밥 먹어요. 그게 제일 좋아요.'}]}
    ],
    friends:[
      {title:'카페 알바생 어피치', ask:'카페 알바생 설정으로', keys:['카페','알바','음료'], cover:'friends-duo',
        bot:{ifLine:'어피치가 서울 카페 알바생이라면', tone:'반말', greeting:'안녕! 오늘은 내가 음료를 만들어 줄게. 뭐 마실래?'}, items:[
        {ask:'추천 메뉴 알려 줘', reply:'복숭아 아이스티! 이건 진짜 내가 제일 잘 만들어.'},
        {ask:'라이언은 어디 있어?', reply:'춘식이랑 산책 갔어. 곧 올 거야!'},
        {ask:'한국어 하나 알려 줘', reply:'“맛있게 드세요!” 음료를 건넬 때 쓰는 말이야.'}]},
      {title:'서울 가이드 어피치', ask:'서울 여행 가이드 설정으로', keys:['여행','가이드','서울'], cover:'friends-splash',
        bot:{ifLine:'어피치가 서울 여행 가이드라면', tone:'반말', greeting:'서울에 온 걸 환영해! 어디부터 가 볼까?'}, items:[
        {ask:'피크닉 하기 좋은 곳은?', reply:'한강공원! 돗자리 펴고 김밥 먹으면 최고야.'},
        {ask:'길을 물을 때는 뭐라고 해?', reply:'“여기 어떻게 가요?”라고 물어봐. 다들 친절하게 알려 줄 거야.'},
        {ask:'기념품 추천해 줘', reply:'당연히 내 인형이지! 복숭아 향은 안 나지만 귀여워.'}]}
    ],
    cafe:[
      {title:'바리스타 미나', ask:'카페 바리스타 설정으로', keys:['바리스타','카페','주문'], cover:'cafe-tea',
        bot:{ifLine:'미나가 성수 카페 바리스타라면', tone:'존댓말', greeting:'안녕하세요! 오늘은 제가 주문을 받을게요. 천천히 골라 보세요.'}, items:[
        {ask:'추천해 주세요', reply:'오늘은 바닐라 라테가 인기예요. 달달한 거 좋아하세요?'},
        {ask:'와이파이 비밀번호는요?', reply:'영수증 아래에 적혀 있어요. 못 찾으시면 다시 불러 주세요.'},
        {ask:'제 한국어 어때요?', reply:'주문하는 말이 정말 자연스러워요! 다음엔 “덜 달게 해 주세요”도 써 보세요.'}]},
      {title:'언어 교환 친구 미나', ask:'언어 교환 친구 설정으로', keys:['언어','교환','친구','한국어'], cover:'cafe-party',
        bot:{ifLine:'미나가 언어 교환 모임 친구라면', tone:'존댓말', greeting:'반가워요! 오늘은 한국어로만 이야기해 볼까요?'}, items:[
        {ask:'주말에 뭐 해요?', reply:'성수 카페 투어 가요. 같이 갈래요?'},
        {ask:'“ㅋㅋ”랑 “ㅎㅎ”는 달라요?', reply:'“ㅋㅋ”는 크게 웃는 느낌, “ㅎㅎ”는 살짝 웃는 느낌이에요.'},
        {ask:'늦을 때는 뭐라고 해요?', reply:'“5분 늦을 것 같아요. 죄송해요.”라고 보내면 돼요.'}]}
    ]
  },
  game:{
    solo:[
      {title:'나의 헌터 스타일 테스트', ask:'전투 스타일로 나누기', keys:['전투','스타일','공략'], cover:'solo-webtoon',
        results:[{name:'정면 돌파형', line:'문이 열리면 먼저 뛰어드는 헌터'},{name:'그림자 잠입형', line:'보이지 않게 움직여 빈틈을 노리는 헌터'},{name:'지원형', line:'동료가 싸울 틈을 만들어 주는 헌터'}], items:[
        {q:'게이트가 열렸어요. 가장 먼저 할 일은?', choices:['바로 들어간다','주변부터 살핀다','동료를 부른다']},
        {q:'보스 몬스터가 나타났어요!', choices:['정면으로 공격한다','뒤로 돌아 들어간다','동료에게 기회를 만든다']},
        {q:'레이드가 끝났어요. 나는?', choices:['다음 던전을 찾는다','혼자 조용히 쉰다','팀과 밥을 먹는다']}]},
      {title:'나의 헌터 등급 테스트', ask:'헌터 등급으로 재밌게', keys:['등급','랭크','재밌'], cover:'solo-novel',
        results:[{name:'S급 헌터', line:'혼자서도 던전을 정리하는 최강자'},{name:'A급 헌터', line:'팀을 이끄는 믿음직한 공략대장'},{name:'E급 헌터', line:'아직 약하지만 누구보다 빨리 크는 중'}], items:[
        {q:'던전 공략 전날 밤, 나는?', choices:['장비를 점검한다','팀원과 작전을 짠다','일단 푹 잔다']},
        {q:'처음 보는 몬스터를 만나면?', choices:['혼자 처리한다','팀에게 신호를 보낸다','일단 피한다']},
        {q:'매일 퀘스트로 팔굽혀펴기 100개가 나왔어요.', choices:['다 하고 더 한다','팀원과 같이 한다','내일부터 한다']}]}
    ],
    friends:[
      {title:'피크닉에서 나는 어떤 프렌즈?', ask:'프렌즈 캐릭터 유형으로', keys:['캐릭터','유형','피크닉'], cover:'friends-duo',
        results:[{name:'라이언형', line:'돗자리부터 펴는 듬직한 리더'},{name:'어피치형', line:'분위기를 띄우는 장난꾸러기'},{name:'춘식이형', line:'그늘에서 고구마를 먹는 느긋한 타입'}], items:[
        {q:'피크닉 날 아침, 나는?', choices:['준비물부터 챙긴다','친구들에게 연락한다','5분만 더 잔다']},
        {q:'돗자리에 앉으면 제일 먼저?', choices:['도시락을 나눈다','사진부터 찍는다','바로 눕는다']},
        {q:'피크닉에 꼭 가져갈 것은?', choices:['돗자리','카메라','간식']}]},
      {title:'오늘의 프렌즈 기분 테스트', ask:'오늘 기분으로 가볍게', keys:['기분','오늘','가볍'], cover:'friends-music',
        results:[{name:'신나는 어피치', line:'오늘은 뭐든 즐거운 날'},{name:'차분한 라이언', line:'조용히 생각을 정리하는 날'},{name:'느긋한 춘식이', line:'아무것도 안 해도 좋은 날'}], items:[
        {q:'지금 듣고 싶은 노래는?', choices:['신나는 댄스곡','잔잔한 발라드','아무 노래나']},
        {q:'친구에게 보낼 이모티콘은?', choices:['춤추는 이모티콘','고개를 끄덕이는 이모티콘','잠자는 이모티콘']},
        {q:'오늘 저녁 계획은?', choices:['친구랑 논다','혼자 책을 읽는다','일찍 잔다']}]}
    ],
    cafe:[
      {title:'나에게 맞는 서울 카페는?', ask:'카페 자리 유형으로', keys:['자리','유형','카페'], cover:'cafe-room',
        results:[{name:'창가 자리형', line:'거리를 보며 혼자 쉬는 게 좋은 타입'},{name:'테라스형', line:'바람과 햇살을 좋아하는 타입'},{name:'큰 테이블형', line:'새로운 사람과 어울리는 타입'}], items:[
        {q:'카페에 들어가면 먼저 보는 곳은?', choices:['창밖 풍경','테라스','사람들이 모인 곳']},
        {q:'카페에서 하고 싶은 일은?', choices:['책 읽기','햇볕 쬐기','새 친구 사귀기']},
        {q:'주문하고 싶은 메뉴는?', choices:['따뜻한 라테','아이스 아메리카노','다 같이 나눌 케이크']}]},
      {title:'나의 카페 메뉴 테스트', ask:'메뉴 취향으로 가볍게', keys:['메뉴','취향','가볍'], cover:'cafe-tea',
        results:[{name:'아아파', line:'계절에 상관없이 아이스 아메리카노'},{name:'라테파', line:'부드럽고 따뜻한 한 잔'},{name:'디저트파', line:'음료보다 케이크가 먼저'}], items:[
        {q:'아침에 가장 먼저 찾는 것은?', choices:['시원한 커피','따뜻한 음료','달콤한 빵']},
        {q:'카페에서 고르는 자리는?', choices:['금방 나갈 수 있는 자리','푹신한 소파','진열장 앞자리']},
        {q:'친구가 메뉴를 추천해 달래요.', choices:['“아아 마셔”','“라테 어때?”','“케이크부터 골라!”']}]}
    ]
  }
};

let studioState = {mode:'home', world:'solo', draft:null, generating:false, reveal:false, askError:'', timer:0};
let studioPlay = null;

/* ---------- helpers ---------- */
const studioClone = value => JSON.parse(JSON.stringify(value));
const studioReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const studioClock = () => new Date().toLocaleTimeString('ko-KR', {hour:'numeric', minute:'2-digit'});
function studioCover(id, cls = '', inner = '') {
  const c = studioCovers[id] || studioCovers['cafe-room'];
  return `<span class="st-cover ${cls}" style="--st-img:url('${c.img}');--st-pos:${c.pos};--st-size:${c.size};--st-bg:${c.bg}" aria-hidden="true">${inner}</span>`;
}
function studioJosa(word) {
  const s = String(word).replace(/[^가-힣A-Za-z0-9]+$/, ''), code = s.charCodeAt(s.length - 1);
  if (code >= 0xAC00 && code <= 0xD7A3) return (code - 0xAC00) % 28 ? '이에요' : '예요';
  return /[0-9]$/.test(s) ? '이에요' : '예요';
}
function studioVariants(format, world) { return (studioDrafts[format] || studioDrafts.quiz)[world] || studioDrafts[format].cafe; }
function studioBuild(world, format, variant = 0) {
  const list = studioVariants(format, world), index = ((variant % list.length) + list.length) % list.length, v = list[index];
  const q = v.fromQuest && worldQuests[v.fromQuest];
  const items = q ? q.steps.map(s => ({title:s.title, text:s.text, choices:s.choices.map(c => c[0])})) : v.items;
  const endings = q ? q.resultNames : v.endings;
  return {id:null, world, format, variant:index, prompt:'', status:'draft', sentTo:[], dirty:false,
    ...studioClone({title:v.title, cover:v.cover, items, endings, results:v.results, bot:v.bot})};
}
function studioNormalize(c) {
  if (!c) return null;
  const format = studioTemplates[c.format] ? c.format : 'quiz', world = studioPacks[c.world] ? c.world : 'cafe';
  if (Array.isArray(c.items) && c.items.length) return {...studioClone(c), format, world, sentTo:c.sentTo || []};
  const base = studioBuild(world, format, 0); /* 이전 버전의 창작물(제목·요청만 있는 기록)을 초안으로 채웁니다. */
  return {...base, id:c.id, title:c.title || base.title, prompt:c.prompt || '', status:c.status || 'draft'};
}
function studioMeta(c) {
  const t = studioTemplates[c.format], n = (c.items || []).length;
  if (c.format === 'chat') return `만약 ${c.bot ? c.bot.ifLine : ''}`;
  const s = n * t.sec;
  return `${t.name} · ${n}${t.unit} · ${s < 45 ? '30초' : s < 90 ? '약 1분' : '약 ' + Math.round(s / 60) + '분'}`;
}
function studioStore(d) {
  const rec = studioClone({id:d.id || 'c' + Date.now().toString(36), title:d.title.trim() || studioTemplates[d.format].name, world:d.world, format:d.format,
    variant:d.variant, prompt:d.prompt, cover:d.cover, items:d.items, endings:d.endings, results:d.results, bot:d.bot,
    status:d.status, sentTo:d.sentTo || [], updatedAt:Date.now()});
  const at = data.creations.findIndex(c => c.id === rec.id);
  if (at >= 0) data.creations[at] = rec; else data.creations.unshift(rec);
  d.id = rec.id; d.dirty = false; persist();
  return rec;
}
function studioSet(obj, path, value) {
  const keys = path.split('.'); let o = obj;
  for (let i = 0; i < keys.length - 1; i++) { o = o[keys[i]]; if (o == null) return; }
  o[keys[keys.length - 1]] = value;
}
function studioGrow(el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; }
function studioScrollEnd(id) { requestAnimationFrame(() => { const el = document.getElementById(id); if (el) el.scrollTop = el.scrollHeight; }); }

/* 스튜디오 안에서 다시 그릴 때는 스크롤 위치와 포커스를 지킵니다. */
function studioRender() {
  const scroller = document.querySelector('#content .st-scroll'), top = scroller ? scroller.scrollTop : 0;
  const focusId = document.activeElement && document.activeElement.id;
  render();
  const next = document.querySelector('#content .st-scroll'); if (next) next.scrollTop = top;
  if (focusId) { const f = document.getElementById(focusId); if (f && f !== document.activeElement) f.focus({preventScroll:true}); }
  document.querySelectorAll('.st-maker textarea').forEach(studioGrow);
}

/* ---------- home ---------- */
function studioMini(format, world) {
  const v = studioBuild(world, format, 0), av = studioCover(v.cover, 'st-m-av');
  if (format === 'quiz') return `<span class="st-m-row">${av}<span class="st-m-bubble">1. ${esc(v.items[0].q)}</span></span><span class="st-m-chips">${v.items[0].choices.map(c => `<span>${esc(c)}</span>`).join('')}</span>`;
  if (format === 'story') return `<span class="st-m-row">${av}<span class="st-m-bubble">${esc(v.items[0].text)}</span></span><span class="st-m-opts">${v.items[0].choices.slice(0, 2).map(c => `<span>${esc(c)}</span>`).join('')}</span>`;
  if (format === 'chat') return `<span class="st-m-row">${studioCover(studioPacks[world].character.cover, 'st-m-av')}<span class="st-m-bubble">${esc(v.bot.greeting)}</span></span><span class="st-m-me">${esc(v.items[0].ask)}</span>`;
  return `<span class="st-m-row">${av}<span class="st-m-bubble">${esc(v.items[0].q)}</span></span><span class="st-m-result"><small>나의 결과</small>${esc(v.results[1].name)}</span>`;
}
function studioWorkRow(c) {
  const sent = c.status === 'sent', last = sent && c.sentTo.length ? ` · ${c.sentTo[c.sentTo.length - 1]}에 보냄` : '';
  return `<button type="button" class="st-work" data-action="studio-edit" data-id="${esc(c.id)}">${studioCover(c.cover, 'st-work-thumb')}<span class="st-work-copy"><strong>${esc(c.title)}</strong><span>${esc(studioTemplates[c.format].name + ' · ' + getWorld(c.world).short + last)}</span></span><span class="st-status${sent ? ' sent' : ''}">${sent ? '보냄' : '임시저장'}</span></button>`;
}
function studioEntry(){
 if(!studioOrder.includes(studioState.world))studioState.world=studioOrder[0];
 const world=studioState.world,pack=studioPacks[world],w=getWorld(world);
 return `<section class="studio-entry" aria-label="에셋 팩으로 만들기">
    <div class="st-h"><h2>어떤 작품으로 만들까요?</h2></div>
    <div class="st-ips">${studioOrder.map(id => { const x = getWorld(id), on = id === world;
      return `<button type="button" class="st-ip" id="st-ip-${id}" data-action="studio-world" data-id="${id}" aria-pressed="${on}">${studioCover(studioPacks[id].covers[0], 'st-ip-art', on ? `<span class="st-ip-check">${icon('check')}</span>` : '')}<strong>${esc(x.name)}</strong><span>${esc(x.flag)}</span></button>`; }).join('')}</div>
    <div class="st-pack">${icon('pack')}<div><strong>${esc(w.name)} 공식 에셋 팩</strong><span>이미지 ${pack.covers.length}장 · 캐릭터 설정 · 말투 가이드</span></div></div>
    <div class="st-h"><h2>무엇을 만들까요?</h2></div>
    <div class="st-templates">${Object.entries(studioTemplates).map(([id, t]) => `<button type="button" class="st-template" data-action="studio-start" data-id="${id}" aria-label="${t.name} 만들기"><span class="st-template-stage" aria-hidden="true">${studioMini(id, world)}</span><span class="st-template-copy"><strong>${t.name}</strong><span>${t.line}</span></span></button>`).join('')}</div>
 </section>`;
}
function studioHome() {
  const world = studioState.world, pack = studioPacks[world], w = getWorld(world);
  const works = data.creations.map(studioNormalize).filter(c => c && matchText(c.title + ' ' + getWorld(c.world).name + ' ' + studioTemplates[c.format].name));
  return `<div class="st-home st-scroll">
    ${studioEntry()}
    ${works.length ? `<div class="st-h"><h2>내 작품<span>${works.length}</span></h2></div><div class="st-works">${works.map(studioWorkRow).join('')}</div>` : searchQuery ? '<p class="st-empty">검색 결과가 없습니다.</p>' : ''}
  </div>`;
}

/* ---------- maker ---------- */
function studioCard(c, {stage = false, ctx = ''} = {}) {
  const play = stage ? 'data-action="studio-preview"' : `data-action="studio-play" data-id="${esc(c.id)}"${ctx ? ` data-from="${esc(ctx)}"` : ''}`;
  return `<article class="st-card" aria-label="${esc(c.title)}, Fan-made 플레이 카드">${studioCover(c.cover, 'st-card-cover', '<span class="st-fan">Fan-made</span>')}<div class="st-card-body"><strong class="st-card-title" data-live="title">${esc(c.title || '제목 없음')}</strong><span class="st-card-meta" data-live="meta">${esc(studioMeta(c))}</span><span class="st-card-ip">${esc(getWorld(c.world).name)}</span></div><button type="button" class="st-card-play" ${play}>${c.format === 'chat' ? '대화하기' : '플레이'}</button></article>`;
}
function studioCardSkeleton() {
  return '<article class="st-card is-skeleton" aria-hidden="true"><span class="st-cover st-card-cover"></span><span class="st-card-body"><span class="st-bar w70"></span><span class="st-bar w45"></span></span><span class="st-card-play"></span></article>';
}
function studioSkeleton() {
  return `<section class="st-sec"><p class="st-filling" role="status">공식 에셋 팩으로 초안을 채우는 중</p>${[80, 64, 72].map(n => `<div class="st-item is-skeleton"><span class="st-bar w${n}"></span><span class="st-bar w45"></span><span class="st-bar w60"></span></div>`).join('')}</section>`;
}
function studioDelButton(i, n, t) {
  return `<button type="button" class="st-item-del" data-action="studio-del" data-index="${i}" aria-label="${i + 1}번 ${t.unit} 삭제" ${n <= t.min ? 'disabled' : ''}>${icon('trash')}</button>`;
}
function studioAddButton(d, label) {
  const t = studioTemplates[d.format];
  return d.items.length < t.max ? `<button type="button" class="st-add" data-action="studio-add">${icon('plus')} ${label}</button>` : '';
}
function studioAskSection(d) {
  const list = studioVariants(d.format, d.world), busy = studioState.generating;
  return `<section class="st-sec">
    <div class="st-sec-h"><h3><label for="st-ask">요청</label></h3><span>한 줄로 쓰면 에셋 팩 안에서 초안을 다시 채워요</span></div>
    <form class="st-ask" id="st-ask-form"><div class="st-field"><input id="st-ask" name="ask" maxlength="60" autocomplete="off" value="${esc(studioState.askText != null ? studioState.askText : d.prompt)}" placeholder="예: ${esc(list[(d.variant + 1) % list.length].ask)}" aria-describedby="st-ask-error"></div><button class="st-regen" id="st-regen" type="submit" ${busy ? 'disabled' : ''}>${icon('spark')}<span>${busy ? '채우는 중' : '다시 만들기'}</span></button></form>
    <div class="st-chips" aria-label="요청 예시">${list.map((v, i) => `<button type="button" class="st-chip" id="st-chip-${i}" data-action="studio-ask" data-index="${i}" aria-pressed="${!busy && d.variant === i && d.prompt === v.ask}" ${busy ? 'disabled' : ''}>${esc(v.ask)}</button>`).join('')}</div>
    <p class="st-ask-error" id="st-ask-error" role="alert">${esc(studioState.askError)}</p>
  </section>`;
}
function studioLookSection(d) {
  const pack = studioPacks[d.world];
  return `<section class="st-sec">
    <div class="st-sec-h"><h3><label for="st-title">제목</label></h3><span class="st-count" id="st-title-count">${[...d.title].length}/30</span></div>
    <div class="st-field"><input id="st-title" data-bind="title" maxlength="30" value="${esc(d.title)}" autocomplete="off"></div>
    <div class="st-sec-h st-sub-h"><h3>표지</h3><span>공식 이미지 ${pack.covers.length}장</span></div>
    <div class="st-covers" role="radiogroup" aria-label="표지 고르기">${pack.covers.map((id, i) => `<button type="button" class="st-cover-opt" id="st-cover-${id}" role="radio" aria-checked="${d.cover === id}" aria-label="표지 ${i + 1}" data-action="studio-cover" data-id="${id}">${studioCover(id)}</button>`).join('')}</div>
  </section>`;
}
function studioQuizEditor(d) {
  const t = studioTemplates.quiz, n = d.items.length;
  return `<section class="st-sec"><div class="st-sec-h"><h3>문항</h3><span>${n} / ${t.max}</span><span class="st-sec-hint">동그라미를 누르면 정답이 바뀌어요</span></div>
    <div class="st-items">${d.items.map((it, i) => `<article class="st-item" style="--i:${i}">
      <div class="st-item-head"><span class="st-item-no">${i + 1}</span><label class="sr-only" for="st-q-${i}">${i + 1}번 문제</label><textarea id="st-q-${i}" class="st-q" rows="1" maxlength="80" data-bind="items.${i}.q" placeholder="문제를 입력하세요">${esc(it.q)}</textarea>${studioDelButton(i, n, t)}</div>
      <div class="st-choices" role="radiogroup" aria-label="${i + 1}번 정답">${it.choices.map((c, j) => `<div class="st-choice"><input class="st-radio" type="radio" id="st-a-${i}-${j}" name="st-a-${i}" value="${j}" data-bind="items.${i}.answer" data-type="number" ${it.answer === j ? 'checked' : ''}><label class="st-mark" for="st-a-${i}-${j}"><span class="sr-only">보기 ${j + 1}을 정답으로</span>${icon('check')}</label><input class="st-choice-input" id="st-c-${i}-${j}" maxlength="30" data-bind="items.${i}.choices.${j}" value="${esc(c)}" aria-label="${i + 1}번 보기 ${j + 1}" placeholder="보기 ${j + 1}"><span class="st-answer-tag" aria-hidden="true">정답</span></div>`).join('')}</div>
    </article>`).join('')}</div>${studioAddButton(d, '문항 추가')}</section>`;
}
function studioStoryEditor(d) {
  const t = studioTemplates.story, n = d.items.length, first = (d.items[0] || {}).choices || [];
  return `<section class="st-sec"><div class="st-sec-h"><h3>장면</h3><span>${n} / ${t.max}</span></div>
    <div class="st-items">${d.items.map((it, i) => `<article class="st-item" style="--i:${i}">
      <div class="st-item-head"><span class="st-item-no">${i + 1}</span><label class="sr-only" for="st-t-${i}">${i + 1}컷 제목</label><input id="st-t-${i}" class="st-cut-title" maxlength="24" data-bind="items.${i}.title" value="${esc(it.title)}" placeholder="장면 제목">${studioDelButton(i, n, t)}</div>
      <label class="sr-only" for="st-x-${i}">${i + 1}컷 내용</label><textarea id="st-x-${i}" class="st-cut-text" rows="2" maxlength="160" data-bind="items.${i}.text" placeholder="장면을 설명해 주세요">${esc(it.text)}</textarea>
      <div class="st-choices">${it.choices.map((c, j) => `<div class="st-choice"><span class="st-branch" aria-hidden="true">${icon('branch')}</span><input class="st-choice-input" id="st-c-${i}-${j}" maxlength="30" data-bind="items.${i}.choices.${j}" value="${esc(c)}" aria-label="${i + 1}컷 선택지 ${j + 1}" placeholder="선택지 ${j + 1}"></div>`).join('')}</div>
    </article>`).join('')}</div>${studioAddButton(d, '장면 추가')}</section>
    <section class="st-sec"><div class="st-sec-h"><h3>엔딩</h3><span>1컷에서 고른 선택지에 따라 달라져요</span></div>
    <div class="st-endings">${(d.endings || []).map((e, j) => `<div class="st-ending"><span class="st-ending-from" data-index="${j}">${esc(first[j] || '선택지 ' + (j + 1))}</span>${icon('arrow')}<input id="st-e-${j}" maxlength="24" data-bind="endings.${j}" value="${esc(e)}" aria-label="선택지 ${j + 1}의 엔딩 이름"></div>`).join('')}</div></section>`;
}
function studioGameEditor(d) {
  const t = studioTemplates.game, n = d.items.length;
  return `<section class="st-sec"><div class="st-sec-h"><h3>결과</h3><span>가장 많이 고른 쪽이 결과가 돼요</span></div>
    <div class="st-results">${d.results.map((r, j) => `<div class="st-result-edit" style="--dot:${studioDots[j]}"><span class="st-dot" aria-hidden="true"></span><div><input id="st-r-${j}" class="st-result-name" maxlength="16" data-bind="results.${j}.name" value="${esc(r.name)}" aria-label="결과 ${j + 1} 이름"><input class="st-result-line" maxlength="40" data-bind="results.${j}.line" value="${esc(r.line)}" aria-label="결과 ${j + 1} 설명"></div></div>`).join('')}</div></section>
    <section class="st-sec"><div class="st-sec-h"><h3>질문</h3><span>${n} / ${t.max}</span></div>
    <div class="st-items">${d.items.map((it, i) => `<article class="st-item" style="--i:${i}">
      <div class="st-item-head"><span class="st-item-no">${i + 1}</span><label class="sr-only" for="st-q-${i}">${i + 1}번 질문</label><textarea id="st-q-${i}" class="st-q" rows="1" maxlength="80" data-bind="items.${i}.q" placeholder="질문을 입력하세요">${esc(it.q)}</textarea>${studioDelButton(i, n, t)}</div>
      <div class="st-choices">${it.choices.map((c, j) => `<div class="st-choice" style="--dot:${studioDots[j]}"><span class="st-dot" aria-hidden="true"></span><input class="st-choice-input" id="st-c-${i}-${j}" maxlength="30" data-bind="items.${i}.choices.${j}" value="${esc(c)}" aria-label="${i + 1}번 선택지 ${j + 1}" placeholder="선택지 ${j + 1}"><span class="st-choice-to" data-result="${j}">${esc((d.results[j] || {}).name || '')}</span></div>`).join('')}</div>
    </article>`).join('')}</div>${studioAddButton(d, '질문 추가')}</section>`;
}
function studioChatEditor(d) {
  const t = studioTemplates.chat, n = d.items.length, pack = studioPacks[d.world], b = d.bot;
  return `<section class="st-sec"><div class="st-sec-h"><h3>캐릭터</h3><span>공식 캐릭터 설정을 따라요</span></div>
    <div class="st-character">${studioCover(pack.character.cover, 'st-face')}<div><strong>${esc(pack.character.name)}</strong><span>말투 ${esc(b.tone)} · Fan-made 챗봇으로 표시돼요</span></div></div>
    <label class="st-label" for="st-if">설정</label><div class="st-field st-if"><span aria-hidden="true">만약</span><input id="st-if" maxlength="40" data-bind="bot.ifLine" value="${esc(b.ifLine)}"></div>
    <label class="st-label" for="st-greet">첫인사</label><textarea id="st-greet" class="st-textarea" rows="2" maxlength="120" data-bind="bot.greeting">${esc(b.greeting)}</textarea></section>
    <section class="st-sec"><div class="st-sec-h"><h3>대화 예시</h3><span>${n} / ${t.max}</span><span class="st-sec-hint">받는 사람은 노란 말을 골라요</span></div>
    <div class="st-pairs">${d.items.map((p, i) => `<article class="st-pair" style="--i:${i}">
      <div class="st-pair-me"><label class="sr-only" for="st-ask-${i}">${i + 1}번 고를 말</label><input id="st-ask-${i}" maxlength="40" data-bind="items.${i}.ask" value="${esc(p.ask)}" placeholder="받는 사람이 고를 말"></div>
      <div class="st-pair-bot">${studioCover(pack.character.cover, 'st-face sm')}<label class="sr-only" for="st-reply-${i}">${i + 1}번 대답</label><textarea id="st-reply-${i}" rows="2" maxlength="120" data-bind="items.${i}.reply" placeholder="캐릭터의 대답">${esc(p.reply)}</textarea></div>
      ${studioDelButton(i, n, t)}</article>`).join('')}</div>${studioAddButton(d, '대화 추가')}</section>
    <section class="st-sec"><div class="st-sec-h"><h3>만들 수 없는 대화</h3><span>에셋 팩 금지 목록</span></div><div class="st-banned">${pack.banned.map(x => `<span>${esc(x)}</span>`).join('')}</div></section>`;
}
function studioMaker() {
  const d = studioState.draft, t = studioTemplates[d.format], w = getWorld(d.world), busy = studioState.generating;
  const editor = {quiz:studioQuizEditor, story:studioStoryEditor, game:studioGameEditor, chat:studioChatEditor}[d.format];
  return `<div class="st-maker${studioState.reveal ? ' is-reveal' : ''}">
    <header class="st-maker-head"><button type="button" class="icon-button" data-action="studio-back" aria-label="창작마당으로">${icon('back')}</button><div class="st-maker-title"><h2>${t.name} 만들기</h2><p>${esc(w.name)} 공식 에셋 팩</p></div><button type="button" class="st-text-button" id="st-save" data-action="studio-save" ${busy ? 'disabled' : ''}>저장</button></header>
    <div class="st-scroll">
      <section class="st-stage" aria-label="채팅방 미리보기"><span class="st-stage-note">채팅방에 이렇게 보여요</span><div class="st-stage-line"><time>${studioClock()}</time>${busy ? studioCardSkeleton() : studioCard(d, {stage:true})}</div></section>
      ${studioAskSection(d)}
      ${busy ? studioSkeleton() : studioLookSection(d) + editor(d) + (d.id ? `<div class="st-end"><button type="button" class="st-danger" data-action="studio-delete">${icon('trash')} 작품 삭제</button></div>` : '')}
    </div>
    <div class="st-actionbar"><button type="button" class="button secondary" data-action="studio-preview" ${busy ? 'disabled' : ''}>${icon('start')} ${d.format === 'chat' ? '미리 대화' : '미리 플레이'}</button><button type="button" class="button primary" data-action="studio-send" ${busy ? 'disabled' : ''}>${icon('send')} 보내기</button></div>
  </div>`;
}
function renderStudio() {
  return studioState.mode === 'make' && studioState.draft ? studioMaker() : studioHome();
}

/* ---------- actions ---------- */
function openStudio(world) {
  const d = studioState.draft;
  if (studioState.mode === 'make' && d && d.dirty) { studioStore(d); toast('임시저장했습니다.'); }
  studioState.world = studioOrder.includes(world) ? world : studioOrder[0];
  clearTimeout(studioState.timer);
  studioState = {...studioState, mode:'home', draft:null, generating:false, askError:''};
  if (view === 'studio') render(); else setView('studio');
}
function studioGenerate(fresh) {
  clearTimeout(studioState.timer);
  studioState.generating = true;
  if (fresh) render(); else studioRender();
  studioState.timer = setTimeout(() => {
    studioState.generating = false; studioState.reveal = !studioReduced();
    studioRender(); studioState.reveal = false;
  }, studioReduced() ? 0 : 750);
}
function studioStart(format) {
  if (!studioTemplates[format]) return;
  studioState.draft = studioBuild(studioState.world, format, 0);
  studioState.mode = 'make'; studioState.askError = ''; studioState.askText = null;
  if(view!=='studio')setView('studio');
  studioGenerate(true);
}
function studioApply(variant, prompt) {
  const d = studioState.draft, fresh = studioBuild(d.world, d.format, variant);
  Object.assign(d, {variant:fresh.variant, title:fresh.title, cover:fresh.cover, items:fresh.items, endings:fresh.endings, results:fresh.results, bot:fresh.bot, prompt, dirty:true});
  studioState.askError = ''; studioState.askText = null;
  studioGenerate(false);
}
function studioRegenerate(text) {
  const d = studioState.draft; if (!d || studioState.generating) return;
  text = String(text || '').trim();
  if (studioBlocked.some(w => text.includes(w))) { studioState.askText = text; studioState.askError = '실존 인물 흉내와 성적인 묘사는 만들 수 없어요. 요청을 바꿔 주세요.'; studioRender(); return; }
  const list = studioVariants(d.format, d.world);
  let best = -1, score = 0;
  list.forEach((v, i) => { const s = v.keys.filter(k => text.includes(k)).length; if (s > score) { score = s; best = i; } });
  studioApply(best >= 0 ? best : (d.variant + 1) % list.length, text);
}
function studioEdit(id) {
  const c = studioNormalize(data.creations.find(x => x.id === id)); if (!c) return;
  studioState = {...studioState, draft:{...c, dirty:false}, world:c.world, mode:'make', generating:false, askError:'', askText:null};
  if(view!=='studio')setView('studio');else render(); document.querySelectorAll('.st-maker textarea').forEach(studioGrow);
}
function studioBack() {
  const d = studioState.draft;
  clearTimeout(studioState.timer);
  if (d && d.dirty) { studioStore(d); toast('임시저장했습니다.'); }
  studioState = {...studioState, mode:'home', draft:null, generating:false, askError:''};
  render();
}
function studioAdd() {
  const d = studioState.draft, t = studioTemplates[d.format]; if (d.items.length >= t.max) return;
  const k = ((d.items[0] || {}).choices || []).length || 3;
  d.items.push({quiz:{q:'', choices:['','',''], answer:0}, story:{title:'', text:'', choices:Array(k).fill('')}, game:{q:'', choices:['','','']}, chat:{ask:'', reply:''}}[d.format]);
  d.dirty = true; studioRender();
  const i = d.items.length - 1, target = document.getElementById({quiz:`st-q-${i}`, story:`st-t-${i}`, game:`st-q-${i}`, chat:`st-ask-${i}`}[d.format]);
  if (target) { target.focus({preventScroll:true}); target.scrollIntoView({block:'center', behavior:studioReduced() ? 'auto' : 'smooth'}); }
}
function studioDel(i) {
  const d = studioState.draft, t = studioTemplates[d.format]; if (d.items.length <= t.min) return;
  d.items.splice(i, 1); d.dirty = true; studioRender();
}
/* 보내기·미리 플레이 전에 빈칸을 찾아 그 칸으로 데려갑니다. */
function studioProblem(d) {
  if (!d.title.trim()) return ['st-title', '제목을 입력해 주세요.'];
  if (d.format === 'chat') {
    if (!d.bot.greeting.trim()) return ['st-greet', '첫인사를 입력해 주세요.'];
    const i = d.items.findIndex(p => !p.ask.trim() || !p.reply.trim());
    return i >= 0 ? [d.items[i].ask.trim() ? `st-reply-${i}` : `st-ask-${i}`, `${i + 1}번 대화를 채워 주세요.`] : null;
  }
  for (let i = 0; i < d.items.length; i++) {
    const it = d.items[i];
    if (d.format === 'story' && !it.text.trim()) return [`st-x-${i}`, `${i + 1}컷 내용을 입력해 주세요.`];
    if (d.format !== 'story' && !it.q.trim()) return [`st-q-${i}`, `${i + 1}번 ${d.format === 'quiz' ? '문제를' : '질문을'} 입력해 주세요.`];
    const j = it.choices.findIndex(c => !c.trim());
    if (j >= 0) return [`st-c-${i}-${j}`, `${i + 1}번의 선택지를 모두 채워 주세요.`];
  }
  if (d.format === 'story') { const j = (d.endings || []).findIndex(e => !e.trim()); if (j >= 0) return [`st-e-${j}`, '엔딩 이름을 채워 주세요.']; }
  if (d.format === 'game') { const j = d.results.findIndex(r => !r.name.trim()); if (j >= 0) return [`st-r-${j}`, '결과 이름을 채워 주세요.']; }
  return null;
}
function studioReady() {
  const d = studioState.draft; if (!d || studioState.generating) return false;
  const p = studioProblem(d); if (!p) return true;
  toast(p[1]);
  const el = document.getElementById(p[0]);
  if (el) { el.focus({preventScroll:true}); el.scrollIntoView({block:'center', behavior:studioReduced() ? 'auto' : 'smooth'}); }
  return false;
}
function studioDestinations(d) {
  const pick = studioPacks[d.world].room;
  const rooms = roomData.map(r => `<label class="st-dest"><input type="radio" name="st-dest" value="room:${r.id}" data-label="${esc(r.title)}" ${r.id === pick ? 'checked' : ''}>${avatar(r.id)}<span><strong>${esc(r.title)}</strong><small>채팅방 · ${esc(r.members)}</small></span><i aria-hidden="true"></i></label>`).join('');
  const opens = communities.filter(c => channelData[c.id] && channelData[c.id].channels.some(ch => ch.id === 'creations')).map(c => `<label class="st-dest"><input type="radio" name="st-dest" value="open:${c.id}" data-label="${esc(c.name)}"><img src="${c.image}" alt=""><span><strong>${esc(c.name)}</strong><small>오픈채팅 · #작품공유</small></span><i aria-hidden="true"></i></label>`).join('');
  return {pick, rooms, opens};
}
function studioOpenSend() {
  if (!studioReady()) return;
  const d = studioState.draft, {pick, rooms, opens} = studioDestinations(d);
  openModal('어디로 보낼까요?', `<div class="st-send">
    <div class="st-send-card">${studioCover(d.cover, 'st-send-thumb')}<div><strong>${esc(d.title)}</strong><span>${esc(studioMeta(d))}</span></div></div>
    <fieldset class="st-dests"><legend>채팅방</legend>${rooms}</fieldset>
    ${opens ? `<fieldset class="st-dests"><legend>오픈채팅</legend>${opens}</fieldset>` : ''}
    <div class="st-link">${icon('link')}<div><strong>링크로 보내기</strong><span>같은 기기에 저장된 작품을 링크로 열어요</span></div><button type="button" class="button secondary small" data-action="studio-copy-link">복사</button></div>
    <button type="button" class="button primary full st-send-go" data-action="studio-send-go">${esc(roomData.find(r => r.id === pick).title)}에 보내기</button>
  </div>`);
}
function studioSendGo() {
  const d = studioState.draft, input = document.querySelector('input[name="st-dest"]:checked'); if (!d || !input) return;
  const [type, id] = input.value.split(':'), label = input.dataset.label;
  d.status = 'sent'; d.sentTo = [...(d.sentTo || []).filter(x => x !== label), label];
  const rec = studioStore(d), message = {card:rec.id, text:`[플레이 카드] ${rec.title}`, at:Date.now()};
  studioState = {...studioState, mode:'home', draft:null};
  if (type === 'room') {
    data.messages.push({room:id, ...message});
    if (!data.joinedRooms.includes(id)) data.joinedRooms.push(id);
    persist(); activeRoom = id; setView('rooms', {openRoom:true}); studioScrollEnd('room-messages');
  } else {
    channelData[id].messages.push({channel:'creations', ...message}); saveChannels();
    community = id; channel = 'creations'; communityOpen = true; setView('openchat'); studioScrollEnd('channel-messages');
  }
  toast(`${label}에 보냈습니다.`);
}
function studioLink(id) { const url = new URL(location.href); url.search = ''; url.searchParams.set('play', id); url.hash = 'studio'; return url.href; }
async function studioCopyLink(trigger) {
  const d = studioState.draft; if (!d) return;
  studioStore(d);
  const url = studioLink(d.id);
  try { await navigator.clipboard.writeText(url); trigger.textContent = '복사됨'; toast('링크를 복사했습니다.'); }
  catch (_) {
    let field = document.getElementById('st-link-url');
    if (!field) { trigger.closest('.st-link').insertAdjacentHTML('afterend', `<input class="field-input st-link-url" id="st-link-url" value="${esc(url)}" readonly aria-label="플레이 링크">`); field = document.getElementById('st-link-url'); }
    field.focus(); field.select(); toast('링크를 선택했습니다. 복사해 주세요.');
  }
}
function studioGuide() {
  openModal('창작 가이드', `<div class="st-guide"><section><h3>쓸 수 있어요</h3><ul><li>작가와 권리자가 2차 창작을 허락한 작품의 공식 에셋 팩</li><li>에셋 팩의 이미지, 캐릭터 설정, 말투 가이드</li></ul></section><section><h3>만들 수 없어요</h3><ul><li>실존 인물 흉내</li><li>캐릭터의 성적인 묘사</li><li>에셋 팩 금지 목록에 있는 내용</li></ul></section><section><h3>작품이 놓이는 곳</h3><ul><li>채팅방과 오픈채팅의 플레이 카드</li><li>설치 없이 열리는 웹 링크</li><li>플레이그라운드의 내 창작물</li></ul></section></div>`);
}

/* 채팅방(chats.js)과 오픈채팅(openchat.js)이 카드 메시지를 그릴 때 부릅니다. */
function studioCardMessage(id, ctx) {
  const c = data.creations.find(x => x.id === id);
  return c ? studioCard(studioNormalize(c), {ctx}) : '<div class="bubble st-gone">삭제된 작품이에요.</div>';
}

/* ---------- player: 받은 사람이 채팅방에서 보는 화면 ---------- */
function studioPlayerEl() {
  let el = document.getElementById('studio-player');
  if (!el) {
    el = document.createElement('dialog'); el.id = 'studio-player'; el.className = 'st-player'; el.setAttribute('aria-labelledby', 'st-player-title');
    el.addEventListener('close', () => { if (studioPlay) studioPlay.token++; studioPlay = null; el.innerHTML = ''; });
    document.body.append(el);
  }
  return el;
}
function openStudioPlayer(source, opts = {}) {
  const c = studioNormalize(typeof source === 'string' ? data.creations.find(x => x.id === source) : source);
  if (!c) { toast('작품을 찾을 수 없습니다.'); return; }
  if (modal.open) closeModal();
  studioPlay = {c, preview:!!opts.preview, from:opts.from || '', step:0, picks:[], score:0, log:[], replies:[], busy:false, typing:false, done:false, result:'', token:0};
  const el = studioPlayerEl(); if (!el.open) el.showModal();
  studioPlayStart();
}
function studioPlayStart() {
  const p = studioPlay, c = p.c;
  Object.assign(p, {step:0, picks:[], score:0, log:[], replies:[], done:false, result:''});
  if (p.preview) p.log.push({kind:'sys', text:'미리 플레이 · 받은 사람에게도 이렇게 보여요'});
  const intro = {quiz:`${c.items.length}문제 퀴즈를 시작할게요!`, story:'이야기를 시작할게요. 마음에 드는 선택지를 골라 주세요.', game:`질문 ${c.items.length}개에 답하면 결과를 알려 드려요.`, chat:c.bot ? esc(c.bot.greeting) : ''}[c.format];
  studioHost([intro], studioPlayNext);
}
function studioHost(lines, then) {
  const p = studioPlay; if (!p) return;
  const token = ++p.token, wait = studioReduced() ? 0 : 520;
  p.busy = true; p.replies = [];
  const step = k => {
    if (!studioPlay || studioPlay.token !== token) return;
    if (k >= lines.length) { p.busy = false; p.typing = false; if (then) then(); studioPlayRender(); return; }
    p.typing = true; studioPlayRender();
    setTimeout(() => {
      if (!studioPlay || studioPlay.token !== token) return;
      p.typing = false; p.log.push({kind:'host', html:lines[k]});
      setTimeout(() => step(k + 1), wait ? 120 : 0);
    }, wait);
  };
  step(0);
}
function studioPlayNext() {
  const p = studioPlay, c = p.c;
  if (c.format === 'chat') {
    const left = c.items.map((x, i) => i).filter(i => !p.picks.includes(i));
    if (!left.length) { p.done = true; p.log.push({kind:'sys', text:'준비된 대화를 모두 봤어요'}); return; }
    p.replies = left.map(i => ({label:c.items[i].ask, i})); return;
  }
  if (p.step >= c.items.length) { studioPlayFinish(); return; }
  const it = c.items[p.step];
  const line = c.format === 'story' ? `${it.title ? `<b>${esc(it.title)}</b><br>` : ''}${esc(it.text)}` : `<span class="st-pl-qno">${p.step + 1}/${c.items.length}</span>${esc(it.q)}`;
  studioHost([line], () => { p.replies = it.choices.map((label, i) => ({label, i})).filter(r => r.label.trim()); });
}
function studioPlayAnswer(i) {
  const p = studioPlay; if (!p || p.busy || p.done) return;
  const c = p.c;
  if (c.format === 'chat') {
    const pair = c.items[i]; if (!pair) return;
    p.picks.push(i); p.log.push({kind:'me', text:pair.ask}); studioHost([esc(pair.reply)], studioPlayNext); return;
  }
  const it = c.items[p.step]; if (!it || !it.choices[i]) return;
  p.log.push({kind:'me', text:it.choices[i]}); p.picks.push(i); p.step++;
  if (c.format === 'quiz') {
    const ok = i === it.answer, right = it.choices[it.answer]; if (ok) p.score++;
    studioHost([ok ? '정답이에요!' : `아쉬워요. 정답은 ‘${esc(right)}’${studioJosa(right)}.`], studioPlayNext); return;
  }
  studioPlayNext(); studioPlayRender();
}
function studioPlayFinish() {
  const p = studioPlay, c = p.c; let html = '';
  if (c.format === 'quiz') {
    const n = c.items.length, line = p.score === n ? '만점이에요. 찐팬 인정!' : p.score >= Math.ceil(n * .6) ? '거의 다 맞혔어요.' : '다음엔 더 맞힐 수 있어요.';
    p.result = `${c.title} ${n}문제 중 ${p.score}개 정답`;
    html = `<div class="st-pl-result"><small>${esc(c.title)}</small><strong>${p.score} / ${n}</strong><span>${line}</span></div>`;
  } else if (c.format === 'story') {
    const ending = (c.endings || [])[p.picks[0]] || '열린 결말';
    p.result = `${c.title} 엔딩: ${ending}`;
    html = `<div class="st-pl-result"><small>엔딩</small><strong>${esc(ending)}</strong><span>${esc(c.title)}</span></div>`;
  } else {
    const tally = c.results.map((r, j) => p.picks.filter(x => x === j).length), best = tally.indexOf(Math.max(...tally)), r = c.results[best] || c.results[0];
    p.result = `${c.title} 결과: ${r.name}`;
    html = `<div class="st-pl-result"><small>나의 결과</small><strong>${esc(r.name)}</strong><span>${esc(r.line)}</span></div>`;
  }
  p.done = true; p.log.push({kind:'result', html});
}
function studioPlayActions() {
  const p = studioPlay, again = `<button type="button" class="button secondary" data-action="studio-replay">${p.c.format === 'chat' ? '처음부터' : '다시 하기'}</button>`;
  if (p.preview) return `<div class="st-pl-actions">${again}<button type="button" class="button secondary" data-action="studio-player-close">수정하기</button><button type="button" class="button primary" data-action="studio-player-send">보내기</button></div>`;
  if (p.from && p.c.format !== 'chat') return `<div class="st-pl-actions">${again}<button type="button" class="button primary" data-action="studio-share-result">결과 보내기</button></div>`;
  return `<div class="st-pl-actions">${again}<button type="button" class="button primary" data-action="studio-player-close">닫기</button></div>`;
}
function studioPlayRender() {
  const p = studioPlay, el = document.getElementById('studio-player'); if (!p || !el) return;
  const c = p.c, chat = c.format === 'chat', name = chat ? studioPacks[c.world].character.name : c.title, face = chat ? studioPacks[c.world].character.cover : c.cover;
  const total = c.items.length, at = chat ? p.picks.length : Math.min(p.step + (p.done ? 0 : 1), total);
  let prevHost = false; const rows = [];
  const hostRow = inner => { const row = `<div class="st-pl-msg host${prevHost ? ' cont' : ''}">${prevHost ? '<span class="st-pl-av-space"></span>' : studioCover(face, 'st-pl-av')}<div>${prevHost ? '' : `<span class="st-pl-name">${esc(name)}</span>`}${inner}</div></div>`; prevHost = true; return row; };
  for (const m of p.log) {
    if (m.kind === 'sys') { rows.push(`<p class="st-pl-sys">${esc(m.text)}</p>`); prevHost = false; }
    else if (m.kind === 'me') { rows.push(`<div class="st-pl-msg me"><p class="st-pl-bubble">${esc(m.text)}</p></div>`); prevHost = false; }
    else rows.push(hostRow(m.kind === 'result' ? m.html : `<p class="st-pl-bubble">${m.html}</p>`));
  }
  if (p.typing) rows.push(hostRow('<p class="st-pl-bubble st-typing" role="status" aria-label="입력 중"><span></span><span></span><span></span></p>'));
  const foot = p.done ? studioPlayActions() : p.replies.length ? `<div class="st-pl-choices">${p.replies.map(r => `<button type="button" data-action="studio-answer" data-index="${r.i}">${esc(r.label)}</button>`).join('')}</div>` : '';
  el.innerHTML = `<header class="st-pl-head"><button type="button" class="icon-button" data-action="studio-player-close" aria-label="닫기">${icon('close')}</button><div><h2 id="st-player-title">${esc(c.title)}</h2><p>Fan-made · ${esc(getWorld(c.world).name)}</p></div><span class="st-pl-progress">${at} / ${total}</span></header><div class="st-pl-thread" id="st-pl-thread" aria-live="polite">${rows.join('')}</div><div class="st-pl-foot${foot ? '' : ' is-empty'}">${foot}</div>`;
  const thread = document.getElementById('st-pl-thread'); thread.scrollTop = thread.scrollHeight;
  const first = el.querySelector('.st-pl-foot button'); if (first) first.focus({preventScroll:true});
}
function studioShareResult() {
  const p = studioPlay; if (!p || !p.from || !p.result) return;
  const [type, id] = p.from.split(':'), text = p.result;
  if (type === 'room') { data.messages.push({room:id, text, at:Date.now()}); persist(); }
  else if (channelData[id]) { channelData[id].messages.push({channel:'creations', text, at:Date.now()}); saveChannels(); }
  document.getElementById('studio-player').close();
  if ((type === 'room' && view === 'rooms') || (type === 'open' && view === 'openchat')) render();
  studioScrollEnd(type === 'room' ? 'room-messages' : 'channel-messages');
  toast('결과를 보냈습니다.');
}

/* ---------- events ---------- */
document.addEventListener('click', event => {
  const el = event.target.closest('[data-action]'); if (!el) return;
  const {action, id, index} = el.dataset, d = studioState.draft;
  switch (action) {
    case 'studio-world': if (studioOrder.includes(id)) { studioState.world = id; studioRender(); } break;
    case 'studio-start': studioStart(id); break;
    case 'studio-edit': studioEdit(id); break;
    case 'studio-back': studioBack(); break;
    case 'studio-save': if (d && !studioState.generating) { studioStore(d); studioRender(); toast('저장했습니다.'); } break;
    case 'studio-ask': if (d && !studioState.generating) { const v = studioVariants(d.format, d.world)[Number(index)]; if (v) { const input = document.getElementById('st-ask'); if (input) input.value = v.ask; studioApply(Number(index), v.ask); } } break;
    case 'studio-cover': if (d) { d.cover = id; d.dirty = true; studioRender(); } break;
    case 'studio-add': if (d) studioAdd(); break;
    case 'studio-del': if (d) studioDel(Number(index)); break;
    case 'studio-delete': openModal('작품을 삭제할까요?', `<p>채팅방에 보낸 카드도 더 이상 열리지 않아요.</p><div class="button-row end">${button('취소', 'close-modal')}${button('삭제', 'studio-delete-yes', '', 'danger')}</div>`); break;
    case 'studio-delete-yes': if (d) { data.creations = data.creations.filter(c => c.id !== d.id); persist(); closeModal(); studioState = {...studioState, mode:'home', draft:null}; render(); toast('삭제했습니다.'); } break;
    case 'studio-preview': if (studioReady()) openStudioPlayer({...studioClone(d), id:d.id || 'draft'}, {preview:true}); break;
    case 'studio-send': studioOpenSend(); break;
    case 'studio-send-go': studioSendGo(); break;
    case 'studio-copy-link': studioCopyLink(el); break;
    case 'studio-guide': studioGuide(); break;
    case 'studio-play': openStudioPlayer(id, {from:el.dataset.from || ''}); break;
    case 'studio-answer': studioPlayAnswer(Number(index)); break;
    case 'studio-replay': if (studioPlay) studioPlayStart(); break;
    case 'studio-player-close': { const p = document.getElementById('studio-player'); if (p && p.open) p.close(); break; }
    case 'studio-player-send': { const p = document.getElementById('studio-player'); if (p && p.open) p.close(); studioOpenSend(); break; }
    case 'studio-share-result': studioShareResult(); break;
  }
});
document.addEventListener('input', event => {
  const el = event.target, path = el.dataset && el.dataset.bind, d = studioState.draft;
  if (!path || !d) return;
  const value = el.dataset.type === 'number' ? Number(el.value) : el.value;
  studioSet(d, path, value); d.dirty = true;
  if (el.tagName === 'TEXTAREA') studioGrow(el);
  if (path === 'title') {
    document.querySelectorAll('[data-live="title"]').forEach(n => { n.textContent = value || '제목 없음'; });
    const count = document.getElementById('st-title-count'); if (count) count.textContent = `${[...value].length}/30`;
  }
  if (path === 'bot.ifLine') document.querySelectorAll('[data-live="meta"]').forEach(n => { n.textContent = `만약 ${value}`; });
  let m = path.match(/^items\.0\.choices\.(\d+)$/);
  if (m && d.format === 'story') { const n = document.querySelector(`.st-ending-from[data-index="${m[1]}"]`); if (n) n.textContent = value || `선택지 ${Number(m[1]) + 1}`; }
  m = path.match(/^results\.(\d+)\.name$/);
  if (m) document.querySelectorAll(`.st-choice-to[data-result="${m[1]}"]`).forEach(n => { n.textContent = value; });
});
document.addEventListener('change', event => {
  const el = event.target;
  if (el.name === 'st-dest') { const go = document.querySelector('.st-send-go'); if (go) go.textContent = `${el.dataset.label}에 보내기`; }
});
document.addEventListener('submit', event => {
  if (event.target.id !== 'st-ask-form') return;
  event.preventDefault(); studioRegenerate(event.target.elements.ask.value);
});
/* 복사한 링크(?play=작품ID#studio)로 열면 바로 플레이합니다. 같은 기기에 저장된 작품만 열립니다. */
document.addEventListener('DOMContentLoaded', () => {
  const id = new URL(location.href).searchParams.get('play');
  if (id && data.creations.some(c => c.id === id)) openStudioPlayer(id);
});
