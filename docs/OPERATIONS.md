# Critical operations

Changes here affect every user in production. Update this file when behavior changes.

## Static assets & cache headers (`src/server/index.js`)

- `/assets/*` — long cache (`immutable`, 1 year); filenames are content-hashed by Vite.
- `sw.js`, `index.html`, `*.webmanifest` — **no-cache** so browsers and the SW update check see new deploys.
- SPA fallback routes serve `index.html` with **no-cache**.

## Service worker update behavior

1. New deploy → new hashed `/assets/*` files and usually new `sw.js`.
2. `registerSW({ immediate: true })` with **autoUpdate**; `skipWaiting` + **`controllerchange` → full page reload** so JS/CSS bundles match the new precache manifest.
3. On SW **install/activate**, **`html-navigations`** cache is cleared so stale `index.html` cannot pin old asset hashes.
4. Additional SW update checks: on load, window **focus**, and tab **visible** (not only hourly).
5. **Do not** precache `index.html` at install time (see `injectManifest.globIgnores` in `src/client/vite.config.js`).
6. **Navigations** (e.g. `/scoreboards/nfl`, `/race`) always use the **network** when online (`cache: 'no-store'`) so a slow or timed-out fetch cannot serve a pre-deploy `index.html`; offline falls back to the last cached shell (`src/client/src/sw.js`).

If users report “stale JS/CSS after deploy”, verify: Heroku build succeeded, `sw.js` and `index.html` cache headers, and that the precache manifest excludes `index.html`.

If users report **`no-response`** on a scoreboard URL, confirm the new `sw.js` is deployed and hard-refresh once so the worker updates.

## Game updater worker

- **Source:** `src/workers/game-updater.js` (NFL week URL from `getNflGameDataSource()`).
- Each loop: scrape ESPN → create missing games → reconcile counts for that scoreboard week vs MongoDB.
- **Mismatch:** red `[GAME_UPDATER]` lines (ESPN count vs DB count, plus missing/extra matchups), then **process exit** so the worker does not keep updating with a partial slate.
- Fix data or matching (kickoff keys in `espnGameMatch.js`) and redeploy/restart the worker; check logs for “On ESPN but missing in DB” / “In DB but not on ESPN scoreboard”.

## Pick timing

- **Client**: `hasGameStarted` in `src/client/src/utilities/index.js` (small pre-kickoff buffer).
- **Server**: `PickDomain.isValid` / `hasGameStarted` — reject picks at or after kickoff and when game is over.

## Notification leaderboard scope

- Default: week containing the reference final game (navigable weeks only, not “entire season” overlap).
- **Wednesday** (subscriber timezone): entire-season week for top-3 text and deep link.

## Rankings cache (scoreboard client)

- **Schedule (local time):** season standings data in `localStorage` expires at the next **7:00 a.m.** refresh. While **any scoreboard game is in progress**, also expires at **1:00, 5:00, and 8:00 p.m.** on the same schedule.
- Live scoreboard games still **patch** cached season games when scores change (no full refetch until the next scheduled boundary).
- Prefetch after scoreboard load when Rankings/Playoffs are available; copy on those tabs explains the refresh times.
