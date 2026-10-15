import "dotenv/config";
import React from "react";
import { renderToString } from "react-dom/server";
import { readFile, writeFile } from "node:fs/promises";
import HomePage from "../src/components/HomePage";

// Ordinary HTML for crawlers and visitors before the interactive application loads.
const noop = () => {};
const scene = (
  <div className="scene-loading">
    <img
      className="transit-poster"
      src="/illustrations/device-bridge.png"
      width="639"
      height="480"
      alt="PIMXNODE connects your devices for encrypted file transfers"
    />
  </div>
);
const home = renderToString(
  <HomePage fa={false} scene={scene} start={noop} join={noop} help={noop} />,
);
let html = await readFile("dist/index.html", "utf8");
html = html.replace(
  '<div id="root"></div>',
  `<div id="root"><main id="main">${home}</main></div>`,
);
const schema: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PIMXNODE",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web browser",
  description:
    "Encrypted browser-to-browser file, folder and note sharing with recipient approval and SHA-256 verification.",
  inLanguage: ["en", "fa"],
  browserRequirements: "Requires JavaScript, WebRTC and HTTPS",
};
const site = process.env.VITE_SITE_URL;
if (site) {
  const url = new URL(site);
  if (url.protocol !== "https:")
    throw new Error("VITE_SITE_URL must be the public HTTPS origin.");
  const origin = url.origin;
  schema.url = `${origin}/`;
  html = html
    .replace(
      "</head>",
      `<link rel="canonical" href="${origin}/" /><meta property="og:url" content="${origin}/" /></head>`,
    )
    .replaceAll(
      'content="/social-card.png"',
      `content="${origin}/social-card.png"`,
    );
  await writeFile(
    "dist/sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url></urlset>`,
  );
  await writeFile(
    "dist/robots.txt",
    `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /pimxnodeadmin\nSitemap: ${origin}/sitemap.xml\n`,
  );
} else {
  await writeFile(
    "dist/robots.txt",
    "User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /pimxnodeadmin\n",
  );
  console.info(
    "SEO: set VITE_SITE_URL to generate the production canonical and sitemap.",
  );
}
html = html.replace(
  "</head>",
  `<script type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script></head>`,
);
await writeFile("dist/index.html", html);
