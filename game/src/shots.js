// The screenshot scenes behind ?shot=start|play|hint|clear. Each one stages the real game
// into a fixed state — the same code the player runs, just pre-arranged — so a screenshot
// is a genuine render of the game: title, mid-hunt with markers, a hint in use, or a
// cleared level. Any other name stages the title.
export function stageShot(name, game) {
  if (name === 'play') {
    // Harbor, half found: three red rings on both pictures, three still to find.
    game.stagePlay(0, ['gull', 'sail', 'buoy'], 87, 325);
  } else if (name === 'hint') {
    // Library, two found and a hint ring pulsing around the clock.
    game.stageHint(1, ['book', 'teacup'], 'clock', 64, 225);
  } else if (name === 'clear') {
    // Night market cleared with time to spare, the level-clear card on top.
    game.stageClear(2, 41, 1480);
  } else {
    game.stageTitle();
  }
}
