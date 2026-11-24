import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir:"./smoke", testMatch:"knowledge-taxonomy.spec.ts", workers:1, timeout:60000,
  use:{baseURL:"http://127.0.0.1:3108", headless:true, channel:"msedge"},
  webServer:{command:"node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3108", cwd:"..", url:"http://127.0.0.1:3108", reuseExistingServer:false, timeout:60000},
});
