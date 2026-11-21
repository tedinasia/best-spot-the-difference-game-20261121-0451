// The three levels of Look Twice, easiest first. Each level names its scene, its time
// limit and the short line shown on the title screen, so adding a level is one entry here.
import { harborScene } from './scene-harbor.js';
import { libraryScene } from './scene-library.js';
import { marketScene } from './scene-market.js';

export const LEVELS = [
  {
    id: 'harbor',
    name: 'Sunny Harbor',
    tagline: 'A quiet morning at the fishing pier. 6 differences.',
    timeLimit: 120,
    scene: harborScene,
  },
  {
    id: 'library',
    name: 'The Old Library',
    tagline: 'Rain on the window, a cat asleep. 7 differences.',
    timeLimit: 100,
    scene: libraryScene,
  },
  {
    id: 'market',
    name: 'Lantern Night Market',
    tagline: 'Lanterns, steam and bargaining after dark. 8 differences.',
    timeLimit: 90,
    scene: marketScene,
  },
];

export function levelCount() {
  return LEVELS.length;
}

export function totalDifferences() {
  return LEVELS.reduce((sum, level) => sum + level.scene.differences.length, 0);
}
