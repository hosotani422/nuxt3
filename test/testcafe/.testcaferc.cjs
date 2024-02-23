module.exports = {
  src: [`./test/testcafe/test/*.test.ts`],
  browsers: [`chrome:headless`],
  baseUrl: `http://localhost:3000/`,
  skipJsErrors: true,
  concurrency: 1,
  screenshots: {
    path: `./test/testcafe/screenshots`,
    takeOnFails: false,
    fullPage: true,
  },
};
