// FIREFLY: The Midnight Archive — game loop and state.
// Top-down stealth: move slow and stay dark; dash and you glow, and
// guards see the glow from farther. Snatch all 7 relics in a wing to
// open the vault door, reach it unseen, and clear the wing before dawn.

import { WINGS, TOTAL_RELICS } from './levels.js';
import { makeGuard, updateGuard, wallSegments, guardSees } from './guards.js';
import { createInput, moveVector, pressed } from './input.js';
import { drawScene, drawTitle, drawCaught, drawWingClear, drawGameClear } from './render.js';
import { stageShot } from './shots.js';
import { sfxSnatch, sfxAlarm, sfxCaught, sfxClear, sfxDash } from './audio.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const input = createInput(canvas);
const params = new URLSearchParams(location.search);

const state = {
  mode: 'title', // title | play | caught | clear | done
  wingIndex: 0,
  wing: WINGS[0],
  guards: [],
  segs: [],
  player: { x: 90, y: 700, r: 12 },
  glow: 0,
  alarm: 0,
  dashing: false,
  dashTime: 0,
  relicsGot: 0,
  wingRelicsGot: 0,
  exitOpen: false,
  unseen: true,
  dawnLeft: WINGS[0].dawnSeconds,
  wingTime: 0,
  totalTime: 0,
  score: 0,
  toast: null,
  toastTime: 0,
  nearRelic: null,
  frozen: false,
  t: 0,
};

state.loadWing = (i) => {
  state.wingIndex = i;
  state.wing = WINGS[i];
  state.guards = state.wing.guards.map(makeGuard);
  state.segs = wallSegments(state.wing.walls);
  state.player.x = state.wing.start.x;
  state.player.y = state.wing.start.y;
  state.glow = 0;
  state.alarm = 0;
  state.dashing = false;
  state.wingRelicsGot = 0;
  state.exitOpen = false;
  state.dawnLeft = state.wing.dawnSeconds;
  state.wingTime = 0;
  state.toast = null;
  state.nearRelic = null;
};

state.loadWing(0);

function collide(x, y) {
  const r = state.player.r;
  for (const w of state.wing.walls) {
    if (x + r > w.x && x - r < w.x + w.w && y + r > w.y && y - r < w.y + w.h) return true;
  }
  return x < 26 + r || x > 1280 - 26 - r || y < 26 + r || y > 800 - 26 - r;
}

function update(dt) {
  state.t += dt;
  if (state.frozen || state.mode !== 'play') return;
  state.wingTime += dt;
  state.totalTime += dt;
  state.dawnLeft = Math.max(0, state.dawnLeft - dt);

  const mv = moveVector(input);
  const wantDash = pressed(input, 'shift') || input.dashQueued;
  input.dashQueued = false;
  state.dashing = false;
  let speed = 150;
  if (wantDash && mv.moving) {
    speed = 340;
    state.dashing = true;
    state.glow = Math.min(1, state.glow + dt * 2.2);
    if (state.dashTime <= 0) sfxDash();
    state.dashTime = 0.25;
  }
  state.dashTime -= dt;
  if (mv.moving) {
    const nx = state.player.x + mv.x * speed * dt;
    const ny = state.player.y + mv.y * speed * dt;
    if (!collide(nx, state.player.y)) state.player.x = nx;
    if (!collide(state.player.x, ny)) state.player.y = ny;
    // moving fast builds glow; creeping slow keeps you dark
    state.glow = Math.min(1, state.glow + dt * (speed > 200 ? 1.6 : 0.12));
  } else {
    state.glow = Math.max(0, state.glow - dt * 0.55);
  }

  // click-to-move (mouse): walk toward the tap, slow and dark
  if (input.click) {
    const dx = input.click.x - state.player.x, dy = input.click.y - state.player.y;
    const d = Math.hypot(dx, dy);
    if (d > 8) {
      const nx = state.player.x + (dx / d) * 150 * dt;
      const ny = state.player.y + (dy / d) * 150 * dt;
      if (!collide(nx, state.player.y)) state.player.x = nx;
      if (!collide(state.player.x, ny)) state.player.y = ny;
    } else {
      input.click = null;
    }
  }

  for (const g of state.guards) updateGuard(g, dt);

  // detection: any guard whose cone touches the firefly raises the alarm
  let seen = false;
  for (const g of state.guards) {
    g.seen = guardSees(g, state.player, state.glow, state.segs);
    if (g.seen) seen = true;
  }
  if (seen) {
    state.alarm = Math.min(1, state.alarm + dt * 0.45);
    state.unseen = false;
    if (state.alarm > 0.5 && state.alarm - dt * 0.45 <= 0.5) sfxAlarm();
  } else {
    state.alarm = Math.max(0, state.alarm - dt * 0.22);
  }
  if (state.alarm >= 1) {
    state.mode = 'caught';
    sfxCaught();
    return;
  }

  // nearest relic in snatch range
  state.nearRelic = null;
  for (const r of state.wing.relics) {
    if (!r.taken && Math.hypot(r.x - state.player.x, r.y - state.player.y) < 44) {
      state.nearRelic = r;
      break;
    }
  }
  if (state.nearRelic && pressed(input, 'e')) {
    state.nearRelic.taken = true;
    state.relicsGot += 1;
    state.wingRelicsGot += 1;
    state.score += 100;
    state.toast = `RELIC SNATCHED — ${state.nearRelic.name.toUpperCase()}!`;
    state.toastTime = 2;
    state.nearRelic = null;
    sfxSnatch();
    if (state.wing.relics.every((r) => r.taken)) {
      state.exitOpen = true;
      state.toast = 'ALL RELICS — THE VAULT DOOR IS OPEN!';
    }
  }
  if (state.toast) {
    state.toastTime -= dt;
    if (state.toastTime <= 0) state.toast = null;
  }

  // exit: reach the vault door once it is open
  const e = state.wing.exit;
  if (state.exitOpen
    && state.player.x > e.x - 10 && state.player.x < e.x + e.w + 10
    && state.player.y > e.y - 10 && state.player.y < e.y + e.h + 10) {
    state.score += state.unseen ? 500 : 100;
    state.score += Math.max(0, Math.round(state.dawnLeft)) * 2;
    state.mode = 'clear';
    sfxClear();
  }
}

function advance() {
  if (state.mode === 'title') { state.mode = 'play'; }
  else if (state.mode === 'caught') { state.loadWing(state.wingIndex); state.mode = 'play'; }
  else if (state.mode === 'clear') {
    if (state.wingIndex + 1 < WINGS.length) {
      state.loadWing(state.wingIndex + 1);
      state.mode = 'play';
    } else {
      state.mode = 'done';
    }
  } else if (state.mode === 'done') {
    state.relicsGot = 0; state.score = 0; state.totalTime = 0; state.unseen = true;
    state.loadWing(0);
    state.mode = 'play';
  }
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && state.mode !== 'play') advance();
});
canvas.addEventListener('mousedown', () => {
  if (state.mode !== 'play') advance();
});

// Deterministic screenshot scenes: ?shot=cover|hide|dash|clear
const shot = params.get('shot');
if (shot) {
  stageShot(state, shot);
  state.t = 0;
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  update(dt);
  if (state.mode === 'title') drawTitle(ctx, state);
  else if (state.mode === 'caught') drawCaught(ctx, state);
  else if (state.mode === 'clear') drawWingClear(ctx, state);
  else if (state.mode === 'done') drawGameClear(ctx, state);
  else drawScene(ctx, state, state.t);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// Expose a tiny handle for play-testing in the browser console.
window.firefly = { state, WINGS, TOTAL_RELICS };
