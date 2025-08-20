import fs from "fs";
import path from "path";

console.log("🖼️ Icon Resizing Guide for NagMinder\n");

// Check what icon files we have
const iconDir = "icons";
const files = fs.readdirSync(iconDir);

console.log("📁 Current icon files:");
files.forEach((file) => {
  if (file.endsWith(".png")) {
    console.log(`   - ${file}`);
  }
});

console.log("\n🎯 Chrome Extension Requirements:");
console.log("   - icon16.png  (16×16)  - Toolbar icon");
console.log("   - icon48.png  (48×48)  - Extension management");
console.log("   - icon128.png (128×128) - Chrome Web Store");

console.log("\n📋 Manual Resize Steps:");
console.log(
  "1. Use your best source icon (android-chrome-512x512.png recommended)"
);
console.log("2. Go to https://imageresizer.com or use any image editor");
console.log("3. Resize to these exact sizes:");
console.log("   • 16×16 → save as icons/icon16.png");
console.log("   • 48×48 → save as icons/icon48.png");
console.log("   • 128×128 → save as icons/icon128.png");

console.log("\n💡 Alternative: If you have an image editor installed:");
console.log("   • GIMP (free): Image → Scale Image");
console.log("   • Paint.NET (Windows): Image → Resize");
console.log("   • Preview (Mac): Tools → Adjust Size");

console.log("\n✅ After resizing, run: npm run build");
console.log("   This will copy your new icons to the build directory");

console.log("\n🔧 Quick backup of old icons:");
const backupDir = "icons/backup";
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
  ["icon16.png", "icon48.png", "icon128.png"].forEach((icon) => {
    if (fs.existsSync(path.join(iconDir, icon))) {
      fs.copyFileSync(
        path.join(iconDir, icon),
        path.join(backupDir, `old-${icon}`)
      );
      console.log(`   ✅ Backed up ${icon} → backup/old-${icon}`);
    }
  });
  console.log("\n📦 Old icons backed up to icons/backup/");
} else {
  console.log("   (Backup already exists)");
}
