// honeycomb force-graph: hexagonal nodes with physics
(function(){
  const NS = 'http://www.w3.org/2000/svg';

  const NODES = [
    // id, label, group, size, isMe, isHub, icon (Simple Icons slug)
    { id: 'me', label: 'MAIN', group: 'me', size: 42, me: true },

    // hubs
    { id: 'gcp',    label: 'GCP',       group: 'cloud', size: 32, hub: true, icon: 'googlecloud' },
    { id: 'azure',  label: 'AZURE',     group: 'cloud', size: 32, hub: true, icon: 'microsoftazure' },
    { id: 'data',   label: 'DATA',      group: 'data',  size: 32, hub: true },
    { id: 'ops',    label: 'OPS',       group: 'ops',   size: 32, hub: true },
    { id: 'code',   label: 'CODE',      group: 'code',  size: 32, hub: true },
    { id: 'gov',    label: 'GOV',       group: 'gov',   size: 32, hub: true },
    { id: 'ai',     label: 'AI',        group: 'ai',    size: 32, hub: true },

    // gcp
    { id: 'bigquery',      label: 'bigquery',       group: 'cloud', size: 22, icon: 'googlebigquery' },
    { id: 'dataflow',      label: 'dataflow',       group: 'cloud', size: 22, icon: 'googledataflow' },
    { id: 'pubsub',        label: 'pubsub',         group: 'cloud', size: 22, icon: 'googlepubsub' },
    { id: 'vertex',        label: 'vertex',         group: 'cloud', size: 22, icon: 'googlevertexai' },
    { id: 'gke',           label: 'gke',            group: 'cloud', size: 22, icon: 'googlekubernetesengine' },
    { id: 'cloudfunctions',label: 'functions',      group: 'cloud', size: 22, icon: 'googlecloudfunctions' },
    { id: 'gcs',           label: 'gcs',            group: 'cloud', size: 22, icon: 'googlecloudstorage' },

    // azure
    { id: 'adls',        label: 'adls',       group: 'cloud', size: 22, icon: 'azuredatalakestorage' },
    { id: 'datafactory', label: 'adf',        group: 'cloud', size: 22, icon: 'azuredatafactory' },
    { id: 'eventhub',    label: 'event hub',  group: 'cloud', size: 22, icon: 'azureeventhubs' },
    { id: 'iothub',      label: 'iot hub',    group: 'cloud', size: 22, icon: 'azureiotcentral' },
    { id: 'powerbi',     label: 'powerbi',    group: 'cloud', size: 22, icon: 'powerbi' },
    { id: 'copilot',     label: 'copilot',    group: 'cloud', size: 22, icon: 'microsoftcopilot' },

    // data
    { id: 'databricks', label: 'databricks', group: 'data', size: 26, icon: 'databricks' },
    { id: 'spark',      label: 'spark',      group: 'data', size: 24, icon: 'apachespark' },
    { id: 'delta',      label: 'delta',      group: 'data', size: 22, icon: 'deltalake' },
    { id: 'unity',      label: 'unity cat',  group: 'data', size: 22, icon: 'databricks' },
    { id: 'dbt',        label: 'dbt',        group: 'data', size: 22, icon: 'dbt' },
    { id: 'airflow',    label: 'airflow',    group: 'data', size: 22, icon: 'apacheairflow' },
    { id: 'prefect',    label: 'prefect',    group: 'data', size: 22, icon: 'prefect' },
    { id: 'sql',        label: 'sql',        group: 'data', size: 22, icon: 'postgresql' },
    { id: 'mongo',      label: 'mongo',      group: 'data', size: 22, icon: 'mongodb' },

    // ops
    { id: 'k8s',       label: 'k8s',       group: 'ops', size: 22, icon: 'kubernetes' },
    { id: 'terraform', label: 'terraform', group: 'ops', size: 22, icon: 'terraform' },
    { id: 'docker',    label: 'docker',    group: 'ops', size: 22, icon: 'docker' },
    { id: 'otel',      label: 'otel',      group: 'ops', size: 22, icon: 'opentelemetry' },
    { id: 'nginx',     label: 'nginx',     group: 'ops', size: 22, icon: 'nginx' },
    { id: 'ansible',   label: 'ansible',   group: 'ops', size: 22, icon: 'ansible' },

    // code (renamed from lang)
    { id: 'python',  label: 'python',  group: 'code', size: 24, icon: 'python' },
    { id: 'pandas',  label: 'pandas',  group: 'code', size: 22, icon: 'pandas' },
    { id: 'git',     label: 'git',     group: 'code', size: 22, icon: 'git' },
    { id: 'r',       label: 'R',       group: 'code', size: 22, icon: 'r' },
    { id: 'bash',    label: 'bash',    group: 'code', size: 22, icon: 'gnubash' },
    { id: 'shell',   label: 'shell',   group: 'code', size: 22, icon: 'gnubash' },
    { id: 'cpp',     label: 'C++',     group: 'code', size: 22, icon: 'cplusplus' },

    // gov
    { id: 'dama',       label: 'dama',       group: 'gov', size: 22 },
    { id: 'datasecops', label: 'datasecops', group: 'gov', size: 22 },
    { id: 'mlops',      label: 'mlops',      group: 'gov', size: 22 },

    // ai
    { id: 'robotics',  label: 'robotics',  group: 'ai', size: 22 },
    { id: 'claude',    label: 'claude',    group: 'ai', size: 22, icon: 'anthropic' },
    { id: 'llms',      label: 'llms',      group: 'ai', size: 22 },
    { id: 'genai',     label: 'genai',     group: 'ai', size: 22 },
    { id: 'mem0',      label: 'mem0',      group: 'ai', size: 22 },
    { id: 'qdrant',    label: 'qdrant',    group: 'ai', size: 22, icon: 'qdrant' },
    { id: 'langfuse',  label: 'langfuse',  group: 'ai', size: 22, icon: 'langchain' },
    { id: 'langchain', label: 'langchain', group: 'ai', size: 22, icon: 'langchain' },
  ];

  // edges (id pairs)
  const EDGES = [
    // hubs -> me
    ['me','gcp'],['me','azure'],['me','data'],['me','ops'],['me','code'],['me','gov'],['me','ai'],
    // gcp
    ['gcp','bigquery'],['gcp','dataflow'],['gcp','pubsub'],['gcp','vertex'],['gcp','gke'],['gcp','cloudfunctions'],['gcp','gcs'],
    // azure
    ['azure','adls'],['azure','datafactory'],['azure','eventhub'],['azure','iothub'],['azure','powerbi'],['azure','copilot'],
    // data
    ['data','databricks'],['data','spark'],['data','delta'],['data','unity'],['data','dbt'],['data','airflow'],['data','prefect'],['data','sql'],['data','mongo'],
    // ops
    ['ops','k8s'],['ops','terraform'],['ops','docker'],['ops','otel'],['ops','nginx'],['ops','ansible'],
    // code
    ['code','python'],['code','pandas'],['code','git'],['code','r'],['code','bash'],['code','shell'],['code','cpp'],
    // gov
    ['gov','dama'],['gov','datasecops'],['gov','mlops'],
    // ai
    ['ai','robotics'],['ai','claude'],['ai','llms'],['ai','genai'],['ai','mem0'],['ai','qdrant'],['ai','langfuse'],['ai','langchain'],
    // cross-links (real relationships)
    ['databricks','spark'],['databricks','delta'],['databricks','unity'],
    ['azure','databricks'],['gcp','databricks'],
    ['python','pandas'],['python','spark'],['python','airflow'],['python','prefect'],
    ['python','langchain'],['python','qdrant'],['python','dbt'],['python','cloudfunctions'],
    ['k8s','otel'],['k8s','docker'],['terraform','k8s'],['terraform','ops'],
    ['terraform','gcp'],['terraform','azure'],
    ['dbt','sql'],['dbt','databricks'],['dbt','bigquery'],
    ['copilot','ai'],['genai','llms'],['langchain','llms'],
    ['bash','shell'],
    ['langchain','qdrant'],['langfuse','langchain'],['mem0','langchain'],
    ['mem0','llms'],['qdrant','llms'],['claude','llms'],
    ['vertex','llms'],['genai','vertex'],['genai','copilot'],
    ['robotics','cpp'],['robotics','python'],
    ['airflow','k8s'],
    ['adls','databricks'],['adls','datafactory'],['eventhub','databricks'],
    ['pubsub','dataflow'],['bigquery','dataflow'],
    ['delta','adls'],['delta','gcs'],
    ['mlops','databricks'],['mlops','python'],
    ['nginx','k8s'],
    ['spark','sql'],
  ];

  function hexPoints(size) {
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI/3) * i + Math.PI/2; // flat-top
      pts.push([size * Math.cos(a), size * Math.sin(a)]);
    }
    return pts.map(p => p.join(',')).join(' ');
  }

  window.initStack = function(opts){
    const svgRoot = opts.svg;
    const W = opts.width, H = opts.height;
    const infoEl = opts.info;

    svgRoot.innerHTML = '';
    svgRoot.setAttribute('viewBox', `0 0 ${W} ${H}`);

    // defs
    const defs = document.createElementNS(NS, 'defs');
    defs.innerHTML = `
      <filter id="hex-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    `;
    svgRoot.appendChild(defs);

    // groups
    const gEdges = document.createElementNS(NS, 'g');
    const gNodes = document.createElementNS(NS, 'g');
    svgRoot.appendChild(gEdges);
    svgRoot.appendChild(gNodes);

    // init positions: hubs around center, leaves around hubs
    const byId = {};
    NODES.forEach(n => { byId[n.id] = n; });

    const cx = W / 2, cy = H / 2;
    byId.me.x = cx; byId.me.y = cy; byId.me.vx = 0; byId.me.vy = 0;

    const hubs = NODES.filter(n => n.hub);
    const hubRadius = Math.min(W, H) * 0.28;
    hubs.forEach((h, i) => {
      const a = (Math.PI * 2 / hubs.length) * i - Math.PI / 2;
      h.x = cx + Math.cos(a) * hubRadius;
      h.y = cy + Math.sin(a) * hubRadius;
      h.vx = 0; h.vy = 0;
    });

    NODES.filter(n => !n.me && !n.hub).forEach(n => {
      // attach to its group's hub
      const hub = hubs.find(h => h.group === n.group);
      if (hub) {
        const a = Math.random() * Math.PI * 2;
        n.x = hub.x + Math.cos(a) * 60;
        n.y = hub.y + Math.sin(a) * 60;
      } else {
        n.x = cx + (Math.random()-.5) * 200;
        n.y = cy + (Math.random()-.5) * 200;
      }
      n.vx = 0; n.vy = 0;
    });

    // build edge elements
    const edgeEls = EDGES.map(([a,b]) => {
      const ln = document.createElementNS(NS, 'line');
      ln.setAttribute('class','edge');
      ln.dataset.a = a; ln.dataset.b = b;
      gEdges.appendChild(ln);
      return { el: ln, a: byId[a], b: byId[b], ida: a, idb: b };
    });

    // build node elements
    const nodeEls = NODES.map(n => {
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'hex-node' + (n.me ? ' me' : n.hub ? ' hub' : '') + (n.group === 'ai' ? ' ai-node' : ''));
      g.dataset.id = n.id;
      g.dataset.group = n.group;

      const poly = document.createElementNS(NS, 'polygon');
      poly.setAttribute('points', hexPoints(n.size));
      if (n.me) poly.setAttribute('filter', 'url(#hex-glow)');
      g.appendChild(poly);

      // icon: render above label for non-me nodes that have an icon slug
      if (n.icon && !n.me) {
        const iconSize = n.hub ? 14 : 12;
        const img = document.createElementNS(NS, 'image');
        img.setAttribute('href', `https://cdn.simpleicons.org/${n.icon}/3DD8FF`);
        img.setAttribute('width', iconSize);
        img.setAttribute('height', iconSize);
        img.setAttribute('x', -iconSize / 2);
        img.setAttribute('y', n.hub ? -(iconSize + 3) : -(iconSize / 2 + 4));
        img.setAttribute('style', 'pointer-events:none');
        g.appendChild(img);
      }

      // label: only show for me, hubs, or nodes without an icon
      if (n.me || n.hub || !n.icon) {
        const txt = document.createElementNS(NS, 'text');
        txt.textContent = n.label;
        // shift text down when there's an icon (hub nodes only reach here)
        if (n.icon && !n.me) {
          const offset = n.hub ? 6 : 5;
          txt.setAttribute('dy', offset);
        }
        g.appendChild(txt);
      }

      gNodes.appendChild(g);
      n.el = g;

      // interaction
      g.addEventListener('mouseenter', () => highlight(n.id));
      g.addEventListener('mouseleave', () => clearHighlight());
      g.addEventListener('click', (e)=>{ e.stopPropagation(); lock(n.id); });

      return { n, g };
    });

    function adjacentTo(id) {
      const s = new Set([id]);
      EDGES.forEach(([a,b]) => {
        if (a === id) s.add(b);
        if (b === id) s.add(a);
      });
      return s;
    }

    let locked = null;
    function highlight(id) {
      if (locked) return;
      const adj = adjacentTo(id);
      nodeEls.forEach(({n, g}) => {
        g.classList.toggle('linked', adj.has(n.id) && n.id !== id);
        g.classList.toggle('dim', !adj.has(n.id));
      });
      edgeEls.forEach(e => {
        const use = (e.ida === id || e.idb === id);
        e.el.classList.toggle('highlight', use);
        e.el.classList.toggle('dim', !use);
      });
      showInfo(id);
    }
    function clearHighlight() {
      if (locked) return;
      nodeEls.forEach(({g}) => { g.classList.remove('linked','dim'); });
      edgeEls.forEach(e => { e.el.classList.remove('highlight','dim'); });
      showInfo(null);
    }
    function lock(id) {
      if (locked === id) { locked = null; clearHighlight(); resetFocus(); return; }
      locked = null; highlight(id); locked = id; focusOn(id);
    }

    svgRoot.addEventListener('click', (e)=>{
      if (e.target === svgRoot || e.target === gEdges) { locked = null; clearHighlight(); resetFocus(); }
    });

    // viewBox focus animation
    let currentVB = [0, 0, W, H];
    let targetVB  = [0, 0, W, H];
    let vbRafId   = null;

    function lerpVB() {
      let done = true;
      for (let i = 0; i < 4; i++) {
        currentVB[i] += (targetVB[i] - currentVB[i]) * 0.12;
        if (Math.abs(targetVB[i] - currentVB[i]) > 0.5) done = false;
      }
      svgRoot.setAttribute('viewBox', currentVB.map(v => v.toFixed(1)).join(' '));
      if (!done) vbRafId = requestAnimationFrame(lerpVB);
      else vbRafId = null;
    }

    function startVBLerp() {
      if (vbRafId) cancelAnimationFrame(vbRafId);
      vbRafId = requestAnimationFrame(lerpVB);
    }

    function focusOn(id) {
      const adj = adjacentTo(id);
      const nodes = NODES.filter(n => adj.has(n.id));
      if (!nodes.length) return;
      const pad = 80;
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      nodes.forEach(n => {
        minX = Math.min(minX, n.x - n.size);
        minY = Math.min(minY, n.y - n.size);
        maxX = Math.max(maxX, n.x + n.size);
        maxY = Math.max(maxY, n.y + n.size);
      });
      targetVB = [minX - pad, minY - pad, maxX - minX + pad * 2, maxY - minY + pad * 2];
      startVBLerp();
    }

    function resetFocus() {
      targetVB = [0, 0, W, H];
      startVBLerp();
    }

    // info panel content
    const META = {
      me:            { t: 'ITALO BARROS', d: 'Data & AI Architect', years: '7y', proj: '7 companies' },
      gcp:           { t: 'GOOGLE CLOUD', d: 'Data platforms @ Devoteam, ASML', years: '3y', proj: '6 clients' },
      azure:         { t: 'MICROSOFT AZURE', d: 'Data Mgmt @ Beyond Gravity, ASML', years: '4y', proj: '4 platforms' },
      data:          { t: 'DATA · PROCESSING', d: 'Spark, Delta, orchestration', years: '6y', proj: 'core' },
      ops:           { t: 'OPS · INFRA', d: 'K8s, Terraform, IaC', years: '4y', proj: 'prod' },
      code:          { t: 'CODE · LANGUAGES', d: 'Python first, SQL everywhere', years: '8y', proj: 'daily' },
      gov:           { t: 'GOVERNANCE', d: 'DAMA, DataSecOps, MLOps', years: '3y', proj: 'tech-lead' },
      ai:            { t: 'AI · LLMs · GenAI', d: 'Adversarial AI research, LLM red-teaming', years: '3y', proj: 'PhD · NOVA IMS' },
      databricks:    { t: 'DATABRICKS', years: 'daily', proj: 'ASML · Reckitt · BG' },
      spark:         { t: 'PYSPARK', years: 'daily', proj: 'daily' },
      python:        { t: 'PYTHON', years: '6y', proj: 'primary' },
      k8s:           { t: 'KUBERNETES', years: '1y', proj: 'ASML · homelab' },
      terraform:     { t: 'TERRAFORM', years: '1y', proj: 'ASML · homelab' },
      dbt:           { t: 'DBT', d: 'Certified fundamentals; modern data stack', years: '1y', proj: 'Reckitt' },
      genai:         { t: 'GENAI', years: '2y', proj: 'daily · research' },
      mongo:         { t: 'MONGODB', d: 'Certified SI Associate + Architect', years: 'certified', proj: 'Devoteam' },
      claude:        { t: 'ANTHROPIC CLAUDE', years: '1y', proj: 'EPAM · homelab' },
      llms:          { t: 'LLMs', years: '2y', proj: 'daily · research' },
      qdrant:        { t: 'QDRANT', years: '1y', proj: 'homelab' },
      langchain:     { t: 'LANGCHAIN', years: '1y', proj: 'homelab' },
      langfuse:      { t: 'LANGFUSE', years: '1y', proj: 'homelab' },
      mem0:          { t: 'MEM0', years: '1y', proj: 'homelab' },
      robotics:      { t: 'ROBOTICS', years: '2y', proj: 'UFPB · LARS 2019' },
      ansible:       { t: 'ANSIBLE', years: '—', proj: 'homelab' },
      bash:          { t: 'BASH', years: '4y', proj: '—' },
      r:             { t: 'R', years: '2y', proj: 'AES Brasil' },
      cpp:           { t: 'C++', years: '2y', proj: '—' },
      cloudfunctions:{ t: 'CLOUD FUNCTIONS', years: '2y', proj: 'Reckitt' },
      gcs:           { t: 'GOOGLE CLOUD STORAGE', d: 'Object storage for data lakes', years: '3y', proj: 'core' },
      nginx:         { t: 'NGINX', years: '1y', proj: 'ASML' },
      docker:        { t: 'DOCKER', years: '1y', proj: 'homelab' },
      otel:          { t: 'OPENTELEMETRY', years: '1y', proj: 'ASML' },
      shell:         { t: 'SHELL', years: '1y', proj: 'AES Brasil' },
      git:           { t: 'GIT', years: '5y', proj: 'daily' },
      pandas:        { t: 'PANDAS', years: '2y', proj: 'AES Brasil · AI ROBOTS' },
      airflow:       { t: 'AIRFLOW', years: '1y', proj: 'Devoteam · AI ROBOTS' },
      prefect:       { t: 'PREFECT', years: '1y', proj: 'AES Brasil' },
      sql:           { t: 'SQL', years: '3y', proj: 'Reckitt · ASML' },
      delta:         { t: 'DELTA LAKE', years: '5y', proj: 'daily' },
      unity:         { t: 'UNITY CATALOG', years: '3y', proj: 'daily' },
      gke:           { t: 'GKE', years: '1y', proj: 'ASML' },
      iothub:        { t: 'IOT HUB', years: '1y', proj: 'AI ROBOTS' },
      datafactory:   { t: 'AZURE DATA FACTORY', years: '2y', proj: 'Reckitt' },
      adls:          { t: 'AZURE DATA LAKE STORAGE', years: '3y', proj: 'Reckitt · ASML' },
      powerbi:       { t: 'POWER BI', years: '3y', proj: 'AES Brasil · Reckitt' },
      eventhub:      { t: 'AZURE EVENT HUBS', years: '1y', proj: 'ASML' },
      dataflow:      { t: 'GOOGLE DATAFLOW', years: '1y', proj: 'Devoteam' },
      bigquery:      { t: 'BIGQUERY', years: '2y', proj: 'AES Brasil · Devoteam' },
      vertex:        { t: 'VERTEX AI', years: '1y', proj: 'ASML' },
      pubsub:        { t: 'GOOGLE PUB/SUB', years: '1y', proj: 'Devoteam' },
      copilot:       { t: 'MICROSOFT COPILOT', years: '2y', proj: 'daily' },
      mlops:         { t: 'MLOPS', d: 'ML lifecycle, model registry, retraining pipelines', years: '2y', proj: 'AES Brasil · BG' },
      datasecops:    { t: 'DATASECOPS', d: 'Data security posture, shift-left governance', years: '2y', proj: 'ASML' },
      dama:          { t: 'DAMA', d: 'Enterprise data governance framework', years: '2y', proj: 'BG · Reckitt' },
    };
    function showInfo(id) {
      if (!infoEl) return;
      if (!id) {
        infoEl.innerHTML = `<div class="t">$ stack --interact</div>
          <div class="meta-row"><span>hover</span><b>inspect</b></div>
          <div class="meta-row"><span>click</span><b>lock view</b></div>
          <div class="meta-row"><span>filter</span><b>chips above</b></div>`;
        return;
      }
      const m = META[id] || { t: id.toUpperCase(), d: '', years: '—', proj: '—' };
      infoEl.innerHTML = `
        <div class="t">${m.t}</div>
        ${m.d ? `<div class="meta-row" style="color:var(--paper);font-family:var(--mono);font-size:11px;line-height:1.5">${m.d}</div>` : ''}
        <div class="meta-row"><span>exp</span><b>${m.years}</b></div>
        <div class="meta-row"><span>where</span><b>${m.proj}</b></div>
      `;
    }
    showInfo(null);

    // filter chips
    if (opts.filtersEl) {
      opts.filtersEl.addEventListener('click', (e) => {
        const chip = e.target.closest('.chip');
        if (!chip) return;
        opts.filtersEl.querySelectorAll('.chip').forEach(c => c.classList.remove('on'));
        chip.classList.add('on');
        const g = chip.dataset.group;
        nodeEls.forEach(({n, g: el}) => {
          const show = g === 'all' || n.group === g || n.me;
          el.classList.toggle('dim', !show);
        });
      });
    }

    // drag
    let drag = null;
    svgRoot.addEventListener('pointerdown', (e) => {
      const g = e.target.closest('.hex-node');
      if (!g) return;
      const id = g.dataset.id;
      const n = byId[id];
      const pt = ptToSvg(e);
      drag = { n, dx: pt.x - n.x, dy: pt.y - n.y };
      svgRoot.setPointerCapture(e.pointerId);
    });
    svgRoot.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const pt = ptToSvg(e);
      drag.n.x = pt.x - drag.dx;
      drag.n.y = pt.y - drag.dy;
      drag.n.vx = 0; drag.n.vy = 0;
      drag.n.fixed = true;
    });
    svgRoot.addEventListener('pointerup', () => { if (drag) { drag.n.fixed = false; drag = null; } });
    svgRoot.addEventListener('pointercancel', () => { drag = null; });

    function ptToSvg(e) {
      const rect = svgRoot.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (W / rect.width);
      const y = (e.clientY - rect.top) * (H / rect.height);
      return { x, y };
    }

    // simulation
    function tick() {
      // repulsion
      for (let i = 0; i < NODES.length; i++) {
        for (let j = i+1; j < NODES.length; j++) {
          const a = NODES[i], b = NODES[j];
          const dx = b.x - a.x, dy = b.y - a.y;
          let d2 = dx*dx + dy*dy;
          if (d2 < 1) d2 = 1;
          const d = Math.sqrt(d2);
          const minDist = a.size + b.size + 6;
          const repel = 800 / d2;
          let fx = (dx/d) * repel;
          let fy = (dy/d) * repel;
          // hard collision
          if (d < minDist) {
            const push = (minDist - d) * 0.5;
            fx += (dx/d) * push;
            fy += (dy/d) * push;
          }
          if (!a.me && !a.fixed) { a.vx -= fx; a.vy -= fy; }
          if (!b.me && !b.fixed) { b.vx += fx; b.vy += fy; }
        }
      }
      // spring
      edgeEls.forEach(e => {
        const a = e.a, b = e.b;
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.sqrt(dx*dx + dy*dy) || 1;
        const rest = (a.hub && b.me) || (b.hub && a.me) ? 150 : 80;
        const k = 0.02;
        const f = (d - rest) * k;
        const fx = (dx/d) * f, fy = (dy/d) * f;
        if (!a.me && !a.fixed) { a.vx += fx; a.vy += fy; }
        if (!b.me && !b.fixed) { b.vx -= fx; b.vy -= fy; }
      });
      // center pull on me
      byId.me.vx += (cx - byId.me.x) * 0.1;
      byId.me.vy += (cy - byId.me.y) * 0.1;

      // apply
      NODES.forEach(n => {
        if (n.fixed) return;
        n.vx *= 0.82; n.vy *= 0.82;
        n.x += n.vx * 0.08;
        n.y += n.vy * 0.08;
        // bounds
        const pad = n.size + 4;
        if (n.x < pad) { n.x = pad; n.vx = 0; }
        if (n.x > W-pad) { n.x = W-pad; n.vx = 0; }
        if (n.y < pad) { n.y = pad; n.vy = 0; }
        if (n.y > H-pad) { n.y = H-pad; n.vy = 0; }
        n.el.setAttribute('transform', `translate(${n.x} ${n.y})`);
      });
      edgeEls.forEach(e => {
        e.el.setAttribute('x1', e.a.x); e.el.setAttribute('y1', e.a.y);
        e.el.setAttribute('x2', e.b.x); e.el.setAttribute('y2', e.b.y);
      });

      opts.raf = requestAnimationFrame(tick);
    }
    tick();

    return { stop: () => cancelAnimationFrame(opts.raf) };
  };
})();
