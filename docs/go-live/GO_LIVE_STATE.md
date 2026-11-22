# Vastu Nord v7 release state

Application commit `5d3dcc5` on `feat/v7-brand-photo-entry` is live on the existing Vastu Nord Hobby project. The release adds bilingual visitor preferences, the newsletter dock, floating Prana and direct controls for the homepage comparison. Vercel reported READY for `dpl_J6erWY7u52BMMHTC2xLQ8xqBXkqj`. [Noncommercial demonstration](https://vastunord-web.vercel.app)

TypeScript, ESLint, Prisma validation, the production build, 30 unit tests, 32 Playwright tests and the isolated PostgreSQL newsletter integration test passed locally. Browser coverage includes consent revocation, the 27-second invitation delay, persistent dismissal, keyboard interaction and the sample-to-Studio journey. [Phase 01 browser evidence](../evidence/v7-phase01/README.md)

On the public alias, all 17 Studio editors and both localized privacy pages opened. Five protected service paths and all three newsletter write operations returned the expected unavailable status. The browser observed no uncaught exception during these checks. [Design and route matrix](../FIGMA_TO_ROUTE_MATRIX.md)

| Journey | Status and boundary |
|---|---|
| Marketing → language, theme or Prana | Shared header on Norwegian/English and workspace routes. |
| Newsletter and cookies | Visitors can change their cookie preferences and reopen the newsletter invitation. Public collection is disabled on the noncommercial demo. |
| Home → sample → editor | Brand studies can be opened anonymously. Samples stay illustrative and private upload uses the existing signed-in project flow. |
| Studio library | 17 configured editors. Generation is unavailable in the public demo. |
| Accounts, projects, email and private media | Existing Development integrations. Public customer onboarding, private storage operations and lead collection stay closed on Hobby. |
| AI images/video, editorial CMS and publishing | Future scoped increments. Activation requires the relevant provider, permissions, rights and verification. |

Next, fit the rights-cleared empty and furnished photographs of the same room to the hero once the owner supplies the pair. The current hero labels its approved daylight and evening lighting study. Live newsletter delivery and consent persistence require a controlled Development verification before activation. [Route matrix](../FIGMA_TO_ROUTE_MATRIX.md) · [Owner actions](../OWNER_ACTIONS_ONE_LIST.md)
