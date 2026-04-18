// boot sequence + site orchestration
(function(){
  const FIRST_VISIT_KEY = 'ircb_booted_v1';
  const bootEl = document.getElementById('boot');
  const skipEl = document.getElementById('boot-skip');
  const barInner = document.querySelector('#boot .bar');
  const linesWrap = document.querySelector('#boot .lines');

  const bootLines = [
    '> booting ircbarros.kernel v4.2.1...',
    '> mounting /identity',
    '> loading /experience ........... [7 roles]',
    '> loading /certifications ....... [14/14]',
    '> loading /stack ................ [34 nodes]',
    '> syncing azure × gcp × databricks',
    '> decrypting identity...',
    '> calibrating grid · scan: ok · glyph: ok',
    '> handshake complete',
    '> ready_'
  ];

  function runBoot(cb){
    if (!bootEl) return cb();
    let i = 0;
    function next(){
      if (i < bootLines.length) {
        const d = document.createElement('div');
        d.className = 'line on' + (i > 6 ? ' dim' : '');
        d.textContent = bootLines[i];
        linesWrap.appendChild(d);
        const p = Math.round(((i+1)/bootLines.length) * 100);
        barInner.style.setProperty('--p', p + '%');
        i++;
        setTimeout(next, 120 + Math.random()*90);
      } else {
        setTimeout(finish, 380);
      }
    }
    function finish(){
      bootEl.classList.add('done');
      setTimeout(() => { bootEl.remove(); cb && cb(); }, 640);
    }
    skipEl && skipEl.addEventListener('click', () => { bootEl.classList.add('done'); setTimeout(()=>{ bootEl.remove(); cb&&cb();}, 400); });
    next();
  }

  function skipBoot(){ if (bootEl) bootEl.remove(); }

  // logo in hero (assemble + glitter on first visit only)
  function initHeroLogo(firstVisit){
    const stage = document.querySelector('.hero .logo-stage');
    if (!stage) return;
    const slot = stage.querySelector('.logo-svg');
    const glitter = stage.querySelector('.glitter');
    window.renderLogo(slot, { assemble: firstVisit, size: 220 });
    if (firstVisit && glitter && window.spawnGlitter) {
      // wait for assembly to finish
      setTimeout(() => window.spawnGlitter(glitter, 18), 1400);
      setTimeout(() => window.spawnGlitter(glitter, 12), 2400);
      setTimeout(() => window.spawnGlitter(glitter, 8),  3400);
    }
    // Cyberpunk 2077-style glitch: chromatic aberration ghost clones + slice displacement
    function createGhost(color, dx) {
      var svg = slot.querySelector('svg');
      if (!svg) return null;
      var clone = svg.cloneNode(true);
      // Recolor all drawn elements to the ghost channel color
      clone.querySelectorAll('[stroke]').forEach(function(el) {
        if (el.getAttribute('stroke') !== 'none') el.setAttribute('stroke', color);
      });
      clone.querySelectorAll('[fill]').forEach(function(el) {
        var f = el.getAttribute('fill');
        if (f && f !== 'none' && f.indexOf('url') === -1) el.setAttribute('fill', color);
      });
      // Strip filters and IDs — avoid conflicts with the original SVG defs
      clone.querySelectorAll('[filter]').forEach(function(el) { el.removeAttribute('filter'); });
      clone.querySelectorAll('[id]').forEach(function(el)     { el.removeAttribute('id'); });
      var defs = clone.querySelector('defs');
      if (defs) defs.remove();
      clone.style.cssText = 'width:100%;height:100%;overflow:visible;position:absolute;inset:0;';

      var wrap = document.createElement('div');
      wrap.style.cssText = 'position:absolute;inset:0;pointer-events:none;opacity:0;mix-blend-mode:screen;transform:translateX(' + dx + 'px);';
      wrap.appendChild(clone);
      stage.appendChild(wrap);
      return wrap;
    }

    function runGlitch() {
      var svg = slot.querySelector('svg');
      if (!svg) { schedGlitch(); return; }

      var red  = createGhost('#FF1E50', -11);
      var cyan = createGhost('#00FFD0', 11);
      if (!red || !cyan) { schedGlitch(); return; }

      // Each frame: [delay_ms, main_transform, main_opacity, red_opacity, cyan_opacity]
      var frames = [
        [0,   'translateX(-8px) skewX(-4deg)', 1,    0.9,  0   ],
        [40,  'translateX(11px)',              0.06, 0.95, 0.08],
        [70,  'translateX(-10px) skewX(5deg)', 1,   0.05, 0.98],
        [100, 'translateX(6px)',               0.5, 0.75, 0.15],
        [125, 'none',                          1,   0.55, 0.5 ],
        [155, 'translateX(-3px)',              0.15, 0.1, 0.12],
        [180, 'none',                          1,   0,    0   ],
        // second burst after a gap
        [360, 'translateX(8px) skewX(3deg)',   0.75, 0.04, 0.85],
        [390, 'none',                          0.04, 0.55, 0.1 ],
        [415, 'translateX(-5px)',              1,   0.45, 0.35],
        [445, 'none',                          1,   0,    0   ],
      ];

      frames.forEach(function(f) {
        setTimeout(function() {
          slot.style.transform = (f[1] === 'none') ? '' : f[1];
          slot.style.opacity   = (f[2] === 1)      ? '' : f[2];
          if (red)  red.style.opacity  = f[3];
          if (cyan) cyan.style.opacity = f[4];
        }, f[0]);
      });

      // cleanup
      setTimeout(function() {
        slot.style.transform = '';
        slot.style.opacity   = '';
        if (red)  red.remove();
        if (cyan) cyan.remove();
        schedGlitch();
      }, 520);
    }

    function schedGlitch() {
      setTimeout(runGlitch, 5000 + Math.random() * 8000);
    }

    setTimeout(runGlitch, firstVisit ? 4000 : 2000);
  }

  // mini mark in topbar
  function initTopbarLogo(){
    const slot = document.querySelector('.topbar .logo-word .mark');
    if (slot && window.renderLogo) window.renderLogo(slot, { assemble: false, size: 22, strokeColor: '#3DD8FF' });
  }

  // section flash on nav click
  function initSectionFlash(){
    const flash = document.getElementById('flash');
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', () => {
        if (!flash) return;
        flash.classList.remove('on');
        void flash.offsetWidth;
        flash.classList.add('on');
      });
    });
  }

  // crosshair parallax
  function initHeroParallax(){
    const layer = document.querySelector('.hero .bp-layer');
    if (!layer) return;
    document.querySelector('.hero').addEventListener('mousemove', (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      layer.style.transform = `translate(${x * -14}px, ${y * -14}px)`;
    });
  }

  // active nav on scroll
  function initActiveNav(){
    const links = document.querySelectorAll('.topbar nav a[data-sec]');
    const secs = Array.from(links).map(a => document.querySelector(a.getAttribute('href')));
    function update(){
      const y = window.scrollY + 120;
      let idx = 0;
      secs.forEach((s, i) => { if (s && s.offsetTop <= y) idx = i; });
      links.forEach((a, i) => a.classList.toggle('active', i === idx));
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  // stack init
  function initStack(){
    const wrap = document.querySelector('.stack-canvas');
    if (!wrap) return;
    const svg = wrap.querySelector('svg');
    const info = wrap.querySelector('.stack-info');
    const filters = document.querySelector('.stack-filters');
    const r = wrap.getBoundingClientRect();
    window.initStack({ svg, width: r.width, height: r.height, info, filtersEl: filters });
  }

  // tweaks panel
  function initTweaks(){
    const panel = document.getElementById('tweaks');
    if (!panel) return;

    const DEFAULTS = /*EDITMODE-BEGIN*/{
      "motion": "full",
      "replayBoot": false,
      "accent": "cyan"
    }/*EDITMODE-END*/;
    const state = { ...DEFAULTS };

    function apply(){
      document.body.classList.toggle('motion-low', state.motion === 'low');
      const accents = {
        cyan:    ['#0EA5C2', '#3DD8FF'],
        magenta: ['#C026D3', '#F472D0'],
        lime:    ['#84CC16', '#BEF264']
      };
      const [a,b] = accents[state.accent] || accents.cyan;
      document.documentElement.style.setProperty('--cyan', a);
      document.documentElement.style.setProperty('--cyan-bright', b);
      panel.querySelectorAll('button').forEach(btn => {
        const k = btn.dataset.key, v = btn.dataset.val;
        btn.classList.toggle('active', String(state[k]) === v);
      });
    }
    apply();

    panel.addEventListener('click', (e) => {
      const btn = e.target.closest('button'); if (!btn) return;
      const k = btn.dataset.key, v = btn.dataset.val;
      if (!k) return;
      if (k === 'replayBoot' && v === 'now') {
        localStorage.removeItem(FIRST_VISIT_KEY);
        location.reload();
        return;
      }
      if (v === 'true' || v === 'false') state[k] = (v === 'true');
      else state[k] = v;
      apply();
      try { window.parent.postMessage({type:'__edit_mode_set_keys', edits:{[k]:state[k]}}, '*'); } catch(_){}
    });

    window.addEventListener('message', (e) => {
      const d = e.data;
      if (!d || typeof d !== 'object') return;
      if (d.type === '__activate_edit_mode') panel.classList.add('on');
      if (d.type === '__deactivate_edit_mode') panel.classList.remove('on');
    });
    try { window.parent.postMessage({type:'__edit_mode_available'}, '*'); } catch(_){}
  }

  // terminal commands in contact section (interactive typewriter)
  function initTerminal(){
    const term = document.getElementById('terminal-connect');
    if (!term) return;

    const lines = Array.from(term.querySelectorAll('.tl'));
    // capture each line's inner HTML and hide all lines
    const originals = lines.map(el => {
      const html = el.innerHTML;
      el.innerHTML = '';
      el.style.opacity = '1'; // keep layout space; content hidden by empty innerHTML
      return html;
    });

    let started = false;

    function typeLines() {
      if (started) return;
      started = true;

      // move the persistent cursor element out temporarily
      const cursorEl = document.getElementById('terminal-cursor');

      let lineIdx = 0;

      function nextLine() {
        if (lineIdx >= lines.length) return;
        const el = lines[lineIdx];
        const html = originals[lineIdx];
        lineIdx++;

        // blank/whitespace lines render instantly
        if (!html || html === '&nbsp;' || html.trim() === '') {
          el.innerHTML = html;
          setTimeout(nextLine, 80);
          return;
        }

        // use a scratch div to walk text nodes so we emit HTML tags atomically
        const scratch = document.createElement('div');
        scratch.innerHTML = html;

        // flatten into tokens: {type:'tag', html} | {type:'text', char}
        const tokens = [];
        function walk(node) {
          if (node.nodeType === 3) {
            for (const ch of node.textContent) tokens.push({ type: 'text', char: ch });
          } else if (node.nodeType === 1) {
            // emit the whole subtree as a tag token (links, spans, etc.)
            tokens.push({ type: 'tag', html: node.outerHTML });
          }
        }
        Array.from(scratch.childNodes).forEach(walk);

        let ti = 0;
        let built = '';

        function typeNext() {
          if (ti >= tokens.length) {
            el.innerHTML = html; // snap to final (ensures links work perfectly)
            setTimeout(nextLine, 60);
            return;
          }
          const tok = tokens[ti++];
          if (tok.type === 'tag') {
            built += tok.html;
          } else {
            built += tok.char;
          }
          el.innerHTML = built;
          const delay = tok.type === 'text' ? 28 + Math.random() * 24 : 0;
          setTimeout(typeNext, delay);
        }
        typeNext();
      }

      nextLine();
    }

    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        io.disconnect();
        setTimeout(typeLines, 200);
      }
    }, { threshold: 0.15 });
    io.observe(term);
  }

  // ————— start —————
  function start(){
    initTopbarLogo();
    initHeroParallax();
    initSectionFlash();
    initActiveNav();
    if (window.initTimeline) window.initTimeline(document.querySelector('.tl-wrap'));
    initStack();
    initTweaks();
    initTerminal();
  }

  const firstVisit = !localStorage.getItem(FIRST_VISIT_KEY);
  if (firstVisit) {
    runBoot(() => {
      localStorage.setItem(FIRST_VISIT_KEY, '1');
      initHeroLogo(true);
      start();
    });
  } else {
    skipBoot();
    initHeroLogo(false);
    start();
  }
})();
