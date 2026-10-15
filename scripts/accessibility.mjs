import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { writeFile, mkdir } from "node:fs/promises";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  args: ["--enable-unsafe-swiftshader"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
await mkdir("artifacts", { recursive: true });
const reports = [];
async function check(name) {
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  reports.push({
    name,
    violations: result.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => ({
        selector: n.target,
        summary: n.failureSummary,
      })),
    })),
  });
}
await page.goto(process.env.BASE_URL || "http://localhost:3000");
await page.evaluate(() => document.fonts.ready);
await check("home-en-light");
await page.getByRole("button", { name: "Make a connection" }).click();
await page.waitForTimeout(1500);
await check("exchange-en-light");
await page.getByRole("button", { name: "Bring another device" }).click();
await page.locator('dialog[open][data-phase="open"]').waitFor();
await check("invite-en-light");
await page.keyboard.press("Escape");
await page.getByRole("button", { name: "Change color theme" }).click();
await page.waitForTimeout(400);
await check("exchange-en-dark");
await page.setViewportSize({ width: 390, height: 844 });
await page.getByRole("button", { name: "Switch to Persian" }).click();
await check("exchange-fa-dark-mobile");
await page.getByRole("button", { name: "راهنما", exact: true }).click();
await page.getByRole("button", { name: "بررسی اتصال", exact: true }).click();
await page.getByText("گزارش اتصال تو").waitFor();
await check("help-fa-dark-mobile");
await writeFile(
  "artifacts/accessibility.json",
  JSON.stringify(reports, null, 2),
);
console.log(JSON.stringify(reports));
await browser.close();
