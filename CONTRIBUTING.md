# Contributing to NagMinder

Thank you for your interest in contributing to NagMinder! This document provides guidelines for contributing to the project.

## Development Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/NagMinder.git
   cd NagMinder
   ```

2. **Install dependencies:**

   ```bash
   make install-deps
   # or
   npm install
   ```

3. **Load extension for development:**
   ```bash
   make dev
   ```
   Then follow the instructions to load the unpacked extension in Chrome.

## Development Workflow

### Making Changes

1. **Create a feature branch:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Test your changes:**

   ```bash
   make test
   ```

4. **Build and test locally:**
   ```bash
   make dev
   ```

### Code Standards

- **JavaScript**: Follow ESLint rules (see `.eslintrc` in package.json)
- **Formatting**: Use Prettier for consistent formatting
- **Comments**: Add JSDoc comments for functions and complex logic
- **Permissions**: Only request necessary Chrome permissions

### Testing

- Run `npm run test` before committing
- Test on multiple websites from the tracked domains list
- Test snooze and pause functionality
- Verify options page works correctly
- All GitHub Actions checks must pass

## Contributing Guidelines

### Types of Contributions

1. **Bug Fixes**
   - Include steps to reproduce the bug
   - Add test cases if applicable
   - Update documentation if needed

2. **New Features**
   - Discuss the feature in an issue first
   - Keep features focused and minimal
   - Update README.md and options page as needed

3. **Documentation**
   - Fix typos, improve clarity
   - Add examples or screenshots
   - Update setup instructions

### Submitting Changes

1. **Commit your changes:**

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

   Use conventional commit messages:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `refactor:` for code refactoring
   - `test:` for adding tests

2. **Push to your fork:**

   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request:**
   - Provide a clear title and description
   - Reference any related issues
   - Include screenshots for UI changes
   - Wait for GitHub Actions checks to pass
   - Address any feedback from code review

## Architecture Notes

### File Structure

- `manifest.json` - Extension manifest (MV3)
- `background.js` - Service worker for time tracking
- `content.js` - Injected script for nag bar
- `options.html/js` - Settings page
- `styles.css` - Nag bar styling
- `icons/` - Extension icons

### Key Concepts

- **Time Tracking**: Background service worker increments counters every `tickSeconds`
- **Idle Detection**: Uses `chrome.idle` API to pause tracking when user is away
- **Storage**: Settings in `chrome.storage.sync`, data in `chrome.storage.local`
- **Date Boundaries**: Auto-resets daily/weekly/monthly counters

### Adding New Domains

To add support for new social media sites:

1. Add domain to `DEFAULT_SETTINGS.domains` in `background.js`
2. Test the domain matching logic
3. Update README.md with the new domain

### Customizing Messages

Edit the `DEFAULT_MESSAGES` array in `content.js` or consider making it configurable via options page.

## Review Process

1. **Automated Checks**: PRs run linting and validation
2. **Manual Review**: Maintainers review code and test functionality
3. **Testing**: Changes are tested on multiple browsers/sites
4. **Documentation**: README and docs are updated as needed

## Questions?

- **Open an issue** for bug reports or feature requests
- **Start a discussion** for general questions or ideas
- **Check existing issues** before creating new ones

## License

By contributing to NagMinder, you agree that your contributions will be licensed under the MIT License.
