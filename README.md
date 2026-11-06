# Kakao for Foreign

카카오 해커톤용 슈퍼앱 프로토타입입니다. 기존 Kakao World 사이트의 버전 3 소스에서 시작합니다.

## 로컬 실행

별도 패키지 설치 없이 실행할 수 있습니다.

```sh
python3 -m http.server 4173 --directory dist
```

브라우저에서 http://localhost:4173 을 여세요.

## 파일 구성

- `dist/`: HTML, CSS, JavaScript 및 이미지
- `design/`: 기존 디자인 참고 이미지
- `ASSET-SOURCES.md`: 에셋 출처
- `.openai/hosting.json`: 기존 Sites 배포 식별자

## 배포

현재 사이트: https://kakao-world-concept-1106.yeonbagpt001.chatgpt.site

GitHub 커밋과 Sites 배포는 별도입니다. GitHub에 올리는 것만으로 자동 배포되지 않습니다. 기존 Sites 프로젝트 식별자를 유지하여 배포합니다.
