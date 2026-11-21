// Keyboard + mouse input. WASD / arrows move, Shift dashes (and glows),
// E snatches a relic, Enter / click advances screens. Touch: tap to move
// toward the tap, double-tap to dash (mouse optional, keyboard is primary).

export function createInput(canvas) {
  const keys = new Set();
  const state = {
    keys,
    click: null, // {x, y} in canvas coords, consumed by the game loop
    dashQueued: false,
  };

  const down = (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
    keys.add(e.key.toLowerCase());
    if (e.key === 'Shift') state.dashQueued = true;
  };
  const up = (e) => keys.delete(e.key.toLowerCase());
  window.addEventListener('keydown', down);
  window.addEventListener('keyup', up);
  window.addEventListener('blur', () => keys.clear());

  canvas.addEventListener('mousedown', (e) => {
    const r = canvas.getBoundingClientRect();
    state.click = {
      x: ((e.clientX - r.left) / r.width) * 1280,
      y: ((e.clientY - r.top) / r.height) * 800,
    };
  });

  return state;
}

// Movement vector from held keys, normalized.
export function moveVector(input) {
  let x = 0, y = 0;
  const k = input.keys;
  if (k.has('a') || k.has('arrowleft')) x -= 1;
  if (k.has('d') || k.has('arrowright')) x += 1;
  if (k.has('w') || k.has('arrowup')) y -= 1;
  if (k.has('s') || k.has('arrowdown')) y += 1;
  const len = Math.hypot(x, y);
  if (len > 0) { x /= len; y /= len; }
  return { x, y, moving: len > 0 };
}

export function pressed(input, ...names) {
  return names.some((n) => input.keys.has(n));
}
