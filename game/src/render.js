// Rendering: night-blue archive floor, amber lamplight, raycast guard
// cones in translucent yellow, cyan relic glow, the firefly thief with
// its glow halo, the HUD, and every screen (title / caught / wing clear).
// All art is drawn in code — no images, no network.

import { visionCone } from './guards.js';

export const COLORS = {
  night: '#0b1026',
  floor: '#11173a',
  floorAlt: '#0e1330',
  amber: '#f5b942',
  glow: '#b8ff5e',
  relic: '#5ef2ff',
  cone: 'rgba(245, 185, 66, 0.30)',
  coneHot: 'rgba(255, 80, 60, 0.38)',
};

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawFloor(ctx) {
  ctx.fillStyle = COLORS.floor;
  ctx.fillRect(0, 0, 1280, 800);
  // checker tiles, faint
  ctx.fillStyle = COLORS.floorAlt;
  for (let ty = 0; ty < 10; ty++) {
    for (let tx = 0; tx < 16; tx++) {
      if ((tx + ty) % 2 === 0) ctx.fillRect(tx * 80, ty * 80, 80, 80);
    }
  }
  // amber lamplight pools on the floor
  for (const [lx, ly] of [[320, 220], [960, 220], [640, 520], [180, 640], [1120, 640]]) {
    const g = ctx.createRadialGradient(lx, ly, 10, lx, ly, 150);
    g.addColorStop(0, 'rgba(245,185,66,0.16)');
    g.addColorStop(1, 'rgba(245,185,66,0)');
    ctx.fillStyle = g;
    ctx.fillRect(lx - 150, ly - 150, 300, 300);
  }
}

function drawWalls(ctx, walls) {
  for (const r of walls) {
    if (r.type === 'shelf') {
      ctx.fillStyle = '#3a2a18';
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.fillStyle = '#5a4026';
      const horizontal = r.w >= r.h;
      const n = Math.floor((horizontal ? r.w : r.h) / 26);
      for (let i = 0; i < n; i++) {
        ctx.fillRect(
          horizontal ? r.x + 6 + i * 26 : r.x + 4,
          horizontal ? r.y + 4 : r.y + 6 + i * 26,
          horizontal ? 18 : r.w - 8,
          horizontal ? r.h - 8 : 18,
        );
      }
      ctx.strokeStyle = '#8a6a3a';
      ctx.lineWidth = 2;
      ctx.strokeRect(r.x + 1, r.y + 1, r.w - 2, r.h - 2);
    } else if (r.type === 'pillar') {
      ctx.fillStyle = '#2c3358';
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.fillStyle = '#f5b942';
      ctx.fillRect(r.x + 6, r.y + 6, r.w - 12, 5);
      ctx.strokeStyle = '#4a5480';
      ctx.lineWidth = 2;
      ctx.strokeRect(r.x + 1, r.y + 1, r.w - 2, r.h - 2);
    } else if (r.type === 'plant') {
      ctx.fillStyle = '#1d3a24';
      roundRect(ctx, r.x, r.y, r.w, r.h, 8);
      ctx.fill();
      ctx.fillStyle = '#3fae5a';
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.ellipse(r.x + 12 + i * 12, r.y + r.h / 2, 7, 16, (i - 2) * 0.25, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.fillStyle = '#232a4d';
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.fillStyle = '#313a66';
      ctx.fillRect(r.x, r.y, r.w, 4);
    }
  }
}

function drawExit(ctx, exit, open, t) {
  const pulse = open ? 0.75 + 0.25 * Math.sin(t * 4) : 0.5;
  ctx.save();
  ctx.shadowColor = open ? '#5ef2ff' : '#f5b942';
  ctx.shadowBlur = 30 * pulse;
  ctx.fillStyle = open ? '#0e4a56' : '#4a3410';
  roundRect(ctx, exit.x, exit.y, exit.w, exit.h, 10);
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = open ? '#5ef2ff' : '#f5b942';
  ctx.lineWidth = 3;
  roundRect(ctx, exit.x, exit.y, exit.w, exit.h, 10);
  ctx.stroke();
  ctx.fillStyle = open ? '#b8fffe' : '#f5b942';
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('EXIT', exit.x + exit.w / 2, exit.y + exit.h / 2 - 6);
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText(open ? 'OPEN' : 'LOCKED', exit.x + exit.w / 2, exit.y + exit.h / 2 + 14);
  ctx.font = 'bold 13px sans-serif';
  ctx.fillStyle = '#cfe6ff';
  ctx.fillText(exit.label, exit.x + exit.w / 2, exit.y + exit.h + 22);
}

function drawRelics(ctx, relics, t) {
  for (const r of relics) {
    if (r.taken) continue;
    const bob = Math.sin(t * 2 + r.x) * 3;
    const g = ctx.createRadialGradient(r.x, r.y + bob, 2, r.x, r.y + bob, 34);
    g.addColorStop(0, 'rgba(94,242,255,0.55)');
    g.addColorStop(1, 'rgba(94,242,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(r.x, r.y + bob, 34, 0, Math.PI * 2);
    ctx.fill();
    // diamond gem
    ctx.fillStyle = '#5ef2ff';
    ctx.beginPath();
    ctx.moveTo(r.x, r.y + bob - 12);
    ctx.lineTo(r.x + 9, r.y + bob);
    ctx.lineTo(r.x, r.y + bob + 12);
    ctx.lineTo(r.x - 9, r.y + bob);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(r.x - 3, r.y + bob - 4, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawGuards(ctx, guards, glow, segs, t) {
  for (const g of guards) {
    const pts = visionCone(g, glow, segs);
    ctx.fillStyle = g.seen ? COLORS.coneHot : COLORS.cone;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
    ctx.fill();
    // guard body: lamp-bearer in amber
    ctx.save();
    ctx.shadowColor = '#f5b942';
    ctx.shadowBlur = 14;
    ctx.fillStyle = '#f5b942';
    ctx.beginPath();
    ctx.arc(g.x, g.y, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = '#1a1206';
    ctx.beginPath();
    ctx.arc(g.x + Math.cos(g.dir) * 5, g.y + Math.sin(g.dir) * 5, 5, 0, Math.PI * 2);
    ctx.fill();
    // facing tick
    ctx.strokeStyle = '#fff2cc';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(g.x, g.y);
    ctx.lineTo(g.x + Math.cos(g.dir) * 20, g.y + Math.sin(g.dir) * 20);
    ctx.stroke();
    if (g.seen) {
      ctx.fillStyle = '#ff5040';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('!', g.x, g.y - 24);
    }
  }
}

function drawPlayer(ctx, player, glow, t, dashing) {
  const haloR = 26 + glow * 70 + (dashing ? 26 : 0);
  const g = ctx.createRadialGradient(player.x, player.y, 4, player.x, player.y, haloR);
  g.addColorStop(0, `rgba(184,255,94,${0.55 + glow * 0.4})`);
  g.addColorStop(1, 'rgba(184,255,94,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(player.x, player.y, haloR, 0, Math.PI * 2);
  ctx.fill();
  // firefly body: dark when slow, bright when glowing
  ctx.save();
  ctx.shadowColor = '#b8ff5e';
  ctx.shadowBlur = 12 + glow * 22;
  ctx.fillStyle = glow > 0.5 ? '#d8ff8a' : '#9ed84a';
  ctx.beginPath();
  ctx.ellipse(player.x, player.y, 11, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // wings
  ctx.fillStyle = 'rgba(220,255,180,0.75)';
  const flap = Math.sin(t * (dashing ? 40 : 14)) * 4;
  ctx.beginPath();
  ctx.ellipse(player.x - 6, player.y - 9 - flap, 8, 4, -0.5, 0, Math.PI * 2);
  ctx.ellipse(player.x + 6, player.y - 9 + flap, 8, 4, 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0b1026';
  ctx.beginPath();
  ctx.arc(player.x + 4, player.y - 2, 2, 0, Math.PI * 2);
  ctx.fill();
}

function bar(ctx, x, y, w, h, frac, fill, label, valueText) {
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(label, x - 8, y + h - 3);
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  roundRect(ctx, x, y, w, h, 6);
  ctx.fill();
  ctx.fillStyle = fill;
  if (frac > 0.01) {
    roundRect(ctx, x + 2, y + 2, (w - 4) * Math.min(1, frac), h - 4, 4);
    ctx.fill();
  }
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(valueText, x + w + 8, y + h - 3);
}

export function drawHUD(ctx, state) {
  // top bar
  ctx.fillStyle = 'rgba(5,7,15,0.88)';
  ctx.fillRect(0, 0, 1280, 72);
  ctx.fillStyle = '#f5b942';
  ctx.fillRect(0, 72, 1280, 2);
  ctx.fillStyle = '#b8ff5e';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('FIREFLY', 18, 30);
  ctx.fillStyle = '#cfe6ff';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('THE MIDNIGHT ARCHIVE', 18, 52);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(state.wing.name, 300, 30);
  ctx.fillStyle = '#5ef2ff';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText(`RELICS  ${state.relicsGot} / 21`, 300, 54);
  ctx.fillStyle = '#f5b942';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(`GUARDS  ${state.wing.guards.length}  ·  WING ${state.wingIndex + 1}/3`, 560, 30);
  ctx.fillStyle = '#cfe6ff';
  ctx.font = '15px sans-serif';
  ctx.fillText('WASD move · SHIFT dash (glows!) · E snatch relic', 560, 54);

  bar(ctx, 950, 14, 130, 16, state.alarm, state.alarm > 0.6 ? '#ff5040' : '#ffb03a', 'ALARM', state.alarm > 0.6 ? 'DANGER' : `${Math.round(state.alarm * 100)}%`);
  bar(ctx, 950, 46, 130, 14, state.glow, '#b8ff5e', 'GLOW', state.glow > 0.6 ? 'BRIGHT' : state.glow > 0.25 ? 'faint' : 'dark');

  const dawn = Math.max(0, state.dawnLeft);
  const mm = Math.floor(dawn / 60), ss = Math.floor(dawn % 60);
  ctx.fillStyle = '#f5b942';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`DAWN ${mm}:${String(ss).padStart(2, '0')}`, 1262, 32);
  ctx.fillStyle = '#cfe6ff';
  ctx.font = '14px sans-serif';
  ctx.fillText(state.unseen ? 'UNSEEN ✓' : 'spotted once', 1262, 54);
}

function centerPanel(ctx, title, lines, accent) {
  ctx.fillStyle = 'rgba(5,7,15,0.82)';
  ctx.fillRect(0, 0, 1280, 800);
  ctx.fillStyle = 'rgba(11,16,38,0.95)';
  roundRect(ctx, 340, 190, 600, 420, 18);
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  roundRect(ctx, 340, 190, 600, 420, 18);
  ctx.stroke();
  ctx.textAlign = 'center';
  ctx.fillStyle = accent;
  ctx.font = 'bold 40px sans-serif';
  ctx.fillText(title, 640, 270);
  ctx.fillStyle = '#ffffff';
  ctx.font = '20px sans-serif';
  lines.forEach((line, i) => ctx.fillText(line, 640, 330 + i * 40));
}

export function drawScene(ctx, state, t) {
  drawFloor(ctx);
  drawWalls(ctx, state.wing.walls);
  drawExit(ctx, state.wing.exit, state.exitOpen, t);
  drawRelics(ctx, state.wing.relics, t);
  drawGuards(ctx, state.guards, state.glow, state.segs, t);
  drawPlayer(ctx, state.player, state.glow, t, state.dashing);
  if (state.toast) {
    ctx.fillStyle = '#b8ff5e';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(state.toast, 640, 130);
  }
  if (state.nearRelic) {
    ctx.fillStyle = '#5ef2ff';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Press E — SNATCH THE RELIC', 640, 760);
  }
  drawHUD(ctx, state);
}

export function drawTitle(ctx, state) {
  drawScene(ctx, state, 0);
  ctx.fillStyle = 'rgba(5,7,15,0.66)';
  ctx.fillRect(0, 0, 1280, 800);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#b8ff5e';
  ctx.font = 'bold 64px sans-serif';
  ctx.fillText('FIREFLY', 640, 260);
  ctx.fillStyle = '#f5b942';
  ctx.font = 'bold 34px sans-serif';
  ctx.fillText('THE MIDNIGHT ARCHIVE', 640, 315);
  ctx.fillStyle = '#ffffff';
  ctx.font = '22px sans-serif';
  ctx.fillText('3 wings  ·  9 guards  ·  21 relics  ·  1 dawn', 640, 365);
  ctx.fillStyle = '#b8ff5e';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('Move slow and you are dark. Dash and you GLOW —', 640, 420);
  ctx.fillText('guards see the glow from farther away.', 640, 450);
  ctx.fillStyle = '#cfe6ff';
  ctx.font = '20px sans-serif';
  ctx.fillText('WASD / arrows to move  ·  SHIFT to dash  ·  E to snatch a relic', 640, 510);
  ctx.fillText('Reach the vault door unseen. Full alarm = caught.', 640, 540);
  ctx.fillStyle = '#f5b942';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('Press ENTER or click to begin', 640, 610);
}

export function drawCaught(ctx, state) {
  drawScene(ctx, state, 0);
  centerPanel(ctx, 'CAUGHT!', [
    'The alarm hit 100% — a guard spotted your glow.',
    'The wing restarts. Move slow, stay behind cover,',
    'and dash only when no cone can reach you.',
    'Press ENTER to try the wing again.',
  ], '#ff5040');
}

export function drawWingClear(ctx, state) {
  drawScene(ctx, state, 0);
  const mins = Math.floor(state.wingTime / 60);
  const secs = Math.floor(state.wingTime % 60);
  centerPanel(ctx, 'WING CLEAR — UNSEEN', [
    `${state.wing.name}`,
    `Relics: ${state.wingRelicsGot} / 7 this wing  ·  ${state.relicsGot} / 21 total`,
    `Time: ${mins}:${String(secs).padStart(2, '0')}   ·   Unseen bonus: +500`,
    state.wingIndex + 1 < 3 ? 'Press ENTER for the next wing.' : 'Press ENTER to see the dawn.',
  ], '#b8ff5e');
}

export function drawGameClear(ctx, state) {
  ctx.fillStyle = '#0b1026';
  ctx.fillRect(0, 0, 1280, 800);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#b8ff5e';
  ctx.font = 'bold 56px sans-serif';
  ctx.fillText('DAWN BREAKS — YOU DID IT', 640, 300);
  ctx.fillStyle = '#f5b942';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText('ALL 21 RELICS  ·  NEVER SEEN  ·  THE ARCHIVE IS YOURS', 640, 360);
  ctx.fillStyle = '#ffffff';
  ctx.font = '22px sans-serif';
  ctx.fillText(`Total time: ${Math.floor(state.totalTime / 60)}:${String(Math.floor(state.totalTime % 60)).padStart(2, '0')}   ·   Score: ${state.score}`, 640, 430);
  ctx.fillStyle = '#cfe6ff';
  ctx.font = '20px sans-serif';
  ctx.fillText('FIREFLY: The Midnight Archive — thank you for playing.', 640, 500);
  ctx.fillStyle = '#f5b942';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('Press ENTER to play again', 640, 580);
}
