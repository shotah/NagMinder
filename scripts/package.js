import fs from "fs";
import path from "path";
import { execSync } from "child_process";

console.log("📦 Creating Chrome Web Store package...");

// Read version from manifest
const manifest = JSON.parse(fs.readFileSync("manifest.json", "utf8"));
const version = manifest.version;
const packageName = `NagMinder-v${version}`;

// Ensure dist directory exists
const distDir = "dist";
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Check if build directory exists
if (!fs.existsSync("build")) {
  console.log('❌ Build directory not found. Run "npm run build" first.');
  process.exit(1);
}

// Create ZIP package
const zipPath = path.join(distDir, `${packageName}.zip`);

try {
  // Try using 7zip first (if available on Windows)
  try {
    execSync(`7z a "${zipPath}" "./build/*" -mx9`, { stdio: "pipe" });
    console.log("✅ Package created with 7zip");
  } catch (e) {
    // Fallback to PowerShell on Windows or zip on Unix
    if (process.platform === "win32") {
      execSync(
        `powershell -Command "Compress-Archive -Path './build/*' -DestinationPath '${zipPath}' -Force"`,
        { stdio: "pipe" }
      );
      console.log("✅ Package created with PowerShell");
    } else {
      execSync(
        `cd build && zip -r "../${zipPath}" . -x "*.DS_Store" "*.git*"`,
        { stdio: "pipe" }
      );
      console.log("✅ Package created with zip");
    }
  }

  // Get package size
  const stats = fs.statSync(zipPath);
  const sizeKB = Math.round(stats.size / 1024);

  console.log("\n🎉 Package ready for Chrome Web Store!");
  console.log(`📦 File: ${zipPath}`);
  console.log(`📏 Size: ${sizeKB} KB`);
  console.log(`🔢 Version: ${version}`);

  console.log("\n🚀 Next steps:");
  console.log("   1. Go to https://chrome.google.com/webstore/devconsole/");
  console.log('   2. Click "Add new item"');
  console.log(`   3. Upload: ${zipPath}`);
  console.log("   4. Fill in store listing details");
  console.log("   5. Submit for review");
} catch (error) {
  console.error("❌ Failed to create package:", error.message);
  console.log("\n💡 Manual fallback:");
  console.log("   1. Manually zip the contents of ./build/");
  console.log(`   2. Name it: ${packageName}.zip`);
  console.log(`   3. Save to: ${distDir}/`);
  process.exit(1);
}
