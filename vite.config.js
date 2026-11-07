import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The Sarvam key lives only in the proxy (server/index.js); the browser calls /api/*.
const apiTarget = `http://127.0.0.1:${process.env.API_PORT || 8787}`;

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    entries: ['src/**/*.{jsx,js}'],
  },
  server: {
    watch: {
      ignored: ['**/reference/**'],
    },
    proxy: {
      '/api': apiTarget,
    },
  },
  preview: {
    proxy: {
      '/api': apiTarget,
    },
  },
});
