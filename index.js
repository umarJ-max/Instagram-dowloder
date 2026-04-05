<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Instagram Downloader</title>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;800&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      min-height: 100vh;
      background: #faf7f2;
      font-family: 'Inter', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem 1.25rem 4rem;
    }

    /* big warm blob behind everything */
    body::before {
      content: '';
      position: fixed;
      top: -10%;
      right: -15%;
      width: 55vw;
      height: 55vw;
      border-radius: 50%;
      background: radial-gradient(circle, #fcd5e0 0%, #fce8d5 45%, transparent 70%);
      pointer-events: none;
      z-index: 0;
    }

    .page { position: relative; z-index: 1; width: 100%; max-width: 480px; }

    /* ── ICON ── */
    .ig-icon {
      width: 52px; height: 52px;
      border-radius: 14px;
      background: linear-gradient(135deg, #f9ce34, #ee2a7b, #6228d7);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 1.5rem;
      box-shadow: 0 8px 24px rgba(238,42,123,0.25);
    }

    .ig-icon svg { width: 26px; height: 26px; fill: none; stroke: #fff; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }

    /* ── HEADING ── */
    h1 {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: clamp(2rem, 7vw, 2.8rem);
      font-weight: 800;
      color: #1a1a1a;
      line-height: 1.1;
      letter-spacing: -0.03em;
      margin-bottom: 0.4rem;
    }

    .sub {
      font-size: 0.85rem;
      color: #999;
      margin-bottom: 2.2rem;
      font-weight: 400;
    }

    /* ── INPUT ── */
    .field {
      position: relative;
      margin-bottom: 0.75rem;
    }

    .field input {
      width: 100%;
      background: #fff;
      border: 1.5px solid #e8e3db;
      border-radius: 14px;
      font-family: 'Inter', sans-serif;
      font-size: 0.88rem;
      color: #1a1a1a;
      padding: 1rem 1.2rem;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      padding-right: 110px;
    }

    .field input::placeholder { color: #bbb; }

    .field input:focus {
      border-color: #ee2a7b;
      box-shadow: 0 0 0 4px rgba(238,42,123,0.08);
    }

    .field .go {
      position: absolute;
      right: 6px; top: 50%;
      transform: translateY(-50%);
      background: linear-gradient(135deg, #ee2a7b, #6228d7);
      border: none;
      border-radius: 10px;
      color: #fff;
      font-family: 'Bricolage Grotesque', sans-serif;
      font-weight: 600;
      font-size: 0.82rem;
      padding: 0.55rem 1.1rem;
      cursor: pointer;
      transition: opacity 0.15s, transform 0.1s;
      white-space: nowrap;
    }

    .field .go:hover:not(:disabled) { opacity: 0.88; transform: translateY(-50%) scale(1.02); }
    .field .go:disabled { opacity: 0.4; cursor: not-allowed; transform: translateY(-50%); }

    /* ── STATUS PILL ── */
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.75rem;
      font-weight: 500;
      padding: 0.3rem 0.75rem;
      border-radius: 99px;
      margin-bottom: 1.5rem;
      opacity: 0;
      transition: opacity 0.25s;
    }

    .pill.show { opacity: 1; }
    .pill.loading { background: #fff3cd; color: #856404; }
    .pill.ok      { background: #d1fae5; color: #065f46; }
    .pill.err     { background: #fee2e2; color: #991b1b; }

    .pill .spin {
      width: 10px; height: 10px;
      border: 1.5px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      flex-shrink: 0;
    }

    /* ── RESULTS ── */
    .results { display: flex; flex-direction: column; gap: 0.6rem; }

    .dl-card {
      background: #fff;
      border: 1.5px solid #f0ece5;
      border-radius: 14px;
      padding: 1rem 1.2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      animation: pop 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
    }

    .dl-card .label {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-weight: 600;
      font-size: 0.85rem;
      color: #1a1a1a;
    }

    .dl-card .hint {
      font-size: 0.72rem;
      color: #bbb;
      margin-top: 2px;
    }

    .dl-card a {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: #f5f0eb;
      border: none;
      border-radius: 8px;
      color: #1a1a1a;
      font-size: 0.78rem;
      font-weight: 500;
      padding: 0.5rem 0.9rem;
      text-decoration: none;
      white-space: nowrap;
      transition: background 0.15s;
      flex-shrink: 0;
    }

    .dl-card a:hover { background: #ede7de; }

    /* ── FOOTER ── */
    footer {
      position: fixed;
      bottom: 1rem; left: 0; right: 0;
      text-align: center;
      font-size: 0.65rem;
      color: #ccc;
      letter-spacing: 0.04em;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pop {
      from { opacity: 0; transform: scale(0.94) translateY(6px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }

    @media (max-width: 380px) {
      .field input { padding-right: 1.2rem; }
      .field .go { position: static; transform: none; width: 100%; margin-top: 0.5rem; padding: 0.75rem; border-radius: 10px; }
      .field .go:hover:not(:disabled) { transform: none; }
    }
  </style>
</head>
<body>
<div class="page">

  <div class="ig-icon">
    <svg viewBox="0 0 24 24">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4.5"/>
      <circle cx="17.5" cy="6.5" r="1" fill="#fff" stroke="none"/>
    </svg>
  </div>

  <h1>Instagram<br>Downloader</h1>
  <p class="sub">Reels, posts & videos — paste and go</p>

  <div class="field">
    <input type="url" id="urlInput" placeholder="https://www.instagram.com/reel/…" autocomplete="off" spellcheck="false" />
    <button class="go" id="fetchBtn">Download</button>
  </div>

  <div class="pill" id="pill">
    <span id="pillIcon"></span>
    <span id="pillTxt"></span>
  </div>

  <div class="results" id="results"></div>

</div>

<footer>built by Umar J</footer>

<script>
  const inp  = document.getElementById('urlInput');
  const btn  = document.getElementById('fetchBtn');
  const pill = document.getElementById('pill');
  const pico = document.getElementById('pillIcon');
  const ptxt = document.getElementById('pillTxt');
  const res  = document.getElementById('results');

  function setPill(cls, icon, msg) {
    pill.className = 'pill show ' + cls;
    pico.innerHTML = icon;
    ptxt.textContent = msg;
  }

  function addCard(item, i) {
    const c = document.createElement('div');
    c.className = 'dl-card';
    c.style.animationDelay = (i * 0.08) + 's';
    c.innerHTML = `
      <div>
        <div class="label">${item.quality || 'Video'}</div>
        <div class="hint">tap to open in browser</div>
      </div>
      <a href="${item.url}" target="_blank" rel="noopener">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6.5 1.5v8M3 7l3.5 3.5L10 7"/><line x1="1" y1="12" x2="12" y2="12"/>
        </svg>
        Open
      </a>`;
    res.appendChild(c);
  }

  async function run() {
    const url = inp.value.trim();
    if (!url) { setPill('err', '✕', 'Paste a link first'); return; }
    if (!url.includes('instagram.com')) { setPill('err', '✕', 'Not an Instagram URL'); return; }

    res.innerHTML = '';
    btn.disabled = true;
    setPill('loading', '<span class="spin"></span>', 'Fetching…');

    try {
      const r = await fetch(`/api/igdl?url=${encodeURIComponent(url)}`);
      const d = await r.json();
      if (r.ok && d.success && d.data?.length) {
        setPill('ok', '✓', `${d.data.length} download link${d.data.length > 1 ? 's' : ''} ready`);
        d.data.forEach((item, i) => addCard(item, i));
      } else {
        setPill('err', '✕', d.error || 'No video found — try another link');
      }
    } catch {
      setPill('err', '✕', 'Network error — check your connection');
    } finally {
      btn.disabled = false;
    }
  }

  btn.addEventListener('click', run);
  inp.addEventListener('keydown', e => e.key === 'Enter' && run());
</script>
</body>
</html>
