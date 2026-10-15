# Search and sharing

`npm run build` prerenders the actual home component into `dist/index.html`. The marketing content, headings, FAQ questions and explanatory diagrams are available without waiting for JavaScript. FAQ answers open in the interactive application. The client mounts the interactive application afterward. English and Persian metadata follows the selected language. Private rooms, history and session views carry `noindex,follow`; invitation keys are never included in canonical URLs or structured data.

Set `VITE_SITE_URL` to the real public HTTPS origin **before building**, for example through the hosting provider's build environment. The build then creates an absolute canonical, absolute social preview URLs and `dist/sitemap.xml`, and adds the sitemap to `dist/robots.txt`. Without a configured origin, the build deliberately omits the sitemap and static canonical rather than inventing a domain. The client still sets a canonical using the current origin. Rebuild after changing the domain.

The social preview is `public/social-card.png` (1200 × 630). App icons and the preview share the custom connected-route N mark. `scripts/check-experience.mjs` validates responsive layouts, theme changes, real radar discovery and reduced motion, and regenerates these PNG assets from the authored SVGs. It defaults to the local app at port 3100; override `BASE_URL` when needed.

After deployment, verify the public canonical, inspect the home URL in Google Search Console and submit the generated sitemap. Search ranking depends on indexing, relevance, content and external signals; the implementation does not promise a position.

Technical SEO references: [Google's developer guide](https://developers.google.com/search/docs/fundamentals/get-started-developers) and [JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).
