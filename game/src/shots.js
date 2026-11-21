// Deterministic shot scenes for screenshots (?shot=cover|hide|dash|clear).
// Each stages a frozen, readable frame of the real game — same code path
// as play, with the simulation paused so the render is stable.
// Documented in shots.json at the repo root.

export function stageShot(state, shot) {
  state.mode = 'play';
  state.frozen = true;
  state.toast = null;

  if (shot === 'cover') {
    // Hero shot: wing 2, thief mid-room glowing faintly, 3 guards sweeping.
    state.wingIndex = 1;
    state.loadWing(1);
    state.player.x = 640; state.player.y = 430;
    state.glow = 0.35;
    state.alarm = 0.18;
    state.guards[0].x = 500; state.guards[0].y = 300; state.guards[0].dir = 0.5;
    state.guards[1].x = 260; state.guards[1].y = 380; state.guards[1].dir = -0.4;
    state.guards[2].x = 1150; state.guards[2].y = 470; state.guards[2].dir = 2.9;
    state.wing.relics[1].taken = true; // one already snatched
    state.relicsGot = 8;
    state.dawnLeft = 301;
  } else if (shot === 'hide') {
    // Stealth core: thief tucked behind a bookshelf, cone passing overhead.
    state.wingIndex = 0;
    state.loadWing(0);
    state.player.x = 700; state.player.y = 205;
    state.glow = 0.04;
    state.alarm = 0.12;
    state.guards[0].x = 700; state.guards[0].y = 110; state.guards[0].dir = Math.PI / 2;
    state.guards[1].x = 200; state.guards[1].y = 640; state.guards[1].dir = 0;
    state.guards[2].x = 1120; state.guards[2].y = 300; state.guards[2].dir = Math.PI;
    state.relicsGot = 2;
    state.dawnLeft = 388;
  } else if (shot === 'dash') {
    // The hook: thief dashing with a bright glow halo, alarm ~60%.
    state.wingIndex = 1;
    state.loadWing(1);
    state.player.x = 700; state.player.y = 400;
    state.glow = 0.92;
    state.dashing = true;
    state.alarm = 0.60;
    state.guards[0].x = 940; state.guards[0].y = 330; state.guards[0].dir = Math.PI;
    state.guards[0].seen = true;
    state.guards[1].x = 300; state.guards[1].y = 500; state.guards[1].dir = 0.3;
    state.guards[2].x = 1190; state.guards[2].y = 690; state.guards[2].dir = -1.4;
    state.wing.relics[4].taken = true;
    state.relicsGot = 11;
    state.toast = 'RELIC SNATCHED — JADE SCARAB!';
    state.dawnLeft = 274;
  } else if (shot === 'clear') {
    // Wing-clear screen.
    state.wingIndex = 0;
    state.loadWing(0);
    state.wing.relics.forEach((r) => { r.taken = true; });
    state.relicsGot = 7;
    state.wingRelicsGot = 7;
    state.wingTime = 102;
    state.alarm = 0;
    state.glow = 0.1;
    state.mode = 'clear';
  }
  state.exitOpen = state.wing.relics.every((r) => r.taken);
}
