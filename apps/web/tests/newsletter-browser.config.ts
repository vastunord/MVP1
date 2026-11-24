import { defineConfig } from "@playwright/test";

// Separate local server with synthetic, non-delivering newsletter configuration.
export default defineConfig({
  testDir: "./newsletter-browser",
  workers: 1,
  timeout: 60_000,
  use: { baseURL: "http://127.0.0.1:3111", headless: true, channel: "msedge" },
  webServer: {
    cwd: "..",
    command: "node tests/newsletter-browser/server.mjs",
    url: "http://127.0.0.1:3111",
    reuseExistingServer: false,
    timeout: 60_000,
  },
  reporter: "list",
});
