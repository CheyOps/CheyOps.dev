class Component extends DCLogic {
  componentDidMount() {
    this.startAurora();
    this.wireLinks();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this._raf);
    if (this._resize) window.removeEventListener('resize', this._resize);
  }

  startAurora() {
    const c = document.getElementById('cvCard');
    if (!c) return;
    const ctx = c.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const fit = () => { const r = c.getBoundingClientRect(); c.width = r.width * dpr; c.height = r.height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    fit(); this._resize = fit; window.addEventListener('resize', fit);
    const blobs = [
      { r: 0.55, color: 'rgba(124,92,214,0.42)', sx: 0.13, sy: 0.11, px: 0, py: 1.2 },
      { r: 0.42, color: 'rgba(99,102,241,0.32)', sx: 0.18, sy: 0.15, px: 2.1, py: 0.4 },
      { r: 0.38, color: 'rgba(168,85,247,0.30)', sx: 0.11, sy: 0.20, px: 4.0, py: 2.7 }
    ];
    const t0 = performance.now();
    const loop = (t) => {
      const w = c.clientWidth, h = c.clientHeight, e = (t - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (const b of blobs) {
        const x = w * (0.5 + 0.26 * Math.sin(e * b.sx + b.px));
        const y = h * (0.5 + 0.26 * Math.cos(e * b.sy + b.py));
        const r = Math.min(w, h) * b.r;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, b.color); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      this._raf = requestAnimationFrame(loop);
    };
    this._raf = requestAnimationFrame(loop);
  }

  wireLinks() {
    // URLs assembled at runtime from char codes — no harvestable links in the page source.
    const dec = (a) => String.fromCharCode.apply(null, a);
    const ghUrl = dec([104,116,116,112,115,58,47,47,103,105,116,104,117,98,46,99,111,109,47,67,104,101,121,79,112,115,47]);
    // LinkedIn — PLACEHOLDER handle. Replace the codes (or this line) with your real profile URL.
    const liUrl = dec([104,116,116,112,115,58,47,47,119,119,119,46,108,105,110,107,101,100,105,110,46,99,111,109,47,105,110,47,99,104,101,121,111,112,115,47]);
    const open = (url) => window.open(url, '_blank', 'noopener,noreferrer');
    const bind = (id, url) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('click', () => open(url));
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(url); } });
    };
    bind('ghBtn', ghUrl);
    bind('liBtn', liUrl);
  }

  renderVals() { return {}; }
}
