# Final design and verification record

## Replacement requested by the user
The earlier sparse cream/orange version below was rejected. The current design is forest/lime, with an original live file portal, a four-stage interactive transfer guide, selectable format artwork, three original SVG illustrations, privacy and device sections, animated accordions and a full typographic footer. Native dialogs explicitly center within the viewport, animate on entry and exit, retain their content during dismissal, trap focus and return focus to their trigger.

Current checks: home has no horizontal overflow at 300, 360, 390, 620, 768, 1024, 1440 and 1920 px. Dialog centering, viewport containment, Escape dismissal and focus restoration passed at 300, 390, 768 and 1440 px. The footer starts below the first viewport on short history pages. The seven existing transfer cases and two new redesign cases all passed across the full run and isolated rerun: one full-run case was interrupted by a Vite development reload while checking a checkbox, and passed when rerun without edits. Six final Axe scans reported no violations. TypeScript and the production build passed. The Three.js scene remains a separate lazy chunk, about 562 kB raw / 144 kB gzipped. The design detector returned no findings. These checks do not claim physical-device or full accessibility certification.

Full desktop and 300 px Persian captures were reviewed; undersized title wrapping and initially lazy SVG captures were corrected. Native diagrams now load immediately; the offline cache includes the new illustrations. Earlier assessment notes below describe the first iteration and are retained for context, not as current visual authority.

## Visual review
Reviewed full-page desktop landing, desktop workspace, dark workspace and English/Persian mobile captures. Fixed font delivery (true variable WOFF2), the mobile scene's intrinsic grid width and the paused queue's scheduling. The final direction has a strong type/object split, an original extruded logo and a transfer workspace with real device selection. Three-dimensional scene geometry and sender/receiver data remain separate from readable controls.

Self-assessment, not an external award: design 8/10, usability 8/10, creativity 8/10, content 8/10; weighted 8/10. Remaining limits: smaller metadata text in dense working areas, no photograph-led storytelling, browser-dependent preview codecs, and an optional relay service that needs deployment configuration.

## Verified
- TypeScript check and production build passed.
- Seven Playwright tests passed with real independent browser contexts. These include exact downloaded bytes, SHA-256, empty files, recipient approval/rejection, batch pause/resume, two recipients, room locking/isolation, real channel closure/reconnect/resume, folder paths and ZIP, escaped HTML preview, incorrect keys, removal, Persian mobile, QR and diagnostics.
- Production smoke test passed: registered service worker, valid install icons, OS-share endpoint handling a real File plus text, subsequent verified transfer of that file, and offline app-shell navigation. Actual native OS installation/Share menus were not tested on physical phones.
- Axe WCAG scans found zero violations in six states: English light landing, English light workspace, invitation dialog, English dark workspace, Persian dark mobile workspace and Persian dark mobile help. This is automated coverage, not a claim of complete WCAG certification.
- npm audit reported zero known dependency vulnerabilities.
- Impeccable detector returned an empty finding list. Taste source lint had no failures; its cryptographic hex-padding and room-unlock wording warnings are functional, not decorative patterns.

## Instrument limits
Taste browser inspection fixed body-size and layout issues. Its remaining image/video and DOM-motion counts do not represent the live WebGL scene; the implementation intentionally uses authored vector geometry, live three-dimensional objects and real transfer events rather than borrowed photographs. Its complete gate has not been claimed as passed. Motion entrances also respect reduced-motion. Vite reports a 560 kB raw Three.js scene chunk, roughly 143 kB gzipped; it is loaded through a separate lazy import. No deployment, TURN-network test or physical-device test was performed.

The user's pre-existing README.md, README.fa.md and assets/readme changes were preserved.
