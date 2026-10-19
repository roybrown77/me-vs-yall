# Development

Technical docs for contributors. Player-facing overview: [README.md](../README.md).

| Doc | Contents |
|-----|----------|
| [FEATURES.md](./FEATURES.md) | Routes, leagues, PWA, notifications, worker (detailed) |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Tests, CI, Heroku web + worker |
| [OPERATIONS.md](./OPERATIONS.md) | Cache, service worker, pick timing, production troubleshooting |

## Architecture

| Piece | Location |
|--------|-----------|
| API + static host | `src/server` (Express, MongoDB) |
| React client | `src/client` (Vite 8, React 19, MUI) |
| Game updater | `src/workers/game-updater.js` |
| Prod static files | `src/client/dist` when `NODE_ENV=production` |

## Local setup

```bash
npm install
cd src/client && npm install && cd ../..
npm start
```

- Client dev server: `http://localhost:3000`
- API: `http://localhost:3001`

Production-like local run:

```bash
npm run local-prod
```

Generate VAPID keys (once per environment):

```bash
npm run generate-vapid
```

## Environment

- MongoDB connection string and Auth0/JWT settings (see `config` / `.env`).
- Push reminders: VAPID keys and `ENABLE_PICK_PUSH_REMINDERS` where applicable.
- Node **24.15.0** (root `package.json` `engines`).

## Tests

```bash
npm test
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for how tests gate deploys.
