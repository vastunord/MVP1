import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./auth-browser",
  workers: 1,
  timeout: 60_000,
  use: { baseURL: "http://127.0.0.1:3114", headless: true, channel: "msedge" },
  webServer: {
    cwd: "..",
    command: "node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3114",
    url: "http://127.0.0.1:3114",
    reuseExistingServer: false,
    timeout: 60_000,
  },
  reporter: "list",
});
