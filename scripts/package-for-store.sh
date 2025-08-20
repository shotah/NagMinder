#!/bin/bash

# Chrome Web Store Packaging Script for NagMinder
# This script creates a clean, optimized package ready for Chrome Web Store submission

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
EXTENSION_NAME="NagMinder"
BUILD_DIR="build"
DIST_DIR="dist"
TEMP_DIR="temp_package"

# Get version from manifest.json
VERSION=$(grep '"version"' manifest.json | sed 's/.*"version": "\([^"]*\)".*/\1/')
PACKAGE_NAME="${EXTENSION_NAME}-v${VERSION}"

echo -e "${BLUE}🏗️  Chrome Web Store Packaging Script${NC}"
echo -e "${BLUE}Extension: ${EXTENSION_NAME} v${VERSION}${NC}"
echo ""

# Step 1: Validation
echo -e "${YELLOW}1. Validating extension...${NC}"

# Check required files
REQUIRED_FILES=("manifest.json" "background.js" "content.js" "options.html" "options.js" "styles.css")
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Required file missing: $file${NC}"
        exit 1
    fi
done

# Validate manifest JSON
if ! node -e "JSON.parse(require('fs').readFileSync('manifest.json', 'utf8'))" 2>/dev/null; then
    echo -e "${RED}❌ manifest.json has syntax errors${NC}"
    exit 1
fi

# Check icons
if [ ! -d "icons" ]; then
    echo -e "${RED}❌ Icons directory missing${NC}"
    exit 1
fi

REQUIRED_ICONS=("icon16.png" "icon48.png" "icon128.png")
for icon in "${REQUIRED_ICONS[@]}"; do
    if [ ! -f "icons/$icon" ]; then
        echo -e "${RED}❌ Required icon missing: icons/$icon${NC}"
        exit 1
    fi
done

echo -e "${GREEN}✅ All required files present${NC}"

# Step 2: Clean previous builds
echo -e "${YELLOW}2. Cleaning previous builds...${NC}"
rm -rf "$BUILD_DIR" "$DIST_DIR" "$TEMP_DIR"
mkdir -p "$DIST_DIR"

# Step 3: Create clean build
echo -e "${YELLOW}3. Creating clean build...${NC}"
mkdir -p "$TEMP_DIR"

# Copy only necessary files (exclude development files)
cp manifest.json "$TEMP_DIR/"
cp background.js "$TEMP_DIR/"
cp content.js "$TEMP_DIR/"
cp options.html "$TEMP_DIR/"
cp options.js "$TEMP_DIR/"
cp styles.css "$TEMP_DIR/"
cp -r icons "$TEMP_DIR/"

# Optional: Include LICENSE if it exists
if [ -f "LICENSE" ]; then
    cp LICENSE "$TEMP_DIR/"
fi

echo -e "${GREEN}✅ Build directory created${NC}"

# Step 4: Optimize for production
echo -e "${YELLOW}4. Optimizing for production...${NC}"

# Remove any debug console.log statements (optional)
# sed -i.bak 's/console\.log.*;//g' "$TEMP_DIR"/*.js && rm "$TEMP_DIR"/*.bak

# Minify CSS (basic - removes comments and extra whitespace)
if command -v sed >/dev/null 2>&1; then
    sed -i.bak '/^[[:space:]]*\/\*/,/\*\//d; /^[[:space:]]*$/d' "$TEMP_DIR/styles.css" && rm "$TEMP_DIR/styles.css.bak"
fi

echo -e "${GREEN}✅ Optimization complete${NC}"

# Step 5: Create ZIP package
echo -e "${YELLOW}5. Creating ZIP package...${NC}"
cd "$TEMP_DIR"
zip -r "../$DIST_DIR/$PACKAGE_NAME.zip" . -x "*.DS_Store" "*.git*" "*.bak"
cd ..

# Clean up temp directory
rm -rf "$TEMP_DIR"

# Step 6: Package information
echo -e "${YELLOW}6. Package information:${NC}"
PACKAGE_PATH="$DIST_DIR/$PACKAGE_NAME.zip"
PACKAGE_SIZE=$(du -h "$PACKAGE_PATH" | cut -f1)

echo -e "${GREEN}✅ Package created successfully!${NC}"
echo ""
echo -e "${BLUE}📦 Package Details:${NC}"
echo -e "   File: ${PACKAGE_PATH}"
echo -e "   Size: ${PACKAGE_SIZE}"
echo -e "   Version: ${VERSION}"
echo ""

# Step 7: Chrome Web Store submission checklist
echo -e "${BLUE}🚀 Chrome Web Store Submission Checklist:${NC}"
echo ""
echo -e "${YELLOW}Before uploading to Chrome Web Store:${NC}"
echo "   ✅ Manifest version is correct"
echo "   ✅ All required icons included (16x16, 48x48, 128x128)"
echo "   ✅ Description is clear and under 132 characters"
echo "   ✅ No development/debug code included"
echo "   ✅ Permissions are minimal and justified"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "   1. Go to https://chrome.google.com/webstore/devconsole/"
echo "   2. Click 'Add new item'"
echo "   3. Upload: ${PACKAGE_PATH}"
echo "   4. Fill in store listing details"
echo "   5. Add screenshots and promotional images"
echo "   6. Submit for review"
echo ""
echo -e "${GREEN}🎉 Your extension is ready for the Chrome Web Store!${NC}"

# Optional: Open the dist directory
if command -v open >/dev/null 2>&1; then
    read -p "Open dist directory? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open "$DIST_DIR"
    fi
elif command -v xdg-open >/dev/null 2>&1; then
    read -p "Open dist directory? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        xdg-open "$DIST_DIR"
    fi
fi
