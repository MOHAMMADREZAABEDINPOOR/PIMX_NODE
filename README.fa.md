<div align="center">

<a href="https://pimxnode.pages.dev/"><img src="assets/readme/hero.gif" width="1200" alt="PIMX NODE: original animated 3D illustration" /></a>

[English](README.md) · [فارسی](README.fa.md) · [Live website ↗](https://pimxnode.pages.dev/)

[![Live GitHub statistics](https://raw.githubusercontent.com/MOHAMMADREZAABEDINPOOR/MOHAMMADREZAABEDINPOOR/main/assets/readme/live-PIMX_NODE.svg)](https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_NODE)

</div>

# PIMX NODE

فایل، پوشه و متن را با اتصال رمزنگاری‌شدهٔ WebRTC بین مرورگرها بفرست. با QR دستگاه دعوت کن، گیرنده را تأیید کن، صف انتقال را مدیریت کن و صحت فایل را بررسی کن؛ سیگنالینگ روی Node.js یا Cloudflare Durable Objects اجرا می‌شود.

## امکانات

- اتاق با QR، تأیید گیرنده و اشتراک فایل، پوشه و متن با چند گیرنده
- کنترل صف، اتصال و ادامهٔ مجدد و بررسی صحت فایل
- وضعیت اتصال سه‌بعدی زنده، عیب‌یابی، تاریخچهٔ محلی و PWA نصب‌شدنی

## یک اتاق برای دستگاه‌هایت

اتاق بساز و با لینک یا QR مرورگر دیگری را دعوت کن. انتقال ورودی را تأیید کن، فایل یا پوشه بفرست، متن به اشتراک بگذار و گیرنده‌ها را انتخاب کن. کنترل صف، اتصال و ادامهٔ مجدد، پیش‌نمایش، عیب‌یابی اتصال و تاریخچهٔ محلی کمک می‌کنند پیشرفت واقعی انتقال را دنبال کنی. شبکهٔ سه‌بعدی به رخدادهای اتصال و انتقال واکنش نشان می‌دهد.

دادهٔ فایل با WebRTC، قطعه‌های رمزنگاری‌شده و بررسی صحت منتقل می‌شود. سرویس سیگنالینگ ارتباط همتاها را هماهنگ می‌کند و محتوای فایل را ذخیره نمی‌کند. اگر اتصال مستقیم ممکن نباشد، TURN می‌تواند ترافیک رمزنگاری‌شده را عبور دهد. هر دو مرورگر باید آنلاین و باز بمانند؛ نصب آفلاین جای اتصال زنده را نمی‌گیرد. ادامهٔ انتقال به وضعیت جلسه و دسترسی به فایل مبدأ وابسته است و پیش‌نمایش به پشتیبانی مرورگر از فرمت بستگی دارد.

## اجرای محلی

Node.js نسخهٔ 22.12 یا جدیدتر لازم است.

```sh
npm ci
npm run dev
```

سرور را در دو مرورگر باز کنید و وارد یک اتاق شوید. برای `PORT`، تنظیمات اختیاری TURN و `VITE_SITE_URL` فایل [.env.example](.env.example) را ببینید.

| فرمان | کاربرد |
| --- | --- |
| `npm run lint` | بررسی TypeScript برنامه و Worker |
| `npm test` | آزمون انتقال و رابط با Playwright |
| `npm run build:pages` | ساخت فرانت‌اند استاتیک و صفحه‌های SEO |
| `npm run build` | ساخت فرانت‌اند و سرور سیگنالینگ Node |
| `npm start` | اجرای `build/server.cjs` پس از ساخت |

## دو مسیر استقرار

در Cloudflare ابتدا Worker سیگنالینگ را با `npm run deploy:signaling` و سپس رابط Pages را با `npm run deploy:pages` منتشر کنید. اتصال `SIGNALING` درخواست‌های WebSocket را از Pages به Durable Object کلاس `SignalingRoom` می‌فرستد. فرانت‌اند استاتیک به‌تنهایی سیگنالینگ فراهم نمی‌کند.

برای میزبانی Node، ابتدا `npm run build` و سپس `npm start` را پشت پراکسی HTTPS/WSS اجرا کنید. TURN اختیاری است اما بعضی شبکه‌های محدود به آن نیاز دارند. `TURN_URL` را همراه `TURN_SHARED_SECRET` برای اعتبارنامهٔ موقت یا با ترکیب جایگزین `TURN_USERNAME` و `TURN_CREDENTIAL` تنظیم کنید.

[استقرار Cloudflare و Node](DEPLOYMENT.fa.md) · [پیاده‌سازی](IMPLEMENTATION.fa.md) · [SEO](SEO.md) · [کد انتقال](src/) · [کد Worker](cloudflare/)

رابط فارسی و انگلیسی، راست‌به‌چپ، پوسته‌های روشن و تاریک، پیمایش با کیبورد و کاهش حرکت را پشتیبانی می‌کند.

[GitHub](https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_NODE) · [PIMX](https://github.com/MOHAMMADREZAABEDINPOOR) · [Portfolio](https://pimx.pages.dev/)
