console.log("🎯 Manual Time Demo Verification");
console.log("");
console.log("📋 STEP 1: Load Extension");
console.log("1. Open Chrome");
console.log("2. Go to chrome://extensions/");
console.log("3. Enable 'Developer mode'");
console.log("4. Click 'Load unpacked' → select your build/ folder");
console.log("5. Note the extension ID");
console.log("");

console.log("📋 STEP 2: Set Demo Times");
console.log("1. Go to https://reddit.com");
console.log("2. Open DevTools (F12) → Console tab");
console.log("3. Paste this code:");
console.log("");

const demoCode = `
// Set realistic demo times
chrome.storage.local.set({
  nm_siteTimes: {
    "reddit.com": {
      day: 25,      // 25 minutes today
      week: 180,    // 3 hours this week
      month: 420,   // 7 hours this month  
      year: 1200,   // 20 hours this year
      allTime: 2400 // 40 hours all time
    }
  }
}, () => {
  console.log('✅ Demo times set!');
  console.log('📄 Now refresh the page to see times...');
});
`;

console.log(demoCode);

console.log("📋 STEP 3: Verify Results");
console.log("1. Press Enter to run the code");
console.log("2. Refresh the page (F5)");
console.log("3. Look for the red NagMinder bar at the top");
console.log("4. Should show: 'Today: 25m' instead of 'Today: 0m'");
console.log("5. Click the ••• button to expand");
console.log("6. Should show: Week: 3h, Month: 7h, Year: 20h, All time: 40h");
console.log("");

console.log("🔍 EXPECTED RESULTS:");
console.log("✅ Bar shows: 'Today: 25m'");
console.log("✅ Expanded shows: 'Week: 3h', 'Month: 7h', etc.");
console.log("✅ Times are realistic, not all zeros");
console.log("");

console.log("🚨 IF STILL SHOWING ZEROS:");
console.log("1. Check console for errors");
console.log(
  "2. Verify storage with: chrome.storage.local.get(['nm_siteTimes'], console.log)"
);
console.log("3. Make sure you're on reddit.com (not www.reddit.com)");
console.log("4. Try a hard refresh (Ctrl+F5)");

// Also save this to a file for easy copy/paste
import fs from "fs";
fs.writeFileSync("scripts/demo-times-manual.js", demoCode.trim());
console.log("💾 Code saved to: scripts/demo-times-manual.js");
