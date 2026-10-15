import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Monitor, Smartphone, Radio, Pause, Play } from "lucide-react";

type Device = {
  id: string;
  name: string;
  selected: boolean;
  deviceType: string;
  state?: string;
};
export default function DeviceRadar({
  devices,
  active,
  online,
  fa,
  onSelect,
}: {
  devices: Device[];
  active: boolean;
  online: boolean;
  fa: boolean;
  onSelect: (id: string) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    let inViewport = true;
    const visibility = () => setVisible(inViewport && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      visibility();
    });
    if (host.current) observer.observe(host.current);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  const t = (en: string, persian: string) => (fa ? persian : en);
  return (
    <div
      ref={host}
      className={`device-radar ${devices.length ? "has-devices" : "is-searching"} ${active ? "is-transferring" : ""}`}
      data-paused={paused || !visible || !online}
    >
      <div className="radar-field">
        <svg className="radar-dial" viewBox="0 0 280 280" aria-hidden="true">
          <circle cx="140" cy="140" r="118" />
          <circle cx="140" cy="140" r="83" />
          <circle cx="140" cy="140" r="47" />
          <path
            className="radar-ticks"
            d="M140 15v10m0 230v10M15 140h10m230 0h10M52 52l7 7m162 162 7 7M52 228l7-7M221 59l7-7"
          />
          <g className="radar-sweep">
            <path
              className="radar-sector"
              d="M140 140L140 22A118 118 0 0 1 242 81Z"
            />
            <path className="radar-ray" d="M140 140V22" />
          </g>
        </svg>
        <span className="radar-pulse" aria-hidden="true" />
        <span className="radar-pulse second" aria-hidden="true" />
        <div className="radar-self" title={t("This device", "این دستگاه")}>
          <img src="/logo-mark.svg" alt="" />
        </div>
        {devices.map((device, index) => {
          const angle =
            -Math.PI / 2 +
            index * ((Math.PI * 2) / Math.max(devices.length, 3));
          return (
            <button
              key={device.id}
              className="radar-device"
              style={
                {
                  "--x": `${50 + Math.cos(angle) * 35}%`,
                  "--y": `${50 + Math.sin(angle) * 35}%`,
                } as CSSProperties
              }
              disabled={device.state !== "ready"}
              aria-label={t(`Select ${device.name}`, `انتخاب ${device.name}`)}
              aria-pressed={device.selected}
              title={device.name}
              onClick={() => onSelect(device.id)}
            >
              {device.deviceType === "mobile" ? (
                <Smartphone size={19} />
              ) : (
                <Monitor size={19} />
              )}
            </button>
          );
        })}
      </div>
      <div className="radar-readout">
        <Radio size={14} />
        <span role="status">
          {!online
            ? t("Waiting for the room…", "در انتظار اتصال اتاق…")
            : active
              ? t("Moving your files", "فایل‌ها در حرکت‌اند")
              : devices.length
                ? t(
                    `${devices.length} device${devices.length > 1 ? "s" : ""} discovered`,
                    `${devices.length} دستگاه پیدا شد`,
                  )
                : t("Looking for your device…", "در جست‌وجوی دستگاه تو…")}
        </span>
        <button
          className="radar-toggle"
          onClick={() => setPaused(!paused)}
          aria-label={
            paused
              ? t("Resume radar animation", "ادامهٔ انیمیشن رادار")
              : t("Pause radar animation", "توقف انیمیشن رادار")
          }
        >
          {paused ? <Play size={13} /> : <Pause size={13} />}
        </button>
      </div>
    </div>
  );
}
