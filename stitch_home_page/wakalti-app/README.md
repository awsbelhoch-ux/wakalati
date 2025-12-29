# Wakalti - Medical Healthcare Platform

**وكالتي - منصة الرعاية الصحية**

A comprehensive healthcare management system built with **Next.js 16**, **React 19**, **TypeScript**, and **Prisma**.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 20+** and **npm**
- **PostgreSQL 18+** (or use Docker)
- **Redis** (optional, for caching)

### Installation

```bash
# 1. Clone repository
git clone https://github.com/yourusername/wakalti-app.git
cd wakalti-app

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local

# 4. Setup database
npm run db:push

# 5. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## ✨ Key Features

### For Patients
- 📊 **Dashboard** - Health overview and statistics
- 💊 **Medication Tracker** - Track prescriptions and usage
- 📅 **Appointments** - Schedule and manage appointments
- 📈 **Glucose Tracker** - Monitor blood glucose levels
- 💬 **Messaging** - Communicate with doctors
- 🔔 **Notifications** - Real-time health alerts

### For Doctors
- 👥 **Patient Management** - View all assigned patients
- 📋 **Health Records** - Access comprehensive patient data
- 💬 **Patient Communication** - Secure messaging system
- 📊 **Analytics** - Track patient health trends

### Development Features
- ✅ **Testing** - 50+ test cases with Vitest
- ⚙️ **CI/CD** - GitHub Actions automation
- 🔐 **Authentication** - NextAuth v5 with multiple providers
- 📱 **Responsive** - Mobile-first design with Tailwind CSS
- 🌐 **Internationalization** - Multi-language support ready
- 🎨 **Dark Mode** - Theme switching support

---

## 🛠️ Tech Stack

```
Frontend:    Next.js 16 • React 19 • TypeScript • Tailwind CSS 4
Backend:     Next.js API Routes • Prisma 7.2.0 • PostgreSQL
Auth:        NextAuth v5.0.0-beta.30
Tools:       Vitest • ESLint • Prettier • GitHub Actions
```

---

## 📚 Available Scripts

### Development
```bash
npm run dev          # Start development server (port 3000)
npm run build        # Build for production
npm start            # Start production server
```

### Code Quality
```bash
npm run lint         # Check code style
npm run lint:fix     # Fix code style issues
npm run type-check   # Check TypeScript errors
```

### Testing
```bash
npm test             # Run tests in watch mode
npm run test:ci      # Run tests once with coverage
npm run test:ui      # Open interactive test dashboard
npm run test:coverage # Generate coverage report
```

### Database
```bash
npm run db:push      # Sync schema to database
npm run db:migrate   # Create migration
npm run db:studio    # Open Prisma Studio UI
npm run db:reset     # Reset database
npm run db:seed      # Seed sample data
```

---

## 📁 Project Structure

```
app/
├── admin/              # Admin dashboard pages
├── doctor/             # Doctor-specific pages
├── patient/            # Patient-specific pages
├── api/                # API routes (/api/*)
├── layout.tsx          # Root layout
└── page.tsx            # Home page

components/
├── ui/                 # Reusable UI (Toast, Error, Loading, etc.)
├── forms/              # Form components
└── charts/             # Chart components (Recharts)

lib/
├── auth.ts             # NextAuth configuration
├── db.ts               # Prisma client
├── validators.ts       # Data validation schemas
└── utils.ts            # Utility functions

prisma/
├── schema.prisma       # Database schema
└── seed.ts             # Seed script

__tests__/
├── components/         # Component tests
├── api/                # API integration tests
├── hooks/              # Hook tests
└── utils.test.ts       # Utility function tests
```

---

## 🧪 Testing

### Test Coverage
- **Components:** 85%+ (Toast, Loading, Error, etc.)
- **Utilities:** 90%+ (validators, helpers)
- **Hooks:** 80%+ (custom React hooks)
- **API:** 75%+ (integration tests)

### Example Test
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from '@/components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Running Tests
```bash
npm test              # Watch mode
npm run test:ci       # Single run with coverage
npm run test:ui       # Interactive dashboard
```

---

## 🔒 Authentication

Uses **NextAuth v5** with support for:
- Email/Password login
- Google OAuth
- GitHub OAuth
- Custom credentials

Configuration: `lib/auth.ts`

---

## 🐳 Docker Support

### Development
```bash
docker-compose up -d
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

Services:
- Next.js App (port 3000)
- PostgreSQL (port 5432)
- Redis (port 6379)
- Nginx (port 80/443)
- Prometheus (port 9090)
- Grafana (port 3001)

---

## 🚀 Deployment

### Automatic (GitHub Actions)
Push to `main` branch triggers:
1. ✅ Lint checks (ESLint)
2. ✅ Type check (TypeScript)
3. ✅ Tests (Vitest with coverage)
4. ✅ Build verification
5. ✅ Security scan (npm audit + Semgrep)
6. ✅ Automated deployment
7. ✅ Health checks
8. ✅ Slack notifications

### Manual
```bash
npm run build
npm start
```

---

## 📊 Code Quality

### ESLint
Configuration: `.eslintrc.json`
```bash
npm run lint:fix
```

### Prettier
Configuration: `.prettierrc.json`
```bash
# Auto-format on save (configure in IDE)
```

### TypeScript
Strict mode enabled in `tsconfig.json`
```bash
npm run type-check
```

---

## 🎯 Development Workflow

1. **Create feature branch:**
   ```bash
   git checkout -b feature/feature-name
   ```

2. **Make changes and test:**
   ```bash
   npm run lint:fix
   npm test
   npm run type-check
   ```

3. **Commit with conventional commits:**
   ```bash
   git commit -m "feat(component): add new feature"
   ```

4. **Push and create PR:**
   ```bash
   git push origin feature/feature-name
   ```

---

## 📖 Documentation

- **[Database Schema](docs/DATABASE.md)** - Prisma schema documentation
- **[API Routes](docs/API.md)** - Available endpoints
- **[Deployment](docs/DEPLOYMENT.md)** - Deployment guide
- **[Architecture](docs/ARCHITECTURE.md)** - System architecture

---

## 🔗 Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Prisma](https://www.prisma.io)
- [NextAuth](https://next-auth.js.org)
- [Vitest](https://vitest.dev)

---

## 📝 License

MIT License - see LICENSE file for details

---

**Status:** In Development 🚀  
**Last Updated:** December 29, 2025  
**Version:** 0.1.0

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
