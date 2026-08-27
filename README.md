# coratexkorea

코라텍스(CORATEX) 소개 웹사이트 — **지평상사 (JI PYEONG Corp)** 국내 독점 공급.

사출 · 압출 · 블로우 공정용 독일산 실린더 스크류 코팅 세정제를 안내하는 웹사이트입니다.

**배포 주소:** https://www.coratex-korea.com

---

## 기술 구성

| 항목 | 내용 |
|---|---|
| 프레임워크 | **React 19** + **React Router 7** |
| 빌드 도구 | **Vite 8** |
| 배포 | **Vercel** — 현재는 수동 배포(`vercel deploy --prod`). 아래 [자동 배포](#자동-배포-현재-꺼져-있음) 참고 |
| 렌더링 | **SSG (정적 생성)** — 15개 페이지를 각각 실제 HTML 파일로 생성 |
| 서버 기능 | **Vercel Serverless Functions** (`api/`) — 방문자 집계, 발주 메일 발송(첨부 포함) |
| 데이터 저장 | **Redis** (Vercel Marketplace, TCP) — 방문자 수 집계 전용, 개인정보 없음 |
| 메일 발송 | **Resend** (무료 요금제) — 발주 시 사진 첨부 메일 발송 |
| 스타일 | 단일 CSS (`src/styles/coratex.css`) — Bootstrap/jQuery 등 미사용 |
| 브랜드 컬러 | 화이트 / 오렌지 `#E8722A` / 네이비 `#1B4E9B` |

**SSG를 쓰는 이유:** 회사 홈페이지라 검색 노출이 중요합니다. SPA로만 만들면
검색엔진이 빈 페이지를 보게 되므로, 빌드 시 각 페이지를 완성된 HTML로 만들어
JS 없이도 내용이 읽히게 했습니다. 접속 후에는 React가 이어받아(hydration)
페이지 이동이 새로고침 없이 부드럽게 동작합니다.

**50대 이상 고객 가독성 우선** — 기본 글자 19px, 버튼 최소 높이 56px, 높은 명암비,
국문 우선 · 영문 병기.

---

## 개발

```bash
npm install     # 최초 1회
npm run dev     # 개발 서버 → http://localhost:5173/
```

## 빌드 & 배포

```bash
npm run build   # dist/ 에 15개 HTML + 자산 생성
```

### 자동 배포 (현재 꺼져 있음)

원래 의도된 흐름은 아래와 같습니다.

```
git push  →  GitHub(main)  →  Vercel 자동 빌드  →  www.coratex-korea.com
```

하지만 GitHub 저장소에 Vercel 웹훅/GitHub App이 설치되어 있지 않아
**push 만으로는 배포되지 않습니다.** (Vercel 프로젝트 설정상 "연결됨"으로는
보이지만 실제 웹훅이 없는 상태 — `vercel git connect` 로도 해결되지 않았습니다)

**그래서 지금은 매번 아래 명령으로 수동 배포합니다.**

```bash
git push origin main   # GitHub 에는 반영됨 (기록용)
vercel deploy --prod   # 실제 사이트에는 이 명령이 있어야 반영됨
```

`git push` 만 하고 이 명령을 잊으면 **GitHub 에는 최신 코드가 있지만
실제 사이트(www.coratex-korea.com)는 이전 버전 그대로**인 상태가 됩니다.

자동 배포를 다시 살리려면: https://github.com/apps/vercel 에서
**Configure** → 이 저장소(`Gunehee/coratexkorea`)에 권한 추가.
설치 후 `gh api repos/Gunehee/coratexkorea/hooks` 로 웹훅이 생겼는지 확인하세요
(빈 배열 `[]` 이면 아직 설치가 안 된 것입니다).

배포 상태: https://vercel.com/gunehees-projects/coratexkorea-react
빌드가 실패하면 이전 배포가 그대로 유지되므로 사이트가 깨지지 않습니다.

## 다국어(KR/EN)

모든 사용자 노출 문구는 `<Kr>` / `<En>` 로 구성되어 있습니다.

```jsx
<Kr>사용 방법</Kr> <En>How to Use</En>
```

- `<Kr>` 없이 한국어를 직접 쓰면 **영문 모드에서도 한국어가 그대로 노출**됩니다.
- 데이터(`src/data/site.js`)는 `ko`/`en` 쌍으로 관리합니다.
- 고객사 상호명은 한국 기업의 고유명사이므로 번역하지 않고 원문을 유지합니다.

영문 모드에 한국어가 남아 있는지 확인하는 방법:
브라우저에서 EN 으로 전환한 뒤 각 페이지를 훑어보거나,
`localStorage.setItem('coratex_lang','en')` 후 새로고침해 확인합니다.

---

## 파일 구성

```
src/
├── base.js                 배포 서브경로 (Vite BASE_URL 사용)
├── main.jsx                브라우저 진입점 (hydration)
├── entry-server.jsx        SSG 렌더 진입점
├── App.jsx                 라우팅
├── routes.jsx              15개 라우트 + 페이지별 title/description
├── data/site.js            ⭐ 사이트 전체 데이터 (단일 출처)
├── components/
│   ├── Layout.jsx          헤더 · 푸터 · 공통 표기 (En/Kr)
│   ├── ContactCard.jsx     바로 연락하기 (문의·발주 공용)
│   ├── DosageTable.jsx     사용량 표 (데이터로부터 자동 생성)
│   ├── FileAttach.jsx      발주 페이지 — 사진 첨부(브라우저에서 자동 축소)
│   ├── VisitCounter.jsx    홈 화면용 방문자 요약 (VisitDashboard 를 compact 모드로 감쌈)
│   └── VisitDashboard.jsx  방문자 통계 UI 본체 — 홈과 /stats 가 공유
├── hooks/
│   ├── useFormSubmit.js    문의·발주 전송 공통 로직 (Web3Forms → mailto 폴백)
│   ├── useVisitTracker.js  페이지 방문 시 1회 집계 전송
│   ├── useVisitStats.js    방문 통계 조회 + 60초 자동 갱신
│   ├── useCountUp.js       숫자 카운트업 애니메이션
│   └── useReveal.js        스크롤 진입 애니메이션(IntersectionObserver)
├── i18n/LanguageContext.jsx  KR/EN 전환 (localStorage)
├── pages/                  Home, About, Use, Effectiveness, ProcessPage,
│                           CompaniesPage, Order, Contact, PrivacyPolicy,
│                           Stats, NotFound, Edit
└── styles/coratex.css

api/                         Vercel Serverless Functions (Node.js)
├── visit.js                방문자 집계 · 조회 — Redis (누적/오늘/7일/이번달/추이)
└── order.js                발주 메일 발송 — Resend, 첨부 파일 포함 (무료 요금제)

public/
├── images/                 제품 · 공정 사진
├── favicon.svg             파비콘 · 로고
├── og-image.png            소셜 공유 카드
└── site.webmanifest        PWA

scripts/prerender.js        SSG — 라우트를 HTML 파일로 생성 + sitemap
```

---

## ⭐ 사용량 수치 수정 방법 (중요)

**`src/data/site.js` 한 곳만 고치면 됩니다.**

이전 정적 사이트에서는 사용량 숫자가 `coratex.js`의 DATA와 각 HTML의 `<table>`
**두 곳에 중복**되어 있어서 항상 함께 고쳐야 했고, 실수로 한쪽만 고치면
표와 데이터가 어긋났습니다.

React 전환 후에는 표가 데이터로부터 자동 생성되므로 **중복이 없고, 불일치가
구조적으로 발생할 수 없습니다.**

```js
// src/data/site.js
export const processes = {
  injection: {
    rows: [
      { key: 'coratex', ko: '코라텍스 양', cells: [
          { strong: '15-20g', rest: ' / 1/2 뚜껑' },   // ← 여기만 고치면 표에 반영
          ...
```

수정 후 `npm run build` 하면 끝입니다.

---

## 방문자 통계 (/stats, 홈 화면)

`api/visit.js` 가 Redis(Vercel Marketplace, TCP `redis://` 연결)에 방문마다
카운트를 올립니다. IP·User-Agent 등 개인정보는 전혀 읽지 않으며, 같은 사람이
다시 방문해도 매번 새로 집계됩니다(재방문 포함 방문자 수).

- 누적 / 오늘 / 최근 7일 / 이번 달 / 최근 7일 추이(막대그래프)
- 홈 화면 하단(`VisitCounter`)과 `/stats` 전용 페이지가 **같은 컴포넌트**
  (`VisitDashboard`)를 공유합니다 — 한쪽만 고치는 사고를 방지하기 위함입니다.
- 환경변수 `REDIS_URL` 이 없으면 `api/visit.js` 가 조용히 실패하고,
  화면에서는 방문자 섹션 전체가 노출되지 않습니다(오류 문구 없음).

## 발주 사진 첨부 (사업자등록증 · 명함)

`/order` 페이지에서 **사업자등록증과 명함 사진 첨부가 필수**입니다. `api/order.js`
가 Resend(무료 요금제, 도메인 `coratex-korea.com` 인증 완료)로 사진을 포함한
메일을 바로 발송합니다.

- 휴대폰 사진(3~8MB)은 브라우저에서 보내기 전에 긴 변 1600px 로 자동 축소됩니다.
- 기존 문의 폼(Web3Forms)은 첨부 기능이 유료(PRO)라 사용하지 않고,
  첨부가 있는 발주만 `api/order.js` 로 보냅니다. 첨부 없는 다른 폼은
  기존 Web3Forms 경로 그대로입니다.
- 필요한 환경변수: `RESEND_API_KEY`, `ORDER_FROM_EMAIL`, `ORDER_TO_EMAIL`
  (Vercel 프로젝트 설정에 등록되어 있습니다). 없으면 501 을 반환하고,
  화면은 "발주는 접수하되 사진은 못 보냈다"고 정직하게 안내합니다.

## edit.html — 내부 전용

리뷰 관리 페이지로, **검색엔진에 노출되면 안 됩니다.**

- 빌드 시 `<meta name="robots" content="noindex, nofollow">` 자동 삽입
- `public/robots.txt` 에서 `Disallow: /edit.html`
- `sitemap.xml` 에서 자동 제외 (`routes.jsx` 의 `noindex: true`)
- 리뷰는 브라우저 LocalStorage 에만 저장되며 서버로 전송되지 않습니다.

---

## 이미지

`public/images/` 에 있습니다. 교체 시 **파일명을 유지**하면 코드 수정 없이 반영됩니다.

| 파일 | 사용 위치 |
|---|---|
| `coratex-bottles.png` | 홈 — 히어로 |
| `coratex-poster.png` | 소개 |
| `injection.jpg` / `extrusion.jpg` / `blow-molding.jpg` | 홈, 사용 방법 — 공정 카드 |
| `purge-order.jpg` | 제품 효과 — 퍼징 순서 |
| `ambassador-auto.jpg` / `schmidt-zol.jpg` / `trio-tube.jpg` | 홈 — 자매 제품 |

---

## 연락처

**지평상사 (JI PYEONG Corp)** — 독점권자 · Sole Distributorship in Korea

- 주소: 서울특별시 도봉구 마들로 11가길 12 다모아빌딩 403호
- 전화: 02-908-7907 / 팩스: 02-908-7909
- 휴대전화: 010-8596-5562
- 이메일: 0822gblessy@naver.com

---

Coratex HT® and productivity with marks purging® are registered trademarks of SAINT-GOBAIN Abrasives.
© 2026 All Rights Reserved by JI PYEONG Corp
