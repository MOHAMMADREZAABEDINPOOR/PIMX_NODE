import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  Plus,
  Copy,
  Check,
  X,
  Monitor,
  Smartphone,
  Upload,
  FolderUp,
  File,
  Image,
  Film,
  Music,
  FileText,
  Archive,
  Download,
  Pause,
  Play,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  ShieldCheck,
  Lock,
  Settings2,
  Globe,
  Sun,
  Moon,
  Send,
  Link,
  QrCode,
  Wifi,
  WifiOff,
  Search,
  SlidersHorizontal,
  Bell,
  ExternalLink,
  Command,
  CheckCheck,
  Eye,
  Trash2,
  HardDrive,
  Activity,
  Users,
  CircleHelp,
} from "lucide-react";
import QRCode from "qrcode";
import AnimatedDialog from "./components/AnimatedDialog";
import Accordion from "./components/Accordion";
import HomePage from "./components/HomePage";
import SiteFooter from "./components/SiteFooter";
import DeviceRadar from "./components/DeviceRadar";
import LiveText from "./components/LiveText";
import { updateSeo } from "./lib/seo";
import { Exchange, type Snapshot, type Transfer } from "./lib/engine";
import {
  bytes,
  download,
  readHistory,
  randomId,
  type HistoryEntry,
} from "./lib/storage";
const TransitScene = lazy(() => import("./components/TransitScene"));
const empty: Snapshot = {
  peers: [],
  transfers: [],
  notes: [],
  online: false,
  error: "",
  relayAvailable: false,
  history: [],
};
const preference = (key: string, value: string) => {
  try {
    return localStorage.getItem(key) || value;
  } catch {
    return value;
  }
};
const initial = new URL(location.href);
const initialRoom = initial.searchParams.get("room") || "";
const initialKey = new URLSearchParams(initial.hash.slice(1)).get("key") || "";
const statusWords: Record<string, [string, string]> = {
  queued: ["In the queue", "در صف ارسال"],
  offered: ["Waiting for approval", "منتظر تأیید گیرنده"],
  pending: ["Accept to receive", "آمادهٔ دریافت"],
  transferring: ["In motion", "در حال انتقال"],
  paused: ["Paused", "متوقف شده"],
  waiting: ["Waiting for connection", "منتظر اتصال دوباره"],
  verifying: ["Checking the file", "بررسی سلامت فایل"],
  completed: ["Received & verified", "دریافت و بررسی شد"],
  cancelled: ["Cancelled", "لغو شد"],
  failed: ["Transfer failed", "انتقال ناموفق"],
};
function FileIcon({
  mime,
  name,
  size = 24,
}: {
  mime?: string;
  name: string;
  size?: number;
}) {
  const Icon = mime?.startsWith("image/")
    ? Image
    : mime?.startsWith("video/")
      ? Film
      : mime?.startsWith("audio/")
        ? Music
        : /\.(zip|rar|7z|gz)$/i.test(name)
          ? Archive
          : /\.(pdf|txt|md|json|csv|tsx?|jsx?|py|html|css)$/i.test(name)
            ? FileText
            : File;
  return <Icon size={size} strokeWidth={1.5} />;
}
async function droppedFiles(
  items: DataTransferItemList,
  fallback: FileList,
): Promise<File[]> {
  const result: File[] = [];
  async function visit(entry: any, path = ""): Promise<void> {
    if (entry.isFile)
      await new Promise<void>((resolve, reject) =>
        entry.file((file: File) => {
          if (path)
            Object.defineProperty(file, "webkitRelativePath", {
              value: path + file.name,
            });
          result.push(file);
          resolve();
        }, reject),
      );
    else if (entry.isDirectory) {
      const reader = entry.createReader();
      for (;;) {
        const batch = await new Promise<any[]>((resolve, reject) =>
          reader.readEntries(resolve, reject),
        );
        if (!batch.length) break;
        for (const child of batch) await visit(child, path + entry.name + "/");
      }
    }
  }
  const entries = [...items]
    .filter((i) => i.kind === "file")
    .map((i) => i.webkitGetAsEntry?.())
    .filter(Boolean);
  if (entries.length) for (const entry of entries) await visit(entry);
  else result.push(...fallback);
  return result;
}

function Preview({
  transfer,
  fa,
  close,
}: {
  transfer: Transfer;
  fa: boolean;
  close: () => void;
}) {
  const [previewOpen, setPreviewOpen] = useState(true);
  const [url, setUrl] = useState(""),
    [text, setText] = useState(""),
    [archive, setArchive] = useState<string[]>([]),
    [error, setError] = useState(false);
  const type = transfer.mime || "";
  const textual =
    type.startsWith("text/") ||
    /\.(txt|md|json|csv|log|tsx?|jsx?|py|css|html|xml|yaml|yml|sql)$/i.test(
      transfer.name,
    );
  useEffect(() => {
    let objectUrl = "",
      gone = false;
    if (transfer.blob) {
      objectUrl = URL.createObjectURL(
        new Blob([transfer.blob], {
          type: transfer.mime || "application/octet-stream",
        }),
      );
      setUrl(objectUrl);
      if (textual)
        void transfer.blob
          .slice(0, 1024 * 1024)
          .text()
          .then((value) => {
            if (!gone) setText(value);
          });
      if (/\.zip$/i.test(transfer.name) && transfer.size < 64 * 1024 * 1024)
        void import("jszip")
          .then((m) => m.default.loadAsync(transfer.blob!))
          .then((zip) => {
            if (!gone) setArchive(Object.keys(zip.files).slice(0, 300));
          })
          .catch(() => {
            if (!gone) setError(true);
          });
    }
    return () => {
      gone = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [transfer.id]);
  return (
    <AnimatedDialog
      open={previewOpen}
      onClose={() => setPreviewOpen(false)}
      onAfterClose={close}
      className="preview-dialog"
      labelledBy="preview-title"
    >
      <div className="dialog-heading">
        <div>
          <h2 id="preview-title">{transfer.name}</h2>
          <p>{bytes(transfer.size)}</p>
        </div>
        <button
          className="icon-button"
          onClick={() => setPreviewOpen(false)}
          aria-label={fa ? "بستن" : "Close"}
        >
          <X />
        </button>
      </div>
      <div className="preview-body">
        {type.startsWith("image/") ? (
          <img src={url} alt={transfer.name} onError={() => setError(true)} />
        ) : type.startsWith("video/") ? (
          <video src={url} controls onError={() => setError(true)} />
        ) : type.startsWith("audio/") ? (
          <audio src={url} controls onError={() => setError(true)} />
        ) : type === "application/pdf" || /\.pdf$/i.test(transfer.name) ? (
          <iframe src={url} title={transfer.name} sandbox="allow-same-origin" />
        ) : textual ? (
          <pre dir="ltr">
            {text}
            {transfer.size > 1024 * 1024 && "\n… (preview limited to 1 MB)"}
          </pre>
        ) : archive.length ? (
          <ul className="archive-list">
            {archive.map((name) => (
              <li key={name}>
                <File size={16} />
                {name}
              </li>
            ))}
          </ul>
        ) : (
          <div className="unsupported">
            <FileIcon name={transfer.name} mime={type} size={56} />
            <p>
              {fa
                ? "این فرمت پیش‌نمایش ندارد. فایل اصلی آمادهٔ ذخیره است."
                : "This format has no browser preview. Your original file is ready to save."}
            </p>
          </div>
        )}
        {error && (
          <p role="alert">
            {fa
              ? "مرورگر نمی‌تواند این فایل را نمایش دهد؛ می‌توانی فایل اصلی را ذخیره کنی."
              : "Your browser cannot display this file. You can still save the original."}
          </p>
        )}
      </div>
      <button
        className="button primary"
        onClick={() => transfer.blob && download(transfer.blob, transfer.name)}
      >
        <Download size={18} />
        {fa ? "ذخیرهٔ فایل اصلی" : "Save original"}
      </button>
    </AnimatedDialog>
  );
}

export default function App() {
  const [lang, setLang] = useState(preference("react_p2p_lang", "en")),
    fa = lang === "fa";
  const t = (en: string, persian: string) => (fa ? persian : en);
  const [theme, setTheme] = useState(preference("react_p2p_theme", "light")),
    dark = theme === "dark";
  const [low, setLow] = useState(
    preference(
      "pimx-quality",
      navigator.hardwareConcurrency <= 4 ? "low" : "full",
    ) === "low",
  );
  const [view, setView] = useState<
    "home" | "exchange" | "history" | "help" | "session"
  >(
    initialRoom || initial.searchParams.has("shared")
      ? "exchange"
      : location.pathname === "/pimxnodeadmin"
        ? "session"
        : "home",
  );
  const [roomId, setRoomId] = useState(initialRoom),
    [secret, setSecret] = useState(initialKey);
  const [name, setName] = useState(
    preference(
      "pimx-name",
      /Mobi|Android|iPhone/i.test(navigator.userAgent)
        ? "My phone"
        : "My computer",
    ),
  );
  const [snapshot, setSnapshot] = useState<Snapshot>(empty),
    [selected, setSelected] = useState<string[]>([]);
  const [panel, setPanel] = useState<"invite" | "settings" | "join" | null>(
    initialRoom && !initialKey ? "join" : null,
  );
  const [inviteInput, setInviteInput] = useState(""),
    [manualKey, setManualKey] = useState("");
  const [toast, setToast] = useState(""),
    [qr, setQr] = useState(""),
    [drag, setDrag] = useState(false);
  const [note, setNote] = useState(""),
    [search, setSearch] = useState(""),
    [filter, setFilter] = useState("all");
  const [preview, setPreview] = useState<Transfer | null>(null),
    [history, setHistory] = useState<HistoryEntry[]>(readHistory);
  const [diagnostic, setDiagnostic] = useState<Awaited<
      ReturnType<Exchange["diagnostics"]>
    > | null>(null),
    [checking, setChecking] = useState(false);
  const [zipBusy, setZipBusy] = useState(false),
    [installPrompt, setInstallPrompt] = useState<any>(null);
  const [minutes, setMinutes] = useState(60),
    [capacity, setCapacity] = useState(8),
    [locked, setLocked] = useState(false);
  const engine = useRef<Exchange | null>(null),
    fileInput = useRef<HTMLInputElement>(null),
    folderInput = useRef<HTMLInputElement>(null);
  const pendingShared = useRef<File[]>([]);
  const reduced = useReducedMotion();
  const active = snapshot.transfers.filter((item) =>
    ["transferring", "verifying"].includes(item.status),
  );
  const ready = snapshot.peers.filter((p) => p.state === "ready");
  const recipients = selected.filter((id) => ready.some((p) => p.id === id));
  const owner = snapshot.room?.host === engine.current?.id;
  const inviteUrl =
    roomId && secret
      ? `${location.origin}/?room=${encodeURIComponent(roomId)}#key=${encodeURIComponent(secret)}`
      : "";
  const notice = (message: string) => setToast(message);
  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      notice(t("Copied to clipboard.", "کپی شد."));
    } catch {
      notice(
        t(
          "Clipboard unavailable. Select and copy the text.",
          "امکان کپی خودکار نیست؛ متن را انتخاب و کپی کن.",
        ),
      );
    }
  };
  useEffect(() => {
    document.documentElement.lang = fa ? "fa" : "en";
    document.documentElement.dir = fa ? "rtl" : "ltr";
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("react_p2p_lang", lang);
      localStorage.setItem("react_p2p_theme", theme);
      localStorage.setItem("pimx-quality", low ? "low" : "full");
    } catch {
      /* private storage */
    }
  }, [lang, theme, low]);
  useEffect(() => {
    updateSeo(view, fa, !!roomId, dark);
  }, [view, fa, roomId, dark]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    if (!roomId || !secret) return;
    const exchange = new Exchange(roomId, secret, name, (state) => {
      setSnapshot(state);
      if (state.history.length) setHistory(state.history);
    });
    engine.current = exchange;
    void exchange
      .start()
      .catch(() =>
        notice(
          t(
            "Could not start. Use HTTPS and try again.",
            "اتصال شروع نشد. سایت را با HTTPS باز کن و دوباره امتحان کن.",
          ),
        ),
      );
    const url = new URL(location.href);
    url.search = `?room=${encodeURIComponent(roomId)}`;
    url.hash = `key=${encodeURIComponent(secret)}`;
    window.history.replaceState({}, "", url);
    return () => {
      exchange.dispose();
      if (engine.current === exchange) engine.current = null;
    };
  }, [roomId, secret]);
  useEffect(() => {
    if (recipients.length === 0 && ready.length === 1)
      setSelected([ready[0].id]);
  }, [ready.map((p) => p.id).join(",")]);
  useEffect(() => {
    if (snapshot.room) {
      setLocked(snapshot.room.locked);
      setCapacity(snapshot.room.maxPeers);
    }
  }, [snapshot.room?.locked, snapshot.room?.maxPeers]);

  useEffect(() => {
    if (inviteUrl)
      void QRCode.toDataURL(inviteUrl, {
        width: 256,
        margin: 2,
        color: { dark: "#482146", light: "#ffffff" },
        errorCorrectionLevel: "M",
      }).then(setQr);
  }, [inviteUrl]);
  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    window.addEventListener("beforeinstallprompt", handler);
    if (import.meta.env.PROD && "serviceWorker" in navigator)
      void navigator.serviceWorker.register("/sw.js").catch(() => {});
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (
        active.length ||
        snapshot.transfers.some((t) => t.status === "paused")
      ) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [active.length, snapshot.transfers]);
  useEffect(() => {
    if (!initial.searchParams.has("shared")) return;
    const request = indexedDB.open("pimx-shares", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("inbox");
    request.onsuccess = () => {
      const db = request.result,
        tx = db.transaction("inbox", "readwrite"),
        store = tx.objectStore("inbox"),
        get = store.get("pending");
      get.onsuccess = () => {
        if (get.result) {
          pendingShared.current = get.result.files || [];
          setNote(get.result.text || "");
          notice(
            t(
              "Shared items are ready. Connect a device to send them.",
              "فایل‌های اشتراکی آماده‌اند. برای ارسال یک دستگاه را وصل کن.",
            ),
          );
          store.delete("pending");
        }
      };
      tx.oncomplete = () => db.close();
    };
  }, []);
  const startRoom = () => {
    if (!roomId) {
      setRoomId(`node-${randomId()}`);
      setSecret(
        Array.from(crypto.getRandomValues(new Uint8Array(24)), (n) =>
          n.toString(16).padStart(2, "0"),
        ).join(""),
      );
    }
    setView("exchange");
  };
  const join = () => {
    try {
      const url = new URL(inviteInput),
        room = url.searchParams.get("room"),
        key = new URLSearchParams(url.hash.slice(1)).get("key");
      if (
        !room ||
        !key ||
        !/^[a-zA-Z0-9_-]{6,80}$/.test(room) ||
        key.length < 8
      )
        throw new Error();
      if (
        snapshot.transfers.some(
          (item) => !["completed", "cancelled", "failed"].includes(item.status),
        )
      ) {
        notice(
          t(
            "Finish or cancel active transfers before switching rooms.",
            "پیش از تغییر اتاق، انتقال‌های فعال را تمام یا لغو کن.",
          ),
        );
        return;
      }
      setSnapshot(empty);
      setSelected([]);
      setRoomId(room);
      setSecret(key);
      setView("exchange");
      setPanel(null);
    } catch {
      notice(
        t(
          "Paste the complete invitation link, including its key.",
          "لینک کامل دعوت را همراه کلید انتهای آن وارد کن.",
        ),
      );
    }
  };
  const queue = (files: File[]) => {
    if (!recipients.length) {
      notice(
        t(
          "Connect and select a recipient first.",
          "اول یک گیرنده را وصل و انتخاب کن.",
        ),
      );
      return;
    }
    if (!files.length) return;
    engine.current?.enqueue(files, recipients);
    notice(
      t(
        `${files.length} file${files.length > 1 ? "s" : ""} added to the queue.`,
        `${files.length} فایل به صف اضافه شد.`,
      ),
    );
  };
  const runDiagnostic = async () => {
    setChecking(true);
    try {
      if (engine.current) setDiagnostic(await engine.current.diagnostics());
      else {
        const start = performance.now(),
          response = await fetch("/api/health"),
          health = await response.json(),
          config = await (await fetch("/api/rtc-config")).json(),
          storage = await navigator.storage?.estimate();
        setDiagnostic({
          latency: Math.round(performance.now() - start),
          peers: health.activePeers,
          relay: config.relayAvailable,
          available: storage?.quota
            ? storage.quota - (storage.usage || 0)
            : null,
          secure: window.isSecureContext,
          rtc: !!window.RTCPeerConnection,
        });
      }
    } catch {
      notice(
        t(
          "The connection service is unreachable. Try again when online.",
          "سرویس اتصال در دسترس نیست؛ اتصال اینترنت را بررسی کن.",
        ),
      );
    } finally {
      setChecking(false);
    }
  };
  const zipAll = async () => {
    const received = snapshot.transfers.filter(
      (t) => t.direction === "receiving" && t.status === "completed" && t.blob,
    );
    if (
      received.reduce((sum, item) => sum + item.size, 0) >
      256 * 1024 * 1024
    ) {
      notice(
        t(
          "Save these files individually. This archive exceeds the 256 MB browser limit.",
          "این فایل‌ها را جداگانه ذخیره کن؛ حجم بسته از سقف ۲۵۶ مگابایت بیشتر است.",
        ),
      );
      return;
    }
    setZipBusy(true);
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      for (const file of received) {
        let path = file.path;
        if (zip.file(path)) path = `${file.id.slice(0, 8)}-${path}`;
        zip.file(path, await file.blob!.arrayBuffer());
      }
      download(
        await zip.generateAsync({ type: "blob", compression: "STORE" }),
        "PIMXNODE-files.zip",
      );
    } catch {
      notice(
        t(
          "Could not create the archive. Save each file instead.",
          "ساخت بسته ناموفق بود؛ فایل‌ها را جداگانه ذخیره کن.",
        ),
      );
    } finally {
      setZipBusy(false);
    }
  };
  const Scene = (hero = false) => (
    <Suspense
      fallback={
        <div className="scene-loading">
          <img
            className={hero ? "transit-poster" : undefined}
            src={
              hero
                ? "/illustrations/device-bridge.png"
                : dark
                  ? "/logo-mark-light.svg"
                  : "/logo-mark.svg"
            }
            alt=""
          />
        </div>
      }
    >
      <TransitScene
        hero={hero}
        active={active.length > 0}
        peers={ready.length}
        devices={ready.map((p) => ({
          ...p,
          selected: selected.includes(p.id),
        }))}
        onSelect={
          hero
            ? undefined
            : (id) =>
                setSelected((prev) =>
                  prev.includes(id)
                    ? prev.filter((p) => p !== id)
                    : [...prev, id],
                )
        }
        dark={dark}
        low={low}
        label={t(
          "Drag to turn the connection sculpture. Use arrow keys to rotate.",
          "برای چرخاندن نمای اتصال، بکش یا از کلیدهای جهت استفاده کن.",
        )}
      />
    </Suspense>
  );
  const errorWords: Record<string, string> = {
    network: t(
      "Connection service unavailable. Reconnecting…",
      "سرویس اتصال در دسترس نیست؛ تلاش دوباره…",
    ),
    expired: t(
      "This room has expired. Create a new room to continue.",
      "زمان این اتاق تمام شده؛ اتاق تازه بساز.",
    ),
    locked: t(
      "This room is locked. Ask its owner to unlock it.",
      "اتاق قفل است؛ از صاحب اتاق بخواه بازش کند.",
    ),
    full: t(
      "This room is full. Ask its owner to increase its capacity.",
      "اتاق پر است؛ از صاحب اتاق بخواه ظرفیت را بیشتر کند.",
    ),
    removed: t(
      "The room owner removed this device.",
      "صاحب اتاق این دستگاه را خارج کرده است.",
    ),
    key: t(
      "The invitation key does not match. Rejoin using the complete link.",
      "کلید دعوت یکسان نیست؛ با لینک کامل دوباره وارد شو.",
    ),
    https: t(
      "Open this site over HTTPS to enable encrypted transfers.",
      "برای انتقال رمزگذاری‌شده، سایت را با HTTPS باز کن.",
    ),
    connection: t(
      "Connection failed. Check the network in Help.",
      "اتصال برقرار نشد؛ از بخش راهنما شبکه را بررسی کن.",
    ),
  };
  const visibleTransfers = snapshot.transfers.filter(
    (item) =>
      (!search ||
        `${item.name} ${item.peerName}`
          .toLowerCase()
          .includes(search.toLowerCase())) &&
      (filter === "all" ||
        (filter === "active" &&
          !["completed", "cancelled", "failed"].includes(item.status)) ||
        (filter === "completed" && item.status === "completed")),
  );

  return (
    <div className={`app ${view === "home" ? "landing" : "workspace"}`}>
      <a className="skip-link" href="#main">
        {t("Skip to content", "رفتن به محتوا")}
      </a>
      <header className="site-header">
        <button
          className="wordmark"
          onClick={() => setView("home")}
          aria-label="PIMXNODE home"
        >
          <img src={dark ? "/logo-mark-light.svg" : "/logo-mark.svg"} alt="" />
          <span>
            PIMXNODE
            <span className="brand-signal" aria-hidden="true" />
          </span>
        </button>
        <nav aria-label={t("Main navigation", "ناوبری اصلی")}>
          <button
            className={view === "exchange" ? "nav-active" : ""}
            onClick={startRoom}
          >
            {t("The exchange", "انتقال فایل")}
          </button>
          <button
            className={view === "history" ? "nav-active" : ""}
            onClick={() => {
              setHistory(readHistory());
              setView("history");
            }}
          >
            {t("History", "سابقه")}
          </button>
          <button
            className={view === "help" ? "nav-active" : ""}
            onClick={() => setView("help")}
          >
            {t("How it works", "راهنما")}
          </button>
        </nav>
        <div className="header-actions">
          <button
            className="language-button"
            onClick={() => setLang(fa ? "en" : "fa")}
            aria-label={t("Switch to Persian", "تغییر زبان به انگلیسی")}
          >
            <Globe size={17} />
            <span>{fa ? "EN" : "فا"}</span>
          </button>
          <button
            className="icon-button theme-button"
            onClick={() => setTheme(dark ? "light" : "dark")}
            aria-label={t("Change color theme", "تغییر رنگ صفحه")}
          >
            {dark ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          <button
            className="button small header-join"
            onClick={() => setPanel("join")}
          >
            {t("Join a room", "ورود به اتاق")}
            <ArrowUpRight size={17} />
          </button>
        </div>
      </header>

      <main id="main">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={view}
            initial={{ opacity: 0, y: reduced ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -8 }}
            transition={{ duration: reduced ? 0 : 0.35 }}
          >
            {view === "home" && (
              <HomePage
                fa={fa}
                scene={Scene(true)}
                start={startRoom}
                join={() => setPanel("join")}
                help={() => {
                  setView("help");
                  window.scrollTo({ top: 0, behavior: "instant" });
                }}
              />
            )}

            {view === "exchange" && (
              <div className="exchange-page">
                <div className="page-heading">
                  <div>
                    <h1>
                      <LiveText
                        text={t("Your little exchange.", "جای فایل‌های تو.")}
                      />
                    </h1>
                    <p>
                      {t(
                        "Connect. Drop. Carry on.",
                        "وصل شو، فایل را بفرست، به کارت برس.",
                      )}
                    </p>
                  </div>
                  <div className="page-actions">
                    <span
                      className={`connection-status ${snapshot.online ? "online" : ""}`}
                    >
                      <span />
                      {snapshot.online
                        ? t("Room is live", "اتاق آماده است")
                        : roomId
                          ? t("Connecting…", "در حال اتصال…")
                          : t("Let’s connect", "شروع کنیم")}
                    </span>
                    <button
                      className="icon-button"
                      onClick={() => setPanel("settings")}
                      aria-label={t("Room settings", "تنظیمات اتاق")}
                    >
                      <Settings2 size={21} />
                    </button>
                  </div>
                </div>
                {!roomId && (
                  <div className="start-banner">
                    <p>
                      {t(
                        "Make a private room, then invite your other device.",
                        "یک اتاق خصوصی بساز و دستگاه دیگرت را دعوت کن.",
                      )}
                    </p>
                    <button className="button primary" onClick={startRoom}>
                      {t("Create my room", "ساختن اتاق")}
                      <Plus size={18} />
                    </button>
                  </div>
                )}
                {snapshot.error && (
                  <div className="error-banner" role="alert">
                    <WifiOff size={20} />
                    <span>
                      {errorWords[snapshot.error] ||
                        t(
                          "Something interrupted the connection. Try again.",
                          "اتصال قطع شده؛ دوباره امتحان کن.",
                        )}
                    </span>
                    {["expired", "removed"].includes(snapshot.error) && (
                      <button
                        className="text-button"
                        onClick={() => {
                          setRoomId("");
                          setSecret("");
                          setSnapshot(empty);
                          setSelected([]);
                        }}
                      >
                        {t("Start fresh", "شروع تازه")}
                      </button>
                    )}
                  </div>
                )}
                {roomId && !secret && (
                  <div className="error-banner">
                    <Lock size={20} />
                    <span>
                      {t(
                        "This invitation is missing its key.",
                        "کلید این دعوت موجود نیست.",
                      )}
                    </span>
                    <button
                      className="text-button"
                      onClick={() => setPanel("join")}
                    >
                      {t("Enter the key", "وارد کردن کلید")}
                    </button>
                  </div>
                )}
                <div className="exchange-grid">
                  <section
                    className="connections-panel"
                    aria-labelledby="device-heading"
                  >
                    <div className="section-heading">
                      <h2 id="device-heading">
                        {t("The connection", "دستگاه‌ها")}
                      </h2>
                      <span className="count">{snapshot.peers.length + 1}</span>
                    </div>
                    <div className="mini-scene">
                      <DeviceRadar
                        fa={fa}
                        online={snapshot.online}
                        active={active.length > 0}
                        devices={snapshot.peers.map((p) => ({
                          ...p,
                          selected: selected.includes(p.id),
                        }))}
                        onSelect={(id) =>
                          setSelected((prev) =>
                            prev.includes(id)
                              ? prev.filter((p) => p !== id)
                              : [...prev, id],
                          )
                        }
                      />
                      <div className="scene-caption">
                        <Lock size={14} />
                        {active.length
                          ? t("Files in motion", "فایل‌ها در مسیرند")
                          : ready.length
                            ? t("Connected & encrypted", "متصل و رمزگذاری‌شده")
                            : t("Waiting for company", "منتظر دستگاه بعدی")}
                      </div>
                    </div>
                    <div className="self-device">
                      <span className="device-symbol">
                        <Monitor size={21} />
                      </span>
                      <div>
                        <label htmlFor="device-name">
                          {t("This device", "این دستگاه")}
                        </label>
                        <input
                          id="device-name"
                          aria-label={t("Device name", "نام دستگاه")}
                          value={name}
                          maxLength={40}
                          onChange={(e) => {
                            setName(e.target.value);
                            engine.current?.rename(e.target.value);
                            try {
                              localStorage.setItem("pimx-name", e.target.value);
                            } catch {}
                          }}
                        />
                      </div>
                      <span className="you-label">{t("You", "تو")}</span>
                    </div>
                    <div className="recipient-list">
                      {snapshot.peers.length === 0 ? (
                        <div className="empty-peers">
                          <p>
                            {t("Someone’s missing.", "جای یک دستگاه خالی است.")}
                          </p>
                          <span>
                            {t(
                              "Open your invitation on another device. It’ll appear right here.",
                              "دعوت را روی دستگاه دیگر باز کن؛ همین‌جا پیدایش می‌شود.",
                            )}
                          </span>
                        </div>
                      ) : (
                        snapshot.peers.map((peer) => (
                          <div className="peer-row" key={peer.id}>
                            <button
                              className={`peer-select ${selected.includes(peer.id) ? "selected" : ""}`}
                              disabled={peer.state !== "ready"}
                              aria-pressed={selected.includes(peer.id)}
                              onClick={() =>
                                setSelected((prev) =>
                                  prev.includes(peer.id)
                                    ? prev.filter((id) => id !== peer.id)
                                    : [...prev, peer.id],
                                )
                              }
                            >
                              <span className="device-symbol">
                                {peer.deviceType === "mobile" ? (
                                  <Smartphone size={21} />
                                ) : (
                                  <Monitor size={21} />
                                )}
                              </span>
                              <span>
                                <strong>{peer.name}</strong>
                                <small>
                                  {peer.state === "ready"
                                    ? peer.transport === "relay"
                                      ? t(
                                          "Encrypted relay",
                                          "مسیر واسط رمزگذاری‌شده",
                                        )
                                      : t("Ready to receive", "آمادهٔ دریافت")
                                    : t(
                                        "Connecting securely…",
                                        "در حال اتصال…",
                                      )}
                                </small>
                              </span>
                              <span className="selection-check">
                                {selected.includes(peer.id) && (
                                  <Check size={15} />
                                )}
                              </span>
                            </button>
                            {owner && (
                              <button
                                className="icon-button tiny"
                                aria-label={t(
                                  `Remove ${peer.name}`,
                                  `خارج کردن ${peer.name}`,
                                )}
                                onClick={() => engine.current?.kick(peer.id)}
                              >
                                <X size={15} />
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                    <button
                      className="button invite-button"
                      disabled={!inviteUrl}
                      onClick={() => setPanel("invite")}
                    >
                      <Plus size={18} />
                      {t("Bring another device", "دعوت یک دستگاه")}
                      <QrCode size={18} />
                    </button>
                    <div className="room-caption">
                      <span>{t("Room", "اتاق")}</span>
                      <span dir="ltr" title={roomId}>
                        {roomId ? `${roomId.slice(0, 13)}…` : "—"}
                      </span>
                      {snapshot.room?.locked && <Lock size={12} />}
                    </div>
                  </section>
                  <div className="transfer-column">
                    <section
                      className={`drop-zone ${drag ? "dragging" : ""} ${!recipients.length ? "awaiting" : ""}`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDrag(true);
                      }}
                      onDragLeave={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget as Node))
                          setDrag(false);
                      }}
                      onDrop={async (e) => {
                        e.preventDefault();
                        setDrag(false);
                        const items = e.dataTransfer.items,
                          files = e.dataTransfer.files;
                        try {
                          queue(await droppedFiles(items, files));
                        } catch {
                          notice(
                            t(
                              "Could not read that folder. Use Choose folder instead.",
                              "خواندن پوشه ممکن نشد؛ از انتخاب پوشه استفاده کن.",
                            ),
                          );
                        }
                      }}
                    >
                      <div className="drop-art" aria-hidden="true">
                        <span className="paper paper-back">
                          <File size={29} />
                        </span>
                        <span className="paper paper-front">
                          <ArrowUpRight size={34} />
                        </span>
                      </div>
                      <h2>
                        {drag
                          ? t("Right here.", "همین‌جا رها کن.")
                          : t(
                              "Drop something good.",
                              "فایل‌ها را اینجا رها کن.",
                            )}
                      </h2>
                      <p>
                        {recipients.length
                          ? t(
                              `Sending to ${recipients.length === 1 ? ready.find((p) => p.id === recipients[0])?.name : `${recipients.length} devices`}. Every file type is welcome.`,
                              `ارسال به ${recipients.length} دستگاه؛ با هر پسوندی که داری.`,
                            )
                          : t(
                              "Invite a device, then drop your files here.",
                              "یک دستگاه را دعوت کن، بعد فایل‌ها را اینجا رها کن.",
                            )}
                      </p>
                      <div className="drop-actions">
                        <button
                          className="button primary"
                          disabled={!recipients.length}
                          onClick={() => fileInput.current?.click()}
                        >
                          <Plus size={18} />
                          {t("Choose files", "انتخاب فایل")}
                        </button>
                        <button
                          className="button subtle"
                          disabled={!recipients.length}
                          onClick={() => folderInput.current?.click()}
                        >
                          <FolderUp size={18} />
                          {t("A whole folder", "انتخاب پوشه")}
                        </button>
                      </div>
                      <input
                        ref={fileInput}
                        type="file"
                        multiple
                        hidden
                        onChange={(e) => {
                          queue([...(e.target.files || [])]);
                          e.target.value = "";
                        }}
                        aria-label={t("Choose files", "انتخاب فایل")}
                      />
                      <input
                        ref={folderInput}
                        type="file"
                        multiple
                        hidden
                        {...{ webkitdirectory: "", directory: "" }}
                        onChange={(e) => {
                          queue([...(e.target.files || [])]);
                          e.target.value = "";
                        }}
                        aria-label={t("Choose folder", "انتخاب پوشه")}
                      />
                      {pendingShared.current.length > 0 && (
                        <button
                          className="text-button"
                          disabled={!recipients.length}
                          onClick={() => {
                            queue(pendingShared.current);
                            pendingShared.current = [];
                          }}
                        >
                          {t(
                            `Send ${pendingShared.current.length} shared files`,
                            `ارسال ${pendingShared.current.length} فایل اشتراکی`,
                          )}
                        </button>
                      )}
                      <div className="drop-footnote">
                        <ShieldCheck size={14} />
                        {t(
                          "Your recipient approves. We check every byte.",
                          "گیرنده تأیید می‌کند؛ سلامت فایل هم بررسی می‌شود.",
                        )}
                      </div>
                    </section>
                    <section
                      className="queue-section"
                      aria-labelledby="queue-heading"
                    >
                      <div className="section-heading">
                        <h2 id="queue-heading">
                          {t("On the move", "فایل‌ها در مسیر")}
                        </h2>
                        <span className="count">
                          {snapshot.transfers.length}
                        </span>
                        <div className="section-actions">
                          {snapshot.transfers.some(
                            (t) =>
                              t.direction === "receiving" &&
                              t.status === "completed",
                          ) && (
                            <button
                              className="text-button"
                              disabled={zipBusy}
                              onClick={zipAll}
                            >
                              <Archive size={15} />
                              {zipBusy
                                ? t("Packing…", "بسته‌بندی…")
                                : t("Save as ZIP", "ذخیرهٔ ZIP")}
                            </button>
                          )}
                        </div>
                      </div>
                      {snapshot.transfers.length > 0 && (
                        <div className="queue-tools">
                          <label className="search-field">
                            <Search size={16} />
                            <input
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              placeholder={t("Find a file", "جست‌وجوی فایل")}
                              aria-label={t(
                                "Search transfers",
                                "جست‌وجوی انتقال‌ها",
                              )}
                            />
                          </label>
                          <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            aria-label={t(
                              "Filter transfers",
                              "فیلتر انتقال‌ها",
                            )}
                          >
                            <option value="all">
                              {t("Everything", "همه")}
                            </option>
                            <option value="active">
                              {t("In progress", "در جریان")}
                            </option>
                            <option value="completed">
                              {t("Completed", "کامل‌شده")}
                            </option>
                          </select>
                        </div>
                      )}
                      {!snapshot.transfers.length ? (
                        <div className="empty-queue">
                          <div className="empty-tracks" aria-hidden="true">
                            <span />
                            <span />
                            <span />
                          </div>
                          <div>
                            <p>{t("A clear runway.", "مسیر باز است.")}</p>
                            <span>
                              {t(
                                "Your transfers will land here. Pick a file to get things moving.",
                                "انتقال‌ها اینجا دیده می‌شوند. یک فایل انتخاب کن تا شروع کنیم.",
                              )}
                            </span>
                          </div>
                        </div>
                      ) : !visibleTransfers.length ? (
                        <p className="empty-queue">
                          {t(
                            "No matching transfers.",
                            "انتقالی با این مشخصات نیست.",
                          )}
                        </p>
                      ) : (
                        <div className="transfer-list">
                          {visibleTransfers.map((item) => (
                            <article
                              className={`transfer-row status-${item.status}`}
                              key={item.id}
                            >
                              <div className="file-symbol">
                                <FileIcon mime={item.mime} name={item.name} />
                              </div>
                              <div className="transfer-info">
                                <strong title={item.path}>{item.name}</strong>
                                <div className="transfer-meta">
                                  <span>{bytes(item.size)}</span>
                                  <span>
                                    {item.direction === "sending" ? "→" : "←"}{" "}
                                    {item.peerName}
                                  </span>
                                </div>
                                <span className="transfer-state">
                                  {statusWords[item.status]?.[fa ? 1 : 0]}
                                  {item.status === "transferring" &&
                                    item.speed > 0 &&
                                    ` · ${bytes(item.speed)}/s · ${Math.ceil(item.eta)}${t("s left", " ثانیه باقی‌مانده")}`}
                                </span>
                                {[
                                  "transferring",
                                  "paused",
                                  "waiting",
                                  "verifying",
                                ].includes(item.status) && (
                                  <div
                                    className="progress-track"
                                    role="progressbar"
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-valuenow={Math.floor(item.progress)}
                                    aria-label={`${item.name} ${t("progress", "پیشرفت")}`}
                                  >
                                    <span
                                      style={{ width: `${item.progress}%` }}
                                    />
                                  </div>
                                )}
                                {item.error && (
                                  <span className="transfer-error">
                                    {["storage", "memory"].includes(item.error)
                                      ? t(
                                          "Not enough browser storage. Free up space or use a smaller file.",
                                          "فضای مرورگر کافی نیست؛ فضا را خالی کن یا فایل کوچک‌تر بفرست.",
                                        )
                                      : t(
                                          "The file did not pass verification. Ask the sender to retry.",
                                          "سلامت فایل تأیید نشد؛ از فرستنده بخواه دوباره بفرستد.",
                                        )}
                                  </span>
                                )}
                              </div>
                              <div className="transfer-controls">
                                {item.status === "pending" ? (
                                  <>
                                    <button
                                      className="button small primary"
                                      onClick={() =>
                                        void engine.current?.accept(item.id)
                                      }
                                    >
                                      {t("Accept", "دریافت")}
                                    </button>
                                    <button
                                      className="icon-button"
                                      aria-label={t("Reject file", "رد فایل")}
                                      onClick={() =>
                                        void engine.current?.action(
                                          item.id,
                                          "cancel",
                                        )
                                      }
                                    >
                                      <X size={18} />
                                    </button>
                                  </>
                                ) : item.status === "completed" ? (
                                  <>
                                    <CheckCheck
                                      className="verified-icon"
                                      size={20}
                                    />
                                    {item.blob && (
                                      <>
                                        <button
                                          className="icon-button"
                                          aria-label={t(
                                            `Preview ${item.name}`,
                                            `پیش‌نمایش ${item.name}`,
                                          )}
                                          onClick={() => setPreview(item)}
                                        >
                                          <Eye size={18} />
                                        </button>
                                        <button
                                          className="icon-button"
                                          aria-label={t(
                                            `Save ${item.name}`,
                                            `ذخیرهٔ ${item.name}`,
                                          )}
                                          onClick={() =>
                                            download(item.blob!, item.name)
                                          }
                                        >
                                          <Download size={18} />
                                        </button>
                                      </>
                                    )}
                                  </>
                                ) : item.status === "failed" ||
                                  item.status === "cancelled" ? (
                                  item.direction === "sending" && (
                                    <button
                                      className="icon-button"
                                      aria-label={t("Retry", "تلاش دوباره")}
                                      onClick={() =>
                                        void engine.current?.action(
                                          item.id,
                                          "retry",
                                        )
                                      }
                                    >
                                      <RotateCcw size={18} />
                                    </button>
                                  )
                                ) : (
                                  <>
                                    {item.status !== "verifying" && (
                                      <button
                                        className="icon-button"
                                        aria-label={
                                          item.status === "paused"
                                            ? t("Resume", "ادامه")
                                            : t("Pause", "توقف")
                                        }
                                        onClick={() =>
                                          void engine.current?.action(
                                            item.id,
                                            item.status === "paused"
                                              ? "resume"
                                              : "pause",
                                          )
                                        }
                                      >
                                        {item.status === "paused" ? (
                                          <Play size={18} />
                                        ) : (
                                          <Pause size={18} />
                                        )}
                                      </button>
                                    )}
                                    {item.status === "queued" && (
                                      <button
                                        className="icon-button"
                                        aria-label={t(
                                          "Move up in queue",
                                          "اولویت بیشتر",
                                        )}
                                        onClick={() =>
                                          void engine.current?.action(
                                            item.id,
                                            "priority",
                                          )
                                        }
                                      >
                                        <ChevronUp size={18} />
                                      </button>
                                    )}
                                    <button
                                      className="icon-button"
                                      aria-label={t(
                                        "Cancel transfer",
                                        "لغو انتقال",
                                      )}
                                      onClick={() =>
                                        void engine.current?.action(
                                          item.id,
                                          "cancel",
                                        )
                                      }
                                    >
                                      <X size={18} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </article>
                          ))}
                        </div>
                      )}
                    </section>
                    <section className="notes-section">
                      <div className="section-heading">
                        <h2>
                          {t("A note on the side.", "یک یادداشت هم بفرست.")}
                        </h2>
                        <FileText size={18} />
                      </div>
                      <p>
                        {t(
                          "That link, a bit of text, a snippet of code. Send it along.",
                          "یک لینک، چند خط متن یا تکه‌ای کد؛ همین‌جا بفرست.",
                        )}
                      </p>
                      {snapshot.notes.length > 0 && (
                        <div className="note-feed">
                          {snapshot.notes.map((item) => (
                            <div
                              key={item.id}
                              className={`note-item ${item.incoming ? "incoming" : ""}`}
                            >
                              <div>
                                <strong>
                                  {item.incoming ? item.peer : t("You", "تو")}
                                </strong>
                                <time>
                                  {new Date(item.date).toLocaleTimeString(
                                    fa ? "fa-IR" : "en",
                                    { hour: "2-digit", minute: "2-digit" },
                                  )}
                                </time>
                                <button
                                  className="icon-button tiny"
                                  aria-label={t("Copy note", "کپی یادداشت")}
                                  onClick={() => copy(item.text)}
                                >
                                  <Copy size={14} />
                                </button>
                              </div>
                              <p dir="auto">{item.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      <form
                        className="note-composer"
                        onSubmit={async (e) => {
                          e.preventDefault();
                          try {
                            await engine.current?.text(note, recipients);
                            setNote("");
                          } catch {
                            notice(
                              t(
                                "Could not send. Check the connection and retry.",
                                "ارسال نشد؛ اتصال را بررسی و دوباره امتحان کن.",
                              ),
                            );
                          }
                        }}
                      >
                        <textarea
                          value={note}
                          maxLength={20000}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder={t(
                            "Something worth passing on…",
                            "چیزی که می‌خواهی بفرستی…",
                          )}
                          aria-label={t("Note or link", "یادداشت یا لینک")}
                        />
                        <button
                          className="button primary"
                          type="submit"
                          aria-label={t("Send note", "????? ???????")}
                          disabled={!note.trim() || !recipients.length}
                        >
                          <Send size={18} />
                          <span>{t("Send", "ارسال")}</span>
                        </button>
                      </form>
                    </section>
                  </div>
                </div>
              </div>
            )}

            {view === "history" && (
              <section className="secondary-page">
                <div className="page-heading">
                  <div>
                    <h1>
                      {t("Things you’ve moved.", "فایل‌هایی که فرستادی.")}
                    </h1>
                    <p>
                      {t(
                        "A local record of the journey. File contents aren’t kept here.",
                        "سابقه‌ای روی همین مرورگر؛ محتوای فایل‌ها اینجا ذخیره نمی‌شود.",
                      )}
                    </p>
                  </div>
                  <button
                    className="button subtle"
                    disabled={!history.length}
                    onClick={() => {
                      engine.current?.clearHistory();
                      localStorage.removeItem("pimx-history");
                      setHistory([]);
                    }}
                  >
                    <Trash2 size={17} />
                    {t("Clear history", "پاک کردن سابقه")}
                  </button>
                </div>
                <div className="history-tools">
                  <label className="search-field">
                    <Search size={18} />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={t(
                        "Search files or devices",
                        "جست‌وجوی فایل یا دستگاه",
                      )}
                      aria-label={t("Search history", "جست‌وجوی سابقه")}
                    />
                  </label>
                  <button
                    className="text-button"
                    disabled={!history.length}
                    onClick={() =>
                      download(
                        new Blob([JSON.stringify(history, null, 2)], {
                          type: "application/json",
                        }),
                        "PIMXNODE-history.json",
                      )
                    }
                  >
                    <Download size={16} />
                    {t("Export record", "خروجی سابقه")}
                  </button>
                </div>
                {history.length ? (
                  <div className="history-list">
                    {history
                      .filter((item) =>
                        `${item.name} ${item.peer}`
                          .toLowerCase()
                          .includes(search.toLowerCase()),
                      )
                      .map((item) => (
                        <article className="history-row" key={item.id}>
                          <FileIcon name={item.name} />
                          <div>
                            <strong>{item.name}</strong>
                            <p>
                              {item.direction === "sending"
                                ? t("To", "به")
                                : t("From", "از")}{" "}
                              {item.peer} · {bytes(item.size)}
                            </p>
                          </div>
                          <time>
                            {new Date(item.date).toLocaleDateString(
                              fa ? "fa-IR" : "en",
                            )}
                          </time>
                          <button
                            className="icon-button"
                            aria-label={t(
                              "Copy SHA-256 fingerprint",
                              "کپی اثر انگشت SHA-256",
                            )}
                            onClick={() => copy(item.hash)}
                          >
                            <ShieldCheck size={18} />
                          </button>
                        </article>
                      ))}
                  </div>
                ) : (
                  <div className="large-empty">
                    <Archive size={55} strokeWidth={1} />
                    <h2>
                      {t("Nothing moved. Yet.", "هنوز فایلی در مسیر نبوده.")}
                    </h2>
                    <p>
                      {t(
                        "Completed, verified transfers will appear here.",
                        "انتقال‌های کامل و تأییدشده اینجا دیده می‌شوند.",
                      )}
                    </p>
                    <button className="button primary" onClick={startRoom}>
                      {t("Send your first file", "اولین فایل را بفرست")}
                      <ArrowUpRight size={18} />
                    </button>
                  </div>
                )}
              </section>
            )}

            {(view === "help" || view === "session") && (
              <section className="secondary-page help-page">
                <div className="page-heading">
                  <div>
                    <h1>
                      {view === "session"
                        ? t("The room, at a glance.", "نگاهی به اتاق.")
                        : t("A little guidance.", "کمی راهنمایی.")}
                    </h1>
                    <p>
                      {t(
                        "Know what’s connected, what’s private, and what to do next.",
                        "بدان چه چیزی وصل است، چه چیزی خصوصی می‌ماند و قدم بعدی چیست.",
                      )}
                    </p>
                  </div>
                  <button
                    className="button primary"
                    disabled={checking}
                    onClick={runDiagnostic}
                  >
                    <Activity size={18} />
                    {checking
                      ? t("Checking…", "بررسی…")
                      : t("Check my connection", "بررسی اتصال")}
                  </button>
                </div>
                {diagnostic && (
                  <div className="diagnostic-results" aria-live="polite">
                    <h2>{t("Your connection report", "گزارش اتصال تو")}</h2>
                    <dl>
                      <div>
                        <dt>{t("Signaling round trip", "زمان پاسخ سرویس")}</dt>
                        <dd>{diagnostic.latency} ms</dd>
                      </div>
                      <div>
                        <dt>{t("Browser encryption", "رمزگذاری مرورگر")}</dt>
                        <dd>
                          {diagnostic.secure
                            ? t("Available", "در دسترس")
                            : t("Requires HTTPS", "نیاز به HTTPS")}
                        </dd>
                      </div>
                      <div>
                        <dt>{t("WebRTC", "اتصال WebRTC")}</dt>
                        <dd>
                          {diagnostic.rtc
                            ? t("Available", "در دسترس")
                            : t("Unsupported", "پشتیبانی نمی‌شود")}
                        </dd>
                      </div>
                      <div>
                        <dt>{t("Relay fallback", "مسیر واسط جایگزین")}</dt>
                        <dd>
                          {diagnostic.relay
                            ? t("Configured", "تنظیم شده")
                            : t("Not configured", "تنظیم نشده")}
                        </dd>
                      </div>
                      <div>
                        <dt>
                          {t("Browser storage available", "فضای موجود مرورگر")}
                        </dt>
                        <dd>
                          {diagnostic.available !== null
                            ? bytes(diagnostic.available)
                            : t(
                                "Memory fallback: 256 MB",
                                "حافظهٔ جایگزین: ۲۵۶ مگابایت",
                              )}
                        </dd>
                      </div>
                    </dl>
                  </div>
                )}
                {view === "session" && (
                  <div className="session-summary">
                    <h2>{t("This session", "این نشست")}</h2>
                    <dl>
                      <div>
                        <dt>{t("Connected devices", "دستگاه‌های متصل")}</dt>
                        <dd>{ready.length}</dd>
                      </div>
                      <div>
                        <dt>
                          {t("Verified transfers", "انتقال‌های تأییدشده")}
                        </dt>
                        <dd>
                          {
                            snapshot.transfers.filter(
                              (item) => item.status === "completed",
                            ).length
                          }
                        </dd>
                      </div>
                      <div>
                        <dt>{t("Verified volume", "حجم تأییدشده")}</dt>
                        <dd>
                          {bytes(
                            snapshot.transfers
                              .filter((item) => item.status === "completed")
                              .reduce((sum, item) => sum + item.size, 0),
                          )}
                        </dd>
                      </div>
                    </dl>
                  </div>
                )}
                <div className="faq-list">
                  <h2>{t("Using PIMXNODE", "کار با پیمکس‌نود")}</h2>
                  {[
                    [
                      t("How do I connect my phone?", "چطور گوشی را وصل کنم؟"),
                      t(
                        "Create a room and choose Bring another device. Scan its QR with your phone camera, or open the complete invitation link. Select the device when it is ready.",
                        "اتاق بساز و «دعوت یک دستگاه» را بزن. QR را با دوربین گوشی اسکن کن یا لینک کامل را باز کن. بعد از آماده‌شدن، دستگاه را انتخاب کن.",
                      ),
                    ],
                    [
                      t(
                        "Which files can I send?",
                        "چه فایل‌هایی می‌توانم بفرستم؟",
                      ),
                      t(
                        "Any extension. Files are sent as original bytes, with their names and folder paths. Image, audio, video, PDF, text and small ZIP archives have previews when the browser supports them. Other formats download normally.",
                        "هر پسوندی. بایت‌های اصلی، نام و مسیر پوشه حفظ می‌شوند. تصویر، صوت، ویدئو، PDF، متن و ZIP کوچک در صورت پشتیبانی مرورگر پیش‌نمایش دارند؛ بقیه به شکل معمول ذخیره می‌شوند.",
                      ),
                    ],
                    [
                      t(
                        "What happens if the connection drops?",
                        "اگر اتصال قطع شود چه می‌شود؟",
                      ),
                      t(
                        "Keep both tabs open. The devices reconnect and an approved transfer continues from the received offset. Reloading or closing a tab ends that session; its unfinished transfers cannot be resumed afterward.",
                        "هر دو تب را باز نگه دار. دستگاه‌ها دوباره متصل می‌شوند و انتقال تأییدشده از قسمت دریافت‌شده ادامه پیدا می‌کند. بستن یا بارگذاری مجدد تب، نشست را تمام می‌کند و ادامهٔ انتقال ناتمام بعد از آن ممکن نیست.",
                      ),
                    ],
                    [
                      t("Where do my files go?", "فایل‌های من کجا می‌روند؟"),
                      t(
                        "The signaling server introduces devices; it does not store file contents or receive your invitation key. File metadata, notes and chunks are AES-GCM encrypted before traveling over WebRTC. The receiving browser stages approved files in its private storage until you leave the room. Treat the full invitation like a password.",
                        "سرور سیگنالینگ دستگاه‌ها را به هم معرفی می‌کند؛ محتوای فایل یا کلید دعوت را دریافت نمی‌کند. مشخصات فایل، یادداشت‌ها و قطعه‌ها پیش از انتقال با AES-GCM رمزگذاری می‌شوند. مرورگر گیرنده، فایل‌های تأییدشده را تا خروج از اتاق در فضای خصوصی خود نگه می‌دارد. لینک کامل دعوت را مثل رمز عبور نگه دار.",
                      ),
                    ],
                    [
                      t(
                        "Why won’t two devices connect?",
                        "چرا دو دستگاه وصل نمی‌شوند؟",
                      ),
                      t(
                        "Check that both devices opened the same complete invitation and are online. Some networks block direct WebRTC connections. A configured TURN relay can help; when used, the interface labels it as an encrypted relay. The connection report shows whether it is configured.",
                        "مطمئن شو هر دو دستگاه آنلاین‌اند و لینک کامل یکسانی را باز کرده‌اند. بعضی شبکه‌ها اتصال مستقیم WebRTC را مسدود می‌کنند. سرویس TURN تنظیم‌شده می‌تواند کمک کند؛ رابط استفاده از مسیر واسط را نشان می‌دهد و گزارش اتصال، وضعیت تنظیم آن را مشخص می‌کند.",
                      ),
                    ],
                    [
                      t(
                        "How big can a file be?",
                        "حجم فایل چقدر می‌تواند باشد؟",
                      ),
                      t(
                        "There is no extension restriction. Size is limited by browser storage, available disk space and the connection. Supported browsers write incoming chunks to private disk storage. Without it, each file is limited to 256 MB. Saving a combined ZIP is also limited to 256 MB.",
                        "محدودیت پسوند نداریم. حجم به فضای مرورگر، دیسک و اتصال بستگی دارد. مرورگرهای پشتیبان قطعه‌ها را روی دیسک خصوصی می‌نویسند؛ بدون آن، سقف هر فایل ۲۵۶ مگابایت است. ذخیرهٔ ZIP ترکیبی هم سقف ۲۵۶ مگابایت دارد.",
                      ),
                    ],
                    [
                      t("Can I install it?", "می‌توانم نصبش کنم؟"),
                      t(
                        "On supported browsers, use Install in settings or your browser’s Add to home screen command. File sharing from other apps depends on your operating system and browser. Offline mode opens the interface; live transfers still need a connection.",
                        "در مرورگرهای پشتیبان، از نصب در تنظیمات یا «افزودن به صفحهٔ اصلی» مرورگر استفاده کن. اشتراک فایل از اپ‌های دیگر به سیستم‌عامل و مرورگر بستگی دارد. حالت آفلاین رابط را باز می‌کند؛ انتقال زنده همچنان به اتصال نیاز دارد.",
                      ),
                    ],
                  ].map(([question, answer]) => (
                    <Accordion key={question} question={question}>
                      <p>{answer}</p>
                    </Accordion>
                  ))}
                </div>
                <div className="help-footer">
                  <ShieldCheck size={25} />
                  <p>
                    {t(
                      "A fingerprint on both sides. A little extra certainty.",
                      "اثر انگشت فایل در دو طرف؛ خیال راحت‌تر.",
                    )}
                    <span>
                      {t(
                        "Transfers are complete only after the receiver confirms the SHA-256 match.",
                        "انتقال وقتی کامل می‌شود که گیرنده تطبیق SHA-256 را تأیید کند.",
                      )}
                    </span>
                  </p>
                </div>
              </section>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      <SiteFooter
        fa={fa}
        start={() => {
          startRoom();
          window.scrollTo({ top: 0, behavior: "instant" });
        }}
        home={() => {
          setView("home");
          window.scrollTo({ top: 0, behavior: "instant" });
        }}
        help={() => {
          setView("help");
          window.scrollTo({ top: 0, behavior: "instant" });
        }}
        history={() => {
          setHistory(readHistory());
          setView("history");
          window.scrollTo({ top: 0, behavior: "instant" });
        }}
        session={() => {
          setView("session");
          window.scrollTo({ top: 0, behavior: "instant" });
        }}
        join={() => setPanel("join")}
      />
      <AnimatedDialog
        open={!!panel}
        onClose={() => setPanel(null)}
        className="settings-dialog"
        labelledBy="panel-title"
      >
        <div className="dialog-heading">
          <h2 id="panel-title">
            {panel === "invite"
              ? t("Bring your other device.", "دستگاه دیگرت را دعوت کن.")
              : panel === "join"
                ? t("Meet in the same room.", "در یک اتاق به هم برسید.")
                : t("Make yourself at home.", "به سلیقهٔ خودت تنظیم کن.")}
          </h2>
          <button
            className="icon-button"
            onClick={() => setPanel(null)}
            aria-label={t("Close", "بستن")}
          >
            <X />
          </button>
        </div>
        {panel === "invite" && (
          <div className="invite-content">
            <p>
              {t(
                "Scan this with your other device. Or send the complete link to someone you trust.",
                "با دستگاه دیگرت اسکن کن، یا لینک کامل را برای کسی که می‌شناسی بفرست.",
              )}
            </p>
            {qr && (
              <img
                className="qr-image"
                src={qr}
                alt={t(
                  "QR code containing the room invitation",
                  "QR دعوت اتاق",
                )}
              />
            )}
            <label htmlFor="invite-link">
              {t("Your private invitation", "دعوت خصوصی تو")}
            </label>
            <div className="invite-link-field">
              <input id="invite-link" readOnly value={inviteUrl} dir="ltr" />
              <button
                className="icon-button"
                onClick={() => copy(inviteUrl)}
                aria-label={t("Copy invitation", "کپی دعوت")}
              >
                <Copy size={19} />
              </button>
            </div>
            <div className="invite-buttons">
              <button
                className="button primary"
                onClick={() => copy(inviteUrl)}
              >
                <Copy size={17} />
                {t("Copy invitation", "کپی دعوت")}
              </button>
              {!!navigator.share && (
                <button
                  className="button subtle"
                  onClick={() =>
                    navigator
                      .share({ title: "PIMXNODE", url: inviteUrl })
                      .catch(() => {})
                  }
                >
                  <ExternalLink size={17} />
                  {t("Share", "اشتراک")}
                </button>
              )}
            </div>
            <p className="privacy-note">
              <Lock size={14} />
              {t(
                "This link contains the room key. Share it privately.",
                "این لینک کلید اتاق را دارد؛ خصوصی بفرست.",
              )}
            </p>
            {snapshot.room && (
              <p>
                {t("Room closes at", "پایان زمان اتاق:")}{" "}
                {new Date(snapshot.room.expiresAt).toLocaleTimeString(
                  fa ? "fa-IR" : "en",
                  { hour: "2-digit", minute: "2-digit" },
                )}
              </p>
            )}
          </div>
        )}
        {panel === "join" && (
          <form
            className="join-content"
            onSubmit={(e) => {
              e.preventDefault();
              if (initialRoom && !secret && manualKey) {
                setSecret(manualKey);
                setPanel(null);
                setView("exchange");
              } else join();
            }}
          >
            <p>
              {t(
                "Paste the invitation from your other device. The full link includes everything you need.",
                "دعوت دستگاه دیگر را اینجا وارد کن؛ لینک کامل همهٔ اطلاعات لازم را دارد.",
              )}
            </p>
            <label htmlFor="join-link">
              {t("Invitation link", "لینک دعوت")}
            </label>
            <textarea
              id="join-link"
              dir="ltr"
              value={inviteInput}
              onChange={(e) => setInviteInput(e.target.value)}
              placeholder="https://…/?room=node-…#key=…"
            />
            {roomId && !secret && (
              <>
                <label htmlFor="manual-key">
                  {t("Or enter this room’s key", "یا کلید این اتاق را وارد کن")}
                </label>
                <input
                  id="manual-key"
                  type="password"
                  minLength={8}
                  value={manualKey}
                  onChange={(e) => setManualKey(e.target.value)}
                />
              </>
            )}
            <button
              className="button primary"
              disabled={!inviteInput && manualKey.length < 8}
              type="submit"
            >
              {t("Join the room", "ورود به اتاق")}
              <ArrowUpRight size={18} />
            </button>
          </form>
        )}
        {panel === "settings" && (
          <div className="settings-content">
            <div className="setting-row">
              <div>
                <strong>{t("A lighter scene", "نمای سبک‌تر")}</strong>
                <p>
                  {t(
                    "Use less graphics power on this device.",
                    "مصرف گرافیک این دستگاه کمتر شود.",
                  )}
                </p>
              </div>
              <button
                className={`toggle ${low ? "on" : ""}`}
                role="switch"
                aria-checked={low}
                aria-label={t("Lighter graphics", "گرافیک سبک‌تر")}
                onClick={() => setLow(!low)}
              >
                <span />
              </button>
            </div>
            <div className="setting-row">
              <div>
                <strong>{t("Transfer notifications", "اعلان انتقال")}</strong>
                <p>
                  {t(
                    "Get a heads-up when this tab is in the background.",
                    "وقتی تب در پس‌زمینه است، از انتقال باخبر شو.",
                  )}
                </p>
              </div>
              <button
                className="icon-button"
                aria-label={t("Enable notifications", "فعال کردن اعلان")}
                onClick={async () => {
                  if (!("Notification" in window))
                    return notice(
                      t(
                        "Notifications are not supported here.",
                        "اعلان در این مرورگر پشتیبانی نمی‌شود.",
                      ),
                    );
                  const permission = await Notification.requestPermission();
                  notice(
                    permission === "granted"
                      ? t("Notifications enabled.", "اعلان‌ها فعال شدند.")
                      : t(
                          "Notifications were not enabled. You can change this in browser settings.",
                          "اعلان فعال نشد؛ از تنظیمات مرورگر می‌توانی تغییرش دهی.",
                        ),
                  );
                }}
              >
                <Bell size={21} />
              </button>
            </div>
            <div className="setting-row">
              <div>
                <strong>{t("Install PIMXNODE", "نصب PIMXNODE")}</strong>
                <p>
                  {t(
                    "Keep the exchange one click away.",
                    "انتقال همیشه یک کلیک فاصله داشته باشد.",
                  )}
                </p>
              </div>
              <button
                className="icon-button"
                aria-label={t("Install app", "نصب برنامه")}
                onClick={async () => {
                  if (installPrompt) {
                    await installPrompt.prompt();
                    setInstallPrompt(null);
                  } else
                    notice(
                      t(
                        "Use your browser’s Install app or Add to home screen menu.",
                        "از منوی مرورگر، نصب برنامه یا افزودن به صفحهٔ اصلی را انتخاب کن.",
                      ),
                    );
                }}
              >
                <Download size={21} />
              </button>
            </div>
            {roomId && (
              <>
                <h3>{t("Room controls", "کنترل اتاق")}</h3>
                {owner ? (
                  <form
                    className="room-settings"
                    onSubmit={(e) => {
                      e.preventDefault();
                      engine.current?.settings(locked, capacity, minutes);
                      notice(
                        t("Room settings updated.", "تنظیمات اتاق به‌روز شد."),
                      );
                    }}
                  >
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={locked}
                        onChange={(e) => setLocked(e.target.checked)}
                      />
                      {t(
                        "Lock the room to new devices",
                        "ورود دستگاه جدید را ببند",
                      )}
                    </label>
                    <div className="form-pair">
                      <label>
                        {t("Maximum devices", "حداکثر دستگاه")}
                        <input
                          type="number"
                          min={2}
                          max={16}
                          value={capacity}
                          onChange={(e) => setCapacity(Number(e.target.value))}
                        />
                      </label>
                      <label>
                        {t("Minutes from now", "دقیقه از حالا")}
                        <select
                          value={minutes}
                          onChange={(e) => setMinutes(Number(e.target.value))}
                        >
                          <option value={5}>5</option>
                          <option value={30}>30</option>
                          <option value={60}>60</option>
                          <option value={240}>240</option>
                          <option value={1440}>1440</option>
                        </select>
                      </label>
                    </div>
                    <button className="button primary">
                      {t("Update room", "ثبت تنظیمات")}
                    </button>
                  </form>
                ) : (
                  <p>
                    {t(
                      "The room owner manages invitations, capacity and access.",
                      "صاحب اتاق زمان دعوت، ظرفیت و ورود را مدیریت می‌کند.",
                    )}
                  </p>
                )}
                <button
                  className="text-button leave-room"
                  onClick={() => {
                    if (
                      snapshot.transfers.some(
                        (item) =>
                          !["completed", "cancelled", "failed"].includes(
                            item.status,
                          ),
                      )
                    ) {
                      notice(
                        t(
                          "Finish or cancel your transfers before leaving.",
                          "پیش از خروج، انتقال‌ها را تمام یا لغو کن.",
                        ),
                      );
                      return;
                    }
                    setRoomId("");
                    setSecret("");
                    setSnapshot(empty);
                    setSelected([]);
                    window.history.replaceState({}, "", "/");
                    setPanel(null);
                    setView("home");
                  }}
                >
                  {t("Leave this room", "خروج از اتاق")}
                </button>
              </>
            )}
          </div>
        )}
        {toast && (
          <p className="dialog-notice" role="status">
            {toast}
          </p>
        )}
      </AnimatedDialog>
      {preview && (
        <Preview transfer={preview} fa={fa} close={() => setPreview(null)} />
      )}
      <AnimatePresence>
        {toast && !panel && (
          <motion.div
            className="toast"
            role="status"
            initial={{ opacity: 0, y: reduced ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Check size={18} />
            <span>{toast}</span>
            <button
              className="icon-button tiny"
              onClick={() => setToast("")}
              aria-label={t("Dismiss", "بستن")}
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
