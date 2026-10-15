# استقرار کامل روی Cloudflare

نشانی سایت: https://pimxnode.pages.dev

رابط روی پروژهٔ Pages با نام `pimxnode` است. اتصال دستگاه‌ها در Worker جداگانهٔ `pimxnode-signaling` و کلاس `SignalingRoom` اجرا می‌شود. Pages با binding داخلی `SIGNALING` درخواست WebSocket را به همان اتاق می‌فرستد. هر اتاق یک Durable Object مجزا دارد و هنگام بی‌کاری می‌تواند به خواب برود. فایل‌ها و کلید دعوت در این سرویس ذخیره نمی‌شوند.

## به‌روزرسانی

پس از ورود به حساب با `npx wrangler login`:

```powershell
npm ci
npm run lint
npm run deploy:signaling
$env:VITE_SITE_URL = "https://pimxnode.pages.dev"
npm run deploy:pages
```

ابتدا Worker و سپس Pages منتشر می‌شود. `wrangler.toml` اتصال Pages به Worker را تعریف می‌کند؛ تنظیمات Worker و migration مربوط به SQLite در `cloudflare/wrangler.toml` است.

اتصال فعلی GitHub روی شاخهٔ `main` رابط را با فرمان `npm run build:pages` و پوشهٔ خروجی `dist` منتشر می‌کند. اگر کد داخل `cloudflare/` تغییر کرد، Worker را هم با فرمان بالا به‌روزرسانی کنید. توکن ورود Wrangler، فایل‌های `.env` و `.dev.vars` نباید وارد مخزن شوند.

## تنظیمات اختیاری

- `VITE_SITE_URL`: در محیط build، نشانی عمومی HTTPS برای canonical و sitemap.
- `TURN_URL` و `TURN_SHARED_SECRET`: در متغیرهای محرمانهٔ Pages برای صدور اعتبارنامهٔ یک‌ساعتهٔ TURN. روش جایگزین: `TURN_USERNAME` و `TURN_CREDENTIAL`.
- `ADMIN_SECRET`: برای دسترسی به API قدیمی آمار. بدون این مقدار، خواندن داده‌های بازدید مسدود است.

بدون TURN، اتصال مستقیم WebRTC فعال است؛ بعضی شبکه‌های محدود به سرویس TURN جداگانه نیاز دارند. انتقال زنده همچنان به آنلاین‌بودن دستگاه‌ها و بازماندن مرورگرها وابسته است.

## اجرای محلی و بررسی

دو ترمینال برای محیط Cloudflare:

```powershell
npx wrangler dev --config cloudflare/wrangler.toml --port 8787 --inspector-port 9237
```

```powershell
npm run build:pages
npx wrangler pages dev dist --port 8788 --inspector-port 9238
```

برای اجرای تست‌ها روی محیط Cloudflare محلی:

```powershell
$env:TEST_BASE_URL = "http://127.0.0.1:8788"
npm test
```

برای اجرای مستقل Node، `npm run build` و سپس `npm start` را اجرا کنید. خروجی سرور در `build/server.cjs` قرار دارد و وارد فایل‌های عمومی Pages نمی‌شود.

مراجع: [WebSocket و Hibernation](https://developers.cloudflare.com/durable-objects/best-practices/websockets/)، [binding در Pages](https://developers.cloudflare.com/pages/functions/bindings/).
