# Critical operations

Changes here affect every user in production. Update this file when behavior changes.

## Static assets & cache headers (`src/server/index.js`)

- `/assets/*` — long cache (`immutable`, 1 year); filenames are content-hashed by Vite.
- `sw.js`, `index.html`, `*.webmanifest` — **no-cache** so browsers and the SW update check see new deploys.
- SPA fallback routes serve `index.html` with **no-cache**.

## Service worker update behavior

1. New deploy → new hashed `/assets/*` files and usually new `sw.js`.
2. `registerSW({ immediate: true })` with **autoUpdate** reloads when a waiting worker activates.
3. Additional SW update checks: on load, window **focus**, and tab **visible** (not only hourly).
4. **Do not** precache `index.html` or serve navigations from stale precached HTML (see `injectManifest.globIgnores` in `src/client/vite.config.js` and network-first navigation in `src/client/src/sw.js`).

If users report “stale JS/CSS after deploy”, verify: Heroku build succeeded, `sw.js` and `index.html` cache headers, and that the precache manifest excludes `index.html`.

## Pick timing

- **Client**: `hasGameStarted` in `src/client/src/utilities/index.js` (small pre-kickoff buffer).
- **Server**: `PickDomain.isValid` / `hasGameStarted` — reject picks at or after kickoff and when game is over.

## Notification leaderboard scope

- Default: week containing the reference final game (navigable weeks only, not “entire season” overlap).
- **Wednesday** (subscriber timezone): entire-season week for top-3 text and deep link.

## Rankings cache (scoreboard client)

- Short TTL (~3 minutes) with invalidation when game signatures change; prefetch after scoreboard load.
