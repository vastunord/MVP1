import { defineConfig } from "@playwright/test";
export default defineConfig({ testDir: ".", testMatch: "overlay-upload.spec.ts", timeout: 60_000,
  use: { baseURL: "http://127.0.0.1:31772", headless: true, channel: "msedge" },
  webServer: { command: "node ../../node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port 31772", url: "http://127.0.0.1:31772/app/tools/demo", reuseExistingServer: false, timeout: 60_000 },
  reporter: "list" });
