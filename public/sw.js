const CACHE = "pimx-shell-v6";
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) =>
        cache.addAll([
          "/",
          "/icon.svg",
          "/logo-mark.svg",
          "/logo-mark-light.svg",
          "/illustrations/devices.svg",
          "/illustrations/device-bridge.png",
          "/illustrations/encrypted-route.svg",
          "/illustrations/transfer-controls.svg",
          "/fonts/manrope-latin.woff2",
          "/fonts/vazirmatn-arabic.woff2",
        ]),
      ),
  );
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches
        .keys()
        .then((keys) =>
          Promise.all(
            keys
              .filter((k) => k.startsWith("pimx-shell-") && k !== CACHE)
              .map((k) => caches.delete(k)),
          ),
        ),
    ]),
  );
});
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("pimx-shares", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("inbox");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;
  if (url.pathname === "/share-target" && event.request.method === "POST") {
    event.respondWith(
      (async () => {
        const form = await event.request.formData(),
          db = await openDB();
        await new Promise((resolve, reject) => {
          const tx = db.transaction("inbox", "readwrite");
          tx.objectStore("inbox").put(
            {
              files: form.getAll("files"),
              text: [form.get("title"), form.get("text"), form.get("url")]
                .filter(Boolean)
                .join("\n"),
            },
            "pending",
          );
          tx.oncomplete = resolve;
          tx.onerror = () => reject(tx.error);
        });
        db.close();
        return Response.redirect("/?shared=1", 303);
      })(),
    );
    return;
  }
  if (
    event.request.method !== "GET" ||
    url.pathname.startsWith("/api/") ||
    url.pathname.includes("ws-signaling")
  )
    return;
  // Cache the production shell, authored diagrams and fonts, never live Vite modules or APIs.
  if (
    event.request.mode === "navigate" ||
    [
      "/logo-mark.svg",
      "/logo-mark-light.svg",
      "/icon.svg",
      "/icon-192.png",
      "/icon-512.png",
      "/manifest.webmanifest",
    ].includes(url.pathname) ||
    ["/assets/", "/illustrations/", "/fonts/"].some((prefix) =>
      url.pathname.startsWith(prefix),
    )
  )
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            event.waitUntil(
              caches
                .open(CACHE)
                .then((cache) =>
                  cache.put(
                    event.request.mode === "navigate" ? "/" : event.request,
                    copy,
                  ),
                ),
            );
          }
          return response;
        })
        .catch(() =>
          caches.match(event.request.mode === "navigate" ? "/" : event.request),
        ),
    );
});
