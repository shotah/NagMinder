#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🏗️  Building extension...');

// Create build directory
const buildDir = 'build';
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Files to copy
const filesToCopy = [
  'manifest.json',
  'background.js', 
  'content.js',
  'options.html',
  'options.js',
  'styles.css'
];

// Copy files
filesToCopy.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(buildDir, file));
    console.log(`✅ Copied: ${file}`);
  } else {
    console.log(`⚠️  Missing: ${file}`);
  }
});

// Copy icons directory
if (fs.existsSync('icons')) {
  const iconsDir = path.join(buildDir, 'icons');
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir);
  }
  
  const iconFiles = fs.readdirSync('icons');
  iconFiles.forEach(icon => {
    fs.copyFileSync(
      path.join('icons', icon), 
      path.join(iconsDir, icon)
    );
  });
  console.log(`✅ Copied: icons/ (${iconFiles.length} files)`);
}

// Optional: Copy LICENSE
if (fs.existsSync('LICENSE')) {
  fs.copyFileSync('LICENSE', path.join(buildDir, 'LICENSE'));
  console.log('✅ Copied: LICENSE');
}

console.log(`\n🎉 Build complete!`);
console.log(`📁 Files ready in: ${buildDir}/`);
console.log(`\n🔧 To load in Chrome:`);
console.log(`   1. Go to chrome://extensions/`);
console.log(`   2. Enable 'Developer mode'`);
console.log(`   3. Click 'Load unpacked' → select: ${buildDir}/`);
