# Illustrated Knowledge studies

Resources carries the five existing guides and 500 new short design studies. Readers can search titles, observations or topics, filter by subject, and move through twelve results at a time. Each study has a stable address at `/resources/{slug}` and `/en/resources/{slug}`. The Studio Knowledge library links to these same articles alongside its original quick guides.

Each of the 500 studies has a separately written Norwegian Bokmål and English title and observation tied to an individual owner-supplied illustration. A study pairs the observation with one of 22 design exercises and a practical comparison the reader can try. Readers can inspect three colour samples taken from that specific composition and compare the average grayscale values of nine equal image regions. These are measurements of the illustration. Paint selection and lighting decisions require samples or observations in the room.

The 500 stills were selected from previously unused Visuals originals and visually reviewed. The directory mixes topics in a stable checksum order. The public files are metadata-stripped WebPs, at most 768 px on the long edge, totalling 16,327,466 bytes. Each image belongs to one study and follows that study into its directory card and detail view. Original PNGs remain outside the deployment archive. [Image sources and checksums](KNOWLEDGE_STUDY_IMAGES.csv) · [Site asset register](ASSET_MANIFEST.md)

The studies are bundled editorial content for the noncommercial demonstration. The independent Payload journal workflow publishes approved CMS articles separately. The provenance register records pending commercial rights and human editorial approval for this collection.

## Verification

Run `node --experimental-strip-types --test apps/web/tests/visual-studies.test.ts` to check bilingual content uniqueness, all 22 design exercises, image measurements and 500 unique public image files. Run `python scripts/verify_display_media.py --sources` on a checkout with the original Visuals files to compare source hashes, derivative hashes, dimensions and source image correspondence. The Playwright files `visual-studies.spec.ts` and `marketing-pages.spec.ts` exercise the directories, search, pagination, localizations and mobile reader.
