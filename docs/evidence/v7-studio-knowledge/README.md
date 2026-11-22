# Studio and Knowledge Hub release verification

Application commit `0a99e002adc9` changes the homepage, Knowledge Hub, gallery and Studio. These checks use a signed-out browser and synthetic fixtures. They do not require AI credentials.

| Local release check | Result |
|---|---|
| Web application | Production build, TypeScript and ESLint passed. All 44 unit tests and all 41 Playwright tests passed. |
| Database and providers | Isolated PostgreSQL passed newsletter consent, Prana quota rollback and UTC reset, MNML private render replay and persistence, and per-version publication consent and withdrawal. MNML and OpenAI responses were supplied by fixtures. |
| CMS | Dedicated Payload build and TypeScript passed. Policy tests and a real Payload draft → review → publish → withdraw cycle passed in disposable PostgreSQL. |
| Photography | 680 distinct source assignments and 50 additional gallery thumbnail sizes verified. The study library adds 500 distinct images totalling 16,327,466 bytes. |
| Browser and layout | Four viewport widths, 12 distinct FAQ images, all 17 editors, visible desktop/mobile selector values, 17 gallery handoffs, six localized article pages and six closed APIs passed. Brand font loading and mobile overflow were checked. |
| Search | The demo returned a disallow-all robots file, an empty sitemap and a 404 for the unconfigured editorial journal. |

[Local verification data](local/checks.json) · [Mobile FAQ](local/faq-390.png) · [Desktop Studio](local/studio-room-1440.png) · [Mobile Studio controls](local/studio-options-390.png) · [Illustrated article](local/study-1440.png)

The Vercel Production build compared the protected application connection to the expected Frankfurt pool, restricted role, database and TLS configuration. It reported a mismatch or missing configuration and skipped connecting. No password, URL or customer data was printed. The public release uses closed private-service gates.

## Live result

Vercel assigned `dpl_HMXJBbuSXgDzs8a9YeQ2kucJqojW` to the public demo. At 390, 768, 1024 and 1440 CSS pixels the browser decoded all twelve FAQ images, loaded the brand fonts and found no horizontal overflow. It opened all 17 editors, verified all gallery tool choices, exercised optional keyboard comparison, and matched three distinct studies in both languages to their covers and canonical URLs. All six guarded API checks returned HTTP 503. The live robots and sitemap gates also passed. [Live results](live/checks.json) · [Live mobile Studio](live/studio-options-390.png) · [Live illustrated FAQ](live/faq-390.png) · [Live article](live/study-1440.png)

Repeat the release checks with `node --experimental-strip-types apps/web/scripts/verify-public-demo.mjs` followed by the local loopback origin on port 3100 or the assigned [Vastu Nord demo](https://vastunord-web.vercel.app). The verifier writes screenshots only for the designated origin. The commercial hosting, editorial rights and provider activation decisions remain in the [release checklist](../../go-live/RELEASE_CHECKLIST.md).
