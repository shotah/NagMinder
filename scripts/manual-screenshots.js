import fs from "fs";

console.log("📸 Manual Chrome Web Store Screenshot Guide\n");

console.log("🚀 Quick Manual Method:");
console.log(
  "Since automated testing is tricky with extensions, here's the manual approach:\n"
);

console.log("📐 Step 1: Set Browser Size");
console.log("   1. Open Chrome");
console.log("   2. Press F12 (Developer Tools)");
console.log("   3. Click device toolbar icon (📱) or Ctrl+Shift+M");
console.log("   4. Set 'Responsive' mode");
console.log("   5. Enter: Width=1280, Height=800\n");

console.log("🔧 Step 2: Load Extension");
console.log("   1. Go to chrome://extensions/");
console.log("   2. Enable 'Developer mode'");
console.log("   3. Click 'Load unpacked' → select build/ folder");
console.log("   4. Note the extension ID for later\n");

console.log("📊 Step 3: Set Demo Data");
console.log("   1. Visit any tracked site (reddit.com)");
console.log("   2. Open Console (F12 → Console tab)");
console.log("   3. Paste this code:");

const demoDataCode = `
chrome.storage.local.set({
  "nm_siteTimes": {
    "reddit.com": {
      day: 20,      // 20 minutes today
      week: 120,    // 2 hours this week  
      month: 300,   // 5 hours this month
      year: 900,    // 15 hours this year
      allTime: 1800 // 30 hours all time
    },
    "facebook.com": {
      day: 15,      // 15 minutes today
      week: 90,     // 1.5 hours this week
      month: 240,   // 4 hours this month  
      year: 720,    // 12 hours this year
      allTime: 1440 // 24 hours all time
    },
    "linkedin.com": {
      day: 10,      // 10 minutes today
      week: 60,     // 1 hour this week
      month: 180,   // 3 hours this month
      year: 600,    // 10 hours this year
      allTime: 1200 // 20 hours all time
    }
  }
}, () => console.log('✅ Demo data set! Refresh the page.'));
`;

console.log(demoDataCode);
console.log("   4. Press Enter and refresh the page\n");

console.log("📷 Step 4: Take Screenshots");
console.log("   1. reddit.com - Basic bar (collapsed)");
console.log("   2. reddit.com - Click ••• to expand stats");
console.log("   3. facebook.com - Hover to show snooze/pause");
console.log("   4. linkedin.com - Professional usage");
console.log("   5. chrome-extension://[ID]/options.html - Settings page\n");

console.log("💾 Step 5: Save Screenshots");
console.log("   1. Use Win+Shift+S (Windows) or Cmd+Shift+4 (Mac)");
console.log("   2. Save as PNG files");
console.log("   3. Name them: 01-reddit-collapsed.png, etc.");
console.log("   4. Maximum 5 screenshots for Chrome Web Store\n");

// Write the demo data to a separate file
fs.writeFileSync("scripts/demo-data-console.js", demoDataCode.trim());
console.log("📁 Demo data code saved to: scripts/demo-data-console.js");
console.log("   (Copy/paste this file's contents into browser console)\n");

console.log("🎨 Pro Tips:");
console.log("   • Use incognito mode for clean UI");
console.log("   • Disable other extensions temporarily");
console.log("   • Wait for realistic time to accumulate (or use demo data)");
console.log("   • Take multiple shots and pick the best ones");
console.log("   • Ensure screenshots show value proposition clearly");
