import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import { BASENAME } from './base';

/**
 * SSR 렌더 — basename 을 클라이언트(main.jsx)와 반드시 동일하게 맞춰야
 * hydration 불일치(React error #418)가 발생하지 않습니다.
 * GitHub Pages 서브경로: /CORATEX_WebD
 */
export function render(url) {
  return renderToString(
    <React.StrictMode>
      <StaticRouter location={BASENAME + url} basename={BASENAME}>
        <App />
      </StaticRouter>
    </React.StrictMode>
  );
}

export { default as routes } from './routes';
