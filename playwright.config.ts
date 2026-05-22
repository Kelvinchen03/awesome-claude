import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3111";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
      threshold: 0.2,
    },
  },
  snapshotPathTemplate:
    "{testDir}/../__screenshots__/{testFileName}/{arg}-{projectName}{ext}",
  reporter: [
    ["list"],
    ["junit", { outputFile: "reports/junit/playwright.xml" }],
  ],
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "pnpm --filter web dev --hostname 127.0.0.1 --port 3111",
        url: baseURL,
        reuseExistingServer: false,
        timeout: 120_000,
      },
  projects: [
    {
      name: "desktop-chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: "mobile-chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 375, height: 667 },
        userAgent: devices["iPhone SE"].userAgent,
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});
