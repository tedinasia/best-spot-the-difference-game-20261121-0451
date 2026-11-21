// The game itself: a small state machine (title, playing, levelClear, gameOver, win) that
// owns the score, the combo, the clock, the hints and the found set, and answers clicks
// and keys. Drawing lives in render.js; this file only decides what the next frame means.
import {
  COMBO_STEP,
  HINTS_PER_LEVEL,
  HINT_COST,
  HINT_RING_MS,
  LEFT_PANEL,
  LOW_TIME_SECONDS,
  POINTS_PER_FIND,
  RIGHT_PANEL,
  TIME_BONUS_PER_SECOND,
  WRONG_CLICK_TIME_COST,
  WRONG_FLASH_MS,
} from './config.js';
import { findDifferenceAt, pickUnfoundDifference } from './differences.js';
import {
  playFindSound,
  playHintSound,
  playLevelClearSound,
  playLoseSound,
  playTickSound,
  playWinSound,
  playWrongSound,
  unlockAudio,
} from './audio.js';
import { pointInPanel, pointInRect, panelScenePoint } from './input.js';
import { HINT_BUTTON, RESTART_BUTTON } from './render.js';
import { LEVELS } from './levels.js';

const MESSAGE_MS = 2600;

/** Create the game. `announce` is called with the text a screen reader should speak. */
export function createGame(announce) {
  const view = {
    state: 'title',
    levelIndex: 0,
    found: new Map(),
    score: 0,
    combo: 0,
    timeLeft: LEVELS[0].timeLimit,
    timeLimit: LEVELS[0].timeLimit,
    hintsLeft: HINTS_PER_LEVEL,
    message: '',
    messageGood: true,
    messageUntil: 0,
    hintRing: null,
    wrongFlash: null,
    levelClearBonus: 0,
  };
  let lastNow = 0;
  let lastWholeSecond = -1;
  let scoreAtLevelStart = 0;

  function level() {
    return LEVELS[view.levelIndex];
  }

  function say(message, good) {
    view.message = message;
    view.messageGood = good;
    view.messageUntil = performance.now() + MESSAGE_MS;
    if (announce) announce(message);
  }

  function startLevel(index, keepScore) {
    view.levelIndex = index;
    view.found = new Map();
    view.combo = 0;
    view.timeLeft = level().timeLimit;
    view.timeLimit = level().timeLimit;
    view.hintsLeft = HINTS_PER_LEVEL;
    view.hintRing = null;
    view.wrongFlash = null;
    view.levelClearBonus = 0;
    if (!keepScore) view.score = 0;
    scoreAtLevelStart = view.score;
    view.state = 'playing';
    lastWholeSecond = -1;
    say(`Level ${index + 1}: ${level().name} — find ${level().scene.differences.length} differences!`, true);
  }

  function startGame() {
    view.score = 0;
    startLevel(0, false);
  }

  function clearLevel(nowMs) {
    const bonus = Math.ceil(view.timeLeft) * TIME_BONUS_PER_SECOND;
    view.levelClearBonus = bonus;
    view.score += bonus;
    view.state = 'levelClear';
    view.hintRing = null;
    playLevelClearSound();
    say(`Level clear! Time bonus +${bonus}.`, true);
    void nowMs;
  }

  function advanceLevel() {
    if (view.levelIndex + 1 < LEVELS.length) {
      startLevel(view.levelIndex + 1, true);
    } else {
      view.state = 'win';
      playWinSound();
      say('You found them all!', true);
    }
  }

  function useHint(nowMs) {
    if (view.state !== 'playing') return;
    if (view.hintsLeft <= 0) {
      say('No hints left on this level.', false);
      return;
    }
    const diff = pickUnfoundDifference(level().scene.differences, view.found);
    if (!diff) return;
    view.hintsLeft -= 1;
    view.score = Math.max(0, view.score - HINT_COST);
    view.hintRing = { diff, startedAt: nowMs, durationMs: HINT_RING_MS };
    playHintSound();
    say(`Hint: ${diff.hint} (−${HINT_COST} points)`, true);
  }

  function restartLevel() {
    // Restarting a level gives its points back: the score returns to where the level began.
    view.score = scoreAtLevelStart;
    startLevel(view.levelIndex, true);
  }

  function handleFind(diff, nowMs) {
    view.found.set(diff.id, nowMs);
    view.combo += 1;
    const points = POINTS_PER_FIND + (view.combo - 1) * COMBO_STEP;
    view.score += points;
    playFindSound();
    const remaining = level().scene.differences.length - view.found.size;
    if (remaining === 0) {
      say(`Found it! +${points} — that was the last one!`, true);
      clearLevel(nowMs);
    } else {
      say(
        `Found it! +${points}${view.combo > 1 ? ` (combo x${view.combo})` : ''} — ${remaining} to go.`,
        true,
      );
    }
  }

  function handleWrong(x, y, nowMs) {
    view.combo = 0;
    view.timeLeft = Math.max(0, view.timeLeft - WRONG_CLICK_TIME_COST);
    view.wrongFlash = { x, y, startedAt: nowMs };
    playWrongSound();
    say(`Not a difference — ${WRONG_CLICK_TIME_COST} seconds lost.`, false);
  }

  function onPointer(x, y, nowMs) {
    unlockAudio();
    if (view.state === 'title') {
      startGame();
      return;
    }
    if (view.state === 'levelClear') {
      advanceLevel();
      return;
    }
    if (view.state === 'win') {
      startGame();
      return;
    }
    if (view.state !== 'playing') return;
    if (pointInRect({ x, y }, HINT_BUTTON)) {
      useHint(nowMs);
      return;
    }
    if (pointInRect({ x, y }, RESTART_BUTTON)) {
      restartLevel();
      return;
    }
    for (const panel of [LEFT_PANEL, RIGHT_PANEL]) {
      if (!pointInPanel({ x, y }, panel)) continue;
      const scenePoint = panelScenePoint({ x, y }, panel);
      const diff = findDifferenceAt(level().scene.differences, view.found, scenePoint.x, scenePoint.y);
      if (diff) handleFind(diff, nowMs);
      else handleWrong(x, y, nowMs);
      return;
    }
  }

  function onKey(key, nowMs) {
    unlockAudio();
    const lower = key.toLowerCase();
    if (key === 'Enter' || key === ' ') {
      if (view.state === 'title' || view.state === 'win') startGame();
      else if (view.state === 'levelClear') advanceLevel();
      return;
    }
    if (lower === 'h') {
      useHint(nowMs);
      return;
    }
    if (lower === 'r') {
      if (view.state === 'playing' || view.state === 'gameOver') restartLevel();
    }
  }

  /** Advance the clock and expire the hint ring and wrong-click flash. */
  function update(nowMs) {
    if (lastNow === 0) lastNow = nowMs;
    const dt = Math.min(0.25, (nowMs - lastNow) / 1000);
    lastNow = nowMs;
    if (view.hintRing && nowMs - view.hintRing.startedAt > view.hintRing.durationMs) {
      view.hintRing = null;
    }
    if (view.wrongFlash && nowMs - view.wrongFlash.startedAt > WRONG_FLASH_MS) {
      view.wrongFlash = null;
    }
    if (view.state !== 'playing') return;
    view.timeLeft -= dt;
    const whole = Math.ceil(view.timeLeft);
    if (view.timeLeft <= LOW_TIME_SECONDS && whole !== lastWholeSecond && whole > 0) {
      lastWholeSecond = whole;
      playTickSound();
    }
    if (view.timeLeft <= 0) {
      view.timeLeft = 0;
      view.state = 'gameOver';
      view.hintRing = null;
      playLoseSound();
      say(`Time's up! You found ${view.found.size} of ${level().scene.differences.length}.`, false);
    }
  }

  // --- Staging helpers for screenshots (?shot=...): put the game into a fixed, readable
  // state without playing, so the screenshots show the game at its best. ---
  function stageTitle() {
    view.state = 'title';
    view.levelIndex = 0;
    view.found = new Map();
    view.score = 0;
    view.timeLeft = LEVELS[0].timeLimit;
    view.timeLimit = LEVELS[0].timeLimit;
    view.hintsLeft = HINTS_PER_LEVEL;
    view.hintRing = null;
    view.wrongFlash = null;
    view.message = '';
  }

  function stagePlay(levelIndex, foundIds, timeLeft, score) {
    startLevel(levelIndex, true);
    view.score = score;
    view.timeLeft = timeLeft;
    const nowMs = performance.now();
    for (const id of foundIds) view.found.set(id, nowMs - 1000);
    view.message = '';
  }

  function stageHint(levelIndex, foundIds, hintId, timeLeft, score) {
    stagePlay(levelIndex, foundIds, timeLeft, score);
    const diff = level().scene.differences.find((item) => item.id === hintId);
    if (diff) view.hintRing = { diff, startedAt: performance.now() - 800, durationMs: HINT_RING_MS * 4 };
    view.message = '';
  }

  function stageClear(levelIndex, timeLeft, score) {
    startLevel(levelIndex, true);
    const nowMs = performance.now();
    for (const diff of level().scene.differences) view.found.set(diff.id, nowMs - 1000);
    view.timeLeft = timeLeft;
    const bonus = Math.ceil(timeLeft) * TIME_BONUS_PER_SECOND;
    view.levelClearBonus = bonus;
    view.score = score;
    view.state = 'levelClear';
    view.message = '';
  }

  return {
    view,
    onPointer,
    onKey,
    update,
    startGame,
    startLevel,
    stageTitle,
    stagePlay,
    stageHint,
    stageClear,
  };
}
