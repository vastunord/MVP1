# Windowed homepage and Studio release evidence

Captured 22 November 2026 from the public noncommercial demo running commit `7cd700f`, Vercel deployment `dpl_DJ7VrHAcw8SoNvsoYN6SWBRKxHEW`. [Vastu Nord demo](https://vastunord-web.vercel.app/)

## Homepage

Microsoft Edge rendered the following views at 100% zoom and one device pixel per CSS pixel. Each screenshot shows the first approved BeforeAfter pair with reduced motion enabled and the cookie notice dismissed.

| Screenshot | Language and appearance | Visible photo | Placement |
| --- | --- | --- | --- |
| [Desktop, 1440 × 900](home-1440.webp) | English, light | 922 × 521 px | Right of the introduction |
| [Laptop, 1280 × 720](home-1280.webp) | English, light | 820 × 463 px | Right of the introduction |
| [Tablet, 768 × 900](home-768.webp) | English, dark | 719 × 406 px | Below the introduction |
| [Mobile, 390 × 844](home-390.webp) | Norwegian, light | 358 × 202 px | Below the introduction |

All four windows fit horizontally. Both desktop photos fit entirely within the initial viewport. For each screenshot, two 17 × 17 pixel patches on each side of the divider were compared with the same source photograph rendered in the browser without a tint. The largest difference in any patch's mean red, green or blue value was 0.54 on a 0–255 scale.

With motion enabled, the divider moved three percentage points in two simulated browser seconds. It held at 53% while the pointer stayed over the window and the image pair advanced, then moved three points in two seconds after the pointer left. All eleven pairs could be selected and wrapped back to the first. The divider stayed inside each source photograph, including the 3:2 scenes. Choosing the active scene opened its matching image in Studio.

## Studio

The live [tool library](studio-library.webp) displayed seventeen photographs and each editor displayed its canvas. The three room briefs and 56 tone-preview thumbnails across fourteen editors loaded. The old comparison labels were absent across all seventeen editors. The room editor fit the 390 px viewport without horizontal scrolling. [Desktop room editor](studio-room-desktop.webp), [mobile room editor](studio-room-mobile.webp), [per-tool verification results](studio-verification.json).

These checks used the anonymous demo and public images. They cover browser layout and image selection. Physical-device rendering and exact Figma parity remain unverified.
