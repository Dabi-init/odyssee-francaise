// =============================================================================
// 👄 LE LABO DES SONS + 🐣 BOOTCAMP ZÉRO
// Sound Lab: the 18 French sounds English speakers find hard. Learn (mouth tip,
// English anchor, spellings, trap, examples) → Ear duel (look-alike word pairs,
// 10 rounds) → Mouth check (mic or self-check).
// Bootcamp: a Day-0 path of 8 micro-steps with Camille for total beginners.
// Data: window.SOUND_LAB_DATA = { sounds, pairs, bootcamp }
// =============================================================================
(function () {
  const D = window.SOUND_LAB_DATA || { sounds: [], pairs: [], bootcamp: [] };
  const PORTRAIT = "assets/tutor_camille.jpg";
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const jsq = (s) => esc(String(s || "").replace(/\\/g, "\\\\").replace(/'/g, "\\'"));
  const API = () => window.RPG_API || {};
  const say = (t, r) => { if (window.speakFrench && t) window.speakFrench(String(t).replace(/‿/g, " "), r || 1.0); };
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function rich(text) {
    const s = String(text || "");
    let out = "", last = 0;
    s.replace(/«\s*([^»]+?)\s*»/g, (m, fr, idx) => {
      out += esc(s.slice(last, idx));
      out += `<span class="fr-tap" onclick="event.stopPropagation();window.speakFrench('${jsq(fr)}',1.0)">«${esc(fr)}»</span>`;
      last = idx + m.length;
      return m;
    });
    return out + esc(s.slice(last));
  }
  const PRAISE = ["Bravo !", "Bien entendu !", "Parfait !", "Quelle oreille !", "Super !"];
  function save() { return API().save ? API().save() : {}; }
  function store(name) { const s = save(); if (!s[name] || typeof s[name] !== "object") s[name] = {}; return s[name]; }
  function lab() { const L = store("soundLab"); if (!L.sounds) L.sounds = {}; return L; }
  function sp(id) { const L = lab(); if (!L.sounds[id]) L.sounds[id] = { duels: 0, best: 0, acc: 0, mouth: 0 }; return L.sounds[id]; }
  const V = {
    mode: "lab",
    view: "hub",
    soundId: null,
    tab: "learn",
    duel: null,
    mouthIdx: 0,
    mirror: { recording: false, url: null, blob: null, mime: "", busy: false, feedback: "", recorder: null, stream: null, chunks: [], timer: null }
  };
  function resetMirror() {
    const m = V.mirror;
    if (m.timer) { clearTimeout(m.timer); m.timer = null; }
    try { if (m.recorder && m.recorder.state === "recording") m.recorder.stop(); } catch (e) {}
    try { if (m.stream) m.stream.getTracks().forEach(t => t.stop()); } catch (e) {}
    try { if (m.url) URL.revokeObjectURL(m.url); } catch (e) {}
    V.mirror = { recording: false, url: null, blob: null, mime: "", busy: false, feedback: "", recorder: null, stream: null, chunks: [], timer: null };
  }
  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onloadend = () => {
        const res = String(r.result || "");
        const idx = res.indexOf(",");
        resolve(idx >= 0 ? res.slice(idx + 1) : res);
      };
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
  }
  const rerender = () => { const c = document.getElementById("app-main"); if (!c) return; if (V.mode === "boot") window.renderBootcamp(c); else window.renderSoundLab(c); };
  window.SOUND_LAB_READY = !!(D.sounds && D.sounds.length);

  // ------------------------------------------------------------------ SOUND LAB
  function hubHtml() {
    const firstOpen = D.sounds.find(s => (sp(s.id).best || 0) < 8);
    return `
      <div class="sl-hero" style="background:linear-gradient(90deg,rgba(7,13,31,0.95),rgba(7,13,31,0.55)),url('assets/bg_soundlab.jpg') center/cover;">
        <img src="${PORTRAIT}" alt="">
        <div><div class="intro-tag">👄 LE LABO DES SONS</div><h2>Train your ear and your mouth</h2>
        <p>French has sounds English doesn't. For each one: how to make it with your mouth, an ear duel with look-alike words (like ${rich("«tu» / «tout»")}), and a real voice mirror check. About 3 minutes per sound.</p></div>
      </div>
      <div class="sl-grid">${D.sounds.map((s, i) => {
        const p = sp(s.id);
        const mastered = (p.best || 0) >= 8;
        const rec = firstOpen && firstOpen.id === s.id;
        return `<button class="sl-card ${mastered ? "done" : ""} ${rec ? "rec" : ""} ${s.accent_detox ? "detox" : ""}" onclick="window.slOpen('${jsq(s.id)}')">
          ${s.accent_detox ? `<div class="sl-rec" style="background:#38bdf8;color:#041422;">🎯 Accent Detox</div>` : rec ? `<div class="sl-rec">⭐ Recommended next</div>` : ""}
          <div class="sl-num">${i + 1}</div><div class="sl-title">${esc(s.title)}</div><div class="sl-ipa">${esc(s.ipa || "")}</div>
          <div class="sl-meta">${p.duels ? `🎧 best ${p.best}/10` : "🎧 new"} • 🎙️ ${p.mouth || 0} verified${mastered ? " • ✅" : ""}</div></button>`;
      }).join("")}</div>`;
  }
  function pairsFor(id) { const p = D.pairs.filter(x => x.sound === id); return p.length >= 3 ? p : D.pairs; }
  function soundHtml() {
    const s = D.sounds.find(x => x.id === V.soundId);
    if (!s) { V.view = "hub"; return `<div class="arena-box">${hubHtml()}</div>`; }
    const tabs = [["learn", "📖 Learn"], ["duel", "🎧 Ear duel"], ["mouth", "🎙️ Mouth check"]];
    let body = "";
    if (V.tab === "learn") {
      body = `
        <div class="sl-teacher"><img src="${PORTRAIT}" alt=""><div class="tb-body">
          <div class="intro-tag">HOW TO SAY IT</div><div>${rich(s.mouth || "")}</div>
          ${s.english_hint ? `<div class="sl-hint">🇬🇧 Closest English: ${rich(s.english_hint)}</div>` : ""}
          ${s.trap ? `<div class="tb-tip">⚠️ Typical mistake: ${rich(s.trap)}</div>` : ""}
          ${(s.spellings || []).length ? `<div class="sl-spell">✍️ Spelled: ${(s.spellings || []).map(x => `<span class="sl-chip">${esc(x)}</span>`).join(" ")}</div>` : ""}
        </div></div>
        <div class="sl-examples">${(s.examples || []).map(e => `<div class="tb-ex" onclick="window.speakFrench('${jsq(e.fr)}',1.0)"><div class="tb-ex-fr">🔊 ${esc(e.fr)}</div><div class="tb-ex-en">${esc(e.en || "")}</div>
          <button class="btn sl-slow" onclick="event.stopPropagation();window.speakFrench('${jsq(e.fr)}',0.6)">🐢 slow</button></div>`).join("")}</div>
        <div class="intro-actions"><button class="btn btn-gold intro-next" id="sl-next" onclick="window.slTab('duel')">🎧 Test my ear ➜</button></div>`;
    } else if (V.tab === "duel") body = duelHtml(s);
    else body = mouthHtml(s);
    return `
      <div class="arena-box">
        <div class="sl-head"><button class="btn" onclick="window.slHub()">⬅ All sounds</button>
          <div style="flex:1;"><div class="intro-tag">👄 SOUND ${D.sounds.indexOf(s) + 1} / ${D.sounds.length}</div><h3 class="tutor-title">${esc(s.title)} <span class="sl-ipa">${esc(s.ipa || "")}</span></h3></div>
          <button class="btn" onclick="window.openAskTeacher && window.openAskTeacher('How do I pronounce ${jsq(s.title)} correctly? Give me tips for an English speaker.', true)">🙋 Ask Camille</button></div>
        <div class="sl-tabs">${tabs.map(([k, l]) => `<button class="btn ${V.tab === k ? "btn-gold" : ""}" onclick="window.slTab('${k}')">${l}</button>`).join("")}</div>
        ${body}
      </div>`;
  }
  function newDuel(s) {
    const pool = shuffle(pairsFor(s.id));
    const rounds = [];
    for (let i = 0; i < 10; i++) rounds.push({ p: pool[i % pool.length], side: Math.random() < 0.5 ? "a" : "b" });
    return { soundId: s.id, rounds, i: 0, right: 0, combo: 0, answered: false, done: false, played: false };
  }
  function duelHtml(s) {
    if (!V.duel || V.duel.soundId !== s.id) V.duel = newDuel(s);
    const d = V.duel;
    if (d.done) {
      const p = sp(s.id);
      return `<div class="intro-card"><div class="intro-tag">🎧 EAR DUEL • DONE</div>
        <div class="intro-fr" style="cursor:default;">${d.right >= 9 ? "Oreille de natif !" : d.right >= 7 ? "Très bonne oreille !" : "On s'entraîne encore !"}</div>
        <div class="intro-stats"><div><b>${d.right} / 10</b><span>heard right</span></div><div><b>${p.best}</b><span>your best</span></div></div>
        <div class="intro-actions"><button class="btn" onclick="window.slDuelAgain()">↻ 10 more</button><button class="btn btn-gold intro-next" id="sl-next" onclick="window.slTab('mouth')">🎙️ Now say them ➜</button></div></div>`;
    }
    const r = d.rounds[d.i];
    const word = r.side === "a" ? r.p.a : r.p.b;
    return `<div class="intro-card" id="sl-card">
      <div class="intro-tag">🎧 ROUND ${d.i + 1} / 10 • WHICH ONE DID YOU HEAR? <span class="intro-combo ${d.combo >= 3 ? "hot" : ""}">🔥 x${d.combo}</span></div>
      <div class="intro-progress"><div style="width:${d.i * 10}%"></div></div>
      <div class="intro-actions" style="justify-content:center;"><button class="btn intro-listen" onclick="window.speakFrench('${jsq(word)}',1.0)">🔊 Play (R)</button><button class="btn" onclick="window.speakFrench('${jsq(word)}',0.6)">🐢 Slow</button></div>
      <div class="sl-pair">
        ${["a", "b"].map((k, n) => `<button class="sl-opt" id="sl-opt-${k}" ${d.answered ? "disabled" : ""} onclick="window.slAnswer('${k}')"><span class="intro-key">${n === 0 ? "A" : "B"}</span><b>${esc(r.p[k])}</b><span>${esc(r.p[k + "_en"] || "")}</span></button>`).join("")}
      </div>
      <div id="sl-fb"></div></div>`;
  }
  function mouthHtml(s) {
    const ex = s.examples || [];
    const i = Math.min(V.mouthIdx, ex.length);
    if (!ex.length) return `<p>No examples for this sound.</p>`;
    if (i >= ex.length) {
      return `<div class="intro-card"><div class="intro-tag">🎙️ MOUTH CHECK • DONE</div><div class="intro-fr" style="cursor:default;">Belle prononciation !</div>
        <p style="color:var(--text-muted);">Come back tomorrow: sounds improve with short daily practice.</p>
        <div class="intro-actions"><button class="btn" onclick="window.slMouthRestart()">↻ Again</button><button class="btn btn-gold intro-next" id="sl-next" onclick="window.slNextSound()">Next sound ➜</button></div></div>`;
    }
    const e = ex[i];
    const m = V.mirror;
    const hasAI = typeof window.ODY_CALL_AI === "function";
    const mirrorHtml = m.url ? `
      <div class="sl-mirror-bar" id="sl-mirror-bar">
        <span class="sl-mirror-tag">🎧 Voice Mirror Ready</span>
        <button class="btn btn-gold" id="sl-play-self" onclick="window.slPlayMirror()">▶ Hear Yourself</button>
        <button class="btn" onclick="window.speakFrench('${jsq(e.fr)}',1.0)">▶ Native Model</button>
        <button class="btn" onclick="window.speakFrench('${jsq(e.fr)}',0.6)">🐢 Slow</button>
        ${hasAI ? `<button class="btn btn-primary" id="sl-ai-coach" ${m.busy ? "disabled" : ""} onclick="window.slAiCoach()">${m.busy ? "⏳ Listening…" : "✨ AI Accent Coach"}</button>` : ""}
      </div>` : "";
    return `<div class="intro-card" id="sl-card">
      <div class="intro-tag">🎙️ VOICE MIRROR &amp; MOUTH CHECK • ${i + 1} / ${ex.length}</div>
      <div class="intro-fr" lang="fr" translate="no" onclick="window.speakFrench('${jsq(e.fr)}',1.0)">🔊 ${esc(e.fr)}</div><div class="intro-en">${esc(e.en || "")}</div>
      ${s.mouth ? `<div class="sl-hint" style="margin:0.4rem 0 0.7rem;font-size:0.88rem;">💡 ${rich(s.mouth)}</div>` : ""}
      <div class="intro-actions">
        <button class="btn" onclick="window.speakFrench('${jsq(e.fr)}',1.0)">🔊 Native Model</button>
        <button class="btn" onclick="window.speakFrench('${jsq(e.fr)}',0.6)">🐢 Slow</button>
        <button class="btn btn-primary" id="sl-mic" onclick="window.slMic()">🎙️ Tap &amp; Speak</button>
        <button class="btn ${m.recording ? "btn-danger" : ""}" id="sl-rec-btn" onclick="window.slToggleMirror()">${m.recording ? "⏹️ Stop Recording" : "⏺️ Record Voice Mirror"}</button>
        <button class="btn" id="sl-quiet-skip" style="opacity:0.72;" onclick="window.slMouthSkip()" title="Move to next word without claiming verified speaking credit">🔇 Skip (Voice Pending)</button>
      </div>
      ${mirrorHtml}
      <div id="sl-fb">${m.feedback || ""}</div></div>`;
  }
  window.renderSoundLab = function (container) {
    V.mode = "lab";
    if (!D.sounds.length) { container.innerHTML = `<div class="arena-box"><p>Sound Lab content is missing.</p></div>`; return; }
    container.innerHTML = V.view === "hub" ? `<div class="arena-box">${hubHtml()}</div>` : soundHtml();
    if (V.view === "sound" && V.tab === "duel" && V.duel && !V.duel.done && !V.duel.answered && !V.duel.played) {
      V.duel.played = true;
      const r = V.duel.rounds[V.duel.i];
      setTimeout(() => say(r.side === "a" ? r.p.a : r.p.b, 1.0), 150);
    }
  };
  window.slHub = function () { resetMirror(); V.view = "hub"; V.duel = null; rerender(); };
  window.slOpen = function (id) { resetMirror(); V.view = "sound"; V.soundId = id; V.tab = "learn"; V.duel = null; V.mouthIdx = 0; rerender(); const s = D.sounds.find(x => x.id === id); if (s && s.examples && s.examples[0]) say(s.examples[0].fr, 1.0); };
  window.slTab = function (t) { resetMirror(); V.tab = t; if (t === "duel") V.duel = null; if (t === "mouth") V.mouthIdx = 0; rerender(); };
  window.slDuelAgain = function () { V.duel = null; rerender(); };
  window.slAnswer = function (k) {
    const d = V.duel;
    if (!d || d.answered || d.done) return;
    d.answered = true;
    const r = d.rounds[d.i];
    const ok = k === r.side;
    const el = document.getElementById(`sl-opt-${k}`);
    const right = document.getElementById(`sl-opt-${r.side}`);
    document.querySelectorAll(".sl-opt").forEach(b => (b.disabled = true));
    if (right) right.classList.add("correct");
    if (!ok && el) el.classList.add("wrong");
    const rect = el ? el.getBoundingClientRect() : null;
    if (ok) {
      d.right += 1; d.combo += 1;
      if (API().addXP) API().addXP(8 + Math.min(8, d.combo), 2);
      if (window.RPG_SFX) window.RPG_SFX.matchCombo(Math.min(8, d.combo));
      if (window.RPG_VFX && rect) { window.RPG_VFX.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, "#10b981", 14); window.RPG_VFX.floatText(PRAISE[d.right % PRAISE.length], "#6ee7b7", rect.left + rect.width / 2, rect.top - 10); }
      const st = save(); if (st.stats) st.stats.earHits = (st.stats.earHits || 0) + 1;
    } else {
      d.combo = 0;
      if (window.RPG_SFX) window.RPG_SFX.damageHit();
      const c = document.getElementById("sl-card"); if (c) { c.classList.remove("shake"); void c.offsetWidth; c.classList.add("shake"); }
    }
    const fb = document.getElementById("sl-fb");
    if (fb) fb.innerHTML = `<div class="feedback-banner ${ok ? "ok" : "warn"}">${ok ? "✅" : "👂"} It was <b>${esc(r.p[r.side])}</b> (${esc(r.p[r.side + "_en"] || "")}). Compare:
      <button class="btn" onclick="window.speakFrench('${jsq(r.p.a)}',0.8)">🔊 ${esc(r.p.a)}</button> <button class="btn" onclick="window.speakFrench('${jsq(r.p.b)}',0.8)">🔊 ${esc(r.p.b)}</button>
      <div><button class="btn btn-gold" id="sl-next" style="margin-top:0.4rem;" onclick="window.slNext()">Next ➜</button></div></div>`;
    const nb = document.getElementById("sl-next"); if (nb) nb.focus();
  };
  window.slNext = function () {
    const d = V.duel;
    if (!d) return;
    d.i += 1; d.answered = false; d.played = false;
    if (d.i >= d.rounds.length) {
      d.done = true;
      const p = sp(d.soundId);
      p.duels += 1; p.best = Math.max(p.best || 0, d.right); p.acc = Math.round(((p.acc || 0) * (p.duels - 1) + d.right * 10) / p.duels);
      if (API().addXP) API().addXP(25 + d.right * 3, 8);
      if (API().persistSave) API().persistSave();
      if (window.RPG_SFX) window.RPG_SFX.victoryFanfare();
    }
    rerender();
  };
  function mouthPass(text) {
    sp(V.soundId).mouth = (sp(V.soundId).mouth || 0) + 1;
    const st = save(); if (st.stats) st.stats.phrasesSpoken = (st.stats.phrasesSpoken || 0) + 1;
    if (API().addXP) API().addXP(8, 2);
    if (API().persistSave) API().persistSave();
    const html = `<div class="feedback-banner ok">✅ ${esc(text)} <button class="btn btn-gold" id="sl-next" onclick="window.slMouthNext()">Next ➜</button></div>`;
    V.mirror.feedback = html;
    const fb = document.getElementById("sl-fb");
    if (fb) fb.innerHTML = html;
    const nb = document.getElementById("sl-next"); if (nb) nb.focus();
  }
  window.slMouthNext = function () { resetMirror(); V.mouthIdx += 1; rerender(); };
  window.slMouthSkip = function () { resetMirror(); V.mouthIdx += 1; rerender(); };
  window.slMouthRestart = function () { resetMirror(); V.mouthIdx = 0; rerender(); };
  window.slNextSound = function () { resetMirror(); const i = D.sounds.findIndex(x => x.id === V.soundId); const n = D.sounds[(i + 1) % D.sounds.length]; window.slOpen(n.id); };
  window.slPlayMirror = function () {
    if (!V.mirror.url) return;
    try {
      const a = new Audio(V.mirror.url);
      a.play().catch(() => {});
    } catch (e) {}
  };
  window.slToggleMirror = async function () {
    const m = V.mirror;
    const fb = document.getElementById("sl-fb");
    if (m.recording && m.recorder) {
      if (m.timer) { clearTimeout(m.timer); m.timer = null; }
      try { m.recorder.stop(); } catch (e) {}
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof window.MediaRecorder === "undefined") {
      const msg = `<div class="feedback-banner warn">Audio recording is unavailable in this browser. Use 🎙️ Tap &amp; Speak or try Chrome/Edge with mic permission.</div>`;
      m.feedback = msg;
      if (fb) fb.innerHTML = msg;
      return;
    }
    try {
      resetMirror();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : (MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "");
      const opts = mime ? { mimeType: mime, audioBitsPerSecond: 24000 } : {};
      const rec = new MediaRecorder(stream, opts);
      V.mirror.stream = stream;
      V.mirror.recorder = rec;
      V.mirror.chunks = [];
      V.mirror.mime = rec.mimeType || mime || "audio/webm";
      V.mirror.recording = true;
      V.mirror.feedback = `<div class="feedback-banner">⏺️ Recording… say the phrase clearly, then tap <b>Stop Recording</b>.</div>`;
      rec.ondataavailable = (ev) => { if (ev.data && ev.data.size > 0) V.mirror.chunks.push(ev.data); };
      rec.onstop = () => {
        V.mirror.recording = false;
        if (V.mirror.timer) { clearTimeout(V.mirror.timer); V.mirror.timer = null; }
        try { if (V.mirror.stream) V.mirror.stream.getTracks().forEach(t => t.stop()); } catch (e) {}
        V.mirror.stream = null;
        const blob = new Blob(V.mirror.chunks, { type: V.mirror.mime || "audio/webm" });
        V.mirror.blob = blob;
        if (blob.size > 0) {
          V.mirror.url = URL.createObjectURL(blob);
          V.mirror.feedback = `<div class="feedback-banner ok">🎧 Recorded! Tap <b>▶ Hear Yourself</b> then <b>▶ Native Model</b> to compare, or run <b>✨ AI Accent Coach</b>.</div>`;
        } else {
          V.mirror.feedback = `<div class="feedback-banner warn">No audio captured — check your microphone and try again.</div>`;
        }
        rerender();
      };
      rec.start();
      V.mirror.timer = setTimeout(() => {
        if (V.mirror.recording && V.mirror.recorder) {
          try { V.mirror.recorder.stop(); } catch (e) {}
        }
      }, 12000);
      rerender();
    } catch (err) {
      resetMirror();
      const msg = `<div class="feedback-banner warn">Microphone permission denied or unavailable. Enable mic access in browser settings to use the Voice Mirror.</div>`;
      V.mirror.feedback = msg;
      if (fb) fb.innerHTML = msg;
    }
  };
  window.slAiCoach = async function () {
    const s = D.sounds.find(x => x.id === V.soundId);
    const e = s && s.examples && s.examples[V.mouthIdx];
    const m = V.mirror;
    if (!e || !m.blob || m.busy || typeof window.ODY_CALL_AI !== "function") return;
    m.busy = true;
    m.feedback = `<div class="feedback-banner">✨ Camille is listening to your recording for pronunciation &amp; accent feedback…</div>`;
    rerender();
    try {
      const audioBase64 = await blobToBase64(m.blob);
      const res = await window.ODY_CALL_AI("/api/grade", {
        kind: "speaking",
        level: "A1",
        prompt: `Pronounce the French target sound "${s.title}" in the phrase "${e.fr}" (${e.en || ""}). Give warm, concrete, plain-English mouth/tongue coaching (watch for retroflex vs dental t/d/p/k, uvular R, v/w, pure vowels, clean nasals).`,
        text: e.fr,
        targetFr: e.fr,
        audioBase64,
        audioMime: m.mime || "audio/webm"
      });
      m.busy = false;
      const g = res && (res.data || res);
      if (g && typeof g.score === "number") {
        const sc = Math.round(g.score);
        const note = g.verdict || g.feedback || g.strength || "Nice effort — compare your voice mirror to the native clip!";
        if (sc >= 65) {
          mouthPass(`AI Coach (${sc}/100): ${note}`);
          return;
        }
        m.feedback = `<div class="feedback-banner warn">🎙️ AI Coach (${sc}/100): ${esc(note)} — Listen to 🐢 Slow and try one more take!</div>`;
      } else {
        m.feedback = `<div class="feedback-banner warn">AI Coach is offline right now. Compare <b>▶ Hear Yourself</b> vs <b>▶ Native Model</b>, or tap <b>🎙️ Tap &amp; Speak</b>!</div>`;
      }
      rerender();
    } catch (err) {
      m.busy = false;
      m.feedback = `<div class="feedback-banner warn">Couldn't reach AI Coach (offline or no key set in ☰ Settings). Compare <b>▶ Hear Yourself</b> vs <b>▶ Native Model</b>!</div>`;
      rerender();
    }
  };
  window.slMic = function () {
    const s = D.sounds.find(x => x.id === V.soundId);
    const e = s && s.examples[V.mouthIdx];
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const fb = document.getElementById("sl-fb");
    if (!e) return;
    if (!SR) {
      if (fb) fb.innerHTML = `<div class="feedback-banner warn">Live speech recognition isn't available here. Use <b>⏺️ Record Voice Mirror</b> to hear yourself vs the native model!</div>`;
      return;
    }
    try {
      const rec = new SR(); rec.lang = "fr-FR"; rec.maxAlternatives = 4;
      const b = document.getElementById("sl-mic"); if (b) b.textContent = "🎙️ Listening…";
      rec.onresult = (ev) => {
        const alts = Array.from(ev.results[0] || []).map(a => a.transcript);
        const sim = (x) => (window.RPG_PHRASE_SIMILARITY ? window.RPG_PHRASE_SIMILARITY(x, e.fr) : 0);
        const best = alts.sort((a, c) => sim(c) - sim(a))[0] || "";
        if (sim(best) >= 0.7) mouthPass(`Verified! The mic heard « ${best} » — clear pronunciation!`);
        else if (fb) fb.innerHTML = `<div class="feedback-banner warn">I heard « ${esc(best)} ». Listen to 🐢 Slow, record a <b>Voice Mirror</b> to hear yourself, and try again!</div>`;
      };
      rec.onerror = () => { if (fb) fb.innerHTML = `<div class="feedback-banner warn">Couldn't hear you clearly. Try <b>🎙️ Tap &amp; Speak</b> again or use <b>⏺️ Record Voice Mirror</b>.</div>`; };
      rec.onend = () => { const bb = document.getElementById("sl-mic"); if (bb) bb.textContent = "🎙️ Tap & Speak"; };
      rec.start();
    } catch (er) { if (fb) fb.innerHTML = `<div class="feedback-banner warn">Microphone busy or blocked. Check browser mic permission and try again.</div>`; }
  };

  // ------------------------------------------------------------------ BOOTCAMP ZÉRO
  const B = { idx: null, phase: "teach", t: 0, quiz: null, q: 0, right: 0, answered: false, said: {} };
  function boot() { const b = store("bootcamp"); if (!b.done) b.done = {}; return b; }
  function pathHtml() {
    const b = boot();
    const steps = D.bootcamp || [];
    const doneCount = steps.filter(s => b.done[s.id]).length;
    return `
      <div class="sl-hero" style="background:linear-gradient(90deg,rgba(7,13,31,0.95),rgba(7,13,31,0.5)),url('assets/bg_bootcamp.jpg') center/cover;">
        <img src="${PORTRAIT}" alt="">
        <div><div class="intro-tag">🐣 BOOTCAMP ZÉRO • DAY 0</div><h2>Your first French, with me</h2>
        <p>Never studied French? Perfect. 8 tiny steps of about 2 minutes each: the sound of French, polite words, survival phrases, numbers, and how to learn fast. <b>${doneCount}/${steps.length} done.</b></p></div>
      </div>
      <div class="bc-path">${steps.map((s, i) => {
        const done = !!b.done[s.id];
        const open = i === 0 || !!b.done[steps[i - 1].id] || done;
        const cur = open && !done;
        return `<button class="bc-node ${done ? "done" : ""} ${cur ? "cur" : ""} ${open ? "" : "locked"}" ${open ? `onclick="window.bcStart(${i})"` : "disabled"}>
          <span class="bc-dot">${done ? "✓" : open ? i + 1 : "🔒"}</span><span><b>${esc(s.title)}</b><small>${esc(s.why || "")}</small></span></button>`;
      }).join("")}</div>
      ${doneCount >= steps.length && steps.length ? `<div class="intro-card bc-final"><div class="intro-tag">🎉 BOOTCAMP COMPLETE</div><div class="intro-fr" style="cursor:default;">Félicitations, tu es prêt !</div>
        <div class="intro-actions"><button class="btn btn-gold intro-next" id="bc-next" onclick="window.bcFinish()">▶ Start World 1 (Greetings)</button><button class="btn" onclick="window.navigateScene('soundlab')">👄 Sound Lab</button></div></div>` :
        `<div class="intro-actions" style="justify-content:center;"><button class="btn" onclick="window.bcSkip()">I already know some French: skip the bootcamp ➜</button></div>`}`;
  }
  function stepHtml() {
    const s = D.bootcamp[B.idx];
    const teach = s.teach || [];
    const head = `<div class="sl-head"><button class="btn" onclick="window.bcPath()">⬅ Path</button><div style="flex:1;"><div class="intro-tag">🐣 STEP ${B.idx + 1} / ${D.bootcamp.length}</div><h3 class="tutor-title">${esc(s.title)}</h3></div></div>`;
    let body = "";
    if (B.phase === "teach") {
      const shown = teach.slice(0, B.t + 1);
      body = `<div class="tutor-chat">
        <div class="tb teacher"><img class="tb-av" src="${PORTRAIT}" alt=""><div class="tb-body">${rich(s.why || "")}</div></div>
        ${shown.map(x => `<div class="tb teacher"><img class="tb-av" src="${PORTRAIT}" alt=""><div class="tb-body">${rich(x)}</div></div>`).join("")}
      </div><div class="tutor-controls"><button class="btn btn-gold intro-next" id="bc-next" onclick="window.bcTeachNext()">${B.t + 1 < teach.length ? "Continue ➜" : "Hear the phrases ➜"}</button></div>`;
    } else if (B.phase === "phrases") {
      body = `<p style="color:var(--text-muted);">Tap each phrase, listen, then say it out loud and tap 🗣️.</p>
        <div class="bc-phrases">${(s.phrases || []).map((p, i) => `<div class="tb-ex ${B.said[i] ? "said" : ""}" onclick="window.speakFrench('${jsq(p.fr)}',1.0)"><div class="tb-ex-fr">🔊 ${esc(p.fr)}</div><div class="tb-ex-en">${esc(p.en)}</div>
          <div class="tb-mini"><button class="btn" onclick="event.stopPropagation();window.speakFrench('${jsq(p.fr)}',0.6)">🐢</button><button class="btn ${B.said[i] ? "btn-emerald" : ""}" onclick="event.stopPropagation();window.bcSaid(${i})">${B.said[i] ? "✅ Said" : "🗣️ I said it"}</button></div></div>`).join("")}</div>
        <div class="tutor-controls"><button class="btn btn-gold intro-next" id="bc-next" onclick="window.bcQuiz()">Quick check ➜</button></div>`;
    } else if (B.phase === "quiz") {
      const q = B.quiz[B.q];
      body = `<div class="intro-card" id="sl-card"><div class="intro-tag">⚡ QUICK CHECK ${B.q + 1} / ${B.quiz.length}</div>
        <div class="gym-prompt"><span class="gym-big">${q.prompt}</span></div>
        <div class="intro-options">${q.opts.map((o, k) => `<button class="btn intro-opt bc-opt" id="bc-opt-${k}" ${B.answered ? "disabled" : ""} onclick="window.bcAnswer(${k})"><span class="intro-key">${k + 1}</span> ${esc(o.text)}</button>`).join("")}</div>
        <div id="sl-fb"></div></div>`;
    } else {
      body = `<div class="intro-card"><div class="intro-tag">✅ STEP DONE</div><div class="intro-fr" style="cursor:default;">${B.right >= B.quiz.length - 1 ? "Magnifique !" : "C'est un bon début !"}</div>
        <div class="intro-stats"><div><b>${B.right} / ${B.quiz.length}</b><span>right</span></div></div>
        <div class="intro-actions"><button class="btn btn-gold intro-next" id="bc-next" onclick="${B.idx + 1 < D.bootcamp.length ? `window.bcStart(${B.idx + 1})` : "window.bcPath()"}">${B.idx + 1 < D.bootcamp.length ? "Next step ➜" : "🎉 See my path"}</button></div></div>`;
    }
    return `<div class="arena-box tutor-box" style="background:linear-gradient(180deg,rgba(7,13,31,0.88),rgba(7,13,31,0.97)),url('assets/bg_bootcamp.jpg') center/cover;">${head}${body}</div>`;
  }
  function buildQuiz(s) {
    const ph = (s.phrases || []).filter(p => p.fr && p.en);
    const all = (D.bootcamp || []).flatMap(x => x.phrases || []);
    return shuffle(ph).slice(0, 4).map((p, i) => {
      const toEn = i % 2 === 0;
      const field = toEn ? "en" : "fr";
      const wrong = [];
      for (const x of shuffle(all)) { if (x[field] !== p[field] && x.fr !== p.fr && !wrong.some(w => w[field] === x[field])) wrong.push(x); if (wrong.length >= 2) break; }
      return { p, toEn, prompt: toEn ? `What does <span class="fr-tap" onclick="window.speakFrench('${jsq(p.fr)}',1.0)">«${esc(p.fr)}»</span> mean?` : `How do you say: <b>${esc(p.en)}</b>?`, opts: shuffle([{ text: p[field], ok: true }, ...wrong.map(w => ({ text: w[field], ok: false }))]) };
    });
  }
  window.renderBootcamp = function (container) {
    V.mode = "boot";
    if (!(D.bootcamp || []).length) { container.innerHTML = `<div class="arena-box"><p>Bootcamp content is missing.</p></div>`; return; }
    container.innerHTML = B.idx == null ? `<div class="arena-box">${pathHtml()}</div>` : stepHtml();
    const nb = document.getElementById("bc-next"); if (nb) nb.focus({ preventScroll: true });
  };
  window.bcPath = function () { B.idx = null; rerender(); };
  window.bcStart = function (i) { Object.assign(B, { idx: i, phase: "teach", t: 0, quiz: null, q: 0, right: 0, answered: false, said: {} }); rerender(); };
  window.bcTeachNext = function () { const s = D.bootcamp[B.idx]; if (B.t + 1 < (s.teach || []).length) B.t += 1; else { B.phase = "phrases"; const p = (s.phrases || [])[0]; if (p) say(p.fr, 1.0); } rerender(); };
  window.bcSaid = function (i) { if (!B.said[i]) { B.said[i] = true; const st = save(); if (st.stats) st.stats.phrasesSpoken = (st.stats.phrasesSpoken || 0) + 1; if (API().addXP) API().addXP(4, 1); } rerender(); };
  window.bcQuiz = function () { B.quiz = buildQuiz(D.bootcamp[B.idx]); B.phase = "quiz"; B.q = 0; B.right = 0; B.answered = false; rerender(); };
  window.bcAnswer = function (k) {
    if (B.answered) return;
    const q = B.quiz[B.q];
    B.answered = true;
    const ok = !!q.opts[k].ok;
    document.querySelectorAll(".bc-opt").forEach((b, i) => { b.disabled = true; if (q.opts[i].ok) b.classList.add("correct"); });
    if (!ok) { const el = document.getElementById(`bc-opt-${k}`); if (el) el.classList.add("wrong"); }
    if (ok) { B.right += 1; if (API().addXP) API().addXP(8, 2); if (window.RPG_SFX) window.RPG_SFX.matchCombo(B.right); } else if (window.RPG_SFX) window.RPG_SFX.damageHit();
    say(q.p.fr, 1.0);
    const fb = document.getElementById("sl-fb");
    if (fb) fb.innerHTML = `<div class="feedback-banner ${ok ? "ok" : "warn"}">${ok ? "✅ Exactly!" : "💬 Almost!"} «${esc(q.p.fr)}» = ${esc(q.p.en)} <div><button class="btn btn-gold" id="bc-next" style="margin-top:0.4rem;" onclick="window.bcQNext()">Next ➜</button></div></div>`;
    const nb = document.getElementById("bc-next"); if (nb) nb.focus();
  };
  window.bcQNext = function () {
    B.q += 1; B.answered = false;
    if (B.q >= B.quiz.length) {
      B.phase = "done";
      const b = boot(); const s = D.bootcamp[B.idx];
      const first = !b.done[s.id];
      b.done[s.id] = true;
      if ((D.bootcamp || []).every(x => b.done[x.id])) b.completed = true;
      if (first && API().addXP) API().addXP(40, 10);
      if (API().persistSave) API().persistSave();
      if (window.RPG_SFX) window.RPG_SFX.victoryFanfare();
      if (window.RPG_VFX) window.RPG_VFX.burst(window.innerWidth / 2, window.innerHeight * 0.4, "#fde047", 30);
    }
    rerender();
  };
  window.bcSkip = function () { const s = save(); s.bootcampSkipped = true; if (API().persistSave) API().persistSave(); if (window.continueJourney) window.continueJourney(); };
  window.bcFinish = function () { const b = boot(); b.completed = true; if (API().persistSave) API().persistSave(); if (window.launchStageById) window.launchStageById("1-1", true); };

  window.RPG_SOUNDLAB_STATE = function () {
    const d = V.duel;
    return { view: V.view, soundId: V.soundId, tab: V.tab, round: d ? d.i : null, answerSide: d && !d.done ? d.rounds[d.i].side : null, right: d ? d.right : 0, done: d ? d.done : false, mouthIdx: V.mouthIdx };
  };
  window.RPG_BOOTCAMP_STATE = function () {
    const b = boot();
    const q = B.quiz && B.quiz[B.q];
    return { stepIdx: B.idx, phase: B.phase, quizAnswerIdx: q ? q.opts.findIndex(o => o.ok) : -1, done: Object.keys(b.done || {}), completed: !!b.completed };
  };
  window.RPG_SOUNDLAB_BACK = function () {
    if (V.view === "sound" && typeof window.slHub === "function") {
      window.slHub();
      return true;
    }
    return false;
  };
  window.addEventListener("keydown", (e) => {
    const tag = (e.target && e.target.tagName) || "";
    if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
    const dKey = /^[1-6]$/.test(e.key) ? +e.key : (/^(?:Digit|Numpad)([1-6])$/.test(e.code || "") ? +RegExp.$1 : 0);
    if (document.getElementById("sl-opt-a") && V.duel && !V.duel.answered) {
      if (e.key === "a" || e.key === "A" || e.code === "KeyA" || dKey === 1) { e.preventDefault(); window.slAnswer("a"); }
      else if (e.key === "b" || e.key === "B" || e.code === "KeyB" || dKey === 2) { e.preventDefault(); window.slAnswer("b"); }
      else if (e.key === "r" || e.key === "R") { const r = V.duel.rounds[V.duel.i]; say(r.side === "a" ? r.p.a : r.p.b, 1.0); }
    } else if (dKey >= 1 && dKey <= 3 && document.getElementById(`bc-opt-${dKey - 1}`) && !B.answered) { e.preventDefault(); window.bcAnswer(dKey - 1); }
    else if (e.key === "Enter") { const nb = document.getElementById("sl-next") || document.getElementById("bc-next"); if (nb && document.activeElement !== nb) { e.preventDefault(); nb.click(); } }
  });
})();
