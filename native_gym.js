// =============================================================================
// LA SALLE DU NATIF (Native Gym): four short arcade modes that train what
// textbooks miss. Each session takes 2–4 minutes.
//   🎧 Vitesse Réelle: decode French as it is really spoken (j'sais pas, y a, chuis…)
//   🧠 Pense en français: French definitions only, no English (think in French)
//   🎭 Scènes de vie: real-life conversations, so you pick what a native would say
//   🏛️ Culture G: what every French person knows (songs, films, history, codes)
// Data: window.NATIVE_GYM_DATA = { spoken, definitions, scenes, culture }
// =============================================================================
(function () {
  const G = window.NATIVE_GYM_DATA || { spoken: [], definitions: [], scenes: [], culture: [] };
  const API = () => window.RPG_API || {};
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const js = (s) => esc(String(s || "").replace(/\\/g, "\\\\").replace(/'/g, "\\'"));
  const say = (t, r) => { if (window.speakFrench) window.speakFrench(String(t || "").replace(/‿/g, " "), r || 1.0); };
  const CEFR = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const rank = (c) => Math.max(0, CEFR.indexOf(String(c || "A1").slice(0, 2).toUpperCase()));
  const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "'").replace(/^(le|la|les|un|une|des|l')\s*/, "").replace(/^(se |s')/, "").replace(/[^a-z0-9' -]/g, "").replace(/\s+/g, " ").trim();
  const PRAISE = ["Bravo !", "Parfait !", "Nickel !", "Chapeau !", "Trop fort !", "Impeccable !", "Génial !", "Bien vu !"];
  const COMFORT = ["Presque !", "Pas grave !", "Courage !", "On apprend !", "La prochaine !"];

  const MODES = {
    spoken: { icon: "🎧", name: "Vitesse Réelle", desc: "Decode French as it is really spoken: j'sais pas, y a, chuis, du coup…", skill: "listening" },
    definitions: { icon: "🧠", name: "Pense en français", desc: "French definitions only, with no English. Find the word and think in French.", skill: "thinking" },
    scenes: { icon: "🎭", name: "Scènes de vie", desc: "Pharmacy, landlord, dinner party, job interview… Pick what a native would really say.", skill: "speaking" },
    culture: { icon: "🏛️", name: "Culture G", desc: "What every French person knows: songs, films, history, table manners.", skill: "culture" },
    readings: { icon: "📚", name: "Lectures", desc: "Graded real-life texts from A1 to C2: texts, emails, news, a podcast, a novel. Tap any sentence to hear it.", skill: "reading" }
  };

  let gym = { mode: null, qs: [], pos: 0, answered: false, combo: 0, best: 0, right: 0, scene: null, turn: 0, tries: 0, typed: false };

  function store() {
    const s = API().save ? API().save() : {};
    if (!s.gym || typeof s.gym !== "object") s.gym = {};
    Object.keys(MODES).forEach(m => { if (!s.gym[m]) s.gym[m] = { best: 0, plays: 0, seen: {}, right: 0 }; });
    return s.gym;
  }
  function myRank() { const a = API(); return a.campaignCefr ? rank(a.campaignCefr()) : 0; }
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function pickFresh(list, key, n, seen) {
    const fresh = shuffle(list.filter(x => !seen[key(x)]));
    const old = shuffle(list.filter(x => seen[key(x)]));
    return fresh.concat(old).slice(0, n);
  }
  function opts(correct, pool, field, n) {
    const wrong = shuffle(pool.filter(x => norm(x[field]) !== norm(correct[field]))).slice(0, n - 1);
    return shuffle([{ text: correct[field], ok: true }, ...wrong.map(w => ({ text: w[field], ok: false }))]);
  }

  // ------------------------------------------------------------------ builders
  function buildSpoken() {
    const st = store().spoken;
    const beginner = myRank() === 0;
    const pool = (G.spoken || []).filter(x => !beginner || x.tag !== "slang");
    const list = pickFresh(pool, x => x.spoken, 10, st.seen);
    return list.map((it, i) => {
      const ear = i % 2 === 0;
      return ear
        ? { id: it.spoken, kind: "ear", audio: it.spoken, tag: "🎧 LISTEN: REAL SPEED", prompt: it.tag === "liaison" ? `What does it <b>mean</b>?` : `What did they <b>mean</b>? (standard French)`, options: it.tag === "liaison" ? opts(it, G.spoken, "en", 3) : opts(it, G.spoken, "standard", 3), reveal: `🗣️ <b>${esc(it.spoken)}</b> = ${esc(it.standard)} <span class="gym-en">(${esc(it.en)})</span>`, fr: it.spoken, en: it.standard }
        : { id: it.spoken, kind: "say", tag: "🗣️ HOW WOULD A NATIVE SAY IT?", prompt: `<span class="gym-big">${esc(it.standard)}</span><div class="gym-en">${esc(it.en)}</div>`, options: opts(it, G.spoken, "spoken", 3), reveal: `Natives say: <b>${esc(it.spoken)}</b> <button class="btn" onclick="window.speakFrench('${js(it.spoken)}',1.0)">🔊</button>`, audioAfter: it.spoken, fr: it.spoken, en: it.standard };
    });
  }
  function buildDefinitions() {
    const st = store().definitions;
    const r = myRank();
    let pool = (G.definitions || []).filter(d => rank(d.cefr) <= r + 1);
    if (pool.length < 12) pool = (G.definitions || []).filter(d => rank(d.cefr) <= Math.max(1, r + 2));
    const list = pickFresh(pool, x => x.word, 10, st.seen);
    return list.map((d, i) => ({
      id: d.word, kind: i % 3 === 2 ? "type" : "pick", audio: d.def, tag: `🧠 PENSE EN FRANÇAIS • ${esc(d.cefr)}`,
      prompt: `<span class="gym-big">« ${esc(d.def)} »</span><div class="gym-q">${i % 3 === 2 ? "Écris le mot :" : "C'est quoi ?"}</div>`,
      options: i % 3 === 2 ? null : opts(d, pool, "word", 4),
      answer: d.word, hint: d.word.replace(/^(le |la |les |l'|un |une )/i, "").charAt(0).toUpperCase(),
      reveal: `<b>${esc(d.word)}</b> <span class="gym-en">(${esc(d.en)})</span>`, audioAfter: d.word, fr: d.word, en: d.def
    }));
  }
  function buildCulture() {
    const st = store().culture;
    const list = pickFresh(G.culture || [], x => x.q, 10, st.seen);
    return list.map(c => ({
      id: c.q, kind: "pick", audio: c.q, tag: "🏛️ CULTURE G",
      prompt: `<span class="gym-big">${esc(c.q)}</span><div class="gym-en intro-blur" onclick="this.classList.remove('intro-blur')" title="Tap for English">${esc(c.en || "")}</div>`,
      options: shuffle(c.choices.map(t => ({ text: t, ok: t === c.answer }))),
      reveal: `💡 ${esc(c.fact || "")}`, audioAfter: c.fact, fr: c.answer, en: c.q
    }));
  }

  // ------------------------------------------------------------------ hub
  function renderHub(container) {
    const s = store();
    const total = (m) => (G[m] || []).length;
    container.innerHTML = `
      <div class="gym-hub">
        <div class="gym-hero">
          <div class="intro-tag">🧠 LA SALLE DU NATIF</div>
          <h2>Train what textbooks never teach</h2>
          <p>Short arcade sessions (2–4 min). Real spoken French, thinking without English, real-life situations and the culture every French person shares.</p>
        </div>
        <div class="gym-grid">
          ${Object.entries(MODES).map(([k, m]) => `
            <button class="gym-card" onclick="window.gymStart('${k}')" ${total(k) ? "" : "disabled"}>
              <div class="gym-icon">${m.icon}</div>
              <div class="gym-name">${m.name}</div>
              <div class="gym-desc">${m.desc}</div>
              <div class="gym-meta">${k === "scenes" ? `${total(k)} scenes` : k === "readings" ? `${total(k)} texts` : `${total(k)} items`} • best ${s[k].best}${k === "scenes" ? "/8" : k === "readings" ? "/5" : "/10"} • played ${s[k].plays}×</div>
              <div class="gym-meta">${Object.keys(s[k].seen || {}).length} / ${total(k)} discovered</div>
            </button>`).join("")}
        </div>
      </div>`;
  }

  // ------------------------------------------------------------------ quiz modes
  function renderQuiz(container) {
    const q = gym.qs[gym.pos];
    const m = MODES[gym.mode];
    if (!q) return renderSummary(container);
    const pct = Math.round((gym.pos / gym.qs.length) * 100);
    const body = q.kind === "type"
      ? `<div class="intro-type-row"><input id="gym-type" class="input-french" autocomplete="off" spellcheck="false" placeholder="Indice : ça commence par « ${esc(q.hint)} »…" onkeydown="if(event.key==='Enter'){event.preventDefault();window.gymTyped();}" ${gym.answered ? "disabled" : ""}/><button class="btn btn-gold" onclick="window.gymTyped()">Check</button></div>
         <div class="intro-accents">${["é", "è", "ê", "à", "â", "ç", "ù", "ô", "î", "œ"].map(ch => `<button class="btn" onclick="window.insertFrenchAccent && window.insertFrenchAccent('gym-type','${ch}')">${ch}</button>`).join("")}<button class="btn" style="margin-left:auto;" onclick="window.gymGiveUp()">🤷 Show me</button></div>`
      : `<div class="intro-options">${q.options.map((o, k) => `<button class="btn intro-opt gym-opt" id="gym-opt-${k}" ${gym.answered ? "disabled" : ""} onclick="window.gymAnswer(${k})"><span class="intro-key">${k + 1}</span> ${esc(o.text)}</button>`).join("")}</div>`;
    container.innerHTML = `
      <div class="arena-box intro-box">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.6rem;">
          <h3 style="font-size:1.25rem;font-weight:900;">${m.icon} ${m.name} • ${gym.pos + 1} / ${gym.qs.length}</h3>
          <div style="display:flex;gap:0.4rem;align-items:center;">
            <span class="intro-combo ${gym.combo >= 3 ? "hot" : ""}">🔥 x${gym.combo}</span>
            <button class="btn" onclick="window.navigateScene('gym')">🏠 Gym</button>
          </div>
        </div>
        <div class="intro-progress"><div style="width:${pct}%"></div></div>
        <div class="intro-card" id="gym-card">
          <div class="intro-tag">${q.tag}</div>
          ${q.audio ? `<div class="intro-actions" style="justify-content:center;"><button class="btn intro-listen" onclick="window.speakFrench('${js(q.audio)}',1.0)">🔊 Play</button>${gym.mode === "spoken" ? "" : `<button class="btn" style="color:#fde047;border-color:#fde047;" onclick="window.speakFrench('${js(q.audio)}',0.6)">🐢 Slow</button>`}</div>` : ""}
          <div class="gym-prompt">${q.prompt}</div>
          ${body}
          <div id="gym-feedback"></div>
        </div>
      </div>`;
    if (!gym.answered && q.audio && (q.kind === "ear" || gym.mode === "definitions")) say(q.audio, 1.0);
    const inp = document.getElementById("gym-type");
    if (inp && !gym.answered) inp.focus();
  }

  function reward(ok, el) {
    const r = el ? el.getBoundingClientRect() : null;
    const x = r ? r.left + r.width / 2 : window.innerWidth / 2;
    const y = r ? r.top : window.innerHeight / 2;
    const a = API();
    if (ok) {
      gym.combo += 1; gym.best = Math.max(gym.best, gym.combo); gym.right += 1;
      if (a.addXP) a.addXP(12 + Math.min(12, gym.combo * 2), 3);
      if (window.RPG_SFX) window.RPG_SFX.matchCombo(Math.min(8, gym.combo));
      if (window.RPG_VFX) { window.RPG_VFX.burst(x, y, gym.combo >= 5 ? "#f97316" : "#10b981", 14 + Math.min(20, gym.combo * 3)); window.RPG_VFX.floatText(PRAISE[(gym.pos + gym.combo) % PRAISE.length], "#6ee7b7", x, y - 24); }
      if (gym.combo === 5 || gym.combo === 10) { if (a.addXP) a.addXP(30, 10); if (window.RPG_VFX) window.RPG_VFX.toast(`Combo x${gym.combo} !`, "+30 XP bonus", "🔥"); }
    } else {
      gym.combo = 0;
      if (window.RPG_SFX) window.RPG_SFX.damageHit();
      if (window.RPG_VFX) window.RPG_VFX.floatText(COMFORT[gym.pos % COMFORT.length], "#fda4af", x, y - 24);
      const c = document.getElementById("gym-card");
      if (c) { c.classList.remove("shake"); void c.offsetWidth; c.classList.add("shake"); }
    }
  }

  function finishAnswer(ok, q, el, extra) {
    gym.answered = true;
    const st = store()[gym.mode];
    st.seen[q.id] = (st.seen[q.id] || 0) + 1;
    if (ok) st.right = (st.right || 0) + 1;
    const a = API();
    const s = a.save ? a.save() : null;
    if (s && s.stats) {
      s.stats.gymRight = (s.stats.gymRight || 0) + (ok ? 1 : 0);
      if (ok && gym.mode === "spoken") s.stats.earHits = (s.stats.earHits || 0) + 1;
      if (ok && gym.mode === "definitions") s.stats.frenchOnlyHits = (s.stats.frenchOnlyHits || 0) + 1;
    }
    if (window.recordLearningOutcome && q.fr) window.recordLearningOutcome(`gym_${gym.mode}_${norm(q.id).slice(0, 40)}`, q.fr, q.en || "", ok, gym.mode === "spoken" ? "comprehension" : "vocabulary", a.campaignCefr ? a.campaignCefr() : "B1");
    reward(ok, el);
    if (q.audioAfter) setTimeout(() => say(q.audioAfter, 1.0), ok ? 150 : 350);
    const fb = document.getElementById("gym-feedback");
    if (fb) fb.innerHTML = `<div class="feedback-banner ${ok ? "ok" : "err"}">${ok ? "✅ " : "❌ "}${extra || ""}${q.reveal}<div><button class="btn btn-gold" id="gym-next-btn" style="margin-top:0.5rem;" onclick="window.gymNext()">Next ➜</button></div></div>`;
    const nb = document.getElementById("gym-next-btn");
    if (nb) nb.focus();
    if (a.persistSave) a.persistSave();
  }

  // ------------------------------------------------------------------ scenes
  function renderScenePick(container) {
    const r = myRank();
    const s = store().scenes;
    container.innerHTML = `
      <div class="arena-box">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;">
          <h3 style="font-size:1.3rem;font-weight:900;">🎭 Scènes de vie: choose a situation</h3>
          <button class="btn" onclick="window.navigateScene('gym')">🏠 Gym</button>
        </div>
        <p style="color:var(--text-muted);font-size:0.86rem;margin:0.3rem 0 0.8rem;">A French person talks to you. Pick the reply a native would give. Wrong register, faux amis or rude answers lose points.</p>
        <div class="gym-scene-grid">
          ${(G.scenes || []).map((sc, i) => {
            const locked = rank(sc.cefr) > r + 1;
            const best = (s.seen && s.seen["scene_" + sc.id]) ? `✅ played` : "new";
            return `<button class="gym-scene ${locked ? "locked" : ""}" onclick="window.gymPlayScene(${i})">
              <div class="gym-scene-place">${esc(sc.place || "🎭")}</div>
              <div class="gym-name">${esc(sc.title)}</div>
              <div class="gym-meta">${esc(sc.cefr)} • ${sc.turns.length} turns • ${best}${locked ? " • ⚠️ above your level" : ""}</div>
              <div class="gym-desc">${esc(sc.goal || "")}</div>
            </button>`;
          }).join("")}
        </div>
      </div>`;
  }

  function renderScene(container) {
    const sc = gym.scene;
    const t = sc.turns[gym.turn];
    if (!t) return renderSceneSummary(container);
    const tier = window.RPG_IMMERSION_TIER ? window.RPG_IMMERSION_TIER() : 0;
    if (!gym.sceneOpts || gym.sceneOptsTurn !== gym.turn) { gym.sceneOpts = shuffle(t.options); gym.sceneOptsTurn = gym.turn; }
    container.innerHTML = `
      <div class="arena-box intro-box">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.6rem;">
          <h3 style="font-size:1.2rem;font-weight:900;">🎭 ${esc(sc.title)} • ${gym.turn + 1} / ${sc.turns.length}</h3>
          <div style="display:flex;gap:0.4rem;align-items:center;">
            <span class="intro-combo ${gym.combo >= 3 ? "hot" : ""}">🔥 x${gym.combo}</span>
            <button class="btn" onclick="window.gymStart('scenes')">↩ Scenes</button>
          </div>
        </div>
        <div class="intro-progress"><div style="width:${Math.round((gym.turn / sc.turns.length) * 100)}%"></div></div>
        <div class="gym-goal">🎯 ${esc(sc.goal || "")}</div>
        <div class="intro-card" id="gym-card">
          <div class="gym-npc">
            <div class="gym-npc-av">${esc((sc.place || "🧑").split(" ")[0])}</div>
            <div class="gym-bubble" onclick="window.speakFrench('${js(t.npc)}',1.0)">🔊 ${esc(t.npc)}
              ${tier === 0 ? `<div class="gym-en">${esc(t.npc_en || "")}</div>` : `<div class="gym-en intro-blur" onclick="event.stopPropagation();this.classList.remove('intro-blur')">${esc(t.npc_en || "")}</div>`}
            </div>
          </div>
          <div class="gym-q">Your reply:</div>
          <div class="intro-options">${gym.sceneOpts.map((o, k) => `<button class="btn intro-opt gym-opt" id="gym-opt-${k}" ${gym.answered ? "disabled" : ""} onclick="window.gymSceneAnswer(${k})"><span class="intro-key">${k + 1}</span> ${esc(o.fr)}</button>`).join("")}</div>
          <div id="gym-feedback"></div>
        </div>
      </div>`;
    if (!gym.answered) say(t.npc, 1.0);
  }

  function renderSceneSummary(container) {
    const sc = gym.scene;
    const s = store().scenes;
    const score = gym.right;
    if (!gym.saved) {
      gym.saved = true;
      s.plays += 1; s.best = Math.max(s.best, score); s.seen["scene_" + sc.id] = (s.seen["scene_" + sc.id] || 0) + 1;
      if (API().addXP) API().addXP(40 + score * 10, 15);
      if (API().persistSave) API().persistSave();
      if (window.RPG_SFX) window.RPG_SFX.victoryFanfare();
    }
    container.innerHTML = `
      <div class="arena-box intro-box"><div class="intro-card">
        <div class="intro-tag">🎭 SCÈNE TERMINÉE</div>
        <div class="intro-fr" style="cursor:default;">${score === sc.turns.length ? "Comme un natif !" : score >= sc.turns.length - 2 ? "Très naturel !" : "Bon début !"}</div>
        <div class="intro-stats"><div><b>${score} / ${sc.turns.length}</b><span>first-try natural replies</span></div><div><b>🔥 ${gym.best}</b><span>best combo</span></div></div>
        <div class="gym-replay">${sc.turns.map(t => { const ok = t.options.find(o => o.ok); return `<div class="gym-line"><span>🧑 ${esc(t.npc)}</span><span>🙂 <b>${esc(ok ? ok.fr : "")}</b></span></div>`; }).join("")}</div>
        <div class="intro-actions">
          <button class="btn" onclick="window.gymPlayScene(${(G.scenes || []).indexOf(sc)})">↻ Replay</button>
          <button class="btn btn-gold intro-next" onclick="window.gymStart('scenes')">🎭 Another scene</button>
          <button class="btn" onclick="window.navigateScene('salon')">🗣️ Practise it live in Le Salon</button>
        </div>
      </div></div>`;
  }


  // ------------------------------------------------------------------ readings
  function splitSentences(t) {
    return String(t).match(/[^.!?…]+[.!?…]+[»"]?\s*|[^.!?…]+$/g) || [t];
  }
  function renderReadingPick(container) {
    const r = myRank();
    const s = store().readings;
    container.innerHTML = `
      <div class="arena-box">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;">
          <h3 style="font-size:1.3rem;font-weight:900;">📚 Lectures: choose a text</h3>
          <button class="btn" onclick="window.navigateScene('gym')">🏠 Gym</button>
        </div>
        <p style="color:var(--text-muted);font-size:0.86rem;margin:0.3rem 0 0.8rem;">Read like a native: get the gist first, then the details. Tap any sentence to hear it. Questions are in French.</p>
        <div class="gym-scene-grid">
          ${(G.readings || []).map((rd, i) => {
            const above = rank(rd.cefr) > r + 1;
            const done = s.seen && s.seen["read_" + rd.id];
            return `<button class="gym-scene ${above ? "locked" : ""}" onclick="window.gymOpenReading(${i})">
              <div class="gym-scene-place">📖 ${esc(rd.cefr)}</div>
              <div class="gym-name">${esc(rd.title)}</div>
              <div class="gym-meta">${esc(rd.genre || "")} • ${String(rd.text).split(/\s+/).length} words • ${done ? "✅ read" : "new"}${above ? " • ⚠️ above your level" : ""}</div>
            </button>`;
          }).join("")}
        </div>
      </div>`;
  }
  function renderReading(container) {
    const rd = gym.reading;
    const tier = window.RPG_IMMERSION_TIER ? window.RPG_IMMERSION_TIER() : 0;
    const paras = String(rd.text).split(/\n\n+/);
    const textHtml = paras.map(pg => `<p class="read-p">${splitSentences(pg).map(se => `<span class="read-s" onclick="window.speakFrench('${js(se.trim())}',1.0)">${esc(se)}</span>`).join("")}</p>`).join("");
    const gloss = (rd.glossary || []).map(g => `<div class="read-g"><b>${esc(g.fr)}</b> <span class="${tier ? "intro-blur" : ""}" onclick="this.classList.remove('intro-blur')">${esc(g.en)}</span></div>`).join("");
    let quiz = "";
    if (gym.phase === "quiz") {
      const q = rd.questions[gym.rq];
      if (!gym.rOpts || gym.rOptsFor !== gym.rq) { gym.rOpts = shuffle(q.choices.map(c => ({ text: c, ok: c === q.answer }))); gym.rOptsFor = gym.rq; }
      quiz = `<div class="bite-quiz" id="gym-card">
        <div class="intro-tag">❓ QUESTION ${gym.rq + 1} / ${rd.questions.length}</div>
        <div class="bite-q">${esc(q.q)}</div>
        <div class="intro-options">${gym.rOpts.map((o, k) => `<button class="btn intro-opt gym-opt" id="gym-opt-${k}" ${gym.answered ? "disabled" : ""} onclick="window.gymReadAnswer(${k})"><span class="intro-key">${k + 1}</span> ${esc(o.text)}</button>`).join("")}</div>
        <div id="gym-feedback"></div>
      </div>`;
    } else if (gym.phase === "done") {
      const st = store().readings;
      if (!gym.saved) {
        gym.saved = true;
        st.plays += 1; st.best = Math.max(st.best, gym.right); st.seen["read_" + rd.id] = (st.seen["read_" + rd.id] || 0) + 1;
        const a = API(); const sv = a.save ? a.save() : null;
        if (sv && sv.stats) sv.stats.textsRead = (sv.stats.textsRead || 0) + 1;
        if (a.addXP) a.addXP(40 + gym.right * 12, 15);
        if (a.persistSave) a.persistSave();
        if (window.RPG_SFX) window.RPG_SFX.victoryFanfare();
      }
      quiz = `<div class="bite-quiz"><div class="intro-tag">📚 LECTURE TERMINÉE</div>
        <div class="intro-stats"><div><b>${gym.right} / ${rd.questions.length}</b><span>understood</span></div></div>
        <div class="intro-actions"><button class="btn btn-gold intro-next" onclick="window.gymStart('readings')">📚 Another text</button><button class="btn" onclick="window.navigateScene('writing')">✍️ Write about it</button></div></div>`;
    }
    container.innerHTML = `
      <div class="arena-box intro-box">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.6rem;">
          <h3 style="font-size:1.2rem;font-weight:900;">📚 ${esc(rd.title)} <span class="badge-cefr badge-${esc(rd.cefr)}">${esc(rd.cefr)}</span></h3>
          <div style="display:flex;gap:0.4rem;align-items:center;">
            <button class="btn" onclick="window.speakFrench('${js(String(rd.text).replace(/\n+/g, " ").slice(0, 900))}',1.0)">🔊 Read it to me</button>
            <button class="btn" onclick="window.gymStart('readings')">↩ Texts</button>
          </div>
        </div>
        <div class="read-wrap">
          <div class="read-text">${textHtml}</div>
          <div class="read-side"><div class="intro-tag">📝 GLOSSAIRE</div>${gloss}</div>
        </div>
        ${gym.phase === "read" ? `<div class="intro-actions"><button class="btn btn-gold intro-next" id="gym-next-btn" onclick="window.gymReadStartQuiz()">✔ I've read it: questions ➜</button></div>` : quiz}
      </div>`;
  }

  // ------------------------------------------------------------------ summary
  function renderSummary(container) {
    const st = store()[gym.mode];
    if (!gym.saved) {
      gym.saved = true;
      st.plays += 1; st.best = Math.max(st.best, gym.right);
      if (API().addXP) API().addXP(30 + gym.right * 5, 10);
      if (API().persistSave) API().persistSave();
      if (window.RPG_SFX) window.RPG_SFX.victoryFanfare();
      if (window.RPG_VFX) window.RPG_VFX.burst(window.innerWidth / 2, window.innerHeight * 0.45, "#fde047", 40);
    }
    const m = MODES[gym.mode];
    container.innerHTML = `
      <div class="arena-box intro-box"><div class="intro-card">
        <div class="intro-tag">${m.icon} ${m.name.toUpperCase()} • TERMINÉ</div>
        <div class="intro-fr" style="cursor:default;">${gym.right >= 9 ? "Impeccable !" : gym.right >= 7 ? "Très bien !" : "Bon début !"}</div>
        <div class="intro-stats"><div><b>${gym.right} / ${gym.qs.length}</b><span>correct</span></div><div><b>🔥 ${gym.best}</b><span>best combo</span></div><div><b>${st.best}</b><span>record</span></div></div>
        <div class="intro-chips">${gym.qs.map(q => `<button class="word-tile" onclick="window.speakFrench('${js(q.fr)}',1.0)">🔊 ${esc(q.fr)}</button>`).join("")}</div>
        <div class="intro-actions">
          <button class="btn btn-gold intro-next" onclick="window.gymStart('${gym.mode}')">↻ 10 more</button>
          <button class="btn" onclick="window.navigateScene('gym')">🏠 Gym</button>
        </div>
      </div></div>`;
  }

  // ------------------------------------------------------------------ public
  window.renderNativeGym = function (container) {
    if (gym.mode === "readings" && gym.reading) return renderReading(container);
    if (gym.mode === "readings") return renderReadingPick(container);
    if (gym.mode === "scenes" && gym.scene) return renderScene(container);
    if (gym.mode === "scenes") return renderScenePick(container);
    if (gym.mode && gym.qs.length) return renderQuiz(container);
    return renderHub(container);
  };
  const rerender = () => { const c = document.getElementById("app-main"); if (c) window.renderNativeGym(c); };
  window.gymHome = function () { gym = { mode: null, qs: [], pos: 0 }; };
  window.gymStart = function (mode) {
    gym = { mode, qs: [], pos: 0, answered: false, combo: 0, best: 0, right: 0, scene: null, turn: 0, saved: false };
    if (mode === "spoken") gym.qs = buildSpoken();
    else if (mode === "definitions") gym.qs = buildDefinitions();
    else if (mode === "culture") gym.qs = buildCulture();
    if (mode === "readings") { gym.reading = null; gym.phase = "pick"; }
    if (window.navigateScene && window.RPG_CURRENT_SCENE && window.RPG_CURRENT_SCENE() !== "gym") { window.RPG_GYM_KEEP = true; window.navigateScene("gym"); }
    else rerender();
  };
  window.gymAnswer = function (k) {
    if (gym.answered) return;
    const q = gym.qs[gym.pos];
    if (!q || !q.options) return;
    const o = q.options[k];
    document.querySelectorAll(".gym-opt").forEach((b, i) => { b.disabled = true; if (q.options[i].ok) b.classList.add("correct"); });
    const el = document.getElementById(`gym-opt-${k}`);
    if (!o.ok && el) el.classList.add("wrong");
    finishAnswer(!!o.ok, q, el);
  };
  window.gymTyped = function () {
    if (gym.answered) return;
    const q = gym.qs[gym.pos];
    const inp = document.getElementById("gym-type");
    if (!q || !inp || !inp.value.trim()) return;
    const a = norm(inp.value), b = norm(q.answer);
    const ok = a === b || (b.split(" / ").some(x => norm(x) === a));
    const exact = ok && inp.value.trim().toLowerCase().replace(/^(le |la |les |l'|un |une )/, "") === String(q.answer).toLowerCase().replace(/^(le |la |les |l'|un |une )/, "");
    finishAnswer(ok, q, inp, ok && !exact ? "Watch the spelling/accents: " : "");
  };
  window.gymGiveUp = function () {
    if (gym.answered) return;
    const q = gym.qs[gym.pos];
    finishAnswer(false, q, document.getElementById("gym-type"));
  };
  window.gymNext = function () { gym.pos += 1; gym.answered = false; rerender(); };
  window.gymPlayScene = function (i) {
    const sc = (G.scenes || [])[i];
    if (!sc) return;
    gym = { mode: "scenes", qs: [], pos: 0, answered: false, combo: 0, best: 0, right: 0, scene: sc, turn: 0, tries: 0, saved: false };
    rerender();
  };
  window.gymSceneAnswer = function (k) {
    if (gym.answered) return;
    const t = gym.scene.turns[gym.turn];
    const o = gym.sceneOpts[k];
    const el = document.getElementById(`gym-opt-${k}`);
    const fb = document.getElementById("gym-feedback");
    if (o.ok) {
      gym.answered = true;
      if (gym.tries === 0) gym.right += 1;
      document.querySelectorAll(".gym-opt").forEach(b => (b.disabled = true));
      if (el) el.classList.add("correct");
      reward(gym.tries === 0, el);
      say(o.fr, 1.0);
      if (fb) fb.innerHTML = `<div class="feedback-banner ok">✅ ${esc(o.why || "Natural!")}<div><button class="btn btn-gold" id="gym-next-btn" style="margin-top:0.5rem;" onclick="window.gymSceneNext()">Next ➜</button></div></div>`;
      const nb = document.getElementById("gym-next-btn"); if (nb) nb.focus();
    } else {
      gym.tries += 1;
      if (el) { el.classList.add("wrong"); el.disabled = true; }
      reward(false, el);
      if (window.recordLearningOutcome) { const good = t.options.find(x => x.ok); window.recordLearningOutcome(`gym_scene_${gym.scene.id}_${gym.turn}`, good ? good.fr : "", t.npc_en || t.npc, false, "pragmatics", gym.scene.cefr); }
      if (fb) fb.innerHTML = `<div class="feedback-banner err">❌ ${esc(o.why || "Not quite.")} Try another reply.</div>`;
    }
  };
  window.gymSceneNext = function () { gym.turn += 1; gym.tries = 0; gym.answered = false; rerender(); };
  window.gymOpenReading = function (i) {
    const rd = (G.readings || [])[i];
    if (!rd) return;
    gym = { mode: "readings", qs: [], pos: 0, answered: false, combo: 0, best: 0, right: 0, reading: rd, phase: "read", rq: 0, saved: false };
    rerender();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  window.gymReadStartQuiz = function () { gym.phase = "quiz"; gym.rq = 0; gym.answered = false; rerender(); const c = document.getElementById("gym-card"); if (c) c.scrollIntoView({ behavior: "smooth", block: "center" }); };
  window.gymReadAnswer = function (k) {
    if (gym.answered) return;
    const q = gym.reading.questions[gym.rq];
    const o = gym.rOpts[k];
    gym.answered = true;
    document.querySelectorAll(".gym-opt").forEach((b, i) => { b.disabled = true; if (gym.rOpts[i].ok) b.classList.add("correct"); });
    const el = document.getElementById(`gym-opt-${k}`);
    if (!o.ok && el) el.classList.add("wrong");
    reward(!!o.ok, el);
    const fb = document.getElementById("gym-feedback");
    const last = gym.rq + 1 >= gym.reading.questions.length;
    if (fb) fb.innerHTML = `<div class="feedback-banner ${o.ok ? "ok" : "err"}">${o.ok ? "✅" : `❌ ${esc(q.answer)}.`} ${esc(q.why || "")}<div><button class="btn btn-gold" id="gym-next-btn" style="margin-top:0.5rem;" onclick="window.gymReadNext()">${last ? "Finish ✔" : "Next ➜"}</button></div></div>`;
    const nb = document.getElementById("gym-next-btn"); if (nb) nb.focus();
  };
  window.gymReadNext = function () {
    gym.answered = false;
    if (gym.rq + 1 >= gym.reading.questions.length) gym.phase = "done"; else gym.rq += 1;
    rerender();
    const c = document.getElementById("gym-card"); if (c) c.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  window.RPG_GYM_BACK = function () {
    if (gym.mode === "scenes" && gym.scene) { gym.scene = null; rerender(); return true; }
    if (gym.mode === "readings" && gym.reading) { gym.reading = null; rerender(); return true; }
    if (gym.mode) { gym.mode = null; rerender(); return true; }
    return false;
  };
  window.addEventListener("keydown", (e) => {
    if (!document.getElementById("gym-card")) return;
    const tag = (e.target && e.target.tagName) || "";
    if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
    const dKey = /^[1-4]$/.test(e.key) ? +e.key : (/^(?:Digit|Numpad)([1-4])$/.test(e.code || "") ? +RegExp.$1 : 0);
    if (dKey >= 1 && dKey <= 4 && document.getElementById(`gym-opt-${dKey - 1}`) && !gym.answered) {
      e.preventDefault();
      if (gym.mode === "scenes") window.gymSceneAnswer(dKey - 1);
      else if (gym.mode === "readings") window.gymReadAnswer(dKey - 1);
      else window.gymAnswer(dKey - 1);
    } else if (e.key === "Enter") {
      const nb = document.getElementById("gym-next-btn");
      if (nb && document.activeElement !== nb) { e.preventDefault(); nb.click(); }
    }
  });
  window.RPG_GYM_STATE = function () { return { mode: gym.mode, pos: gym.pos, n: gym.qs.length, right: gym.right, answered: gym.answered, scene: gym.scene ? gym.scene.id : null, turn: gym.turn, q: gym.qs[gym.pos] ? { kind: gym.qs[gym.pos].kind, answer: gym.qs[gym.pos].answer, ok: (gym.qs[gym.pos].options || []).findIndex(o => o.ok) } : null, sceneOk: gym.sceneOpts ? gym.sceneOpts.findIndex(o => o.ok) : -1 }; };
})();
