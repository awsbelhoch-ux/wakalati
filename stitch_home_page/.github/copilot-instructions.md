# Copilot instructions — Wakalti (concise)

Purpose: Help AI coding agents become productive quickly in this repo. Keep changes small, well-tested, and documented.

Core context
- Main UI/service: `wakalti-app/` (Next.js 16 + TypeScript). Frontend and some backend APIs live here.
- Data: Postgres + Redis (defined in `docker-compose.yml` and `docker-compose.prod.yml`).
- Real-time: Socket.IO frontend hooks are implemented in `wakalti-app` (see `NotificationProvider` and `patient/notifications` pages). The backend Socket.IO service lives at `ws-server/server.js` and exposes `POST /emit` to broadcast events to connected clients.

Key developer flows (do these exactly)
1. Local development
   - Start infra: `docker compose up -d postgres redis ws-server` (dev compose defined in `docker-compose.yml`)
   - Start app: `cd wakalti-app && npm run dev`
   - When testing notifications: send POST to `http://localhost:4000/emit` with JSON `{ event: 'notification', payload: { title, body } }`.

2. Unit tests & Lint
   - Unit tests run with Vitest: `cd wakalti-app && npm run test` (CI uses `npm run test:ci`)
   - Lint: `cd wakalti-app && npm run lint`

3. E2E tests
   - Playwright tests: `cd wakalti-app && npm run e2e` (Playwright browsers installed via `npm run prepare` / `npx playwright install --with-deps`).
   - E2E tests assume `wakalti-app` available on `http://localhost:3000` and `ws-server` on `http://localhost:4000`.

Project-specific conventions
- Tests: unit tests live under `wakalti-app/__tests__` (Vitest + React Testing Library). E2E tests live under `wakalti-app/e2e` (Playwright).
- Environment vars: front-end uses `NEXT_PUBLIC_API_URL` (default `http://localhost:8000`) while `ws-server` runs on port 4000. Use `NEXT_*` when adding client-visible env.
- Real-time events: prefer broadcasting through `ws-server` (POST `/emit`) rather than coupling services to the socket instance directly; this keeps the backend side-effect triggerable in tests.
- PRs should include: 1) small focused change, 2) unit tests and/or e2e test, 3) update to `CHANGELOG.md` (if applicable), and 4) reference to related issue.

Places to look for patterns/examples (quick links)
- Real-time client: `wakalti-app/app/patient/notifications/NotificationsPageClient.tsx`
- API base URL: `wakalti-app/services/api.ts`
- Unit tests examples: `wakalti-app/__tests__/` (hooks/components/emergency)
- E2E example: `wakalti-app/e2e/notifications.spec.ts` (sample test added to validate server-emitted notifications)
- WS server: `ws-server/server.js` (simple Express + Socket.IO server with /emit)
- Dev infra: `docker-compose.yml` (postgres, redis, ws-server) and `docker-compose.prod.yml`
- CI: `.github/workflows/ci.yml` (runs lint → unit tests → e2e)

Do / Don't (practical)
- DO: add or update tests that reproduce the bug before making the fix (unit or e2e depending on scope).
- DO: use `POST /emit` in automated tests to trigger realtime flows.
- DO: include `health` endpoints for new services so compose/CI can wait for readiness.
- DON'T: change environment variable names that reach the client (NEXT_PUBLIC_*) without updating docs and tests.

If something is unclear
- Ask for the failing test or exact reproduction steps. If none exist, add a minimal failing test and make the fix in the same PR.

Thanks — be conservative with changes, and keep PRs small and well-tested. If you need a broader refactor, describe the migration plan and add a feature-flagged path first.