# Chrome Web Store Packaging Script for NagMinder (PowerShell)
# This script creates a clean, optimized package ready for Chrome Web Store submission

param(
    [switch]$OpenDist = $false
)

# Configuration
$ExtensionName = "NagMinder"
$BuildDir = "build"
$DistDir = "dist"
$TempDir = "temp_package"

# Colors for output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Write-Success { Write-ColorOutput Green $args }
function Write-Warning { Write-ColorOutput Yellow $args }
function Write-Error { Write-ColorOutput Red $args }
function Write-Info { Write-ColorOutput Cyan $args }

# Get version from manifest.json
try {
    $manifest = Get-Content "manifest.json" | ConvertFrom-Json
    $Version = $manifest.version
    $PackageName = "${ExtensionName}-v${Version}"
} catch {
    Write-Error "❌ Failed to read version from manifest.json"
    exit 1
}

Write-Info "🏗️  Chrome Web Store Packaging Script"
Write-Info "Extension: $ExtensionName v$Version"
Write-Output ""

# Step 1: Validation
Write-Warning "1. Validating extension..."

# Check required files
$RequiredFiles = @("manifest.json", "background.js", "content.js", "options.html", "options.js", "styles.css")
foreach ($file in $RequiredFiles) {
    if (-not (Test-Path $file)) {
        Write-Error "❌ Required file missing: $file"
        exit 1
    }
}

# Check icons directory
if (-not (Test-Path "icons" -PathType Container)) {
    Write-Error "❌ Icons directory missing"
    exit 1
}

$RequiredIcons = @("icon16.png", "icon48.png", "icon128.png")
foreach ($icon in $RequiredIcons) {
    if (-not (Test-Path "icons/$icon")) {
        Write-Error "❌ Required icon missing: icons/$icon"
        exit 1
    }
}

Write-Success "✅ All required files present"

# Step 2: Clean previous builds
Write-Warning "2. Cleaning previous builds..."
Remove-Item -Path $BuildDir, $DistDir, $TempDir -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $DistDir -Force | Out-Null

# Step 3: Create clean build
Write-Warning "3. Creating clean build..."
New-Item -ItemType Directory -Path $TempDir -Force | Out-Null

# Copy only necessary files
Copy-Item "manifest.json" -Destination $TempDir
Copy-Item "background.js" -Destination $TempDir
Copy-Item "content.js" -Destination $TempDir
Copy-Item "options.html" -Destination $TempDir
Copy-Item "options.js" -Destination $TempDir
Copy-Item "styles.css" -Destination $TempDir
Copy-Item "icons" -Destination $TempDir -Recurse

# Optional: Include LICENSE if it exists
if (Test-Path "LICENSE") {
    Copy-Item "LICENSE" -Destination $TempDir
}

Write-Success "✅ Build directory created"

# Step 4: Optimize for production
Write-Warning "4. Optimizing for production..."

# Basic CSS minification (remove empty lines and comments)
$cssPath = "$TempDir/styles.css"
if (Test-Path $cssPath) {
    $css = Get-Content $cssPath -Raw
    $css = $css -replace '/\*[\s\S]*?\*/', ''  # Remove CSS comments
    $css = $css -replace '\r?\n\s*\r?\n', "`n"  # Remove empty lines
    Set-Content -Path $cssPath -Value $css.Trim()
}

Write-Success "✅ Optimization complete"

# Step 5: Create ZIP package
Write-Warning "5. Creating ZIP package..."

$PackagePath = "$DistDir/$PackageName.zip"
Compress-Archive -Path "$TempDir/*" -DestinationPath $PackagePath -Force

# Clean up temp directory
Remove-Item -Path $TempDir -Recurse -Force

# Step 6: Package information
Write-Warning "6. Package information:"
$PackageSize = [math]::Round((Get-Item $PackagePath).Length / 1KB, 2)

Write-Success "✅ Package created successfully!"
Write-Output ""
Write-Info "📦 Package Details:"
Write-Output "   File: $PackagePath"
Write-Output "   Size: $PackageSize KB"
Write-Output "   Version: $Version"
Write-Output ""

# Step 7: Chrome Web Store submission checklist
Write-Info "🚀 Chrome Web Store Submission Checklist:"
Write-Output ""
Write-Warning "Before uploading to Chrome Web Store:"
Write-Output "   ✅ Manifest version is correct"
Write-Output "   ✅ All required icons included (16x16, 48x48, 128x128)"
Write-Output "   ✅ Description is clear and under 132 characters"
Write-Output "   ✅ No development/debug code included"
Write-Output "   ✅ Permissions are minimal and justified"
Write-Output ""
Write-Warning "Next steps:"
Write-Output "   1. Go to https://chrome.google.com/webstore/devconsole/"
Write-Output "   2. Click 'Add new item'"
Write-Output "   3. Upload: $PackagePath"
Write-Output "   4. Fill in store listing details"
Write-Output "   5. Add screenshots and promotional images"
Write-Output "   6. Submit for review"
Write-Output ""
Write-Success "🎉 Your extension is ready for the Chrome Web Store!"

# Optional: Open the dist directory
if ($OpenDist -or (Read-Host "Open dist directory? (y/n)") -eq "y") {
    Invoke-Item $DistDir
}
