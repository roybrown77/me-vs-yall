# `/race` — Ridge Line

Full-screen WebGL ridge-line driving game (**RIDGE LINE** / **The Race**). Route: `/race` (lazy-loaded from `App.jsx`).

**Keep this file in sync:** When you change gameplay, UI, settings, audio, or defaults under `src/client/src/pages/Race/`, update this README in the same PR or commit.

**Code comments:** Each function in this folder has a one-line `//` purpose comment above it; add or update that comment whenever you add or change a function (see `.cursor/rules/race-readme.mdc`).

---

## Game flow

| Phase | Behavior |
|--------|----------|
| **loading** | ~1.1s progress %; fly-in camera on the course |
| **title** | “The Race”, settings pickers, **Start** |
| **countdown** | **3-2-1-GO** with tones + start lights; camera at the line |
| **tutorial** | Copy + center lane guide; car at ~88% cruise; race starts on first steer or **5s** fallback (`TUTORIAL_FALLBACK_MS`) |
| **racing** | Timed run to finish line |
| **finished** | Car continues driving along the closed-loop road circuit while the camera smoothly sweeps between front-approach and rear driving-away views alongside results + **Again** |

Key files: `index.jsx` (UI phases), `engine.js` (`setPhase`, game loop).

---

## Core driving

- **Course:** 3D Catmull-Rom spline built as a generally circular loop with left and right turns up to **90°** and smooth **inward road tilt** (superelevation banking into left and right turns, outer edge raised) up to **75°** at different stretches (`course.js`). **Standard** uses light rolling hills, while **Hills** / **All** feature dramatic, deep down and up hills with thrilling canyon plunges down to ~-34m and soaring alpine climbs up to ~+244m (a ~278m vertical span with mid-lap crest); every layout starts on a straight, level road that extends **0.1 miles** (`160.9m`) past the **START** line before any turns or hills begin, and ends on a level **half-mile drag strip** to the checkered line. **Length** scale (2× / 3×) expands the circular circuit and repeats the turn/hill/tilt rhythm; **Course** profile adjusts turn and hill intensity.
- **Road:** Closed-loop 3D asphalt deck (top, curbs, underside) with a smooth Bezier connector from `ROAD_END_T` back to `LOOP_START_T`, white edge strips, START/FINISH banners, and steel arch ribs.
- **Steering:**
  - Keyboard: **←/→** or **A/D**
  - Canvas: tap/hold **left or right half** of the screen
  - UI: **diamond** left/right buttons (see [On-screen steer controls](#on-screen-steer-controls))
  - Optional throttle on road: **↑** or **W**
- **Feel:** Lateral offset clamped to road width; curve yaw assist; car sway and wheel spin.
- **Cars:** **Snowball** (SUV atlas `suv-atlas.png`, `suv-tread.png`) or **Tuff Truck** (`truck-atlas.png`, shared tread). With BGM on, the spare tire hub (Snowball) or TUFF badge plate (Tuff Truck) pulses on bass like a speaker cone (`raceMusicPulse.js`, soundtrack analyser). Both start title/countdown facing backward and swing forward into the run; at the finish they continue driving down the road while the camera shifts between a front approach view and a rear view watching the car drive away until the player clicks **Again**. Title shows stacked **THE** / **RACE** wordmark + icy skewed **Start** parallelogram (settings in ☰ menu); finish time/Again appear when the finish camera cycle begins. Regenerate truck atlas: `npm --prefix src/client run generate:truck-atlas` (optional photo overlays via `TRUCK_REFERENCE=/path/to.jpg` or `Race/truck-reference.jpg`).

Constants (engine): `ROAD_HALF`, `CAR_HALF`, `GLOW_HALF`.

---

## On-screen steer controls

- Shown during **tutorial** (with copy + vertical lane line) and **racing**.
- Hidden on **desktop** after a **keyboard steer** key (←/→ or A/D); **≤640px** keeps the diamonds visible (including bounce feedback when tapping the track halves). Resets on **title**, **countdown**, or **tutorial** again.
- Layout: vertically centered; **≥641px** — centers at **25% / 75%**; **≤640px** — inset from edges with safe-area. See `race.css` (`.race-tutorial-steer-row`).

---

## Glowing line & boost

- Random **glowing center-line** segments along the course; special segment near **finish**.
- Stay on line (~1s `lineHold`, `LINE_SUPER_BOOST_HOLD_SEC`) → **super boost** ~**3s** (`SUPER_BOOST_SECONDS`) at ~**2.85×** cruise.
- HUD **boost bar**; cooldown (`LINE_AFTER_SUPER_BOOST_MS`) before next spawn after super boost.
- Off-road slows; **center-of-road pacing** when not on line (`centerPaceMultiplier`).
- Persistent hint while racing: “Follow the line to go faster” (`index.jsx`).

---

## HUD (racing)

- **Track map** (top `>1400px`, bottom `≤1400px`): top-down course trace — green uphill / red downhill, start **S**, checkered finish, car marker, turn, incline & tilt degrees, distance to finish and current speed (km/h); starts **collapsed**; tap the summary row to expand or collapse the map
- Elapsed **time** (centiseconds)
- **Progress** bar (course fraction)
- **Boost** meter

---

## Mountains & world

- **Procedural alpine terrain** (ridged FBM), chunked **left/right** managers following the camera (`mountainTerrainManager.js`, `backgroundMountains.js`).
- **Color-blocked vector mosaic facets:** Non-indexed (`toNonIndexed()`) flat triangle geometry with gradient-stretched vertical shards on steep slopes, per-face Rock/Snow assignment (`normal.y < 0.25` or sharp upper ridge peaks → Rock; `normal.y >= 0.25` → Snow), 3-step quantized `NdotL` cel-shading (Snow: `#FFFFFF`, `#C8E8F5`, `#8AB8CE`; Rock: `#6E828A`, `#465860`), and camera-distance atmospheric washout (`#7BA4BA`).
- **Mountain style:** **Black Mountains** (dark slate/charcoal rock facets without snow, `BLACK_MOUNTAIN_SWATCHES`) | **Icy** (snow-capped vector mosaic, `MOUNTAIN_SWATCHES`) — `mountainStyle.js`, applied via `setMountainStyle` / shader look.
- **Tunnels:** Where terrain would cover the road, bore + arch at **road width** (`buildMountainTunnels`).
- Atmosphere: fog, `#7BA4BA` sky/horizon washout, sun + hemisphere light (`atmosphere.js`).

---

## Audio

- **BGM:** `raceSoundtrack.js` — **Off**, Soulful Adventure (`trap`), East Coast Journey (`upbeat`), Southern Trap Run (`southernTrap`), Boasty Expedition (`reggae` / `boasty.m4a`), **Drizzy Dust Drive** (`drizzyDust` / `drizzy-dust.m4a`), **80s Neon Run** (`eightiesSynth` / `race-80s-synth.mp3`). License notes in file header.
- Phase-based **master volume** (`soundtrackVolumeForPhase`).
- **Engine** layer: Web Audio oscillator; louder on glowing line vs road edge (`roadAudio` in `engine.js`).
- **Countdown** sine tones (`playTone`).
- **Sound on/off** in menu; unlock via first pointer (`unlockAudio`).

---

## Settings (in-app session)

| Setting | Module | Range | Default |
|---------|--------|-------|---------|
| Speed | `speed.js` + `raceSession.js` | 100%–400%, 50% steps | **200%** (multiplier `2`) |
| Music | `raceSoundtrack.js` + `raceSession.js` | tracks + Off | **Boasty Expedition** (`reggae`) |
| Mountains | `mountainStyle.js` + `raceSession.js` | Black Mountains, Icy | **Icy** |
| Car | `carModel.js` + `raceSession.js` | Snowball, Tuff Truck | **Tuff Truck** (`truck`) |
| Length | `courseLayout.js` + `raceSession.js` | Standard, Double, Triple (physical spline length) | **Double** (2×) |
| Course | `courseLayout.js` + `course.js` + `raceSession.js` | Standard, Turns, Hills, All | **Hills** (`hills`) |

Values live in **`raceSession.js`** (memory only). They persist while the SPA is open—**Again**, menu changes, and returning to `/race` without a full reload keep your picks. A **full page reload** resets to defaults. Pickers on **title**, **results**, and **hamburger menu**.

---

## Menu & navigation

- Header: **RIDGE LINE** + menu (opens overlay, **pauses** sim via `setPaused`).
- Menu: pickers, **Restart** (→ countdown), **Sound** toggle, **Home** (`/`); best times are device-local, settings are session-only.
- Full-screen overlay (`race-root`, high z-index).

---

## Personal bests

- Stored in `mvy-race-best` per time length, speed, road scale, and course profile (`readBest` / `writeBest` in `engine.js`).
- Finish UI: **New best** vs **Finish**, current time and **Best** line.

---

## 3D car asset budget

Shipped hero car (when using GLB): `models/race-car.glb`. Limits in `budgets.json`:

| Check | Limit |
|-------|--------|
| Triangle **warn** (CI logs, still passes) | 25,000 |
| Triangle **fail** (CI + deploy) | 30,000 |
| Max texture edge | 2048px |
| Max file size | 8 MB |

From repo root: `npm run check:race-budget`. Until `race-car.glb` exists, the check **skips** with a warning. Atlas procedural cars (`carSuv.js`, `carTruck.js`) are not counted — switch to GLB to enforce the budget.

---

## Module map

| File | Role |
|------|------|
| `index.jsx` | React shell, pickers, phases, tutorial/steer overlay |
| `engine.js` | Three.js world, loop, phases, steering, line/boost, audio hooks |
| `carModel.js` / `carFactory.js` | Car ids, labels, build dispatch |
| `carAtlasLoader.js` | Shared atlas UV region loader |
| `carSuv.js` / `carTruck.js` | Atlas-textured hero meshes + wheel axles |
| `courseLayout.js` / `course.js` | Road scale + course profile spline generation |
| `race.css` | Full-screen UI, countdown, tutorial, HUD, menu |
| `length.js` / `speed.js` | Race duration and pace multiplier |
| `raceSoundtrack.js` | BGM tracks and volume by phase |
| `mountainStyle.js` | Black Mountains / Icy preference |
| `mountainTerrainManager.js` | Terrain chunks + tunnel hookup |
| `backgroundMountains.js` | Noise, displacement, tunnels, materials |
| `atmosphere.js` | Sky, fog, camera far plane |
| `budgets.json` | CI triangle / texture / size limits for `models/race-car.glb` |

---

## Engine API (surface)

`createRace(canvas, hooks)` returns methods including: `start`, `restart`, `setPaused`, `setSpeed`, `setMusicTrack`, `setMountainStyle`, `setRoadScale`, `setCourseProfile`, `setCarModel`, `setSound`, `setTutorialSteer`, `unlockAudio`, `dispose`. Target lap duration is fixed at **3:00** (`length.js` / `RACE_LENGTH.fallback`) for cruise-speed math; use **Length** scale for a longer or shorter physical track.

Hooks: `onLoad`, `onPhase`, `onCountdown`, `onHud`, `onFinish`, `onFinishPresentation`, `onKeyboardSteer`.

---

## Not included

- Online leaderboard or accounts
- Multiplayer
- Cloud sync of settings or times

---

## Changelog (high level)

Document notable behavior changes here when you edit this folder.

- **2025-10-17:** Initial README; defaults Icy / Reggae / 3:00 / 200%; tutorial + persistent touch arrows until keyboard steer; flex/absolute steer layout by breakpoint.
- **2025-10-17:** Added **Drizzy Dust Drive** (`drizzy-dust.m4a`) as default BGM.
- **2025-10-17:** Mobile steer taps no longer trigger text selection (`user-select`, canvas `preventDefault`).
- **2025-10-17:** Mobile finish UI — compact bottom sheet; settings in collapsed **Settings** panel.
- **2026-10-29:** Updated mountain geometry and shader to a snow-dominant color-blocked vector mosaic with non-indexed per-face Rock/Snow assignment (`normal.y < 0.25` + upper ridge peaks), 3-step quantized cel-shading (`#FFFFFF`, `#C8E8F5`, `#8AB8CE`, `#6E828A`, `#465860`), gradient-stretched vertical shards, and `#7BA4BA` atmospheric distance washout (`backgroundMountains.js`, `mountainTerrainManager.js`, `atmosphere.js`), and removed dashed center road lines (`engine.js`).
- **2026-10-29:** Updated default race settings to 200% speed (`2`), Double road scale (`2`), Boasty Expedition music (`reggae`), Tuff Truck (`truck`), and Hills course (`hills`), and kept the opening road straight and level until 0.1 miles past the START line on every course.
- **2026-10-27:** Standard course redesigned as a non-intersecting circular loop with left/right turns up to 90°, light rolling hills, and gradual inward-only left/right road banking up to 75° (`course.js`, `engine.js`, `raceTrackMap.js`).
- **2026-10-22:** Removed in-menu **Length** (time) picker; lap duration fixed at 3:00 — use **Road** scale for track distance.
- **2026-10-22:** Standard course — more/wider straightaways, gentler turn rhythm, longer baseline spline (`course.js`).
- **2025-10-17:** One-line purpose comments on all Race functions; enforced via Cursor rule.
- **2026-10-20:** CI race car budget — warn 25k / fail 30k triangles (`budgets.json`, `npm run check:race-budget`).
