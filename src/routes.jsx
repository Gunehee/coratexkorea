import Home from './pages/Home';
import About from './pages/About';
import Use from './pages/Use';
import Effectiveness from './pages/Effectiveness';
import Contact from './pages/Contact';
import Edit from './pages/Edit';
import ProcessPage from './pages/ProcessPage';
import CompaniesPage from './pages/CompaniesPage';
import { processes, companyLists } from './data/site';

/**
 * 라우트 정의 — 개발 서버(react-router)와 빌드 시 SSG가 같은 목록을 씁니다.
 * path 는 그대로 정적 파일 경로가 됩니다: '/about' → about.html
 */
const routes = [
  { path: '/', file: 'index.html', title: '코라텍스 (CORATEX) | 지평상사',
    desc: '사출·압출·블로우용 독일산 실린더 스크류 코팅 세정제 코라텍스(CORATEX). 지평상사 국내 독점 공급.',
    element: <Home /> },

  { path: '/about', file: 'about.html', title: '소개 | 코라텍스 (CORATEX)',
    desc: '코라텍스는 원재료 절약과 100% 재활용이 가능한 스크류·실린더 코팅 세정제입니다.',
    element: <About /> },

  { path: '/use', file: 'use.html', title: '사용 방법 | 코라텍스 (CORATEX)',
    desc: '사출·압출·블로우 공정별 코라텍스 사용량과 사용 절차를 안내합니다.',
    element: <Use /> },

  { path: '/effectiveness', file: 'effectiveness.html', title: '제품 효과 | 코라텍스 (CORATEX)',
    desc: '흑점 제거, 퍼징 시간 단축, 스크류 수명 연장, 불량률 감소 — 코라텍스의 4가지 효과.',
    element: <Effectiveness /> },

  ...Object.values(processes).map((p) => ({
    path: `/${p.slug}`,
    file: `${p.slug}.html`,
    title: `${p.title} | 코라텍스 (CORATEX)`,
    desc: `${p.title} 공정의 코라텍스 사용량과 색상 교체·흑점 제거 절차 안내.`,
    element: <ProcessPage process={p} />,
  })),

  ...Object.values(companyLists).map((c) => ({
    path: `/${c.slug}_companies`,
    file: `${c.slug}_companies.html`,
    title: `${c.ko} | 코라텍스 (CORATEX)`,
    desc: `코라텍스를 사용 중인 ${c.ko} 목록입니다. ${c.plus}.`,
    element: <CompaniesPage list={c} />,
  })),

  { path: '/contact', file: 'contact.html', title: '문의 | 코라텍스 (CORATEX)',
    desc: '코라텍스 구매 및 사용 문의 — 전화 010-8596-5562.',
    element: <Contact /> },

  { path: '/edit', file: 'edit.html', title: '리뷰 관리 (내부) | 코라텍스 (CORATEX)',
    desc: '내부 전용 리뷰 관리 페이지입니다.',
    noindex: true,
    element: <Edit /> },
];

export default routes;
