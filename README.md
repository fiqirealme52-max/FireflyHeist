# FIREFLY: The Midnight Archive

[![make.fun · best-stealth-game-20261121-1759](https://make.fun/badge/best-stealth-game-20261121-1759.svg)](https://make.fun/bounty/best-stealth-game-20261121-1759?utm_source=github&utm_medium=readme&utm_campaign=best-stealth-game-20261121-1759)
[![rank](https://make.fun/badge/best-stealth-game-20261121-1759/fiqirealme52-max/FireflyHeist/rank.svg)](https://make.fun/bounty/best-stealth-game-20261121-1759/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-stealth-game-20261121-1759)
[![reward](https://make.fun/badge/best-stealth-game-20261121-1759/fiqirealme52-max/FireflyHeist/reward.svg)](https://make.fun/bounty/best-stealth-game-20261121-1759?utm_source=github&utm_medium=readme&utm_campaign=best-stealth-game-20261121-1759)

A top-down stealth game: you are a firefly thief in a midnight archive.
Move slowly and you are dark, unseen. Dash and you **glow** — and guards
see the glow from farther away. Light is your enemy and your tool.

**3 wings, 9 guards, 21 relics, 1 dawn.**

- **3 wings** — The Reading Room, The Map Gallery, The Vault of Dawn.
- **9 guards** patrol with **raycast vision cones** (yellow, blocked by
  bookshelves, pillars and plants — cover really works).
- **21 glowing relics** to snatch (press **E**). Snatch all 7 in a wing
  to open the vault door, then reach it unseen.
- **Alarm meter** rises when a guard's cone touches you; at 100% you are
  caught and the wing restarts. Breaking line of sight lets it fall.
- **Glow meter** — dashing (Shift) makes you bright and fast, but
  visible from much farther. Creeping keeps you dark.
- **Dawn timer** — a soft countdown; finish before dawn for the bonus.
- Wing-clear screen shows relics, time and the **UNSEEN** bonus.

## Controls

- **WASD / arrows** — move (slow = dark)
- **Shift** — dash (fast, but you glow bright)
- **E** — snatch a relic
- **Mouse** — click to walk toward a spot; **Enter** — advance screens

## Play

Open `game/index.html` in desktop Chrome (or run `node serve.ts` and
open http://localhost:8080). No network requests — all art is drawn in
code, all sound is tiny WebAudio bleeps.

## Screenshots

Deterministic scenes via query params (see `shots.json`):

- `?shot=cover` — hero shot, wing 2, thief mid-room, 3 guards sweeping
- `?shot=hide` — thief behind a bookshelf, cone passing over the cover
- `?shot=dash` — thief dashing with a bright glow halo, alarm ~60%
- `?shot=clear` — wing-clear screen, "WING CLEAR — UNSEEN"

## Files

- `game/index.html` — the game page (canvas, no network)
- `game/src/main.js` — game loop and state
- `game/src/levels.js` — the 3 wings (walls, relics, guard patrols)
- `game/src/guards.js` — patrol, raycast vision cones, detection
- `game/src/render.js` — all drawing: floor, cones, HUD, screens
- `game/src/input.js` — keyboard + mouse
- `game/src/audio.js` — tiny WebAudio bleeps
- `game/src/shots.js` — deterministic screenshot scenes
- `main.ts` — hands the game in (copies game/ + screenshots/, writes dossier.json)
