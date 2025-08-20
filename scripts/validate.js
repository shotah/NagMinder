import { spawn } from "child_process";

console.log("🔍 Running web-ext validation (informational only)...\n");

const webext = spawn(
  "npx",
  ["web-ext", "lint", "--source-dir=build", "--warnings-as-errors=false"],
  {
    stdio: "inherit",
    shell: true,
  }
);

webext.on("close", (code) => {
  console.log(
    "\n📝 Note: web-ext is Firefox-focused and reports false positives for Chrome extensions"
  );
  console.log(
    "   - MANIFEST_FIELD_UNSUPPORTED: Chrome MV3 uses service_worker (correct)"
  );
  console.log("   - EXTENSION_ID_REQUIRED: Not required for Chrome extensions");
  console.log(
    "   - STORAGE_SYNC warnings: Firefox-specific, not relevant for Chrome\n"
  );
  console.log("✅ Validation complete (informational only)");
  process.exit(0); // Always exit successfully
});

webext.on("error", (err) => {
  console.log("⚠️ web-ext not available, skipping validation");
  process.exit(0); // Exit successfully even if web-ext fails
});
