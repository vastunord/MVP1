# Vastu Nord v7 release state

Application commit `a550e02` on `feat/v7-brand-photo-entry` is live on the existing Vastu Nord Hobby project. The release covers the brand baseline, shared header and homepage-to-Studio entry. Vercel reported READY for `dpl_Gdmdz94uY1kK9PE8e1Yo6GCpbVtR`. [Noncommercial demonstration](https://vastunord-web.vercel.app)

TypeScript, ESLint, the production build, 23 unit tests and 28 Playwright tests passed locally. A separate synthetic auth-configured process verified anonymous sample access, protected private routes and the return destination after login. The mobile comparison handle was checked after a visual correction. The source-media manifest reproduced byte-for-byte on a second scan. [Browser evidence](../evidence/v7-brand-entry/README.md)

On the public alias, all 12 marketing URLs and 17 tool routes passed. Browser testing verified sample navigation, focus and keyboard comparison, persistent preferences, loaded brand typography, responsive image widths in both themes, and five closed service endpoints. No uncaught browser exception occurred in the tested journey. [Live route matrix](../FIGMA_TO_ROUTE_MATRIX.md)

| Journey | Status and boundary |
|---|---|
| Marketing → language, theme or Prana | Shared header on Norwegian/English and workspace routes. |
| Home → sample → editor | Brand studies can be opened anonymously. Samples stay illustrative and private upload uses the existing signed-in project flow. |
| Studio library | 17 configured editors. Generation is unavailable in the public demo. |
| Accounts, projects, email and private media | Existing Development integrations. Public customer onboarding, private storage operations and lead collection stay closed on Hobby. |
| AI images/video, editorial CMS and publishing | Future scoped increments. Activation requires the relevant provider, permissions, rights and verification. |

Next, finish the approved desktop/mobile homepage crop against the design artwork. The following marketing pass covers the remaining finalized board pairs. [Route matrix](../FIGMA_TO_ROUTE_MATRIX.md) · [Owner decisions](../OWNER_ACTIONS_ONE_LIST.md)
