/* Decorative 2D canvas animations for the Neural Audio Synthesis cards:
   #canvas-core (rotating hexagon rings), #canvas-network (animated
   circuit traces) and #canvas-orbit (orbiting fragments + waveform). */
const setupCanvas = (id, renderFn) => {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  let w, h, time = 0;
  const resize = () => {
    const rect = canvas.parentElement.getBoundingClientRect();
    w = rect.width; h = rect.height;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
  };
  window.addEventListener('resize', resize);
  resize();
  const loop = () => {
    time += 0.01;
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.translate(w / 2, h / 2);
    renderFn(ctx, time, w, h);
    ctx.restore();
    requestAnimationFrame(loop);
  };
  loop();
};

setupCanvas('canvas-core', (ctx, t) => {
  const radius = 55;
  const sides = 6;
  const rings = 3;
  ctx.lineWidth = 1;

  for (let r = 1; r <= rings; r++) {
    const currentRadius = radius + (r * 18);
    ctx.save();
    const rotation = t * (r % 2 === 0 ? 0.3 : -0.2) * r;
    ctx.rotate(rotation);

    ctx.beginPath();
    for (let i = 0; i <= sides; i++) {
      const angle = (i * 2 * Math.PI) / sides;
      const x = currentRadius * Math.cos(angle);
      const y = currentRadius * Math.sin(angle);

      const scale = 1 + Math.sin(t * 2 + r) * 0.03;
      const sx = x * scale;
      const sy = y * scale;

      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);

      if (i < sides) {
        ctx.fillStyle = `rgba(99, 102, 241, ${0.3 + (r*0.1)})`;
        ctx.fillRect(sx - 1, sy - 1, 2, 2);
      }
    }
    ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 + (0.05 * r)})`;
    ctx.stroke();

    if (r > 1) {
      ctx.beginPath();
      for(let i=0; i<sides; i++) {
        const angle = (i * 2 * Math.PI) / sides;
        ctx.moveTo((currentRadius-18) * Math.cos(angle), (currentRadius-18) * Math.sin(angle));
        ctx.lineTo(currentRadius * Math.cos(angle), currentRadius * Math.sin(angle));
      }
      ctx.strokeStyle = `rgba(99, 102, 241, 0.05)`;
      ctx.stroke();
    }
    ctx.restore();
  }

  const corePulse = Math.abs(Math.sin(t * 2)) * 3;
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, Math.PI * 2);
  ctx.fillStyle = '#0a0a0a';
  ctx.fill();
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, 3 + corePulse, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(99, 102, 241, 0.9)';
  ctx.shadowColor = 'rgba(99, 102, 241, 0.6)';
  ctx.shadowBlur = 12;
  ctx.fill();
  ctx.shadowBlur = 0;
});

const circuitLines = Array.from({length: 15}, () => ({
  x: (Math.random() - 0.5) * 200,
  y: (Math.random() - 0.5) * 200,
  dir: Math.floor(Math.random() * 4),
  length: 40 + Math.random() * 60,
  speed: 0.6 + Math.random() * 1.2,
  offset: Math.random() * 100
}));

setupCanvas('canvas-network', (ctx, t, w, h) => {
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
  ctx.beginPath();
  for(let i = -120; i <= 120; i += 24) {
    ctx.moveTo(i, -120); ctx.lineTo(i, 120);
    ctx.moveTo(-120, i); ctx.lineTo(120, i);
  }
  ctx.stroke();

  circuitLines.forEach((line) => {
    const progress = ((t * 50 * line.speed) + line.offset) % 250;
    let dx = 0, dy = 0;
    if(line.dir === 0) dy = -1;
    else if(line.dir === 1) dx = 1;
    else if(line.dir === 2) dy = 1;
    else dx = -1;

    ctx.beginPath();
    ctx.moveTo(line.x, line.y);
    ctx.lineTo(line.x + dx * line.length, line.y + dy * line.length);
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
    ctx.stroke();

    if (progress < line.length + 20) {
      const startP = Math.max(0, progress - 20);
      const endP = Math.min(line.length, progress);
      if (startP < endP) {
        ctx.beginPath();
        ctx.moveTo(line.x + dx * startP, line.y + dy * startP);
        ctx.lineTo(line.x + dx * endP, line.y + dy * endP);
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.9)';
        ctx.shadowColor = 'rgba(99, 102, 241, 0.5)';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }
    ctx.fillStyle = '#0a0a0a';
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
    ctx.beginPath();
    ctx.arc(line.x + dx * line.length, line.y + dy * line.length, 2.5, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();
  });
});

setupCanvas('canvas-orbit', (ctx, t) => {
  const numOrbits = 5;
  ctx.lineWidth = 1;
  ctx.translate(20, 0);

  for(let i = 1; i <= numOrbits; i++) {
    const radius = i * 28;
    const speed = (numOrbits - i + 1) * 0.15;
    const angleOffset = t * speed * (i % 2 === 0 ? 1 : -1);

    ctx.save();
    ctx.rotate(angleOffset);

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(99, 102, 241, ${0.03 + i*0.015})`;
    if (i % 2 !== 0) ctx.setLineDash([3, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

    const fragments = i + 1;
    for(let f = 0; f < fragments; f++) {
      const fAngle = (f / fragments) * Math.PI * 2;
      const fx = radius * Math.cos(fAngle);
      const fy = radius * Math.sin(fAngle);

      ctx.beginPath();
      ctx.arc(0, 0, radius, fAngle - 0.15, fAngle + 0.15);
      ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 + (Math.sin(t*2 + f)*0.3)})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.arc(fx, fy, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(99, 102, 241, 0.9)';
      ctx.fill();
    }
    ctx.restore();
  }

  ctx.beginPath();
  for(let w = -20; w <= 20; w+=2) {
    const amp = Math.max(0, 12 - Math.abs(w)*0.6);
    const waveY = Math.sin(t*6 + w*0.4) * amp;
    if(w === -20) ctx.moveTo(w, waveY);
    else ctx.lineTo(w, waveY);
  }
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.5)';
  ctx.stroke();
});

/* Render Lucide icons declared via <i data-lucide>. */
if (window.lucide) lucide.createIcons();
