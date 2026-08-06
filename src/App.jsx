import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import routes from './routes';

/** 페이지 전환 시 스크롤 위로 + document.title 갱신 */
function PageMeta({ title }) {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = title;
    window.scrollTo(0, 0);
  }, [pathname, title]);
  return null;
}

export default function App() {
  return (
    <Layout>
      <Routes>
        {routes.flatMap((r) => {
          const el = <><PageMeta title={r.title} />{r.element}</>;

          /* GitHub Pages 는 /about.html 처럼 확장자가 붙은 경로로 직접 서빙되므로
             깔끔한 경로(/about)와 파일 경로(/about.html) 둘 다 매칭시켜야
             hydration 시 "No routes matched" → 불일치가 발생하지 않습니다. */
          const paths = r.path === '/' ? ['/', '/index.html'] : [r.path, `${r.path}.html`];

          return paths.map((p) => <Route key={p} path={p} element={el} />);
        })}
      </Routes>
    </Layout>
  );
}
