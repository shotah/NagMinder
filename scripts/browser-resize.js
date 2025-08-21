import fs from "fs";

console.log("📐 Chrome Web Store Screenshot Helper\n");

console.log("🎯 Required Screenshot Sizes:");
console.log("   • 1280×800 (recommended) - Desktop view");
console.log("   • 640×400 (alternative) - Compact view");
console.log("   • JPEG or 24-bit PNG (no alpha channel)");
console.log("   • Maximum 5 screenshots\n");

console.log("🌐 Manual Browser Resize:");
console.log("1. Open Chrome/Edge Developer Tools (F12)");
console.log("2. Click the 'Toggle device toolbar' icon (📱) or Ctrl+Shift+M");
console.log("3. Set 'Responsive' dropdown to 'Responsive'");
console.log("4. Enter exact dimensions:");
console.log("   • Width: 1280px");
console.log("   • Height: 800px");
console.log("5. Navigate to a tracked site (reddit.com, facebook.com, etc.)");
console.log("6. Take screenshot (Windows: Win+Shift+S, Mac: Cmd+Shift+4)\n");

console.log("📋 Suggested Screenshots for NagMinder:");
console.log("   1. Reddit with time bar showing (light theme)");
console.log("   2. Facebook with expanded stats (•••)");
console.log("   3. LinkedIn with snooze/pause options");
console.log("   4. Extension options page");
console.log("   5. Before/after comparison (no bar vs with bar)\n");

console.log("🎨 Screenshot Tips:");
console.log("   • Use incognito mode for clean browser UI");
console.log("   • Clear cache to ensure fresh load");
console.log("   • Disable other extensions for clean demo");
console.log("   • Use sites with good content (avoid empty pages)");
console.log("   • Show realistic time usage (not 0 seconds)\n");

// Create a test data script for realistic times
const testDataScript = `
// Paste this in browser console on tracked sites to set realistic demo times
chrome.storage.local.set({
  "timeData": {
    "reddit.com": { 
      "day": 1200000,     // 20 minutes today
      "week": 7200000,    // 2 hours this week  
      "month": 18000000,  // 5 hours this month
      "year": 54000000,   // 15 hours this year
      "allTime": 108000000 // 30 hours all time
    },
    "facebook.com": {
      "day": 900000,      // 15 minutes today
      "week": 5400000,    // 1.5 hours this week
      "month": 14400000,  // 4 hours this month  
      "year": 43200000,   // 12 hours this year
      "allTime": 86400000 // 24 hours all time
    }
  }
}, () => console.log('✅ Demo time data set! Refresh the page.'));
`;

fs.writeFileSync("scripts/demo-data.js", testDataScript);
console.log(
  "📁 Created scripts/demo-data.js - paste in browser console for demo times"
);
