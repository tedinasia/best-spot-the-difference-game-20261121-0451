// The difference model: finding a difference by clicking, and drawing the red ring that
// marks one that has been found. A difference is a circle in scene coordinates; a click
// counts when it lands inside an unfound circle, on either panel.
import { FOUND_POP_MS, MARKER_COLOR, MARKER_GLOW } from './config.js';

/** The first unfound difference whose circle holds (x, y), in scene coordinates. */
export function findDifferenceAt(differences, foundIds, x, y) {
  for (const diff of differences) {
    if (foundIds.has(diff.id)) continue;
    const dx = x - diff.x;
    const dy = y - diff.y;
    if (dx * dx + dy * dy <= diff.r * diff.r) return diff;
  }
  return null;
}

/** A difference the player has not found yet, picked at random (for hints). */
export function pickUnfoundDifference(differences, foundIds) {
  const remaining = differences.filter((diff) => !foundIds.has(diff.id));
  if (remaining.length === 0) return null;
  return remaining[Math.floor(Math.random() * remaining.length)];
}

/** The red ring and tick drawn over a found difference, popping in over FOUND_POP_MS. */
export function drawFoundMarker(ctx, diff, foundAtMs, nowMs) {
  const age = nowMs - foundAtMs;
  const progress = Math.min(1, age / FOUND_POP_MS);
  const ease = 1 - (1 - progress) * (1 - progress);
  const radius = diff.r * (0.6 + 0.4 * ease);
  ctx.save();
  ctx.globalAlpha = 0.35 + 0.65 * ease;
  ctx.strokeStyle = MARKER_GLOW;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, radius + 4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = MARKER_COLOR;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, radius, 0, Math.PI * 2);
  ctx.stroke();
  // A small tick in the middle of the ring.
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(diff.x - radius * 0.4, diff.y);
  ctx.lineTo(diff.x - radius * 0.12, diff.y + radius * 0.32);
  ctx.lineTo(diff.x + radius * 0.45, diff.y - radius * 0.32);
  ctx.stroke();
  ctx.restore();
}

/** A pulsing green ring that points at one unfound difference while a hint lasts. */
export function drawHintRing(ctx, diff, startedAtMs, nowMs, durationMs) {
  const age = nowMs - startedAtMs;
  const pulse = 0.5 + 0.5 * Math.sin((age / 300) * Math.PI);
  const radius = diff.r + 6 + pulse * 6;
  ctx.save();
  ctx.globalAlpha = 0.55 + 0.4 * pulse;
  ctx.strokeStyle = '#2fbf71';
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
  void durationMs;
}
