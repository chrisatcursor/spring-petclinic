import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite dev server serves the SPA on port 8080 and proxies REST API calls
// to the spring-petclinic-rest backend on port 9966 (context path /petclinic).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    strictPort: true,
    host: true,
    proxy: {
      '/petclinic': {
        target: 'http://localhost:9966',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 8080,
    strictPort: true,
    host: true,
  },
});
