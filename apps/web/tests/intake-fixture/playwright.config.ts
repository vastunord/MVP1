import { defineConfig } from "@playwright/test";
export default defineConfig({ testDir: ".", testMatch: "intake.spec.ts", timeout: 45000,
  use: { baseURL: "http://127.0.0.1:31761", headless: true, channel: "msedge" },
  reporter: "list" });
