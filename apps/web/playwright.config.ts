import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/smoke",
  fullyParallel: false,
  workers: 1,
  timeout: 60000,
  use: { baseURL: "http://127.0.0.1:3100", headless: true, channel: "msedge" },
  webServer: {
    command:
      "node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
  reporter: "list",
});
