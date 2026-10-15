import { test, expect, type Browser, type Page } from "@playwright/test";
import { createHash } from "node:crypto";

async function pair(browser: Browser) {
  const contextA = await browser.newContext({ acceptDownloads: true }),
    contextB = await browser.newContext({ acceptDownloads: true });
  const a = await contextA.newPage(),
    b = await contextB.newPage();
  await a.goto("/");
  await a.getByRole("button", { name: "Make a connection" }).click();
  await expect(a.getByText("Room is live")).toBeVisible();
  await b.goto(a.url());
  await expect(a.getByText("Ready to receive")).toBeVisible({
    timeout: 20_000,
  });
  await expect(b.getByText("Ready to receive")).toBeVisible({
    timeout: 20_000,
  });
  return { a, b, contextA, contextB };
}
async function send(
  a: Page,
  name: string,
  buffer: Buffer,
  mimeType = "application/octet-stream",
) {
  await a
    .locator("input[type=file]")
    .first()
    .setInputFiles({ name, mimeType, buffer });
}
test("arbitrary bytes, empty file, note, recipient consent, verified history and download", async ({
  browser,
}) => {
  const { a, b, contextA, contextB } = await pair(browser);
  const payload = Buffer.from(
    Array.from({ length: 200_007 }, (_, i) => i % 251),
  );
  await send(a, "original.uncommon", payload);
  await expect(
    b.getByRole("button", { name: "Accept", exact: true }),
  ).toBeVisible();
  await expect(a.getByText("Waiting for approval")).toBeVisible();
  await b.getByRole("button", { name: "Accept", exact: true }).click();
  await expect(a.getByText("Received & verified")).toBeVisible({
    timeout: 30_000,
  });
  await expect(b.getByText("Received & verified")).toBeVisible();
  const downloaded = b.waitForEvent("download");
  await b
    .getByRole("button", { name: "Save original.uncommon", exact: true })
    .click();
  const file = await downloaded;
  const stream = await file.createReadStream();
  const chunks = [];
  for await (const chunk of stream!) chunks.push(chunk);
  expect(Buffer.concat(chunks)).toEqual(payload);
  const h = await b.evaluate(() =>
    JSON.parse(localStorage.getItem("pimx-history") || "[]"),
  );
  expect(h[0].hash).toBe(createHash("sha256").update(payload).digest("hex"));
  await a
    .getByRole("textbox", { name: "Note or link" })
    .fill("A real note. https://example.org");
  await a.getByRole("button", { name: "Send note", exact: true }).click();
  await expect(b.getByText("A real note. https://example.org")).toBeVisible();
  await send(a, "empty.txt", Buffer.alloc(0), "text/plain");
  await b.getByRole("button", { name: "Accept", exact: true }).click();
  await expect(b.locator(".status-completed")).toHaveCount(2);
  await b
    .getByRole("button", { name: "Preview empty.txt", exact: true })
    .click();
  await expect(b.getByRole("dialog", { name: "empty.txt" })).toBeVisible();
  await b.keyboard.press("Escape");
  await contextA.close();
  await contextB.close();
});
test("batch queue, pause/resume and recipient rejection", async ({
  browser,
}) => {
  const { a, b, contextA, contextB } = await pair(browser);
  await a
    .locator("input[type=file]")
    .first()
    .setInputFiles([
      {
        name: "large.bin",
        mimeType: "application/octet-stream",
        buffer: Buffer.alloc(12 * 1024 * 1024, 37),
      },
      {
        name: "second.txt",
        mimeType: "text/plain",
        buffer: Buffer.from("second"),
      },
    ]);
  await b.getByRole("button", { name: "Accept", exact: true }).click();
  await a
    .locator(".transfer-row")
    .filter({ hasText: "large.bin" })
    .getByRole("button", { name: "Pause", exact: true })
    .click();
  await expect(a.locator(".status-paused")).toHaveCount(1);
  await a
    .locator(".status-paused")
    .getByRole("button", { name: "Resume", exact: true })
    .click();
  await expect(
    a.locator(".transfer-row").filter({ hasText: "large.bin" }),
  ).toHaveClass(/status-completed/, { timeout: 60_000 });
  await b.getByRole("button", { name: "Reject file" }).click();
  await expect(a.locator(".status-cancelled")).toHaveCount(1);
  await contextA.close();
  await contextB.close();
});
test("two recipients, room lock and room isolation", async ({ browser }) => {
  const { a, b, contextA, contextB } = await pair(browser);
  const cContext = await browser.newContext(),
    c = await cContext.newPage();
  await c.goto(a.url());
  await expect(a.getByText("Ready to receive")).toHaveCount(2, {
    timeout: 20_000,
  });
  const selectors = a.locator(".peer-select");
  for (let i = 0; i < 2; i++)
    if ((await selectors.nth(i).getAttribute("aria-pressed")) !== "true")
      await selectors.nth(i).click();
  await send(a, "both.json", Buffer.from('{"real":true}'), "application/json");
  await b.getByRole("button", { name: "Accept", exact: true }).click();
  await c.getByRole("button", { name: "Accept", exact: true }).click();
  await expect(a.locator(".status-completed")).toHaveCount(2, {
    timeout: 30_000,
  });
  await a.getByRole("button", { name: "Room settings" }).click();
  await a
    .getByRole("checkbox", { name: "Lock the room to new devices" })
    .check();
  await a.getByRole("button", { name: "Update room", exact: true }).click();
  await a.getByRole("button", { name: "Close", exact: true }).click();
  const dContext = await browser.newContext(),
    d = await dContext.newPage();
  await d.goto(a.url());
  await expect(d.getByRole("alert")).toContainText("This room is locked");
  const isolated = await browser.newContext(),
    e = await isolated.newPage();
  await e.goto("/");
  await e.getByRole("button", { name: "Make a connection" }).click();
  await expect(e.getByText("Room is live")).toBeVisible();
  await expect(e.locator(".peer-select")).toHaveCount(0);
  await Promise.all([
    contextA.close(),
    contextB.close(),
    cContext.close(),
    dContext.close(),
    isolated.close(),
  ]);
});
test("mobile Persian, keyboard dialogs, QR and real diagnostics", async ({
  browser,
}) => {
  const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: "reduce",
    }),
    page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.getByRole("button", { name: "Switch to Persian" }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await page.screenshot({
    path: "artifacts/mobile-fa-home.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "یک اتصال بساز" }).click();
  await expect(page.getByText("اتاق آماده است")).toBeVisible();
  await page.getByRole("button", { name: "دعوت یک دستگاه" }).click();
  await expect(page.locator(".qr-image")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.screenshot({
    path: "artifacts/mobile-fa-exchange.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "راهنما", exact: true }).click();
  await page.getByRole("button", { name: "بررسی اتصال", exact: true }).click();
  await expect(page.getByText("گزارش اتصال تو")).toBeVisible();
  expect(errors).toEqual([]);
  await context.close();
});
test("an approved transfer resumes after the actual data channel closes", async ({
  browser,
}) => {
  const contextA = await browser.newContext(),
    contextB = await browser.newContext();
  const hook = () => {
    const Original = window.RTCPeerConnection;
    (window as any).__connections = [];
    window.RTCPeerConnection = class extends Original {
      constructor(configuration?: RTCConfiguration) {
        super(configuration);
        (window as any).__connections.push(this);
      }
    };
  };
  await contextA.addInitScript(hook);
  await contextB.addInitScript(hook);
  const a = await contextA.newPage(),
    b = await contextB.newPage();
  await a.goto("/");
  await a.getByRole("button", { name: "Make a connection" }).click();
  await expect(a.getByText("Room is live")).toBeVisible();
  await b.goto(a.url());
  await expect(a.getByText("Ready to receive")).toBeVisible({
    timeout: 20_000,
  });
  await send(a, "reconnect.bin", Buffer.alloc(12 * 1024 * 1024, 55));
  await b.getByRole("button", { name: "Accept", exact: true }).click();
  await expect(b.locator(".progress-track")).toBeVisible();
  await a.evaluate(() => {
    for (const pc of (window as any).__connections) pc.close();
  });
  await expect(a.locator(".status-completed")).toHaveCount(1, {
    timeout: 60_000,
  });
  await expect(b.locator(".status-completed")).toHaveCount(1);
  await Promise.all([contextA.close(), contextB.close()]);
});
test("folder paths survive ZIP export and incoming files never run as markup", async ({
  browser,
}) => {
  const { a, b, contextA, contextB } = await pair(browser);
  // Construct real File objects with the same path property used by directory inputs.
  await a
    .locator("input[type=file]")
    .first()
    .evaluate((input) => {
      const data = new DataTransfer();
      for (const [name, path, text] of [
        ["first.txt", "work/notes/first.txt", "first"],
        [
          "second.html",
          "work/second.html",
          '<script>throw new Error("must not run")</script>',
        ],
      ]) {
        const file = new window.File([text], name, {
          type: name.endsWith(".html") ? "text/html" : "text/plain",
        });
        Object.defineProperty(file, "webkitRelativePath", { value: path });
        data.items.add(file);
      }
      (input as HTMLInputElement).files = data.files;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
  await b.getByRole("button", { name: "Accept", exact: true }).click();
  await expect(b.locator(".status-completed")).toHaveCount(1);
  await b.getByRole("button", { name: "Accept", exact: true }).click();
  await expect(b.locator(".status-completed")).toHaveCount(2);
  const errors: string[] = [];
  b.on("pageerror", (e) => errors.push(e.message));
  await b
    .getByRole("button", { name: "Preview second.html", exact: true })
    .click();
  await expect(b.locator("pre")).toContainText("must not run");
  await b.keyboard.press("Escape");
  const downloaded = b.waitForEvent("download");
  await b.getByRole("button", { name: "Save as ZIP", exact: true }).click();
  const result = await downloaded,
    stream = await result.createReadStream(),
    chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(chunk);
  const { default: JSZip } = await import("jszip");
  const zip = await JSZip.loadAsync(Buffer.concat(chunks));
  expect(await zip.file("work/notes/first.txt")!.async("string")).toBe("first");
  expect(zip.file("work/second.html")).not.toBeNull();
  expect(errors).toEqual([]);
  await Promise.all([contextA.close(), contextB.close()]);
});
test("wrong invitation key is rejected; removing a device revokes its current access", async ({
  browser,
}) => {
  const { a, b, contextA, contextB } = await pair(browser);
  const wrongContext = await browser.newContext(),
    wrong = await wrongContext.newPage();
  const bad = new URL(a.url());
  bad.hash = "key=incorrect-secret-value";
  await wrong.goto(bad.toString());
  await expect(wrong.getByRole("alert")).toContainText("key does not match", {
    timeout: 20_000,
  });
  await expect(wrong.locator(".peer-select[aria-pressed=true]")).toHaveCount(0);
  // Rename makes the intended removal unambiguous when all devices started with the same label.
  await b
    .getByRole("textbox", { name: "Device name", exact: true })
    .fill("Receiver to remove");
  await a
    .getByRole("button", { name: "Remove Receiver to remove", exact: true })
    .click();
  await expect(b.getByRole("alert")).toContainText("owner removed this device");
  await expect(
    a.locator(".peer-select").filter({ hasText: "Receiver to remove" }),
  ).toHaveCount(0);
  await Promise.all([contextA.close(), contextB.close(), wrongContext.close()]);
});
