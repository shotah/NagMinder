#!/usr/bin/env node

import fs from "fs";

function rimraf(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`✅ Cleaned: ${dir}`);
  }
}

console.log("🧹 Cleaning build artifacts...");

// Clean directories
["build", "dist", "temp_package"].forEach(rimraf);

console.log("✅ Clean complete!");
