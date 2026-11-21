// Guards: patrol movement, raycast vision cones, and detection.
// A guard walks its waypoints. Its vision cone is built by casting rays
// against every wall segment, so bookshelves, pillars and plants really
// block sight. The cone's reach grows when the firefly glows: light is
// the enemy. Detection fills the alarm; breaking line of sight lets it fall.

export function makeGuard(def) {
  return {
    waypoints: def.waypoints,
    speed: def.speed,
    x: def.waypoints[0][0],
    y: def.waypoints[0][1],
    target: 1,
    dir: 0,
    seen: false, // player currently inside this guard's cone
  };
}

export function updateGuard(guard, dt) {
  const [tx, ty] = guard.waypoints[guard.target];
  const dx = tx - guard.x, dy = ty - guard.y;
  const dist = Math.hypot(dx, dy);
  if (dist < 4) {
    guard.target = (guard.target + 1) % guard.waypoints.length;
    return;
  }
  guard.dir = Math.atan2(dy, dx);
  const step = guard.speed * dt;
  guard.x += (dx / dist) * Math.min(step, dist);
  guard.y += (dy / dist) * Math.min(step, dist);
}

// All wall edges as line segments, for ray casting.
export function wallSegments(walls) {
  const segs = [];
  for (const r of walls) {
    segs.push([[r.x, r.y], [r.x + r.w, r.y]]);
    segs.push([[r.x + r.w, r.y], [r.x + r.w, r.y + r.h]]);
    segs.push([[r.x + r.w, r.y + r.h], [r.x, r.y + r.h]]);
    segs.push([[r.x, r.y + r.h], [r.x, r.y]]);
  }
  return segs;
}

function rayHit(ox, oy, dx, dy, segs) {
  let best = Infinity;
  for (const [[x1, y1], [x2, y2]] of segs) {
    const rx = dx, ry = dy;
    const sx = x2 - x1, sy = y2 - y1;
    const denom = rx * sy - ry * sx;
    if (Math.abs(denom) < 1e-9) continue;
    const t = ((x1 - ox) * sy - (y1 - oy) * sx) / denom;
    const u = ((x1 - ox) * ry - (y1 - oy) * rx) / denom;
    if (t > 0 && u >= 0 && u <= 1 && t < best) best = t;
  }
  return best;
}

// True when the segment a->b crosses any wall (line of sight blocked).
export function lineBlocked(ax, ay, bx, by, segs) {
  const dx = bx - ax, dy = by - ay;
  const len = Math.hypot(dx, dy);
  if (len < 1) return false;
  const hit = rayHit(ax, ay, dx / len, dy / len, segs);
  return hit < len - 1;
}

// Raycast vision cone: returns the polygon (guard position + ray endpoints).
// range grows with the firefly's glow — a bright thief is seen from farther.
export function visionCone(guard, glow, segs) {
  const range = 250 * (1 + glow * 0.95);
  const half = 0.56; // ~32 degrees each side
  const rays = 26;
  const pts = [[guard.x, guard.y]];
  for (let i = 0; i <= rays; i++) {
    const a = guard.dir - half + (2 * half * i) / rays;
    const dx = Math.cos(a), dy = Math.sin(a);
    const hit = rayHit(guard.x, guard.y, dx, dy, segs);
    const d = Math.min(hit, range);
    pts.push([guard.x + dx * d, guard.y + dy * d]);
  }
  return pts;
}

// Does this guard see the player right now? Range, angle, line of sight.
export function guardSees(guard, player, glow, segs) {
  const range = 250 * (1 + glow * 0.95);
  const dx = player.x - guard.x, dy = player.y - guard.y;
  const dist = Math.hypot(dx, dy);
  if (dist > range || dist < 1) return dist < 26; // bumped into the guard
  let da = Math.atan2(dy, dx) - guard.dir;
  while (da > Math.PI) da -= 2 * Math.PI;
  while (da < -Math.PI) da += 2 * Math.PI;
  if (Math.abs(da) > 0.56) return false;
  return !lineBlocked(guard.x, guard.y, player.x, player.y, segs);
}
