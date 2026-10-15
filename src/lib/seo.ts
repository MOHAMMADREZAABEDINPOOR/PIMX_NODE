const descriptions = {
  en: "Send original files, folders and notes between your devices with PIMXNODE. Encrypted browser-to-browser sharing, recipient approval and file verification. No account required.",
  fa: "با پیمکس‌نود فایل، پوشه و یادداشت را بین دستگاه‌ها بفرست. انتقال رمزگذاری‌شده در مرورگر، تأیید گیرنده و بررسی سلامت فایل، بدون نیاز به حساب کاربری.",
};
export function updateSeo(
  view: string,
  fa: boolean,
  inRoom: boolean,
  dark: boolean,
) {
  const title = fa
    ? "پیمکس‌نود | انتقال امن فایل بین دستگاه‌ها"
    : "PIMXNODE — Secure file sharing between devices";
  const labels: Record<string, string> = fa
    ? {
        exchange: "انتقال فایل",
        history: "سابقهٔ انتقال",
        help: "راهنمای انتقال فایل",
        session: "جزئیات نشست",
      }
    : {
        exchange: "File exchange",
        history: "Transfer history",
        help: "File sharing guide",
        session: "Session details",
      };
  document.title =
    view === "home" ? title : `${labels[view] || "PIMXNODE"} | PIMXNODE`;
  const setMeta = (name: string, content: string, property = false) => {
    const attr = property ? "property" : "name";
    let node = document.head.querySelector<HTMLMetaElement>(
      `meta[${attr}="${name}"]`,
    );
    if (!node) {
      node = document.createElement("meta");
      node.setAttribute(attr, name);
      document.head.append(node);
    }
    node.content = content;
  };
  setMeta("description", descriptions[fa ? "fa" : "en"]);
  setMeta(
    "robots",
    inRoom || view !== "home"
      ? "noindex,follow"
      : "index,follow,max-image-preview:large",
  );
  setMeta("theme-color", dark ? "#1b101f" : "#faf5fc");
  setMeta("og:title", document.title, true);
  setMeta("og:description", descriptions[fa ? "fa" : "en"], true);
  setMeta("og:locale", fa ? "fa_IR" : "en_US", true);
  setMeta("twitter:title", document.title);
  setMeta("twitter:description", descriptions[fa ? "fa" : "en"]);
  let canonical = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.append(canonical);
  }
  canonical.href = new URL(
    "/",
    import.meta.env.VITE_SITE_URL || location.origin,
  ).href;
  setMeta("og:url", canonical.href, true);
}
