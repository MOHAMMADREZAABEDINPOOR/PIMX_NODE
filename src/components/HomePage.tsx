import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  ArrowDown,
  Check,
  ShieldCheck,
  Fingerprint,
  FolderOpen,
  Pause,
  Play,
  Smartphone,
  Laptop,
  ArrowRight,
  LockKeyhole,
  Globe,
  Files,
  RefreshCw,
} from "lucide-react";
import Accordion from "./Accordion";
import LiveText from "./LiveText";

type Props = {
  fa: boolean;
  scene: ReactNode;
  start: () => void;
  join: () => void;
  help: () => void;
};
const stepContent = [
  [
    "Make room for a connection.",
    "یک جا برای اتصال بساز.",
    "Open a private room. Give your device a name so the other person knows it’s you. No account to create, no app to download.",
    "یک اتاق خصوصی بساز و برای دستگاهت نام بگذار تا طرف مقابل پیدایت کند. به حساب کاربری یا دانلود برنامه نیاز نداری.",
    "A room is where your devices meet.",
    "اتاق، محل پیدا کردن دستگاه‌هاست.",
  ],
  [
    "One invitation. Two devices.",
    "یک دعوت، دو دستگاه.",
    "Scan the QR with your phone camera, or share the complete invitation link. It includes a private key, so send it only to someone you trust.",
    "با دوربین گوشی QR را اسکن کن یا لینک کامل دعوت را بفرست. لینک، کلید خصوصی اتاق را دارد؛ آن را فقط به کسی بده که می‌شناسی.",
    "The key travels with your invitation.",
    "کلید، همراه دعوت تو می‌رسد.",
  ],
  [
    "You choose. They approve.",
    "تو انتخاب کن؛ گیرنده تأیید کند.",
    "Select one recipient or several, then drop files or a folder. The receiving device sees the name and size before accepting anything.",
    "یک یا چند گیرنده انتخاب کن و فایل یا پوشه را رها کن. دستگاه مقابل پیش از دریافت، نام و حجم فایل را می‌بیند و تأیید می‌کند.",
    "Nothing arrives without an invitation to receive.",
    "دریافت فایل با تأیید گیرنده شروع می‌شود.",
  ],
  [
    "Arrive exactly as you left.",
    "همان فایل، در دستگاه دیگر.",
    "Encrypted chunks move over WebRTC. At the destination, SHA-256 fingerprints are compared before the transfer is marked complete.",
    "قطعه‌های رمزگذاری‌شده از مسیر WebRTC می‌رسند. اثر انگشت SHA-256 در دو طرف مقایسه می‌شود؛ بعد انتقال کامل اعلام می‌شود.",
    "Complete means received and verified.",
    "کامل یعنی دریافت و تأیید سلامت.",
  ],
];

function JourneyDiagram({
  step,
  fa,
  paused,
}: {
  step: number;
  fa: boolean;
  paused: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <svg
      className="journey-svg"
      viewBox="0 0 620 390"
      role="img"
      aria-label={
        fa
          ? "نمودار تصویری اتصال، دعوت، تأیید و دریافت فایل"
          : "Diagram of the room, invitation, approval and verified file delivery"
      }
    >
      <ellipse
        cx="310"
        cy="207"
        rx="248"
        ry="125"
        fill="none"
        stroke="#804683"
        strokeWidth="1.5"
        strokeDasharray="5 10"
      />
      <path
        d="M146 208C234 100 386 100 474 208"
        fill="none"
        stroke="#f55df7"
        strokeWidth="3"
      />
      <path
        d="M146 208C234 309 386 309 474 208"
        fill="none"
        stroke="#804683"
        strokeWidth="2"
      />
      <g className="diagram-device">
        <rect x="61" y="142" width="154" height="109" rx="12" fill="#ebdcec" />
        <rect x="69" y="150" width="138" height="88" rx="7" fill="#361c37" />
        <path d="M48 254H228L214 266H62Z" fill="#c699c8" />
        <rect x="110" y="175" width="55" height="41" rx="5" fill="#f55df7" />
        <path
          d="M121 196h31m-7-7 7 7-7 7"
          stroke="#361c37"
          strokeWidth="3"
          fill="none"
        />
      </g>
      <g className="diagram-device">
        <rect x="430" y="122" width="85" height="160" rx="17" fill="#ebdcec" />
        <rect x="437" y="130" width="71" height="144" rx="12" fill="#361c37" />
        <rect x="459" y="136" width="27" height="5" rx="3" fill="#c699c8" />
        <circle
          cx="472"
          cy="204"
          r="23"
          fill={step === 3 ? "#f55df7" : "#542c56"}
        />
        <path
          d={step >= 2 ? "m460 204 8 8 17-19" : "M461 204h22m-11-11v22"}
          stroke={step === 3 ? "#361c37" : "#f55df7"}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <motion.g
        animate={reduced || paused ? { y: 0 } : { y: [0, -9, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="253" y="140" width="114" height="126" rx="20" fill="#f55df7" />
        {step === 0 ? (
          <g stroke="#361c37" strokeWidth="5" fill="none" strokeLinecap="round">
            <path d="M284 205h52m-26-26v52" />
            <rect
              x="278"
              y="163"
              width="64"
              height="82"
              rx="8"
              strokeWidth="2"
            />
          </g>
        ) : step === 1 ? (
          <g fill="none" stroke="#361c37" strokeWidth="5">
            <path d="M279 183v-11h17m28 0h17v11m0 42v11h-17m-28 0h-17v-11" />
            <path d="m289 205 13 13 29-30" />
          </g>
        ) : step === 2 ? (
          <g stroke="#361c37" strokeWidth="4" fill="none" strokeLinecap="round">
            <rect x="282" y="171" width="56" height="68" rx="6" />
            <path d="M294 188h32m-32 13h20m-18 20 7 7 16-16" />
          </g>
        ) : (
          <g stroke="#361c37" fill="none">
            <path
              d="M310 165 340 177v27c0 20-30 37-30 37s-30-17-30-37v-27Z"
              strokeWidth="3"
            />
            <path
              d="m296 203 10 10 19-23"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </g>
        )}
      </motion.g>
      {!paused && !reduced && (
        <g className="diagram-packet">
          <circle r="7" fill="#f55df7">
            <animateMotion
              dur="4s"
              repeatCount="indefinite"
              path="M146 208C234 100 386 100 474 208"
            />
          </circle>
          <circle r="4" fill="#f1e7f1">
            <animateMotion
              dur="4s"
              begin="-2s"
              repeatCount="indefinite"
              path="M146 208C234 100 386 100 474 208"
            />
          </circle>
        </g>
      )}
      <text
        x="138"
        y="305"
        fill="#ebdcec"
        textAnchor="middle"
        fontSize="15"
        fontFamily="inherit"
      >
        {fa ? "دستگاه تو" : "Your device"}
      </text>
      <text
        x="474"
        y="315"
        fill="#ebdcec"
        textAnchor="middle"
        fontSize="15"
        fontFamily="inherit"
      >
        {fa ? "دستگاه دیگر" : "Their device"}
      </text>
    </svg>
  );
}

export default function HomePage({ fa, scene, start, join, help }: Props) {
  const t = (en: string, persian: string) => (fa ? persian : en);
  const [step, setStep] = useState(0),
    [paused, setPaused] = useState(false),
    [format, setFormat] = useState(0);
  const reduced = useReducedMotion();
  const reveal = {
    initial: { y: reduced ? 0 : 22 },
    whileInView: { y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: {
      duration: reduced ? 0 : 0.7,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  };
  const formats = [
    {
      name: t("The camera roll.", "عکس و فیلم."),
      extensions: ["JPG", "PNG", "HEIC", "RAW", "MP4", "MOV"],
      description: t(
        "Yesterday’s photos. Today’s footage. Send the original files without recompressing them.",
        "عکس‌های دیروز، ویدئوی امروز؛ فایل اصلی را بدون فشرده‌سازی دوباره بفرست.",
      ),
      art: "media",
    },
    {
      name: t("The finished work.", "فایل‌های کار."),
      extensions: ["PSD", "AI", "FIG", "BLEND", "PDF", "ZIP"],
      description: t(
        "The source files belong with the final export. Send the whole project folder, paths included.",
        "فایل‌های منبع را کنار خروجی نهایی بفرست؛ حتی یک پوشهٔ کامل، با حفظ مسیرها.",
      ),
      art: "work",
    },
    {
      name: t("Everything else.", "هر چیز دیگر."),
      extensions: ["WAV", "FLAC", "CSV", "JSON", "7Z", "ANY"],
      description: t(
        "An unusual extension is still a file. We move its bytes; your browser decides what it can preview.",
        "پسوند ناآشنا هم یک فایل است. بایت‌ها منتقل می‌شوند؛ پیش‌نمایش به مرورگر بستگی دارد.",
      ),
      art: "other",
    },
  ];
  return (
    <div className="new-home">
      <section className="launch-hero">
        <div className="launch-copy">
          <motion.h1 {...reveal}>
            <LiveText
              text={t(
                "Files in motion.\nDevices in sync.",
                "فاصله‌ها کمتر.\nفایل‌ها در حرکت.",
              )}
            />
          </motion.h1>
          <motion.p {...reveal}>
            {t(
              "From the device in your hand to the one across the room. Send files, folders and a few words along the way.",
              "از دستگاهی که در دست توست تا دستگاه آن‌طرف اتاق. فایل، پوشه و چند خط یادداشت را به مقصد برسان.",
            )}
          </motion.p>
          <div className="launch-actions">
            <button className="button primary" onClick={start}>
              {t("Make a connection", "یک اتصال بساز")}
              <ArrowUpRight size={20} />
            </button>
            <button className="launch-join" onClick={join}>
              {t("I have an invitation", "لینک دعوت دارم")}
              <ArrowRight size={17} />
            </button>
          </div>
          <div className="launch-promise">
            <ShieldCheck size={17} />
            <span>
              {t(
                "Browser to browser. Encrypted before it leaves.",
                "از مرورگر به مرورگر؛ رمزگذاری پیش از ارسال.",
              )}
            </span>
          </div>
        </div>
        <div className="launch-stage">
          {scene}
          <div className="stage-caption">
            <span>
              {t(
                "A file, from laptop to phone",
                "مسیر یک فایل، از لپ‌تاپ به گوشی",
              )}
            </span>
            <span>
              {t("Drag to turn", "بکش و بچرخان")}
              <Globe size={15} />
            </span>
          </div>
        </div>
        <a
          className="hero-scroll"
          href="#the-journey"
          onClick={(event) => {
            event.preventDefault();
            document
              .getElementById("the-journey")
              ?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
          }}
        >
          <ArrowDown size={18} />
          <span>
            {t("Follow a file’s journey", "مسیر یک فایل را دنبال کن")}
          </span>
        </a>
      </section>
      <div className="promise-strip">
        <p>
          {t(
            "A little less friction. A lot closer.",
            "راه کوتاه‌تر، کار راحت‌تر.",
          )}
        </p>
        <div>
          <span>
            <Globe size={17} />
            {t("No account", "بدون حساب کاربری")}
          </span>
          <span>
            <FolderOpen size={17} />
            {t("Any file extension", "با هر پسوند")}
          </span>
          <span>
            <Fingerprint size={17} />
            {t("Verified delivery", "دریافت تأییدشده")}
          </span>
        </div>
      </div>

      <section className="journey-section home-section" id="the-journey">
        <motion.div className="section-intro" {...reveal}>
          <h2>
            {t("Here’s how\nit gets there.", "از اینجا\nتا دستگاه دیگر.")}
          </h2>
          <p>
            {t(
              "Four small moments between “it’s on my laptop” and “got it.” Explore the route before you send your first file.",
              "چهار قدم بین «روی لپ‌تاپمه» و «رسید». پیش از اولین ارسال، مسیر را ببین.",
            )}
          </p>
        </motion.div>
        <div className="journey-layout">
          <div
            className="journey-controls"
            role="tablist"
            aria-label={t("Transfer process", "فرایند انتقال")}
            aria-orientation="vertical"
          >
            {[
              t("Create a room", "ساختن اتاق"),
              t("Invite a device", "دعوت دستگاه"),
              t("Choose & approve", "انتخاب و تأیید"),
              t("Send & verify", "ارسال و بررسی"),
            ].map((label, i) => (
              <button
                key={label}
                role="tab"
                id={`journey-tab-${i}`}
                aria-controls={`journey-panel-${i}`}
                aria-selected={step === i}
                tabIndex={step === i ? 0 : -1}
                className={step === i ? "current" : ""}
                onClick={() => setStep(i)}
                onKeyDown={(event) => {
                  const next =
                    event.key === "ArrowDown"
                      ? (i + 1) % 4
                      : event.key === "ArrowUp"
                        ? (i + 3) % 4
                        : event.key === "Home"
                          ? 0
                          : event.key === "End"
                            ? 3
                            : null;
                  if (next !== null) {
                    event.preventDefault();
                    setStep(next);
                    document.getElementById(`journey-tab-${next}`)?.focus();
                  }
                }}
              >
                <span className="journey-step-dot">
                  {step > i ? <Check size={15} /> : <span />}
                </span>
                <span>{label}</span>
                <ArrowUpRight size={19} />
              </button>
            ))}
            <p>
              {t(
                "A visual walkthrough. Your real transfers happen in the exchange.",
                "این یک راهنمای تصویری است؛ انتقال واقعی در بخش انتقال فایل انجام می‌شود.",
              )}
            </p>
          </div>
          <div className="journey-visual">
            <JourneyDiagram step={step} fa={fa} paused={paused} />
            <div className="diagram-caption">
              <span>{stepContent[step][fa ? 5 : 4]}</span>
              <button
                className="icon-button"
                onClick={() => setPaused(!paused)}
                aria-label={
                  paused
                    ? t("Play guide animation", "پخش انیمیشن راهنما")
                    : t("Pause guide animation", "توقف انیمیشن راهنما")
                }
                aria-pressed={paused}
              >
                {paused ? <Play size={17} /> : <Pause size={17} />}
              </button>
            </div>
          </div>
          <div
            className="journey-description"
            role="tabpanel"
            id={`journey-panel-${step}`}
            aria-labelledby={`journey-tab-${step}`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                initial={{ opacity: 0.2, y: reduced ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : -6 }}
                transition={{ duration: reduced ? 0 : 0.2 }}
              >
                <h3>{stepContent[step][fa ? 1 : 0]}</h3>
                <p>{stepContent[step][fa ? 3 : 2]}</p>
              </motion.div>
            </AnimatePresence>
            <button
              className="text-button"
              onClick={() => (step < 3 ? setStep(step + 1) : start())}
            >
              {step < 3
                ? t("Then what happens?", "بعد چه می‌شود؟")
                : t("Let’s try it for real", "حالا واقعاً امتحان کن")}
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>

      <section className="format-section home-section">
        <div className="format-copy">
          <motion.h2 {...reveal}>
            {t("If it’s a file,\nit has a way.", "برای هر فایل،\nیک مسیر هست.")}
          </motion.h2>
          <p>
            {t(
              "The beautiful, the practical, the oddly named. There’s room for all of it.",
              "از عکس‌های دوست‌داشتنی تا پوشهٔ کار و فایل‌های بی‌نام‌ونشان؛ جا برای همه هست.",
            )}
          </p>
          <div className="format-options">
            {formats.map((item, i) => (
              <button
                key={item.art}
                className={format === i ? "chosen" : ""}
                aria-pressed={format === i}
                onClick={() => setFormat(i)}
              >
                <span>{item.name}</span>
                <ArrowUpRight size={18} />
              </button>
            ))}
          </div>
          <p className="format-description">{formats[format].description}</p>
          <small>
            {t(
              "Transfer any extension. Preview support and size depend on the browser and available storage.",
              "انتقال با هر پسوند؛ پیش‌نمایش و حجم به مرورگر و فضای موجود بستگی دارد.",
            )}
          </small>
        </div>
        <div
          className={`file-universe universe-${formats[format].art}`}
          aria-label={t(
            "Original file format illustrations",
            "تصویر فایل‌ها با فرمت‌های مختلف",
          )}
        >
          <div className="universe-orbit" />
          <div className="universe-core">
            <Files size={62} strokeWidth={1.15} />
            <span>{t("The original. Always.", "همیشه، فایل اصلی.")}</span>
          </div>
          {formats[format].extensions.map((ext, i) => (
            <div className={`format-object object-${i}`} key={ext}>
              <svg viewBox="0 0 76 92" aria-hidden="true">
                <path
                  d="M9 2H48L68 22V81Q68 90 59 90H9Q2 90 2 81V11Q2 2 9 2Z"
                  fill="currentColor"
                />
                <path
                  d="M48 2v15q0 5 5 5h15"
                  fill="none"
                  stroke="#61275b"
                  strokeWidth="2"
                />
                <path
                  d="M15 65h35m-35 9h23"
                  stroke="#61275b"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <span>{ext}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="control-section home-section">
        <div className="control-art">
          <img
            src="/illustrations/transfer-controls.svg"
            alt={t(
              "A file queue with pause, resume, folder and multiple recipient controls",
              "صف فایل‌ها با کنترل توقف، ادامه، پوشه و چند گیرنده",
            )}
          />
          <div className="control-floating">
            <RefreshCw size={19} />
            <span>
              {t(
                "A pause is part of the journey.",
                "توقف هم بخشی از مسیر است.",
              )}
            </span>
          </div>
        </div>
        <div className="control-copy">
          <motion.h2 {...reveal}>
            {t("You’re in\nthe driver’s seat.", "فرمان انتقال\nدست توست.")}
          </motion.h2>
          <p>
            {t(
              "Some files go now. Some can wait. Keep the queue in your own order, and send to the people you actually chose.",
              "بعضی فایل‌ها باید زودتر برسند. ترتیب صف را خودت مشخص کن و فقط به دستگاه‌هایی بفرست که انتخاب کرده‌ای.",
            )}
          </p>
          <ul>
            <li>
              <Pause size={18} />
              <span>
                {t(
                  "Pause, resume or cancel a transfer.",
                  "انتقال را متوقف، ادامه یا لغو کن.",
                )}
              </span>
            </li>
            <li>
              <Files size={18} />
              <span>
                {t(
                  "Send a folder with its structure intact.",
                  "پوشه را با حفظ ساختار بفرست.",
                )}
              </span>
            </li>
            <li>
              <Smartphone size={18} />
              <span>
                {t(
                  "Choose several recipients at once.",
                  "هم‌زمان چند گیرنده انتخاب کن.",
                )}
              </span>
            </li>
            <li>
              <RefreshCw size={18} />
              <span>
                {t(
                  "Reconnect and continue while both tabs stay open.",
                  "با بازماندن تب‌ها، پس از قطعی دوباره ادامه بده.",
                )}
              </span>
            </li>
          </ul>
          <button className="text-button" onClick={start}>
            {t("Open the exchange", "رفتن به انتقال فایل")}
            <ArrowUpRight size={18} />
          </button>
        </div>
      </section>

      <section className="privacy-section home-section" id="privacy">
        <div className="privacy-copy">
          <ShieldCheck size={36} strokeWidth={1.4} />
          <motion.h2 {...reveal}>
            {t(
              "Encrypted here.\nVerified there.",
              "پیش از ارسال،\nرمزگذاری می‌شود.",
            )}
          </motion.h2>
          <p>
            {t(
              "Our signaling service introduces your devices. Your invitation key stays in the link fragment, and file contents are encrypted in your browser before transfer.",
              "سرویس اتصال، دستگاه‌ها را به هم معرفی می‌کند. کلید دعوت در انتهای لینک می‌ماند و محتوای فایل، پیش از ارسال در مرورگرت رمزگذاری می‌شود.",
            )}
          </p>
          <p>
            {t(
              "The receiving browser stages the file locally, compares its fingerprint, and lets you save the original. Our signaling server does not store its contents.",
              "مرورگر گیرنده فایل را موقتاً در فضای محلی نگه می‌دارد، اثر انگشتش را بررسی می‌کند و فایل اصلی را برای ذخیره در اختیارت می‌گذارد. سرور اتصال، محتوای آن را ذخیره نمی‌کند.",
            )}
          </p>
          <button className="text-button" onClick={help}>
            {t("Understand the connection", "بیشتر دربارهٔ اتصال بدان")}
            <ArrowUpRight size={18} />
          </button>
        </div>
        <div className="privacy-art">
          <img
            src="/illustrations/encrypted-route.svg"
            alt={t(
              "Encryption on the sender, encrypted transit, and verification on the receiver",
              "رمزگذاری در فرستنده، انتقال رمزگذاری‌شده و بررسی در گیرنده",
            )}
          />
          <div className="privacy-footnotes">
            <span>
              <LockKeyhole size={16} />
              AES-GCM
            </span>
            <span>
              <Fingerprint size={16} />
              SHA-256
            </span>
          </div>
        </div>
      </section>

      <section className="everywhere-section home-section">
        <div>
          <motion.h2 {...reveal}>
            {t("A browser.\nYou’re all set.", "یک مرورگر.\nهمین کافی است.")}
          </motion.h2>
          <p>
            {t(
              "Laptop to phone. Phone to a friend. A room full of devices. Use the browser you already have, or install PIMXNODE where supported.",
              "لپ‌تاپ به گوشی، گوشی به دستگاه یک دوست، یا یک اتاق پر از دستگاه. با مرورگرت شروع کن؛ در مرورگرهای پشتیبان، برنامه را هم نصب کن.",
            )}
          </p>
          <div className="platform-list">
            <span>
              <Laptop size={20} />
              {t("Desktop", "کامپیوتر")}
            </span>
            <span>
              <Smartphone size={20} />
              {t("Mobile", "موبایل")}
            </span>
            <span>
              <Globe size={20} />
              {t("In your browser", "در مرورگر")}
            </span>
          </div>
        </div>
        <img
          src="/illustrations/devices.svg"
          alt={t(
            "A laptop, tablet and phone joined by a shared connection",
            "اتصال لپ‌تاپ، تبلت و گوشی از یک اتاق مشترک",
          )}
        />
      </section>

      <section className="home-questions home-section">
        <div>
          <h2>{t("Before you\npass it on.", "پیش از\nاولین ارسال.")}</h2>
          <p>
            {t("A few things worth knowing.", "چند نکته که خوب است بدانی.")}
          </p>
          <button className="text-button" onClick={help}>
            {t("Read the full guide", "خواندن راهنمای کامل")}
            <ArrowUpRight size={18} />
          </button>
        </div>
        <div>
          <Accordion
            question={t(
              "Can I really send any file type?",
              "واقعاً می‌توانم هر نوع فایل بفرستم؟",
            )}
          >
            <p>
              {t(
                "Yes. Original bytes are transferred independently of the extension. Previewing a format is a separate browser capability; unsupported formats still download normally.",
                "بله. بایت‌های اصلی مستقل از پسوند منتقل می‌شوند. نمایش یک فرمت به مرورگر بستگی دارد؛ فرمت‌های بدون پیش‌نمایش هم به شکل معمول دانلود می‌شوند.",
              )}
            </p>
          </Accordion>
          <Accordion
            question={t(
              "What if the connection goes away?",
              "اگر اتصال قطع شود چه می‌شود؟",
            )}
          >
            <p>
              {t(
                "Keep both tabs open. Approved transfers reconnect and continue from the received position. Closing or refreshing a tab ends that session.",
                "هر دو تب را باز نگه دار. انتقال تأییدشده بعد از اتصال دوباره از قسمت دریافت‌شده ادامه پیدا می‌کند. بستن یا بارگذاری مجدد تب، نشست را تمام می‌کند.",
              )}
            </p>
          </Accordion>
          <Accordion
            question={t(
              "Does it work across different networks?",
              "روی شبکه‌های متفاوت هم کار می‌کند؟",
            )}
          >
            <p>
              {t(
                "WebRTC can connect devices on different networks. Some firewalls require a configured TURN relay; the connection report tells you whether that fallback is available.",
                "WebRTC می‌تواند دستگاه‌های شبکه‌های مختلف را به هم وصل کند. بعضی فایروال‌ها به سرویس TURN تنظیم‌شده نیاز دارند؛ گزارش اتصال، وضعیت این مسیر جایگزین را نشان می‌دهد.",
              )}
            </p>
          </Accordion>
        </div>
      </section>
    </div>
  );
}
