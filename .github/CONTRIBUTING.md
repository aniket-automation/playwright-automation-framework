# Contributing Guidelines

Thank you for contributing to the Playwright Test Automation project! Please follow these guidelines to maintain code quality and consistency.

## 🚦 Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch: `git checkout -b feature/your-feature`
4. **Make** your changes
5. **Test** thoroughly: `npm test`
6. **Commit** with descriptive messages
7. **Push** to your branch
8. **Create** a Pull Request

## 📋 Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org):

```
type(scope): subject

body

footer
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `test`: Tests
- `chore`: Maintenance
- `perf`: Performance
- `refactor`: Code refactoring

### Examples
```bash
git commit -m "feat(search): add search result validation"
git commit -m "fix(navigation): correct primary nav selector"
git commit -m "docs(readme): update installation steps"
git commit -m "test(accessibility): add keyboard navigation tests"
```

## 🧪 Testing Requirements

### Before Submitting PR
```bash
# Run all tests
npm test

# Run tests in headed mode
npm run test:headed

# Check TypeScript
npx tsc --noEmit

# Run security audit
npm audit
```

### New Tests Should
- ✅ Have clear, descriptive names
- ✅ Test one thing only
- ✅ Use helper functions for reusability
- ✅ Have appropriate assertions
- ✅ Be independent (no test dependencies)
- ✅ Clean up after themselves

### Example Test
```typescript
test('Search form should accept and process input', async ({ page }) => {
  // Arrange: Set up test data
  const searchQuery = 'passport';
  
  // Act: Perform action
  const isVisible = await searchHelpers.verifySearchBoxVisible(page);
  expect(isVisible).toBeTruthy();
  
  // Assert: Verify result
  await searchHelpers.performSearch(page, searchQuery);
  const results = await pageHelpers.getPageURL(page);
  expect(results.length).toBeGreaterThan(0);
});
```

## 📝 Code Style

### TypeScript/JavaScript
- Use **camelCase** for variables and functions
- Use **PascalCase** for classes and interfaces
- Use **UPPER_SNAKE_CASE** for constants
- Keep lines under 100 characters
- Use meaningful variable names

```typescript
// ✅ Good
const searchInputSelector = 'input[role="searchbox"]';
async function verifyPageLoaded(page: Page): Promise<boolean> {
  return await page.locator('body').isVisible();
}

// ❌ Bad
const s = 'input[role="searchbox"]';
async function check(p) {
  return await p.locator('body').isVisible();
}
```

### Comments
- Explain **WHY**, not what
- Use JSDoc for public functions
- Keep comments concise

```typescript
// ✅ Good
// Wait for network requests to complete before assertion
// as lazy-loaded content may not be immediately available
await page.waitForLoadState('networkidle');

// ❌ Bad
// Wait for network idle
await page.waitForLoadState('networkidle');
```

## 🏗️ Architecture Guidelines

### Helper Functions
- Create new helpers in `/tests/helpers/`
- Export as named functions or objects
- Add TypeScript types
- Document parameters and return types

```typescript
// ✅ Good
export async function verifySearchBoxVisible(page: Page): Promise<boolean> {
  const searchInput = page.getByRole('searchbox', { name: /search/i });
  return await searchInput.isVisible().catch(() => false);
}

// ❌ Bad
export const check = (p) => p.locator('input').isVisible();
```

### Test Data
- Keep in `/tests/data/test-data.ts`
- Use meaningful variable names
- Add comments for non-obvious data

```typescript
// ✅ Good
export const searchTestData = [
  { query: 'passport', expectedMinResults: 5 },
  { query: 'benefits', expectedMinResults: 10 }
];

// ❌ Bad
export const data = ['passport', 'benefits'];
```

### Selectors
- Use **accessibility attributes** first (getByRole, getByLabel)
- Use **data-testid** for hard-to-find elements
- Avoid overly specific CSS selectors
- Document why if non-standard

```typescript
// ✅ Good (in priority order)
page.getByRole('button', { name: 'Search' })
page.getByLabel('Search')
page.getByTestId('search-button')
page.locator('[data-testid="search-button"]')

// ❌ Bad
page.locator('div.header > form > button:nth-child(3)')
```

## 🔒 Security

### Secret Management
- ✅ Use GitHub Secrets for sensitive data
- ✅ Add `.env` to `.gitignore`
- ✅ Review before committing
- ❌ Never commit credentials
- ❌ Never log sensitive data

### Dependency Updates
1. Check for vulnerabilities: `npm audit`
2. Review package changes: `npm outdated`
3. Test thoroughly before merging
4. Update lock file: `npm ci`

## 📊 Pull Request Process

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Testing
- [ ] Tests pass locally
- [ ] New tests added
- [ ] No console errors

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No breaking changes
```

### Reviewers Will Check
- ✅ Code quality and style
- ✅ Test coverage
- ✅ Security implications
- ✅ Documentation accuracy
- ✅ Performance impact

## 🐛 Reporting Issues

### Issue Template
```markdown
## Description
Clear description of the issue

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: macOS/Windows/Linux
- Node: 18/20
- Browser: Chromium/Firefox/WebKit
```

## 📚 Documentation

### When to Update Docs
- [ ] Adding new test category
- [ ] Changing test execution process
- [ ] Adding new helper function
- [ ] Updating configuration
- [ ] Modifying CI/CD pipeline

### Documentation Files
- `README.md` - Main project documentation
- `.github/GITHUB_ACTIONS_README.md` - CI/CD pipeline details
- `playwright.config.ts` - Inline comments for complex config
- Helper files - JSDoc comments

## ✅ Quality Standards

### Code Coverage
- Aim for 80%+ coverage
- Focus on critical paths
- Test edge cases

### Performance
- Tests should run in < 5 min total
- Single test < 30 seconds
- Parallel execution preferred

### Accessibility
- Use semantic HTML selectors
- Test keyboard navigation
- Consider screen reader compatibility

## 🎓 Resources

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Test Automation Patterns](https://testautomationu.applitools.com)
- [JavaScript Style Guide](https://airbnb.io/javascript)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 🆘 Getting Help

- **Documentation**: Check README and GITHUB_ACTIONS_README.md
- **Issues**: Search existing issues or create new one
- **Discussions**: Start a discussion for questions
- **Code Review**: Ask maintainers during PR review

## 🎉 Recognition

Contributors will be recognized in:
- GitHub Contributors page
- Release notes for major contributions
- Project documentation

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for making this project better!** 🙏
