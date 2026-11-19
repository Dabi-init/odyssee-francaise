(function () {
  const DATA = window.ALEXA_COURSE_DATA || {
    lessons: [],
    verbs: [],
    vocabThemes: [],
    flashcards: [],
    drills: [],
    exercises: []
  };

  const STORAGE_KEY = "ODYSSEE_FRANCAISE_SAVE_V4";
  const ACCENTS = ["é", "è", "ê", "ë", "à", "â", "ù", "û", "ô", "î", "ï", "ç", "œ", "«", "»"];
  const FRENCH_ACCENTS = ACCENTS;

  // =========================================================================
  // FLATTEN ALL 460 SEQUENTIAL STAGES ACROSS ALL 46 WORLDS
  // =========================================================================
  const ALL_STAGES = [];
  const STAGE_INDEX_BY_ID = {};
  DATA.lessons.forEach((world) => {
    const stages = world.stages || [];
    stages.forEach((st, idx) => {
      const globalIdx = ALL_STAGES.length;
      const enriched = Object.assign({}, st, {
        worldNum: world.number,
        worldId: world.id,
        worldTitle: world.title,
        stageIdxInWorld: idx,
        globalIdx
      });
      ALL_STAGES.push(enriched);
      STAGE_INDEX_BY_ID[st.stageId] = globalIdx;
    });
  });
  window.ALL_GAME_STAGES = ALL_STAGES;

  // =========================================================================
  // STUDIO NEURAL FRENCH AUDIO ENGINE (ZERO ROBOT SPEECHSYNTHESIS!)
  // Uses Google Studio Neural French stream (tl=fr) with referrerPolicy=no-referrer
  // =========================================================================
  let activeNeuralAudio = null;
  let neuralQueueToken = 0;
  const AUDIO_LRU_CACHE = new Map();
  const MAX_AUDIO_CACHE = 64;

  function teardownActiveAudio() {
    if (activeNeuralAudio) {
      try {
        activeNeuralAudio.onended = null;
        activeNeuralAudio.onerror = null;
        activeNeuralAudio.pause();
        activeNeuralAudio.currentTime = 0;
      } catch (e) {}
      activeNeuralAudio = null;
    }
  }

  function splitFrenchChunks(text, maxLen = 175) {
    const clean = String(text || "")
      .replace(/\*+/g, "")
      .replace(/\((?:m|f|pl|sing|formal|informal|masc|fem|courant|soutenu|familier)[^)]*\)/gi, "")
      .split("/")[0]
      .replace(/\s+/g, " ")
      .trim();
    if (!clean) return [];
    if (clean.length <= maxLen) return [clean];
    const parts = clean.split(/(?<=[.!?…;,:])\s+/);
    const chunks = [];
    let cur = "";
    for (const p of parts) {
      if ((cur + " " + p).trim().length <= maxLen) {
        cur = (cur + " " + p).trim();
      } else {
        if (cur) chunks.push(cur);
        cur = p.slice(0, maxLen);
      }
    }
    if (cur) chunks.push(cur);
    return chunks;
  }

  function speakFrench(text, rate = 1.0) {
    if (window.ODY_SPEAK) return window.ODY_SPEAK(text, rate); // v14 audio engine (server cache + fallbacks)
    const chunks = splitFrenchChunks(text);
    if (!chunks.length) return;
    neuralQueueToken += 1;
    const myToken = neuralQueueToken;
    teardownActiveAudio();

    const isSlow = rate < 0.8;
    const ttsSpeed = isSlow ? "0.24" : "1";

    let idx = 0;
    const playNextChunk = () => {
      if (myToken !== neuralQueueToken || idx >= chunks.length) return;
      const chunkText = chunks[idx++];
      const cacheKey = `${ttsSpeed}:${chunkText}`;
      const q = encodeURIComponent(chunkText);
      const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=tw-ob&tl=fr&ttsspeed=${ttsSpeed}&q=${q}`;

      let audio = AUDIO_LRU_CACHE.get(cacheKey);
      if (!audio) {
        audio = new Audio();
        audio.referrerPolicy = "no-referrer";
        audio.preload = "auto";
        audio.src = url;
        if (AUDIO_LRU_CACHE.size >= MAX_AUDIO_CACHE) {
          const oldestKey = AUDIO_LRU_CACHE.keys().next().value;
          AUDIO_LRU_CACHE.delete(oldestKey);
        }
        AUDIO_LRU_CACHE.set(cacheKey, audio);
      } else {
        AUDIO_LRU_CACHE.delete(cacheKey);
        AUDIO_LRU_CACHE.set(cacheKey, audio);
        try { audio.currentTime = 0; } catch (e) {}
      }

      audio.playbackRate = isSlow ? 0.92 : 1.0;
      activeNeuralAudio = audio;
      audio.onended = () => {
        if (myToken === neuralQueueToken) playNextChunk();
      };
      audio.onerror = () => {
        if (myToken === neuralQueueToken) playNextChunk();
      };
      audio.play().catch(() => {});
    };

    playNextChunk();
  }
  window.speakFrench = speakFrench;
  window.FRENCH_VOICE_ENGINE = {
    type: "Google Studio Neural French Audio Stream (tl=fr) (short clips, 64-LRU Cached)",
    usesRobotSpeechSynthesis: false,
    speak: speakFrench
  };

  // =========================================================================
  // LIVE FRENCH MICROPHONE PRONUNCIATION RECOGNITION (WEB SPEECH API FR-FR)
  // =========================================================================
  window.startLiveFrenchMicCheck = function (targetFr, resultMountId, pKey) {
    const mount = document.getElementById(resultMountId);
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      speakFrench(targetFr, 0.95);
      window.practiceSpeakingPhrase(pKey || targetFr, targetFr, resultMountId);
      if (mount) {
        mount.innerHTML = `<span style="color:#6ee7b7;font-size:0.82rem;font-weight:800;">🎙️ Studio Shadowing Complete (+15 XP)!</span>`;
      }
      return;
    }
    try {
      const rec = new SpeechRec();
      rec.lang = "fr-FR";
      rec.interimResults = false;
      rec.maxAlternatives = 3;
      if (mount) {
        mount.innerHTML = `<span style="color:#fde047;font-size:0.82rem;font-weight:800;">🎙️ Listening in French (Speak now)...</span>`;
      }
      rec.onresult = (ev) => {
        const transcript = (ev.results[0] && ev.results[0][0] && ev.results[0][0].transcript) || "";
        const evalRes = evaluateFrenchProduction(transcript, targetFr);
        window.practiceSpeakingPhrase(pKey || targetFr, targetFr, resultMountId);
        if (mount) {
          mount.innerHTML = evalRes.ok
            ? `<span style="color:#6ee7b7;font-size:0.82rem;font-weight:800;">🎯 Native Pronunciation Match: "${escapeHtml(transcript)}" (+25 XP)</span>`
            : `<span style="color:#fde047;font-size:0.82rem;font-weight:800;">🎙️ Heard: "${escapeHtml(transcript)}" • Target: ${evalRes.diffHtml} (+15 XP)</span>`;
        }
      };
      rec.onerror = () => {
        speakFrench(targetFr, 0.95);
        window.practiceSpeakingPhrase(pKey || targetFr, targetFr, resultMountId);
        if (mount) {
          mount.innerHTML = `<span style="color:#6ee7b7;font-size:0.82rem;font-weight:800;">🔊 Vocal Shadowing Complete (+15 XP)</span>`;
        }
      };
      rec.start();
    } catch (e) {
      speakFrench(targetFr, 0.95);
      window.practiceSpeakingPhrase(pKey || targetFr, targetFr, resultMountId);
    }
  };

  // =========================================================================
  // ROYAL TROPHIES (20 ACHIEVEMENTS FROM A1 TO C2)
  // =========================================================================
  const TROPHY_DEFS = [
    { id: "first_strike", icon: "⚔️", title: "Première Frappe", desc: "Earn your first 50 XP in any Stage", check: s => s.xp >= 50 },
    { id: "stage_1", icon: "⭐", title: "Éveil de Provence (Stage 1-1)", desc: "Clear your first Playable Stage", check: s => Object.keys(s.clearedStages || {}).length >= 1 },
    { id: "stage_10", icon: "🧭", title: "Voyageur Intrépide (10 Stages)", desc: "Clear 10 Sequential Stages", check: s => Object.keys(s.clearedStages || {}).length >= 10 },
    { id: "stage_50", icon: "🛡️", title: "Chevalier des Mondes (50 Stages)", desc: "Clear 50 Playable Stages", check: s => Object.keys(s.clearedStages || {}).length >= 50 },
    { id: "stage_150", icon: "⚜️", title: "Seigneur de Lumière (150 Stages)", desc: "Clear 150 Playable Stages", check: s => Object.keys(s.clearedStages || {}).length >= 150 },
    { id: "stage_460", icon: "👑", title: "Immortel de France (All 460 Stages)", desc: "Clear all 460 Stages across all 46 Worlds", check: s => Object.keys(s.clearedStages || {}).length >= 460 },
    { id: "xp_1000", icon: "🌟", title: "Étoile de Provence", desc: "Reach 1,000 Total XP", check: s => s.xp >= 1000 },
    { id: "xp_5000", icon: "🔥", title: "Héros de Lumière", desc: "Reach 5,000 Total XP", check: s => s.xp >= 5000 },
    { id: "xp_15000", icon: "💎", title: "Grand Érudit C1", desc: "Reach 15,000 Total XP", check: s => s.xp >= 15000 },
    { id: "xp_25000", icon: "🏛️", title: "Maître du Panthéon C2", desc: "Reach 25,000 Total XP", check: s => s.xp >= 25000 },
    { id: "world_1", icon: "📘", title: "Conquérant du Monde 01", desc: "Defeat the World 01 Boss", check: s => Object.keys(s.masteredLessons || {}).length >= 1 },
    { id: "world_12", icon: "🌸", title: "Champion A1 (12 Worlds)", desc: "Master all 12 A1 Beginner Worlds", check: s => Object.keys(s.masteredLessons || {}).length >= 12 },
    { id: "world_30", icon: "🦅", title: "Virtuose B2 (30 Worlds)", desc: "Master 30 Worlds", check: s => Object.keys(s.masteredLessons || {}).length >= 30 },
    { id: "world_46", icon: "🏆", title: "Odyssée C2 Complète (46 Worlds)", desc: "Master all 46 Worlds including Career & DALF C2", check: s => Object.keys(s.masteredLessons || {}).length >= 46 },
    { id: "speak_15", icon: "🎙️", title: "Voix de Paris", desc: "Practice speaking 15 French phrases aloud", check: s => (s.stats && s.stats.phrasesSpoken >= 15) },
    { id: "batch_5", icon: "🃏", title: "Maître des Runes", desc: "Clear 5 Reflex Match Boards", check: s => (s.stats && s.stats.matchBoardsCleared >= 5) },
    { id: "boss_3", icon: "🐉", title: "Tueur de Gardiens", desc: "Defeat 3 Guardian Bosses", check: s => (s.stats && s.stats.bossesSlain >= 3) },
    { id: "verbs_25", icon: "⚒️", title: "Forgeron Royal", desc: "Forge 25 verb conjugations", check: s => (s.stats && s.stats.verbsForged >= 25) },
    { id: "cafe_10", icon: "☕", title: "Habitué du Café", desc: "Complete 10 conversational turns in Le Café", check: s => (s.stats && s.stats.dialogueTurnsCompleted >= 10) },
    { id: "gold_500", icon: "🪙", title: "Trésorier du Royaume", desc: "Accumulate 500 Gold", check: s => (s.gold || 0) >= 500 }
  ];

  const defaultSave = {
    xp: 0,
    gold: 150,
    streak: 1,
    parisReputation: 100,
    lastPlayedDate: new Date().toISOString().slice(0, 10),
    currentLessonNum: 1,
    currentStageId: "1-1",
    freeRoamUnlocked: false,
    combo: 0,
    maxCombo: 0,
    masteredLessons: {},
    clearedStages: {},
    practicedPhrases: {},
    fsrsCards: {},
    mistakeVault: {},
    clearedDistricts: {},
    completedWritings: {},
    inventory: {
      fiftyFifty: 3,
      hintTile: 3,
      shield: 2,
      critElixir: 2
    },
    perks: {
      scholarWisdom: 1,
      goldAlchemist: 1
    },
    trophies: {},
    stats: {
      phrasesSpoken: 0,
      cardsReviewed: 0,
      verbsForged: 0,
      drillsSolved: 0,
      bossesSlain: 0,
      matchBoardsCleared: 0,
      dialogueTurnsCompleted: 0,
      reflexBonuses: 0,
      writingsGraded: 0
    }
  };

  let save = loadSave();

  function loadSave() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("ALEXA_ODYSSEY_SAVE_V3");
      if (!raw) return JSON.parse(JSON.stringify(defaultSave));
      const parsed = JSON.parse(raw);
      return Object.assign({}, defaultSave, parsed, {
        clearedStages: Object.assign({}, defaultSave.clearedStages, parsed.clearedStages || {}),
        masteredLessons: Object.assign({}, defaultSave.masteredLessons, parsed.masteredLessons || {}),
        practicedPhrases: Object.assign({}, defaultSave.practicedPhrases, parsed.practicedPhrases || {}),
        fsrsCards: Object.assign({}, defaultSave.fsrsCards, parsed.fsrsCards || {}),
        mistakeVault: Object.assign({}, defaultSave.mistakeVault, parsed.mistakeVault || {}),
        clearedDistricts: Object.assign({}, defaultSave.clearedDistricts, parsed.clearedDistricts || {}),
        completedWritings: Object.assign({}, defaultSave.completedWritings, parsed.completedWritings || {}),
        inventory: Object.assign({}, defaultSave.inventory, parsed.inventory || {}),
        perks: Object.assign({}, defaultSave.perks, parsed.perks || {}),
        trophies: Object.assign({}, defaultSave.trophies, parsed.trophies || {}),
        stats: Object.assign({}, defaultSave.stats, parsed.stats || {})
      });
    } catch (e) {
      return JSON.parse(JSON.stringify(defaultSave));
    }
  }

  window.RPG_GET_MASTERED = () => save.masteredLessons || {};

  const NATIVE_WORLD_SET = new Set(DATA.lessons.filter(l => l.native).map(l => l.number));
  function isNativeStage(st) {
    return !!(st && NATIVE_WORLD_SET.has(st.worldNum));
  }

  function isStageUnlocked(stageId) {
    if (save.freeRoamUnlocked) return true;
    const gIdx = STAGE_INDEX_BY_ID[stageId];
    if (gIdx === undefined || gIdx === 0) return true; // Stage 1-1 is always unlocked
    if (save.clearedStages && save.clearedStages[stageId]) return true;
    const st = ALL_STAGES[gIdx];
    if (isNativeStage(st)) {
      // Native Path worlds open by level, not by finishing the whole campaign.
      const w = DATA.lessons.find(l => l.number === st.worldNum);
      if (cefrRank(campaignCefr()) < cefrRank(w.unlockCefr || w.cefr)) return false;
      if (st.stageIdxInWorld === 0) return true;
    }
    const prevStage = ALL_STAGES[gIdx - 1];
    return !!(prevStage && save.clearedStages && save.clearedStages[prevStage.stageId]);
  }

  function getActiveWorldAndStage() {
    const world = DATA.lessons.find(l => l.number === (save.currentLessonNum || 1)) || DATA.lessons[0];
    const stages = world.stages || [];
    let stage = stages.find(s => s.stageId === save.currentStageId);
    if (!stage) {
      // Find first unlocked but uncleared stage in this world, or fallback to stages[0]
      stage = stages.find(s => isStageUnlocked(s.stageId) && !save.clearedStages[s.stageId]) || stages[0];
      if (stage) save.currentStageId = stage.stageId;
    }
    // cardsPool / drillsPool are needed by the typed-answer handlers (Dictée, Duel).
    const cardsPool = stage ? getStageCardsPool(world, stage) : DATA.flashcards.slice(0, 15);
    const drillsPool = stage ? getStageDrillsPool(world, stage, cardsPool) : [];
    return { world, stage, stages, cardsPool, drillsPool };
  }

  let saveTimer = null;
  function flushSave() {
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
    } catch (e) {}
  }
  window.addEventListener("beforeunload", flushSave);

  function checkTrophies() {
    for (const t of TROPHY_DEFS) {
      if (!save.trophies[t.id] && t.check(save)) {
        save.trophies[t.id] = true;
        if (window.RPG_VFX) window.RPG_VFX.toast(`Trophy Unlocked: ${t.title}`, t.desc, t.icon);
      }
    }
  }

  function persistSave() {
    checkTrophies();
    updateHUD();
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(flushSave, 120);
  }

  function addXP(amount, goldAmount = 0) {
    const xpMult = 1 + ((save.perks.scholarWisdom || 1) - 1) * 0.15;
    const goldMult = 1 + ((save.perks.goldAlchemist || 1) - 1) * 0.2;
    const gainedXp = Math.round(amount * xpMult);
    save.xp = (save.xp || 0) + gainedXp;
    if (goldAmount > 0) {
      save.gold = (save.gold || 0) + Math.round(goldAmount * goldMult);
    } else if (amount >= 10) {
      save.gold = (save.gold || 0) + Math.max(2, Math.round((amount / 4) * goldMult));
    }
    persistSave();
  }

  function getLevelAndTitle(xp) {
    const level = Math.max(1, Math.floor(xp / 250) + 1);
    // Rank name reflects effort (XP); the CEFR tag reflects real campaign progress.
    let rank = "🌱 Apprenti";
    if (xp >= 25000) rank = "👑 Immortel";
    else if (xp >= 15000) rank = "💎 Archimage";
    else if (xp >= 8000) rank = "⚔️ Chevalier";
    else if (xp >= 4000) rank = "🛡️ Mousquetaire";
    else if (xp >= 1500) rank = "🧭 Explorateur";
    let cefrTag = "A1";
    try { cefrTag = campaignCefr(); } catch (e) {}
    const title = `${rank} • ${cefrTag}`;
    return { level, title, pctToNext: Math.min(100, Math.round(((xp % 250) / 250) * 100)) };
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function normAnswer(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/\(e\)|\(s\)|\(es\)/g, "")
      .replace(/[’']/g, "'")
      .replace(/[«»".,!?;:()\-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function checkAnswerMatch(userStr, targetStr) {
    const u = normAnswer(userStr);
    if (!u) return false;
    const candidates = String(targetStr || "").split("/").map(normAnswer).filter(Boolean);
    candidates.push(normAnswer(targetStr));
    return candidates.some(c => c === u);
  }

  // Varied wrong answers: avoids always showing the same 3 distractors, so the
  // player can't win by elimination/memorising the option set.
  function pickDistractors(pool, item, field, n = 3, seed = 0) {
    const seen = new Set([normAnswer(item[field])]);
    const other = field === "en" ? "fr" : "en";
    const itemOther = normAnswer(item[other] || "");
    const others = [];
    pool.forEach(c => {
      const k = normAnswer(c[field]);
      // Never offer a second valid answer (a synonym card with the same meaning/form).
      if (itemOther && normAnswer(c[other] || "") === itemOther) return;
      if (k && !seen.has(k)) { seen.add(k); others.push(c); }
    });
    if (others.length <= n) return others;
    const out = [];
    const L = others.length;
    const start = (seed * 5 + 3) % L;
    for (let i = 0; i < L && out.length < n; i++) {
      const cand = others[(start + i * 7) % L];
      if (!out.includes(cand)) out.push(cand);
    }
    for (let i = 0; i < L && out.length < n; i++) {
      if (!out.includes(others[i])) out.push(others[i]);
    }
    return out;
  }

  // =========================================================================
  // ACTIVE PRODUCTION ENGINE: DUAL-MODE (KINETIC TILES + FRENCH KEYBOARD)
  // =========================================================================
  let activeTileSelection = [];
  let activeTilePool = [];

  function normPreserveAccents(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/\(e\)|\(s\)|\(es\)/g, "")
      .replace(/[’']/g, "'")
      .replace(/[«»".,!?;:()\-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function stripDiacritics(s) {
    return normPreserveAccents(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function computeFrenchDiffHtml(userStr, targetStr) {
    const u = String(userStr || "").trim();
    const t = String(targetStr || "").split("/")[0].trim();
    const maxLen = Math.max(u.length, t.length);
    let html = "";
    for (let i = 0; i < maxLen; i++) {
      const uc = u[i] || "";
      const tc = t[i] || "";
      if (uc.toLowerCase() === tc.toLowerCase()) {
        html += `<span style="color:#6ee7b7;font-weight:900;">${escapeHtml(tc)}</span>`;
      } else if (
        uc && tc &&
        uc.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() ===
        tc.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      ) {
        html += `<span style="color:#fde047;text-decoration:underline wavy #f59e0b;font-weight:900;" title="Accent needed: ${escapeHtml(tc)}">${escapeHtml(tc)}</span>`;
      } else {
        html += `<span style="color:#fda4af;background:rgba(244,63,94,0.25);border-radius:4px;padding:0 2px;font-weight:900;">${escapeHtml(tc || "␣")}</span>`;
      }
    }
    return html;
  }

  function evaluateFrenchProduction(userStr, targetStr) {
    const candidates = String(targetStr || "").split("/").map(s => s.trim()).filter(Boolean);
    candidates.push(String(targetStr || "").trim());

    const uStrict = normPreserveAccents(userStr);
    if (!uStrict) {
      return {
        ok: false,
        passed: false,
        grade: "empty",
        tier: "WRONG",
        message: "⚠️ Please type or select a French expression.",
        diffHtml: ""
      };
    }

    for (const c of candidates) {
      if (normPreserveAccents(c) === uStrict) {
        return {
          ok: true,
          passed: true,
          grade: "exact",
          tier: "EXACT",
          message: "🎯 Parfait ! Exact French Orthography & Accents",
          diffHtml: computeFrenchDiffHtml(userStr, c)
        };
      }
    }
    const uBase = stripDiacritics(userStr);
    for (const c of candidates) {
      if (stripDiacritics(c) === uBase) {
        return {
          ok: true,
          passed: true,
          grade: "accent_slip",
          tier: "ACCENT_SLIP",
          message: `✨ Correct (Watch the French accent: "${c}")`,
          diffHtml: computeFrenchDiffHtml(userStr, c),
          canonical: c
        };
      }
    }
    return {
      ok: false,
      passed: false,
      grade: "wrong",
      tier: "WRONG",
      message: "❌ Orthography mismatch — inspect the character diff",
      diffHtml: computeFrenchDiffHtml(userStr, candidates[0])
    };
  }

  function buildKineticTileDeck(targetFr, extraPool = []) {
    const cleanTarget = String(targetFr || "").split("/")[0].replace(/[.,!?;:«»"]/g, "").trim();
    const targetWords = cleanTarget.split(/\s+/).filter(Boolean);
    const defaultDecoys = ["le", "la", "les", "de", "du", "des", "un", "une", "est", "sont", "ne", "pas", "plus", "très", "dans", "pour", "avec"];
    const poolWords = extraPool
      .flatMap(x => String(x || "").split("/")[0].replace(/[.,!?;:«»"]/g, "").trim().split(/\s+/))
      .concat(defaultDecoys)
      .filter(w => w && !targetWords.some(tw => tw.toLowerCase() === w.toLowerCase()));

    const uniqueDecoys = [...new Set(poolWords)];
    for (let i = uniqueDecoys.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [uniqueDecoys[i], uniqueDecoys[j]] = [uniqueDecoys[j], uniqueDecoys[i]];
    }
    const decoyCount = Math.min(4, Math.max(2, Math.ceil(targetWords.length * 0.5)));
    const combined = [...targetWords, ...uniqueDecoys.slice(0, decoyCount)].map((word, idx) => ({
      id: `kt_${idx}_${Math.random().toString(36).slice(2, 6)}`,
      word
    }));
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }
    activeTileSelection = [];
    activeTilePool = combined;
    return combined;
  }

  window.insertFrenchAccent = function (inputId, char) {
    const inp = document.getElementById(inputId);
    if (!inp) return;
    const start = inp.selectionStart ?? inp.value.length;
    const end = inp.selectionEnd ?? inp.value.length;
    inp.value = inp.value.slice(0, start) + char + inp.value.slice(end);
    inp.focus();
    inp.setSelectionRange(start + char.length, start + char.length);
    if (window.RPG_SFX) window.RPG_SFX.tileClick();
  };

  function renderDualModeProductionDeck(mountIdOrObj, targetFrArg, submitExprArg, labelTextArg) {
    let mountId, targetFr, submitAction, placeholder;
    if (typeof mountIdOrObj === "object" && mountIdOrObj !== null) {
      mountId = mountIdOrObj.mountId || "prod";
      targetFr = mountIdOrObj.targetFr || "";
      const fn = mountIdOrObj.submitFnName || "window.submitDicteeRoyale";
      submitAction = fn.includes("(") ? fn : `${fn}(document.getElementById('${mountId}-input').value)`;
      placeholder = mountIdOrObj.placeholder || "Type in French (or click the kinetic word tiles above)...";
    } else {
      mountId = mountIdOrObj || "prod";
      targetFr = targetFrArg || "";
      submitAction = submitExprArg || "window.submitDicteeRoyale()";
      placeholder = labelTextArg || "Type in French (or click the kinetic word tiles above)...";
    }

    if (targetFr) {
      buildKineticTileDeck(targetFr);
    }

    const inputId = `${mountId}-input`;
    const trayId = `${mountId}-tray`;
    const deckId = `${mountId}-deck`;

    return `
      <div class="dual-production-box" id="${mountId}">
        <div style="font-size:0.76rem;font-weight:800;color:#38bdf8;text-transform:uppercase;margin-bottom:0.35rem;display:flex;justify-content:space-between;align-items:center;">
          <span>🧩 Mode A: Click Kinetic Word Tiles to Assemble</span>
          <button class="btn" style="padding:2px 8px;font-size:0.72rem;" onclick="window.clearKineticTiles('${inputId}', '${trayId}', '${deckId}')">↺ Clear Tiles</button>
        </div>
        <div class="sentence-slot-tray" id="${trayId}">
          ${activeTileSelection.length === 0
            ? `<span style="color:var(--text-muted);font-size:0.88rem;">✨ Click French word tiles below or type directly in the box...</span>`
            : activeTileSelection.map((t, i) => `<button class="word-tile in-slot" onclick="window.popKineticTile(${i}, '${inputId}', '${trayId}', '${deckId}')">${escapeHtml(t.word)} ✕</button>`).join("")
          }
        </div>
        <div class="tile-deck" id="${deckId}">
          ${activeTilePool.map(t => {
            const used = activeTileSelection.some(s => s.id === t.id);
            return `<button class="word-tile ${used ? 'used' : ''}" data-tile-id="${t.id}" onclick="window.pushKineticTile('${t.id}', '${inputId}', '${trayId}', '${deckId}')">${escapeHtml(t.word)}</button>`;
          }).join("")}
        </div>

        <div style="font-size:0.76rem;font-weight:800;color:#fde047;text-transform:uppercase;margin:0.55rem 0 0.35rem;">
          ⌨️ Mode B: ${escapeHtml(placeholder)}
        </div>
        <div class="accent-bar">
          ${ACCENTS.map(acc => `
            <button type="button" class="accent-key" onclick="window.insertFrenchAccent('${inputId}', '${acc}')">${acc}</button>
          `).join("")}
        </div>
        <div style="display:flex;gap:0.55rem;flex-wrap:wrap;">
          <input type="text" id="${inputId}" class="input-french" style="flex:1;margin-bottom:0;"
                 value="${escapeHtml(activeTileSelection.map(t => t.word).join(" "))}"
                 placeholder="Écrivez en français ici..."
                 autocomplete="off" spellcheck="false"
                 onkeydown="if(event.key==='Enter'){event.preventDefault();${submitAction};}" />
          <button class="btn btn-gold" style="padding:0.75rem 1.35rem;font-size:0.95rem;"
                  onclick="${submitAction}">
            ⚡ Valider &amp; Frapper
          </button>
        </div>
        <div id="${mountId}-feedback"></div>
      </div>
    `;
  }

  window.pushKineticTile = function (tileId, inputId, trayId, deckId) {
    const t = activeTilePool.find(x => x.id === tileId);
    if (!t || activeTileSelection.some(x => x.id === tileId)) return;
    activeTileSelection.push(t);
    speakFrench(t.word, 1.0);
    if (window.RPG_SFX) window.RPG_SFX.tileClick();
    syncKineticDOM(inputId, trayId, deckId);
  };

  window.popKineticTile = function (idx, inputId, trayId, deckId) {
    activeTileSelection.splice(idx, 1);
    if (window.RPG_SFX) window.RPG_SFX.tileClick();
    syncKineticDOM(inputId, trayId, deckId);
  };

  window.clearKineticTiles = function (inputId, trayId, deckId) {
    activeTileSelection = [];
    syncKineticDOM(inputId, trayId, deckId);
  };

  function syncKineticDOM(inputId, trayId, deckId) {
    const inp = document.getElementById(inputId);
    if (inp) inp.value = activeTileSelection.map(t => t.word).join(" ");
    const tray = document.getElementById(trayId);
    if (tray) {
      tray.innerHTML = activeTileSelection.length === 0
        ? `<span style="color:var(--text-muted);font-size:0.88rem;">✨ Click French word tiles below or type directly in the box...</span>`
        : activeTileSelection.map((t, i) => `<button class="word-tile in-slot" onclick="window.popKineticTile(${i}, '${inputId}', '${trayId}', '${deckId}')">${escapeHtml(t.word)} ✕</button>`).join("");
    }
    const deck = document.getElementById(deckId);
    if (deck) {
      deck.querySelectorAll(".word-tile").forEach(btn => {
        const used = activeTileSelection.some(s => s.id === btn.dataset.tileId);
        btn.classList.toggle("used", used);
      });
    }
  }

  // =========================================================================
  // TRUE FSRS-5 SPACED REPETITION + GRIMOIRE DES ERREURS + <3S REFLEX TIMER
  // =========================================================================
  let reflexStartMs = 0;
  let reflexDurationMs = 3000;
  let reflexRafId = null;

  // startReflexTimer(limitMs, [onExpire]) or startReflexTimer(limitMs, barElId, labelElId, [onExpire])
  function startReflexTimer(limitMs = 3000, barElId = "reflex-timer-fill", labelElId = "reflex-timer-label", onExpire = null) {
    if (typeof barElId === "function") {
      onExpire = barElId;
      barElId = "reflex-timer-fill";
      labelElId = "reflex-timer-label";
    }
    if (reflexRafId) cancelAnimationFrame(reflexRafId);
    reflexStartMs = performance.now();
    reflexDurationMs = limitMs;

    const tick = (now) => {
      const elapsed = now - reflexStartMs;
      const pct = Math.max(0, 1 - elapsed / reflexDurationMs);
      const bar = document.getElementById(barElId);
      const lbl = document.getElementById(labelElId);
      if (!bar || !document.body.contains(bar)) {
        reflexRafId = null;
        return;
      }
      bar.style.transform = `scaleX(${pct})`;
      bar.style.background = pct > 0.45 ? "linear-gradient(90deg,#10b981,#38bdf8)" : (pct > 0.2 ? "#f59e0b" : "#f43f5e");
      if (lbl) {
        lbl.textContent = pct > 0
          ? `${((reflexDurationMs - elapsed) / 1000).toFixed(1)}s`
          : `Standard pace (no reflex bonus)`;
      }
      if (pct > 0) {
        reflexRafId = requestAnimationFrame(tick);
      } else {
        reflexRafId = null;
        if (typeof onExpire === "function") onExpire();
      }
    };
    reflexRafId = requestAnimationFrame(tick);
  }

  function stopReflexTimer() {
    if (reflexRafId) {
      cancelAnimationFrame(reflexRafId);
      reflexRafId = null;
    }
    return reflexStartMs > 0 ? Math.round(performance.now() - reflexStartMs) : 4000;
  }

  const FSRS5 = {
    w0: [0.40255, 1.18385, 3.173, 15.69105],
    initDifficulty(g) {
      return Math.min(10, Math.max(1, 7.1949 - 0.5345 * (g - 3)));
    },
    nextDifficulty(d, g) {
      const nextD = d - 0.8 * (g - 3);
      return Math.min(10, Math.max(1, 0.9 * nextD + 0.1 * 7.1949));
    },
    retrievability(elapsedDays, stability) {
      if (!stability || stability <= 0) return 0;
      return Math.pow(1 + (19 / 81) * (elapsedDays / stability), -0.5);
    },
    review(cardState, grade, nowMs = Date.now()) {
      const g = Math.min(4, Math.max(1, grade));
      if (!cardState || !cardState.reps) {
        const s = this.w0[g - 1];
        const d = this.initDifficulty(g);
        return {
          s: Number(s.toFixed(3)),
          d: Number(d.toFixed(3)),
          reps: 1,
          lapses: g === 1 ? 1 : 0,
          lastReview: nowMs,
          due: nowMs + Math.round(s * 86400000)
        };
      }
      const elapsedDays = Math.max(0.01, (nowMs - (cardState.lastReview || nowMs)) / 86400000);
      const r = this.retrievability(elapsedDays, cardState.s);
      const d = this.nextDifficulty(cardState.d || 5, g);
      let s = cardState.s;

      if (g === 1) {
        s = Math.max(0.1, 0.2 * Math.pow(d, -0.3) * Math.pow(s + 1, 0.2) * Math.exp(0.1 * (1 - r)));
      } else {
        const hardPenalty = g === 2 ? 0.8 : 1.0;
        const easyBonus = g === 4 ? 1.35 : 1.0;
        const factor = 1 + Math.exp(1.5) * (11 - d) * Math.pow(s, -0.15) * (Math.exp(0.8 * (1 - r)) - 1) * hardPenalty * easyBonus;
        s = Math.min(3650, s * factor);
      }

      return {
        s: Number(s.toFixed(3)),
        d: Number(d.toFixed(3)),
        reps: (cardState.reps || 0) + 1,
        lapses: (cardState.lapses || 0) + (g === 1 ? 1 : 0),
        lastReview: nowMs,
        due: nowMs + Math.round(s * 86400000)
      };
    }
  };
  window.RPG_FSRS = FSRS5;

  window.recordLearningOutcome = function (itemOrId, frOrIsCorrect, enOrResponseMs, isCorrectArg, categoryArg, cefrArg) {
    if (!save.fsrsCards) save.fsrsCards = {};
    if (!save.mistakeVault || Array.isArray(save.mistakeVault)) save.mistakeVault = {};

    let item, isCorrect, responseMs;
    if (typeof itemOrId === "object" && itemOrId !== null) {
      item = itemOrId;
      isCorrect = !!frOrIsCorrect;
      responseMs = typeof enOrResponseMs === "number" ? enOrResponseMs : 4000;
    } else {
      item = {
        id: String(itemOrId || ""),
        fr: String(frOrIsCorrect || ""),
        en: String(enOrResponseMs || ""),
        category: categoryArg || "orthography",
        cefr: cefrArg || "B1"
      };
      isCorrect = !!isCorrectArg;
      responseMs = 3500;
    }

    const frKey = normPreserveAccents(item.fr || "").trim();
    const key = frKey && frKey.length >= 2 ? `fr_${frKey.slice(0, 60)}` : (item.id || "misc");
    const isReflexBlitz = isCorrect && responseMs <= 3000;
    const grade = !isCorrect ? 1 : (isReflexBlitz ? 4 : (responseMs <= 6000 ? 3 : 2));

    save.fsrsCards[key] = Object.assign(
      { fr: item.fr, en: item.en || "", note: item.note || "" },
      FSRS5.review(save.fsrsCards[key], grade)
    );
    save.stats.cardsReviewed = (save.stats.cardsReviewed || 0) + 1;

    if (!isCorrect) {
      const prev = save.mistakeVault[key] || { misses: 0, streakAfterMiss: 0 };
      save.mistakeVault[key] = {
        id: key,
        fr: item.fr,
        en: item.en || "",
        note: item.note || "",
        category: item.category || "orthography",
        cefr: item.cefr || "B1",
        stageId: item.stageId || save.currentStageId || "1-1",
        worldNum: item.worldNum || save.currentLessonNum || 1,
        misses: prev.misses + 1,
        count: prev.misses + 1,
        streakAfterMiss: 0,
        lastMissedAt: Date.now()
      };
      if (window.RPG_VFX) {
        window.RPG_VFX.floatText("📕 Logged in Grimoire des Erreurs", "#f43f5e");
      }
    } else {
      if (isReflexBlitz) {
        save.stats.reflexBonuses = (save.stats.reflexBonuses || 0) + 1;
        if (window.RPG_VFX) {
          window.RPG_VFX.floatText(`⚡ RÉFLEXE NATIF (${(responseMs / 1000).toFixed(1)}s) +15 XP!`, "#38bdf8");
        }
        addXP(15, 5);
      }
      if (save.mistakeVault[key]) {
        save.mistakeVault[key].streakAfterMiss = (save.mistakeVault[key].streakAfterMiss || 0) + 1;
        if (save.mistakeVault[key].streakAfterMiss >= 2) {
          delete save.mistakeVault[key];
          if (window.RPG_VFX) {
            window.RPG_VFX.toast("Mistake Vanquished! 📕✨", `"${item.fr}" graduated from your Grimoire des Erreurs!`, "⚜️");
          }
          addXP(40, 12);
        }
      }
    }
    persistSave();
  };

  function updateHUD() {
    const hud = document.getElementById("game-hud");
    if (hud) {
      hud.style.display = currentScene === "title" ? "none" : "flex";
    }
    const { level, title, pctToNext } = getLevelAndTitle(save.xp || 0);
    const lvlEl = document.getElementById("hud-level");
    const rankEl = document.getElementById("hud-rank");
    const xpEl = document.getElementById("hud-xp");
    const xpBarEl = document.getElementById("hud-xp-bar");
    const goldEl = document.getElementById("hud-gold");
    const streakEl = document.getElementById("hud-streak");
    const masteredEl = document.getElementById("hud-mastered");
    const masteryBarEl = document.getElementById("hud-mastery-bar");
    const activeChapEl = document.getElementById("hud-active-chapter");

    if (lvlEl) lvlEl.textContent = `Lv.${level}`;
    if (rankEl) rankEl.textContent = title;
    if (xpEl) xpEl.textContent = `${(save.xp || 0).toLocaleString()} XP`;
    if (xpBarEl) xpBarEl.style.width = `${Math.max(12, pctToNext)}%`;
    if (goldEl) goldEl.textContent = `${(save.gold || 0).toLocaleString()} Gold`;
    if (streakEl) streakEl.textContent = `🔥 ${save.streak || 0}d`;
    document.body.classList.toggle("calm-mode", Object.keys(save.clearedStages || {}).length < 3 && !save.showAllMenus);

    const clearedCount = Object.keys(save.clearedStages || {}).length;
    const totalStages = ALL_STAGES.length || 460;
    if (masteredEl) masteredEl.textContent = `⭐ ${clearedCount}/${totalStages} Stages`;
    if (masteryBarEl) masteryBarEl.style.width = `${Math.max(3, Math.round((clearedCount / totalStages) * 100))}%`;

    const { world, stage } = getActiveWorldAndStage();
    if (activeChapEl && world && stage) {
      activeChapEl.textContent = `Stage ${stage.stageCode}: ${stage.title.slice(0, 34)} (${world.cefr})`;
    }

    document.querySelectorAll(".rpg-medallion[data-scene]").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.scene === currentScene);
    });
  }

  // Native Human MP3 Recording Bar (NO broken video buttons!)
  // Local-first native audio: if the MP3 has been downloaded into ./audio/<folder>/<file>
  // it plays offline; otherwise the player silently falls back to the online stream.
  function localAudioPath(url) {
    const m = String(url || "").match(/\/lfwaaudio\/audio\/(.+)$/);
    return m ? `audio/${m[1]}` : "";
  }

  function renderAudioPlayer(url, label = "Studio Native French Recording") {
    if (!url) return "";
    const safeUrl = (url || "").replace(/"/g, "&quot;");
    const local = localAudioPath(url).replace(/"/g, "&quot;");
    const src = local || safeUrl;
    return `
      <div class="audio-panel">
        <span style="font-weight:800;font-size:0.88rem;color:#fde047;">🎧 ${escapeHtml(label)} (Human Native MP3)</span>
        <audio controls preload="none" src="${src}" data-remote="${safeUrl}"
               onerror="if(this.dataset.remote && this.getAttribute('src') !== this.dataset.remote){ this.setAttribute('src', this.dataset.remote); this.load(); this.play().catch(function(){}); }"></audio>
        <div style="display:flex;gap:0.35rem;flex-wrap:wrap;">
          <button class="btn" onclick="var a=this.closest('.audio-panel').querySelector('audio');a.currentTime=Math.max(0,a.currentTime-5)">⏪ -5s</button>
          <button class="btn" onclick="var a=this.closest('.audio-panel').querySelector('audio');a.currentTime+=5">+5s ⏩</button>
          <button class="btn" onclick="var a=this.closest('.audio-panel').querySelector('audio');a.playbackRate=a.playbackRate===1?0.75:(a.playbackRate===0.75?1.25:1);this.textContent=a.playbackRate+'x'">1x Speed</button>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // SCENE ROUTER (10 FULL-SCREEN AAA GAME SCENES)
  // =========================================================================
  let currentScene = "title"; // title | worldmap | academy | battle | cafe | paris_sim | writing | grimoire | forge | codex | shop

  window.navigateScene = function (scene) {
    if (window.RPG_OVERWORLD && scene !== "worldmap") window.RPG_OVERWORLD.stop();
    if (window.RPG_BATTLE_STAGE && scene !== "battle") window.RPG_BATTLE_STAGE.stop();
    currentScene = scene;
    updateHUD();
    const container = document.getElementById("app-main");
    if (!container) return;

    if (scene === "title") renderTitleScreen(container);
    else if (scene === "worldmap") renderWorldMapScene(container);
    else if (scene === "academy") renderStageMissionScene(container);
    else if (scene === "battle") renderBattleArenaScene(container);
    else if (scene === "cafe") renderCafeVisualNovelScene(container);
    else if (scene === "paris_sim") renderParisDistrictSimScene(container);
    else if (scene === "writing") renderWritingStudioScene(container);
    else if (scene === "grimoire") renderGrimoireScene(container);
    else if (scene === "forge") renderVerbForgeScene(container);
    else if (scene === "codex") renderRoyalCodexScene(container);
    else if (scene === "shop") renderBoutiqueAndTrophiesScene(container);
    else if (scene === "salon") renderSalonScene(container);
    else if (scene === "radio") renderRadioScene(container);
    else if (scene === "soundlab") { if (window.renderSoundLab) window.renderSoundLab(container); }
    else if (scene === "bootcamp") { if (window.renderBootcamp) window.renderBootcamp(container); }
    else if (scene === "grammar") { if (window.renderGrammarBook) window.renderGrammarBook(container); }
    else if (scene === "revision") { if (window.renderTutorReview) window.renderTutorReview(container); }
    else if (scene === "gym") {
      if (!window.RPG_GYM_KEEP && window.gymHome) window.gymHome();
      window.RPG_GYM_KEEP = false;
      if (window.renderNativeGym) window.renderNativeGym(container);
    }
    if (journeyContext && journeyContext.scene !== scene) journeyContext = null;
    // The journey banner lives outside #app-main so scene re-renders can't wipe it.
    let slot = document.getElementById("journey-banner-slot");
    if (!slot) {
      slot = document.createElement("div");
      slot.id = "journey-banner-slot";
      container.parentNode.insertBefore(slot, container);
    }
    slot.innerHTML = journeyBannerHtml();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.openAcademyForLesson = function (lessonNum, wave = "eveil", specificStageId = null) {
    save.currentLessonNum = lessonNum;
    const world = DATA.lessons.find(l => l.number === lessonNum) || DATA.lessons[0];
    if (specificStageId) {
      save.currentStageId = specificStageId;
    } else if (world && world.stages && world.stages.length) {
      const nextUncleared = world.stages.find(s => isStageUnlocked(s.stageId) && !save.clearedStages[s.stageId]);
      save.currentStageId = (nextUncleared || world.stages[0]).stageId;
    }
    stageWave = wave || "eveil";
    resetStageWaveState();
    persistSave();
    window.navigateScene("academy");
  };

  window.launchStageById = function (stageId, forceUnlock = false) {
    if (!forceUnlock && !isStageUnlocked(stageId)) {
      if (window.RPG_SFX) window.RPG_SFX.damageHit();
      const lockedSt = ALL_STAGES[STAGE_INDEX_BY_ID[stageId]];
      const lockedW = lockedSt && DATA.lessons.find(l => l.number === lockedSt.worldNum);
      const levelLocked = lockedW && lockedW.native && cefrRank(campaignCefr()) < cefrRank(lockedW.unlockCefr || lockedW.cefr);
      if (window.RPG_VFX) {
        window.RPG_VFX.toast("Stage Locked 🔒", levelLocked
          ? `This Native Path world opens at ${lockedW.unlockCefr}. Keep playing the campaign: you're at ${campaignCefr()}.`
          : "Clear the previous stage first, or toggle 'Free-Roam Mode' at the top to jump ahead!", "🔒");
      }
      return;
    }
    const gIdx = STAGE_INDEX_BY_ID[stageId];
    const st = ALL_STAGES[gIdx];
    if (!st) return;
    save.currentLessonNum = st.worldNum;
    save.currentStageId = st.stageId;
    stageWave = st.type === "boss" ? "duel" : (window.renderTutorLesson && !window.RPG_TEST_SKIP_LESSON && !(save.tutorDone && save.tutorDone[st.stageId]) ? "lecon" : "eveil");
    resetStageWaveState();
    persistSave();
    window.navigateScene("academy");
  };
  window.toggleAllMenus = function () { save.showAllMenus = !save.showAllMenus; persistSave(); updateHUD(); };

  window.toggleFreeRoamMode = function () {
    save.freeRoamUnlocked = !save.freeRoamUnlocked;
    persistSave();
    if (window.RPG_VFX) {
      window.RPG_VFX.toast(
        save.freeRoamUnlocked ? "Free-Roam Mode Enabled 🔓" : "Locked Campaign Mode Enabled 🔒",
        save.freeRoamUnlocked ? `All ${ALL_STAGES.length} stages across ${DATA.lessons.length} worlds are now unlocked!` : "Sequential stage-by-stage progression restored.",
        save.freeRoamUnlocked ? "🔓" : "🔒"
      );
    }
    window.navigateScene(currentScene);
  };

  // =========================================================================
  // LE VOYAGE — JOURNEY DIRECTOR (ONE-BUTTON GAME LOOP), DAILY QUESTS, STREAK
  // A beginner should never have to decide "which tab now?". ▶ Continuer picks
  // the next best thing: warm-up reviews → next campaign stage → a story scene
  // (Café dialogue / writing / Paris district) matched to the player's level.
  // =========================================================================
  const CEFR_ORDER = ["A1", "A2", "B1", "B2", "C1", "C2"];
  let journeyContext = null; // { scene, label }

  function todayStr(offsetDays = 0) {
    const d = new Date(Date.now() + offsetDays * 86400000);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function cefrRank(c) {
    const i = CEFR_ORDER.indexOf(String(c || "A1").trim().slice(0, 2).toUpperCase());
    return i < 0 ? 0 : i;
  }

  function nextCampaignStage() {
    for (const s of ALL_STAGES) {
      if (!save.clearedStages[s.stageId] && !isNativeStage(s)) return s;
    }
    return null;
  }

  function nextNativeStage() {
    for (const s of ALL_STAGES) {
      if (isNativeStage(s) && !save.clearedStages[s.stageId] && isStageUnlocked(s.stageId)) return s;
    }
    return null;
  }

  // CEFR comes from campaign progress, not XP, so the title can't over-promise.
  function campaignCefr() {
    const nxt = nextCampaignStage();
    if (!nxt) return "C2";
    const w = DATA.lessons.find(l => l.number === nxt.worldNum);
    return (w && w.cefr) || "A1";
  }

  function levelFit(targetCefr) {
    const gap = cefrRank(targetCefr) - cefrRank(campaignCefr());
    if (gap <= 0) return { tag: "fit", label: "✅ Your level" };
    if (gap === 1) return { tag: "stretch", label: "🟡 Stretch" };
    return { tag: "locked", label: `🔒 Best from ${String(targetCefr).slice(0, 2)}` };
  }
  window.RPG_LEVEL_FIT = levelFit;

  function ensureDaily() {
    const t = todayStr();
    if (!save.daily || save.daily.date !== t) {
      const yesterday = todayStr(-1);
      if (save.streakFreezes == null) save.streakFreezes = 1;
      if (save.lastGoalDay !== yesterday && save.lastGoalDay !== t) {
        // One missed day can be saved by a streak freeze (earned every 7 days).
        if ((save.streak || 0) > 0 && save.lastGoalDay === todayStr(-2) && save.streakFreezes > 0) {
          save.streakFreezes -= 1;
          save.lastGoalDay = yesterday;
          save.freezeUsedOn = t;
        } else save.streak = 0;
      }
      save.daily = {
        date: t,
        base: {
          cards: save.stats.cardsReviewed || 0,
          stages: Object.keys(save.clearedStages || {}).length,
          spoken: save.stats.phrasesSpoken || 0,
          salon: save.stats.salonTurns || 0,
          listen: save.stats.listenSeconds || 0,
          ear: save.stats.earHits || 0,
          learn: (save.stats.roundsDone || 0) + (save.stats.lessonsTaught || 0) * 2
        },
        claimed: false,
        warmupDone: false
      };
      persistSave();
    }
    return save.daily;
  }

  function getDailyQuests() {
    const d = ensureDaily();
    if (d.base.salon == null) d.base.salon = save.stats.salonTurns || 0;
    if (d.base.listen == null) d.base.listen = save.stats.listenSeconds || 0;
    const talk = (save.stats.salonTurns || 0) - d.base.salon;
    if (d.base.ear == null) d.base.ear = save.stats.earHits || 0;
    const ear = (save.stats.earHits || 0) - d.base.ear;
    const cards = (save.stats.cardsReviewed || 0) - d.base.cards;
    const stages = Object.keys(save.clearedStages || {}).length - d.base.stages;
    const spoken = (save.stats.phrasesSpoken || 0) - d.base.spoken;
    if (d.base.learn == null) d.base.learn = (save.stats.roundsDone || 0) + (save.stats.lessonsTaught || 0) * 2;
    const learn = (save.stats.roundsDone || 0) + (save.stats.lessonsTaught || 0) * 2 - d.base.learn;
    return [
      { id: "learn", icon: "🎓", label: "Learn: 1 lesson with Camille + 1 phrase round (or 3 rounds)", cur: Math.min(3, learn), goal: 3 },
      { id: "recall", icon: "🧠", label: "Answer 15 questions anywhere", cur: Math.min(15, cards), goal: 15 },
      SERVER.ai
        ? { id: "talk", icon: "🗣️", label: "Have a 6-turn conversation in Le Salon", cur: Math.min(6, talk), goal: 6 }
        : { id: "voice", icon: "🎙️", label: "Say 5 phrases out loud", cur: Math.min(5, spoken), goal: 5 },
      { id: "ear", icon: "🎧", label: "Get 10 listening checks right (short clips)", cur: Math.min(10, ear), goal: 10 }
    ];
  }

  function dailyQuestPanelHtml() {
    const qs = getDailyQuests();
    const allDone = qs.every(q => q.cur >= q.goal);
    const enough = qs.filter(q => q.cur >= q.goal).length >= 3;
    return `
      <div class="daily-quest-panel">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:0.5rem;margin-bottom:0.5rem;">
          <span style="font-weight:900;color:#fde047;">📅 Today's Quests</span>
          <span style="font-weight:800;color:#fb923c;">🔥 Streak: ${save.streak || 0} day${(save.streak || 0) === 1 ? "" : "s"}</span>
        </div>
        ${qs.map(q => `
          <div class="dq-row ${q.cur >= q.goal ? "done" : ""}">
            <span>${q.icon} ${escapeHtml(q.label)}</span>
            <span class="dq-count">${q.cur}/${q.goal}</span>
            <div class="dq-bar"><div style="width:${Math.round((q.cur / q.goal) * 100)}%"></div></div>
          </div>
        `).join("")}
        ${save.daily && save.daily.claimed
          ? `<div style="font-size:0.82rem;color:#6ee7b7;font-weight:800;margin-top:0.35rem;">✅ Daily goal complete. À demain !</div>`
          : `<button class="btn ${enough ? "btn-gold" : ""}" style="margin-top:0.45rem;width:100%;" ${enough ? "" : "disabled"} onclick="window.claimDailyGoal()">
               ${enough ? "🎁 Claim reward (+100 XP, +80 Gold, streak +1)" : `Finish 3 of 4 to keep your streak (❄️ ${save.streakFreezes == null ? 1 : save.streakFreezes} streak freeze${(save.streakFreezes == null ? 1 : save.streakFreezes) === 1 ? "" : "s"} saved)`}
             </button>`}
        ${save.freezeUsedOn === todayStr() ? `<div style="font-size:0.78rem;color:#7dd3fc;margin-top:0.3rem;">❄️ A streak freeze saved your streak for the day you missed.</div>` : ""}
      </div>
    `;
  }
  window.RPG_DAILY_PANEL = dailyQuestPanelHtml;

  // Road to native: five skills, each with honest, countable evidence.
  const NATIVE_RANKS = ["Débutant", "Survie", "Indépendant", "Avancé", "Expert", "Natif"];
  function skillMeters() {
    const st = save.stats || {};
    const nativeCleared = ALL_STAGES.filter(x => isNativeStage(x) && save.clearedStages[x.stageId]).length;
    return [
      { icon: "👂", name: "Listening", val: (st.earHits || 0) + Math.floor((st.listenSeconds || 0) / 60), steps: [50, 300, 1000, 3000, 8000], how: "listening checks + radio minutes" },
      { icon: "🗣️", name: "Speaking", val: (st.phrasesSpoken || 0) + (st.salonTurns || 0) * 2, steps: [25, 150, 600, 2000, 6000], how: "phrases said aloud + Salon turns" },
      { icon: "📖", name: "Reading", val: (st.cardsReviewed || 0) + (st.textsRead || 0) * 25 + (st.secretsRead || 0) * 2, steps: [100, 500, 2000, 6000, 15000], how: "recall answers + Lectures texts + Secrets cards" },
      { icon: "✍️", name: "Writing", val: (st.drillsSolved || 0) + (st.writingsGraded || 0) * 10, steps: [30, 200, 800, 2500, 6000], how: "Forge answers + essays" },
      { icon: "🧠", name: "Thinking in French", val: nativeCleared * 10 + (st.salonTurns || 0) + (st.frenchOnlyHits || 0) + Math.floor((st.gymRight || 0) / 4), steps: [20, 100, 300, 700, 1500], how: "Native/Académie stages + conversations + French-only definitions + Native Gym" }
    ].map(m => {
      const rank = m.steps.filter(x => m.val >= x).length;
      const lo = rank === 0 ? 0 : m.steps[rank - 1];
      const hi = m.steps[Math.min(rank, m.steps.length - 1)];
      const pct = rank >= m.steps.length ? 100 : Math.round(((m.val - lo) / Math.max(1, hi - lo)) * 100);
      return Object.assign(m, { rank, pct, next: rank >= m.steps.length ? null : hi });
    });
  }
  window.RPG_SKILL_METERS = skillMeters;

  function roadToNativeHtml() {
    const ms = skillMeters();
    return `
      <div class="native-road">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:0.5rem;margin-bottom:0.45rem;">
          <span style="font-weight:900;color:#2dd4bf;">🗼 Road to Native</span>
          <span style="font-size:0.78rem;color:#94a3b8;">Campaign level: <b style="color:#fde047;">${campaignCefr()}</b> • ${immersionLabel()}</span>
        </div>
        ${ms.map(m => `
          <div class="nr-row" title="${escapeHtml(m.how)}">
            <span class="nr-name">${m.icon} ${m.name}</span>
            <span class="nr-rank r${m.rank}">${NATIVE_RANKS[m.rank]}</span>
            <div class="nr-bar"><div style="width:${m.pct}%"></div></div>
            <span class="nr-val">${m.val}${m.next ? ` / ${m.next}` : " ✓"}</span>
          </div>`).join("")}
      </div>`;
  }

  window.claimDailyGoal = function () {
    ensureDaily();
    if (save.daily.claimed) return;
    if (getDailyQuests().filter(q => q.cur >= q.goal).length < 3) return;
    save.daily.claimed = true;
    save.streak = save.lastGoalDay === todayStr(-1) ? (save.streak || 0) + 1 : 1;
    if (save.streak > 0 && save.streak % 7 === 0) save.streakFreezes = Math.min(2, (save.streakFreezes == null ? 1 : save.streakFreezes) + 1);
    save.lastGoalDay = todayStr();
    addXP(100, 80);
    if (window.RPG_SFX) window.RPG_SFX.victoryFanfare();
    if (window.RPG_VFX) window.RPG_VFX.toast("Daily Goal Complete!", `🔥 ${save.streak}-day streak. +100 XP, +80 Gold`, "🎁");
    window.navigateScene(currentScene);
  };

  function pickStoryScene() {
    const myRank = cefrRank(campaignCefr());
    const cycle = (save.storyCounter || 0) % 3;
    save.storyCounter = (save.storyCounter || 0) + 1;

    const tryCafe = () => {
      const nxt = nextCampaignStage();
      const worldNum = nxt ? nxt.worldNum : 1;
      const dialogues = DATA.exercises.filter(e => e.dialogueTurns && e.dialogueTurns.length > 0);
      const target = dialogues.filter(d => {
        const w = DATA.lessons.find(l => l.id === d.lessonId);
        return w && w.number <= worldNum;
      }).pop();
      if (!target) return null;
      return { scene: "cafe", label: `☕ Story scene: ${target.title}`, go: () => window.openCafeForLesson(target.lessonId) };
    };
    const tryWriting = () => {
      const missions = window.WRITING_MISSIONS || [];
      const idx = missions.findIndex(m => cefrRank(m.cefr) <= myRank && !(save.completedWritings || {})[m.id]);
      if (idx < 0) return null;
      return { scene: "writing", label: `✍️ Writing quest: ${missions[idx].title}`, go: () => { writingAutoPicked = true; activeWritingMissionIdx = idx; window.navigateScene("writing"); } };
    };
    const tryParis = () => {
      const ds = window.PARIS_LIFE_DISTRICTS || [];
      const idx = ds.findIndex(d => cefrRank(d.cefrRange) <= myRank && !(save.clearedDistricts || {})[d.id]);
      if (idx < 0) return null;
      return { scene: "paris_sim", label: `🏙️ Paris encounter: ${ds[idx].name}`, go: () => { activeParisDistrictIdx = idx; activeParisStepIdx = 0; window.navigateScene("paris_sim"); } };
    };
    const trySalon = () => {
      if (!SERVER.ai) return null;
      const pool = SALON_SCENES.map((s, i) => ({ s, i })).filter(x => cefrRank(x.s.cefr) <= myRank && x.s.id !== "libre");
      if (!pool.length) return null;
      const pick = pool[(save.storyCounter || 0) % pool.length];
      return { scene: "salon", label: `🗣️ Story conversation with ${pick.s.name}: ${pick.s.goal}`, go: () => { salon.topic = null; salon.sceneIdx = pick.i; salon.log = []; window.navigateScene("salon"); } };
    };
    const order = [[tryCafe, trySalon, tryWriting, tryParis], [trySalon, tryWriting, tryParis, tryCafe], [tryParis, trySalon, tryCafe, tryWriting]][cycle];
    for (const fn of order) {
      const r = fn();
      if (r) return r;
    }
    return null;
  }

  window.continueJourney = function () {
    ensureDaily();
    const now = Date.now();
    const due = Object.values(save.fsrsCards || {}).filter(e => (e.due || 0) <= now).length;
    const mistakes = Object.keys(save.mistakeVault || {}).length;

    // 0) Day 0: a total beginner starts with the Bootcamp (sounds, survival phrases).
    const clearedNow = Object.keys(save.clearedStages || {}).length;
    if (clearedNow === 0 && window.renderBootcamp && window.SOUND_LAB_READY && !(save.bootcamp && save.bootcamp.completed) && !save.bootcampSkipped) {
      journeyContext = { scene: "bootcamp", label: "🐣 Day 0: 8 tiny steps to hear and say your first French. Then press ▶ Continue to start World 1." };
      window.navigateScene("bootcamp");
      return;
    }

    // 1) Warm-up: once per day, if there's enough to review.
    if (!save.daily.warmupDone && mistakes >= 3 && window.startReviewLesson) {
      save.daily.warmupDone = true;
      persistSave();
      journeyContext = { scene: "revision", label: `📕 Warm-up with Camille: let's fix ${Math.min(6, mistakes)} things you found hard. Then press ▶ Continue.` };
      window.startReviewLesson();
      return;
    }
    if (!save.daily.warmupDone && due + mistakes >= 5) {
      save.daily.warmupDone = true;
      persistSave();
      grimoireCursor = 0;
      journeyContext = { scene: "grimoire", label: `🔥 Warm-up: review your ${Math.min(10, due + mistakes)} weakest words (${mistakes} past mistakes, ${due} due). Then press ▶ Continue.` };
      window.navigateScene("grimoire");
      return;
    }

    // 2) Daily immersion once you have cleared 2 stages today: real listening, then real conversation.
    const qs = getDailyQuests();
    const stagesToday = Object.keys(save.clearedStages || {}).length - ((save.daily && save.daily.base && save.daily.base.stages) || 0);
    const stagesQ = { cur: stagesToday, goal: 2 };
    if (stagesQ && stagesQ.cur >= stagesQ.goal) {
      const listenQ = qs.find(q => q.id === "listen");
      if (listenQ && listenQ.cur < listenQ.goal && !save.daily.radioOffered) {
        save.daily.radioOffered = true;
        persistSave();
        journeyContext = { scene: "radio", label: "📻 Daily immersion: listen to 10 minutes of a show marked ✅. Then press ▶ Continue." };
        window.navigateScene("radio");
        return;
      }
      const talkQ = qs.find(q => q.id === "talk");
      if (talkQ && talkQ.cur < talkQ.goal && !save.daily.salonOffered) {
        save.daily.salonOffered = true;
        persistSave();
        const myRank = cefrRank(campaignCefr());
        const fitIdx = Math.max(0, SALON_SCENES.map((s, i) => ({ s, i })).filter(x => cefrRank(x.s.cefr) <= myRank && x.s.id !== "libre" && x.s.id !== "journal").map(x => x.i).pop() || 0);
        const journalIdx = SALON_SCENES.findIndex(s => s.id === "journal");
        const useJournal = journalIdx >= 0 && new Date().getDate() % 2 === 0; // every other day: talk about your real day
        salon.topic = null;
        salon.sceneIdx = useJournal ? journalIdx : fitIdx;
        salon.log = [];
        journeyContext = { scene: "salon", label: useJournal
          ? "📔 Daily conversation: tell Camille about your real day (6 turns). Think in French, use 🎙️! Then press ▶ Continue."
          : "🗣️ Daily conversation: talk for 6 turns. Use 🎙️ and speak out loud! Then press ▶ Continue." };
        window.navigateScene("salon");
        return;
      }
    }

    // 2b) One Native Gym session a day (2–4 min), rotating mode, after the first stage of the day.
    if (Object.keys(save.clearedStages || {}).length >= 6 && !save.daily.gymOffered && window.gymStart && window.NATIVE_GYM_DATA) {
      save.daily.gymOffered = true;
      persistSave();
      const modes = ["spoken", "definitions", "scenes", "culture"];
      const m = modes[new Date().getDate() % modes.length];
      const label = { spoken: "🎧 Native Gym: decode real-speed spoken French (10 quick rounds)", definitions: "🧠 Native Gym: think in French. Definitions only, no English (10 rounds)", scenes: "🎭 Native Gym: pick a real-life scene and answer like a native", culture: "🏛️ Native Gym: 10 culture questions every French person knows" }[m];
      journeyContext = { scene: "gym", label: `${label}. Then press ▶ Continue.` };
      window.gymStart(m);
      return;
    }

    // 3) Story scene every 3 cleared stages.
    const cleared = Object.keys(save.clearedStages || {}).length;
    if (cleared > 0 && cleared % 3 === 0 && save.lastStoryAt !== cleared) {
      save.lastStoryAt = cleared;
      const story = pickStoryScene();
      persistSave();
      if (story) {
        journeyContext = { scene: story.scene, label: `${story.label} — use what you've just learned in a real situation. Press ▶ Continue when you're done.` };
        story.go();
        return;
      }
    }

    // 3b) Native Path: real spoken French, mixed in every 4 cleared stages once unlocked.
    const nat = nextNativeStage();
    if (nat && cleared > 0 && cleared % 4 === 2 && save.lastNativeAt !== cleared) {
      save.lastNativeAt = cleared;
      persistSave();
      journeyContext = { scene: "academy", label: `🗼 Native Path: « ${nat.title} ». How French people really talk. Press ▶ Continue when you're done.` };
      window.launchStageById(nat.stageId, true);
      return;
    }

    // 4) Next campaign stage (then the Native Path once the campaign is done).
    const nxt = nextCampaignStage() || nextNativeStage();
    journeyContext = null;
    if (nxt) {
      window.launchStageById(nxt.stageId, true);
    } else {
      window.navigateScene("writing");
    }
  };

  function journeyBannerHtml() {
    if (!journeyContext || journeyContext.scene !== currentScene) return "";
    return `
      <div class="journey-banner">
        <span>🧭 ${escapeHtml(journeyContext.label)}</span>
        <button class="btn btn-gold" onclick="window.continueJourney()">▶ Continue</button>
      </div>
    `;
  }

  window.dismissOnboarding = function () {
    save.onboarded = true;
    persistSave();
    const el = document.getElementById("onboarding-modal");
    if (el) el.remove();
  };

  function onboardingModalHtml() {
    if (save.onboarded) return "";
    return `
      <div id="onboarding-modal" class="journey-modal-backdrop">
        <div class="journey-modal">
          <div style="font-size:0.8rem;color:#fde047;font-weight:900;letter-spacing:0.08em;">BIENVENUE • HOW THIS GAME WORKS</div>
          <h2 style="font-size:1.6rem;font-weight:900;margin:0.35rem 0 0.75rem;">Starting from zero? Here's your route.</h2>
          <div class="onboard-teacher"><img src="assets/tutor_camille.jpg" alt=""><div>Bonjour ! I'm <b>Camille</b>, your French teacher. Here is all you need to know:</div></div>
          <ol class="onboard-list">
            <li><strong>Press ▶ Continuer every day.</strong> I choose the next step for you: a lesson with me, then practice, then a duel.</li>
            <li><strong>Say everything out loud.</strong> Tap 🔊 to hear, then repeat. Your mouth learns French by speaking it.</li>
            <li><strong>Stuck? Tap 🙋 Ask Camille</strong> (bottom-left) or the ❓ Why? button after a mistake. Mistakes are good: I bring them back until you've got them.</li>
          </ol>
          <div class="feedback-banner ok" style="font-size:0.84rem;">
            🎯 Everything you need is in here: lessons, grammar, writing, conversation (Le Salon), and real French radio, podcasts and séries (Radio Paris). Press ▶ Continuer and the game mixes them for you every day.
          </div>
          <button class="btn btn-gold" style="width:100%;padding:0.9rem;font-size:1.05rem;margin-top:0.6rem;" onclick="window.dismissOnboarding()">C'est parti ! Start my journey</button>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // SCENE 1: CINEMATIC AAA TITLE SCREEN
  // =========================================================================
  function renderTitleScreen(container) {
    const nxtStage = nextCampaignStage();
    const active = getActiveWorldAndStage();
    const world = nxtStage ? (DATA.lessons.find(l => l.number === nxtStage.worldNum) || active.world) : active.world;
    const stage = nxtStage || active.stage;
    const clearedCount = Object.keys(save.clearedStages || {}).length;

    container.innerHTML = `
      <div class="title-screen-stage">
        <div class="title-screen-overlay"></div>
        <div class="title-screen-content">
          <div class="title-crown-pill">⚜️ CHRONIQUES DE PARIS • A1 BEGINNER TO C2 NATIVE &amp; CAREER RPG ⚜️</div>
          <h1 class="title-logo-main">L'ODYSSÉE FRANÇAISE</h1>
          <div style="font-size:1.22rem;font-weight:800;color:#38bdf8;letter-spacing:0.06em;">${DATA.lessons.length} WORLDS • ${ALL_STAGES.length} STAGES • NATIVE PATH • PARIS SIM • DALF C2 STUDIO</div>
          <p class="title-subtitle">
            Start at <strong>Stage 1-1 in Provence (A1)</strong> and conquer <strong>${ALL_STAGES.length} stages</strong> across <strong>${DATA.lessons.length} Worlds</strong>—mastering grammar, fast Parisian street reflexes in <strong>Vie à Paris</strong>, executive leadership at <strong>La Défense</strong>, and the <strong>DALF C2 Grand Jury Exam</strong> in short, punchy rounds. No long recordings to sit through.
          </p>

          <div class="title-menu-deck">
            <button class="title-menu-btn primary-start" onclick="window.continueJourney()">
              <span class="tm-icon">▶️</span>
              <div>
                <div class="tm-title">${clearedCount === 0 ? 'COMMENCER L\u2019AVENTURE (START FROM ZERO)' : `CONTINUER L\u2019AVENTURE (${clearedCount}/${ALL_STAGES.length} STAGES)`}</div>
                <div class="tm-desc">Next: World ${String(world.number).padStart(2, "0")} • ${escapeHtml(stage.title)} (${world.cefr}). The game picks reviews, stages &amp; story scenes for you.</div>
              </div>
            </button>

            ${clearedCount === 0 ? `
            <button class="title-menu-btn" onclick="window.navigateScene('bootcamp')" style="border-color:#fde047;">
              <span class="tm-icon">🐣</span>
              <div>
                <div class="tm-title">DAY 0 BOOTCAMP (TOTAL BEGINNER? START HERE)</div>
                <div class="tm-desc">8 tiny steps with Camille: the sounds of French, hello &amp; please, survival phrases, numbers. About 15 minutes.</div>
              </div>
            </button>` : ""}
            <div style="grid-column:1 / -1;">${dailyQuestPanelHtml()}</div>
            <div style="grid-column:1 / -1;">${roadToNativeHtml()}</div>

            <button class="title-menu-btn" onclick="window.openAskTeacher && window.openAskTeacher()">
              <span class="tm-icon">🙋</span>
              <div>
                <div class="tm-title">ASK CAMILLE (YOUR FRENCH TEACHER)</div>
                <div class="tm-desc">Ask any question about French, in English or French, any time. Every wrong answer also has a ❓ Why? button.</div>
              </div>
            </button>

            <button class="title-menu-btn" onclick="window.navigateScene('soundlab')">
              <span class="tm-icon">👄</span>
              <div>
                <div class="tm-title">LE LABO DES SONS (PRONUNCIATION LAB)</div>
                <div class="tm-desc">The 18 sounds of French that English speakers find hard: mouth tips, ear duels with look-alike words, mic checks.</div>
              </div>
            </button>

            <button class="title-menu-btn" onclick="window.navigateScene('grammar')">
              <span class="tm-icon">📘</span>
              <div>
                <div class="tm-title">MA GRAMMAIRE (EVERY RULE, SEARCHABLE)</div>
                <div class="tm-desc">All the grammar notes of the course in one handbook. Search any word, hear every example.</div>
              </div>
            </button>

            <button class="title-menu-btn" onclick="window.navigateScene('salon')">
              <span class="tm-icon">🗣️</span>
              <div>
                <div class="tm-title">LE SALON (TALK WITH AN AI FRENCH PARTNER)</div>
                <div class="tm-desc">Speak or type. It replies out loud, corrects you, and adapts from A1 café chat to the DALF C2 jury.</div>
              </div>
            </button>

            <button class="title-menu-btn" onclick="window.navigateScene('gym')">
              <span class="tm-icon">🧠</span>
              <div>
                <div class="tm-title">LA SALLE DU NATIF (NATIVE GYM)</div>
                <div class="tm-desc">Real-speed spoken French, French-only definitions, real-life scenes and French culture. 2–4 minute sessions.</div>
              </div>
            </button>

            <button class="title-menu-btn" onclick="window.navigateScene('radio')">
              <span class="tm-icon">📻</span>
              <div>
                <div class="tm-title">RADIO PARIS (REAL PODCASTS, RADIO &amp; SÉRIES)</div>
                <div class="tm-desc">13 real French shows from Coffee Break French to France Culture, plus séries to watch.</div>
              </div>
            </button>

            <button class="title-menu-btn" onclick="window.navigateScene('worldmap')">
              <span class="tm-icon">🗺️</span>
              <div>
                <div class="tm-title">WORLD MAP (${DATA.lessons.length} WORLDS &amp; ${ALL_STAGES.length} STAGES)</div>
                <div class="tm-desc">Provence (A1) → Paris Career &amp; DALF C2, plus the 🗼 Native Path and 🏝️ Académie islands (Worlds 47–${DATA.lessons.length})</div>
              </div>
            </button>

            <button class="title-menu-btn" onclick="window.navigateScene('paris_sim')">
              <span class="tm-icon">🏙️</span>
              <div>
                <div class="tm-title">VIE À PARIS (OPEN-WORLD DISTRICT SIM)</div>
                <div class="tm-desc">6 Parisian Districts • 3 Registers: Familier, Courant &amp; Soutenu</div>
              </div>
            </button>

            <button class="title-menu-btn" onclick="window.navigateScene('writing')">
              <span class="tm-icon">✍️</span>
              <div>
                <div class="tm-title">ATELIER D'ÉCRITURE (WRITING A1→C2)</div>
                <div class="tm-desc">12 Writing Missions (A1→C2) + C1/C2 structure checklist</div>
              </div>
            </button>

            <button class="title-menu-btn" onclick="window.navigateScene('grimoire')">
              <span class="tm-icon">📕</span>
              <div>
                <div class="tm-title">GRIMOIRE DES ERREURS &amp; FSRS-5 DECK</div>
                <div class="tm-desc">Spaced Repetition Memory Engine, Mistake Vault &amp; &lt;3s Reflex Blitz</div>
              </div>
            </button>

            <button class="title-menu-btn" onclick="window.navigateScene('battle')">
              <span class="tm-icon">⚔️</span>
              <div>
                <div class="tm-title">2D TURN-BASED BOSS BATTLE ARENA</div>
                <div class="tm-desc">60-FPS Canvas Combat, 4 Spell Schools, Relics &amp; Studio Voice</div>
              </div>
            </button>

            <button class="title-menu-btn" onclick="window.navigateScene('forge')">
              <span class="tm-icon">⚒️</span>
              <div>
                <div class="tm-title">LA GRANDE FORGE (ALL 94 VERBS)</div>
                <div class="tm-desc">Master 8,692 conjugated forms across all 11 French tenses</div>
              </div>
            </button>

            <button class="title-menu-btn" onclick="window.navigateScene('codex')">
              <span class="tm-icon">📜</span>
              <div>
                <div class="tm-title">ROYAL CODEX (53 THEMES &amp; 10,854 CARDS)</div>
                <div class="tm-desc">All 53 Vocabulary Themes + Google Drive Cloud Vault</div>
              </div>
            </button>
          </div>
        </div>
      </div>
      ${onboardingModalHtml()}
    `;
  }

  // =========================================================================
  // SCENE 2: PLAYABLE 2D OVERWORLD MAP OF FRANCE (46 WORLDS + STAGE TRAIL)
  // =========================================================================
  function renderWorldMapScene(container) {
    const curNum = save.currentLessonNum || 1;
    container.innerHTML = `
      <div class="worldmap-wrapper">
        <div class="worldmap-left">
          <div class="map-toolbar">
            <div class="map-region-pills">
              <button class="region-pill" onclick="window.RPG_OVERWORLD.moveToNode(1)">🌸 A1 Provence (W1-12)</button>
              <button class="region-pill" onclick="window.RPG_OVERWORLD.moveToNode(13)">⛵ A2 Côte (W13-19)</button>
              <button class="region-pill" onclick="window.RPG_OVERWORLD.moveToNode(20)">🍷 B1 Bordeaux (W20-29)</button>
              <button class="region-pill" onclick="window.RPG_OVERWORLD.moveToNode(30)">🏰 B2 Loire (W30-36)</button>
              <button class="region-pill" onclick="window.RPG_OVERWORLD.moveToNode(37)">🏔️ C1 Alpes (W37-38)</button>
              <button class="region-pill" onclick="window.RPG_OVERWORLD.moveToNode(39)">👑 C1/C2 Paris, Career &amp; DALF (W39-46)</button>
              <button class="region-pill" onclick="window.RPG_OVERWORLD.moveToNode(47)">🗼 Native Path (W47-52)</button>
              ${DATA.lessons.length > 52 ? `<button class="region-pill" onclick="window.RPG_OVERWORLD.moveToNode(53)">🏝️ Académie (W53-${DATA.lessons.length})</button>` : ""}
            </div>
            <button class="btn ${save.freeRoamUnlocked ? 'btn-emerald' : 'btn-gold'}" style="padding:0.35rem 0.75rem;font-size:0.76rem;" onclick="window.toggleFreeRoamMode()">
              ${save.freeRoamUnlocked ? `🔓 Free-Roam: All ${ALL_STAGES.length} Stages Open` : '🔒 Campaign Lock Active (Click for Free-Roam)'}
            </button>
          </div>
          <div class="worldmap-canvas-frame">
            <canvas id="overworld-canvas" width="1120" height="630"></canvas>
            <div class="map-zoom-controls">
              <button title="Zoom in (+)" onclick="window.RPG_OVERWORLD.zoomIn()">＋</button>
              <button title="Zoom out (−)" onclick="window.RPG_OVERWORLD.zoomOut()">－</button>
              <button title="Show whole map (0)" onclick="window.RPG_OVERWORLD.fit()">⤢</button>
              <button title="Go to my hero" onclick="window.RPG_OVERWORLD.focusHero()">🧙</button>
              <button title="Full screen" onclick="window.RPG_OVERWORLD.toggleFullscreen()">⛶</button>
            </div>
          </div>
          <div class="map-help">🖱️ Click a world to select • double-click to play • scroll or ＋/－ to zoom • drag to move • ←/→ to walk • Enter to play</div>
        </div>

        <div class="worldmap-inspector" id="worldmap-inspector-box"></div>
      </div>
    `;

    updateWorldMapInspector(curNum);
    if (window.RPG_OVERWORLD) {
      window.RPG_OVERWORLD.init("overworld-canvas", curNum, (selectedNum) => {
        save.currentLessonNum = selectedNum;
        const w = DATA.lessons.find(l => l.number === selectedNum);
        if (w && w.stages && w.stages.length) {
          const nextSt = w.stages.find(s => isStageUnlocked(s.stageId) && !save.clearedStages[s.stageId]) || w.stages[0];
          save.currentStageId = nextSt.stageId;
        }
        persistSave();
        updateWorldMapInspector(selectedNum);
      });
    }
  }

  function updateWorldMapInspector(num) {
    const box = document.getElementById("worldmap-inspector-box");
    if (!box) return;
    const world = DATA.lessons.find(l => l.number === num) || DATA.lessons[0];
    const stages = world.stages || [];
    const clearedInWorld = stages.filter(s => !!save.clearedStages[s.stageId]).length;

    box.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span class="badge-cefr badge-${world.cefr}">${world.native ? (world.region === "academie" ? "🏝️ ACADÉMIE" : "🗼 NATIVE PATH") : `${world.cefr} REALM`} • WORLD ${String(world.number).padStart(2, "0")} / ${DATA.lessons.length}</span>
        <span style="font-weight:800;font-size:0.84rem;color:#fde047;">
          ⭐ ${clearedInWorld} / ${stages.length} Stages Cleared
        </span>
      </div>

      <h2 style="font-size:1.32rem;font-weight:900;color:#fff;line-height:1.25;">
        World ${String(world.number).padStart(2, "0")}: ${escapeHtml(world.title)}
      </h2>
      ${world.native ? `<div class="feedback-banner ok" style="font-size:0.84rem;">${world.region === "academie" ? "🏝️" : "🗼"} ${escapeHtml(world.blurb || "")} Opens at ${escapeHtml(world.unlockCefr || world.cefr)}.${cefrRank(campaignCefr()) < cefrRank(world.unlockCefr || world.cefr) ? ` 🔒 You're at ${campaignCefr()} now.` : " ✅ Open."}</div>` : ""}

      <div style="font-size:0.78rem;color:var(--text-muted);font-weight:700;">
        SEQUENTIAL STAGE PATH (Clear each stage to unlock the next!):
      </div>

      <div class="stage-trail-list">
        ${stages.map((st) => {
          const stars = save.clearedStages[st.stageId] || 0;
          const unlocked = isStageUnlocked(st.stageId);
          const isCurrent = st.stageId === save.currentStageId;
          const typeIcons = { core: "🌟", supplementary: "📚", exercise: "🎧", boss: "🐉" };
          const icon = typeIcons[st.type] || "⚔️";
          return `
            <div class="stage-node-card ${stars > 0 ? 'cleared' : ''} ${isCurrent ? 'active-stage' : ''} ${!unlocked ? 'locked' : ''}"
                 onclick="window.launchStageById('${st.stageId}')">
              <div style="display:flex;align-items:center;gap:0.65rem;">
                <span style="font-size:1.25rem;">${unlocked ? icon : "🔒"}</span>
                <div>
                  <div style="font-size:0.72rem;font-weight:900;color:#fde047;text-transform:uppercase;">
                    STAGE ${escapeHtml(st.stageCode)} • ${escapeHtml(st.type)}
                  </div>
                  <div style="font-size:0.88rem;font-weight:800;color:#fff;">
                    ${escapeHtml(st.title)}
                  </div>
                  ${unlocked ? (() => { const m = stageMastery(world, st); return `<div class="trail-mastery"><div style="width:${m.pct}%"></div></div><div style="font-size:0.68rem;color:#94a3b8;font-weight:700;">Mastery ${m.pct}% • ${m.totalPh} phrases • ${m.bites} secrets</div>`; })() : ""}
                </div>
              </div>
              <div style="font-size:0.82rem;font-weight:900;white-space:nowrap;color:${stars > 0 ? '#fde047' : (unlocked ? '#38bdf8' : '#64748b')};">
                ${stars > 0 ? "⭐".repeat(stars) : (unlocked ? "PLAY ▶" : "LOCKED")}
              </div>
            </div>
          `;
        }).join("")}
      </div>

      <div style="border-top:1px solid rgba(148,163,184,0.2);padding-top:0.65rem;">
        <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:0.35rem;font-weight:700;">SELECT ANY WORLD (01–${DATA.lessons.length}):</div>
        <select class="btn" style="width:100%;" onchange="window.RPG_OVERWORLD.moveToNode(Number(this.value))">
          ${DATA.lessons.map(l => {
            const stCount = (l.stages || []).length;
            const clCount = (l.stages || []).filter(s => !!save.clearedStages[s.stageId]).length;
            return `
              <option value="${l.number}" ${l.number === world.number ? 'selected' : ''}>
                [${l.cefr}] W${String(l.number).padStart(2, "0")}: ${escapeHtml(l.title.slice(0, 34))} (${clCount}/${stCount}⭐)
              </option>
            `;
          }).join("")}
        </select>
      </div>
    `;
  }

  // =========================================================================
  // SCENE 3: 5-WAVE PLAYABLE STAGE MISSION ENGINE (460 SEQUENTIAL STAGES)
  // Wave 1: L'Éveil (Briefing & Rules) -> Wave 2: L'Assaut (5-Pair Reflex Match) ->
  // Wave 3: L'Écho (Audio & Speaking) -> Wave 4: La Forge (Cloze/Tiles) ->
  // Wave 5: Le Duel (Guardian Trial & ⭐⭐⭐ Star Unlock of Next Stage!)
  // =========================================================================
  let stageWave = "eveil"; // lecon | eveil | forge | assaut | echo | duel  (+ secrets = notes)
  let lastStageScrollKey = null;
  let stageSlideIdx = 0;
  let stageShowAllSlides = false;
  let stageBatchIdx = 0;
  let batchMatchSelectedLeft = null;
  let batchMatchedPairs = {};
  let echoCursor = 0;
  let forgeCursor = 0;
  let duelStrikesRemaining = 3;
  let duelMistakes = 0;
  let duelCursor = 0;

  function resetStageWaveState() {
    stageSlideIdx = 0;
    stageBatchIdx = 0;
    batchMatchSelectedLeft = null;
    batchMatchedPairs = {};
    echoCursor = 0;
    forgeCursor = 0;
    duelStrikesRemaining = 3;
    duelMistakes = 0;
    duelCursor = 0;
    duelInitKey = null;
    duelOrderKey = null;
    echoRoundStart = 0;
    forgeRoundStage = null;
    biteStageId = null;
  }

  // Per-stage progress bags (rounds done, notes seen…) stored in the save.
  function bag(name) {
    if (!save[name] || typeof save[name] !== "object") save[name] = {};
    return save[name];
  }

  function getStageCardsPool(world, stage) {
    if (stage.cards && stage.cards.length >= 3) return stage.cards;
    const wCards = (window.RPG_INDEX && window.RPG_INDEX.CARDS_BY_LESSON[world.id]) || [];
    if (wCards.length >= 3) return wCards;
    return DATA.flashcards.slice(0, 15);
  }

  function getStageDrillsPool(world, stage, cardsPool) {
    const combined = [];
    if (stage.drills && stage.drills.length) combined.push(...stage.drills);
    if (stage.sentences && stage.sentences.length) {
      stage.sentences.forEach((s) => {
        if (s.fr && s.clozeAnswer) {
          combined.push({
            type: "cloze",
            instruction: `Complete the ${stage.exType || 'French'} line:`,
            prompt: s.clozePrompt || s.fr,
            clozeAnswer: s.clozeAnswer,
            answer: s.fr,
            choices: s.wordBank || [s.clozeAnswer],
            explanation: s.en || ""
          });
        }
      });
    }
    if (combined.length === 0) {
      cardsPool.slice(0, 8).forEach((c, idx) => {
        const distractors = cardsPool.filter(x => x.fr !== c.fr).slice(0, 3).map(x => x.fr);
        const opts = [c.fr, ...distractors];
        const rot = idx % opts.length;
        combined.push({
          type: "mcq",
          instruction: "Select the authentic French expression:",
          prompt: c.en,
          clozeAnswer: c.fr,
          answer: c.fr,
          choices: opts.slice(rot).concat(opts.slice(0, rot)),
          explanation: c.note || ""
        });
      });
    }
    return combined;
  }

  function renderStageMissionScene(container) {
    const { world, stage, stages } = getActiveWorldAndStage();
    const gIdx = STAGE_INDEX_BY_ID[stage.stageId] || 0;
    const nextStage = ALL_STAGES[gIdx + 1] || null;
    const stars = save.clearedStages[stage.stageId] || 0;
    const cardsPool = getStageCardsPool(world, stage);
    const drillsPool = getStageDrillsPool(world, stage, cardsPool);

    const waveDescriptions = {
      lecon: `LEARN • Step 1 — Camille teaches you this stage one idea at a time: explanation, example, your answer, and why.`,
      eveil: `LEARN • Step 2 — Phrases: every phrase of this stage, 6 per round. Hear it, say it, then a quick check.`,
      secrets: `NOTES — the original course notes of this stage as small cards (also in 📘 Ma Grammaire).`,
      forge: `PRACTISE • Step 3 — La Forge: use the grammar of Stage ${stage.stageCode} in sentences, 8 per round.`,
      assaut: `PRACTISE • Step 4 — Reflex Match: link French straight to meaning, board after board.`,
      echo: `PRACTISE • Step 5 — Ear & Mic: listen, write what you hear, or say it. 8 per round.`,
      duel: `PROVE • Step 6 — Le Duel: the Guardian attacks with phrases from the whole stage. Win to earn ⭐ and unlock ${nextStage ? `Stage ${nextStage.stageCode}` : 'C2 Mastery'}!`
    };

    const bgBanner = world.number >= 41 ? "assets/bg_career.jpg" : "assets/bg_phonetics.jpg";

    container.innerHTML = `
      <!-- Top World & Stage Selector Bar -->
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.65rem;margin-bottom:0.65rem;">
        <div style="display:flex;gap:0.45rem;align-items:center;flex-wrap:wrap;">
          <button class="btn" onclick="window.navigateScene('worldmap')">🗺️ World Map</button>
          <select class="btn" style="font-weight:800;color:#fde047;" onchange="window.openAcademyForLesson(Number(this.value), 'eveil')">
            ${DATA.lessons.map(l => `
              <option value="${l.number}" ${l.number === world.number ? 'selected' : ''}>
                [${l.cefr}] World ${String(l.number).padStart(2, "0")}: ${escapeHtml(l.title.slice(0, 38))}
              </option>
            `).join("")}
          </select>
        </div>
        <div style="display:flex;gap:0.45rem;flex-wrap:wrap;align-items:center;">
          <button class="btn ${save.freeRoamUnlocked ? 'btn-emerald' : ''}" onclick="window.toggleFreeRoamMode()">
            ${save.freeRoamUnlocked ? '🔓 Free-Roam ON' : '🔒 Progression Lock ON'}
          </button>
          ${nextStage ? `
            <button class="btn ${isStageUnlocked(nextStage.stageId) ? 'btn-gold' : ''}" onclick="window.launchStageById('${nextStage.stageId}')">
              Next: Stage ${escapeHtml(nextStage.stageCode)} ➡️
            </button>
          ` : ""}
        </div>
      </div>

      <!-- Horizontal Stage Progression Trail for Current World -->
      <div class="stage-horizontal-strip">
        ${stages.map((st) => {
          const stStars = save.clearedStages[st.stageId] || 0;
          const unlocked = isStageUnlocked(st.stageId);
          const active = st.stageId === stage.stageId;
          return `
            <button class="stage-pill-btn ${active ? 'active' : ''} ${stStars > 0 ? 'cleared' : ''} ${!unlocked ? 'locked' : ''}"
                    onclick="window.launchStageById('${st.stageId}')">
              <span>${stStars > 0 ? "⭐".repeat(stStars) : (unlocked ? "🎯" : "🔒")}</span>
              <span>Stage ${escapeHtml(st.stageCode)}: ${escapeHtml(st.title.slice(0, 24))}</span>
            </button>
          `;
        }).join("")}
      </div>

      <!-- Mentor Camille Stage Briefing Banner -->
      <div class="mentor-dialogue-banner" style="background:linear-gradient(135deg, rgba(10,16,36,0.92), rgba(25,20,60,0.92)), url('${bgBanner}') center/cover no-repeat;">
        <div class="mentor-avatar-circle">⚜️</div>
        <div style="flex:1;">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.2rem;">
            <span style="font-weight:900;color:#fde047;font-size:0.95rem;">
              STAGE ${escapeHtml(stage.stageCode)} (${escapeHtml(stage.type.toUpperCase())}) • ${escapeHtml(stage.title)}
            </span>
            <span class="badge-cefr badge-${world.cefr}">
              ${world.cefr} • ${stars > 0 ? `CLEARED ${"⭐".repeat(stars)}` : "IN PROGRESS"}
            </span>
          </div>
          <div style="color:#f1f5f9;font-size:0.92rem;line-height:1.45;">
            ${waveDescriptions[stageWave] || waveDescriptions.eveil}
          </div>
        </div>
      </div>

      <!-- Stage mastery meter -->
      ${(() => {
        const m = stageMastery(world, stage);
        return `<div class="stage-mastery">
          <div class="sm-ring" style="--p:${m.pct}"><span>${m.pct}%</span></div>
          <div class="sm-body">
            <div class="sm-title">STAGE MASTERY</div>
            <div class="sm-parts">
              <span class="${m.learned >= m.totalPh ? "ok" : ""}">⚡ Phrases ${m.learned}/${m.totalPh}</span>
              <span class="${m.lessonDone ? "ok" : ""}">🎓 Lesson ${m.lessonDone ? "✓" : "to do"}</span>
              <span class="${m.fDone >= m.fRounds ? "ok" : ""}">⚒️ Forge ${m.fDone}/${m.fRounds} rounds</span>
              <span class="${m.stars ? "ok" : ""}">⚔️ Duel ${m.stars ? "⭐".repeat(m.stars) : "not yet"}</span>
            </div>
          </div>
        </div>`;
      })()}

      <!-- 6-step Stage Path: LEARN → PRACTISE → PROVE -->
      <div class="academy-stage-portals six">
        ${[
          ["lecon", "learn", "LEARN • 1", "🎓 Camille's lesson", !!(save.tutorDone && save.tutorDone[stage.stageId])],
          ["eveil", "learn", "LEARN • 2", "⚡ Phrases", introLearnedCount(stage, cardsPool) >= introAllCards(cardsPool).length],
          ["forge", "", "PRACTISE • 3", "⚒️ La Forge", (bag("forgeRoundsDone")[stage.stageId] || 0) >= forgeRoundCount(drillsPool)],
          ["assaut", "", "PRACTISE • 4", "⚡ Reflex Match", false],
          ["echo", "", "PRACTISE • 5", "🎧 Ear &amp; Mic", false],
          ["duel", "prove", "PROVE • 6", "⚔️ Le Duel", !!save.clearedStages[stage.stageId]]
        ].map(([w, cls, step, title, done]) => `
          <button class="stage-portal-btn ${cls} ${stageWave === w ? 'active' : ''} ${done ? 'done' : ''}" onclick="window.setStageWave('${w}')">
            <div class="sp-step">${step}${done ? " ✓" : ""}</div>
            <div class="sp-title">${title}</div>
          </button>`).join("")}
      </div>
      <div class="stage-subnav">
        <button class="btn ${stageWave === 'secrets' ? 'btn-gold' : ''}" onclick="window.setStageWave('secrets')">📖 Course notes</button>
        <button class="btn" onclick="window.navigateScene('grammar')">📘 Ma Grammaire</button>
        <button class="btn" onclick="window.openAskTeacher && window.openAskTeacher()">🙋 Ask Camille</button>
      </div>

      <div id="academy-stage-mount"></div>
    `;

    const mount = document.getElementById("academy-stage-mount");
    const scrollKey = `${stage.stageId}:${stageWave}`;
    if (lastStageScrollKey !== scrollKey) {
      const first = lastStageScrollKey === null || !lastStageScrollKey.startsWith(stage.stageId + ":");
      lastStageScrollKey = scrollKey;
      setTimeout(() => {
        const tabs = document.querySelector(".academy-stage-portals");
        if (tabs && (!first || stageWave === "lecon")) window.scrollTo({ top: Math.max(0, tabs.getBoundingClientRect().top + window.scrollY - 12), behavior: "smooth" });
      }, first ? 420 : 60);
    }
    if (stageWave === "lecon") { if (window.renderTutorLesson) window.renderTutorLesson(mount, world, stage); else renderWave1Eveil(mount, world, stage, cardsPool); }
    else if (stageWave === "eveil") renderWave1Eveil(mount, world, stage, cardsPool);
    else if (stageWave === "secrets") renderWaveSecrets(mount, world, stage, cardsPool);
    else if (stageWave === "assaut") renderWave2Assaut(mount, world, stage, cardsPool);
    else if (stageWave === "echo") renderWave3Echo(mount, world, stage, cardsPool);
    else if (stageWave === "forge") renderWave4Forge(mount, world, stage, drillsPool);
    else if (stageWave === "duel") renderWave5Duel(mount, world, stage, cardsPool, drillsPool, nextStage);
  }

  window.setStageWave = function (wave) {
    stageWave = wave;
    renderStageMissionScene(document.getElementById("app-main"));
  };
  window.setAcademyPortal = window.setStageWave;

  // Helper to render any Guide Section with Studio Neural French Audio (1x & 0.6x) + Live Mic Speaking
  function renderInteractiveGuideSection(sec, secIdx) {
    const lines = String(sec.body || "").split("\n");
    const renderedRows = lines.map((line, lIdx) => {
      const trimmed = line.trim();
      if (!trimmed) return `<div style="height:0.35rem;"></div>`;
      const cleanLine = trimmed.replace(/^•\s*/, "");
      let frPart = "";
      let enPart = "";
      if (cleanLine.includes(" - ")) {
        const parts = cleanLine.split(" - ");
        frPart = parts[0].trim();
        enPart = parts.slice(1).join(" - ").trim();
      } else if (cleanLine.includes(" : ") && cleanLine.length < 110) {
        const parts = cleanLine.split(" : ");
        frPart = parts[0].trim();
        enPart = parts.slice(1).join(" : ").trim();
      }

      if (frPart && enPart) {
        const pKey = `${secIdx}_${lIdx}_${frPart.slice(0, 20)}`;
        const practiced = !!save.practicedPhrases[pKey];
        const safeFr = escapeHtml(frPart.replace(/'/g, "\\'"));
        const rowId = `phrase-row-${secIdx}-${lIdx}`;
        return `
          <div class="phrase-speak-row ${practiced ? 'practiced' : ''}" id="${rowId}">
            <div style="flex:1;min-width:220px;">
              <div style="font-size:1.08rem;font-weight:800;color:#38bdf8;cursor:pointer;" onclick="window.speakFrench('${safeFr}', 1.0)">
                🇫🇷 ${escapeHtml(frPart)}
              </div>
              <div style="font-size:0.92rem;color:#e2e8f0;margin-top:0.15rem;">
                🇬🇧 ${escapeHtml(enPart)}
              </div>
            </div>
            <div style="display:flex;gap:0.4rem;flex-wrap:wrap;align-items:center;">
              <button class="btn" style="padding:0.4rem 0.7rem;font-size:0.8rem;" onclick="window.speakFrench('${safeFr}', 1.0)" title="Studio Neural French (1.0x)">
                🔊 Studio (1x)
              </button>
              <button class="btn" style="padding:0.4rem 0.7rem;font-size:0.8rem;border-color:#fde047;color:#fde047;" onclick="window.speakFrench('${safeFr}', 0.6)" title="Slow Syllable Pronunciation (0.6x)">
                🐢 Slow (0.6x)
              </button>
              <button class="btn ${practiced ? 'btn-emerald' : 'btn-primary'}" style="padding:0.4rem 0.75rem;font-size:0.8rem;" onclick="window.practiceSpeakingPhrase('${escapeHtml(pKey.replace(/'/g, "\\'"))}', '${safeFr}', '${rowId}')">
                ${practiced ? '✅ Spoken (+15 XP)' : '🎙️ Speak (+15 XP)'}
              </button>
            </div>
          </div>
        `;
      }

      return `<div style="padding:0.28rem 0;color:#cbd5e1;line-height:1.6;font-size:0.95rem;">${escapeHtml(trimmed)}</div>`;
    }).join("");

    return `
      <div class="teaching-slide-card" style="margin-bottom:1rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;border-bottom:1px solid rgba(148,163,184,0.2);padding-bottom:0.55rem;">
          <h3 style="font-size:1.22rem;font-weight:900;color:#fde047;">📖 ${escapeHtml(sec.title)}</h3>
          <span style="font-size:0.78rem;color:var(--text-muted);">Part ${secIdx + 1}</span>
        </div>
        <div>${renderedRows}</div>
      </div>
    `;
  }

  window.practiceSpeakingPhrase = function (pKey, frText, rowId) {
    speakFrench(frText, 1.0);
    if (!save.practicedPhrases[pKey]) {
      save.practicedPhrases[pKey] = true;
      save.stats.phrasesSpoken = (save.stats.phrasesSpoken || 0) + 1;
      addXP(15, 4);
      if (window.RPG_VFX) window.RPG_VFX.floatText("🎙️ +15 XP!", "#10b981");
    }
    const row = document.getElementById(rowId);
    if (row) {
      row.classList.add("practiced");
      const btns = row.querySelectorAll("button");
      const lastBtn = btns[btns.length - 1];
      if (lastBtn) {
        lastBtn.className = "btn btn-emerald";
        lastBtn.textContent = "✅ Spoken (+15 XP)";
      }
    }
  };

  // WAVE 1: QUICK INTRO — play-first. No long recordings, no reading walls.
  // New phrases arrive one at a time (2–3 s of voice each) and are used
  // straight away. Per pair of phrases: learn → learn → ear check → meaning
  // check → SAY IT (mic or typing). Misses come back at the end.
  // Immersion dial: English fades as the player's level rises (thinking in French).
  const INTRO_ROUND_SIZE = 6; // every phrase of the stage is taught, 6 at a time
  const PRAISE_FR = ["Bravo !", "Parfait !", "Excellent !", "Super !", "Génial !", "Bien joué !", "Impeccable !", "Chapeau !", "Trop fort !", "Nickel !"];
  const COMFORT_FR = ["Presque !", "Pas grave !", "On y retourne !", "Courage !", "Ça arrive !"];
  let introStageId = null;
  let introQueue = [];
  let introPos = 0;
  let introOptions = [];
  let introAnswered = false;
  let introCombo = 0;
  let introBest = 0;
  let introRight = 0;
  let introTotal = 0;
  let introTries = 0;
  let introFinished = false;

  function immersionTier() {
    const m = save.immersionMode || "auto";
    if (m === "show") return 0;
    if (m === "fr") return 2;
    const r = cefrRank(campaignCefr());
    return r <= 1 ? 0 : (r === 2 ? 1 : 2); // 0 = English shown, 1 = tap to reveal, 2 = French first
  }
  window.RPG_IMMERSION_TIER = immersionTier;

  function immersionLabel() {
    const m = save.immersionMode || "auto";
    const t = immersionTier();
    const name = ["English shown", "English on tap", "French only"][t];
    return m === "auto" ? `🇫🇷 Immersion: ${name} (auto)` : `🇫🇷 Immersion: ${name}`;
  }

  window.cycleImmersionMode = function () {
    const order = ["auto", "show", "fr"];
    save.immersionMode = order[(order.indexOf(save.immersionMode || "auto") + 1) % order.length];
    persistSave();
    renderStageMissionScene(document.getElementById("app-main"));
  };

  function introAllCards(cardsPool) {
    const seen = new Set();
    return cardsPool.filter(c => {
      if (!c || !c.fr || !c.en || String(c.fr).length > 140) return false;
      const k = normPreserveAccents(c.fr);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }
  function introRoundCount(cardsPool) {
    return Math.max(1, Math.ceil(introAllCards(cardsPool).length / INTRO_ROUND_SIZE));
  }
  function introRoundIdx(stage, cardsPool) {
    return Math.max(0, Math.min(introRoundCount(cardsPool) - 1, bag("introRound")[stage.stageId] || 0));
  }
  function introCards(cardsPool, stageArg) {
    const st = stageArg || getActiveWorldAndStage().stage;
    const all = introAllCards(cardsPool);
    const r = introRoundIdx(st, cardsPool);
    let round = all.slice(r * INTRO_ROUND_SIZE, (r + 1) * INTRO_ROUND_SIZE);
    if (round.length === 1 && all.length > 1) round = all.slice(-2); // never a lonely last card
    return round;
  }
  function introLearnedCount(stage, cardsPool) {
    const total = introAllCards(cardsPool).length;
    return Math.min(total, (bag("introRoundsDone")[stage.stageId] || 0) * INTRO_ROUND_SIZE);
  }
  window.RPG_INTRO_ROUNDS = function () {
    const { stage, cardsPool } = getActiveWorldAndStage();
    return { round: introRoundIdx(stage, cardsPool), rounds: introRoundCount(cardsPool), total: introAllCards(cardsPool).length, learned: introLearnedCount(stage, cardsPool) };
  };
  window.setIntroRound = function (r) {
    const { stage, cardsPool } = getActiveWorldAndStage();
    bag("introRound")[stage.stageId] = Math.max(0, Math.min(introRoundCount(cardsPool) - 1, Number(r) || 0));
    introStageId = null;
    introQueue = [];
    introFinished = false;
    persistSave();
    renderStageMissionScene(document.getElementById("app-main"));
  };
  window.introNextRound = function () {
    const { stage, cardsPool } = getActiveWorldAndStage();
    window.setIntroRound(introRoundIdx(stage, cardsPool) + 1);
  };
  window.introSkipRound = function () {
    const { stage, cardsPool } = getActiveWorldAndStage();
    const r = introRoundIdx(stage, cardsPool);
    if (r + 1 < introRoundCount(cardsPool)) window.setIntroRound(r + 1);
    else { persistSave(); window.setStageWave("forge"); }
  };

  function ensureIntroRun(stage, cards) {
    if (introStageId === stage.stageId && (introQueue.length || introFinished)) return;
    introStageId = stage.stageId;
    introPos = 0;
    introAnswered = false;
    introCombo = 0;
    introBest = 0;
    introRight = 0;
    introTotal = 0;
    introTries = 0;
    introFinished = false;
    introQueue = [];
    for (let i = 0; i < cards.length; i += 2) {
      const j = i + 1 < cards.length ? i + 1 : null;
      introQueue.push({ t: "learn", i });
      if (j !== null) introQueue.push({ t: "learn", i: j });
      introQueue.push({ t: "check", i, mode: "ear" });
      if (j !== null) introQueue.push({ t: "check", i: j, mode: "meaning" });
      introQueue.push({ t: "say", i: j !== null ? j : i });
    }
  }

  function frTokens(s) {
    return stripDiacritics(String(s || "").split("/")[0])
      .replace(/'/g, " ")
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter(Boolean);
  }

  function phraseSimilarity(said, target) {
    const t = frTokens(target);
    const u = frTokens(said);
    if (!t.length || !u.length) return 0;
    const pool = [...u];
    let hit = 0;
    t.forEach(w => {
      const k = pool.indexOf(w);
      if (k >= 0) { hit += 1; pool.splice(k, 1); }
    });
    return hit / Math.max(t.length, u.length);
  }
  window.RPG_PHRASE_SIMILARITY = phraseSimilarity;

  function cardSafe(fr) {
    return escapeHtml(String(fr).replace(/\\/g, "\\\\").replace(/'/g, "\\'"));
  }

  function meaningHtml(card, big) {
    const tier = immersionTier();
    const size = big ? "font-size:1.35rem;" : "";
    if (tier === 0) return `<div class="intro-en" style="${size}">${escapeHtml(card.en)}</div>`;
    if (tier === 1) return `<div class="intro-en intro-blur" style="${size}" title="Tap to reveal" onclick="this.classList.remove('intro-blur')">${escapeHtml(card.en)}</div>`;
    return `<button class="btn intro-reveal" onclick="this.nextElementSibling.style.display='block';this.remove()">👁️ Meaning</button><div class="intro-en" style="display:none;${size}">${escapeHtml(card.en)}</div>`;
  }

  function renderWave1Eveil(mount, world, stage, cardsPool) {
    const cards = introCards(cardsPool);
    if (cards.length < 2) {
      mount.innerHTML = `
        <div class="arena-box intro-box">
          <h3 style="font-size:1.25rem;font-weight:900;">⚡ Quick Intro</h3>
          <p style="color:var(--text-muted);">Nothing new to learn here. Straight into the action!</p>
          <button class="btn btn-gold" onclick="window.setStageWave('assaut')">Start Wave 2 ⚡ ➡️</button>
        </div>`;
      return;
    }
    const roundIdx = introRoundIdx(stage, cardsPool);
    const roundCount = introRoundCount(cardsPool);
    const allCount = introAllCards(cardsPool).length;
    ensureIntroRun({ stageId: `${stage.stageId}#${roundIdx}` }, cards);
    if (introFinished || introPos >= introQueue.length) { renderIntroSummary(mount, stage, cards, cardsPool); return; }

    const step = introQueue[introPos];
    const card = cards[step.i];
    const pct = Math.round((introPos / introQueue.length) * 100);
    const sf = cardSafe(card.fr);
    const learnedCount = Math.min(cards.length, introQueue.slice(0, introPos + 1).filter(s => s.t === "learn").length);
    const tier = immersionTier();

    let body = "";
    if (step.t === "learn") {
      body = `
        <div class="intro-tag">✨ NEW PHRASE ${roundIdx * INTRO_ROUND_SIZE + learnedCount} / ${allCount}</div>
        <div class="intro-fr" onclick="window.speakFrench('${sf}', 1.0)">🔊 ${escapeHtml(card.fr)}</div>
        ${meaningHtml(card, false)}
        ${card.note ? `<div class="intro-note">💡 ${escapeHtml(String(card.note).slice(0, 160))}</div>` : ""}
        <div class="intro-actions">
          <button class="btn" onclick="window.speakFrench('${sf}', 1.0)">🔊 Again</button>
          <button class="btn" style="color:#fde047;border-color:#fde047;" onclick="window.speakFrench('${sf}', 0.6)">🐢 Slow</button>
          <button class="btn btn-primary" id="intro-say-btn" onclick="window.introSayIt('${sf}')">🎙️ I said it out loud</button>
          <button class="btn btn-gold intro-next" onclick="window.introNext()">Got it ➜</button>
        </div>`;
    } else if (step.t === "check") {
      if (!introAnswered || !introOptions.length) {
        // Ear check: at "French only" immersion, pick the French you heard (no English at all).
        const field = step.mode === "ear" && tier < 2 ? "en" : "fr";
        const seed = introPos + (STAGE_INDEX_BY_ID[stage.stageId] || 0);
        const local = cards.length >= 3 ? cards : cardsPool;
        let wrong = pickDistractors(local, card, field, 2, seed);
        if (wrong.length < 2) wrong = wrong.concat(pickDistractors(cardsPool, card, field, 2 - wrong.length, seed + 3).filter(c => !wrong.includes(c)));
        const opts = [{ text: card[field], ok: true }, ...wrong.slice(0, 2).map(c => ({ text: c[field], ok: false }))];
        const rot = seed % opts.length;
        introOptions = opts.slice(rot).concat(opts.slice(0, rot));
      }
      const prompt = step.mode === "ear"
        ? `<div class="intro-tag">🎧 QUICK CHECK • ${tier < 2 ? "WHAT DID YOU HEAR?" : "QU'EST-CE QUE TU AS ENTENDU ?"}</div>
           <button class="btn intro-listen" onclick="window.speakFrench('${sf}', 1.0)">🔊 Play again</button>
           <button class="btn" style="color:#fde047;border-color:#fde047;" onclick="window.speakFrench('${sf}', 0.6)">🐢 Slow</button>`
        : `<div class="intro-tag">🧠 QUICK CHECK • HOW DO YOU SAY IT?</div>
           <div class="intro-en" style="font-size:1.35rem;">${escapeHtml(card.en)}</div>`;
      body = `
        ${prompt}
        <div class="intro-options">
          ${introOptions.map((o, k) => `
            <button class="btn intro-opt" id="intro-opt-${k}" ${introAnswered ? "disabled" : ""} onclick="window.introAnswer(${k})"><span class="intro-key">${k + 1}</span> ${escapeHtml(o.text)}</button>
          `).join("")}
        </div>
        <div id="intro-feedback"></div>`;
    } else {
      body = `
        <div class="intro-tag">🎙️ YOUR TURN • SAY IT IN FRENCH</div>
        <div class="intro-en" style="font-size:1.35rem;">${escapeHtml(card.en)}</div>
        <div class="intro-actions">
          <button class="btn btn-primary intro-mic" id="intro-mic-btn" onclick="window.introMic()">🎙️ Tap and speak</button>
        </div>
        <div class="intro-type-row">
          <input id="intro-type" type="text" class="input-french" autocomplete="off" spellcheck="false" placeholder="…or type it here"
                 onkeydown="if(event.key==='Enter'){event.preventDefault();window.introTyped();}" />
          <button class="btn btn-gold" onclick="window.introTyped()">Check</button>
        </div>
        ${(() => {
          const target = String(card.fr).split("/")[0].replace(/\(.*?\)/g, "").trim();
          const words = target.split(/\s+/).filter(Boolean);
          if (words.length < 2 || words.length > 9) return "";
          const decoys = (cardsPool || []).map(c => String(c.fr).split(/\s+/)[0]).filter(w => w && !words.includes(w)).slice(0, 2);
          const tiles = words.concat(decoys).map((w, i) => ({ w, k: (i * 7 + words.length * 3) % 11 })).sort((x, y) => x.k - y.k).map(x => x.w);
          return `<div class="intro-tiles"><span class="intro-tiles-label">🧩 Need help? Tap the words in order:</span>${tiles.map(w => `<button class="word-tile" onclick="window.introTile('${cardSafe(w)}')">${escapeHtml(w)}</button>`).join("")}<button class="word-tile" onclick="window.introTile(null)">⌫</button></div>`;
        })()}
        <div class="intro-accents">
          ${["é", "è", "ê", "à", "â", "ç", "ù", "ô", "î", "œ"].map(ch => `<button class="btn" onclick="window.insertFrenchAccent('intro-type','${ch}')">${ch}</button>`).join("")}
          <button class="btn" style="margin-left:auto;" onclick="window.introGiveUp()">🤷 Show me</button>
        </div>
        <div id="intro-feedback"></div>`;
    }

    mount.innerHTML = `
      <div class="arena-box intro-box">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.6rem;">
          <div>
            <h3 style="font-size:1.25rem;font-weight:900;">⚡ Phrases — ${escapeHtml(stage.title)}</h3>
            <p style="font-size:0.84rem;color:var(--text-muted);">Round ${roundIdx + 1} of ${roundCount} • ${allCount} phrases in this stage, 6 per round (~2 min). Hear it, say it, use it.</p>
            ${roundCount > 1 ? `<div class="round-dots">${Array.from({ length: roundCount }, (_, k) => `<button class="round-dot ${k === roundIdx ? "cur" : ""} ${k < (bag("introRoundsDone")[stage.stageId] || 0) ? "done" : ""}" title="Round ${k + 1}" onclick="window.setIntroRound(${k})">${k + 1}</button>`).join("")}</div>` : ""}
          </div>
          <div style="display:flex;gap:0.4rem;flex-wrap:wrap;align-items:center;">
            <span class="intro-combo ${introCombo >= 3 ? "hot" : ""}" id="intro-combo">🔥 x${introCombo}</span>
            <button class="btn" style="font-size:0.78rem;" onclick="window.cycleImmersionMode()" title="How much English you see">${immersionLabel()}</button>
            <button class="btn" onclick="window.introSkipRound()" title="Skip this round if you already know these">I know these ➜</button>
          </div>
        </div>
        <div class="intro-progress"><div style="width:${pct}%"></div></div>
        <div class="intro-card" id="intro-card">${body}</div>
      </div>`;

    // Short clip only (2–3 s). Never auto-play when it would give the answer away.
    if (!introAnswered && (step.t === "learn" || (step.t === "check" && step.mode === "ear"))) speakFrench(card.fr, 1.0);
    if (step.t === "say") {
      introTries = 0;
      const inp = document.getElementById("intro-type");
      if (inp && !("ontouchstart" in window)) inp.focus();
    }
  }

  function renderIntroSummary(mount, stage, cards, cardsPool) {
    cardsPool = cardsPool || getActiveWorldAndStage().cardsPool;
    const rIdx = introRoundIdx(stage, cardsPool);
    const rCount = introRoundCount(cardsPool);
    const hasMore = rIdx + 1 < rCount;
    if (!introFinished) {
      introFinished = true;
      save.introDone = save.introDone || {};
      const doneBag = bag("introRoundsDone");
      doneBag[stage.stageId] = Math.max(doneBag[stage.stageId] || 0, rIdx + 1);
      save.stats.roundsDone = (save.stats.roundsDone || 0) + 1;
      const rk = rIdx === 0 ? stage.stageId : `${stage.stageId}#${rIdx}`;
      if (!save.introDone[rk]) {
        save.introDone[rk] = true;
        addXP(40, 10);
      }
      persistSave();
      if (window.RPG_SFX) window.RPG_SFX.victoryFanfare();
      if (window.RPG_VFX) window.RPG_VFX.burst(window.innerWidth / 2, window.innerHeight * 0.45, "#fde047", 40);
    }
    const acc = introTotal ? Math.round((introRight / introTotal) * 100) : 100;
    const verdict = acc >= 90 ? "Impeccable !" : acc >= 70 ? "Très bien !" : "Bon début !";
    mount.innerHTML = `
      <div class="arena-box intro-box">
        <div class="intro-card">
          <div class="intro-tag">QUICK INTRO TERMINÉ • ROUND ${rIdx + 1} / ${rCount}</div>
          <div class="intro-fr" style="cursor:default;">${verdict}</div>
          <div class="intro-stats">
            <div><b>${introLearnedCount(stage, cardsPool)} / ${introAllCards(cardsPool).length}</b><span>phrases learned</span></div>
            <div><b>${acc}%</b><span>accuracy</span></div>
            <div><b>🔥 ${introBest}</b><span>best combo</span></div>
          </div>
          <div class="intro-chips">
            ${cards.map(c => `<button class="word-tile" onclick="window.speakFrench('${cardSafe(c.fr)}', 1.0)">🔊 ${escapeHtml(c.fr)}</button>`).join("")}
          </div>
          <div class="intro-actions">
            <button class="btn" onclick="window.restartIntro()">↻ Once more</button>
            ${hasMore
              ? `<button class="btn btn-gold intro-next" onclick="window.introNextRound()">▶ Next round (${rIdx + 2} / ${rCount})</button>
                 <button class="btn" onclick="window.setStageWave('forge')">Take a break: practise these ➜</button>`
              : `<button class="btn btn-gold intro-next" onclick="window.setStageWave('forge')">⚒️ Use them in sentences (La Forge)</button>`}
          </div>
        </div>
      </div>`;
  }

  window.restartIntro = function () {
    introStageId = null;
    introQueue = [];
    introFinished = false;
    renderStageMissionScene(document.getElementById("app-main"));
  };

  function introReward(ok, anchorEl) {
    introTotal += 1;
    const r = anchorEl ? anchorEl.getBoundingClientRect() : null;
    const x = r ? r.left + r.width / 2 : window.innerWidth / 2;
    const y = r ? r.top + r.height / 2 : window.innerHeight / 2;
    if (ok) {
      introRight += 1;
      introCombo += 1;
      introBest = Math.max(introBest, introCombo);
      if (window.RPG_SFX) window.RPG_SFX.matchCombo(Math.min(8, introCombo));
      if (window.RPG_VFX) {
        window.RPG_VFX.burst(x, y, introCombo >= 5 ? "#f97316" : "#10b981", 14 + Math.min(20, introCombo * 3));
        window.RPG_VFX.floatText(PRAISE_FR[(introTotal + introCombo) % PRAISE_FR.length], "#6ee7b7", x, y - 30);
      }
      addXP(10 + Math.min(10, introCombo * 2), 3);
      if (introCombo === 5 || introCombo === 10) {
        addXP(25, 10);
        if (window.RPG_VFX) window.RPG_VFX.toast(`Combo x${introCombo} !`, "On fire. +25 XP bonus", "🔥");
      }
    } else {
      introCombo = 0;
      if (window.RPG_SFX) window.RPG_SFX.damageHit();
      if (window.RPG_VFX) window.RPG_VFX.floatText(COMFORT_FR[introTotal % COMFORT_FR.length], "#fda4af", x, y - 30);
      const cardEl = document.getElementById("intro-card");
      if (cardEl) { cardEl.classList.remove("shake"); void cardEl.offsetWidth; cardEl.classList.add("shake"); }
    }
    const comboEl = document.getElementById("intro-combo");
    if (comboEl) { comboEl.textContent = `🔥 x${introCombo}`; comboEl.classList.toggle("hot", introCombo >= 3); }
  }

  function currentIntroCard() {
    const { world, stage } = getActiveWorldAndStage();
    const step = introQueue[introPos];
    const cards = introCards(getStageCardsPool(world, stage), stage);
    return { world, stage, step, card: step && cards[step.i] };
  }

  // Read-only state for automated tests.
  window.RPG_INTRO_STATE = function () {
    const { step, card } = currentIntroCard();
    return { t: step ? step.t : null, mode: step ? step.mode : null, fr: card ? card.fr : null, en: card ? card.en : null, answered: introAnswered, finished: introFinished };
  };

  window.introNext = function () {
    introPos += 1;
    introAnswered = false;
    introOptions = [];
    renderStageMissionScene(document.getElementById("app-main"));
  };

  window.introSayIt = function (fr) {
    const { stage } = getActiveWorldAndStage();
    speakFrench(fr, 1.0);
    const key = `intro_${stage.stageId}_${String(fr).slice(0, 24)}`;
    if (!save.practicedPhrases[key]) {
      save.practicedPhrases[key] = true;
      save.stats.phrasesSpoken = (save.stats.phrasesSpoken || 0) + 1;
      addXP(10, 2);
    }
    const b = document.getElementById("intro-say-btn");
    if (b) { b.className = "btn btn-emerald"; b.textContent = "✅ Said it"; }
  };

  window.introAnswer = function (k) {
    if (introAnswered) return;
    const { world, stage, step, card } = currentIntroCard();
    const opt = introOptions[k];
    if (!card || !opt || !step || step.t !== "check") return;
    introAnswered = true;
    const ok = !!opt.ok;
    window.recordLearningOutcome(`card_${stage.stageId}_intro_${step.i}`, card.fr, card.en, ok, step.mode === "ear" ? "comprehension" : "vocabulary", world.cefr);
    document.querySelectorAll(".intro-opt").forEach((b, idx) => {
      b.disabled = true;
      if (introOptions[idx] && introOptions[idx].ok) b.classList.add("correct");
    });
    const btn = document.getElementById(`intro-opt-${k}`);
    if (!ok && btn) btn.classList.add("wrong");
    if (ok && step.mode === "ear") save.stats.earHits = (save.stats.earHits || 0) + 1;
    if (!ok) introQueue.push({ t: "check", i: step.i, mode: step.mode }); // comes back at the end
    introReward(ok, btn);
    speakFrench(card.fr, 1.0);
    showIntroFeedback(ok, card, ok ? "✅ Exactly!" : "❌ Not quite. It comes back in a moment.");
    persistSave();
  };

  function showIntroFeedback(ok, card, lead, extra) {
    const fb = document.getElementById("intro-feedback");
    if (!fb) return;
    fb.innerHTML = `<div class="feedback-banner ${ok ? "ok" : "err"}">
      ${lead} <strong>${escapeHtml(card.fr)}</strong> = ${escapeHtml(card.en)}
      ${extra ? `<div style="font-size:0.84rem;margin-top:0.25rem;">${extra}</div>` : ""}
      <button class="btn btn-gold" id="intro-next-btn" style="margin-left:0.6rem;padding:0.3rem 0.9rem;" onclick="window.introNext()">Next ➜</button>
    </div>`;
    const nb = document.getElementById("intro-next-btn");
    if (nb) nb.focus();
  }

  function introJudge(text, viaMic) {
    if (introAnswered) return;
    const { world, stage, step, card } = currentIntroCard();
    if (!card || !step || step.t !== "say") return;
    const sim = phraseSimilarity(text, card.fr);
    const synonyms = getStageCardsPool(world, stage).filter(c => c !== card && normAnswer(c.en) === normAnswer(card.en));
    const typedOk = !viaMic && (evaluateFrenchProduction(text, card.fr).passed || sim >= 0.999 || synonyms.some(c => evaluateFrenchProduction(text, c.fr).passed));
    const ok = viaMic ? (sim >= 0.7 || synonyms.some(c => phraseSimilarity(text, c.fr) >= 0.7)) : typedOk;
    const heard = viaMic ? `🎙️ I heard: « ${escapeHtml(text)} »` : `✍️ You wrote: ${computeFrenchDiffHtml(text, String(card.fr).split("/")[0].trim())}`;
    if (!ok && introTries === 0) {
      introTries = 1;
      const fb = document.getElementById("intro-feedback");
      // First miss: don't reveal the answer, just what they said/wrote.
      const own = viaMic ? `🎙️ I heard: « ${escapeHtml(text)} »` : `✍️ You wrote: « ${escapeHtml(text)} »`;
      if (fb) fb.innerHTML = `<div class="feedback-banner err">${own}<br>Almost. Try once more! <button class="btn" style="padding:0.25rem 0.7rem;" onclick="window.speakFrench('${cardSafe(card.fr)}', 0.6)">🐢 Hear it slowly</button></div>`;
      if (window.RPG_SFX) window.RPG_SFX.damageHit();
      return;
    }
    introAnswered = true;
    window.recordLearningOutcome(`card_${stage.stageId}_intro_say_${step.i}`, card.fr, card.en, ok, "production", world.cefr);
    if (ok && viaMic) save.stats.phrasesSpoken = (save.stats.phrasesSpoken || 0) + 1;
    if (!ok) introQueue.push({ t: "say", i: step.i });
    introReward(ok, document.getElementById(viaMic ? "intro-mic-btn" : "intro-type"));
    speakFrench(card.fr, 1.0);
    showIntroFeedback(ok, card, ok ? (viaMic ? "🎯 Clear! The mic understood you." : "✅ Correct!") : "📌 Here's how a native says it:", heard);
    persistSave();
  }

  window.introTile = function (w) {
    const inp = document.getElementById("intro-type");
    if (!inp) return;
    if (w === null) { const parts = inp.value.trim().split(/\s+/); parts.pop(); inp.value = parts.join(" "); }
    else inp.value = (inp.value.trim() ? inp.value.trim() + " " : "") + w;
    inp.focus();
  };
  window.introTyped = function () {
    const inp = document.getElementById("intro-type");
    if (!inp || !inp.value.trim()) return;
    introJudge(inp.value, false);
  };

  window.introGiveUp = function () {
    if (introAnswered) return;
    const { card } = currentIntroCard();
    if (!card) return;
    introTries = 1;
    introJudge("", false);
  };

  window.introMic = function () {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    const btn = document.getElementById("intro-mic-btn");
    const fb = document.getElementById("intro-feedback");
    if (!SpeechRec) {
      if (fb) fb.innerHTML = `<div class="feedback-banner err">The microphone isn't available in this browser. Type it instead, and say it out loud as you type.</div>`;
      const inp = document.getElementById("intro-type");
      if (inp) inp.focus();
      return;
    }
    try {
      const rec = new SpeechRec();
      rec.lang = "fr-FR";
      rec.interimResults = false;
      rec.maxAlternatives = 4;
      if (btn) { btn.textContent = "🎙️ Listening… speak now"; btn.classList.add("listening"); }
      rec.onresult = (ev) => {
        const { card } = currentIntroCard();
        const alts = Array.from(ev.results[0] || []).map(a => a.transcript);
        const best = alts.sort((a, b) => phraseSimilarity(b, card ? card.fr : "") - phraseSimilarity(a, card ? card.fr : ""))[0] || "";
        introJudge(best, true);
      };
      rec.onerror = (e) => {
        if (fb) fb.innerHTML = `<div class="feedback-banner err">I couldn't hear you (${escapeHtml(e.error || "error")}). Try again, or type it.</div>`;
      };
      rec.onend = () => {
        if (btn) { btn.textContent = "🎙️ Tap and speak"; btn.classList.remove("listening"); }
      };
      rec.start();
    } catch (e) {
      if (fb) fb.innerHTML = `<div class="feedback-banner err">Microphone error. Type it instead.</div>`;
    }
  };

  // Keyboard: 1/2/3 pick an option, Enter/Space = next. Makes the intro feel like a game pad.
  window.addEventListener("keydown", (e) => {
    if (!document.getElementById("intro-card")) return;
    const tag = (e.target && e.target.tagName) || "";
    if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
    if (["1", "2", "3"].includes(e.key) && document.getElementById(`intro-opt-${Number(e.key) - 1}`) && !introAnswered) {
      e.preventDefault();
      window.introAnswer(Number(e.key) - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      const nb = document.getElementById("intro-next-btn") || document.querySelector(".intro-next");
      if (nb && document.activeElement !== nb) { e.preventDefault(); nb.click(); }
    }
  });

  window.toggleAcademySlideMode = function (showAll) {
    stageShowAllSlides = showAll;
    renderStageMissionScene(document.getElementById("app-main"));
  };

  window.setAcademySlide = function (idx) {
    stageSlideIdx = idx;
    renderStageMissionScene(document.getElementById("app-main"));
  };

  window.nextAcademySlide = function (total) {
    addXP(15, 4);
    if (stageSlideIdx < total - 1) {
      stageSlideIdx += 1;
      renderStageMissionScene(document.getElementById("app-main"));
    } else {
      window.setStageWave("assaut");
    }
  };

  // =========================================================================
  // WAVE 2: LES SECRETS — every grammar / culture note of the course guide,
  // cut into bite-size cards (max 7 lines), each followed by a quick check.
  // Answer keys stay hidden behind "try first, then show". No reading walls.
  // =========================================================================
  const BITE_SKIP = /^(niveaux?|levels?)$/i;
  const BITE_ANSWERS = /^(r[ée]ponses?|answers?)\b/i;
  const BITE_LINES = 7;
  const biteCache = {};
  let biteStageId = null;
  let biteIdx = 0;
  let biteAnswered = false;
  let biteOpts = [];
  let biteCombo = 0;

  function parseBitePair(line) {
    const clean = String(line).replace(/^[•▪●◦\-–]\s*/, "").trim();
    const m = clean.match(/^(.{1,120}?)\s[-–]\s*(\S.{0,180})$/);
    if (!m) return null;
    let fr = m[1].trim();
    let en = m[2].trim();
    if (/^\d+$/.test(fr) && !/^\d+$/.test(en)) { const t = fr; fr = en; en = t; }
    if (!/[a-zà-ÿœ]/i.test(fr) || !/[a-z0-9]/i.test(en)) return null;
    return { fr, en };
  }
  function looksFrench(line) {
    return /[àâçéèêëîïôûùœ]/i.test(line) ||
      /^(je|j['’]|tu|il|elle|on|nous|vous|ils|elles|le|la|les|l['’]|un|une|des|c['’]est|ce|cette|mon|ma|mes|qu['’]|est-ce|il y a|si|quand|moi|bonjour)\b/i.test(String(line).replace(/^[•▪●◦]\s*/, ""));
  }
  function buildStageBites(stage) {
    if (!stage) return [];
    if (biteCache[stage.stageId]) return biteCache[stage.stageId];
    const bites = [];
    (stage.sections || []).forEach((sec) => {
      if (!sec || !sec.body || !String(sec.body).trim()) return;
      const title = String(sec.title || "").trim();
      if (BITE_SKIP.test(title)) return;
      const lines = String(sec.body).split("\n").map(l => l.trim()).filter(l => l && !/^[•▪●◦\-–]$/.test(l));
      if (!lines.length) return;
      if (BITE_ANSWERS.test(title)) {
        const prev = bites[bites.length - 1];
        if (prev) prev.answers = (prev.answers || []).concat(lines);
        return;
      }
      const chunks = [];
      let cur = [];
      lines.forEach(l => {
        cur.push(l);
        if (cur.length >= BITE_LINES || l.length > 320) { chunks.push(cur); cur = []; }
      });
      if (cur.length) chunks.push(cur);
      chunks.forEach((ch, ci) => {
        const rows = ch.map(l => {
          const pr = parseBitePair(l);
          return pr ? { kind: "pair", fr: pr.fr, en: pr.en } : { kind: "text", text: l.replace(/^[•▪●◦]\s*/, ""), fr: looksFrench(l) };
        });
        bites.push({ title: title || stage.title, part: chunks.length > 1 ? `${ci + 1}/${chunks.length}` : "", goal: /^objectifs/i.test(title), rows });
      });
    });
    biteCache[stage.stageId] = bites;
    return bites;
  }
  window.RPG_STAGE_BITES = function () {
    const { stage } = getActiveWorldAndStage();
    return { count: buildStageBites(stage).length, idx: biteIdx, seen: bag("bitesSeen")[stage.stageId] || 0 };
  };

  function bitePairsPool(stage, cardsPool) {
    const pool = [];
    buildStageBites(stage).forEach(b => b.rows.forEach(r => { if (r.kind === "pair") pool.push({ fr: r.fr, en: r.en }); }));
    return pool.concat(cardsPool.filter(c => c && c.fr && c.en));
  }

  function renderWaveSecrets(mount, world, stage, cardsPool) {
    const bites = buildStageBites(stage);
    const seenBag = bag("bitesSeen");
    if (biteStageId !== stage.stageId) {
      biteStageId = stage.stageId;
      const seen = seenBag[stage.stageId] || 0;
      biteIdx = seen >= bites.length ? 0 : seen;
      biteAnswered = false;
      biteOpts = [];
      biteCombo = 0;
    }
    if (!bites.length) {
      mount.innerHTML = `
        <div class="arena-box intro-box"><div class="intro-card">
          <div class="intro-tag">📜 LES SECRETS</div>
          <div class="intro-fr" style="cursor:default;">The phrases say it all here.</div>
          <div class="intro-actions"><button class="btn btn-gold intro-next" onclick="window.setStageWave('forge')">⚒️ La Forge</button></div>
        </div></div>`;
      return;
    }
    if (biteIdx >= bites.length) {
      mount.innerHTML = `
        <div class="arena-box intro-box"><div class="intro-card">
          <div class="intro-tag">📜 LES SECRETS • TOUT DÉBLOQUÉ</div>
          <div class="intro-fr" style="cursor:default;">${bites.length} secrets unlocked !</div>
          <p style="color:var(--text-muted);margin:0.4rem 0 1rem;">You know the rules behind Stage ${escapeHtml(stage.stageCode)}. Now use them under pressure.</p>
          <div class="intro-actions">
            <button class="btn" onclick="window.setBite(0)">↻ Review the notes</button>
            <button class="btn btn-gold intro-next" onclick="window.setStageWave('forge')">⚒️ Back to the path: La Forge</button>
          </div>
        </div></div>`;
      if (window.RPG_SFX) window.RPG_SFX.victoryFanfare();
      return;
    }
    const b = bites[biteIdx];
    const tier = immersionTier();
    const pairs = b.rows.filter(r => r.kind === "pair");
    const rowsHtml = b.rows.map(r => {
      if (r.kind === "pair") {
        const sf = cardSafe(r.fr);
        const en = tier === 0
          ? `<span class="bite-en">${escapeHtml(r.en)}</span>`
          : `<span class="bite-en intro-blur" title="Tap to reveal" onclick="event.stopPropagation();this.classList.remove('intro-blur')">${escapeHtml(r.en)}</span>`;
        return `<div class="bite-pair" onclick="window.speakFrench('${sf}', 1.0)"><span class="bite-fr">🔊 ${escapeHtml(r.fr)}</span>${en}</div>`;
      }
      if (r.fr && r.text.length < 260) {
        return `<div class="bite-text fr" onclick="window.speakFrench('${cardSafe(r.text)}', 1.0)">🔊 ${escapeHtml(r.text)}</div>`;
      }
      return `<div class="bite-text">${escapeHtml(r.text)}</div>`;
    }).join("");

    let quiz = "";
    if (pairs.length) {
      const target = pairs[biteIdx % pairs.length];
      const reverse = tier >= 2 || biteIdx % 2 === 1; // EN→FR every other bite, always at French-only
      if (!biteAnswered || !biteOpts.length) {
        const field = reverse ? "fr" : "en";
        const pool = bitePairsPool(stage, cardsPool).filter(x => normPreserveAccents(x[field]) !== normPreserveAccents(target[field]));
        const seed = biteIdx * 7 + (STAGE_INDEX_BY_ID[stage.stageId] || 0);
        const wrong = [];
        for (let k = 0; k < pool.length && wrong.length < 2; k++) {
          const c = pool[(seed + k * 5) % pool.length];
          if (!wrong.some(w => w[field] === c[field])) wrong.push(c);
        }
        const opts = [{ text: target[field], ok: true }, ...wrong.map(c => ({ text: c[field], ok: false }))];
        const rot = seed % opts.length;
        biteOpts = opts.slice(rot).concat(opts.slice(0, rot));
      }
      quiz = `
        <div class="bite-quiz">
          <div class="intro-tag">⚡ QUICK CHECK</div>
          <div class="bite-q">${reverse ? `How do you say: <b>${escapeHtml(target.en)}</b> ?` : `What does <b>« ${escapeHtml(target.fr)} »</b> mean?`}</div>
          <div class="intro-options">
            ${biteOpts.map((o, k) => `<button class="btn intro-opt bite-opt" id="bite-opt-${k}" ${biteAnswered ? "disabled" : ""} onclick="window.biteAnswer(${k})"><span class="intro-key">${k + 1}</span> ${escapeHtml(o.text)}</button>`).join("")}
          </div>
          <div id="bite-feedback"></div>
        </div>`;
    }
    const pct = Math.round((biteIdx / bites.length) * 100);
    mount.innerHTML = `
      <div class="arena-box intro-box">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.6rem;">
          <div>
            <h3 style="font-size:1.25rem;font-weight:900;">📜 Les Secrets — ${escapeHtml(stage.title)}</h3>
            <p style="font-size:0.84rem;color:var(--text-muted);">The rules, tips and culture behind this stage, one small card at a time. Tap any French line to hear it.</p>
          </div>
          <div style="display:flex;gap:0.4rem;flex-wrap:wrap;align-items:center;">
            <span class="intro-combo ${biteCombo >= 3 ? "hot" : ""}">🔥 x${biteCombo}</span>
            <button class="btn" style="font-size:0.78rem;" onclick="window.cycleImmersionMode()">${immersionLabel()}</button>
            <button class="btn" onclick="window.setStageWave('assaut')">Skip to the Match ➜</button>
          </div>
        </div>
        <div class="intro-progress"><div style="width:${pct}%"></div></div>
        <div class="intro-card bite-card" id="bite-card">
          <div class="intro-tag">${b.goal ? "🎯 MISSION BRIEFING" : `📜 SECRET ${biteIdx + 1} / ${bites.length}`} • ${escapeHtml(b.title)}${b.part ? ` (${b.part})` : ""}</div>
          <div class="bite-rows">${rowsHtml}</div>
          ${b.answers && b.answers.length ? `<details class="bite-answers"><summary>👁️ Try it in your head first, then show the answers</summary>${b.answers.map(a => `<div class="bite-text">${escapeHtml(a.replace(/^[•▪●◦]\s*/, ""))}</div>`).join("")}</details>` : ""}
          ${quiz}
          <div class="intro-actions">
            ${biteIdx > 0 ? `<button class="btn" onclick="window.setBite(${biteIdx - 1})">⬅ Back</button>` : ""}
            <button class="btn btn-gold intro-next" id="bite-next-btn" ${pairs.length && !biteAnswered ? "disabled title='Answer the quick check first'" : ""} onclick="window.nextBite()">${biteIdx + 1 < bites.length ? "Next secret ➜" : "Finish ✔"}</button>
          </div>
        </div>
      </div>`;
  }

  window.setBite = function (i) {
    biteIdx = Math.max(0, Number(i) || 0);
    biteAnswered = false;
    biteOpts = [];
    renderStageMissionScene(document.getElementById("app-main"));
  };
  window.nextBite = function () {
    const { stage } = getActiveWorldAndStage();
    const seenBag = bag("bitesSeen");
    if ((seenBag[stage.stageId] || 0) < biteIdx + 1) {
      seenBag[stage.stageId] = biteIdx + 1;
      save.stats.secretsRead = (save.stats.secretsRead || 0) + 1;
      addXP(8, 2);
    }
    persistSave();
    window.setBite(biteIdx + 1);
  };
  window.biteAnswer = function (k) {
    if (biteAnswered) return;
    const { world, stage } = getActiveWorldAndStage();
    const o = biteOpts[k];
    if (!o) return;
    biteAnswered = true;
    const ok = !!o.ok;
    const right = biteOpts.find(x => x.ok);
    document.querySelectorAll(".bite-opt").forEach((b, idx) => {
      b.disabled = true;
      if (biteOpts[idx] && biteOpts[idx].ok) b.classList.add("correct");
    });
    const btn = document.getElementById(`bite-opt-${k}`);
    if (!ok && btn) btn.classList.add("wrong");
    const r = btn ? btn.getBoundingClientRect() : null;
    if (ok) {
      biteCombo += 1;
      addXP(12 + Math.min(10, biteCombo * 2), 3);
      if (window.RPG_SFX) window.RPG_SFX.matchCombo(Math.min(8, biteCombo));
      if (window.RPG_VFX && r) { window.RPG_VFX.burst(r.left + r.width / 2, r.top + r.height / 2, "#10b981", 16); window.RPG_VFX.floatText(PRAISE_FR[biteIdx % PRAISE_FR.length], "#6ee7b7", r.left + r.width / 2, r.top - 20); }
    } else {
      biteCombo = 0;
      if (window.RPG_SFX) window.RPG_SFX.damageHit();
      const card = document.getElementById("bite-card");
      if (card) { card.classList.remove("shake"); void card.offsetWidth; card.classList.add("shake"); }
    }
    window.recordLearningOutcome(`secret_${stage.stageId}_${biteIdx}`, right ? right.text : "", "", ok, "grammar_rule", world.cefr);
    const fb = document.getElementById("bite-feedback");
    if (fb) fb.innerHTML = `<div class="feedback-banner ${ok ? "ok" : "err"}">${ok ? "✅ Exactly!" : `❌ It's: <strong>${escapeHtml(right ? right.text : "")}</strong>`}</div>`;
    const nb = document.getElementById("bite-next-btn");
    if (nb) { nb.disabled = false; nb.removeAttribute("title"); nb.focus(); }
    persistSave();
  };
  window.addEventListener("keydown", (e) => {
    if (!document.getElementById("bite-card")) return;
    const tag = (e.target && e.target.tagName) || "";
    if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
    if (["1", "2", "3"].includes(e.key) && document.getElementById(`bite-opt-${Number(e.key) - 1}`) && !biteAnswered) {
      e.preventDefault();
      window.biteAnswer(Number(e.key) - 1);
    } else if (e.key === "Enter") {
      const nb = document.getElementById("bite-next-btn");
      if (nb && !nb.disabled && document.activeElement !== nb) { e.preventDefault(); nb.click(); }
    }
  });

  // Stage mastery: how much of this stage's content you have actually learned and proved.
  function stageMastery(world, stage) {
    const cardsPool = getStageCardsPool(world, stage);
    const drillsPool = getStageDrillsPool(world, stage, cardsPool);
    const totalPh = introAllCards(cardsPool).length;
    const learned = introLearnedCount(stage, cardsPool);
    const bites = buildStageBites(stage).length;
    const seen = Math.min(bites, bag("bitesSeen")[stage.stageId] || 0);
    const fRounds = Math.max(1, Math.ceil(drillsPool.length / FORGE_MAX));
    const fDone = Math.min(fRounds, bag("forgeRoundsDone")[stage.stageId] || 0);
    const stars = save.clearedStages[stage.stageId] || 0;
    const lessonDone = !!(save.tutorDone && save.tutorDone[stage.stageId]);
    const parts = [
      [lessonDone ? 1 : 0, 0.15],
      [totalPh ? learned / totalPh : 1, 0.3],
      [drillsPool.length ? fDone / fRounds : 1, 0.2],
      [stars / 3, 0.35]
    ];
    const pct = Math.round(parts.reduce((n, [v, w]) => n + v * w, 0) * 100);
    return { pct, totalPh, learned, bites, seen, fRounds, fDone, stars, lessonDone };
  }
  window.RPG_API = {
    save: () => save,
    addXP: (x, g) => addXP(x, g),
    persistSave: () => persistSave(),
    campaignCefr: () => campaignCefr(),
    escapeHtml: (t) => escapeHtml(t)
  };
  window.RPG_CURRENT_SCENE = () => currentScene;
  window.RPG_BUILD_BITES = (st) => buildStageBites(st);
  window.RPG_ACTIVE = () => getActiveWorldAndStage();
  window.RPG_STAGE_MASTERY = function (stageId) {
    const { world, stage } = getActiveWorldAndStage();
    if (!stageId || stageId === stage.stageId) return stageMastery(world, stage);
    const st = ALL_STAGES[STAGE_INDEX_BY_ID[stageId]];
    const w = st && DATA.lessons.find(l => l.number === st.worldNum);
    return st && w ? stageMastery(w, st) : null;
  };

  // WAVE 3: L'ASSAUT (5-PAIR DIRECT FRENCH REFLEX MATCH, ALL BOARDS)
  function renderWave2Assaut(mount, world, stage, cardsPool) {
    const batchSize = 5;
    const totalBatches = Math.max(1, Math.ceil(cardsPool.length / batchSize));
    const curBatch = Math.max(0, Math.min(totalBatches - 1, stageBatchIdx));
    const batchCards = cardsPool.slice(curBatch * batchSize, (curBatch + 1) * batchSize);
    const rightOrder = batchCards.map((c, i) => ({ c, i })).sort((a, b) => (a.c.en > b.c.en ? 1 : -1));

    mount.innerHTML = `
      <div class="arena-box">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;margin-bottom:0.9rem;">
          <div>
            <h3 style="font-size:1.3rem;font-weight:900;">⚡ Reflex Match (Board ${curBatch + 1} / ${totalBatches})</h3>
            <p style="font-size:0.86rem;color:var(--text-muted);">Click a French tile on the left (hears Studio French pronunciation) and match its exact meaning on the right!</p>
          </div>
          <div style="display:flex;gap:0.5rem;">
            ${totalBatches > 1 ? `<button class="btn" onclick="window.setAcademyBatch(${(curBatch + 1) % totalBatches})">🔄 Next 5-Word Set</button>` : ""}
            <button class="btn btn-gold" onclick="window.setStageWave('echo')">Skip to Ear &amp; Mic 🎧 ➡️</button>
          </div>
        </div>

        <div class="teaching-slide-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.55rem;">
            <h4 style="font-size:1.08rem;font-weight:900;color:#fde047;">⚡ Match All ${batchCards.length} Pairs from Stage ${escapeHtml(stage.stageCode)}</h4>
            <span style="font-size:0.86rem;color:#6ee7b7;font-weight:800;">Matched: ${Object.keys(batchMatchedPairs).length} / ${batchCards.length}</span>
          </div>
          <div class="match-board-grid">
            <div class="match-col">
              ${batchCards.map((c, i) => `
                <button class="match-tile ${batchMatchedPairs[i] ? 'matched' : ''} ${batchMatchSelectedLeft === i ? 'selected' : ''}"
                        onclick="window.selectBatchLeft(${i}, '${escapeHtml(c.fr.replace(/'/g, "\\'"))}')">
                  🇫🇷 ${escapeHtml(c.fr)}
                </button>
              `).join("")}
            </div>
            <div class="match-col">
              ${rightOrder.map(({ c, i }) => `
                <button class="match-tile ${batchMatchedPairs[i] ? 'matched' : ''}"
                        onclick="window.selectBatchRight(${i}, ${batchCards.length}, ${totalBatches})">
                  🇬🇧 ${escapeHtml(c.en)}
                </button>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  window.setAcademyBatch = function (bIdx) {
    stageBatchIdx = bIdx;
    batchMatchSelectedLeft = null;
    batchMatchedPairs = {};
    renderStageMissionScene(document.getElementById("app-main"));
  };

  window.selectBatchLeft = function (idx, frText) {
    batchMatchSelectedLeft = idx;
    speakFrench(frText, 1.0);
    if (window.RPG_SFX) window.RPG_SFX.tileClick();
    document.querySelectorAll(".match-col:first-child .match-tile").forEach((btn, i) => {
      btn.classList.toggle("selected", i === idx);
    });
  };

  window.selectBatchRight = function (rightOriginalIdx, batchLen, totalBatches) {
    if (batchMatchSelectedLeft === null) return;
    let sameMeaning = false;
    try {
      const { cardsPool } = getActiveWorldAndStage();
      const cur = Math.max(0, stageBatchIdx);
      const bc = cardsPool.slice(cur * 5, cur * 5 + 5);
      const L = bc[batchMatchSelectedLeft], R = bc[rightOriginalIdx];
      sameMeaning = !!(L && R && normAnswer(L.en) === normAnswer(R.en));
    } catch (e) {}
    if (sameMeaning && batchMatchSelectedLeft !== rightOriginalIdx && !batchMatchedPairs[batchMatchSelectedLeft]) rightOriginalIdx = batchMatchSelectedLeft;
    if (batchMatchSelectedLeft === rightOriginalIdx) {
      batchMatchedPairs[rightOriginalIdx] = true;
      batchMatchSelectedLeft = null;
      if (window.RPG_SFX) window.RPG_SFX.matchCombo(Object.keys(batchMatchedPairs).length);
      addXP(15, 4);
      if (Object.keys(batchMatchedPairs).length >= batchLen) {
        save.stats.matchBoardsCleared = (save.stats.matchBoardsCleared || 0) + 1;
        if (window.RPG_SFX) window.RPG_SFX.victoryFanfare();
        const curB = Math.max(0, Math.min(totalBatches - 1, stageBatchIdx));
        const more = curB + 1 < totalBatches;
        if (window.RPG_VFX) window.RPG_VFX.toast(`Board ${curB + 1} / ${totalBatches} cleared!`, more ? "+60 XP! Next board…" : "+60 XP! All boards done. On to L'Écho…", "⚡");
        addXP(60, 15);
        setTimeout(() => {
          if (more) window.setAcademyBatch(curB + 1);
          else window.setStageWave("echo");
        }, 750);
        return;
      }
    } else {
      if (window.RPG_SFX) window.RPG_SFX.damageHit();
      batchMatchSelectedLeft = null;
    }
    renderStageMissionScene(document.getElementById("app-main"));
  };

  // WAVE 3: L'ÉCHO & DICTÉE ROYALE (BLIND AUDIO DICTATION + LIVE SPEAKING + COMPREHENSION)
  let echoRoundStart = 0;
  function renderWave3Echo(mount, world, stage, cardsPool) {
    const ECHO_ROUND = 8;
    if (echoCursor - echoRoundStart >= ECHO_ROUND) {
      mount.innerHTML = `
        <div class="arena-box intro-box"><div class="intro-card">
          <div class="intro-tag">🎧 EAR &amp; MIC • ROUND DONE</div>
          <div class="intro-fr" style="cursor:default;">Belle oreille !</div>
          <p style="color:var(--text-muted);margin:0.4rem 0 1rem;">8 phrases heard, written or said. Your ear gets faster every round.</p>
          <div class="intro-actions">
            <button class="btn" onclick="window.echoMore()">🎧 8 more</button>
            <button class="btn btn-gold intro-next" onclick="window.setStageWave('duel')">⚔️ Final step: Le Duel</button>
          </div>
        </div></div>`;
      if (window.RPG_SFX) window.RPG_SFX.victoryFanfare();
      return;
    }
    const idx = echoCursor % cardsPool.length;
    const item = cardsPool[idx];
    const safeFr = escapeHtml(item.fr.replace(/'/g, "\\'"));
    const safeEn = escapeHtml(item.en.replace(/'/g, "\\'"));
    const distractors = pickDistractors(cardsPool, item, "en", 3, echoCursor);
    const opts = [item, ...distractors].sort((a, b) => (a.en > b.en ? 1 : -1));

    mount.innerHTML = `
      <div class="arena-box">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;margin-bottom:0.9rem;">
          <div>
            <h3 style="font-size:1.3rem;font-weight:900;">🎧 Ear &amp; Mic — ${echoCursor - echoRoundStart + 1} / 8</h3>
            <p style="font-size:0.86rem;color:var(--text-muted);">Listen first. Then write what you hear (type or tap the word tiles), or say it into the mic, or pick its meaning below.</p>
          </div>
          <button class="btn btn-gold" onclick="window.setStageWave('duel')">Skip to the Duel ⚔️ ➡️</button>
        </div>

        <div class="teaching-slide-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;margin-bottom:1rem;">
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
              <button class="btn btn-gold" style="padding:0.7rem 1.2rem;font-size:0.96rem;" onclick="window.speakFrench('${safeFr}', 1.0)">
                🔊 Listen
              </button>
              <button class="btn" style="padding:0.7rem 1.1rem;border-color:#fde047;color:#fde047;" onclick="window.speakFrench('${safeFr}', 0.6)">
                🐢 Slow
              </button>
              <button class="btn btn-primary" style="padding:0.7rem 1.1rem;" onclick="window.startLiveFrenchMicCheck('${safeFr}', 'echo-mic-status', 'echo_${stage.stageId}_${idx}')">
                🎙️ Say it (+15 XP)
              </button>
              <button class="btn" onclick="const el=document.getElementById('dictee-blur-text');if(el)el.style.filter=el.style.filter==='none'?'blur(8px)':'none';">
                👁️ Show / hide the text
              </button>
            </div>
            <div id="echo-mic-status"></div>
          </div>

          <div style="background:rgba(15,23,42,0.85);border:1px solid rgba(56,189,248,0.35);border-radius:14px;padding:1rem;margin-bottom:1rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:0.78rem;color:#fde047;font-weight:800;text-transform:uppercase;">🎧 The phrase (hidden; tap to reveal):</span>
              <span style="font-size:0.82rem;color:#cbd5e1;">🇬🇧 Meaning Cue: <strong>"${escapeHtml(item.en)}"</strong></span>
            </div>
            <div id="dictee-blur-text" style="font-size:1.4rem;font-weight:900;color:#38bdf8;margin-top:0.25rem;cursor:pointer;filter:blur(8px);transition:filter 0.25s;"
                 onclick="this.style.filter='none';window.speakFrench('${safeFr}', 1.0)">
              🇫🇷 "${escapeHtml(item.fr)}"
            </div>
            ${item.note ? `<div style="font-size:0.82rem;color:#fbbf24;margin-top:0.25rem;">💡 Note: ${escapeHtml(item.note)}</div>` : ""}
          </div>

          <!-- Dual-Mode Dictée Royale (Kinetic Word Tiles + Live French Keyboard with Accent Bar) -->
          ${renderDualModeProductionDeck("echo_dictee", item.fr, "window.submitDicteeRoyale()", "✍️ Write what you hear (type it, or tap the word tiles):")}
          <div id="echo-dictee-feedback" style="margin-bottom:0.85rem;"></div>

          <div style="font-size:0.84rem;color:#cbd5e1;font-weight:800;margin-bottom:0.4rem;">Or pick what it means:</div>
          <div class="mcq-grid">
            ${opts.map((o) => {
              const isRight = o.en === item.en;
              return `
                <button class="mcq-opt" data-ok="${isRight ? 1 : 0}" onclick="window.solveEchoStep(this, ${isRight}, '${safeFr}', '${safeEn}')">
                  🇬🇧 ${escapeHtml(o.en)}
                </button>
              `;
            }).join("")}
          </div>
        </div>
      </div>
    `;
  }

  window.submitDicteeRoyale = function () {
    const { world, stage, cardsPool } = getActiveWorldAndStage();
    const item = cardsPool[echoCursor % cardsPool.length];
    const inp = document.getElementById("echo_dictee-input");
    const userVal = inp ? inp.value.trim() : "";
    const fb = document.getElementById("echo-dictee-feedback");
    if (!userVal) return;

    const evalRes = evaluateFrenchProduction(userVal, item.fr);
    const blurEl = document.getElementById("dictee-blur-text");
    if (blurEl) blurEl.style.filter = "none";
    speakFrench(item.fr, 1.0);

    window.recordLearningOutcome(
      `card_${stage.stageId}_${echoCursor % cardsPool.length}`,
      item.fr,
      item.en,
      evalRes.passed,
      evalRes.tier === "WRONG" ? "orthography" : "accent",
      world.cefr
    );

    if (evalRes.passed) {
      save.stats.earHits = (save.stats.earHits || 0) + 1;
      if (window.RPG_SFX) window.RPG_SFX.matchCombo(3);
      addXP(35, 10);
      if (fb) {
        fb.innerHTML = `<div class="feedback-banner ok">${evalRes.message} — ${evalRes.diffHtml} <button class="btn btn-gold" style="margin-left:0.75rem;padding:0.3rem 0.8rem;" onclick="window.nextEchoCard()">Next Utterance ➡️</button></div>`;
      }
    } else {
      if (window.RPG_SFX) window.RPG_SFX.damageHit();
      if (fb) {
        fb.innerHTML = `<div class="feedback-banner err">${evalRes.message}<br>Your input: ${evalRes.diffHtml}<br>Target: <strong>${escapeHtml(item.fr)}</strong></div>`;
      }
    }
  };

  window.nextEchoCard = function () {
    echoCursor += 1;
    renderStageMissionScene(document.getElementById("app-main"));
  };

  window.solveEchoStep = function (btnEl, isRight, safeFr, safeEn) {
    const { world, stage } = getActiveWorldAndStage();
    const blurEl = document.getElementById("dictee-blur-text");
    if (blurEl) blurEl.style.filter = "none";
    speakFrench(safeFr, 1.0);
    window.recordLearningOutcome(`echo_${stage.stageId}_${echoCursor}`, safeFr, safeEn || "", isRight, "comprehension", world.cefr);
    if (isRight) {
      btnEl.classList.add("correct");
      save.stats.earHits = (save.stats.earHits || 0) + 1;
      if (window.RPG_SFX) window.RPG_SFX.matchCombo(2);
      addXP(20, 5);
      setTimeout(() => {
        echoCursor += 1;
        renderStageMissionScene(document.getElementById("app-main"));
      }, 550);
    } else {
      btnEl.classList.add("wrong");
      if (window.RPG_SFX) window.RPG_SFX.damageHit();
      document.querySelectorAll(".mcq-opt").forEach(b => { b.disabled = true; if (b.dataset.ok === "1") b.classList.add("correct"); });
      const fb = document.getElementById("echo-dictee-feedback");
      if (fb) fb.innerHTML = `<div class="feedback-banner err">It means: <strong>${escapeHtml(safeEn)}</strong>. Listen once more and repeat it. <button class="btn btn-gold" style="margin-left:0.5rem;" onclick="window.nextEchoCard()">Next ➜</button></div>`;
    }
  };
  window.echoMore = function () { echoRoundStart = echoCursor; renderStageMissionScene(document.getElementById("app-main")); };

  // WAVE 4: LA FORGE (SMART CLOZE, ACTIVE TYPING & SENTENCE ASSEMBLY DRILLS)
  const FORGE_MAX = 8; // drills per round; every drill of the stage is reachable
  let forgeRound = 0;
  let forgeRoundStage = null;
  function forgeRoundCount(drillsPool) { return Math.max(1, Math.ceil(drillsPool.length / FORGE_MAX)); }
  function renderWave4Forge(mount, world, stage, drillsPool) {
    const fRounds = forgeRoundCount(drillsPool);
    if (forgeRoundStage !== stage.stageId) {
      forgeRoundStage = stage.stageId;
      const saved = bag("forgeRound")[stage.stageId] || 0;
      forgeRound = Math.max(0, Math.min(fRounds - 1, saved));
      forgeCursor = 0;
    }
    const list = drillsPool.slice(forgeRound * FORGE_MAX, (forgeRound + 1) * FORGE_MAX);
    const total = list.length;
    const done = Math.min(forgeCursor, total);
    if (done >= total && total) {
      const fd = bag("forgeRoundsDone");
      if ((fd[stage.stageId] || 0) < forgeRound + 1) { fd[stage.stageId] = forgeRound + 1; persistSave(); }
    }
    const forgeMore = forgeRound + 1 < fRounds;
    let html = `
      <div class="arena-box">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
          <div>
            <h3 style="font-size:1.3rem;font-weight:900;">⚒️ La Forge — Round ${forgeRound + 1} / ${fRounds} • ${done < total ? `Challenge ${done + 1} / ${total}` : "Round complete"}</h3>
            <p style="font-size:0.86rem;color:var(--text-muted);">Type the missing French, or tap a tile. One at a time.</p>
          </div>
          <button class="btn" onclick="window.setStageWave('duel')">Skip to the Duel ⚔️</button>
        </div>
        <div class="intro-progress"><div style="width:${total ? Math.round((done / total) * 100) : 100}%"></div></div>
      </div>
    `;

    if (done >= total) {
      html += `
        <div class="arena-box intro-box"><div class="intro-card">
          <div class="intro-tag">LA FORGE • ROUND ${forgeRound + 1} / ${fRounds} TERMINÉ</div>
          <div class="intro-fr" style="cursor:default;">Bien forgé !</div>
          <p style="color:var(--text-muted);margin:0.5rem 0 1rem;">${forgeMore ? `${drillsPool.length - (forgeRound + 1) * FORGE_MAX} more challenges are waiting in this stage.` : "Every challenge of this stage forged. Last step: beat the Guardian."}</p>
          <div class="intro-actions">
            <button class="btn" onclick="window.restartForge()">↻ Forge this round again</button>
            ${forgeMore ? `<button class="btn btn-gold intro-next" onclick="window.nextForgeRound()">⚒️ Next round (${forgeRound + 2} / ${fRounds})</button>
            <button class="btn" onclick="window.setStageWave('assaut')">⚡ Reflex Match now</button>` : `<button class="btn btn-gold intro-next" onclick="window.setStageWave('assaut')">⚡ Next: Reflex Match</button>
            <button class="btn" onclick="window.setStageWave('duel')">⚔️ Straight to the Duel</button>`}
          </div>
        </div></div>`;
      mount.innerHTML = html;
      return;
    }

    list.forEach((d, idx) => {
      if (idx !== done) return;
      const formattedPrompt = escapeHtml(d.prompt).replace(/_{2,}/g, `<span class="cloze-blank-pill" id="acad-drill-slot-${idx}">___</span>`);
      const rawChoices = d.choices && d.choices.length >= 2 ? d.choices : (d.wordTiles ? d.wordTiles.slice(0, 4) : [d.answer]);
      const choices = [...new Set(rawChoices.map(c => String(c || "").trim()).filter(Boolean))];
      const safeAns = escapeHtml(d.answer.replace(/'/g, "\\'"));
      const safeCloze = escapeHtml((d.clozeAnswer || d.answer).replace(/'/g, "\\'"));

      html += `
        <div class="teaching-slide-card" style="margin-bottom:0.85rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;">
            <span style="font-size:0.8rem;font-weight:800;color:#fde047;">Stage ${escapeHtml(stage.stageCode)} • ${escapeHtml(d.instruction || 'Complete the French sentence:')}</span>
            <span class="badge-cefr badge-${world.cefr}">${escapeHtml(d.type || 'cloze')}</span>
          </div>
          <div style="font-size:1.15rem;font-weight:800;margin-bottom:0.7rem;">Q${idx + 1}: ${formattedPrompt}</div>
          <div style="display:flex;gap:0.45rem;flex-wrap:wrap;margin-bottom:0.55rem;">
            <input id="acad-drill-inp-${idx}" type="text" class="input-french" style="max-width:360px;margin-bottom:0;padding:0.5rem 0.75rem;font-size:0.95rem;"
                   autocomplete="off" spellcheck="false"
                   placeholder="Type French answer or click a tile..."
                   onkeydown="if(event.key==='Enter'){event.preventDefault();window.solveAcademyDrill(${idx}, this.value, '${safeCloze}', '${safeAns}');}" />
            <button class="btn btn-gold" onclick="window.solveAcademyDrill(${idx}, document.getElementById('acad-drill-inp-${idx}').value, '${safeCloze}', '${safeAns}')">🔥 Check Typed</button>
          </div>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
            ${choices.map(ch => {
              const safeCh = escapeHtml(ch.replace(/'/g, "\\'"));
              return `<button class="btn" onclick="window.solveAcademyDrill(${idx}, '${safeCh}', '${safeCloze}', '${safeAns}')">✨ ${escapeHtml(ch)}</button>`;
            }).join("")}
            <button class="btn btn-primary" onclick="document.getElementById('acad-drill-rev-${idx}').style.display='block';window.speakFrench('${safeAns}', 1.0)">👁️ Reveal &amp; Listen (1x)</button>
            <button class="btn" onclick="document.getElementById('acad-drill-rev-${idx}').style.display='block';window.speakFrench('${safeAns}', 0.6)">🐢 Slow (0.6x)</button>
          </div>
          <div id="acad-drill-err-${idx}" style="display:none;" class="feedback-banner err"></div>
          <div id="acad-drill-rev-${idx}" style="display:none;" class="feedback-banner ok">
            ✅ Answer: <strong style="cursor:pointer;text-decoration:underline;" onclick="window.speakFrench('${safeAns}', 1.0)">${escapeHtml(d.answer)}</strong>
            ${d.explanation ? `<div style="font-size:0.84rem;color:#cbd5e1;margin-top:0.2rem;">💡 ${escapeHtml(d.explanation)}</div>` : ""}
            <button class="btn btn-gold intro-next" id="forge-next-btn" style="margin-top:0.5rem;" onclick="window.nextForgeDrill()">Next ➜</button>
          </div>
        </div>
      `;
    });

    mount.innerHTML = html;
  }

  window.nextForgeDrill = function () {
    forgeCursor += 1;
    renderStageMissionScene(document.getElementById("app-main"));
  };
  window.restartForge = function () {
    forgeCursor = 0;
    renderStageMissionScene(document.getElementById("app-main"));
  };
  window.nextForgeRound = function () {
    const { stage } = getActiveWorldAndStage();
    forgeRound += 1;
    forgeCursor = 0;
    bag("forgeRound")[stage.stageId] = forgeRound;
    persistSave();
    renderStageMissionScene(document.getElementById("app-main"));
  };

  window.solveAcademyDrill = function (idx, chosen, targetCloze, fullAns) {
    const { world, stage } = getActiveWorldAndStage();
    const slot = document.getElementById(`acad-drill-slot-${idx}`);
    const rev = document.getElementById(`acad-drill-rev-${idx}`);
    const errBox = document.getElementById(`acad-drill-err-${idx}`);
    const evalCloze = evaluateFrenchProduction(chosen, targetCloze);
    const evalFull = evaluateFrenchProduction(chosen, fullAns);
    const isOk = evalCloze.passed || evalFull.passed || checkAnswerMatch(chosen, targetCloze) || checkAnswerMatch(chosen, fullAns);

    window.recordLearningOutcome(`drill_${stage.stageId}_${forgeRound * FORGE_MAX + idx}`, fullAns, targetCloze, isOk, "grammar_cloze", world.cefr);

    if (isOk) {
      if (errBox) errBox.style.display = "none";
      if (rev) rev.style.display = "block";
      speakFrench(fullAns, 1.0);
      if (slot) {
        slot.textContent = chosen || targetCloze;
        slot.style.color = "#6ee7b7";
        slot.style.borderColor = "#10b981";
      }
      if (window.RPG_SFX) window.RPG_SFX.matchCombo(2);
      if (window.RPG_VFX) window.RPG_VFX.floatText(["Bravo !", "Parfait !", "Bien forgé !", "Nickel !"][idx % 4] + " +25 XP", "#10b981");
      save.stats.drillsSolved = (save.stats.drillsSolved || 0) + 1;
      addXP(25, 6);
      const nb = document.getElementById("forge-next-btn");
      if (nb) setTimeout(() => nb.focus(), 50);
    } else {
      if (window.RPG_SFX) window.RPG_SFX.damageHit();
      if (errBox) {
        errBox.style.display = "block";
        errBox.innerHTML = `❌ Not quite: ${evalCloze.diffHtml} — Try again or click <strong>Reveal &amp; Listen</strong>!`;
      }
    }
  };

  // WAVE 5: LE DUEL (STAGE GUARDIAN CLASH WITH <3s NATIVE REFLEX TIMER & DUAL-MODE PRODUCTION!)
  let duelTotal = 3;
  let duelInitKey = null;
  let duelOrderKey = null;
  let duelOrder = [];
  let duelDeck = [];
  // Interleaving: ~1 in 4 strikes recalls a phrase from an EARLIER cleared stage,
  // so old material keeps coming back (spaced, mixed practice).
  function interleaveCards(stage, cardsPool) {
    try {
      const out = [];
      const seen = new Set(cardsPool.map(c => c.fr));
      const lessons = DATA.lessons || [];
      for (const w of lessons) {
        for (const s of (w.stages || [])) {
          if (s.stageId === stage.stageId) return out;
          if (!save.clearedStages[s.stageId] || !s.cards) continue;
          s.cards.forEach(c => { if (c && c.fr && c.en && !seen.has(c.fr)) { seen.add(c.fr); out.push(c); } });
        }
      }
      return out;
    } catch (e) { return []; }
  }
  window.RPG_INTERLEAVE = function () { const { stage, cardsPool } = getActiveWorldAndStage(); return interleaveCards(stage, cardsPool).length; };
  function duelCard(stage, cardsPool) {
    const key = `${stage.stageId}:${cardsPool.length}`;
    if (duelOrderKey !== key) {
      duelOrderKey = key;
      // Strikes come from the WHOLE stage, not just the first phrases.
      const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
      const own = shuffle(cardsPool.slice());
      const old = shuffle(interleaveCards(stage, cardsPool).slice(-60)).slice(0, Math.ceil(own.length / 3));
      duelDeck = [];
      let oi = 0;
      own.forEach((c, i) => { duelDeck.push(c); if (i % 3 === 1 && oi < old.length) duelDeck.push(Object.assign({ _review: true }, old[oi++])); });
      duelOrder = duelDeck.map((_, i) => i);
    }
    return duelDeck[duelOrder[duelCursor % duelOrder.length]] || cardsPool[0];
  }
  window.RPG_DUEL_CARD = function () {
    const { stage, cardsPool } = getActiveWorldAndStage();
    const c = duelCard(stage, cardsPool);
    return { fr: c.fr, en: c.en, remaining: duelStrikesRemaining, total: duelTotal };
  };
  function renderWave5Duel(mount, world, stage, cardsPool, drillsPool, nextStage) {
    const existingStars = save.clearedStages[stage.stageId] || 0;
    if (duelInitKey !== stage.stageId) {
      duelInitKey = stage.stageId;
      duelTotal = Math.max(3, Math.min(6, Math.ceil(cardsPool.length / 8)));
      duelStrikesRemaining = duelTotal;
      duelMistakes = 0;
    }

    if (duelStrikesRemaining <= 0) {
      stopReflexTimer();
      const earnedStars = duelMistakes === 0 ? 3 : (duelMistakes === 1 ? 2 : 1);
      return renderStageVictoryBanner(mount, world, stage, earnedStars, nextStage);
    }

    const qCard = duelCard(stage, cardsPool);
    const safeFr = escapeHtml(qCard.fr.replace(/'/g, "\\'"));
    const safeEn = escapeHtml(qCard.en.replace(/'/g, "\\'"));
    const distractors = pickDistractors(qCard._review ? cardsPool.concat(interleaveCards(stage, cardsPool)) : cardsPool, qCard, "fr", 3, duelCursor + 11);
    const opts = [qCard, ...distractors].sort((a, b) => (a.fr > b.fr ? 1 : -1));

    mount.innerHTML = `
      <div class="arena-box" style="border:2px solid var(--border-gold);">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;margin-bottom:0.85rem;">
          <div>
            <span class="badge-cefr badge-${world.cefr}">⚔️ WAVE 5: STAGE ${escapeHtml(stage.stageCode)} GUARDIAN TRIAL</span>
            <h3 style="font-size:1.35rem;font-weight:900;margin-top:0.25rem;">
              Defeat the Stage Guardian (${duelTotal - duelStrikesRemaining} / ${duelTotal} Strikes Landed)
            </h3>
          </div>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
            <button class="btn btn-purple" onclick="window.launchBossForLesson(${world.number})">🐉 Open Full 2D Canvas Boss Arena</button>
            ${existingStars > 0 && nextStage ? `
              <button class="btn btn-emerald" onclick="window.launchStageById('${nextStage.stageId}', true)">
                🚀 Next: Stage ${escapeHtml(nextStage.stageCode)} ➡️
              </button>
            ` : ""}
          </div>
        </div>

        <!-- Guardian HP Bar -->
        <div style="background:rgba(2,6,23,0.9);border:1.5px solid #f43f5e;border-radius:99px;height:22px;overflow:hidden;position:relative;margin-bottom:0.85rem;">
          <div style="height:100%;width:${Math.round((duelStrikesRemaining / duelTotal) * 100)}%;background:linear-gradient(90deg,#e11d48,#f43f5e);transition:width 0.3s;"></div>
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:0.76rem;font-weight:900;color:#fff;">
            🐉 STAGE ${escapeHtml(stage.stageCode)} GUARDIAN HP: ${duelStrikesRemaining} / ${duelTotal}
          </div>
        </div>

        <!-- <3s Réflexe Natif Speed-Think Bar -->
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.78rem;color:#fde047;font-weight:800;">
          <span>⚡ Bonus timer (answer in under 3 s = double XP):</span>
          <span id="reflex-timer-label">3.0s</span>
        </div>
        <div class="reflex-timer-bar">
          <div id="reflex-timer-fill" class="reflex-timer-fill" style="width:100%;"></div>
        </div>

        <div class="teaching-slide-card">
          <div style="font-size:0.82rem;color:#fde047;font-weight:800;text-transform:uppercase;">Strike ${duelTotal - duelStrikesRemaining + 1} of ${duelTotal} ${qCard._review ? "🔁 REVIEW FROM AN EARLIER STAGE" : "(drawn from the whole stage)"} — Produce or select the exact French expression for:</div>
          <div style="font-size:1.45rem;font-weight:900;color:#fff;margin:0.4rem 0 0.9rem;">
            🇬🇧 "${escapeHtml(qCard.en)}"
          </div>

          ${renderDualModeProductionDeck("duel_prod", qCard.fr, "window.submitDuelTypedStrike()", "⌨️ Type it (or tap the word tiles) for +20 bonus XP:")}
          <div id="duel-typed-feedback" style="margin-bottom:0.75rem;"></div>

          <div style="font-size:0.8rem;color:#cbd5e1;font-weight:800;margin-bottom:0.4rem;">Or pick the right answer:</div>
          <div class="mcq-grid">
            ${opts.map((o) => {
              const isRight = o.fr === qCard.fr;
              const sf = escapeHtml(o.fr.replace(/'/g, "\\'"));
              return `
                <button class="mcq-opt" data-ok="${isRight ? 1 : 0}" onclick="window.executeStageDuelStrike(this, ${isRight}, '${sf}', '${safeEn}')">
                  ⚔️ ${escapeHtml(o.fr)}
                </button>
              `;
            }).join("")}
          </div>
        </div>
      </div>
    `;

    if (world.number > 3) startReflexTimer(3000);
    else { const bar = document.querySelector(".reflex-timer-bar"); if (bar) { bar.style.display = "none"; const lab = document.getElementById("reflex-timer-label"); if (lab && lab.parentElement) lab.parentElement.style.display = "none"; } }
  }

  window.submitDuelTypedStrike = function () {
    const { world, stage, cardsPool } = getActiveWorldAndStage();
    const qCard = duelCard(stage, cardsPool);
    const inp = document.getElementById("duel_prod-input");
    const val = inp ? inp.value.trim() : "";
    if (!val) return;
    let evalRes = evaluateFrenchProduction(val, qCard.fr);
    if (!evalRes.passed) {
      // Accept another phrase of this stage with exactly the same meaning (synonyms).
      const alt = cardsPool.find(c => c !== qCard && normAnswer(c.en) === normAnswer(qCard.en) && evaluateFrenchProduction(val, c.fr).passed);
      if (alt) evalRes = evaluateFrenchProduction(val, alt.fr);
    }
    if (evalRes.passed) {
      addXP(20, 5);
      window.executeStageDuelStrike(null, true, qCard.fr, qCard.en);
    } else {
      const fb = document.getElementById("duel-typed-feedback");
      if (fb) {
        fb.innerHTML = `<div class="feedback-banner err">${evalRes.message}: ${evalRes.diffHtml}</div>`;
      }
      window.executeStageDuelStrike(null, false, qCard.fr, qCard.en);
    }
  };

  window.executeStageDuelStrike = function (btnEl, isRight, safeFr, safeEn) {
    const { world, stage } = getActiveWorldAndStage();
    const elapsedMs = stopReflexTimer();
    const isReflexBonus = elapsedMs < 3000;
    speakFrench(safeFr, 1.0);
    window.recordLearningOutcome(`duel_${stage.stageId}_${duelCursor}`, safeFr, safeEn || "", isRight, "duel_production", world.cefr);

    if (isRight) {
      if (btnEl) btnEl.classList.add("correct");
      duelStrikesRemaining -= 1;
      duelCursor += 1;
      if (window.RPG_SFX) window.RPG_SFX.swordSlash();
      if (window.RPG_VFX) window.RPG_VFX.floatText(isReflexBonus ? "⚡ NATIVE REFLEX STRIKE! (2×)" : "⚔️ STRIKE!", "#fde047");
      addXP(isReflexBonus ? 60 : 30, isReflexBonus ? 14 : 8);

      if (duelStrikesRemaining <= 0) {
        const earnedStars = duelMistakes === 0 ? 3 : (duelMistakes === 1 ? 2 : 1);
        const prevStars = save.clearedStages[stage.stageId] || 0;
        save.clearedStages[stage.stageId] = Math.max(prevStars, earnedStars);
        if (stage.type === "boss" || (world.stages || []).every(s => !!save.clearedStages[s.stageId])) {
          save.masteredLessons[world.id] = true;
          save.stats.bossesSlain = (save.stats.bossesSlain || 0) + 1;
        }
        addXP(150, 40);
        if (window.RPG_SFX) window.RPG_SFX.victoryFanfare();
        if (window.RPG_VFX) {
          window.RPG_VFX.toast(
            `STAGE ${stage.stageCode} CLEARED! ${"⭐".repeat(earnedStars)}`,
            `Next stage unlocked! +150 XP & +40 Gold`,
            "🏆"
          );
        }
      }
      setTimeout(() => {
        renderStageMissionScene(document.getElementById("app-main"));
      }, 520);
    } else {
      if (btnEl) btnEl.classList.add("wrong");
      duelMistakes += 1;
      if (window.RPG_SFX) window.RPG_SFX.damageHit();
      document.querySelectorAll(".mcq-opt").forEach(b => { b.disabled = true; if (b.dataset.ok === "1") b.classList.add("correct"); });
      const fb = document.getElementById("duel-typed-feedback");
      if (fb) fb.innerHTML = `<div class="feedback-banner err">The Guardian blocks! The answer was <strong>${escapeHtml(safeFr)}</strong> (${escapeHtml(safeEn)}). A new attack is coming… <button class="btn btn-gold" style="margin-left:0.5rem;" onclick="window.nextDuelAttack()">Next ➜</button></div>`;
    }
  };
  window.nextDuelAttack = function () { duelCursor += 1; renderStageMissionScene(document.getElementById("app-main")); };

  function renderStageVictoryBanner(mount, world, stage, stars, nextStage) {
    const learnedCards = getStageCardsPool(world, stage).filter(c => c && c.fr && String(c.fr).length < 60).slice(0, 40);
    const recap = learnedCards.sort(() => Math.random() - 0.5).slice(0, 3);
    const misses = Object.values(save.mistakeVault || {}).filter(m => m.stageId === stage.stageId).length;
    const debrief = `<div class="debrief"><img src="assets/tutor_camille.jpg" alt=""><div>
        <div class="intro-tag">🎓 CAMILLE'S DEBRIEF</div>
        <div>Bravo ! Three things you can now say:</div>
        <div class="debrief-chips">${recap.map(c => `<button class="word-tile" onclick="window.speakFrench('${escapeHtml(String(c.fr).replace(/'/g, "\\'"))}',1.0)">🔊 ${escapeHtml(c.fr)} <span style="color:#94a3b8;">= ${escapeHtml(c.en)}</span></button>`).join("")}</div>
        <div style="font-size:0.86rem;color:#cbd5e1;">${misses ? `📕 ${misses} phrase${misses > 1 ? "s" : ""} from this stage will come back in your review until you get ${misses > 1 ? "them" : "it"} right twice.` : "📕 No mistakes left from this stage. Impeccable."} Tomorrow, the warm-up will bring back what's due.</div>
      </div></div>`;
    mount.innerHTML = debrief + `
      <div class="arena-box" style="border:2px solid #fde047;text-align:center;padding:2.2rem 1.5rem;background:linear-gradient(135deg,rgba(6,78,59,0.45),rgba(15,23,42,0.96));">
        <div style="font-size:3rem;margin-bottom:0.4rem;">${"⭐".repeat(stars)}</div>
        <h2 style="font-size:1.9rem;font-weight:900;color:#fde047;">
          STAGE ${escapeHtml(stage.stageCode)} CONQUERED!
        </h2>
        <p style="font-size:1.05rem;color:#e2e8f0;max-width:620px;margin:0.5rem auto 1.35rem;">
          You have mastered <strong>${escapeHtml(stage.title)}</strong> (${world.cefr}) and earned <strong>+150 XP &amp; +40 Gold</strong>!
          ${nextStage ? `<strong>Stage ${escapeHtml(nextStage.stageCode)}: ${escapeHtml(nextStage.title)}</strong> is now UNLOCKED!` : "You have completed the final stage of the Odyssey!"}
        </p>
        <div style="display:flex;justify-content:center;gap:0.75rem;flex-wrap:wrap;">
          <button class="btn btn-gold" style="padding:0.9rem 1.7rem;font-size:1.05rem;" onclick="window.continueJourney()">
            ▶ Continue Journey
          </button>
          ${nextStage ? `
            <button class="btn btn-emerald" onclick="window.launchStageById('${nextStage.stageId}', true)">
              🚀 Straight to Stage ${escapeHtml(nextStage.stageCode)}
            </button>
          ` : ""}
          <button class="btn btn-primary" onclick="window.navigateScene('worldmap')">🗺️ View World Map</button>
          <button class="btn" onclick="window.launchStageById('${stage.stageId}', true)">🔄 Replay Stage ${escapeHtml(stage.stageCode)}</button>
        </div>
      </div>
    `;
  }

  window.markChapterMastered = function (lessonId) {
    const { world, stage } = getActiveWorldAndStage();
    save.clearedStages[stage.stageId] = 3;
    save.masteredLessons[lessonId || world.id] = true;
    if (window.RPG_SFX) window.RPG_SFX.victoryFanfare();
    addXP(150, 40);
    renderStageMissionScene(document.getElementById("app-main"));
  };

  // =========================================================================
  // SCENE 4: 2D CANVAS TURN-BASED BOSS BATTLE ARENA
  // =========================================================================
  let battleState = {
    lessonNum: 1,
    scope: "chapter",
    spellSchool: "strike",
    heroHP: 100,
    heroMaxHP: 100,
    heroShield: false,
    critReady: false,
    bossHP: 240,
    bossMaxHP: 240,
    currentChallenge: null,
    selectedTiles: [],
    deckTiles: [],
    purgedIndices: [],
    mentorHintShown: false
  };

  window.launchBossForLesson = function (lessonNum) {
    save.currentLessonNum = lessonNum;
    battleState.lessonNum = lessonNum;
    battleState.heroHP = 100;
    battleState.bossHP = 240;
    battleState.bossMaxHP = 240;
    battleState.currentChallenge = null;
    window.navigateScene("battle");
  };

  function buildBattleChallenge() {
    const num = battleState.lessonNum || save.currentLessonNum || 1;
    const lesson = DATA.lessons.find(l => l.number === num) || DATA.lessons[0];
    let cardPool = (window.RPG_INDEX && window.RPG_INDEX.CARDS_BY_LESSON[lesson.id]) || [];
    if (battleState.scope === "cefr" || cardPool.length < 4) {
      cardPool = (window.RPG_INDEX && window.RPG_INDEX.CARDS_BY_CEFR[lesson.cefr]) || DATA.flashcards;
    }
    let drillPool = (window.RPG_INDEX && window.RPG_INDEX.DRILLS_BY_LESSON[lesson.id]) || [];
    if (battleState.scope === "cefr" || drillPool.length < 2) {
      drillPool = (window.RPG_INDEX && window.RPG_INDEX.DRILLS_BY_CEFR[lesson.cefr]) || DATA.drills;
    }

    battleState.purgedIndices = [];
    battleState.mentorHintShown = false;

    if (battleState.spellSchool === "cloze") {
      const clozeDrills = drillPool.filter(d => d.type === "cloze" && d.choices && d.choices.length >= 2);
      if (clozeDrills.length > 0) {
        const d = clozeDrills[Math.floor(Math.random() * clozeDrills.length)];
        return {
          mode: "cloze",
          prompt: d.prompt,
          subPrompt: d.instruction || "Fill in the missing French word:",
          targetFr: d.clozeAnswer || d.answer,
          fullFr: d.answer,
          options: d.choices,
          hint: d.explanation || `Complete sentence: "${d.answer}"`
        };
      }
    }

    const card = cardPool[Math.floor(Math.random() * cardPool.length)] || DATA.flashcards[0];
    const distractors = [];
    for (let i = 0; i < 15 && distractors.length < 3; i++) {
      const r = cardPool[Math.floor(Math.random() * cardPool.length)];
      if (r && r.fr !== card.fr && !distractors.includes(r.fr)) distractors.push(r.fr);
    }
    const options = [card.fr, ...distractors].sort(() => 0.5 - Math.random());

    const words = String(card.fr || "").split("/")[0].trim().split(/\s+/).filter(Boolean);
    const decoys = ["le", "la", "de", "un", "pas", "est"].filter(w => !words.includes(w)).slice(0, 3);
    battleState.selectedTiles = [];
    battleState.deckTiles = [...words, ...decoys].map((w, idx) => ({ id: `bt_${idx}`, word: w })).sort(() => 0.5 - Math.random());

    return {
      mode: battleState.spellSchool,
      prompt: card.en,
      subPrompt: battleState.spellSchool === "audio" ? "Listen closely and choose the matching French expression:" : "Cast the French expression for:",
      targetFr: card.fr,
      fullFr: card.fr,
      options,
      hint: `Starts with "${card.fr.slice(0, Math.min(4, card.fr.length))}..." ${card.note ? `(${card.note})` : ""} • Source: ${card.source}`
    };
  }

  function renderBattleArenaScene(container) {
    battleState.lessonNum = save.currentLessonNum || 1;
    const lesson = DATA.lessons.find(l => l.number === battleState.lessonNum) || DATA.lessons[0];
    if (!battleState.currentChallenge) {
      battleState.currentChallenge = buildBattleChallenge();
    }

    container.innerHTML = `
      <!-- Top Bar: World Selector & Scope Toggle -->
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;margin-bottom:0.75rem;">
        <div style="display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;">
          <button class="btn" onclick="window.ODY_BACK ? window.ODY_BACK() : window.navigateScene('home')">⬅️ Retour</button>
          <button class="btn" onclick="window.navigateScene('academy')">🎮 Stage ${escapeHtml(save.currentStageId || '1-1')}</button>
          <select class="btn" style="color:#fde047;font-weight:800;" onchange="window.changeBattleChapter(Number(this.value))">
            ${DATA.lessons.map(l => `
              <option value="${l.number}" ${l.number === lesson.number ? 'selected' : ''}>
                ⚔️ World ${String(l.number).padStart(2, "0")} Boss: ${escapeHtml(l.title.slice(0, 34))} (${l.cefr})
              </option>
            `).join("")}
          </select>
          <select class="btn" onchange="window.changeBattleScope(this.value)">
            <option value="chapter" ${battleState.scope === 'chapter' ? 'selected' : ''}>🎯 Current World Only</option>
            <option value="cefr" ${battleState.scope === 'cefr' ? 'selected' : ''}>🌍 All ${lesson.cefr} Realm Worlds</option>
          </select>
        </div>

        <!-- 4 Spell Schools -->
        <div style="display:flex;gap:0.4rem;flex-wrap:wrap;">
          <button class="btn ${battleState.spellSchool === 'strike' ? 'btn-gold' : ''}" onclick="window.setBattleSpellSchool('strike')">⚔️ 1. Lexical Strike</button>
          <button class="btn ${battleState.spellSchool === 'cloze' ? 'btn-gold' : ''}" onclick="window.setBattleSpellSchool('cloze')">🧩 2. Smart Cloze Rune</button>
          <button class="btn ${battleState.spellSchool === 'tiles' ? 'btn-gold' : ''}" onclick="window.setBattleSpellSchool('tiles')">🃏 3. Sentence Weaver</button>
          <button class="btn ${battleState.spellSchool === 'audio' ? 'btn-gold' : ''}" onclick="window.setBattleSpellSchool('audio')">🎧 4. Echo Strike</button>
        </div>
      </div>

      <!-- LIVE 60-FPS 2D TURN-BASED BATTLE CANVAS -->
      <div class="battle-stage-frame">
        <canvas id="battle-canvas" width="1050" height="450"></canvas>
      </div>

      <!-- RPG Battle Command Deck -->
      <div class="battle-command-deck" id="battle-deck-mount"></div>
    `;

    if (window.RPG_BATTLE_STAGE) {
      window.RPG_BATTLE_STAGE.init("battle-canvas", {
        heroHP: battleState.heroHP,
        heroMaxHP: battleState.heroMaxHP,
        heroShield: battleState.heroShield,
        bossHP: battleState.bossHP,
        bossMaxHP: battleState.bossMaxHP,
        lessonNum: lesson.number,
        lessonTitle: `World ${String(lesson.number).padStart(2, "0")}: ${lesson.title}`
      });
    }

    renderBattleDeckMount();
  }

  function renderBattleDeckMount() {
    const mount = document.getElementById("battle-deck-mount");
    if (!mount) return;
    const ch = battleState.currentChallenge;
    const inv = save.inventory || {};
    const safeFullFr = escapeHtml(ch.fullFr.replace(/'/g, "\\'"));

    const formattedPrompt = ch.mode === "cloze"
      ? escapeHtml(ch.prompt).replace(/_{2,}/g, `<span class="cloze-blank-pill">___</span>`)
      : escapeHtml(ch.prompt);

    mount.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.6rem;margin-bottom:0.9rem;border-bottom:1px solid rgba(148,163,184,0.2);padding-bottom:0.75rem;">
        <div style="display:flex;gap:0.45rem;flex-wrap:wrap;">
          <button class="btn" onclick="window.useBattleRelic('fiftyFifty')" title="Eliminate 2 wrong answers">⚡ 50/50 Purge (${inv.fiftyFifty || 0})</button>
          <button class="btn" onclick="window.useBattleRelic('shield')" title="Block next boss attack">🛡️ Aegis Shield (${inv.shield || 0})</button>
          <button class="btn" onclick="window.useBattleRelic('critElixir')" title="2.5x Critical Damage on next strike">🧪 2.5× Crit Elixir (${inv.critElixir || 0})</button>
        </div>
        <div style="display:flex;gap:0.45rem;flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="window.speakFrench('${safeFullFr}', 1.0)">🔊 Studio French (1x)</button>
          <button class="btn" style="color:#fde047;border-color:#fde047;" onclick="window.speakFrench('${safeFullFr}', 0.6)">🐢 Slow (0.6x)</button>
          <button class="btn btn-purple" onclick="window.showMentorBattleHint()">💡 Tactical Hint</button>
        </div>
      </div>

      ${battleState.mentorHintShown ? `
        <div class="feedback-banner ok" style="margin-bottom:0.85rem;">
          ⚜️ <strong>Mentor Camille's Hint:</strong> ${escapeHtml(ch.hint)} — Target: <strong style="text-decoration:underline;cursor:pointer;" onclick="window.speakFrench('${safeFullFr}', 0.85)">🔊 ${escapeHtml(ch.targetFr)}</strong>
        </div>
      ` : ""}

      <div style="font-size:0.84rem;color:var(--accent-blue);font-weight:800;text-transform:uppercase;">${escapeHtml(ch.subPrompt)}</div>
      <div style="font-size:1.45rem;font-weight:900;color:#fff;margin:0.35rem 0 0.9rem;">
        ${ch.mode === "audio" ? `<button class="btn btn-gold" onclick="window.speakFrench('${safeFullFr}', 1.0)">🔊 Play Boss Audio Cue</button> <span style="font-size:1rem;color:#cbd5e1;margin-left:0.6rem;">(Meaning: ${formattedPrompt})</span>` : formattedPrompt}
      </div>

      ${ch.mode === "tiles" ? `
        <div class="sentence-slot-tray">
          ${battleState.selectedTiles.length === 0
            ? `<span style="color:var(--text-muted);">✨ Click the glowing French rune tiles below to weave your spell...</span>`
            : battleState.selectedTiles.map((t, idx) => `<button class="word-tile in-slot" onclick="window.removeBattleTile(${idx})">${escapeHtml(t.word)} ✕</button>`).join("")
          }
        </div>
        <div class="tile-deck">
          ${battleState.deckTiles.map(t => {
            const used = battleState.selectedTiles.some(st => st.id === t.id);
            return `<button class="word-tile ${used ? 'used' : ''}" onclick="window.pickBattleTile('${t.id}')">${escapeHtml(t.word)}</button>`;
          }).join("")}
        </div>
        <button class="btn btn-gold" onclick="window.castTileSpell()">🔥 Cast Runic Spell</button>
      ` : `
        <div class="mcq-grid">
          ${ch.options.map((opt, idx) => {
            if (battleState.purgedIndices.includes(idx)) {
              return `<button class="mcq-opt" disabled style="opacity:0.22;text-decoration:line-through;">Purged</button>`;
            }
            const safeOpt = escapeHtml(opt.replace(/'/g, "\\'"));
            return `
              <button class="mcq-opt" onclick="window.executeBattleStrike(this, '${safeOpt}')">
                ⚡ ${escapeHtml(opt)}
              </button>
            `;
          }).join("")}
        </div>
      `}
      <div id="battle-turn-feedback"></div>
    `;
  }

  window.changeBattleChapter = function (num) {
    window.launchBossForLesson(num);
  };

  window.changeBattleScope = function (sc) {
    battleState.scope = sc;
    battleState.currentChallenge = buildBattleChallenge();
    renderBattleDeckMount();
  };

  window.setBattleSpellSchool = function (school) {
    battleState.spellSchool = school;
    battleState.currentChallenge = buildBattleChallenge();
    renderBattleArenaScene(document.getElementById("app-main"));
  };

  window.showMentorBattleHint = function () {
    battleState.mentorHintShown = true;
    if (battleState.currentChallenge) speakFrench(battleState.currentChallenge.fullFr, 0.85);
    renderBattleDeckMount();
  };

  window.useBattleRelic = function (key) {
    if (!save.inventory || (save.inventory[key] || 0) <= 0) {
      if (window.RPG_VFX) window.RPG_VFX.toast("No Relics Left", "Visit the Boutique de Lumière (Gold Purse) to buy more relics!", "🪙");
      return;
    }
    save.inventory[key] -= 1;
    if (window.RPG_SFX) window.RPG_SFX.potionUse();
    if (key === "fiftyFifty" && battleState.currentChallenge) {
      const ch = battleState.currentChallenge;
      const wrongIdxs = ch.options.map((o, i) => (checkAnswerMatch(o, ch.targetFr) ? -1 : i)).filter(i => i !== -1);
      battleState.purgedIndices = wrongIdxs.slice(0, 2);
    } else if (key === "shield") {
      battleState.heroShield = true;
    } else if (key === "critElixir") {
      battleState.critReady = true;
    }
    persistSave();
    if (window.RPG_BATTLE_STAGE) window.RPG_BATTLE_STAGE.updateState({ heroShield: battleState.heroShield });
    renderBattleDeckMount();
  };

  window.pickBattleTile = function (id) {
    const t = battleState.deckTiles.find(x => x.id === id);
    if (!t || battleState.selectedTiles.some(x => x.id === id)) return;
    if (window.RPG_SFX) window.RPG_SFX.tileClick();
    speakFrench(t.word, 1.0);
    battleState.selectedTiles.push(t);
    const targetWords = String(battleState.currentChallenge.targetFr || "").split("/")[0].trim().split(/\s+/).filter(Boolean);
    if (battleState.selectedTiles.length === targetWords.length) {
      window.castTileSpell();
      return;
    }
    renderBattleDeckMount();
  };

  window.removeBattleTile = function (idx) {
    battleState.selectedTiles.splice(idx, 1);
    renderBattleDeckMount();
  };

  window.castTileSpell = function () {
    const built = battleState.selectedTiles.map(t => t.word).join(" ");
    window.executeBattleStrike(null, built);
  };

  window.executeBattleStrike = function (btnEl, chosenStr) {
    const ch = battleState.currentChallenge;
    if (!ch) return;
    speakFrench(ch.fullFr, 1.0);
    const isCorrect = checkAnswerMatch(chosenStr, ch.targetFr) || checkAnswerMatch(chosenStr, ch.fullFr);

    if (isCorrect) {
      if (btnEl) btnEl.classList.add("correct");
      save.combo = (save.combo || 0) + 1;
      const isCrit = battleState.critReady || save.combo % 3 === 0;
      battleState.critReady = false;
      const dmg = isCrit ? 95 : 50;
      battleState.bossHP = Math.max(0, battleState.bossHP - dmg);

      if (window.RPG_BATTLE_STAGE) {
        window.RPG_BATTLE_STAGE.updateState({ bossHP: battleState.bossHP });
        window.RPG_BATTLE_STAGE.triggerHeroAttack(dmg, isCrit);
      }
      addXP(isCrit ? 45 : 30, isCrit ? 12 : 8);

      if (battleState.bossHP <= 0) {
        const lesson = DATA.lessons.find(l => l.number === battleState.lessonNum) || DATA.lessons[0];
        save.masteredLessons[lesson.id] = true;
        if (lesson.stages && lesson.stages.length) {
          const bossStage = lesson.stages[lesson.stages.length - 1];
          save.clearedStages[bossStage.stageId] = 3;
        }
        save.stats.bossesSlain = (save.stats.bossesSlain || 0) + 1;
        addXP(250, 75);
        setTimeout(() => {
          if (window.RPG_SFX) window.RPG_SFX.victoryFanfare();
          if (window.RPG_VFX) window.RPG_VFX.toast("WORLD GUARDIAN DEFEATED!", `World ${lesson.number} Mastered! +250 XP & +75 Gold!`, "👑");
          battleState.bossHP = battleState.bossMaxHP;
          battleState.currentChallenge = buildBattleChallenge();
          if (window.RPG_BATTLE_STAGE) window.RPG_BATTLE_STAGE.updateState({ bossHP: battleState.bossHP });
          renderBattleDeckMount();
        }, 750);
      } else {
        setTimeout(() => {
          battleState.currentChallenge = buildBattleChallenge();
          renderBattleDeckMount();
        }, 680);
      }
    } else {
      if (btnEl) btnEl.classList.add("wrong");
      save.combo = 0;
      const blocked = battleState.heroShield;
      battleState.heroShield = false;
      const bossDmg = blocked ? 0 : 20;
      battleState.heroHP = Math.max(10, battleState.heroHP - bossDmg);

      if (window.RPG_BATTLE_STAGE) {
        window.RPG_BATTLE_STAGE.updateState({ heroHP: battleState.heroHP, heroShield: false });
        window.RPG_BATTLE_STAGE.triggerBossAttack(bossDmg, blocked);
      }
      const fb = document.getElementById("battle-turn-feedback");
      if (fb) {
        fb.innerHTML = `
          <div class="feedback-banner err">
            ⚜️ <strong>Target Expression:</strong> <strong>${escapeHtml(ch.targetFr)}</strong>
            <button class="btn btn-gold" style="margin-left:1rem;" onclick="window.nextBattleTurn()">Next Turn ➡️</button>
          </div>
        `;
      }
    }
  };

  window.nextBattleTurn = function () {
    battleState.currentChallenge = buildBattleChallenge();
    renderBattleDeckMount();
  };

  // =========================================================================
  // SCENE 5: LE CAFÉ DE PARIS — VISUAL NOVEL DIALOGUE ROLEPLAY (40 DIALOGUES)
  // =========================================================================
  let cafeDialogueIdx = 0;
  let cafeTurnIdx = 0;

  window.openCafeForLesson = function (lessonId) {
    const dialogues = DATA.exercises.filter(e => e.dialogueTurns && e.dialogueTurns.length > 0);
    const foundIdx = dialogues.findIndex(d => d.lessonId === lessonId);
    if (foundIdx !== -1) cafeDialogueIdx = foundIdx;
    cafeTurnIdx = 0;
    window.navigateScene("cafe");
  };

  function renderCafeVisualNovelScene(container) {
    const dialogues = DATA.exercises.filter(e => e.dialogueTurns && e.dialogueTurns.length > 0);
    const dlg = dialogues[cafeDialogueIdx] || dialogues[0];
    const turns = dlg.dialogueTurns || [];
    const turn = turns[cafeTurnIdx % Math.max(1, turns.length)] || { speaker: "Camille", fr: "Bonjour !", en: "Hello!", choices: ["Bonjour !"] };
    const safeFr = escapeHtml(turn.fr.replace(/'/g, "\\'"));

    container.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;margin-bottom:0.85rem;">
        <div>
          <h2 style="font-size:1.4rem;font-weight:900;">☕ Le Café de Paris — Interactive Conversational Roleplay Novel</h2>
          <p style="font-size:0.86rem;color:var(--text-muted);">Play through ${dialogues.length} French scenes, one line at a time. Pick your reply and keep the conversation going.</p>
        </div>
        <select class="btn" style="color:#fde047;font-weight:800;" onchange="window.selectCafeDialogue(Number(this.value))">
          ${dialogues.map((d, i) => `
            <option value="${i}" ${i === cafeDialogueIdx ? 'selected' : ''}>[${d.cefr} • ${d.lessonId}] ${escapeHtml(d.title)}</option>
          `).join("")}
        </select>
      </div>


      <div class="vn-cafe-stage">
        <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(6,10,25,0.82);padding:0.6rem 1.1rem;border-radius:12px;border:1px solid var(--border-gold);">
          <span style="font-weight:900;color:#fde047;">🎭 Scene: ${escapeHtml(dlg.title)} (${dlg.lessonId})</span>
          <span style="font-weight:800;color:#38bdf8;">Turn ${(cafeTurnIdx % turns.length) + 1} of ${turns.length}</span>
        </div>

        <div class="vn-dialogue-box">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.6rem;">
            <div style="display:flex;align-items:center;gap:0.65rem;">
              <span style="font-size:1.8rem;">${turn.speaker.toLowerCase().includes("camille") ? "⚜️" : "🧑"}</span>
              <div>
                <div style="font-weight:900;font-size:1.05rem;color:#fde047;">${escapeHtml(turn.speaker.toUpperCase())} ${turn.stageNote ? `<span style="font-size:0.8rem;color:#94a3b8;">(${escapeHtml(turn.stageNote)})</span>` : ""}</div>
                <div style="font-size:0.9rem;color:#cbd5e1;">🇬🇧 Meaning Cue: <em>"${escapeHtml(turn.en)}"</em></div>
              </div>
            </div>
            <div style="display:flex;gap:0.4rem;">
              <button class="btn btn-primary" onclick="window.speakFrench('${safeFr}', 1.0)">🔊 Studio (1x)</button>
              <button class="btn" style="color:#fde047;border-color:#fde047;" onclick="window.speakFrench('${safeFr}', 0.6)">🐢 Slow (0.6x)</button>
            </div>
          </div>

          <div style="font-size:0.82rem;color:var(--accent-blue);font-weight:800;margin-bottom:0.4rem;">Choose the authentic French line to speak:</div>
          <div class="mcq-grid">
            ${(turn.choices || [turn.fr]).map(ch => {
              const safeCh = escapeHtml(ch.replace(/'/g, "\\'"));
              return `
                <button class="mcq-opt" onclick="window.chooseCafeLine(this, '${safeCh}', '${safeFr}')">
                  💬 ${escapeHtml(ch)}
                </button>
              `;
            }).join("")}
          </div>
        </div>
      </div>
    `;
  }

  window.selectCafeDialogue = function (idx) {
    cafeDialogueIdx = idx;
    cafeTurnIdx = 0;
    renderCafeVisualNovelScene(document.getElementById("app-main"));
  };

  window.chooseCafeLine = function (btnEl, chosen, target) {
    speakFrench(target, 1.0);
    if (checkAnswerMatch(chosen, target)) {
      btnEl.classList.add("correct");
      save.stats.dialogueTurnsCompleted = (save.stats.dialogueTurnsCompleted || 0) + 1;
      addXP(25, 7);
      if (window.RPG_VFX) window.RPG_VFX.floatText("☕ +25 XP!", "#10b981");
      setTimeout(() => {
        cafeTurnIdx += 1;
        renderCafeVisualNovelScene(document.getElementById("app-main"));
      }, 650);
    } else {
      btnEl.classList.add("wrong");
      if (window.RPG_SFX) window.RPG_SFX.damageHit();
    }
  };

  // =========================================================================
  // SCENE 5B: VIE À PARIS — OPEN-WORLD 6-DISTRICT LIFE & REGISTER SIMULATOR
  // =========================================================================
  let activeParisDistrictIdx = 0;
  let activeParisStepIdx = 0;

  function renderParisDistrictSimScene(container) {
    const districts = window.PARIS_LIFE_DISTRICTS || [];
    if (!districts.length) {
      container.innerHTML = `<div class="arena-box">Loading Parisian Districts...</div>`;
      return;
    }
    const dist = districts[activeParisDistrictIdx % districts.length];
    const steps = dist.steps || [];
    const step = steps[activeParisStepIdx % Math.max(1, steps.length)];
    const safeNpcFr = escapeHtml((step.npcLineFr || "").replace(/'/g, "\\'"));
    const optimalChoice = (step.choices || []).find(c => c.isOptimal) || (step.choices || [])[0] || { fr: "Bonjour" };

    container.innerHTML = `
      <!-- Cinematic Open-World Paris Hub Banner -->
      <div class="arena-box" style="background:linear-gradient(135deg,rgba(6,10,25,0.78),rgba(15,23,42,0.92)), url('assets/bg_paris_hub.jpg') center/cover no-repeat;border:2px solid var(--border-gold);">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.85rem;">
          <div>
            <span class="badge-cefr badge-C2">🏙️ ROCKSTAR-STYLE OPEN-WORLD PARISIAN LIFE SIMULATOR</span>
            <h2 style="font-size:1.55rem;font-weight:900;color:#fff;margin-top:0.25rem;">
              Vie à Paris — Master All 3 Registers (Familier • Courant • Soutenu)
            </h2>
            <p style="font-size:0.88rem;color:#cbd5e1;max-width:760px;">
              Navigate real high-stakes Parisian encounters across 6 iconic arrondissements: Bastille street slang, CAF/Préfecture bureaucracy, Saint-Germain apartment hunting, Doctolib medical emergencies, Station F tech executive pitch, and the Sorbonne DALF C2 Grand Jury!
            </p>
          </div>
          <div style="background:rgba(2,6,23,0.88);border:1.5px solid #fde047;border-radius:14px;padding:0.75rem 1.1rem;text-align:center;">
            <div style="font-size:0.74rem;color:#fde047;font-weight:800;text-transform:uppercase;">Parisian Social Reputation</div>
            <div style="font-size:1.5rem;font-weight:900;color:#38bdf8;">⚜️ ${save.parisReputation || 100} PTS</div>
            <div style="font-size:0.75rem;color:#6ee7b7;">Districts Cleared: ${Object.keys(save.clearedDistricts || {}).length} / ${districts.length}</div>
          </div>
        </div>

        <!-- 6 District Cards -->
        <div class="paris-district-grid" style="margin-top:1rem;">
          ${districts.map((d, idx) => {
            const isCleared = !!(save.clearedDistricts && save.clearedDistricts[d.id]);
            const isAct = idx === activeParisDistrictIdx;
            return `
              <div class="paris-district-card ${isAct ? 'active' : ''}" onclick="window.selectParisDistrict(${idx})">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <span style="font-size:1.5rem;">${d.icon || '🏛️'}</span>
                  <span class="badge-cefr badge-${(d.cefrRange || 'B2').slice(-2)}">${escapeHtml(d.cefrRange || 'B1-C2')}</span>
                </div>
                <div style="font-weight:900;font-size:1rem;color:#fde047;">${escapeHtml(d.name)}</div>
                <div style="font-size:0.78rem;color:#38bdf8;font-weight:800;">📍 ${escapeHtml(d.arrondissement)}</div>
                <div style="font-size:0.78rem;color:#cbd5e1;">${escapeHtml(d.vibe)}</div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:0.25rem;font-size:0.75rem;">
                  <span style="color:#fbbf24;">🎯 ${escapeHtml(d.targetRegister)}</span>
                  <span>${isCleared ? '✅ Cleared' : `<span class="fit-badge fit-${levelFit(d.cefrRange).tag}">${levelFit(d.cefrRange).label}</span>`}</span>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>

      <!-- Active Encounter Stage -->
      <div class="arena-box" style="border:2px solid rgba(56,189,248,0.45);">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;margin-bottom:0.85rem;">
          <div>
            <span style="font-size:0.8rem;color:#fde047;font-weight:800;text-transform:uppercase;">
              ${dist.icon} ${escapeHtml(dist.name)} (${escapeHtml(dist.arrondissement)}) • Step ${(activeParisStepIdx % steps.length) + 1} of ${steps.length}
            </span>
            <h3 style="font-size:1.25rem;font-weight:900;color:#fff;margin-top:0.2rem;">
              🎬 Situation: ${escapeHtml(step.situation)}
            </h3>
          </div>
          <div style="display:flex;gap:0.45rem;align-items:center;">
            <span class="register-badge reg-${(step.requiredRegister || 'Courant').split('/')[0].trim()}">
              Required Register: ${escapeHtml(step.requiredRegister)}
            </span>
          </div>
        </div>

        <!-- NPC Speech Card -->
        <div class="teaching-slide-card" style="margin-bottom:1rem;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:0.75rem;">
            <div style="display:flex;gap:0.75rem;align-items:center;">
              <div style="font-size:2.3rem;background:rgba(15,23,42,0.9);padding:0.5rem 0.75rem;border-radius:14px;border:1px solid var(--border-gold);">
                ${dist.npc ? dist.npc.avatar : '🧑'}
              </div>
              <div>
                <div style="font-weight:900;font-size:1.05rem;color:#fde047;">
                  ${escapeHtml(dist.npc ? dist.npc.name : 'Interlocuteur')} — <span style="color:#38bdf8;">${escapeHtml(dist.npc ? dist.npc.role : '')}</span>
                </div>
                <div style="font-size:0.78rem;color:#94a3b8;">Personality: ${escapeHtml(dist.npc ? dist.npc.personality : '')}</div>
              </div>
            </div>
            <div style="display:flex;gap:0.45rem;">
              <button class="btn btn-gold" onclick="window.speakFrench('${safeNpcFr}', 1.0)">🔊 Listen Native (1.0x)</button>
              <button class="btn" style="color:#fde047;border-color:#fde047;" onclick="window.speakFrench('${safeNpcFr}', 0.6)">🐢 Slow (0.6x)</button>
            </div>
          </div>

          <div style="font-size:1.28rem;font-weight:900;color:#38bdf8;margin:0.75rem 0 0.35rem;cursor:pointer;" onclick="window.speakFrench('${safeNpcFr}', 1.0)">
            🇫🇷 "${escapeHtml(step.npcLineFr)}"
          </div>
          <div style="font-size:0.92rem;color:#cbd5e1;">
            🇬🇧 <em>"${escapeHtml(step.npcLineEn)}"</em>
          </div>
        </div>

        <!-- 3-Register Response Options -->
        <div style="font-size:0.86rem;font-weight:800;color:#fde047;margin-bottom:0.55rem;">
          🗣️ Choose the sociolinguistically appropriate French register for this situation:
        </div>
        <div style="display:grid;grid-template-columns:1fr;gap:0.65rem;margin-bottom:1rem;">
          ${(step.choices || []).map((ch, cIdx) => {
            const safeChFr = escapeHtml(ch.fr.replace(/'/g, "\\'"));
            const regClass = (ch.register || "Courant").split("/")[0].trim();
            return `
              <div class="teaching-slide-card" style="padding:0.9rem 1.1rem;cursor:pointer;border:1.5px solid rgba(148,163,184,0.28);"
                   onclick="window.chooseParisDistrictOption(${cIdx}, '${safeChFr}')">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.3rem;">
                  <span class="register-badge reg-${regClass}">🎭 Register: ${escapeHtml(ch.register)}</span>
                  <button class="btn" style="padding:0.2rem 0.55rem;font-size:0.74rem;" onclick="event.stopPropagation();window.speakFrench('${safeChFr}', 1.0)">🔊 Preview Audio</button>
                </div>
                <div style="font-size:1.08rem;font-weight:800;color:#fff;">🇫🇷 "${escapeHtml(ch.fr)}"</div>
                <div style="font-size:0.84rem;color:#94a3b8;margin-top:0.15rem;">🇬🇧 ${escapeHtml(ch.en)}</div>
              </div>
            `;
          }).join("")}
        </div>

        <div id="paris-sim-feedback" style="margin-bottom:0.85rem;"></div>

        <!-- Active Shadowing / Typing Production of the Optimal Native Line -->
        ${renderDualModeProductionDeck("paris_prod", optimalChoice.fr, "window.submitParisTypedLine()", "✍️ Active Native Shadowing — Type or Assemble the Optimal Parisian Response for +30 Bonus XP:")}
      </div>
    `;
  }

  window.selectParisDistrict = function (idx) {
    activeParisDistrictIdx = idx;
    activeParisStepIdx = 0;
    renderParisDistrictSimScene(document.getElementById("app-main"));
  };

  window.chooseParisDistrictOption = function (choiceIdx, safeFr) {
    const districts = window.PARIS_LIFE_DISTRICTS || [];
    const dist = districts[activeParisDistrictIdx % districts.length];
    const steps = dist.steps || [];
    const step = steps[activeParisStepIdx % steps.length];
    const ch = (step.choices || [])[choiceIdx];
    if (!ch) return;

    speakFrench(ch.fr, 1.0);
    // Reputation/XP only change on the FIRST answer of each step, so picks can't be farmed.
    save.parisAnswered = save.parisAnswered || {};
    const stepKey = `${dist.id}_${activeParisStepIdx}`;
    const firstTry = !save.parisAnswered[stepKey];
    if (firstTry) {
      save.parisAnswered[stepKey] = ch.isOptimal ? "optimal" : "miss";
      save.parisReputation = Math.max(0, (save.parisReputation || 100) + (ch.reputationDelta || 0));
    } else if (ch.isOptimal && save.parisAnswered[stepKey] === "miss") {
      save.parisAnswered[stepKey] = "recovered";
    }
    const fb = document.getElementById("paris-sim-feedback");

    window.recordLearningOutcome(`paris_${dist.id}_${activeParisStepIdx}`, ch.fr, ch.en, !!ch.isOptimal, "register_pragmatics", "C1");

    if (ch.isOptimal) {
      if (window.RPG_SFX) window.RPG_SFX.victoryFanfare();
      if (firstTry) addXP(45, 15);
      if (fb) {
        fb.innerHTML = `
          <div class="feedback-banner ok">
            🌟 <strong>Optimal ${escapeHtml(ch.register)} Register! (+${ch.reputationDelta || 25} Reputation)</strong><br>
            ${escapeHtml(ch.feedback)}
            <div style="margin-top:0.55rem;">
              <button class="btn btn-gold" onclick="window.advanceParisDistrictStep()">Continue Parisian Encounter ➡️</button>
            </div>
          </div>
        `;
      }
    } else {
      if (window.RPG_SFX) window.RPG_SFX.damageHit();
      if (fb) {
        fb.innerHTML = `
          <div class="feedback-banner err">
            ⚠️ <strong>Sociolinguistic Register Faux-Pas (${ch.reputationDelta || -10} Reputation):</strong><br>
            ${escapeHtml(ch.feedback)}
          </div>
        `;
      }
    }
    persistSave();
  };

  window.submitParisTypedLine = function () {
    const districts = window.PARIS_LIFE_DISTRICTS || [];
    const dist = districts[activeParisDistrictIdx % districts.length];
    const step = (dist.steps || [])[activeParisStepIdx % dist.steps.length];
    const optimalChoice = (step.choices || []).find(c => c.isOptimal) || step.choices[0];
    const inp = document.getElementById("paris_prod-input");
    const val = inp ? inp.value.trim() : "";
    if (!val) return;
    const evalRes = evaluateFrenchProduction(val, optimalChoice.fr);
    const fb = document.getElementById("paris-sim-feedback");
    speakFrench(optimalChoice.fr, 1.0);
    if (evalRes.passed) {
      addXP(30, 10);
      if (fb) {
        fb.innerHTML = `<div class="feedback-banner ok">${evalRes.message} — ${evalRes.diffHtml} <button class="btn btn-gold" style="margin-left:0.75rem;" onclick="window.advanceParisDistrictStep()">Next Encounter Step ➡️</button></div>`;
      }
    } else if (fb) {
      fb.innerHTML = `<div class="feedback-banner err">${evalRes.message}: ${evalRes.diffHtml}</div>`;
    }
  };

  window.advanceParisDistrictStep = function () {
    const districts = window.PARIS_LIFE_DISTRICTS || [];
    const dist = districts[activeParisDistrictIdx % districts.length];
    const steps = dist.steps || [];
    if (activeParisStepIdx + 1 >= steps.length) {
      save.clearedDistricts = save.clearedDistricts || {};
      const firstClear = !save.clearedDistricts[dist.id];
      save.clearedDistricts[dist.id] = true;
      if (firstClear) addXP(120, 35);
      if (window.RPG_VFX) {
        window.RPG_VFX.toast(`${dist.name} ${firstClear ? "Mastered!" : "Replayed"}`, firstClear ? `+120 XP & +35 Gold!` : `Replays sharpen your register reflexes.`, "🏙️");
      }
      activeParisStepIdx = 0;
    } else {
      activeParisStepIdx += 1;
    }
    persistSave();
    renderParisDistrictSimScene(document.getElementById("app-main"));
  };

  // =========================================================================
  // SCENE 5C: L'ATELIER D'ÉCRITURE & DALF C2 WRITING SIMULATOR (12 MISSIONS)
  // =========================================================================
  let activeWritingMissionIdx = 0;
  let writingAutoPicked = false;

  function renderWritingStudioScene(container) {
    const missions = window.WRITING_MISSIONS || [];
    const rubric = window.C2_RUBRIC_MARKERS || { metrics: [], registerUpgrades: [] };
    if (!missions.length) {
      container.innerHTML = `<div class="arena-box">Loading Writing Studio...</div>`;
      return;
    }
    if (!writingAutoPicked) {
      writingAutoPicked = true;
      const myRank = cefrRank(campaignCefr());
      const fitIdx = missions.findIndex(wm => cefrRank(wm.cefr) <= myRank && !(save.completedWritings || {})[wm.id]);
      if (fitIdx >= 0) activeWritingMissionIdx = fitIdx;
    }
    const m = missions[activeWritingMissionIdx % missions.length];
    const safeModelFr = escapeHtml((m.nativeModelText ? m.nativeModelText.fr : "").replace(/'/g, "\\'"));

    container.innerHTML = `
      <!-- Sorbonne Grand Amphithéâtre Header Banner -->
      <div class="arena-box" style="background:linear-gradient(135deg,rgba(6,10,25,0.82),rgba(15,23,42,0.94)), url('assets/bg_sorbonne_c2.jpg') center/cover no-repeat;border:2px solid var(--border-gold);">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.85rem;">
          <div>
            <span class="badge-cefr badge-${m.cefr}">✍️ L'ATELIER D'ÉCRITURE &amp; SORBONNE DALF C2 WRITING STUDIO</span>
            <h2 style="font-size:1.5rem;font-weight:900;color:#fff;margin-top:0.25rem;">
              Progressive French Composition Engine (A1 Daily Messages → DALF C2 Synthèse &amp; Essai Argumenté)
            </h2>
            <p style="font-size:0.86rem;color:#cbd5e1;max-width:760px;">
              Build authentic French texts step-by-step using Guided Sentence Builders or write freely with the French Accent Bar, then run the <strong>12-Metric Automated Sorbonne C2 Rubric Grader</strong>!
            </p>
          </div>
          <select class="btn" style="color:#fde047;font-weight:800;" onchange="window.selectWritingMission(Number(this.value))">
            ${missions.map((wm, idx) => `
              <option value="${idx}" ${idx === activeWritingMissionIdx ? 'selected' : ''}>
                ${levelFit(wm.cefr).tag === "locked" ? "🔒 " : levelFit(wm.cefr).tag === "stretch" ? "🟡 " : "✅ "}[${wm.cefr}] ${idx + 1}. ${escapeHtml(wm.title)} ${save.completedWritings && save.completedWritings[wm.id] ? '✅' : ''}
              </option>
            `).join("")}
          </select>
        </div>
      </div>

      <!-- Mission Prompt & Required Connectors -->
      <div class="arena-box">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.65rem;">
          <div>
            <span class="badge-cefr badge-${m.cefr}">${escapeHtml(m.cefr)} • ${escapeHtml(m.category)}</span>
            <span style="font-size:0.82rem;color:#38bdf8;font-weight:800;margin-left:0.5rem;">📍 ${escapeHtml(m.location)}</span>
          </div>
          <span style="font-size:0.8rem;color:#6ee7b7;font-weight:800;">
            Completed Writings: ${Object.keys(save.completedWritings || {}).length} / ${missions.length}
          </span>
        </div>

        <h3 style="font-size:1.3rem;font-weight:900;color:#fde047;margin-bottom:0.35rem;">${escapeHtml(m.title)}</h3>
        <p style="font-size:0.88rem;color:#cbd5e1;margin-bottom:0.5rem;"><strong>Context:</strong> ${escapeHtml(m.context)}</p>
        <div style="background:rgba(15,23,42,0.9);border:1px solid rgba(250,204,21,0.35);border-radius:12px;padding:0.85rem 1rem;margin-bottom:0.9rem;">
          <div style="font-size:0.78rem;color:#fde047;font-weight:800;text-transform:uppercase;">📜 Writing Prompt (Consigne):</div>
          <div style="font-size:0.96rem;color:#fff;font-weight:700;margin-top:0.2rem;">${escapeHtml(m.prompt)}</div>
        </div>

        <!-- Target Key Expressions -->
        <div style="font-size:0.8rem;color:#fde047;font-weight:800;margin-bottom:0.4rem;">🔑 Target High-Register Expressions &amp; Connectors (Click to insert &amp; hear):</div>
        <div style="display:flex;gap:0.45rem;flex-wrap:wrap;margin-bottom:1rem;">
          ${(m.requiredKeywords || []).map(kw => {
            const safeKw = escapeHtml(kw.fr.replace(/'/g, "\\'"));
            return `
              <button class="btn" style="font-size:0.8rem;padding:0.35rem 0.7rem;"
                      onclick="window.insertWritingSnippet('${safeKw} ');window.speakFrench('${safeKw}', 1.0)">
                ✨ <strong>${escapeHtml(kw.fr)}</strong> <span style="color:#94a3b8;">(${escapeHtml(kw.en)})</span>
              </button>
            `;
          }).join("")}
        </div>

        <!-- Guided Sentence-by-Sentence Builder -->
        <div style="font-size:0.82rem;color:#38bdf8;font-weight:800;margin-bottom:0.45rem;">
          🧱 Guided Sentence-by-Sentence Architecture (Click any step to append to your draft &amp; hear Studio French):
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:0.6rem;margin-bottom:1rem;">
          ${(m.sentenceBuilders || []).map(sb => {
            const safeSbFr = escapeHtml(sb.fr.replace(/'/g, "\\'"));
            return `
              <div class="teaching-slide-card" style="padding:0.75rem 0.9rem;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.25rem;">
                  <span style="font-size:0.75rem;color:#fde047;font-weight:800;">Step ${sb.step}: ${escapeHtml(sb.goal)}</span>
                  <button class="btn btn-gold" style="padding:0.2rem 0.55rem;font-size:0.72rem;"
                          onclick="window.insertWritingSnippet('${safeSbFr} ');window.speakFrench('${safeSbFr}', 1.0)">
                    ➕ Insert &amp; Listen
                  </button>
                </div>
                <div style="font-size:0.9rem;font-weight:800;color:#fff;">🇫🇷 ${escapeHtml(sb.fr)}</div>
                <div style="font-size:0.78rem;color:#94a3b8;margin-top:0.15rem;">🇬🇧 ${escapeHtml(sb.en)}</div>
              </div>
            `;
          }).join("")}
        </div>

        <!-- Live French Textarea + Accent Bar -->
        <div class="accent-bar" style="margin-bottom:0.5rem;">
          <span style="font-size:0.75rem;color:#fde047;font-weight:800;align-self:center;margin-right:0.35rem;">Accents:</span>
          ${FRENCH_ACCENTS.map(ch => `
            <button type="button" class="accent-key" onclick="window.insertFrenchAccent('writing-studio-textarea', '${ch}')">${ch}</button>
          `).join("")}
        </div>
        <textarea id="writing-studio-textarea" class="textarea-french"
                  placeholder="Rédigez votre texte en français ici (or click the Guided Sentence Builders above to assemble your draft)..."></textarea>

        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.65rem;margin-top:0.75rem;">
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
            <button class="btn btn-gold" style="padding:0.75rem 1.35rem;" onclick="window.gradeWritingSubmission()">
              🎓 Check My C1/C2 Structures
            </button>
            <button class="btn btn-primary" onclick="window.loadModelIntoEditor()">
              ✨ Load Native C2 Model Into Editor
            </button>
            <button class="btn" onclick="const t=document.getElementById('writing-studio-textarea');if(t&&t.value)window.speakFrench(t.value, 1.0)">
              🔊 Read My Draft Aloud
            </button>
          </div>
          <button class="btn" onclick="const el=document.getElementById('writing-model-box');if(el)el.style.display=el.style.display==='none'?'block':'none';">
            📖 Toggle Native C2 Model Text
          </button>
        </div>

        <!-- Automated 12-Metric Grader Output -->
        <div id="writing-grader-output" style="margin-top:1rem;"></div>

        <!-- Native C2 Model Reference -->
        <div id="writing-model-box" style="display:none;margin-top:1rem;" class="teaching-slide-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;">
            <span style="font-size:0.82rem;color:#fde047;font-weight:900;">👑 Sorbonne Native C2 Model Text (Corrigé Modèle):</span>
            <div style="display:flex;gap:0.4rem;">
              <button class="btn btn-gold" style="padding:0.3rem 0.7rem;font-size:0.76rem;" onclick="window.speakWritingModel(1.0)">🔊 Listen Native Model (1x)</button>
              <button class="btn" style="padding:0.3rem 0.7rem;font-size:0.76rem;color:#fde047;" onclick="window.speakWritingModel(0.6)">🐢 Slow (0.6x)</button>
            </div>
          </div>
          <div style="font-size:1rem;font-weight:800;color:#38bdf8;line-height:1.55;">🇫🇷 ${escapeHtml(m.nativeModelText ? m.nativeModelText.fr : "")}</div>
          <div style="font-size:0.86rem;color:#cbd5e1;margin-top:0.4rem;">🇬🇧 ${escapeHtml(m.nativeModelText ? m.nativeModelText.en : "")}</div>
        </div>
      </div>

      <!-- C2 Register Upgrader Reference Table -->
      <div class="arena-box">
        <h3 style="font-size:1.15rem;font-weight:900;color:#fde047;margin-bottom:0.5rem;">⚜️ B1→C2 Stylistic Register Upgrader (Registre Soutenu &amp; Académique)</h3>
        <div class="rubric-metric-grid">
          ${(rubric.registerUpgrades || []).slice(0, 8).map(ru => {
            const safeUp = escapeHtml(ru.c2Upgrade.replace(/'/g, "\\'"));
            return `
              <div class="rubric-metric-card" style="cursor:pointer;" onclick="window.speakFrench('${safeUp}', 1.0)">
                <div style="font-size:0.76rem;color:#fca5a5;text-decoration:line-through;">❌ Basic: ${escapeHtml(ru.basic)}</div>
                <div style="font-size:0.95rem;font-weight:900;color:#6ee7b7;margin-top:0.15rem;">✅ C2: 🔊 ${escapeHtml(ru.c2Upgrade)}</div>
                <div style="font-size:0.75rem;color:#cbd5e1;margin-top:0.15rem;">💡 ${escapeHtml(ru.note)}</div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  window.selectWritingMission = function (idx) {
    writingAutoPicked = true;
    activeWritingMissionIdx = idx;
    renderWritingStudioScene(document.getElementById("app-main"));
  };

  window.insertWritingSnippet = function (snippet) {
    const ta = document.getElementById("writing-studio-textarea");
    if (!ta) return;
    ta.value = (ta.value ? ta.value.trimEnd() + " " : "") + snippet;
    ta.focus();
  };

  window.loadModelIntoEditor = function () {
    const missions = window.WRITING_MISSIONS || [];
    const m = missions[activeWritingMissionIdx % missions.length];
    const ta = document.getElementById("writing-studio-textarea");
    if (ta && m && m.nativeModelText) {
      ta.value = m.nativeModelText.fr;
    }
  };

  window.speakWritingModel = function (rate) {
    const missions = window.WRITING_MISSIONS || [];
    const m = missions[activeWritingMissionIdx % missions.length];
    if (m && m.nativeModelText) speakFrench(m.nativeModelText.fr, rate || 1.0);
  };

  // Share of the player's text that was pasted from the model / guided builders.
  // Used so the checklist rewards writing your own French, not copying.
  function borrowedTextRatio(text, mission) {
    const norm = s => normPreserveAccents(s).replace(/\s+/g, " ").trim();
    let remaining = norm(text);
    const total = remaining.length || 1;
    const sources = [];
    if (mission.nativeModelText && mission.nativeModelText.fr) {
      sources.push(...mission.nativeModelText.fr.split(/(?<=[.!?…])\s+/));
    }
    (mission.sentenceBuilders || []).forEach(sb => sources.push(sb.fr));
    sources.map(norm).filter(s => s.length > 12).forEach(s => {
      remaining = remaining.split(s).join(" ");
    });
    const leftover = remaining.replace(/\s+/g, " ").trim().length;
    return Math.max(0, Math.min(1, 1 - leftover / total));
  }

  window.gradeWritingSubmission = function () {
    const missions = window.WRITING_MISSIONS || [];
    const m = missions[activeWritingMissionIdx % missions.length];
    const rubric = window.C2_RUBRIC_MARKERS || { metrics: [], registerUpgrades: [] };
    const ta = document.getElementById("writing-studio-textarea");
    const out = document.getElementById("writing-grader-output");
    if (!ta || !out) return;

    const text = ta.value.trim();
    if (!text) {
      out.innerHTML = `<div class="feedback-banner err">⚠️ Please write or insert at least one French sentence before running the C2 Rubric Grader!</div>`;
      return;
    }

    const lowerText = normPreserveAccents(text);
    const words = lowerText.split(/\s+/).filter(Boolean);
    const matchedKeywords = (m.requiredKeywords || []).filter(kw => lowerText.includes(normPreserveAccents(kw.fr)));

    let totalWeightedScore = 0;
    let totalWeight = 0;
    const metricResults = (rubric.metrics || []).map(metric => {
      const weight = metric.weight || 8;
      totalWeight += weight;
      const hits = (metric.markers || []).filter(mk => lowerText.includes(normPreserveAccents(mk)));
      const hitRatio = hits.length > 0 ? Math.min(1, 0.65 + hits.length * 0.2) : (words.length >= 25 ? 0.55 : 0.35);
      const pts = Math.round(weight * hitRatio * 10) / 10;
      totalWeightedScore += pts;
      return { metric, hits, pts, weight, hit: hits.length > 0 };
    });

    const keywordBonus = m.requiredKeywords && m.requiredKeywords.length
      ? Math.round((matchedKeywords.length / m.requiredKeywords.length) * 15)
      : 10;
    const finalPct = Math.min(100, Math.round(((totalWeightedScore / Math.max(1, totalWeight)) * 85) + keywordBonus));
    const estimatedCefr = finalPct >= 88 ? "C2-style structures" : finalPct >= 76 ? "C1-style structures" : finalPct >= 62 ? "B2-style structures" : "B1-style structures";

    // Anti-copy + anti-farm: XP only for your OWN words, and only when you beat your best.
    const borrowed = borrowedTextRatio(text, m);
    const ownWords = Math.round(words.length * (1 - borrowed));
    const isPractice = borrowed >= 0.6 || ownWords < 20;
    save.completedWritings = save.completedWritings || {};
    const prevBest = save.completedWritings[m.id] || 0;
    let xpNote = "";
    if (isPractice) {
      xpNote = `📋 Practice mode: ${Math.round(borrowed * 100)}% of this text comes from the model or the guided builders (${ownWords} words of your own). Write at least 20 words of your own to earn XP and record a score.`;
    } else if (finalPct > prevBest) {
      save.completedWritings[m.id] = finalPct;
      const gain = Math.max(20, Math.round((finalPct - prevBest) * 1.5));
      addXP(gain, Math.round(gain / 3));
      if (window.RPG_SFX) window.RPG_SFX.victoryFanfare();
      xpNote = `🏅 New personal best (${prevBest} → ${finalPct}). +${gain} XP`;
    } else {
      xpNote = `Your best on this mission is still ${prevBest}. Rewrite it with more of the target structures to beat it.`;
    }
    persistSave();

    out.innerHTML = `
      <div class="teaching-slide-card" style="border:2px solid #fde047;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;margin-bottom:0.85rem;">
          <div>
            <span class="badge-cefr badge-C2">🎓 C1/C2 STRUCTURE CHECKLIST (AUTOMATIC)</span>
            <h4 style="font-size:1.35rem;font-weight:900;color:#fde047;margin-top:0.2rem;">
              Score: ${finalPct} / 100 — <span style="color:#38bdf8;">${estimatedCefr}</span>
            </h4>
          </div>
          <div style="font-size:0.85rem;color:#6ee7b7;font-weight:800;">
            Word Count: ${words.length} words • Mission Keywords Used: ${matchedKeywords.length} / ${(m.requiredKeywords || []).length}
          </div>
        </div>
        <div class="feedback-banner ${isPractice ? 'err' : 'ok'}" style="margin-bottom:0.75rem;">${escapeHtml(xpNote)}</div>
        <div style="font-size:0.78rem;color:#94a3b8;margin-bottom:0.75rem;">
          ⚠️ How this works: the checklist finds C1/C2 structures (connectors, subjunctive triggers, inversion, nominalisation…). It <strong>cannot</strong> check grammar, agreement, or how strong your argument is. Before the real DALF, have a teacher or tutor correct a few of your essays.
        </div>

        <div class="rubric-metric-grid">
          ${metricResults.map(r => `
            <div class="rubric-metric-card ${r.hit ? 'hit' : ''}">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="font-weight:900;font-size:0.86rem;color:#fde047;">#${r.metric.number} ${escapeHtml(r.metric.name)}</span>
                <span style="font-size:0.78rem;font-weight:900;color:${r.hit ? '#6ee7b7' : '#fbbf24'};">${r.pts} / ${r.weight} pts</span>
              </div>
              <div style="font-size:0.76rem;color:#cbd5e1;margin-top:0.2rem;">
                ${r.hit ? `✅ Detected: <strong>${escapeHtml(r.hits.join(", "))}</strong>` : `💡 Tip: ${escapeHtml(r.metric.upgradeTip)}`}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  };

  // =========================================================================
  // SCENE 5D: GRIMOIRE DES ERREURS & FSRS-5 MEMORY ENGINE + <3s REFLEX BLITZ
  // =========================================================================
  let grimoireCursor = 0;

  function renderGrimoireScene(container) {
    const mistakes = Array.isArray(save.mistakeVault)
      ? save.mistakeVault
      : Object.values(save.mistakeVault || {});
    const fsrsEntries = Object.values(save.fsrsCards || {});
    const now = Date.now();
    const dueEntries = fsrsEntries.filter(e => (e.due || 0) <= now);
    const activeTarget = grimoireTarget();

    const safeTargetFr = escapeHtml((activeTarget.fr || "").replace(/'/g, "\\'"));

    container.innerHTML = `
      <div class="arena-box" style="border:2px solid var(--border-gold);">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.85rem;margin-bottom:0.85rem;">
          <div>
            <span class="badge-cefr badge-C2">📕 GRIMOIRE: YOUR REVIEW DECK</span>
            <h2 style="font-size:1.45rem;font-weight:900;color:#fff;margin-top:0.25rem;">
              Your mistakes &amp; reviews
            </h2>
            <p style="font-size:0.86rem;color:var(--text-muted);">
              Every mistake you make comes here automatically. Each phrase comes back at the right moment (spaced repetition) until you get it right twice. Tip: Camille's warm-up review explains them one by one.
            </p>
          </div>
          <div style="display:flex;gap:0.65rem;flex-wrap:wrap;">
            <div style="background:rgba(15,23,42,0.9);border:1px solid #f43f5e;border-radius:12px;padding:0.55rem 0.9rem;text-align:center;">
              <div style="font-size:0.72rem;color:#fda4af;font-weight:800;">ACTIVE MISTAKES</div>
              <div style="font-size:1.3rem;font-weight:900;color:#fff;">${mistakes.length}</div>
            </div>
            <div style="background:rgba(15,23,42,0.9);border:1px solid #38bdf8;border-radius:12px;padding:0.55rem 0.9rem;text-align:center;">
              <div style="font-size:0.72rem;color:#38bdf8;font-weight:800;">FSRS TRACKED CARDS</div>
              <div style="font-size:1.3rem;font-weight:900;color:#fff;">${fsrsEntries.length}</div>
            </div>
            <div style="background:rgba(15,23,42,0.9);border:1px solid #10b981;border-radius:12px;padding:0.55rem 0.9rem;text-align:center;">
              <div style="font-size:0.72rem;color:#6ee7b7;font-weight:800;">DUE NOW</div>
              <div style="font-size:1.3rem;font-weight:900;color:#fff;">${dueEntries.length}</div>
            </div>
          </div>
        </div>

        <!-- <3s Réflexe Natif Drill Box -->
        <div class="teaching-slide-card" style="margin-bottom:1rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.8rem;color:#fde047;font-weight:800;">
            <span>⚡ Say it in French (bonus if you answer in under 3 seconds):</span>
            <span id="reflex-timer-label">3.0s</span>
          </div>
          <div class="reflex-timer-bar" style="margin-top:0.35rem;">
            <div id="reflex-timer-fill" class="reflex-timer-fill" style="width:100%;"></div>
          </div>

          <div style="font-size:0.82rem;color:#38bdf8;font-weight:800;margin-top:0.4rem;">Produce the exact French expression for:</div>
          <div style="font-size:1.4rem;font-weight:900;color:#fff;margin:0.3rem 0 0.75rem;">
            🇬🇧 "${escapeHtml(activeTarget.en || 'Express this in French')}"
          </div>

          ${renderDualModeProductionDeck("grimoire_prod", activeTarget.fr, "window.submitGrimoireRecall()", "✍️ Type it, or tap the word tiles:")}
          <div id="grimoire-feedback" style="margin-top:0.65rem;"></div>

          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:0.65rem;">
            <button class="btn btn-primary" onclick="window.speakFrench('${safeTargetFr}', 1.0)">🔊 Listen Studio French (1x)</button>
            <button class="btn" style="color:#fde047;" onclick="window.speakFrench('${safeTargetFr}', 0.6)">🐢 Slow (0.6x)</button>
            <button class="btn" onclick="window.nextGrimoireCard()">⏭️ Next FSRS Card</button>
          </div>
        </div>

        <!-- Mistake Vault Table -->
        <h3 style="font-size:1.15rem;font-weight:900;color:#fde047;margin-bottom:0.5rem;">
          📕 Logged Orthography, Accent &amp; Grammar Slips (${mistakes.length} Items)
        </h3>
        ${mistakes.length === 0 ? `
          <div class="feedback-banner ok">
            ✨ Your Grimoire des Erreurs is currently spotless! Any mistake you make in Dictée Royale, La Forge, or Stage Duels will automatically appear here for targeted FSRS-5 mastery.
          </div>
        ` : `
          <div class="grid-cards">
            ${mistakes.slice(0, 12).map((m, idx) => {
              const sf = escapeHtml((m.fr || "").replace(/'/g, "\\'"));
              return `
                <div class="card">
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span class="badge-cefr badge-${m.cefr || 'B1'}">${escapeHtml(m.category || 'orthography')}</span>
                    <span style="font-size:0.75rem;color:#fda4af;font-weight:800;">Slips: ${m.count || 1}</span>
                  </div>
                  <div style="font-size:1.05rem;font-weight:900;color:#38bdf8;cursor:pointer;" onclick="window.speakFrench('${sf}', 1.0)">
                    🇫🇷 🔊 ${escapeHtml(m.fr)}
                  </div>
                  <div style="font-size:0.86rem;color:#cbd5e1;">🇬🇧 ${escapeHtml(m.en)}</div>
                  <button class="btn btn-gold" style="padding:0.35rem 0.7rem;font-size:0.76rem;" onclick="window.practiceMistakeAt(${idx})">
                    ⚔️ Drill &amp; Vanquish Now
                  </button>
                </div>
              `;
            }).join("")}
          </div>
        `}
      </div>
    `;

    startReflexTimer(3000);
  }

  window.practiceMistakeAt = function (idx) {
    grimoireCursor = idx;
    renderGrimoireScene(document.getElementById("app-main"));
  };

  window.nextGrimoireCard = function () {
    grimoireCursor += 1;
    renderGrimoireScene(document.getElementById("app-main"));
  };

  // The card shown and the card graded are always the same one.
  function grimoireTarget() {
    const usable = (e) => e && e.fr && e.en && String(e.en).trim().length > 1;
    const mistakes = (Array.isArray(save.mistakeVault) ? save.mistakeVault : Object.values(save.mistakeVault || {})).filter(usable);
    const now = Date.now();
    const due = Object.entries(save.fsrsCards || {}).filter(([k, e]) => usable(e) && (e.due || 0) <= now).map(([k, e]) => Object.assign({ id: k }, e));
    if (mistakes.length) return mistakes[grimoireCursor % mistakes.length];
    if (due.length) return due[grimoireCursor % due.length];
    const myRank = cefrRank(campaignCefr());
    const pool = (DATA.flashcards || []).filter(c => usable(c) && cefrRank(c.cefr || "A1") <= myRank && String(c.fr).length <= 70);
    const cleared = ALL_STAGES.filter(st => save.clearedStages[st.stageId]).flatMap(st => (st.cards || []).filter(usable));
    const src = cleared.length >= 5 ? cleared : pool;
    return src.length ? src[(grimoireCursor * 17) % src.length] : { fr: "Bonjour", en: "Hello", cefr: "A1" };
  }

  window.submitGrimoireRecall = function () {
    const activeTarget = grimoireTarget();
    if (!activeTarget) return;

    const inp = document.getElementById("grimoire_prod-input");
    const val = inp ? inp.value.trim() : "";
    if (!val) return;

    const elapsed = stopReflexTimer();
    const evalRes = evaluateFrenchProduction(val, activeTarget.fr);
    const fb = document.getElementById("grimoire-feedback");
    speakFrench(activeTarget.fr, 1.0);

    window.recordLearningOutcome(
      activeTarget.id || `grim_${grimoireCursor}`,
      activeTarget.fr,
      activeTarget.en,
      evalRes.passed,
      "grimoire_recall",
      activeTarget.cefr || "B2"
    );

    if (evalRes.passed) {
      addXP(elapsed < 3000 ? 50 : 30, 12);
      if (window.RPG_SFX) window.RPG_SFX.victoryFanfare();
      if (fb) {
        fb.innerHTML = `<div class="feedback-banner ok">${evalRes.message} (${(elapsed / 1000).toFixed(1)}s) — ${evalRes.diffHtml} <button class="btn btn-gold" style="margin-left:0.75rem;" onclick="window.nextGrimoireCard()">Next Card ➡️</button></div>`;
      }
    } else {
      if (window.RPG_SFX) window.RPG_SFX.damageHit();
      if (fb) {
        fb.innerHTML = `<div class="feedback-banner err">${evalRes.message}: ${evalRes.diffHtml}<br>Target: <strong>${escapeHtml(activeTarget.fr)}</strong></div>`;
      }
    }
  };

  // =========================================================================
  // SCENE 5E: LE SALON — AI CONVERSATION PARTNER  +  SCENE 5F: RADIO PARIS
  // Real conversation and real French audio, inside the game. The AI runs
  // through play_server.py (localhost) so the API key never reaches the page.
  // =========================================================================
  const IS_LOCAL_SERVER = /^(127\.0\.0\.1|localhost)$/.test(location.hostname) || location.port === "8765";
  const SERVER = { checked: false, online: !IS_LOCAL_SERVER && /^https?:$/.test(location.protocol), ai: !IS_LOCAL_SERVER && /^https?:$/.test(location.protocol), cloudPwa: !IS_LOCAL_SERVER && /^https?:$/.test(location.protocol) };

  async function checkServer() {
    if (location.protocol === "file:") {
      SERVER.checked = true;
      return SERVER;
    }
    if (!IS_LOCAL_SERVER) {
      SERVER.online = true;
      SERVER.ai = true;
      SERVER.cloudPwa = true;
      SERVER.checked = true;
      return SERVER;
    }
    try {
      const r = await fetch("/api/status", { cache: "no-store" });
      const j = await r.json();
      SERVER.online = !!j.server;
      SERVER.ai = !!j.ai;
      SERVER.cloudPwa = false;
    } catch (e) {
      SERVER.online = true;
      SERVER.ai = true;
      SERVER.cloudPwa = true;
    }
    SERVER.checked = true;
    return SERVER;
  }
  window.RPG_SERVER = SERVER;
  setInterval(() => {
    if (SERVER.online && IS_LOCAL_SERVER && !SERVER.cloudPwa) fetch("/api/ping", { cache: "no-store" }).catch(() => {});
  }, 60000);

  const SALON_SCENES = [
    { id: "cafe", cefr: "A1", icon: "☕", name: "Camille", role: "your new French friend, sitting with you at a café in Paris", goal: "Introduce yourself, say where you're from, order a drink.", opener: "Salut ! Moi, c'est Camille. Et toi, tu t'appelles comment ?" },
    { id: "boulangerie", cefr: "A1", icon: "🥖", name: "Monsieur Martin", role: "a friendly baker in his boulangerie", goal: "Buy bread and pastries, ask the price, say please and thank you.", opener: "Bonjour ! Qu'est-ce que je vous sers aujourd'hui ?" },
    { id: "weekend", cefr: "A2", icon: "🎒", name: "Lucas", role: "a classmate at your French school", goal: "Talk about last weekend (passé composé) and next weekend (futur proche).", opener: "Salut ! Alors, tu as fait quoi ce week-end ?" },
    { id: "metro", cefr: "A2", icon: "🚇", name: "Agnès", role: "a Parisian helping a lost tourist in the métro", goal: "Ask for directions, understand line numbers and stops.", opener: "Vous avez l'air perdu. Je peux vous aider ?" },
    { id: "docteur", cefr: "B1", icon: "🩺", name: "Docteure Benali", role: "a GP (médecin généraliste) in Paris", goal: "Describe your symptoms and understand the advice.", opener: "Bonjour, asseyez-vous. Qu'est-ce qui vous amène aujourd'hui ?" },
    { id: "appart", cefr: "B1", icon: "🏠", name: "Madame Leroy", role: "a landlady showing you an apartment", goal: "Ask about rent, charges and the neighbourhood, then negotiate.", opener: "Voilà le salon. Alors, qu'est-ce que vous en pensez ?" },
    { id: "debat", cefr: "B2", icon: "🗞️", name: "Inès", role: "a journalist friend who loves a good debate", goal: "Give and defend opinions using connectors (cependant, en revanche, d'ailleurs).", opener: "Franchement, tu crois que le télétravail, c'est l'avenir ou une catastrophe ?" },
    { id: "entretien", cefr: "C1", icon: "💼", name: "Madame Durand", role: "HR director interviewing you at a company in La Défense", goal: "Formal job interview: vouvoiement, registre soutenu, selling yourself.", opener: "Bonjour, merci d'être venu. Pour commencer, parlez-moi de votre parcours." },
    { id: "dalf", cefr: "C2", icon: "🎓", name: "Le jury", role: "a DALF C2 oral examiner (production orale)", goal: "Present a clear problématique, defend it against objections, nuance your position.", opener: "Bonjour. Nous vous écoutons : quelle est la problématique de votre exposé, et comment comptez-vous la traiter ?" },
    { id: "journal", cefr: "A1", icon: "📔", name: "Camille", role: "your French friend who chats with you every evening about your day, like a spoken diary", goal: "Tell Camille about your real day: what you did, how you feel, what's next. Think in French, don't translate.", opener: "Coucou ! Alors, c'était comment ta journée ? Raconte-moi !" },
    { id: "libre", cefr: "A1", icon: "💬", name: "Camille", role: "your French friend", goal: "Free conversation about anything you like.", opener: "Coucou ! De quoi tu as envie de parler aujourd'hui ?" }
  ];

  const salon = { sceneIdx: 0, log: [], busy: false, topic: null, listening: false };

  function salonScene() {
    if (salon.topic) {
      return {
        id: "podcast", cefr: campaignCefr(), icon: "📻", name: "Camille", role: "your French friend who also listens to podcasts",
        goal: `Tell Camille what you understood from the episode « ${salon.topic.title} » (${salon.topic.show}).`,
        opener: `Alors, tu as écouté « ${salon.topic.title} » ? Raconte-moi : de quoi ça parle ?`,
        context: salon.topic.summary || ""
      };
    }
    return SALON_SCENES[salon.sceneIdx] || SALON_SCENES[0];
  }

  function recentStudyWords() {
    const nxt = nextCampaignStage();
    const idx = nxt ? nxt.globalIdx : ALL_STAGES.length;
    const words = [];
    for (let i = Math.max(0, idx - 3); i < idx && words.length < 14; i++) {
      (ALL_STAGES[i].cards || []).slice(0, 6).forEach(c => words.length < 14 && words.push(String(c.fr).split("/")[0].trim()));
    }
    return words;
  }

  function buildSalonSystem(sc) {
    const lvl = campaignCefr();
    const guide = {
      A1: "Use very short sentences (max 10 words), present tense, very common words. Ask ONE simple question per turn.",
      A2: "Use short sentences, present, passé composé and futur proche. Everyday vocabulary. One question per turn.",
      B1: "Speak normal everyday French at a moderate pace. Mix tenses naturally.",
      B2: "Speak natural French with opinions, connectors and some idioms.",
      C1: "Speak rich, idiomatic French; use subjunctive, nuance and appropriate register.",
      C2: "Speak like an educated native. Challenge the learner's ideas, demand precision and nuance, use soutenu register where appropriate."
    }[lvl] || "";
    const words = recentStudyWords();
    return [
      `You are ${sc.name}, ${sc.role}, inside a French-learning role-play game.`,
      `The learner is at CEFR level ${lvl} (they started as a complete beginner). ${guide}`,
      `Scene goal for the learner: ${sc.goal}`,
      sc.context ? `Episode summary for context: ${sc.context}` : "",
      words.length ? `Words the learner studied recently. Reuse a few naturally: ${words.join(", ")}.` : "",
      "Rules: stay in character; reply_fr must be French only, 1-3 sentences, and end with a question or prompt that keeps the conversation going.",
      "Correct the learner's LAST message: if it has any grammar, spelling, gender, agreement, word-choice or unnatural phrasing issue, set has_error=true and give the natural corrected_fr plus a one-sentence English explanation. If it is correct, has_error=false and corrected_fr repeats their message. Messages may come from speech recognition, so ignore missing punctuation and capital letters.",
      "If the learner writes in English, answer in simple French and show them how to say it in French via corrected_fr.",
      "suggestions_fr: two short things the learner could say next, at their level. new_words: up to 3 useful words from your reply."
    ].filter(Boolean).join("\n");
  }

  function salonTranscript(sc, userMsg) {
    const lines = salon.log.map(m => (m.who === "ai" ? `${sc.name}: ${m.fr}` : `Learner: ${m.text}`));
    return `Conversation so far:\n${lines.join("\n")}\n\nThe learner just said: "${userMsg}"\nReply as ${sc.name}.`;
  }

  function startSalonConversation() {
    const sc = salonScene();
    salon.log = [{ who: "ai", fr: sc.opener, en: "", suggestions: [] }];
    speakFrench(sc.opener, 1.0);
  }

  window.selectSalonScene = function (idx) {
    salon.topic = null;
    salon.sceneIdx = idx;
    startSalonConversation();
    renderSalonScene(document.getElementById("app-main"));
  };

  window.openSalonAboutEpisode = function (showIdx, epIdx) {
    const show = (radio.shows || [])[showIdx];
    const ep = show && show.episodes[epIdx];
    if (!ep) return;
    salon.topic = { show: show.name, title: ep.title, summary: ep.summary };
    startSalonConversation();
    window.navigateScene("salon");
  };

  window.toggleSalonEnglish = function () {
    save.salonShowEn = !salonShowEnglish();
    persistSave();
    renderSalonScene(document.getElementById("app-main"));
  };

  function salonShowEnglish() {
    if (typeof save.salonShowEn === "boolean") return save.salonShowEn;
    return cefrRank(campaignCefr()) <= 1;
  }

  window.useSalonSuggestion = function (i) {
    const last = [...salon.log].reverse().find(m => m.who === "ai");
    const s = last && last.suggestions && last.suggestions[i];
    const inp = document.getElementById("salon-input");
    if (s && inp) { inp.value = s; inp.focus(); }
  };

  window.salonMic = function () {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    const status = document.getElementById("salon-mic-status");
    if (!SpeechRec) {
      if (status) status.textContent = "Speech recognition isn't available in this browser. Type instead, then read your sentence out loud.";
      return;
    }
    if (salon.listening) return;
    try {
      const rec = new SpeechRec();
      rec.lang = "fr-FR";
      rec.interimResults = true;
      rec.maxAlternatives = 1;
      salon.listening = true;
      if (status) status.textContent = "🎙️ J'écoute… parle en français";
      rec.onresult = (ev) => {
        const t = Array.from(ev.results).map(r => r[0].transcript).join(" ");
        const inp = document.getElementById("salon-input");
        if (inp) inp.value = t;
        if (ev.results[ev.results.length - 1].isFinal) {
          salon.spokeLast = true;
          window.sendSalonMessage();
        }
      };
      rec.onerror = () => { if (status) status.textContent = "Didn't catch that. Try again or type it."; };
      rec.onend = () => { salon.listening = false; };
      rec.start();
    } catch (e) {
      salon.listening = false;
    }
  };

  function buildCloudSalonReply(sc, userText) {
    const raw = String(userText || "").trim();
    let hasErr = false, fixed = raw, why = "";
    if (/\bje\s+([aàeéèêiîoôuùh])/i.test(raw) && !/\bje\s+h(abite|ésite)/i.test(raw)) {
      hasErr = true;
      fixed = raw.replace(/\bje\s+([aàeéèêiîoôuù])/gi, "j'$1");
      why = "Before a vowel, « je » contracts to « j' » (elision).";
    } else if (/\bje\s+suis\s+(faim|soif|froid|chaud|peur|besoin|envie|\d+\s*ans)\b/i.test(raw)) {
      hasErr = true;
      fixed = raw.replace(/\bje\s+suis\s+/i, "J'ai ");
      why = "In French, hunger, thirst, age and need use « avoir » (J'ai faim / J'ai 20 ans), never « être ».";
    } else if (/\bje\s+appelle\b/i.test(raw)) {
      hasErr = true;
      fixed = raw.replace(/\bje\s+appelle\b/i, "je m'appelle");
      why = "Use the reflexive verb « s'appeler » : « Je m'appelle… ».";
    }
    const turnIdx = salon.log.filter(m => m.who === "me").length;
    const sceneBank = {
      cafe: [
        { reply_fr: "Enchantée ! C'est un plaisir de discuter avec toi au café. Qu'est-ce que tu prends à boire aujourd'hui ?", reply_en: "Nice to meet you! It's a pleasure chatting with you at the café. What are you having to drink today?", suggestions_fr: ["Je voudrais un café allongé, s'il vous plaît.", "Pour moi, un chocolat chaud et un croissant."], new_words: [{ fr: "un café allongé", en: "an espresso with hot water" }, { fr: "prendre un verre", en: "to have a drink" }] },
        { reply_fr: "Excellent choix ! Moi aussi j'adore cet endroit. Tu habites dans quel quartier ?", reply_en: "Excellent choice! I love this place too. Which neighborhood do you live in?", suggestions_fr: ["J'habite près du centre, c'est très vivant.", "Je suis étudiant et j'adore découvrir Paris."], new_words: [{ fr: "le quartier", en: "the neighborhood" }, { fr: "vivant", en: "lively" }] }
      ],
      boulangerie: [
        { reply_fr: "Tout de suite ! Elle sort tout juste du four, elle est encore toute chaude. Il vous faudra autre chose ?", reply_en: "Right away! It just came out of the oven, it's still warm. Will you need anything else?", suggestions_fr: ["Je vais aussi prendre deux pains au chocolat.", "Non merci, ce sera tout. C'est combien ?"], new_words: [{ fr: "sortir du four", en: "to come out of the oven" }, { fr: "ce sera tout", en: "that will be all" }] }
      ],
      debat: [
        { reply_fr: "C'est un argument intéressant ! Cependant, ne penses-tu pas que cela transforme aussi nos rapports sociaux au quotidien ?", reply_en: "That's an interesting argument! However, don't you think it also transforms our daily social relationships?", suggestions_fr: ["En revanche, cela offre une liberté d'organisation précieuse.", "Certes, mais il faut trouver un juste équilibre."], new_words: [{ fr: "en revanche", en: "on the other hand" }, { fr: "un juste équilibre", en: "a fair balance" }] }
      ],
      dalf: [
        { reply_fr: "Votre problématique est clairement posée. Toutefois, comment répondriez-vous à ceux qui estiment que le progrès technique dilue la responsabilité individuelle ?", reply_en: "Your central question is clearly stated. However, how would you respond to those who argue that technical progress dilutes individual responsibility?", suggestions_fr: ["Bien que cette crainte soit légitime, il n'en demeure pas moins que l'éthique doit primer.", "Il convient précisément d'encadrer l'innovation sans l'entraver."], new_words: [{ fr: "il n'en demeure pas moins que", en: "nevertheless the fact remains that" }, { fr: "entraver", en: "to hinder / fetter" }] }
      ]
    };
    const pool = sceneBank[sc.id] || [
      { reply_fr: `C'est très bien formulé ! Dans ce contexte (${sc.name}), comment souhaitez-vous poursuivre notre échange ?`, reply_en: `That is very well phrased! In this context (${sc.name}), how would you like to continue our exchange?`, suggestions_fr: ["D'abord, j'aimerais préciser mon point de vue.", "Pouvez-vous me donner votre avis sur cette question ?"], new_words: [{ fr: "préciser", en: "to clarify / specify" }, { fr: "poursuivre", en: "to continue / pursue" }] },
      { reply_fr: "Exactement ! Votre français gagne en fluidité à chaque réplique. Que feriez-vous ensuite dans cette situation ?", reply_en: "Exactly! Your French is gaining fluency with every line. What would you do next in this situation?", suggestions_fr: ["Je proposerais une solution concrète et rapide.", "En réalité, tout dépend des circonstances."], new_words: [{ fr: "en réalité", en: "in reality / actually" }, { fr: "la fluidité", en: "fluency" }] }
    ];
    const picked = pool[(turnIdx - 1 + pool.length) % pool.length];
    return Object.assign({}, picked, {
      correction: { has_error: hasErr, corrected_fr: fixed, explanation_en: why }
    });
  }

  window.sendSalonMessage = async function () {
    const inp = document.getElementById("salon-input");
    const text = inp ? inp.value.trim() : "";
    if (!text || salon.busy) return;
    const sc = salonScene();
    const conversation = salonTranscript(sc, text);
    salon.log.push({ who: "me", text, correction: null });
    salon.busy = true;
    save.stats.salonTurns = (save.stats.salonTurns || 0) + 1;
    if (salon.spokeLast) save.stats.phrasesSpoken = (save.stats.phrasesSpoken || 0) + 1;
    salon.spokeLast = false;
    renderSalonScene(document.getElementById("app-main"));
    let d = null;
    try {
      if (IS_LOCAL_SERVER && !SERVER.cloudPwa) {
        const r = await fetch("/api/partner", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ system: buildSalonSystem(sc), conversation })
        });
        const j = await r.json();
        if (j && j.ok && j.data) d = j.data;
      }
    } catch (e) {}
    if (!d) d = buildCloudSalonReply(sc, text);
    const mine = salon.log[salon.log.length - 1];
    mine.correction = d.correction || null;
    if (d.correction && d.correction.has_error && d.correction.corrected_fr) {
      window.recordLearningOutcome(
        { id: `salon_${normPreserveAccents(d.correction.corrected_fr).slice(0, 40)}`, fr: d.correction.corrected_fr, en: d.correction.explanation_en || "", category: "conversation", cefr: campaignCefr() },
        false
      );
    } else {
      addXP(20, 5);
    }
    (d.new_words || []).slice(0, 3).forEach(w => {
      if (!w || !w.fr) return;
      const key = `word_${normPreserveAccents(w.fr).slice(0, 40)}`;
      if (!save.fsrsCards[key]) save.fsrsCards[key] = Object.assign({ fr: w.fr, en: w.en || "" }, FSRS5.review(null, 3));
    });
    salon.log.push({ who: "ai", fr: d.reply_fr || "…", en: d.reply_en || "", suggestions: d.suggestions_fr || [], words: d.new_words || [] });
    speakFrench(d.reply_fr || "", 1.0);
    salon.busy = false;
    persistSave();
    renderSalonScene(document.getElementById("app-main"));
    const fresh = document.getElementById("salon-input");
    if (fresh && salon.retryText) { fresh.value = salon.retryText; salon.retryText = null; }
    if (fresh) fresh.focus();
  };

  window.recheckServer = async function () {
    await checkServer();
    window.navigateScene(currentScene);
  };

  function salonSetupHtml() {
    if (!SERVER.online) {
      return `
        <div class="feedback-banner err" style="text-align:left;">
          <strong>🔌 Start the game from the desktop shortcut "L'Odyssée Française"</strong> to switch on the AI partner and live radio.
          (Opening index.html directly can't reach the AI.)
          <div style="margin-top:0.5rem;"><button class="btn" onclick="window.recheckServer()">↻ Check again</button></div>
        </div>`;
    }
    if (!SERVER.ai) {
      return `
        <div class="teaching-slide-card" style="border:2px solid #f59e0b;">
          <div style="font-weight:900;color:#fde047;font-size:1.05rem;">🔑 One-time setup: connect your AI conversation partner (free)</div>
          <ol class="onboard-list" style="margin-top:0.5rem;">
            <li>Get a key at <a href="https://aistudio.google.com/apikey" target="_blank" style="color:#38bdf8;font-weight:800;">aistudio.google.com/apikey</a> (click <strong>Create API key</strong>, then copy it).</li>
            <li>Double-click <strong>"Connect AI Partner"</strong> on your Desktop, paste the key into the hidden box, and click <strong>Save &amp; test</strong>.</li>
            <li>When it says ✅ Connected, click the button below. No restart needed.</li>
          </ol>
          <button class="btn" onclick="window.recheckServer()">↻ I've done it, check again</button>
        </div>`;
    }
    return "";
  }

  function renderSalonScene(container) {
    const sc = salonScene();
    if (!salon.log.length) startSalonConversation();
    const showEn = salonShowEnglish();
    const myTurns = salon.log.filter(m => m.who === "me").length;
    const ready = SERVER.online && SERVER.ai;

    container.innerHTML = `
      <div class="arena-box" style="background:linear-gradient(135deg,rgba(6,10,25,0.8),rgba(30,27,75,0.92)), url('assets/bg_paris_hub.jpg') center/cover;border:2px solid var(--border-gold);">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
          <div>
            <span class="badge-cefr badge-${campaignCefr()}">🗣️ LE SALON • REAL CONVERSATION PRACTICE</span>
            <h2 style="font-size:1.5rem;font-weight:900;color:#fff;margin-top:0.25rem;">Talk with a French partner who answers, corrects you and adapts to your level</h2>
            <p style="font-size:0.88rem;color:#cbd5e1;max-width:760px;">Speak with 🎙️ or type. Every reply is read aloud, every mistake is corrected and sent to your 📕 Grimoire, and the conversation uses the words from your recent stages.</p>
          </div>
          <div style="text-align:center;background:rgba(2,6,23,0.85);border:1.5px solid #fde047;border-radius:14px;padding:0.6rem 1rem;">
            <div style="font-size:0.72rem;color:#fde047;font-weight:800;">CONVERSATION TURNS</div>
            <div style="font-size:1.4rem;font-weight:900;color:#38bdf8;">${save.stats.salonTurns || 0}</div>
            <div style="font-size:0.72rem;color:#6ee7b7;">this chat: ${myTurns}</div>
          </div>
        </div>
      </div>

      ${salonSetupHtml()}

      <div class="salon-layout">
        <div class="salon-scenes">
          <div style="font-weight:900;color:#fde047;margin-bottom:0.45rem;">Choose a scene</div>
          ${salon.topic ? `<div class="salon-scene-card active"><span>📻</span><div><strong>Podcast talk</strong><div class="ssc-sub">${escapeHtml(salon.topic.title.slice(0, 60))}</div></div></div>` : ""}
          ${SALON_SCENES.map((s, i) => {
            const fit = levelFit(s.cefr);
            return `
              <button class="salon-scene-card ${!salon.topic && i === salon.sceneIdx ? "active" : ""}" onclick="window.selectSalonScene(${i})">
                <span>${s.icon}</span>
                <div style="text-align:left;">
                  <strong>${escapeHtml(s.name)}</strong> <span class="fit-badge fit-${fit.tag}">${s.cefr}</span>
                  <div class="ssc-sub">${escapeHtml(s.goal)}</div>
                </div>
              </button>`;
          }).join("")}
        </div>

        <div class="salon-chat">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.5rem;">
            <div><span style="font-size:1.5rem;">${sc.icon}</span> <strong style="color:#fde047;">${escapeHtml(sc.name)}</strong> <span style="color:#94a3b8;font-size:0.85rem;">— ${escapeHtml(sc.goal)}</span></div>
            <div style="display:flex;gap:0.4rem;">
              <button class="btn" onclick="window.toggleSalonEnglish()">${showEn ? "🙈 Hide English" : "🇬🇧 Show English"}</button>
              <button class="btn" onclick="${salon.topic ? "window.navigateScene('radio')" : `window.selectSalonScene(${salon.sceneIdx})`}">↺ New chat</button>
            </div>
          </div>
          <div class="salon-log" id="salon-log">
            ${salon.log.map((m, i) => {
              if (m.who === "ai") {
                return `
                  <div class="bubble ai">
                    <div class="bubble-fr" onclick="window.speakSalonLine(${i}, 1.0)">🔊 ${escapeHtml(m.fr)}</div>
                    ${showEn && m.en ? `<div class="bubble-en">${escapeHtml(m.en)}</div>` : ""}
                    <div class="bubble-tools">
                      <button class="btn" onclick="window.speakSalonLine(${i}, 0.6)">🐢 Slow</button>
                      ${(m.words || []).map(w => `<span class="word-chip" title="${escapeHtml(w.en)}">${escapeHtml(w.fr)}${showEn ? ` = ${escapeHtml(w.en)}` : ""}</span>`).join("")}
                    </div>
                  </div>`;
              }
              if (m.who === "me") {
                const c = m.correction;
                return `
                  <div class="bubble me">
                    <div>${escapeHtml(m.text)}</div>
                    ${c ? (c.has_error
                      ? `<div class="bubble-fix">✏️ <strong onclick="window.speakFrench(this.textContent, 1.0)" style="cursor:pointer;">${escapeHtml(c.corrected_fr)}</strong><div>${escapeHtml(c.explanation_en || "")}</div></div>`
                      : `<div class="bubble-ok">✅ Parfait !</div>`) : ""}
                  </div>`;
              }
              return `<div class="bubble sys">${escapeHtml(m.text)}</div>`;
            }).join("")}
            ${salon.busy ? `<div class="bubble ai typing">${escapeHtml(sc.name)} écrit…</div>` : ""}
          </div>

          ${(() => {
            const last = [...salon.log].reverse().find(m => m.who === "ai");
            return last && last.suggestions && last.suggestions.length
              ? `<div class="salon-suggest">💡 Ideas: ${last.suggestions.map((s, i) => `<button class="word-tile" onclick="window.useSalonSuggestion(${i})">${escapeHtml(s)}</button>`).join("")}</div>`
              : "";
          })()}

          <div class="accent-bar" style="margin-top:0.5rem;">
            ${ACCENTS.map(a => `<button type="button" class="accent-key" onclick="window.insertFrenchAccent('salon-input', '${a}')">${a}</button>`).join("")}
          </div>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
            <button class="btn btn-primary" style="padding:0.75rem 1.1rem;" ${ready ? "" : "disabled"} onclick="window.salonMic()">🎙️ Speak</button>
            <input id="salon-input" class="input-french" style="flex:1;margin-bottom:0;" autocomplete="off" spellcheck="false"
                   placeholder="${ready ? "Réponds en français… (English is OK if you're stuck)" : "Connect the AI partner to start talking"}"
                   ${ready ? "" : "disabled"}
                   onkeydown="if(event.key==='Enter'){event.preventDefault();window.sendSalonMessage();}" />
            <button class="btn btn-gold" style="padding:0.75rem 1.2rem;" ${ready && !salon.busy ? "" : "disabled"} onclick="window.sendSalonMessage()">Envoyer ➤</button>
          </div>
          <div id="salon-mic-status" style="font-size:0.82rem;color:#fde047;margin-top:0.35rem;min-height:1.1em;"></div>
        </div>
      </div>
    `;
    const logEl = document.getElementById("salon-log");
    if (logEl) logEl.scrollTop = logEl.scrollHeight;
  }

  window.speakSalonLine = function (i, rate) {
    const m = salon.log[i];
    if (m && m.fr) speakFrench(m.fr, rate);
  };

  // ---------------------------- RADIO PARIS ----------------------------
  const radio = { shows: null, loading: false, filter: "foryou", openShow: -1, now: null, lastT: 0, epSeconds: 0 };

  const SERIES_SHELF = [
    { level: "A1", icon: "📺", name: "Extr@ French", what: "A sitcom made for learners: slow, funny, everyday French.", url: "https://www.youtube.com/results?search_query=extra+french+episode+1" },
    { level: "A2", icon: "🎥", name: "Easy French (street interviews)", what: "Real people on the streets of France, with subtitles.", url: "https://www.youtube.com/@EasyFrench" },
    { level: "A2", icon: "🎓", name: "TV5MONDE Apprendre", what: "Short news videos with exercises, by level.", url: "https://apprendre.tv5monde.com/fr" },
    { level: "B1", icon: "🎙️", name: "innerFrench (YouTube)", what: "Clear intermediate French on interesting topics.", url: "https://www.youtube.com/@innerFrench" },
    { level: "B1", icon: "🗼", name: "Français avec Pierre", what: "Grammar and real spoken French explained in French.", url: "https://www.youtube.com/@Francaisavecpierre" },
    { level: "B2", icon: "🕵️", name: "Lupin (Netflix)", what: "Modern Paris thriller. Start with French audio + French subtitles.", url: "https://www.netflix.com/search?q=Lupin" },
    { level: "B2", icon: "🎬", name: "Dix pour cent / Call My Agent (Netflix)", what: "Fast, funny Parisian workplace French.", url: "https://www.netflix.com/search?q=Dix%20pour%20cent" },
    { level: "C1", icon: "📡", name: "Le Bureau des Légendes", what: "Spy drama: professional, nuanced, high-register French.", url: "https://www.google.com/search?q=Le+Bureau+des+L%C3%A9gendes+regarder" },
    { level: "C1", icon: "🌍", name: "ARTE documentaires", what: "Free documentaries in French on every subject.", url: "https://www.arte.tv/fr/" },
    { level: "C2", icon: "📰", name: "France TV info & débats", what: "Live debates and news: the French of the DALF C2.", url: "https://www.france.tv/" }
  ];

  async function loadRadio() {
    if (radio.liveLoaded || radio.loading) return;
    // Show saved episodes instantly; swap in today's live episodes when they arrive.
    if (!radio.shows) radio.shows = (window.RADIO_SHOWS || []).map(s => Object.assign({}, s));
    if (!SERVER.online || SERVER.cloudPwa || !IS_LOCAL_SERVER) { radio.liveLoaded = true; return; }
    radio.loading = true;
    try {
      const r = await fetch("/api/radio", { cache: "no-store" });
      const j = await r.json();
      if (j.shows && j.shows.length === radio.shows.length) radio.shows = j.shows;
      radio.liveLoaded = true;
    } catch (e) {}
    radio.loading = false;
    if (currentScene === "radio") renderRadioScene(document.getElementById("app-main"));
  }

  function listenSecondsToday() {
    ensureDaily();
    const base = save.daily.base.listen != null ? save.daily.base.listen : (save.stats.listenSeconds || 0);
    return Math.max(0, (save.stats.listenSeconds || 0) - base);
  }

  window.setRadioFilter = function (f) {
    radio.filter = f;
    renderRadioScene(document.getElementById("app-main"));
  };
  window.toggleRadioShow = function (i) {
    radio.openShow = radio.openShow === i ? -1 : i;
    renderRadioScene(document.getElementById("app-main"));
  };

  window.playRadioEpisode = function (showIdx, epIdx) {
    const show = (radio.shows || [])[showIdx];
    const ep = show && show.episodes[epIdx];
    if (!ep) return;
    radio.now = { showIdx, epIdx };
    radio.epSeconds = 0;
    teardownActiveAudio();
    const p = document.getElementById("radio-player");
    if (p) {
      p.src = ep.audio;
      p.play().catch(() => {});
    }
    updateRadioNowPlaying();
  };

  window.radioSkip = function (s) {
    const p = document.getElementById("radio-player");
    if (p) p.currentTime = Math.max(0, p.currentTime + s);
  };
  window.radioSpeed = function (btn) {
    const p = document.getElementById("radio-player");
    if (!p) return;
    p.playbackRate = p.playbackRate === 1 ? 0.8 : (p.playbackRate === 0.8 ? 1.2 : 1);
    btn.textContent = `${p.playbackRate}×`;
  };

  function updateRadioNowPlaying() {
    const box = document.getElementById("radio-now");
    if (!box) return;
    if (!radio.now) {
      box.innerHTML = `<span style="color:#94a3b8;">Pick an episode below. Optional: listen whenever you like. It never blocks your progress.</span>`;
      return;
    }
    const show = radio.shows[radio.now.showIdx];
    const ep = show.episodes[radio.now.epIdx];
    const canTalk = radio.epSeconds >= 120;
    box.innerHTML = `
      <div style="font-weight:900;color:#fde047;">▶ ${escapeHtml(show.name)}</div>
      <div style="color:#e2e8f0;">${escapeHtml(ep.title)}</div>
      <div style="font-size:0.8rem;color:#94a3b8;margin-top:0.2rem;">Listened to this episode: ${Math.floor(radio.epSeconds / 60)} min ${radio.epSeconds % 60}s</div>
      <div style="margin-top:0.45rem;">
        ${canTalk
          ? `<button class="btn btn-gold" onclick="window.openSalonAboutEpisode(${radio.now.showIdx}, ${radio.now.epIdx})">🗣️ Tell Camille what you understood</button>`
          : `<span style="font-size:0.8rem;color:#cbd5e1;">After 2 minutes you can tell Camille what you understood (speaking + listening practice).</span>`}
      </div>`;
  }

  window.markSeriesWatched = function (i) {
    ensureDaily();
    save.daily.series = save.daily.series || {};
    if (save.daily.series[i]) return;
    save.daily.series[i] = true;
    save.stats.listenSeconds = (save.stats.listenSeconds || 0) + 1200;
    addXP(40, 10);
    if (window.RPG_VFX) window.RPG_VFX.toast("Immersion logged", "+20 min of real French. Bravo !", "🎬");
    renderRadioScene(document.getElementById("app-main"));
  };

  function attachRadioTracking() {
    const p = document.getElementById("radio-player");
    if (!p || p.dataset.tracked) return;
    p.dataset.tracked = "1";
    radio.lastT = 0;
    p.addEventListener("play", () => { radio.lastT = p.currentTime; });
    p.addEventListener("timeupdate", () => {
      const d = p.currentTime - radio.lastT;
      radio.lastT = p.currentTime;
      if (p.paused || d <= 0 || d > 2.5) return;
      radio.acc = (radio.acc || 0) + d;
      if (radio.acc >= 1) {
        const whole = Math.floor(radio.acc);
        radio.acc -= whole;
        save.stats.listenSeconds = (save.stats.listenSeconds || 0) + whole;
        radio.epSeconds += whole;
        if (radio.epSeconds % 15 === 0) {
          persistSave();
          updateRadioNowPlaying();
          const q = document.getElementById("radio-quest");
          if (q) q.textContent = `${Math.floor(listenSecondsToday() / 60)} min today`;
        }
      }
    });
  }

  function renderRadioScene(container) {
    loadRadio();
    // Preserve playback across re-renders (opening another show must not restart the episode).
    const oldP = document.getElementById("radio-player");
    const keep = oldP && oldP.getAttribute("src")
      ? { src: oldP.getAttribute("src"), t: oldP.currentTime || 0, paused: oldP.paused, rate: oldP.playbackRate || 1 }
      : null;
    const shows = radio.shows || [];
    const myRank = cefrRank(campaignCefr());
    const list = shows.map((s, i) => ({ s, i })).filter(({ s }) => radio.filter === "all" || cefrRank(s.level) <= myRank + 1);
    const mins = Math.floor(listenSecondsToday() / 60);

    container.innerHTML = `
      <div class="arena-box" style="background:linear-gradient(135deg,rgba(6,10,25,0.82),rgba(15,23,42,0.94)), url('assets/bg_paris_hub.jpg') center/cover;border:2px solid var(--border-gold);">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
          <div>
            <span class="badge-cefr badge-${campaignCefr()}">📻 RADIO PARIS • REAL FRENCH, EVERY DAY</span>
            <h2 style="font-size:1.5rem;font-weight:900;color:#fff;margin-top:0.25rem;">Real French podcasts and radio, from beginner shows to France Culture</h2>
            <p style="font-size:0.88rem;color:#cbd5e1;max-width:760px;">${SERVER.online ? "Fresh episodes are loaded live every day." : "Showing saved episodes (start from the desktop shortcut for today's episodes)."} Start with shows marked ✅, and move up as your level grows.</p>
          </div>
          <div style="text-align:center;background:rgba(2,6,23,0.85);border:1.5px solid #fde047;border-radius:14px;padding:0.6rem 1rem;">
            <div style="font-size:0.72rem;color:#fde047;font-weight:800;">TODAY'S LISTENING</div>
            <div style="font-size:1.4rem;font-weight:900;color:#38bdf8;" id="radio-quest">${mins} min today</div>
            <div style="font-size:0.72rem;color:#6ee7b7;">total: ${Math.floor((save.stats.listenSeconds || 0) / 60)} min</div>
          </div>
        </div>
      </div>

      <div class="radio-player-bar">
        <audio id="radio-player" controls preload="none"></audio>
        <div style="display:flex;gap:0.35rem;flex-wrap:wrap;">
          <button class="btn" onclick="window.radioSkip(-15)">⏪ 15s</button>
          <button class="btn" onclick="window.radioSkip(15)">15s ⏩</button>
          <button class="btn" onclick="window.radioSpeed(this)">1×</button>
        </div>
        <div id="radio-now" class="radio-now"></div>
      </div>

      <div style="display:flex;gap:0.5rem;margin:0.75rem 0;">
        <button class="btn ${radio.filter === "foryou" ? "btn-gold" : ""}" onclick="window.setRadioFilter('foryou')">🎯 For my level</button>
        <button class="btn ${radio.filter === "all" ? "btn-gold" : ""}" onclick="window.setRadioFilter('all')">🌍 All shows (A1→C2)</button>
      </div>

      ${radio.loading && !shows.length ? `<div class="arena-box">Tuning in…</div>` : ""}
      <div class="radio-grid">
        ${list.map(({ s, i }) => {
          const fit = levelFit(s.level);
          const open = radio.openShow === i;
          return `
            <div class="radio-show ${open ? "open" : ""}">
              <div class="radio-show-head" onclick="window.toggleRadioShow(${i})">
                ${s.artwork ? `<img src="${escapeHtml(s.artwork)}" alt="" loading="lazy">` : `<div class="radio-art-fallback">📻</div>`}
                <div style="flex:1;">
                  <div style="font-weight:900;color:#fde047;">${escapeHtml(s.name)}</div>
                  <div style="font-size:0.8rem;color:#cbd5e1;">${escapeHtml(s.why)}</div>
                  <div style="margin-top:0.25rem;"><span class="fit-badge fit-${fit.tag}">${s.level} • ${fit.label}</span> ${s.live ? `<span class="fit-badge fit-fit">🟢 today</span>` : ""}</div>
                </div>
                <span style="font-size:1.2rem;">${open ? "▾" : "▸"}</span>
              </div>
              ${open ? `
                <div class="radio-eps">
                  ${(s.episodes || []).map((ep, k) => `
                    <div class="radio-ep">
                      <button class="btn btn-gold" onclick="window.playRadioEpisode(${i}, ${k})">▶</button>
                      <div style="flex:1;">
                        <div style="font-weight:800;">${escapeHtml(ep.title)}</div>
                        <div style="font-size:0.76rem;color:#94a3b8;">${escapeHtml(ep.date || "")} ${ep.duration ? "• " + escapeHtml(ep.duration) : ""}</div>
                        ${ep.summary ? `<div style="font-size:0.78rem;color:#cbd5e1;margin-top:0.15rem;">${escapeHtml(ep.summary.slice(0, 180))}${ep.summary.length > 180 ? "…" : ""}</div>` : ""}
                      </div>
                    </div>`).join("")}
                </div>` : ""}
            </div>`;
        }).join("")}
      </div>

      <div class="arena-box" style="margin-top:1rem;">
        <h3 style="font-size:1.2rem;font-weight:900;color:#fde047;margin-bottom:0.35rem;">🎬 Séries & vidéos: watch real French</h3>
        <p style="font-size:0.84rem;color:#cbd5e1;margin-bottom:0.65rem;">Tip: French audio + French subtitles. Watched 20 minutes? Log it and it counts toward today's listening.</p>
        <div class="radio-grid">
          ${SERIES_SHELF.map((v, i) => {
            const fit = levelFit(v.level);
            const done = save.daily && save.daily.series && save.daily.series[i];
            return `
              <div class="radio-show">
                <div class="radio-show-head" style="cursor:default;">
                  <div class="radio-art-fallback">${v.icon}</div>
                  <div style="flex:1;">
                    <div style="font-weight:900;color:#fde047;">${escapeHtml(v.name)}</div>
                    <div style="font-size:0.8rem;color:#cbd5e1;">${escapeHtml(v.what)}</div>
                    <div style="margin-top:0.25rem;"><span class="fit-badge fit-${fit.tag}">${v.level} • ${fit.label}</span></div>
                    <div style="display:flex;gap:0.35rem;margin-top:0.4rem;flex-wrap:wrap;">
                      <a class="btn" href="${v.url}" target="_blank" rel="noopener">Open ↗</a>
                      <button class="btn ${done ? "" : "btn-gold"}" ${done ? "disabled" : ""} onclick="window.markSeriesWatched(${i})">${done ? "✅ Logged today" : "I watched 20 min"}</button>
                    </div>
                  </div>
                </div>
              </div>`;
          }).join("")}
        </div>
      </div>
    `;
    attachRadioTracking();
    updateRadioNowPlaying();
    const p = document.getElementById("radio-player");
    if (p && keep) {
      p.src = keep.src;
      p.playbackRate = keep.rate;
      p.addEventListener("loadedmetadata", () => {
        try { p.currentTime = keep.t; } catch (e) {}
        radio.lastT = keep.t;
        if (!keep.paused) p.play().catch(() => {});
      }, { once: true });
      p.load();
    }
  }

  // =========================================================================
  // SCENE 6: LA GRANDE FORGE (ALL 94 FRENCH VERBS × 11 TENSES = 8,692 FORMS)
  // =========================================================================
  let selectedVerbId = "verb_01";
  let currentVerbDrill = null;

  function buildVerbDrill() {
    const verb = DATA.verbs.find(v => v.id === selectedVerbId) || DATA.verbs[0];
    const tenseKeys = Object.keys(verb.tenses || {});
    const tName = tenseKeys[Math.floor(Math.random() * tenseKeys.length)] || "Présent";
    const forms = verb.tenses[tName] || [];
    const form = forms[Math.floor(Math.random() * forms.length)] || { fr: "je suis", en: "I am" };
    const distractors = forms.filter(f => f.fr !== form.fr).slice(0, 3);
    return {
      verb,
      tense: tName,
      form,
      options: [form, ...distractors].sort(() => 0.5 - Math.random())
    };
  }

  function renderVerbForgeScene(container) {
    const verb = DATA.verbs.find(v => v.id === selectedVerbId) || DATA.verbs[0];
    if (!currentVerbDrill || currentVerbDrill.verb.id !== verb.id) {
      currentVerbDrill = buildVerbDrill();
    }
    const d = currentVerbDrill;
    const safeTarget = escapeHtml(d.form.fr.replace(/'/g, "\\'"));

    container.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;margin-bottom:1rem;">
        <div>
          <h2 style="font-size:1.45rem;font-weight:900;">⚒️ La Grande Forge — All 94 French Verbs &amp; 11 Tenses (8,692 Forms)</h2>
          <p style="font-size:0.86rem;color:var(--text-muted);">Select any of the 94 verbs to forge its conjugations and hear every form in Studio Neural French.</p>
        </div>
        <select class="btn" style="color:#fde047;font-weight:800;" onchange="window.selectForgeVerb(this.value)">
          ${DATA.verbs.map((v, i) => `
            <option value="${v.id}" ${v.id === selectedVerbId ? 'selected' : ''}>${i + 1}. ${escapeHtml(v.title)} (${escapeHtml(v.group)})</option>
          `).join("")}
        </select>
      </div>

      <!-- Interactive Blacksmith Anvil Drill -->
      <div class="arena-box" style="border:2px solid var(--border-gold);">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;">
          <span class="badge-cefr badge-B1">⚒️ ANVIL CHALLENGE • ${escapeHtml(d.tense)}</span>
          <span style="font-size:0.85rem;color:#fde047;font-weight:800;">Verbs Forged: ${save.stats.verbsForged || 0}</span>
        </div>
        <div style="font-size:1.35rem;font-weight:900;margin:0.65rem 0;">
          Conjugate <strong>${escapeHtml(d.verb.title)}</strong> in <em>${escapeHtml(d.tense)}</em> for: <span style="color:#38bdf8;">"${escapeHtml(d.form.en)}"</span>
        </div>
        <div class="mcq-grid">
          ${d.options.map(o => {
            const safeOpt = escapeHtml(o.fr.replace(/'/g, "\\'"));
            return `
              <button class="mcq-opt" onclick="window.strikeVerbAnvil(this, '${safeOpt}', '${safeTarget}')">
                🔥 ${escapeHtml(o.fr)}
              </button>
            `;
          }).join("")}
        </div>
      </div>

      <!-- Complete 11-Tense Conjugation Tables -->
      <div class="arena-box">
        <h3 style="font-size:1.3rem;font-weight:900;color:#fde047;margin-bottom:0.85rem;">📖 Complete Conjugation Grimoire: ${escapeHtml(verb.title)} (${escapeHtml(verb.group)})</h3>
        <div class="grid-cards">
          ${Object.entries(verb.tenses || {}).map(([tName, forms]) => `
            <div class="study-section" style="margin-bottom:0;">
              <h3>${escapeHtml(tName)}</h3>
              <table class="verb-table">
                ${forms.map(f => {
                  const sf = escapeHtml(f.fr.replace(/'/g, "\\'"));
                  return `
                    <tr>
                      <td class="fr-col" onclick="window.speakFrench('${sf}', 1.0)">🔊 ${escapeHtml(f.fr)}</td>
                      <td style="width:42px;"><button class="btn" style="padding:2px 6px;font-size:0.7rem;" onclick="window.speakFrench('${sf}', 0.6)">🐢</button></td>
                      <td style="color:#cbd5e1;">${escapeHtml(f.en)}</td>
                    </tr>
                  `;
                }).join("")}
              </table>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  window.selectForgeVerb = function (vId) {
    selectedVerbId = vId;
    currentVerbDrill = buildVerbDrill();
    renderVerbForgeScene(document.getElementById("app-main"));
  };

  window.strikeVerbAnvil = function (btnEl, chosen, target) {
    speakFrench(target, 1.0);
    if (checkAnswerMatch(chosen, target)) {
      btnEl.classList.add("correct");
      save.stats.verbsForged = (save.stats.verbsForged || 0) + 1;
      if (window.RPG_SFX) window.RPG_SFX.swordSlash();
      if (window.RPG_VFX) window.RPG_VFX.floatText("⚒️ +25 XP!", "#fde047");
      addXP(25, 7);
      setTimeout(() => {
        currentVerbDrill = buildVerbDrill();
        renderVerbForgeScene(document.getElementById("app-main"));
      }, 600);
    } else {
      btnEl.classList.add("wrong");
      if (window.RPG_SFX) window.RPG_SFX.damageHit();
    }
  };

  // =========================================================================
  // SCENE 7: ROYAL CODEX (53 VOCAB THEMES, C2 RHETORIC STUDIO & CLOUD VAULT)
  // =========================================================================
  let selectedThemeIdx = 0;
  function renderRoyalCodexScene(container) {
    const theme = DATA.vocabThemes[selectedThemeIdx] || DATA.vocabThemes[0];

    container.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;margin-bottom:1rem;">
        <div>
          <h2 style="font-size:1.45rem;font-weight:900;">📜 The Royal Codex — All 53 French Vocabulary Themes &amp; DALF C2 Quick Jump</h2>
          <p style="font-size:0.86rem;color:var(--text-muted);">Explore every thematic vocabulary list with Studio Neural French (1x &amp; Slow 0.6x), or jump directly into the C1/C2 Career &amp; DALF Worlds.</p>
        </div>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          <button class="btn btn-gold" onclick="window.launchStageById('41-1', true)">🗣️ W41: Native Street Flow</button>
          <button class="btn btn-gold" onclick="window.launchStageById('43-1', true)">💼 W43: Executive Career</button>
          <button class="btn btn-purple" onclick="window.launchStageById('46-1', true)">👑 W46: DALF C2 Exam</button>
        </div>
      </div>

      <div class="arena-box">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;margin-bottom:0.85rem;">
          <h3 style="font-size:1.3rem;font-weight:900;color:#fde047;">
            🏛️ Theme ${selectedThemeIdx + 1} of 53: ${escapeHtml(theme.title)} — <span style="color:#38bdf8;">${escapeHtml(theme.englishTitle)}</span> (${theme.items.length} Items)
          </h3>
          <select class="btn" style="color:#fde047;font-weight:800;" onchange="window.selectCodexTheme(Number(this.value))">
            ${DATA.vocabThemes.map((t, i) => `
              <option value="${i}" ${i === selectedThemeIdx ? 'selected' : ''}>
                ${i + 1}. ${escapeHtml(t.title)} (${escapeHtml(t.englishTitle)}) — ${t.items.length} words
              </option>
            `).join("")}
          </select>
        </div>
        <div class="grid-cards" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr));">
          ${theme.items.map(item => {
            const sf = escapeHtml(item.fr.replace(/'/g, "\\'"));
            return `
              <div class="card">
                <div>
                  <div style="font-size:1.08rem;font-weight:800;color:#38bdf8;cursor:pointer;" onclick="window.speakFrench('${sf}', 1.0)">
                    🇫🇷 ${escapeHtml(item.fr)}
                  </div>
                  <div style="font-size:0.92rem;color:#e2e8f0;margin-top:0.2rem;">🇬🇧 ${escapeHtml(item.en)}</div>
                  ${item.note ? `<div style="font-size:0.76rem;color:#fbbf24;margin-top:0.15rem;">💡 ${escapeHtml(item.note)}</div>` : ""}
                </div>
                <div style="display:flex;gap:0.35rem;margin-top:0.35rem;">
                  <button class="btn" style="flex:1;padding:0.3rem;font-size:0.76rem;" onclick="window.speakFrench('${sf}', 1.0)">🔊 Studio 1x</button>
                  <button class="btn" style="flex:1;padding:0.3rem;font-size:0.76rem;color:#fde047;" onclick="window.speakFrench('${sf}', 0.6)">🐢 Slow 0.6x</button>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>

      <!-- Cloud Vault & Progress Backup -->
      <div class="arena-box">
        <h3 style="font-size:1.2rem;font-weight:900;color:#fde047;margin-bottom:0.5rem;">☁️ Complete Archive Vault (Google Drive + Local Files)</h3>
        <p style="font-size:0.9rem;color:#cbd5e1;line-height:1.6;margin-bottom:0.85rem;">
          • <strong>Google Drive Cloud Vault (1,505 Files Synced):</strong> <a href="https://drive.google.com/drive/folders/17IiSyMYZttMJkJRcocui3mT8tOnXWwjK" target="_blank" style="color:#38bdf8;font-weight:800;">Open Cloud Vault on Google Drive ↗</a><br>
          • <strong>Local Archive Vault:</strong> Course content rebuilt as 46 playable worlds: short clips, quick checks, no long recordings
        </p>
        <div style="display:flex;gap:0.65rem;flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="window.exportSaveFile()">💾 Export RPG Save (.json)</button>
        </div>
      </div>
    `;
  }

  window.selectCodexTheme = function (idx) {
    selectedThemeIdx = idx;
    renderRoyalCodexScene(document.getElementById("app-main"));
  };

  // =========================================================================
  // SCENE 8: BOUTIQUE DE LUMIÈRE & 20 ROYAL TROPHIES
  // =========================================================================
  function renderBoutiqueAndTrophiesScene(container) {
    const unlocked = TROPHY_DEFS.filter(t => !!save.trophies[t.id]).length;
    container.innerHTML = `
      <div class="arena-box">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;margin-bottom:1rem;">
          <div>
            <h2 style="font-size:1.45rem;font-weight:900;color:#fde047;">🏛️ Boutique de Lumière &amp; Royal Trophy Hall</h2>
            <p style="font-size:0.86rem;color:var(--text-muted);">Spend your Gold on Battle Relics and permanent XP/Gold Perks.</p>
          </div>
          <span class="btn btn-gold">🪙 ${(save.gold || 0).toLocaleString()} Gold Available</span>
        </div>

        <div class="grid-cards">
          <div class="card">
            <div style="font-weight:900;font-size:1.05rem;">⚡ 50/50 Purge Relic (Owned: ${save.inventory.fiftyFifty || 0})</div>
            <p style="font-size:0.84rem;color:var(--text-muted);">Eliminates 2 wrong choices in the 2D Boss Battle Arena.</p>
            <button class="btn btn-gold" onclick="window.buyRelicItem('fiftyFifty', 35)">🪙 Buy +1 (35 Gold)</button>
          </div>
          <div class="card">
            <div style="font-weight:900;font-size:1.05rem;">🛡️ Aegis Shield Relic (Owned: ${save.inventory.shield || 0})</div>
            <p style="font-size:0.84rem;color:var(--text-muted);">Summons a glowing barrier that blocks the next Boss attack.</p>
            <button class="btn btn-gold" onclick="window.buyRelicItem('shield', 40)">🪙 Buy +1 (40 Gold)</button>
          </div>
          <div class="card">
            <div style="font-weight:900;font-size:1.05rem;">🧪 2.5× Crit Elixir (Owned: ${save.inventory.critElixir || 0})</div>
            <p style="font-size:0.84rem;color:var(--text-muted);">Charges your next strike with 2.5× critical damage.</p>
            <button class="btn btn-gold" onclick="window.buyRelicItem('critElixir', 45)">🪙 Buy +1 (45 Gold)</button>
          </div>
          <div class="card">
            <div style="font-weight:900;font-size:1.05rem;">📚 Scholar's Wisdom Perk (Lv.${save.perks.scholarWisdom || 1})</div>
            <p style="font-size:0.84rem;color:var(--text-muted);">Permanently boosts all XP earned across the game by +15% per level.</p>
            <button class="btn btn-primary" onclick="window.upgradeRpgPerk('scholarWisdom', 120)">⬆️ Upgrade (120 Gold)</button>
          </div>
        </div>
      </div>

      <div class="arena-box">
        <h3 style="font-size:1.3rem;font-weight:900;margin-bottom:0.85rem;">🏆 Royal Hall of Trophies (${unlocked} / ${TROPHY_DEFS.length} Unlocked)</h3>
        <div class="grid-cards" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr));">
          ${TROPHY_DEFS.map(t => {
            const ok = !!save.trophies[t.id];
            return `
              <div class="card ${ok ? 'mastered' : ''}" style="opacity:${ok ? '1' : '0.5'};">
                <div style="display:flex;align-items:center;gap:0.75rem;">
                  <span style="font-size:1.8rem;">${t.icon}</span>
                  <div>
                    <div style="font-weight:900;">${escapeHtml(t.title)}</div>
                    <div style="font-size:0.78rem;color:var(--text-muted);">${escapeHtml(t.desc)}</div>
                  </div>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  window.buyRelicItem = function (key, cost) {
    if ((save.gold || 0) < cost) {
      if (window.RPG_VFX) window.RPG_VFX.toast("Not Enough Gold", `Earn more Gold by clearing stages or battling bosses!`, "🪙");
      return;
    }
    save.gold -= cost;
    save.inventory[key] = (save.inventory[key] || 0) + 1;
    if (window.RPG_SFX) window.RPG_SFX.potionUse();
    persistSave();
    renderBoutiqueAndTrophiesScene(document.getElementById("app-main"));
  };

  window.upgradeRpgPerk = function (key, cost) {
    if ((save.gold || 0) < cost) return;
    save.gold -= cost;
    save.perks[key] = (save.perks[key] || 1) + 1;
    if (window.RPG_SFX) window.RPG_SFX.victoryFanfare();
    persistSave();
    renderBoutiqueAndTrophiesScene(document.getElementById("app-main"));
  };

  window.exportSaveFile = function () {
    const blob = new Blob([JSON.stringify(save, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `odyssee_francaise_save_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  window.addEventListener("DOMContentLoaded", () => {
    checkServer().then(() => {
      if (["title", "salon", "radio"].includes(currentScene)) window.navigateScene(currentScene);
    });
    ensureDaily();
    checkTrophies();
    window.navigateScene("title");
  });
})();
