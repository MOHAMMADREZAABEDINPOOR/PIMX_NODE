import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  timeout: 90_000,
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL:
      process.env.TEST_BASE_URL ||
      `http://localhost:${process.env.PORT || 3000}`,
    launchOptions: {
      ...(process.platform === "win32"
        ? {
            executablePath:
              process.env.CHROME_PATH ||
              "C:/Program Files/Google/Chrome/Application/chrome.exe",
          }
        : {}),
      args: ["--enable-unsafe-swiftshader"],
    },
  },
  webServer: process.env.TEST_BASE_URL
    ? undefined
    : {
        command: "npm run dev",
        url: `http://localhost:${process.env.PORT || 3000}/api/health`,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
});
