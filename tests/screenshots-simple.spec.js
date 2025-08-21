import { test, expect } from "./fixtures.js";

// Simplified screenshot tests - just capture the pages with extension loaded
const SCREENSHOT_DIR = "./screenshots";

test.describe("NagMinder Screenshots - Simple", () => {
  // Helper to reuse existing page or create clean one
  async function getCleanPage(context) {
    const pages = context.pages();
    if (pages.length > 0) {
      // Reuse the first page (usually the blank tab)
      return pages[0];
    } else {
      // Fallback: create new page if none exist
      return await context.newPage();
    }
  }

  // Helper to set demo data in correct format
  async function setDemoData(context) {
    const demoData = {
      "reddit.com": {
        day: 20, // 20 minutes today (stored as minutes, not milliseconds)
        week: 120, // 2 hours this week
        month: 300, // 5 hours this month
        year: 900, // 15 hours this year
        allTime: 1800, // 30 hours all time
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

    const pages = context.pages();
    if (pages.length > 0) {
      const page = pages[0];
      try {
        await page.evaluate((data) => {
          if (typeof chrome !== "undefined" && chrome.storage) {
            // Set with the correct storage key that background.js expects
            chrome.storage.local.set({ nm_siteTimes: data });
          }
        }, demoData);
      } catch (e) {
        console.log("Note: Could not set demo data");
      }
    }
  }

  test("Reddit - Basic view", async ({ context }) => {
    const page = await getCleanPage(context);
    await setDemoData(context);
    await page.goto("https://reddit.com");
    await page.waitForTimeout(4000); // Let extension load

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/reddit-basic.png`,
      fullPage: false,
    });
    // Don't close the page - will reuse for next test
  });

  test("Reddit - Expanded view", async ({ context }) => {
    const page = await getCleanPage(context);
    await setDemoData(context);
    await page.goto("https://reddit.com");
    await page.waitForTimeout(4000);

    // Click the expand button to show detailed stats
    try {
      await page.click(".nm-expand");
      await page.waitForTimeout(500); // Animation
      console.log("✅ Expanded stats successfully");
    } catch (e) {
      console.log("Could not expand, taking screenshot anyway");
    }

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/reddit-expanded.png`,
      fullPage: false,
    });
  });

  test("Facebook - Basic view", async ({ context }) => {
    const page = await getCleanPage(context);
    await setDemoData(context);
    await page.goto("https://facebook.com");
    await page.waitForTimeout(4000);

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/facebook-basic.png`,
      fullPage: false,
    });
  });

  test("LinkedIn - Basic view", async ({ context }) => {
    const page = await getCleanPage(context);
    await setDemoData(context);
    await page.goto("https://linkedin.com");
    await page.waitForTimeout(4000);

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/linkedin-basic.png`,
      fullPage: false,
    });
  });

  test("Options page", async ({ context, extensionId }) => {
    const page = await getCleanPage(context);
    await page.goto(`chrome-extension://${extensionId}/options.html`);
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/options-page.png`,
      fullPage: false,
    });
  });
});
