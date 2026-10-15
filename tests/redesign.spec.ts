import { test, expect } from "@playwright/test";

test("responsive home, full footer and working guide from 300px to 1920px", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  for (const width of [300, 360, 390, 620, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `home width ${width}`,
    ).toBe(true);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator("canvas").waitFor();
  await page.waitForTimeout(900);
  await page.screenshot({
    path: "artifacts/v3-home-desktop.png",
    fullPage: true,
  });
  await page.getByRole("tab", { name: "Invite a device", exact: true }).click();
  await expect(page.getByRole("tabpanel")).toContainText(
    "One invitation. Two devices.",
  );
  await page
    .getByRole("tab", { name: "Invite a device", exact: true })
    .press("ArrowDown");
  await expect(
    page.getByRole("tab", { name: "Choose & approve", exact: true }),
  ).toBeFocused();
  await page
    .getByRole("button", {
      name: "Can I really send any file type?",
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("button", {
      name: "Can I really send any file type?",
      exact: true,
    }),
  ).toHaveAttribute("aria-expanded", "true");
  await page
    .getByRole("button", {
      name: "Can I really send any file type?",
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("button", {
      name: "Can I really send any file type?",
      exact: true,
    }),
  ).toHaveAttribute("aria-expanded", "false");
  await page.setViewportSize({ width: 300, height: 760 });
  await page.getByRole("button", { name: "Switch to Persian" }).click();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: "artifacts/v3-home-300-fa.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("all dialogs center, animate and restore focus at 300px and desktop", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page
    .getByRole("button", { name: "Make a connection", exact: true })
    .click();
  await expect(page.getByText("Room is live")).toBeVisible();
  for (const width of [300, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const name of ["Bring another device", "Room settings"]) {
      const trigger = page.getByRole("button", { name, exact: true });
      await trigger.click();
      const dialog = page.locator("dialog[open]");
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAttribute("data-phase", "open");
      const box = await dialog.boundingBox();
      expect(box).not.toBeNull();
      expect(Math.abs(box!.x + box!.width / 2 - width / 2)).toBeLessThan(10);
      expect(box!.y).toBeGreaterThanOrEqual(0);
      expect(box!.y + box!.height).toBeLessThanOrEqual(901);
      if (width === 1440 && name === "Bring another device")
        await page.screenshot({ path: "artifacts/v3-dialog-desktop.png" });
      if (width === 300 && name === "Room settings")
        await page.screenshot({ path: "artifacts/v3-dialog-300.png" });
      await page.keyboard.press("Escape");
      await expect(dialog).toHaveCount(0);
      await expect(trigger).toBeFocused();
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `workspace width ${width}`,
    ).toBe(true);
  }
  await page.getByRole("button", { name: "How it works", exact: true }).click();
  await page
    .getByRole("button", { name: "How do I connect my phone?", exact: true })
    .click();
  await expect(
    page.getByRole("region", {
      name: "How do I connect my phone?",
      exact: true,
    }),
  ).toContainText("Create a room");
  await page.getByRole("button", { name: "History", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Things you’ve moved." }),
  ).toBeVisible();
  expect(
    (await page.locator("footer").boundingBox())!.y,
  ).toBeGreaterThanOrEqual(850);
  await page.screenshot({
    path: "artifacts/v3-history-footer.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
