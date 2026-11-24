import { spawn } from "node:child_process";

// Browser tests intercept all newsletter submissions. These values cannot
// authenticate to a provider or database and never use a deployed environment.
const environment = {
  PATH: process.env.PATH,
  SystemRoot: process.env.SystemRoot,
  WINDIR: process.env.WINDIR,
  TEMP: process.env.TEMP,
  TMP: process.env.TMP,
  NODE_ENV: "production",
  VERCEL: "",
  VERCEL_ENV: "",
  APP_ENV: "development",
  DATABASE_URL: "postgresql://fixture:fixture@127.0.0.1:1/fixture",
  NEWSLETTER_TOKEN_SECRET: "synthetic-fixture-secret-not-a-real-secret",
  NEWSLETTER_ENABLED: "true",
  AUTH_EMAIL_PROVIDER: "resend",
  RESEND_API_KEY: "fixture",
  AUTH_EMAIL_FROM: "fixture@example.invalid",
  BETTER_AUTH_URL: "http://127.0.0.1:3111",
  GROQ_API_KEY: "",
  GroqAPI: "",
  PRANA_FILM_VIDEO_ID: "",
};
const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3111"], {
  env: environment,
  stdio: "inherit",
});
child.on("exit", (code) => { process.exitCode = code ?? 1; });
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
