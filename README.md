# PIMXNODE 🔐✨

[![Persian Description](https://img.shields.io/badge/Read-Persian%20Description-0A66C2?style=for-the-badge)](#persian-description)
[![Website](https://img.shields.io/badge/Live-pimxnode.pages.dev-0ea5e9?style=for-the-badge)](https://pimxnode.pages.dev/)

**Secure, serverless WebRTC peer-to-peer file sharing with end-to-end encryption and room matching.**

PIMXNODE is a modern P2P file transfer platform that enables secure, direct communication between devices using WebRTC. Transfer files with AES-GCM encryption, zero central servers, and instant room-based device discovery.

## 🌐 Live Website
Production URL: **https://pimxnode.pages.dev/**

## 🎯 What This Project Does

- **Direct WebRTC Tunneling**: Peer-to-peer connections bypass all central servers and databases
- **End-to-End Encryption**: AES-GCM cipher for secure 16KB chunk streaming
- **Room-Based Matching**: Join 9-character alphanumeric rooms to discover and connect with other devices
- **Zero Storage**: 100% serverless architecture with no server-side file storage
- **Device Discovery**: Real-time radar showing all connected devices in your room
- **Multi-Device Support**: Desktop, mobile, tablet—any WebRTC-capable browser

## ✨ Core Features

- 🔐 **AES-GCM End-to-End Encryption** — All data encrypted before leaving your device
- 🌐 **Bilingual Interface (FA/EN)** — Full Persian and English support
- 🎨 **Dark/Light Theme** — Dynamic UI theme switching
- 📡 **Real-Time Device Radar** — Visual indicator of connected peers in your room
- 🔄 **Drag & Drop Upload** — Intuitive file transfer interface
- 🛡️ **Room PIN Security** — Custom 9-character security keys for authentication
- 📊 **Transfer Queue Display** — Monitor active streams and completed transfers
- ⚡ **Direct P2P Tunnels** — STUN-based NAT traversal for truly direct connections
- 💨 **Streaming Chunks** — Progressive transfer with real-time encryption/decryption
- 🚀 **Serverless Deployment** — Cloudflare Pages + Workers compatible

## 🔒 How It Works

### 1. **Handshake Matchmaking**
Enter a 9-character room code to create or join a room. A transient signaling channel pairs your peer ID with others in the same room.

### 2. **Direct SDP Handshake**
WebRTC uses STUN protocols to resolve NAT addresses and establish direct peer-to-peer connections, completely bypassing central servers.

### 3. **AES-GCM Encryption**
Files are sliced into encrypted 16KB ArrayBuffers and streamed chunk-by-chunk directly. Each chunk is independently encrypted with your 9-character PIN as the secret key.

### 4. **Live Transfer Queue**
Watch real-time progress as files are encrypted, transmitted, and decrypted on the receiving device. All data stays between peers—nothing touches a server.

## 🖥️ Admin Access
Route: `/admin`

Basic credential system for monitoring active rooms and peer connections.

## 🛠️ Tech Stack

- **React 19** — UI framework
- **TypeScript** — Type-safe development
- **Vite** — Lightning-fast build tool
- **Tailwind CSS** — Utility-first styling
- **Motion** — Smooth animations
- **WebRTC** — Peer-to-peer communication
- **Express.js** — Local dev server
- **Google Gemini API** — Optional AI integration

## 🚀 Local Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup & Run

```bash
# Install dependencies
npm install

# Start development server (runs Vite + Express)
npm run dev

# Open your browser
# http://localhost:3000
```

### Build for Production

```bash
# Build both Vite frontend and Express server
npm run build

# Output: dist/ folder ready for deployment
```

## ☁️ Cloudflare Pages Deployment

### Build Configuration
- **Framework preset**: Vite
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Node.js version**: 20+ recommended

### wrangler.toml Settings
```toml
pages_build_output_dir = "dist"
```

⚠️ **Important**: Only include Pages-compatible configuration keys in `wrangler.toml`. Do not add unsupported build blocks.

## 📁 Key Project Paths

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main application component and room logic |
| `src/components/AdminPanel.tsx` | Admin dashboard for room/peer monitoring |
| `src/components/CoolLoading.tsx` | Custom loading animation |
| `server.ts` | Express server with WebSocket signaling |
| `vite.config.ts` | Vite configuration |
| `cloudflare/d1-schema.sql` | Optional database schema (if using Cloudflare D1) |

## 🔐 Security Model

**In-Memory (Server-Side Signaling Only)**:
- Room memberships
- Peer metadata (names, device types)
- WebRTC SDP handshake messages
- ⚠️ Cleared on server restart—no persistence

**Client-Side (Always Encrypted)**:
- File chunks streamed via WebRTC
- AES-GCM encryption with 9-char PIN
- Decryption happens only on receiving device
- No plaintext stored anywhere

**Zero-Knowledge Architecture**:
- Server never sees file contents
- File identities and encryption keys remain client-only
- Transfer complete → room metadata auto-cleared

## 📊 Usage Statistics
- **Peer-to-Peer Protocol**: WebRTC DataChannel
- **Encryption Standard**: AES-256-GCM
- **Chunk Size**: 16KB per encrypted block
- **Max File Size**: Limited only by device storage/bandwidth
- **Signaling Overhead**: ~2KB per room join/leave

## 🌍 Internationalization

- **English** — Full UI translation
- **Persian (Farsi)** — Complete Persian interface
- **Theme Support** — Dark and light modes
- **Device Labels** — Custom nicknames for devices

Switch language and theme via the top navigation bar.

---

## Persian Description

# PIMXNODE 🔐✨

PIMXNODE یک پلتفرم مدرن برای اشتراک گذاری فایل‌های P2P است که امکان ارتباط ایمن و مستقیم بین دستگاه‌ها را با استفاده از WebRTC فراهم می‌کند.

## 🌐 وبسایت زندہ
آدرس اصلی: **https://pimxnode.pages.dev/**

## 🎯 این پروژه چه می‌کند؟

- **تونل مستقیم WebRTC**: اتصالات P2P بدون نیاز به سرور مرکزی
- **رمزگذاری از سر تا پا**: رمزگذاری AES-GCM برای هر ۱۶KB داده
- **اتاق‌های ۹ کاراکتری**: کد اتاق وارد کنید تا سایر دستگاه‌ها را پیدا کنید
- **بدون ذخیره‌سازی**: معماری ۱۰۰٪ بدون سرور
- **شناسایی دستگاه**: رادار زمان‌واقعی برای دیدن دستگاه‌های متصل

## ✨ ویژگی‌های اصلی

- 🔐 **رمزگذاری AES-GCM** — تمام داده‌ها قبل از ترک دستگاه شما رمزگذاری می‌شوند
- 🌐 **رابط کاربری دو‌زبانه (FA/EN)** — پشتیبانی کامل فارسی و انگلیسی
- 🎨 **تم روشن/تاریک** — تبدیل پویا تم رابط کاربری
- 📡 **رادار دستگاه‌های متصل** — نمایشگر زمان‌واقعی برای دیدن همتایان
- 🔄 **آپ‌لود Drag & Drop** — رابط کاربری شهودی برای انتقال فایل
- 🛡️ **رمز اتاق ۹ کاراکتری** — کلید امنیتی شخصی‌سازی‌شده
- 📊 **نمایش صف انتقال** — نظارت بر جریان‌های فعال و انتقالات تکمیل‌شده
- ⚡ **تونل‌های مستقیم** — ترجیح STUN برای اتصالات واقعاً مستقیم

## 🔒 چگونه کار می‌کند؟

### 1. **تطابق اتاق**
یک کد ۹ کاراکتری وارد کنید تا به اتاق بپیوندید. یک کانال سیگنالینگ موقتی شناسه همتای شما را با سایرین تطبیق می‌دهد.

### 2. **دستگاه‌شناسی WebRTC**
WebRTC از پروتکل‌های STUN برای حل آدرس‌های NAT استفاده می‌کند و اتصالات مستقیم P2P برقرار می‌کند.

### 3. **رمزگذاری AES-GCM**
فایل‌ها به ArrayBuffer‌های رمزگذاری‌شده ۱۶KB تقسیم می‌شوند و مستقیماً جریان‌دار می‌شوند. هر بلاک مستقل با PIN ۹ کاراکتری شما رمزگذاری می‌شود.

### 4. **صف انتقال زمان‌واقعی**
پیشرفت انتقال فایل‌ها را به صورت زمان‌واقعی مشاهده کنید. تمام داده‌ها بین همتایان باقی می‌ماند و هیچ چیز به سرور نمی‌رسد.

## 🖥️ دسترسی ادمین
مسیر: `/admin`

سیستم اعتبار سنجی اساسی برای نظارت بر اتاق‌های فعال و اتصالات همتایان.

## 🛠️ پشته تکنولوژی

- **React 19** — چارچوب UI
- **TypeScript** — توسعه ایمن
- **Vite** — ابزار ساخت سریع
- **Tailwind CSS** — استایل
- **Motion** — انیمیشن‌های صاف
- **WebRTC** — ارتباط P2P
- **Express.js** — سرور dev محلی

## 🚀 توسعه محلی

### نیازمندی‌ها
- Node.js 18+
- npm یا yarn

### نصب و اجرا

```bash
# نصب وابستگی‌ها
npm install

# شروع سرور توسعه
npm run dev

# باز کنید http://localhost:3000
```

### ساخت برای تولید

```bash
npm run build
```

## ☁️ استقرار بر روی Cloudflare Pages

```toml
pages_build_output_dir = "dist"
```

**مهم**: تنها کلیدهای سازگار با Pages را در `wrangler.toml` قرار دهید.

## 📁 مسیرهای کلیدی پروژه

| فایل | هدف |
|------|------|
| `src/App.tsx` | جز جزیی‌ای اصلی و منطق اتاق |
| `src/components/AdminPanel.tsx` | داشبورد ادمین |
| `server.ts` | سرور Express با سیگنالینگ WebSocket |

## 🔐 مدل امنیتی

**رمزگذاری بین‌جهانی**:
- تمام بلاک‌های فایل با AES-GCM رمزگذاری می‌شوند
- هیچ فایل در سرور ذخیره نمی‌شود
- فقط دستگاه‌های همتای دارای کلید رمزگذاری هستند

**معماری Zero-Knowledge**:
- سرور هرگز محتوای فایل را نمی‌بیند
- انتقال کامل → پاک‌سازی خودکار اتاق

## 📊 آمار استفاده

- **پروتکل P2P**: WebRTC DataChannel
- **استاندارد رمزگذاری**: AES-256-GCM
- **حجم بلاک**: ۱۶KB برای هر بلاک رمزگذاری‌شده
- **حداکثر اندازه فایل**: محدود فقط به ظرفیت دستگاه

---

## 📜 لایسنس

© 2026 PIMXNODE. All rights reserved. Built in AI Studio Preview.

---

**Built with ❤️ for secure peer-to-peer file sharing | ساخته‌شده برای اشتراک گذاری امن فایل‌ها P2P**
