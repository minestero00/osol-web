const { defineConfig } = require("@playwright/test");
module.exports = defineConfig({
  testDir: "./tests",
  timeout: 90000,
  workers: 2,
  retries: 0,
  outputDir: process.env.OSOL_TEST_OUTPUT || "test-results",
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:8766",
    viewport: { width: 375, height: 812 },
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        browserName: "chromium",
        launchOptions: process.env.OSOL_CHROME_EXECUTABLE
          ? { executablePath: process.env.OSOL_CHROME_EXECUTABLE }
          : {},
      },
    },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  webServer: {
    command: "python3 -m http.server 8766 --bind 127.0.0.1",
    url: "http://127.0.0.1:8766",
    reuseExistingServer: !process.env.CI,
  },
});
