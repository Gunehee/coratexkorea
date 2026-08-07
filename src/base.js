/** GitHub Pages 서브경로 — vite.config.js 의 base 와 반드시 동일해야 합니다.
 *  빌드 시 Vite 가 주입하는 값을 사용하므로 수동 동기화가 필요 없습니다. */
export const BASENAME = import.meta.env.BASE_URL.replace(/\/$/, '');
