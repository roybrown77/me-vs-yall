# Product features (technical)

Player-facing summary: [README.md](../README.md).

## Scoreboards (`/scoreboards/:league/:year/...`)

- **Leagues**: NFL, CFB, Premier League, MMA, boxing, MLB, NBA, WNBA, NCAAM, NCAAW, NBA 2K (availability varies by season data).
- **Week navigation**: Preseason, regular season, and playoffs via URL segments; “entire season” rollup where configured.
- **Picks**: Choose a side before kickoff; server rejects picks after the game starts (`PickDomain.isValid`).
- **Spread mode**: Toggle whether leader/score views use spread-adjusted logic (persisted client-side).
- **Score guesses**: Optional away/home score picks; bonus points for accuracy and game-of-the-week rules (see server ranking helpers).
- **Live updates**: Polls while games are in progress on scoreboard and leader views.
- **Tabs (NFL-focused where enabled)**:
  - **Scores** — games and pick UI.
  - **Rankings** — conference/division-style standings derived from current scoreboard context. Standings refresh daily at 7 a.m. (local); during live games also at 1, 5, and 8 p.m.
  - **Playoffs** — projected bracket (bye + wild card as lower seed @ higher seed). Same refresh schedule as Rankings.

## Leaders (`/leaders/:league/...`)

- Weekly and season rollups with win–loss (and bonus-adjusted) totals.
- Vegas / special leader display rules for selected accounts.
- Week picker aligned with scoreboard URL patterns.

## Home

- Marketing splash, bandwagon scroll experience, links into NFL scoreboard and leaders.
- **Recent scores**: Last started games with links into the matching scoreboard/leaders week.

## Other pages

- **Shop**, **Tips**, **Origin**, **Contact**, **Of the Week** — content and merchandising routes.
- **Play** — auth entry redirect into NFL scoreboard.
- **Auth0** callback flow for sign-in.

## PWA & install

- Installable web app (manifest, icons, standalone display).
- **Service worker** (`src/client/src/sw.js`, built via `vite-plugin-pwa` injectManifest):
  - Precaches hashed JS/CSS and static icons (not `index.html`).
  - **Navigation requests use network-first** so deploys serve fresh HTML and new asset URLs.
  - Push notification handlers in the same worker.
- Client registration: `src/client/src/pwa/registerServiceWorker.js` (`registerType: autoUpdate` in Vite config).

## Push notifications

- Web Push (VAPID); subscription API under `/api/notificationmanagement`.
- **Types** (user-configurable): `upcoming`, `in_progress`, `all_final` (scheduler currently sends upcoming + all-final style flows).
- **Max 2 notifications per subscriber per local calendar day** (`MAX_DAILY_NOTIFICATIONS` in `pickReminderScheduler.js`).
- Examples:
  - ~1 hour before first kickoff — missing pick reminder.
  - 7pm local — “finalize picks” when tomorrow is the first game day.
  - All games final for a league/day — final scores + top-3 blurb; leaderboard link uses **current week** ranks except **Wednesdays** (subscriber timezone), when **entire season** ranks are used (`gameWeekNavigation.js`).

## Background worker

- **Heroku worker** (`npm run prod-worker`): `src/workers/game-updater.js` scrapes/updates games (NFL via configured source), scores, play history.
- NFL finals: mark games over for rankings promptly; optional extra window to keep collecting last play/score updates.
