import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // Look for test files in the "tests" directory, relative to this configuration file.
  testDir: `./e2e`,
  // Glob patterns or regular expressions that match test files.
  testMatch: `*.ts`,
  // Folder for test artifacts such as screenshots, videos, traces, etc.
  outputDir: `./report`,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: Boolean(process.env.CI),
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  // workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: `dot`,
  // path to the global setup files.
  // globalSetup: require.resolve(`./global-setup`),
  // path to the global teardown files.
  // globalTeardown: require.resolve(`./global-teardown`),
  // Each test is given 30 seconds.
  timeout: 30000,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: `http://localhost:3000`,
    // isMobile: true,
    // hasTouch: true,
    // Populates context with given storage state.
    // storageState: `state.json`,
    // Emulates `'prefers-colors-scheme'` media feature.
    colorScheme: `light`,
    // Context geolocation.
    // geolocation: {longitude: 12.492507, latitude: 41.889938},
    // Emulates the user locale.
    // locale: `en-GB`,
    // Grants specified permissions to the browser context.
    // permissions: [`geolocation`],
    // Emulates the user timezone.
    // timezoneId: `Europe/Paris`,
    // Viewport used for all pages in the context.
    viewport: { width: 600, height: 900 },
    // Whether to automatically download all the attachments.
    // acceptDownloads: false,
    // An object containing additional HTTP headers to be sent with every request.
    // extraHTTPHeaders: {
    //   'X-My-Header': `value`,
    // },
    // Credentials for HTTP authentication.
    // httpCredentials: {
    //   username: `user`,
    //   password: `pass`,
    // },
    // Whether to ignore HTTPS errors during navigation.
    // ignoreHTTPSErrors: true,
    // Whether to emulate network being offline.
    // offline: true,
    // Proxy settings used for all pages in the test.
    // proxy: {
    //   server: `http://myproxy.com:3128`,
    //   bypass: `localhost`,
    // },
    // Capture screenshot after each test failure.
    // screenshot: `only-on-failure`,
    // Record trace only when retrying a test for the first time.
    trace: `on-first-retry`,
    // Record video only when retrying a test for the first time.
    // video: `on-first-retry`,
    // Maximum time each action such as `click()` can take. Defaults to 0 (no limit).
    // actionTimeout: 0,
    // Name of the browser that runs tests. For example `chromium`, `firefox`, `webkit`.
    // browserName: `chromium`,
    // Toggles bypassing Content-Security-Policy.
    // bypassCSP: true,
    // Channel to use, for example "chrome", "chrome-beta", "msedge", "msedge-beta".
    // channel: `chrome`,
    // Run browser in headless mode.
    headless: true,
    // Change the default data-testid attribute.
    testIdAttribute: `data-testid`,
    // launchOptions: {
    //   slowMo: 50,
    // },
    // userAgent: `some custom ua`,
    // javaScriptEnabled: false,
  },
  /* Configure projects for major browsers */
  projects: [
    // {
    //   name: `chromium`,
    //   use: {...devices[`Desktop Chrome`]},
    // },
    // {
    //   name: `firefox`,
    //   use: {...devices[`Desktop Firefox`]},
    // },
    // {
    //   name: `webkit`,
    //   use: {...devices[`Desktop Safari`]},
    // },
    /* Test against mobile viewports. */
    // {
    //   name: `Mobile Chrome`,
    //   use: {...devices[`Pixel 5`]},
    // },
    // {
    //   name: `Mobile Safari`,
    //   use: {...devices[`iPhone 12`]},
    // },
    /* Test against branded browsers. */
    // {
    //   name: `Microsoft Edge`,
    //   use: {...devices[`Desktop Edge`], channel: `msedge`},
    // },
    {
      name: `Google Chrome`,
      use: { ...devices[`Desktop Chrome`], channel: `chrome` },
    },
  ],
  /* Run your local dev server before starting the tests */
  webServer: {
    command: `pnpm run dev`,
    url: `http://localhost:3000`,
    reuseExistingServer: !process.env.CI,
  },
});
