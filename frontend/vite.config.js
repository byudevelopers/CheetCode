import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:6000/',
      
    },
  },
  optimizeDeps: {
    exclude: ['vue-demi', '@vite/client', '@vite/env'],
  }
});