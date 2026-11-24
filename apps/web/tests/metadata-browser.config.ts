import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./metadata-browser",
  workers: 1,
  timeout: 60_000,
  use: { baseURL: "http://127.0.0.1:3113", headless: true, channel: "msedge" },
  webServer: {
    cwd: "..",
    command: "node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3113",
    url: "http://127.0.0.1:3113",
    reuseExistingServer: false,
    timeout: 60_000,
  },
  reporter: "list",
});
