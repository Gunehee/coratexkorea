import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/* 배포 경로.
   · Vercel 등 루트 도메인 배포: 기본값 '/'
   · GitHub Pages 서브경로 배포: BASE_PATH=/저장소이름/ 으로 빌드 */
const BASE = process.env.BASE_PATH || '/';

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
