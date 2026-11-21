# Studio workspace screen inventory — Phase 01E-B

**Reference:** rendered designer `/app`, desktop about 1280×720. All listed names, counts, prices, dates, activity, notifications, credit balances, outputs and account details are **OBSERVED display only**. Their backing services and persistence are **UNVERIFIED**. No upload, generation, payment, sharing, download, account change, archive/restore/delete, or sign-out was performed.

## Workspace routes

| Screen / actual route | Observed UI and navigation | Empty/disabled/missing behavior and status |
|---|---|---|
| Home / `/app` | Greeting/dashboard; New visualization, My files, Projects; Continue Working collection; recommended tools; recent projects; Learn/article links. Workspace sidebar links Home, Tools, Files, Projects, Shared; Search, Notifications, Account are also visible. | Demo content appears populated. Some cards say “No preview yet”. Counts and file/project activity are UNVERIFIED. |
| Tools / `/app/library` | Search tools; filters All, Interior Design, Exterior & Landscape, Virtual Staging, Image Enhancement; 17 tool cards in a four-column desktop grid. | Search/filter functionality was not tested here. At collapsed desktop sidebar the card grid remained four columns. Narrow viewport layout NOT TESTED. |
| Files / `/app/files` | Active, Archived, Recently deleted tabs; search; project and sort menus; category filters; cards with file actions. | Displayed 26 Active, 1 Archived, 1 Recently deleted. Active cards commonly show “No preview yet”. Counts and file operations UNVERIFIED. One newly opened empty Room Reimagination file appeared in this list as saved just now; see side-effect note below. |
| Files — Archived / `/app/files?view=archived` | Same file filters; one card displayed for an archived Furniture Refresh file. | No archive/restore action used. State and persistence UNVERIFIED. |
| Files — Recently deleted / `/app/files?view=deleted` | One deleted Room Reimagination card; text says it can be restored for a remaining period; file actions present. | Restore was not used. Permanent deletion was not attempted. Recovery/purge behavior UNVERIFIED. |
| Projects / `/app/projects` | Active/Archived/Recently deleted tabs; search, sort, tags (Pinned, Updated this week, Client work, Priority and hashtags); Create project button; three active project cards. | Create project and project action menus were not used. Counts and persistence UNVERIFIED. |
| Project detail / `/app/projects/pr-sodermalm` | Project title/description, tags, file count, Create New Visualization, Add Existing File, Share for review, file search/sort and three file cards. | Creating, attaching and sharing were NOT TESTED. Visible controls do not prove persistence or link delivery. |
| Shared / `/app/shared` | Review links tab (3 displayed), filters Waiting/Changes requested/Approved/Ended; displayed links include approved, changes requested and expired states. | Review status and view counts UNVERIFIED. No link opened, created, edited or revoked. |
| Shared — Downloads / `/app/shared?tab=downloads` | Downloads tab (2 displayed), file name/type/resolution/size, past delivery text and Download again controls. | Download not clicked; file output and delivery UNVERIFIED. |
| Search / `/app/search` | Search field, recent-query chips and suggested searches. Selecting the displayed `kitchen` recent query changed the field to `kitchen`. | Search remained in “QUERY PROCESSING” with skeleton rows; results NOT ACCESSIBLE in the observed state. Result correctness and search history persistence UNVERIFIED. |

## Account, settings, credits and notifications

| Screen / route or overlay | Observed components | Status and safety notes |
|---|---|---|
| Account menu (overlay from account button) | Profile, plan, credits, Settings, Plan & billing, Help & support, Log out. Displayed account identity is prototype/demo data. | Routes in menu were followed read-only. Logout NOT TESTED. Identity/session validity UNVERIFIED. |
| Settings hub / `/app/settings` | Links to Profile, Security, Notifications, Export defaults, Plan & billing, Help & support, Log out. | Page navigation OBSERVED; changes not made. |
| Profile / `/app/settings/profile` | Photo control, editable name/studio fields, displayed email field and role choices; Save changes disabled until changes. | No profile values changed or image chosen. Storage/account behavior UNVERIFIED. |
| Security / `/app/settings/security` | Current/new/confirm password fields with show controls, Update password, signed-in device list with Sign out controls. | Password fields left blank. No credential or session action performed. Security behavior UNVERIFIED. |
| Notification preferences / `/app/settings/notifications` | Six switches: Security, Product updates, Generation, Billing, Credit alerts on; Ideas/offers off; Save changes initially disabled. | No switches changed or saved. Delivery behavior UNVERIFIED. |
| Export defaults / `/app/settings/exports` | JPG/PNG/PDF; 4K/HD; filename tokens `{file}`, `{version}`, `{size}`, `{date}`; No branding/Studio name; Save changes disabled. Text says 8K is selected per export because it uses credits. | Displayed defaults OBSERVED; export behavior, 8K cost and preference persistence UNVERIFIED. |
| Plan & billing / `/app/settings/billing` | Professional plan, displayed monthly amount plus VAT, 300-credit allowance, renewal date; current balance; Buy credits, Change plan, payment-method, invoice, billing-history and Cancel subscription controls. | All commercial/account values UNVERIFIED demo display. No purchase, plan change, payment edit/removal or cancellation performed. Do not treat displayed balance as a working wallet. |
| Buy credits (overlay from editor credit control) | Credit-pack choices and displayed price totals/payment methods; Pay action visible. | Overlay was viewed and closed. Pay/Add card/other payment actions NOT TESTED; no payment submitted. Price, tax, balance and checkout UNVERIFIED. |
| Notifications (overlay from bell) | Three unread examples for generation completion, export completion, low credits; older comment, recovery, two-step-security and welcome notifications; Mark all read and Clear read controls. | Controls not clicked; notification content and delivery UNVERIFIED. |

## Existing result, version history and export

| Screen / actual route | Observed contents | Status |
|---|---|---|
| Existing Kitchen result / `/app/editor/ws-kitchen-north` | Room Reimagination version 4; original and four version selectors; favourite and before/after compare controls; Modify and regenerate; Download or share; visible credit estimate/action. Existing record displayed a photo/result. | OBSERVED presentation only. No regeneration or download. Result/model, runs, credit decrement and persistence UNVERIFIED. |
| Version history (overlay on that editor) | Four versions and five runs displayed, with prompts/time; one failed run labelled no credit spent. View, Compare, Make current and Share/export controls. | The non-destructive Compare control opened a Version 3 vs Version 4 slider with side selection and swap controls. No version was made current. Version records and credit accounting UNVERIFIED. A new empty Room Reimagination editor separately showed “0 versions · 0 runs” and “No versions yet”. |
| Share & export — Download tab | Select version; JPG/PNG/PDF and high-resolution 8K option; 4K/HD; Result/Before & after; compression; filename; Download action. | Download not clicked. High-resolution option visibly quotes 2 credits; actual charge/export UNVERIFIED. |
| Share & export — Review link tab | Prior shared link; choose up to four versions; title/message; anyone vs invited people; decision/original/download switches; 7/30 day/no expiry; Create review link. | Tab viewed only. No link created or transmitted; recipient access, consent enforcement and expiry UNVERIFIED. |
| Share & export — Social tab | Version, social aspect-ratio presets, Before & after/Result, preview/caption and “Made with VastuNord” switch; Share, Download image, Copy caption. Includes a reminder to check client consent and omit personal details. | Tab viewed only. No share, post, download or copy performed. Channel-specific consent, privacy protection and publishing behavior UNVERIFIED. |

## New empty file created while inspecting

Opening Room Reimagination through its visible “Start a new file” flow created a file titled “Living Room Redesign”. The editor showed “Saved just now”; it then appeared as the first item in Active Files, where the screen displayed 26 active files. The dashboard separately displayed 25 Continue Working items; those counts are not assumed to share the same definition. This is an **OBSERVED UI side effect** of opening the requested representative editor. Whether the prototype persists this data remotely is **UNVERIFIED**. The file was left untouched; no photo or prompt was added, and it was not deleted.

## Navigation, responsive and evidence limits

- The expanded left workspace sidebar can collapse to an icon rail on desktop; no tablet/mobile menu or touch interaction was accessible with the browser controls.
- Result/editor and settings content uses long vertical panels; desktop screenshots showed normal vertical scrolling. Keyboard focus order, touch targets, contrast and screen-reader behavior were NOT TESTED.
- Browser screenshots were viewable during the session but could not be saved as project-local files. See `docs/STUDIO_RESPONSIVE_AUDIT.md` for exact desktop observations and the owner screenshot checklist.
- Help/support destination was visible from Account/Settings but was NOT TESTED. No other hidden/advanced routes were guessed.
