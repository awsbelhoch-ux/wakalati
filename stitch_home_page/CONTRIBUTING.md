# Contributing to Wakalti

شكراً لاهتمامك بالمساهمة في مشروع وكالتي! هذا الدليل سيساعدك على فهم كيفية المساهمة.

## 📋 Code of Conduct

- **احترام الآخرين** - نحترم جميع المساهمين
- **الشفافية** - تواصل واضح ومفتوح
- **التعاون** - نعمل معاً لتحسين المشروع

---

## 🚀 Getting Started

### 1. Fork the Repository
```bash
# Fork on GitHub, then clone your fork
git clone https://github.com/your-username/wakalti-app.git
cd wakalti-app
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 3. Setup Development Environment
```bash
# Start local infra required by the app (Postgres, Redis, WebSocket server)
docker compose up -d postgres redis ws-server

# Install and prepare the app
npm install
npm run db:push
npm run dev
```

> To test real-time notifications locally: POST to `http://localhost:4000/emit` with JSON `{ "event": "notification", "payload": { "title": "Test", "body": "Hello" } }`

---

## 💻 Development Guidelines

### Code Style
- Follow **TypeScript strict mode**
- Use **ESLint** and **Prettier**
- Run before committing:
  ```bash
  npm run lint:fix
  npm run type-check
  ```

### File Naming
- Components: **PascalCase** (e.g., `UserProfile.tsx`)
- Utilities: **camelCase** (e.g., `formatDate.ts`)
- Types: **PascalCase** (e.g., `User.ts`)

### Component Structure
```typescript
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

// 2. Types/Interfaces
interface UserProps {
  id: string;
  name: string;
}

// 3. Component
export function User({ id, name }: UserProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <Button>{name}</Button>
    </div>
  );
}

// 4. Exports (if needed)
export default User;
```

### Error Handling
```typescript
try {
  const response = await fetch('/api/users');
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  return await response.json();
} catch (error) {
  console.error('Failed to fetch users:', error);
  throw error;
}
```

### Type Safety
```typescript
// ✅ Good - explicit types
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  // ...
}

// ❌ Avoid - any types
function getUser(id: any): any {
  // ...
}
```

---

## 🧪 Testing Requirements

### Write Tests For:
- ✅ New components
- ✅ New utility functions
- ✅ API endpoints
- ✅ Custom hooks

### Test Structure
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from '@/components/MyComponent';

describe('MyComponent', () => {
  beforeEach(() => {
    // Setup before each test
  });

  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    render(<MyComponent />);
    const button = screen.getByRole('button');
    button.click();
    expect(screen.getByText('Clicked')).toBeInTheDocument();
  });
});
```

### Run Tests
```bash
npm test              # Watch mode
npm run test:ci       # Single run
npm run test:coverage # With coverage
```

### Coverage Requirements
- **Utilities:** 90%+ required
- **Components:** 85%+ required
- **Hooks:** 80%+ required
- **Overall:** 80%+ required

---

## 📝 Commit Messages

Follow **Conventional Commits** format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat** - New feature
- **fix** - Bug fix
- **docs** - Documentation
- **style** - Code style (formatting, missing semicolons, etc.)
- **refactor** - Code refactoring
- **test** - Adding/updating tests
- **chore** - Dependencies, build changes

### Examples
```bash
# Good
git commit -m "feat(auth): add Google OAuth login"
git commit -m "fix(notifications): fix real-time updates"
git commit -m "docs(readme): update installation guide"
git commit -m "test(components): add Toast tests"

# Avoid
git commit -m "update"
git commit -m "fix bugs"
git commit -m "add stuff"
```

---

## 📥 Pull Request Process

### Before Creating PR
1. **Update your branch:**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run tests and linting:**
   ```bash
   npm run lint:fix
   npm run type-check
   npm test
   ```

3. **Build locally:**
   ```bash
   npm run build
   ```

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Unit tests added
- [ ] Integration tests added
- [ ] Tested on mobile
- [ ] Tested on different browsers

## Checklist
- [ ] Code follows style guidelines
- [ ] TypeScript types are correct
- [ ] Tests pass
- [ ] No console errors/warnings
- [ ] Documentation updated
```

### PR Reviews
- At least **1 approval** required before merge
- **All checks** must pass (lint, test, build)
- **Code coverage** must not decrease

---

## 🔍 Code Review Checklist

As a reviewer, check for:

### Functionality
- [ ] Code works as expected
- [ ] No breaking changes
- [ ] Error handling is proper
- [ ] Edge cases are covered

### Code Quality
- [ ] Follows style guidelines
- [ ] TypeScript strict mode
- [ ] No code duplication
- [ ] Proper error messages

### Testing
- [ ] Tests are comprehensive
- [ ] Coverage targets met
- [ ] Tests are maintainable
- [ ] No flaky tests

### Documentation
- [ ] Comments for complex logic
- [ ] Updated relevant docs
- [ ] Types are documented
- [ ] API changes documented

---

## 🐛 Bug Reports

### How to Report
1. **Search existing issues** - avoid duplicates
2. **Create new issue** with:
   - Clear title: "Bug: [description]"
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment (OS, browser, Node version)
   - Screenshots/videos if applicable

### Example
```markdown
**Title:** Bug: Notifications not updating in real-time

**Steps to Reproduce:**
1. Open patient dashboard
2. In another tab, send a message
3. Return to first tab

**Expected:** Notification appears immediately
**Actual:** Notification appears after page refresh

**Environment:** 
- OS: Windows 11
- Browser: Chrome 120
- Node: 20.10.0
```

---

## 💡 Feature Requests

### How to Suggest
1. **Create issue** with:
   - Clear title: "Feature: [description]"
   - Problem statement
   - Proposed solution
   - Alternative solutions considered
   - Additional context

### Example
```markdown
**Title:** Feature: Dark mode support

**Problem:** Users in low-light environments need dark mode

**Solution:** 
- Add theme toggle in settings
- Use CSS variables for colors
- Store preference in localStorage

**Alternatives:**
- System preference detection

**Additional Context:**
- Users have requested this feature
- Competitors already have this
```

---

## 📚 Documentation

### Update Documentation For:
- [ ] New components
- [ ] New API endpoints
- [ ] Breaking changes
- [ ] Configuration changes

### Documentation Format
```markdown
# Component Name

## Description
What does it do?

## Props
```typescript
interface Props {
  prop1: string;
  prop2?: number;
}
```

## Example
```tsx
<Component prop1="value" />
```

## Notes
Any additional information
```

---

## 🔐 Security

### Report Security Issues
**Do NOT create public issues for security vulnerabilities!**

Email: security@wakalti.app with:
- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

---

## 🎨 Design Guidelines

### UI Components
- Use **Tailwind CSS** classes
- Support **dark mode**
- Responsive design (mobile-first)
- Accessibility (WCAG 2.1 AA)
- Arabic RTL support

### Colors
- Primary: `#0066CC` (blue)
- Success: `#10B981` (green)
- Warning: `#F59E0B` (amber)
- Error: `#EF4444` (red)

### Spacing
- Use Tailwind spacing scale: `4px`, `8px`, `12px`, `16px`, `24px`, etc.
- Consistent padding/margin across components

---

## 🚀 Deployment

### Development
Automatic on push to `develop` branch

### Staging
Automatic on PR creation

### Production
Automatic on push to `main` branch (with approval)

### Manual Deployment
```bash
npm run build
npm start
```

---

## 📞 Getting Help

- **Discussions:** [GitHub Discussions](https://github.com/yourusername/wakalti-app/discussions)
- **Issues:** [GitHub Issues](https://github.com/yourusername/wakalti-app/issues)
- **Discord:** [Join our server](#)
- **Email:** dev-team@wakalti.app

---

## 🎓 Learning Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [React Documentation](https://react.dev)
- [Next.js Guide](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Testing Library](https://testing-library.com)
- [Tailwind CSS](https://tailwindcss.com)

---

## 🙏 Thank You!

Thanks for contributing to Wakalti! Your help makes this project better for everyone.

---

**Last Updated:** December 29, 2025  
**Version:** 1.0
