import { chromium } from "@playwright/test";
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  args: ["--enable-unsafe-swiftshader"],
});
const context = await browser.newContext();
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://localhost:3001");
await page.evaluate(async () => {
  await navigator.serviceWorker.ready;
  if (!navigator.serviceWorker.controller)
    await new Promise((resolve) =>
      navigator.serviceWorker.addEventListener("controllerchange", resolve, {
        once: true,
      }),
    );
});
await page.locator("canvas").waitFor();
const icons = await page.evaluate(async () => {
  const manifest = await (await fetch("/manifest.webmanifest")).json();
  return Promise.all(
    manifest.icons.map(async (icon) => ({
      src: icon.src,
      ok: (await fetch(icon.src)).ok,
    })),
  );
});
if (icons.some((icon) => !icon.ok)) throw new Error("PWA icon missing");
await page.evaluate(async () => {
  const form = new FormData();
  form.append("text", "Shared from another app");
  form.append(
    "files",
    new window.File(["share-target content"], "shared.txt", {
      type: "text/plain",
    }),
  );
  await fetch("/share-target", { method: "POST", body: form });
});
await page.goto("http://localhost:3001/?shared=1");
await page.getByRole("textbox", { name: "Note or link" }).waitFor();
if (
  (await page.getByRole("textbox", { name: "Note or link" }).inputValue()) !==
  "Shared from another app"
)
  throw new Error("Share target text missing");
await page.getByRole("button", { name: "Create my room" }).click();
await page.getByText("Room is live").waitFor();
const receiver = await browser.newContext(),
  other = await receiver.newPage();
await other.goto(page.url());
await page.getByText("Ready to receive").waitFor();
await page.getByRole("button", { name: "Send 1 shared files" }).click();
await other.getByRole("button", { name: "Accept", exact: true }).click();
await other.getByText("Received & verified").waitFor();
await receiver.close();
await page.getByRole("button", { name: "PIMXNODE home", exact: true }).click();
await context.setOffline(true);
await page.goto("http://localhost:3001/");
await page.getByRole("button", { name: "Make a connection" }).waitFor();
const offlineArt = await page
  .locator(".new-home img")
  .evaluateAll(async (images) =>
    Promise.all(
      images.map(async (image) => {
        try {
          await image.decode();
          return {
            loaded: image.naturalWidth > 0,
            src: image.getAttribute("src"),
          };
        } catch {
          return { loaded: false, src: image.getAttribute("src") };
        }
      }),
    ),
  );
if (offlineArt.length < 3 || offlineArt.some((image) => !image.loaded))
  throw new Error(
    `Offline illustrations missing: ${JSON.stringify(offlineArt)}`,
  );
if (errors.length) throw new Error(JSON.stringify(errors));
console.log(
  JSON.stringify({
    serviceWorker: "passed",
    icons: "passed",
    shareTargetFileAndText: "passed",
    offlineShell: "passed",
    errors,
  }),
);
await browser.close();
