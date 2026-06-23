const BLUE = { r: 79, g: 142, b: 247 };
const AMBER = { r: 232, g: 168, b: 56 };
const TEXT = { r: 240, g: 240, b: 240 };

export function initClockWaveBackground(selector) {
  const canvas = document.querySelector(selector);
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hero = document.querySelector(".hero");
  let width = 0;
  let height = 0;
  let ratio = 1;
  let opacity = 0;

  function resize() {
    ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.max(1, Math.floor(width * ratio));
    canvas.height = Math.max(1, Math.floor(height * ratio));
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    updateVisibility();
    if (reduceMotion) draw(1.5);
  }

  function updateVisibility() {
    const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : window.innerHeight;
    const fadeStart = heroBottom - window.innerHeight * 0.24;
    const fadeEnd = heroBottom - window.innerHeight * 0.06;
    opacity = clamp((window.scrollY - fadeStart) / Math.max(1, fadeEnd - fadeStart), 0, 1);
    canvas.style.setProperty("--clock-wave-opacity", (opacity * 0.68).toFixed(3));
  }

  function draw(now) {
    const time = reduceMotion ? 1.5 : now * 0.001;
    ctx.clearRect(0, 0, width, height);
    drawWavefield(ctx, width, height, time);

    if (!reduceMotion) {
      requestAnimationFrame(draw);
    }
  }

  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("scroll", updateVisibility, { passive: true });
  requestAnimationFrame(draw);
}

function drawWavefield(ctx, width, height, time) {
  const mobile = width < 620;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  drawFullViewportTiming(ctx, width, height, time, mobile);
  ctx.restore();
}

function drawFullViewportTiming(ctx, width, height, time, mobile) {
  const scale = mobile ? 0.86 : 1.34;
  const alpha = mobile ? 0.66 : 0.62;
  const marginX = mobile ? 10 : 26;
  const labelWidth = mobile ? 74 : 118;
  const traceX = marginX + labelWidth;
  const traceWidth = Math.max(120, width - traceX - marginX);
  const top = mobile ? height * 0.17 : height * 0.16;
  const bottom = mobile ? height * 0.82 : height * 0.86;
  const laneGap = (bottom - top) / 3;
  const amp = clamp(laneGap * 0.18, mobile ? 15 : 24, mobile ? 22 : 42);
  const sweep = ((time * (128 * scale)) % (traceWidth + 160 * scale)) - 80 * scale;
  const labels = ["extTrig", "Clk", "-sample-", "-deliver-"];

  drawLaneGuides(ctx, marginX, top, width - marginX * 2, laneGap, amp, scale, alpha);

  labels.forEach((label, index) => {
    const laneY = top + index * laneGap;
    const color = index === 3 ? AMBER : BLUE;
    drawLabel(ctx, label, marginX, laneY, scale, index === 3 ? AMBER : TEXT, alpha);

    if (index === 1) {
      drawClockTrace(ctx, traceX, laneY, traceWidth, amp, time, scale, alpha * 1.08);
      drawMovingSignal(ctx, traceX + sweep, laneY, amp, scale, BLUE, alpha, true);
      return;
    }

    const pulseWidth = (index === 0 ? 190 : index === 2 ? 118 : 140) * scale;
    const offset = (index * 140 + 38) * scale;
    const pulseX = modulo(sweep - offset, traceWidth + 130 * scale) - 65 * scale;
    drawTriggeredTrace(ctx, traceX, laneY, traceWidth, amp, pulseX, pulseWidth, color, alpha);
    if (pulseX > -pulseWidth && pulseX < traceWidth + pulseWidth) {
      drawMovingSignal(ctx, traceX + pulseX + pulseWidth * 0.5, laneY - amp, amp, scale, color, alpha, false);
    }
  });

  drawSweepLink(ctx, traceX, top, traceWidth, laneGap, amp, sweep, scale, alpha);
}

function drawLaneGuides(ctx, x, top, width, laneGap, amp, scale, alpha) {
  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = rgba(BLUE, 0.06 * alpha);
  for (let i = 0; i < 4; i += 1) {
    const y = top + i * laneGap;
    ctx.beginPath();
    ctx.moveTo(x, y + amp);
    ctx.lineTo(x + width, y + amp);
    ctx.stroke();
  }

  ctx.strokeStyle = rgba(BLUE, 0.025 * alpha);
  const guideTop = top - amp * 2.4;
  const guideBottom = top + laneGap * 3 + amp * 2.4;
  for (let guideX = x + 140 * scale; guideX < x + width; guideX += 155 * scale) {
    ctx.beginPath();
    ctx.moveTo(guideX, guideTop);
    ctx.lineTo(guideX, guideBottom);
    ctx.stroke();
  }
  ctx.restore();
}

function drawLabel(ctx, text, x, y, scale, color, alpha) {
  ctx.save();
  ctx.font = `600 ${Math.max(9, 10 * scale)}px JetBrains Mono, monospace`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = rgba(color, 0.44 * alpha);
  ctx.shadowColor = rgba(color, 0.5 * alpha);
  ctx.shadowBlur = 8 * scale;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawClockTrace(ctx, x, y, width, amp, time, scale, alpha) {
  const halfPeriod = 40 * scale;
  const shift = (time * 64 * scale) % (halfPeriod * 2);
  const low = y + amp;
  const high = y - amp;
  let cursor = x - halfPeriod * 4 + shift;
  let highState = false;

  ctx.save();
  ctx.lineCap = "square";
  ctx.lineJoin = "miter";
  ctx.shadowColor = rgba(BLUE, 0.44 * alpha);
  ctx.shadowBlur = 10 * scale;
  ctx.strokeStyle = rgba(BLUE, 0.46 * alpha);
  ctx.lineWidth = Math.max(1.15, 1.25 * scale);
  ctx.beginPath();
  ctx.moveTo(cursor, low);

  while (cursor < x + width + halfPeriod * 4) {
    const next = cursor + halfPeriod;
    const fromY = highState ? high : low;
    const toY = highState ? low : high;
    ctx.lineTo(next, fromY);
    ctx.lineTo(next, toY);
    cursor = next;
    highState = !highState;
  }

  ctx.stroke();
  ctx.restore();
}

function drawTriggeredTrace(ctx, x, y, width, amp, pulseX, pulseWidth, color, alpha) {
  const low = y + amp;
  const high = y - amp;
  const start = clamp(pulseX, 0, width);
  const end = clamp(pulseX + pulseWidth, 0, width);

  ctx.save();
  ctx.lineCap = "square";
  ctx.lineJoin = "miter";
  ctx.shadowColor = rgba(color, 0.34 * alpha);
  ctx.shadowBlur = 12;
  ctx.strokeStyle = rgba(color, 0.4 * alpha);
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.moveTo(x, low);

  if (end > 0 && start < width && end > start) {
    ctx.lineTo(x + start, low);
    ctx.lineTo(x + start, high);
    ctx.lineTo(x + end, high);
    ctx.lineTo(x + end, low);
  }

  ctx.lineTo(x + width, low);
  ctx.stroke();
  ctx.restore();
}

function drawSweepLink(ctx, x, y, width, laneGap, amp, sweep, scale, alpha) {
  if (sweep < -28 * scale || sweep > width + 28 * scale) return;

  const sweepX = x + clamp(sweep, 0, width);
  const top = y - amp * 2.2;
  const bottom = y + laneGap * 3 + amp * 2.2;
  const gradient = ctx.createLinearGradient(sweepX, top, sweepX, bottom);
  gradient.addColorStop(0, rgba(BLUE, 0));
  gradient.addColorStop(0.32, rgba(BLUE, 0.23 * alpha));
  gradient.addColorStop(0.58, rgba(AMBER, 0.18 * alpha));
  gradient.addColorStop(1, rgba(BLUE, 0));

  ctx.save();
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 1;
  ctx.setLineDash([4 * scale, 9 * scale]);
  ctx.beginPath();
  ctx.moveTo(sweepX, top);
  ctx.lineTo(sweepX, bottom);
  ctx.stroke();
  ctx.restore();
}

function drawMovingSignal(ctx, x, y, amp, scale, color, alpha, clockLane) {
  const radius = (clockLane ? 4.6 : 4.1) * scale;
  ctx.save();
  ctx.shadowColor = rgba(color, 0.9 * alpha);
  ctx.shadowBlur = 16 * scale;
  ctx.fillStyle = rgba(color, 0.86 * alpha);
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  const tail = ctx.createLinearGradient(x - 86 * scale, y, x, y);
  tail.addColorStop(0, rgba(color, 0));
  tail.addColorStop(1, rgba(color, 0.34 * alpha));
  ctx.strokeStyle = tail;
  ctx.lineWidth = Math.max(1, 1.5 * scale);
  ctx.beginPath();
  ctx.moveTo(x - 86 * scale, y);
  ctx.lineTo(x - radius - 1, y);
  ctx.stroke();

  if (!clockLane) {
    ctx.strokeStyle = rgba(AMBER, 0.13 * alpha);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, amp * 1.9, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function rgba(color, alpha) {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${clamp(alpha, 0, 1)})`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function modulo(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}
