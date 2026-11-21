// Tiny synthesized sounds, made with the Web Audio API and no audio files: a chime for a
// find, a low buzz for a wrong click, a soft ping for a hint, an arpeggio for a cleared
// level and a sad slide for running out of time. The context is created lazily on the
// first user gesture, so a page that never hears a click never asks for audio.
let audioContext = null;

function ensureContext() {
  if (audioContext) return audioContext;
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext ?? window.webkitAudioContext;
  if (!AudioCtx) return null;
  try {
    audioContext = new AudioCtx();
  } catch {
    audioContext = null;
  }
  return audioContext;
}

/** Call once from a user gesture so later sounds are allowed to play. */
export function unlockAudio() {
  const ctx = ensureContext();
  if (ctx && ctx.state === 'suspended') void ctx.resume();
}

function tone(frequency, startAt, length, type, volume) {
  const ctx = ensureContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0, ctx.currentTime + startAt);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + startAt + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startAt + length);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + startAt);
    osc.stop(ctx.currentTime + startAt + length + 0.05);
  } catch {
    // Sound is garnish: a browser that refuses audio never breaks the game.
  }
}

export function playFindSound() {
  tone(660, 0, 0.12, 'sine', 0.18);
  tone(880, 0.09, 0.18, 'sine', 0.18);
}

export function playWrongSound() {
  tone(160, 0, 0.18, 'sawtooth', 0.08);
}

export function playHintSound() {
  tone(1180, 0, 0.15, 'sine', 0.12);
}

export function playLevelClearSound() {
  tone(523, 0, 0.14, 'triangle', 0.18);
  tone(659, 0.12, 0.14, 'triangle', 0.18);
  tone(784, 0.24, 0.22, 'triangle', 0.18);
}

export function playWinSound() {
  tone(523, 0, 0.14, 'triangle', 0.18);
  tone(659, 0.12, 0.14, 'triangle', 0.18);
  tone(784, 0.24, 0.14, 'triangle', 0.18);
  tone(1047, 0.36, 0.3, 'triangle', 0.18);
}

export function playLoseSound() {
  tone(392, 0, 0.2, 'triangle', 0.14);
  tone(330, 0.18, 0.2, 'triangle', 0.14);
  tone(262, 0.36, 0.35, 'triangle', 0.14);
}

export function playTickSound() {
  tone(980, 0, 0.05, 'square', 0.05);
}
