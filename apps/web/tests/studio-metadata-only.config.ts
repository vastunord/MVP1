import { defineConfig } from "@playwright/test";
export default defineConfig({testDir:"./smoke", testMatch:"studio-metadata.spec.ts", workers:1, timeout:90000,
  use:{baseURL:"http://127.0.0.1:3111", headless:true, channel:"msedge"},
  webServer:{command:"node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3111", cwd:"..", url:"http://127.0.0.1:3111", reuseExistingServer:false, timeout:60000}, reporter:"list"});
