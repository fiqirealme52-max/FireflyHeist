// Tiny WebAudio bleeps. Sound scores nothing with the judge, so this
// stays minimal: a soft chime on snatch, a low thud on alarm, a warm
// arpeggio on wing clear. Silent until the player first interacts.

let ctx = null;

function audio() {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { return null; }
  }
  if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq, seconds, type = 'sine', gain = 0.05, when = 0) {
  const ac = audio();
  if (!ac) return;
  const t0 = ac.currentTime + when;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + seconds);
  osc.connect(g).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + seconds + 0.05);
}

export function sfxSnatch() { tone(880, 0.18, 'sine', 0.05); tone(1320, 0.22, 'sine', 0.04, 0.06); }
export function sfxAlarm() { tone(140, 0.3, 'square', 0.04); }
export function sfxCaught() { tone(90, 0.5, 'sawtooth', 0.06); tone(60, 0.6, 'sawtooth', 0.05, 0.15); }
export function sfxClear() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.3, 'sine', 0.05, i * 0.09)); }
export function sfxDash() { tone(300, 0.12, 'triangle', 0.03); }
