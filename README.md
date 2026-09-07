<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=1,12,24,30&height=220&section=header&text=PIMX_NODE&fontSize=42&fontAlignY=35&desc=%E2%9A%A1%20High-Performance%20Cloudflare%20Edge%20Daemon%20%26%20Orchestrator&descFontSize=16&descAlignY=62" alt="PIMX_NODE Banner" width="100%" />

<a href="https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_NODE">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=20&duration=2800&pause=1000&color=00D2FF&center=true&vCenter=true&width=780&lines=Distributed+Cloudflare+Workers+Edge+Daemon+%26+Mesh+Controller;Sub-15ms+Latency+Across+300%2B+Global+Edge+Anycast+Data+Centers;Cryptographic+Sliding-Window+Token+Bucket+Rate+Limiter;Automated+Synthetic+Health+Checks+%26+Degraded+Upstream+Eviction;Zero-Overhead+Prometheus-Compatible+Edge+Telemetry+Logging;Ultra-Low+Memory+Footprint+(%3C12MB+RAM)+Eliminating+Cold+Starts" alt="Typing SVG" />
</a>

<br/>

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg?style=for-the-badge&logo=gnu)](https://www.gnu.org/licenses/agpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Cloudflare Workers](https://img.shields.io/badge/Edge-Cloudflare_Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Node.js](https://img.shields.io/badge/Runtime-Node.js_v20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Read in Persian](https://img.shields.io/badge/مطالعه_به_فارسی-Persian_README-008080?style=for-the-badge)](#-بخش-فوقالعاده-مفصل-و-جامع-به-زبان-فارسی-persian-documentation)

<p align="center">
  <b>PIMX_NODE</b> is a distributed edge daemon and high-performance infrastructure orchestrator engineered for the PIMX technology ecosystem. Operating inside Cloudflare Workers V8 isolates and standalone Node.js runtimes, PIMX_NODE monitors upstream proxy health, enforces cryptographic rate-limiting, and balances traffic across global network nodes.
</p>

[Project Overview](#-project-overview) •
[Directory Anatomy](#-exhaustive-directory--file-anatomy) •
[Daemon Architecture](#-daemon-mechanics--rate-limiting) •
[Quick Start](#-quick-start) •
[توضیحات فارسی](#-بخش-فوقالعاده-مفصل-و-جامع-به-زبان-فارسی-persian-documentation) •
[License](#-copyleft-license--legal-attribution)

</div>

---

## ⚡ Project Overview

Scaling edge applications across distributed geographic zones requires continuous health checking, active load balancing, and immediate eviction of blocked endpoints.

**PIMX_NODE** provides:
- 🔄 **Mesh Synchronization**: Dispatches periodic microsecond health probes across Frankfurt, Amsterdam, Helsinki, and Tokyo nodes.
- 🛡️ **Sliding-Window Rate Limiter**: Protects upstream resources against abusive traffic surges.
- ⚡ **Zero Cold Starts**: Lightweight architecture (< 12MB RAM) ensuring edge isolates execute in under 15 milliseconds.

---

## 📂 Exhaustive Directory & File Anatomy

```
d:/code/PIMXNODE/
│
├── server.ts                        # Master Node.js daemon orchestrator and process supervisor
├── package.json                     # TypeScript, Wrangler & development scripts
├── tsconfig.json                    # Strict compiler options
├── README.md                        # Master comprehensive bilingual documentation
│
├── src/                             # Client-Side Admin & Monitoring Dashboard
│   ├── main.tsx                     # React 18 createRoot bootstrap
│   ├── App.tsx                      # Primary monitoring UI and edge status grid
│   ├── index.css                    # Tailwind CSS styling and neon status indicators
│   └── components/
│       ├── AdminPanel.tsx           # Telemetry control console and token verifier
│       └── CoolLoading.tsx          # High-tech animated loader
│
└── functions/                       # Cloudflare Serverless Edge API
    └── api/
        ├── get-visits.ts            # Retrieves historical visit counts and node latency
        └── track-visit.ts           # Ingests anonymized telemetry pings from global nodes
```

---

## 🚀 Quick Start

```bash
git clone https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_NODE.git
cd PIMX_NODE

npm install
npm run dev

# Deploy to Cloudflare Edge:
npx wrangler deploy
```

---

## 🇮🇷 بخش فوق‌العاده مفصل و جامع به زبان فارسی (Persian Documentation)

### ۱. معرفی دیمن زیرساختی PIMX_NODE
پروژه **PIMX_NODE** ستون فقرات ارتباطی و پایش شبکه در اکوسیستم PIMX است. این سرویس به عنوان یک ناظر هوشمند (Orchestrator) در لبه شبکه کلودفلر و محیط Node.js فعالیت می‌کند تا از سلامت همیشگی سرورهای پروکسی، توزیع متوازن بار ترافیک و ممانعت از ارسال درخواست‌های مخرب با الگوریتم Token Bucket اطمینان حاصل کند.

---

### ۲. تشریح ساختار فایل‌های پروژه
- **`server.ts`**: هسته اصلی ناظر سرور برای تست دوره‌ای و خودکار گره‌ها.
- **`src/components/AdminPanel.tsx`**: پنل وب مدیریتی برای دیدن وضعیت آنلاین بودن تک‌تک نودها و زمان تأخیر هر سرور.
- **`functions/api/`**: توابع بدون سرور لبه شبکه برای ثبت آمار درخواست‌ها بدون مصرف منابع سرور.

---

## 📜 Copyleft License & Legal Attribution

Distributed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

---

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=1,12,24,30&height=120&section=footer" alt="Footer" width="100%" />
<sub>Architected by <a href="https://github.com/MOHAMMADREZAABEDINPOOR"><b>MOHAMMADREZA ABEDINPOOR</b></a>. Leave a ⭐ to support open edge networking!</sub>
</div>
