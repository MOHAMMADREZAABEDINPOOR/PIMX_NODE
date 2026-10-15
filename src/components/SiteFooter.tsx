import { ArrowUpRight, Github, Globe, ShieldCheck } from "lucide-react";
export default function SiteFooter({
  fa,
  start,
  home,
  help,
  history,
  session,
  join,
}: {
  fa: boolean;
  start: () => void;
  home: () => void;
  help: () => void;
  history: () => void;
  session: () => void;
  join: () => void;
}) {
  const t = (en: string, persian: string) => (fa ? persian : en);
  return (
    <footer className="new-footer">
      <div className="footer-invitation">
        <div>
          <h2>
            {t(
              "There’s a connection\nwaiting to happen.",
              "یک اتصال تازه\nدر انتظار توست.",
            )}
          </h2>
          <p>
            {t(
              "Pick a device. Give your files somewhere to go.",
              "یک دستگاه انتخاب کن. فایل‌هایت را به مقصد برسان.",
            )}
          </p>
        </div>
        <button className="footer-launch" onClick={start}>
          <span>{t("Let’s move something", "یک فایل بفرستیم")}</span>
          <ArrowUpRight size={28} />
        </button>
      </div>
      <div className="footer-middle">
        <div className="footer-note">
          <img
            className="footer-logo on-dark"
            src="/logo-mark-light.svg"
            alt=""
          />
          <img className="footer-logo on-light" src="/logo-mark.svg" alt="" />
          <p>
            {t(
              "A private little exchange for the files, folders and words that make up your day.",
              "یک جای خصوصی برای جابه‌جایی فایل‌ها، پوشه‌ها و چند خط از روز تو.",
            )}
          </p>
          <span>
            <ShieldCheck size={15} />
            {t("Encrypted in the browser", "رمزگذاری در مرورگر")}
          </span>
        </div>
        <nav aria-label={t("Product links", "پیوندهای محصول")}>
          <h3>{t("Find your way", "مسیر تو")}</h3>
          <button onClick={home}>
            {t("Back to the beginning", "بازگشت به خانه")}
          </button>
          <button onClick={join}>
            {t("Use an invitation", "ورود با دعوت")}
          </button>
          <button onClick={history}>
            {t("Your transfer record", "سابقهٔ فایل‌های تو")}
          </button>
        </nav>
        <nav aria-label={t("Resources", "راهنما و منابع")}>
          <h3>{t("A little more", "بیشتر بدان")}</h3>
          <button onClick={help}>
            {t("Connection guide", "راهنمای اتصال")}
          </button>
          <button onClick={session}>
            {t("Session details", "جزئیات نشست")}
          </button>
          <a
            href="https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_NODE"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
            <Github size={14} />
          </a>
        </nav>
      </div>
      <div className="footer-wordmark" aria-label="PIMXNODE">
        PIMXNODE
        <span className="brand-signal" aria-hidden="true" />
      </div>
      <div className="footer-bottom">
        <span>© 2026 PIMXNODE</span>
        <p>{t("Files have places to be.", "فایل‌ها باید به مقصد برسند.")}</p>
        <span>
          <Globe size={14} />
          {t("Made for your browser.", "برای مرورگر تو.")}
        </span>
      </div>
    </footer>
  );
}
