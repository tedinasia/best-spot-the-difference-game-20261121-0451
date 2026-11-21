// Shared constants for Look Twice: canvas size, panel geometry, colours and timing.
// Every module that positions anything on screen reads these, so the layout lives in one place.
export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 800;

export const SCENE_WIDTH = 560;
export const SCENE_HEIGHT = 420;

// The two picture panels, side by side, in canvas coordinates.
export const LEFT_PANEL = { x: 50, y: 96, w: SCENE_WIDTH, h: SCENE_HEIGHT };
export const RIGHT_PANEL = { x: 670, y: 96, w: SCENE_WIDTH, h: SCENE_HEIGHT };

// Header strip at the top.
export const HEADER_HEIGHT = 76;

// Colours for the frame, the HUD and the found-difference markers.
export const INK = '#20242e';
export const PAPER = '#f7f2e7';
export const HEADER_BG = '#1d2733';
export const HEADER_TEXT = '#f7f2e7';
export const ACCENT = '#e8a13c';
export const MARKER_COLOR = '#ff3b30';
export const MARKER_GLOW = 'rgba(255, 59, 48, 0.25)';
export const HINT_COLOR = '#2fbf71';

// Scoring and timing.
export const POINTS_PER_FIND = 100;
export const COMBO_STEP = 25;
export const TIME_BONUS_PER_SECOND = 10;
export const WRONG_CLICK_TIME_COST = 2;
export const HINT_COST = 50;
export const HINTS_PER_LEVEL = 3;
export const HINT_RING_MS = 2500;
export const WRONG_FLASH_MS = 450;
export const FOUND_POP_MS = 420;
export const LOW_TIME_SECONDS = 10;
