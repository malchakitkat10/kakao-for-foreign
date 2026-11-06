const worlds = [
  {
    id: 'friends',
    name: '카카오프렌즈',
    short: '프렌즈',
    kind: 'Characters',
    art: 'friends',
    flag: '캐릭터',
    subtitle: '프렌즈 피크닉',
    description: '라이언·어피치와 피크닉 장소와 준비물을 골라보세요.',
    tags: ['게임', '한국어', '모임'],
    keywords: '카카오프렌즈 프렌즈 라이언 어피치 캐릭터 피크닉 게임'
  },
  {
    id: 'solo',
    name: '나 혼자만 레벨업',
    short: '나 혼자만 레벨업',
    kind: 'Stories',
    art: 'solo',
    flag: '웹툰',
    subtitle: '그림자 던전',
    description: '던전에 들어갈 길과 전투 방식을 골라보세요.',
    tags: ['웹툰', '미션', '모임'],
    keywords: '나 혼자만 레벨업 나혼렙 웹툰 액션 판타지 헌터 그림자 던전'
  },
  {
    id: 'cafe',
    name: '서울 카페 모임',
    short: '서울 카페',
    kind: 'Culture',
    art: 'cafe',
    flag: '한국 생활',
    subtitle: '카페 고르기',
    description: '카페 자리를 고르고 미나와 한국어로 약속을 잡아보세요.',
    tags: ['게임', '한국어', '여행'],
    keywords: '서울 성수 카페 모임 한국어 커피 문화 여행 미나'
  }
];

const formats = {
  game: {
    label: '미니게임',
    short: '게임',
    title: '미니게임',
    icon: 'play',
    description: '선택지·카드·퀴즈'
  },
  chat: {
    label: '캐릭터 대화',
    short: '대화',
    title: '캐릭터와 대화',
    icon: 'rooms',
    description: '캐릭터와 주고받는 대화'
  },
  story: {
    label: '선택형 이야기',
    short: '이야기',
    title: '선택형 이야기',
    icon: 'book',
    description: '선택에 따라 달라지는 결말'
  }
};

const sampleGames = [
  {
    id: 'cafe-quest',
    world: 'cafe',
    format: 'game',
    title: '카페 고르기',
    subtitle: '자리·준비물·답장 고르기',
    art: 'cafe',
    artTitle: '오늘 갈<br>카페는?',
    meta: '2분 · 혼자',
    badge: '미니게임'
  },
  {
    id: 'mina-chat',
    world: 'cafe',
    format: 'chat',
    title: '미나와 한국어',
    subtitle: '인사·주문·모임 대화',
    art: 'chat',
    artTitle: '미나와<br>대화하기',
    meta: '3분 · 한국어',
    badge: '한국어 연습'
  },
  {
    id: 'story-demo',
    world: 'cafe',
    format: 'story',
    title: '카페에서 만난 편지',
    subtitle: '선택에 따라 달라지는 이야기',
    art: 'story',
    artTitle: '카페에서<br>만난 편지',
    meta: '2분 · 혼자',
    badge: '선택형 이야기'
  }
];

const experiences = [
  {
    id: 'cafe-walk',
    name: '성수 카페 산책',
    art: 'seongsu',
    artTitle: '성수<br>카페 산책',
    location: '서울 성수',
    duration: '2시간',
    price: 38000,
    description: '성수 카페를 둘러보고 한국어로 주문해보세요.',
    phrase: '아이스 아메리카노 한 잔 주세요.',
    translation: ''
  },
  {
    id: 'webtoon-studio',
    name: '웹툰 그리기',
    art: 'studio',
    artTitle: '내가 그린<br>한 장면',
    location: '서울',
    duration: '90분',
    price: 54000,
    description: '캐릭터를 그리고 짧은 이야기를 만들어보세요.',
    phrase: '이 캐릭터 이름이 뭐예요?',
    translation: ''
  }
];

const roomData = [
  {
    id: 'cafe',
    title: '서울 카페 모임',
    icon: 'coffee',
    description: '카페 추천과 주말 약속',
    members: '3명',
    messages: [
      {name: '미나', initial: '미', text: '이번 주말에 성수 카페 가실 분 있나요? 창가랑 테라스 중에 골라주세요.'},
      {name: '알렉스', initial: '알', text: '저는 테라스요! 날씨 좋으면 밖에 앉고 싶어요.'},
      {name: '하나', initial: '하', text: '저도 좋아요. 토요일 2시는 어떠세요?'}
    ]
  },
  {
    id: 'friends',
    title: '프렌즈 피크닉 모임',
    icon: 'heart',
    description: '피크닉 준비물과 캐릭터 이야기',
    members: '3명',
    messages: [
      {name: '리나', initial: '리', text: '이번 피크닉에는 어피치 도시락을 가져가려고요.'},
      {name: '제이', initial: '제', text: '저는 라이언 컵 챙길게요. 간식은 뭐가 좋을까요?'},
      {name: '미나', initial: '미', text: '김밥이랑 과일 어때요? 같이 나눠 먹기 좋을 것 같아요.'}
    ]
  },
  {
    id: 'solo',
    title: '나 혼자만 레벨업 모임',
    icon: 'star',
    description: '웹툰 감상과 미션 이야기',
    members: '3명',
    messages: [
      {name: '노아', initial: '노', text: '그림자 던전에서 어떤 전투 방식을 골랐어요?'},
      {name: '유나', initial: '유', text: '저는 방어부터 골랐어요. 먼저 적의 움직임을 보고 싶었거든요.'},
      {name: '알렉스', initial: '알', text: '저는 바로 공격했어요. 다른 길로도 한 번 가볼게요.'}
    ]
  }
];

const lessons = {
  first: {
    name: '첫 인사',
    short: '처음 만난 사람과 대화',
    context: '언어 교환 모임에서 미나를 처음 만났습니다. 존댓말로 대화해보세요.',
    steps: [
      {
        text: '안녕하세요! 오늘 카페 같이 갈까요?',
        translation: '',
        prompt: '미나의 제안에 답해보세요.',
        choices: ['ㄱㄱ', '좋아요. 같이 가요.', '가자.'],
        correct: 1,
        explanation: '“좋아요. 같이 가요.”는 공손한 답장입니다. “ㄱㄱ”와 “가자”는 친한 사이에 어울립니다.',
        keywords: ['좋아요', '같이 가요', '갈게요', '좋습니다']
      },
      {
        text: '좋아요! 2시에 카페 앞에서 만나요.',
        translation: '',
        prompt: '5분 늦을 것 같습니다. 미나에게 알려보세요.',
        choices: ['기다려.', '5분 늦을 것 같아요. 죄송해요.', '5분만 기다려 주세요.'],
        correct: 1,
        explanation: '“5분 늦을 것 같아요. 죄송해요.”는 지연과 사과를 함께 전합니다. “기다려 주세요”도 존댓말이지만 늦는다는 설명을 덧붙이면 좋습니다.',
        keywords: ['늦', '죄송', '미안']
      },
      {
        text: '괜찮아요. 천천히 오세요 :)',
        translation: '',
        prompt: '고맙다는 말과 도착 소식을 전해보세요.',
        choices: ['고마워요. 곧 도착해요!', 'ㅇㅋ', '땡큐'],
        correct: 0,
        explanation: '“고마워요. 곧 도착해요!”는 감사와 도착 소식을 함께 전합니다. “ㅇㅋ”와 “땡큐”는 더 가벼운 표현입니다.',
        keywords: ['고마워', '감사', '곧 도착']
      }
    ]
  },
  coffee: {
    name: '커피 주문',
    short: '카페에서 주문하기',
    context: '카페 직원에게 음료를 주문합니다. 존댓말로 말해보세요.',
    steps: [
      {
        text: '안녕하세요. 주문 도와드릴게요.',
        translation: '',
        prompt: '아이스 아메리카노 한 잔을 주문해보세요.',
        choices: ['아아 하나.', '아이스 아메리카노 한 잔 주세요.', '커피 줘.'],
        correct: 1,
        explanation: '음료 이름과 수량 뒤에 “주세요”를 붙이면 공손한 주문이 됩니다. “아아”는 아이스 아메리카노를 줄인 말입니다.',
        keywords: ['주세요', '아메리카노']
      },
      {
        text: '매장에서 드시나요?',
        translation: '',
        prompt: '카페 안에서 마시겠다고 답해보세요.',
        choices: ['네, 여기서 마실게요.', '응.', '먹는다.'],
        correct: 0,
        explanation: '“네, 여기서 마실게요.”가 자연스럽습니다. 직원에게 답할 때는 “응”보다 “네”를 씁니다.',
        keywords: ['네', '마실게요', '매장', '여기서']
      },
      {
        text: '준비되면 진동벨로 알려드릴게요.',
        translation: '',
        prompt: '직원에게 감사 인사를 해보세요.',
        choices: ['감사합니다.', 'ㄱㅅ', '수고.'],
        correct: 0,
        explanation: '“감사합니다.”가 공손한 표현입니다. “ㄱㅅ”는 채팅에서 “감사”를 줄여 쓰는 말입니다.',
        keywords: ['감사', '고마워']
      }
    ]
  },
  group: {
    name: '모임 인사',
    short: '단체 채팅에 참여하기',
    context: '카페 모임의 단체 채팅에 처음 들어왔습니다. 존댓말로 인사해보세요.',
    steps: [
      {
        text: '안녕하세요! 처음 오셨죠?',
        translation: '',
        prompt: '처음 참여한다는 인사를 해보세요.',
        choices: ['ㅇㅇ', '네, 처음이에요. 잘 부탁드려요!', '나 처음.'],
        correct: 1,
        explanation: '“네, 처음이에요. 잘 부탁드려요!”는 첫 인사에 어울립니다. “ㅇㅇ”는 친한 사이에서 “응”을 줄여 쓰는 말입니다.',
        keywords: ['처음', '부탁', '안녕']
      },
      {
        text: '다 같이 사진 한 장 찍을까요?',
        translation: '',
        prompt: '사진을 함께 찍고 싶다고 답해보세요.',
        choices: ['좋아요. 저도 같이 찍고 싶어요!', 'ㄱㄱ', '찍자.'],
        correct: 0,
        explanation: '“좋아요. 저도 같이 찍고 싶어요!”는 존댓말입니다. “ㄱㄱ”와 “찍자”는 친한 사이에 어울립니다.',
        keywords: ['좋아요', '같이', '싶어요']
      },
      {
        text: '다음 주에도 또 만나요!',
        translation: '',
        prompt: '오늘 즐거웠다는 말로 인사를 마쳐보세요.',
        choices: ['오늘 즐거웠어요. 다음에 또 봐요!', 'ㅂㅂ', 'ㅇㅋ'],
        correct: 0,
        explanation: '“오늘 즐거웠어요. 다음에 또 봐요!”는 모임을 마칠 때 쓰기 좋습니다. “ㅂㅂ”는 “바이바이”를 줄인 가벼운 인사입니다.',
        keywords: ['즐거', '다음', '또 봐', '감사']
      }
    ]
  }
};

const questSteps = [
  {
    tag: '01 · 자리',
    title: '어디에 앉을까요?',
    text: '미나와 성수 카페에 왔어요. 마음에 드는 자리를 골라보세요.',
    letter: '한',
    choices: [
      ['창가 자리', '거리를 바라보며 커피 마시기'],
      ['테라스', '바람을 쐬며 쉬기'],
      ['큰 테이블', '다른 사람들과 함께 앉기']
    ]
  },
  {
    tag: '02 · 준비물',
    title: '무엇을 가져갈까요?',
    text: '카페에서 시간을 보낼 준비물을 골라보세요.',
    letter: '둘',
    choices: [
      ['스케치북', '눈앞의 풍경 그리기'],
      ['음악 목록', '좋아하는 노래 듣기'],
      ['읽던 책', '커피와 함께 한 장 읽기']
    ]
  },
  {
    tag: '03 · 답장',
    title: '미나에게 답장해볼까요?',
    text: '처음 만난 미나가 “같이 가요?”라고 물었어요. 답장을 골라보세요.',
    letter: '셋',
    choices: [
      ['좋아요. 같이 가요.', '공손하게 동의하기'],
      ['ㄱㄱ', '친한 사이에서 쓰는 짧은 답장'],
      ['네, 좋아요!', '밝게 동의하기']
    ]
  }
];

const worldQuests = {
  friends: {
    title: '프렌즈 피크닉',
    resultNames: ['한강 피크닉', '서울숲 피크닉', '우리 집 피크닉'],
    steps: [
      {
        tag: '01 · 장소',
        title: '어디서 모일까요?',
        text: '라이언과 어피치가 피크닉 갈 곳을 고르고 있어요.',
        letter: '한',
        choices: [
          ['한강공원', '강을 보며 돗자리 펴기'],
          ['서울숲', '나무 그늘에서 쉬기'],
          ['우리 집', '날씨 걱정 없이 모이기']
        ]
      },
      {
        tag: '02 · 준비물',
        title: '무엇을 챙길까요?',
        text: '피크닉에 가져갈 물건을 하나 골라보세요.',
        letter: '둘',
        choices: [
          ['도시락', '김밥과 과일 나눠 먹기'],
          ['카메라', '친구들과 사진 남기기'],
          ['카드 게임', '돗자리에 앉아 함께 놀기']
        ]
      },
      {
        tag: '03 · 초대',
        title: '친구에게 뭐라고 보낼까요?',
        text: '준비가 끝났어요. 친구를 초대하는 말을 골라보세요.',
        letter: '셋',
        choices: [
          ['우리 피크닉 갈래?', '가볍게 약속 잡기'],
          ['같이 도시락 먹자!', '먹을거리로 초대하기'],
          ['산책하고 잠깐 쉬자.', '산책을 제안하기']
        ]
      }
    ]
  },
  solo: {
    title: '그림자 던전',
    resultNames: ['정면 돌파', '그림자 잠입', '지하 탐색'],
    steps: [
      {
        tag: '01 · 진입로',
        title: '어느 길로 들어갈까요?',
        text: '던전 입구에 도착했어요. 안으로 들어갈 길을 골라보세요.',
        letter: '한',
        choices: [
          ['정문', '적의 움직임을 보며 정면으로 들어가기'],
          ['옆길', '경비가 적은 길로 이동하기'],
          ['지하 통로', '어두운 길에서 단서 찾기']
        ]
      },
      {
        tag: '02 · 전투',
        title: '어떻게 싸울까요?',
        text: '앞을 막은 몬스터가 움직이기 시작했어요.',
        letter: '둘',
        choices: [
          ['빠르게 공격', '다가오기 전에 먼저 공격하기'],
          ['방어부터', '공격을 막고 빈틈 찾기'],
          ['동료 지원', '동료가 공격할 틈 만들기']
        ]
      },
      {
        tag: '03 · 팀 신호',
        title: '어떤 신호를 보낼까요?',
        text: '다음 방에 들어가기 전, 동료들과 맞출 신호를 골라보세요.',
        letter: '셋',
        choices: [
          ['돌파할게요!', '먼저 길을 열기'],
          ['엄호 부탁해요.', '함께 움직이기'],
          ['잠깐, 주변부터 확인해요.', '상황을 살피고 이동하기']
        ]
      }
    ]
  },
  cafe: {
    title: '성수 카페 퀘스트',
    resultNames: ['창가에서 쉬는 오후', '테라스에서 쉬는 오후', '함께하는 카페 오후'],
    steps: questSteps
  }
};
