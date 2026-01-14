import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Workers: use 50% of CPUs locally, or 5 on CI */
  workers: process.env.CI ? 5 : 10,
  /* Reporter to use */
  reporter: [["html", { outputFolder: "playwright-report", open: "never" }]],
  /* Shared settings for all the projects */
  use: {
    baseURL: "https://www.usa.gov",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    headless: true,
  },

  /* Match all test files recursively in the testDir */
  testMatch: ["**/*.spec.ts", "**/*.test.ts", "**/*.spec.js", "**/*.test.js"],

  timeout: 30000,

  /* Timeout configuration for hooks and tests */
  expect: {
    timeout: 10000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },

    // /* Optional mobile projects */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],
  /* Optional: start a local dev server before tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
