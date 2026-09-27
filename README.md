# Exitz

> 떠나는 것도, 깔끔하게.

[Exitz](https://exitz.me)는 각종 서비스의 회원 탈퇴 절차를 단계별로 안내하는 계정 탈퇴 가이드 서비스입니다. 서비스명이나 도메인을 검색하면 탈퇴 방법(초성 검색 지원)과 개인정보 보호 팁을 바로 확인할 수 있습니다.

## 주요 기능

- 🔍 **스마트 검색** — 서비스명 또는 도메인 검색, 한글 초성 검색 지원 (`/api/search`)
- 📋 **단계별 탈퇴 가이드** — PC/모바일 등 탭으로 구분된 스텝 바이 스텝 안내
- 🖼️ **자동 OG 이미지 생성** — 각 탈퇴 가이드 페이지마다 Satori + resvg로 동적 썸네일 생성
- 👀 **조회수 기반 정렬** — Cloudflare KV로 조회수를 집계해 인기순 정렬 제공
- 🔒 **개인정보 도움말** — 휴면 계정 정리, 개인정보 보호 관련 팁 제공
- 🗳️ **가이드 제보** — 원하는 서비스의 탈퇴 가이드가 없을 경우 제보 가능

## 기술 스택

- [Astro](https://astro.build) 5 — 정적 사이트 생성 (SSR 엔드포인트 일부 포함)
- [`@astrojs/cloudflare`](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) — Cloudflare Workers 어댑터
- Astro Content Collections — `exit`, `help`, `documents` 콘텐츠 관리
- [Satori](https://github.com/vercel/satori) + [`@resvg/resvg-js`](https://github.com/thx/resvg-js) — 탈퇴 가이드별 동적 OG 이미지 생성
- Cloudflare Workers KV — 페이지별 조회수 저장
- Cloudflare Wrangler — 로컬 개발/배포

## 프로젝트 구조

```text
/
├── public/
│   ├── exit/               # 서비스별 탈퇴 가이드 스크린샷 (kakao, google, tving 등)
│   ├── help/                # 개인정보 도움말 이미지
│   ├── logo.svg, icon.svg  # 로고/파비콘
│   └── DMSans-ExtraBold.ttf # OG 이미지 생성용 폰트
├── src/
│   ├── content/
│   │   ├── config.ts        # 콘텐츠 컬렉션 스키마 정의
│   │   ├── exit/             # 서비스별 탈퇴 가이드 (.md)
│   │   ├── help/              # 개인정보 도움말 (.md)
│   │   └── documents/        # 이용약관, 개인정보처리방침
│   ├── layouts/
│   │   └── Layout.astro
│   ├── lib/
│   │   ├── sort.ts            # 정렬 로직 (최신순/조회순/가나다순 등)
│   │   └── views.ts           # Cloudflare KV 조회수 read/write
│   └── pages/
│       ├── index.astro       # 메인 페이지
│       ├── exit.astro          # 탈퇴 가이드 목록
│       ├── exit/[slug].astro   # 탈퇴 가이드 상세
│       ├── exit/[slug].png.ts  # 탈퇴 가이드별 동적 OG 이미지
│       ├── help.astro          # 도움말 목록
│       ├── help/[slug].astro   # 도움말 상세
│       ├── documents/          # 약관/정책 페이지
│       ├── sitemap.xml.ts
│       └── api/
│           ├── search.ts     # 검색 API (초성 검색 포함)
│           └── posts.ts      # 목록/페이지네이션 API
├── astro.config.mjs
├── wrangler.jsonc            # Cloudflare Workers 설정 (KV 바인딩 등)
└── package.json
```

## 시작하기

```bash
# 저장소 클론
git clone https://github.com/YounJason/Exitz.git
cd Exitz

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

기본적으로 `http://localhost:4321`에서 확인할 수 있습니다.

> ℹ️ 조회수 기능(`/api/search`, `/api/posts`)은 Cloudflare KV(`VIEWS` 네임스페이스)에 의존합니다. 로컬에서 전체 기능을 테스트하려면 `wrangler.jsonc`의 `kv_namespaces` 설정에 맞는 KV 네임스페이스가 필요합니다.

### 빌드 및 배포

```bash
npm run build      # astro build
npm run preview    # 빌드 후 wrangler dev로 미리보기
npm run deploy      # 빌드 후 Cloudflare Workers로 배포
npm run cf-typegen  # wrangler 타입 생성
```

## 콘텐츠 기여 (탈퇴 가이드 추가하기)

`src/content/exit/`에 마크다운 파일을 추가합니다. 스키마는 `src/content/config.ts`에 정의되어 있으며, 다음과 같은 구조를 따릅니다.

```yaml
---
title: "서비스명 회원 탈퇴 하는 방법"
serviceName: "서비스명"
domain: "example.com"
pubDate: 2026-01-01
description: "간단한 설명"
logo: "/exit/example/1.png"
tabs:
  - id: "pc"
    label: "컴퓨터"
    steps:
      - stepNumber: 1
        title: "단계 제목"
        description: "단계 설명"
        image: "/exit/example/2.png"
        actionUrl: "https://example.com/deactivate"
        actionText: "탈퇴 페이지 바로가기"
---
```

- `tabs` 대신 단일 흐름이라면 `steps`만 사용할 수도 있습니다.
- 스크린샷 이미지는 `public/exit/<slug>/` 아래에 순번대로 저장합니다.

개인정보 도움말은 `src/content/help/`에 동일한 방식으로 추가합니다.

## 라이선스

이 프로젝트는 [MIT License](./LICENSE)를 따릅니다.

## 문의

비즈니스 문의: exitz@exitz.me

---

© 2026 윤재선. All rights reserved.
