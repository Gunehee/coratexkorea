import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages: https://gunehee.github.io/CORATEX_WebD/
export default defineConfig({
  base: '/CORATEX_WebD/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // 루트 index.html 은 배포 산출물이므로, 소스 템플릿은 별도 파일을 씁니다.
    rollupOptions: { input: 'index.source.html' },
  },
});
