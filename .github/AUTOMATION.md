# GitHub Actions Automation

This document describes the CI/CD setup for NagMinder and plans for future automation.

## Current Workflows

### 🔄 CI Workflow (`.github/workflows/ci.yml`)

**Triggers:**

- Push to `main` or `develop` branches
- Pull requests to `main` branch

**Jobs:**
1. **Test Matrix** - Runs on Node.js 18.x and 20.x
   - Install dependencies
   - Run ESLint
   - Run web-ext validation
   - Run custom validation tests
   - Build extension
   - Upload build artifacts

2. **Package** (main branch only)
   - Create Chrome Web Store package
   - Check package size
   - Upload package artifact

3. **Security**
   - npm audit for vulnerabilities
   - Check for sensitive files
   - Scan for hardcoded secrets

### 🚀 Release Workflow (`.github/workflows/release.yml`)

**Triggers:**
- Git tags matching `v*` (e.g., `v1.0.0`)

**Jobs:**
1. **Release**
   - Run full test suite
   - Create package
   - Create GitHub release with changelog
   - Upload package as release asset

## Future Automation Plans

### 🌐 Chrome Web Store Auto-Publishing

Once you've published manually the first time, we can enable auto-publishing:

**Required Setup:**
1. Get Chrome Web Store API credentials
2. Add secrets to GitHub repository
3. Uncomment the auto-publish section in `release.yml`

**Secrets needed:**
```
CHROME_EXTENSION_ID=your-extension-id
CHROME_CLIENT_ID=your-oauth-client-id  
CHROME_CLIENT_SECRET=your-oauth-client-secret
CHROME_REFRESH_TOKEN=your-refresh-token
```

**OR using Plasmo BPP:**
```
SUBMIT_KEYS={"chrome": {"zip": "path/to/zip", "clientId": "...", "clientSecret": "...", "refreshToken": "..."}}
```

### 📊 Additional Future Workflows

1. **Weekly Dependency Updates**
   - Automated Dependabot PRs
   - Security updates

2. **Performance Monitoring**
   - Package size tracking
   - Performance regression detection

3. **Cross-Browser Testing**
   - Test on Firefox, Edge
   - Different browser versions

## Manual Release Process

Until auto-publishing is set up:

1. **Update version:**
   ```bash
   npm version patch|minor|major
   ```

2. **Create and push tag:**
   ```bash
   git push origin main --tags
   ```

3. **GitHub Actions will:**
   - Run tests
   - Create GitHub release
   - Build and attach package

4. **Manual Chrome Web Store steps:**
   - Download package from GitHub release
   - Upload to Chrome Web Store Developer Console
   - Update store listing if needed
   - Submit for review

## Troubleshooting

### CI Failures

**Common issues:**
- ESLint errors: Run `npm run lint:fix`
- Test failures: Run `npm run test` locally
- Build failures: Check file permissions and paths

**Node.js version issues:**
- Update `.nvmrc` if needed
- Test locally with both Node 18 and 20

### Release Issues

**Tag creation:**
```bash
# List tags
git tag -l

# Delete tag if needed
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0
```

**Release recreation:**
- Delete release from GitHub
- Delete and recreate tag
- Push tag again

## Security Considerations

- Never commit API keys or secrets
- Use GitHub repository secrets for sensitive data
- Regular security audits with `npm audit`
- Scan for hardcoded credentials before release
