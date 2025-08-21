# Security Policy

## Supported Versions

We actively support the following versions of NagMinder with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.1.x   | :white_check_mark: |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Privacy & Data Security

NagMinder is designed with privacy as a core principle:

- **No Data Collection**: We do not collect, store, or transmit any personal data
- **Local Storage Only**: All time tracking data remains on your device
- **No External Servers**: No data is sent to external servers or analytics services
- **Open Source**: All code is publicly available for security review
- **Minimal Permissions**: Only requests necessary Chrome API permissions

## Reporting a Vulnerability

If you discover a security vulnerability in NagMinder, please report it responsibly:

### Where to Report

- **GitHub Issues**: For non-sensitive issues, create a [GitHub issue](https://github.com/shotah/NagMinder/issues)
- **Email**: For sensitive security concerns, email the maintainer directly
- **Security Advisory**: Use GitHub's private security advisory feature

### What to Include

- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact assessment
- Suggested fix (if available)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Weekly updates on investigation progress
- **Resolution**: Security fixes prioritized and released as soon as possible

### What to Expect

- **Accepted Vulnerabilities**: Will be patched and released promptly
- **Declined Reports**: Will receive explanation and alternative suggestions
- **Credit**: Security researchers will be credited (unless anonymity is requested)

## Security Best Practices

When using NagMinder:

- Keep the extension updated to the latest version
- Only install from official sources (Chrome Web Store or GitHub releases)
- Review permissions before installation
- Report any suspicious behavior

## Extension Permissions Explained

NagMinder requests these Chrome permissions for legitimate functionality:

- **`storage`**: Store your settings and time tracking data locally
- **`tabs`**: Detect which websites you're visiting for time tracking
- **`idle`**: Pause tracking when your computer is idle

We do not request permissions for:

- Network access
- Browsing history
- Personal data access
- Cross-origin requests
