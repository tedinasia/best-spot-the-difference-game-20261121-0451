// Look Twice — the hand-in program (Node 22, standard library only).
//
// The game lives in this directory's game/ folder: plain static files that a desktop
// browser loads offline (game/index.html plus its ES modules, no library, no network
// request at all). This program packs the entry for the grader: it copies game/ and
// screenshots/ from beside this file into the output directory and writes
// /output/dossier.json, the summary the judge reads, using the vendored make.fun
// library in vendor/makefun-game.ts.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// In the grader's container MAKEFUN_OUTPUT_DIR is unset and /output is used.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

// The repository root is the folder this file sits in; the output directory is /output
// unless MAKEFUN_OUTPUT_DIR says otherwise.
const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function copyEntryFiles() {
  mkdirSync(outputDir, { recursive: true });
  cpSync(join(repoRoot, 'game'), join(outputDir, 'game'), { recursive: true });
  mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
  if (existsSync(join(repoRoot, 'screenshots'))) {
    cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
  }
}

// The scorer's own caps, from the kit's gate: the text budget shapes the dossier's bytes,
// the rest refuse an entry the scorer would refuse anyway (more than 4 screenshots or
// one over 256 KiB; more than 993 files in game/ or 48 MiB of game files in all; a path
// under game/ over 1000 bytes). game/ counts beside /output's own 1000-entry cap, which
// it shares with screenshots/ and dossier.json.
const DOSSIER_LIMITS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
};

copyEntryFiles();
writeFileSync(join(outputDir, 'dossier.json'), buildDossier(outputDir, DOSSIER_LIMITS));
