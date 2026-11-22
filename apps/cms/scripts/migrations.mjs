import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { createRequire } from "node:module";
import { dirname } from "node:path";

const [command, ...args] = process.argv.slice(2);
if (!["migrate:create", "migrate:status", "migrate"].includes(command)) {
  throw new Error("Choose migrate:create, migrate:status or migrate.");
}
const require = createRequire(import.meta.url);
const executable = resolve(dirname(require.resolve("payload")), "../bin.js");
const result = spawnSync(process.execPath, [executable, command, ...args], {
  stdio: "inherit",
  env: {
    ...process.env,
    PAYLOAD_CONFIG_PATH: resolve("src/migration.config.ts"),
  },
});
process.exitCode = result.status ?? 1;
