# Deployment

## Tests & deploy gates

```bash
npm test                  # all src/server/**/__tests__/**/*.test.js
npm run test:race-budget  # Race triangle counter helper
npm run check:race-budget # GLB budget (warn 25k / fail 30k tris); skips if no race-car.glb yet
```

- **Heroku** `heroku-postbuild`: server tests → `check:race-budget` (zero-dep GLB parser in `scripts/glbBudget.mjs`) → `scripts/herokuClientBuild.sh` (production `npm ci`, then **dev-only compile** with `npm ci --include=dev` + `vite build`, then `npm prune --omit=dev` so Vite never lands in `dependencies` and is stripped from the slug after build). Race budget **unit tests** run in GitHub Actions only (`npm run test:race-budget`). Failed checks or a car mesh over **30k** triangles block deploy.
- **GitHub Actions**: `.github/workflows/test.yml` runs the same on push/PR.

## Production (Heroku)

| Dyno | Command | Role |
|------|---------|------|
| Web | `npm run prod-server` | API + static client from `src/client/dist` |
| Worker | `npm run prod-worker` | Game updater (`src/workers/game-updater.js`) |

- Client build runs in `heroku-postbuild`; do **not** commit `src/client/dist`.
- If using GitHub → Heroku, enable waiting for CI so a green build cannot ship while tests are red.

Operational behavior after deploy (cache, service worker): [OPERATIONS.md](./OPERATIONS.md).
