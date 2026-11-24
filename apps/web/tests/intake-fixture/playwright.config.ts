import { defineConfig } from "@playwright/test";
export default defineConfig({ testDir: ".", testMatch: "intake.spec.ts", timeout: 45000,
  use: { baseURL: "http://127.0.0.1:31761", headless: true, channel: "msedge" },
  webServer: { command: "node ../../node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port 31761", url: "http://127.0.0.1:31761", reuseExistingServer: false, timeout: 60000 },
  reporter: "list" });
