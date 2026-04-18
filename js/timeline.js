// timeline T1 — circuit / subway diagram
// draws SVG rails + scroll-bound read-head between two node columns

(function(){
  window.initTimeline = function(root) {
    const svg = root.querySelector('.tl-svg');
    const roleNodes = Array.from(root.querySelectorAll('.tl-roles .tl-node'));
    const certNodes = Array.from(root.querySelectorAll('.tl-certs .tl-cert'));
    if (!svg) return;

    function resize() {
      const w = root.clientWidth;
      const h = root.clientHeight;
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      svg.innerHTML = '';

      // compute node center Y positions relative to root
      const rootRect = root.getBoundingClientRect();
      function centerY(el) {
        const r = el.getBoundingClientRect();
        return r.top - rootRect.top + r.height / 2;
      }
      const roleYs = roleNodes.map(centerY);
      const certYs = certNodes.map(centerY);

      const leftX = w * 0.5 - 28;
      const rightX = w * 0.5 + 28;

      const ns = 'http://www.w3.org/2000/svg';
      function line(x1,y1,x2,y2,opts){
        const ln = document.createElementNS(ns,'line');
        ln.setAttribute('x1',x1);ln.setAttribute('y1',y1);
        ln.setAttribute('x2',x2);ln.setAttribute('y2',y2);
        Object.entries(opts||{}).forEach(([k,v])=>ln.setAttribute(k,v));
        svg.appendChild(ln);
        return ln;
      }
      function circle(x,y,r,opts){
        const c = document.createElementNS(ns,'circle');
        c.setAttribute('cx',x);c.setAttribute('cy',y);c.setAttribute('r',r);
        Object.entries(opts||{}).forEach(([k,v])=>c.setAttribute(k,v));
        svg.appendChild(c);
        return c;
      }
      function rect(x,y,wi,he,opts){
        const r = document.createElementNS(ns,'rect');
        r.setAttribute('x',x);r.setAttribute('y',y);r.setAttribute('width',wi);r.setAttribute('height',he);
        Object.entries(opts||{}).forEach(([k,v])=>r.setAttribute(k,v));
        svg.appendChild(r);
        return r;
      }

      // rails
      if (roleYs.length > 0) {
        line(leftX, roleYs[0], leftX, roleYs[roleYs.length-1], {
          stroke: '#1E3A5F', 'stroke-width': 2
        });
      }
      if (certYs.length > 0) {
        line(rightX, certYs[0], rightX, certYs[certYs.length-1], {
          stroke: '#0EA5C2', 'stroke-width': 1.3, 'stroke-dasharray': '5 4'
        });
      }

      // nodes on rails
      roleYs.forEach((y, i) => {
        const isNow = i === 0; // newest first
        circle(leftX, y, isNow ? 7 : 5, {
          fill: isNow ? '#3DD8FF' : '#0B1220',
          stroke: isNow ? '#3DD8FF' : '#1E3A5F',
          'stroke-width': 2,
          filter: isNow ? 'drop-shadow(0 0 8px #3DD8FF)' : ''
        });
        // connector to card
        line(leftX, y, leftX - 40, y, { stroke: '#243a5c', 'stroke-width': 1 });
      });
      certYs.forEach((y) => {
        rect(rightX - 5, y - 5, 10, 10, {
          fill: '#0B1220', stroke: '#0EA5C2', 'stroke-width': 1.4
        });
        line(rightX, y, rightX + 40, y, { stroke: '#243a5c', 'stroke-width': 1, 'stroke-dasharray': '3 3' });
      });

      // bridges between role and cert (causal links)
      // roles order (newest first): 0=ASML, 1=Devoteam, 2=BeyondGravity, 3=Reckitt, 4=AES, 5=AIRobots, 6=UFPB
      // certs order (newest first): 0=DBPro, 1=GCPDBEngineer, 2=MongoArch, 3=MongoAssoc, 4=GCPAssocDP,
      //   5=Prefect, 6=DBAssoc, 7=Airflow, 8=dbt, 9=Cisco, 10=UdacityML, 11=DEPC, 12=APIDesigner
      const bridges = [
        [0, 0], // ASML       <-> Databricks Pro
        [0, 1], // ASML       <-> GCP Cloud DB Engineer
        [1, 2], // Devoteam   <-> Mongo Arch
        [1, 3], // Devoteam   <-> Mongo Assoc
        [1, 4], // Devoteam   <-> GCP Assoc Data Practitioner
        [2, 6], // BG         <-> Databricks Assoc
        [3, 7], // Reckitt    <-> Airflow
        [3, 8], // Reckitt    <-> dbt
        [5, 9], // AIRobots   <-> Cisco Cybersec
        [5,10], // AIRobots   <-> Udacity ML
        [5,11], // AIRobots   <-> DEPC
        [5,12], // AIRobots   <-> API Designer
      ];
      bridges.forEach(([ri, ci]) => {
        if (!roleYs[ri] || !certYs[ci]) return;
        const y1 = roleYs[ri], y2 = certYs[ci];
        const mx = (leftX + rightX) / 2;
        const d = `M ${leftX} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${rightX} ${y2}`;
        const p = document.createElementNS(ns,'path');
        p.setAttribute('d', d);
        p.setAttribute('stroke', '#3DD8FF');
        p.setAttribute('stroke-width', '.8');
        p.setAttribute('fill', 'none');
        p.setAttribute('stroke-dasharray', '2 3');
        p.setAttribute('opacity', '.45');
        svg.appendChild(p);
      });

      // signal animation — overlay animated strokes on rails and bridges
      // roles rail signal (flows top → bottom)
      if (roleYs.length > 0) {
        const sigRole = document.createElementNS(ns,'line');
        sigRole.setAttribute('x1', leftX); sigRole.setAttribute('x2', leftX);
        sigRole.setAttribute('y1', roleYs[0]); sigRole.setAttribute('y2', roleYs[roleYs.length-1]);
        sigRole.setAttribute('class', 'tl-signal');
        svg.appendChild(sigRole);
      }
      // certs rail signal (flows top → bottom, delayed so it looks like signal arrives from roles)
      if (certYs.length > 0) {
        const sigCert = document.createElementNS(ns,'line');
        sigCert.setAttribute('x1', rightX); sigCert.setAttribute('x2', rightX);
        sigCert.setAttribute('y1', certYs[0]); sigCert.setAttribute('y2', certYs[certYs.length-1]);
        sigCert.setAttribute('class', 'tl-signal');
        sigCert.style.animationDelay = '1.2s';
        svg.appendChild(sigCert);
      }
      // bridge signals (one pulse per bridge, staggered)
      bridges.forEach(([ri, ci], idx) => {
        if (!roleYs[ri] || !certYs[ci]) return;
        const y1 = roleYs[ri], y2 = certYs[ci];
        const mx = (leftX + rightX) / 2;
        const d = `M ${leftX} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${rightX} ${y2}`;
        const sp = document.createElementNS(ns,'path');
        sp.setAttribute('d', d);
        sp.setAttribute('class', 'tl-signal bridge');
        sp.style.animationDelay = (idx * 0.28) + 's';
        svg.appendChild(sp);
      });

      // read-head element (updated on scroll)
      const head = document.createElementNS(ns,'g');
      head.setAttribute('id','tl-head');
      const headY = roleYs[0] || 40;
      const hl = document.createElementNS(ns,'line');
      hl.setAttribute('x1', 0); hl.setAttribute('x2', w);
      hl.setAttribute('y1', headY); hl.setAttribute('y2', headY);
      hl.setAttribute('stroke', '#3DD8FF');
      hl.setAttribute('stroke-width', '1');
      hl.setAttribute('opacity', '.35');
      head.appendChild(hl);
      svg.appendChild(head);

      return { roleYs, certYs, headLine: hl, w, h };
    }

    let state = resize();

    window.addEventListener('resize', () => { state = resize(); });

    // IntersectionObserver — reveal nodes as they enter
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.2 });
    roleNodes.forEach(n => io.observe(n));
    certNodes.forEach(n => io.observe(n));

    // scroll-bound read-head moves between first and last node vertically
    function onScroll() {
      if (!state || !state.roleYs.length) return;
      const rootRect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (vh - rootRect.top) / (rootRect.height + vh)));
      const y1 = state.roleYs[0];
      const y2 = state.roleYs[state.roleYs.length - 1];
      const y = y1 + (y2 - y1) * progress;
      state.headLine.setAttribute('y1', y);
      state.headLine.setAttribute('y2', y);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  };
})();
