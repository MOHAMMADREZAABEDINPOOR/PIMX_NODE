import { chromium } from "@playwright/test";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import assert from "node:assert/strict";
const base = process.env.BASE_URL || "http://localhost:3100";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  args: ["--enable-unsafe-swiftshader"],
});
await mkdir("artifacts", { recursive: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
await page.goto(base);
await page.evaluate(() => document.fonts.ready);
await page.locator("canvas").waitFor();
const poster = await page.evaluate(() => new Promise((resolve) => {
  requestAnimationFrame(() => resolve(document.querySelector("canvas").toDataURL("image/png").split(",")[1]));
}));
await writeFile("public/illustrations/device-bridge.png", Buffer.from(poster, "base64"));
const themeColors = [];
for (const theme of ["light", "dark"]) {
  if (theme === "dark")
    await page.getByRole("button", { name: "Change color theme" }).click();
  await page.waitForTimeout(900);
  themeColors.push(
    await page
      .locator(".launch-hero")
      .evaluate((el) => getComputedStyle(el).backgroundColor),
  );
  await page.screenshot({ path: `artifacts/experience-home-${theme}.png` });
  await page
    .locator("footer")
    .screenshot({ path: `artifacts/experience-footer-${theme}.png` });
}
assert.notEqual(...themeColors);
for (const width of [300, 390, 768, 1440, 1920]) {
  await page.setViewportSize({ width, height: 900 });
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    `home overflow ${width}`,
  );
}
await page.setViewportSize({ width: 390, height: 844 });
await page.evaluate(() => scrollTo(0, 0));
await page.screenshot({ path: "artifacts/experience-home-mobile.png" });
await page
  .getByRole("button", { name: "Make a connection", exact: true })
  .click();
await page.getByText("Room is live").waitFor();
await page.locator(".device-radar").waitFor();
assert.equal(
  await page.locator('meta[name="robots"]').getAttribute("content"),
  "noindex,follow",
);
await page.screenshot({ path: "artifacts/experience-radar-mobile.png" });
const second = await browser.newPage();
await second.goto(page.url());
await page
  .getByText("Ready to receive", { exact: true })
  .waitFor({ timeout: 20000 });
assert.equal(await page.locator(".radar-device").count(), 1);
await page.locator(".radar-device").click();
await page.getByRole("button", { name: "Pause radar animation" }).click();
assert.equal(
  await page.locator(".device-radar").getAttribute("data-paused"),
  "true",
);
await page.setViewportSize({ width: 1440, height: 1000 });
await page.screenshot({ path: "artifacts/experience-radar-connected.png" });
await page.emulateMedia({ reducedMotion: "reduce" });
assert.equal(
  await page
    .locator(".radar-sweep")
    .evaluate((el) => getComputedStyle(el).animationName),
  "none",
);
await second.close();
await page.getByRole("button", { name: "PIMXNODE home" }).click();
await page.getByRole("button", { name: "Switch to Persian" }).click();
await page.setViewportSize({ width: 300, height: 800 });
await page.waitForTimeout(500);
assert(
  await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  "Persian overflow",
);
await page.screenshot({ path: "artifacts/experience-home-fa.png" });
// The icon and preview use the same authored vector mark as the interface.
const mark = await readFile("public/logo-mark-light.svg", "utf8");
const logo = mark.slice(mark.indexOf("</title>") + 8, mark.indexOf("</svg>"));
const card = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#61275b"/><g transform="translate(72 62) scale(.8)">${logo}</g><text x="155" y="107" fill="#f3eaf3" font-family="Arial,sans-serif" font-size="32" font-weight="700">PIMXNODE</text><text x="72" y="280" fill="#f3eaf3" font-family="Arial,sans-serif" font-size="80" font-weight="700">Files in motion.</text><text x="72" y="375" fill="#f3eaf3" font-family="Arial,sans-serif" font-size="80" font-weight="700">Devices in sync.</text><text x="76" y="510" fill="#f55df7" font-family="Arial,sans-serif" font-size="27">Encrypted file sharing. Directly between your devices.</text></svg>`;
await writeFile("public/social-card.svg", card);
for (const [file, width, height] of [
  ["icon-192.png", 192, 192],
  ["icon-512.png", 512, 512],
  ["social-card.png", 1200, 630],
]) {
  const svg = file.startsWith("icon")
    ? await readFile("public/icon.svg", "utf8")
    : card;
  const png = await page.evaluate(
    async ({ svg, width, height }) => {
      const img = new Image();
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      return canvas.toDataURL("image/png").split(",")[1];
    },
    { svg, width, height },
  );
  await writeFile(`public/${file}`, Buffer.from(png, "base64"));
}
assert.deepEqual(errors, []);
console.log(
  JSON.stringify({
    themeColors,
    errors,
    responsive: "300–1920px",
    radar: "real peer discovered and selected",
    reducedMotion: "passed",
  }),
);
await browser.close();
