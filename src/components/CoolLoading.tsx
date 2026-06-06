import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Terminal, Cpu, Lock, CheckCircle2, Globe, Sparkles, Sun, Moon, Database } from "lucide-react";

interface CoolLoadingProps {
  key?: string;
  onComplete: () => void;
  lang: "fa" | "en";
  setLang: (l: "fa" | "en") => void;
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
}

export default function CoolLoading({
  onComplete,
  lang,
  setLang,
  theme,
  setTheme,
}: CoolLoadingProps) {
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  // Smooth progress incrementation simulating a real-time cryptographic boot sequence
  useEffect(() => {
    let timer: any;
    const animateLoad = () => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          // Pause briefly at 100% to let the user see the completed checklist, then transition
          setTimeout(() => {
            onComplete();
          }, 600);
          return 100;
        }

        // Variable loading speeds to mimic real dynamic verification hurdles
        let step = 1;
        if (prev < 20) step = Math.floor(Math.random() * 4) + 1;
        else if (prev < 45) step = Math.floor(Math.random() * 3) + 1;
        else if (prev < 70) step = Math.floor(Math.random() * 2) + 1;
        else if (prev < 90) step = Math.floor(Math.random() * 4) + 1;
        else step = Math.floor(Math.random() * 2) + 1;

        const next = Math.min(prev + step, 100);

        // Update active step based on progress thresholds
        if (next >= 95) setActiveStep(4);
        else if (next >= 75) setActiveStep(3);
        else if (next >= 50) setActiveStep(2);
        else if (next >= 25) setActiveStep(1);
        else setActiveStep(0);

        return next;
      });
    };

    timer = setInterval(animateLoad, 40);
    return () => clearInterval(timer);
  }, [onComplete]);

  const steps = [
    {
      en: "Securing localized signallers & peer identifiers...",
      fa: "ایمن‌سازی فرستنده‌های محلی و شناساگرهای همتا...",
      tag: "SIGNALLING",
    },
    {
      en: "Generating 256-bit AES-GCM local cryptographic session keys...",
      fa: "تولید کلیدهای رمزگذاری فوق‌امن جلسه ۲۵۶ بیتی AES-GCM...",
      tag: "CRYPTOGRAPHY",
    },
    {
      en: "Resolving asymmetric NAT & configuring ICE parameters...",
      fa: "مسیریابی شبکه برای انتقال از سدهای NAT و تنظیم پارامترهای ICE...",
      tag: "NETWORK_NAT",
    },
    {
      en: "Allocating virtual high-speed block storage buffers...",
      fa: "تخصیص حافظه سریع و بهینه جهت استریم بلوکی داده‌ها...",
      tag: "VIRTUAL_MEM",
    },
    {
      en: "P2P tunnel interface active. Security checks completed.",
      fa: "پورتال ارتباط مستقیم همتا فعال شد. بررسی‌های امنیتی موفقیت‌آمیز بود.",
      tag: "SECURE_TUNNEL",
    },
  ];

  return (
    <motion.div
      dir={lang === "fa" ? "rtl" : "ltr"}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.45, ease: "easeInOut" } }}
      className={`fixed inset-0 z-50 flex flex-col justify-between overflow-hidden transition-colors duration-300 ${
        theme === "dark" 
          ? "bg-[#070b13] text-[#f1f5f9]" 
          : "bg-[#f8fafc] text-slate-800"
      }`}
    >
      {/* High-tech tech ambient glow and grid backgrounds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {theme === "dark" ? (
          <>
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-teal-500/[0.04] rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-sky-500/[0.04] rounded-full blur-[120px]" />
          </>
        ) : (
          <>
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-teal-400/[0.03] rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-sky-400/[0.03] rounded-full blur-[120px]" />
          </>
        )}
      </div>

      {/* Top Header Controls bar */}
      <header className="relative w-full max-w-7xl mx-auto px-4 py-2 sm:px-6 sm:py-4 flex items-center justify-between border-b shrink-0 transition-colors duration-300 border-transparent">
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs">
          <Terminal className={`h-3.5 w-3.5 ${theme === "dark" ? "text-teal-400 animate-pulse" : "text-teal-600"}`} />
          <span className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>
            SECURE_SHELL //
          </span>
          <span className="font-bold text-teal-600 dark:text-teal-400">
            {progress < 100 ? "INITIALIZING" : "PORTAL_READY"}
          </span>
        </div>

        {/* Global localized toggles synced to App state */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Balanced single toggle Language button just like light/dark mode */}
          <button
            onClick={() => setLang(lang === "fa" ? "en" : "fa")}
            className={`p-1.5 sm:p-2 rounded-xl border text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1 cursor-pointer hover:scale-105 duration-200 ${
              theme === "dark"
                ? "bg-slate-900 border-slate-800 text-teal-400 hover:text-teal-300 hover:bg-slate-800"
                : "bg-white border-slate-200 text-teal-600 hover:text-teal-700 hover:bg-slate-50 shadow-sm"
            }`}
            title="Toggle Language / تغییر زبان"
          >
            <Globe className="h-3.5 w-3.5 shrink-0" />
            <span className="font-sans shrink-0">{lang === "fa" ? "ENGLISH" : "فارسی"}</span>
          </button>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer hover:scale-105 duration-200 ${
              theme === "dark"
                ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-sm"
            }`}
          >
            {theme === "dark" ? (
              <Sun className="h-3.5 w-3.5 text-amber-400 animate-spin-slow" />
            ) : (
              <Moon className="h-3.5 w-3.5 text-slate-600" />
            )}
          </button>
        </div>
      </header>

      {/* Main Holographic / Cyber Scanner Screen */}
      <main className="relative flex-1 flex flex-col justify-center items-center py-2 sm:py-6 px-4 overflow-hidden">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg flex flex-col items-center">
          
          {/* Cyber Holographic Vector Wheel */}
          <div className="relative w-28 h-28 sm:w-40 sm:h-40 mb-3 sm:mb-6 flex justify-center items-center shrink-0">
            {/* Ambient shadow back glow */}
            <div className={`absolute inset-2 sm:inset-4 rounded-full blur-xl sm:blur-2xl transition-colors duration-300 ${
              theme === "dark" ? "bg-teal-500/20" : "bg-teal-400/10"
            }`} />

            {/* Glowing Orbit Rings */}
            {/* Outer Rotating Segment */}
            <svg className="absolute inset-0 w-full h-full animate-radar-sweep pointer-events-none" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke={theme === "dark" ? "rgba(20, 184, 166, 0.4)" : "rgba(13, 148, 136, 0.25)"}
                strokeWidth="1.5"
                strokeDasharray="25 15 5 15"
              />
            </svg>

            {/* Inner Counter-Rotating segment */}
            <svg className="absolute inset-1 w-[calc(100%-8px)] h-[calc(100%-8px)] animate-radar-sweep pointer-events-none" viewBox="0 0 100 100" style={{ animationDirection: "reverse" }}>
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={theme === "dark" ? "rgba(6, 182, 212, 0.5)" : "rgba(6, 182, 212, 0.3)"}
                strokeWidth="1"
                strokeDasharray="10 30 20 10"
              />
            </svg>

            {/* Tiny rotating satellite indicator node dots */}
            <svg className="absolute inset-3 w-[calc(100%-24px)] h-[calc(100%-24px)] animate-radar-sweep" viewBox="0 0 100 100">
              <circle cx="50" cy="10" r="2.5" fill="#14b8a6" />
              <circle cx="10" cy="50" r="1.5" fill="#06b6d4" />
            </svg>

            {/* Central Secure Emblem Wrapper */}
            <div className={`w-18 h-18 sm:w-24 sm:h-24 rounded-full border flex flex-col justify-center items-center relative transition-colors duration-300 ${
              theme === "dark"
                ? "bg-[#0b1324] border-teal-500/35 shadow-[0_0_20px_rgba(20,184,166,0.15)]"
                : "bg-white border-teal-200 shadow-md"
            }`}>
              {/* Dynamic shield status based on boots */}
              {progress < 100 ? (
                <Shield className={`h-8 w-8 sm:h-10 sm:w-10 transition-all ${
                  theme === "dark" ? "text-teal-400 animate-pulse" : "text-teal-600"
                }`} />
              ) : (
                <Lock className={`h-8 w-8 sm:h-10 sm:w-10 transition-all ${
                  theme === "dark" ? "text-emerald-400" : "text-emerald-600"
                }`} />
              )}
              
              <span className={`text-[9px] sm:text-[10px] font-mono mt-0.5 tracking-widest ${
                theme === "dark" ? "text-slate-400" : "text-slate-500"
              }`}>
                {progress}%
              </span>
            </div>
          </div>

          {/* Glowing Progress Percentage info */}
          <div className="text-center space-y-1 w-full shrink-0">
            <h2 className="text-sm sm:text-lg md:text-xl font-display-title font-extrabold tracking-tight">
              {lang === "fa" ? "در حال رمزنگاری و بارگذاری سیستم" : "Initializing Secured Tunnel Gateway"}
            </h2>
            <p className={`text-[10px] sm:text-xs font-mono max-w-sm mx-auto leading-relaxed ${
              theme === "dark" ? "text-slate-400" : "text-slate-650 font-semibold"
            }`}>
              {lang === "fa" 
                ? "سامانه تبادل داده بدون سرور کلاینت به کلاینت" 
                : "SERVERLESS CLIENT-TO-CLIENT END-TO-END CRYPTOGRAPHY"}
            </p>
          </div>

          {/* Premium Tech Progress bar lines */}
          <div className="w-full mt-3 sm:mt-5 space-y-1 shrink-0">
            <div className={`h-2 sm:h-2.5 w-full rounded-full border p-0.5 relative overflow-hidden flex items-center transition-colors duration-300 ${
              theme === "dark" ? "bg-slate-950/80 border-slate-800" : "bg-[#f1f5f9] border-slate-200"
            }`}>
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-500 transition-all duration-150 relative"
                style={{ width: `${progress}%` }}
              >
                {/* Scanner pulse head dot */}
                <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-white blur-[1.5px] rounded-full animate-pulse" />
              </div>
            </div>
            
            <div className="flex justify-between items-center font-mono text-[8px] sm:text-[9px] text-slate-500">
              <span className="flex items-center gap-0.5">
                <Globe className="h-2.5 w-2.5 animate-spin-slow" />
                STUN: STUN.L.GOOGLE.COM:19302
              </span>
              <span>
                {progress === 100 
                  ? (lang === "fa" ? "محیط امن آماده شد" : "SESSION_READY") 
                  : `${progress * 2.5} KB/s`}
              </span>
            </div>
          </div>

          {/* Interactive Scrolling Terminal logs */}
          <div className={`mt-3 sm:mt-5 w-full rounded-xl border p-2.5 sm:p-3.5 font-mono text-[9px] sm:text-[10px] md:text-[11px] leading-relaxed relative ${
            theme === "dark" 
              ? "bg-[#040810]/95 border-slate-850/80 text-teal-400/90 shadow-2xl" 
              : "bg-slate-100 border-slate-300/80 text-teal-800 shadow-sm"
          }`}>
            {/* Background absolute subtle indicator logs */}
            <div className={`absolute top-1 right-2 font-bold text-[7px] tracking-wider ${
              theme === "dark" ? "text-slate-700" : "text-slate-400"
            }`}>
              SECURE_ENGINE_v2.0.4
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              {steps.map((step, idx) => {
                const isConfigured = progress >= (idx + 1) * 20;
                const isActive = activeStep === idx && progress < 100;
                const isPending = progress < (idx + 1) * 20 && activeStep !== idx;

                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-1.5 sm:gap-2.5 transition-all duration-300 ${
                      isPending ? "opacity-25" : "opacity-100"
                    }`}
                  >
                    {isConfigured ? (
                      <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    ) : isActive ? (
                      <div className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex items-center justify-center shrink-0 mt-0.5">
                        <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-teal-500 animate-ping" />
                      </div>
                    ) : (
                      <div className={`h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full border border-dashed shrink-0 mt-0.5 ${
                        theme === "dark" ? "border-slate-800" : "border-slate-450"
                      }`} />
                    )}

                    <div className="flex-1 min-w-0">
                      <span className={`text-[8px] sm:text-[9px] font-bold px-1 py-0.5 rounded mr-1 select-none font-mono tracking-wider ${
                        isConfigured 
                          ? "bg-emerald-500/10 text-emerald-500" 
                          : isActive 
                            ? "bg-teal-500/10 text-teal-400 animate-pulse" 
                            : "bg-slate-550/10 text-slate-500"
                      }`}>
                        {step.tag}
                      </span>
                      <span className={`truncate-2-lines ${(theme === "dark" ? "text-slate-350" : "text-slate-705")}`}>
                        {lang === "fa" ? step.fa : step.en}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </main>

      {/* Footer System Info bar */}
      <footer className="relative w-full max-w-7xl mx-auto px-4 py-2 sm:px-6 sm:py-3 flex flex-col sm:flex-row items-center justify-between gap-1 border-t border-transparent shrink-0">
        <div className="flex items-center gap-1 font-mono text-[8px] sm:text-[9px] text-slate-500">
          <Database className="h-2.5 w-2.5" />
          <span>STATUS: SIGNALLING_CONNECTED</span>
        </div>
        <div className="flex items-center gap-1 font-mono text-[8px] sm:text-[9px] text-slate-500 text-center">
          <span>{lang === "fa" ? "امنیت و انتقال فایل بدون ذخیره در ابر" : "Secure serverless streaming, no cloud logs kept."}</span>
        </div>
      </footer>
    </motion.div>
  );
}
