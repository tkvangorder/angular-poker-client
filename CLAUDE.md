# Angular Poker Client - CLAUDE.md

## Project Overview
Angular 17 standalone-component poker game client. Connects to a REST backend at `http://localhost:8080`.

## Commands
```bash
npm start          # Dev server (ng serve)
npm test           # Run tests (Jest)
npm run test:watch # Watch mode
npm run build      # Production build
```

## Architecture

### Core Patterns
- **Standalone components** — No NgModules. Every component declares its own `imports` array.
- **Functional providers** — Guards use `CanActivateFn`, interceptors use `HttpInterceptorFn`
- **RxJS / BehaviorSubject** — Primary async pattern; no NgRx or other state library
- **`@inject()`** — Preferred DI pattern over constructor injection
- **`providedIn: 'root'`** — All services are root singletons

### Key Files
| File | Purpose |
|------|---------|
| `src/app/app.config.ts` | App providers (HTTP, router, error handler) |
| `src/app/app.routes.ts` | Routes — `''` (title page), `/home`, `/game/:gameId` |
| `src/app/rest/poker-rest-client.ts` | REST API client, base URL `http://localhost:8080` |
| `src/app/rest/rest.interceptor.ts` | Adds Bearer token; maps 4xx→ValidationError, 5xx→SystemError |
| `src/app/user/user-service.ts` | Auth state via BehaviorSubject; persists to localStorage |
| `src/app/game/cash-game.service.ts` | Cash game CRUD |
| `src/app/error-handling/global-error-handler.ts` | Suppresses ValidationError, toasts SystemError |
| `src/app/modal/modal.service.ts` | Dynamic component modal system |
| `src/app/toaster/toaster.service.ts` | Toast notifications |

### Feature Structure
```
src/app/
├── title-page/          # Login / register (entry point)
├── home-page/           # Game lobby, create game
├── game-lobby/          # Game lobby (WebSocket-connected)
├── game-page/
│   ├── cash-table/      # Table visualization (SVG)
│   └── player/          # Player seat component
├── poker/
│   └── card/            # Card rendering (SVG)
├── user/                # User models & service
├── game/                # Game models & service
├── rest/                # HTTP client & interceptor
├── modal/               # Dialog system
├── toaster/             # Toast notifications
├── navigation-bar/
├── error-handling/
└── lib/                 # Shared utilities
```

## Styling
- **Tailwind CSS v3 + DaisyUI v4** — Utility-first with component presets
- Available themes: coffee, forest, night, halloween, cupcake, emerald, fantasy, wireframe, winter
- Global styles: `src/styles.css`

## Testing
- **Jest** (not Karma) — `*.spec.ts` co-located with source files
- Config: `jest.config.ts`

## TypeScript
- Strict mode enabled: `strict`, `strictTemplates`, `strictInjectionParameters`
- Target: ES2022

## Error Handling
- `ValidationError` — 4xx HTTP responses; suppressed from user display
- `SystemError` — 5xx HTTP responses; shown as toast
- Guards: `authenticationGuard` (blocks unauthenticated), `loggedInGuard` (redirects logged-in users from title page)

## Backend API (localhost:8080)

OpenAPI spec: http://localhost:8080/v3/api-docs
Swagger UI: http://localhost:8080/swagger-ui/index.html

### Authentication (no auth required)
- `POST /auth/login` → `AuthenticationResponse { token, user }`
- `POST /auth/register` → `AuthenticationResponse { token, user }`

### Cash Games (authenticated)
- `POST /cash-games/search` — Search games with `GameCriteria { name?, statuses?, startTime?, endTime? }`
- `GET /cash-games/{gameId}` — Get game details (gameId also as query param)
- `POST /cash-games` — Create game with `CashGameConfiguration`
- `POST /cash-games/{gameId}/update` — Update game (admin)
- `DELETE /cash-games/{gameId}` — Delete game (admin)
- `POST /cash-games/{gameId}/register` — Register for game
- `POST /cash-games/{gameId}/unregister` — Unregister from game

### Game Statuses
`SCHEDULED` | `SEATING` | `ACTIVE` | `BALANCING` | `PAUSED` | `COMPLETED`

### Files (authenticated)
- `POST /files` — Upload file (max 2MB)
- `GET /files/{fileId}` — Download file

### Users (authenticated)
- `POST /users` — Search users by `UserCriteria { userLoginId?, userEmail? }`
- `POST /users/{userId}/update` — Update user info
- `POST /users/{userId}/password` — Change password

### Admin
- Admin role required for game create/update/delete. Dev credentials: admin/admin

### WebSocket (game play)
- Connect: `ws://localhost:8080/ws/games/{gameId}?token={jwtToken}`
- Commands/events spec: https://github.com/tkvangorder/home-poker/blob/main/docs/command-event-spec.md
- Client types: `src/app/game/game-commands.ts`, `src/app/game/game-events.ts`

