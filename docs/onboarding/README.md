# OSS Hub Onboarding

목표는 PRD를 읽고 자신의 역할 언어로 정리한 뒤, 에이전트와 함께 작은
검증 가능한 결과를 배포하는 것입니다. 첫 주에는 기능을 많이 만드는 대신
용어, 사용자 흐름, 책임 경계, 검증 방법을 익힙니다.

## Unknown unknowns

퀘스트의 키워드는 답이 아니라 탐색을 시작하는 지점입니다. 에이전트와 함께 개발하며 무엇을 모르는지조차 몰랐던 것(unknown unknowns)을 드러내고, 이를 질문과 검증으로 바꾸며 성장하는 것이 목적입니다. 관련 관점은 [Unknown unknowns](https://thariqs.github.io/html-effectiveness/unknowns/)에서 참고합니다.

## People

| 사람 | 역할 | 첫 주 결과 |
| --- | --- | --- |
| 진혜원 | Designer | 용어집, user journey, user flow, wireframe, mockup, 재사용 컴포넌트 목록 |
| 진솔 | Designer | 같은 도메인의 화면 구조, 상태/예외 흐름, 접근성 체크 |
| 동규 (eaststar) | Tech Lead | GitHub API 연결 구조, GitHub Actions, Vercel/Supabase 배포와 secret 경계 설계 |

## 역할별 시작 문서

- 디자이너: [디자이너 화면 흐름 실습](./designer-ia-walkthrough.md) → [Designer Quest](./designer-quest.md)
- Tech Lead: [Tech Lead Quest](./tech-lead-quest.md)

## 공통 규칙

- PRD에서 확인하지 않은 도메인, API, 데이터 모델은 만들지 않습니다.
- 모든 퀘스트는 작업 결과, 검증 방법, 다음 질문을 기록합니다.
- 에이전트에게 요청할 때는 목표, 입력 문서, 변경 파일, 검증 명령을 함께 줍니다.
- 비밀 값은 커밋하지 않고 `.env.example`에 변수 이름과 설명만 남깁니다.

## 에이전트 도구 설치

- lazycodex: `npx lazycodex-ai install`을 실행한 뒤 Codex에서 `$ulw-plan`, `$start-work`, `$ulw-loop`가 인식되는지 확인합니다.
- craft-skills (Claude Code): `/plugin marketplace add GoBeromsu/craft-skills`를 실행한 뒤 `/plugin install craft-skills@craft-skills`를 실행합니다. 설치 후 `/plugin`의 Installed 목록에 `craft-skills`가 활성 상태로 표시되고 로드 오류가 없는지 확인합니다.
- craft-skills (Codex): `codex plugin marketplace add GoBeromsu/craft-skills --ref 1ab242f519c601bfb20d724b55c348ad90194a41`를 실행한 뒤 `codex plugin add craft-skills@craft-skills --json`를 실행합니다. JSON 출력에서 `name`이 `craft-skills`, `version`이 `0.4.1`인지 확인합니다. `already added from a different source` 오류가 나오면 설치가 되지 않은 것입니다 — 기존 craft-skills marketplace를 제거하거나 별도 `CODEX_HOME`으로 격리한 뒤, 위 SHA 고정 명령이 성공한 경우에만 다음 단계로 진행합니다.
- 설치된 스킬 파일은 저장소에 커밋하지 않습니다.

## 완료 기준

첫 주가 끝나면 각 담당자는 자신의 용어집과 흐름 문서를 PR로 제출하고,
Tech Lead는 로컬 CI와 배포 흐름의 실패 지점을 설명할 수 있어야 합니다.
