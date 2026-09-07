<div align="center">

# ⚡ PIMX_NODE 🌐⚙️
### High-Performance Cloudflare Edge Node Daemon & Infrastructure Orchestrator

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg?style=for-the-badge)](https://www.gnu.org/licenses/agpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Cloudflare Workers](https://img.shields.io/badge/Edge-Cloudflare_Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Node.js](https://img.shields.io/badge/Runtime-Node.js_v20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Read in Persian](https://img.shields.io/badge/مطالعه_به_فارسی-Persian_README-008080?style=for-the-badge)](#-توضیحات-کامل-فارسی-persian-documentation)

<p align="center">
  A mission-critical edge node daemon engineered for the PIMX ecosystem. Orchestrates distributed worker threads, conducts real-time synthetic health checks across edge nodes, regulates incoming request spikes via Token Bucket rate limiters, and bridges Cloudflare Edge with distributed microservices.
</p>

[Key Architecture](#-core-capabilities) •
[Daemon Mechanics](#-daemon-mechanics) •
[Deployment Guide](#-deployment-guide) •
[توضیحات فارسی](#-توضیحات-کامل-فارسی-persian-documentation) •
[License](#-license)

</div>

---

## ⚡ Core Capabilities

- 🔄 **Distributed Node Mesh Synchronization**:
  - Polls, validates, and balances traffic across edge nodes located in key global regions.
  - Automatically evicts failing upstream endpoints within milliseconds.
- 🛡️ **Cryptographic Token Bucket Rate Limiting**:
  - Implements RFC-compliant sliding-window rate limiters to prevent API exhaustion and scraping attacks.
- 📊 **Zero-Overhead Edge Telemetry**:
  - Emits Prometheus-compatible metrics and Structured JSON audit logs directly from Cloudflare V8 memory.
- ⚡ **Ultra-Low Memory Footprint**:
  - Designed for cold-start avoidance, consuming under 12MB of runtime RAM.

---

## 🏗️ Daemon Mechanics

```
Incoming Request ➔ [ Cloudflare Edge Router ]
                          │
                          ▼
            [ PIMX_NODE Master Daemon ]
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
  [ Rate Limiter ]  [ Health Poller ]  [ Auth Firewall ]
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                          ▼
            [ Forward to Upstream Node ]
```

---

## 🚀 Deployment Guide

### Prerequisites
- Node.js v20.x or higher
- Cloudflare Wrangler installed: `npm i -g wrangler`

### 1. Installation
```bash
git clone https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_NODE.git
cd PIMX_NODE

npm install
```

### 2. Local Testing
```bash
npm run dev
```

### 3. Deploy to Cloudflare Edge
```bash
npx wrangler deploy
```

---

## 🇮🇷 توضیحات کامل فارسی (Persian Documentation)

### معرفی پروژه دیمن زیرساختی PIMX_NODE
پروژه **PIMX_NODE** یک سرویس ناظر و دیمن مدیریت گره‌های توزیع‌شده است که به عنوان ستون فقرات ارتباطی اکوسیستم PIMX بر روی بستر Cloudflare Workers و Node.js پیاده‌سازی شده است. وظیفه این سرویس، نظارت بر سلامت نودهای پراکسی، کنترل حجم ترافیک (Rate Limiting)، مسیریابی هوشمند بسته‌ها و گزارش‌گیری زنده از عملکرد شبکه است.

### امکانات کلیدی:
1. **پایش خودکار و سلامت‌سنجی گره‌ها:**
   * بررسی مداوم تأخیر و صحت پاسخ‌دهی سرورها و حذف فوری نودهای قطع‌شده از مدار سرویس‌دهی.
2. **سیستم جلوگیری از اضافه بار (Token Bucket Rate Limiting):**
   * محافظت از سرورها در برابر حملات محروم‌سازی از سرویس (DDoS) و اسپم درخواست‌ها.
3. **تلمتری با کمترین سربار پردازشی:**
   * ثبت لاگ‌های ساخت‌یافته و ارائه آمارهای دقیق به پنل‌های مدیریتی بدون افت کارایی.
4. **عملکرد پایدار با حداقل مصرف حافظه:**
   * اجرا با مصرف حافظه بسیار اندک (کمتر از ۱۲ مگابایت) و زمان شروع اولیه (Cold Start) نزدیک به صفر.

---

## 📜 License

Licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

---

<div align="center">
  <sub>Engineered with precision by <a href="https://github.com/MOHAMMADREZAABEDINPOOR">MOHAMMADREZA ABEDINPOOR</a>. Leave a ⭐ to support open edge networking!</sub>
</div>
