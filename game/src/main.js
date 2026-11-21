// Boot and the one loop: read the pointer and keys, advance the game clock, paint the
// frame. ?shot=start|play|hint|clear stages a fixed scene for a screenshot instead of
// running the loop, and sets window.__shotReady once it has painted, so the screenshot
// tool knows the frame is ready.
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './config.js';
import { createGame } from './game.js';
import { attachInput } from './input.js';
import { drawGame } from './render.js';
import { stageShot } from './shots.js';

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const game = createGame((message) => {
  status.textContent = message;
});

function paint(nowMs) {
  drawGame(ctx, game.view, nowMs);
}

function runShot(name) {
  stageShot(name, game);
  let painted = 0;
  function paintTwice(nowMs) {
    paint(nowMs);
    painted += 1;
    if (painted < 2) requestAnimationFrame(paintTwice);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paintTwice);
}

function runGame() {
  attachInput(canvas, {
    onPointer(x, y) {
      game.onPointer(x, y, performance.now());
    },
    onKey(key) {
      game.onKey(key, performance.now());
    },
  });

  // Leaving the tab freezes the clock: the timer only runs while the game is visible.
  let lastVisible = performance.now();
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) lastVisible = performance.now();
  });

  function frame(nowMs) {
    requestAnimationFrame(frame);
    if (!document.hidden) {
      game.update(nowMs);
      lastVisible = nowMs;
    }
    paint(nowMs);
    void lastVisible;
  }

  status.textContent = 'Look Twice. Click or press Enter to start.';
  requestAnimationFrame(frame);
}

if (shot) runShot(shot);
else runGame();
