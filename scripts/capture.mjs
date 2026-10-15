import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("artifacts", { recursive: true });
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  args: ["--enable-unsafe-swiftshader"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://localhost:3000/");
await page.evaluate(() => document.fonts.ready);
await page.locator("canvas").waitFor();
await page.waitForTimeout(2500);
await page.screenshot({ path: "artifacts/desktop-home.png", fullPage: true });
for (const size of [192, 512]) {
  const data = await page.evaluate(async (size) => {
    const image = new window.Image();
    image.src = "/icon.svg";
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    canvas.getContext("2d").drawImage(image, 0, 0, size, size);
    return canvas.toDataURL("image/png").split(",")[1];
  }, size);
  await writeFile(`public/icon-${size}.png`, Buffer.from(data, "base64"));
}
await page.getByRole("button", { name: "Make a connection" }).click();
await page.waitForTimeout(1500);
await page.screenshot({
  path: "artifacts/desktop-exchange.png",
  fullPage: true,
});
await page.getByRole("button", { name: "Change color theme" }).click();
await page.waitForTimeout(400);
await page.screenshot({
  path: "artifacts/desktop-dark-exchange.png",
  fullPage: true,
});
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(400);
await page.screenshot({
  path: "artifacts/mobile-en-exchange.png",
  fullPage: true,
});
console.log(
  JSON.stringify({
    errors,
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  }),
);
await browser.close();
