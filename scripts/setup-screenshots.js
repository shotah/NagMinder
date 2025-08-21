import fs from "fs";
import path from "path";

console.log("📸 Setting up Chrome Web Store Screenshot Generation\n");

// Create screenshots directory
const screenshotDir = "screenshots";
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir);
  console.log(`✅ Created ${screenshotDir}/ directory`);
} else {
  console.log(`📁 ${screenshotDir}/ directory already exists`);
}

// Create .gitignore entry for screenshots (optional - user might want to commit them)
const gitignorePath = ".gitignore";
if (fs.existsSync(gitignorePath)) {
  const gitignore = fs.readFileSync(gitignorePath, "utf8");
  if (!gitignore.includes("screenshots/")) {
    fs.appendFileSync(
      gitignorePath,
      "\n# Generated screenshots\nscreenshots/\n"
    );
    console.log("✅ Added screenshots/ to .gitignore");
  }
}

console.log("\n🎯 Chrome Web Store Screenshot Requirements:");
console.log("   • Size: 1280×800 pixels (recommended)");
console.log("   • Format: JPEG or 24-bit PNG (no alpha)");
console.log("   • Maximum: 5 screenshots");
console.log("   • Required: At least 1 screenshot\n");

console.log("🚀 Quick Start:");
console.log("   1. npm run build              # Build extension first");
console.log("   2. npm run screenshots:setup  # Install Playwright browser");
console.log("   3. npm run screenshots        # Generate all screenshots");
console.log("   4. Check screenshots/ folder  # Review generated images\n");

console.log("📋 Generated Screenshots:");
console.log("   • 01-reddit-collapsed.png    - Basic time tracking bar");
console.log("   • 02-reddit-expanded.png     - Detailed stats view (•••)");
console.log("   • 03-facebook-controls.png   - Snooze/pause buttons");
console.log("   • 04-linkedin-usage.png      - Professional site tracking");
console.log("   • 05-options-page.png        - Extension settings page\n");

console.log("⚠️  Important Notes:");
console.log("   • Tests use demo data for realistic time displays");
console.log("   • Extension must be built first (build/ directory)");
console.log("   • Screenshots are 1280×800 (Chrome Web Store standard)");
console.log("   • Tests may need adjustment for your specific sites\n");

console.log("🎨 Manual Screenshots Alternative:");
console.log("   • Run: node scripts/browser-resize.js");
console.log("   • Use browser dev tools for exact sizing");
console.log("   • Paste scripts/demo-data.js in console for demo times");
