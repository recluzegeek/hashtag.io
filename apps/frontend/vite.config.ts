/// <reference types='vitest' />
import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/frontend',
  server: {
    port: process.env.FRONTEND_SERVING_PORT ? Number(process.env.FRONTEND_SERVING_PORT) : 4200,
    host: 'localhost',
  },
  preview: {
    port: process.env.FRONTEND_PREVIEW_PORT ? Number(process.env.FRONTEND_PREVIEW_PORT) : 4300,
    host: 'localhost',
  },  
  plugins: [!process.env.VITEST && reactRouter()],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
