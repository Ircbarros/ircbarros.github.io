// renders the ircbarros geometric mark as animated SVG
// exposes window.renderLogo(container, {assemble:true|false, size:N})

(function(){
  // canonical geometry derived from the supplied mark (approx, clean-coded)
  const VIEW = 200;
  // outer hex corners
  const R = 86;
  const cx = 100, cy = 100;
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI/3) * i - Math.PI/2;
    pts.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]);
  }
  // internal vertices (facets)
  const center = [cx, cy];
  const inner = [
    [cx,       cy - 28],       // top-inner
    [cx + 36,  cy + 8],        // right-inner
    [cx - 36,  cy + 8],        // left-inner
    [cx + 8,   cy + 40],       // bottom-right-inner
    [cx - 8,   cy + 40],       // bottom-left-inner
  ];

  const facets = [
    // each facet is a polygon of indexes
    // (using named helpers below)
    // outer hex ring + internal cuts to evoke the ircbarros mark
  ];

  // build explicit polyline segments
  const segs = [];
  // outer hex outline
  for (let i = 0; i < 6; i++) segs.push([pts[i], pts[(i+1)%6]]);
  // interior cuts
  segs.push([pts[0], inner[0]]);
  segs.push([pts[1], inner[1]]);
  segs.push([pts[5], inner[2]]);
  segs.push([pts[2], inner[1]]);
  segs.push([pts[4], inner[2]]);
  segs.push([pts[3], inner[3]]);
  segs.push([pts[3], inner[4]]);
  segs.push([inner[0], inner[1]]);
  segs.push([inner[0], inner[2]]);
  segs.push([inner[1], inner[3]]);
  segs.push([inner[2], inner[4]]);
  segs.push([inner[3], inner[4]]);

  window.renderLogo = function(container, opts){
    opts = Object.assign({ assemble: true, size: 220, strokeColor: '#3DD8FF' }, opts || {});
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${VIEW} ${VIEW}`);
    svg.setAttribute('width', opts.size);
    svg.setAttribute('height', opts.size);

    // filter glow
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <filter id="logo-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1.2" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <radialGradient id="logo-fill" cx="50%" cy="50%">
        <stop offset="0%" stop-color="${opts.strokeColor}" stop-opacity=".15"/>
        <stop offset="70%" stop-color="${opts.strokeColor}" stop-opacity="0"/>
      </radialGradient>
    `;
    svg.appendChild(defs);

    // background fill
    const bg = document.createElementNS('http://www.w3.org/2000/svg','polygon');
    bg.setAttribute('points', pts.map(p=>p.join(',')).join(' '));
    bg.setAttribute('fill', 'url(#logo-fill)');
    svg.appendChild(bg);

    // center dot
    const dot = document.createElementNS('http://www.w3.org/2000/svg','circle');
    dot.setAttribute('cx', cx); dot.setAttribute('cy', cy); dot.setAttribute('r', 3);
    dot.setAttribute('fill', opts.strokeColor);
    dot.setAttribute('filter', 'url(#logo-glow)');
    svg.appendChild(dot);

    // lines
    const lineEls = [];
    segs.forEach((s, i) => {
      const ln = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      ln.setAttribute('x1', s[0][0]); ln.setAttribute('y1', s[0][1]);
      ln.setAttribute('x2', s[1][0]); ln.setAttribute('y2', s[1][1]);
      ln.setAttribute('stroke', opts.strokeColor);
      ln.setAttribute('stroke-width', '1.6');
      ln.setAttribute('stroke-linecap', 'round');
      ln.setAttribute('filter', 'url(#logo-glow)');
      // prepare for assembly animation
      const len = Math.hypot(s[1][0]-s[0][0], s[1][1]-s[0][1]);
      ln.style.strokeDasharray = len;
      ln.style.strokeDashoffset = opts.assemble ? len : 0;
      ln.style.transition = `stroke-dashoffset 1.2s cubic-bezier(.2,.8,.2,1) ${0.05 * i}s, opacity .4s`;
      svg.appendChild(ln);
      lineEls.push({el: ln, len});
    });

    container.innerHTML = '';
    container.appendChild(svg);

    if (opts.assemble) {
      requestAnimationFrame(()=> {
        setTimeout(()=> {
          lineEls.forEach(({el}) => { el.style.strokeDashoffset = 0; });
        }, 120);
      });
    }

    return svg;
  };

  // glitter particles that spawn on a container
  window.spawnGlitter = function(container, count){
    count = count || 14;
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      const ang = Math.random() * Math.PI * 2;
      const rad = 60 + Math.random() * 80;
      const x = 50 + Math.cos(ang) * (rad/2);
      const y = 50 + Math.sin(ang) * (rad/2);
      s.style.left = x + '%';
      s.style.top = y + '%';
      const delay = 800 + Math.random() * 1600;
      const dur = 900 + Math.random() * 1400;
      s.animate(
        [
          { opacity: 0, transform: 'scale(0)' },
          { opacity: 1, transform: 'scale(1.4)' },
          { opacity: 0, transform: 'scale(0)' }
        ],
        { duration: dur, delay, easing: 'ease-out' }
      );
      // occasional bright twinkle
      if (Math.random() < .25) {
        s.style.width = '5px'; s.style.height = '5px';
        s.style.boxShadow = '0 0 16px #3DD8FF, 0 0 28px rgba(61,216,255,.6)';
      }
      container.appendChild(s);
      setTimeout(()=> s.remove(), delay + dur + 100);
    }
  };
})();
