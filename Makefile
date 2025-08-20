# NagMinder Chrome Extension Makefile

# Variables
EXTENSION_NAME = NagMinder
VERSION = $(shell grep '"version"' manifest.json | sed 's/.*"version": "\([^"]*\)".*/\1/')
BUILD_DIR = build
DIST_DIR = dist
PACKAGE_NAME = $(EXTENSION_NAME)-v$(VERSION)

# Default target
.PHONY: all
all: help

.PHONY: help
help:
	@echo "NagMinder Chrome Extension - Available Commands:"
	@echo ""
	@echo "  make lint          - Run linting checks"
	@echo "  make test          - Run tests"
	@echo "  make build         - Build extension for development"
	@echo "  make package       - Create ZIP package for Chrome Web Store"
	@echo "  make clean         - Clean build artifacts"
	@echo "  make install-deps  - Install development dependencies"
	@echo "  make validate      - Validate manifest and check for issues"
	@echo "  make dev           - Build and reload extension for development"
	@echo ""

.PHONY: install-deps
install-deps:
	@echo "Installing development dependencies..."
	@if command -v npm >/dev/null 2>&1; then \
		if [ ! -f package.json ]; then \
			npm init -y; \
			npm install --save-dev eslint prettier web-ext; \
		else \
			npm install; \
		fi; \
	else \
		echo "npm not found. Please install Node.js and npm first."; \
		exit 1; \
	fi
	@echo "Dependencies installed!"

.PHONY: lint
lint:
	@echo "Running linting checks..."
	@if command -v eslint >/dev/null 2>&1; then \
		eslint . --ext .js --ignore-pattern node_modules --ignore-pattern build --ignore-pattern dist; \
	else \
		echo "ESLint not found. Run 'make install-deps' first."; \
		exit 1; \
	fi

.PHONY: validate
validate:
	@echo "Validating extension..."
	@if command -v web-ext >/dev/null 2>&1; then \
		web-ext lint --source-dir=. --ignore-files=node_modules,build,dist,Makefile,package*.json,*.md,the_plan.md; \
	else \
		echo "web-ext not found. Run 'make install-deps' first."; \
	fi
	@echo "Checking manifest syntax..."
	@node -e "try { JSON.parse(require('fs').readFileSync('manifest.json', 'utf8')); console.log('✓ manifest.json is valid JSON'); } catch(e) { console.error('✗ manifest.json has syntax errors:', e.message); process.exit(1); }"

.PHONY: test
test: validate lint
	@echo "Running tests..."
	@echo "✓ All validation checks passed"

.PHONY: clean
clean:
	@echo "Cleaning build artifacts..."
	@rm -rf $(BUILD_DIR)
	@rm -rf $(DIST_DIR)
	@rm -rf node_modules
	@echo "Clean complete!"

.PHONY: build
build: clean validate
	@echo "Building extension..."
	@mkdir -p $(BUILD_DIR)
	@cp manifest.json $(BUILD_DIR)/
	@cp *.js $(BUILD_DIR)/
	@cp *.css $(BUILD_DIR)/
	@cp *.html $(BUILD_DIR)/
	@cp -r icons $(BUILD_DIR)/
	@echo "✓ Build complete in $(BUILD_DIR)/"

.PHONY: package
package: build
	@echo "Creating package for Chrome Web Store..."
	@mkdir -p $(DIST_DIR)
	@cd $(BUILD_DIR) && zip -r ../$(DIST_DIR)/$(PACKAGE_NAME).zip . -x "*.DS_Store" "*.git*" "node_modules/*" "*.md"
	@echo "✓ Package created: $(DIST_DIR)/$(PACKAGE_NAME).zip"
	@echo ""
	@echo "Ready for Chrome Web Store upload!"
	@echo "File: $(DIST_DIR)/$(PACKAGE_NAME).zip"
	@echo "Size: $$(du -h $(DIST_DIR)/$(PACKAGE_NAME).zip | cut -f1)"

.PHONY: dev
dev: build
	@echo "Development build complete!"
	@echo "To load in Chrome:"
	@echo "1. Go to chrome://extensions/"
	@echo "2. Enable 'Developer mode'"
	@echo "3. Click 'Load unpacked' and select: $(BUILD_DIR)/"

.PHONY: dev-reload
dev-reload:
	@echo "Reloading extension..."
	@if command -v web-ext >/dev/null 2>&1; then \
		web-ext run --source-dir=$(BUILD_DIR) --start-url="about:debugging#/runtime/this-firefox" --browser-console; \
	else \
		echo "For Chrome: Go to chrome://extensions/ and click reload on NagMinder"; \
	fi

# Quick shortcuts
.PHONY: zip
zip: package

.PHONY: check
check: test

# Version bump helpers
.PHONY: version-patch version-minor version-major
version-patch version-minor version-major:
	@if command -v npm >/dev/null 2>&1; then \
		npm version $(@:version-%=%) --no-git-tag-version; \
		$(MAKE) _update-manifest-version; \
	else \
		echo "npm not found. Please install Node.js to use version bumping."; \
	fi

.PHONY: _update-manifest-version
_update-manifest-version:
	@NEW_VERSION=$$(node -p "require('./package.json').version"); \
	sed -i.bak 's/"version": "[^"]*"/"version": "'$$NEW_VERSION'"/' manifest.json && \
	rm manifest.json.bak && \
	echo "Updated manifest.json to version $$NEW_VERSION"

# Platform-specific install instructions
.PHONY: install-dev-tools
install-dev-tools:
	@echo "Installing development tools..."
	@if command -v brew >/dev/null 2>&1; then \
		echo "Installing via Homebrew..."; \
		brew install node; \
	elif command -v apt-get >/dev/null 2>&1; then \
		echo "Installing via apt..."; \
		sudo apt-get update && sudo apt-get install -y nodejs npm; \
	elif command -v yum >/dev/null 2>&1; then \
		echo "Installing via yum..."; \
		sudo yum install -y nodejs npm; \
	else \
		echo "Please install Node.js manually from https://nodejs.org/"; \
	fi
	@$(MAKE) install-deps
