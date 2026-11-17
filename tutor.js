// =============================================================================
// LE PROFESSEUR — Camille, your one-to-one French teacher.
//  1) Guided lessons (chat): explanation → example → question → feedback → why.
//     Hand-written lessons in window.TUTOR_LESSONS[stageId]; every other stage
//     gets an automatic lesson built from its course notes and phrases.
//  2) "🙋 Ask Camille" — a question box on every screen. Uses the AI tutor via
//     play_server (/api/tutor) when connected; otherwise answers from the
//     course notes (offline search).
//  3) "❓ Why?" — added to every wrong-answer banner in the game.
//  4) 📘 Ma Grammaire — every rule of the course in one searchable handbook.
// =============================================================================
(function () {
  const PORTRAIT = "assets/tutor_camille.jpg";
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const jsq = (s) => esc(String(s || "").replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, " "));
  const API = () => window.RPG_API || {};
  const say = (t, r) => { if (window.speakFrench && t) window.speakFrench(String(t).replace(/‿/g, " "), r || 1.0); };
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[’`]/g, "'").replace(/[«»"“”.,!?;:()\[\]…–—-]/g, " ").replace(/'/g, " ").replace(/\s+/g, " ").trim();
  const normAcc = (s) => String(s || "").toLowerCase().replace(/[’`]/g, "'").replace(/[«»"“”.,!?;:()\[\]…–—-]/g, " ").replace(/'/g, " ").replace(/\s+/g, " ").trim();
  const PRAISE = ["Bravo !", "Parfait !", "Exactement !", "Très bien !", "Super !", "Impeccable !"];

  // «French» → tappable, audible span. Everything else escaped.
  function rich(text) {
    const s = String(text || "");
    let out = "", last = 0;
    s.replace(/«\s*([^»]+?)\s*»/g, (m, fr, idx) => {
      out += esc(s.slice(last, idx));
      out += `<span class="fr-tap" title="Tap to hear" onclick="event.stopPropagation();window.speakFrench('${jsq(fr)}',1.0)">«${esc(fr)}»</span>`;
      last = idx + m.length;
      return m;
    });
    return out + esc(s.slice(last));
  }

  function save() { return API().save ? API().save() : {}; }
  function bag(name) { const s = save(); if (!s[name] || typeof s[name] !== "object") s[name] = {}; return s[name]; }

  // ------------------------------------------------------------------ lessons
  function cardsOf(stage) {
    return (stage.cards || []).filter(x => x && x.fr && x.en && String(x.fr).length <= 90);
  }
  function trimText(t, n) {
    t = String(t || "").replace(/\s+/g, " ").trim();
    if (t.length <= n) return t;
    const cut = t.slice(0, n);
    const k = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
    return (k > 60 ? cut.slice(0, k + 1) : cut + "…");
  }
  function wrongOptions(pool, target, field, n) {
    const t = norm(target[field]);
    const seen = new Set([t]);
    const out = [];
    for (const c of shuffle(pool)) {
      const v = norm(c[field]);
      if (!v || seen.has(v)) continue;
      // never offer another valid translation of the same thing
      if (field === "en" && norm(c.fr) === norm(target.fr)) continue;
      if (field === "fr" && norm(c.en) === norm(target.en)) continue;
      seen.add(v);
      out.push(c[field]);
      if (out.length >= n) break;
    }
    return out;
  }
  function firstAlt(fr) { return String(fr).split("/")[0].replace(/\(.*?\)/g, "").trim(); }

  function autoLesson(stage) {
    const bites = window.RPG_BUILD_BITES ? window.RPG_BUILD_BITES(stage) : [];
    const cards = cardsOf(stage);
    const pairs = [];
    bites.forEach(b => b.rows.forEach(r => { if (r.kind === "pair" && r.fr.length <= 90) pairs.push({ fr: r.fr, en: r.en }); }));
    const pool = pairs.concat(cards);
    const turns = [];
    turns.push({ t: "say", text: `Bonjour ! Today's lesson: ${stage.title}. I'll explain one idea at a time, then you try. Tap any French in «guillemets» to hear it.` });
    let ideas = 0;
    bites.filter(b => !b.goal).forEach(b => {
      if (ideas >= 5) return;
      const texts = b.rows.filter(r => r.kind === "text" && !r.fr && r.text.length > 15).map(r => r.text);
      const bp = b.rows.filter(r => r.kind === "pair" && r.fr.length <= 90);
      if (!texts.length && bp.length < 2) return;
      ideas += 1;
      turns.push({ t: "say", text: texts.length ? trimText(texts.slice(0, 2).join(" "), 280) : `Let's look at «${b.title}».` });
      if (bp[0]) turns.push({ t: "example", fr: bp[0].fr, en: bp[0].en });
      const q = bp[1] || bp[0];
      if (q) {
        const w = wrongOptions(pool, q, "en", 2);
        if (w.length === 2) turns.push({ t: "ask", q: `What does «${q.fr}» mean?`, choices: shuffle([q.en, ...w]), answer: q.en, right: `Yes: «${q.fr}» = ${q.en}.`, wrong: `«${q.fr}» means "${q.en}". Listen to it once more and repeat it.` });
      }
    });
    const pick = shuffle(cards).slice(0, ideas >= 3 ? 2 : 4);
    pick.forEach((c, i) => {
      if (i % 2 === 0) turns.push({ t: "example", fr: c.fr, en: c.en, note: c.note || "" });
      else {
        const w = wrongOptions(pool, c, "fr", 2);
        if (w.length === 2) turns.push({ t: "ask", q: `How do you say: "${c.en}"?`, choices: shuffle([c.fr, ...w]), answer: c.fr, right: "Exactly! You're building your French memory.", wrong: `It's «${c.fr}». Say it out loud once, it sticks better.` });
      }
    });
    const final = cards.find(c => String(c.fr).length <= 40) || cards[0];
    if (final) {
      const ans = firstAlt(final.fr);
      turns.push({ t: "say", text: "Your turn to produce. Don't worry about accents, I'll show you." });
      turns.push({ t: "type", q: `Write in French: ${final.en}`, answer: ans, accept: [ans], hint: `It starts with «${ans.split(" ").slice(0, 2).join(" ")}…»`, right: "Excellent! Writing it fixes it in your memory.", wrong: `The answer is «${ans}». Notice each word.` });
      turns.push({ t: "speak", text: `Now say it out loud: «${ans}».`, fr: ans });
    }
    turns.push({ t: "say", text: "That's the lesson. Next, the phrase rounds train every phrase of this stage. Ask me anything with 🙋 at any time!" });
    return { stageId: stage.stageId, title: stage.title, goal: `Understand the key ideas of «${stage.title}».`, turns, auto: true };
  }

  // ---------------------------------------------------------------- story lessons
  // Dialogues, dictations, gap-fills, listening texts and literary extracts:
  // Camille walks you through the text line by line, checks meaning, gaps,
  // vocabulary, then you write and say a line yourself.
  function sectionBody(stage, re) {
    const s = (stage.sections || []).find(x => re.test(String(x.title || "")));
    return s ? String(s.body || "") : "";
  }
  function storyLines(stage) {
    const out = [];
    const seen = new Set();
    const add = (fr, en, speaker, cloze) => {
      fr = String(fr || "").trim(); en = String(en || "").trim();
      if (!fr || !en || fr.length > 220 || /^[A-ZÀ-Ý][\wà-ÿ\-]+$/.test(fr) || /^•/.test(fr) || /^•/.test(en) || !/[a-z]{2}/i.test(en.replace(/\d/g, "")) || seen.has(fr)) return;
      seen.add(fr); out.push({ fr, en, speaker: speaker || "", cloze });
    };
    const se = stage.sentences || [];
    (stage.dialogueTurns || []).forEach(t => add(t.fr, t.en, t.speaker && t.speaker !== "Narrateur" ? t.speaker : "", se.find(x => x.fr === t.fr)));
    se.forEach(x => add(x.fr, x.en, "", x));
    cardsOf(stage).forEach(c => add(c.fr, c.en, "", null));
    // Interviews: "Transcription" + "Version anglaise" sections with "Name: line".
    const secs = stage.sections || [];
    const SPK = /^\s*([A-ZÀ-Ý][\wÀ-ÿ\- ]{0,24}?)\s*:\s*(.+)$/;
    const spk = (body) => String(body || "").split("\n").map(x => x.match(SPK)).filter(Boolean).map(m => ({ s: m[1].trim(), t: m[2].trim() }));
    const tr = secs.find(x => /transcription/i.test(x.title || "")), en = secs.find(x => /version anglaise|english/i.test(x.title || ""));
    if (tr && en) {
      const a = spk(tr.body), b = spk(en.body);
      for (let i = 0; i < Math.min(a.length, b.length, 14); i++) if (a[i].s === b[i].s || a[i].s.slice(0, 3) === b[i].s.slice(0, 3)) add(a[i].t, b[i].t, a[i].s, null);
    }
    // Literary extracts: French prose without line-by-line translation.
    if (out.length < 6) {
      const prose = secs.filter(x => !/objectif|niveau|vocabulaire|note|version anglaise|questions|r[ée]ponses|th[eè]me|transcription/i.test(x.title || "") && String(x.body || "").length > 200)
        .sort((x, y) => String(y.body).length - String(x.body).length)[0];
      if (prose) {
        const sents = String(prose.body).replace(/\s+/g, " ").split(/(?<=[.!?…»])\s+(?=[A-ZÀ-Ý«—–-])/)
          .map(x => x.trim()).filter(x => x.length >= 20 && x.length <= 200 && !/^d[e']\s?[ÉA-Z].*\(\d{4}/.test(x) && (x.match(/\b(the|he|she|wrote|this|is|was|of|and|in|his|her)\b/gi) || []).length < 2);
        sents.slice(0, 8).forEach(x => { if (!seen.has(x)) { seen.add(x); out.push({ fr: x, en: "", speaker: "", cloze: null, prose: true }); } });
      }
    }
    return out;
  }
  function vocabTip(stage) {
    const vocab = sectionBody(stage, /^vocabulaire/i).split("\n").map(x => x.replace(/^•\s*/, "").trim()).filter(x => x.length > 2).slice(0, 6);
    if (!vocab.length) return null;
    const fmt = (v) => {
      if (v.includes("«")) return v;
      const parts = v.split(/\s[-–=:]\s|\s\(/);
      return `«${parts[0].trim()}»` + (parts[1] ? ` (${parts[1].replace(/\)$/, "").trim()})` : "");
    };
    return { t: "tip", text: `Key vocabulary for this text: ${vocab.map(fmt).join(", ")}.` };
  }
  function storyLesson(stage) {
    const raw = storyLines(stage);
    const lines = raw.filter(l => l.prose).concat(raw.filter(l => !l.prose));
    if (lines.length < 2) return null;
    const ex = String(stage.exType || "");
    const kind = /dialogue/i.test(ex) || /^Dialogue/i.test(stage.title) ? "dialogue"
      : /dictation/i.test(ex) ? "dictation" : /gap/i.test(ex) ? "gap" : /listening|reading/i.test(ex) ? "reading" : "story";
    const name = String(stage.title || "").replace(/^(Dialogue|Dictation|Gap Fill|Listening & Reading)\s*:\s*/i, "");
    const theme = trimText(sectionBody(stage, /^th[eè]me/i).replace(/•/g, ""), 140);
    const intro = {
      dialogue: `Bonjour ! Today we study a real conversation: «${name}». I'll play it line by line. Listen, understand, then you'll speak the lines yourself.`,
      dictation: `Today's dictation: «${name}». Before you write it, we'll understand every sentence, so the dictation becomes easy.`,
      gap: `Today's text: «${name}». We'll read it together and practise finding the missing words, the way you'll do in the gap-fill.`,
      reading: `Today we read and listen to «${name}». I'll guide you sentence by sentence, then check you understood.`,
      story: `Today we read an extract: «${name}». Real French texts are where your French becomes rich. Let's go sentence by sentence.`
    }[kind];
    const turns = [{ t: "say", text: intro }];
    if (theme) turns.push({ t: "tip", text: `Theme: ${theme}. Before reading, think: which words would you expect to hear?` });
    const pool = lines.map(l => ({ fr: l.fr, en: l.en }));
    lines.slice(0, 10).forEach((l, i) => {
      turns.push({ t: "example", fr: l.fr, en: l.en, note: l.speaker ? `${l.speaker} says this.` : "" });
      if (i % 3 === 1 && l.en && l.fr.length <= 160) {
        const w = wrongOptions(pool, l, "en", 2);
        if (w.length === 2) turns.push({ t: "ask", q: `What does this line mean? «${l.fr}»`, choices: shuffle([l.en, ...w]), answer: l.en, right: "Exactly, you understood it without translating word by word.", wrong: `It means "${l.en}". Tap the French to hear it again and notice the key words.` });
      } else if (i % 3 === 2 && l.cloze && l.cloze.clozeAnswer && Array.isArray(l.cloze.wordBank)) {
        const opts = Array.from(new Set(l.cloze.wordBank.filter(Boolean))).slice(0, 3);
        if (opts.includes(l.cloze.clozeAnswer) && opts.length === 3) turns.push({ t: "ask", q: `Fill the gap: «${l.cloze.clozePrompt}»`, choices: shuffle(opts), answer: l.cloze.clozeAnswer, right: `Yes: «${l.fr}»`, wrong: `The missing word is «${l.cloze.clozeAnswer}»: «${l.fr}»` });
      }
    });
    const vt = vocabTip(stage);
    const vpairs = sectionBody(stage, /^vocabulaire/i).split("\n").map(x => x.replace(/^•\s*/, "").trim())
      .map(x => { const m = x.split(/\s[-–=:]\s/); return m.length >= 2 ? { fr: m[0].trim(), en: m.slice(1).join(" - ").trim() } : null; })
      .filter(v => v && v.fr && v.en && v.fr.length <= 60);
    shuffle(vpairs).slice(0, vpairs.length >= 3 ? 2 : 0).forEach(v => {
      const others = shuffle(vpairs.filter(o => o.fr !== v.fr)).slice(0, 2).map(o => o.fr);
      if (others.length === 2) turns.push({ t: "ask", q: `In this text, which expression means "${v.en}"?`, choices: shuffle([v.fr, ...others]), answer: v.fr, right: `Yes: «${v.fr}» = ${v.en}.`, wrong: `It's «${v.fr}» (${v.en}). Spot it in the text when you listen.` });
    });
    if (vt) turns.push(vt);
    const qs = sectionBody(stage, /^questions/i).split("\n").map(x => x.trim()).filter(Boolean).slice(0, 4);
    const ans = sectionBody(stage, /^r[ée]ponses/i).split("\n").map(x => x.trim()).filter(Boolean).slice(0, 4);
    if (qs.length) {
      turns.push({ t: "say", text: `Comprehension check. Answer these in your head or out loud: ${qs.map(q => `«${q.replace(/^\d+[.)]\s*/, "")}»`).join(" ")}` });
      if (ans.length) turns.push({ t: "tip", text: `Model answers: ${ans.map(a => `«${a.replace(/^\d+[.)]\s*/, "")}»`).join(" ")}` });
    }
    if (kind === "dialogue") turns.push({ t: "tip", text: "Shadowing trick: replay each line and speak AT THE SAME TIME as the speaker. Copy the melody, not only the words. Actors and interpreters train exactly like this." });
    if (kind === "dictation") turns.push({ t: "tip", text: "Dictation trick: listen to the whole sentence first, then write it in chunks of meaning. At the end, check agreements: -s, -e, -es, -ent are often silent but must be written." });
    const short = lines.filter(l => l.en && l.fr.length >= 8 && l.fr.length <= 60);
    const target = short[Math.floor(short.length / 2)] || short[0];
    turns.push({ t: "say", text: "Now you produce. Recall the line from its meaning; small accent slips are fine." });
    if (target) {
      const a = target.fr;
      turns.push({ t: "type", q: `Write in French: ${target.en}`, answer: a, accept: [a, norm(a)], hint: `It starts with «${a.split(" ").slice(0, 2).join(" ")}…»`, right: "Excellent! You rebuilt a real French line from memory.", wrong: `The line is «${a}». Read it aloud once, then move on.` });
    }
    const sp = short.filter(l => l !== target).slice(-1)[0] || target || lines[0];
    turns.push({ t: "speak", text: kind === "dialogue" && sp.speaker ? `Play ${sp.speaker}'s part. Say: «${sp.fr}»` : `Say it out loud: «${sp.fr}»`, fr: sp.fr });
    turns.push({ t: "say", text: "Well done. Next, the rounds will train every line of this text until you know it. 🙋 Ask me anything at any time!" });
    return { stageId: stage.stageId, title: stage.title, goal: `Understand and reuse the French of «${name}».`, turns, auto: true, kind: "story" };
  }

  // ---------------------------------------------------------------- boss briefing
  // Before a Guardian Boss: Camille reviews the key rule and one check question
  // from every lesson of the world, then a final production.
  function worldOf(s) { return s.worldNum || parseInt(String(s.stageId).split("-")[0], 10); }
  function bossLesson(stage) {
    const all = window.ALL_GAME_STAGES || [];
    const world = worldOf(stage);
    const siblings = all.filter(s => worldOf(s) === world && s.stageId !== stage.stageId);
    const L = window.TUTOR_LESSONS || {};
    const turns = [{ t: "say", text: `Boss briefing! Before you face «${String(stage.title).replace(/^(Guardian Boss|Grand Jury Boss)\s*:\s*/i, "")}», let's review everything from this world together. A quick recap now makes the battle much easier.` }];
    let n = 0;
    siblings.forEach(s => {
      if (n >= 6) return;
      const les = L[s.stageId];
      if (!les || !Array.isArray(les.turns)) return;
      const tip = les.turns.find(t => t.t === "tip") || les.turns.find((t, i) => i > 0 && t.t === "say");
      const asks = les.turns.filter(t => t.t === "ask" && Array.isArray(t.choices) && t.choices.includes(t.answer));
      if (!tip && !asks.length) return;
      n += 1;
      turns.push({ t: "say", text: `Quick recap of «${s.title}». ${les.goal || ""}`.trim() });
      if (tip) turns.push({ t: "tip", text: tip.text });
      if (asks.length) turns.push(Object.assign({}, asks[asks.length - 1], { choices: shuffle(asks[asks.length - 1].choices) }));
    });
    if (n < 2) {
      siblings.slice(0, 6).forEach(s => {
        const cs = cardsOf(s).filter(c => c.fr.length <= 70);
        if (cs.length < 4) return;
        const [c, d] = shuffle(cs);
        turns.push({ t: "example", fr: c.fr, en: c.en, note: `From «${s.title}»` });
        const w2 = wrongOptions(cs, d, "fr", 2);
        if (w2.length === 2) turns.push({ t: "ask", q: `How do you say: "${d.en}"?`, choices: shuffle([d.fr, ...w2]), answer: d.fr, right: "Yes! Ready for battle.", wrong: `It's «${d.fr}».` });
      });
    }
    const cs = cardsOf(stage).filter(c => c.fr.length >= 8 && c.fr.length <= 60);
    const fin = cs.length ? cs[Math.floor(Math.random() * cs.length)] : null;
    turns.push({ t: "say", text: "Last warm-up: produce French from memory, like in the battle." });
    if (fin) {
      const a = firstAlt(fin.fr);
      turns.push({ t: "type", q: `Write in French: ${fin.en}`, answer: a, accept: [a, norm(a)], hint: `It starts with «${a.split(" ").slice(0, 2).join(" ")}…»`, right: "Parfait. You're ready!", wrong: `It's «${a}». Remember it for the battle.` });
      turns.push({ t: "speak", text: `Battle cry, out loud: «${a}»`, fr: a });
    }
    turns.push({ t: "say", text: "Allez, courage ! Every mistake in the battle goes to your review deck, so nothing is wasted." });
    if (turns.length < 6) return null;
    return { stageId: stage.stageId, title: stage.title, goal: "Review the whole world before the boss.", turns, auto: true, kind: "boss" };
  }

  function getLesson(stage) {
    const L = (window.TUTOR_LESSONS || {})[stage.stageId];
    if (L && Array.isArray(L.turns) && L.turns.length) return L;
    const title = String(stage.title || "");
    if (/^(Guardian Boss|Grand Jury Boss)/i.test(title)) { const b = bossLesson(stage); if (b) return b; }
    if (stage.type === "exercise" || stage.type === "supplementary" || (stage.dialogueTurns || []).length >= 2 || /\(Part \d+\)|interview|^Dialogue|^Dictation|^Gap Fill|^Listening/i.test(title)) {
      const s = storyLesson(stage); if (s) return s;
    }
    return autoLesson(stage);
  }
  window.RPG_TUTOR_LESSON_FOR = (stageId) => { const s = (window.ALL_GAME_STAGES || []).find(x => x.stageId === stageId); return s ? getLesson(s) : null; };
  window.RPG_TUTOR_HAS_LESSON = (stageId) => !!((window.TUTOR_LESSONS || {})[stageId]);
  window.RPG_TUTOR_DONE = (stageId) => !!bag("tutorDone")[stageId];

  let T = { stageId: null, lesson: null, pos: 0, log: [], pending: false, tries: 0, right: 0, asked: 0, finished: false };

  function startLesson(stage) {
    T = { stageId: stage.stageId, lesson: getLesson(stage), pos: 0, log: [], pending: false, tries: 0, right: 0, asked: 0, finished: false };
  }
  window.restartTutorLesson = function () { T.stageId = null; if (window.setStageWave) window.setStageWave("lecon"); };

  function teacherBubble(inner, cls) { return `<div class="tb teacher ${cls || ""}"><img class="tb-av" src="${PORTRAIT}" alt="Camille"><div class="tb-body">${inner}</div></div>`; }
  function meBubble(inner, cls) { return `<div class="tb me ${cls || ""}"><div class="tb-body">${inner}</div></div>`; }

  function turnHtml(t, interactive) {
    if (t.t === "say") return rich(t.text);
    if (t.t === "tip") return `<div class="tb-tip">💡 ${rich(t.text)}</div>`;
    if (t.t === "example") return `<div class="tb-ex" onclick="window.speakFrench('${jsq(t.fr)}',1.0)"><div class="tb-ex-fr">🔊 ${esc(t.fr)}</div><div class="tb-ex-en">${esc(t.en || "")}</div>${t.note ? `<div class="tb-ex-note">${rich(t.note)}</div>` : ""}</div>
      ${interactive ? `<div class="tb-mini"><button class="btn" onclick="window.speakFrench('${jsq(t.fr)}',1.0)">🔊 Again</button><button class="btn" onclick="window.speakFrench('${jsq(t.fr)}',0.6)">🐢 Slow</button></div>` : ""}`;
    if (t.t === "ask") return `<div class="tb-q">❓ ${rich(t.q)}</div>`;
    if (t.t === "type") return `<div class="tb-q">✍️ ${rich(t.q)}</div>`;
    if (t.t === "speak") return `<div class="tb-q">🎙️ ${rich(t.text)}</div>${interactive ? `<div class="tb-mini"><button class="btn" onclick="window.speakFrench('${jsq(t.fr)}',1.0)">🔊 Model</button><button class="btn" onclick="window.speakFrench('${jsq(t.fr)}',0.6)">🐢 Slow</button></div>` : ""}`;
    return rich(t.text || "");
  }

  function controlsHtml(t) {
    if (T.pending || ["say", "tip", "example"].includes(t.t)) {
      return `<div class="tutor-controls"><button class="btn btn-gold intro-next" id="tutor-next" onclick="window.tutorContinue()">Continue ➜</button></div>`;
    }
    if (t.t === "ask") {
      if (!T.opts || T.optsFor !== T.pos) { T.opts = shuffle(t.choices || []); T.optsFor = T.pos; }
      return `<div class="tutor-controls intro-options">${T.opts.map((c, k) => `<button class="btn intro-opt tut-opt" id="tut-opt-${k}" onclick="window.tutorAnswer(${k})"><span class="intro-key">${k + 1}</span> ${esc(c)}</button>`).join("")}</div>`;
    }
    if (t.t === "type") {
      return `<div class="tutor-controls">
        <div class="intro-type-row"><input id="tut-type" class="input-french" autocomplete="off" spellcheck="false" placeholder="Type your French here…" onkeydown="if(event.key==='Enter'){event.preventDefault();window.tutorTyped();}"/><button class="btn btn-gold" onclick="window.tutorTyped()">Check</button></div>
        <div class="intro-accents">${["é", "è", "ê", "à", "â", "ç", "ù", "ô", "î", "œ", "’"].map(ch => `<button class="btn" onclick="window.insertFrenchAccent && window.insertFrenchAccent('tut-type','${ch}')">${ch}</button>`).join("")}
          <button class="btn" style="margin-left:auto;" onclick="window.tutorHint()">💡 Hint</button><button class="btn" onclick="window.tutorGiveUp()">🤷 Show me</button></div>
        <div id="tut-hint"></div></div>`;
    }
    if (t.t === "speak") {
      return `<div class="tutor-controls"><button class="btn btn-primary" id="tut-mic" onclick="window.tutorMic()">🎙️ Tap and speak</button>
        <button class="btn btn-emerald" onclick="window.tutorSaid()">✅ I said it out loud</button><div id="tut-mic-fb"></div></div>`;
    }
    return `<div class="tutor-controls"><button class="btn btn-gold" id="tutor-next" onclick="window.tutorContinue()">Continue ➜</button></div>`;
  }

  window.renderTutorLesson = function (mount, world, stage) {
    if (T.stageId !== stage.stageId && stage.stageId !== REVIEW_ID) startLesson(stage);
    const L = T.lesson;
    const total = L.turns.length;
    const pct = Math.round((Math.min(T.pos, total) / total) * 100);
    let current = "";
    if (T.pos >= total) current = finishHtml(stage);
    else {
      const t = L.turns[T.pos];
      current = (T.pending ? "" : teacherBubble(turnHtml(t, true), "current")) + controlsHtml(t);
    }
    const isDone = !!bag("tutorDone")[stage.stageId];
    mount.innerHTML = `
      <div class="arena-box tutor-box" style="background:linear-gradient(180deg,rgba(7,13,31,0.86),rgba(7,13,31,0.97)),url('assets/bg_classroom.jpg') center/cover;">
        <div class="tutor-head">
          <img class="tutor-portrait" src="${PORTRAIT}" alt="Professeur Camille">
          <div style="flex:1;min-width:200px;">
            <div class="intro-tag">${L.review ? "📕 RÉVISION AVEC CAMILLE" : `🎓 LE PROFESSEUR • ${L.auto ? "LESSON" : "GUIDED LESSON"}${isDone ? " • ✅ DONE BEFORE" : ""}`}</div>
            <h3 class="tutor-title">${esc(L.title || stage.title)}</h3>
            <div class="tutor-goal">🎯 ${rich(L.goal || "")}</div>
          </div>
          <div class="tutor-head-btns">
            <button class="btn" onclick="window.openAskTeacher()">🙋 Ask a question</button>
            ${L.review ? `<button class="btn" onclick="window.navigateScene('grimoire')">📕 Grimoire</button>` : `<button class="btn" onclick="window.setStageWave('eveil')" title="Skip to the phrase rounds">Skip ➜</button>`}
          </div>
        </div>
        <div class="intro-progress"><div style="width:${pct}%"></div></div>
        <div class="tutor-chat" id="tutor-chat">${T.log.join("")}${current}</div>
      </div>`;
    const chat = document.getElementById("tutor-chat");
    if (chat) chat.scrollTop = chat.scrollHeight;
    const cur = L.turns[T.pos];
    if (cur && !T.pending && !T.autoPlayed) {
      T.autoPlayed = true;
      if (cur.t === "example" || cur.t === "speak") say(cur.fr, 1.0);
    }
    const inp = document.getElementById("tut-type");
    if (inp && !("ontouchstart" in window)) inp.focus({ preventScroll: true });
    const nb = document.getElementById("tutor-next");
    if (nb) nb.focus({ preventScroll: true });
  };

  function rerender() {
    if (T.stageId === REVIEW_ID) { const c = document.getElementById("app-main"); if (c) window.renderTutorReview(c); return; }
    const a = window.RPG_ACTIVE ? window.RPG_ACTIVE() : {};
    const mount = document.getElementById("academy-stage-mount");
    if (mount && a.stage) window.renderTutorLesson(mount, a.world, a.stage);
  }

  // ------------------------------------------------------------------ RÉVISION AVEC CAMILLE
  // A guided review lesson built from YOUR mistakes and due cards.
  const REVIEW_ID = "__review__";
  function reviewItems() {
    const s = save();
    const usable = (e) => e && e.fr && e.en && String(e.en).trim().length > 1 && String(e.fr).length <= 80;
    const mistakes = Object.values(s.mistakeVault || {}).filter(usable).sort((a, b) => (b.misses || 1) - (a.misses || 1));
    const now = Date.now();
    const due = Object.values(s.fsrsCards || {}).filter(e => usable(e) && (e.due || 0) <= now);
    const seen = new Set();
    const out = [];
    mistakes.concat(due).forEach(e => { const k = norm(e.fr); if (!seen.has(k) && out.length < 6) { seen.add(k); out.push(e); } });
    return out;
  }
  window.RPG_REVIEW_COUNT = () => reviewItems().length;
  function buildReview(items) {
    const pool = items.concat(((window.ALEXA_COURSE_DATA || {}).flashcards || []).slice(0, 400));
    const turns = [{ t: "say", text: `Let's fix ${items.length} thing${items.length > 1 ? "s" : ""} you found hard. Mistakes are the fastest way to learn: each one we fix now will stick.` }];
    items.forEach((it, i) => {
      const fr = firstAlt(it.fr);
      turns.push({ t: "example", fr: it.fr, en: it.en, note: it.misses ? `You missed this ${it.misses} time${it.misses > 1 ? "s" : ""}. Listen, then repeat it out loud.` : (it.note || "") });
      if (i % 2 === 0) {
        const w = wrongOptions(pool, it, "fr", 2);
        if (w.length === 2) turns.push({ t: "ask", q: `How do you say: "${it.en}"?`, choices: shuffle([it.fr, ...w]), answer: it.fr, right: "Yes! That one is getting stronger.", wrong: `It's «${it.fr}». We'll see it again soon.` });
        else turns.push({ t: "type", q: `Write in French: ${it.en}`, answer: fr, accept: [fr], hint: `It starts with «${fr.split(" ").slice(0, 2).join(" ")}…»`, right: "Excellent!", wrong: `It's «${fr}».` });
      } else {
        turns.push({ t: "type", q: `Write in French: ${it.en}`, answer: fr, accept: [fr], hint: `It starts with «${fr.split(" ").slice(0, 2).join(" ")}…»`, right: "Excellent! Writing it fixes it in your memory.", wrong: `It's «${fr}». Look at each word, then say it out loud.` });
      }
    });
    turns.push({ t: "speak", text: `Last one, out loud: «${firstAlt(items[0].fr)}».`, fr: firstAlt(items[0].fr) });
    turns.push({ t: "say", text: "Bravo ! Phrases you get right twice leave your mistake list. The rest come back tomorrow." });
    return { stageId: REVIEW_ID, title: "Révision avec Camille", goal: "Fix your mistakes from the last days, one by one.", turns, auto: false, review: true };
  }
  window.startReviewLesson = function () {
    const items = reviewItems();
    if (!items.length) { if (window.RPG_VFX) window.RPG_VFX.toast("Nothing to review", "No mistakes waiting. Impeccable !", "✨"); return false; }
    T = { stageId: REVIEW_ID, lesson: buildReview(items), pos: 0, log: [], pending: false, tries: 0, right: 0, asked: 0, finished: false };
    if (window.navigateScene) window.navigateScene("revision");
    return true;
  };
  window.renderTutorReview = function (container) {
    if (T.stageId !== REVIEW_ID) {
      const items = reviewItems();
      if (!items.length) {
        container.innerHTML = `<div class="arena-box tutor-box"><div class="tutor-head"><img class="tutor-portrait" src="${PORTRAIT}" alt=""><div><div class="intro-tag">📕 RÉVISION AVEC CAMILLE</div><h3 class="tutor-title">Nothing to review right now</h3><div class="tutor-goal">Your mistakes come here automatically. Come back after your next stage.</div></div></div>
          <div class="tutor-controls"><button class="btn btn-gold" onclick="window.continueJourney()">▶ Continue my journey</button></div></div>`;
        return;
      }
      T = { stageId: REVIEW_ID, lesson: buildReview(items), pos: 0, log: [], pending: false, tries: 0, right: 0, asked: 0, finished: false };
    }
    container.innerHTML = `<div id="academy-stage-mount"></div>`;
    window.renderTutorLesson(document.getElementById("academy-stage-mount"), null, { stageId: REVIEW_ID, title: "Révision avec Camille" });
  };

  window.tutorContinue = function () {
    const t = T.lesson.turns[T.pos];
    if (!T.pending && t) T.log.push(teacherBubble(turnHtml(t, false)));
    T.pending = false;
    T.pos += 1;
    T.tries = 0;
    T.autoPlayed = false;
    rerender();
  };

  function feedback(ok, t, mine, msg) {
    T.log.push(teacherBubble(turnHtml(t, false)));
    if (mine) T.log.push(meBubble(esc(mine), ok ? "ok" : "bad"));
    const explainQ = `I didn't get this: "${t.q || t.text || ""}". The answer is "${t.answer || t.fr || ""}". Can you explain why, simply, with 2 more examples?`;
    T.log.push(teacherBubble(`<div class="tb-fb ${ok ? "ok" : "bad"}">${ok ? "✅" : "💬"} ${rich(msg || "")}</div>${!ok ? `<button class="btn why-btn" onclick="window.openAskTeacher('${jsq(explainQ)}', true)">❓ Explain more</button>` : ""}`, ok ? "fb-ok" : "fb-bad"));
    T.pending = true;
    const a = API();
    if (ok) {
      T.right += 1;
      if (a.addXP) a.addXP(12, 3);
      if (window.RPG_SFX) window.RPG_SFX.matchCombo(Math.min(8, T.right));
      if (window.RPG_VFX) window.RPG_VFX.floatText(PRAISE[T.right % PRAISE.length], "#6ee7b7");
    } else if (window.RPG_SFX) window.RPG_SFX.damageHit();
    if ((t.t === "ask" || t.t === "type") && window.recordLearningOutcome) {
      const fr = (t.t === "type" || T.stageId === REVIEW_ID) ? t.answer : (/[àâçéèêëîïôûùœ]|^(le|la|les|un|une|je|tu|il|elle|nous|vous|on|c'est|j')/i.test(t.answer) ? t.answer : "");
      if (fr) window.recordLearningOutcome(`tutor_${norm(fr).slice(0, 40)}`, fr, t.q || "", ok, "tutor", (a.campaignCefr && a.campaignCefr()) || "A1");
    }
    rerender();
  }

  window.tutorAnswer = function (k) {
    const t = T.lesson.turns[T.pos];
    if (!t || t.t !== "ask" || T.pending) return;
    T.asked += 1;
    const choice = T.opts[k];
    const ok = norm(choice) === norm(t.answer);
    if (/[àâçéèêëîïôûùœ]|^(le|la|les|un|une|je|tu|il|elle|nous|vous|on)\b/i.test(t.answer)) say(t.answer, 1.0);
    feedback(ok, t, choice, ok ? (t.right || "Exactly!") : (t.wrong || `The answer is «${t.answer}».`));
  };
  function typedOk(t, val) {
    const v = norm(val);
    return [t.answer].concat(t.accept || []).map(norm).includes(v);
  }
  window.tutorTyped = function () {
    const t = T.lesson.turns[T.pos];
    const inp = document.getElementById("tut-type");
    if (!t || t.t !== "type" || !inp || !inp.value.trim()) return;
    const val = inp.value.trim();
    if (typedOk(t, val)) {
      T.asked += 1;
      const accentsOk = [t.answer].concat(t.accept || []).some(a => normAcc(a) === normAcc(val));
      say(t.answer, 1.0);
      feedback(true, t, val, (t.right || "Correct!") + (accentsOk ? "" : ` Watch the accents: «${t.answer}».`));
    } else if (T.tries === 0) {
      T.tries = 1;
      const h = document.getElementById("tut-hint");
      if (h) h.innerHTML = `<div class="feedback-banner err">Not quite. ${rich(t.hint || "Try once more.")} <button class="btn" onclick="window.speakFrench('${jsq(t.answer)}',0.6)">🐢 Hear it slowly</button></div>`;
      if (window.RPG_SFX) window.RPG_SFX.damageHit();
    } else {
      T.asked += 1;
      say(t.answer, 1.0);
      feedback(false, t, val, (t.wrong || "") + ` The answer: «${t.answer}».`);
    }
  };
  window.tutorHint = function () {
    const t = T.lesson.turns[T.pos];
    const h = document.getElementById("tut-hint");
    if (h && t) h.innerHTML = `<div class="feedback-banner ok">💡 ${rich(t.hint || `It starts with «${String(t.answer).slice(0, 4)}…»`)}</div>`;
  };
  window.tutorGiveUp = function () {
    const t = T.lesson.turns[T.pos];
    if (!t) return;
    T.asked += 1;
    say(t.answer, 1.0);
    feedback(false, t, "🤷", (t.wrong || "") + ` The answer: «${t.answer}». Say it out loud once.`);
  };
  window.tutorSaid = function () {
    const t = T.lesson.turns[T.pos];
    if (!t) return;
    const s = save();
    if (s.stats) s.stats.phrasesSpoken = (s.stats.phrasesSpoken || 0) + 1;
    feedback(true, t, "🗣️ (said it out loud)", "Bien ! Saying it out loud is how your mouth learns French.");
  };
  window.tutorMic = function () {
    const t = T.lesson.turns[T.pos];
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const fb = document.getElementById("tut-mic-fb");
    if (!SR) { if (fb) fb.innerHTML = `<div class="feedback-banner warn">No microphone in this browser. Say it out loud, then tap ✅.</div>`; return; }
    try {
      const rec = new SR();
      rec.lang = "fr-FR"; rec.maxAlternatives = 4; rec.interimResults = false;
      const btn = document.getElementById("tut-mic");
      if (btn) { btn.textContent = "🎙️ Listening…"; btn.classList.add("listening"); }
      rec.onresult = (ev) => {
        const alts = Array.from(ev.results[0] || []).map(a => a.transcript);
        const sim = (x) => (window.RPG_PHRASE_SIMILARITY ? window.RPG_PHRASE_SIMILARITY(x, t.fr) : 0);
        const best = alts.sort((a, b) => sim(b) - sim(a))[0] || "";
        const sc = sim(best);
        const s = save();
        if (s.stats) s.stats.phrasesSpoken = (s.stats.phrasesSpoken || 0) + 1;
        if (sc >= 0.6) feedback(true, t, `🎙️ « ${best} »`, sc >= 0.9 ? "Très clair ! The microphone understood every word." : "Good! Most words came through. Listen once more and copy the rhythm.");
        else if (fb) fb.innerHTML = `<div class="feedback-banner warn">I heard: « ${esc(best)} ». Listen to the model 🐢 and try again, or tap ✅.</div>`;
      };
      rec.onerror = () => { if (fb) fb.innerHTML = `<div class="feedback-banner warn">I couldn't hear you. Try again or tap ✅.</div>`; };
      rec.onend = () => { const b = document.getElementById("tut-mic"); if (b) { b.textContent = "🎙️ Tap and speak"; b.classList.remove("listening"); } };
      rec.start();
    } catch (e) { if (fb) fb.innerHTML = `<div class="feedback-banner warn">Microphone error. Tap ✅ after saying it.</div>`; }
  };

  function finishHtml(stage) {
    if (T.stageId === REVIEW_ID) {
      if (!T.finished) {
        T.finished = true;
        const s = save();
        if (s.stats) s.stats.reviewsDone = (s.stats.reviewsDone || 0) + 1;
        if (API().addXP) API().addXP(40, 10);
        if (API().persistSave) API().persistSave();
        if (window.RPG_SFX) window.RPG_SFX.victoryFanfare();
      }
      return teacherBubble(`<div class="tb-finish"><div class="intro-tag">RÉVISION TERMINÉE</div><div class="intro-fr" style="cursor:default;">${T.right >= T.asked - 1 ? "Superbe !" : "On progresse !"}</div>
        <div class="intro-stats"><div><b>${T.right} / ${T.asked}</b><span>fixed today</span></div><div><b>${reviewItems().length}</b><span>still to master</span></div></div></div>`) +
        `<div class="tutor-controls"><button class="btn btn-gold intro-next" id="tutor-next" onclick="window.continueJourney()">▶ Continue my journey</button>
         <button class="btn" onclick="window.navigateScene('grimoire')">📕 Full Grimoire</button></div>`;
    }
    const done = bag("tutorDone");
    if (!T.finished) {
      T.finished = true;
      const first = !done[stage.stageId];
      done[stage.stageId] = { right: T.right, asked: T.asked, at: Date.now() };
      const a = API();
      if (first && a.addXP) a.addXP(60, 15);
      const s = save();
      if (s.stats && first) s.stats.lessonsTaught = (s.stats.lessonsTaught || 0) + 1;
      if (a.persistSave) a.persistSave();
      if (window.RPG_SFX) window.RPG_SFX.victoryFanfare();
      if (window.RPG_VFX) window.RPG_VFX.burst(window.innerWidth / 2, window.innerHeight * 0.4, "#fde047", 36);
    }
    const acc = T.asked ? Math.round((T.right / T.asked) * 100) : 100;
    return teacherBubble(`<div class="tb-finish"><div class="intro-tag">LEÇON TERMINÉE</div>
      <div class="intro-fr" style="cursor:default;">${acc >= 85 ? "Excellent travail !" : acc >= 60 ? "Très bien !" : "Bon début, on continue !"}</div>
      <div class="intro-stats"><div><b>${T.right} / ${T.asked}</b><span>questions right</span></div></div>
      <p>Now practise every phrase of this stage. I'm right here if you have a question (🙋).</p></div>`) +
      `<div class="tutor-controls"><button class="btn btn-gold intro-next" id="tutor-next" onclick="window.setStageWave('eveil')">⚡ Practise the phrases ➜</button>
       <button class="btn" onclick="window.restartTutorLesson()">↻ Replay lesson</button>
       <button class="btn" onclick="window.navigateScene('grammar')">📘 Ma Grammaire</button></div>`;
  }
  window.RPG_TUTOR_STATE = function () {
    const t = T.lesson && T.lesson.turns[T.pos];
    return { stageId: T.stageId, pos: T.pos, total: T.lesson ? T.lesson.turns.length : 0, t: t ? t.t : null, pending: T.pending, answer: t ? (t.answer || t.fr || null) : null, choices: T.opts || null, right: T.right, finished: T.finished, auto: !!(T.lesson && T.lesson.auto) };
  };

  window.addEventListener("keydown", (e) => {
    if (!document.getElementById("tutor-chat")) return;
    const tag = (e.target && e.target.tagName) || "";
    if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
    if (/^[1-4]$/.test(e.key) && document.getElementById(`tut-opt-${Number(e.key) - 1}`)) { e.preventDefault(); window.tutorAnswer(Number(e.key) - 1); }
    else if (e.key === "Enter") { const nb = document.getElementById("tutor-next"); if (nb && document.activeElement !== nb) { e.preventDefault(); nb.click(); } }
  });

  // ------------------------------------------------------------------ ASK CAMILLE
  const ask = { open: false, log: [], busy: false, lastWrong: "", prefill: "" };
  function serverAI() { return location.protocol !== "file:" && window.RPG_SERVER && window.RPG_SERVER.online; }

  function context() {
    const ctx = { scene: window.RPG_CURRENT_SCENE ? window.RPG_CURRENT_SCENE() : "", cefr: (API().campaignCefr && API().campaignCefr()) || "A1" };
    try {
      const a = window.RPG_ACTIVE ? window.RPG_ACTIVE() : null;
      if (a && a.stage) { ctx.stage = `${a.stage.stageCode} ${a.stage.title}`; ctx.world = a.world ? a.world.title : ""; }
    } catch (e) {}
    const tt = T.lesson && T.lesson.turns[T.pos];
    if (ctx.scene === "academy" && tt) ctx.lessonTurn = tt.text || tt.q || tt.fr || "";
    try { const s = window.RPG_INTRO_STATE && window.RPG_INTRO_STATE(); if (s && s.fr) ctx.card = `${s.fr} = ${s.en}`; } catch (e) {}
    if (ask.lastWrong) ctx.lastWrong = ask.lastWrong;
    return ctx;
  }
  function tutorSystem(ctx) {
    return [
      "You are Camille, a warm, patient, expert French teacher (FLE) tutoring ONE learner whose goal is native-level French.",
      `Learner level: ${ctx.cefr}. Explain in simple English for A1-A2 (more French for B1+, mostly French for B2+), always with short French examples in «guillemets».`,
      "Be concrete and short (max ~120 words in answer_en). Teach the rule, the why, a memory trick, and the typical English-speaker mistake when relevant.",
      "Always give 2-3 correct examples with translations, and one quick check question (3 choices) to verify understanding.",
      "If the learner writes in French, gently correct it first. Never invent facts; French must be 100% correct.",
      `Context (what the learner is looking at): ${JSON.stringify(ctx).slice(0, 900)}`
    ].join("\n");
  }

  // Offline: search the course notes and phrases.
  let IDX = null;
  const STOP = new Set("the a an is are what why how do does to of in on and or i you me my it this that with for be can say mean means word french english when use which de la le les un une des et est du que qui pas pour ce explain please rule".split(" "));
  function terms(q) { return norm(q).split(" ").filter(w => w.length > 1 && !STOP.has(w)); }
  function buildIndex() {
    IDX = { bites: [], cards: [] };
    (window.ALL_GAME_STAGES || []).forEach(st => {
      let bites = [];
      try { bites = window.RPG_BUILD_BITES ? window.RPG_BUILD_BITES(st) : []; } catch (e) {}
      bites.forEach(b => {
        if (b.goal) return;
        const text = b.title + " " + b.rows.map(r => r.kind === "pair" ? `${r.fr} ${r.en}` : r.text).join(" ");
        IDX.bites.push({ st, b, n: norm(text), nt: norm(b.title) });
      });
    });
    const seen = new Set();
    ((window.ALEXA_COURSE_DATA || {}).flashcards || []).forEach(c => {
      if (!c || !c.fr || !c.en) return;
      const k = norm(c.fr);
      if (seen.has(k) || k.length > 80) return;
      seen.add(k);
      IDX.cards.push({ c, nf: k, ne: norm(c.en) });
    });
  }
  function offlineAnswer(q) {
    if (!IDX) buildIndex();
    const ts = terms(q);
    const quoted = (q.match(/[«"“]([^»"”]{2,60})[»"”]/) || [])[1];
    const ctx = context();
    const cur = ctx.stage ? ctx.stage.split(" ")[0] : "";
    const scoreText = (n) => ts.reduce((s, w) => s + ((" " + n + " ").includes(" " + w) ? (w.length > 4 ? 2 : 1) : 0), 0);
    const titleScore = (nt) => ts.reduce((s, w) => s + ((" " + nt + " ").includes(" " + w + " ") ? 4 : 0), 0);
    const bites = IDX.bites.map(x => ({ x, s: scoreText(x.n) + titleScore(x.nt) + (x.st.stageCode === cur ? 1 : 0) })).filter(y => y.s >= 2).sort((a, b) => b.s - a.s).slice(0, 2);
    let cards = [];
    if (quoted) { const k = norm(quoted); cards = IDX.cards.filter(y => y.nf === k || y.ne === k).slice(0, 3); }
    if (!cards.length) cards = IDX.cards.map(y => ({ y, s: ts.reduce((s, w) => s + ((" " + y.nf + " ").includes(" " + w + " ") ? 2 : 0) + ((" " + y.ne + " ").includes(" " + w + " ") ? 1 : 0), 0) })).filter(z => z.s >= 2).sort((a, b) => b.s - a.s || a.y.nf.length - b.y.nf.length).slice(0, 4).map(z => z.y);
    return { offline: true, bites: bites.map(y => y.x), cards: cards.map(y => y.c) };
  }

  function ensureFab() {
    if (document.getElementById("ask-fab") || !document.body) return;
    const b = document.createElement("button");
    b.id = "ask-fab";
    b.className = "ask-fab";
    b.innerHTML = `<img src="${PORTRAIT}" alt=""><span>🙋 Ask Camille</span>`;
    b.onclick = () => window.openAskTeacher();
    document.body.appendChild(b);
    const p = document.createElement("div");
    p.id = "ask-panel";
    p.className = "ask-panel";
    document.body.appendChild(p);
  }
  function askMsgHtml(m) {
    if (m.who === "me") return meBubble(esc(m.text));
    if (m.who === "sys") return `<div class="ask-sys">${esc(m.text)}</div>`;
    const d = m.data || {};
    if (d.offline) {
      let h = "";
      if (!d.bites.length && !d.cards.length) h += `I couldn't find that in your course notes. Try one key word (for example «passé composé», «du», «tu vous»), or start the game from the desktop so the AI teacher can answer any question.`;
      else h += `Here is what your course says:`;
      if (d.cards.length) h += `<div class="ask-cards">${d.cards.map(c => `<div class="tb-ex" onclick="window.speakFrench('${jsq(c.fr)}',1.0)"><div class="tb-ex-fr">🔊 ${esc(c.fr)}</div><div class="tb-ex-en">${esc(c.en)}</div>${c.note ? `<div class="tb-ex-note">${esc(c.note)}</div>` : ""}</div>`).join("")}</div>`;
      d.bites.forEach(x => {
        h += `<div class="ask-note"><div class="intro-tag">📘 Stage ${esc(x.st.stageCode)}: ${esc(x.b.title)}</div>${x.b.rows.slice(0, 7).map(r => r.kind === "pair" ? `<div class="bite-pair" onclick="window.speakFrench('${jsq(r.fr)}',1.0)"><span class="bite-fr">🔊 ${esc(r.fr)}</span><span class="bite-en">${esc(r.en)}</span></div>` : `<div class="bite-text">${esc(r.text)}</div>`).join("")}
          <button class="btn" onclick="window.closeAskTeacher();window.launchStageById('${jsq(x.st.stageId)}', true)">Open this stage ➜</button></div>`;
      });
      if (!serverAI()) h += `<div class="ask-sys">💡 For full answers to any question, open the game with the desktop shortcut “L'Odyssée Française” (it connects the AI teacher).</div>`;
      return teacherBubble(h);
    }
    let h = `<div>${rich(d.answer_en || "")}</div>`;
    if (Array.isArray(d.examples) && d.examples.length) h += `<div class="ask-cards">${d.examples.map(e => `<div class="tb-ex" onclick="window.speakFrench('${jsq(e.fr)}',1.0)"><div class="tb-ex-fr">🔊 ${esc(e.fr)}</div><div class="tb-ex-en">${esc(e.en || "")}</div></div>`).join("")}</div>`;
    if (d.check && Array.isArray(d.check.choices) && d.check.choices.length) {
      h += `<div class="ask-check"><div class="tb-q">❓ ${rich(d.check.q)}</div>${d.check.choices.map((c, k) => `<button class="btn intro-opt" ${m.checked != null ? "disabled" : ""} onclick="window.askCheck(${m.id},${k})">${esc(c)}</button>`).join("")}
        ${m.checked != null ? `<div class="tb-fb ${m.checkedOk ? "ok" : "bad"}">${m.checkedOk ? "✅ Exactly!" : `💬 It's «${esc(d.check.answer)}».`} ${rich(d.check.why || "")}</div>` : ""}</div>`;
    }
    if (Array.isArray(d.follow_ups) && d.follow_ups.length) h += `<div class="ask-chips">${d.follow_ups.slice(0, 3).map(f => `<button class="btn" onclick="window.askSend('${jsq(f)}')">${esc(f)}</button>`).join("")}</div>`;
    return teacherBubble(h);
  }
  function renderAsk() {
    ensureFab();
    const p = document.getElementById("ask-panel");
    if (!p) return;
    p.classList.toggle("open", ask.open);
    if (!ask.open) { p.innerHTML = ""; return; }
    const ctx = context();
    p.innerHTML = `
      <div class="ask-head"><img src="${PORTRAIT}" alt=""><div style="flex:1;"><b>Professeur Camille</b><div class="ask-sub">${serverAI() ? "🟢 AI teacher connected" : "📘 Offline: answers from your course notes"}${ctx.stage ? ` • ${esc(ctx.stage)}` : ""}</div></div>
        <button class="btn" onclick="window.closeAskTeacher()">✕</button></div>
      <div class="ask-log" id="ask-log">${ask.log.length ? ask.log.map(askMsgHtml).join("") : teacherBubble(`Bonjour ! Ask me anything about French, in English or in French. For example: <i>“Why «la» and not «le»?”</i>, <i>“When do I use «tu» or «vous»?”</i>, <i>“How do I pronounce «deux»?”</i>`)}${ask.busy ? `<div class="ask-sys">Camille is writing…</div>` : ""}</div>
      <div class="ask-chips">${["Explain this more simply", "Give me 3 more examples", "How do I pronounce it?", "Quiz me on this"].map(c => `<button class="btn" onclick="window.askSend('${jsq(c)}')">${c}</button>`).join("")}</div>
      <div class="ask-input"><input id="ask-input" class="input-french" placeholder="Type your question…" autocomplete="off" onkeydown="if(event.key==='Enter'){event.preventDefault();window.askSend();}"><button class="btn btn-gold" onclick="window.askSend()">Send</button></div>`;
    const lg = document.getElementById("ask-log");
    if (lg) lg.scrollTop = lg.scrollHeight;
    const inp = document.getElementById("ask-input");
    if (inp && ask.prefill) { inp.value = ask.prefill; ask.prefill = ""; }
    if (inp) inp.focus({ preventScroll: true });
  }
  window.openAskTeacher = function (prefill, autoSend) {
    ask.open = true;
    if (prefill && autoSend) { renderAsk(); window.askSend(prefill); return; }
    ask.prefill = prefill || "";
    renderAsk();
  };
  window.closeAskTeacher = function () { ask.open = false; renderAsk(); };
  let msgId = 0;
  window.askSend = async function (text) {
    const inp = document.getElementById("ask-input");
    const q = String(text || (inp ? inp.value : "")).trim();
    if (!q || ask.busy) return;
    ask.log.push({ who: "me", text: q });
    const s = save();
    if (s.stats) s.stats.questionsAsked = (s.stats.questionsAsked || 0) + 1;
    ask.busy = true;
    renderAsk();
    let data = null;
    if (serverAI() && !(window.RPG_SERVER && window.RPG_SERVER.cloudPwa)) {
      try {
        const ctx = context();
        const hist = ask.log.slice(-6).map(m => m.who === "me" ? `Learner: ${m.text}` : (m.data && m.data.answer_en ? `Camille: ${m.data.answer_en}` : "")).filter(Boolean).join("\n");
        const r = await fetch("/api/tutor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ system: tutorSystem(ctx), conversation: hist }) });
        const j = await r.json();
        if (j.ok && j.data) data = j.data;
        else if (j.error === "NO_KEY") ask.log.push({ who: "sys", text: "The AI teacher needs your key (Connect AI Partner on your Desktop). Meanwhile, here is what your notes say:" });
        else if (j.error === "BUSY") ask.log.push({ who: "sys", text: "Google's AI is busy for a moment. Here is what your notes say; ask again in a few seconds for a full answer:" });
      } catch (e) { /* fall back to notes */ }
    }
    if (!data) data = offlineAnswer(q);
    ask.log.push({ who: "ai", data, id: ++msgId });
    ask.busy = false;
    if (API().addXP) API().addXP(5, 1);
    if (API().persistSave) API().persistSave();
    renderAsk();
    if (data && data.examples && data.examples[0]) say(data.examples[0].fr, 1.0);
  };
  window.askCheck = function (id, k) {
    const m = ask.log.find(x => x.id === id);
    if (!m || m.checked != null) return;
    m.checked = k;
    m.checkedOk = norm(m.data.check.choices[k]) === norm(m.data.check.answer);
    if (m.checkedOk && API().addXP) API().addXP(10, 2);
    renderAsk();
  };
  window.RPG_ASK_STATE = () => ({ open: ask.open, n: ask.log.length, last: ask.log[ask.log.length - 1] || null, server: serverAI() });

  // ------------------------------------------------------------------ "Why?" on every wrong answer
  function addWhy(el) {
    if (!el || el.dataset.why || el.closest("#ask-panel") || el.closest(".tutor-box")) return;
    if (!el.offsetParent) return;
    el.dataset.why = "1";
    const txt = el.innerText.replace(/\s+/g, " ").trim().slice(0, 260);
    ask.lastWrong = txt;
    const b = document.createElement("button");
    b.className = "btn why-btn";
    b.textContent = "❓ Why? Ask Camille";
    b.onclick = (ev) => { ev.stopPropagation(); window.openAskTeacher(`I got this wrong: "${txt}". Why? Explain the rule simply with 2 examples.`, true); };
    el.appendChild(b);
  }
  let whyTimer = null;
  const mo = new MutationObserver(() => {
    clearTimeout(whyTimer);
    whyTimer = setTimeout(() => document.querySelectorAll(".feedback-banner.err:not([data-why])").forEach(addWhy), 60);
  });
  function boot() {
    ensureFab();
    mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["style"] });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();

  // ------------------------------------------------------------------ 📘 MA GRAMMAIRE
  const gb = { q: "", studied: false, open: {} };
  window.renderGrammarBook = function (container) {
    const lessons = ((window.ALEXA_COURSE_DATA || {}).lessons || []);
    const seen = bag("bitesSeen");
    const done = bag("tutorDone");
    const qn = norm(gb.q);
    let total = 0, shown = 0;
    const worlds = lessons.map(w => {
      const stages = (w.stages || []).map(st => {
        let bites = [];
        try { bites = (window.RPG_BUILD_BITES ? window.RPG_BUILD_BITES(st) : []).filter(b => !b.goal); } catch (e) {}
        total += bites.length;
        const studied = (seen[st.stageId] || 0) > 0 || !!done[st.stageId];
        if (gb.studied && !studied) return null;
        if (qn) bites = bites.filter(b => norm(b.title + " " + b.rows.map(r => r.kind === "pair" ? r.fr + " " + r.en : r.text).join(" ")).includes(qn));
        if (!bites.length) return null;
        shown += bites.length;
        return { st, bites, studied };
      }).filter(Boolean);
      return stages.length ? { w, stages } : null;
    }).filter(Boolean);
    const shownWorlds = qn ? worlds.slice(0, 25) : worlds;
    const body = shownWorlds.map(({ w, stages }) => `
      <div class="gb-world"><div class="gb-wtitle">${w.native ? (w.region === "academie" ? "🏝️" : "🗼") : "📗"} World ${w.number}: ${esc(w.title)} <span class="badge-cefr badge-${esc(w.cefr)}">${esc(w.cefr)}</span></div>
        ${stages.map(({ st, bites, studied }) => {
          const open = qn || gb.open[st.stageId];
          return `<div class="gb-stage ${studied ? "studied" : ""}">
            <button class="gb-stitle" onclick="window.gbToggle('${jsq(st.stageId)}')">${open ? "▾" : "▸"} ${esc(st.stageCode)} • ${esc(st.title)} <span class="gb-count">${bites.length} card${bites.length > 1 ? "s" : ""}${studied ? " • ✅ studied" : ""}</span></button>
            ${open ? bites.slice(0, 30).map(b => `<div class="gb-bite"><div class="gb-btitle">${esc(b.title)}${b.part ? ` (${esc(b.part)})` : ""}</div>${b.rows.map(r => r.kind === "pair" ? `<div class="bite-pair" onclick="window.speakFrench('${jsq(r.fr)}',1.0)"><span class="bite-fr">🔊 ${esc(r.fr)}</span><span class="bite-en">${esc(r.en)}</span></div>` : `<div class="bite-text ${r.fr ? "fr" : ""}" ${r.fr ? `onclick="window.speakFrench('${jsq(r.text)}',1.0)"` : ""}>${r.fr ? "🔊 " : ""}${esc(r.text)}</div>`).join("")}
              <div class="gb-actions"><button class="btn" onclick="window.openAskTeacher('${jsq(`Explain this rule simply: ${b.title} (${st.title})`)}', true)">🙋 Ask Camille</button><button class="btn" onclick="window.launchStageById('${jsq(st.stageId)}', true)">Practise ➜</button></div></div>`).join("") : ""}
          </div>`;
        }).join("")}
      </div>`).join("");
    container.innerHTML = `
      <div class="arena-box gb-box">
        <div class="tutor-head">
          <img class="tutor-portrait" src="${PORTRAIT}" alt="">
          <div style="flex:1;"><div class="intro-tag">📘 MA GRAMMAIRE</div><h3 class="tutor-title">Every rule of your course, in one place</h3>
          <div class="tutor-goal">${total} rule cards • search any word (French or English) • tap French to hear it</div></div>
        </div>
        <div class="gb-tools"><input id="gb-q" class="input-french" placeholder="Search: passé composé, du / de la, tu vous, adjectifs…" value="${esc(gb.q)}" oninput="window.gbSearch(this.value)">
          <label class="gb-check"><input type="checkbox" ${gb.studied ? "checked" : ""} onchange="window.gbStudied(this.checked)"> Only what I've studied</label></div>
        <div class="gb-meta">${qn ? `${shown} result${shown === 1 ? "" : "s"}` : ""}</div>
        <div class="gb-list">${body || `<div class="ask-sys">Nothing found. Try a shorter word.</div>`}</div>
      </div>`;
    const inp = document.getElementById("gb-q");
    if (inp && gb.focus) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); gb.focus = false; }
  };
  const gbRerender = () => { const c = document.getElementById("app-main"); if (c) window.renderGrammarBook(c); };
  let gbTimer = null;
  window.gbSearch = function (v) { gb.q = v; gb.focus = true; clearTimeout(gbTimer); gbTimer = setTimeout(gbRerender, 250); };
  window.gbStudied = function (v) { gb.studied = !!v; gbRerender(); };
  window.gbToggle = function (id) { gb.open[id] = !gb.open[id]; gbRerender(); };
})();
