import { test, expect } from "./fixtures.js";

test.describe("Working NagMinder Screenshots", () => {
  async function setDemoDataViaBackground(context) {
    // Access the service worker (background script) directly
    const serviceWorkers = context.serviceWorkers();
    if (serviceWorkers.length > 0) {
      const serviceWorker = serviceWorkers[0];

      console.log("🔧 Setting demo data via service worker...");
      await serviceWorker.evaluate(() => {
        const demoData = {
          "reddit.com": {
            day: 25, // 25 minutes today
            week: 180, // 3 hours this week
            month: 420, // 7 hours this month
            year: 1200, // 20 hours this year
            allTime: 2400, // 40 hours all time
          },
          "facebook.com": {
            day: 15, // 15 minutes today
            week: 90, // 1.5 hours this week
            month: 240, // 4 hours this month
            year: 720, // 12 hours this year
            allTime: 1440, // 24 hours all time
          },
          "linkedin.com": {
            day: 10, // 10 minutes today
            week: 60, // 1 hour this week
            month: 180, // 3 hours this month
            year: 600, // 10 hours this year
            allTime: 1200, // 20 hours all time
          },
        };

        chrome.storage.local.set({ nm_siteTimes: demoData }, () => {
          console.log("✅ Demo data set in background script!");
        });
      });

      return true;
    } else {
      console.log("❌ No service worker found");
      return false;
    }
  }

  async function getCleanPage(context) {
    const pages = context.pages();
    if (pages.length > 0) {
      return pages[0];
    } else {
      return await context.newPage();
    }
  }

  test("Reddit - With realistic times", async ({ context }) => {
    const page = await getCleanPage(context);

    // Set demo data via background script
    const dataSet = await setDemoDataViaBackground(context);
    console.log(`💾 Demo data set: ${dataSet}`);

    await page.goto("https://reddit.com");
    await page.waitForTimeout(4000);

    // Check what times are actually showing
    const todayText = await page
      .locator(".nm-today")
      .textContent()
      .catch(() => "not found");
    console.log(`📊 Today text: "${todayText}"`);

    await page.screenshot({
      path: `./screenshots/reddit-with-times.png`,
      fullPage: false,
    });

    console.log("📸 Screenshot saved as reddit-with-times.png");
  });

  test("Reddit - Expanded with realistic times", async ({ context }) => {
    const page = await getCleanPage(context);

    // Set demo data via background script
    await setDemoDataViaBackground(context);

    await page.goto("https://reddit.com");
    await page.waitForTimeout(4000);

    // Click expand and get all values
    try {
      await page.click(".nm-expand");
      await page.waitForTimeout(500);

      const todayText = await page.locator(".nm-today").textContent();
      const weekText = await page.locator(".nm-week").textContent();
      const monthText = await page.locator(".nm-month").textContent();
      const yearText = await page.locator(".nm-year").textContent();
      const allTimeText = await page.locator(".nm-alltime").textContent();

      console.log(`📊 Today: "${todayText}"`);
      console.log(`📊 Week: "${weekText}"`);
      console.log(`📊 Month: "${monthText}"`);
      console.log(`📊 Year: "${yearText}"`);
      console.log(`📊 All time: "${allTimeText}"`);
    } catch (e) {
      console.log("Could not expand stats");
    }

    await page.screenshot({
      path: `./screenshots/reddit-expanded-with-times.png`,
      fullPage: false,
    });

    console.log("📸 Screenshot saved as reddit-expanded-with-times.png");
  });

  test("Facebook - With realistic times", async ({ context }) => {
    const page = await getCleanPage(context);

    await setDemoDataViaBackground(context);

    await page.goto("https://facebook.com");
    await page.waitForTimeout(4000);

    const todayText = await page
      .locator(".nm-today")
      .textContent()
      .catch(() => "not found");
    console.log(`📊 Facebook today: "${todayText}"`);

    await page.screenshot({
      path: `./screenshots/facebook-with-times.png`,
      fullPage: false,
    });
  });

  test("LinkedIn - With realistic times", async ({ context }) => {
    const page = await getCleanPage(context);

    await setDemoDataViaBackground(context);

    await page.goto("https://linkedin.com");
    await page.waitForTimeout(4000);

    const todayText = await page
      .locator(".nm-today")
      .textContent()
      .catch(() => "not found");
    console.log(`📊 LinkedIn today: "${todayText}"`);

    await page.screenshot({
      path: `./screenshots/linkedin-with-times.png`,
      fullPage: false,
    });
  });
});
