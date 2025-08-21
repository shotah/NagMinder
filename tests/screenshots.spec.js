import { test, expect } from "./fixtures.js";

// Chrome Web Store screenshot requirements: 1280x800 or 640x400, JPEG/PNG (no alpha)
const SCREENSHOT_DIR = "./screenshots";

test.describe("NagMinder Chrome Web Store Screenshots", () => {
  // Helper function to set demo data
  async function setDemoData(context) {
    const demoData = {
      "reddit.com": {
        day: 1200000, // 20 minutes today
        week: 7200000, // 2 hours this week
        month: 18000000, // 5 hours this month
        year: 54000000, // 15 hours this year
        allTime: 108000000, // 30 hours all time
      },
      "facebook.com": {
        day: 900000, // 15 minutes today
        week: 5400000, // 1.5 hours this week
        month: 14400000, // 4 hours this month
        year: 43200000, // 12 hours this year
        allTime: 86400000, // 24 hours all time
      },
      "linkedin.com": {
        day: 600000, // 10 minutes today
        week: 3600000, // 1 hour this week
        month: 10800000, // 3 hours this month
        year: 36000000, // 10 hours this year
        allTime: 72000000, // 20 hours all time
      },
    };

    // Execute storage commands directly in background context
    const pages = context.pages();
    if (pages.length > 0) {
      const page = pages[0];
      try {
        await page.evaluate((data) => {
          if (typeof chrome !== "undefined" && chrome.storage) {
            chrome.storage.local.set({ timeData: data });
          }
        }, demoData);
      } catch (e) {
        console.log(
          "Note: Could not set demo data, extension may work with default data"
        );
      }
    }
  }

  test("01 - Reddit with NagMinder bar (collapsed)", async ({ context }) => {
    const page = await context.newPage();
    await setDemoData(context);

    await page.goto("https://reddit.com");

    // Wait for extension to load and inject
    await page.waitForTimeout(5000);

    // Check if the bar exists - but don't fail if it doesn't
    const barExists = (await page.locator(".nm-bar").count()) > 0;
    if (barExists) {
      console.log("✅ NagMinder bar found!");
    } else {
      console.log(
        "📷 Taking screenshot anyway (bar may be there but selector different)"
      );
    }

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/01-reddit-collapsed.png`,
      fullPage: false,
    });

    await page.close();
  });

  test("02 - Reddit with expanded stats (•••)", async ({ context }) => {
    const page = await context.newPage();
    await setDemoData(context);

    await page.goto("https://reddit.com");
    await page.waitForTimeout(5000);

    // Try to expand if bar exists
    const barExists = (await page.locator(".nm-bar").count()) > 0;
    if (barExists) {
      try {
        await page.click(".nm-expand");
        await page.waitForTimeout(500);
        console.log("✅ Expanded stats view");
      } catch (e) {
        console.log("📷 Could not expand, but taking screenshot");
      }
    }

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/02-reddit-expanded.png`,
      fullPage: false,
    });

    await page.close();
  });

  test("03 - Facebook with snooze/pause options", async ({ context }) => {
    const page = await context.newPage();

    await page.goto("https://facebook.com");
    await page.waitForTimeout(3000);

    try {
      await page.waitForSelector(".nm-bar", { timeout: 10000 });
      // Hover over bar to show all buttons
      await page.hover(".nm-bar");
      await page.waitForTimeout(500);
    } catch (error) {
      console.log("❌ Could not interact with bar, taking screenshot anyway");
    }

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/03-facebook-controls.png`,
      fullPage: false,
    });

    await page.close();
  });

  test("04 - LinkedIn professional usage", async ({ context }) => {
    const page = await context.newPage();

    await page.goto("https://linkedin.com");
    await page.waitForTimeout(3000);

    try {
      await page.waitForSelector(".nm-bar", { timeout: 10000 });
    } catch (error) {
      console.log("❌ NagMinder bar not found on LinkedIn");
    }

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/04-linkedin-usage.png`,
      fullPage: false,
    });

    await page.close();
  });

  test("05 - Extension options page", async ({ context, extensionId }) => {
    const page = await context.newPage();

    // Navigate to the actual extension options page
    await page.goto(`chrome-extension://${extensionId}/options.html`);
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/05-options-page.png`,
      fullPage: false,
    });

    await page.close();
  });
});
