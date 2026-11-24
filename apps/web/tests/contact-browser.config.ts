import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./smoke",
  testMatch: "contact-fallback.spec.ts",
  workers: 1,
  timeout: 60_000,
  use: { baseURL: "http://127.0.0.1:3112", headless: true, channel: "msedge" },
  webServer: {
    cwd: "..",
    command: "node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3112",
    url: "http://127.0.0.1:3112",
    reuseExistingServer: false,
    timeout: 60_000,
  },
  reporter: "list",
});
