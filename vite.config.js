import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages: https://gunehee.github.io/coratexkorea/
// 저장소 이름이 바뀌면 BASE_PATH 환경변수만 바꾸면 됩니다.
const BASE = process.env.BASE_PATH || '/coratexkorea/';

export default defineConfig({
  base: BASE,
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // 루트 index.html 은 배포 산출물이므로, 소스 템플릿은 별도 파일을 씁니다.
    rollupOptions: { input: 'index.source.html' },
  },
});
