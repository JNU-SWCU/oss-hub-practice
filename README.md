# JNU OSS Hub

전남대학교(Chonnam National University) 오픈소스 소프트웨어(OSS) 플랫폼.

전남대 구성원들이 오픈소스 프로젝트를 등록·공유·협업할 수 있는 중심 허브입니다.

## 목표

- 교내 오픈소스 프로젝트 모음 및 검색
- 기여자/메인테이너 커뮤니티 연결
- 학생·연구실 프로젝트의 공개와 협업 지원

## 상태

Frontend-only mock demo 구현 중입니다. 실제 로그인, GitHub API, 데이터베이스, 파일 업로드 없이 PRD 흐름을 클릭해 보는 Vercel Preview용 화면입니다.

## 시작하기

```bash
pnpm install
pnpm dev
```

로컬 주소는 `http://127.0.0.1:5173`입니다.

## 데모 범위

- 역할 선택: 외부 공개, 학생, 교직원, 시스템 관리자
- 학생 신청서 제출과 팀 GitHub ID 입력
- 교직원 신청 검토, 보완 요청, 승인, 자산 공개 mock
- 팀 우선 Kaggle식 OSS 활동 리더보드
- 관리자 사용자 생성/상태 변경/API 관찰 mock

추가된 PRD 외 demo 범위는 `docs/prd-additions-demo-scope.md`에 정리했습니다.
