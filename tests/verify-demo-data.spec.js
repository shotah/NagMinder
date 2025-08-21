import { test, expect } from "./fixtures.js";

test.describe("Verify Demo Data Actually Works", () => {
  test("Check if demo times are actually showing in the bar", async ({
    context,
    extensionId,
  }) => {
    // 1. Get the first page (reuse blank tab)
    const pages = context.pages();
    const page = pages.length > 0 ? pages[0] : await context.newPage();

    console.log(`🔧 Extension ID: ${extensionId}`);

    // 2. Go to Reddit first to let extension load
    console.log("🌐 Navigating to Reddit...");
    await page.goto("https://reddit.com");
    await page.waitForTimeout(5000); // Give extension time to load

    // 3. Check if extension is loaded after page load
    const extensionLoaded = await page.evaluate(() => {
      return (
        typeof chrome !== "undefined" && !!chrome.runtime && !!chrome.runtime.id
      );
    });
    console.log(
      `🔧 Extension context available after page load: ${extensionLoaded}`
    );

    // 4. Set demo data AFTER extension is loaded
    console.log("🔧 Setting demo data...");
    const dataSet = await page.evaluate(() => {
      if (typeof chrome !== "undefined" && chrome.storage) {
        const demoData = {
          "reddit.com": {
            day: 20, // 20 minutes today
            week: 120, // 2 hours this week
            month: 300, // 5 hours this month
            year: 900, // 15 hours this year
            allTime: 1800, // 30 hours all time
          },
        };

        return new Promise((resolve) => {
          chrome.storage.local.set({ nm_siteTimes: demoData }, () => {
            console.log("✅ Demo data set in storage");
            resolve(true);
          });
        });
      } else {
        console.log("❌ Chrome storage not available");
        return false;
      }
    });
    console.log(`💾 Demo data set successfully: ${dataSet}`);

    // 5. Trigger extension refresh by sending a message
    await page.evaluate(() => {
      if (typeof chrome !== "undefined" && chrome.runtime) {
        chrome.runtime.sendMessage({ type: "nm_get_state" }).catch(() => {
          console.log("Background script communication attempt");
        });
      }
    });

    // 6. Wait and refresh to pick up new data
    await page.waitForTimeout(2000);
    await page.reload();
    await page.waitForTimeout(3000);

    // 7. Debug what's actually on the page
    console.log("🔍 Checking page for NagMinder elements...");

    // Check the exact selector from content.js
    const barExists = (await page.locator("#nagminder-bar").count()) > 0;
    console.log(`🔍 #nagminder-bar exists: ${barExists}`);

    if (barExists) {
      // 8. Get the actual text content
      const todayText = await page.locator(".nm-today").textContent();
      console.log(`📊 Today text: "${todayText}"`);

      // 9. Check if expand button exists and click it
      const expandExists = (await page.locator(".nm-expand").count()) > 0;
      console.log(`🔘 Expand button exists: ${expandExists}`);

      if (expandExists) {
        await page.click(".nm-expand");
        await page.waitForTimeout(500);

        const weekText = await page.locator(".nm-week").textContent();
        const monthText = await page.locator(".nm-month").textContent();
        const yearText = await page.locator(".nm-year").textContent();
        const allTimeText = await page.locator(".nm-alltime").textContent();

        console.log(`📊 Week text: "${weekText}"`);
        console.log(`📊 Month text: "${monthText}"`);
        console.log(`📊 Year text: "${yearText}"`);
        console.log(`📊 All time text: "${allTimeText}"`);
      }

      // 10. Check storage to see what's actually stored
      const storageData = await page.evaluate(async () => {
        if (typeof chrome !== "undefined" && chrome.storage) {
          return new Promise((resolve) => {
            chrome.storage.local.get(["nm_siteTimes"], (result) => {
              resolve(result);
            });
          });
        }
        return null;
      });
      console.log("💾 Storage data:", JSON.stringify(storageData, null, 2));
    } else {
      console.log("❌ NagMinder bar not found - extension may not be loaded");
    }

    // 11. Take a screenshot for manual verification
    await page.screenshot({
      path: `./screenshots/verification-test.png`,
      fullPage: false,
    });
    console.log("📸 Screenshot saved as verification-test.png");

    // Don't close the page so we can see it
  });
});
