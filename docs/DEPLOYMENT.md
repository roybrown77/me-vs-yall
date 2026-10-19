# Deployment

## Tests & deploy gates

```bash
npm test   # all src/server/**/__tests__/**/*.test.js
```

- **Heroku** `heroku-postbuild`: runs `npm test`, then builds the client. Failed tests block deploy.
- **GitHub Actions**: `.github/workflows/test.yml` runs the same on push/PR.

## Production (Heroku)

| Dyno | Command | Role |
|------|---------|------|
| Web | `npm run prod-server` | API + static client from `src/client/dist` |
| Worker | `npm run prod-worker` | Game updater (`src/workers/game-updater.js`) |

- Client build runs in `heroku-postbuild`; do **not** commit `src/client/dist`.
- If using GitHub → Heroku, enable waiting for CI so a green build cannot ship while tests are red.

Operational behavior after deploy (cache, service worker): [OPERATIONS.md](./OPERATIONS.md).
