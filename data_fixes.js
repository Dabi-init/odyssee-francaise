// =============================================================================
// DATA FIXES: cleans junk "phrase cards" that came from the course guides
// (speaker names stored as French, multiple-choice letters like "A. How are you?",
// grammar-rule sentences stored as phrases, Name = Name). The course data file is
// not modified; cards are filtered at load time. Dialogue lines removed from the
// phrase pool still exist in the exercise stages' dialogues.
// =============================================================================
(function () {
  const DATA = window.ALEXA_COURSE_DATA;
  if (!DATA || !Array.isArray(DATA.lessons)) return;
  const EN = new Set("the you is are and of to my your what how where i we they this that it with for in on was have has be do does".split(" "));
  const FRH = /[àâçéèêëîïôûùœ]|\b(je|tu|il|elle|nous|vous|ils|le|la|les|un|une|des|est|et|de|du|pas|c'est|j'ai|suis|moi|toi|bonjour|salut|oui|non)\b/i;
  const words = (s) => String(s).toLowerCase().match(/[a-zà-ÿœ']+/g) || [];
  function junkReason(c) {
    const fr = String((c && c.fr) || "").trim();
    const en = String((c && c.en) || "").trim();
    if (!fr || !en) return "empty";
    if (/^[A-H][.)]\s/.test(en) || /^[A-H][.)]\s/.test(fr)) return "mcq_letter";
    if (fr.toLowerCase() === en.toLowerCase()) return "same";
    const fw = words(fr), ew = words(en);
    if (fw.length <= 2 && ew.length >= 3 && FRH.test(en) && !ew.some(w => EN.has(w))) return "speaker_or_grapheme";
    if (/^(que becomes|equality is|remember|in a question|the passé)/i.test(fr)) return "rule_text";
    if (fw.filter(w => EN.has(w)).length >= 2 && !FRH.test(fr.replace(/qu'/gi, ""))) return "rule_text";
    return null;
  }
  const stats = {};
  // Re-aligned translations (source guides had EN shifted by one in some runs).
  const AL = window.ODYSSEE_CARD_ALIGN || { align: {}, drop: {} };
  const alignAll = {};
  Object.keys(AL.align || {}).forEach(sid => Object.assign(alignAll, AL.align[sid]));
  DATA.lessons.forEach(l => (l.stages || []).forEach(s => {
    if (!Array.isArray(s.cards)) return;
    const fix = (AL.align || {})[s.stageId], dr = new Set((AL.drop || {})[s.stageId] || []);
    if (fix) s.cards.forEach(c => { if (c && fix[c.fr] && c.en !== fix[c.fr]) { c.en = fix[c.fr]; stats.realigned = (stats.realigned || 0) + 1; } });
    if (dr.size) { const k = s.cards.filter(c => !(c && dr.has(c.fr))); stats.dropped = (stats.dropped || 0) + (s.cards.length - k.length); if (k.length >= 3) s.cards = k; }
  }));
  if (Array.isArray(DATA.flashcards)) DATA.flashcards.forEach(c => { if (c && alignAll[c.fr]) c.en = alignAll[c.fr]; });
  // Clean glued English suffixes/prefixes and minor French grammar typos on c.fr AFTER alignment keys match.
  const FR_CLEAN = {
    "un chata cat": "un chat",
    "une maisona house": "une maison",
    "des pommessome apples": "des pommes",
    "la voiture de mon pèrethe car of my father": "la voiture de mon père",
    "la voiture du père de mon amithe car of the father of my friend": "la voiture du père de mon ami",
    "une douzaine d’œufsa dozen eggs": "une douzaine d’œufs",
    "une douzaine d'œufsa dozen eggs": "une douzaine d'œufs",
    "Lavez-vous ! Get washed!": "Lavez-vous !",
    "Charlotte me donne une pomme.Charlotte gives me an apple.": "Charlotte me donne une pomme.",
    "ma propre petite voiture blanchemy own little white car": "ma propre petite voiture blanche",
    "ma petite voiture blanche propremy clean little white car": "ma petite voiture blanche propre",
    "mon grand chat noir férocemy big black ferocious cat": "mon grand chat noir féroce",
    "Le Petit Chaperon RougeLittle Red Riding Hood": "Le Petit Chaperon Rouge",
    "eillela médaille": "la médaille",
    "ièreune infirmière": "une infirmière",
    "tiél’amitié": "l’amitié",
    "tiél'amitié": "l'amitié"
  };
  function cleanFr(fr) {
    if (!fr) return fr;
    let s = FR_CLEAN[fr] || fr;
    s = s.replace(/\s*\((?:être membre de|parler de|avoir besoin de|avoir envie de|être fier de|être capable de|certainty|doubt|Group [123])$/i, "");
    s = s.replace(/\bDonne-la lui\b/g, "Donne-la-lui")
         .replace(/La neige fait du dégât/g, "La neige fait des dégâts")
         .replace(/\binsister que\b/g, "insister pour que")
         .replace(/par dessus\/par dessous/g, "par-dessus / par-dessous")
         .replace(/Combien de films a-t-il réalisé \?/g, "Combien de films a-t-il réalisés ?")
         .replace(/qu'on se voit avant/g, "qu'on se voie avant");
    return s;
  }
  DATA.lessons.forEach(l => (l.stages || []).forEach(s => {
    if (Array.isArray(s.cards)) s.cards.forEach(c => { if (c && c.fr) c.fr = cleanFr(c.fr); });
  }));
  if (Array.isArray(DATA.flashcards)) DATA.flashcards.forEach(c => { if (c && c.fr) c.fr = cleanFr(c.fr); });
  // Remove exact duplicate cards inside a stage (same French + same English).
  DATA.lessons.forEach(l => (l.stages || []).forEach(s => {
    if (!Array.isArray(s.cards)) return;
    const seen = new Set();
    const k = s.cards.filter(c => { const key = c ? (c.fr + "\u0001" + c.en) : ""; if (seen.has(key)) return false; seen.add(key); return true; });
    stats.duplicates = (stats.duplicates || 0) + (s.cards.length - k.length);
    if (k.length >= 3) s.cards = k;
  }));
  DATA.lessons.forEach(l => (l.stages || []).forEach(s => {
    if (!Array.isArray(s.cards)) return;
    // Speaker labels from dialogues ("Camille" = "Hello, my name is Camille...") and English headers.
    const NAMES = /^(Camille|Sarah|Tom|Alice|Charlotte|Richard|Sophie|Danny|Clementine|Clémentine|Suzanne|Jacqueline|Rafael|Raphaël|Winnie|Alex|Antoine|Élodie|Jérôme|Edouard|Édouard|Thierry|Vincent|Alexis|Deraïdenz|Stefania|Aurélie|Juliette|Léo|George|Emma|Marie|Pierre|Paul|Jean|Luc|Julie|Marc|Nicolas|Thomas|Lucie|Louise|Hugo|Manon|Mathieu|Julien|Chloé|Paul|Isabelle|Philippe|Nathalie|Agnès|Bernard|Céline|Michel|Patrick|Olivier|Vendeur|Vendeuse|Serveur|Serveuse|Client|Cliente|Boucher|Boulanger|Médecin|Docteur|Agent|Employé|Employée|Reminder|Exceptions?|Note|Examples?|Answers?|Translation|Speaker [AB]|Person [AB])$/i;
    const cnt = {};
    s.cards.forEach(c => { if (c && c.fr) cnt[String(c.fr).trim()] = (cnt[String(c.fr).trim()] || 0) + 1; });
    const k = s.cards.filter(c => {
      if (!c) return false;
      const fr = String(c.fr || "").trim(), ew = String(c.en || "").trim().split(/\s+/).length;
      const nameLike = /^[A-ZÀ-Ý][\wà-ÿ\-]*( [A-ZÀ-Ý][\wà-ÿ\-]*)?$/.test(fr);
      if (nameLike && ((ew >= 4 && (NAMES.test(fr) || cnt[fr] >= 2)) || (NAMES.test(fr) && fr.split(" ").length === 1 && /[.!?,]/.test(String(c.en || ""))))) return false;
      return true;
    });
    const lenient = s.cards.filter(c => {
      if (!c) return false;
      const fr = String(c.fr || "").trim(), ew = String(c.en || "").trim().split(/\s+/).length;
      return !(/^[A-ZÀ-Ý][\wà-ÿ\-]*( [A-ZÀ-Ý][\wà-ÿ\-]*)?$/.test(fr) && ew >= 4 && (NAMES.test(fr) || cnt[fr] >= 2));
    });
    const use = k.length >= 3 ? k : (lenient.length >= 3 ? lenient : null);
    if (use) { stats.speaker_label = (stats.speaker_label || 0) + (s.cards.length - use.length); s.cards = use; }
    window.__ODY_NAMES = NAMES;
  }));
  if (Array.isArray(DATA.flashcards) && window.__ODY_NAMES) DATA.flashcards = DATA.flashcards.filter(c => !(c && window.__ODY_NAMES.test(String(c.fr || "").trim()) && String(c.en || "").split(/\s+/).length >= 4));
  DATA.lessons.forEach(l => (l.stages || []).forEach(s => {
    if (!Array.isArray(s.cards)) return;
    const kept = s.cards.filter(c => { const r = junkReason(c); if (r) stats[r] = (stats[r] || 0) + 1; return !r; });
    if (kept.length >= 3) s.cards = kept; // never empty a stage
  }));
  if (Array.isArray(DATA.flashcards)) DATA.flashcards = DATA.flashcards.filter(c => !junkReason(c));
  window.ODYSSEE_DATA_FIX_STATS = stats;
  window.ODYSSEE_JUNK_REASON = junkReason;

  // ---------------------------------------------------------------------------
  // Typography: the guides used an EN DASH inside words ("t’appelles–tu",
  // "Est–ce", "après–demain"). French uses a hyphen. Fix every string in stages.
  // ---------------------------------------------------------------------------
  const DASH = /([A-Za-zÀ-ÿœŒ’'])–([A-Za-zÀ-ÿœŒ])/g;
  function fixStr(v) { return typeof v === "string" && v.indexOf("–") >= 0 ? v.replace(DASH, "$1-$2").replace(DASH, "$1-$2") : v; }
  function walk(o, depth) {
    if (!o || depth > 6) return;
    if (Array.isArray(o)) { for (let i = 0; i < o.length; i++) { if (typeof o[i] === "string") o[i] = fixStr(o[i]); else walk(o[i], depth + 1); } return; }
    if (typeof o === "object") for (const k in o) { if (typeof o[k] === "string") o[k] = fixStr(o[k]); else walk(o[k], depth + 1); }
  }
  DATA.lessons.forEach(l => walk(l.stages, 0));
  if (Array.isArray(DATA.flashcards)) walk(DATA.flashcards, 0);

  // ---------------------------------------------------------------------------
  // Broken dialogue stages (e.g. 7-13 "Ma famille"): the parser put each French
  // line into "en" and lost the French. Rebuild turns/sentences/cards from the
  // clean "Speaker : line" text in the stage sections.
  // ---------------------------------------------------------------------------
  const LINE = /^\s*([A-ZÀ-Ý][\wÀ-ÿ\- ]{0,24}?)\s*:\s*(.+)$/;
  function parseLines(body) {
    const out = [];
    String(body || "").split("\n").forEach(t => { const m = t.match(LINE); if (m) out.push({ speaker: m[1].trim(), text: m[2].trim() }); });
    return out;
  }
  function tilesOf(fr) { return fr.split(/\s+/).filter(Boolean).concat(["le", "la", "les"]); }
  DATA.lessons.forEach(l => (l.stages || []).forEach(s => {
    const dt = s.dialogueTurns || [];
    const broken = dt.length && dt.filter(t => !t.fr || /^•/.test(t.fr) || LINE.test(t.en || "")).length >= Math.ceil(dt.length / 2);
    if (!broken) return;
    const secs = (s.sections || []).map(x => parseLines(x.body)).filter(a => a.length >= 3);
    if (secs.length < 2 || secs[0].length !== secs[1].length) return;
    const FRL = secs[0], ENL = secs[1];
    const frAll = FRL.map(x => x.text);
    s.dialogueTurns = FRL.map((x, i) => ({
      speaker: x.speaker, stageNote: "", fr: x.text, en: ENL[i].text, tiles: tilesOf(x.text),
      choices: [x.text].concat(frAll.filter(f => f !== x.text).slice(0, 3)).sort(() => Math.random() - 0.5)
    }));
    s.sentences = FRL.map((x, i) => {
      const words = x.text.replace(/[.,!?;:«»]/g, " ").split(/\s+/).filter(w => w.length > 3);
      const ans = words.sort((a, b) => b.length - a.length)[0] || x.text.split(" ")[0];
      return { fr: x.text, en: ENL[i].text, clozePrompt: x.text.replace(ans, "_____"), clozeAnswer: ans,
        wordBank: [ans].concat(words.filter(w => w !== ans).slice(0, 3)), tiles: tilesOf(x.text) };
    });
    const src = (s.cards && s.cards[0]) || {};
    s.cards = FRL.map((x, i) => ({ fr: x.text, en: ENL[i].text, note: "Dialogue Line", source: src.source || "", cefr: src.cefr || s.cefr || "A1", lessonId: src.lessonId || "" }));
    stats.rebuilt_dialogues = (stats.rebuilt_dialogues || 0) + 1;
  }));
})();
