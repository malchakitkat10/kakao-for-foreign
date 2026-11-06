# Playground

카카오톡 네 번째 탭에서 들어가는 해커톤용 Playground 프로토타입입니다. 팬메이드 게임 홈, 창작마당, 에셋 팩과 제작 도구, 오픈채팅 및 카나나 한국어 학습 화면을 포함합니다.

## GitHub에서 수정

이 저장소의 `main`을 기준으로 작업합니다.

- [저장소](https://github.com/malchakitkat10/kakao-for-foreign)
- [웹 편집기 열기](https://github.dev/malchakitkat10/kakao-for-foreign)

웹 편집기에서 파일을 수정한 뒤 Source Control에서 변경 사항을 확인하고 커밋합니다. 기능별 작업은 별도 브랜치에서 수정한 뒤 Pull Request로 합칩니다. `dist/`가 실제 편집 대상이며 별도 빌드 과정은 없습니다.

GitHub 웹 편집기는 코드를 편집하는 화면입니다. 실행 확인은 아래 로컬 서버나 터미널을 지원하는 개발 환경에서 합니다. 채팅, 제작 초안 및 학습 기록은 브라우저의 로컬 데이터이며 GitHub에 저장되지 않습니다.

## 로컬 실행

별도 패키지 설치 없이 실행할 수 있습니다.

```sh
python3 -m http.server 4173 --directory dist
```

Playground 홈: http://localhost:4173/#one

## 수정할 파일

| 화면·기능 | JavaScript | 스타일 |
| --- | --- | --- |
| Playground 홈·인기순위 배너·메뉴 | `dist/features/one.js` | `dist/one-editorial.css` |
| 창작마당 콘텐츠 | `dist/features/playground.js` | `dist/playground.css` |
| 에셋 팩·무엇을 만들까요·초안 편집 | `dist/features/studio.js` | `dist/studio.css` |
| 친구·채팅 | `dist/features/friends.js`, `dist/features/chats.js` | `dist/reference-design.css` |
| 채팅 입력 | `dist/features/chat-input.js` | `dist/chat-input.css` |
| 오픈채팅·세부 채널 | `dist/features/openchat.js` | `dist/openchat-entry.css`, `dist/kiwi-chat.css` |
| 카나나 한국어 학습 | `dist/features/kanana-chat.js`, `dist/features/kanana-data.js` | `dist/kanana-chat.css` |
| 공통 탐색·이벤트·기본 데이터 | `dist/app.js`, `dist/data.js` | `dist/talk-app.css` |

`dist/index.html`에서 화면 파일을 불러오고 `dist/bootstrap.js`가 앱을 시작합니다. 이미지와 아이콘은 `dist/assets/`, 출처는 `ASSET-SOURCES.md` 및 각 에셋 폴더의 `sources.json`에 있습니다. `design/`은 화면 참고 이미지입니다.

제작 도구는 사용자가 제공한 `kakao-one-studio` 소스를 현재 앱의 에셋·저장 구조에 연결했습니다. 준비된 예제로 초안을 만들고 편집·저장·미리 플레이할 수 있습니다.

단일 HTML로 내보낸 `outputs/`와 `dist/exports/`는 로컬 보관용 스냅샷이므로 버전 관리에서 제외합니다. 수정은 위 원본 파일에 반영합니다.

## 확인과 배포

JavaScript 수정 후 `node --check 수정한파일.js`로 문법을 확인하고 로컬 브라우저에서 해당 화면을 확인합니다. 공통 파일을 수정했다면 친구·채팅 화면도 확인합니다.

GitHub 커밋과 사이트 배포는 별도입니다. 이 저장소에 커밋해도 기존 Sites 사이트가 자동으로 갱신되지는 않습니다. `.openai/hosting.json`에는 기존 배포 식별자가 보관되어 있습니다.

### First-install demo
Open `http://localhost:4173/`: Chats is the default, with Kanana only. Profile: Alex Morgan; Friends: empty. Kanana offers Korean / Webtoons / K-dramas / Squid Game / TWS, also matched from Korean or English typed interest messages. Korean links to one-on-one exercises or a language-exchange room; the other four open their associated group. New rooms appear in Chats only after opening them. Group channel selection and local messages persist. Settings → Restart first-time demo resets only this demo’s conversations and joins; Playground creations remain. Recommendations, group members and replies are scripted locally, not live AI matchmaking.
