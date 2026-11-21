# Look Twice — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/tedinasia/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/tedinasia/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

**Bounty:** https://make.fun/bounty/best-spot-the-difference-game-20261121-0451

A spot-the-difference game in three hand-drawn scenes. Two pictures hang side by
side — almost the same. Click every difference you spot, on either picture, before
the clock runs out.

## The scenes

1. **Sunny Harbor** — a fishing pier, a striped lighthouse and a sailboat. 6 differences, 2:00.
2. **The Old Library** — a cat asleep on the armchair, books, a ticking clock. 7 differences, 1:40.
3. **Lantern Night Market** — lanterns, steam and bargaining after dark. 8 differences, 1:30.

## How to play

- **Click** a difference on either picture to mark it with a red ring. Wrong clicks cost 2 seconds and reset your combo.
- **H** — hint: a green ring points at one difference you haven't found yet (3 per level, 50 points each).
- **R** — restart the level. **Enter** — continue to the next level.
- Finds score 100 points plus a 25-point combo step; clearing a level pays a time bonus of 10 points per second left.

## Play it

```sh
node serve.ts
# open http://localhost:8080
```

No build step, no network requests: every picture is drawn in code (canvas 2D), every
sound is synthesized with the Web Audio API. The game is plain static files under
`game/`.

## Layout

- `game/index.html` — the page shell and canvas.
- `game/src/config.js` — canvas size, panel geometry, colours, scoring and timing.
- `game/src/scene-harbor.js`, `scene-library.js`, `scene-market.js` — the three scenes, each drawn from code with its own differences.
- `game/src/levels.js` — the level list: scene, time limit, tagline.
- `game/src/differences.js` — hit-testing, found markers and the hint ring.
- `game/src/audio.js` — synthesized sounds (Web Audio, no audio files).
- `game/src/input.js` — pointer and keyboard input, canvas coordinates.
- `game/src/render.js` — header, panels, HUD, overlays.
- `game/src/game.js` — the state machine: title, playing, level clear, time up, win.
- `game/src/shots.js` — the `?shot=` scenes the screenshots were taken from.
- `main.ts` — the hand-in program: copies `game/` and `screenshots/` to `/output` and writes `dossier.json`.
