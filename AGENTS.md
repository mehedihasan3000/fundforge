# FundForge — Agent Instructions

## Repo structure

Two independent Node packages in a single git root:
- `backend/` — Express.js 5 API (CommonJS)
- `frontend/` — Next.js 16 App Router (ESM, React 19)

## Dev commands

```bash
cd backend && npm run dev    # node server.js (no hot-reload)
cd frontend && npm run dev   # next dev
cd frontend && npm run lint  # eslint
```

No test scripts exist in either package.

## Must-know constraints

- **No TypeScript** — plain JavaScript everywhere
- **No Mongoose** — use native `mongodb` driver (`connectDB`/`getDB` from `config/db.js`)
- **Express 5** — `express` v5 in backend/package.json
- **BetterAuth** — auth routes at `/api/auth/*`, configured in `config/auth.js` using dynamic `import()` for ESM/CJS interop
- **MongoDB collection name quirk**: `db.collection("user")` (singular) in `controllers/campaigns.js:92-99` — most other code uses plural collection names
- **Backend env**: `backend/.env`, loaded conditionally (`if VERCEL !== "1"`)
- **Frontend env**: `frontend/.env.local`, public vars prefixed `NEXT_PUBLIC_`; backend URL is server-only (`BACKEND_URL`) consumed by `next.config.mjs` rewrites

## API proxy

`next.config.mjs` rewrites `/api/:path*` → `BACKEND_URL/api/:path*` (defaults to `http://localhost:5000`). The frontend API client (`src/lib/api.js`) and auth client (`src/lib/auth-client.js`) both use empty `baseURL` / `BASE_URL` — they rely entirely on the Next.js proxy.

## Role-based routing

- **Public routes**: under `(public)/` — `/`, `/login`, `/register`
- **Dashboard routes**: under `dashboard/supporter/`, `dashboard/creator/`, `dashboard/admin/`
- Backend RBAC middleware at `middleware/rbac.js` — `authorize('supporter','creator','admin')`
- Protect API routes per-role in route files via `session` middleware then `authorize`

## Business logic constants

| Operation | Rate |
|-----------|------|
| Purchase | 10 credits = $1 |
| Withdrawal | 20 credits = $1 (min 200 credits) |
| Registration bonus | Supporter: 50, Creator: 20 |

## Deployment

- Frontend: Vercel (`framework: nextjs` in `vercel.json`)
- Backend: Vercel serverless via `api/index.js` (rewrites all routes to it); listener only starts when `VERCEL !== "1"`

## Conventions

- Tailwind CSS v4
- Gravity UI Icons for icons
- Swiper Slider for carousels
- Toasts replace all `alert()` calls (Phase 9)
- `error.js` and `loading.js` exist at dashboard route level and sub-levels
- DashboardLayout includes a mobile sidebar hamburger toggle
- All `<table>` elements wrapped in `overflow-x-auto`

## Reference files

Read these before making changes:
- `FundForge.md` — full requirements spec
- `TASKS.md` — roadmap and completion status
- `.opencoderules` — detailed conventions, data models, and feature rules
