import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4173,
    proxy: {
      '/petclinic': {
        target: 'http://localhost:9966',
        changeOrigin: true,
      },
      '/resources': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
