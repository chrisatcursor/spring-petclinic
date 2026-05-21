import { defineConfig } from '@playwright/test';
import path from 'node:path';

const REST_BACKEND_DIR =
  process.env.PETCLINIC_REST_DIR ?? path.resolve(process.cwd(), '../spring-petclinic-rest');

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 0,
  workers: 1,
  use: {
    baseURL: 'http://localhost:8080',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  // Two-process stack:
  //   1. spring-petclinic-rest backend on :9966 (JSON API at /petclinic/api)
  //   2. Vite dev server on :8080 (serves the React SPA and proxies /petclinic/*)
  webServer: [
    {
      command: `cd ${REST_BACKEND_DIR} && ./mvnw -q -DskipTests spring-boot:run`,
      url: 'http://localhost:9966/petclinic/api/pettypes',
      reuseExistingServer: true,
      timeout: 240_000,
      stdout: 'ignore',
      stderr: 'pipe',
    },
    {
      command: 'npm --prefix frontend run dev -- --host 0.0.0.0',
      url: 'http://localhost:8080',
      reuseExistingServer: true,
      timeout: 120_000,
      stdout: 'ignore',
      stderr: 'pipe',
    },
  ],
});
