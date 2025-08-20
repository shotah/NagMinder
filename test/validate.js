// Simple validation tests for NagMinder Chrome Extension
// Run with: node test/validate.js

const fs = require('fs');

let errors = 0;
let warnings = 0;

function test(name, condition, message, isWarning = false) {
    if (condition) {
        console.log(`✅ ${name}`);
    } else {
        const symbol = isWarning ? '⚠️' : '❌';
        console.log(`${symbol} ${name}: ${message}`);
        if (isWarning) {
            warnings++;
        } else {
            errors++;
        }
    }
}

function fileExists(filePath) {
    return fs.existsSync(filePath);
}

function readJson(filePath) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
        return null;
    }
}

console.log('🔍 Validating NagMinder Extension...\n');

// Test 1: Required files exist
console.log('📁 File Structure:');
const requiredFiles = [
    'manifest.json',
    'background.js', 
    'content.js',
    'options.html',
    'options.js',
    'styles.css',
    'icons/icon16.png',
    'icons/icon48.png', 
    'icons/icon128.png'
];

requiredFiles.forEach(file => {
    test(`Required file: ${file}`, fileExists(file), 'File missing');
});

// Test 2: Manifest validation
console.log('\n📋 Manifest Validation:');
const manifest = readJson('manifest.json');

test('Manifest JSON valid', manifest !== null, 'Invalid JSON syntax');

if (manifest) {
    test('Manifest version 3', manifest.manifest_version === 3, 'Should use manifest v3');
    test('Has name', manifest.name && manifest.name.length > 0, 'Name is required');
    test('Has description', manifest.description && manifest.description.length > 0, 'Description is required');
    test('Has version', manifest.version && manifest.version.match(/^\d+\.\d+\.\d+$/), 'Version should be semver format');
    test('Has required permissions', manifest.permissions && manifest.permissions.includes('storage'), 'Missing storage permission');
    test('Has background service worker', manifest.background && manifest.background.service_worker, 'Missing background service worker');
    test('Has content scripts', manifest.content_scripts && manifest.content_scripts.length > 0, 'Missing content scripts');
    test('Has icons', manifest.icons && Object.keys(manifest.icons).length >= 3, 'Should have at least 3 icon sizes');
    
    // Check description length (Chrome Web Store limit)
    if (manifest.description) {
        test('Description length OK', manifest.description.length <= 132, `Description too long (${manifest.description.length}/132 chars)`, true);
    }
}

// Test 3: JavaScript syntax validation
console.log('\n🔧 JavaScript Validation:');
const jsFiles = ['background.js', 'content.js', 'options.js'];

jsFiles.forEach(file => {
    if (fileExists(file)) {
        try {
            const content = fs.readFileSync(file, 'utf8');
            
            // Basic syntax checks
            test(`${file} has no obvious syntax errors`, !content.includes('import '), 'ES6 imports not supported in Chrome extensions');
            test(`${file} uses chrome APIs properly`, content.includes('chrome.'), `Should use chrome APIs`);
            
            // Check for common issues
            if (content.includes('console.log')) {
                test(`${file} debug logging`, false, 'Remove console.log statements for production', true);
            }
            
            // Check for new features
            if (file === 'background.js') {
                test(`${file} has year tracking`, content.includes('year'), 'Should track yearly stats');
                test(`${file} has all-time tracking`, content.includes('allTime'), 'Should track all-time stats');
            }
            if (file === 'content.js') {
                test(`${file} has expandable UI`, content.includes('nm-expand'), 'Should have expandable stats UI');
            }
            
        } catch (e) {
            test(`${file} readable`, false, `Cannot read file: ${e.message}`);
        }
    }
});

// Test 4: CSS validation
console.log('\n🎨 CSS Validation:');
if (fileExists('styles.css')) {
    const css = fs.readFileSync('styles.css', 'utf8');
    test('CSS has nagminder styles', css.includes('#nagminder-bar'), 'Missing main bar styles');
    test('CSS has high z-index', css.includes('z-index') && css.includes('999'), 'Bar should have high z-index');
}

// Test 5: Icon validation
console.log('\n🖼️  Icon Validation:');
['16', '48', '128'].forEach(size => {
    const iconPath = `icons/icon${size}.png`;
    if (fileExists(iconPath)) {
        const stats = fs.statSync(iconPath);
        test(`Icon ${size}x${size} size`, stats.size > 100, `Icon seems too small (${stats.size} bytes)`, true);
    }
});

// Summary
console.log('\n📊 Summary:');
console.log(`✅ Tests passed: ${requiredFiles.length + (manifest ? 9 : 0) + jsFiles.length * 2 + 2 + 3 - errors - warnings}`);
if (warnings > 0) {
    console.log(`⚠️  Warnings: ${warnings}`);
}
if (errors > 0) {
    console.log(`❌ Errors: ${errors}`);
    process.exit(1);
} else {
    console.log('\n🎉 All validations passed! Extension is ready for packaging.');
}
