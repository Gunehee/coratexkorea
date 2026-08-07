/**
 * SSG 프리렌더 — 각 라우트를 실제 HTML 파일로 생성합니다.
 *
 * 실행 순서 (package.json 의 build):
 *   1) vite build            → dist/ (클라이언트 번들 + index.html)
 *   2) vite build --ssr      → dist-ssr/ (서버 렌더용 번들)
 *   3) node scripts/prerender.js  → dist/*.html + sitemap.xml
 *
 * 결과: 12개 페이지가 각각 독립된 HTML 파일이 되어
 *       검색엔진이 JS 실행 없이도 내용을 읽을 수 있습니다.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const BASE = process.env.BASE_PATH || '/';
const ORIGIN = process.env.SITE_ORIGIN || 'https://coratexkorea.vercel.app';

const { render, routes } = await import(path.join(ROOT, 'dist-ssr/entry-server.js'));

// Vite 는 진입점 파일명 그대로 산출합니다 (index.source.html)
const template = fs.readFileSync(path.join(DIST, 'index.source.html'), 'utf-8');

// sitemap 우선순위
const PRIORITY = {
  'index.html': '1.0',
  'use.html': '0.9',
  'about.html': '0.8',
  'effectiveness.html': '0.8',
  'injection.html': '0.8',
  'extrusion.html': '0.8',
  'blow_molding.html': '0.8',
  'contact.html': '0.7',
};

const today = new Date().toISOString().slice(0, 10);
const sitemapEntries = [];

console.log('프리렌더 중...');

for (const r of routes) {
  /* 실제 서빙되는 URL(예: /about.html)로 렌더해야 클라이언트가 같은 라우트를
     매칭하여 hydration 이 일치합니다. */
  let appHtml = render('/' + r.file);

  /* React 19 는 <img> 등에 대해 <link rel="preload"> 를 자동 생성(hoist)합니다.
     renderToString 은 이를 #root 안에 넣지만 클라이언트는 <head> 로 옮기므로
     그대로 두면 hydration 불일치(React error #418)가 발생합니다.
     → 프리렌더 시 미리 <head> 로 이동시켜 서버/클라이언트 구조를 맞춥니다. */
  const hoisted = [];
  appHtml = appHtml.replace(/<link\b[^>]*\/?>/g, (tag) => {
    hoisted.push(tag);
    return '';
  });

  let html = template
    .replace('<!--app-html-->', appHtml)
    .replace('</head>', `${hoisted.join('')}\n</head>`)
    .replace(/<title>.*?<\/title>/, `<title>${r.title}</title>`)
    .replace(
      /<meta name="description" content=".*?">/,
      `<meta name="description" content="${r.desc}">`
    );

  // 내부 전용 페이지는 색인 제외
  if (r.noindex) {
    html = html.replace(
      '</head>',
      '<meta name="robots" content="noindex, nofollow">\n</head>'
    );
  } else {
    const loc = r.file === 'index.html' ? '' : r.file;
    sitemapEntries.push(
      `  <url>\n` +
      `    <loc>${ORIGIN}${BASE}${loc}</loc>\n` +
      `    <lastmod>${today}</lastmod>\n` +
      `    <priority>${PRIORITY[r.file] || '0.6'}</priority>\n` +
      `  </url>`
    );
  }

  const out = path.join(DIST, r.file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  console.log(`  ✓ ${r.file}`);
}

// sitemap.xml
fs.writeFileSync(
  path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  sitemapEntries.join('\n') +
  `\n</urlset>\n`
);
console.log(`  ✓ sitemap.xml (${sitemapEntries.length} URL)`);

// GitHub Pages 가 Jekyll 처리를 건너뛰도록
fs.writeFileSync(path.join(DIST, '.nojekyll'), '');

// 템플릿 원본은 배포본에 불필요
fs.rmSync(path.join(DIST, 'index.source.html'), { force: true });

/* 404.html — 원본 404 문구를 그대로 렌더합니다.
   GitHub Pages 는 없는 경로에 이 파일을 돌려주므로, 라우터가 클라이언트에서
   다시 매칭하여 실제 페이지(새로고침·북마크)도 정상 동작합니다. */
{
  const notFoundHtml = (() => {
    let appHtml = render('/__not_found__');
    const hoisted = [];
    appHtml = appHtml.replace(/<link\b[^>]*\/?>/g, (tag) => {
      hoisted.push(tag);
      return '';
    });
    return template
      .replace('<!--app-html-->', appHtml)
      .replace('</head>', `${hoisted.join('')}\n</head>`)
      .replace(/<title>.*?<\/title>/, '<title>페이지를 찾을 수 없습니다 (404) | 코라텍스 (CORATEX)</title>')
      .replace(
        /<meta name="description" content=".*?">/,
        '<meta name="description" content="요청하신 페이지를 찾을 수 없습니다.">'
      )
      .replace('</head>', '<meta name="robots" content="noindex">\n</head>');
  })();
  fs.writeFileSync(path.join(DIST, '404.html'), notFoundHtml);
}
console.log('  ✓ .nojekyll, 404.html');

console.log(`\n완료 — ${routes.length}개 페이지`);
