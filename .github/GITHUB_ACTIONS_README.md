# GitHub Actions CI/CD Pipeline Documentation

## Overview

This project includes a comprehensive GitHub Actions CI/CD pipeline with security protocols and best practices for Playwright test automation.

## Workflows

### 1. **Playwright Tests Pipeline** (`playwright-tests.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Daily schedule (2 AM UTC)

**Jobs:**

#### Security & Dependency Checks
- Runs `npm audit` for vulnerability scanning
- Checks for outdated packages
- Validates npm audit level (moderate)
- Environment: `ubuntu-latest` | Time: 15 min

#### Playwright Tests
- Matrix testing across multiple configurations:
  - **OS**: Ubuntu Latest
  - **Node versions**: 18, 20
  - **Browsers**: Chromium, Firefox, WebKit
- Installs Playwright browsers with dependencies
- Captures test reports and videos on failure
- Environment: `${{ matrix.os }}` | Time: 30 min

#### Test Results Publishing
- Collects all test artifacts
- Generates GitHub Step Summary
- Archives reports for 30 days

#### Code Quality Checks
- TypeScript compilation check
- File permission verification
- Environment: `ubuntu-latest` | Time: 15 min

#### Notifications
- Summarizes overall pipeline status
- Posts results to GitHub Actions

### 2. **Security Scanning** (`security.yml`)

**Triggers:**
- Push to `main` or `develop`
- Pull requests
- Weekly schedule (Sunday at midnight)

**Jobs:**

#### Dependency Scanning
- `npm audit` with JSON output
- Critical vulnerability detection (fails on critical)
- High vulnerability threshold (fails if > 2)
- Time: 15 min

#### Secret Scanning
- TruffleHog integration for secret detection
- Pattern matching for AWS keys, GitHub tokens
- Prevents credential leaks
- Time: 10 min

#### CodeQL Analysis
- GitHub's advanced code analysis
- Supports JavaScript and TypeScript
- SARIF format output
- Time: 20 min

#### Container Image Scanning (Optional)
- Trivy vulnerability scanner for Docker images
- Only runs if Dockerfile exists
- Uploads results to GitHub Security tab
- Time: 15 min

### 3. **Release & Deployment** (`release.yml`)

**Triggers:**
- Push to `main` with version tags (`v*`)
- Manual workflow dispatch with version input

**Jobs:**

#### Create Release
- Builds project (if build script exists)
- Runs tests before release
- Generates release notes
- Creates GitHub Release
- Time: 20 min

#### Publish Results
- Generates test execution report
- Archives reports for 90 days
- Time: 10 min

#### Notify Success
- Posts release completion summary
- Links to GitHub Release page
- Time: 5 min

## Security Features

### 🔐 Secrets Management
```yaml
# Use GitHub Secrets for sensitive data:
BASE_URL: ${{ secrets.BASE_URL }}
API_KEY: ${{ secrets.API_KEY }}
GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}  # Auto-provided
```

### 📦 Dependency Security
- `npm ci` (clean install) instead of `npm install`
- `npm audit` with severity levels
- Outdated package detection
- Lock file verification

### 🛡️ Code Security
- CodeQL analysis for code vulnerabilities
- Secret scanning (TruffleHog)
- Credential pattern detection
- File permission checks

### 🚫 Access Control
- Minimal permission scopes (`permissions` block)
- `security-events: write` for CodeQL
- `contents: write` for releases only
- Token isolation per job

### ⏱️ Resource Limits
- Timeout limits on all jobs (5-30 min)
- Concurrency control to prevent resource exhaustion
- Cancel in-progress jobs on new push

## Configuration

### Required Secrets (Optional)
None required for basic functionality, but recommended:

```bash
# Set in Repository > Settings > Secrets and variables > Actions
BASE_URL=https://www.usa.gov
API_KEY=your-api-key
```

### Environment Variables
- `CI=true` - Indicates CI environment
- `NODE_AUTH_TOKEN` - GitHub token for npm registry
- `GITHUB_TOKEN` - Auto-provided by GitHub

## Workflow Status Badge

Add to your README.md:

```markdown
[![Playwright Tests](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/playwright-tests.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/playwright-tests.yml)
```

## Viewing Results

### Test Reports
1. Go to **Actions** tab in GitHub
2. Click the workflow run
3. Scroll down to **Artifacts** section
4. Download `playwright-report-*` to view HTML report

### Security Scanning
1. Go to **Security** > **Code scanning alerts**
2. View CodeQL analysis results
3. Check **Dependabot alerts** for vulnerabilities

### Logs
1. Click workflow run
2. Expand job to see detailed logs
3. Search for specific test or error

## Best Practices Implemented

✅ **Caching**: Dependencies cached with `npm ci`  
✅ **Parallel Testing**: Multiple browser and Node versions  
✅ **Artifact Management**: Test reports archived for audit  
✅ **Fail-Fast**: Immediate failure on critical issues  
✅ **Concurrency**: Prevents duplicate job execution  
✅ **Security Scanning**: Multiple layers of vulnerability detection  
✅ **Scheduled Runs**: Weekly security and daily test execution  
✅ **Clear Documentation**: Step names and console output  
✅ **Error Handling**: `continue-on-error` for non-blocking checks  
✅ **Status Notifications**: Summary at end of pipeline  

## Troubleshooting

### Tests Timing Out
- Increase timeout in job `timeout-minutes`
- Check if website is down or slow
- Verify network in runner logs

### Security Check Failures
- Review `npm audit` output
- Update vulnerable packages: `npm update`
- Use `npm audit fix` cautiously

### Secret Scan False Positives
- Review TruffleHog results
- Add false positives to `.gitignore`
- Update credential patterns if needed

### CodeQL Errors
- Ensure Node.js is properly installed
- Check for TypeScript errors: `npx tsc --noEmit`
- Review CodeQL documentation

## Advanced Configuration

### Running Tests on Schedule
Modify cron in `playwright-tests.yml`:
```yaml
schedule:
  - cron: '0 2 * * *'  # Daily at 2 AM UTC
  # Monday-Friday: '0 2 * * 1-5'
  # Every hour: '0 * * * *'
```

### Matrix Customization
Add more configurations:
```yaml
matrix:
  os: [ubuntu-latest, windows-latest, macos-latest]
  node-version: [18, 20, 21]
```

### Custom Environment Setup
```yaml
- name: Custom Setup
  env:
    CUSTOM_VAR: value
  run: echo "Custom setup"
```

## Support & Resources

- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Playwright Testing Guide](https://playwright.dev/docs/ci)
- [Security Best Practices](https://docs.github.com/en/actions/security-guides)
- [Workflow Syntax Reference](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)

---

**Last Updated**: January 2, 2026  
**Maintainer**: Your Team
