// Pointer and keyboard input: translating browser events into canvas coordinates and
// the small geometry tests (inside a rectangle, inside a panel) the game uses to decide
// what a click meant. The canvas is a fixed 1280x800 logical area scaled to the window,
// so every event is rescaled back into that area first.
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './config.js';

/** A client (mouse/touch) position rescaled into the game's 1280x800 coordinates. */
export function canvasPoint(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) * CANVAS_WIDTH) / rect.width,
    y: ((clientY - rect.top) * CANVAS_HEIGHT) / rect.height,
  };
}

/** Wire pointer clicks and key presses to the game's handlers. */
export function attachInput(canvas, handlers) {
  canvas.addEventListener('pointerdown', (event) => {
    const point = canvasPoint(canvas, event.clientX, event.clientY);
    handlers.onPointer(point.x, point.y);
  });
  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    handlers.onKey(event.key);
  });
}

export function pointInRect(point, rect) {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.w &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.h
  );
}

export function pointInPanel(point, panel) {
  return pointInRect(point, panel);
}

/** A canvas point expressed in a panel's own scene coordinates (0..560, 0..420). */
export function panelScenePoint(point, panel) {
  return { x: point.x - panel.x, y: point.y - panel.y };
}
