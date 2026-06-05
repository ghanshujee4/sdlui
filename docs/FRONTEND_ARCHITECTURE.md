# SDLUI Frontend Architecture

This document defines the standard structure for the Shastra Digital Library React app (Create React App). New code should follow these conventions; legacy folders remain until migrated incrementally.

## Layer overview

```
┌─────────────────────────────────────────────────────────┐
│  app/          Entry shell, global styles, providers    │
├─────────────────────────────────────────────────────────┤
│  routes/       Route table + lazy-loaded pages          │
│  components/   Shared UI (layout, routing guards)       │
│  layouts/      Page wrappers (student, admin — future)  │
├─────────────────────────────────────────────────────────┤
│  features/     Domain screens (target; see migration)   │
├─────────────────────────────────────────────────────────┤
│  api/          HTTP clients + (future) service modules  │
│  hooks/        Reusable React hooks only                │
│  constants/    Routes, storage keys, enums              │
│  config/       Environment-backed app config            │
├─────────────────────────────────────────────────────────┤
│  utils/        Pure helpers (formatters, links, etc.)   │
│  assets/       Static images, fonts, global CSS         │
└─────────────────────────────────────────────────────────┘
```

## Directory responsibilities

| Path | Purpose |
|------|---------|
| `src/app/` | Root `App` component; no business logic |
| `src/routes/` | Single route configuration; lazy imports only here |
| `src/components/` | Reusable presentational and routing components |
| `src/layouts/` | Route-level layouts (`StudentLayout`, etc.) |
| `src/api/clients/` | Axios instances with auth interceptors |
| `src/api/services/` | *(planned)* One file per REST resource |
| `src/constants/` | `ROUTES`, `STORAGE_KEYS`, shared magic strings |
| `src/config/` | `REACT_APP_*` environment variables |
| `src/hooks/` | Custom hooks (`usePasswordReset`, etc.) — not pages |
| `src/utils/` | Stateless utilities; no React components unless legacy |

## Import conventions

`jsconfig.json` sets `"baseUrl": "src"`, so prefer absolute imports from `src`:

```javascript
import { ROUTES } from "constants/routes";
import { studentClient } from "api";
import PageLoader from "components/layout/PageLoader";
```

Avoid deep relative paths (`../../../`) in new code.

## API layer

- **`studentClient`** — JWT from `localStorage.token`; 401 → `/login`
- **`adminClient`** — JWT from `localStorage.adminToken`; 401/403 → `/adminlogin`

Legacy imports still work:

- `utils/axiosInstance` → `studentClient`
- `login/adminAxios` → `adminClient`

Add resource-specific calls under `api/services/` (e.g. `paymentsService.js`) rather than scattering `axios.get` in components.

## Routing

- All paths are defined in `constants/routes.js` as `ROUTES`.
- Route elements live in `routes/index.jsx` with `React.lazy` + `PageLoader`.
- **Admin routes** wrap content in `AdminProtectedRoute`.
- **Student JWT + ADMIN role** routes use `StudentProtectedRoute` (formerly `PrivateRoute`).

## Auth & storage

| Key | Constant | Used by |
|-----|----------|---------|
| `token` | `STORAGE_KEYS.studentToken` | Student session |
| `userId` | `STORAGE_KEYS.studentUserId` | Dashboard URLs |
| `role` | `STORAGE_KEYS.studentRole` | Role checks |
| `adminToken` | `STORAGE_KEYS.adminToken` | Admin session |
| `adminRole` | `STORAGE_KEYS.adminRole` | Admin guard |

Use `utils/authUtils.logout` for consistent client-side logout.

## Feature migration map (incremental)

Existing folders map to future `features/` modules. Do not move everything at once; migrate when touching a area.

| Current folder | Target feature module |
|----------------|----------------------|
| `login/` | `features/auth/` |
| `dashboard/` | `features/student-dashboard/`, `features/admin/` |
| `payments/` | `features/payments/` |
| `charts/` | `features/analytics/` |
| `chat/` | `features/chat/` |
| `sdl/` | `features/library/` |
| `updates/` | `features/announcements/` |
| `StudentRegistration.js`, `SeatBooking.js` | `features/registration/`, `features/seats/` |

Each feature should expose:

- `pages/` — route components
- `components/` — feature-private UI
- `hooks/` — feature-private hooks (optional)

## Component guidelines

1. **Pages** — connected to router; fetch data; compose layouts.
2. **Components** — props in, JSX out; no direct `localStorage` when avoidable.
3. **Hooks** — data fetching, form state, side effects shared across pages.
4. **Utils** — pure functions; no hooks.

## Styling

- Global: `App.css`, `index.css`, Bootstrap, MDB (loaded in `index.js`).
- Feature CSS: colocate with component (`Component.css`) or `assets/css/`.
- Prefer Bootstrap utility classes for layout consistency.

## Environment

| Variable | Purpose |
|----------|---------|
| `REACT_APP_BASE_URL` | API base (`/api`) |
| `REACT_APP_BASE_ENV` | Server origin (WebSocket, assets) |
| `REACT_APP_ENV_FRONT` | Frontend public URL |
| `REACT_APP_GOOGLE_CLIENT_ID` | Google OAuth Web client ID (login page) |

### Google Sign-In

Student login supports **Continue with Google** via [Google Identity Services](https://developers.google.com/identity/gsi/web). The frontend POSTs the Google ID token to:

`POST /api/users/google-login`  
Body: `{ "idToken": "<google-jwt>" }`  
Response (same as email login): `{ "token": "...", "userId": "..." }`

If the user has no account, the API should return `404` (frontend redirects to registration with email prefilled) or `{ "needsRegistration": true }`.

**Google Cloud Console:** create an OAuth 2.0 Client ID (Web), add `http://localhost:3000` to Authorized JavaScript origins, set `REACT_APP_GOOGLE_CLIENT_ID` in `.env`.

## Adding a new page (checklist)

1. Add path to `constants/routes.js`.
2. Lazy-import the page in `routes/index.jsx` and register a `<Route>`.
3. Add guard (`AdminProtectedRoute` / `StudentProtectedRoute`) if needed.
4. Add API calls in `api/services/` using the correct client.
5. Update this doc only if you introduce a new cross-cutting pattern.

## What not to do

- Do not add routes in `App.jsx` — use `routes/index.jsx`.
- Do not create new axios instances; extend `studentClient` / `adminClient`.
- Do not put route-level pages under `hooks/` (e.g. move `ResetPassword` to `features/auth/pages` when refactored).
- Do not commit secrets; use `.env` locally and CI variables in production.
