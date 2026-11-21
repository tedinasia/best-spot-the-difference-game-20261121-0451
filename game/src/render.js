// Drawing only: the game's state in, pixels out. Everything is drawn on one 1280x800
// canvas: the header with level, score and time, the two picture panels with their found
// markers and hint ring, the bottom strip with the found counter and buttons, and the
// full-screen overlays for the title, level clear, time up and win screens.
import {
  ACCENT,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  HEADER_BG,
  HEADER_HEIGHT,
  HEADER_TEXT,
  HINT_COLOR,
  INK,
  LEFT_PANEL,
  LOW_TIME_SECONDS,
  MARKER_COLOR,
  PAPER,
  RIGHT_PANEL,
} from './config.js';
import { drawFoundMarker, drawHintRing } from './differences.js';
import { LEVELS } from './levels.js';

export const HINT_BUTTON = { x: 520, y: 624, w: 120, h: 48 };
export const RESTART_BUTTON = { x: 660, y: 624, w: 120, h: 48 };

const TITLE_FONT = 'Georgia, "Times New Roman", serif';
const UI_FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

function formatTime(seconds) {
  const whole = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}

function roundRectPath(ctx, x, y, w, h, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.lineTo(x + radius, y + h);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawHeader(ctx, view) {
  ctx.fillStyle = HEADER_BG;
  ctx.fillRect(0, 0, CANVAS_WIDTH, HEADER_HEIGHT);
  ctx.fillStyle = HEADER_TEXT;
  ctx.font = `bold 32px ${TITLE_FONT}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('LOOK TWICE', 50, 48);
  ctx.font = `20px ${UI_FONT}`;
  ctx.textAlign = 'center';
  const level = LEVELS[view.levelIndex];
  ctx.fillText(`Level ${view.levelIndex + 1} of ${LEVELS.length}  ·  ${level.name}`, CANVAS_WIDTH / 2, 32);
  ctx.font = `16px ${UI_FONT}`;
  ctx.fillStyle = 'rgba(247, 242, 231, 0.75)';
  ctx.fillText(level.tagline, CANVAS_WIDTH / 2, 58);
  ctx.textAlign = 'right';
  ctx.fillStyle = HEADER_TEXT;
  ctx.font = `bold 22px ${UI_FONT}`;
  ctx.fillText(`SCORE  ${view.score}`, 1230, 32);
  const lowTime = view.state === 'playing' && view.timeLeft <= LOW_TIME_SECONDS;
  ctx.fillStyle = lowTime ? '#ff6b61' : HEADER_TEXT;
  ctx.fillText(`TIME  ${formatTime(view.timeLeft)}`, 1230, 62);
  // The timer bar under the header: green, then amber, then red as time runs out.
  const fraction = Math.max(0, Math.min(1, view.timeLeft / view.timeLimit));
  const barColor = view.timeLeft <= LOW_TIME_SECONDS ? '#ff3b30' : view.timeLeft <= 30 ? ACCENT : HINT_COLOR;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.fillRect(0, HEADER_HEIGHT, CANVAS_WIDTH, 10);
  ctx.fillStyle = barColor;
  ctx.fillRect(0, HEADER_HEIGHT, CANVAS_WIDTH * fraction, 10);
}

function drawPanelFrame(ctx, panel, tag) {
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(panel.x - 6, panel.y - 6, panel.w + 12, panel.h + 12);
  ctx.restore();
  ctx.strokeStyle = '#d8cfc0';
  ctx.lineWidth = 2;
  ctx.strokeRect(panel.x - 6, panel.y - 6, panel.w + 12, panel.h + 12);
  // A small tag naming the panel, under the frame so it never collides with the header.
  ctx.fillStyle = 'rgba(32, 36, 46, 0.6)';
  ctx.font = `bold 14px ${UI_FONT}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(tag, panel.x + 2, panel.y + panel.h + 24);
}

function drawPanels(ctx, view, nowMs) {
  const level = LEVELS[view.levelIndex];
  drawPanelFrame(ctx, LEFT_PANEL, 'PICTURE A');
  drawPanelFrame(ctx, RIGHT_PANEL, 'PICTURE B');
  // Left: the base picture. Right: the same scene with every difference applied.
  ctx.save();
  ctx.beginPath();
  ctx.rect(LEFT_PANEL.x, LEFT_PANEL.y, LEFT_PANEL.w, LEFT_PANEL.h);
  ctx.clip();
  ctx.translate(LEFT_PANEL.x, LEFT_PANEL.y);
  level.scene.draw(ctx, new Set());
  ctx.restore();
  ctx.save();
  ctx.beginPath();
  ctx.rect(RIGHT_PANEL.x, RIGHT_PANEL.y, RIGHT_PANEL.w, RIGHT_PANEL.h);
  ctx.clip();
  ctx.translate(RIGHT_PANEL.x, RIGHT_PANEL.y);
  const allIds = new Set(level.scene.differences.map((diff) => diff.id));
  level.scene.draw(ctx, allIds);
  ctx.restore();
  // Markers for found differences, on both pictures.
  for (const diff of level.scene.differences) {
    const foundAt = view.found.get(diff.id);
    if (foundAt === undefined) continue;
    for (const panel of [LEFT_PANEL, RIGHT_PANEL]) {
      ctx.save();
      ctx.translate(panel.x, panel.y);
      drawFoundMarker(ctx, diff, foundAt, nowMs);
      ctx.restore();
    }
  }
  // The hint ring, on both pictures too.
  if (view.hintRing) {
    for (const panel of [LEFT_PANEL, RIGHT_PANEL]) {
      ctx.save();
      ctx.translate(panel.x, panel.y);
      drawHintRing(ctx, view.hintRing.diff, view.hintRing.startedAt, nowMs, view.hintRing.durationMs);
      ctx.restore();
    }
  }
  // A red X where the last wrong click landed, fading fast.
  if (view.wrongFlash) {
    const age = nowMs - view.wrongFlash.startedAt;
    const alpha = Math.max(0, 1 - age / 450);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = MARKER_COLOR;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    const { x, y } = view.wrongFlash;
    ctx.beginPath();
    ctx.moveTo(x - 12, y - 12);
    ctx.lineTo(x + 12, y + 12);
    ctx.moveTo(x + 12, y - 12);
    ctx.lineTo(x - 12, y + 12);
    ctx.stroke();
    ctx.restore();
  }
}

function drawLevelDots(ctx, view) {
  for (let i = 0; i < LEVELS.length; i++) {
    const x = 66 + i * 30;
    const y = 566;
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    if (i < view.levelIndex || (view.state === 'win' && i === LEVELS.length - 1)) {
      ctx.fillStyle = ACCENT;
      ctx.fill();
    } else if (i === view.levelIndex) {
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = ACCENT;
      ctx.lineWidth = 3;
      ctx.stroke();
    } else {
      ctx.strokeStyle = 'rgba(32, 36, 46, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
  ctx.fillStyle = 'rgba(32, 36, 46, 0.6)';
  ctx.font = `14px ${UI_FONT}`;
  ctx.textAlign = 'left';
  ctx.fillText('LEVELS', 50, 592);
}

function drawBottomBar(ctx, view, nowMs) {
  const level = LEVELS[view.levelIndex];
  const total = level.scene.differences.length;
  const found = view.found.size;
  drawLevelDots(ctx, view);
  // The big counter only belongs to live play: under an overlay card it would peek out
  // half-covered and read as the wrong number.
  if (view.state === 'playing') {
    ctx.fillStyle = INK;
    ctx.font = `16px ${UI_FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText('DIFFERENCES FOUND', CANVAS_WIDTH / 2, 556);
    ctx.font = `bold 44px ${TITLE_FONT}`;
    ctx.fillText(`${found} / ${total}`, CANVAS_WIDTH / 2, 600);
  }
  // Hint button.
  const hintsOut = view.hintsLeft === 0;
  ctx.save();
  roundRectPath(ctx, HINT_BUTTON.x, HINT_BUTTON.y, HINT_BUTTON.w, HINT_BUTTON.h, 10);
  ctx.fillStyle = hintsOut ? '#c9c2b2' : HINT_COLOR;
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold 18px ${UI_FONT}`;
  ctx.fillText(`HINT (${view.hintsLeft})`, HINT_BUTTON.x + HINT_BUTTON.w / 2, HINT_BUTTON.y + 30);
  ctx.restore();
  // Restart button.
  ctx.save();
  roundRectPath(ctx, RESTART_BUTTON.x, RESTART_BUTTON.y, RESTART_BUTTON.w, RESTART_BUTTON.h, 10);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = INK;
  ctx.font = `bold 18px ${UI_FONT}`;
  ctx.fillText('RESTART', RESTART_BUTTON.x + RESTART_BUTTON.w / 2, RESTART_BUTTON.y + 30);
  ctx.restore();
  // The message line under the buttons.
  if (view.message && nowMs < view.messageUntil) {
    const fade = Math.min(1, (view.messageUntil - nowMs) / 500);
    ctx.save();
    ctx.globalAlpha = fade;
    ctx.fillStyle = view.messageGood ? '#1d7a44' : '#c0392b';
    ctx.font = `italic 20px ${TITLE_FONT}`;
    ctx.fillText(view.message, CANVAS_WIDTH / 2, 706);
    ctx.restore();
  }
  ctx.fillStyle = 'rgba(32, 36, 46, 0.55)';
  ctx.font = `15px ${UI_FONT}`;
  ctx.fillText('Click a difference on either picture  ·  H = hint  ·  R = restart  ·  Enter = continue', CANVAS_WIDTH / 2, 748);
}

function drawOverlayCard(ctx, title, lines, prompt, nowMs) {
  ctx.save();
  ctx.fillStyle = 'rgba(16, 20, 28, 0.72)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  const cardW = 780;
  const cardH = 150 + lines.length * 36 + 70;
  const cardX = (CANVAS_WIDTH - cardW) / 2;
  const cardY = (CANVAS_HEIGHT - cardH) / 2;
  ctx.fillStyle = PAPER;
  roundRectPath(ctx, cardX, cardY, cardW, cardH, 16);
  ctx.fill();
  ctx.strokeStyle = ACCENT;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = INK;
  ctx.font = `bold 52px ${TITLE_FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText(title, CANVAS_WIDTH / 2, cardY + 84);
  ctx.font = `21px ${UI_FONT}`;
  ctx.fillStyle = 'rgba(32, 36, 46, 0.85)';
  lines.forEach((line, i) => {
    ctx.fillText(line, CANVAS_WIDTH / 2, cardY + 140 + i * 36);
  });
  // The prompt pulses gently so it reads as an invitation, not a label.
  const pulse = 0.65 + 0.35 * Math.sin((nowMs / 450) * Math.PI);
  ctx.save();
  ctx.globalAlpha = pulse;
  ctx.fillStyle = '#c0392b';
  ctx.font = `bold 22px ${UI_FONT}`;
  ctx.fillText(prompt, CANVAS_WIDTH / 2, cardY + cardH - 28);
  ctx.restore();
  ctx.restore();
}

function drawTitleOverlay(ctx, view, nowMs) {
  const lines = [
    'Two pictures hang side by side — they are almost the same.',
    'Click every difference you spot, on either picture.',
    'Find them all before the clock runs out. A hint costs 50 points.',
    '',
    ...LEVELS.map((level, i) => `${i + 1} · ${level.name} — ${level.scene.differences.length} differences, ${formatTime(level.timeLimit)}`),
  ];
  drawOverlayCard(ctx, 'LOOK TWICE', lines, 'Click or press Enter to begin', nowMs);
}

function drawLevelClearOverlay(ctx, view, nowMs) {
  const level = LEVELS[view.levelIndex];
  const lines = [
    `${level.name} — all ${level.scene.differences.length} differences found.`,
    `Time bonus +${view.levelClearBonus}  ·  Score ${view.score}`,
    '',
    view.levelIndex + 1 < LEVELS.length
      ? `Next up: ${LEVELS[view.levelIndex + 1].name}`
      : 'That was the last scene — one more step to the finish.',
  ];
  drawOverlayCard(ctx, 'LEVEL CLEAR!', lines, 'Press Enter for the next level', nowMs);
}

function drawGameOverOverlay(ctx, view, nowMs) {
  const level = LEVELS[view.levelIndex];
  const lines = [
    `You found ${view.found.size} of ${level.scene.differences.length} differences in ${level.name}.`,
    'The clock ran out — the rest are still hiding.',
    '',
    `Score ${view.score}`,
  ];
  drawOverlayCard(ctx, "TIME'S UP!", lines, 'Press R to try this level again', nowMs);
}

function drawWinOverlay(ctx, view, nowMs) {
  const total = LEVELS.reduce((sum, level) => sum + level.scene.differences.length, 0);
  const lines = [
    `${total} differences across ${LEVELS.length} scenes — every single one found.`,
    '',
    `Final score ${view.score}`,
    'Thank you for looking twice.',
  ];
  drawOverlayCard(ctx, 'YOU FOUND THEM ALL!', lines, 'Press Enter to play again', nowMs);
}

/** Paint one frame from the game's view of itself. */
export function drawGame(ctx, view, nowMs) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  // The scenes stay visible behind every overlay, so the game is always the backdrop.
  drawHeader(ctx, view);
  drawPanels(ctx, view, nowMs);
  drawBottomBar(ctx, view, nowMs);
  if (view.state === 'title') drawTitleOverlay(ctx, view, nowMs);
  else if (view.state === 'levelClear') drawLevelClearOverlay(ctx, view, nowMs);
  else if (view.state === 'gameOver') drawGameOverOverlay(ctx, view, nowMs);
  else if (view.state === 'win') drawWinOverlay(ctx, view, nowMs);
}
