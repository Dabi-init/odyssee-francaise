// =============================================================================
// L'ODYSSÉE FRANÇAISE v14 — « LE CHEMIN »
// One path, one button. Every node is a short interactive session:
//   listen → understand → build → write → speak, with Camille teaching in
//   one-line bubbles (never walls of text). Mistakes come back until fixed.
// Path: Unité 0 (sons) → 62 worlds ordered A1 → C2 → level gates (exams)
//       → Le Grand Examen Natif.
// Also: robust French audio (server cache + fallbacks), microphone scoring,
//       AI-graded writing/speaking via play_server (/api/grade).
// =============================================================================
(function () {
  "use strict";
  const DATA = window.ALEXA_COURSE_DATA || { lessons: [] };
  const TL = window.TUTOR_LESSONS || {};
  const SLD = window.SOUND_LAB_DATA || { bootcamp: [] };
  const GYM = () => window.NATIVE_GYM_DATA || {};
  const EXAMS = () => window.ODYSSEE_EXAMS || {};
  const MISSIONS = () => window.ODYSSEE_MISSIONS || {};
  const DISTRICTS = () => window.PARIS_LIFE_DISTRICTS || [];
  const WRITINGS = () => window.WRITING_MISSIONS || [];
  const C2_RUBRIC = () => window.C2_RUBRIC_MARKERS || { metrics: [], registerUpgrades: [] };
  const RADIO = () => window.RADIO_SHOWS || [];
  const API = () => window.RPG_API || {};
  let fallbackSave = {};
  const SAVE = () => (API().save ? API().save() : fallbackSave);
  const SERVED = /^https?:$/.test(location.protocol);
  const IS_LOCAL_SERVER = /^(127\.0\.0\.1|localhost)$/.test(location.hostname) || location.port === "8765";
  const PRIV_KEY = "srt_ody24_7f9a3e1c8b4d2065a9e4";
  const PRIV_HASH = "f3b2749e4fe39031bed94d90ce85d90a50691d2ef1637d73ae145f66bef9299b";
  const PRIV_STORAGE_KEY = "ODYSSEE_PRIVATE_AUTH_V24";
  const CLOUD_TOPIC = "odyssee_srt_priv24_8e3f9a1c7b2d4065e9a2c4f8";
  const CLOUD_GIST_ID = "6828a599232d8fea3069b7b45a4b14dd";
  const TABLET_PWA_URL = "https://dabi-init.github.io/odyssee-francaise/?k=srt_ody24_7f9a3e1c8b4d2065a9e4&v=27.0";
  const CLOUD_SYNC = {
    hydrated: false,
    syncing: false,
    lastSyncAt: 0,
    lastPushAt: 0,
    status: "ready",
    timer: null
  };

  async function sha256Hex(str) {
    try {
      const buf = new TextEncoder().encode(String(str || ""));
      const hashBuf = await crypto.subtle.digest("SHA-256", buf);
      return Array.from(new Uint8Array(hashBuf)).map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch (e) {
      return "";
    }
  }

  function checkUrlPrivateKey() {
    try {
      const qs = new URLSearchParams(location.search);
      const hs = new URLSearchParams((location.hash || "").replace(/^#/, ""));
      const k = qs.get("k") || hs.get("k");
      if (k === PRIV_KEY) {
        try { localStorage.setItem(PRIV_STORAGE_KEY, PRIV_KEY); } catch (e) {}
        try {
          qs.delete("k");
          const cleanSearch = qs.toString();
          const cleanUrl = location.pathname + (cleanSearch ? "?" + cleanSearch : "");
          window.history.replaceState(null, "", cleanUrl);
        } catch (e) {}
        return true;
      }
    } catch (e) {}
    return false;
  }

  function isPrivateAuthorized() {
    checkUrlPrivateKey();
    if (window.__odyForceGateTest) {
      try { return localStorage.getItem(PRIV_STORAGE_KEY) === PRIV_KEY; } catch (e) { return false; }
    }
    if (IS_LOCAL_SERVER || location.protocol === "file:") return true;
    try {
      return localStorage.getItem(PRIV_STORAGE_KEY) === PRIV_KEY;
    } catch (e) {
      return false;
    }
  }

  async function unlockPrivateGate(emailVal, pinVal) {
    const cleanEmail = String(emailVal || "").trim().toLowerCase();
    const cleanPin = String(pinVal || "").trim().toLowerCase();
    let ok = (cleanEmail === PRIV_KEY.toLowerCase() || cleanPin === PRIV_KEY.toLowerCase());
    if (!ok && cleanEmail && cleanPin) {
      const digest = await sha256Hex(`${cleanEmail}|${cleanPin}`);
      if (digest === PRIV_HASH) ok = true;
    }
    if (ok) {
      try { localStorage.setItem(PRIV_STORAGE_KEY, PRIV_KEY); } catch (e) {}
      window.__odyForceGateTest = false;
      document.body.classList.remove("ody-locked");
      ensureBar();
      renderHome();
      pullFromCloud(true);
      toast("🔓 Accès Privé Autorisé", "Bienvenue ! Votre tablette est déverrouillée de façon permanente.", "👑");
      return true;
    }
    const errEl = document.getElementById("ody-priv-err");
    if (errEl) errEl.textContent = "⛔ Accès refusé : identifiant ou code PIN incorrect.";
    SFX.bad();
    return false;
  }

  function renderPrivateLockGate() {
    document.body.classList.add("ody-locked");
    document.body.dataset.scene = "locked";
    const main = document.getElementById("app-main");
    if (!main) return;
    main.innerHTML = `
      <div class="ody-private-gate" id="ody-private-gate">
        <div class="priv-gate-card">
          <div class="priv-gate-badge">🔒 ESPACE PRIVÉ EXCLUSIF · ACCÈS RESTREINT</div>
          <img src="assets/odyssee_icon.png?v=27.0" class="priv-gate-icon" alt="">
          <h2>L'Odyssée Française · Édition Privée</h2>
          <p class="priv-gate-sub">Cet espace d'apprentissage et sa sauvegarde Cloud sont strictement privés et réservés exclusivement à leur propriétaire. Aucun accès public n'est autorisé.</p>
          <div class="priv-gate-form">
            <label for="ody-priv-in">🔑 Adresse e-mail du propriétaire :</label>
            <input id="ody-priv-in" class="ody-input" type="email" autocomplete="email" spellcheck="false" placeholder="Adresse e-mail autorisée…">
            <label for="ody-priv-pin">🛡️ Code PIN privé :</label>
            <input id="ody-priv-pin" class="ody-input" type="password" autocomplete="current-password" spellcheck="false" placeholder="Code PIN…">
            <button type="button" class="ody-btn primary big" id="ody-priv-btn" data-a2="privunlock">🔓 Déverrouiller cet appareil de façon permanente ▸</button>
            <div class="priv-gate-err" id="ody-priv-err"></div>
          </div>
          <div class="priv-gate-hint">💡 Astuce : ouvrez simplement le raccourci privé dans votre Google Drive pour déverrouiller votre tablette en un tap.</div>
        </div>
      </div>`;
    const inp = document.getElementById("ody-priv-in");
    const pin = document.getElementById("ody-priv-pin");
    const submit = () => unlockPrivateGate(inp ? inp.value : "", pin ? pin.value : "");
    [inp, pin].forEach((el) => {
      if (el) el.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); submit(); } });
    });
  }
  let diskSyncTimer = null;
  let lastDiskSyncAt = 0;

  function compactSaveForCloud(srcSave) {
    if (!srcSave || typeof srcSave !== "object") return {};
    try {
      const copy = JSON.parse(JSON.stringify(srcSave));
      if (copy.chemin && copy.chemin.partial && typeof copy.chemin.partial === "object") {
        const activeId = copy.chemin.activeNodeId;
        const keys = activeId && copy.chemin.partial[activeId] ? [activeId] : Object.keys(copy.chemin.partial).slice(0, 1);
        const slim = {};
        keys.forEach((k) => {
          const p = copy.chemin.partial[k];
          if (p && typeof p === "object") {
            const sp = Object.assign({}, p);
            if (Array.isArray(sp.steps)) {
              sp.stepCount = sp.steps.length;
              delete sp.steps;
            }
            delete sp.secs;
            slim[k] = sp;
          }
        });
        copy.chemin.partial = slim;
      }
      return copy;
    } catch (e) {
      return srcSave;
    }
  }

  function syncToDiskNow(isUnload) {
    if (!SERVED || window.__odySkipUnloadSave) return;
    if (isUnload && Date.now() - lastDiskSyncAt < 180) return;
    lastDiskSyncAt = Date.now();
    try {
      const s = SAVE();
      s.updatedAt = Date.now();
      if (s.chemin && typeof s.chemin === "object") s.chemin.updatedAt = s.updatedAt;
      if (IS_LOCAL_SERVER) {
        const payload = JSON.stringify({ save: s });
        if (isUnload && navigator.sendBeacon && payload.length < 60000) {
          const blob = new Blob([payload], { type: "application/json" });
          if (navigator.sendBeacon("/api/save", blob)) return;
        }
        fetch("/api/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: !!isUnload })
          .then((r) => r.text())
          .catch(() => {});
      } else if (CLOUD_SYNC.hydrated && !window.__odySkipCloudSync) {
        scheduleCloudPush(isUnload);
      }
    } catch (e) {}
  }

  function scheduleCloudPush(immediate) {
    if (window.__odySkipCloudSync || !SERVED) return;
    if (CLOUD_SYNC.timer) { clearTimeout(CLOUD_SYNC.timer); CLOUD_SYNC.timer = null; }
    if (immediate) {
      pushToCloudNow(true);
      return;
    }
    CLOUD_SYNC.timer = setTimeout(() => {
      CLOUD_SYNC.timer = null;
      pushToCloudNow(false);
    }, 350);
  }

  async function pushToCloudNow(isUnload) {
    if (window.__odySkipCloudSync || !SERVED || !CLOUD_SYNC.hydrated || !isPrivateAuthorized()) return false;
    const now = Date.now();
    if (!isUnload && now - CLOUD_SYNC.lastPushAt < 400) return false;
    CLOUD_SYNC.lastPushAt = now;
    const slim = compactSaveForCloud(SAVE());
    slim.updatedAt = now;
    const raw = JSON.stringify(slim);
    try {
      if (IS_LOCAL_SERVER) {
        const r = await fetch("/api/cloud-vault", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ save: slim }),
          keepalive: !!isUnload
        });
        const j = await r.json();
        if (j && j.ok && j.data) mergeExternalSave(j.data);
        CLOUD_SYNC.lastSyncAt = Date.now();
        CLOUD_SYNC.status = "synced";
        updateCloudPill();
        return true;
      }
      const hdrs = { "Content-Type": "text/plain;charset=utf-8" };
      if (raw.length >= 3800) hdrs["Filename"] = "save_data.json";
      await fetch(`https://ntfy.sh/${CLOUD_TOPIC}`, {
        method: "POST",
        headers: hdrs,
        body: raw,
        keepalive: !!isUnload
      }).then((r) => r.text());
      CLOUD_SYNC.lastSyncAt = Date.now();
      CLOUD_SYNC.status = "synced";
      updateCloudPill();
      return true;
    } catch (e) {
      CLOUD_SYNC.status = "offline";
      updateCloudPill();
      return false;
    }
  }

  async function pullFromCloud(showFeedback) {
    if (!isPrivateAuthorized()) {
      CLOUD_SYNC.hydrated = false;
      return false;
    }
    if (!SERVED || window.__odySkipCloudSync) {
      CLOUD_SYNC.hydrated = true;
      return false;
    }
    CLOUD_SYNC.syncing = true;
    CLOUD_SYNC.status = "syncing";
    updateCloudPill();
    let anyMerged = false;
    try {
      if (IS_LOCAL_SERVER) {
        try {
          const r = await fetch("/api/cloud-vault", { cache: "no-store" });
          const j = await r.json();
          if (j && j.ok && j.data && mergeExternalSave(j.data)) anyMerged = true;
        } catch (e) {}
      } else {
        // 1. Pull permanent GitHub Gist snapshot (unauthenticated GET)
        try {
          const gr = await fetch(`https://api.github.com/gists/${CLOUD_GIST_ID}`, { cache: "no-store" });
          if (gr.ok) {
            const gj = await gr.json();
            const files = (gj && gj.files) || {};
            const fobj = files["odyssee_cloud_save.json"] || files[Object.keys(files)[0]];
            if (fobj && fobj.content) {
              const gSave = JSON.parse(fobj.content);
              if (mergeExternalSave(gSave)) anyMerged = true;
            }
          }
        } catch (e) {}
        // 2. Pull live two-way ntfy.sh channel messages (Tablet <-> Laptop)
        let ntfyCount = 0;
        let ntfyMaxXp = -1;
        try {
          const nr = await fetch(`https://ntfy.sh/${CLOUD_TOPIC}/json?poll=1&since=1700000000`, { cache: "no-store" });
          if (nr.ok) {
            const txt = await nr.text();
            const lines = txt.split("\n").map((l) => l.trim()).filter(Boolean).slice(-6);
            for (const ln of lines) {
              try {
                const ev = JSON.parse(ln);
                if (ev.event !== "message") continue;
                ntfyCount += 1;
                if (ev.message && ev.message.startsWith("{")) {
                  const nSave = JSON.parse(ev.message);
                  if (typeof nSave.xp === "number" && nSave.xp > ntfyMaxXp) ntfyMaxXp = nSave.xp;
                  if (mergeExternalSave(nSave)) anyMerged = true;
                } else if (ev.attachment && ev.attachment.url) {
                  const ar = await fetch(ev.attachment.url, { cache: "no-store" });
                  if (ar.ok) {
                    const aSave = await ar.json();
                    if (typeof aSave.xp === "number" && aSave.xp > ntfyMaxXp) ntfyMaxXp = aSave.xp;
                    if (mergeExternalSave(aSave)) anyMerged = true;
                  }
                }
              } catch (e) {}
            }
          }
        } catch (e) {}
        // Auto-rebroadcast if 12h ntfy.sh cache expired or this device has richer progress
        CLOUD_SYNC.hydrated = true;
        if ((ntfyCount === 0 || (SAVE().xp || 0) > ntfyMaxXp) && (SAVE().xp || 0) > 0) {
          pushToCloudNow(false);
        }
      }
      CLOUD_SYNC.hydrated = true;
      CLOUD_SYNC.syncing = false;
      CLOUD_SYNC.lastSyncAt = Date.now();
      CLOUD_SYNC.status = "synced";
      updateCloudPill();
      if (anyMerged) {
        buildPath();
        updateBar();
        if (!SES && document.body.dataset.scene === "home" && !$("ody-sheet") && !$("ody-drawer")) renderHome();
        if (showFeedback) toast("☁️ Synchronisé (Tablette ↔ PC)", "Votre progression la plus récente a été chargée avec succès.", "☁️");
      } else if (showFeedback) {
        toast("☁️ Synchronisation à jour", "Tablette Redmi Pad 2 Pro 5G et PC sont 100% alignés.", "✅");
      }
      return anyMerged;
    } catch (e) {
      CLOUD_SYNC.hydrated = true;
      CLOUD_SYNC.syncing = false;
      CLOUD_SYNC.status = "offline";
      updateCloudPill();
      return false;
    }
  }

  function updateCloudPill() {
    const el = document.getElementById("ob-cloud-pill");
    if (!el) return;
    const st = CLOUD_SYNC.status;
    el.innerHTML = st === "syncing" ? "☁️ Sync…" : st === "offline" ? "☁️ Local" : "☁️ Sync ✓";
    el.classList.toggle("ok", st === "synced");
  }

  const persist = () => {
    const s = SAVE();
    s.updatedAt = Date.now();
    if (s.chemin && typeof s.chemin === "object") s.chemin.updatedAt = s.updatedAt;
    try { localStorage.setItem("ODYSSEE_FRANCAISE_SAVE_V4", JSON.stringify(s)); } catch (e) {}
    try { API().persistSave && API().persistSave(); } catch (e) {}
    if (SERVED) {
      if (diskSyncTimer) clearTimeout(diskSyncTimer);
      diskSyncTimer = setTimeout(() => { diskSyncTimer = null; syncToDiskNow(false); }, 80);
    }
  };
  function mergeExternalSave(ext) {
    if (!ext || typeof ext !== "object") return false;
    const s = SAVE();
    let changed = false;
    const extTime = ext.updatedAt || (ext.chemin && ext.chemin.updatedAt) || 0;
    const curTime = s.updatedAt || (s.chemin && s.chemin.updatedAt) || 0;
    ["xp", "streak", "maxCombo"].forEach((k) => {
      if (typeof ext[k] === "number" && ext[k] > (s[k] || 0)) { s[k] = ext[k]; changed = true; }
    });
    if (typeof ext.gold === "number") {
      if ((extTime > curTime && ext.gold !== s.gold) || ext.gold > (s.gold || 0)) {
        s.gold = ext.gold;
        changed = true;
      }
    }
    if (extTime > curTime) s.updatedAt = extTime;
    if (ext.freeRoamUnlocked && !s.freeRoamUnlocked) { s.freeRoamUnlocked = true; changed = true; }
    ["clearedStages", "masteredLessons", "tutorDone", "practicedPhrases", "fsrsCards", "mistakeVault", "trophies", "clearedDistricts", "completedWritings", "perks", "inventory"].forEach((mapKey) => {
      if (ext[mapKey] && typeof ext[mapKey] === "object") {
        s[mapKey] = s[mapKey] || {};
        Object.keys(ext[mapKey]).forEach((k) => {
          if (s[mapKey][k] === undefined || (typeof ext[mapKey][k] === "number" && ext[mapKey][k] > (s[mapKey][k] || 0))) {
            s[mapKey][k] = ext[mapKey][k];
            changed = true;
          }
        });
      }
    });
    if (ext.bootcamp && ext.bootcamp.done) {
      s.bootcamp = s.bootcamp || {}; s.bootcamp.done = s.bootcamp.done || {};
      Object.keys(ext.bootcamp.done).forEach((k) => { if (!s.bootcamp.done[k]) { s.bootcamp.done[k] = ext.bootcamp.done[k]; changed = true; } });
    }
    const ec = ext.chemin;
    if (ec && typeof ec === "object") {
      if (!s.chemin || typeof s.chemin !== "object") s.chemin = {};
      const c = s.chemin;
      c.done = c.done || {}; c.plays = c.plays || {}; c.gates = c.gates || {}; c.skills = c.skills || {}; c.partial = c.partial || {};
      if (ec.done) Object.keys(ec.done).forEach((k) => { if ((ec.done[k] || 0) > (c.done[k] || 0)) { c.done[k] = ec.done[k]; changed = true; } });
      if (ec.plays) Object.keys(ec.plays).forEach((k) => { if ((ec.plays[k] || 0) > (c.plays[k] || 0)) { c.plays[k] = ec.plays[k]; changed = true; } });
      if (ec.gates) Object.keys(ec.gates).forEach((k) => {
        const eg = ec.gates[k], cg = c.gates[k];
        if (eg && (!cg || (eg.passed && !cg.passed) || ((eg.best || eg.score || 0) > (cg.best || cg.score || 0)))) { c.gates[k] = eg; changed = true; }
      });
      if (ec.skills) Object.keys(ec.skills).forEach((k) => {
        const es = ec.skills[k], cs = c.skills[k];
        if (es && (!cs || (es.n || 0) > (cs.n || 0))) { c.skills[k] = es; changed = true; }
      });
      if (ec.partial) Object.keys(ec.partial).forEach((k) => {
        const ep = ec.partial[k], cp = c.partial[k];
        if (ep && !c.done[k] && (!cp || (ep.savedAt || 0) > (cp.savedAt || 0))) { c.partial[k] = ep; changed = true; }
      });
      if (ec.activeNodeId && !c.done[ec.activeNodeId] && (!c.activeNodeId || (ec.partial && ec.partial[ec.activeNodeId] && (!c.partial[c.activeNodeId] || (ec.partial[ec.activeNodeId].savedAt || 0) >= (c.partial[c.activeNodeId].savedAt || 0))))) {
        c.activeNodeId = ec.activeNodeId; changed = true;
      }
      if (typeof ec.reputation === "number" && ec.reputation > (c.reputation || 0)) { c.reputation = ec.reputation; changed = true; }
      if (ec.inspected && typeof ec.inspected === "object") {
        c.inspected = c.inspected || {};
        Object.keys(ec.inspected).forEach((k) => { if (!c.inspected[k] && ec.inspected[k]) { c.inspected[k] = ec.inspected[k]; changed = true; } });
      }
      if (ec.contractsDate === today() && ec.contractsClaimed && typeof ec.contractsClaimed === "object") {
        c.contractsDate = today();
        c.contractsClaimed = c.contractsClaimed || {};
        Object.keys(ec.contractsClaimed).forEach((k) => { if (!c.contractsClaimed[k] && ec.contractsClaimed[k]) { c.contractsClaimed[k] = ec.contractsClaimed[k]; changed = true; } });
      }
      if (ec.daily && ec.daily.date === today()) {
        if (!c.daily || c.daily.date !== today() || (ec.daily.xp || 0) > (c.daily.xp || 0)) { c.daily = ec.daily; changed = true; }
      }
      if (Array.isArray(ec.portfolio) && (!Array.isArray(c.portfolio) || ec.portfolio.length > c.portfolio.length)) { c.portfolio = ec.portfolio; changed = true; }
      if (ec.microDone && typeof ec.microDone === "object") {
        c.microDone = c.microDone || {};
        Object.keys(ec.microDone).forEach((nid) => {
          if (ec.microDone[nid] && typeof ec.microDone[nid] === "object") {
            c.microDone[nid] = c.microDone[nid] || {};
            Object.keys(ec.microDone[nid]).forEach((ci) => {
              if (!c.microDone[nid][ci] && ec.microDone[nid][ci]) {
                c.microDone[nid][ci] = ec.microDone[nid][ci];
                changed = true;
              }
            });
          }
        });
      }
      if (ec.unlockedLevels && typeof ec.unlockedLevels === "object") {
        c.unlockedLevels = c.unlockedLevels || {};
        Object.keys(ec.unlockedLevels).forEach((k) => { if (!c.unlockedLevels[k] && ec.unlockedLevels[k]) { c.unlockedLevels[k] = ec.unlockedLevels[k]; changed = true; } });
      }
      if (ec.unlockedNodes && typeof ec.unlockedNodes === "object") {
        c.unlockedNodes = c.unlockedNodes || {};
        Object.keys(ec.unlockedNodes).forEach((k) => { if (!c.unlockedNodes[k] && ec.unlockedNodes[k]) { c.unlockedNodes[k] = ec.unlockedNodes[k]; changed = true; } });
      }
      if (ec.pathMode && !c.pathMode) { c.pathMode = ec.pathMode; changed = true; }
      if (typeof ec.capsulesCleared === "number" && ec.capsulesCleared > (c.capsulesCleared || 0)) { c.capsulesCleared = ec.capsulesCleared; changed = true; }
      if (typeof ec.totalStepsRight === "number" && ec.totalStepsRight > (c.totalStepsRight || 0)) { c.totalStepsRight = ec.totalStepsRight; changed = true; }
      if (typeof ec.frenzyCharges === "number" && ec.frenzyCharges > (c.frenzyCharges || 0)) { c.frenzyCharges = ec.frenzyCharges; changed = true; }
      if (typeof ec.lootBoxesOpened === "number" && ec.lootBoxesOpened > (c.lootBoxesOpened || 0)) { c.lootBoxesOpened = ec.lootBoxesOpened; changed = true; }
      if (ec.bonds && typeof ec.bonds === "object") {
        c.bonds = c.bonds || {};
        Object.keys(ec.bonds).forEach((k) => {
          if (typeof ec.bonds[k] === "number" && ec.bonds[k] > (c.bonds[k] || 0)) { c.bonds[k] = ec.bonds[k]; changed = true; }
        });
      }
      if (ec.chroniquesDone && typeof ec.chroniquesDone === "object") {
        c.chroniquesDone = c.chroniquesDone || {};
        Object.keys(ec.chroniquesDone).forEach((k) => {
          if (!c.chroniquesDone[k] && ec.chroniquesDone[k]) { c.chroniquesDone[k] = ec.chroniquesDone[k]; changed = true; }
        });
      }
      if (ec.levelSkills && typeof ec.levelSkills === "object") {
        c.levelSkills = c.levelSkills || {};
        Object.keys(ec.levelSkills).forEach((lv) => {
          if (ec.levelSkills[lv] && typeof ec.levelSkills[lv] === "object") {
            c.levelSkills[lv] = c.levelSkills[lv] || {};
            Object.keys(ec.levelSkills[lv]).forEach((sk) => {
              const es = ec.levelSkills[lv][sk], cs = c.levelSkills[lv][sk];
              if (es && (!cs || (es.n || 0) > (cs.n || 0))) { c.levelSkills[lv][sk] = es; changed = true; }
            });
          }
        });
      }
      if (ec.sealsClaimed && typeof ec.sealsClaimed === "object") {
        c.sealsClaimed = c.sealsClaimed || {};
        Object.keys(ec.sealsClaimed).forEach((k) => { if (!c.sealsClaimed[k] && ec.sealsClaimed[k]) { c.sealsClaimed[k] = ec.sealsClaimed[k]; changed = true; } });
      }
      if (ec.equippedTitle && !c.equippedTitle) { c.equippedTitle = ec.equippedTitle; changed = true; }
      if (ec.name && !c.name) { c.name = ec.name; changed = true; }
      if (ec.onboarded && !c.onboarded) { c.onboarded = true; changed = true; }
    }
    if (changed) try { localStorage.setItem("ODYSSEE_FRANCAISE_SAVE_V4", JSON.stringify(s)); } catch (e) {}
    return changed;
  }
  window.addEventListener("pagehide", () => {
    if (diskSyncTimer) {
      clearTimeout(diskSyncTimer);
      diskSyncTimer = null;
      syncToDiskNow(true);
    }
  });
  const CEFR = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const LEVELS = CEFR.concat(["NATIF"]);
  const cefrRank = (c) => { const i = LEVELS.indexOf(String(c || "A1").toUpperCase().slice(0, c && String(c).toUpperCase().startsWith("NATIF") ? 5 : 2)); return i < 0 ? 0 : i; };
  const PORTRAIT = "assets/tutor_camille.jpg";

  // ------------------------------------------------------------------ utils
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const today = (off = 0) => { const d = new Date(Date.now() + off * 86400000); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  const words = (s) => String(s || "").trim().split(/\s+/).filter(Boolean);
  const normLoose = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[’`ʼ‘]/g, "'").replace(/œ/g, "oe").replace(/æ/g, "ae")
    .replace(/[«»"“”.,!?¡¿;:()\[\]…–—\-\/]/g, " ").replace(/'/g, " ").replace(/\s+/g, " ").trim();
  const normAcc = (s) => String(s || "").toLowerCase().normalize("NFC")
    .replace(/[’`ʼ‘]/g, "'").replace(/[«»"“”.,!?¡¿;:()\[\]…–—\-\/]/g, " ").replace(/'/g, " ").replace(/\s+/g, " ").trim();
  function levenshtein(a, b) {
    if (a === b) return 0;
    const m = a.length, n = b.length;
    if (!m) return n; if (!n) return m;
    let prev = new Array(n + 1), cur = new Array(n + 1);
    for (let j = 0; j <= n; j++) prev[j] = j;
    for (let i = 1; i <= m; i++) {
      cur[0] = i;
      for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      [prev, cur] = [cur, prev];
    }
    return prev[n];
  }
  // Judge a typed answer against one or more accepted answers.
  function judgeText(user, answers) {
    const list = (Array.isArray(answers) ? answers : [answers]).filter(Boolean).map((a) => firstAlt(a));
    const uA = normAcc(user), uL = normLoose(user);
    if (!uL) return { ok: false, empty: true, best: list[0] || "" };
    let best = list[0] || "", bestD = 1e9;
    for (const a of list) {
      if (normAcc(a) === uA) return { ok: true, exact: true, best: a };
      const d = levenshtein(uL, normLoose(a));
      if (d < bestD) { bestD = d; best = a; }
    }
    if (bestD === 0) return { ok: true, accent: true, best };
    const len = normLoose(best).length;
    if (len >= 6 && bestD <= Math.max(1, Math.floor(len * 0.07))) return { ok: true, typo: true, best };
    return { ok: false, best, dist: bestD };
  }
  // spelling differences you cannot hear (il/ils, -ait/-aient, -é/-er/-ez, silent plural s)
  function homNorm(s) {
    return normLoose(s).split(" ").map((w) => w.replace(/^(il|elle)s$/, "$1").replace(/(aient|ais|ait)$/, "e").replace(/(er|ez|ee|es|e)$/, "e").replace(/s$/, "")).join(" ");
  }
  function firstAlt(fr) {
    // "le vélo / la bicyclette (f)" → "le vélo"
    return String(fr || "").split(/\s*\/\s*|\s\|\s/).filter((x) => x.trim().length > 1)[0] || String(fr || "").replace(/\((?:m|f|pl|sing|formal|informal|masc|fem|fam|courant|soutenu|familier|lit)\.?\)/gi, "").replace(/\s+/g, " ").trim();
  }
  function diffUseful(user, target) { const u = new Set(words(normLoose(user))); return words(target).some((w) => u.has(normLoose(w))); }
  function diffHtml(user, target) {
    const t = words(target), u = new Set(words(normLoose(user)));
    return t.map((w) => (u.has(normLoose(w)) ? `<span class="dw-ok">${esc(w)}</span>` : `<span class="dw-miss">${esc(w)}</span>`)).join(" ");
  }
  // «French» → tappable, audible span; rest escaped. **bold** supported.
  function rich(text) {
    const s = String(text || "");
    let out = "", last = 0;
    s.replace(/«\s*([^»]+?)\s*»/g, (m, fr, idx) => {
      out += esc(s.slice(last, idx));
      out += `<span class="fr-tap" data-a="say" data-t="${esc(fr)}">«${esc(fr)}»</span>`;
      last = idx + m.length; return m;
    });
    out += esc(s.slice(last));
    return out.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br>");
  }
  const frBits = (text) => { const out = []; String(text || "").replace(/«\s*([^»]+?)\s*»/g, (m, fr) => { out.push(fr); return m; }); return out; };
  function splitSentences(text, max = 190) {
    const t = String(text || "").replace(/\s+/g, " ").trim();
    if (t.length <= max) return [t];
    const parts = t.match(/[^.!?]+(?:[.!?]+(?:\s*»)?|$)/g) || [t];
    const out = []; let cur = "";
    for (const p of parts) {
      if ((cur + " " + p).trim().length <= max) cur = (cur + " " + p).trim();
      else { if (cur) out.push(cur); cur = p.trim(); }
    }
    if (cur) out.push(cur);
    return out;
  }
  const PRAISE = ["Bravo !", "Parfait !", "Exactement !", "Très bien !", "Impeccable !", "Génial !", "Super !", "Nickel !"];
  const OOPS = ["Pas tout à fait…", "Presque !", "Pas encore…", "Oups !"];

  // ------------------------------------------------------------------ SFX (tiny WebAudio, respects mute)
  const SFX = {
    ctx: null,
    muted() { return !!(window.RPG_SFX && window.RPG_SFX.muted); },
    tone(f, d = 0.12, type = "sine", g = 0.08, when = 0) {
      if (this.muted()) return;
      try {
        this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
        const t = this.ctx.currentTime + when, o = this.ctx.createOscillator(), v = this.ctx.createGain();
        o.type = type; o.frequency.setValueAtTime(f, t);
        v.gain.setValueAtTime(g, t); v.gain.exponentialRampToValueAtTime(0.0001, t + d);
        o.connect(v); v.connect(this.ctx.destination); o.start(t); o.stop(t + d + 0.02);
      } catch (e) {}
    },
    ok() { this.tone(660, 0.1, "sine", 0.07); this.tone(990, 0.16, "sine", 0.07, 0.08); },
    bad() { this.tone(200, 0.18, "square", 0.04); this.tone(150, 0.22, "square", 0.04, 0.1); },
    tap() { this.tone(520, 0.05, "triangle", 0.04); },
    win() { [523, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.22, "triangle", 0.07, i * 0.11)); },
    combo(n) { this.tone(700 + Math.min(n, 10) * 60, 0.09, "sine", 0.06); }
  };

  // =================================================================== AUDIO
  // Google neural French voice. In served mode the local server fetches and
  // caches every clip (fixes the 404 Google returns for a 127.0.0.1 Referer).
  const AUDIO = { token: 0, cur: null, cancel: null, failStreak: 0, lastText: "", blocked: false };
  function splitChunks(text, maxLen = 180) {
    const clean = String(text || "").replace(/‿/g, " ").replace(/\*+/g, "")
      .replace(/\((?:m|f|pl|sing|formal|informal|masc|fem|fam|courant|soutenu|familier)[^)]*\)/gi, "")
      .replace(/[«»]/g, "").replace(/\s+/g, " ").trim();
    if (!clean) return [];
    if (clean.length <= maxLen) return [clean];
    const parts = clean.split(/(?<=[.!?…;:,])\s+/);
    const out = []; let cur = "";
    for (const p of parts) {
      if ((cur + " " + p).trim().length <= maxLen) cur = (cur + " " + p).trim();
      else { if (cur) out.push(cur); let rest = p; while (rest.length > maxLen) { const k = rest.lastIndexOf(" ", maxLen); out.push(rest.slice(0, k > 40 ? k : maxLen)); rest = rest.slice(k > 40 ? k + 1 : maxLen); } cur = rest; }
    }
    if (cur) out.push(cur);
    return out;
  }
  const proxyUrl = (t, slow) => `/api/tts?slow=${slow ? 1 : 0}&q=${encodeURIComponent(t)}`;
  const directUrl = (t, slow) => `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=tw-ob&tl=fr&ttsspeed=${slow ? "0.24" : "1"}&q=${encodeURIComponent(t)}`;
  function stopAudio() {
    AUDIO.token += 1;
    if (AUDIO.cancel) { try { AUDIO.cancel(); } catch (e) {} AUDIO.cancel = null; }
    try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) {}
  }
  function playUrl(url, rate) {
    return new Promise((resolve, reject) => {
      const a = new Audio();
      a.preload = "auto";
      try { a.referrerPolicy = "no-referrer"; } catch (e) {}
      a.src = url;
      a.playbackRate = rate || 1;
      let done = false;
      const fin = (fn, v) => { if (done) return; done = true; a.onended = a.onerror = null; AUDIO.cancel = null; fn(v); };
      AUDIO.cur = a;
      AUDIO.cancel = () => { try { a.pause(); } catch (e) {} fin(resolve, "cancel"); };
      a.onended = () => fin(resolve, "end");
      a.onerror = () => fin(reject, new Error("media-error"));
      const p = a.play();
      if (p && p.catch) p.catch((err) => fin(reject, err));
      setTimeout(() => { if (!done && a.readyState === 0) fin(reject, new Error("timeout")); }, 9000);
    });
  }
  let naturalVoice;
  function findNaturalVoice() {
    if (naturalVoice !== undefined) return naturalVoice;
    try {
      const vs = (window.speechSynthesis && window.speechSynthesis.getVoices()) || [];
      naturalVoice = vs.find((v) => /^fr/i.test(v.lang) && /google/i.test(v.name)) || vs.find((v) => /^fr/i.test(v.lang) && /(natural|online|neural)/i.test(v.name)) || null;
      if (!vs.length) naturalVoice = undefined;
    } catch (e) { naturalVoice = null; }
    return naturalVoice || null;
  }
  function speakNatural(text, rate, my) {
    // Last resort only: Google / Microsoft *neural* voices — never the robotic default voice.
    return new Promise((resolve) => {
      const v = findNaturalVoice();
      if (!v || !window.speechSynthesis) return resolve(false);
      const u = new SpeechSynthesisUtterance(text);
      u.voice = v; u.lang = v.lang; u.rate = rate < 0.8 ? 0.75 : 1;
      u.onend = () => resolve(true); u.onerror = () => resolve(false);
      AUDIO.cancel = () => { try { window.speechSynthesis.cancel(); } catch (e) {} resolve(true); };
      window.speechSynthesis.speak(u);
    });
  }
  async function speak(text, rate = 1) {
    const chunks = splitChunks(text);
    if (!chunks.length) return;
    stopAudio();
    const my = AUDIO.token;
    AUDIO.lastText = text;
    const slow = rate < 0.8;
    const pr = slow ? 0.95 : (rate > 1.05 ? rate : 1);
    setSpeaking(true);
    try {
      for (const c of chunks) {
        if (my !== AUDIO.token) return;
        let ok = false;
        const urls = IS_LOCAL_SERVER ? [proxyUrl(c, slow), directUrl(c, slow)] : [directUrl(c, slow)];
        for (const u of urls) {
          try { await playUrl(u, pr); ok = true; break; }
          catch (err) {
            if (my !== AUDIO.token) return;
            if (err && err.name === "NotAllowedError") { showAudioUnlock(text, rate); return; }
          }
        }
        if (!ok && my === AUDIO.token) ok = await speakNatural(c, rate, my);
        if (!ok) { AUDIO.failStreak += 1; if (AUDIO.failStreak >= 2) audioFailNotice(); return; }
        AUDIO.failStreak = 0; AUDIO.blocked = false;
        // prefetch is handled by the server cache; nothing else to do
      }
    } finally { if (my === AUDIO.token) setSpeaking(false); }
  }
  function prefetch(text, slow) {
    if (!IS_LOCAL_SERVER || !text) return;
    splitChunks(text).forEach((c) => { try { fetch(proxyUrl(c, !!slow)).catch(() => {}); } catch (e) {} });
  }
  function setSpeaking(on) { document.body.classList.toggle("ody-speaking", !!on); }
  function showAudioUnlock(text, rate) {
    AUDIO.blocked = true;
    let pill = document.getElementById("ody-audio-unlock");
    if (!pill) {
      pill = document.createElement("button");
      pill.id = "ody-audio-unlock"; pill.className = "ody-audio-unlock";
      document.body.appendChild(pill);
    }
    pill.innerHTML = "🔊 Tap to turn on French audio";
    pill.onclick = () => { pill.remove(); AUDIO.blocked = false; speak(text || "Bonjour !", rate || 1); };
  }
  let failShown = 0;
  function audioFailNotice() {
    if (Date.now() - failShown < 30000) return;
    failShown = Date.now();
    toast("🔇 Audio unavailable", SERVED ? "No internet connection to the French voice. Check your connection; clips you've heard before still play." : "Open the game with the desktop shortcut “L'Odyssée Française” for reliable audio.", "🔇");
  }
  window.ODY_SPEAK = (t, r) => speak(t, r);
  window.ODY_AUDIO = { speak, stop: stopAudio, prefetch, state: () => ({ served: SERVED, failStreak: AUDIO.failStreak, blocked: AUDIO.blocked, last: AUDIO.lastText }) };
  if (window.speechSynthesis) { try { window.speechSynthesis.onvoiceschanged = () => { naturalVoice = undefined; }; } catch (e) {} }

  function toast(title, desc, icon) {
    const stk = document.getElementById("toast-stack");
    if (stk) { while (stk.children.length >= 1) stk.removeChild(stk.firstChild); }
    if (window.RPG_VFX && window.RPG_VFX.toast) window.RPG_VFX.toast(title, desc, icon || "✨");
  }

  // =================================================================== MICROPHONE
  const SRClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  const MIC = { rec: null, active: false };
  function micSupported() { return !!SRClass; }
  const NUM_FR = { 0: "zéro", 1: "un", 2: "deux", 3: "trois", 4: "quatre", 5: "cinq", 6: "six", 7: "sept", 8: "huit", 9: "neuf", 10: "dix", 11: "onze", 12: "douze", 13: "treize", 14: "quatorze", 15: "quinze", 16: "seize", 17: "dix-sept", 18: "dix-huit", 19: "dix-neuf", 20: "vingt", 30: "trente", 40: "quarante", 50: "cinquante", 60: "soixante", 100: "cent" };
  const spokenNorm = (s) => normLoose(String(s || "").replace(/\b(\d{1,3})\b/g, (m, d) => NUM_FR[+d] || m));
  function speechScore(said, target) {
    const a = spokenNorm(said).split(" ").filter(Boolean), b = spokenNorm(target).split(" ").filter(Boolean);
    if (!b.length || !a.length) return 0;
    // LCS on words, tolerant to one-letter recognition slips
    const eq = (x, y) => x === y || (x.length > 3 && y.length > 3 && levenshtein(x, y) <= 1);
    const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) dp[i][j] = eq(a[i - 1], b[j - 1]) ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    const lcs = dp[a.length][b.length];
    return lcs / Math.max(b.length, a.length * 0.85);
  }
  function micStop() { if (MIC.rec) { try { MIC.rec.stop(); } catch (e) {} } }
  // opts: {continuous, onInterim(text), onFinal(alts[]), onError(code), onEnd()}
  function micListen(opts) {
    if (!SRClass) { opts.onError && opts.onError("unsupported"); return null; }
    stopAudio();
    micStop();
    const rec = new SRClass();
    rec.lang = "fr-FR"; rec.interimResults = true; rec.maxAlternatives = 5; rec.continuous = !!opts.continuous;
    let finalText = "", alts = [];
    rec.onresult = (ev) => {
      let interim = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const r = ev.results[i];
        if (r.isFinal) {
          finalText += (finalText ? " " : "") + r[0].transcript.trim();
          if (!opts.continuous) { alts = []; for (let k = 0; k < r.length; k++) alts.push(r[k].transcript.trim()); }
        } else interim += r[0].transcript;
      }
      opts.onInterim && opts.onInterim((finalText + " " + interim).trim());
    };
    rec.onerror = (e) => { MIC.active = false; opts.onError && opts.onError(e.error || "error"); };
    rec.onend = () => {
      MIC.active = false; MIC.rec = null;
      document.body.classList.remove("ody-listening");
      if (opts.continuous) opts.onFinal && opts.onFinal([finalText]);
      else opts.onFinal && opts.onFinal(alts.length ? alts : (finalText ? [finalText] : []));
      opts.onEnd && opts.onEnd();
    };
    try { rec.start(); MIC.rec = rec; MIC.active = true; document.body.classList.add("ody-listening"); }
    catch (e) { opts.onError && opts.onError("start-failed"); return null; }
    return rec;
  }
  const MIC_ERR = {
    "not-allowed": "Microphone blocked. Click the 🔒/🎙️ icon in the address bar and allow the microphone, then try again.",
    "service-not-allowed": "Microphone blocked by the browser. Allow it in the address bar settings.",
    "network": "Speech recognition needs internet. Check your connection.",
    "no-speech": "I didn't hear anything. Speak a little louder, close to the mic.",
    "audio-capture": "No microphone found. Plug one in or check Windows sound settings.",
    "unsupported": "This browser has no French speech recognition. Use Google Chrome or Microsoft Edge.",
    "start-failed": "The microphone couldn't start. Try again in a second."
  };
  // Record-and-compare fallback (works without speech recognition)
  async function recordClip(seconds) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const rec = new MediaRecorder(stream); const chunks = [];
    rec.ondataavailable = (e) => chunks.push(e.data);
    const done = new Promise((r) => (rec.onstop = r));
    rec.start(); setTimeout(() => rec.state !== "inactive" && rec.stop(), seconds * 1000);
    await done; stream.getTracks().forEach((t) => t.stop());
    return URL.createObjectURL(new Blob(chunks, { type: rec.mimeType || "audio/webm" }));
  }

  // =================================================================== SERVER
  const SRV = { checked: false, ai: false, up: false };
  async function checkServer() {
    if (!SERVED || !IS_LOCAL_SERVER) { SRV.checked = true; SRV.up = SERVED; SRV.ai = false; return SRV; }
    try { const r = await fetch("/api/status", { cache: "no-store" }); const j = await r.json(); SRV.up = !!j.server; SRV.ai = !!j.ai; } catch (e) { SRV.up = false; SRV.ai = false; }
    SRV.checked = true; return SRV;
  }
  async function aiGrade(payload) {
    if (!SERVED || !IS_LOCAL_SERVER) return { ok: false, error: "OFFLINE" };
    const ctl = window.AbortController ? new AbortController() : null;
    const timer = setTimeout(() => ctl && ctl.abort(), 70000);
    try {
      const r = await fetch("/api/grade", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: ctl ? ctl.signal : undefined });
      return await r.json();
    } catch (e) { return { ok: false, error: "NETWORK" }; }
    finally { clearTimeout(timer); }
  }

  // =================================================================== STATE
  function hasPartialProgress(part) {
    if (!part) return false;
    if (!Array.isArray(part.steps) || !part.steps.length) {
      return !!(part.i > 0 && (part.stepCount || 99) > part.i);
    }
    if (part.i > 0 && part.i < part.steps.length) return true;
    if (part.i === 0) {
      const s0 = part.steps[0] || {};
      if (part.graded > 0 || part.xp > 0 || s0._val || s0._text || s0._transcript || (s0._picked && s0._picked.length) || (s0._done && Object.keys(s0._done).length) || (s0._rev && s0._rev > 0) || (s0._inspected && Object.keys(s0._inspected).length) || (s0._phase && s0._phase > 0)) return true;
    }
    return false;
  }
  function CH() {
    const s = SAVE();
    if (!s.chemin || typeof s.chemin !== "object") s.chemin = {};
    const c = s.chemin;
    c.done = c.done || {}; c.gates = c.gates || {}; c.skills = c.skills || {}; c.plays = c.plays || {};
    c.partial = c.partial || {};
    c.inspected = c.inspected || {};
    c.microDone = c.microDone || {};
    c.pathMode = c.pathMode || "royal";
    c.unlockedLevels = c.unlockedLevels || {};
    c.unlockedNodes = c.unlockedNodes || {};
    if (c.capsulesCleared == null) c.capsulesCleared = 0;
    if (c.totalStepsRight == null) c.totalStepsRight = 0;
    if (c.frenzyCharges == null) c.frenzyCharges = 0;
    if (c.lootBoxesOpened == null) c.lootBoxesOpened = 0;
    if (c.reputation == null) c.reputation = 120;
    c.daily = c.daily || { date: today(), xp: 0, sessions: 0, nodes: 0, capsules: 0 };
    if (c.daily.nodes == null) c.daily.nodes = c.daily.sessions || 0;
    if (c.daily.capsules == null) c.daily.capsules = 0;
    if (c.goal == null) c.goal = 100;
    if (c.autoAudio == null) c.autoAudio = true;
    if (!c.name) c.name = "Sreenath";
    if (c.onboarded == null) c.onboarded = true;
    return c;
  }
  const ALL_SKILLS = [
    { k: "listening", ic: "🎧", label: "Compréhension orale (Listening)" },
    { k: "speaking", ic: "🎙️", label: "Expression orale (Speaking)" },
    { k: "reading", ic: "📖", label: "Compréhension écrite (Reading)" },
    { k: "writing", ic: "✍️", label: "Production écrite (Writing)" },
    { k: "grammar", ic: "⚙️", label: "Grammaire & syntaxe (Grammar)" },
    { k: "vocabulary", ic: "💎", label: "Lexique & idiomes (Vocabulary)" },
    { k: "pronunciation", ic: "👄", label: "Phonétique & prosodie (Pronunciation)" }
  ];
  function skillAdd(skill, ok, cefrLv) {
    if (!skill) return;
    const list = Array.isArray(skill) ? skill : [skill];
    const c = CH();
    const lv = CEFR.includes(cefrLv) ? cefrLv : (SES && SES.node && CEFR.includes(SES.node.cefr) ? SES.node.cefr : (currentLevel() === "NATIF" ? "C2" : currentLevel()));
    c.levelSkills = c.levelSkills || {};
    c.levelSkills[lv] = c.levelSkills[lv] || {};
    list.forEach((sk) => {
      if (!sk) return;
      const k = c.skills[sk] = c.skills[sk] || { n: 0, ok: 0, ema: 0.5 };
      k.n += 1; if (ok) k.ok += 1;
      k.ema = +(k.ema == null ? (ok ? 0.72 : 0.28) : k.ema * 0.85 + (ok ? 0.15 : 0)).toFixed(3);
      const lk = c.levelSkills[lv][sk] = c.levelSkills[lv][sk] || { n: 0, ok: 0, ema: 0.5 };
      lk.n += 1; if (ok) lk.ok += 1;
      lk.ema = +(lk.ema == null ? (ok ? 0.72 : 0.28) : lk.ema * 0.85 + (ok ? 0.15 : 0)).toFixed(3);
    });
  }
  function gainXP(xp) {
    const c = CH(), s = SAVE();
    const perkLv = (s.perks && s.perks.scholarWisdom) || 1;
    const plumeBonus = (s.perks && s.perks.plumeVoltaire) ? 0.2 : 0;
    const oreilleBonus = (s.perks && s.perks.oreilleMarin) ? 0.15 : 0;
    const boosted = Math.round(xp * (1 + Math.max(0, perkLv - 1) * 0.15 + plumeBonus + oreilleBonus));
    if (c.daily.date !== today()) c.daily = { date: today(), xp: 0, sessions: 0, nodes: 0, capsules: 0 };
    c.daily.xp += boosted;
    if (API().addXP) API().addXP(boosted); else { s.xp = (s.xp || 0) + boosted; persist(); }
  }
  function markActiveDay() {
    const c = CH(), s = SAVE();
    if (c.lastDay === today()) return;
    if (c.lastDay === today(-1)) s.streak = (s.streak || 0) + 1;
    else if (c.lastDay === today(-2) && (s.streakFreezes || 0) > 0) { s.streakFreezes -= 1; s.streak = (s.streak || 0) + 1; toast("❄️ Streak saved", "A streak freeze protected your streak.", "❄️"); }
    else s.streak = 1;
    c.lastDay = today();
    s.lastGoalDay = today();
    if (s.streak % 7 === 0) s.streakFreezes = Math.min(3, (s.streakFreezes || 0) + 1);
  }

  // =================================================================== PATH
  // ---- card quality gate (rules from the native QA review)
  const FIXES = [
    [/Zinedine Zidan\b/g, "Zinedine Zidane"], [/(\p{L})–(\p{L})/gu, "$1-$2"], [/\bcustom officer\b/g, "customs officer"], [/km\/H\b/g, "km/h"],
    [/La souris eut été mangée/g, "La souris avait été mangée"], [/Tu aurais pu prévenir quand même/g, "Tu aurais pu me prévenir, quand même"],
    [/^Tu dois me vouvoyer/g, "Vous devez me vouvoyer"], [/les vitre blanchies/g, "les vitres blanchies"], [/pas de soucis/g, "pas de souci"], [/\bOk\b/g, "OK"],
    [/^Plus long fleuve de France/g, "Le plus long fleuve de France"], [/à neuf heure\b/g, "à neuf heures"], [/to the Havre/g, "to Le Havre"], [/go at the lawyer's/g, "go to the lawyer's"],
    [/^à fonder$/g, "fonder"], [/^limonade$/g, "lemonade"], [/\beveryday at\b/g, "every day at"], [/[ʼ’]/g, "'"], [/(\S)–(?=\p{L})/gu, "$1-"],
    [/^Je partais à Londres/g, "Je partais pour Londres"], [/Le chat eut mangé/g, "Le chat avait mangé"], [/vient de Albi/g, "vient d'Albi"], [/ont été déjà réservées/g, "ont déjà été réservées"], [/^juifs$/g, "juif"], [/^C'est depuis Londres/g, "Ça vient de Londres"], [/footballer professionnel/g, "footballeur professionnel"], [/\s*\((être|avoir|aller|faire)\)/g, ""], [/\ba old\b/g, "an old"], [/Are we are going/g, "Are we going"], [/-millions?-/g, (m) => " " + m.slice(1, -1) + " "], [/^un-million/g, "un million"]
  ];
  const META_EN = new Set(["plural", "singular", "masculine", "feminine", "masc", "fem", "masc.", "fem.", "a noun", "noun", "verb", "adjective", "adverb", "infinitive", "feminine adjective", "masculine adjective", "pronoun", "preposition", "conjunction", "past participle", "present participle"]);
  const EN_STOP = /\b(the|is|are|you|your|this|that|what|how|does|do|have|has|was|were|will|would|with|for|my|his|her|they|we|it's|i'm|don't|can't)\b/i;
  const FR_STOP = /(?:^|[\s'’])(le|la|les|un|une|des|je|j|tu|il|elle|nous|vous|ils|elles|est|et|de|du|que|qui|ne|pas|à|au|aux|en|ce|c|mon|ma|mes|on|sont|suis|avec|pour|dans|sur)(?=$|[\s,.!?'’])/i;
  const GRAMMAR_EN = /(?<![\p{L}])(masculine|feminine|singular|plural|présent|passé composé|imparfait|futur simple|conditionnel|subordinate|main clause|infinitive|past participle|lesson \d+|exemple|example|construction|e\.g\.|verb endings?|tense|cannot be translated|note that|has been changed|subjunctive of|conjugation|infinitif)(?![\p{L}])/iu;
  const GRAMMAR_FR = /^(présent|passé composé|imparfait|futur( simple| proche)?|conditionnel|exemple|négations?|construction|subjonctif|plus-que-parfait)(?![\p{L}])/iu;
  const FUNC_FR = new Set("le la les l un une de du des d a au aux se s ne n je j tu il elle on nous vous ils elles en y ce c me m te t lui leur mon ma mes ton ta tes son sa ses qu que qui pas plus tres et ou".split(" "));
  const ENDING_ONLY = /^-?(ais|ait|ions|iez|aient|ez|ons|ent|es|e)$/i;
  const EN_STOP_G = /\b(the|is|are|word|useful|you|would|this|that|another|which)\b/gi;
  const EN_COMMON = new Set("table date place minute page photo radio menu sport train taxi hotel restaurant film message question nature animal orange chance machine image service note article air art bus cinema police animal ski tennis golf piano guitar violin chocolate salade dessert omelette croissant baguette".split(" "));
  let LEX = null;
  function lexicon() {
    if (LEX) return LEX;
    LEX = new Set();
    DATA.lessons.forEach((w) => (w.stages || []).forEach((st) => (st.cards || []).forEach((c) => {
      String(c.fr || "").split(/[\s'’,.!?;:«»()]+/).forEach((t) => { if (t && t === t.toLowerCase()) LEX.add(normLoose(t)); });
    })));
    return LEX;
  }
  const NOTATION = /[\/→—…()‿◦•=]|\.\.\.|\(e\)|^-|-\s*$|\s-\s*$/;
  function balanced(t) { return (t.split("(").length === t.split(")").length) && (t.split("«").length === t.split("»").length) && ((t.match(/"/g) || []).length % 2 === 0); }
  function stripEn(en) {
    const x = String(en || "").replace(/\s*\((?:formal|informal|fam\.?|familiar|slang|polite|plural|singular|masc\.?|fem\.?|masculine|feminine|lit\.?|literally[^)]*|m|f|pl)\)/gi, "").replace(/\s+/g, " ").trim();
    return x || String(en || "").trim();
  }
  function isGoodCard(c) {
    if (!c || !c.fr || !c.en) return false;
    const fr = String(c.fr).trim(), en = String(c.en).trim();
    if (fr.length > 90 || en.length > 140 || !fr || !en) return false;
    if (/https?:|www\./i.test(fr + en)) return false;
    if (normLoose(fr) === normLoose(en)) return false;
    if (!/[a-zà-ÿœ]/.test(fr) || !/[a-z]/i.test(en)) return false;                        // digits / dates only
    if (/^[\p{Lu}][\p{L}'-]+\s*:/u.test(fr)) return false;                                 // speaker label "Marie : …"
    if (/[=→—]/.test(fr) || /[=→]/.test(en)) return false;
    if (/[a-zà-ÿ][A-Z]/.test(fr) || /[a-z][A-Z]{2}/.test(en)) return false;                 // words run together (table rows)
    if (en.length > 3 && en === en.toUpperCase() && /[A-Z]{3}/.test(en)) return false;      // ALL CAPS headings
    if (fr.length > 3 && fr === fr.toUpperCase() && /[A-ZÉÈ]{3}/.test(fr)) return false;
    if (/^(conjugate|put|translate|please|now|complete|choose|fill|rewrite|write|read|listen|match|exercise|practice|see)\b/i.test(en)) return false;
    if (/\b(tense|verb endings|stem)\b/i.test(en) && !/\s/.test(fr.trim()) === false && /\btense\b/i.test(en)) return false;
    if (META_EN.has(en.toLowerCase().replace(/[()]/g, "").trim())) return false;
    if (GRAMMAR_EN.test(en) || /\s\+\s|…|\s-\s|\s:\s/.test(en)) return false;                 // grammar headings / notes
    if (GRAMMAR_FR.test(fr) || /\s\+\s|\s-\s/.test(fr) || /\.{3}|…/.test(fr) && words(fr).length < 4) return false;
    if ((fr.match(EN_STOP_G) || []).length >= 2) return false;                                  // English sentence in the French slot
    if (/^by\s/i.test(en) || /'[^']*$/.test(en.replace(/\b\w+'\w+\b/g, "").replace(/s'(\s|$)/g, " ")) && /'/.test(en.replace(/\b\w+'\w+\b/g, "").replace(/s'(\s|$)/g, " "))) return false;
    { const ft = fr.trim().split(/\s+/); if (ft.length === 2 && !/\s/.test(en.trim()) && /ly$/i.test(en.trim()) && !ft.some((t) => FUNC_FR.has(normLoose(t))) && !/-/.test(fr)) return false; }   // "rapidement vite" = quickly
    if (/^(je|tu|il|elle|on|nous|vous|ils|elles)$/i.test(fr.trim()) && /\s/.test(en.trim())) return false;              // lone pronoun ↔ lone pronoun
    if (/^(futur|présent|passé|imparfait|conditionnel|subjonctif|participe|infinitive?|infinitif)$/i.test(en.trim())) return false;
    if (/^would\b/i.test(en) && !/(rais|rait|rions|riez|raient)(?![\p{L}])/u.test(fr)) return false;           // A: "would…" gloss on non-conditional
    if (/^\s*[A-Z][a-z]+ (form|forme)\s*:/.test(fr) || /(?<![\p{L}])(infinitif|literally|masculin|féminin)(?![\p{L}])/iu.test(fr)) return false; // B: labels
    if (/[éèêàùçœ]/.test(en) || /(?<![\p{L}])(tu|le|la|les|ayant)(?![\p{L}])/iu.test(en) || /,\s*\.$|:$/.test(en)) return false;     // B/C: French in English slot
    if (/does not|takes an?\b|(?<![\p{L}])note(?![\p{L}])|"|\s\?/iu.test(en) || /\(e\)|[,;]$/.test(fr) || (/^[a-z]+$/i.test(fr.trim()) && /^[a-z]+ly$/i.test(en.trim()) && !lexicon().has(normLoose(fr)))) return false;
    if (/‿/.test(en) || /\s\.$/.test(fr) || /\s\.$/.test(en) || /\d\.\s\|\s\d/.test(fr)) return false;                          // D: glitches
    if (ENDING_ONLY.test(fr) || ENDING_ONLY.test(en) || /[—«»]/.test(en) || /[a-z]{2}[A-Z]/.test(en)) return false;   // verb-ending tables
    if (/\?/.test(en) && !/\?/.test(fr)) return false;                                          // question/answer rows split apart
    if ((en.match(/[.!?](\s|$)/g) || []).length > Math.max(1, (fr.match(/[.!?](\s|$)/g) || []).length)) return false;
    if (FR_STOP.test(en) && !EN_STOP.test(en)) return false;                                     // French in the English slot
    if (!/\s/.test(en.trim()) && lexicon().has(normLoose(en)) && !/[wkyh]/i.test(en) && normLoose(en).length > 2 && !EN_COMMON.has(normLoose(en))) return false;
    if (/[a-z][A-Z][a-zà-ÿ']/.test(en) || /\b1[5-9]\d\d\s*-\s*(1[5-9]|20)\d\d\b/.test(fr + " " + en)) return false;
    { const a = normLoose(fr), b = normLoose(en); if (!/\s/.test(a) && !/\s/.test(b) && a.length > 2 && levenshtein(a, b) <= 3 && (/[éèêàçùûôîœ]/.test(en) || /(e|le|ne|se|te)$/.test(b) && !/(e|le|ne|se|te)$/.test(a) || /(e|le|ne|se|te)$/.test(a) && !/(e|le|ne|se|te)$/.test(b))) return false; } // actuel = actuelle
    if (!balanced(fr) || !balanced(en)) return false;
    // a lone capitalised word that never appears in lowercase in the course is a name, not vocabulary
    const ftoks = fr.replace(/[!?.…,;:«»"]/g, " ").trim().split(/\s+/);
    if (ftoks.length <= 2 && ftoks.every((t) => /^[\p{Lu}]/u.test(t)) && ftoks.every((t) => !lexicon().has(normLoose(t)))) return false;
    // language direction: French in the English slot or English in the French slot
    if (EN_STOP.test(fr) && !FR_STOP.test(fr)) return false;
    if (FR_STOP.test(en) && !EN_STOP.test(en) && /[éèêàçùûôîœ]/.test(en)) return false;
    if (ftoks.length === 1 && !/\s/.test(en) && !/[éèêàçùûôîœ]/.test(fr) && /[éèêàçùûôîœ]/.test(en)) return false; // quantity = quantité (swapped)
    return true;
  }
  const PAIR_FIX = { "soi": "oneself", "la charcuterie": "the delicatessen", "a fonder": "to found", "adorait": "used to adore", "sa bourse": "his or her purse", "c est depuis londres": "It's from London", "j ai roule": "I drove", "fonder": "to found", "en ce moment": "at the moment", "se compromettre": "to compromise oneself", "je partais pour londres": "I was leaving for London", "se produisit": "occurred", "eut": "had", "le bonnet": "the woolly hat", "reprit": "he went on", "joyeusement": "joyfully", "devint": "became", "je ne suis pas contre": "I wouldn't say no", "ca vient de londres": "It's from London" };
  function pickGloss(fr, en) {
    if (!/\//.test(en) || /^\d+\/\d+$/.test(en)) return en;
    if (/\S\/\S/.test(en.replace(/\b(km|m|kg|g)\/(h|s|m²|m)\b/gi, ""))) return null;          // "goes/is going" → unusable
    if (!/\s\/\s/.test(en)) return en;
    const alts = en.split(/\s+\/\s+/).map((x) => x.trim()).filter(Boolean);
    if (alts.length < 2) return en;
    const f = normLoose(fr).split(" ").pop() || "";
    const pickBy = (re) => alts.find((a) => re.test(a));
    if (/(rais|rait|rions|riez|raient)$/.test(f)) return pickBy(/\bwould\b/i) || alts[0];
    if (/(ais|ait|ions|iez|aient)$/.test(f)) return pickBy(/\bused to\b|\bwas\b|\bwere\b/i) || alts[0];
    const fl = String(fr).length;
    return alts.slice().sort((a, b) => Math.abs(a.length * 0.95 - fl) - Math.abs(b.length * 0.95 - fl))[0];
  }
  const EN_FIXES = [[/\blimonade\b/g, "lemonade"], [/\.\.+$/, "."], [/craddle/g, "cradle"], [/We used do\b/g, "We used to do"], [/would chose/g, "would choose"], [/\bchoses\b/g, "chooses"], [/was surprise\b/g, "was surprised"], [/^the daddy\b/i, "daddy"], [/go at the lawyer/g, "go to the lawyer"], [/As soon as I will have finished/g, "As soon as I have finished"],
    [/taking on unprecedented/g, "taking on an unprecedented"], [/^Yes, they probably have left by now\./, "Yes, and by now they'll probably have left."], [/all the same incredible, this story!/i, "This story is really incredible, all the same!"], [/\s*\((\p{L}+(er|ir|re|oir))\)/gu, ""]];
  function fixEn(t) { let x = String(t || ""); EN_FIXES.forEach(([a, b]) => { x = x.replace(a, b); }); return x.trim(); }
  function fixText(t) { let x = String(t || ""); FIXES.forEach(([a, b]) => { x = x.replace(a, b); }); return x; }
  function cleanCards(list) {
    const seen = new Set(), seenEn = new Set(), out = [];
    (list || []).forEach((c0) => {
      if (!c0 || /Gazoline/i.test(c0.fr || "")) return;
      const c = { fr: fixText(c0.fr), en: fixText(c0.en), note: c0.note };
      if (!isGoodCard(c)) return;
      let fr = firstAlt(c.fr).replace(/^[◦•▪·]\s*/, "").replace(/‿/g, " ").replace(/([^\s«])([?!;])/g, "$1 $2").trim();
      if (!/\s/.test(fr) && /^[\p{Lu}][\p{Ll}]+$/u.test(fr) && lexicon().has(normLoose(fr))) fr = fr.toLowerCase();   // "Camion" → "camion"
      const k = normLoose(fr);
      if (!k || seen.has(k)) return;
      let en = pickGloss(fr, String(c.en).replace(/\s+/g, " ").trim());
      if (!en) return;
      en = fixEn(en);
      if (/\b(\w+) \1\b/i.test(en)) return;                                                      // "up up"
      if (PAIR_FIX[normLoose(fr)]) en = PAIR_FIX[normLoose(fr)];
      { const fw = words(fr).length, ew = words(en).length; if ((fw >= 4 && ew <= 2) || (fw >= 6 && ew < fw * 0.4)) return; }
      if (normLoose(en) === normLoose(fr)) return;
      if (!isGoodCard({ fr, en })) return;                                                          // filters run on the final pair
      en = stripEn(en);
      seen.add(k);
      out.push({ fr, en, note: c.note || "", prod: !NOTATION.test(fr) && balanced(fr), dupEn: seenEn.has(normLoose(en)) });
      seenEn.add(normLoose(en));
    });
    return out;
  }
  const WORLDS = DATA.lessons.slice().sort((a, b) => cefrRank(a.cefr) - cefrRank(b.cefr) || a.number - b.number);
  const WORLD_BY_NUM = {}; DATA.lessons.forEach((w) => (WORLD_BY_NUM[w.number] = w));
  const NODES = []; const NODE_BY_ID = {}; const UNITS = [];
  const KIND_META = {
    boot: { icon: "🐣", label: "Sounds" },
    core: { icon: "🎓", label: "Lesson" },
    supplementary: { icon: "✨", label: "Vocabulary" },
    exercise: { icon: "🎧", label: "Dialogue" },
    boss: { icon: "🐉", label: "Boss" },
    scene: { icon: "🎭", label: "Role-play" },
    district: { icon: "🏙️", label: "Quête de Quartier" },
    atelier: { icon: "✒️", label: "Atelier Rhétorique" },
    read: { icon: "📰", label: "Reading" },
    mission: { icon: "✍️", label: "Mission" },
    gate: { icon: "🏛️", label: "Level exam" },
    natif: { icon: "👑", label: "Grand Examen Natif" }
  };
  function addNode(n) { n.idx = NODES.length; NODES.push(n); NODE_BY_ID[n.id] = n; return n; }
  function buildPath() {
    NODES.length = 0; UNITS.length = 0;
    for (const k in NODE_BY_ID) delete NODE_BY_ID[k];
    const G = GYM();
    // distribute scenes, readings, Parisian district quests & rhetoric ateliers to worlds of the same CEFR level
    const byLevel = {}; WORLDS.forEach((w) => (byLevel[w.cefr] = byLevel[w.cefr] || []).push(w.number));
    const sceneFor = {}, readFor = {}, distFor = {}, atelFor = {};
    const distCefrMap = {
      "district_gare_du_nord": "A1",
      "district_montmartre_bistrot": "A2",
      "district_marais_galerie": "A2",
      "district_haussmann_immobilier": "B1",
      "district_canal_saint_martin": "B1",
      "district_cabinet_medical": "B2",
      "district_la_defense_comex": "C1",
      "district_palais_justice": "C1",
      "district_sorbonne_jury_c2": "C2",
      "district_academie_coupole": "C2"
    };
    const distsByLv = {};
    (DISTRICTS() || []).forEach((d) => {
      const lv = distCefrMap[d.id] || String(d.cefrRange || "B1").slice(0, 2);
      (distsByLv[lv] = distsByLv[lv] || []).push(Object.assign({}, d, { cefr: lv }));
    });
    Object.keys(distsByLv).forEach((lv) => {
      const ws = byLevel[lv] || [];
      const list = distsByLv[lv];
      if (!ws.length) return;
      list.forEach((d, idx) => {
        const targetW = ws[Math.min(ws.length - 1, Math.floor(((idx + 1) * ws.length) / (list.length + 1)))];
        (distFor[targetW] = distFor[targetW] || []).push(d);
      });
    });
    CEFR.forEach((lv) => {
      const ws = byLevel[lv] || [];
      const sc = (G.scenes || []).filter((s) => s.cefr === lv);
      const rd = (G.readings || []).filter((s) => s.cefr === lv);
      const wm = (WRITINGS() || []).filter((s) => s.cefr === lv);
      sc.forEach((s, i) => { const w = ws[Math.floor(i * ws.length / Math.max(1, sc.length))]; (sceneFor[w] = sceneFor[w] || []).push(s); });
      rd.forEach((s, i) => { const w = ws[ws.length - 1 - Math.floor(i * ws.length / Math.max(1, rd.length))]; (readFor[w] = readFor[w] || []).push(s); });
      wm.forEach((s, i) => { if (ws.length) { const w = ws[Math.min(ws.length - 1, Math.floor((i + 1) * ws.length / (wm.length + 1)))]; (atelFor[w] = atelFor[w] || []).push(s); } });
    });
    // Unit 0: sounds bootcamp
    if ((SLD.bootcamp || []).length) {
      const u = { id: "u0", num: 0, title: "Premiers sons", sub: "Hear and say your first French", cefr: "A1", nodes: [] };
      SLD.bootcamp.forEach((b, i) => u.nodes.push(addNode({ id: "boot:" + b.id, kind: "boot", title: b.title, cefr: "A1", unit: "u0", data: b, n: i + 1 })));
      UNITS.push(u);
    }
    let prevLevel = null;
    const pushGate = (lv) => {
      const id = "gate:" + lv;
      const u = { id: "ug-" + lv, num: null, gate: lv, title: lv === "C2" ? "Passage C2 → Natif" : `Passage ${lv} → ${CEFR[cefrRank(lv) + 1]}`, cefr: lv, nodes: [] };
      u.nodes.push(addNode({ id, kind: "gate", title: (EXAMS()[lv] && EXAMS()[lv].title) || `Examen ${lv}`, cefr: lv, unit: u.id, level: lv }));
      UNITS.push(u);
    };
    WORLDS.forEach((w) => {
      if (prevLevel && w.cefr !== prevLevel) pushGate(prevLevel);
      prevLevel = w.cefr;
      const u = { id: "w" + w.number, num: w.number, title: String(w.title || "").replace(/\s*\(.*?\)\s*$/, ""), cefr: w.cefr, world: w, nodes: [] };
      const stages = (w.stages || []).filter((s) => s.type !== "boss");
      const boss = (w.stages || []).filter((s) => s.type === "boss");
      const scenes = sceneFor[w.number] || [], reads = readFor[w.number] || [];
      const dists = distFor[w.number] || [], atels = atelFor[w.number] || [];
      const mid = Math.max(1, Math.round(stages.length / 2));
      stages.forEach((s, i) => {
        u.nodes.push(addNode({ id: "st:" + s.stageId, kind: s.type || "core", title: String(s.title || "").replace(/\s*\(Core Foundation\)/i, ""), cefr: w.cefr, unit: u.id, stage: s, world: w }));
        if (i === mid - 1 && scenes[0]) u.nodes.push(addNode({ id: "scene:" + scenes[0].id, kind: "scene", title: scenes[0].title, cefr: scenes[0].cefr, unit: u.id, data: scenes[0], world: w }));
      });
      scenes.slice(1).forEach((sc) => u.nodes.push(addNode({ id: "scene:" + sc.id, kind: "scene", title: sc.title, cefr: sc.cefr, unit: u.id, data: sc, world: w })));
      dists.forEach((d) => u.nodes.push(addNode({ id: "dist:" + d.id, kind: "district", title: `${d.name} (${d.arrondissement})`, cefr: d.cefr || w.cefr, unit: u.id, data: d, world: w })));
      reads.forEach((rd) => u.nodes.push(addNode({ id: "read:" + rd.id, kind: "read", title: rd.title, cefr: rd.cefr, unit: u.id, data: rd, world: w })));
      atels.forEach((at) => u.nodes.push(addNode({ id: "atel:" + at.id, kind: "atelier", title: at.title, cefr: at.cefr || w.cefr, unit: u.id, data: at, world: w })));
      const m = MISSIONS()[String(w.number)];
      if (m) u.nodes.push(addNode({ id: "mis:" + w.number, kind: "mission", title: "Mission: write & speak", cefr: w.cefr, unit: u.id, data: m, world: w }));
      boss.forEach((s) => u.nodes.push(addNode({ id: "st:" + s.stageId, kind: "boss", title: String(s.title || "").replace(/^Guardian Boss:\s*/i, "Boss: "), cefr: w.cefr, unit: u.id, stage: s, world: w })));
      UNITS.push(u);
    });
    if (prevLevel) pushGate(prevLevel);
    // Final
    const fu = { id: "u-natif", num: null, gate: "NATIF", title: "Le Grand Examen Natif", cefr: "NATIF", nodes: [] };
    fu.nodes.push(addNode({ id: "gate:NATIF", kind: "natif", title: "Le Grand Examen Natif", cefr: "NATIF", unit: fu.id, level: "NATIF", royal: true }));
    UNITS.push(fu);
    UNITS.forEach((u) => { const seenT = {}; u.nodes.forEach((n) => { n.unitObj = u; const k = n.title.toLowerCase(); if (seenT[k]) n.title = `${n.title} · ${n.kind === "supplementary" ? "practice" : (KIND_META[n.kind] || {}).label || "II"}`; seenT[k] = true; }); });
    // Mark "Voie Royale — Fondation Complète": 1 Core stage from EVERY single world in each CEFR level + audio dialogues + A1 Sound Bootcamps (ZERO skipped foundations!)
    CEFR.forEach((lv) => {
      const lvNodes = NODES.filter((n) => n.cefr === lv);
      if (lv === "A1") {
        lvNodes.filter((n) => n.kind === "boot").slice(0, 5).forEach((n) => { n.royal = true; });
      }
      const lvUnits = UNITS.filter((u) => u.world && u.cefr === lv);
      lvUnits.forEach((u) => {
        const coreSt = u.nodes.find((n) => n.kind === "core") || u.nodes[0];
        if (coreSt) coreSt.royal = true;
      });
      lvNodes.filter((n) => n.kind === "exercise").slice(0, 3).forEach((n) => { n.royal = true; });
      lvNodes.filter((n) => n.kind === "district").slice(0, 2).forEach((n) => { n.royal = true; });
      lvNodes.filter((n) => n.kind === "scene").slice(0, 1).forEach((n) => { n.royal = true; });
      lvNodes.filter((n) => n.kind === "read").slice(0, 1).forEach((n) => { n.royal = true; });
      lvNodes.filter((n) => n.kind === "atelier").slice(0, 2).forEach((n) => { n.royal = true; });
      lvNodes.filter((n) => n.kind === "mission").slice(0, 1).forEach((n) => { n.royal = true; });
      const bosses = lvNodes.filter((n) => n.kind === "boss");
      if (bosses.length) bosses[bosses.length - 1].royal = true;
      lvNodes.filter((n) => n.kind === "gate").forEach((n) => { n.royal = true; });
    });
    importLegacyProgress();
  }
  function importLegacyProgress() {
    const s = SAVE(), c = CH();
    const cleared = s.clearedStages || {};
    NODES.forEach((n) => { if (n.stage && cleared[n.stage.stageId] && !c.done[n.id]) c.done[n.id] = cleared[n.stage.stageId] || 1; });
    const bc = (s.bootcamp && s.bootcamp.done) || {};
    NODES.forEach((n) => { if (n.kind === "boot" && bc[n.data.id] && !c.done[n.id]) c.done[n.id] = 2; });
    const cd = s.clearedDistricts || {};
    NODES.forEach((n) => { if (n.kind === "district" && n.data && cd[n.data.id] && !c.done[n.id]) c.done[n.id] = 3; });
    const cw = s.completedWritings || {};
    NODES.forEach((n) => { if (n.kind === "atelier" && n.data && cw[n.data.id] && !c.done[n.id]) c.done[n.id] = 3; });
  }
  function jumpBase() {
    // index after the furthest passed (or placed) gate; nodes before it are open
    const c = CH(); let base = 0;
    NODES.forEach((n) => { if ((n.kind === "gate") && c.gates[n.level] && c.gates[n.level].passed) base = Math.max(base, n.idx + 1); });
    if (c.unlockedLevels) {
      CEFR.forEach((lv) => {
        if (c.unlockedLevels[lv]) {
          const firstLv = NODES.find((n) => n.cefr === lv && n.kind !== "boot");
          if (firstLv) base = Math.max(base, firstLv.idx);
        }
      });
    }
    if (c.skipBoot) { const firstW = NODES.find((n) => n.kind !== "boot"); if (firstW) base = Math.max(base, firstW.idx); }
    return base;
  }
  function nextNode() {
    const c = CH(), base = jumpBase();
    if (c.activeNodeId && NODE_BY_ID[c.activeNodeId] && c.partial && hasPartialProgress(c.partial[c.activeNodeId]) && !c.done[c.activeNodeId]) {
      return NODE_BY_ID[c.activeNodeId];
    }
    const isRoyal = c.pathMode !== "integral";
    if (isRoyal) {
      for (let i = base; i < NODES.length; i++) if (NODES[i].royal && !c.done[NODES[i].id]) return NODES[i];
      for (let i = 0; i < NODES.length; i++) if (NODES[i].royal && !c.done[NODES[i].id]) return NODES[i];
    }
    for (let i = base; i < NODES.length; i++) if (!c.done[NODES[i].id]) return NODES[i];
    for (let i = 0; i < NODES.length; i++) if (!c.done[NODES[i].id]) return NODES[i];
    return NODES[NODES.length - 1];
  }
  function isUnlocked(n) {
    const s = SAVE(), c = CH();
    if (!n) return false;
    if (s.freeRoamUnlocked || c.done[n.id]) return true;
    if (c.unlockedNodes && c.unlockedNodes[n.id]) return true;
    if (c.unlockedLevels && c.unlockedLevels[levelOfNode(n)]) return true;
    if (c.partial && hasPartialProgress(c.partial[n.id])) return true;
    if (n.unit === "u0" || n.id === "st:1-1" || n.kind === "district" || n.kind === "atelier" || n.kind === "read" || n.kind === "scene") return true;
    const nx = nextNode();
    if (c.pathMode !== "integral" && n.royal && cefrRank(levelOfNode(n)) <= cefrRank(levelOfNode(nx))) return true;
    return n.idx <= nx.idx || n.idx < jumpBase();
  }
  function levelOfNode(n) { return n.kind === "natif" ? "NATIF" : (n.cefr || "A1"); }
  function currentLevel() { return levelOfNode(nextNode()); }
  // immersion: instructions move from English → bilingual → French
  let curTier = 0;
  function tierFor(cefr) { const r = cefrRank(cefr); return r <= 0 ? 0 : r === 1 ? 1 : 2; }
  const I18N = {
    cont: ["Continue", "Continuer"], check: ["Check", "Vérifier"], skip: ["Skip", "Passer"],
    whatMeans: ["What does this mean?", "Qu'est-ce que ça veut dire ?"],
    howSay: ["How do you say this in French?", "Comment dit-on en français ?"],
    listenPick: ["Listen and choose what you hear", "Écoute et choisis ce que tu entends"],
    listenMean: ["Listen. What does it mean?", "Écoute. Qu'est-ce que ça veut dire ?"],
    build: ["Build the sentence in French", "Construis la phrase en français"],
    type: ["Write it in French", "Écris-le en français"],
    dictee: ["Listen and write what you hear", "Écoute et écris ce que tu entends"],
    speak: ["Say it out loud", "Dis-le à voix haute"],
    match: ["Match the pairs", "Associe les paires"],
    cloze: ["Fill in the blank", "Complète la phrase"],
    next: ["What's the reply?", "Quelle est la suite ?"],
    reply: ["Choose the best reply", "Choisis la meilleure réponse"],
    native: ["How would a native say it?", "Comment le dirait un natif ?"],
    define: ["Think in French: which word is it?", "Pense en français : quel est le mot ?"],
    newWord: ["New phrase", "Nouvelle expression"],
    listen: ["Listen", "Écouter"], slow: ["Slow", "Lentement"], repeat: ["Repeat", "Répète"],
    read: ["Read", "Lis"], write: ["Write", "Écris"], talk: ["Speak", "Parle"]
  };
  function L(k) {
    const p = I18N[k]; if (!p) return k;
    if (curTier === 0) return esc(p[0]);
    if (curTier === 1) return `${esc(p[1])} <span class="ody-en">· ${esc(p[0])}</span>`;
    return esc(p[1]);
  }
  function Lplain(k) { const p = I18N[k]; if (!p) return k; return curTier === 0 ? p[0] : p[1]; }

  // export for other modules / tests
  window.ODY = window.ODY || {};
  Object.assign(window.ODY, { NODES, UNITS, NODE_BY_ID, buildPath, nextNode, isUnlocked, CH, judgeText, speechScore, normLoose, cleanCards, speak, SRV, checkServer });

  // =================================================================== SESSION BUILDERS
  // A step = { k: kind, ...data, skill, card? }. Gradable kinds re-queue on error.
  const GRADABLE = new Set(["mcq", "listen", "build", "type", "dictee", "speak", "match", "dialogue", "shadow", "memory", "reflex", "simturn", "quest", "register", "radio", "enquete", "liaison", "forgeron", "joute", "idiome", "synthese", "periode", "concordance", "ame", "pensee", "explore", "visreflex", "swipe"]);
  function rhythmChunks(fr) {
    const clean = String(fr || "").trim();
    if (!clean) return [];
    const byPunct = clean.split(/(?<=[,;:.!?])\s+/).filter(Boolean);
    const out = [];
    byPunct.forEach((seg) => {
      const ws = seg.split(/\s+/).filter(Boolean);
      if (ws.length <= 4) { out.push(seg); return; }
      for (let i = 0; i < ws.length; i += 3) {
        const slice = ws.slice(i, i + 3).join(" ");
        if (slice) out.push(slice);
      }
    });
    return out;
  }
  function wordMask(w, hideFirst) {
    const clean = String(w || "").replace(/[.,!?;:«»"()…]/g, "");
    if (!clean) return "";
    if (hideFirst) return "_".repeat(clamp(clean.length, 2, 8)) + ` (${clean.length})`;
    const apo = clean.indexOf("'");
    if (apo > 0 && apo < clean.length - 1) return clean.slice(0, apo + 1) + clean[apo + 1] + "_".repeat(Math.max(1, clean.length - apo - 2));
    return clean[0] + "_".repeat(Math.max(1, Math.min(7, clean.length - 1))) + (clean.length >= 4 ? ` (${clean.length})` : "");
  }
  function liveWordLockHtml(targetFr, typedVal, hideFirst) {
    const tRaw = String(targetFr || "").trim().split(/\s+/).filter(Boolean);
    const uWords = normLoose(typedVal || "").split(/\s+/).filter(Boolean);
    let hit = 0;
    const pills = tRaw.map((tok, idx) => {
      const clean = normLoose(tok);
      const u = uWords[idx];
      if (u && clean && (u === clean || (clean.length > 3 && levenshtein(u, clean) <= 1))) {
        hit += 1;
        return `<span class="wl-pill locked">✓ ${esc(tok)}</span>`;
      }
      if (idx === hit && u && clean && clean.startsWith(u)) {
        return `<span class="wl-pill active">${esc(wordMask(tok, hideFirst))}</span>`;
      }
      return `<span class="wl-pill ${idx === hit ? "active" : "ghost"}">${esc(wordMask(tok, hideFirst))}</span>`;
    });
    return { html: pills.join(""), hit, total: tRaw.length };
  }
  const EN_FILLER = /\b(a|an|the|one|we|they|you|i|he|she|it|to|be|is|are|slang|informal|formal|familiar|polite|someone|something|sb|sth)\b/gi;
  const contentEn = (en) => new Set(normLoose(String(en).replace(EN_FILLER, " ")).split(" ").filter((w) => w.length > 2));
  function tooClose(a, b, field) {
    if (field === "en") {
      const A = contentEn(a), B = contentEn(b); if (!A.size || !B.size) return false;
      let shared = 0; A.forEach((w) => { if (B.has(w)) shared += 1; });
      return shared >= Math.min(A.size, B.size);              // same head words → could also be right
    }
    const x = normLoose(a), y = normLoose(b);
    return x.includes(y) || y.includes(x);
  }
  function distract(pool, target, field, n) {
    const t = normLoose(target[field]);
    const tl = String(target[field]).length;
    const tWords = words(target[field]).length;
    const seen = new Set([t]); const out = [];
    const cands = shuffle(pool).sort((a, b) => Math.abs(String(a[field]).length - tl) - Math.abs(String(b[field]).length - tl));
    for (const c of cands) {
      const v = normLoose(c[field]);
      if (!v || seen.has(v)) continue;
      if (normLoose(c.fr) === normLoose(target.fr) || normLoose(c.en) === normLoose(target.en)) continue;
      if (tooClose(c.en, target.en, "en")) continue;
      if (field === "fr" && tooClose(c.fr, target.fr, "fr")) continue;
      if (tWords <= 2 && words(c[field]).length > 5) continue;   // keep word vs sentence consistent
      if (out.some((o) => tooClose(o, c[field], field))) continue;
      seen.add(v); out.push(c[field]);
      if (out.length >= n) break;
    }
    return out;
  }
  function tilesFor(fr, pool) {
    const toks = String(fr).replace(/\s*([?!:;])/g, " $1").replace(/[.…]+\s*$/, "").split(/\s+/).filter((w) => w && !/^[?!:;,.«»"]+$/.test(w));
    const clean = toks.map((w) => w.replace(/[,]$/, ""));
    const extra = [];
    const have = new Set(clean.map((w) => normLoose(w)));
    const want = Math.min(4, Math.max(2, Math.round(clean.length / 2)));
    for (const c of shuffle(pool)) {
      if (!c.prod) continue;
      for (const w of words(c.fr)) {
        const x = w.replace(/[.,!?;:…«»"]/g, "");
        if (x && x.length > 1 && !have.has(normLoose(x)) && !/[\/()]/.test(x) && !/^[\p{Lu}]/u.test(x)) { extra.push(x); have.add(normLoose(x)); }
        if (extra.length >= want) break;
      }
      if (extra.length >= want) break;
    }
    return { answer: clean, tiles: shuffle(clean.concat(extra)) };
  }
  function buildable(c) {
    if (!c.prod) return false;
    const nw = words(c.fr).length; if (nw < 2 || nw > 12) return false;
    if (/[\/;]|\bor\b|\.\.\.|…/.test(c.en)) return false;                                   // several valid answers / gaps
    if (/[.!?]\s+\S/.test(c.fr.trim())) return false;                               // two sentences
    const toks = words(normLoose(c.fr)); if (new Set(toks).size !== toks.length) return false; // repeated word → ambiguous order
    return true;
  }
  // generate an exercise of a given kind from a card
  function cardStep(kind, c, pool, cefr) {
    const nw = words(c.fr).length;
    const cWhy = c.note || "";
    switch (kind) {
      case "fr2en": {
        if (c.dupEn) return null;
        const d = distract(pool, c, "en", 3); if (d.length < 2) return null;
        return { k: "mcq", prompt: "whatMeans", big: c.fr, fr: c.fr, choices: shuffle([c.en].concat(d)), answer: c.en, why: cWhy, card: c, skill: ["reading", "vocabulary"] };
      }
      case "en2fr": {
        if (c.dupEn) return null;
        const d = distract(pool, c, "fr", 3); if (d.length < 2) return null;
        return { k: "mcq", prompt: "howSay", big: c.en, choices: shuffle([c.fr].concat(d)), answer: c.fr, why: cWhy, sayAnswer: true, card: c, skill: ["reading", "vocabulary"] };
      }
      case "listen": {
        const mean = !c.dupEn && (cefrRank(cefr) >= 1 || Math.random() < 0.5);
        const d = distract(pool, c, mean ? "en" : "fr", 3); if (d.length < 2) return null;
        return { k: "listen", fr: c.fr, en: c.en, choices: shuffle([mean ? c.en : c.fr].concat(d)), answer: mean ? c.en : c.fr, why: cWhy, mode: mean ? "mean" : "heard", card: c, skill: ["listening", "vocabulary"] };
      }
      case "build": {
        if (!buildable(c)) return null;
        const t = tilesFor(c.fr, pool);
        if (t.answer.length < 2) return null;
        return { k: "build", en: c.en, fr: c.fr, answer: t.answer, tiles: t.tiles, why: cWhy, card: c, skill: ["writing", "grammar"] };
      }
      case "type": {
        // free typing powered by live word-locking runes so length never causes ambiguity
        if (!c.prod || c.dupEn || nw < 2 || nw > 9 || /[\/;]|\bor\b|\.\.\.|…/.test(c.en)) return null;
        if (/,\s|\.\.\.|…/.test(c.fr)) return null;
        return { k: "type", prompt: "type", q: c.en, fr: c.fr, en: c.en, answer: c.fr, accept: variantsOf(c.fr), why: cWhy, card: c, skill: ["writing", "grammar"] };
      }
      case "dictee": {
        if (!c.prod || nw < 3 || nw > 12 || /\b[bcdfghjklmnpqrstvwxz]{2,4}\b/i.test(normLoose(c.fr))) return null;
        return { k: "dictee", fr: c.fr, en: c.en, why: cWhy, card: c, skill: ["listening", "writing"] };
      }
      case "speak": {
        if (!c.prod || nw > 14) return null;
        return { k: "speak", fr: c.fr, en: c.en, why: cWhy, card: c, skill: ["speaking", "pronunciation"] };
      }
      case "shadow": {
        if (!c.prod || nw < 2 || nw > 14) return null;
        return { k: "shadow", fr: c.fr, en: c.en, why: cWhy, chunks: rhythmChunks(c.fr), card: c, skill: ["speaking", "pronunciation"] };
      }
      case "memory": {
        if (!c.prod || c.dupEn || nw < 2 || nw > 10 || /[\/;]|\.\.\.|…/.test(c.en)) return null;
        return { k: "memory", fr: c.fr, en: c.en, answer: c.fr, accept: variantsOf(c.fr), why: cWhy, chunks: rhythmChunks(c.fr), card: c, skill: ["writing", "vocabulary"] };
      }
      case "reflex": {
        if (c.dupEn) return null;
        const toFr = cefrRank(cefr) >= 1 || Math.random() < 0.5;
        const d = distract(pool, c, toFr ? "fr" : "en", 3); if (d.length < 2) return null;
        return { k: "reflex", fr: c.fr, en: c.en, prompt: toFr ? "howSay" : "whatMeans", big: toFr ? c.en : c.fr, choices: shuffle([toFr ? c.fr : c.en].concat(d)), answer: toFr ? c.fr : c.en, why: cWhy, sayAnswer: toFr, timeLimit: 6000, card: c, skill: ["reading", "vocabulary"] };
      }
      case "example": return { k: "example", fr: c.fr, en: c.en, note: c.note && c.note.length < 120 ? c.note : "", card: c };
    }
    return null;
  }
  function variantsOf(fr) {
    const v = new Set([fr]);
    const sw = [[/^ils\b/i, "elles"], [/^elles\b/i, "ils"], [/^il\b/i, "elle"], [/^elle\b/i, "il"], [/^nous\b/i, "on"]];
    sw.forEach(([re, to]) => { if (re.test(fr)) v.add(fr.replace(re, to)); });
    const m = fr.match(/^(.*?)(\S+?)([.!?]?)$/);
    if (m) { const w = m[2]; v.add(m[1] + (w.endsWith("e") ? w.slice(0, -1) : w + "e") + m[3]); if (w.endsWith("s")) v.add(m[1] + w.slice(0, -1) + m[3]); }
    v.add(fr.replace(/^(le|la|l'|les|un|une)\s*/i, ""));
    return [...v].filter(Boolean);
  }
  function matchStep(cards) {
    const ps = []; const fe = new Set(), ff = new Set();
    for (const c of cards) {
      if (c.fr.length > 40 || c.en.length > 50) continue;
      const a = normLoose(c.en), b = normLoose(c.fr);
      if (fe.has(a) || ff.has(b) || ps.some((p) => tooClose(p.en, c.en, "en"))) continue;
      fe.add(a); ff.add(b); ps.push(c);
      if (ps.length >= 5) break;
    }
    if (ps.length < 3) return null;
    return { k: "match", pairs: ps.map((c) => ({ fr: c.fr, en: c.en })), skill: "reading" };
  }
  function looksFrench(s) { return /\b(le|la|les|un|une|des|je|tu|il|elle|nous|vous|est|et|de|du|que|qui|ne|pas|à|au|en)\b/i.test(s) && !/\b(the|is|are|you|this|what|and)\b/i.test(s); }
  function goodCloze(d) {
    const a = String(d.clozeAnswer || "").trim();
    if (!a || /^[\p{Lu}]/u.test(a)) return false;                                    // never blank a name
    const n = words(a).length;
    const ch = (d.choices || []).map((x) => String(x).trim());
    if (ch.length < 3 || new Set(ch.map(normLoose)).size !== ch.length) return false;
    if (ch.some((x) => /^[\p{Lu}]/u.test(x) || /^-|-$/.test(x))) return false;       // proper nouns / hyphen fragments
    if (ch.some((x) => Math.abs(words(x).length - n) > 1)) return false;              // length gives it away
    if (ch.some((x) => x !== a && (normLoose(a).includes(normLoose(x)) || normLoose(x).includes(normLoose(a))))) return false;
    return true;
  }
  function buildSimTurnFromCards(cards, worldTitle) {
    const cand = (cards || []).find((c) => c && c.prod && words(c.fr).length >= 2 && words(c.fr).length <= 10);
    if (!cand) return null;
    const kw = words(cand.fr).map((w) => w.replace(/[.,!?;:«»"()]/g, "")).filter((w) => w.length >= 3).slice(0, 3);
    if (!kw.length) kw.push(words(cand.fr)[0].replace(/[.,!?;:«»"]/g, ""));
    return {
      k: "simturn",
      place: worldTitle ? `📍 ${worldTitle}` : "📍 Situation réelle",
      npc: "Et vous, comment le diriez-vous naturellement en français ?",
      npc_en: `Respond in French expressing: “${cand.en}”`,
      keywords: kw,
      model_fr: cand.fr,
      model_en: cand.en,
      card: cand,
      skill: "speaking"
    };
  }
  function drillSteps(stage, max) {
    const out = [];
    for (const d of shuffle(stage.drills || [])) {
      if (out.length >= max) break;
      if (d.type === "mcq" && d.prompt && d.answer && Array.isArray(d.choices) && d.choices.includes(d.answer) && d.prompt.length < 120 && d.choices.length >= 3 && !EN_STOP.test(d.answer) && new Set(d.choices.map(normLoose)).size === d.choices.length) {
        out.push({ k: "reflex", prompt: "howSay", big: d.prompt, choices: shuffle(d.choices.map((x) => x.replace(/‿/g, " ").replace(/\s+/g, " ").trim())), answer: d.answer.replace(/\s+/g, " ").trim(), why: d.explanation || "", sayAnswer: true, timeLimit: 6500, skill: "reading" });
      }
    }
    return out;
  }
  function unitPool(n) {
    const w = n.world || (n.stage && WORLD_BY_NUM[n.stage.worldNum]);
    if (!w) return [];
    return cleanCards((w.stages || []).flatMap((s) => s.cards || []));
  }
  const BAD_STAGES = new Set(["40-8"]);
  function stageCards(n) { return n.stage && BAD_STAGES.has(n.stage.stageId) ? unitPool(n).slice(0, 24) : cleanCards((n.stage && n.stage.cards) || []); }
  // pick a slice of cards for this play (so replays cover new cards)
  function focusCards(n, cards, k) {
    if (cards.length <= k) return cards.slice();
    const c = CH(); const plays = c.plays[n.id] || 0;
    const start = (plays * k) % cards.length;
    const out = cards.slice(start, start + k);
    if (out.length < k) out.push(...cards.slice(0, k - out.length));
    return out;
  }
  function interleave(base, extras, every) {
    const out = []; let e = 0;
    base.forEach((s, i) => { out.push(s); if ((i + 1) % every === 0 && e < extras.length) out.push(extras[e++]); });
    while (e < extras.length) out.push(extras[e++]);
    return out;
  }
  function teachSteps(text, opts = {}) {
    return splitSentences(text, 200).length > 1
      ? [{ k: "teach", parts: splitSentences(text, 200), tip: !!opts.tip }]
      : [{ k: "teach", parts: [String(text || "")], tip: !!opts.tip }];
  }

  // ---- C2 Linguistic Sleuth (L'Enquête Stylistique) & Prosody Liaison Data
  const ENQUETE_CASES = [
    { cefr: "A1", title: "Carte postale · Montmartre", en: "Hello Camille, I live in a charming studio near the Sacré-Cœur.", segments: ["Bonjour Camille,", "je habite dans", "un studio charmant", "près du Sacré-Cœur."], trapIdx: 1, fix: "j'habite dans", fullRight: "Bonjour Camille, j'habite dans un studio charmant près du Sacré-Cœur.", why: "Élision obligatoire : devant une voyelle ou un « h » muet (« habiter »), le pronom « je » perd son « e » et devient « j' »." },
    { cefr: "A1", title: "Fiche d'accueil · Alliance Française", en: "My name is Lucas, I am twenty-five years old, and I work in Lyon.", segments: ["Je m'appelle Lucas,", "je suis vingt-cinq ans", "et je travaille", "à Lyon."], trapIdx: 1, fix: "j'ai vingt-cinq ans", fullRight: "Je m'appelle Lucas, j'ai vingt-cinq ans et je travaille à Lyon.", why: "En français, l'âge s'exprime toujours avec le verbe « avoir » (« j'ai vingt-cinq ans ») et jamais avec « être »." },
    { cefr: "A1", title: "Commande · Boulangerie Poilâne", en: "Every Sunday morning, we buy a lot of warm croissants for the family.", segments: ["Chaque dimanche matin,", "nous achetons", "beaucoup des croissants chauds", "pour la famille."], trapIdx: 2, fix: "beaucoup de croissants chauds", fullRight: "Chaque dimanche matin, nous achetons beaucoup de croissants chauds pour la famille.", why: "Après un adverbe de quantité (« beaucoup », « peu », « trop », « assez »), on emploie toujours « de / d' » sans article pluriel." },
    { cefr: "A1", title: "Billet Eurostar · Gare du Nord", en: "My sister lives in London, but she travels to France every month.", segments: ["Ma sœur habite à Londres,", "mais elle voyage", "au France", "tous les mois."], trapIdx: 2, fix: "en France", fullRight: "Ma sœur habite à Londres, mais elle voyage en France tous les mois.", why: "Devant un nom de pays féminin (« la France », « l'Italie ») ou commençant par une voyelle, on utilise la préposition « en » et non « au »." },
    { cefr: "A2", title: "SMS · Quai de la Gare de Lyon", en: "This weekend, I am taking the train to visit my grandmother in Provence.", segments: ["Ce week-end,", "je prends le train", "pour visiter ma grand-mère", "en Provence."], trapIdx: 2, fix: "pour rendre visite à ma grand-mère", fullRight: "Ce week-end, je prends le train pour rendre visite à ma grand-mère en Provence.", why: "On « visite » un lieu (un musée, une ville), mais on « rend visite à » une personne." },
    { cefr: "A2", title: "Journal de bord · Le Marais", en: "Yesterday evening, I went to the small theater on Rue des Rosiers with Sarah.", segments: ["Hier soir,", "j'ai allé", "au petit théâtre de la rue des Rosiers", "avec Sarah."], trapIdx: 1, fix: "je suis allé", fullRight: "Hier soir, je suis allé au petit théâtre de la rue des Rosiers avec Sarah.", why: "Le verbe « aller » se conjugue avec l'auxiliaire « être » aux temps composés (« je suis allé »)." },
    { cefr: "A2", title: "Guichet · Opéra Garnier", en: "Sorry sir, we no longer have any seats available for tonight's ballet.", segments: ["Désolé monsieur,", "nous n'avons plus", "des places disponibles", "pour le ballet de ce soir."], trapIdx: 2, fix: "de places disponibles", fullRight: "Désolé monsieur, nous n'avons plus de places disponibles pour le ballet de ce soir.", why: "Après une négation (« ne... pas », « ne... plus »), les articles indéfinis et partitifs « un / une / des » deviennent « de / d' »." },
    { cefr: "A2", title: "Rencontre · Café de Flore", en: "I have been living in this neighborhood for three years and I know all the booksellers.", segments: ["J'ai habité dans ce quartier", "depuis trois ans", "et je connais", "tous les bouquinistes."], trapIdx: 0, fix: "J'habite dans ce quartier", fullRight: "J'habite dans ce quartier depuis trois ans et je connais tous les bouquinistes.", why: "Pour une action commencée dans le passé qui continue dans le présent avec « depuis », le français exige le présent (« j'habite »)." },
    { cefr: "B1", title: "Confidence · Jardin du Luxembourg", en: "If I had more free time this autumn, I would enroll in the lithography workshop.", segments: ["Si j'aurais plus de temps libre", "cet automne,", "je m'inscrirais", "à l'atelier de lithographie."], trapIdx: 0, fix: "Si j'avais plus de temps libre", fullRight: "Si j'avais plus de temps libre cet automne, je m'inscrirais à l'atelier de lithographie.", why: "Dans la subordonnée hypothétique introduite par « si », on emploie l'imparfait (« si j'avais ») et jamais le conditionnel." },
    { cefr: "B1", title: "Critique gastronomique · Les Halles", en: "Everyone thinks this dish is complicated, but actually the chef only uses three ingredients.", segments: ["Tout le monde croit ce plat complexe,", "mais actuellement,", "le chef n'utilise", "que trois ingrédients."], trapIdx: 1, fix: "mais en réalité,", fullRight: "Tout le monde croit ce plat complexe, mais en réalité, le chef n'utilise que trois ingrédients.", why: "Faux ami : « actuellement » signifie « en ce moment » (currently). Pour dire « actually », on utilise « en réalité » ou « en fait »." },
    { cefr: "B1", title: "Courriel interne · La Défense", en: "This morning, I asked my director if we could postpone the presentation until Friday.", segments: ["Ce matin,", "j'ai demandé mon directeur", "si nous pouvions reporter", "la présentation à vendredi."], trapIdx: 1, fix: "j'ai demandé à mon directeur", fullRight: "Ce matin, j'ai demandé à mon directeur si nous pouvions reporter la présentation à vendredi.", why: "En français, on « demande quelque chose À quelqu'un » (complément d'objet indirect introduit par « à »)." },
    { cefr: "B1", title: "Bulletin maritime · Marseille", en: "Although the wind is very strong today, the ferry will depart on schedule.", segments: ["Bien que le vent est", "très violent aujourd'hui,", "le ferry partira", "à l'heure prévue."], trapIdx: 0, fix: "Bien que le vent soit", fullRight: "Bien que le vent soit très violent aujourd'hui, le ferry partira à l'heure prévue.", why: "La conjonction concessive « bien que » (tout comme « quoique ») exige obligatoirement le subjonctif (« soit »)." },
    { cefr: "B2", title: "Inventaire · Bibliothèque Nationale", en: "The letters that the diplomat wrote in 1924 were found in this leather trunk.", segments: ["Les lettres", "que le diplomate a écrit", "en 1924 ont été retrouvées", "dans cette malle en cuir."], trapIdx: 1, fix: "que le diplomate a écrites", fullRight: "Les lettres que le diplomate a écrites en 1924 ont été retrouvées dans cette malle en cuir.", why: "Accord du participe passé avec « avoir » : le COD « que » (« les lettres », fém. plur.) précède le verbe, d'où l'accord « écrites »." },
    { cefr: "B2", title: "Mémoires · Quai d'Orsay", en: "I still clearly remember that historic speech delivered under the Dome.", segments: ["Je me rappelle encore", "très nettement", "de ce discours historique", "prononcé sous la Coupole."], trapIdx: 2, fix: "ce discours historique", fullRight: "Je me rappelle encore très nettement ce discours historique prononcé sous la Coupole.", why: "« Se rappeler » est transitif direct (on se rappelle quelque chose, sans « de »), contrairement à « se souvenir de »." },
    { cefr: "B2", title: "Note juridique · Palais de Justice", en: "Here are all the certified documents that you need to close the file.", segments: ["Voici l'ensemble", "des pièces certifiées", "que vous avez besoin", "pour clore le dossier."], trapIdx: 2, fix: "dont vous avez besoin", fullRight: "Voici l'ensemble des pièces certifiées dont vous avez besoin pour clore le dossier.", why: "« Avoir besoin de » se construit avec « de » ; le pronom relatif correspondant est donc obligatoirement « dont »." },
    { cefr: "B2", title: "Carton d'invitation · Musée d'Orsay", en: "We sincerely hope that the curator will be able to attend the opening tomorrow evening.", segments: ["Nous espérons vivement", "que le conservateur puisse", "assister au vernissage", "demain soir."], trapIdx: 1, fix: "que le conservateur pourra", fullRight: "Nous espérons vivement que le conservateur pourra assister au vernissage demain soir.", why: "À la forme affirmative, « espérer que » est suivi de l'indicatif (souvent le futur « pourra ») et non du subjonctif." },
    { cefr: "C1", title: "Dépêche officielle · Palais de l'Élysée", en: "The reform took effect immediately after the minister signed the official decree.", segments: ["La réforme est entrée en vigueur", "immédiatement après que", "le ministre ait signé", "le décret officiel."], trapIdx: 2, fix: "le ministre a signé", fullRight: "La réforme est entrée en vigueur immédiatement après que le ministre a signé le décret officiel.", why: "Contrairement à « avant que » (+ subjonctif), « après que » introduit un fait accompli et régit l'indicatif (« a signé »)." },
    { cefr: "C1", title: "Rapport d'audit · Cour des Comptes", en: "This emergency budget aims to remedy the structural shortcomings of the hospital network.", segments: ["Ce budget d'urgence", "vise à pallier aux", "lacunes structurelles", "du réseau hospitalier."], trapIdx: 1, fix: "vise à pallier les", fullRight: "Ce budget d'urgence vise à pallier les lacunes structurelles du réseau hospitalier.", why: "En registre soutenu, « pallier » est transitif direct (« pallier les lacunes »). « Pallier à » est un solécisme calqué sur « remédier à »." },
    { cefr: "C1", title: "Éditorial · Le Monde Diplomatique", en: "Even though the treaty was ratified by ten states, its implementation remains uncertain.", segments: ["Malgré que le traité", "ait été ratifié", "par dix États,", "son application demeure incertaine."], trapIdx: 0, fix: "Bien que le traité", fullRight: "Bien que le traité ait été ratifié par dix États, son application demeure incertaine.", why: "« Malgré » est une préposition suivie d'un nom. Devant une proposition conjonctive, la norme exige « bien que » ou « quoique »." },
    { cefr: "C1", title: "Chronique d'architecture · Villa Savoye", en: "The patron had a modernist residence built for herself on the heights of Poissy.", segments: ["La mécène", "s'est faite construire", "une demeure moderniste", "sur les hauteurs de Poissy."], trapIdx: 1, fix: "s'est fait construire", fullRight: "La mécène s'est fait construire une demeure moderniste sur les hauteurs de Poissy.", why: "Le participe passé « fait » immédiatement suivi d'un infinitif (« fait + infinitif ») est strictement invariable." },
    { cefr: "C2", title: "Chaire d'Histoire · Collège de France", en: "The dynasties that succeeded one another on this throne bequeathed priceless manuscripts.", segments: ["Les dynasties", "qui se sont succédées", "sur ce trône ont légué", "des manuscrits inestimables."], trapIdx: 1, fix: "qui se sont succédé", fullRight: "Les dynasties qui se sont succédé sur ce trône ont légué des manuscrits inestimables.", why: "On succède À quelqu'un : le pronom réfléchi « se » est COI. Le participe passé « succédé » demeure donc invariable." },
    { cefr: "C2", title: "Mémoire d'épistémologie · La Sorbonne", en: "Upon close scrutiny of the archives, this philological hypothesis proved to be false.", segments: ["À l'examen minutieux des archives,", "cette hypothèse philologique", "s'est avérée fausse", "dès le premier chapitre."], trapIdx: 2, fix: "s'est révélée fausse", fullRight: "À l'examen minutieux des archives, cette hypothèse philologique s'est révélée fausse dès le premier chapitre.", why: "Issu du latin « verus » (vrai), « s'avérer » signifie « se révéler vrai ». « S'avérer faux » est un oxymore ; on écrira « se révéler faux »." },
    { cefr: "C2", title: "Correspondance · Académie Française", en: "We fear that such a hasty revision might compromise the clarity of the dictionary.", segments: ["Nous craignons", "qu'une révision si hâtive", "ne compromettra", "la clarté du dictionnaire."], trapIdx: 2, fix: "ne compromette", fullRight: "Nous craignons qu'une révision si hâtive ne compromette la clarté du dictionnaire.", why: "Les verbes de crainte (« craindre », « redouter ») régissent le subjonctif (« compromette »), accompagné du « ne » explétif." },
    { cefr: "C2", title: "Archives criminelles · Quai des Orfèvres", en: "The canvas vanished from the gallery without a single witness noticing it.", segments: ["La toile a disparu", "de la galerie", "sans qu'aucun témoin", "ne s'en aperçoive."], trapIdx: 3, fix: "s'en aperçoive.", fullRight: "La toile a disparu de la galerie sans qu'aucun témoin s'en aperçoive.", why: "« Sans que » porte déjà une négation pleine : accompagné de « aucun », l'ajout de « ne » est proscrit dans l'usage soutenu." }
  ];

  const LIAISON_CASES = [
    { cefr: "A1", fr: "Les amis arrivent.", phonetic: "Les‿amis [le.za.mi] (liaison obligatoire en [z])", en: "The friends are arriving.", q: "Comment prononce-t-on la frontière entre « Les » et « amis » ?", choices: ["Les‿amis [le.za.mi] — liaison obligatoire en [z]", "Les // amis [le a.mi] — coupure sans liaison", "Les‿amis [le.sa.mi] — liaison sourde en [s]", "L'amis [la.mi] — élision de l'article pluriel"], answer: "Les‿amis [le.za.mi] — liaison obligatoire en [z]", why: "Entre un déterminant pluriel (« les », « des », « ces ») et un nom commençant par une voyelle, la liaison en [z] est obligatoire." },
    { cefr: "A1", fr: "C'est un ami fidèle.", phonetic: "C'est‿un‿ami [sɛ.tœ̃.na.mi] (double liaison [t] + [n])", en: "He is a loyal friend.", q: "Quelle prosodie relie « C'est un ami » ?", choices: ["C'est‿un‿ami [sɛ.tœ̃.na.mi] — liaison en [t] puis en [n]", "C'est // un // ami [sɛ œ̃ a.mi] — aucune liaison", "C'est‿un // ami [sɛ.tœ̃ a.mi] — liaison après « c'est » seulement", "C'est // un‿ami [sɛ œ̃.za.mi] — liaison en [z]"], answer: "C'est‿un‿ami [sɛ.tœ̃.na.mi] — liaison en [t] puis en [n]", why: "La liaison est obligatoire après « c'est » ([t]) ainsi qu'entre l'article « un » et le nom « ami » ([n])." },
    { cefr: "A1", fr: "Un grand arbre centenaire.", phonetic: "Un grand‿arbre [œ̃ ɡʁɑ̃.taʁbʁ] (« d » dévoisé en [t])", en: "A tall century-old tree.", q: "Quel son produit le « d » final de « grand » devant « arbre » ?", choices: ["Un son [t] : grand‿arbre [ɡʁɑ̃.taʁbʁ]", "Un son [d] : grand‿arbre [ɡʁɑ̃.daʁbʁ]", "Aucune liaison : grand // arbre [ɡʁɑ̃ aʁbʁ]", "Un son [z] : grand‿arbre [ɡʁɑ̃.zaʁbʁ]"], answer: "Un son [t] : grand‿arbre [ɡʁɑ̃.taʁbʁ]", why: "En liaison, la consonne finale « d » d'un adjectif antéposé (« grand », « second ») s'assourdit et se prononce [t]." },
    { cefr: "A2", fr: "Elle a neuf ans aujourd'hui.", phonetic: "neuf‿ans [nœ.vɑ̃] (« f » sonorisé en [v])", en: "She is nine years old today.", q: "Comment se prononce « neuf ans » en français naturel ?", choices: ["neuf‿ans [nœ.vɑ̃] — le « f » se transforme en [v]", "neuf‿ans [nœ.fɑ̃] — le « f » garde le son [f]", "neuf // ans [nœ ɑ̃] — le « f » est muet sans liaison", "neuf‿ans [nœ.zɑ̃] — liaison en [z]"], answer: "neuf‿ans [nœ.vɑ̃] — le « f » se transforme en [v]", why: "Devant « ans » et « heures », le « f » final de « neuf » se sonorise en [v] : « neuf‿ans » [nœ.vɑ̃], « neuf‿heures » [nœ.vœʁ]." },
    { cefr: "A2", fr: "Nous dînons chez eux ce soir.", phonetic: "chez‿eux [ʃe.zø] (liaison obligatoire en [z])", en: "We are having dinner at their place tonight.", q: "Quelle est la prononciation exacte de « chez eux » ?", choices: ["chez‿eux [ʃe.zø] — liaison obligatoire en [z]", "chez // eux [ʃe ø] — liaison interdite", "chez‿eux [ʃe.sø] — liaison sourde en [s]", "chez‿eux [ʃɛ.tø] — liaison en [t]"], answer: "chez‿eux [ʃe.zø] — liaison obligatoire en [z]", why: "Après les prépositions monosyllabiques (« chez », « dans », « en », « sous », « sans »), la liaison avec le pronom est obligatoire." },
    { cefr: "A2", fr: "Ils ont appris la nouvelle.", phonetic: "Ils‿ont‿appris [il.zɔ̃.ta.pʁi] ([z] obligatoire)", en: "They learned the news.", q: "Comment relie-t-on le pronom sujet dans « Ils ont » ?", choices: ["Ils‿ont [il.zɔ̃] — liaison obligatoire en [z] entre pronom sujet et verbe", "Ils // ont [il ɔ̃] — liaison interdite après « ils »", "Ils‿ont [il.sɔ̃] — prononcé comme « ils sont » [s]", "Ils‿ont [i.lɔ̃] — le « s » tombe complètement"], answer: "Ils‿ont [il.zɔ̃] — liaison obligatoire en [z] entre pronom sujet et verbe", why: "La liaison en [z] entre le pronom sujet et le verbe est obligatoire et distingue « ils‿ont » [il.zɔ̃] de « ils sont » [il.sɔ̃]." },
    { cefr: "B1", fr: "Il voyage en train et en avion.", phonetic: "et // en‿avion [e ɑ̃.na.vjɔ̃] (liaison interdite après « et »)", en: "He travels by train and by plane.", q: "Que se passe-t-il après la conjonction « et » dans « et en avion » ?", choices: ["et // en‿avion [e ɑ̃.na.vjɔ̃] — liaison strictement interdite après « et »", "et‿en‿avion [e.tɑ̃.na.vjɔ̃] — liaison obligatoire en [t] après « et »", "et // en // avion [e ɑ̃ a.vjɔ̃] — aucune liaison nulle part", "et‿en // avion [e.tɑ̃ a.vjɔ̃] — liaison après « et » seulement"], answer: "et // en‿avion [e ɑ̃.na.vjɔ̃] — liaison strictement interdite après « et »", why: "Règle absolue : la liaison est TOUJOURS interdite après la conjonction « et » (mais obligatoire dans « en‿avion » [ɑ̃.na.vjɔ̃])." },
    { cefr: "B1", fr: "Les héros de ce roman.", phonetic: "Les // héros [le e.ʁo] (« h » aspiré — liaison interdite)", en: "The heroes of this novel.", q: "Pourquoi est-il crucial de ne PAS faire la liaison dans « Les héros » ?", choices: ["Car « héros » a un « h » aspiré : « les‿héros » [le.ze.ʁo] s'entendrait « les zéros » !", "Car « héros » est un nom masculin singulier invariable", "Car la liaison est facultative après l'article « les »", "Car le « h » se prononce avec une forte expiration gutturale [x]"], answer: "Car « héros » a un « h » aspiré : « les‿héros » [le.ze.ʁo] s'entendrait « les zéros » !", why: "« Héros » commence par un « h » aspiré qui bloque toute liaison ([le e.ʁo]) et évite l'homophonie avec « les zéros »." },
    { cefr: "B1", fr: "Un bon ami d'enfance.", phonetic: "Un bon‿ami [œ̃ bɔ.na.mi] (dénasalisation de « bon » en liaison)", en: "A good childhood friend.", q: "Comment évolue la voyelle nasale de « bon » dans « un bon ami » ?", choices: ["Elle se dénasalise : bon‿ami [bɔ.na.mi] (comme « bonne amie »)", "Elle reste nasale sans « n » : bon // ami [bɔ̃ a.mi]", "Elle produit une liaison en [t] : bon‿ami [bɔ̃.ta.mi]", "Elle se ferme en [u] : [bu.na.mi]"], answer: "Elle se dénasalise : bon‿ami [bɔ.na.mi] (comme « bonne amie »)", why: "Devant voyelle, les adjectifs en « -on / -ain / -en » (« bon », « prochain », « ancien ») perdent leur nasalité et lient en [n] : [bɔ.na.mi]." },
    { cefr: "B2", fr: "Un étudiant américain brillant.", phonetic: "Un‿étudiant // américain [œ̃.ne.ty.djɑ̃ a.me.ʁi.kɛ̃] (coupure après nom singulier)", en: "A brilliant American student.", q: "Peut-on lier le « t » de « étudiant » avec « américain » ?", choices: ["Non : Un‿étudiant // américain — liaison interdite après un nom singulier", "Oui : Un‿étudiant‿américain — liaison obligatoire en [t]", "Oui, mais uniquement avec un son [d]", "Aucune liaison n'est permise, même entre « Un » et « étudiant »"], answer: "Non : Un‿étudiant // américain — liaison interdite après un nom singulier", why: "Après un nom au singulier dont la consonne finale est muette, la liaison avec l'adjectif qui suit est interdite." },
    { cefr: "B2", fr: "Comment allez-vous ce matin ?", phonetic: "Comment‿allez-vous [kɔ.mɑ̃.ta.le.vu] (liaison figée obligatoire)", en: "How are you doing this morning?", q: "Quelle règle s'applique à « Comment allez-vous ? » ?", choices: ["Liaison figée obligatoire dans « Comment‿allez-vous » [kɔ.mɑ̃.ta.le.vu], mais interdite ailleurs après « comment »", "Liaison toujours obligatoire après « comment » devant n'importe quel verbe", "Liaison toujours interdite dans « Comment // allez-vous »", "Le « t » de « comment » se prononce [d] en liaison"], answer: "Liaison figée obligatoire dans « Comment‿allez-vous » [kɔ.mɑ̃.ta.le.vu], mais interdite ailleurs après « comment »", why: "La liaison après « comment » est interdite sauf dans la formule figée « Comment‿allez-vous ? » [kɔ.mɑ̃.ta.le.vu]." },
    { cefr: "B2", fr: "Quand il arrive, tout s'éclaire.", phonetic: "Quand‿il‿arrive [kɑ̃.ti.la.ʁiv] (« d » dévoisé en [t])", en: "When he arrives, everything lights up.", q: "Comment prononce-t-on « Quand il arrive » ?", choices: ["Quand‿il‿arrive [kɑ̃.ti.la.ʁiv] — « d » prononcé [t] puis enchaînement du [l]", "Quand‿il‿arrive [kɑ̃.di.la.ʁiv] — « d » prononcé [d]", "Quand // il arrive [kɑ̃ i.la.ʁiv] — liaison interdite après « quand »", "Quand‿il // arrive [kɑ̃.til a.ʁiv] — coupure avant « arrive »"], answer: "Quand‿il‿arrive [kɑ̃.ti.la.ʁiv] — « d » prononcé [t] puis enchaînement du [l]", why: "Après la conjonction « quand », la liaison assourdit le « d » en [t] ([kɑ̃.til]), suivi de l'enchaînement du [l]." },
    { cefr: "C1", fr: "Des haricots verts du jardin.", phonetic: "Des // haricots [de a.ʁi.ko] (« h » aspiré — pataquès à éviter)", en: "Green beans from the garden.", q: "Comment juge-t-on la prononciation « des-z-haricots » [de.za.ʁi.ko] ?", choices: ["C'est une faute de liaison (pataquès) : « haricot » a un « h » aspiré, on dit « des // haricots » [de a.ʁi.ko]", "C'est la liaison obligatoire standard après « des »", "C'est une liaison facultative recommandée dans le discours soutenu", "Il faut faire une élision : « d'haricots »"], answer: "C'est une faute de liaison (pataquès) : « haricot » a un « h » aspiré, on dit « des // haricots » [de a.ʁi.ko]", why: "« Haricot », « hasard », « hibou », « huit » et « onze » ont une initiale aspirée qui interdit toute liaison et toute élision." },
    { cefr: "C1", fr: "Les citoyens ont applaudi le discours.", phonetic: "Les citoyens // ont‿applaudi [le si.twa.jɛ̃ ɔ̃.ta.plo.di]", en: "The citizens applauded the speech.", q: "Où la liaison est-elle interdite dans « Les citoyens ont applaudi » ?", choices: ["Entre le groupe nominal sujet « Les citoyens » et le verbe « ont » : citoyens // ont", "Entre « Les » et « citoyens »", "Entre l'auxiliaire « ont » et le participe « applaudi »", "Aucune liaison n'est interdite dans cette phrase"], answer: "Entre le groupe nominal sujet « Les citoyens » et le verbe « ont » : citoyens // ont", why: "Contrairement au pronom sujet (« ils‿ont »), un groupe nominal sujet ne fait JAMAIS la liaison avec le verbe qui suit." },
    { cefr: "C1", fr: "Nous nous voyons de temps en temps.", phonetic: "de temps‿en temps [də tɑ̃.zɑ̃.tɑ̃] (locution figée)", en: "We see each other from time to time.", q: "Comment se comporte la liaison dans « de temps en temps » ?", choices: ["Liaison figée obligatoire en [z] : de temps‿en temps [də tɑ̃.zɑ̃.tɑ̃]", "Liaison interdite entre « temps » et « en »", "Liaison en [p] à cause du « p » étymologique", "Double liaison en [z] après chaque « temps »"], answer: "Liaison figée obligatoire en [z] : de temps‿en temps [də tɑ̃.zɑ̃.tɑ̃]", why: "Dans les locutions adverbiales figées (« de temps‿en temps », « mot‿à mot », « tout‿à coup »), la liaison interne est obligatoire." },
    { cefr: "C2", fr: "Un grand ami et une grande amie.", phonetic: "grand‿ami [ɡʁɑ̃.ta.mi] ([t]) vs grande‿amie [ɡʁɑ̃.da.mi] ([d])", en: "A great male friend and a great female friend.", q: "Quel contraste phonétique distingue « un grand ami » de « une grande amie » ?", choices: ["Masculin [ɡʁɑ̃.ta.mi] (liaison sourde en [t]) vs Féminin [ɡʁɑ̃.da.mi] (enchaînement sonore en [d])", "Les deux se prononcent identiquement [ɡʁɑ̃.da.mi] avec un son [d]", "Les deux se prononcent identiquement [ɡʁɑ̃.ta.mi] avec un son [t]", "Le « e » muet de « grande » empêche tout enchaînement"], answer: "Masculin [ɡʁɑ̃.ta.mi] (liaison sourde en [t]) vs Féminin [ɡʁɑ̃.da.mi] (enchaînement sonore en [d])", why: "Au masculin, le « d » muet se dévoise en [t] par liaison ([ɡʁɑ̃.ta.mi]). Au féminin, le « d » est prononcé [d] par enchaînement ([ɡʁɑ̃.da.mi])." },
    { cefr: "C2", fr: "Un argument plus habile et plus efficace.", phonetic: "plus‿habile [ply.za.bil] (« s » sonorisé en [z])", en: "A more skillful and more effective argument.", q: "Comment se prononce le comparatif « plus » devant un adjectif commençant par une voyelle ?", choices: ["Le « s » fait une liaison sonore en [z] : plus‿habile [ply.za.bil]", "On prononce le [s] final dur sans liaison : [plys a.bil]", "On ne prononce ni [s] ni [z] : [ply a.bil]", "« Habile » a un « h » aspiré qui bloque la liaison"], answer: "Le « s » fait une liaison sonore en [z] : plus‿habile [ply.za.bil]", why: "Devant un adjectif à initiale vocalique ou « h » muet, l'adverbe comparatif « plus » se lie obligatoirement en [z] ([ply.za.bil])." },
    { cefr: "C2", fr: "Qu'un sang impur abreuve nos sillons.", phonetic: "sang‿impur [sɑ̃.kɛ̃.pyʁ] (« g » dévoisé en [k])", en: "May an impure blood water our furrows.", q: "Dans la diction soutenue, comment se réalise la liaison du « g » dans « sang impur » ou « long hiver » ?", choices: ["Le « g » final s'assourdit en [k] : sang‿impur [sɑ̃.kɛ̃.pyʁ], long‿hiver [lɔ̃.ki.vɛʁ]", "Le « g » se prononce comme un « j » doux [ʒ]", "Le « g » produit une liaison nasale en [n]", "Le « g » reste strictement muet"], answer: "Le « g » final s'assourdit en [k] : sang‿impur [sɑ̃.kɛ̃.pyʁ], long‿hiver [lɔ̃.ki.vɛʁ]", why: "En prosodie soutenue (« sang‿impur », « long‿hiver », « suer sang‿et eau »), le « g » final se dévoise en [k] lors de la liaison." }
  ];

  function buildEnqueteSteps(cefr, max = 1) {
    const r = cefrRank(cefr);
    const pool = ENQUETE_CASES.filter((c) => Math.abs(cefrRank(c.cefr) - r) <= 1);
    const picked = shuffle(pool.length ? pool : ENQUETE_CASES).slice(0, max);
    return picked.map((c) => ({
      k: "enquete",
      level: c.cefr,
      title: c.title,
      en: c.en,
      segments: c.segments.slice(),
      trapIdx: c.trapIdx,
      fix: c.fix,
      fr: c.fullRight,
      answer: c.fullRight,
      why: c.why,
      skill: ["grammar", "reading", "writing"]
    }));
  }

  function buildLiaisonSteps(cefr, max = 1) {
    const r = cefrRank(cefr);
    const pool = LIAISON_CASES.filter((c) => Math.abs(cefrRank(c.cefr) - r) <= 1);
    const picked = shuffle(pool.length ? pool : LIAISON_CASES).slice(0, max);
    return picked.map((c) => ({
      k: "liaison",
      level: c.cefr,
      fr: c.fr,
      phonetic: c.phonetic,
      en: c.en,
      q: c.q,
      choices: shuffle(c.choices.slice()),
      answer: c.answer,
      why: c.why,
      sayAnswer: false,
      skill: ["pronunciation", "listening", "speaking"]
    }));
  }

  function buildForgeronSteps(cefr, max = 1) {
    const verbs = (DATA && Array.isArray(DATA.verbs) && DATA.verbs.length) ? DATA.verbs : [];
    if (!verbs.length) return [];
    const r = cefrRank(cefr);
    const A1_CORE = new Set(["être", "avoir", "aller", "faire", "dire", "pouvoir", "vouloir", "venir", "prendre", "parler", "manger", "boire", "aimer", "habiter", "travailler", "finir", "voir", "savoir", "mettre", "donner"]);
    const prefTenses = r === 0
      ? ["Présent", "Impératif présent"]
      : r === 1
        ? ["Présent", "Passé composé", "Imparfait", "Futur simple"]
        : r === 2
          ? ["Passé composé", "Imparfait", "Futur simple", "Conditionnel présent"]
          : r === 3
            ? ["Subjonctif présent", "Plus-que-parfait", "Conditionnel passé", "Conditionnel présent"]
            : ["Subjonctif présent", "Subjonctif passé", "Plus-que-parfait", "Conditionnel passé", "Futur antérieur"];
    const verbPool = r === 0
      ? verbs.filter((v) => v && A1_CORE.has(String(v.infinitive || v.verb || v.fr || "").toLowerCase()))
      : r === 1
        ? verbs.slice(0, Math.min(45, verbs.length))
        : r === 2
          ? verbs.slice(0, Math.min(68, verbs.length))
          : verbs;
    const poolToUse = verbPool.length >= 6 ? verbPool : verbs;
    const contextCue = {
      "Présent": "En ce moment même à Paris :",
      "Impératif présent": "Conseil ou ordre poli à Paris :",
      "Passé composé": "Hier soir, lors de la rencontre :",
      "Imparfait": "Autrefois, chaque automne :",
      "Futur simple": "Dès demain matin, sans faute :",
      "Conditionnel présent": "Si les conditions étaient réunies :",
      "Conditionnel passé": "Si nous avions agi plus tôt :",
      "Plus-que-parfait": "Avant même que la séance ne commence :",
      "Futur antérieur": "D'ici demain soir, une fois terminé :",
      "Subjonctif présent": "Il est impératif que / Bien que…",
      "Subjonctif passé": "Bien qu'il ait déjà…"
    };
    const out = [];
    for (const v of shuffle(poolToUse)) {
      if (out.length >= max) break;
      if (!v || !v.tenses) continue;
      const avail = prefTenses.filter((t) => Array.isArray(v.tenses[t]) && v.tenses[t].length >= 4);
      const tName = avail.length ? pick(avail) : Object.keys(v.tenses).find((t) => Array.isArray(v.tenses[t]) && v.tenses[t].length >= 4);
      if (!tName) continue;
      const forms = v.tenses[tName].filter((f) => f && f.fr && f.en && !/\(/.test(f.fr));
      if (forms.length < 3) continue;
      const target = pick(forms);
      const allOtherForms = Object.keys(v.tenses).flatMap((tk) => (v.tenses[tk] || []).map((f) => f && f.fr)).filter((f) => f && !/\(/.test(f) && normLoose(f) !== normLoose(target.fr));
      const distractors = shuffle(Array.from(new Set(allOtherForms))).slice(0, 3);
      if (distractors.length < 3) continue;
      const cue = contextCue[tName] || "En contexte :";
      out.push({
        k: "forgeron",
        level: cefr,
        verbTitle: v.title || "Verbe",
        verbGroup: v.group || "",
        tenseName: tName,
        cueFr: cue,
        en: target.en,
        fr: target.fr,
        answer: target.fr,
        choices: shuffle([target.fr].concat(distractors)),
        why: `Forge du verbe « ${v.title} » au **${tName}** : « **${target.fr}** » (${target.en}).`,
        sayAnswer: true,
        skill: ["grammar", "writing"]
      });
    }
    return out;
  }

  // ---- ⚖️ La Joute Oratoire Contradictoire (3-Phase Dialectical Debate A2 → C2)
  const JOUTE_CASES = [
    {
      id: "joute_a2_1", cefr: "A2", speaker: "Camille · Terrasse de Montmartre", topic: "Vie de Quartier vs Grandes Surfaces",
      thesisFr: "Les petits commerces de quartier coûtent trop cher ; aujourd'hui, il vaut mieux tout commander en ligne sans sortir de chez soi.",
      thesisEn: "Neighborhood shops cost too much; today it's better to order everything online without leaving home.",
      rounds: [
        {
          phase: "1. Concession Nuancée",
          prompt: "Reconnaissez l'avantage pratique de la thèse adverse avant de la nuancer :",
          options: [
            { fr: "C'est vrai que commander en ligne fait gagner du temps et permet de comparer les prix facilement.", ok: true, why: "« C'est vrai que... » ouvre la concession avec calme et courtoisie." },
            { fr: "Tu dis n'importe quoi, Internet détruit tout et personne n'aime les livreurs !", ok: false, why: "Trop brutal : une joute française commence par concéder la part de vérité adverse." },
            { fr: "Nonobstant l'ubiquité algorithmique, je récuse ce postulat mercantile.", ok: false, why: "Registre disproportionné pour une discussion quotidienne de niveau A2." }
          ]
        },
        {
          phase: "2. Réfutation & Pivot",
          prompt: "Introduisez l'argument décisif qui renverse la thèse :",
          options: [
            { fr: "Pourtant, les commerçants du quartier offrent des produits frais, des conseils humains et font vivre nos rues.", ok: true, why: "« Pourtant » marque le pivot argumentatif avec clarté." },
            { fr: "Et aussi j'achète du pain tous les matins parce que la boulangerie est ouverte.", ok: false, why: "Anecdote personnelle sans connecteur d'opposition." },
            { fr: "Donc il faut interdire tous les sites internet dès demain matin.", ok: false, why: "Conclusion extrême qui rompt la logique du débat." }
          ]
        },
        {
          phase: "3. Synthèse & Dépassement",
          prompt: "Concluez par un équilibre convaincant :",
          options: [
            { fr: "Finalement, on peut utiliser Internet pour certains achats rares tout en privilégiant nos artisans au quotidien.", ok: true, why: "Synthèse équilibrée avec « tout en + gérondif » !" },
            { fr: "Bref, chacun fait ce qu'il veut et on n'en parle plus.", ok: false, why: "Clôture évasive qui abandonne l'argumentation." },
            { fr: "C'est pourquoi les supermarchés sont fermés le dimanche soir.", ok: false, why: "Hors sujet par rapport à la synthèse attendue." }
          ]
        }
      ]
    },
    {
      id: "joute_b1_1", cefr: "B1", speaker: "Élodie · Passage des Panoramas", topic: "Télétravail Intégral vs Présence au Bureau",
      thesisFr: "Le bureau physique appartient au passé : travailler cent pour cent à distance garantit une productivité supérieure et élimine la fatigue des transports.",
      thesisEn: "The physical office belongs to the past: working 100% remotely guarantees higher productivity and eliminates commuting fatigue.",
      rounds: [
        {
          phase: "1. Concession Nuancée",
          prompt: "Accordez le point sur les transports et la concentration individuelle :",
          options: [
            { fr: "Il est indéniable que le télétravail épargne des heures de trajet et favorise la concentration sur les tâches individuelles.", ok: true, why: "« Il est indéniable que » pose une concession B1/B2 solide et élégante." },
            { fr: "Personne n'aime prendre le métro à huit heures du matin, c'est l'enfer !", ok: false, why: "Réaction familière qui manque de tenue argumentative." },
            { fr: "Je refuse totalement cette idée car travailler chez soi est ennuyeux.", ok: false, why: "Refus frontal sans concession dialectique." }
          ]
        },
        {
          phase: "2. Réfutation & Pivot",
          prompt: "Pivoter sur la créativité collective et le lien social :",
          options: [
            { fr: "Cependant, l'isolement prolongé affaiblit l'esprit d'équipe et prive les jeunes recrues de la transmission informelle du métier.", ok: true, why: "« Cependant » + double argument précis (« esprit d'équipe », « transmission informelle »)." },
            { fr: "Mais au bureau la machine à café est gratuite et on rigole bien avec les collègues.", ok: false, why: "Argument trop anecdotique et familier (« on rigole bien »)." },
            { fr: "D'ailleurs, beaucoup d'entreprises louent des immeubles très modernes à La Défense.", ok: false, why: "Constat immobilier qui ne réfute pas la thèse sur la productivité." }
          ]
        },
        {
          phase: "3. Synthèse & Dépassement",
          prompt: "Proposez un modèle hybride cohérent :",
          options: [
            { fr: "Dès lors, l'équilibre réside dans un rythme hybride qui conjugue l'autonomie du domicile et l'émulation des rencontres présentielles.", ok: true, why: "« Dès lors » + « conjuguer autonomie et émulation » : superbe synthèse !" },
            { fr: "En conclusion, il faut laisser chaque salarié décider au jour le jour sans aucune règle.", ok: false, why: "Proposition désorganisée qui ignore les besoins collectifs." },
            { fr: "Il vaut donc mieux habiter juste à côté de son bureau à Paris.", ok: false, why: "Fausse solution irréaliste pour la majorité des salariés." }
          ]
        }
      ]
    },
    {
      id: "joute_b2_1", cefr: "B2", speaker: "Marc-Antoine · La Défense", topic: "Croissance Économique vs Sobriété Écologique",
      thesisFr: "Toute contrainte environnementale imposée aux entreprises européennes pénalise immédiatement leur compétitivité face aux géants internationaux.",
      thesisEn: "Any environmental constraint imposed on European companies immediately penalizes their competitiveness against international giants.",
      rounds: [
        {
          phase: "1. Concession Nuancée",
          prompt: "Admettez le coût d'adaptation à court terme avec le subjonctif :",
          options: [
            { fr: "Bien que la transition écologique exige des investissements initiaux considérables, on ne peut réduire la compétitivité au seul coût immédiat.", ok: true, why: "« Bien que + subjonctif (exige) » ouvre la joute avec une maîtrise B2/C1 exemplaire." },
            { fr: "Bien que la transition écologique exigeait beaucoup d'argent, ce n'est pas grave.", ok: false, why: "Piège grammatical : « bien que » exige le subjonctif, et « ce n'est pas grave » est trop faible." },
            { fr: "Les entreprises se plaignent toujours dès qu'on change une règle !", ok: false, why: "Polémique familière sans valeur argumentative." }
          ]
        },
        {
          phase: "2. Réfutation & Pivot",
          prompt: "Démontrez que l'inaction est le véritable risque stratégique :",
          options: [
            { fr: "En revanche, retarder la décarbonation exposerait nos filières industrielles à une obsolescence technologique et énergétique irréversible.", ok: true, why: "« En revanche » + conditionnel « exposerait » : démonstration stratégique implacable." },
            { fr: "Mais si on pollue trop, il fera trop chaud l'été prochain à Paris.", ok: false, why: "Simplification excessive pour un débat économique de niveau B2." },
            { fr: "Par conséquent, les consommateurs achèteront uniquement des produits locaux.", ok: false, why: "Lien logique (« par conséquent ») mal employé." }
          ]
        },
        {
          phase: "3. Synthèse & Dépassement",
          prompt: "Réconciliez innovation verte et souveraineté économique :",
          options: [
            { fr: "Il convient donc d'ériger l'excellence environnementale en avantage compétitif durable, soutenu par une réciprocité des normes aux frontières.", ok: true, why: "« Il convient d'ériger... en » formule une véritable synthèse de politique publique." },
            { fr: "Bref, il faut espérer que tout s'arrange avec le temps et la technologie.", ok: false, why: "Conclusion passive et vague." },
            { fr: "C'est pourquoi nous devons fermer toutes les usines dès cette année.", ok: false, why: "Caricature qui contredit la nuance du débat." }
          ]
        }
      ]
    },
    {
      id: "joute_c1_1", cefr: "C1", speaker: "Bâtonnière de Montmirail · Palais de Justice", topic: "Justice Prédictive & Algorithmes face au Juge Humain",
      thesisFr: "Confier l'analyse des litiges à des algorithmes de justice prédictive permettrait d'éliminer l'aléa judiciaire et de garantir une égalité mathématique devant la loi.",
      thesisEn: "Entrusting dispute analysis to predictive justice algorithms would eliminate judicial unpredictability and guarantee mathematical equality before the law.",
      rounds: [
        {
          phase: "1. Concession Nuancée",
          prompt: "Reconnaissez l'aspiration à l'harmonisation de la jurisprudence :",
          options: [
            { fr: "Certes, le recours aux outils statistiques peut éclairer les magistrats en réduisant les disparités manifestes entre juridictions.", ok: true, why: "« Certes » + concession mesurée sur l'harmonisation jurisprudentielle." },
            { fr: "Les ordinateurs calculent évidemment beaucoup plus vite que les juges fatigués.", ok: false, why: "Formulation triviale qui manque la hauteur juridique C1." },
            { fr: "Il est formellement exclu qu'une machine entre jamais dans un tribunal français.", ok: false, why: "Refus dogmatique qui ignore la concession dialectique." }
          ]
        },
        {
          phase: "2. Réfutation & Pivot",
          prompt: "Réfutez l'illusion d'une justice purement mécanique :",
          options: [
            { fr: "Il n'en demeure pas moins que figer le droit dans la répétition statistique du passé reviendrait à nier la singularité irréductible de chaque cause humaine.", ok: true, why: "« Il n'en demeure pas moins que » + « reviendrait à nier » : pivot C1/C2 d'une grande force." },
            { fr: "Mais les algorithmes font parfois des bugs informatiques très dangereux.", ok: false, why: "Vocabulaire relâché (« faire des bugs ») indigne d'une plaidoirie." },
            { fr: "De plus, les avocats aiment beaucoup plaider longtemps devant le public.", ok: false, why: "Hors sujet corporatiste." }
          ]
        },
        {
          phase: "3. Synthèse & Dépassement",
          prompt: "Définissez la juste place de l'outil numérique au service du juge :",
          options: [
            { fr: "Dès lors, l'outil algorithmique doit demeurer un auxiliaire documentaire subordonné à l'intime conviction et à la prudence interprétative du magistrat.", ok: true, why: "« Dès lors » + « subordonné à l'intime conviction » : synthèse juridique souveraine." },
            { fr: "En résumé, on utilisera l'ordinateur seulement pour les petites amendes de stationnement.", ok: false, why: "Réduction réductrice qui esquive la question de principe." },
            { fr: "Finalement, la loi changera toute seule grâce à l'intelligence artificielle.", ok: false, why: "Contresens constitutionnel et logique." }
          ]
        }
      ]
    },
    {
      id: "joute_c2_1", cefr: "C2", speaker: "Professeure Rochefort · La Sorbonne", topic: "L'Accélération Numérique & la Pensée Critique",
      thesisFr: "Dans l'économie contemporaine de l'attention, la brièveté percutante du slogan l'emporte nécessairement sur la lente architecture de l'argumentation écrite.",
      thesisEn: "In the contemporary attention economy, the punchy brevity of the slogan necessarily prevails over the slow architecture of written argumentation.",
      rounds: [
        {
          phase: "1. Concession Nuancée",
          prompt: "Concédez l'efficacité immédiate de la formule brève dans l'espace médiatique :",
          options: [
            { fr: "Quoique l'immédiateté des réseaux confère à la formule lapidaire une puissance de diffusion inédite, l'efficacité d'un énoncé ne se mesure pas à sa seule vitesse de propagation.", ok: true, why: "« Quoique + subjonctif (confère) » et distinction conceptuelle entre vitesse et justesse." },
            { fr: "C'est sûr que les phrases courtes marchent super bien sur les réseaux sociaux aujourd'hui.", ok: false, why: "Rupture de registre (« c'est sûr », « super bien ») face au jury de la Sorbonne." },
            { fr: "La brièveté a toujours été l'ennemie absolue de l'intelligence humaine.", ok: false, why: "Affirmation péremptoire (qui oublie l'art français de la maxime !)." }
          ]
        },
        {
          phase: "2. Réfutation & Pivot",
          prompt: "Dévoilez l'écueil démocratique de la sidération instantanée :",
          options: [
            { fr: "Force est toutefois de constater que la tyrannie du choc émotionnel atrophie la délibération collective en substituant le réflexe binaire à l'examen contradictoire.", ok: true, why: "« Force est toutefois de constater que » + « substituer A à B » : pur style DALF C2." },
            { fr: "Mais quand les textes sont trop courts, les lecteurs ne comprennent pas tous les détails.", ok: false, why: "Constat B1 trop plat pour une joute magistrale C2." },
            { fr: "C'est pourquoi personne ne lit plus aucun livre de philosophie depuis dix ans.", ok: false, why: "Exagération factuellement fausse." }
          ]
        },
        {
          phase: "3. Synthèse & Dépassement",
          prompt: "Élevez le débat en réconciliant concision du trait et profondeur du raisonnement :",
          options: [
            { fr: "C'est à cette aune qu'il importe de réconcilier la vigueur du trait — héritée de nos moralistes classiques — avec la patience démonstrative sans laquelle aucune pensée libre ne saurait s'édifier.", ok: true, why: "« C'est à cette aune que », « sans laquelle », « ne saurait s'édifier » : couronnement C2 !" },
            { fr: "En conclusion, il faut écrire des articles de longueur moyenne pour satisfaire tout le monde.", ok: false, why: "Compromis tiède dépourvu d'élévation conceptuelle." },
            { fr: "Il convient donc de supprimer les réseaux sociaux dans les universités.", ok: false, why: "Conclusion autoritaire hors de propos." }
          ]
        }
      ]
    },
    {
      id: "joute_c2_2", cefr: "C2", speaker: "Secrétaire Perpétuel Valcourt · Sous la Coupole", topic: "Universalité de la Traduction Automatique vs Maîtrise Intime des Langues",
      thesisFr: "À l'ère des traducteurs neuronaux instantanés, consacrer des années à l'apprentissage exigeant d'une langue étrangère jusqu'au niveau C2 relèverait d'une coquetterie anachronique.",
      thesisEn: "In the era of instant neural translators, devoting years to the demanding study of a foreign language up to C2 level would amount to an anachronistic vanity.",
      rounds: [
        {
          phase: "1. Concession Nuancée",
          prompt: "Reconnaissez l'utilité instrumentale de la traduction automatique :",
          options: [
            { fr: "Sans doute les outils de traduction instantanée facilitent-ils les échanges transactionnels et lèvent-ils les barrières pratiques de premier niveau.", ok: true, why: "« Sans doute » en tête de phrase avec inversion complexe (« facilitent-ils ») : grand style C2 !" },
            { fr: "Les applications de traduction sont effectivement très pratiques quand on voyage à l'étranger.", ok: false, why: "Registre courant honnête, mais sans l'architecture syntaxique attendue Sous la Coupole." },
            { fr: "Les machines traduisent toujours très mal les poèmes et les blagues.", ok: false, why: "Refus direct qui saute l'étape de la concession." }
          ]
        },
        {
          phase: "2. Réfutation & Pivot",
          prompt: "Montrez qu'habiter une langue dépasse le simple transfert d'informations :",
          options: [
            { fr: "Néanmoins, réduire une langue à un simple code utilitaire revient à ignorer qu'elle façonne notre rapport au monde, à l'implicite, à l'ironie et à la cadence même de la pensée.", ok: true, why: "« Néanmoins » + « réduire A à B revient à ignorer que... » : réfutation philosophique lumineuse." },
            { fr: "Pourtant, c'est beaucoup plus sympathique de parler directement sans regarder son téléphone.", ok: false, why: "Argument valide mais exprimé dans un registre trop familier/courant." },
            { fr: "Par ailleurs, les batteries de téléphone tombent souvent en panne en voyage.", ok: false, why: "Argument technique trivial dans un débat sur la philosophie du langage." }
          ]
        },
        {
          phase: "3. Synthèse & Dépassement",
          prompt: "Scellez votre réception Sous la Coupole par une synthèse souveraine :",
          options: [
            { fr: "Loin de rendre caduque la maîtrise C2, l'automatisation du langage utilitaire confère une valeur plus décisive encore à qui sait habiter souverainement la nuance, le style et l'âme d'une langue.", ok: true, why: "« Loin de rendre caduque... confère une valeur plus décisive à qui sait... » : apothéose C2 !" },
            { fr: "En définitive, il faut utiliser le traducteur au début puis apprendre quelques mots utiles.", ok: false, why: "Synthèse minimaliste qui contredit l'ambition C2." },
            { fr: "Ainsi, seules les élites littéraires continueront d'apprendre les langues étrangères.", ok: false, why: "Conclusion élitiste contraire à l'esprit humaniste de l'Odyssée." }
          ]
        }
      ]
    }
  ];

  function buildJouteSteps(cefr, max = 1) {
    const r = cefrRank(cefr);
    const pool = JOUTE_CASES.filter((c) => Math.abs(cefrRank(c.cefr) - r) <= 1);
    const picked = shuffle(pool.length ? pool : JOUTE_CASES).slice(0, max);
    return picked.map((c) => ({
      k: "joute",
      level: c.cefr,
      jouteId: c.id,
      speaker: c.speaker,
      topic: c.topic,
      fr: c.thesisFr,
      thesisFr: c.thesisFr,
      thesisEn: c.thesisEn,
      rounds: c.rounds.map((rd) => ({
        phase: rd.phase,
        prompt: rd.prompt,
        options: shuffle(rd.options.slice())
      })),
      _phase: 0,
      _chain: [],
      skill: ["speaking", "writing", "grammar"]
    }));
  }

  // ---- 🎭 L'Atelier des Idiomes, Litotes & Sous-Entendus (18 Pragmatic & Idiomatic Cases A1 → C2)
  const IDIOME_CASES = [
    {
      id: "idiome_a1_1", cefr: "A1", category: "Expression Figurée", place: "Terrasse du Café de Flore · Saint-Germain", speaker: "Camille",
      idiomFr: "Ce n'est pas la mer à boire !", literalEn: "Literally: “It is not the sea to drink!”",
      contextFr: "Rassure-toi pour ce premier dialogue en français : ce n'est pas la mer à boire, on va avancer pas à pas.",
      contextEn: "Don't worry about this first dialogue in French: it's not that hard, we'll go step by step.",
      q: "Que veut dire Camille en utilisant l'expression « ce n'est pas la mer à boire » ?",
      choices: [
        "Ce n'est pas une tâche insurmontable ; c'est tout à fait accessible.",
        "Il ne faut jamais boire l'eau salée quand on va à la plage.",
        "Le café est beaucoup trop grand pour une seule personne.",
        "Il est impossible de réussir cet exercice aujourd'hui."
      ],
      answer: "Ce n'est pas une tâche insurmontable ; c'est tout à fait accessible.",
      reparteeFr: "Tu as raison, ce n'est pas la mer à boire : je me lance !",
      why: "Issu d'une fable de La Fontaine, « ce n'est pas la mer à boire » s'emploie au quotidien pour dédramatiser une difficulté."
    },
    {
      id: "idiome_a1_2", cefr: "A1", category: "Expression Quotidienne", place: "Studio Radio Lumière · Paris 16e", speaker: "Maître Marin",
      idiomFr: "Avoir un chat dans la gorge", literalEn: "Literally: “To have a cat in the throat”",
      contextFr: "Pardonnez-moi, j'ai un chat dans la gorge ce matin ; laissez-moi boire une gorgée d'eau tiède avant l'enregistrement.",
      contextEn: "Forgive me, I have a frog in my throat this morning; let me drink a sip of warm water before recording.",
      q: "Que signifie « avoir un chat dans la gorge » ?",
      choices: [
        "Avoir la voix enrouée ou une gêne dans la gorge qui empêche de parler clairement.",
        "Aimer énormément les animaux domestiques.",
        "Avoir très faim avant le déjeuner.",
        "Parler avec un accent régional très prononcé."
      ],
      answer: "Avoir la voix enrouée ou une gêne dans la gorge qui empêche de parler clairement.",
      reparteeFr: "Prenez votre temps, buvez un verre d'eau pour éclaircir votre voix.",
      why: "Là où l'anglais dit « a frog in one's throat », le français dit toujours « avoir un chat dans la gorge »."
    },
    {
      id: "idiome_a1_3", cefr: "A1", category: "Expression Figurée", place: "Ligne 4 · Gare du Nord", speaker: "Contrôleur Moreau",
      idiomFr: "Tomber dans les pommes", literalEn: "Literally: “To fall into the apples”",
      contextFr: "Il faisait si chaud dans la rame bondée que le voyageur a failli tomber dans les pommes.",
      contextEn: "It was so hot in the crowded train car that the passenger nearly fainted.",
      q: "Que signifie « tomber dans les pommes » ?",
      choices: [
        "S'évanouir, perdre connaissance brièvement.",
        "Faire ses courses au marché de fruits et légumes.",
        "Glisser sur le trottoir un jour de pluie.",
        "Dormir profondément dans son lit."
      ],
      answer: "S'évanouir, perdre connaissance brièvement.",
      reparteeFr: "Vite, ouvrons la fenêtre et donnons-lui une place assise !",
      why: "« Tomber dans les pommes » (altération ancienne de « tomber en pâmoison », se pâmer) signifie perdre connaissance."
    },
    {
      id: "idiome_a2_1", cefr: "A2", category: "Expression Idiomatique", place: "Bistrot de la Butte · Montmartre", speaker: "Camille",
      idiomFr: "Poser un lapin à quelqu'un", literalEn: "Literally: “To put down a rabbit to someone”",
      contextFr: "J'ai attendu Julien pendant une heure sous l'horloge de la gare : il m'a posé un lapin sans même envoyer un message !",
      contextEn: "I waited for Julien for an hour under the station clock: he stood me up without even sending a text!",
      q: "Que reproche Camille à Julien quand elle dit qu'il lui a « posé un lapin » ?",
      choices: [
        "De ne pas être venu au rendez-vous prévu sans prévenir.",
        "D'avoir commandé un plat traditionnel au bistrot sans l'attendre.",
        "De lui avoir offert un animal de compagnie par surprise.",
        "D'être arrivé avec cinq minutes d'avance."
      ],
      answer: "De ne pas être venu au rendez-vous prévu sans prévenir.",
      reparteeFr: "Franchement, te poser un lapin sans prévenir, ce n'est pas très élégant !",
      why: "« Poser un lapin (à quelqu'un) » est l'expression incontournable pour dire « to stand someone up »."
    },
    {
      id: "idiome_a2_2", cefr: "A2", category: "Négociation & Vie Pratique", place: "Marché d'Aligre · Paris 12e", speaker: "Élodie",
      idiomFr: "Couper la poire en deux", literalEn: "Literally: “To cut the pear in two”",
      contextFr: "Vous en demandez cent euros et je vous en propose quatre-vingts : coupons la poire en deux à quatre-vingt-dix euros !",
      contextEn: "You're asking a hundred euros and I'm offering eighty: let's split the difference at ninety euros!",
      q: "Que propose Élodie en disant « coupons la poire en deux » ?",
      choices: [
        "De trouver un compromis équitable à mi-chemin entre les deux positions.",
        "De partager un dessert aux fruits à la fin du repas.",
        "D'annuler complètement la transaction commerciale.",
        "De payer en deux versements le mois prochain."
      ],
      answer: "De trouver un compromis équitable à mi-chemin entre les deux positions.",
      reparteeFr: "Marché conclu : coupons la poire en deux, cela arrange tout le monde !",
      why: "« Couper la poire en deux » signifie faire des concessions mutuelles (« to split the difference / meet halfway »)."
    },
    {
      id: "idiome_a2_3", cefr: "A2", category: "Expression Familière & Courante", place: "Quai de Valmy · Canal Saint-Martin", speaker: "Yanis",
      idiomFr: "En faire tout un fromage", literalEn: "Literally: “To make a whole cheese out of it”",
      contextFr: "Calme-toi, j'ai seulement renversé trois gouttes d'eau sur la nappe : tu ne vas pas en faire tout un fromage !",
      contextEn: "Calm down, I only spilled three drops of water on the tablecloth: you're not going to make a big deal out of it!",
      q: "Que veut dire « en faire tout un fromage » ?",
      choices: [
        "Transformer un détail insignifiant en un drame disproportionné.",
        "Préparer un plateau de fromages pour les invités du soir.",
        "Oublier rapidement une petite maladresse.",
        "Demander l'addition au serveur de la brasserie."
      ],
      answer: "Transformer un détail insignifiant en un drame disproportionné.",
      reparteeFr: "Tu as raison, n'en faisons pas tout un fromage, ce n'est rien du tout.",
      why: "Partir d'un simple lait liquide pour fabriquer « tout un fromage » complexe illustre l'exagération d'une broutille."
    },
    {
      id: "idiome_b1_1", cefr: "B1", category: "Pragmatique Sociale", place: "Galerie des Arcades · Place des Vosges", speaker: "Céleste Vance",
      idiomFr: "Mettre les pieds dans le plat", literalEn: "Literally: “To put one's feet into the dish”",
      contextFr: "Tout le monde évitait soigneusement d'évoquer le budget déficitaire, jusqu'à ce que Paul mette les pieds dans le plat dès l'ouverture de la séance.",
      contextEn: "Everyone carefully avoided mentioning the deficit budget, until Paul put his foot in it / brought up the elephant in the room right at the start.",
      q: "Que fait quelqu'un qui « met les pieds dans le plat » ?",
      choices: [
        "Il aborde brusquement et sans détour un sujet tabou ou embarrassant.",
        "Il respecte scrupuleusement les usages diplomatiques.",
        "Il refuse de participer à une discussion collective.",
        "Il critique la qualité gastronomique d'un repas officiel."
      ],
      answer: "Il aborde brusquement et sans détour un sujet tabou ou embarrassant.",
      reparteeFr: "Au moins, en mettant les pieds dans le plat, il a dissipé le non-dit !",
      why: "« Mettre les pieds dans le plat » signifie crever l'abcès ou aborder sans filtre une question délicate."
    },
    {
      id: "idiome_b1_2", cefr: "B1", category: "Art de la Conversation", place: "Boulevard Haussmann · Paris 9e", speaker: "Marc-Antoine",
      idiomFr: "Tourner autour du pot", literalEn: "Literally: “To circle around the pot”",
      contextFr: "Écoutez, nous avons peu de temps avant le comité : cessez de tourner autour du pot et dites-moi franchement ce qui bloque le contrat.",
      contextEn: "Listen, we have little time before the committee: stop beating around the bush and tell me frankly what's holding up the contract.",
      q: "Que demande Marc-Antoine lorsqu'il dit « cessez de tourner autour du pot » ?",
      choices: [
        "D'aller droit au but sans se perdre en précautions ou en prétextes.",
        "De vérifier la décoration florale de la salle de réunion.",
        "De relire le contrat depuis la première page.",
        "De reporter la décision à la semaine suivante."
      ],
      answer: "D'aller droit au but sans se perdre en précautions ou en prétextes.",
      reparteeFr: "Soit, n'allons pas par quatre chemins : voici le véritable point de blocage.",
      why: "« Tourner autour du pot » (ou son synonyme « aller par quatre chemins ») correspond à « to beat around the bush »."
    },
    {
      id: "idiome_b1_3", cefr: "B1", category: "Expression Idiomatique", place: "Cabinet Médical · Quartier Latin", speaker: "Élodie",
      idiomFr: "Avoir d'autres chats à fouetter", literalEn: "Literally: “To have other cats to whip”",
      contextFr: "À la veille de la soutenance, nous n'allons pas débattre deux heures de la couleur des dossiers : nous avons d'autres chats à fouetter !",
      contextEn: "On the eve of the defense, we're not going to debate folder colors for two hours: we have bigger fish to fry!",
      q: "Que signifie « avoir d'autres chats à fouetter » ?",
      choices: [
        "Avoir des affaires nettement plus urgentes et essentielles à traiter.",
        "Chercher un vétérinaire dans le cinquième arrondissement.",
        "Manquer totalement de travail pendant la journée.",
        "Reporter toutes ses obligations au lendemain."
      ],
      answer: "Avoir des affaires nettement plus urgentes et essentielles à traiter.",
      reparteeFr: "Exactement, concentrons-nous sur l'essentiel : nous avons d'autres chats à fouetter.",
      why: "Là où l'anglais dit « to have bigger fish to fry », le français classique dit « avoir d'autres chats à fouetter »."
    },
    {
      id: "idiome_b2_1", cefr: "B2", category: "Débat & Rhétorique", place: "Maison de la Radio · Studio Débat", speaker: "Maître Marin",
      idiomFr: "Noyer le poisson", literalEn: "Literally: “To drown the fish”",
      contextFr: "Interrogé sur le financement précis de sa mesure, l'invité a tenté de noyer le poisson sous une avalanche de statistiques anciennes.",
      contextEn: "Questioned about the exact funding of his measure, the guest tried to muddle the issue under an avalanche of old statistics.",
      q: "En quoi consiste la tactique rhétorique qui vise à « noyer le poisson » ?",
      choices: [
        "À multiplier les digressions et détails confus pour esquiver une question gênante.",
        "À illustrer son propos par une métaphore maritime limpide.",
        "À reconnaître humblement qu'on ignore la réponse exacte.",
        "À résumer un dossier complexe en une seule phrase percutante."
      ],
      answer: "À multiplier les digressions et détails confus pour esquiver une question gênante.",
      reparteeFr: "Ne noyez pas le poisson, monsieur : répondez précisément à la question posée !",
      why: "Issu de la pêche à la ligne (fatiguer une grosse prise en la maintenant sous l'eau), « noyer le poisson » signifie embrouiller l'auditoire."
    },
    {
      id: "idiome_b2_2", cefr: "B2", category: "Diplomatie & Stratégie", place: "Palais Brongniart · La Défense", speaker: "Marc-Antoine",
      idiomFr: "Ménager la chèvre et le chou", literalEn: "Literally: “To spare both the goat and the cabbage”",
      contextFr: "Dans cette négociation tendue entre les actionnaires et les syndicats, le médiateur s'efforce de ménager la chèvre et le chou.",
      contextEn: "In this tense negotiation between shareholders and unions, the mediator strives to keep both sides happy / run with the hare and hunt with the hounds.",
      q: "Que cherche à faire celui qui « ménage la chèvre et le chou » ?",
      choices: [
        "Préserver simultanément des intérêts contradictoires sans froisser aucune des deux parties.",
        "Trancher brutalement en faveur du camp le plus puissant.",
        "Investir dans l'agriculture biologique en Île-de-France.",
        "Clore les débats en refusant tout compromis."
      ],
      answer: "Préserver simultanément des intérêts contradictoires sans froisser aucune des deux parties.",
      reparteeFr: "À force de vouloir ménager la chèvre et le chou, on risque l'immobilisme.",
      why: "Référence au célèbre casse-tête du passeur de rivière qui doit empêcher la chèvre de dévorer le chou."
    },
    {
      id: "idiome_b2_3", cefr: "B2", category: "Nuance Critique", place: "Amphithéâtre Richelieu · La Sorbonne", speaker: "Professeure Rochefort",
      idiomFr: "Jeter le bébé avec l'eau du bain", literalEn: "Literally: “To throw the baby out with the bathwater”",
      contextFr: "Certes, ce dispositif pédagogique comporte des lourdeurs, mais gardons-nous de jeter le bébé avec l'eau du bain en l'abrogeant purement et simplement.",
      contextEn: "Granted, this educational framework has some cumbersome aspects, but let us beware of throwing the baby out with the bathwater by repealing it outright.",
      q: "Quelle mise en garde exprime « ne pas jeter le bébé avec l'eau du bain » ?",
      choices: [
        "Il faut corriger les défauts d'un système sans détruire ce qu'il a de précieux et de fécond.",
        "Il faut remplacer intégralement toute institution ancienne.",
        "Il faut refuser toute réforme par principe de précaution.",
        "Il faut privilégier la théorie abstraite sur l'expérience concrète."
      ],
      answer: "Il faut corriger les défauts d'un système sans détruire ce qu'il a de précieux et de fécond.",
      reparteeFr: "Amendons le texte avec discernement sans jeter le bébé avec l'eau du bain.",
      why: "Locution essentielle de la dissertation et du débat B2/C1 pour défendre une réforme mesurée."
    },
    {
      id: "idiome_c1_1", cefr: "C1", category: "Litote Diplomatique", place: "Tour Majunga · Comité Exécutif (La Défense)", speaker: "Marc-Antoine",
      idiomFr: "Votre hypothèse ne manque pas d'audace.", literalEn: "Literally: “Your hypothesis does not lack boldness.”",
      contextFr: "En écoutant votre prévision d'un triplement des marges dès ce trimestre, je dirais que votre hypothèse ne manque pas d'audace…",
      contextEn: "Listening to your forecast of tripling margins this very quarter, I would say your hypothesis does not lack boldness…",
      q: "Dans le code feutré des conseils d'administration français, quel est le véritable sous-entendu de cette litote ?",
      choices: [
        "Vos prévisions sont jugées irréalistes, téméraires et insuffisamment étayées.",
        "Le directeur vous félicite chaleureusement pour votre génie financier.",
        "Il vous encourage à doubler encore vos objectifs chiffrés.",
        "Il avoue ne rien comprendre à la comptabilité de l'entreprise."
      ],
      answer: "Vos prévisions sont jugées irréalistes, téméraires et insuffisamment étayées.",
      reparteeFr: "Je perçois votre réserve ; permettez-moi d'étayer ce scénario par trois données vérifiables.",
      why: "En registre C1/C2 diplomatique, « ne pas manquer d'audace / de sel / d'originalité » est une litote élégante pour signaler un excès ou une imprudence."
    },
    {
      id: "idiome_c1_2", cefr: "C1", category: "Allusion Classique & Stratégique", place: "Cour d'Appel · Palais de Justice", speaker: "Bâtonnière de Montmirail",
      idiomFr: "Une victoire à la Pyrrhus", literalEn: "Literally: “A Pyrrhic victory”",
      contextFr: "Obtenir gain de cause au terme de dix années de procédure ruineuse relèverait d'une victoire à la Pyrrhus pour votre société.",
      contextEn: "Winning the case after ten years of ruinous litigation would amount to a Pyrrhic victory for your company.",
      q: "Qu'est-ce qu'une « victoire à la Pyrrhus » en français soutenu ?",
      choices: [
        "Un succès acquis au prix de pertes si lourdes qu'il équivaut presque à un désastre.",
        "Un triomphe rapide et sans appel devant les tribunaux.",
        "Une réconciliation amiable scellée dans le secret.",
        "Un discours juridique inspiré du droit grec antique."
      ],
      answer: "Un succès acquis au prix de pertes si lourdes qu'il équivaut presque à un désastre.",
      reparteeFr: "Mieux vaut en effet une transaction honorable qu'une coûteuse victoire à la Pyrrhus.",
      why: "Allusion au roi Pyrrhus Ier (« Encore une victoire comme celle-là et nous sommes perdus ! »), très prisée dans les essais C1/C2."
    },
    {
      id: "idiome_c1_3", cefr: "C1", category: "Lexique Soutenu & Presse", place: "Amphithéâtre Richelieu · La Sorbonne", speaker: "Professeure Rochefort",
      idiomFr: "Vouer aux gémonies", literalEn: "Literally: “To consign to the Gemonian stairs”",
      contextFr: "Il serait trop commode de vouer aux gémonies cette réforme sans interroger les causes profondes qui l'ont rendue nécessaire.",
      contextEn: "It would be all too easy to pillory / vilify this reform without examining the underlying causes that made it necessary.",
      q: "Que signifie l'expression soutenue « vouer aux gémonies » ?",
      choices: [
        "Condamner publiquement avec véhémence, livrer au mépris ou à l'indignation générale.",
        "Accorder une subvention exceptionnelle à un projet culturel.",
        "Traduire un texte juridique en latin classique.",
        "Classer confidentiellement un rapport ministériel."
      ],
      answer: "Condamner publiquement avec véhémence, livrer au mépris ou à l'indignation générale.",
      reparteeFr: "Plutôt que de vouer ce texte aux gémonies, soumettons-le à un examen rigoureux.",
      why: "Dans la Rome antique, les Gémonies étaient les degrés où l'on exposait les suppliciés ; au figuré (C1/C2), c'est vouer à l'exécration publique."
    },
    {
      id: "idiome_c2_1", cefr: "C2", category: "Double Litote & Sous-Entendu C2", place: "Sous la Coupole · Académie Française", speaker: "Henri de Valcourt",
      idiomFr: "Il n'est pas interdit de penser que ce texte appelle quelques réserves.", literalEn: "Literally: “It is not forbidden to think that this text calls for a few reservations.”",
      contextFr: "À la lecture de cette étude hâtive, il n'est pas interdit de penser que sa méthodologie appelle quelques réserves de fond.",
      contextEn: "Upon reading this hasty study, one may well think that its methodology calls for serious substantive reservations.",
      q: "Comment faut-il décoder cette double litote académique (« il n'est pas interdit de penser que… appelle quelques réserves ») ?",
      choices: [
        "C'est une réfutation sévère formulée avec une courtoisie glaciale : la méthodologie est jugée défaillante.",
        "L'orateur hésite sincèrement et demande l'autorisation d'exprimer son avis.",
        "L'étude est globalement parfaite à l'exception d'une coquille typographique.",
        "Il est légalement défendu de citer cet ouvrage en public."
      ],
      answer: "C'est une réfutation sévère formulée avec une courtoisie glaciale : la méthodologie est jugée défaillante.",
      reparteeFr: "Nous entendons la gravité de ces réserves et reprendrons l'architecture démonstrative du mémoire.",
      why: "Sommet de la pragmatique C2 : en français académique et diplomatique, plus l'atténuation (« pas interdit », « quelques réserves ») est feutrée, plus la critique est incisive."
    },
    {
      id: "idiome_c2_2", cefr: "C2", category: "Ironie Littéraire & Litote", place: "Salon Littéraire · Rue Jacob (Paris 6e)", speaker: "Professeure Rochefort",
      idiomFr: "Une bienveillance dont il eût été imprudent de sonder la sincérité.", literalEn: "Literally: “A benevolence whose sincerity it would have been imprudent to probe.”",
      contextFr: "Elle accueillait ses rivaux avec une bienveillance exquise dont il eût été imprudent de sonder la sincérité.",
      contextEn: "She welcomed her rivals with an exquisite benevolence whose sincerity it would have been unwise to probe too deeply.",
      q: "Quelle nuance stylistique révèle cette tournure au plus-que-parfait du subjonctif (conditionnel passé 2e forme) ?",
      choices: [
        "L'ironie mordante : cette amabilité n'était qu'un masque mondain dissimulant le calcul.",
        "La sincérité absolue et désintéressée de l'hôtesse envers ses invités.",
        "La timidité maladive d'une personne qui redoute les conversations.",
        "Une erreur grammaticale volontaire destinée à imiter l'argot parisien."
      ],
      answer: "L'ironie mordante : cette amabilité n'était qu'un masque mondain dissimulant le calcul.",
      reparteeFr: "Sous le vernis des politesses de salon, le trait d'ironie est d'une justesse redoutable.",
      why: "Alliant « il eût été » (grand style littéraire C2) et litote ironique, la phrase suggère tout sans jamais asséner."
    },
    {
      id: "idiome_c2_3", cefr: "C2", category: "Haute Stylistique C2", place: "Sous la Coupole · Quai de Conti", speaker: "Henri de Valcourt",
      idiomFr: "Faire amende honorable sans battre sa coulpe outre mesure", literalEn: "Literally: “To make honorable amends without beating one's breast excessively”",
      contextFr: "L'auteur a su faire amende honorable quant à ses premières hypothèses, sans pour autant battre sa coulpe outre mesure.",
      contextEn: "The author knew how to acknowledge his earlier error honorably, without indulging in excessive self-flagellation.",
      q: "Quelle attitude intellectuelle décrit cette alliance de deux locutions soutenues ?",
      choices: [
        "Reconnaître lucidement son erreur avec dignité, sans tomber dans la contrition excessive.",
        "Payer une amende administrative auprès du trésor public.",
        "Refuser obstinément d'admettre la moindre imperfection dans son œuvre.",
        "Reporter la responsabilité de ses écrits sur ses collaborateurs."
      ],
      answer: "Reconnaître lucidement son erreur avec dignité, sans tomber dans la contrition excessive.",
      reparteeFr: "Reconnaître ses torts sans complaisance ni abaissement : telle est l'élégance de l'esprit critique.",
      why: "« Faire amende honorable » (reconnaître publiquement une erreur) et « battre sa coulpe » (du latin *mea culpa*) appartiennent au grand registre C2."
    }
  ];

  // ---- 📰 La Synthèse Critique (Cross-Text DALF C1/C2 Synthesis B1 → C2)
  const SYNTHESE_CASES = [
    {
      id: "syn_b1_1", cefr: "B1", topic: "Tourisme de Masse et Patrimoine",
      sourceA: { author: "Texte A · Association des Commerçants", fr: "L'afflux touristique demeure le poumon économique de nos centres historiques : il finance la restauration des monuments et maintient des milliers d'emplois locaux." },
      sourceB: { author: "Texte B · Collectif des Riverains", fr: "La fréquentation excessive transforme les quartiers anciens en décors de carton-pâte, fait flamber les loyers et chasse les habitants permanents." },
      q: "Quelle phrase de synthèse réunit fidèlement et sans parti pris la tension entre les deux textes ?",
      choices: [
        "Si la manne touristique soutient l'économie locale et l'entretien du patrimoine, sa démesure menace toutefois l'habitabilité et l'authenticité des centres urbains.",
        "Il faut interdire immédiatement l'accès des centres historiques aux visiteurs étrangers.",
        "Les deux auteurs s'accordent à dire que le tourisme n'apporte aucun bénéfice financier aux villes.",
        "Seuls les commerçants comprennent les véritables enjeux de l'architecture ancienne."
      ],
      answer: "Si la manne touristique soutient l'économie locale et l'entretien du patrimoine, sa démesure menace toutefois l'authenticité et l'habitabilité des centres urbains.".replace("l'authenticité et l'habitabilité", "l'habitabilité et l'authenticité"),
      why: "La structure « Si [thèse A], [thèse B] toutefois… » synthétise les deux textes en une seule période équilibrée."
    },
    {
      id: "syn_b2_1", cefr: "B2", topic: "L'Information en Continu à l'Ère Numérique",
      sourceA: { author: "Texte A · Chronique Médias", fr: "L'instantanéité numérique démocratise l'accès au savoir et permet aux citoyens d'être alertés en temps réel des crises majeures à travers le monde." },
      sourceB: { author: "Texte B · Essai Sociologique", fr: "La tyrannie du temps réel privilégie l'émotion brute sur l'enquête approfondie, réduisant la réflexion civique à une succession d'indignations éphémères." },
      q: "Quelle formulation opère la synthèse dialectique la plus rigoureuse de ces deux constats ?",
      choices: [
        "Quoique la diffusion instantanée élargisse l'accès à l'actualité mondiale, l'urgence permanente qu'elle impose fragilise le recul critique et la profondeur de l'analyse.",
        "Les journaux imprimés ont définitivement disparu au profit des réseaux sociaux.",
        "L'essai sociologique prouve que les citoyens refusent désormais de s'informer.",
        "La vitesse de l'information garantit toujours l'exactitude scientifique des faits."
      ],
      answer: "Quoique la diffusion instantanée élargisse l'accès à l'actualité mondiale, l'urgence permanente qu'elle impose fragilise le recul critique et la profondeur de l'analyse.",
      why: "« Quoique + subjonctif » articule l'apport démocratique (Texte A) et le risque d'appauvrissement analytique (Texte B)."
    },
    {
      id: "syn_c1_1", cefr: "C1", topic: "Méritocratie Scolaire et Reproduction Sociale",
      sourceA: { author: "Texte A · Philosophie Républicaine", fr: "Le concours anonyme demeure le rempart le plus sûr contre le népotisme, en jugeant chaque candidat sur la seule rigueur de ses connaissances." },
      sourceB: { author: "Texte B · Observatoire des Inégalités", fr: "En érigeant en norme des codes culturels implicites acquis dès l'enfance dans les milieux favorisés, l'épreuve formelle consacre souvent un héritage social invisible." },
      q: "Quelle synthèse de niveau DALF C1/C2 restitue la dialectique exacte de ce dossier ?",
      choices: [
        "Pour indispensable que soit l'égalité formelle des concours contre l'arbitraire, elle ne saurait tenir sa promesse émancipatrice sans expliciter et transmettre à tous les codes implicites qu'elle évalue.",
        "Il convient de supprimer toute forme d'évaluation dans l'enseignement supérieur.",
        "Les deux textes démontrent que le népotisme est préférable aux examens anonymes.",
        "La réussite aux grands concours dépend uniquement du hasard du calendrier."
      ],
      answer: "Pour indispensable que soit l'égalité formelle des concours contre l'arbitraire, elle ne saurait tenir sa promesse émancipatrice sans expliciter et transmettre à tous les codes implicites qu'elle évalue.",
      why: "« Pour indispensable que soit… elle ne saurait… » est le modèle même de la synthèse C1/C2."
    },
    {
      id: "syn_c2_1", cefr: "C2", topic: "Progrès Technique et Souveraineté du Jugement",
      sourceA: { author: "Texte A · Revue des Sciences Appliquées", fr: "Les systèmes prédictifs surpassent désormais l'intuition humaine dans le croisement de données massives, réduisant drastiquement la marge d'erreur diagnostique." },
      sourceB: { author: "Texte B · Cahiers d'Éthique Contemporaine", fr: "Déléguer la décision finale à un calcul statistique opaque revient à dissoudre la responsabilité morale et la singularité irréductible de chaque cas humain." },
      q: "Quelle période synthétique couronne la confrontation de ces deux textes au niveau C2 ?",
      choices: [
        "Loin d'exclure le discernement humain, la puissance prédictive des algorithmes exige au contraire que l'outil statistique demeure subordonné à une délibération éthique souveraine et responsable.",
        "Les médecins et les juges seront intégralement remplacés par des automates dès l'année prochaine.",
        "Les statistiques sont toujours moins fiables que le simple pressentiment individuel.",
        "Les deux auteurs refusent l'usage de l'informatique dans la recherche scientifique."
      ],
      answer: "Loin d'exclure le discernement humain, la puissance prédictive des algorithmes exige au contraire que l'outil statistique demeure subordonné à une délibération éthique souveraine et responsable.",
      why: "« Loin d'exclure… exige au contraire que + subjonctif » dépasse l'opposition binaire en une synthèse souveraine."
    }
  ];

  function buildIdiomeSteps(cefr, max = 1) {
    const r = cefrRank(cefr);
    const pool = IDIOME_CASES.filter((c) => Math.abs(cefrRank(c.cefr) - r) <= 1);
    const picked = shuffle(pool.length ? pool : IDIOME_CASES).slice(0, max);
    return picked.map((c) => ({
      k: "idiome",
      level: c.cefr,
      idiomeId: c.id,
      category: c.category,
      place: c.place,
      speaker: c.speaker,
      idiomFr: c.idiomFr,
      literalEn: c.literalEn,
      fr: c.contextFr,
      contextFr: c.contextFr,
      contextEn: c.contextEn,
      q: c.q,
      choices: shuffle(c.choices.slice()),
      answer: c.answer,
      reparteeFr: c.reparteeFr,
      why: c.why,
      skill: ["vocabulary", "reading", "listening"]
    }));
  }

  function buildSyntheseSteps(cefr, max = 1) {
    const r = cefrRank(cefr);
    const pool = SYNTHESE_CASES.filter((c) => Math.abs(cefrRank(c.cefr) - r) <= 1);
    const picked = shuffle(pool.length ? pool : SYNTHESE_CASES).slice(0, max);
    return picked.map((c) => ({
      k: "synthese",
      level: c.cefr,
      syntheseId: c.id,
      topic: c.topic,
      sourceA: c.sourceA,
      sourceB: c.sourceB,
      fr: `${c.sourceA.fr} ${c.sourceB.fr}`,
      q: c.q,
      choices: shuffle(c.choices.slice()),
      answer: c.answer,
      why: c.why,
      skill: ["reading", "writing", "grammar"]
    }));
  }

  // ---- L'Architecte de la Phrase (La Période Oratoire · A1 → C2) & Le Tribunal des Modes (Concordance)
  const PERIODE_CASES = [
    {
      id: "per_a1_1", cefr: "A1", title: "Cadre Temporel & Conséquence Simple", speaker: "Camille", place: "Boulangerie Poilâne · Rue du Cherche-Midi",
      en: "In the morning, when the bakery opens, I buy a warm croissant because I am very hungry.",
      clauses: [
        { role: "1. Cadre temporel", fr: "Le matin," },
        { role: "2. Subordonnée de temps", fr: "quand la boulangerie ouvre ses portes," },
        { role: "3. Proposition principale", fr: "j'achète un croissant bien chaud" },
        { role: "4. Justification causale", fr: "parce que j'ai très faim." }
      ],
      why: "En français, le complément circonstanciel de temps (« Le matin ») ouvre naturellement la phrase avant la subordonnée (« quand... »), suivie de l'action principale et de sa cause introduite par « parce que »."
    },
    {
      id: "per_a1_2", cefr: "A1", title: "Condition Quotidienne & Choix", speaker: "Marc-Antoine", place: "Jardin du Luxembourg · 6e arrondissement",
      en: "Today, if the weather is nice in Paris, we are walking in the park before having dinner at the restaurant.",
      clauses: [
        { role: "1. Repère de temps", fr: "Aujourd'hui," },
        { role: "2. Hypothèse au présent", fr: "s'il fait beau à Paris," },
        { role: "3. Action principale", fr: "nous marchons tranquillement dans le parc" },
        { role: "4. Clôture chronologique", fr: "avant de dîner au restaurant." }
      ],
      why: "L'adverbe de temps pose le décor, suivi de l'hypothèse (« s'il fait beau ») qui conditionne la proposition principale, tandis que « avant de + infinitif » clôt la séquence chronologique."
    },
    {
      id: "per_a2_1", cefr: "A2", title: "Cause Initiale & Conséquence Logique", speaker: "Camille", place: "Station Châtelet – Les Halles",
      en: "Since the metro is on strike this morning, I am taking my bike so that I arrive at the office on time.",
      clauses: [
        { role: "1. Cause connue (Comme)", fr: "Comme le métro est en grève ce matin," },
        { role: "2. Décision principale", fr: "je prends mon vélo de ville," },
        { role: "3. Moyen d'action", fr: "je traverse la Seine par le Pont Neuf" },
        { role: "4. Finalité", fr: "pour arriver à l'heure au bureau." }
      ],
      why: "La conjonction « Comme » exprimant la cause se place obligatoirement en tête de phrase ; s'ensuivent les deux actions coordonnées et le but final introduit par « pour + infinitif »."
    },
    {
      id: "per_a2_2", cefr: "A2", title: "Imparfait de Décor & Événement Soudain", speaker: "Henri de Valcourt", place: "Café de Flore · Saint-Germain-des-Prés",
      en: "While I was reading my newspaper on the terrace, a sudden rain started to fall, so the waiter closed the awning.",
      clauses: [
        { role: "1. Décor à l'imparfait", fr: "Pendant que je lisais mon journal en terrasse," },
        { role: "2. Rupture au passé composé", fr: "une pluie soudaine a commencé à tomber," },
        { role: "3. Conséquence immédiate", fr: "si bien que le serveur a replié les tables" },
        { role: "4. Résultat final", fr: "et que nous sommes rentrés dans la salle." }
      ],
      why: "L'opposition classique entre l'arrière-plan à l'imparfait (« Pendant que je lisais ») et l'événement déclencheur au passé composé prépare la subordonnée consécutive (« si bien que... et que... »)."
    },
    {
      id: "per_b1_1", cefr: "B1", title: "Concession & Pivot Dialectique", speaker: "Professeure Rochefort", place: "Amphithéâtre Richelieu · La Sorbonne",
      en: "Although this novel looks difficult at first glance, once you understand the author's irony, you appreciate every page, and you cannot put it down.",
      clauses: [
        { role: "1. Ouverture concessive", fr: "Bien que ce roman paraisse ardu au premier abord," },
        { role: "2. Pivot temporel", fr: "dès qu'on saisit la fine ironie de l'auteur," },
        { role: "3. Apodose principale", fr: "on en savoure chaque page avec délice" },
        { role: "4. Clôture coordonnée", fr: "et l'on ne parvient plus à le refermer." }
      ],
      why: "La période s'ouvre sur une concession au subjonctif (« Bien que... paraisse »), pivote sur une condition temporelle (« dès qu'on saisit ») et s'épanouit dans deux propositions principales coordonnées."
    },
    {
      id: "per_b1_2", cefr: "B1", title: "Hypothèse Irréelle du Présent", speaker: "Marc-Antoine", place: "Rédaction du Monde · Avenue Pierre-Mendès-France",
      en: "If citizens took the time to verify their sources before sharing an article, rumors would spread less quickly and public debate would gain in clarity.",
      clauses: [
        { role: "1. Protase hypothétique (Si + imparfait)", fr: "Si les citoyens prenaient le temps de vérifier leurs sources" },
        { role: "2. Circonstance antérieure", fr: "avant de partager un article sur les réseaux," },
        { role: "3. Première conséquence au conditionnel", fr: "les rumeurs se propageraient beaucoup moins vite" },
        { role: "4. Seconde conséquence équilibrée", fr: "et le débat public y gagnerait en clarté." }
      ],
      why: "La protase introduite par « Si + imparfait » est précisée par une circonstancielle infinitive (« avant de partager ») avant de déboucher sur la double apodose au conditionnel présent."
    },
    {
      id: "per_b1_3", cefr: "B1", title: "Mise en Relief Emphatique (C'est... que)", speaker: "Camille", place: "Musée d'Orsay · Galerie des Impressionnistes",
      en: "It is precisely because the Impressionists left their studios to paint outdoors that they managed to capture the fleeting vibrations of light.",
      clauses: [
        { role: "1. Clivage emphatique causal", fr: "C'est précisément parce que les impressionnistes ont quitté leurs ateliers" },
        { role: "2. But du mouvement artistique", fr: "afin de peindre directement sur le motif" },
        { role: "3. Relais du clivage (que)", fr: "qu'ils ont réussi à saisir sur la toile" },
        { role: "4. Expansion nominale finale", fr: "les vibrations les plus fugitives de la lumière." }
      ],
      why: "La structure clivée « C'est parce que... qu'ils ont réussi » encadre l'expansion infinitive (« afin de peindre ») et rejette l'objet direct complexe en fin de phrase pour créer un effet d'attente."
    },
    {
      id: "per_b2_1", cefr: "B2", title: "Double Concession & Restriction Oratoire", speaker: "Bâtonnière de Montmirail", place: "Palais de Justice · Île de la Cité",
      en: "Granted, the defense report contains relevant observations, yet it remains insufficient to prove the defendant's innocence beyond all reasonable doubt.",
      clauses: [
        { role: "1. Concession rhétorique (Certes)", fr: "Certes, le rapport d'expertise produit par la défense" },
        { role: "2. Prédicat concédé", fr: "comporte des observations techniques tout à fait pertinentes," },
        { role: "3. Pivot adversatif (mais)", fr: "mais il n'en demeure pas moins insuffisant" },
        { role: "4. Visée démonstrative", fr: "pour établir l'innocence du prévenu hors de tout doute." }
      ],
      why: "Le diptyque argumentatif classique « Certes... mais il n'en demeure pas moins... » sépare nettement l'accord partiel (clauses 1-2) de la réfutation décisive (clauses 3-4)."
    },
    {
      id: "per_b2_2", cefr: "B2", title: "Participe Présent & Subordonnée de But", speaker: "Professeure Rochefort", place: "Bibliothèque Nationale · Site Richelieu",
      en: "Wishing to preserve the fragility of medieval manuscripts while making them accessible to researchers, the curator digitized the entire collection so that no one would damage the original vellum.",
      clauses: [
        { role: "1. Groupe participial initial", fr: "Souhaitant préserver la fragilité des manuscrits médiévaux" },
        { role: "2. Gérondif de simultanéité", fr: "tout en les rendant accessibles aux chercheurs du monde entier," },
        { role: "3. Proposition principale", fr: "la conservatrice a fait numériser l'intégralité du fonds" },
        { role: "4. Finale au subjonctif", fr: "afin que nul n'altère désormais le vélin original." }
      ],
      why: "Le participe présent en tête (« Souhaitant... ») nuancé par le gérondif (« tout en les rendant ») précède le sujet de la principale (« la conservatrice »), avant la subordonnée finale introduite par « afin que + subjonctif »."
    },
    {
      id: "per_b2_3", cefr: "B2", title: "Corrélation Proportionnelle (Plus... moins...)", speaker: "Henri de Valcourt", place: "Foyer de l'Opéra Garnier",
      en: "The more deeply one analyzes the classical dramaturgy of Racine, the less one sees in it a cold academic exercise, and the better one perceives the burning violence of passions.",
      clauses: [
        { role: "1. Premier membre corrélé (Plus)", fr: "Plus on analyse en profondeur la dramaturgie classique de Racine," },
        { role: "2. Deuxième membre négatif (moins)", fr: "moins on y voit un froid exercice de style académique," },
        { role: "3. Troisième membre ascendant (et mieux)", fr: "et mieux on perçoit, sous la rigueur de l'alexandrin," },
        { role: "4. Apogée sémantique", fr: "la violence incandescente des passions humaines." }
      ],
      why: "La corrélation ternaire « Plus..., moins..., et mieux... » crée un rythme croissant typique de la dissertation française, suspendant le complément d'objet direct jusqu'à la clausule après l'incise."
    },
    {
      id: "per_c1_1", cefr: "C1", title: "Inversion après « Encore faut-il que »", speaker: "Bâtonnière de Montmirail", place: "Conseil d'État · Palais-Royal",
      en: "Every reform of the civil code aims in principle to simplify administrative procedures; still, the legislator must draft crystal-clear texts so that jurisprudence does not fragment.",
      clauses: [
        { role: "1. Thèse liminaire", fr: "Toute réforme du code civil vise en principe à simplifier les démarches ;" },
        { role: "2. Restriction avec inversion (Encore faut-il)", fr: "encore faut-il que le législateur rédige des textes limpides," },
        { role: "3. Subordonnée relative explicative", fr: "dont l'interprétation ne prête à aucune équivoque," },
        { role: "4. Conséquence négative évitée", fr: "sans quoi la jurisprudence risque de se fragmenter durablement." }
      ],
      why: "Après une première proposition complète suivie d'un point-virgule, la locution restrictive « encore faut-il que » entraîne l'inversion du sujet impersonnel et gouverne le subjonctif, prolongé par une relative en « dont » et une clôture en « sans quoi »."
    },
    {
      id: "per_c1_2", cefr: "C1", title: "Hypothèse Irréelle du Passé & Parallélisme", speaker: "Professeure Rochefort", place: "Collège de France · Place Marcelin-Berthelot",
      en: "If the Enlightenment philosophers had not dared to challenge censorship through clandestine pamphlets, neither freedom of conscience nor the principle of separation of powers would have triumphed so quickly.",
      clauses: [
        { role: "1. Protase au plus-que-parfait", fr: "Si les philosophes des Lumières n'avaient pas osé braver la censure" },
        { role: "2. Complément de moyen", fr: "en diffusant sous le manteau des pamphlets audacieux," },
        { role: "3. Sujet double coordonné (ni... ni...)", fr: "ni la liberté de conscience ni le principe de la séparation des pouvoirs" },
        { role: "4. Apodose au conditionnel passé", fr: "ne se seraient imposés avec une telle vigueur dans les esprits." }
      ],
      why: "La protase au plus-que-parfait enrichie d'un gérondif prépare une apodose dont le sujet double négatif (« ni... ni... ») précède le verbe au conditionnel passé accompagné de la négation « ne »."
    },
    {
      id: "per_c1_3", cefr: "C1", title: "Concession en « Pour + adjectif + que »", speaker: "Henri de Valcourt", place: "Salon Proust · Hôtel Ritz, Place Vendôme",
      en: "However brilliant a diplomat's rhetoric may be during negotiations, it could never replace a genuine balance of forces, unless both parties share a common interest.",
      clauses: [
        { role: "1. Concession intensive (Pour... que)", fr: "Pour brillante que soit l'éloquence d'un diplomate" },
        { role: "2. Circonstance de temps", fr: "lors des pourparlers les plus délicats," },
        { role: "3. Principale atténuée (ne saurait)", fr: "elle ne saurait suppléer à un véritable équilibre des forces," },
        { role: "4. Restriction hypothétique (à moins que)", fr: "à moins que les deux parties ne partagent un intérêt supérieur." }
      ],
      why: "La tournure soutenue « Pour + adjectif + que + subjonctif » ouvre la période ; la principale utilise le conditionnel d'atténuation « ne saurait », suivie de « à moins que... ne + subjonctif »."
    },
    {
      id: "per_c2_1", cefr: "C2", title: "Période Cicéronienne en « Non seulement... mais encore »", speaker: "Bâtonnière de Montmirail", place: "Cour de Cassation · Quai de l'Horloge",
      en: "Had the magistrate ignored the procedural flaw, not only would he have violated the fundamental rights of the defense, but he would also have tarnished the very authority of the supreme court.",
      clauses: [
        { role: "1. Protase au plus-que-parfait du subjonctif", fr: "Le magistrat eût-il ignoré le vice de forme soulevé à l'audience," },
        { role: "2. Premier membre avec inversion (non seulement)", fr: "non seulement eût-il méconnu les droits fondamentaux de la défense," },
        { role: "3. Second membre ascendant (mais encore)", fr: "mais encore il aurait entaché d'une suspicion légitime" },
        { role: "4. Clausule solennelle", fr: "l'autorité morale de la juridiction suprême tout entière." }
      ],
      why: "L'hypothèse littéraire sans « si » avec inversion au subjonctif plus-que-parfait (« Le magistrat eût-il ignoré... ») commande le diptyque « non seulement eût-il... mais encore il aurait... », culminant sur l'objet direct final."
    },
    {
      id: "per_c2_2", cefr: "C2", title: "Proposition Participiale Absolue & Inversion Élégante", speaker: "Professeure Rochefort", place: "Coupole de l'Institut de France · Quai de Conti",
      en: "Once the archival illusions have been dispelled and the primary sources restored to their context, there appears to the historian's eye the subterranean continuity that links revolutions to the regimes they claim to abolish.",
      clauses: [
        { role: "1. Première participiale absolue", fr: "Les illusions rétrospectives une fois dissipées" },
        { role: "2. Seconde participiale coordonnée", fr: "et les sources primaires restituées dans leur exacte chronologie," },
        { role: "3. Principale à verbe inversé", fr: "apparaît alors au regard de l'historien la continuité souterraine" },
        { role: "4. Relative déterminative finale", fr: "qui relie les révolutions aux régimes mêmes qu'elles prétendent abolir." }
      ],
      why: "Deux propositions participiales absolues en tête dégagent le terrain analytique, provoquant l'inversion stylistique du verbe intransitif (« apparaît alors... la continuité ») afin que la relative finale puisse s'y rattacher sans lourdeur."
    },
    {
      id: "per_c2_3", cefr: "C2", title: "Subjonctif Concessif « Quelque... que » & Litote", speaker: "Henri de Valcourt", place: "Bibliothèque Mazarine · 6e arrondissement",
      en: "Whatever ingenious sophisms our detractors may deploy to disguise their inconsistency, we are not unaware that truth ends up triumphing over the cabals of the moment.",
      clauses: [
        { role: "1. Concession nominale (Quelques... que)", fr: "Quelques ingénieux sophismes que déploient nos détracteurs" },
        { role: "2. Proposition infinitive de but", fr: "aux fins de travestir l'inconséquence de leur doctrine," },
        { role: "3. Principale en litote (ne pas ignorer)", fr: "nous n'ignorons point que la rigueur des faits" },
        { role: "4. Complétive conclusive", fr: "finit toujours par triompher des cabales éphémères du siècle." }
      ],
      why: "« Quelques + nom pluriel + que + subjonctif » exige l'accord de « quelques » (déterminant) et l'inversion du sujet nominal « nos détracteurs », avant la litote classique « nous n'ignorons point que... » qui ouvre la complétive finale à l'indicatif."
    }
  ];

  const CONCORDANCE_CASES = [
    {
      id: "conc_a1_1", cefr: "A1", trigger: "Il faut que + Subjonctif présent",
      stemFr: "Pour prendre le premier train à la gare de Lyon, il faut que tu ___ à six heures.",
      fullFr: "Pour prendre le premier train à la gare de Lyon, il faut que tu partes à six heures.",
      en: "To catch the first train at Gare de Lyon, you have to leave at six o'clock.",
      modeLabel: "Subjonctif Présent — nécessité",
      choices: ["partes · (Subjonctif présent)", "pars · (Indicatif présent)", "partiras · (Futur simple)", "partir · (Infinitif)"],
      answer: "partes · (Subjonctif présent)",
      why: "L'expression impersonnelle de nécessité « il faut que » est le déclencheur fondamental du subjonctif en français (« que tu partes »)."
    },
    {
      id: "conc_a1_2", cefr: "A1", trigger: "Je pense que (affirmatif) + Indicatif",
      stemFr: "Après avoir goûté cette tarte au citron, je pense qu'elle ___ vraiment délicieuse.",
      fullFr: "Après avoir goûté cette tarte au citron, je pense qu'elle est vraiment délicieuse.",
      en: "After tasting this lemon tart, I think it is really delicious.",
      modeLabel: "Indicatif Présent — opinion affirmative",
      choices: ["est · (Indicatif présent)", "soit · (Subjonctif présent — piège !)", "serait · (Conditionnel présent)", "être · (Infinitif)"],
      answer: "est · (Indicatif présent)",
      why: "Les verbes d'opinion à la forme affirmative (« je pense que », « je crois que », « je trouve que ») présentent le fait comme certain ou probable et exigent l'indicatif."
    },
    {
      id: "conc_a1_3", cefr: "A1", trigger: "Je voudrais que + Subjonctif présent",
      stemFr: "Excusez-moi monsieur, je voudrais que vous m'___ à porter cette valise dans l'escalier.",
      fullFr: "Excusez-moi monsieur, je voudrais que vous m'aidiez à porter cette valise dans l'escalier.",
      en: "Excuse me sir, I would like you to help me carry this suitcase up the stairs.",
      modeLabel: "Subjonctif Présent — souhait poli",
      choices: ["aidiez · (Subjonctif présent)", "aidez · (Indicatif présent)", "aiderez · (Futur simple)", "aideriez · (Conditionnel présent)"],
      answer: "aidiez · (Subjonctif présent)",
      why: "Les verbes de souhait et de désir (« vouloir que », « souhaiter que », « aimer que ») imposent toujours le subjonctif dans la subordonnée."
    },
    {
      id: "conc_a2_1", cefr: "A2", trigger: "Quand / Dès que (futur) + Futur simple",
      stemFr: "Dès que tu ___ à l'aéroport Charles-de-Gaulle demain matin, envoie-moi un message.",
      fullFr: "Dès que tu arriveras à l'aéroport Charles-de-Gaulle demain matin, envoie-moi un message.",
      en: "As soon as you arrive at Charles de Gaulle airport tomorrow morning, send me a message.",
      modeLabel: "Indicatif Futur Simple — projection temporelle",
      choices: ["arriveras · (Futur simple)", "arrives · (Indicatif présent — calque anglais !)", "arriverais · (Conditionnel présent)", "sois arrivé · (Subjonctif passé)"],
      answer: "arriveras · (Futur simple)",
      why: "Contrairement à l'anglais qui utilise le présent après 'as soon as' ou 'when', le français exige le futur simple après « quand », « lorsque » et « dès que » lorsque l'action est future."
    },
    {
      id: "conc_a2_2", cefr: "A2", trigger: "Espérer que + Indicatif (Futur / Présent)",
      stemFr: "Nous espérons de tout cœur que le beau temps ___ jusqu'à la fin du festival.",
      fullFr: "Nous espérons de tout cœur que le beau temps durera jusqu'à la fin du festival.",
      en: "We wholeheartedly hope that the nice weather will last until the end of the festival.",
      modeLabel: "Indicatif Futur Simple — espoir affirmatif",
      choices: ["durera · (Indicatif futur simple)", "dure · (Subjonctif présent — piège fréquent !)", "durerait · (Conditionnel présent)", "ait duré · (Subjonctif passé)"],
      answer: "durera · (Indicatif futur simple)",
      why: "Exception célèbre parmi les verbes de souhait : « espérer que » à la forme affirmative est suivi de l'indicatif (souvent au futur simple), contrairement à « souhaiter que » qui prend le subjonctif."
    },
    {
      id: "conc_a2_3", cefr: "A2", trigger: "Si + Présent → Futur simple",
      stemFr: "S'il ___ son examen de piano vendredi prochain, ses parents lui offriront un voyage à Vienne.",
      fullFr: "S'il réussit son examen de piano vendredi prochain, ses parents lui offriront un voyage à Vienne.",
      en: "If he passes his piano exam next Friday, his parents will offer him a trip to Vienna.",
      modeLabel: "Indicatif Présent — condition réelle",
      choices: ["réussit · (Indicatif présent)", "réussira · (Futur simple — interdit après « si » !)", "réussirait · (Conditionnel présent)", "réussisse · (Subjonctif présent)"],
      answer: "réussit · (Indicatif présent)",
      why: "Règle d'or (« Les 'si' n'aiment pas les '-rai' ») : dans une hypothèse portant sur l'avenir, la subordonnée introduite par « si » se met à l'indicatif présent et jamais au futur ni au conditionnel."
    },
    {
      id: "conc_b1_1", cefr: "B1", trigger: "Bien que / Quoique + Subjonctif",
      stemFr: "Bien que cet appartement sous les toits ___ assez bruyant, il offre une vue imprenable sur Montmartre.",
      fullFr: "Bien que cet appartement sous les toits soit assez bruyant, il offre une vue imprenable sur Montmartre.",
      en: "Although this rooftop apartment is quite noisy, it offers a breathtaking view of Montmartre.",
      modeLabel: "Subjonctif Présent — concession",
      choices: ["soit · (Subjonctif présent)", "est · (Indicatif présent)", "serait · (Conditionnel présent — faute courante !)", "sera · (Futur simple)"],
      answer: "soit · (Subjonctif présent)",
      why: "Les conjonctions de concession « bien que » et « quoique » gouvernent obligatoirement le subjonctif, même lorsque le fait concédé est tout à fait réel."
    },
    {
      id: "conc_b1_2", cefr: "B1", trigger: "Si + Imparfait → Conditionnel présent",
      stemFr: "Si nous ___ plus de temps libre cette semaine, nous irions volontiers voir la nouvelle exposition au Louvre.",
      fullFr: "Si nous avions plus de temps libre cette semaine, nous irions volontiers voir la nouvelle exposition au Louvre.",
      en: "If we had more free time this week, we would gladly go see the new exhibition at the Louvre.",
      modeLabel: "Indicatif Imparfait — irréel du présent",
      choices: ["avions · (Indicatif imparfait)", "aurions · (Conditionnel présent — piège !)", "ayons · (Subjonctif présent)", "avons · (Indicatif présent)"],
      answer: "avions · (Indicatif imparfait)",
      why: "Pour exprimer une hypothèse irréelle dans le présent, la subordonnée introduite par « si » requiert l'imparfait de l'indicatif, tandis que la principale est au conditionnel présent."
    },
    {
      id: "conc_b1_3", cefr: "B1", trigger: "Je ne pense pas que + Subjonctif",
      stemFr: "Vu l'ampleur des embouteillages sur le périphérique, je ne pense pas qu'il ___ arriver avant vingt heures.",
      fullFr: "Vu l'ampleur des embouteillages sur le périphérique, je ne pense pas qu'il puisse arriver avant vingt heures.",
      en: "Given the scale of the traffic jams on the ring road, I don't think he can arrive before eight p.m.",
      modeLabel: "Subjonctif Présent — opinion niée",
      choices: ["puisse · (Subjonctif présent)", "peut · (Indicatif présent)", "pourra · (Futur simple)", "pourrait · (Conditionnel présent)"],
      answer: "puisse · (Subjonctif présent)",
      why: "Employés à la forme négative ou interrogative avec inversion, les verbes d'opinion (« je ne pense pas que », « croyez-vous que ») ouvrent une part d'incertitude et basculent au subjonctif."
    },
    {
      id: "conc_b2_1", cefr: "B2", trigger: "Il est probable que (Indicatif) vs. Il est possible que (Subjonctif)",
      stemFr: "D'après les derniers sondages publiés ce matin, il est fort probable que le projet de loi ___ adopté dès le premier tour.",
      fullFr: "D'après les derniers sondages publiés ce matin, il est fort probable que le projet de loi sera adopté dès le premier tour.",
      en: "According to the latest polls published this morning, it is very likely that the bill will be adopted in the first round.",
      modeLabel: "Indicatif Futur Simple — haute probabilité",
      choices: ["sera · (Indicatif futur simple)", "soit · (Subjonctif présent — piège !)", "serait · (Conditionnel présent)", "fût · (Subjonctif imparfait)"],
      answer: "sera · (Indicatif futur simple)",
      why: "Distinction essentielle : « il est possible que » et « il est douteux que » prennent le subjonctif (incertitude), tandis que « il est probable que » exprime une quasi-certitude et exige l'indicatif."
    },
    {
      id: "conc_b2_2", cefr: "B2", trigger: "Superlatif relatif + Subjonctif d'appréciation",
      stemFr: "C'est sans conteste la mise en scène de Molière la plus audacieuse que la Comédie-Française ___ depuis dix ans.",
      fullFr: "C'est sans conteste la mise en scène de Molière la plus audacieuse que la Comédie-Française ait montée depuis dix ans.",
      en: "It is unquestionably the boldest staging of Molière that the Comédie-Française has put on in ten years.",
      modeLabel: "Subjonctif Passé — jugement superlatif + antériorité",
      choices: ["ait montée · (Subjonctif passé)", "a montée · (Indicatif passé composé)", "avait montée · (Plus-que-parfait)", "aurait montée · (Conditionnel passé)"],
      answer: "ait montée · (Subjonctif passé)",
      why: "Après un superlatif relatif (« la plus audacieuse ») ou « le seul / l'unique / le premier », la relative qui exprime une appréciation subjective se met au subjonctif."
    },
    {
      id: "conc_b2_3", cefr: "B2", trigger: "Concordance au discours indirect passé",
      stemFr: "Lors de sa conférence de presse hier soir, la ministre a assuré que les travaux de restauration ___ avant l'automne prochain.",
      fullFr: "Lors de sa conférence de presse hier soir, la ministre a assuré que les travaux de restauration s'achèveraient avant l'automne prochain.",
      en: "During her press conference last night, the minister assured that the restoration work would be completed before next autumn.",
      modeLabel: "Conditionnel Présent — futur dans le passé",
      choices: ["s'achèveraient · (Conditionnel présent — futur du passé)", "s'achèveront · (Futur simple)", "s'achèvent · (Subjonctif présent)", "se sont achevés · (Passé composé)"],
      answer: "s'achèveraient · (Conditionnel présent — futur du passé)",
      why: "Lorsque le verbe introducteur du discours indirect est au passé (« a assuré »), la concordance des temps transforme le futur simple en conditionnel présent (futur dans le passé)."
    },
    {
      id: "conc_c1_1", cefr: "C1", trigger: "Après que (+ Indicatif) vs. Avant que (+ Subjonctif)",
      stemFr: "Après que le président de séance ___ les débats à l'Académie, les orateurs se sont succédé à la tribune.",
      fullFr: "Après que le président de séance a ouvert les débats à l'Académie, les orateurs se sont succédé à la tribune.",
      en: "After the chair opened the debates at the Academy, the speakers succeeded one another at the podium.",
      modeLabel: "Indicatif Passé Composé — fait accompli et réel",
      choices: ["a ouvert · (Indicatif passé composé)", "ait ouvert · (Subjonctif passé — hypercorrection fautive !)", "aurait ouvert · (Conditionnel passé)", "ouvre · (Subjonctif présent)"],
      answer: "a ouvert · (Indicatif passé composé)",
      why: "Piège classique des examens C1/C2 : contrairement à « avant que » qui introduit un fait virtuel non encore réalisé (subjonctif), « après que » introduit un fait accompli et exige normativement l'indicatif."
    },
    {
      id: "conc_c1_2", cefr: "C1", trigger: "Craindre que + ne explétif + Subjonctif",
      stemFr: "Les archivistes craignent que l'humidité persistante de la crypte ___ irrémédiablement les reliures du XVIe siècle.",
      fullFr: "Les archivistes craignent que l'humidité persistante de la crypte n'endommage irrémédiablement les reliures du XVIe siècle.",
      en: "The archivists fear that the persistent humidity of the crypt may irremediably damage the 16th-century bindings.",
      modeLabel: "Subjonctif Présent + « ne » explétif",
      choices: ["n'endommage · (Subjonctif présent + ne explétif)", "n'endommage pas · (Contresens négatif !)", "endommagera · (Futur simple)", "endommagerait · (Conditionnel présent)"],
      answer: "n'endommage · (Subjonctif présent + ne explétif)",
      why: "Dans la langue soignée, les verbes de crainte (« craindre que », « redouter que ») à la forme affirmative régissent le subjonctif accompagné d'un « ne » explétif (sans « pas »)."
    },
    {
      id: "conc_c1_3", cefr: "C1", trigger: "Si + Plus-que-parfait → Conditionnel passé",
      stemFr: "Si la préfecture avait été alertée plus tôt de la crue de la Seine, les quais bas ___ dès hier soir.",
      fullFr: "Si la préfecture avait été alertée plus tôt de la crue de la Seine, les quais bas auraient été fermés dès hier soir.",
      en: "If the prefecture had been alerted earlier to the rising of the Seine, the lower quays would have been closed as early as last night.",
      modeLabel: "Conditionnel Passé — irréel du passé (apodose)",
      choices: ["auraient été fermés · (Conditionnel passé)", "avaient été fermés · (Plus-que-parfait)", "seraient fermés · (Conditionnel présent)", "aient été fermés · (Subjonctif passé)"],
      answer: "auraient été fermés · (Conditionnel passé)",
      why: "Dans un système hypothétique portant sur un fait révolu (irréel du passé), « Si + plus-que-parfait » appelle le conditionnel passé dans la proposition principale."
    },
    {
      id: "conc_c2_1", cefr: "C2", trigger: "Non que / Non pas que + Subjonctif (cause écartée)",
      stemFr: "L'auteur a refusé de publier ses mémoires de son vivant, non que la polémique lui ___ peur, mais par souci d'élégance morale.",
      fullFr: "L'auteur a refusé de publier ses mémoires de son vivant, non que la polémique lui fît peur, mais par souci d'élégance morale.",
      en: "The author refused to publish his memoirs during his lifetime, not that controversy frightened him, but out of concern for moral elegance.",
      modeLabel: "Subjonctif (Imparfait soutenu / Présent) — cause rejetée",
      choices: ["fît · (Subjonctif imparfait / fasse au présent)", "faisait · (Indicatif imparfait — interdit après « non que » !)", "ferait · (Conditionnel présent)", "a fait · (Indicatif passé composé)"],
      answer: "fît · (Subjonctif imparfait / fasse au présent)",
      why: "Alors que « parce que » et « puisque » introduisent une cause réelle à l'indicatif, « non que » écarte une fausse explication et requiert impérativement le subjonctif."
    },
    {
      id: "conc_c2_2", cefr: "C2", trigger: "De sorte que : Conséquence (Indicatif) vs. But (Subjonctif)",
      stemFr: "Le rapporteur a exposé chaque amendement avec une rigueur géométrique, de sorte que l'assemblée tout entière ___ convaincue dès la première lecture.",
      fullFr: "Le rapporteur a exposé chaque amendement avec une rigueur géométrique, de sorte que l'assemblée tout entière a été convaincue dès la première lecture.",
      en: "The rapporteur presented each amendment with geometric rigor, with the result that the entire assembly was convinced on the first reading.",
      modeLabel: "Indicatif Passé Composé — conséquence effective",
      choices: ["a été · (Indicatif — conséquence réellement atteinte)", "soit · (Subjonctif — exprimerait un but non encore atteint)", "serait · (Conditionnel présent)", "avoir été · (Infinitif passé)"],
      answer: "a été · (Indicatif — conséquence réellement atteinte)",
      why: "« De sorte que » change de mode selon le sens : suivi du subjonctif, il exprime un but visé ; suivi de l'indicatif, il exprime une conséquence effectivement constatée."
    },
    {
      id: "conc_c2_3", cefr: "C2", trigger: "Conditionnel passé 2e forme (Subjonctif plus-que-parfait d'irréel)",
      stemFr: "___-il pressenti l'ampleur du krach boursier que ses conseillers lui dissimulaient, le banquier n'eût jamais signé cet acte de cession.",
      fullFr: "Eût-il pressenti l'ampleur du krach boursier que ses conseillers lui dissimulaient, le banquier n'eût jamais signé cet acte de cession.",
      en: "Had he sensed the scale of the stock market crash that his advisors were hiding from him, the banker would never have signed that deed of transfer.",
      modeLabel: "Subjonctif Plus-que-parfait (Conditionnel passé 2e forme) — protase inversée",
      choices: ["Eût · (Subjonctif plus-que-parfait à sujet inversé)", "Avait · (Indicatif plus-que-parfait — impossible sans « Si » !)", "Ait · (Subjonctif passé)", "Aurait · (Conditionnel passé 1re forme)"],
      answer: "Eût · (Subjonctif plus-que-parfait à sujet inversé)",
      why: "En registre littéraire ou oratoire C2, l'hypothèse irréelle du passé peut faire l'économie de « si » au moyen de l'inversion du pronom sujet après l'auxiliaire au plus-que-parfait du subjonctif (« Eût-il pressenti..., il n'eût jamais signé »)."
    }
  ];

  function makePeriodeStep(c) {
    const n = (c.clauses || []).length;
    let order = shuffle([...Array(n).keys()]);
    if (order.every((v, idx) => v === idx) && n >= 2) order = order.slice(1).concat(order[0]);
    const fullFr = (c.clauses || []).map((x) => x.fr).join(" ");
    return {
      k: "periode",
      level: c.cefr,
      periodeId: c.id,
      title: c.title,
      speaker: c.speaker,
      place: c.place,
      fr: fullFr,
      en: c.en,
      clauses: c.clauses.map((x) => ({ role: x.role, fr: x.fr })),
      order,
      _picked: [],
      why: c.why,
      skill: ["grammar", "writing", "reading"]
    };
  }

  function buildPeriodeSteps(cefr, max = 1) {
    const r = cefrRank(cefr);
    const pool = PERIODE_CASES.filter((c) => Math.abs(cefrRank(c.cefr) - r) <= 1);
    const picked = shuffle(pool.length ? pool : PERIODE_CASES).slice(0, max);
    return picked.map(makePeriodeStep);
  }

  function buildConcordanceSteps(cefr, max = 1) {
    const r = cefrRank(cefr);
    const pool = CONCORDANCE_CASES.filter((c) => Math.abs(cefrRank(c.cefr) - r) <= 1);
    const picked = shuffle(pool.length ? pool : CONCORDANCE_CASES).slice(0, max);
    return picked.map((c) => ({
      k: "concordance",
      level: c.cefr,
      concId: c.id,
      trigger: c.trigger,
      stemFr: c.stemFr,
      fr: c.fullFr,
      fullFr: c.fullFr,
      en: c.en,
      modeLabel: c.modeLabel,
      choices: shuffle(c.choices.slice()),
      answer: c.answer,
      why: c.why,
      skill: ["grammar", "writing"]
    }));
  }

  // ---- L'Âme Française (18 Native Cultural Reflexes A1->C2) & La Fabrique de Pensée Directe (18 Zero-English Direct-Thought Cases A1->C2)
  const AME_CASES = [
    {
      id: "ame_a1_1", cefr: "A1", pillar: "Code Social · Commerces & Rue",
      title: "Le « Bonjour » sacré : la clé qui ouvre toutes les portes",
      place: "Boulangerie de Montmartre", speaker: "Madame Moreau · Boulangère artisanale",
      textbookFr: "Excusez-moi, je voudrais une baguette, s'il vous plaît.",
      nativeFr: "Bonjour Madame ! Une tradition bien cuite, s'il vous plaît.",
      en: "Hello Madam! One well-baked traditional baguette, please. (Never skip 'Bonjour' + 'Madame/Monsieur' before making a request.)",
      secret: "En France, entrer dans un commerce ou aborder quelqu'un sans dire d'abord « Bonjour Madame / Monsieur » est vécu comme une agression, même si vous dites « Excusez-moi » ou « S'il vous plaît ».",
      q: "Vous êtes pressé(e) dans la rue et vous voulez demander où est le métro à un passant. Que dites-vous en tout premier ?",
      choices: [
        "Bonjour Monsieur, excusez-moi, vous savez où est le métro ?",
        "Excusez-moi ! Où est la station de métro, s'il vous plaît ?",
        "S'il vous plaît, je cherche le métro ?",
        "Pardon, dites-moi où est le métro ?"
      ],
      answer: "Bonjour Monsieur, excusez-moi, vous savez où est le métro ?",
      why: "Même dans l'urgence en pleine rue, le « Bonjour Monsieur / Madame » initial reconnaît l'humanité de votre interlocuteur avant de lui demander un service."
    },
    {
      id: "ame_a1_2", cefr: "A1", pillar: "Table & Bistrot · Codes du Café",
      title: "La carafe d'eau et l'art de demander l'addition",
      place: "Bistrot du Marais", speaker: "Karim · Serveur de brasserie",
      textbookFr: "Garçon ! Je voudrais de l'eau et la facture, s'il vous plaît.",
      nativeFr: "Excusez-moi Monsieur, on pourrait avoir une carafe d'eau et l'addition, s'il vous plaît ?",
      en: "Excuse me Sir, could we have a pitcher of tap water and the bill, please? (Never say 'Garçon!' or 'la facture' at a restaurant.)",
      secret: "Demander « de l'eau » vous fera payer une bouteille minérale à 6 € ; le mot magique gratuit est « une carafe d'eau ». Et on n'appelle jamais un serveur « Garçon ! » : un simple « S'il vous plaît ! » ou « Monsieur / Madame » suffit.",
      q: "Vous avez fini votre plat en terrasse et vous voulez de l'eau gratuite ainsi que payer. Comment interpellez-vous le serveur ?",
      choices: [
        "S'il vous plaît ! Une petite carafe d'eau et l'addition quand vous pourrez.",
        "Garçon ! Apportez-moi de l'eau gratuite et la facture.",
        "Monsieur, je veux de l'eau du robinet et le ticket.",
        "Hé ! L'eau et le compte, s'il vous plaît !"
      ],
      answer: "S'il vous plaît ! Une petite carafe d'eau et l'addition quand vous pourrez.",
      why: "« Une carafe d'eau » et « l'addition » sont les deux formules rituelles du bistrot français, adoucies par « quand vous pourrez » qui montre du respect pour le rythme du service."
    },
    {
      id: "ame_a1_3", cefr: "A1", pillar: "Oreille de Rue · Contractions A1",
      title: "« Chais pas » & « Y a pas de souci » : le français qu'on entend vraiment",
      place: "Station Châtelet – Les Halles", speaker: "Léo · Étudiant parisien",
      textbookFr: "Je ne sais pas du tout. Il n'y a pas de problème.",
      nativeFr: "Franchement, chais pas… Mais t'inquiète, y a pas de souci !",
      en: "Honestly, I dunno… But don't worry, no problem at all! ('Je ne sais pas' glides into 'Chais pas', and 'Il n'y a pas' becomes 'Y a pas'.)",
      secret: "À l'oral spontané, le « ne » de la négation disparaît dans 95 % des cas, « je sais » fusionne en « chais », et « il n'y a » se réduit à « y a ».",
      q: "Un ami s'excuse d'avoir 5 minutes de retard au café. Comment lui répondez-vous naturellement à l'oral ?",
      choices: [
        "T'inquiète, y a pas de souci, je viens d'arriver !",
        "Ne vous inquiétez pas, il n'y a aucun problème.",
        "Je ne sais pas pourquoi tu as du retard, mais c'est bon.",
        "Ce n'est pas un problème pour ma personne."
      ],
      answer: "T'inquiète, y a pas de souci, je viens d'arriver !",
      why: "« T'inquiète » (pour « ne t'inquiète pas ») et « y a pas de souci » forment le duo réflexe le plus chaleureux et naturel du français parlé quotidien."
    },
    {
      id: "ame_a2_1", cefr: "A2", pillar: "Oreille de Rue · Élisions Rapides",
      title: "« T'as pas vu ? » & « Chuis crevé » : le rythme parlé",
      place: "Quai de Jemmapes · Canal Saint-Martin", speaker: "Inès · Graphiste",
      textbookFr: "Tu n'as pas vu mes clés ? Je suis très fatiguée ce soir.",
      nativeFr: "Dis, t'as pas vu mes clés ? Pfff, chuis crevée ce soir…",
      en: "Say, haven't you seen my keys? Phew, I'm wiped out tonight… ('Tu as' -> 'T'as', 'Je suis' -> 'Chuis', 'très fatigué' -> 'crevé'.)",
      secret: "Devant une voyelle, « tu » s'élide toujours en « t' » à l'oral (« t'as », « t'es », « t'avais »), et « je suis » glisse phonétiquement vers « chuis ».",
      q: "Après une longue journée de marche dans Paris, votre ami vous demande si vous voulez sortir en boîte. Que répondez-vous ?",
      choices: [
        "Honnêtement chuis crevé, t'as pas plutôt envie d'un verre tranquille ?",
        "Je suis extrêmement fatigué, tu n'as pas une autre idée ?",
        "Non merci, ma fatigue est trop grande ce soir.",
        "Je ne suis pas capable de danser, tu as compris ?"
      ],
      answer: "Honnêtement chuis crevé, t'as pas plutôt envie d'un verre tranquille ?",
      why: "Cette phrase combine l'élision naturelle (« chuis », « t'as pas »), le vocabulaire courant (« crevé ») et une contre-proposition conviviale typiquement parisienne."
    },
    {
      id: "ame_a2_2", cefr: "A2", pillar: "Tics de Langage · Connecteurs Oraux",
      title: "La sainte trinité de l'oral : « En fait », « Du coup », « Bref »",
      place: "Café de Flore · Pause déjeuner", speaker: "Thomas · Architecte",
      textbookFr: "En réalité, le train était annulé. Par conséquent, j'ai pris un vélo. Pour résumer, je suis arrivé.",
      nativeFr: "En fait, y avait plus de métro… Du coup, j'ai pris un Vélib'. Bref, quelle galère !",
      en: "Actually, there was no more metro… So I took a Vélib' bike. Anyway, what a hassle! (These three connectors glue together 80% of French conversations.)",
      secret: "Un Français n'utilise jamais « par conséquent » ou « en résumé » au café : « en fait » rectifie ou introduit, « du coup » exprime la conséquence, et « bref » clôt une anecdote avec humour.",
      q: "Vous racontez à un collègue pourquoi vous avez changé de restaurant hier soir. Quelle phrase sonne 100 % native ?",
      choices: [
        "En fait, c'était complet… Du coup, on a testé le bistrot d'en face. Bref, c'était super bon !",
        "En réalité, le restaurant était plein. Par conséquent, nous sommes allés ailleurs. En conclusion, c'était bon.",
        "Premièrement c'était fermé, donc deuxièmement nous avons changé d'endroit.",
        "À cause de la foule, nous avons conséquemment mangé en face."
      ],
      answer: "En fait, c'était complet… Du coup, on a testé le bistrot d'en face. Bref, c'était super bon !",
      why: "L'enchaînement « En fait… Du coup… Bref… » reproduit exactement la musique narrative d'un Français qui raconte sa journée."
    },
    {
      id: "ame_a2_3", cefr: "A2", pillar: "Code Social · Invitations & Refus",
      title: "« Ce n'est que partie remise » : décliner sans jamais froisser",
      place: "Sortie du cinéma MK2 Bibliothèque", speaker: "Camille · Éditrice",
      textbookFr: "Non, je ne peux pas venir vendredi. Au revoir.",
      nativeFr: "Oh mince, vendredi je suis déjà pris ! Mais ce n'est que partie remise, on se tient au courant la semaine prochaine ?",
      en: "Oh shoot, Friday I'm already booked! But consider it a rain check, let's keep each other posted next week?",
      secret: "En France, un « non » sec à une invitation est perçu comme froid : on exprime d'abord un petit regret (« Oh mince ! »), puis on promet de reporter (« Ce n'est que partie remise » / « On se tient au courant »).",
      q: "Une connaissance vous invite à un vernissage jeudi soir, mais vous avez déjà un dîner. Comment déclinez-vous avec élégance ?",
      choices: [
        "Ah quel dommage, jeudi j'ai déjà quelque chose ! Mais ce n'est que partie remise, on se redit vite !",
        "Non, jeudi c'est impossible pour moi parce que j'ai un dîner.",
        "Je refuse ton invitation pour jeudi, désolé.",
        "Pas jeudi. Appelle-moi un autre jour."
      ],
      answer: "Ah quel dommage, jeudi j'ai déjà quelque chose ! Mais ce n'est que partie remise, on se redit vite !",
      why: "Le regret sincère suivi de « ce n'est que partie remise » et « on se redit vite » préserve la chaleur du lien social tout en posant une limite claire."
    },
    {
      id: "ame_b1_1", cefr: "B1", pillar: "Tics de Langage · Enthousiasme & Accord",
      title: "« Carrément ! », « Ça marche ! », « C'est pas faux »",
      place: "Terrasse à Bastille", speaker: "Maxime · Réalisateur son",
      textbookFr: "Oui, je suis totalement d'accord avec ta proposition. C'est une très bonne idée.",
      nativeFr: "Carrément ! Ça marche pour moi, on fait comme ça !",
      en: "Totally! Works for me, let's do that! ('Carrément' and 'Ça marche' replace textbook 'Je suis d'accord' in everyday life.)",
      secret: "Pour valider une idée avec enthousiasme, les Français disent « Carrément ! » ou « Grave ! » (familier) ; pour valider un rendez-vous, « Ça marche ! » ; et pour acquiescer avec une pointe de retenue, la célèbre litote « C'est pas faux ».",
      q: "Un ami vous propose : « On se retrouve à 19h devant la cinémathèque et on mange un bout après ? » Que répondez-vous ?",
      choices: [
        "Carrément ! Ça marche pour 19h, à toute !",
        "Oui, j'accepte ta proposition avec grand plaisir.",
        "C'est exact, je suis d'accord avec cet horaire.",
        "Effectivement, cela fonctionne bien pour mon programme."
      ],
      answer: "Carrément ! Ça marche pour 19h, à toute !",
      why: "« Carrément ! » marque l'enthousiasme immédiat, « Ça marche » scelle le rendez-vous, et « à toute ! » (à tout à l'heure) conclut avec un naturel parfait."
    },
    {
      id: "ame_b1_2", cefr: "B1", pillar: "Esprit Critique · Nuancer un Désaccord",
      title: "L'art du « Oui, enfin… » et du « Cela dit… »",
      place: "Open-space près d'Opéra", speaker: "Élodie · Cheffe de projet",
      textbookFr: "Non, tu as tort. Ce projet est trop cher.",
      nativeFr: "Je vois tout à fait ce que tu veux dire, cela dit, niveau budget, ça risque d'être un peu juste, non ?",
      en: "I totally see what you mean; that said, budget-wise, it might be a bit tight, don't you think?",
      secret: "Contredire frontalement par « Tu as tort » braque l'interlocuteur ; les Français amortissent toujours par une concession apparente (« Oui, enfin… », « C'est vrai, mais en même temps… », « Cela dit… ») suivie d'une question ouverte.",
      q: "En réunion, un collègue propose de lancer une campagne demain matin sans relire les textes. Comment le freinez-vous comme un vrai Français ?",
      choices: [
        "L'idée est bonne, cela dit, si on prend une journée pour tout relire, on sera plus sereins, non ?",
        "Non, tu te trompes, c'est une mauvaise décision de lancer demain.",
        "Je suis contre ton idée parce qu'il y a des fautes.",
        "C'est faux, il est interdit de publier sans vérification."
      ],
      answer: "L'idée est bonne, cela dit, si on prend une journée pour tout relire, on sera plus sereins, non ?",
      why: "On valide d'abord l'élan (« L'idée est bonne »), on pivote avec « cela dit », et on termine par « non ? » pour associer l'autre à la prudence."
    },
    {
      id: "ame_b1_3", cefr: "B1", pillar: "Table & Convivialité · Codes du Dîner",
      title: "L'apéro, le regard pendant « Tchin-tchin » et les mains sur la table",
      place: "Appartement haussmannien · Oberkampf", speaker: "Julien & Claire · Hôtes du dîner",
      textbookFr: "Bonjour, je suis arrivé à l'heure exacte sans rien apporter. Santé !",
      nativeFr: "Bonsoir ! Tenez, j'ai pris une petite bouteille chez le caviste du coin. Santé ! (en se regardant dans les yeux)",
      en: "Good evening! Here, I picked up a nice bottle at the local wine shop. Cheers! (Always arrive 10-15 min after the stated time with wine/dessert, and lock eyes when clinking glasses.)",
      secret: "Trois règles d'or d'un dîner français : n'arrivez jamais pile à l'heure ni les mains vides (le « quart d'heure de politesse » est sacré), regardez chaque personne dans les yeux en trinquant, et gardez les poignets sur la table (jamais les mains sur les genoux).",
      q: "On lève les verres à l'apéro chez des amis parisiens. Quel est le réflexe culturel indispensable au moment de trinquer ?",
      choices: [
        "Regarder chaque personne droit dans les yeux en disant « Santé ! » ou « Tchin ! », sans croiser les bras avec d'autres verres.",
        "Boire une gorgée immédiatement avant que les autres aient levé leur verre.",
        "Regarder son verre en silence et poser ses mains sous la table juste après.",
        "Crier « Bon appétit ! » en tapant son verre sur la table."
      ],
      answer: "Regarder chaque personne droit dans les yeux en disant « Santé ! » ou « Tchin ! », sans croiser les bras avec d'autres verres.",
      why: "En France, ne pas regarder quelqu'un dans les yeux en trinquant (ou croiser les verres) est un faux pas célèbre que tout le monde remarque aussitôt."
    },
    {
      id: "ame_b2_1", cefr: "B2", pillar: "Humour & Lien Social · Râler avec Élégance",
      title: "Râler n'est pas être en colère : c'est un sport national de connivence",
      place: "Quai de la ligne 13 · Saint-Lazare", speaker: "Béatrice · Avocate",
      textbookFr: "Je suis extrêmement furieuse contre les transports publics aujourd'hui !",
      nativeFr: "Un train supprimé un lundi matin sous la pluie… franchement, ils ont le sens de la mise en scène à la RATP !",
      en: "A canceled train on a rainy Monday morning… honestly, they really have a sense of theatrical staging at the RATP!",
      secret: "En France, râler avec esprit et ironie légère sert à créer une complicité immédiate entre inconnus face aux petites absurdités du quotidien : ce n'est pas de la fureur, c'est un sourire partagé.",
      q: "L'administration vous demande un quatrième justificatif absurde dans une file d'attente. Comment râlez-vous avec élégance auprès de votre voisin ?",
      choices: [
        "Bientôt ils vont nous demander l'acte de naissance de l'arrière-grand-père… c'est tout un poème !",
        "Je déteste ce pays et je vais hurler sur l'employé au guichet !",
        "Tout fonctionne parfaitement bien dans ce bureau administratif.",
        "Je suis très triste et je vais pleurer immédiatement."
      ],
      answer: "Bientôt ils vont nous demander l'acte de naissance de l'arrière-grand-père… c'est tout un poème !",
      why: "L'exagération poétique (« l'acte de naissance de l'arrière-grand-père ») et l'expression « c'est tout un poème » transforment l'agacement en connivence pleine d'esprit."
    },
    {
      id: "ame_b2_2", cefr: "B2", pillar: "Humour & Second Degré · L'Antiphrase",
      title: "« Ah bah bravo ! » : décoder l'ironie pince-sans-rire du second degré",
      place: "Cuisine entre amis · Batignolles", speaker: "Antoine · Journaliste",
      textbookFr: "Tu as fait tomber la tarte par terre, c'est une catastrophe.",
      nativeFr: "Ah bah bravo, quelle maîtrise acrobatique ! Au moins, elle est déjà découpée.",
      en: "Oh well bravo, what acrobatic mastery! At least it's already sliced. (French 'second degré' says the opposite of reality with a deadpan face to defuse tension.)",
      secret: "Le « second degré » français repose sur l'antiphrase pince-sans-rire : féliciter quelqu'un pour une maladresse (« Ah bah bravo ! », « C'est du propre ! ») est une marque d'affection qui dédramatise l'instant.",
      q: "Votre ami arrive trempé de la tête aux pieds après avoir affirmé cinq minutes plus tôt qu'il ne pleuvrait absolument pas. Que lui lancez-vous au second degré ?",
      choices: [
        "Ah bah bravo Monsieur Météo, quelle intuition infaillible !",
        "Tu t'es trompé dans tes prévisions météorologiques, tu es mouillé.",
        "Bravo, je suis très fier que tu sois sec aujourd'hui.",
        "Pourquoi as-tu menti sur la pluie ? C'est impoli."
      ],
      answer: "Ah bah bravo Monsieur Météo, quelle intuition infaillible !",
      why: "« Ah bah bravo » suivi d'un surnom taquin (« Monsieur Météo ») est l'archétype du second degré affectueux entre amis français."
    },
    {
      id: "ame_b2_3", cefr: "B2", pillar: "Code Social · Tu vs Vous",
      title: "Le passage du « Vous » au « Tu » : un rituel de confiance",
      place: "Atelier d'architecture · Rue de Turenne", speaker: "Marc · Directeur artistique",
      textbookFr: "Maintenant je décide de te dire « tu ».",
      nativeFr: "Au fait, on peut se tutoyer, si vous voulez ? Ce sera plus simple !",
      en: "By the way, we can use 'tu' with each other, if you'd like? It'll be simpler! (Notice how the invitation itself still politely uses 'vous' until accepted.)",
      secret: "Le passage au tutoiement est un petit rite mutuel initié par la personne plus âgée ou hiérarchiquement supérieure ; la subtilité suprême consiste à demander « On peut se tutoyer, si vous voulez ? » en gardant le « vous » jusqu'au « oui ».",
      q: "Un nouveau partenaire professionnel du même âge vous dit avec le sourire : « On peut peut-être se tutoyer ? » Comment répondez-vous naturellement ?",
      choices: [
        "Avec plaisir, oui, ce sera beaucoup plus simple ! Tu es basé dans quel quartier, toi ?",
        "Non, je préfère conserver une distance grammaticale stricte avec vous.",
        "Oui, dorénavant j'autorise votre tutoiement.",
        "D'accord, vous pouvez me dire tu mais je vous dis vous."
      ],
      answer: "Avec plaisir, oui, ce sera beaucoup plus simple ! Tu es basé dans quel quartier, toi ?",
      why: "Accepter chaleureusement (« Avec plaisir ! ») puis ancrer immédiatement le premier « tu » dans une question conviviale scelle le passage sans aucune gêne."
    },
    {
      id: "ame_c1_1", cefr: "C1", pillar: "Culture Générale · Allusions Littéraires",
      title: "De la « madeleine de Proust » au « choix cornélien » : parler par clins d'œil",
      place: "Librairie de Saint-Germain-des-Prés", speaker: "Héloïse · Professeure de lettres",
      textbookFr: "Cette odeur me rappelle mon enfance, et maintenant j'ai un dilemme très difficile entre mon devoir et mes sentiments.",
      nativeFr: "Cette odeur de cire, c'est ma vraie madeleine de Proust… Mais pour ce poste à Lyon, je suis face à un choix cornélien.",
      en: "That smell of wax is my true Proustian madeleine… But regarding that position in Lyon, I'm facing a Cornelian dilemma.",
      secret: "Dans la conversation cultivée, les Français condensent des situations psychologiques complexes en allusions littéraires partagées : « madeleine de Proust » (mémoire involontaire), « choix cornélien » (devoir contre passion), « cultiver son jardin » (Voltaire).",
      q: "Un collègue s'épuise à vouloir réformer tout seul une vieille procédure administrative immuable. Quelle allusion culturelle glissez-vous avec bienveillance ?",
      choices: [
        "J'admire ta ténacité, mais fais attention à ne pas te battre contre des moulins à vent… il vaut parfois mieux cultiver notre jardin.",
        "Tu travailles beaucoup trop contre des machines agricoles imaginaires.",
        "C'est une madeleine de Proust administrative très difficile à manger.",
        "Ton problème est une fable de Victor Hugo sans solution."
      ],
      answer: "J'admire ta ténacité, mais fais attention à ne pas te battre contre des moulins à vent… il vaut parfois mieux cultiver notre jardin.",
      why: "Croiser Cervantès (« se battre contre des moulins à vent ») et la sagesse finale du Candide de Voltaire (« cultiver notre jardin ») est un marqueur immédiat d'aisance C1."
    },
    {
      id: "ame_c1_2", cefr: "C1", pillar: "Esprit Critique · Le Débat de Table",
      title: "Pourquoi contredire à table est une preuve d'estime intellectuelle",
      place: "Dîner en appartement · Quartier Latin", speaker: "François · Essayiste",
      textbookFr: "Je suis entièrement d'accord avec tout le monde pour éviter les conflits pendant le repas.",
      nativeFr: "C'est une lecture séduisante, mais si on pousse ton raisonnement jusqu'au bout, est-ce qu'on ne tombe pas dans le paradoxe inverse ?",
      en: "That's a compelling reading, but if we push your reasoning to its logical conclusion, don't we fall into the opposite paradox?",
      secret: "Dans un dîner français, la joute d'idées est un hommage rendu à l'intelligence de l'autre : on attaque vigoureusement la thèse tout en respectant chaleureusement la personne, avant de resservir du fromage.",
      q: "Lors d'un dîner animé sur le cinéma contemporain, votre hôte défend une thèse que vous trouvez réductrice. Comment relancez-vous la joute avec panache ?",
      choices: [
        "Je te rejoins sur le constat esthétique, encore que, à y regarder de plus près, c'est justement cette fragilité qui fait la force du film, tu ne trouves pas ?",
        "Je préfère changer de sujet immédiatement pour que personne ne se fâche à table.",
        "Tu n'y connais rien au cinéma, ton opinion est ridicule.",
        "Oui, tu as raison sur tout, passons au dessert en silence."
      ],
      answer: "Je te rejoins sur le constat esthétique, encore que, à y regarder de plus près, c'est justement cette fragilité qui fait la force du film, tu ne trouves pas ?",
      why: "Le connecteur « encore que » (subtil et très français), la distinction du constat et de l'interprétation, et l'ouverture finale nourrissent le plaisir de la conversation."
    },
    {
      id: "ame_c1_3", cefr: "C1", pillar: "Éloquence · L'Art de la Litote",
      title: "« Ce n'est pas dénué d'intérêt » : dire beaucoup en disant peu",
      place: "Galerie d'art · Rue de Seine", speaker: "Sébastien · Critique d'art",
      textbookFr: "Cette exposition est intéressante mais certaines œuvres sont mauvaises.",
      nativeFr: "La démarche n'est pas dénuée d'intérêt, quoique la seconde salle laisse un peu sur sa faim.",
      en: "The approach is not devoid of interest, although the second room leaves one wanting a bit more.",
      secret: "Depuis le Grand Siècle (« Va, je ne te hais point »), l'élégance française adore la litote : dire « ce n'est pas dénué d'intérêt » ou « ce n'est pas inintéressant » est un compliment mesuré bien plus chic qu'un superlatif bruyant.",
      q: "On vous demande votre avis sur un premier roman prometteur mais encore inégal. Quelle critique sonne comme celle d'un vrai lecteur parisien averti ?",
      choices: [
        "L'écriture ne manque pas de souffle, même si l'ensemble pèche parfois par excès de virtuosité.",
        "Ce livre est super génial à 70 % et nul à 30 %.",
        "L'auteur a écrit des pages bonnes et des pages très mauvaises.",
        "C'est un chef-d'œuvre absolu mais je ne l'ai pas aimé."
      ],
      answer: "L'écriture ne manque pas de souffle, même si l'ensemble pèche parfois par excès de virtuosité.",
      why: "La litote « ne manque pas de souffle » et le reproche qui ressemble presque à un éloge (« pèche par excès de virtuosité ») incarnent la finesse critique à la française."
    },
    {
      id: "ame_c2_1", cefr: "C2", pillar: "Ironie & Esprit Français · Le Mot d'Esprit",
      title: "Le chiasme et le paradoxe : la mécanique du trait d'esprit",
      place: "Salon littéraire · Place des Vosges", speaker: "Diane de V. · Éditorialiste",
      textbookFr: "Les gens qui parlent beaucoup de modernité oublient souvent l'histoire et répètent le passé.",
      nativeFr: "À force de vouloir abolir le passé au nom de l'avenir, on finit par préparer un avenir qui bégaye le passé.",
      en: "By trying so hard to abolish the past in the name of the future, we end up preparing a future that stammers the past.",
      secret: "L'esprit français au niveau C2 hérite des moralistes (La Rochefoucauld, Chamfort) : il renverse les termes d'une phrase en miroir (le chiasme) pour faire jaillir une vérité paradoxale en quelques mots.",
      q: "Dans une conversation sur le conformisme des réseaux sociaux, quelle formule condensée témoigne d'un véritable « esprit français » de niveau C2 ?",
      choices: [
        "Aujourd'hui, chacun veut tellement se distinguer de la foule qu'on n'a jamais vu une foule aussi uniforme d'originaux.",
        "Sur internet, beaucoup de personnes veulent être différentes mais elles font la même chose.",
        "Les réseaux sociaux créent une grande similarité entre les utilisateurs modernes.",
        "Il est paradoxal de constater que l'originalité numérique est faible."
      ],
      answer: "Aujourd'hui, chacun veut tellement se distinguer de la foule qu'on n'a jamais vu une foule aussi uniforme d'originaux.",
      why: "L'alliance oxymorique d'« une foule aussi uniforme d'originaux » capture une analyse sociologique entière en une seule pointe étincelante."
    },
    {
      id: "ame_c2_2", cefr: "C2", pillar: "Haute Diplomatie · Euphémisme & Sous-entendu",
      title: "Le velours et la lame : l'euphémisme du Quai d'Orsay",
      place: "Réception près des Invalides · Quai d'Orsay", speaker: "Monsieur de Saint-Clair · Diplomate",
      textbookFr: "Votre proposition est totalement irréaliste et nous la rejetons catégoriquement.",
      nativeFr: "Votre proposition a le grand mérite de l'audace ; il nous reste simplement à la réconcilier avec le principe de réalité.",
      en: "Your proposal has the great merit of audacity; it simply remains for us to reconcile it with the reality principle.",
      secret: "Dans la haute langue française, plus le désaccord est profond, plus la syntaxe devient soyeuse : louer « l'audace » ou « l'originalité » d'une mesure tout en invoquant « le principe de réalité » est un refus définitif ganté de velours.",
      q: "Lors d'un conseil d'administration tendu, un interlocuteur présente un plan financier hasardeux. Comment le récusez-vous avec l'ironie feutrée du C2 ?",
      choices: [
        "Voilà une architecture financière d'un optimisme admirable, dont on aimerait croire que les chiffres partageront longtemps l'enthousiasme.",
        "Ce plan financier est dangereux et vos calculs sont faux.",
        "Je refuse catégoriquement de voter pour ce budget imprudent.",
        "Vos chiffres ne sont pas assez réalistes pour notre entreprise."
      ],
      answer: "Voilà une architecture financière d'un optimisme admirable, dont on aimerait croire que les chiffres partageront longtemps l'enthousiasme.",
      why: "Prêter aux « chiffres » la capacité de partager (ou non) « l'enthousiasme » de l'auteur est un modèle d'ironie courtoise et implacable."
    },
    {
      id: "ame_c2_3", cefr: "C2", pillar: "Éloquence & Culture Générale · La Montée en Généralité",
      title: "Du croissant au contrat social : le réflexe de la synthèse universelle",
      place: "Café de la Mairie · Place Saint-Sulpice", speaker: "Professeur Delmas · Philosophe",
      textbookFr: "J'aime m'asseoir à la terrasse des cafés parisiens parce qu'on peut regarder les gens passer.",
      nativeFr: "Au fond, la terrasse parisienne n'est pas qu'un simple débit de boissons : c'est le petit théâtre démocratique où la solitude de chacun vient se frotter au spectacle de la cité.",
      en: "At bottom, the Parisian café terrace isn't just a place that serves drinks: it's the little democratic theater where each person's solitude comes to rub shoulders with the spectacle of the city.",
      secret: "Le réflexe intellectuel suprême d'un Français consiste à opérer une « montée en généralité » : partir d'un détail concret de la vie quotidienne (un café, une grève, un jardin) pour en dégager, sans pédanterie, une loi universelle sur la condition humaine.",
      q: "On parle à table du rituel français du long déjeuner dominical. Comment élevez-vous l'anecdote vers une réflexion universelle avec naturel ?",
      choices: [
        "Au fond, si nous défendons tant la lenteur du repas, ce n'est pas par simple gourmandise : c'est notre façon de soustraire le lien humain à la tyrannie de l'utile.",
        "Les Français mangent longtemps le dimanche parce que la gastronomie est inscrite au patrimoine culturel.",
        "Il est agréable de passer trois heures à table avec sa famille pour bien digérer.",
        "Sociologiquement, le repas dominical représente une tradition importante en France."
      ],
      answer: "Au fond, si nous défendons tant la lenteur du repas, ce n'est pas par simple gourmandise : c'est notre façon de soustraire le lien humain à la tyrannie de l'utile.",
      why: "Le mouvement « Au fond, ce n'est pas X, c'est Y » suivi de la formule « soustraire le lien humain à la tyrannie de l'utile » accomplit la synthèse humaniste qui signe l'âme française à son sommet."
    }
  ];

  const PENSEE_CASES = [
    {
      id: "pensee_a1_1", cefr: "A1", sceneIcon: "❄️🧥🥐", category: "Sensations & Besoins (Avoir)",
      indicesFr: [
        "Mon estomac est vide à midi : je veux un croissant chaud.",
        "La température est à 0°C dehors : mon corps tremble sous mon manteau.",
        "En français, mon corps « possède » une sensation physique (verbe AVOIR)."
      ],
      mentalImageEn: "(Visual cue: shivering outside a Paris bakery at noon with an empty stomach)",
      promptFr: "Quelle pensée directe surgit dans votre esprit face à cette double sensation physique ?",
      answer: "J'ai faim et j'ai froid.",
      choices: [
        "J'ai faim et j'ai froid.",
        "Je suis faim et je suis froid.",
        "Je suis affamé et je fais froid.",
        "Il est faim et j'ai le froid."
      ],
      trapNote: "Piège de traduction anglaise : l'anglais dit « I am hungry / I am cold » (être). En français, la faim, la soif, le froid, le chaud et la peur sont des sensations que l'on « possède » avec AVOIR sans article (« J'ai faim, j'ai froid »). Dire « Je suis froid » signifie qu'on a une personnalité distante !",
      innerMonologueFr: "Dans ma tête, je pense directement : « Brrr, j'ai froid dehors et j'ai vraiment faim, j'entre dans la boulangerie ! »"
    },
    {
      id: "pensee_a1_2", cefr: "A1", sceneIcon: "☀️🌿☕", category: "Météo & Atmosphère (Faire)",
      indicesFr: [
        "Le soleil brille dans un ciel bleu sans nuages.",
        "L'air du matin est agréable sur la terrasse du café.",
        "En français, la nature « fabrique » ou « fait » l'atmosphère autour de nous."
      ],
      mentalImageEn: "(Visual cue: stepping onto a sunny morning terrace with mild, pleasant air)",
      promptFr: "En ouvrant la fenêtre sur ce soleil radieux, quelle pensée spontanée exprime la météo ?",
      answer: "Il fait beau et il fait doux.",
      choices: [
        "Il fait beau et il fait doux.",
        "C'est beau temps et il est chaud.",
        "La météo est belle et elle est douce.",
        "Il est beau dehors et c'est doux."
      ],
      trapNote: "Piège de traduction anglaise : ne traduisez jamais « It is nice / warm outside » par « Il est beau / Il est chaud ». En français, l'impersonnel « Il fait + adjectif » exprime l'ambiance atmosphérique (« Il fait beau, il fait chaud, il fait doux, il fait nuit »).",
      innerMonologueFr: "Dans ma tête, je pense directement : « Quel bonheur, il fait beau ce matin, je prends mon café en terrasse ! »"
    },
    {
      id: "pensee_a1_3", cefr: "A1", sceneIcon: "🎂🕯️🕛", category: "Âge & Heure (Avoir / Être)",
      indicesFr: [
        "Aujourd'hui, c'est mon anniversaire : il y a 25 bougies sur le gâteau.",
        "Les deux aiguilles de l'horloge sont tout en haut sur le 12, sous le soleil.",
        "On « accumule » ses années avec AVOIR, et l'heure exacte s'énonce avec IL EST."
      ],
      mentalImageEn: "(Visual cue: blowing out 25 birthday candles right as the clock strikes 12:00 noon)",
      promptFr: "Comment pensez-vous directement votre âge et l'heure du déjeuner sans passer par l'anglais ?",
      answer: "J'ai vingt-cinq ans et il est midi.",
      choices: [
        "J'ai vingt-cinq ans et il est midi.",
        "Je suis vingt-cinq ans vieux et c'est douze heures.",
        "J'ai vingt-cinq années et il fait midi.",
        "Je suis vingt-cinq et l'heure est midi."
      ],
      trapNote: "Piège de traduction anglaise : l'anglais dit « I am 25 years old » et « It's 12 o'clock ». En français, on possède ses années (« J'ai 25 ans », jamais « Je suis 25 » ni « vieux ») et on distingue « Il est midi » (12h00 le jour) de « Il est minuit » (00h00 la nuit).",
      innerMonologueFr: "Dans ma tête, je pense directement : « Il est déjà midi ! Aujourd'hui, j'ai vingt-cinq ans et on fête ça ensemble. »"
    },
    {
      id: "pensee_a2_1", cefr: "A2", sceneIcon: "🚉💌💭", category: "Émotions Directes (Inversion du Sujet)",
      indicesFr: [
        "Mon ami est loin, dans une autre ville, et je pense à lui avec tendresse.",
        "Son absence crée un vide en moi : c'est LUI qui est absent de ma vie.",
        "Le verbe « manquer » signifie « être absent » : la personne absente est le sujet grammatical."
      ],
      mentalImageEn: "(Visual cue: looking at an empty chair across the café table, wishing your close friend were here)",
      promptFr: "Quand l'absence d'un proche pèse sur votre cœur, quelle phrase jaillit naturellement en français ?",
      answer: "Tu me manques énormément.",
      choices: [
        "Tu me manques énormément.",
        "Je te manque énormément.",
        "Je manque toi beaucoup.",
        "Tu es manqué par moi."
      ],
      trapNote: "Piège majeur de l'anglais : « I miss you » place « I » en sujet. En français, « manquer » veut dire « faire défaut / être absent ». Donc « Tu me manques » = « Toi, tu es absent pour moi ». Attention : dire « Je te manque » signifie l'inverse (« You miss me ») !",
      innerMonologueFr: "Dans ma tête, je pense directement : « La maison est trop calme sans toi... Tu me manques énormément ! »"
    },
    {
      id: "pensee_a2_2", cefr: "A2", sceneIcon: "🏡🔑⏳", category: "Continuité Temporelle (Depuis + Présent)",
      indicesFr: [
        "J'ai posé mes valises dans cet appartement il y a deux ans.",
        "Aujourd'hui encore, à cette seconde précise, je vis toujours dans ce même appartement.",
        "Quand une action commencée dans le passé est encore vivante maintenant, le français pense au PRÉSENT."
      ],
      mentalImageEn: "(Visual cue: timeline starting 2 years ago and actively glowing right now in your current home)",
      promptFr: "Comment votre esprit français relie-t-il une action commencée il y a deux ans et toujours vraie aujourd'hui ?",
      answer: "J'habite ici depuis deux ans.",
      choices: [
        "J'habite ici depuis deux ans.",
        "J'ai habité ici pour deux ans.",
        "Je suis habitant ici depuis deux ans.",
        "J'habitais ici pendant deux ans."
      ],
      trapNote: "Piège de traduction anglaise : « I have lived here for two years » utilise un temps du passé + « for ». En français, si l'action continue au moment où l'on parle, on utilise le PRÉSENT + DEPUIS (« J'habite ici depuis deux ans »). Utiliser le passé composé (« J'ai habité ») signifierait que c'est fini !",
      innerMonologueFr: "Dans ma tête, je pense directement : « Je connais chaque recoin du quartier parce que j'habite ici depuis deux ans. »"
    },
    {
      id: "pensee_a2_3", cefr: "A2", sceneIcon: "🚌🎧🔑", category: "Mouvement & Perception (Verbes Directs)",
      indicesFr: [
        "Je regarde partout dans mon sac pour trouver mes clés.",
        "Je patiente à l'arrêt jusqu'à l'arrivée du bus.",
        "Mes oreilles suivent une mélodie : ces trois verbes français touchent leur objet directement, sans préposition."
      ],
      mentalImageEn: "(Visual cue: standing at a bus stop, searching your bag for keys while listening to music)",
      promptFr: "Quelle pensée fluide assemble ces trois actions quotidiennes sans aucune préposition superflue ?",
      answer: "Je cherche mes clés et j'attends le bus en écoutant la radio.",
      choices: [
        "Je cherche mes clés et j'attends le bus en écoutant la radio.",
        "Je cherche pour mes clés et j'attends pour le bus en écoutant à la radio.",
        "Je regarde pour mes clés et j'attends sur le bus en écoutant la radio.",
        "Je cherche après mes clés et j'attends au bus en écoutant à la musique."
      ],
      trapNote: "Piège de traduction anglaise : l'anglais ajoute des particules (« look FOR, wait FOR, listen TO »). En français, « chercher », « attendre », « écouter » et « regarder » sont transitifs directs : l'idée inclut déjà la préposition ! Jamais de « pour » ni de « à » derrière eux.",
      innerMonologueFr: "Dans ma tête, je pense directement : « J'attends le bus tranquillement et j'écoute mon podcast préféré pendant que je cherche mes clés. »"
    },
    {
      id: "pensee_b1_1", cefr: "B1", sceneIcon: "🗺️🏙️🧭", category: "Architecture Mentale (Savoir vs Connaître)",
      indicesFr: [
        "J'ai déjà marché cent fois dans les rues de Lyon : cette ville m'est familière (suivi d'un nom).",
        "J'ai la compétence mentale de m'orienter ou l'information précise d'un fait (suivi d'un verbe ou de « que/où »).",
        "Le cerveau francophone sépare la familiarité avec un être/lieu (CONNAÎTRE) et la maîtrise d'un fait ou d'un savoir-faire (SAVOIR)."
      ],
      mentalImageEn: "(Visual cue: walking confidently through familiar Lyon streets and knowing exactly which turn to take)",
      promptFr: "Comment distinguez-vous spontanément la familiarité avec une ville et la capacité de vous y orienter ?",
      answer: "Je connais très bien ce quartier, donc je sais où se trouve la gare.",
      choices: [
        "Je connais très bien ce quartier, donc je sais où se trouve la gare.",
        "Je sais très bien ce quartier, donc je connais où se trouve la gare.",
        "Je connais comment aller à la gare parce que je sais ce quartier.",
        "Je sais ce quartier par cœur et je connais nager."
      ],
      trapNote: "Piège de traduction anglaise : l'anglais n'a qu'un seul verbe (« to know »). En français, CONNAÎTRE est toujours suivi d'un nom (une personne, un lieu, une œuvre : « Je connais Lyon »), tandis que SAVOIR s'emploie devant un verbe à l'infinitif ou une proposition (« Je sais nager, je sais où il habite »).",
      innerMonologueFr: "Dans ma tête, je pense directement : « Pas besoin de GPS : je connais très bien ce quartier et je sais exactement par où passer ! »"
    },
    {
      id: "pensee_b1_2", cefr: "B1", sceneIcon: "📩⚡✍️", category: "Ancrage Aspectuel (Passé Immédiat & Action en Cours)",
      indicesFr: [
        "Il y a trente secondes à peine, le message est arrivé dans ma boîte.",
        "En ce moment même, mes doigts tapent la réponse sur le clavier.",
        "Le français ancre l'instant présent entre « venir de + infinitif » (juste avant) et « être en train de + infinitif » (en plein milieu)."
      ],
      mentalImageEn: "(Visual cue: an email notification just popped up 10 seconds ago, and you are actively typing the reply right now)",
      promptFr: "Quelle pensée exprime avec précision une action achevée à l'instant et une action en cours d'accomplissement ?",
      answer: "Je viens de recevoir son courriel et je suis en train d'y répondre.",
      choices: [
        "Je viens de recevoir son courriel et je suis en train d'y répondre.",
        "J'ai juste reçu son courriel et je suis répondant maintenant.",
        "Je viens recevoir son courriel et je réponds en train.",
        "Je suis juste venu de recevoir son courriel et je suis répondant."
      ],
      trapNote: "Piège de traduction anglaise : « I just received » traduit mot à mot par « J'ai juste reçu » est un calque maladroit (en français, « juste » signifie « seulement » ou « équitable »). Le réflexe natif est le passé récent « Je viens de + infinitif », combiné à « être en train de + infinitif ».",
      innerMonologueFr: "Dans ma tête, je pense directement : « Ne me dérange pas une seconde, je viens de recevoir son courriel et je suis en train d'y répondre. »"
    },
    {
      id: "pensee_b1_3", cefr: "B1", sceneIcon: "💡😲🗝️", category: "Prise de Conscience (Se rendre compte vs Réaliser)",
      indicesFr: [
        "Soudain, une lumière s'allume dans mon esprit : j'ai oublié mes clés sur la table !",
        "Ailleurs, un architecte concrétise son rêve en construisant un bâtiment réel.",
        "En français classique, l'esprit « se rend compte d'une vérité », tandis qu'on « réalise » (rend réel) un projet ou un rêve."
      ],
      mentalImageEn: "(Visual cue: sudden mental lightbulb flash on the way to the airport vs. building a concrete project)",
      promptFr: "Comment formulez-vous authentiquement un déclic soudain de la conscience ?",
      answer: "Je viens de me rendre compte que j'avais laissé mes clés à l'intérieur.",
      choices: [
        "Je viens de me rendre compte que j'avais laissé mes clés à l'intérieur.",
        "Je viens de rendre compte mes clés étaient à l'intérieur.",
        "J'ai pris conscience mes clés à l'intérieur sans de.",
        "Je me suis réalisé que mes clés sont dedans."
      ],
      trapNote: "Piège de traduction anglaise : en français soigné, « réaliser » signifie d'abord « concrétiser / rendre réel » (réaliser un film, réaliser un rêve), alors que la prise de conscience intellectuelle s'exprime naturellement par « se rendre compte que / de » ou « prendre conscience de ».",
      innerMonologueFr: "Dans ma tête, je pense directement : « Oh non, quelle étourderie ! Je viens tout juste de me rendre compte que j'avais laissé mes clés à l'intérieur. »"
    },
    {
      id: "pensee_b2_1", cefr: "B2", sceneIcon: "🔍🎭⚖️", category: "Dynamique Pronominale (S'avérer & Se douter)",
      indicesFr: [
        "Une hypothèse qui semblait incertaine au début révèle finalement sa vraie nature dans les faits.",
        "Mon intuition me soufflait déjà en secret que cela allait se produire ainsi.",
        "Attention : « se douter que » signifie avoir une intuition (« soupçonner »), exactement l'inverse de « douter de » !"
      ],
      mentalImageEn: "(Visual cue: curtains parting to reveal the truth of a situation you quietly suspected all along)",
      promptFr: "Quelle structure B2 exprime à la fois ce que les faits révèlent et ce que votre intuition pressentait ?",
      answer: "Cette démarche s'avère fructueuse, exactement comme je m'en doutais.",
      choices: [
        "Cette démarche s'avère fructueuse, exactement comme je m'en doutais.",
        "Cette démarche tourne dehors fructueuse, comme je soupçonnais.",
        "Cette démarche s'avère d'être vraie, comme je doutais.",
        "Cette démarche prouve fructueuse, comme j'avais aucun doute."
      ],
      trapNote: "Double piège B2 : 1) L'anglais « turns out to be » se pense en français avec le pronominal « s'avérer + adjectif » (évitez « s'avérer vrai » car « avérer » contient déjà « vrai »). 2) « Se douter de quelque chose » = le pressentir (« I suspected it »), alors que « douter de » = ne pas croire.",
      innerMonologueFr: "Dans ma tête, je pense directement : « Cette démarche s'avère beaucoup plus fructueuse que prévu, exactement comme je m'en doutais dès le départ. »"
    },
    {
      id: "pensee_b2_2", cefr: "B2", sceneIcon: "🚄🏛️⚡", category: "Concision & Nominalisation Française",
      indicesFr: [
        "Plutôt que d'alourdir la phrase avec « Aussitôt qu'elle est arrivée et après qu'on a signé... », l'esprit français condense l'action en un nom.",
        "Le verbe « arriver » devient « l'arrivée », et « signer » devient « la signature ».",
        "Cette architecture nominale donne au français B2/C1 son élégance nerveuse et sa rapidité de pensée."
      ],
      mentalImageEn: "(Visual cue: compressing a clumsy chain of verb clauses into sleek, architectural noun blocks)",
      promptFr: "Comment l'esprit français condense-t-il élégamment une succession d'actions par la nominalisation ?",
      answer: "Dès son arrivée, la signature de l'accord a apaisé les tensions.",
      choices: [
        "Dès son arrivée, la signature de l'accord a apaisé les tensions.",
        "Aussitôt qu'elle est arrivée, le fait qu'on a signé l'accord a apaisé les tensions.",
        "Sur son arrivant, signant l'accord a fait les tensions calmes.",
        "Dès qu'arrivant, la signation de l'accord a apaisé les tensions."
      ],
      trapNote: "Piège stylistique anglais : l'anglais privilégie les verbes dynamiques ou les gérondifs (« Upon her arriving, signing the deal... »). Le génie propre du français B2/C1 repose sur la nominalisation (« Dès son arrivée, la signature de... »), qui transforme le processus en concept compact.",
      innerMonologueFr: "Dans ma tête, je pense directement : « Dès son arrivée au ministère, la signature de l'accord a immédiatement apaisé les tensions. »"
    },
    {
      id: "pensee_b2_3", cefr: "B2", sceneIcon: "🛡️🌊⚖️", category: "Cadrage Concessif & Constat (Quand bien même)",
      indicesFr: [
        "Les faits s'imposent à nous avec une évidence qu'on ne peut pas nier.",
        "Même dans l'hypothèse extrême où des obstacles surgiraient, notre position resterait intacte.",
        "La locution « Force est de constater que » pose un constat lucide, et « quand bien même + conditionnel » exprime l'hypothèse concessive."
      ],
      mentalImageEn: "(Visual cue: acknowledging an undeniable reality while standing firm even against a hypothetical storm)",
      promptFr: "Quelle articulation de pensée combine un constat indiscutable et une concession hypothétique de registre soutenu ?",
      answer: "Force est de constater que ce modèle fonctionne, quand bien même certains en contesteraient la méthode.",
      choices: [
        "Force est de constater que ce modèle fonctionne, quand bien même certains en contesteraient la méthode.",
        "Nous sommes forcés de voir que ce modèle marche, même si certains contesteront la méthode.",
        "Il est fort de constater que ce modèle fonctionne, quand même certains contestent la méthode.",
        "La force constate que ce modèle marche, bien que certains contesteraient la méthode."
      ],
      trapNote: "Piège syntaxique : ne confondez pas « quand même » (familier/courant : « tout de même ») et « quand bien même » (concession hypothétique soutenue qui exige TOUJOURS le conditionnel : « quand bien même il pleuvrait » = « even if it were to rain »).",
      innerMonologueFr: "Dans ma tête, je pense directement : « Force est de constater que ce modèle fonctionne remarquablement, quand bien même certains en contesteraient encore la méthode. »"
    },
    {
      id: "pensee_c1_1", cefr: "C1", sceneIcon: "🎭🏛️⏳", category: "Noms Conceptuels C1 (Ambivalence & Pérennité)",
      indicesFr: [
        "Premier concept : le fait d'éprouver simultanément deux sentiments opposés (attrait et rejet) envers une même réalité.",
        "Second concept : le caractère de ce qui dure à travers le temps et résiste à l'usure des siècles.",
        "Penser en C1, c'est nommer directement l'architecture abstraite d'un phénomène sans passer par une périphrase."
      ],
      mentalImageEn: "(Visual cue: a two-faced mask of simultaneous attraction/repulsion beside an enduring stone monument)",
      promptFr: "Quelle pensée mobilise avec justesse ces deux concepts abstraits fondamentaux ?",
      answer: "Malgré l'ambivalence de nos sentiments initiaux, nous œuvrons à la pérennité de cette institution.",
      choices: [
        "Malgré l'ambivalence de nos sentiments initiaux, nous œuvrons à la pérennité de cette institution.",
        "Malgré l'ambiguïté de nos sentiments mélangés, nous travaillons pour la durabilité longue de cette institution.",
        "Malgré l'équivalence de nos émotions, nous assurons la perpétuité de cette institution.",
        "Malgré la polyvalence de nos sentiments, nous cherchons la pérennisation éternelle."
      ],
      trapNote: "Précision conceptuelle C1 : l'anglais dit souvent « mixed feelings » là où le français C1 pense immédiatement « l'ambivalence ». De même, « l'ambiguïté » concerne un sens flou (double interprétation), tandis que « l'ambivalence » désigne la coexistence de deux tendances affectives opposées.",
      innerMonologueFr: "Dans ma tête, je pense directement : « Malgré l'ambivalence de nos sentiments initiaux, nous œuvrons tous à garantir la pérennité de cette institution. »"
    },
    {
      id: "pensee_c1_2", cefr: "C1", sceneIcon: "📉🔮⚡", category: "Distinction Paronymique (Conjoncture vs Conjecture)",
      indicesFr: [
        "Le premier mot (avec ON) désigne la situation globale résultant d'un ensemble de circonstances économiques ou politiques à un moment donné.",
        "Le second mot (avec EC) désigne une pure hypothèse, une supposition fondée sur des indices incomplets.",
        "L'esprit C1 ne confond jamais la réalité d'une situation (la conjoncture) et la spéculation de l'esprit (la conjecture)."
      ],
      mentalImageEn: "(Visual cue: an economic weather map of current circumstances vs. a crystal ball of mere speculation)",
      promptFr: "Quelle phrase distingue avec une rigueur irréprochable la situation présente et la simple supposition ?",
      answer: "Dans une conjoncture économique aussi instable, il serait hasardeux de se livrer à la moindre conjecture.",
      choices: [
        "Dans une conjoncture économique aussi instable, il serait hasardeux de se livrer à la moindre conjecture.",
        "Dans une conjecture économique aussi instable, il serait hasardeux de faire la moindre conjoncture.",
        "Dans cette conjonction économique, toute conjoncture abstraite est risquée.",
        "Face à cette conjecture actuelle, nos conjonctures restent incertaines."
      ],
      trapNote: "Piège des paronymes C1 : « la conjoncture » (de conjungere, joindre ensemble les circonstances du moment) est le contexte réel (« la conjoncture actuelle »), tandis que « la conjecture » (de conjectura, supposition) est une spéculation intellectuelle (« se perdre en conjectures »).",
      innerMonologueFr: "Dans ma tête, je pense directement : « Dans une conjoncture économique aussi instable, il serait franchement hasardeux de se livrer à la moindre conjecture. »"
    },
    {
      id: "pensee_c1_3", cefr: "C1", sceneIcon: "♟️🗝️⚖️", category: "Hypothèse Complexe & Restriction (Encore faudrait-il)",
      indicesFr: [
        "On accorde provisoirement à son interlocuteur qu'une première condition puisse se réaliser (« En admettant que + subjonctif »).",
        "Aussitôt après, on introduit la condition sine qua non qui reste à prouver, avec inversion du sujet.",
        "« Encore faudrait-il que + subjonctif » est le pivot C1 par excellence pour nuancer une hypothèse trop optimiste."
      ],
      mentalImageEn: "(Visual cue: conceding the first chess move on the board, then pointing to the decisive hurdle that still remains)",
      promptFr: "Comment structurez-vous directement en français une hypothèse concédée suivie d'une condition restrictive ?",
      answer: "En admettant que cet accord soit ratifié, encore faudrait-il que chacun en respecte l'esprit.",
      choices: [
        "En admettant que cet accord soit ratifié, encore faudrait-il que chacun en respecte l'esprit.",
        "En admettant que cet accord est ratifié, il faudrait encore que chacun respecte l'esprit.",
        "Supposant que cet accord soit ratifié, encore il faudrait que chacun en respecte l'esprit.",
        "Même en admettant que cet accord sera ratifié, encore faut-il que chacun respectera l'esprit."
      ],
      trapNote: "Architecture mentale C1 : au lieu d'empiler « Even if we assume that... we would still need... », le français pense en diptyque : « En admettant que + subjonctif » (concession théorique) suivi de l'inversion élégante « encore faudrait-il que + subjonctif » (condition décisive).",
      innerMonologueFr: "Dans ma tête, je pense directement : « En admettant que cet accord soit ratifié dès demain, encore faudrait-il que chacun en respecte véritablement l'esprit. »"
    },
    {
      id: "pensee_c2_1", cefr: "C2", sceneIcon: "🪞🌌⏳", category: "Concepts Philosophiques C2 (Altérité, Inéluctabilité, Quintessence)",
      indicesFr: [
        "Premier concept : le caractère de ce qui est autre, la reconnaissance philosophique d'autrui dans sa différence irréductible.",
        "Deuxième concept : ce à quoi nul ne peut échapper, le caractère de ce qui advient nécessairement.",
        "Troisième concept : ce qu'il y a de plus pur, de plus concentré et de plus essentiel dans une réalité."
      ],
      mentalImageEn: "(Visual cue: two distinct human silhouettes facing each other across the inevitable flow of time, distilling the purest essence of dialogue)",
      promptFr: "Quelle pensée philosophique C2 tisse naturellement « l'altérité », « l'inéluctabilité » et « la quintessence » ?",
      answer: "Confronté à l'inéluctabilité du temps, l'esprit découvre dans l'épreuve de l'altérité la quintessence même du dialogue humain.",
      choices: [
        "Confronté à l'inéluctabilité du temps, l'esprit découvre dans l'épreuve de l'altérité la quintessence même du dialogue humain.",
        "Face à l'inévitabilité du temps, l'esprit trouve dans l'autrement la cinquième essence du dialogue.",
        "Confronté à l'inéluctabilité temporelle, l'alternance d'autrui révèle la quintessence du dialogue.",
        "Devant l'inéluctable temps, l'altruisme de l'autre incarne la quintessence de la parole."
      ],
      trapNote: "Faux-amis conceptuels C2 : ne confondez jamais « l'altérité » (le fait d'être radicalement autre, concept philosophique majeur d'Emmanuel Levinas ou Paul Ricœur) avec « l'altruisme » (la bienveillance envers autrui) ou « l'alternance » (succession tour à tour).",
      innerMonologueFr: "Dans ma tête, je pense directement : « Confronté à l'inéluctabilité du temps, l'esprit découvre dans l'épreuve de l'altérité la quintessence même du dialogue humain. »"
    },
    {
      id: "pensee_c2_2", cefr: "C2", sceneIcon: "🕯️📜🍂", category: "Transmutation Aphoristique C2 (Moralistes Français)",
      indicesFr: [
        "Une émotion brute : la nostalgie devant le temps qui efface peu à peu les souvenirs d'un moment précieux.",
        "Dans la tradition de La Rochefoucauld, Proust ou Camus, le C2 transforme l'émotion personnelle en vérité générale ciselée.",
        "La tournure « Ce n'est pas tant X qui..., que Y où... » crée un balancement classique d'une sobriété souveraine."
      ],
      mentalImageEn: "(Visual cue: a fading autumn leaf pressed in a book, turning raw nostalgia into a sculpted French maxim)",
      promptFr: "Comment métamorphosez-vous une émotion intime sur l'oubli en un monologue intérieur aphoristique de niveau C2 ?",
      answer: "Ce n'est pas tant la fuite des jours qui nous dépossède, que l'imperceptible silence où s'émousse la mémoire.",
      choices: [
        "Ce n'est pas tant la fuite des jours qui nous dépossède, que l'imperceptible silence où s'émousse la mémoire.",
        "Ce n'est pas tellement le temps qui passe qui nous rend tristes, mais plutôt le silence qui fait oublier les souvenirs.",
        "Il n'est pas autant la fuite des jours qui nous prend tout, comme le silence où la mémoire perd son tranchant.",
        "Non seulement les jours fuient et nous dépossèdent, mais aussi le silence émousse notre mémoire."
      ],
      trapNote: "Génie aphoristique français : là où une pensée ordinaire juxtapose des constats psychologiques, la pensée C2 recourt au balancement corrélatif « Ce n'est pas tant... que... » et au verbe pronominal métaphorique « s'émousser » (perdre son tranchant, sa vivacité).",
      innerMonologueFr: "Dans ma tête, je pense directement : « Ce n'est pas tant la fuite des jours qui nous dépossède, que l'imperceptible silence où s'émousse la mémoire. »"
    },
    {
      id: "pensee_c2_3", cefr: "C2", sceneIcon: "⚖️🔥❄️", category: "Synthèse Dialectique en un Seul Souffle",
      indicesFr: [
        "Thèse : l'être humain aspire de toutes ses forces à l'absolu, à la perfection idéale.",
        "Antithèse : le monde réel est fait d'imprévu, de fragilité et de limites (la contingence).",
        "Synthèse C2 : en une seule respiration syntaxique (« Tout épris d'absolu qu'il soit... »), la lucidité réconcilie l'idéal et le réel sans renoncer à sa grandeur."
      ],
      mentalImageEn: "(Visual cue: holding both the flame of absolute ideals and the fragile crystal of contingent reality in a single balanced breath)",
      promptFr: "Quelle synthèse C2 réunit en un seul souffle deux idées opposées (la quête d'absolu et l'acceptation du réel) ?",
      answer: "Tout épris d'absolu qu'il soit, l'esprit lucide n'en consent pas moins à la contingence du réel, où s'éprouve sa vraie liberté.",
      choices: [
        "Tout épris d'absolu qu'il soit, l'esprit lucide n'en consent pas moins à la contingence du réel, où s'éprouve sa vraie liberté.",
        "Même s'il aime l'absolu, l'esprit lucide accepte quand même le hasard de la réalité pour être libre.",
        "Bien qu'épris d'absolu qu'il est, l'esprit lucide consent néanmoins à la contingence réelle.",
        "Quelque épris d'absolu qu'il serait, l'esprit lucide n'en consent moins à la contingence du réel."
      ],
      trapNote: "Maîtrise suprême du souffle C2 : l'alliance de la concession intensive (« Tout épris d'absolu qu'il soit ») et de la corrélation adversative (« n'en consent pas moins à... ») permet d'embrasser une tension philosophique complète en une unique période fluide.",
      innerMonologueFr: "Dans ma tête, je pense directement : « Tout épris d'absolu qu'il soit, l'esprit lucide n'en consent pas moins à la contingence du réel, où s'éprouve sa vraie liberté. »"
    }
  ];

  function makeAmeStep(c) {
    return {
      k: "ame",
      level: c.cefr,
      ameId: c.id,
      pillar: c.pillar,
      title: c.title,
      place: c.place,
      speaker: c.speaker,
      textbookFr: c.textbookFr,
      nativeFr: c.nativeFr,
      phoneticHint: c.phoneticHint || c.title || "",
      fr: c.nativeFr,
      en: c.en,
      secret: c.secret,
      culturalSecret: c.secret || c.culturalSecret || "",
      q: c.q,
      question: c.q || c.question || "",
      choices: shuffle(c.choices.slice()),
      answer: c.answer,
      why: c.why,
      trapNote: c.why || c.trapNote || "",
      skill: ["speaking", "listening", "vocabulary"]
    };
  }

  function buildAmeSteps(cefr, max = 1) {
    const r = cefrRank(cefr);
    const exact = AME_CASES.filter((c) => cefrRank(c.cefr) === r);
    const near = AME_CASES.filter((c) => Math.abs(cefrRank(c.cefr) - r) <= 1);
    const pool = exact.length >= max ? exact : (near.length ? near : AME_CASES);
    return shuffle(pool).slice(0, max).map(makeAmeStep);
  }

  function makePenseeStep(c) {
    return {
      k: "pensee",
      level: c.cefr,
      penseeId: c.id,
      sceneIcon: c.sceneIcon,
      category: c.category,
      indicesFr: c.indicesFr.slice(),
      mentalImageEn: c.mentalImageEn,
      promptFr: c.promptFr,
      fr: c.answer,
      answer: c.answer,
      choices: shuffle(c.choices.slice()),
      trapNote: c.trapNote,
      whyDirect: c.trapNote || c.whyDirect || "",
      innerMonologueFr: c.innerMonologueFr,
      why: c.trapNote,
      skill: ["vocabulary", "grammar", "reading"]
    };
  }

  function buildPenseeSteps(cefr, max = 1) {
    const r = cefrRank(cefr);
    const exact = PENSEE_CASES.filter((c) => cefrRank(c.cefr) === r);
    const near = PENSEE_CASES.filter((c) => Math.abs(cefrRank(c.cefr) - r) <= 1);
    const pool = exact.length >= max ? exact : (near.length ? near : PENSEE_CASES);
    return shuffle(pool).slice(0, max).map(makePenseeStep);
  }

  function buildAmeSession(startCaseId, filterLv) {
    const lv = filterLv || (currentLevel() === "NATIF" ? "C2" : currentLevel());
    const steps = [{
      k: "intro",
      title: `🇫🇷 L'Âme Française & Pensée Directe · Niveau ${lv}`,
      place: "📍 Codes Sociaux, Humour, Second Degré & Réflexe Mental (A1 → C2)",
      goal: "Devenez un vrai Français : maîtrisez les codes culturels implicites, l'oral authentique et pensez directement en français sans traduire !"
    }];
    let ames = buildAmeSteps(lv, 3);
    if (startCaseId) {
      const targetAme = AME_CASES.find((c) => c.id === startCaseId);
      const targetPensee = PENSEE_CASES.find((c) => c.id === startCaseId);
      if (targetAme) {
        ames = [makeAmeStep(targetAme)].concat(buildAmeSteps(targetAme.cefr, 3).filter((x) => x.ameId !== startCaseId).slice(0, 2));
        steps.push(...ames);
        steps.push(...buildPenseeSteps(targetAme.cefr, 3));
        return steps.filter(Boolean);
      }
      if (targetPensee) {
        const pensees = [makePenseeStep(targetPensee)].concat(buildPenseeSteps(targetPensee.cefr, 3).filter((x) => x.penseeId !== startCaseId).slice(0, 2));
        steps.push(...pensees);
        steps.push(...buildAmeSteps(targetPensee.cefr, 3));
        return steps.filter(Boolean);
      }
    }
    steps.push(...ames);
    steps.push(...buildPenseeSteps(lv, 3));
    return steps.filter(Boolean);
  }

  // ---- Living French Situation, Register & Radio Builders
  function buildQuestSteps(cefr, max = 1, worldTitle = "") {
    const out = []; const r = cefrRank(cefr); const G = GYM();
    const allDists = DISTRICTS() || [];
    const distRank = (d) => {
      const cr = String((d && d.cefrRange) || (d && d.cefr) || "").toUpperCase();
      if (cr.startsWith("A1")) return 0;
      if (cr.startsWith("A2")) return 1;
      if (cr.startsWith("B1")) return 2;
      if (cr.startsWith("B2")) return 3;
      if (cr.startsWith("C1")) return 4;
      if (cr.startsWith("C2")) return 5;
      const id = String((d && d.id) || "");
      if (id.includes("boulangerie") || id.includes("cafe")) return 0;
      if (id.includes("gare") || id.includes("canal") || id.includes("medical")) return 1;
      if (id.includes("marais") || id.includes("immobilier")) return 2;
      if (id.includes("odeon") || id.includes("defense")) return 3;
      if (id.includes("justice") || id.includes("mairie")) return 4;
      return 5;
    };
    const exactDists = allDists.filter((d) => distRank(d) === r);
    const nearDists = allDists.filter((d) => Math.abs(distRank(d) - r) <= 1);
    const dists = shuffle(exactDists.length ? exactDists : (nearDists.length ? nearDists : allDists));
    for (const d of dists) {
      if (out.length >= max) break;
      const st = pick(d.steps || []);
      if (!st || !(st.choices || []).length) continue;
      const opts = shuffle(st.choices.map((ch) => ({
        fr: ch.fr, en: ch.en || "", reg: ch.register || "Courant",
        ok: !!ch.isOptimal, repDelta: ch.reputationDelta || (ch.isOptimal ? 25 : -10),
        why: ch.feedback || ""
      })));
      out.push({
        k: "quest",
        place: `${d.icon || "🏙️"} ${d.name} · ${d.arrondissement}`,
        npcName: (d.npc && d.npc.name) || "Habitant de Paris",
        npcRole: (d.npc && d.npc.role) || d.vibe || "",
        npcAvatar: (d.npc && d.npc.avatar) || d.icon || "🧑",
        targetReg: st.requiredRegister || d.targetRegister || "Courant",
        situation: st.situation || d.vibe || "",
        npc: st.npcLineFr,
        npc_en: st.npcLineEn || "",
        options: opts,
        skill: ["reading", "speaking", "vocabulary"]
      });
    }
    const scs = shuffle((G.scenes || []).filter((s) => cefrRank(s.cefr || "A1") <= r + 1));
    for (const sc of scs) {
      if (out.length >= max) break;
      const t = pick(sc.turns || []);
      if (!t || !(t.options || []).length) continue;
      out.push({
        k: "quest",
        place: `🎭 ${sc.place || sc.title || worldTitle || "Paris"}`,
        npcName: sc.title || "Interlocuteur",
        npcRole: sc.goal || "Scène de vie",
        npcAvatar: "🎭",
        targetReg: r >= 4 ? "Soutenu / Courant" : "Courant",
        situation: sc.goal || "",
        npc: t.npc,
        npc_en: t.npc_en || "",
        options: shuffle((t.options || []).map((o) => ({
          fr: o.fr, en: "", reg: o.ok ? "Naturel ✔" : "Nuance",
          ok: !!o.ok, repDelta: o.ok ? 20 : -10, why: o.why || ""
        }))),
        skill: ["listening", "speaking"]
      });
    }
    return out.slice(0, max);
  }
  function buildRegisterSteps(cefr, max = 1) {
    const G = GYM(); const r = cefrRank(cefr); const out = [];
    const ups = shuffle((C2_RUBRIC().registerUpgrades || []));
    if (r >= 2 && ups.length >= 3) {
      const u = ups[0];
      const others = ups.slice(1, 4).map((x) => x.c2Upgrade.split("/")[0].trim());
      const ans = u.c2Upgrade.split("/")[0].trim();
      out.push({
        k: "register",
        mode: "c2upgrade",
        targetReg: "Soutenu / C2",
        sourceFr: `Connecteur courant : « ${u.basic} »`,
        sourceEn: u.note || `Upgrade « ${u.basic} » to C2 rhetorical style`,
        fr: ans,
        choices: shuffle([ans].concat(others)),
        answer: ans,
        why: `En registre soutenu/C2, « ${u.basic} » s'élève en « ${u.c2Upgrade} » (${u.note || "nuance argumentative"}).`,
        sayAnswer: true,
        skill: ["grammar", "writing"]
      });
    }
    const sp = shuffle((G.spoken || []).filter((s) => s && s.spoken && s.standard && !/‿/.test(s.spoken + s.standard) && normLoose(s.spoken) !== normLoose(s.standard)));
    if (sp.length >= 3 && out.length < max) {
      const s = sp[0];
      const toStd = Math.random() < 0.5;
      const others = sp.slice(1).filter((x) => normLoose(toStd ? x.standard : x.spoken) !== normLoose(toStd ? s.standard : s.spoken)).slice(0, 2).map((x) => toStd ? x.standard : x.spoken);
      const ans = toStd ? s.standard : s.spoken;
      out.push({
        k: "register",
        mode: toStd ? "spoken2std" : "std2spoken",
        targetReg: toStd ? "Courant / Standard" : "Familier / Oral",
        sourceFr: toStd ? s.spoken : s.standard,
        sourceEn: s.en || "",
        fr: ans,
        choices: shuffle([ans].concat(others)),
        answer: ans,
        why: `« ${s.spoken} » (oral) ⇄ « ${s.standard} » (standard) — ${s.en || ""}`,
        sayAnswer: true,
        skill: ["grammar", "listening"]
      });
    }
    return out.slice(0, max);
  }
  function buildRadioSteps(cefr, max = 1) {
    const G = GYM(); const r = cefrRank(cefr); const out = [];
    const cult = shuffle((G.culture || []).filter((c) => c && c.q && c.answer && Array.isArray(c.choices) && c.choices.length >= 3));
    const shows = (RADIO() || []).filter((sh) => cefrRank(sh.level || "B1") <= r + 1);
    const sh = pick(shows) || (RADIO() || [])[0];
    const ep = sh && pick(sh.episodes || []);
    if (cult.length) {
      const c = cult[0];
      out.push({
        k: "radio",
        showName: sh ? `📻 ${sh.name} (${sh.level})` : "📻 Radio Lumière Paris",
        epTitle: "Flash Culture & Société Française",
        fr: `${c.q} ${c.fact || ""}`,
        summaryFr: `${c.q}${c.en ? " — (" + c.en + ")" : ""}`,
        q: c.q,
        q_en: c.en || "",
        choices: shuffle(c.choices.slice()),
        answer: c.answer,
        why: c.fact || (c.en ? `${c.en} → « ${c.answer} »` : ""),
        sayAnswer: true,
        skill: ["listening", "reading"]
      });
    }
    const defs = shuffle((G.definitions || []).filter((d) => d && d.word && d.def && cefrRank(d.cefr || "A1") <= r + 1));
    if (defs.length >= 4 && out.length < max) {
      const d = defs[0]; const others = defs.slice(1).filter((x) => normLoose(x.word) !== normLoose(d.word)).slice(0, 3).map((x) => x.word);
      out.push({
        k: "radio",
        showName: "📻 Le Mot du Jour · Académie",
        epTitle: "Définition en français authentique",
        fr: d.def,
        summaryFr: `Indice : niveau ${d.cefr || cefr}`,
        q: `« ${d.def} » — Quel est ce mot ?`,
        q_en: d.en ? `Meaning: ${d.en}` : "",
        choices: shuffle([d.word].concat(others)),
        answer: d.word,
        why: `« ${d.word} » (${d.en || ""}) : ${d.def}`,
        sayAnswer: true,
        skill: ["listening", "vocabulary"]
      });
    }
    return out.slice(0, max);
  }
  function nativeSteps(cefr, max) {
    const r = cefrRank(cefr);
    const bucketA = shuffle([
      ...buildAmeSteps(cefr, 1),
      ...buildPenseeSteps(cefr, 1),
      ...buildQuestSteps(cefr, 1),
      ...buildVisReflexSteps(cefr, 1)
    ]);
    const bucketB = shuffle([
      ...buildForgeronSteps(cefr, 1),
      ...buildLiaisonSteps(cefr, 1),
      ...buildSwipeSteps(cefr, 1),
      ...(r >= 1 ? buildConcordanceSteps(cefr, 1) : []),
      ...(r >= 2 ? buildPeriodeSteps(cefr, 1) : [])
    ]);
    const bucketC = shuffle([
      ...buildRadioSteps(cefr, 1),
      ...buildRegisterSteps(cefr, 1),
      ...(r >= 1 ? buildIdiomeSteps(cefr, 1) : []),
      ...(r >= 2 ? buildEnqueteSteps(cefr, 1) : []),
      ...(r >= 2 ? buildJouteSteps(cefr, 1) : []),
      ...(r >= 3 ? buildSyntheseSteps(cefr, 1) : [])
    ]);
    const out = [];
    if (bucketA[0]) out.push(bucketA[0]);
    if (bucketB[0]) out.push(bucketB[0]);
    if (bucketC[0]) out.push(bucketC[0]);
    const rest = shuffle(bucketA.slice(1).concat(bucketB.slice(1), bucketC.slice(1)));
    while (out.length < (max || 3) && rest.length) out.push(rest.shift());
    return out.slice(0, max || 3);
  }
  function buildExploreSteps(sceneIdOrCefr) {
    const scenes = Array.isArray(window.VISUAL_SCENES) ? window.VISUAL_SCENES : [];
    if (!scenes.length) return [];
    let sc = scenes.find((s) => s.id === sceneIdOrCefr);
    if (!sc && CEFR.includes(sceneIdOrCefr)) {
      const exact = scenes.filter((s) => s.cefr === sceneIdOrCefr);
      sc = exact.length ? pick(exact) : scenes[0];
    }
    if (!sc) sc = scenes[0];
    const hunts = shuffle((sc.hotspots || []).slice()).slice(0, 2);
    return [{
      k: "explore",
      sceneId: sc.id,
      level: sc.cefr,
      title: sc.title,
      place: sc.place,
      bg: sc.bg,
      npc: sc.npc,
      npcName: sc.npcName,
      introFr: sc.introFr,
      hotspots: sc.hotspots,
      hunts: hunts.map((h) => h.id),
      skill: ["listening", "vocabulary"]
    }];
  }
  function buildExploreSession(sceneIdOrCefr) {
    const scList = Array.isArray(window.VISUAL_SCENES) ? window.VISUAL_SCENES : [];
    const exact = scList.find((s) => s.id === sceneIdOrCefr) || scList.find((s) => s.cefr === sceneIdOrCefr) || scList[0];
    if (!exact) return [];
    const steps = buildExploreSteps(exact.id);
    const vis = buildVisReflexSteps(exact.cefr, 2);
    steps.push(...vis);
    return steps;
  }
  function buildVisReflexSteps(cefr, max = 2) {
    const pool = Array.isArray(window.VISREFLEX_POOL) ? window.VISREFLEX_POOL : [];
    const scenes = Array.isArray(window.VISUAL_SCENES) ? window.VISUAL_SCENES : [];
    if (pool.length < 4 || scenes.length < 4) return [];
    const r = cefrRank(cefr);
    const exact = pool.filter((x) => cefrRank(x.cefr) === r);
    const near = pool.filter((x) => Math.abs(cefrRank(x.cefr) - r) <= 1);
    const chosen = shuffle(exact.length >= max ? exact : (near.length >= max ? near : pool)).slice(0, max);
    return chosen.map((item) => {
      const others = shuffle(pool.filter((x) => x.sceneId !== item.sceneId)).slice(0, 3);
      const opts = shuffle([item].concat(others)).map((x) => {
        const sc = scenes.find((s) => s.id === x.sceneId) || scenes[0];
        return { sceneId: x.sceneId, labelFr: x.labelFr, bg: sc.bg, ok: x.sceneId === item.sceneId };
      });
      return {
        k: "visreflex",
        level: item.cefr,
        sceneId: item.sceneId,
        fr: item.fr,
        answer: item.labelFr,
        options: opts,
        skill: ["listening", "vocabulary"]
      };
    });
  }
  function buildSwipeSteps(cefr, max = 2) {
    const decks = window.SWIPE_DECKS || {};
    const lv = CEFR.includes(cefr) ? cefr : "A1";
    const deck = decks[lv] || decks.A1;
    if (!deck || !(deck.cards || []).length) return [];
    return shuffle(deck.cards).slice(0, max).map((card) => ({
      k: "swipe",
      level: lv,
      deckTitle: deck.title,
      leftLabel: deck.leftLabel,
      rightLabel: deck.rightLabel,
      prompt: card.prompt,
      sub: card.sub,
      side: card.side,
      fr: card.answerFr,
      answer: card.answerFr,
      why: card.why,
      skill: ["grammar", "vocabulary"]
    }));
  }
  function buildSwipeSession(cefr) {
    const lv = CEFR.includes(cefr) ? cefr : (currentLevel() === "NATIF" ? "C2" : currentLevel());
    const decks = window.SWIPE_DECKS || {};
    const deck = decks[lv] || decks.A1;
    if (!deck) return [];
    const steps = [{ k: "intro", title: deck.title, place: `⚡ Arcade Tactile · Niveau ${lv}`, goal: "Glissez à Gauche (⬅️) ou à Droite (➡️) — ou utilisez les flèches du clavier Logitech !" }];
    steps.push(...buildSwipeSteps(lv, Math.min(6, deck.cards.length)));
    return steps;
  }

  // ---- regular stage
  function buildStageSession(n) {
    const cards = stageCards(n);
    const pool = unitPool(n).length > 8 ? unitPool(n) : cards.concat(cleanCards(DATA.flashcards || []).slice(0, 200));
    const lesson = TL[n.stage.stageId];
    const cefr = n.cefr;
    let steps = [];
    if (lesson) {
      steps.push({ k: "intro", title: lesson.title, goal: lesson.goal, place: n.world ? `📍 Monde ${n.world.number} · ${n.world.title}` : "" });
      lesson.turns.forEach((t) => {
        if (t.t === "say") steps.push(...teachSteps(t.text));
        else if (t.t === "tip") steps.push(...teachSteps(t.text, { tip: true }));
        else if (t.t === "example") steps.push({ k: "example", fr: t.fr, en: t.en, note: t.note || "" });
        else if (t.t === "ask") steps.push({ k: "mcq", qHtml: rich(t.q), choices: shuffle(t.choices), answer: t.answer, right: t.right, wrong: t.wrong, skill: ["grammar", "reading"] });
        else if (t.t === "type") steps.push({ k: "type", qHtml: rich(t.q), answer: t.answer, accept: [t.answer].concat(t.accept || []), hint: t.hint, right: t.right, wrong: t.wrong, skill: ["writing", "grammar"] });
        else if (t.t === "speak") steps.push({ k: "speak", fr: t.fr, en: "", lead: t.text, skill: ["speaking", "pronunciation"] });
      });
      const f = shuffle(cards.filter((c) => words(c.fr).length <= 10)).slice(0, 6);
      const prac = [];
      const m = matchStep(f.length >= 4 ? f : cards); if (m) prac.push(m);
      if (f[0]) prac.push(cardStep("shadow", f[0], pool, cefr) || cardStep("listen", f[0], pool, cefr));
      if (f[1]) prac.push(cardStep("memory", f[1], pool, cefr) || cardStep("build", f[1], pool, cefr));
      if (f[2]) prac.push(cardStep("reflex", f[2], pool, cefr) || cardStep("dictee", f[2], pool, cefr));
      if (f[3]) prac.push(cardStep("type", f[3], pool, cefr) || cardStep("speak", f[3], pool, cefr));
      const sim = buildSimTurnFromCards(f.concat(cards), n.world && n.world.title);
      if (sim) prac.push(sim);
      steps.push({ k: "banner", text: "Situation Vivante à Paris", sub: "Use your French in real decisions, registers & live speech" });
      steps.push(...prac.filter(Boolean));
      steps.push(...nativeSteps(cefr, 3));
      const weak = cleanCards(reviewCards()).slice(0, 1);
      if (weak[0]) steps.push(cardStep("memory", weak[0], pool, cefr) || cardStep("en2fr", weak[0], pool, cefr));
      return steps.filter(Boolean);
    }
    if (n.kind === "exercise") return buildDialogueStage(n, cards, pool);
    // auto session from phrases (active brain-wiring loop + Parisian situation)
    const focus = focusCards(n, cards, cefrRank(cefr) <= 1 ? 7 : 6);
    steps.push({ k: "intro", title: n.title, goal: `${focus.length} key expressions · explore the scene, react in context & speak`, place: n.world ? `📍 Monde ${n.world.number} · ${n.world.title}` : "" });
    const kinds = ["shadow", "memory", "speak", "reflex", "build", "type", "listen", "dictee"];
    focus.forEach((c, i) => {
      steps.push(cardStep("example", c, pool, cefr));
      if (i % 2 === 1) {
        steps.push(cardStep(kinds[(i - 1) % kinds.length], focus[i - 1], pool, cefr) || cardStep("listen", focus[i - 1], pool, cefr));
        steps.push(cardStep(kinds[i % kinds.length], c, pool, cefr) || cardStep("en2fr", c, pool, cefr));
      }
    });
    if (focus.length % 2 === 1) steps.push(cardStep("reflex", focus[focus.length - 1], pool, cefr) || cardStep("fr2en", focus[focus.length - 1], pool, cefr));
    steps.push({ k: "banner", text: "Situation Vivante & Registres", sub: "Decisions, style-shifting & live reply in Paris" });
    const m = matchStep(shuffle(focus)); if (m) steps.push(m);
    steps.push(...drillSteps(n.stage, 2));
    shuffle(focus).slice(0, 3).forEach((c, i) => steps.push(cardStep(["memory", "reflex", "shadow"][i], c, pool, cefr) || cardStep("build", c, pool, cefr) || cardStep("en2fr", c, pool, cefr)));
    steps.push(...nativeSteps(cefr, 3));
    const sim = buildSimTurnFromCards(focus.concat(cards), n.world && n.world.title);
    if (sim) steps.push(sim);
    const weak = cleanCards(reviewCards()).slice(0, 1);
    if (weak[0]) steps.push(cardStep("type", weak[0], pool, cefr) || cardStep("en2fr", weak[0], pool, cefr));
    return steps.filter(Boolean);
  }
  function buildDialogueStage(n, cards, pool) {
    const lines = cards.slice(0, 8);
    const steps = [{ k: "intro", title: n.title, goal: "Mirror the rhythm, burn the turns into memory, then improvise.", place: n.world ? `📍 ${n.world.title}` : "" }];
    lines.forEach((c) => steps.push({ k: "example", fr: c.fr, en: c.en, dialogue: true }));
    steps.push({ k: "banner", text: "À toi !", sub: "Shadow & react in real time" });
    const realDlg = /^dialogue/i.test(n.title || "");
    const okLine = (c) => /[.?!]$/.test(c.fr.trim()) && words(c.fr).length >= 4;
    for (let i = 0; realDlg && i + 1 < lines.length && i < 6; i += 2) {
      if (!okLine(lines[i]) || !okLine(lines[i + 1])) continue;
      const others = shuffle(lines.filter((x, j) => j !== i + 1 && j !== i)).slice(0, 2).map((x) => x.fr);
      if (others.length < 2) break;
      steps.push({ k: "reflex", prompt: "next", big: lines[i].fr, fr: lines[i].fr, choices: shuffle([lines[i + 1].fr].concat(others)), answer: lines[i + 1].fr, sayAnswer: true, timeLimit: 7000, skill: ["listening", "speaking"] });
    }
    steps.push(...drillSteps(n.stage, 2));
    const linePool = lines.concat(pool);
    lines.forEach((c, i) => {
      const k = ["shadow", "memory", "dictee", "reflex", "type"][i % 5];
      steps.push(cardStep(k, c, linePool, n.cefr) || cardStep("listen", c, linePool, n.cefr) || cardStep("fr2en", c, linePool, n.cefr));
    });
    steps.push(...buildQuestSteps(n.cefr, 1, n.title));
    const sim = buildSimTurnFromCards(lines, n.world && n.world.title);
    if (sim) steps.push(sim);
    return steps.filter(Boolean);
  }
  const GRADED_KINDS = new Set(["mcq", "listen", "build", "type", "dictee", "speak", "match", "dialogue", "shadow", "memory", "reflex", "simturn", "quest", "register", "radio", "enquete", "liaison", "forgeron", "joute", "idiome", "synthese", "periode", "concordance", "ame", "pensee", "explore", "visreflex", "swipe"]);
  function topUp(steps, pool, cefr, min) {
    let g = steps.filter((s) => s && GRADED_KINDS.has(s.k)).length;
    if (g >= min) return steps;
    const used = new Set(steps.filter((s) => s && s.card).map((s) => normLoose(s.card.fr)));
    const kinds = ["memory", "reflex", "shadow", "build", "type", "dictee"];
    let ki = 0;
    for (const c of shuffle(pool)) {
      if (g >= min) break;
      if (used.has(normLoose(c.fr))) continue;
      const st = cardStep(kinds[ki++ % kinds.length], c, pool, cefr) || cardStep("fr2en", c, pool, cefr);
      if (st) { steps.push(st); used.add(normLoose(c.fr)); g += 1; }
    }
    return steps;
  }
  // ---- boss: 3 hearts, production, register decisions & speed reflex
  function buildBossSession(n) {
    const pool = unitPool(n);
    const cards = shuffle(pool.filter((c) => words(c.fr).length <= 12));
    const steps = [{ k: "intro", title: n.title, goal: "3 hearts. Parisian decisions, idioms & subtext, syntactic periods, mood concordance, stylistic sleuthing, verb forging & live reply.", boss: true, place: n.world ? `⚔️ Gardien · ${n.world.title}` : "" }];
    const kinds = ["reflex", "memory", "shadow", "dictee", "build", "type", "reflex", "memory", "speak", "dictee"];
    let ci = 0;
    kinds.forEach((k) => { let s = null; while (!s && ci < cards.length) s = cardStep(k, cards[ci++], pool, n.cefr); if (s) steps.push(s); });
    const m = matchStep(cards.slice(ci, ci + 5)); if (m) steps.splice(4, 0, m);
    const bossRk = cefrRank(n.cefr);
    steps.push(...buildAmeSteps(n.cefr, 1));
    steps.push(...buildPenseeSteps(n.cefr, 1));
    steps.push(...buildQuestSteps(n.cefr, 1, n.title));
    steps.push(...buildVisReflexSteps(n.cefr, 1));
    steps.push(...buildSwipeSteps(n.cefr, 1));
    steps.push(...buildForgeronSteps(n.cefr, 1));
    if (bossRk >= 1) steps.push(...buildIdiomeSteps(n.cefr, 1));
    if (bossRk >= 1) steps.push(...buildConcordanceSteps(n.cefr, 1));
    if (bossRk >= 2) steps.push(...buildPeriodeSteps(n.cefr, 1));
    if (bossRk >= 2) steps.push(...buildEnqueteSteps(n.cefr, 1));
    if (bossRk >= 2) steps.push(...buildJouteSteps(n.cefr, 1));
    if (bossRk >= 1) steps.push(...buildRegisterSteps(n.cefr, 1));
    const sim = buildSimTurnFromCards(cards, n.world && n.world.title);
    if (sim) steps.push(sim);
    return steps.filter(Boolean);
  }
  // ---- Parisian District Quest (3-Register Living Adventure)
  function buildDistrictSession(n) {
    const d = (n && n.data) || (DISTRICTS() || [])[0];
    if (!d) return null;
    const steps = [{
      k: "intro",
      title: `${d.icon || "🏙️"} ${d.name}`,
      place: `${d.arrondissement} · Registre cible : ${d.targetRegister || "Courant"}`,
      goal: `${d.vibe || ""} Avec ${d.npc ? d.npc.name + " (" + d.npc.role + ")" : "les habitants"}.`
    }];
    (d.steps || []).forEach((st) => {
      steps.push({
        k: "quest",
        place: `${d.icon || "🏙️"} ${d.name} · ${d.arrondissement}`,
        npcName: (d.npc && d.npc.name) || "Interlocuteur",
        npcRole: (d.npc && d.npc.role) || "",
        npcAvatar: (d.npc && d.npc.avatar) || d.icon || "🧑",
        targetReg: st.requiredRegister || d.targetRegister || "Courant",
        situation: st.situation || "",
        npc: st.npcLineFr,
        npc_en: st.npcLineEn || "",
        options: shuffle((st.choices || []).map((ch) => ({
          fr: ch.fr, en: ch.en || "", reg: ch.register || "Courant",
          ok: !!ch.isOptimal, repDelta: ch.reputationDelta || (ch.isOptimal ? 25 : -10),
          why: ch.feedback || ""
        }))),
        skill: ["reading", "speaking", "vocabulary"]
      });
    });
    steps.push(...buildAmeSteps(n.cefr || "B1", 1));
    steps.push(...buildPenseeSteps(n.cefr || "B1", 1));
    steps.push(...buildIdiomeSteps(n.cefr || "B1", 1));
    steps.push(...buildRegisterSteps(n.cefr || "B1", 2));
    steps.push(...buildRadioSteps(n.cefr || "B1", 1));
    const lastStep = (d.steps || [])[(d.steps || []).length - 1];
    const optChoice = lastStep && (lastStep.choices || []).find((c) => c.isOptimal);
    if (optChoice) {
      const kw = words(optChoice.fr).map((w) => w.replace(/[.,!?;:«»"()]/g, "")).filter((w) => w.length >= 3).slice(0, 3);
      steps.push({
        k: "simturn",
        place: `${d.icon || "🏙️"} ${d.name}`,
        npc: lastStep.npcLineFr,
        npc_en: lastStep.npcLineEn || "",
        keywords: kw.length ? kw : ["bonjour"],
        model_fr: optChoice.fr,
        skill: ["speaking", "writing"]
      });
    }
    return steps.filter(Boolean);
  }
  // ---- C2 Rhetoric & Writing Atelier
  function buildAtelierSession(n) {
    const m = (n && n.data) || (WRITINGS() || [])[0];
    if (!m) return null;
    const steps = [{
      k: "intro",
      title: `✒️ ${m.title}`,
      place: `📍 ${m.location || "Paris"} · ${m.category || m.cefr}`,
      goal: m.context || "Forge high-register sentence structures, then compose your French text."
    }];
    steps.push(...buildRegisterSteps(m.cefr || "C1", 1));
    (m.sentenceBuilders || []).forEach((sb) => {
      if (Array.isArray(sb.tiles) && sb.tiles.length >= 2) {
        steps.push({
          k: "build",
          en: `${sb.goal ? "[" + sb.goal + "] " : ""}${sb.en}`,
          fr: sb.fr,
          answer: sb.tiles.slice(),
          tiles: shuffle(sb.tiles.slice()),
          _picked: [],
          why: sb.goal ? `Objectif rhétorique : ${sb.goal}` : "",
          skill: ["writing", "grammar"]
        });
      }
      if (sb.fr && words(sb.fr).length <= 12) {
        steps.push({
          k: "memory",
          fr: sb.fr,
          en: sb.en,
          answer: sb.fr,
          accept: variantsOf(sb.fr),
          chunks: rhythmChunks(sb.fr),
          why: sb.goal || "",
          skill: ["writing", "vocabulary"]
        });
      }
    });
    if (cefrRank(m.cefr || "B2") >= 2) steps.push(...buildSyntheseSteps(m.cefr || "C1", 1));
    steps.push(...buildPeriodeSteps(m.cefr || "C1", 1));
    steps.push(...buildConcordanceSteps(m.cefr || "C1", 1));
    steps.push(...buildEnqueteSteps(m.cefr || "C1", 1));
    steps.push(...buildRegisterSteps(m.cefr || "C1", 1));
    steps.push({
      k: "write",
      atelierId: m.id,
      level: m.cefr || "B2",
      task_type: m.category || "Atelier Rhétorique",
      prompt_fr: m.prompt,
      prompt_en: m.context || "",
      must_use: (m.requiredKeywords || []).map((k) => `${k.fr} (${k.en})`),
      builders: (m.sentenceBuilders || []).map((sb) => ({ fr: sb.fr, en: sb.goal || sb.en || "" })),
      starter_fr: (m.sentenceBuilders && m.sentenceBuilders[0] && m.sentenceBuilders[0].tiles && m.sentenceBuilders[0].tiles[0]) || "",
      model_fr: m.nativeModelText && m.nativeModelText.fr,
      model_en: m.nativeModelText && m.nativeModelText.en,
      minWords: cefrRank(m.cefr || "B2") >= 4 ? 45 : 25,
      skill: ["writing", "grammar"]
    });
    return steps.filter(Boolean);
  }
  function buildSleuthForgeSession() {
    const lv = currentLevel() === "NATIF" ? "C2" : currentLevel();
    const steps = [{
      k: "intro",
      title: "🕵️ Enquête Stylistique, Forge des Verbes & Prosodie C2",
      place: "📍 La Sorbonne & Galerie Vivienne",
      goal: "Débusquez les pièges grammaticaux dans les manuscrits, forgez les temps littéraires et maîtrisez les liaisons."
    }];
    steps.push(...buildEnqueteSteps(lv, 3));
    steps.push(...buildForgeronSteps(lv, 3));
    steps.push(...buildConcordanceSteps(lv, 2));
    steps.push(...buildLiaisonSteps(lv, 2));
    steps.push(...buildRegisterSteps(lv, 1));
    return steps.filter(Boolean);
  }
  function buildPeriodeSession(startCaseId) {
    const lv = currentLevel() === "NATIF" ? "C2" : currentLevel();
    const steps = [{
      k: "intro",
      title: "✒️ L'Architecte de la Phrase & Le Tribunal des Modes (A1 → C2)",
      place: "📍 Amphithéâtre Richelieu, Cour d'Appel & Sous la Coupole",
      goal: "Tissez les 4 propositions de la grande période oratoire française dans l'ordre syntaxique exact et tranchez entre Indicatif et Subjonctif."
    }];
    let periodes = buildPeriodeSteps(lv, 3);
    if (startCaseId) {
      const target = PERIODE_CASES.find((c) => c.id === startCaseId);
      if (target) {
        const firstStep = makePeriodeStep(target);
        periodes = [firstStep].concat(periodes.filter((x) => x.periodeId !== startCaseId).slice(0, 2));
      }
    }
    steps.push(...periodes);
    steps.push(...buildConcordanceSteps(lv, 3));
    steps.push(...buildSyntheseSteps(lv, 1));
    return steps.filter(Boolean);
  }
  function buildJouteSession() {
    const lv = currentLevel() === "NATIF" ? "C2" : (cefrRank(currentLevel()) < 1 ? "A2" : currentLevel());
    const steps = [{
      k: "intro",
      title: "⚖️ La Joute Oratoire Contradictoire & Synthèse C2",
      place: "📍 Sous la Coupole & Palais de Justice",
      goal: "Affrontez les thèses adverses en 3 mouvements (Concession → Réfutation → Synthèse) et croisez les sources."
    }];
    steps.push(...buildJouteSteps(lv, 2));
    steps.push(...buildSyntheseSteps(lv, 2));
    steps.push(...buildRegisterSteps(lv, 1));
    steps.push(...buildEnqueteSteps(lv, 1));
    return steps.filter(Boolean);
  }
  function buildIdiomeSession(startCaseId) {
    const lv = currentLevel() === "NATIF" ? "C2" : currentLevel();
    const steps = [{
      k: "intro",
      title: "🎭 L'Atelier des Idiomes, Litotes & Sous-Entendus (A1 → C2)",
      place: "📍 Café de Flore, Quai d'Orsay & Académie Française",
      goal: "Décodez le sens implicite des expressions figurées, proverbes, antiphrases ironiques et litotes diplomatiques."
    }];
    let idiomes = buildIdiomeSteps(lv, 4);
    if (startCaseId) {
      const target = IDIOME_CASES.find((c) => c.id === startCaseId);
      if (target) {
        const firstStep = {
          k: "idiome", level: target.cefr, idiomeId: target.id, category: target.category,
          place: target.place, speaker: target.speaker, idiomFr: target.idiomFr, literalEn: target.literalEn,
          fr: target.contextFr, contextFr: target.contextFr, contextEn: target.contextEn,
          q: target.q, choices: shuffle(target.choices.slice()), answer: target.answer,
          reparteeFr: target.reparteeFr, why: target.why, skill: ["vocabulary", "reading", "listening"]
        };
        idiomes = [firstStep].concat(idiomes.filter((x) => x.idiomeId !== startCaseId).slice(0, 3));
      }
    }
    steps.push(...idiomes);
    steps.push(...buildRegisterSteps(lv, 2));
    steps.push(...buildSyntheseSteps(lv, 1));
    return steps.filter(Boolean);
  }
  // ---- Adaptive Weak-Spot Session (targets lowest of the 7 competencies + mistakeVault)
  function buildWeakSpotSession(targetSkill) {
    const sk = CH().skills || {};
    let chosen = targetSkill;
    if (!chosen) {
      const sorted = ALL_SKILLS.slice().sort((a, b) => {
        const xa = sk[a.k] || { n: 0, ok: 0, ema: 0.4 };
        const xb = sk[b.k] || { n: 0, ok: 0, ema: 0.4 };
        const scoreA = xa.n ? xa.ema : 0.35;
        const scoreB = xb.n ? xb.ema : 0.35;
        return scoreA - scoreB;
      });
      chosen = sorted[0].k;
    }
    const meta = ALL_SKILLS.find((x) => x.k === chosen) || ALL_SKILLS[0];
    const { lv, pool } = activeArcCards();
    const rev = cleanCards(reviewCards());
    const cards = rev.concat(shuffle(pool)).slice(0, 10);
    const steps = [{
      k: "intro",
      title: `🎯 Entraînement Ciblé · ${meta.label}`,
      place: "📍 Atelier de Consolidation",
      goal: `Focused mastery session strengthening ${meta.label} and clearing recent weak spots.`
    }];
    const kindMap = {
      listening: ["listen", "dictee", "shadow"],
      speaking: ["shadow", "speak"],
      pronunciation: ["shadow", "speak", "listen"],
      reading: ["fr2en", "reflex"],
      vocabulary: ["memory", "en2fr", "reflex"],
      writing: ["build", "type", "memory", "dictee"],
      grammar: ["build", "type", "memory"]
    };
    const kinds = kindMap[chosen] || ["memory", "reflex", "shadow", "type"];
    cards.slice(0, 5).forEach((c, i) => {
      const st = cardStep(kinds[i % kinds.length], c, pool, lv) || cardStep("memory", c, pool, lv) || cardStep("fr2en", c, pool, lv);
      if (st) steps.push(st);
    });
    const wsRk = cefrRank(lv);
    if (chosen === "pronunciation") steps.push(...buildLiaisonSteps(lv, 2));
    if (chosen === "listening" || chosen === "reading") {
      steps.push(...buildVisReflexSteps(lv, 1));
      steps.push(...buildRadioSteps(lv, 1));
      if (wsRk >= 2) steps.push(...buildSyntheseSteps(lv, 1));
      if (wsRk >= 1) steps.push(...buildIdiomeSteps(lv, 1));
    }
    if (chosen === "grammar" || chosen === "writing" || chosen === "reading") {
      steps.push(...buildSwipeSteps(lv, 2));
      steps.push(...buildForgeronSteps(lv, 2));
      if (wsRk >= 1) steps.push(...buildConcordanceSteps(lv, 1));
      if (wsRk >= 2) steps.push(...buildPeriodeSteps(lv, 1));
      if (wsRk >= 2) steps.push(...buildEnqueteSteps(lv, 1));
      if (wsRk >= 2) steps.push(...buildJouteSteps(lv, 1));
      if (wsRk >= 1) steps.push(...buildRegisterSteps(lv, 1));
    }
    if (chosen === "speaking" || chosen === "vocabulary") {
      steps.push(...buildAmeSteps(lv, 2));
      steps.push(...buildPenseeSteps(lv, 2));
      steps.push(...buildQuestSteps(lv, 1));
      if (wsRk >= 1) steps.push(...buildIdiomeSteps(lv, 1));
      if (wsRk >= 2) steps.push(...buildJouteSteps(lv, 1));
    }
    const sim = buildSimTurnFromCards(cards, meta.label);
    if (sim) steps.push(sim);
    return steps.filter(Boolean);
  }
  // ---- bootcamp (unit 0)
  function buildBootSession(n) {
    const b = n.data; const ph = cleanCards(b.phrases || []);
    const steps = [{ k: "intro", title: b.title, goal: b.why || "" }];
    (b.teach || []).forEach((t) => steps.push({ k: "teach", parts: [t], autoFr: true }));
    ph.forEach((c, i) => { steps.push({ k: "example", fr: c.fr, en: c.en }); if (i % 2 === 1) steps.push(cardStep("listen", ph[i - 1], ph, "A1")); });
    const m = matchStep(ph); if (m) steps.push(m);
    if (ph[0]) steps.push(cardStep("speak", ph[0], ph, "A1"));
    if (ph[1]) steps.push(cardStep("build", ph[1], ph, "A1") || cardStep("fr2en", ph[1], ph, "A1"));
    if (ph[2]) steps.push(cardStep("listen", ph[2], ph, "A1"));
    return steps.filter(Boolean);
  }
  // ---- role-play scene
  function buildSceneSession(n) {
    const sc = n.data; const steps = [{ k: "intro", title: sc.title, goal: sc.goal || "", place: sc.place }];
    (sc.turns || []).forEach((t) => steps.push({ k: "dialogue", npc: t.npc, npc_en: t.npc_en, options: shuffle(t.options || []), place: sc.place, skill: "listening" }));
    const best = (sc.turns || []).map((t) => (t.options || []).find((o) => o.ok)).filter(Boolean);
    if (best.length) {
      const lastT = (sc.turns || [])[Math.max(0, (sc.turns || []).length - 1)];
      const b = best[best.length - 1];
      const kw = words(b.fr).map((w) => w.replace(/[.,!?;:«»"()]/g, "")).filter((w) => w.length >= 3).slice(0, 3);
      steps.push({ k: "simturn", place: sc.place || sc.title, npc: lastT ? lastT.npc : "À votre tour !", npc_en: b.fr ? `Improvise your own French reply (e.g. “${b.fr}”)` : "", keywords: kw.length ? kw : [words(b.fr)[0]], model_fr: b.fr, skill: "speaking" });
    }
    return steps;
  }
  // ---- Brain-Wire Arcade modes (Blitz Réflexe, Studio Shadowing, Improv à Paris)
  function activeArcCards(targetLv) {
    const lv = CEFR.includes(targetLv) ? targetLv : (currentLevel() === "NATIF" ? "C2" : currentLevel());
    const rk = cefrRank(lv);
    const exactWorlds = WORLDS.filter((w) => cefrRank(w.cefr) === rk);
    const prevWorlds = rk > 0 ? WORLDS.filter((w) => cefrRank(w.cefr) === rk - 1) : [];
    const exactCards = shuffle(cleanCards(exactWorlds.flatMap((w) => (w.stages || []).flatMap((s) => s.cards || []))));
    const spiralCards = shuffle(cleanCards(prevWorlds.flatMap((w) => (w.stages || []).flatMap((s) => s.cards || [])))).slice(0, 40);
    const pool = exactCards.slice(0, 260).concat(spiralCards);
    return { lv, pool: pool.length ? pool : cleanCards((DATA.flashcards || []).slice(0, 120)) };
  }
  function buildBlitzSession() {
    const { lv, pool } = activeArcCards();
    const picked = shuffle(pool).slice(0, 12);
    const steps = [{ k: "intro", title: "⚡ Blitz Réflexe", goal: "Strike within 3 seconds — zero English translation in your head!" }];
    picked.forEach((c, i) => {
      const st = cardStep(i % 3 === 2 ? "memory" : "reflex", c, pool, lv) || cardStep("reflex", c, pool, lv);
      if (st) steps.push(st);
    });
    return steps.length > 2 ? steps : null;
  }
  function buildShadowSession() {
    const { lv, pool } = activeArcCards();
    const picked = shuffle(pool.filter((c) => c.prod && words(c.fr).length >= 3 && words(c.fr).length <= 12)).slice(0, 10);
    const steps = [{ k: "intro", title: "🎙️ Studio Shadowing", goal: "Hear the melody, shadow the breath chunks aloud, then lock the rhythm." }];
    picked.forEach((c) => {
      const st = cardStep("shadow", c, pool, lv);
      if (st) steps.push(st);
    });
    return steps.length > 2 ? steps : null;
  }
  function buildImprovSession() {
    const G = GYM();
    const lv = currentLevel() === "NATIF" ? "C2" : currentLevel();
    const rk = cefrRank(lv);
    const scs = shuffle((G.scenes || []).filter((s) => cefrRank(s.cefr || "A1") <= rk + 1)).slice(0, 5);
    const steps = [{ k: "intro", title: "🎭 Improv à Paris", goal: "No multiple choice — speak or write your real French reply in Parisian scenes." }];
    scs.forEach((sc) => {
      const turns = sc.turns || [];
      turns.slice(0, 2).forEach((t) => {
        const best = (t.options || []).find((o) => o.ok);
        if (!best) return;
        const kw = words(best.fr).map((w) => w.replace(/[.,!?;:«»"()]/g, "")).filter((w) => w.length >= 3).slice(0, 3);
        steps.push({ k: "simturn", place: sc.place || sc.title, npc: t.npc, npc_en: t.npc_en || "", keywords: kw.length ? kw : [words(best.fr)[0]], model_fr: best.fr, skill: "speaking" });
      });
    });
    if (steps.length < 4) {
      const { pool } = activeArcCards();
      shuffle(pool).slice(0, 5).forEach((c) => { const s = buildSimTurnFromCards([c], "Paris"); if (s) steps.push(s); });
    }
    return steps.length > 2 ? steps : null;
  }
  // ---- reading
  function buildReadSession(n) {
    const r = n.data; const steps = [{ k: "reading", title: r.title, genre: r.genre, text: r.text, glossary: r.glossary || [] }];
    (r.questions || []).forEach((q) => steps.push({ k: "mcq", qHtml: esc(q.q), choices: shuffle(q.choices), answer: q.answer, why: q.why, passage: r, skill: "reading" }));
    const sents = String(r.text || "").match(/[^.!?…]+[.!?…]/g) || [];
    const shortSent = sents.map((s) => s.trim()).find((s) => words(s).length >= 4 && words(s).length <= 12);
    if (shortSent) {
      steps.push({
        k: "memory",
        fr: shortSent,
        en: `Phrase clé du texte « ${r.title} » (reconstruisez de mémoire)`,
        chunks: rhythmChunks(shortSent),
        skill: ["reading", "writing"]
      });
    }
    steps.push(...buildIdiomeSteps(n.cefr || "B1", 1));
    return steps;
  }
  // ---- mission (write + speak)
  function buildMissionSession(n) {
    const m = n.data; const steps = [{ k: "intro", title: `Mission · ${n.unitObj ? n.unitObj.title : ""}`, goal: "Use this world's French for real: write it, then say it." }];
    if (m.write) steps.push(Object.assign({ k: "write", level: n.cefr, skill: "writing" }, m.write));
    if (m.speak) steps.push(Object.assign({ k: "speakfree", level: n.cefr, skill: "speaking" }, m.speak));
    return steps;
  }
  // ---- level gate / grand examen
  function buildExamSession(level) {
    const E = EXAMS()[level];
    if (!E) return null;
    const steps = [{ k: "intro", title: E.title, goal: E.intro_en, exam: true, level }];
    steps.push({ k: "banner", text: "1 · Compréhension orale", sub: "Listening — audio only", sec: "listening" });
    (E.listening || []).forEach((x) => steps.push({ k: "listen", fr: x.fr, q: x.q, choices: shuffle(x.choices), answer: x.answer, mode: "exam", sec: "listening", skill: "listening" }));
    steps.push({ k: "banner", text: "2 · Dictée", sub: "Write exactly what you hear", sec: "dictation" });
    (E.dictation || []).forEach((fr) => steps.push({ k: "dictee", fr, en: "", sec: "dictation", skill: "listening", strict: true }));
    steps.push({ k: "banner", text: "3 · Grammaire & lexique", sub: "Structures of the level", sec: "grammar" });
    (E.grammar || []).forEach((g) => steps.push({ k: "mcq", qHtml: rich(g.q), choices: shuffle(g.choices), answer: g.answer, why: g.why, sec: "grammar", skill: "reading" }));
    if (E.reading) {
      steps.push({ k: "reading", title: E.reading.title, genre: E.reading.genre, text: E.reading.text_fr, glossary: [], sec: "reading" });
      (E.reading.questions || []).forEach((q) => steps.push({ k: "mcq", qHtml: esc(q.q), choices: shuffle(q.choices), answer: q.answer, why: q.why, passage: { title: E.reading.title, text: E.reading.text_fr }, sec: "reading", skill: "reading" }));
    }
    if (E.writing) steps.push(Object.assign({ k: "write", level, sec: "writing", exam: true, skill: "writing", must_use: E.writing.checklist }, E.writing));
    if (E.speaking) steps.push(Object.assign({ k: "speakfree", level, sec: "speaking", exam: true, skill: "speaking" }, E.speaking));
    return steps;
  }
  // ---- daily review (spaced repetition + mistakes, works even with 1 mistake!)
  function reviewCards() {
    const s = SAVE(); const now = Date.now();
    const mist = Object.values(s.mistakeVault || {}).filter((m) => m && m.fr && m.en).map((m) => ({ fr: firstAlt(m.fr), en: m.en, category: m.category || "vocabulary", w: 3 + (m.misses || 1) }));
    const due = Object.values(s.fsrsCards || {}).filter((c) => c && c.fr && c.en && c.due && c.due <= now).map((c) => ({ fr: firstAlt(c.fr), en: c.en, category: c.category || "vocabulary", w: 1 }));
    const seen = new Set(); const out = [];
    mist.concat(due).sort((a, b) => b.w - a.w).forEach((c) => { const k = normLoose(c.fr); if (!seen.has(k) && isGoodCard(c)) { seen.add(k); out.push(c); } });
    return out;
  }
  function buildReviewSession() {
    const raw = cleanCards(reviewCards()).slice(0, 12);
    if (!raw.length) return null;
    const { lv, pool } = activeArcCards();
    const cards = raw.length >= 4 ? raw : raw.concat(shuffle(pool).slice(0, 5 - raw.length));
    const steps = [{ k: "intro", title: "🔁 Révision & Consolidation", place: "📍 Atelier de Mémoire", goal: `${raw.length} phrase${raw.length === 1 ? "" : "s"} in your active review deck — lock them into permanent memory.` }];
    const kinds = ["memory", "shadow", "listen", "type", "build", "reflex", "dictee"];
    cards.forEach((c, i) => {
      steps.push(cardStep(kinds[i % kinds.length], c, pool, lv) || cardStep("fr2en", c, pool, lv));
      if (raw.length <= 2 && i < raw.length) {
        steps.push(cardStep("type", c, pool, lv) || cardStep("build", c, pool, lv) || cardStep("listen", c, pool, lv));
      }
    });
    const m = matchStep(cards.slice(0, 5)); if (m) steps.splice(Math.min(3, steps.length), 0, m);
    const sim = buildSimTurnFromCards(cards, "Révision"); if (sim) steps.push(sim);
    return steps.filter(Boolean);
  }
  // ---- placement test: 4 items per level A1→C1 (grammar + listening from gates)
  function buildPlacementSession() {
    const steps = [{ k: "intro", title: "Test de niveau", goal: "20 quick questions, getting harder. Don't guess — tap “I don't know” if you don't know.", placement: true }];
    ["A1", "A2", "B1", "B2", "C1"].forEach((lv) => {
      const E = EXAMS()[lv]; if (!E) return;
      shuffle(E.grammar || []).slice(0, 2).forEach((g) => steps.push({ k: "mcq", qHtml: rich(g.q), choices: shuffle(g.choices).concat(["I don't know"]), answer: g.answer, why: g.why, sec: lv, noRetry: true, skill: "grammar" }));
      shuffle(E.listening || []).slice(0, 2).forEach((x) => steps.push({ k: "listen", fr: x.fr, q: x.q, choices: shuffle(x.choices).concat(["I don't know"]), answer: x.answer, mode: "exam", sec: lv, noRetry: true, skill: "listening" }));
    });
    return steps.length > 4 ? steps : null;
  }
  function dedupeSteps(steps) {
    if (!steps) return steps;
    const seenEn = new Set(), seenFr = new Set();
    return steps.filter((st) => {
      if (!st || !st.card || !["build", "type", "mcq", "listen", "dictee", "speak"].includes(st.k)) return true;
      const en = normLoose(st.card.en), fr = normLoose(st.card.fr);
      const prod = st.k === "build" || st.k === "type" || (st.k === "mcq" && st.prompt === "howSay");
      if (prod && seenEn.has(en)) return false;
      if (prod) seenEn.add(en);
      const key = st.k + "|" + fr; if (seenFr.has(key)) return false; seenFr.add(key);
      return true;
    });
  }
  function buildSessionFor(n) { const out = buildSessionFor0(n); return dedupeSteps(out); }
  const CAPSULE_NAMES = ["I · Découverte", "II · Oreille & Rythme", "III · Construction", "IV · Production", "V · Situation Vivante", "VI · Maîtrise"];
  function partitionMicroCapsules(n, fullSteps) {
    const steps = (fullSteps || []).filter(Boolean);
    if (!steps.length) return [];
    if (n && (n.kind === "gate" || n.kind === "natif" || n.kind === "boss")) {
      return [{ idx: 0, total: 1, title: "Épreuve Complète", steps, startIdx: 0, endIdx: steps.length - 1 }];
    }
    const targetSize = 4;
    const numCaps = Math.max(1, Math.min(6, Math.ceil(steps.length / targetSize)));
    if (numCaps <= 1) {
      return [{ idx: 0, total: 1, title: "Capsule I · Maîtrise Express", steps, startIdx: 0, endIdx: steps.length - 1 }];
    }
    const caps = [];
    const baseLen = Math.floor(steps.length / numCaps);
    const rem = steps.length % numCaps;
    let curIdx = 0;
    for (let c = 0; c < numCaps; c++) {
      const len = baseLen + (c < rem ? 1 : 0);
      const slice = steps.slice(curIdx, curIdx + len);
      caps.push({
        idx: c,
        total: numCaps,
        title: `Capsule ${CAPSULE_NAMES[c] || ("#" + (c + 1))}`,
        steps: slice,
        startIdx: curIdx,
        endIdx: curIdx + len - 1
      });
      curIdx += len;
    }
    return caps;
  }
  function getMicroCapsules(n) {
    if (!n) return [];
    if (!n._cachedCapsules) {
      const full = buildSessionFor(n) || [];
      n._cachedCapsules = partitionMicroCapsules(n, full);
    }
    return n._cachedCapsules;
  }
  function nodeMicroProgress(n) {
    if (!n) return { doneMask: {}, doneCount: 0, total: 1, nextCapIdx: 0 };
    const caps = getMicroCapsules(n);
    const total = caps.length || 1;
    const c = CH();
    if (c.done && c.done[n.id]) {
      const all = {};
      for (let i = 0; i < total; i++) all[i] = true;
      return { doneMask: all, doneCount: total, total, nextCapIdx: 0, allDone: true, caps };
    }
    const mask = Object.assign({}, (c.microDone && c.microDone[n.id]) || {});
    const part = c.partial && c.partial[n.id];
    if (part && hasPartialProgress(part) && typeof part.i === "number" && !part.microCap) {
      caps.forEach((cp) => { if (part.i > cp.endIdx) mask[cp.idx] = true; });
    }
    let doneCount = 0;
    let nextCapIdx = -1;
    for (let i = 0; i < total; i++) {
      if (mask[i]) doneCount += 1;
      else if (nextCapIdx === -1) nextCapIdx = i;
    }
    if (nextCapIdx === -1) nextCapIdx = 0;
    return { doneMask: mask, doneCount, total, nextCapIdx, allDone: doneCount >= total, caps };
  }
  function startMicroCapsule(nodeId, capIdx) {
    closeSheet(); closeDrawer();
    const n = NODE_BY_ID[nodeId];
    if (!n) return renderHome();
    if (!isUnlocked(n)) { SFX.bad(); toast("Verrouillé 🔒", "Validez l'étape précédente d'abord.", "🔒"); return; }
    const mp = nodeMicroProgress(n);
    const idx = capIdx != null ? clamp(+capIdx, 0, mp.total - 1) : mp.nextCapIdx;
    const cap = mp.caps[idx];
    if (!cap || !cap.steps || !cap.steps.length) return go(n.id);
    const s = SAVE();
    if (n.stage) { s.currentLessonNum = n.stage.worldNum || (n.world && n.world.number); s.currentStageId = n.stage.stageId; }
    const stepsCopy = cap.steps.map((st) => Object.assign({}, st));
    if (stepsCopy[0] && stepsCopy[0].k !== "intro") {
      stepsCopy.unshift({
        k: "intro",
        title: `${n.title} · ${cap.title}`,
        place: `⚡ Micro-Capsule ${idx + 1}/${mp.total} (~90 sec)`,
        goal: `Complétez ces ${cap.steps.length} micro-actions pour verrouiller la Capsule ${idx + 1}/${mp.total} !`
      });
    }
    startSession(n, stepsCopy, n.kind, {
      steps: stepsCopy,
      i: 0,
      microCap: { idx, total: mp.total, title: cap.title }
    });
  }
  function buildQuick60Session() {
    const nx = nextNode();
    const lv = currentLevel() === "NATIF" ? "C2" : currentLevel();
    const { pool } = activeArcCards();
    const steps = [{
      k: "intro",
      title: "⚡ Capsule Express 60s · Les 4 Piliers Natifs",
      place: `📍 Entraînement Complet (👂 Écouter · ✍️ Écrire · 🎙️ Parler · 🇫🇷 Penser) · Niveau ${lv}`,
      goal: "4 micro-défis actifs en 60 secondes : 1 Écoute/Dictée, 1 Écriture de mémoire, 1 Prise de parole/Shadowing & 1 Réflexe Natif !"
    }];
    const rev = cleanCards(reviewCards());
    const stagePool = (nx && nx.stage) ? stageCards(nx) : [];
    const pickPool = rev.concat(stagePool).concat(shuffle(pool)).filter((c) => c && c.fr && words(c.fr).length >= 3 && words(c.fr).length <= 10);
    const pickStep = (k1, k2, offset) => {
      for (let i = offset; i < pickPool.length; i++) {
        const s = cardStep(k1, pickPool[i], pool, lv) || (k2 && cardStep(k2, pickPool[i], pool, lv));
        if (s) return s;
      }
      return null;
    };
    const s1 = pickStep("dictee", "listen", 0); if (s1) steps.push(s1);
    const s2 = pickStep("memory", "type", 1); if (s2) steps.push(s2);
    const s3 = pickStep("shadow", "speak", 2); if (s3) steps.push(s3);
    const qStep = buildAmeSteps(lv, 1)[0] || buildPenseeSteps(lv, 1)[0] || buildQuestSteps(lv, 1)[0] || buildIdiomeSteps(lv, 1)[0];
    if (qStep) steps.push(qStep);
    return steps.filter(Boolean);
  }
  function buildPillarRepSession(pillar, targetLv) {
    const lv = targetLv || (currentLevel() === "NATIF" ? "C2" : currentLevel());
    const { pool } = activeArcCards(lv);
    const rev = cleanCards(reviewCards());
    const cards = rev.concat(shuffle(pool)).filter((c) => c && c.fr && words(c.fr).length >= 3 && words(c.fr).length <= 11);
    const pickCardStep = (k1, k2, offset = 0) => {
      for (let i = offset; i < cards.length; i++) {
        const s = cardStep(k1, cards[i], pool, lv) || (k2 && cardStep(k2, cards[i], pool, lv));
        if (s) return s;
      }
      return {
        k: k1 === "type" ? "type" : "memory",
        fr: "Bonjour, je voudrais un café s'il vous plaît.",
        en: "Hello, I would like a coffee please.",
        q: "Hello, I would like a coffee please.",
        answer: "Bonjour, je voudrais un café s'il vous plaît.",
        chunks: ["Bonjour,", "je voudrais un café", "s'il vous plaît."],
        skill: ["writing", "vocabulary"]
      };
    };
    const metaMap = {
      read: { title: `📖 Rep Lecture Vivante & Implicite (${lv})`, place: "📍 Pilier 1 · Lire comme un Français", goal: "Comprendre les textes authentiques, décoder le sous-entendu (litotes/idiomes), penser sans traduire et reconstruire une phrase clé." },
      listen: { title: `👂 Rep Oreille de Rue & Vitesse Native (${lv})`, place: "📍 Pilier 2 · Comprendre le vrai français parlé", goal: "Saisir les élisions de rue (« chais pas », « t'inquiète »), les liaisons, Radio Lumière et la dictée active sans sous-titres." },
      write: { title: `✍️ Rep Plume Active & Zéro Calque (${lv})`, place: "📍 Pilier 3 · Écrire de mémoire sans traduire", goal: "Forger vos phrases à partir d'une page blanche (zéro indice de 1re lettre), conjuguer sur l'enclume et tisser des périodes." },
      speak: { title: `🎙️ Rep Bouche Native, Shadowing & Improv (${lv})`, place: "📍 Pilier 4 · Parler spontanément à Paris", goal: "Imiter la mélodie native (Shadowing), prononcer à voix haute, adopter le code social parisien et improviser en situation réelle." }
    };
    const m = metaMap[pillar] || metaMap.speak;
    const steps = [{ k: "intro", title: m.title, place: m.place, goal: m.goal }];
    if (pillar === "read") {
      const rds = ((GYM() && GYM().readings) || []).filter((r) => r.cefr === lv);
      const rPick = (rds.length ? pick(rds) : null) || ((GYM() && GYM().readings) || [])[0];
      if (rPick && rPick.questions && rPick.questions[0]) {
        const q = rPick.questions[0];
        steps.push({ k: "reading", title: rPick.title, genre: rPick.genre, text: rPick.text, glossary: rPick.glossary || [] });
        steps.push({ k: "mcq", qHtml: esc(q.q), choices: shuffle(q.choices), answer: q.answer, why: q.why, passage: rPick, skill: "reading" });
      } else {
        steps.push(...buildSyntheseSteps(lv, 1));
      }
      steps.push(...buildIdiomeSteps(lv, 1));
      steps.push(...buildPenseeSteps(lv, 1));
      steps.push(pickCardStep("memory", "build", 0));
    } else if (pillar === "listen") {
      steps.push(...buildAmeSteps(lv, 1));
      steps.push(...buildLiaisonSteps(lv, 1));
      steps.push(...buildRadioSteps(lv, 1));
      steps.push(pickCardStep("dictee", "listen", 0));
      steps.push(pickCardStep("listen", "dictee", 2));
    } else if (pillar === "write") {
      steps.push(pickCardStep("memory", "type", 0));
      steps.push(pickCardStep("type", "memory", 2));
      steps.push(...buildPenseeSteps(lv, 1));
      steps.push(...buildForgeronSteps(lv, 1));
      steps.push(...buildPeriodeSteps(lv, 1));
    } else {
      steps.push(pickCardStep("shadow", "speak", 0));
      steps.push(pickCardStep("speak", "shadow", 2));
      steps.push(...buildAmeSteps(lv, 1));
      steps.push(...buildQuestSteps(lv, 1));
      const sim = buildSimTurnFromCards(cards.slice(0, 5), "Terrasse à Paris");
      if (sim) steps.push(sim);
    }
    return steps.filter(Boolean);
  }
  function rollLootBox() {
    const s = SAVE();
    const c = CH();
    s.inventory = s.inventory || {};
    const table = [
      { kind: "gold", amount: 45, label: "💰 Bourse de Lutèce (+45 Or)", desc: "45 pièces d'or ajoutées à votre trésor !", icon: "🪙" },
      { kind: "gold_rep", amount: 35, rep: 18, label: "⚜️ Sceau d'Éloquence (+35 Or · +18 Réputation)", desc: "Votre prestige grandit dans les salons de Paris !", icon: "⚜️" },
      { kind: "relic", relic: "fiftyFifty", gold: 20, label: "⚡ Relique 50/50 + 20 Or", desc: "+1 Relique ⚡ 50/50 et +20 Or dans votre inventaire !", icon: "⚡" },
      { kind: "relic", relic: "critElixir", gold: 20, label: "🧪 Élixir Critique + 20 Or", desc: "+1 Élixir Critique (XP ×2.5) et +20 Or !", icon: "🧪" },
      { kind: "relic", relic: "shield", gold: 25, label: "🛡️ Bouclier de la Sorbonne + 25 Or", desc: "+1 Bouclier protecteur et +25 Or !", icon: "🛡️" }
    ];
    const drop = pick(table);
    if (drop.amount) s.gold = (s.gold || 0) + drop.amount;
    if (drop.gold) s.gold = (s.gold || 0) + drop.gold;
    if (drop.rep) c.reputation = (c.reputation || 0) + drop.rep;
    if (drop.relic) s.inventory[drop.relic] = (s.inventory[drop.relic] || 0) + 1;
    c.lootBoxesOpened = (c.lootBoxesOpened || 0) + 1;
    return drop;
  }
  const AMIS_DE_PARIS = [
    {
      id: "camille",
      name: "Camille",
      role: "Meilleure Amie & Coach (A1 → C2)",
      place: "☕ Terrasse de Montmartre",
      avatar: "🥐",
      img: "assets/tutor_camille.jpg",
      vibe: "Bienveillante, patiente, explique chaque mot simplement.",
      greetingFr: "Salut Sreenath ! Installe-toi avec moi au café. Même si tu débutes de zéro, on avance phrase par phrase. Comment tu te sens aujourd'hui ?",
      greetingEn: "Hi Sreenath! Sit down with me at the café. Even if you're starting from zero, we move sentence by sentence. How are you feeling today?",
      starters: [
        { fr: "Bonjour Camille ! Je débute, aide-moi avec une phrase simple.", en: "Hello Camille! I'm a beginner, help me with a simple sentence." },
        { fr: "Ça va bien, merci ! Qu'est-ce qu'on commande au café ?", en: "I'm doing well, thanks! What are we ordering at the café?" },
        { fr: "Je rentre des cours à la fac, j'ai cinq minutes pour pratiquer.", en: "I'm coming back from college classes, I have five minutes to practice." }
      ]
    },
    {
      id: "yanis",
      name: "Yanis",
      role: "Pote de Fac & Musicien (Argot & Oral)",
      place: "🌉 Quai de Valmy · Canal Saint-Martin",
      avatar: "🎸",
      img: "assets/npc_yanis.webp",
      vibe: "Décontracté, t'apprend le vrai français parlé des jeunes à Paris.",
      greetingFr: "Wesh Sreenath ! Bien ou quoi ? Pose ton sac cinq minutes au bord du canal, je t'apprends comment les vrais Parisiens parlent tous les jours !",
      greetingEn: "Hey Sreenath! How's it going? Drop your bag for five minutes by the canal, I'll teach you how real Parisians talk every day!",
      starters: [
        { fr: "Salut Yanis ! C'est quoi l'expression française du jour ?", en: "Hi Yanis! What's the French expression of the day?" },
        { fr: "J'ai eu une grosse journée de cours, je suis crevé !", en: "I had a huge day of classes, I'm exhausted!" },
        { fr: "Comment on dit « I'm super motivated » en vrai français ?", en: "How do you say 'I'm super motivated' in real spoken French?" }
      ]
    },
    {
      id: "celeste",
      name: "Céleste Vance",
      role: "Amie Galeriste & Culture (Élégance B1/B2)",
      place: "🎨 Place des Vosges · Le Marais",
      avatar: "🎨",
      img: "assets/npc_celeste_galeriste.jpg",
      vibe: "Raffinée, curieuse, idéale pour enrichir ton vocabulaire et tes nuances.",
      greetingFr: "Bonsoir Sreenath ! Quelle joie de vous revoir sous les arcades du Marais. Racontez-moi vos projets ou découvrons ensemble une nuance élégante.",
      greetingEn: "Good evening Sreenath! What a joy to see you again under the Marais arcades. Tell me about your projects or let's discover an elegant nuance together.",
      starters: [
        { fr: "Bonsoir Céleste ! Quelle est la différence entre « savoir » et « connaître » ?", en: "Good evening Céleste! What is the difference between 'savoir' and 'connaître'?" },
        { fr: "J'aimerais apprendre à exprimer mon opinion avec élégance.", en: "I would like to learn how to express my opinion with elegance." },
        { fr: "Parlez-moi d'un lieu secret à visiter dans Paris.", en: "Tell me about a secret place to visit in Paris." }
      ]
    },
    {
      id: "valcourt",
      name: "Henri de Valcourt",
      role: "Mentor Académicien (Maîtrise C1/C2)",
      place: "👑 Sous la Coupole · Académie Française",
      avatar: "👑",
      img: "assets/npc_immortel_c2.jpg",
      vibe: "Exigeant et magistral, forge votre plume au niveau des natifs les plus éloquents.",
      greetingFr: "Bienvenue sous la Coupole, cher ami. Ici, nous ciselons votre français jusqu'à l'excellence souveraine du niveau C2. Quelle thèse souhaitez-vous défendre ?",
      greetingEn: "Welcome beneath the Cupola, dear friend. Here, we chisel your French to sovereign C2 excellence. Which thesis do you wish to defend?",
      starters: [
        { fr: "Comment transformer une phrase simple en une grande période C2 ?", en: "How do I transform a simple sentence into a grand C2 period?" },
        { fr: "Donnez-moi un défi de subjonctif ou de litote diplomatique.", en: "Give me a subjunctive or diplomatic litote challenge." },
        { fr: "Je souhaite débattre des grands enjeux du monde contemporain.", en: "I wish to debate the major issues of the contemporary world." }
      ]
    }
  ];
  function buildSessionFor0(n) {
    if (!n) return null;
    if (n.kind === "boot") return buildBootSession(n);
    if (n.kind === "district") return buildDistrictSession(n);
    if (n.kind === "atelier") return buildAtelierSession(n);
    if (n.kind === "boss") return topUp(buildBossSession(n), unitPool(n), n.cefr, 10);
    if (n.stage) { const own = stageCards(n); return topUp(topUp(buildStageSession(n), own, n.cefr, 7), unitPool(n), n.cefr, 4); }
    if (n.kind === "scene") return buildSceneSession(n);
    if (n.kind === "read") return buildReadSession(n);
    if (n.kind === "mission") return buildMissionSession(n);
    if (n.kind === "gate" || n.kind === "natif") return buildExamSession(n.level);
    return null;
  }

  // =================================================================== SESSION RUNTIME
  let SES = null;
  const STEP_TIMERS = { ivs: [], tos: [] };
  function clearStepTimers() {
    STEP_TIMERS.ivs.forEach((id) => clearInterval(id));
    STEP_TIMERS.tos.forEach((id) => clearTimeout(id));
    STEP_TIMERS.ivs.length = 0; STEP_TIMERS.tos.length = 0;
  }
  const $ = (id) => document.getElementById(id);
  const cur = () => (SES ? SES.steps[SES.i] : null);
  const ACCENT_KEYS = ["é", "è", "ê", "à", "â", "ç", "î", "ï", "ô", "û", "ù", "ë", "œ", "É", "À", "«", "»"];
  function accentBar(target) { return `<div class="ody-accents">${ACCENT_KEYS.map((c) => `<button tabindex="-1" data-a="acc" data-c="${c}" data-target="${target}">${c}</button>`).join("")}</div>`; }

  function sessionSaveKey(ses) {
    if (!ses) return null;
    if (ses.node && ses.node.id) return ses.node.id;
    if (ses.mode && ses.mode !== "placement") return "__mode:" + ses.mode;
    return null;
  }

  function savePartial(advanceIfAnswered) {
    const key = sessionSaveKey(SES);
    if (!key) return;
    const c = CH();
    let idx = SES.i;
    if (advanceIfAnswered && SES.answered && idx + 1 < SES.steps.length) idx += 1;
    const cleanSteps = SES.steps.map((st) => {
      const copy = Object.assign({}, st);
      delete copy._rec; delete copy._busy;
      return copy;
    });
    c.partial[key] = {
      nodeId: SES.node && SES.node.id ? SES.node.id : key,
      mode: SES.mode,
      title: SES.node ? SES.node.title : (SES.mode === "quick60" ? "⚡ Capsule Express 60s" : SES.mode === "pillar_read" ? "📖 Rep Pilier Lecture" : SES.mode === "pillar_listen" ? "👂 Rep Pilier Écoute" : SES.mode === "pillar_write" ? "✍️ Rep Pilier Écriture" : SES.mode === "pillar_speak" ? "🎙️ Rep Pilier Parole" : SES.mode === "blitz" ? "⚡ Blitz Speed-Round" : SES.mode === "shadowrun" ? "🎧 Cadence Native" : SES.mode === "improvrun" ? "🎭 Improv Théâtral" : SES.mode === "sleuthrun" ? "🕵️ Enquête & Forge C2" : SES.mode === "jouterun" ? "⚖️ Joute Oratoire C2" : SES.mode === "idiomerun" ? "🎭 Idiomes & Litotes C2" : SES.mode === "perioderun" ? "✒️ L'Architecte de la Phrase & Modes" : SES.mode === "amerun" ? "🇫🇷 L'Âme Française & Pensée Directe" : SES.mode === "radiorun" ? "📻 Radio Lumière" : SES.mode === "weakspot" ? "🎯 Entraînement Ciblé" : "🧠 Révision Active"),
      steps: cleanSteps,
      i: clamp(idx, 0, Math.max(0, cleanSteps.length - 1)),
      graded: SES.graded,
      right: SES.right,
      xp: SES.xp,
      combo: SES.combo,
      bestCombo: SES.bestCombo,
      hearts: SES.hearts,
      secs: SES.secs,
      spoke: SES.spoke,
      wrote: SES.wrote,
      shielded: !!SES.shielded,
      critMult: SES.critMult || 1,
      microCap: SES.microCap || null,
      savedAt: Date.now()
    };
    const pKeys = Object.keys(c.partial);
    if (pKeys.length > 6) {
      pKeys
        .sort((a, b) => ((c.partial[a] && c.partial[a].savedAt) || 0) - ((c.partial[b] && c.partial[b].savedAt) || 0))
        .slice(0, pKeys.length - 6)
        .forEach((oldK) => { if (oldK !== key) delete c.partial[oldK]; });
    }
    c.activeNodeId = key;
    persist();
  }

  const SCENE_THEMES = {
    cafe: {
      bg: "assets/bg_cafe.jpg",
      place: "Terrasse de Montmartre · Paris 18e",
      sky: "#fde68a",
      accent: "#f59e0b",
      npc: { name: "Camille", role: "Chroniqueuse & Amie Parisienne", avatar: "🥐", img: "assets/tutor_camille.jpg" },
      props: [
        { id: "ardoise", icon: "🪧", label: "L'ardoise du jour", fr: "Formule du midi : croque-monsieur artisanal et café allongé.", en: "Lunch special: artisanal croque-monsieur and espresso lungo.", note: "Notice « formule du midi » — the authentic French way to name a set lunch menu." },
        { id: "tasse", icon: "☕", label: "Un petit noir fumant", fr: "Un expresso bien serré, s'il vous plaît, avec une carafe d'eau.", en: "A strong espresso, please, with a jug of tap water.", note: "Asking for « une carafe d'eau » gets free tap water in any French café." },
        { id: "journal", icon: "📰", label: "Le journal du matin", fr: "À la une aujourd'hui : les grands débats culturels de la capitale.", en: "On the front page today: the capital's major cultural debates.", note: "« À la une » literally means 'on page one' (the front page headline)." }
      ]
    },
    gare: {
      bg: "assets/bg_paris_hub.jpg",
      place: "Grands Boulevards & Gare du Nord · Paris 10e",
      sky: "#bae6fd",
      accent: "#38bdf8",
      npc: { name: "Contrôleur Moreau", role: "Agent SNCF & Guide Urbain", avatar: "🚄", img: "assets/npc_moreau.jpg" },
      props: [
        { id: "panneau", icon: "🕒", iconText: "🕒", label: "Tableau des départs", fr: "Le train à destination de Lyon Part-Dieu partira voie G à l'heure prévue.", en: "The train bound for Lyon Part-Dieu will depart from platform G on time.", note: "« Voie » is used for train tracks/platforms in French stations." },
        { id: "guichet", icon: "🎫", label: "Le guichet grandes lignes", fr: "Excusez-moi, serait-il possible d'échanger mon billet sans frais ?", en: "Excuse me, would it be possible to exchange my ticket free of charge?", note: "Conditional « serait-il possible » immediately softens a request." },
        { id: "plan", icon: "🗺️", label: "Plan du réseau", fr: "Prenez la correspondance à Châtelet pour rejoindre la rive gauche.", en: "Take the transfer at Châtelet to reach the Left Bank.", note: "« La correspondance » = transit connection/transfer." }
      ]
    },
    monde: {
      bg: "assets/bg_worldmap.jpg",
      place: "Passage des Panoramas & Quartier Latin · Paris 5e",
      sky: "#c7d2fe",
      accent: "#818cf8",
      npc: { name: "Élodie", role: "Libraire & Conteuse", avatar: "📚", img: "assets/npc_elodie.jpg" },
      props: [
        { id: "vitrine", icon: "🏛️", label: "La devanture ancienne", fr: "Cette galerie couverte date du dix-neuvième siècle.", en: "This covered arcade dates from the nineteenth century.", note: "« Dater de » takes the present tense when something still exists today." },
        { id: "carnet", icon: "📓", label: "Carnet de voyage", fr: "Au fur et à mesure de mes rencontres, mon français s'affine.", en: "As my encounters progress, my French grows more refined.", note: "« Au fur et à mesure » = progressively / as things unfold." },
        { id: "boussole", icon: "🧭", label: "Boussole d'explorateur", fr: "Cap sur la maîtrise complète des nuances francophones.", en: "Heading toward complete mastery of Francophone nuances.", note: "« Cap sur... » is a vivid idiom meaning 'setting course for...'." }
      ]
    },
    career: {
      bg: "assets/bg_career.jpg",
      place: "La Défense & Palais Brongniart · Hauts-de-Seine",
      sky: "#93c5fd",
      accent: "#60a5fa",
      npc: { name: "Marc-Antoine", role: "Directeur de la Stratégie", avatar: "💼", img: "assets/npc_marc_antoine.jpg" },
      props: [
        { id: "dossier", icon: "📁", label: "Note de synthèse COMEX", fr: "Il convient néanmoins de nuancer ce bilan trimestriel.", en: "It is nevertheless appropriate to nuance this quarterly assessment.", note: "« Il convient de + infinitif » is C1/C2 executive register for 'we should'." },
        { id: "tribune", icon: "🎙️", label: "Micro de conférence", fr: "Force est de constater que nos engagements ont porté leurs fruits.", en: "One must acknowledge that our commitments have borne fruit.", note: "« Force est de constater que » is a classic C2 analytical connector." },
        { id: "contrat", icon: "✒️", label: "Protocole d'accord", fr: "Sous réserve de validation par le conseil, l'accord entrera en vigueur.", en: "Subject to board approval, the agreement will enter into force.", note: "« Sous réserve de » = subject to / provided that." }
      ]
    },
    sorbonne: {
      bg: "assets/bg_sorbonne_c2.jpg",
      place: "Amphithéâtre Richelieu · La Sorbonne",
      sky: "#f5d0fe",
      accent: "#c084fc",
      npc: { name: "Professeure Rochefort", role: "Chaire de Rhétorique & Lettres (C2)", avatar: "🎓", img: "assets/npc_rochefort.jpg" },
      props: [
        { id: "manuscrit", icon: "📜", label: "Manuscrit annoté", fr: "Quoi qu'il en soit, la thèse adverse repose sur un présupposé fragile.", en: "Be that as it may, the opposing thesis rests upon a fragile presupposition.", note: "Notice two-word « Quoi que » (whatever) + subjunctive « soit »." },
        { id: "pupitre", icon: "🏛️", label: "Le pupitre magistral", fr: "À cela s'ajoute une dimension éthique qu'on ne saurait ignorer.", en: "To this is added an ethical dimension that one could not ignore.", note: "« On ne saurait + infinitif » is elegant C2 conditional negation." },
        { id: "plume", icon: "🪶", label: "Plume d'or de l'Académie", fr: "La clarté stylistique naît de la précision du verbe.", en: "Stylistic clarity is born from precision of the verb.", note: "C2 style prizes active verbs over heavy nominal phrases." }
      ]
    },
    soundlab: {
      bg: "assets/bg_soundlab.jpg",
      place: "Studio Phonétique & Radio Lumière · Maison de la Radio",
      sky: "#a5f3fc",
      accent: "#22d3ee",
      npc: { name: "Maître Marin", role: "Ingénieur du Son & Phonéticien", avatar: "🎧", img: "assets/npc_marin.jpg" },
      props: [
        { id: "micro", icon: "🎙️", label: "Microphone à ruban", fr: "Enchaînez les syllabes dans un seul souffle : vous‿avez‿entendu.", en: "Link the syllables in a single breath: vous‿avez‿entendu.", note: "French rhythm binds words into phonetic groups (le groupe rythmique)." },
        { id: "oscillo", icon: "〰️", label: "Analyseur de fréquence", fr: "Arrondissez les lèvres pour distinguer le « u » de « tu » et le « ou » de « tout ».", en: "Round your lips to distinguish the 'u' of 'tu' from the 'ou' of 'tout'.", note: "Keep the tongue forward (as for 'i') while rounding the lips for French /y/." },
        { id: "antenne", icon: "📻", label: "Console ON AIR", fr: "Chers auditeurs, bonsoir et bienvenue dans notre édition spéciale.", en: "Dear listeners, good evening and welcome to our special edition.", note: "Broadcast French uses crisp articulation and falling declarative cadence." }
      ]
    },
    boss: {
      bg: "assets/bg_battle.jpg",
      place: "Le Grand Salon des Épreuves · Hôtel de Ville",
      sky: "#fecdd3",
      accent: "#fb7185",
      npc: { name: "L'Examinateur Impérial", role: "Gardien du Sceau Linguistique", avatar: "⚔️", img: "assets/npc_examinateur.jpg" },
      props: [
        { id: "sceau", icon: "⚜️", label: "Sceau de la Ville", fr: "Fluctuat nec mergitur : il est battu par les flots, mais ne sombre pas.", en: "Tossed by the waves, yet it does not sink — the motto of Paris.", note: "« Sombrer » is the literary verb for sinking or falling into ruin." },
        { id: "sablier", icon: "⏳", label: "Sablier de cristal", fr: "Gardez votre sang-froid : chaque réponse juste renforce votre maîtrise.", en: "Keep your composure: every accurate response strengthens your mastery.", note: "« Garder son sang-froid » = to keep one's cool under pressure." },
        { id: "cle", icon: "🗝️", label: "Clé du passage", fr: "Seule la précision grammaticale ouvrira les portes du prochain chapitre.", en: "Only grammatical precision will open the doors of the next chapter.", note: "After « seul(e) » in front position, French often uses future or subjunctive." }
      ]
    },
    marais: {
      bg: "assets/bg_marais_galerie.jpg",
      place: "Place des Vosges & Galerie des Arcades · Le Marais",
      sky: "#fbcfe8",
      accent: "#f472b6",
      npc: { name: "Céleste Vance", role: "Directrice de Galerie · Place des Vosges", avatar: "🎨", img: "assets/npc_celeste_galeriste.jpg" },
      props: [
        { id: "catalogue", icon: "🖼️", label: "Catalogue du vernissage", fr: "Ce triptyque joue admirablement sur le clair-obscur des arcades.", en: "This triptych plays admirably on the chiaroscuro of the arcades.", note: "« Le clair-obscur » is the classic French art term for light-shadow contrast." },
        { id: "cartel", icon: "🏷️", label: "Cartel de l'œuvre", fr: "Pourriez-vous me préciser si cette estampe est numérotée et signée ?", en: "Could you specify whether this print is numbered and signed?", note: "« Le cartel » is the museum/gallery label next to a painting." },
        { id: "arcade", icon: "🏛️", label: "Voûte en brique rose", fr: "Flâner sous les arcades de la Place des Vosges inspire la rêverie.", en: "Strolling under the arcades of Place des Vosges inspires reverie.", note: "« Flâner » = to stroll aimlessly, enjoying the beauty of the city." }
      ]
    },
    canal: {
      bg: "assets/bg_canal_saint_martin.jpg",
      place: "Passerelle de la Grange-aux-Belles · Canal Saint-Martin",
      sky: "#a7f3d0",
      accent: "#34d399",
      npc: { name: "Yanis & sa Bande", role: "Musiciens du Quai de Valmy", avatar: "🎸", img: "assets/npc_yanis.webp" },
      props: [
        { id: "ecluse", icon: "🌉", label: "La passerelle tournante", fr: "Attends deux minutes, la péniche passe l'écluse et le pont va rouvrir.", en: "Wait two minutes, the barge is passing the lock and the bridge will reopen.", note: "« L'écluse » = canal lock; « la péniche » = river barge." },
        { id: "guitare", icon: "🎸", label: "Étui à guitare", fr: "On improvise quelques accords au bord de l'eau avant la tombée de la nuit.", en: "We're improvising a few chords by the water before nightfall.", note: "« À la tombée de la nuit » = at nightfall / dusk." },
        { id: "lanterne", icon: "🏮", label: "Guirlande du bistrot", fr: "S'il se met à flotter, on se replie tous sous l'auvent du café.", en: "If it starts raining, we all fall back under the café awning.", note: "Colloquial « il flotte » = it's raining." }
      ]
    },
    justice: {
      bg: "assets/bg_palais_justice.jpg",
      place: "Cour d'Appel · Palais de Justice (Île de la Cité)",
      sky: "#bfdbfe",
      accent: "#60a5fa",
      npc: { name: "Bâtonnière de Montmirail", role: "Présidente de la Commission · Cour d'Appel", avatar: "⚖️", img: "assets/npc_batonniere_justice.jpg" },
      props: [
        { id: "balance", icon: "⚖️", label: "Balance du prétoire", fr: "Nul ne saurait être jugé sans avoir été préalablement entendu.", en: "No one may be judged without having previously been heard.", note: "« Nul ne saurait + infinitif » = formal legal 'no one may/could'." },
        { id: "code_civil", icon: "📕", label: "Recueil de jurisprudence", fr: "Force est de constater que ce précédent éclaire le litige sous un jour nouveau.", en: "One must note that this precedent sheds new light on the dispute.", note: "« Sous un jour nouveau » = in a new light." },
        { id: "toque", icon: "🎓", label: "Épitoge d'avocat", fr: "La défense plaide la relaxe au bénéfice du doute raisonnable.", en: "The defense pleads for acquittal on the benefit of reasonable doubt.", note: "« Plaider la relaxe / l'acquittement » = to plead for acquittal." }
      ]
    },
    academie: {
      bg: "assets/bg_academie_coupole.jpg",
      place: "Sous la Coupole · Académie Française (Quai de Conti)",
      sky: "#fde68a",
      accent: "#fbbf24",
      npc: { name: "Henri de Valcourt", role: "Secrétaire Perpétuel de l'Académie", avatar: "👑", img: "assets/npc_immortel_c2.jpg" },
      props: [
        { id: "habit_vert", icon: "🌿", label: "Habit vert brodé d'olivier", fr: "À l'immortalité : telle est la devise gravée sur le sceau de Richelieu.", en: "To immortality: such is the motto engraved on Richelieu's seal.", note: "Inverted « telle est + nom » is classic high-register French." },
        { id: "dictionnaire", icon: "📖", label: "Dictionnaire de l'Académie", fr: "La propriété des termes est le premier gage de la clarté de l'esprit.", en: "Exactness of terms is the foremost pledge of clarity of mind.", note: "« La propriété des termes » = using the exact right word." },
        { id: "coupole_or", icon: "🏛️", label: "La Coupole dorée", fr: "Puisse la langue française demeurer un espace de nuance et de liberté.", en: "May the French language remain a space of nuance and freedom.", note: "Optative subjunctive « Puisse + sujet + infinitif » without 'que'!" }
      ]
    }
  };

  function scenePropsFor(theme, node, st) {
    const base = (theme && theme.props) ? theme.props.slice() : [];
    const card = (st && st.card && st.card.fr && st.card.en) ? st.card : (node && node.stage && node.stage.cards && node.stage.cards[0] && node.stage.cards[0].fr) ? node.stage.cards[0] : null;
    if (card && card.fr && card.en) {
      const cleanFr = firstAlt(card.fr);
      base.push({
        id: "ctx_" + normLoose(cleanFr).slice(0, 18).replace(/\s+/g, "_"),
        icon: "🗝️",
        label: "Indice de la scène",
        fr: cleanFr,
        en: stripEn(card.en),
        note: card.note || `Expression-clé de « ${(node && node.title) || "cette scène"} » — écoutez et mémorisez sa mélodie.`
      });
    }
    return base;
  }

  function sceneThemeFor(node, mode, st) {
    if (window.resolveVisualScene) {
      const vs = window.resolveVisualScene(node, mode, st);
      if (vs) {
        return {
          bg: vs.bg,
          place: vs.place,
          sky: "#fde68a",
          accent: "#f59e0b",
          npc: { name: vs.npcName || "Guide de Paris", role: `Scène ${vs.cefr || ""}`, avatar: "📍", img: vs.npc || PORTRAIT },
          props: (vs.hotspots || []).slice(0, 3).map((h) => ({
            id: "vs_" + vs.id + "_" + h.id,
            icon: h.icon || "🔍",
            label: h.fr,
            fr: h.spokenFr || h.fr,
            en: h.fr,
            note: `Objet de « ${vs.title} » — écoutez la prononciation native.`
          }))
        };
      }
    }
    if (st && (st.k === "sound" || st.k === "shadow" || st.k === "radio" || st.k === "liaison") || mode === "shadowrun" || (node && node.kind === "boot")) return SCENE_THEMES.soundlab;
    if (node && (node.kind === "boss" || node.kind === "gate" || node.kind === "natif")) return SCENE_THEMES.boss;
    if ((st && (st.k === "joute" || st.k === "synthese" || st.k === "periode" || st.k === "concordance")) || mode === "jouterun" || mode === "perioderun") {
      const jLv = (st && st.level) || currentLevel();
      if (cefrRank(jLv) >= 5) return SCENE_THEMES.academie;
      if (cefrRank(jLv) >= 4) return SCENE_THEMES.justice;
      return SCENE_THEMES.sorbonne;
    }
    if ((st && (st.k === "idiome" || st.k === "ame" || st.k === "pensee")) || mode === "idiomerun" || mode === "amerun") {
      const iLv = (st && st.level) || currentLevel();
      if (cefrRank(iLv) >= 5) return SCENE_THEMES.academie;
      if (cefrRank(iLv) >= 4) return SCENE_THEMES.career;
      if (cefrRank(iLv) >= 2) return SCENE_THEMES.marais;
      return SCENE_THEMES.cafe;
    }
    if ((st && st.k === "enquete") || mode === "sleuthrun" || (node && node.kind === "atelier")) return SCENE_THEMES.sorbonne;
    if (st && st.k === "forgeron") return SCENE_THEMES.monde;
    if (node && node.kind === "district") {
      const id = node.data && node.data.id || "";
      if (id.includes("academie")) return SCENE_THEMES.academie;
      if (id.includes("sorbonne")) return SCENE_THEMES.sorbonne;
      if (id.includes("justice")) return SCENE_THEMES.justice;
      if (id.includes("marais")) return SCENE_THEMES.marais;
      if (id.includes("canal")) return SCENE_THEMES.canal;
      if (id.includes("gare")) return SCENE_THEMES.gare;
      if (id.includes("defense") || id.includes("mairie")) return SCENE_THEMES.career;
      return SCENE_THEMES.cafe;
    }
    const lv = (st && (st.level || (st.card && st.card.cefr))) || (node && node.cefr) || currentLevel();
    const rk = cefrRank(lv);
    if (rk >= 5) return SCENE_THEMES.academie;
    if (rk === 4) return SCENE_THEMES.justice;
    if (rk === 3) return SCENE_THEMES.career;
    if (rk === 2) return SCENE_THEMES.marais;
    if (rk === 1) return SCENE_THEMES.gare;
    return SCENE_THEMES.cafe;
  }

  function renderDiorama(st) {
    if (!SES) return "";
    const theme = sceneThemeFor(SES.node, SES.mode, st);
    const propsList = scenePropsFor(theme, SES.node, st);
    const mood = SES.lastMood || "ready";
    const moodEmoji = mood === "happy" ? "😄" : mood === "recast" ? "🧐" : "✨";
    const moodLine = SES.lastBubble || (st && st.k === "ame" ? "Oubliez le manuel scolaire : adoptez le réflexe culturel et l'élision naturelle d'un vrai Français !" : st && st.k === "pensee" ? "Zéro traduction mentale : visualisez la scène et pensez directement avec l'image française !" : st && st.k === "joute" ? "Construisez votre riposte dialectique en 3 mouvements : Concession → Réfutation → Synthèse !" : st && st.k === "periode" ? "Tissez la période oratoire en posant les 4 propositions dans leur ordre rhétorique exact !" : st && st.k === "concordance" ? "Analysez le déclencheur et tranchez entre l'Indicatif (certitude) et le Subjonctif !" : st && st.k === "idiome" ? "Décodez le sous-entendu ou la litote derrière les mots !" : st && st.k === "synthese" ? "Croisez les deux sources et dégagez une synthèse sans parti pris !" : st && st.k === "quest" ? "Choisissez le registre adapté à votre interlocuteur !" : st && st.k === "enquete" ? "Inspectez les 4 segments du document et touchez celui qui cache une anomalie !" : st && st.k === "forgeron" ? "Forgez la forme conjuguée exacte sur l'enclume !" : st && st.k === "liaison" ? "Écoutez le souffle et identifiez la liaison exacte !" : st && st.k === "write" ? "Soignez vos connecteurs logiques et la richesse du style." : "Inspectez le décor (🔍) ou répondez pour faire avancer la scène !");
    const inspectedMap = (st && st._inspected) || {};
    const propsHtml = propsList.map((p, idx) => {
      const done = !!(inspectedMap[p.id] || (CH().inspected && CH().inspected[p.id]));
      return `<button type="button" class="ody-prop ${done ? "inspected" : ""}" data-a="inspectprop" data-pidx="${idx}" title="Inspecter en français (+5 XP)">
        <span class="prop-ico">${p.iconText || p.icon}</span>
        <span class="prop-lbl">${esc(p.label)}</span>
        <span class="prop-badge">${done ? "✓ Vu" : "🔍 +5 XP"}</span>
      </button>`;
    }).join("");
    return `<div class="ody-diorama mood-${mood}" style="--scene-bg:url('${theme.bg}');--scene-accent:${theme.accent};--scene-sky:${theme.sky}">
      <div class="diorama-backdrop"></div>
      <svg class="diorama-svg" viewBox="0 0 800 130" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="odySkyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${theme.sky}" stop-opacity="0.32"/>
            <stop offset="100%" stop-color="#0f172a" stop-opacity="0.45"/>
          </linearGradient>
        </defs>
        <rect width="800" height="130" fill="url(#odySkyGrad)"/>
        <path d="M0,115 L60,115 L60,72 L95,52 L130,72 L130,115 L210,115 L210,64 L265,64 L265,115 L370,115 L385,22 L393,22 L408,115 L520,115 L520,68 L595,48 L660,68 L660,115 L800,115 L800,130 L0,130 Z" fill="rgba(15,23,42,0.34)"/>
        <circle cx="145" cy="34" r="3" fill="#fde68a" class="svg-twinkle"/>
        <circle cx="465" cy="28" r="2.5" fill="#fef08a" class="svg-twinkle"/>
        <circle cx="695" cy="38" r="3.5" fill="#fde68a" class="svg-twinkle"/>
      </svg>
      <div class="diorama-inner">
        <div class="diorama-npc">
          <div class="npc-portrait-wrap">
            <img src="${theme.npc.img}" alt="${esc(theme.npc.name)}" class="npc-portrait-img" onerror="this.style.display='none'"/>
            <span class="npc-mood-badge">${moodEmoji}</span>
          </div>
          <div class="npc-speech">
            <div class="npc-meta">
              <span class="npc-place">📍 ${esc(theme.place)}</span>
              <span class="npc-name">${esc(theme.npc.name)} · <small>${esc(theme.npc.role)}</small></span>
            </div>
            <div class="npc-bubble" id="ody-npc-bubble">${esc(moodLine)}</div>
          </div>
        </div>
        <div class="diorama-props" role="group" aria-label="Objets interactifs de la scène">
          ${propsHtml}
        </div>
      </div>
      <div class="ody-prop-out" id="ody-prop-out" hidden></div>
    </div>`;
  }

  function explainStep(st, ok, info) {
    if (!st) return "";
    const existingWhy = info.why || st.why || (st.card && st.card.note) || "";
    const ans = String(info.answer || st.a || st.fr || (st.card && st.card.fr) || "").trim();
    const user = String(info.user || "").trim();
    const notes = [];
    if (existingWhy) notes.push(existingWhy);
    if (!ok && ans) {
      const nUser = normLoose(user), nAns = normLoose(ans);
      if (user && nUser && nUser !== nAns) {
        if ((/^le\b/i.test(ans) && /^la\b/i.test(user)) || (/^la\b/i.test(ans) && /^le\b/i.test(user)) || (/^un\b/i.test(ans) && /^une\b/i.test(user)) || (/^une\b/i.test(ans) && /^un\b/i.test(user))) {
          notes.push(`Genre grammatical : retenez l'article exact dans « **${ans}** » — visualisez le nom avec son déterminant comme un seul bloc sonore.`);
        } else if (/^[cdjlmnst]'/i.test(ans) && !/'/.test(user)) {
          notes.push(`Élision obligatoire : devant une voyelle ou un h muet, la voyelle finale s'efface pour former « **${ans}** ».`);
        } else if (levenshtein(nUser, nAns) <= 2) {
          notes.push(`Vous étiez tout près ! Comparez l'orthographe exacte : « **${ans}** » (attention aux accents et aux lettres finales muettes).`);
        }
      }
      if (!notes.length) {
        if (/subjonctif|quoique|bien que|pour que|avant que|il faut que/i.test(ans + " " + (st.q || ""))) {
          notes.push(`Indice de structure : cette tournure appelle le **subjonctif** ou un connecteur soutenu dans « **${ans}** ».`);
        } else {
          notes.push(`En contexte francophone, la tournure naturelle est « **${ans}** »${st.en || (st.card && st.card.en) ? ` (${st.en || st.card.en})` : ""}. Écoutez la mélodie en cliquant sur 🔊.`);
        }
      }
    } else if (ok && !notes.length && ans && (st.k === "register" || st.k === "quest" || st.k === "cloze")) {
      notes.push(`Tournure maîtrisée : « **${ans}** » s'intègre parfaitement dans ce registre.`);
    }
    return notes.join(" · ");
  }

  function relicToolbarHtml() {
    const s = SAVE();
    const c = CH();
    const inv = (s && s.inventory) || {};
    const f50 = inv.fiftyFifty || 0;
    const sh = inv.shield || 0;
    const cr = inv.critElixir || 0;
    const charges = clamp(c.frenzyCharges || 0, 0, 5);
    const frenzyOn = !!(SES && SES.frenzyStepsLeft > 0);
    const capPill = (SES && SES.microCap) ? `<span class="ody-cap-pill" title="Micro-Capsule en cours">⚡ Cap. ${SES.microCap.idx + 1}/${SES.microCap.total}</span>` : "";
    const frenzyPill = `<span class="ody-frenzy-pill ${frenzyOn ? "is-frenzy" : ""}" title="${frenzyOn ? `SURCHARGE DOPAMINE ACTIVE : XP ×2 & +10 Or par réponse juste (${SES.frenzyStepsLeft} restantes) !` : `Jauge de Surcharge Dopamine (${charges}/5 réponses justes avant XP ×2 & Pluie d'Or)`}">${frenzyOn ? `⚡ SURCHARGE ×2 (${SES.frenzyStepsLeft})` : `⚡ ${"▰".repeat(charges)}${"▱".repeat(5 - charges)}`}</span>`;
    return `<div class="ody-relics" id="ody-relics">
      ${capPill}
      ${frenzyPill}
      <span class="ody-rep-pill" title="Réputation Parisienne">⚜️ <b id="ody-rep-val">${c.reputation || 0}</b></span>
      <button type="button" class="ody-relic-btn ${f50 > 0 ? "" : "is-empty"}" data-a="userelic" data-r="fiftyFifty" title="50/50 : Écarte 2 mauvais choix (${f50} en stock)">⚡ 50/50 <small>${f50}</small></button>
      <button type="button" class="ody-relic-btn ${sh > 0 ? "" : "is-empty"} ${SES && SES.shielded ? "is-active" : ""}" data-a="userelic" data-r="shield" title="Bouclier : Protège votre prochain cœur (${sh} en stock)">🛡️ <small>${sh}</small></button>
      <button type="button" class="ody-relic-btn ${cr > 0 ? "" : "is-empty"} ${SES && SES.critMult > 1 ? "is-active" : ""}" data-a="userelic" data-r="critElixir" title="Élixir Critique : XP ×2.5 sur cette étape (${cr} en stock)">🧪 <small>${cr}</small></button>
    </div>`;
  }

  // ----------------------------------------------------------------- Universal Back & History Navigation (NAV)
  const NAV = {
    stack: [{ kind: "view", scene: "home" }],
    exitToastAt: 0,
    sentinelArmed: false,
    push(entry) {
      if (!entry) return;
      const top = this.stack[this.stack.length - 1];
      if (top && top.kind === entry.kind && top.scene === entry.scene && top.type === entry.type) {
        this.stack[this.stack.length - 1] = entry;
        return;
      }
      this.stack.push(entry);
      if (this.stack.length > 24) this.stack.shift();
      this.armSentinel();
    },
    armSentinel() {
      if (this.sentinelArmed) return;
      try {
        window.history.replaceState({ ody: "root" }, "", window.location.href);
        window.history.pushState({ ody: "sentinel" }, "");
        this.sentinelArmed = true;
      } catch (e) {}
    },
    canGoBack() {
      if ($("ody-sheet") || $("ody-drawer") || SES) return true;
      const sc = document.body.dataset.scene || "home";
      if (sc !== "home") return true;
      return this.stack.length > 1;
    },
    back() {
      // 1. Sheet open -> close sheet (and restore previous sheet if stacked)
      if ($("ody-sheet")) {
        closeSheet();
        if (this.stack.length > 1 && this.stack[this.stack.length - 1].kind === "sheet") this.stack.pop();
        const prevTop = this.stack[this.stack.length - 1];
        if (prevTop && prevTop.kind === "sheet" && typeof prevTop.restore === "function") {
          prevTop.restore(true);
        }
        return true;
      }
      // 2. Drawer open -> close drawer
      if ($("ody-drawer")) {
        closeDrawer();
        if (this.stack.length > 1 && this.stack[this.stack.length - 1].kind === "drawer") this.stack.pop();
        return true;
      }
      // 3. Active session -> save & exit cleanly
      if (SES) {
        ACT.quit();
        return true;
      }
      // 4. Secondary scene internal sub-views (Sound Lab / Native Gym)
      const curScene = document.body.dataset.scene || "home";
      if (curScene === "soundlab" && window.RPG_SOUNDLAB_BACK && window.RPG_SOUNDLAB_BACK()) return true;
      if (curScene === "gym" && window.RPG_GYM_BACK && window.RPG_GYM_BACK()) return true;
      // 5. Onboarding steps 1..3
      if (curScene === "onboarding" && OB.step > 0) {
        renderOnboarding(OB.step - 1);
        return true;
      }
      // 6. Any non-home view -> pop stack and return to previous view (default home)
      if (curScene !== "home" || this.stack.length > 1) {
        if (this.stack.length > 1) this.stack.pop();
        const target = this.stack[this.stack.length - 1] || { kind: "view", scene: "home" };
        stopAudio(); micStop();
        if (target.kind === "view" && target.scene && target.scene !== "home" && target.scene !== curScene) {
          if (target.scene === "atlas") return renderOdysseyAtlas(true);
          if (target.scene === "portfolio") return renderPortfolio(true);
          if (window.navigateScene) return window.navigateScene(target.scene);
        }
        this.stack = [{ kind: "view", scene: "home" }];
        renderHome();
        return true;
      }
      return false;
    }
  };
  window.addEventListener("popstate", () => {
    if (NAV.canGoBack()) {
      NAV.back();
      try { window.history.pushState({ ody: "sentinel" }, ""); } catch (e) {}
    } else {
      const now = Date.now();
      if (now - NAV.exitToastAt > 2200) {
        NAV.exitToastAt = now;
        toast("⬅️ Retour", "Appuyez encore pour quitter L'Odyssée", "🏠");
        try { window.history.pushState({ ody: "sentinel" }, ""); } catch (e) {}
      }
    }
  });

  function startSession(node, steps, mode, resumeData) {
    steps = (steps || []).filter(Boolean);
    if (!steps.length) { toast("Nothing to play here yet", "This node has no exercises. It has been skipped.", "⚠️"); if (node) { CH().done[node.id] = CH().done[node.id] || 1; persist(); } renderHome(); return; }
    stopAudio();
    NAV.armSentinel();
    const res = resumeData && Array.isArray(resumeData.steps) && resumeData.steps.length ? resumeData : null;
    if (res) steps = res.steps.slice();
    SES = {
      node, mode: mode || (res && res.mode) || (node ? node.kind : "review"), steps,
      i: res ? clamp(res.i || 0, 0, steps.length - 1) : 0,
      graded: res ? (res.graded || 0) : 0,
      right: res ? (res.right || 0) : 0,
      xp: res ? (res.xp || 0) : 0,
      combo: res ? (res.combo || 0) : 0,
      bestCombo: res ? (res.bestCombo || 0) : 0,
      hearts: res && res.hearts !== undefined ? res.hearts : ((node && node.kind === "boss") ? ((SAVE().perks && SAVE().perks.sceauSorbonne) ? 4 : 3) : null),
      secs: res && res.secs ? Object.assign({}, res.secs) : {},
      t0: Date.now(), stepT0: Date.now(), answered: false,
      exam: !!(node && (node.kind === "gate" || node.kind === "natif")) || mode === "placement",
      spoke: res ? (res.spoke || 0) : 0,
      wrote: res ? (res.wrote || 0) : 0,
      shielded: !!(res && res.shielded),
      critMult: (res && res.critMult) || 1,
      microCap: (res && res.microCap) || null,
      frenzyStepsLeft: (res && res.frenzyStepsLeft) || 0,
      lastMood: "ready",
      lastBubble: ""
    };
    curTier = tierFor(node ? levelOfNode(node) : currentLevel());
    document.body.classList.add("ody-in-session");
    document.body.dataset.scene = "session";
    const main = $("app-main");
    main.innerHTML = `
      <div class="ody-ses ${SES.hearts ? "is-boss" : ""} ${SES.exam ? "is-exam" : ""}" id="ody-ses">
        <div class="ody-ses-top">
          <button type="button" class="ody-ses-back" data-a="quit" title="Sauvegarder et revenir à la carte (Échap)">← <span>Carte</span></button>
          <button type="button" class="ody-ses-prev" id="ody-prev-btn" data-a="prev" title="Revenir à l'étape précédente (Alt+←)" ${SES.i === 0 || SES.exam ? "disabled" : ""}>◀ <span>Préc.</span></button>
          <div class="ody-prog-wrap">
            <div class="ody-prog"><div class="ody-prog-fill" id="ody-prog"></div></div>
            <span class="ody-step-num" id="ody-step-num">${SES.i + 1} / ${SES.steps.length}</span>
          </div>
          <div class="ody-hearts" id="ody-hearts"></div>
          <div class="ody-combo" id="ody-combo"></div>
          ${relicToolbarHtml()}
        </div>
        <div class="ody-stage" id="ody-stage"></div>
        <div class="ody-foot" id="ody-foot"></div>
      </div>`;
    window.scrollTo(0, 0);
    if (res && hasPartialProgress(res)) toast("▶ Session reprise", `${node ? node.title + " · " : ""}Étape ${SES.i + 1} sur ${SES.steps.length}`, "💾");
    savePartial(false);
    renderStep();
  }
  function updateTop() {
    if (!SES) return;
    const p = $("ody-prog"); if (p) p.style.width = `${Math.round((SES.i / SES.steps.length) * 100)}%`;
    const sn = $("ody-step-num"); if (sn) sn.textContent = `${SES.i + 1} / ${SES.steps.length}`;
    const pb = $("ody-prev-btn"); if (pb) pb.disabled = SES.i <= 0 || !!SES.exam;
    const maxH = (SAVE().perks && SAVE().perks.sceauSorbonne) ? 4 : 3;
    const h = $("ody-hearts"); if (h) h.innerHTML = SES.hearts == null ? "" : "❤️".repeat(Math.max(0, SES.hearts)) + `<span class="dim">${"🖤".repeat(Math.max(0, maxH - SES.hearts))}</span>`;
    const c = $("ody-combo"); if (c) c.innerHTML = SES.combo >= 3 ? `🔥 ${SES.combo}` : "";
  }
  function foot(html) { const f = $("ody-foot"); if (f) { f.className = "ody-foot"; f.innerHTML = `<div class="ody-foot-in">${html}</div>`; } }
  const btnCont = (label) => `<button class="ody-btn primary" data-a="next" id="ody-primary">${label || L("cont")} ▸</button>`;

  function prev() {
    if (!SES || SES.i <= 0 || SES.exam) return;
    clearStepTimers();
    stopAudio(); micStop();
    SES.i -= 1;
    renderStep();
  }

  function renderStep() {
    if (!SES) return;
    clearStepTimers();
    const st = cur();
    if (!st) return finishSession();
    SES.answered = false; SES.stepT0 = Date.now(); st._tries = st._tries || 0;
    updateTop();
    savePartial(false);
    const stage = $("ody-stage");
    SES.lastMood = "ready";
    SES.lastBubble = "";
    const R = RENDER[st.k] || RENDER.unknown;
    const showDiorama = st.k !== "explore";
    const revBanner = st._resolved ? `<div class="ody-rewind-banner">👁️ Révision de l'étape précédente (déjà validée — réécoutez l'audio ou cliquez Continuer ▸)</div>` : "";
    stage.innerHTML = `${showDiorama ? renderDiorama(st) : ""}<div class="ody-card ody-k-${st.k}">${revBanner}${R(st)}</div>`;
    const rBar = $("ody-relics");
    if (rBar) rBar.outerHTML = relicToolbarHtml();
    stage.scrollTop = 0;
    if (st._resolved) {
      SES.answered = true;
      stage.querySelectorAll(".ody-choice, .ody-tile, .ody-mt, .swipe-btn, .vis-opt").forEach((b) => { b.disabled = true; });
      feedback(!!st._resolved.ok, st._resolved.info || {});
    } else {
      (AFTER[st.k] || (() => {}))(st);
    }
    // prefetch audio for the next few steps
    for (let j = SES.i + 1; j < Math.min(SES.steps.length, SES.i + 4); j++) { const n = SES.steps[j]; if (n && n.fr) prefetch(n.fr); if (n && n.npc) prefetch(n.npc); }
  }
  function next() {
    if (!SES) return;
    clearStepTimers();
    stopAudio(); micStop();
    if (SES.hearts === 0) return bossFail();
    SES.i += 1;
    if (SES.i >= SES.steps.length) return finishSession();
    renderStep();
  }
  function retryClone(st) {
    const c = Object.assign({}, st, { retry: true, _tries: 0, _sel: null, _done: null, _miss: 0, _picked: st.k === "periode" ? [] : null, _val: "", _vanished: false, _lastHit: 0, _phase: 0, _chain: [] });
    if (c.choices) c.choices = shuffle(c.choices);
    if (c.tiles) c.tiles = shuffle(c.tiles);
    if (c.k === "match") c.pairs = c.pairs.slice();
    return c;
  }
  function resolve(ok, info = {}) {
    if (!SES || SES.answered) return;
    clearStepTimers();
    SES.answered = true;
    const st = cur(); const first = !st.retry; const ms = Date.now() - SES.stepT0;
    info.why = explainStep(st, ok, info);
    st._resolved = { ok: !!ok, info: { title: info.title, note: info.note, answer: info.answer, why: info.why } };
    const stepCefr = (st.card && st.card.cefr) || st.level || (SES.node ? SES.node.cefr : null);
    if (GRADABLE.has(st.k) && !info.ungraded) {
      if (first) { SES.graded += 1; if (ok) SES.right += 1; }
      if (st.sec) { const s = SES.secs[st.sec] = SES.secs[st.sec] || { n: 0, ok: 0 }; s.n += 1; if (ok) s.ok += 1; }
      skillAdd(st.skill, ok, stepCefr);
      const recFr = (st.card && st.card.fr) || (typeof st.a === "string" ? st.a : "") || st.fr || "";
      const recEn = (st.card && st.card.en) || st.en || st.q || "";
      if (recFr && window.recordLearningOutcome && SES.mode !== "placement") {
        const vfx = window.RPG_VFX; const ft = vfx && vfx.floatText;
        if (vfx) vfx.floatText = () => {};
        try {
          const catSkill = Array.isArray(st.skill) ? st.skill[0] : st.skill;
          window.recordLearningOutcome({ fr: recFr, en: recEn, stageId: SES.node && SES.node.stage ? SES.node.stage.stageId : undefined, worldNum: SES.node && SES.node.world ? SES.node.world.number : undefined, cefr: (st.card && st.card.cefr) || st.level || (SES.node ? SES.node.cefr : "A1"), category: catSkill }, ok, ms);
        } catch (e) {}
        finally { if (vfx) vfx.floatText = ft; }
      }
    }
    if (ok) {
      const c = CH(), s = SAVE();
      c.totalStepsRight = (c.totalStepsRight || 0) + 1;
      SES.combo += 1; SES.bestCombo = Math.max(SES.bestCombo, SES.combo);
      const baseGain = (first ? 10 : 5) + (SES.combo >= 5 ? 5 : SES.combo >= 3 ? 2 : 0);
      const isFrenzy = (SES.frenzyStepsLeft || 0) > 0;
      const mult = (SES.critMult || 1) * (isFrenzy ? 2 : 1);
      const gain = Math.round(baseGain * mult);
      SES.critMult = 1;
      SES.xp += gain;
      if (isFrenzy) {
        s.gold = (s.gold || 0) + 10;
        SES.frenzyStepsLeft = Math.max(0, SES.frenzyStepsLeft - 1);
      } else {
        c.frenzyCharges = (c.frenzyCharges || 0) + 1;
        if (c.frenzyCharges >= 5) {
          c.frenzyCharges = 0;
          SES.frenzyStepsLeft = 3;
          toast("⚡ SURCHARGE DOPAMINE ACTIVÉE !", "5 réponses justes ! XP ×2 & +10 Or par étape sur vos 3 prochaines actions !", "⚡");
        }
      }
      SES.combo >= 3 ? SFX.combo(SES.combo) : SFX.ok();
      if (window.RPG_VFX && window.RPG_VFX.burst) window.RPG_VFX.burst(window.innerWidth * 0.5, window.innerHeight * 0.42, isFrenzy ? "#fde047" : "#34d399", SES.combo >= 3 ? 24 : 12);
      if (window.RPG_VFX && window.RPG_VFX.floatText) window.RPG_VFX.floatText(`+${gain} XP${isFrenzy ? " ⚡×2 +10🪙" : ""}${mult > 1 && !isFrenzy ? " 🧪CRIT!" : ""}${SES.combo >= 3 ? `  🔥${SES.combo}` : ""}`, isFrenzy ? "#fde047" : "#4ade80");
    } else {
      SES.combo = 0; SFX.bad();
      SES.critMult = 1;
      if (SES.hearts != null) {
        if (SES.shielded) {
          SES.shielded = false;
          info.note = (info.note ? info.note + " · " : "") + "🛡️ Votre Bouclier a absorbé l'erreur !";
        } else {
          SES.hearts = Math.max(0, SES.hearts - 1);
        }
      }
      if (!SES.exam && SES.hearts == null && first && !st.noRetry && GRADABLE.has(st.k)) SES.steps.push(retryClone(st));
    }
    SES.lastMood = ok ? "happy" : "recast";
    const bubbleEl = $("ody-npc-bubble");
    if (bubbleEl) {
      const plainWhy = (info.why || info.note || (ok ? "Bravo ! Continuez sur cet élan." : "Observons la tournure exacte ensemble.")).replace(/\*\*/g, "");
      bubbleEl.textContent = plainWhy;
    }
    const rBar = $("ody-relics");
    if (rBar) rBar.outerHTML = relicToolbarHtml();
    updateTop();
    savePartial(true);
    feedback(ok, info);
  }
  function feedback(ok, info) {
    const st = cur();
    const f = $("ody-foot"); if (!f) return;
    const theme = sceneThemeFor(SES.node, SES.mode, st);
    const npcName = (theme && theme.npc && theme.npc.name) || "Guide";
    const title = info.title || (ok ? pick(PRAISE) : pick(OOPS));
    let body = "";
    if (info.note) body += `<div class="fb-note">${info.note}</div>`;
    if (!ok && info.answer) body += `<div class="fb-ans"><span>Tournure attendue :</span> <b class="fr-tap" data-a="say" data-t="${esc(info.answer)}">${esc(info.answer)} 🔊</b></div>`;
    if (info.why) body += `<div class="fb-why"><span class="fb-npc-tag">💬 ${esc(npcName)} :</span> ${rich(info.why)}</div>`;
    if (info.extra) body += info.extra;
    // Active 4-Skill Production Anchor (Speak + Write from memory) on recognition steps
    const prodTarget = st && (st.nativeFr || st.fullFr || (looksFrench(info.answer) ? info.answer : "") || (looksFrench(st.fr) ? st.fr : ""));
    if (prodTarget && st && !["type", "dictee", "memory", "speak", "speakfree", "write", "simturn", "shadow"].includes(st.k)) {
      body += `<div class="fb-active-anchor" id="fb-active-anchor">
        <span class="fb-anc-lbl">⚡ Ancrage Actif (Parler &amp; Écrire) :</span>
        <button type="button" class="ody-btn tiny ghost fb-echo-btn" data-a="fbecho" data-t="${esc(prodTarget)}">🎙️ Dire à voix haute (+10 XP)</button>
        <button type="button" class="ody-btn tiny ghost fb-write-btn" data-a="fbwrite" data-t="${esc(prodTarget)}">✍️ Écrire de mémoire (+10 XP)</button>
        <div class="fb-prod-out" id="fb-prod-out"></div>
      </div>`;
    }
    const lastHeart = SES.hearts === 0;
    f.className = `ody-foot fb ${ok ? "ok" : "bad"}`;
    f.innerHTML = `<div class="ody-foot-in">
      <div class="fb-main"><div class="fb-title">${ok ? "✅" : "🧭"} ${esc(title)}</div>${body}</div>
      <div class="fb-actions">
        <button class="ody-btn ${ok ? "primary" : "danger"}" data-a="next" id="ody-primary">${lastHeart ? "…" : L("cont")} ▸</button>
      </div></div>`;
    setTimeout(() => { const b = $("ody-primary"); if (b) b.focus({ preventScroll: true }); }, 30);
  }

  // ----------------------------------------------------------------- renderers
  const camille = (sz = "") => `<img class="ody-cam ${sz}" src="${PORTRAIT}" alt="Camille">`;
  const audioBtns = (fr, big) => `<div class="ody-audio ${big ? "big" : ""}"><button class="ody-play" data-a="play" title="Listen 1.0x (Space)">🔊</button><button class="ody-slow" data-a="slow" title="Slowly 0.7x (Shift+Space)">🐢</button><button class="ody-fast" data-a="fast" title="Vitesse Parisienne 1.25x (Touche F)">⚡</button></div>`;
  const RENDER = {
    unknown: () => `<p>…</p>`,
    intro(st) {
      const n = SES.node; const meta = n ? KIND_META[n.kind] || {} : { icon: "🔁", label: "Review" };
      return `<div class="ody-intro">
        ${st.boss ? `<div class="ody-boss-emblem">🐉</div>` : camille("xl")}
        <div class="ody-kind">${meta.icon || ""} ${esc(meta.label || "")}${n ? ` · ${esc(levelOfNode(n))}` : ""}${n && n.unitObj && n.unitObj.num ? ` · World ${n.unitObj.num}` : ""}</div>
        <h2>${esc(st.title)}</h2>
        ${st.place ? `<div class="ody-place">${esc(st.place)}</div>` : ""}
        ${st.goal ? `<p class="ody-goal">🎯 ${esc(st.goal)}</p>` : ""}
        ${st.exam ? `<p class="ody-goal small">Listening · Dictation · Grammar · Reading · Writing · Speaking. Pass mark: ${Math.round(((EXAMS()[st.level] || {}).passMark || 0.7) * 100)}%.</p>` : ""}
      </div>`;
    },
    banner(st) { return `<div class="ody-banner-step"><div class="bn-t">${esc(st.text)}</div><div class="bn-s">${esc(st.sub || "")}</div></div>`; },
    teach(st) {
      st._rev = st._rev || 0;
      const bubbles = st.parts.slice(0, st._rev + 1).map((p, i) => `<div class="ody-bubble ${st.tip ? "tip" : ""} ${i === st._rev ? "fresh" : ""}">${st.tip && i === 0 ? "💡 " : ""}${rich(p)}</div>`).join("");
      return `<div class="ody-teach">${camille()}<div class="ody-bubbles">${bubbles}</div></div>`;
    },
    example(st) {
      return `<div class="ody-example ${st.dialogue ? "dlg" : ""}">
        <div class="ody-k-label">${st.dialogue ? "🎧 " + L("listen") : "✨ " + L("newWord")}</div>
        <div class="ody-ex-fr" data-a="play">${esc(st.fr)}</div>
        ${st.en ? `<div class="ody-ex-en">${esc(st.en)}</div>` : ""}
        ${st.note ? `<div class="ody-ex-note">${rich(st.note)}</div>` : ""}
        <div class="ody-row">${audioBtns(st.fr)}<button class="ody-btn mic small" data-a="mic" title="Say it">🎙️ ${L("repeat")}</button></div>
        <div class="ody-mic-out" id="ody-mic-out"></div>
      </div>`;
    },
    mcq(st) {
      const head = st.def ? `<div class="ody-q">${L("define")}</div><div class="ody-def">« ${esc(st.def)} »</div>` : st.prompt === "cloze" ? `<div class="ody-q">${L("cloze")}</div><div class="ody-big">${st.qHtml}</div>` : st.qHtml ? `<div class="ody-q">${st.qHtml}</div>` : `<div class="ody-q">${L(st.prompt || "whatMeans")}</div>`;
      const big = st.big ? `<div class="ody-big ${st.fr ? "fr" : ""}" ${st.fr ? `data-a="play"` : ""}>${esc(st.big)}${st.fr ? " 🔊" : ""}</div>` : "";
      const passage = st.passage ? `<details class="ody-passage" ${SES.steps.indexOf(st) > 0 && SES.steps[SES.steps.indexOf(st) - 1].k === "reading" ? "" : ""}><summary>📄 ${esc(st.passage.title || "Text")} — reread</summary><div class="ody-passage-text">${readingHtml(st.passage.text)}</div></details>` : "";
      return `${passage}${head}${big}<div class="ody-choices n${st.choices.length}">${choicesHtml(st)}</div>`;
    },
    listen(st) {
      const head = st.q ? `<div class="ody-q">${esc(st.q)}</div>` : `<div class="ody-q">${L(st.mode === "heard" ? "listenPick" : "listenMean")}</div>`;
      return `${head}<div class="ody-listen-hero">${audioBtns(st.fr, true)}</div><div class="ody-choices n${st.choices.length}">${choicesHtml(st)}</div>`;
    },
    build(st) {
      st._picked = st._picked || [];
      const used = new Set(st._picked);
      return `<div class="ody-q">${L("build")}</div>
        <div class="ody-big">${esc(st.en)}</div>
        <div class="ody-build-ans" id="ody-build-ans">${st._picked.map((ti, j) => `<button class="ody-tile in" data-a="untile" data-j="${j}">${esc(st.tiles[ti])}</button>`).join("") || `<span class="ody-ph">Tap the words below</span>`}</div>
        <div class="ody-build-bank">${st.tiles.map((w, ti) => `<button class="ody-tile ${used.has(ti) ? "used" : ""}" data-a="tile" data-ti="${ti}" ${used.has(ti) ? "disabled" : ""}>${esc(w)}</button>`).join("")}</div>`;
    },
    type(st) {
      const head = st.qHtml ? `<div class="ody-q">${st.qHtml}</div>` : `<div class="ody-q">${L(st.prompt || "type")}</div><div class="ody-big">${esc(st.q)}</div>`;
      const hideFirst = !st._showLetters;
      const wl = liveWordLockHtml(firstAlt(st.answer), st._val || "", hideFirst);
      return `${head}
        <div class="ody-wordlocks" id="ody-wordlocks" data-target="${esc(firstAlt(st.answer))}" data-hide="${hideFirst ? "1" : "0"}">${wl.html}</div>
        <input class="ody-input" id="ody-in" autocomplete="off" spellcheck="false" placeholder="Écrivez de mémoire en français… chaque mot juste se verrouille en vert" value="${esc(st._val || "")}">
        ${accentBar("ody-in")}
        <div class="ody-row" style="gap:.65rem;margin-top:.25rem">
          <button type="button" class="ody-link" data-a="letterhint">💡 ${st._showLetters ? "1res lettres révélées ✓" : "Indice : révéler la 1re lettre de chaque mot"}</button>
          ${st.hint ? `<button type="button" class="ody-link" data-a="hint">📘 Règle grammaticale</button>` : ""}
        </div>
        <div class="ody-hint" id="ody-hint"></div>`;
    },
    dictee(st) {
      const wl = liveWordLockHtml(st.fr, st._val || "", true);
      return `<div class="ody-q">${L("dictee")}</div><div class="ody-listen-hero">${audioBtns(st.fr, true)}</div>
        <div class="ody-wordlocks" id="ody-wordlocks" data-target="${esc(st.fr)}" data-hide="1">${wl.html}</div>
        <input class="ody-input" id="ody-in" autocomplete="off" spellcheck="false" placeholder="Listen & lock every word…" value="${esc(st._val || "")}">
        ${accentBar("ody-in")}`;
    },
    shadow(st) {
      const wl = liveWordLockHtml(st.fr, st._val || "", false);
      return `<div class="ody-shadow">
        <div class="ody-k-label">🎙️ Rhythm Shadowing · Listen, match the melody, then echo</div>
        <div class="ody-shadow-chunks" id="ody-shadow-chunks">${(st.chunks || [st.fr]).map((ch, idx) => `<span class="sh-chunk" data-ci="${idx}" data-a="say" data-t="${esc(ch)}">${esc(ch)}</span>`).join("")}</div>
        ${st.en ? `<div class="ody-ex-en" style="margin-bottom:.7rem">${esc(st.en)}</div>` : ""}
        <div class="ody-row">${audioBtns(st.fr)}<button class="ody-btn mic small" data-a="shadowmic" id="ody-mic-btn">🎙️ Echo aloud</button></div>
        <div class="ody-mic-out" id="ody-mic-out"></div>
        <div class="ody-wordlocks" id="ody-wordlocks" data-target="${esc(st.fr)}" data-hide="0" style="margin-top:.75rem">${wl.html}</div>
        <input class="ody-input" id="ody-in" autocomplete="off" spellcheck="false" placeholder="Or type from rhythm memory to lock words…" value="${esc(st._val || "")}">
        ${accentBar("ody-in")}
      </div>`;
    },
    memory(st) {
      const hideFirst = !st._showLetters;
      const wl = liveWordLockHtml(st.fr, st._val || "", hideFirst);
      return `<div class="ody-memory">
        <div class="ody-k-label">🧠 Flash-Burn Memory · Imprint then reconstruct from zero</div>
        <div class="ody-big">${esc(st.en)}</div>
        <div class="ody-memory-flash ${st._vanished ? "vanished" : ""}" id="ody-mem-box">
          <div class="mem-chunks">${(st.chunks || [st.fr]).map((ch) => `<span>${esc(ch)}</span>`).join("")}</div>
          <div class="mem-cue" id="ody-mem-cue">${st._vanished ? "✨ Disparu de l'écran — reconstruisez de mémoire pure ci-dessous !" : "👀 Mémorisez le rythme… disparition dans 2,6s"}</div>
        </div>
        <div class="ody-wordlocks" id="ody-wordlocks" data-target="${esc(st.fr)}" data-hide="${hideFirst ? "1" : "0"}">${wl.html}</div>
        <input class="ody-input" id="ody-in" autocomplete="off" spellcheck="false" placeholder="Reconstruct the French phrase from memory…" value="${esc(st._val || "")}">
        ${accentBar("ody-in")}
        <div class="ody-row" style="gap:.65rem;margin-top:.25rem">
          <button type="button" class="ody-link" data-a="peek">👁️ Revoir 1,2s</button>
          <button type="button" class="ody-link" data-a="letterhint">💡 ${st._showLetters ? "1res lettres révélées ✓" : "Indice : 1re lettre"}</button>
        </div>
      </div>`;
    },
    reflex(st) {
      const isFrQ = st.prompt !== "howSay";
      const head = st.prompt === "next" ? L("next") : L(st.prompt || "howSay");
      return `<div class="ody-reflex">
        <div class="ody-reflex-top">
          <span class="ody-k-label">⚡ Réflexe Natif · Strike before the bar drains!</span>
          <span class="ody-reflex-sec" id="ody-reflex-sec">${((st.timeLimit || 6000) / 1000).toFixed(1)}s</span>
        </div>
        <div class="ody-reflex-bar"><div class="ody-reflex-fill" id="ody-reflex-fill"></div></div>
        <div class="ody-q">${head}</div>
        <div class="ody-big ${isFrQ ? "fr" : ""}" ${isFrQ ? `data-a="play"` : ""}>${esc(st.big)}${isFrQ ? " 🔊" : ""}</div>
        <div class="ody-choices n${st.choices.length}">${st.choices.map((c, i) => `<button class="ody-choice" data-a="reflexpick" data-i="${i}"><span class="n">${i + 1}</span>${esc(c)}</button>`).join("")}</div>
      </div>`;
    },
    simturn(st) {
      const th = sceneThemeFor(SES && SES.node, SES && SES.mode, st);
      const npcImg = st.npcImg || (th && th.npc && th.npc.img) || PORTRAIT;
      const bgImg = (th && th.bg) || "assets/bg_cafe.jpg";
      return `<div class="ody-simturn">
        <div class="bd-comic-panel" style="background-image:url('${bgImg}')">
          <div class="bd-comic-shade"></div>
          <div class="bd-comic-top">
            <span class="bd-place-tag">📍 ${esc(st.place || (th && th.place) || "Paris")}</span>
            <button type="button" class="ody-btn tiny ghost" data-a="toggleblur">🎧 ${st._blur ? "Texte masqué (Oreille pure)" : "Masquer le texte"}</button>
          </div>
          <div class="bd-comic-body">
            <img src="${npcImg}" class="bd-npc-portrait" alt="Interlocuteur" onerror="this.src='${PORTRAIT}'">
            <div class="bd-speech-bubble ${st._blur ? "is-blurred" : ""}" data-a="playnpc">
              <div class="bd-speech-fr">${esc(st.npc)} <span class="ody-mini">🔊</span></div>
              ${st.npc_en ? `<div class="ody-npc-en">${esc(st.npc_en)}</div>` : ""}
              <div class="bd-speech-controls">
                <button type="button" class="ody-btn tiny ghost" data-a="playnpc">🔊 1.0x</button>
                <button type="button" class="ody-btn tiny ghost" data-a="slow">🐢 0.7x</button>
                <button type="button" class="ody-btn tiny ghost" data-a="fast">⚡ 1.25x</button>
              </div>
            </div>
          </div>
        </div>
        <div class="ody-k-label">🎭 Live Improv · Répondez en français (oral ou clavier) avec ces repères :</div>
        <div class="ody-kw" id="ody-sim-kw">${(st.keywords || []).map((k) => `<span class="ody-kwc" data-kw="${esc(k)}">${esc(k)}</span>`).join("")}</div>
        <input class="ody-input" id="ody-in" autocomplete="off" spellcheck="false" placeholder="Réponds en français…" value="${esc(st._val || "")}">
        ${accentBar("ody-in")}
        <div class="ody-row"><button class="ody-btn mic small" data-a="simmic" id="ody-mic-btn">🎙️ Speak your reply</button></div>
        <div class="ody-mic-out" id="ody-mic-out"></div>
      </div>`;
    },
    speak(st) {
      return `<div class="ody-q">${st.lead ? rich(st.lead) : L("speak")}</div>
        <div class="ody-ex-fr" data-a="play">${esc(st.fr)}</div>
        ${st.en ? `<div class="ody-ex-en">${esc(st.en)}</div>` : ""}
        <div class="ody-row center">${audioBtns(st.fr)}</div>
        <button class="ody-mic-big" data-a="mic" id="ody-mic-btn"><span>🎙️</span><small>${micSupported() ? "Tap and speak" : "Record yourself"}</small></button>
        <div class="ody-mic-out" id="ody-mic-out"></div>`;
    },
    match(st) {
      st._done = st._done || {}; st._miss = st._miss || 0;
      if (!st._L) { st._L = shuffle(st.pairs.map((p, i) => i)); st._R = shuffle(st.pairs.map((p, i) => i)); }
      return `<div class="ody-q">${L("match")}</div><div class="ody-match">
        <div class="col">${st._L.map((i) => `<button class="ody-mt fr ${st._done[i] ? "done" : ""} ${st._sel === "L" + i ? "sel" : ""}" data-a="mt" data-s="L" data-i="${i}" ${st._done[i] ? "disabled" : ""}>${esc(st.pairs[i].fr)}</button>`).join("")}</div>
        <div class="col">${st._R.map((i) => `<button class="ody-mt en ${st._done[i] ? "done" : ""} ${st._sel === "R" + i ? "sel" : ""}" data-a="mt" data-s="R" data-i="${i}" ${st._done[i] ? "disabled" : ""}>${esc(st.pairs[i].en)}</button>`).join("")}</div>
      </div>`;
    },
    dialogue(st) {
      const showEn = curTier === 0 || st._en;
      const th = sceneThemeFor(SES && SES.node, SES && SES.mode, st);
      const npcImg = st.npcImg || (th && th.npc && th.npc.img) || PORTRAIT;
      const bgImg = (th && th.bg) || "assets/bg_cafe.jpg";
      return `<div class="ody-dlg">
        <div class="bd-comic-panel" style="background-image:url('${bgImg}')">
          <div class="bd-comic-shade"></div>
          <div class="bd-comic-top">
            <span class="bd-place-tag">📍 ${esc(st.place || (th && th.place) || "Paris")}</span>
            <button type="button" class="ody-btn tiny ghost" data-a="toggleblur">🎧 ${st._blur ? "Afficher le texte" : "Mode Oreille Pure"}</button>
          </div>
          <div class="bd-comic-body">
            <img src="${npcImg}" class="bd-npc-portrait" alt="Interlocuteur" onerror="this.src='${PORTRAIT}'">
            <div class="bd-speech-bubble ${st._blur ? "is-blurred" : ""}" data-a="playnpc">
              <div class="bd-speech-fr">${esc(st.npc)} <span class="ody-mini">🔊</span></div>
              ${showEn ? `<div class="ody-npc-en">${esc(st.npc_en || "")}</div>` : `<button class="ody-link" data-a="dlgen">EN</button>`}
              <div class="bd-speech-controls">
                <button type="button" class="ody-btn tiny ghost" data-a="playnpc">🔊 1.0x</button>
                <button type="button" class="ody-btn tiny ghost" data-a="slow">🐢 0.7x</button>
                <button type="button" class="ody-btn tiny ghost" data-a="fast">⚡ 1.25x</button>
              </div>
            </div>
          </div>
        </div>
        <div class="ody-q">${L("reply")}</div>
        <div class="ody-choices col">${st.options.map((o, i) => `<button class="ody-choice" data-a="dlgpick" data-i="${i}"><span class="n">${i + 1}</span>${esc(o.fr)}</button>`).join("")}</div>
      </div>`;
    },
    reading(st) {
      const gl = (st.glossary || []).map((g) => { const fr = g.fr || g.word || g.term || ""; const en = g.en || g.def || g.meaning || ""; return fr ? `<span class="ody-gl" title="${esc(en)}"><b>${esc(fr)}</b> ${esc(en)}</span>` : ""; }).join("");
      return `<div class="ody-reading">
        <div class="ody-k-label">📰 ${L("read")} · ${esc(st.genre || "")}</div>
        <h3>${esc(st.title)}</h3>
        <div class="ody-row"><button class="ody-btn small" data-a="readall">🔊 Listen to the whole text</button><button class="ody-btn small ghost" data-a="stopaudio">⏹</button></div>
        <div class="ody-read-text">${readingHtml(st.text)}</div>
        ${gl ? `<div class="ody-gloss"><div class="ody-k-label">Glossaire</div>${gl}</div>` : ""}
        <div class="ody-tip-line">Tap any sentence to hear it.</div>
      </div>`;
    },
    write(st) {
      const prompt = curTier === 0 ? `${esc(st.prompt_en)}<div class="ody-sub-fr">${esc(st.prompt_fr || "")}</div>` : `${esc(st.prompt_fr || st.prompt_en)}${curTier === 1 ? `<div class="ody-sub-en">${esc(st.prompt_en)}</div>` : ""}`;
      const must = (st.must_use || st.checklist || []).map((m) => `<li>${esc(m)}</li>`).join("");
      const builders = (st.builders || []).map((b) => `<button type="button" class="ody-builder-chip" data-a="usebuilder" data-b="${esc(b.fr)}" title="${esc(b.en || "")}">✒️ ${esc(b.fr)} <small>${esc(b.en || "")}</small></button>`).join("");
      return `<div class="ody-write">
        <div class="ody-k-label">✍️ ${L("write")}${st.task_type ? " · " + esc(st.task_type) : ""} · min ${st.minWords || 20} words</div>
        <div class="ody-q">${prompt}</div>
        ${must ? `<ul class="ody-must">${must}</ul>` : ""}
        ${builders ? `<div class="ody-builders"><div class="ody-k-label">Tournures & Connecteurs C1/C2 (cliquez pour insérer)</div><div class="ody-builders-row">${builders}</div></div>` : ""}
        ${st.starter_fr ? `<div class="ody-starter">Amorcer avec : <i>${esc(st.starter_fr)}</i> <button class="ody-link" data-a="usestarter">insérer</button></div>` : ""}
        <textarea class="ody-ta" id="ody-ta" spellcheck="false" placeholder="Écrivez votre texte en français…">${esc(st._text || "")}</textarea>
        ${accentBar("ody-ta")}
        <div class="ody-row between"><span class="ody-wc" id="ody-wc">0 / ${st.minWords || 20} words</span>
        ${!st.exam && st.model_fr ? `<button class="ody-link" data-a="showmodel">👀 Voir un modèle C2</button>` : ""}</div>
        <div id="ody-model"></div>
        <div id="ody-grade"></div>
      </div>`;
    },
    quest(st) {
      const regBadge = (r) => {
        const k = String(r || "").toLowerCase();
        const cls = k.includes("soutenu") || k.includes("diplomat") || k.includes("formel") ? "reg-soutenu" : k.includes("familier") || k.includes("argot") || k.includes("direct") ? "reg-familier" : "reg-standard";
        return `<span class="ody-reg-badge ${cls}">${esc(r || "Standard")}</span>`;
      };
      const place = st.place || st.districtTitle || "Paris";
      const setting = st.situation || st.setting || "";
      const speaker = st.npcName || st.speaker || "Interlocuteur";
      return `<div class="ody-quest-card">
        <div class="ody-k-label">🏙️ Scène Interactive · ${esc(place)}${st.targetReg ? ` · Registre attendu : ${esc(st.targetReg)}` : ""}</div>
        ${setting ? `<div class="ody-ctx">📍 ${esc(setting)}</div>` : ""}
        <div class="ody-npc">
          <div class="ody-avatar">${st.npcAvatar || "🗣️"}</div>
          <div class="ody-bubble">
            <div class="ody-speaker">${esc(speaker)} <button class="ody-btn tiny" data-a="playnpc">🔊</button></div>
            <div class="ody-npc-fr">${esc(st.npc)}</div>
            ${curTier === 0 || st._en ? `<div class="ody-npc-en">${esc(st.npc_en || "")}</div>` : (st.npc_en ? `<button class="ody-link" data-a="dlgen">Voir le sens en anglais</button>` : "")}
          </div>
        </div>
        <div class="ody-quest-hint">Choisissez la réplique dont le <b>registre</b> et la <b>nuance</b> conviennent à la situation :</div>
        <div class="ody-choices">${(st.options || []).map((o, i) => `<button class="ody-choice ody-quest-opt" data-a="questpick" data-i="${i}">
          <span class="n">${i + 1}</span>
          <span class="quest-opt-body">
            ${regBadge(o.reg || o.register)}
            <span class="quest-opt-fr">${esc(o.fr)}</span>
          </span>
        </button>`).join("")}</div>
      </div>`;
    },
    register(st) {
      const badge = (st.mode === "spoken2std" || st.mode === "std2spoken" || st.subkind === "spoken") ? "🗣️ Français Parlé vs Soutenu" : "✒️ Alchimie des Registres C1/C2";
      const qText = st.q || `Transposez vers le registre « ${st.targetReg || "Soutenu / C2"} » :`;
      const srcFr = st.sourceFr || st.casual_fr || "";
      const srcEn = st.sourceEn || st.en || "";
      return `<div class="ody-register-card">
        <div class="ody-k-label">${badge}</div>
        <div class="ody-q">${esc(qText)}</div>
        ${srcFr ? `<div class="ody-reg-source"><span class="reg-src-lbl">Point de départ :</span> <b>${esc(srcFr)}</b> ${st.fr ? `<button class="ody-btn tiny" data-a="play">🔊</button>` : ""}</div>` : ""}
        ${srcEn ? `<div class="ody-sub-en">${esc(srcEn)}</div>` : ""}
        <div class="ody-choices">${choicesHtml(st)}</div>
      </div>`;
    },
    radio(st) {
      const title = st.showName || st.showTitle || "📻 Radio Lumière";
      const sub = st.epTitle || st.host || "Direct de Paris";
      const audioTxt = st.audioText || st.fr || st.q || "";
      const transTxt = st.transcript || st.summaryFr || st.fr || "";
      return `<div class="ody-radio-card">
        <div class="ody-k-label">${esc(title)}</div>
        <div class="ody-radio-console">
          <div class="radio-wave"><span></span><span></span><span></span><span></span><span></span></div>
          <div class="radio-meta">
            <b>🎙️ ${esc(sub)}</b>
            <small>${esc(st.speed || "Cadence directe")}</small>
          </div>
          <div class="ody-row">
            <button class="ody-btn small primary" data-a="say" data-t="${esc(audioTxt)}">🔊 Écouter l'extrait</button>
            <button class="ody-btn small ghost" data-a="slow">🐢 Cadence lente</button>
            <button class="ody-btn small ghost" data-a="radiotext">${st._showText ? "🙈 Masquer" : "📜 Transcription"}</button>
          </div>
        </div>
        ${st._showText ? `<div class="ody-radio-transcript">${esc(transTxt)}</div>` : ""}
        <div class="ody-q">${esc(st.q)}</div>
        ${st.q_en ? `<div class="ody-sub-en">${esc(st.q_en)}</div>` : ""}
        <div class="ody-choices">${choicesHtml(st)}</div>
      </div>`;
    },
    enquete(st) {
      return `<div class="ody-enquete-card">
        <div class="ody-k-label">🕵️ L'Enquête Stylistique · ${esc(st.title || "Inspection de manuscrit")} (${esc(st.level || "B2")})</div>
        <div class="ody-q">Un solécisme, faux ami ou piège d'accord s'est glissé dans ce texte. Touchez le segment fautif (1–4) :</div>
        ${st.en ? `<div class="ody-sub-en">Sens visé : « ${esc(st.en)} »</div>` : ""}
        <div class="ody-enquete-doc">
          ${(st.segments || []).map((seg, i) => `<button type="button" class="ody-choice enq-seg" data-a="sleuthpick" data-i="${i}">
            <span class="n">${i + 1}</span>
            <span class="enq-seg-txt">${esc(seg)}</span>
          </button>`).join("")}
        </div>
      </div>`;
    },
    liaison(st) {
      return `<div class="ody-liaison-card">
        <div class="ody-k-label">👄 L'Atelier du Souffle &amp; des Liaisons · ${esc(st.level || "B1")}</div>
        <div class="ody-ex-fr" data-a="play">${esc(st.fr)} 🔊</div>
        ${st.en ? `<div class="ody-ex-en">${esc(st.en)}</div>` : ""}
        <div class="ody-row" style="margin:.45rem 0 .7rem">${audioBtns(st.fr)}</div>
        <div class="ody-q">${esc(st.q)}</div>
        <div class="ody-choices">${choicesHtml(st)}</div>
      </div>`;
    },
    forgeron(st) {
      return `<div class="ody-forgeron-card">
        <div class="ody-k-label">⚒️ La Forge des Verbes en Contexte · ${esc(st.verbGroup || "Conjugaison")}</div>
        <div class="forgeron-anvil">
          <div class="forgeron-head">
            <span class="forgeron-verb">🔥 ${esc(st.verbTitle)}</span>
            <span class="forgeron-tense">Temps : <b>${esc(st.tenseName)}</b></span>
          </div>
          <div class="forgeron-cue">${esc(st.cueFr || "En contexte :")} <b>« ${esc(st.en)} »</b></div>
        </div>
        <div class="ody-q">Frappez la forme conjuguée exacte sur l'enclume (1–4) :</div>
        <div class="ody-choices n${(st.choices || []).length}">${choicesHtml(st)}</div>
      </div>`;
    },
    joute(st) {
      const rounds = st.rounds || [];
      const phIdx = clamp(st._phase || 0, 0, Math.max(0, rounds.length - 1));
      const curRd = rounds[phIdx] || { phase: "1. Concession", prompt: "", options: [] };
      const chain = Array.isArray(st._chain) ? st._chain : [];
      const stepsBar = rounds.map((r, idx) => `<span class="joute-step-pill ${idx < phIdx ? "done" : idx === phIdx ? "cur" : ""}">${idx < phIdx ? "✓ " : ""}${esc(r.phase)}</span>`).join("");
      const chainHtml = chain.length ? `<div class="joute-chain">${chain.map((ch) => `<div class="joute-chain-item" data-a="say" data-t="${esc(ch.fr)}"><b>${esc(ch.phase)} :</b> « ${esc(ch.fr)} » 🔊</div>`).join("")}</div>` : "";
      return `<div class="ody-joute-card">
        <div class="ody-k-label">⚖️ La Joute Oratoire Contradictoire · ${esc(st.topic || "Débat Dialectique")} (${esc(st.level || "C1")})</div>
        <div class="joute-thesis">
          <div class="joute-speaker">🎙️ Thèse de <b>${esc(st.speaker || "Votre interlocuteur")}</b> <button type="button" class="ody-btn tiny" data-a="play">🔊 Écouter</button></div>
          <div class="joute-thesis-fr">« ${esc(st.thesisFr || st.fr)} »</div>
          ${st.thesisEn ? `<div class="joute-thesis-en">${esc(st.thesisEn)}</div>` : ""}
        </div>
        <div class="joute-steps-bar">${stepsBar}</div>
        ${chainHtml}
        <div class="ody-q">${esc(curRd.phase)} — ${esc(curRd.prompt)}</div>
        <div class="ody-choices">${(curRd.options || []).map((o, i) => `<button type="button" class="ody-choice joute-opt" data-a="joutepick" data-i="${i}">
          <span class="n">${i + 1}</span>
          <span class="joute-opt-txt">${esc(o.fr)}</span>
        </button>`).join("")}</div>
      </div>`;
    },
    idiome(st) {
      return `<div class="ody-idiome-card">
        <div class="ody-k-label">🎭 L'Atelier des Idiomes, Litotes &amp; Sous-Entendus · ${esc(st.category || "Pragmatique")} (${esc(st.level || "B2")})</div>
        <div class="idiome-stage">
          <div class="idiome-head">
            <span class="idiome-badge">💎 « ${esc(st.idiomFr)} »</span>
            <span class="idiome-lit">${esc(st.literalEn || "")}</span>
          </div>
          <div class="idiome-quote">
            <div class="idiome-speaker">🗣️ <b>${esc(st.speaker || "Interlocuteur")}</b> · <small>${esc(st.place || "Paris")}</small> <button type="button" class="ody-btn tiny" data-a="play">🔊 Écouter</button></div>
            <div class="idiome-context-fr">« ${esc(st.contextFr || st.fr)} »</div>
            ${st.contextEn ? `<div class="idiome-context-en">${esc(st.contextEn)}</div>` : ""}
          </div>
        </div>
        <div class="ody-q">${esc(st.q)}</div>
        <div class="ody-choices">${(st.choices || []).map((c, i) => `<button type="button" class="ody-choice idiome-opt" data-a="idiomepick" data-i="${i}">
          <span class="n">${i + 1}</span>
          <span class="idiome-opt-txt">${esc(c)}</span>
        </button>`).join("")}</div>
      </div>`;
    },
    synthese(st) {
      const sA = st.sourceA || { author: "Texte A", fr: "" };
      const sB = st.sourceB || { author: "Texte B", fr: "" };
      return `<div class="ody-synthese-card">
        <div class="ody-k-label">📰 La Synthèse Critique · Croisement de Sources (${esc(st.level || "C1")}) · ${esc(st.topic || "Débat")}</div>
        <div class="synthese-grid">
          <div class="synthese-doc doc-a">
            <div class="synthese-doc-h"><b>📄 ${esc(sA.author)}</b> <button type="button" class="ody-btn tiny" data-a="say" data-t="${esc(sA.fr)}">🔊</button></div>
            <div class="synthese-doc-txt">« ${esc(sA.fr)} »</div>
          </div>
          <div class="synthese-doc doc-b">
            <div class="synthese-doc-h"><b>📄 ${esc(sB.author)}</b> <button type="button" class="ody-btn tiny" data-a="say" data-t="${esc(sB.fr)}">🔊</button></div>
            <div class="synthese-doc-txt">« ${esc(sB.fr)} »</div>
          </div>
        </div>
        <div class="ody-q">${esc(st.q)}</div>
        <div class="ody-choices">${(st.choices || []).map((c, i) => `<button type="button" class="ody-choice synthese-opt" data-a="synthesepick" data-i="${i}">
          <span class="n">${i + 1}</span>
          <span class="synthese-opt-txt">${esc(c)}</span>
        </button>`).join("")}</div>
      </div>`;
    },
    periode(st) {
      const clauses = st.clauses || [];
      const picked = Array.isArray(st._picked) ? st._picked : [];
      const curSlot = picked.length;
      const slotsHtml = clauses.map((cl, idx) => {
        const isLocked = idx < curSlot;
        const isCur = idx === curSlot;
        return `<div class="periode-slot ${isLocked ? "locked" : isCur ? "cur" : ""}">
          <span class="periode-role">${idx + 1}. ${esc(String(cl.role || "").replace(/^\d+\.\s*/, ""))}</span>
          <span class="periode-txt">${isLocked ? `« ${esc(cl.fr)} » ✓` : isCur ? "⟵ Choisissez cette proposition ci-dessous…" : "…"}</span>
        </div>`;
      }).join("");
      const order = Array.isArray(st.order) && st.order.length === clauses.length ? st.order : clauses.map((_, i) => i);
      const bankHtml = order.map((origIdx, dispIdx) => {
        const cl = clauses[origIdx] || { role: "", fr: "" };
        const used = picked.includes(origIdx);
        return `<button type="button" class="ody-choice periode-opt ${used ? "used" : ""}" data-a="periodepick" data-ci="${origIdx}" ${used ? "disabled" : ""}>
          <span class="n">${dispIdx + 1}</span>
          <span class="periode-opt-body">
            <small class="periode-opt-role">${esc(cl.role)}</small>
            <span class="periode-opt-fr">${esc(cl.fr)}</span>
          </span>
        </button>`;
      }).join("");
      return `<div class="ody-periode-card">
        <div class="ody-k-label">✒️ L'Architecte de la Phrase · La Période Oratoire (${esc(st.level || "C1")}) · ${esc(st.title || "Architecture Syntaxique")}</div>
        ${st.en ? `<div class="ody-sub-en" style="margin-bottom:.45rem">Sens global visé : « ${esc(st.en)} »</div>` : ""}
        <div class="periode-parchment">
          <div class="periode-parchment-h">📜 Le Parchemin de la Période (${curSlot}/${clauses.length} propositions scellées)</div>
          <div class="periode-slots">${slotsHtml}</div>
        </div>
        <div class="ody-q">Posez la proposition <b>#${Math.min(curSlot + 1, clauses.length)} (${esc((clauses[curSlot] && clauses[curSlot].role) || "Clausule")})</b> sur le parchemin :</div>
        <div class="ody-choices">${bankHtml}</div>
      </div>`;
    },
    concordance(st) {
      const stemHtml = esc(st.stemFr || "").replace("___", `<span class="forgeron-blank">___</span>`);
      return `<div class="ody-concordance-card">
        <div class="ody-k-label">⚡ Le Tribunal des Modes · Indicatif vs Subjonctif (${esc(st.level || "B2")})</div>
        <div class="conc-trigger-bar">
          <span class="conc-trig-pill">🔑 Déclencheur : <b>« ${esc(st.trigger)} »</b></span>
          <span class="conc-mode-pill">⚖️ Mode requis : <b>${esc(st.modeLabel || "Concordance")}</b></span>
        </div>
        <div class="conc-stem">${stemHtml}</div>
        ${st.en ? `<div class="ody-sub-en" style="margin:.35rem 0 .55rem">Sens : « ${esc(st.en)} »</div>` : ""}
        <div class="ody-q">Tranchez : quelle forme verbale respecte la concordance des modes et des temps ?</div>
        <div class="ody-choices n${(st.choices || []).length}">${(st.choices || []).map((c, i) => `<button type="button" class="ody-choice conc-opt" data-a="concordancepick" data-i="${i}">
          <span class="n">${i + 1}</span>
          <span class="conc-opt-txt">${esc(c)}</span>
        </button>`).join("")}</div>
      </div>`;
    },
    ame(st) {
      const showEn = cefrRank(st.level) <= 1 || st._enHelp;
      return `<div class="ody-ame-card">
        <div class="ody-row between">
          <div class="ody-k-label">🇫🇷 L'Âme Française · ${esc(st.pillar)} (${esc(st.level || "A1")})</div>
          <button type="button" class="ody-btn tiny ghost" data-a="toggleenhelp">🇬🇧 ${showEn ? "Aide EN active ✓" : "Aide Débutant (EN)"}</button>
        </div>
        <div class="ame-meta-row">
          <span class="ame-place-pill">📍 ${esc(st.place || "Paris")}</span>
          <span class="ame-spk-pill">🗣️ ${esc(st.speaker || "Habitant")}</span>
        </div>
        <div class="ame-compare">
          <div class="ame-box textbook">
            <div class="ame-box-lbl">📘 Manuel Scolaire (Raide)</div>
            <div class="ame-box-txt">« ${esc(st.textbookFr)} »</div>
          </div>
          <div class="ame-arrow">➔</div>
          <div class="ame-box native">
            <div class="ame-box-lbl">🇫🇷 Vrai Français Natif <button type="button" class="ody-btn tiny ghost" data-a="say" data-t="${esc(st.nativeFr)}">🔊 Écouter</button></div>
            <div class="ame-box-txt">« ${esc(st.nativeFr)} »</div>
            ${st.phoneticHint ? `<div class="ame-phonetic">👄 Cadence : <b>${esc(st.phoneticHint)}</b></div>` : ""}
          </div>
        </div>
        ${st.en ? `<div class="ody-sub-en" style="margin:.25rem 0 .45rem">🇬🇧 Meaning &amp; Nuance : « ${esc(st.en)} »</div>` : ""}
        <div class="ame-secret">
          <b>🗝️ Code Social &amp; Secret Culturel :</b> ${esc(st.culturalSecret)}
        </div>
        <div class="ody-q" style="margin-top:.55rem">${esc(st.question)}${showEn ? `<div class="ody-sub-en" style="margin-top:.2rem">🇬🇧 Pick the most natural, authentic French response a native Parisian would say in this situation:</div>` : ""}</div>
        <div class="ody-choices n${(st.choices || []).length}">${(st.choices || []).map((c, i) => `<button type="button" class="ody-choice ame-opt" data-a="amepick" data-i="${i}">
          <span class="n">${i + 1}</span>
          <span class="conc-opt-txt">${esc(c)}</span>
        </button>`).join("")}</div>
      </div>`;
    },
    pensee(st) {
      const showEn = cefrRank(st.level) <= 1 || st._enHelp;
      return `<div class="ody-pensee-card">
        <div class="ody-row between">
          <div class="ody-k-label">🧠 Fabrique de Pensée Directe · Zéro Traduction (${esc(st.level || "A1")} · ${esc(st.category)})</div>
          <button type="button" class="ody-btn tiny ghost" data-a="toggleenhelp">🇬🇧 ${showEn ? "Aide EN active ✓" : "Aide Débutant (EN)"}</button>
        </div>
        <div class="pensee-scene-box">
          <div class="pensee-visual-wrap">
            <img class="pensee-scene-thumb" src="${(sceneThemeFor(SES && SES.node, SES && SES.mode, st) || {}).bg || "assets/bg_cafe.jpg"}" alt="Scène mentale" onerror="this.style.display='none'">
            <div class="pensee-icons">${esc(st.sceneIcon || "💭🇫🇷")}</div>
          </div>
          <div class="pensee-clues">
            <div class="pensee-clues-lbl">🔍 Indices Mentaux 100% Français (Cliquez pour écouter 🔊) :</div>
            <div class="pensee-clues-pills">
              ${(st.indicesFr || []).map((cl) => `<span class="pensee-clue-pill" data-a="say" data-t="${esc(cl)}">💭 ${esc(cl)} 🔊</span>`).join("")}
            </div>
            ${showEn && st.mentalImageEn ? `<div class="pensee-img-en">🎬 ${esc(st.mentalImageEn)}</div>` : ""}
          </div>
        </div>
        <div class="ody-q" style="margin-top:.55rem">${esc(st.promptFr)}${showEn ? `<div class="ody-sub-en" style="margin-top:.2rem">🇬🇧 Direct-Thought Goal: Express this mental image directly in natural French (avoid the word-for-word English translation trap!):</div>` : ""}</div>
        <div class="ody-choices n${(st.choices || []).length}">${(st.choices || []).map((c, i) => `<button type="button" class="ody-choice pensee-opt" data-a="penseepick" data-i="${i}">
          <span class="n">${i + 1}</span>
          <span class="conc-opt-txt">${esc(c)}</span>
        </button>`).join("")}</div>
      </div>`;
    },
    speakfree(st) {
      const prompt = curTier === 0 ? `${esc(st.prompt_en)}<div class="ody-sub-fr">${esc(st.prompt_fr || "")}</div>` : `${esc(st.prompt_fr || st.prompt_en)}${curTier === 1 ? `<div class="ody-sub-en">${esc(st.prompt_en)}</div>` : ""}`;
      const minW = Math.max(12, Math.round((st.seconds || 45) * 0.45));
      const curTxt = st._transcript || "";
      const kws = (st.keywords && st.keywords.length) ? st.keywords : ["d'abord", "cependant", "en effet", "pour conclure"];
      return `<div class="ody-speakfree">
        <div class="ody-k-label">🎙️ ${L("talk")} · Tribune Oratoire (${st.seconds || 45}s · cible ~${minW} mots)</div>
        ${!st.exam && st.model_fr && cefrRank(st.level) <= 2 ? `<button class="ody-link" data-a="say" data-t="${esc(st.model_fr)}">👂 Écouter un modèle oral d'abord</button>` : ""}
        <div class="ody-q">${prompt}</div>
        <div class="ody-k-label" style="margin-top:.35rem">Mots-clés &amp; Connecteurs Oratoires (cliquez pour insérer ou prononcez-les) :</div>
        <div class="ody-kw" id="ody-sf-kw">${kws.map((k) => `<button type="button" class="ody-kwc" data-a="usesfkw" data-kw="${esc(k)}">🎙️ ${esc(k)}</button>`).join("")}</div>
        <div class="ody-sf-controls">
          <button type="button" class="ody-mic-big" data-a="sfmic" id="ody-mic-btn"><span>🎙️</span><small>${micSupported() ? "Parler au micro" : "Enregistrer ma voix"}</small></button>
          <div class="ody-sf-studio">
            <textarea class="ody-ta" id="ody-sf-ta" rows="4" spellcheck="false" placeholder="Parlez au micro ou composez votre prise de parole ici en français…">${esc(curTxt)}</textarea>
            ${accentBar("ody-sf-ta")}
            <div class="ody-row between" style="margin-top:.3rem">
              <span class="ody-wc" id="ody-sf-wc">${words(curTxt).length} / ${minW} mots</span>
              <div class="ody-row">
                <button type="button" class="ody-btn tiny ghost" data-a="sfsay">🔊 Écouter ma réplique</button>
                ${!st.exam && st.model_fr ? `<button type="button" class="ody-link" data-a="showsfmodel">👀 Modèle oral</button>` : ""}
              </div>
            </div>
          </div>
        </div>
        <div class="ody-sf-timer" id="ody-sf-timer"></div>
        <div class="ody-sf-live" id="ody-sf-live"></div>
        <div id="ody-grade"></div>
      </div>`;
    },
    explore(st) {
      st._seen = st._seen || {};
      st._phase = st._phase || "discover";
      st._huntIdx = st._huntIdx || 0;
      const hs = st.hotspots || [];
      const seenCount = Object.keys(st._seen).length;
      const hunts = st.hunts || [];
      const curHuntId = hunts[st._huntIdx];
      const curHunt = hs.find((h) => h.id === curHuntId);
      const isHunt = st._phase === "hunt" && !!curHunt;
      const pinsHtml = hs.map((h) => {
        const isSeen = !!st._seen[h.id];
        return `<button type="button" class="hs-pin ${isSeen ? "seen" : ""} ${isHunt ? "hunt-mode" : ""}" style="left:${h.x}%;top:${h.y}%" data-a="taphotspot" data-hid="${esc(h.id)}" title="${isHunt ? "Toucher l'objet" : esc(h.fr)}">
          <span class="hs-dot">${h.icon || "✨"}</span>
          ${!isHunt && isSeen ? `<span class="hs-lbl">${esc(h.fr)}</span>` : ""}
        </button>`;
      }).join("");
      return `<div class="ody-explore-card">
        <div class="exp-top">
          <div class="exp-npc">
            <img src="${st.npc || PORTRAIT}" class="exp-npc-img" alt="${esc(st.npcName || "Parisien")}" onerror="this.src='${PORTRAIT}'">
            <div>
              <div class="ody-k-label">🗺️ REGARDER &amp; TOUCHER (${esc(st.level || "A1")}) · ${esc(st.place || "")} · ZÉRO ANGLAIS</div>
              <h3>${esc(st.title)}</h3>
            </div>
          </div>
          <div class="exp-phase-pill">${isHunt ? `🎯 Chasse Audio ${st._huntIdx + 1}/${hunts.length}` : `🔍 Découverte ${seenCount}/${hs.length}`}</div>
        </div>
        ${isHunt ? `<div class="exp-hunt-bar">
          <button type="button" class="ody-btn primary small" data-a="hearhunt">🔊 Écouter la demande</button>
          <button type="button" class="ody-btn ghost small" data-a="hearhunt" data-r="0.7">🐢 0.7x</button>
          <button type="button" class="ody-btn ghost small" data-a="hearhunt" data-r="1.25">⚡ 1.25x</button>
          <span class="exp-hunt-cue">🎧 Touchez directement dans l'image ce que le Parisien demande !</span>
        </div>` : `<div class="exp-intro-bar">
          <span>👆 Touchez les objets directement dans la scène pour les entendre en français (${seenCount}/${hs.length} découverts)</span>
          <button type="button" class="ody-btn primary small" data-a="starthunt" id="exp-start-hunt">🎯 Lancer la Chasse Audio ▸</button>
        </div>`}
        <div class="exp-canvas-wrap" id="exp-canvas-wrap">
          <img src="${st.bg}" class="exp-bg-img" alt="${esc(st.title)}">
          <div class="exp-pin-layer">${pinsHtml}</div>
        </div>
        <div class="exp-callout" id="exp-callout">${st._lastCallout || `💬 ${esc(st.introFr || "Touchez un point lumineux dans l'image !")}`}</div>
      </div>`;
    },
    visreflex(st) {
      const opts = st.options || [];
      return `<div class="ody-visreflex-card">
        <div class="ody-k-label">👁️ VOIR &amp; ENTENDRE (${esc(st.level || "A1")}) · ZÉRO TRADUCTION</div>
        <div class="ody-q">🎧 Écoutez le Parisien et touchez la scène correspondante !</div>
        <div class="ody-listen-hero">${audioBtns(st.fr, true)}</div>
        <div class="vis-grid">
          ${opts.map((o, i) => `<button type="button" class="vis-opt" data-a="vispick" data-i="${i}">
            <img src="${o.bg}" alt="${esc(o.labelFr)}" class="vis-opt-img">
            <span class="vis-opt-cap"><span class="n">${i + 1}</span> ${esc(o.labelFr)}</span>
          </button>`).join("")}
        </div>
      </div>`;
    },
    swipe(st) {
      return `<div class="ody-swipe-card" id="ody-swipe-card">
        <div class="ody-k-label">${esc(st.deckTitle || "⚡ Arcade Swipe Réflexe")} · Niveau ${esc(st.level || "A1")}</div>
        <div class="swipe-lanes">
          <button type="button" class="swipe-btn left" data-a="swipepick" data-side="left">${esc(st.leftLabel || "⬅️ Gauche")}</button>
          <button type="button" class="swipe-btn right" data-a="swipepick" data-side="right">${esc(st.rightLabel || "Droite ➡️")}</button>
        </div>
        <div class="swipe-stage" id="ody-swipe-stage">
          <div class="swipe-pill-sub">${esc(st.sub || "Glissez la carte ou tapez ⬅️ / ➡️")}</div>
          <div class="swipe-prompt">${esc(st.prompt)}</div>
          <div class="swipe-hint">👆 Glissez à gauche/droite sur tablette · Clavier : ⬅️ ou ➡️</div>
        </div>
      </div>`;
    }
  };
  function readingHtml(text) {
    return String(text || "").split(/\n+/).filter((p) => p.trim()).map((p) =>
      `<p>${(p.match(/[^.!?…]+[.!?…]*\s*»?\s*/g) || [p]).map((s) => `<span class="ody-sent" data-a="say" data-t="${esc(s.trim())}">${esc(s)}</span>`).join("")}</p>`).join("");
  }
  function choicesHtml(st) {
    return st.choices.map((c, i) => `<button class="ody-choice" data-a="choose" data-i="${i}"><span class="n">${i + 1}</span>${esc(c)}</button>`).join("");
  }
  // after-render hooks: autoplay, focus, footer
  const AFTER = {
    intro(st) { foot(`<span class="ody-foot-hint">${SES.steps.length} steps</span>${btnCont(st.exam ? "Start the exam" : st.boss ? "Fight" : "Start")}`); if (st.boss) SFX.tone(110, 0.5, "sawtooth", 0.05); },
    banner() { foot(btnCont()); SFX.tap(); },
    teach(st) {
      foot(btnCont());
      if (CH().autoAudio) { const bits = frBits(st.parts[st._rev || 0]); const joined = bits.join(" … "); if (bits.length && joined.length <= 140) speak(joined); }
    },
    example(st) { foot(btnCont()); if (CH().autoAudio) speak(st.fr); },
    mcq(st) { foot(`<span class="ody-foot-hint">Keys 1–${st.choices.length}</span>`); if (st.fr && CH().autoAudio) speak(st.fr); },
    listen(st) { foot(`<button class="ody-btn ghost" data-a="cantlisten">🔇 Can't listen now</button>`); setTimeout(() => speak(st.fr), 250); },
    build() { foot(`<button class="ody-btn ghost" data-a="giveup">I don't know</button><button class="ody-btn primary" data-a="check" id="ody-primary">${L("check")}</button>`); },
    type(st) { foot(`<button class="ody-btn ghost" data-a="giveup">I don't know</button><button class="ody-btn primary" data-a="check" id="ody-primary">${L("check")}</button>`); bindInputSave(st); focusIn(); },
    dictee(st) { foot(`<button class="ody-btn ghost" data-a="giveup">I don't know</button><button class="ody-btn primary" data-a="check" id="ody-primary">${L("check")}</button>`); setTimeout(() => speak(st.fr), 250); bindInputSave(st); focusIn(); },
    shadow(st) {
      foot(`<button class="ody-btn ghost" data-a="shadowheard">🎙️ I echoed aloud</button><button class="ody-btn primary" data-a="check" id="ody-primary">${L("check")}</button>`);
      STEP_TIMERS.tos.push(setTimeout(() => speak(st.fr), 180));
      const chEls = Array.from(document.querySelectorAll("#ody-shadow-chunks .sh-chunk"));
      let tOff = 220;
      chEls.forEach((el) => {
        const dur = Math.max(650, words(el.textContent).length * 420);
        STEP_TIMERS.tos.push(setTimeout(() => { chEls.forEach((x) => x.classList.remove("speaking")); el.classList.add("speaking"); }, tOff));
        tOff += dur;
      });
      STEP_TIMERS.tos.push(setTimeout(() => { chEls.forEach((x) => x.classList.remove("speaking")); }, tOff + 300));
      bindInputSave(st); focusIn();
    },
    memory(st) {
      foot(`<button class="ody-btn ghost" data-a="giveup">I don't know</button><button class="ody-btn primary" data-a="check" id="ody-primary">${L("check")}</button>`);
      if (!st._vanished) {
        STEP_TIMERS.tos.push(setTimeout(() => speak(st.fr), 150));
        STEP_TIMERS.tos.push(setTimeout(() => {
          st._vanished = true;
          const box = $("ody-mem-box"); if (box) box.classList.add("vanished");
          const cue = $("ody-mem-cue"); if (cue) cue.textContent = "✨ Vanished from screen — recall it from memory below!";
          const inp = $("ody-in"); if (inp) inp.focus();
        }, 2600));
      }
      bindInputSave(st); focusIn();
    },
    reflex(st) {
      foot(`<span class="ody-foot-hint">⚡ Keys 1–${st.choices.length} · Under 3.2s = +15 Bonus XP</span>`);
      if (st.prompt !== "howSay" && st.fr) STEP_TIMERS.tos.push(setTimeout(() => speak(st.fr), 120));
      const limit = st.timeLimit || 6000;
      const iv = setInterval(() => {
        if (!SES || SES.answered || cur() !== st) { clearInterval(iv); return; }
        const left = Math.max(0, limit - (Date.now() - SES.stepT0));
        const fill = $("ody-reflex-fill");
        const sec = $("ody-reflex-sec");
        if (fill) { fill.style.width = `${(left / limit) * 100}%`; fill.classList.toggle("low", left < 2200); }
        if (sec) sec.textContent = `${(left / 1000).toFixed(1)}s`;
        if (left <= 0) {
          clearStepTimers();
          document.querySelectorAll(".ody-choice").forEach((b, j) => { b.disabled = true; if (normLoose(st.choices[j]) === normLoose(st.answer)) b.classList.add("right"); });
          speak(st.answer);
          resolve(false, { title: "⏱️ Too slow — build that automatic reflex!", answer: st.answer, why: st.why || "" });
        }
      }, 50);
      STEP_TIMERS.ivs.push(iv);
    },
    simturn(st) {
      foot(`<button class="ody-btn ghost" data-a="giveup">See model reply</button><button class="ody-btn primary" data-a="check" id="ody-primary">✓ Send reply</button>`);
      STEP_TIMERS.tos.push(setTimeout(() => speak(st.npc), 220));
      bindInputSave(st);
      if ($("ody-sim-kw") && st._val) markKeywords(st, st._val);
      focusIn();
    },
    speak(st) { foot(`<button class="ody-btn ghost" data-a="skipspeak">🔇 Can't speak now</button>`); if (CH().autoAudio) speak(st.fr); },
    match() { foot(`<span class="ody-foot-hint">Tap a French phrase, then its meaning</span>`); },
    dialogue(st) { foot(`<span class="ody-foot-hint">Keys 1–${st.options.length}</span>`); setTimeout(() => speak(st.npc), 250); },
    quest(st) { foot(`<span class="ody-foot-hint">Touches 1–${(st.options || []).length} · Choisissez le registre adapté</span>`); setTimeout(() => speak(st.npc), 220); },
    register(st) { foot(`<span class="ody-foot-hint">Touches 1–${(st.choices || []).length} · Identifiez la nuance exacte</span>`); if (st.fr && CH().autoAudio) setTimeout(() => speak(st.fr), 220); },
    radio(st) { foot(`<span class="ody-foot-hint">📻 Écoutez l'émission puis répondez (1–${(st.choices || []).length})</span>`); setTimeout(() => speak(st.audioText || st.fr), 240); },
    enquete(st) { foot(`<span class="ody-foot-hint">🕵️ Touches 1–${(st.segments || []).length} · Touchez le segment contenant l'erreur</span>`); },
    liaison(st) { foot(`<span class="ody-foot-hint">👄 Touches 1–${(st.choices || []).length} · Écoutez la prosodie et identifiez la liaison</span>`); if (st.fr) setTimeout(() => speak(st.fr), 220); },
    forgeron(st) { foot(`<span class="ody-foot-hint">⚒️ Touches 1–${(st.choices || []).length} · Frappez la forme conjuguée exacte</span>`); },
    joute(st) { foot(`<span class="ody-foot-hint">⚖️ Mouvement ${(st._phase || 0) + 1}/${(st.rounds || []).length || 3} · Construisez la dialectique française (Touches 1–3)</span>`); if ((st._phase || 0) === 0 && st.thesisFr) setTimeout(() => speak(st.thesisFr), 220); },
    idiome(st) { foot(`<span class="ody-foot-hint">🎭 Touches 1–${(st.choices || []).length} · Décodez le sous-entendu ou l'expression idiomatique</span>`); if (st.contextFr) setTimeout(() => speak(st.contextFr), 220); },
    synthese(st) { foot(`<span class="ody-foot-hint">📰 Touches 1–${(st.choices || []).length} · Croisez les deux textes en une synthèse exacte</span>`); },
    periode(st) {
      const picked = Array.isArray(st._picked) ? st._picked : [];
      foot(`<span class="ody-foot-hint">✒️ Proposition ${picked.length + 1}/${(st.clauses || []).length || 4} · Assemblez la période oratoire dans l'ordre rhétorique exact</span>`);
    },
    concordance(st) {
      foot(`<span class="ody-foot-hint">⚡ Touches 1–${(st.choices || []).length} · Déclencheur « ${esc(st.trigger)} » → tranchez le mode et le temps exacts</span>`);
    },
    ame(st) {
      foot(`<span class="ody-foot-hint">🇫🇷 Touches 1–${(st.choices || []).length} · Adoptez le réflexe culturel et l'oralité d'un vrai Français</span>`);
      if (st.nativeFr) setTimeout(() => speak(st.nativeFr), 220);
    },
    pensee(st) {
      foot(`<span class="ody-foot-hint">🧠 Touches 1–${(st.choices || []).length} · Pensez directement en français sans traduire de l'anglais</span>`);
    },
    reading() { foot(btnCont("Questions")); },
    write(st) {
      foot(`<button class="ody-btn primary" data-a="writesubmit" id="ody-primary">✓ Correct my text</button>`);
      const ta = $("ody-ta"); if (ta) { ta.addEventListener("input", () => updWc(st)); updWc(st, true); setTimeout(() => ta.focus(), 50); }
    },
    speakfree(st) {
      foot(`<button class="ody-btn ghost" data-a="skipspeakfree">🔇 Passer</button><button class="ody-btn primary" data-a="sfsubmit" id="ody-primary">✓ Valider ma prise de parole</button>`);
      const ta = $("ody-sf-ta");
      if (ta) {
        const minW = Math.max(12, Math.round((st.seconds || 45) * 0.45));
        const syncSf = (skipSave) => {
          st._transcript = ta.value;
          const n = words(ta.value).length;
          const wc = $("ody-sf-wc");
          if (wc) { wc.textContent = `${n} / ${minW} mots`; wc.classList.toggle("ok", n >= minW); }
          markKeywords(st, ta.value);
          if (!skipSave) savePartial(false);
        };
        ta.addEventListener("input", () => syncSf(false));
        syncSf(true);
      }
    },
    explore(st) {
      foot(`<span class="ody-foot-hint">🗺️ Touchez les objets directement dans la scène · Zéro anglais</span>`);
      if (st._phase === "hunt") {
        const curH = (st.hotspots || []).find((h) => h.id === (st.hunts || [])[st._huntIdx || 0]);
        if (curH) STEP_TIMERS.tos.push(setTimeout(() => speak(curH.huntFr || curH.spokenFr), 220));
      } else if (CH().autoAudio && st.introFr) {
        STEP_TIMERS.tos.push(setTimeout(() => speak(st.introFr), 220));
      }
    },
    visreflex(st) {
      foot(`<span class="ody-foot-hint">👁️ Écoutez puis touchez la bonne image (1–4)</span>`);
      STEP_TIMERS.tos.push(setTimeout(() => speak(st.fr), 220));
    },
    swipe(st) {
      foot(`<span class="ody-foot-hint">⚡ Touches ⬅️ / ➡️ ou glissez la carte sur Redmi Pad</span>`);
      const card = $("ody-swipe-stage");
      if (card) {
        let sx = 0, active = false;
        card.addEventListener("pointerdown", (e) => { sx = e.clientX; active = true; card.setPointerCapture && card.setPointerCapture(e.pointerId); });
        card.addEventListener("pointermove", (e) => {
          if (!active || SES.answered) return;
          const dx = e.clientX - sx;
          card.style.transform = `translateX(${clamp(dx, -110, 110)}px) rotate(${clamp(dx / 18, -8, 8)}deg)`;
        });
        const end = (e) => {
          if (!active) return;
          active = false;
          const dx = e.clientX - sx;
          card.style.transform = "";
          if (!SES.answered && Math.abs(dx) > 48) ACT.swipepick({ dataset: { side: dx < 0 ? "left" : "right" } });
        };
        card.addEventListener("pointerup", end);
        card.addEventListener("pointercancel", () => { active = false; card.style.transform = ""; });
      }
    }
  };
  function bindInputSave(st) {
    const inp = $("ody-in");
    if (!inp) return;
    inp.addEventListener("input", () => {
      st._val = inp.value;
      savePartial(false);
      const wbox = $("ody-wordlocks");
      if (wbox) {
        const target = wbox.dataset.target || firstAlt(st.answer) || st.fr || "";
        const res = liveWordLockHtml(target, inp.value, wbox.dataset.hide === "1");
        wbox.innerHTML = res.html;
        if (res.hit > (st._lastHit || 0)) SFX.combo(Math.min(res.hit + 1, 6));
        st._lastHit = res.hit;
      }
      if ($("ody-sim-kw")) markKeywords(st, inp.value);
    });
  }
  function focusIn() { setTimeout(() => { const i = $("ody-in"); if (i) i.focus(); }, 60); }
  function updWc(st, skipSave) { const ta = $("ody-ta"), wc = $("ody-wc"); if (!ta || !wc) return; st._text = ta.value; const n = words(ta.value).length; wc.textContent = `${n} / ${st.minWords || 20} words`; wc.classList.toggle("ok", n >= (st.minWords || 20)); if (!skipSave) savePartial(false); }

  // ----------------------------------------------------------------- actions
  const ACT = {
    say(el) { speak(el.dataset.t, +(el.dataset.r || 1)); },
    play() { const st = cur(); if (st) speak(st.fr || st.npc, 1); },
    slow() { const st = cur(); if (st) speak(st.fr || st.npc, 0.7); },
    fast() { const st = cur(); if (st) speak(st.fr || st.npc, 1.25); },
    prev() { prev(); },
    toggleblur() { const st = cur(); if (!st) return; st._blur = !st._blur; renderStep(); },
    taphotspot(el) {
      const st = cur(); if (!st || st.k !== "explore" || SES.answered) return;
      const hid = el.dataset.hid;
      const h = (st.hotspots || []).find((x) => x.id === hid);
      if (!h) return;
      st._seen = st._seen || {};
      if (st._phase !== "hunt") {
        st._seen[h.id] = true;
        st._lastCallout = `${h.icon || "✨"} <b>${esc(h.fr)}</b> — « ${esc(h.spokenFr)} » <button type="button" class="ody-btn tiny ghost" data-a="say" data-t="${esc(h.spokenFr)}">🔊</button>`;
        speak(h.spokenFr || h.fr);
        SFX.tap();
        if (window.RPG_VFX && window.RPG_VFX.burst) {
          const rect = el.getBoundingClientRect();
          window.RPG_VFX.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, "#fde047", 14);
        }
        renderStep();
        return;
      }
      const targetId = (st.hunts || [])[st._huntIdx || 0];
      const ok = h.id === targetId;
      if (ok) {
        SFX.ok();
        speak(h.fr);
        if (window.RPG_VFX && window.RPG_VFX.burst) {
          const rect = el.getBoundingClientRect();
          window.RPG_VFX.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, "#34d399", 20);
        }
        st._huntIdx = (st._huntIdx || 0) + 1;
        if (st._huntIdx >= (st.hunts || []).length) {
          st._lastCallout = `✅ Bravo ! Scène « ${esc(st.title)} » explorée et maîtrisée à l'oreille !`;
          resolve(true, { title: "🗺️ Scène Parisienne Maîtrisée !", answer: h.spokenFr, why: `Vous avez identifié « ${h.fr} » directement en français sans aucune traduction anglaise !` });
        } else {
          st._lastCallout = `✅ Exact ! « ${esc(h.fr)} » — écoutez la demande suivante !`;
          renderStep();
        }
      } else {
        SFX.bad();
        st._lastCallout = `🧭 C'était « ${esc(h.fr)} » — réécoutez la demande et touchez le bon objet !`;
        const cOut = $("exp-callout");
        if (cOut) cOut.innerHTML = st._lastCallout;
        const targetH = (st.hotspots || []).find((x) => x.id === targetId);
        if (targetH) speak(targetH.huntFr || targetH.spokenFr, 0.85);
      }
    },
    starthunt() {
      const st = cur(); if (!st || st.k !== "explore") return;
      st._phase = "hunt"; st._huntIdx = 0;
      st._lastCallout = "🎧 Chasse Audio lancée : écoutez et touchez le bon objet dans l'image !";
      renderStep();
    },
    hearhunt(el) {
      const st = cur(); if (!st || st.k !== "explore") return;
      const targetId = (st.hunts || [])[st._huntIdx || 0];
      const h = (st.hotspots || []).find((x) => x.id === targetId);
      if (h) speak(h.huntFr || h.spokenFr, +(el && el.dataset && el.dataset.r || 1));
    },
    vispick(el) {
      const st = cur(); if (!st || SES.answered) return;
      const i = +el.dataset.i;
      const chosen = (st.options || [])[i];
      if (!chosen) return;
      document.querySelectorAll(".vis-opt").forEach((b, j) => {
        b.disabled = true;
        if (st.options[j] && st.options[j].ok) b.classList.add("right");
      });
      if (!chosen.ok) el.classList.add("wrong");
      speak(st.fr);
      resolve(!!chosen.ok, {
        title: chosen.ok ? "👁️ Connexion Visuelle & Audio Parfaite !" : "🧭 Associons la scène à la phrase :",
        answer: st.fr,
        why: `Scène correspondante : ${st.answer}`
      });
    },
    swipepick(el) {
      const st = cur(); if (!st || SES.answered) return;
      const picked = el.dataset.side;
      const ok = picked === st.side;
      document.querySelectorAll(".swipe-btn").forEach((b) => {
        b.disabled = true;
        if (b.dataset.side === st.side) b.classList.add("right");
        else if (b.dataset.side === picked && !ok) b.classList.add("wrong");
      });
      if (st.fr) speak(st.fr);
      resolve(ok, {
        title: ok ? "⚡ Réflexe Éclair !" : "🧭 Voici le bon réflexe :",
        answer: st.answer,
        why: st.why || ""
      });
    },
    playnpc() { const st = cur(); if (st) speak(st.npc); },
    stopaudio() { stopAudio(); },
    readall() { const st = cur(); if (st) speak(st.text); },
    next() {
      const st = cur();
      if (st && st.k === "teach" && !SES.answered && (st._rev || 0) < st.parts.length - 1) { st._rev = (st._rev || 0) + 1; renderStep(); return; }
      if (st && st.k === "write" && !st._graded) return ACT.writesubmit();
      if (st && st.k === "speakfree" && !st._graded) return ACT.sfsubmit();
      next();
    },
    acc(el) {
      const t = $(el.dataset.target); if (!t) return;
      const s = t.selectionStart ?? t.value.length, e = t.selectionEnd ?? t.value.length;
      t.value = t.value.slice(0, s) + el.dataset.c + t.value.slice(e);
      t.focus(); t.selectionStart = t.selectionEnd = s + el.dataset.c.length;
      t.dispatchEvent(new Event("input"));
    },
    choose(el) {
      const st = cur(); if (SES.answered) return;
      const i = +el.dataset.i; const chosen = st.choices[i]; const ok = normLoose(chosen) === normLoose(st.answer) && chosen !== "I don't know";
      document.querySelectorAll(".ody-choice").forEach((b, j) => { b.disabled = true; if (normLoose(st.choices[j]) === normLoose(st.answer)) b.classList.add("right"); });
      if (!ok) el.classList.add("wrong");
      if (st.k === "liaison" && st.fr) speak(st.fr);
      else if (ok || st.sayAnswer || looksFrench(st.answer) || st.k === "register" || st.k === "radio" || st.k === "forgeron") { if (st.sayAnswer || st.k === "register" || st.k === "radio" || st.k === "forgeron" || (st.k === "mcq" && looksFrench(st.answer))) speak(st.answer); }
      const why = ok ? (st.right || (SES.exam ? "" : st.why) || "") : (st.wrong || st.why || "");
      const extra = st.full && !ok ? `<div class="fb-why">${esc(st.full)}</div>` : "";
      resolve(ok, { answer: st.answer, why: SES.mode === "placement" ? "" : why, user: chosen, q: st.big || st.q || stripTags(st.qHtml || ""), extra });
    },
    sleuthpick(el) {
      const st = cur(); if (SES.answered) return;
      const i = +el.dataset.i;
      const ok = i === st.trapIdx;
      document.querySelectorAll(".ody-choice").forEach((b, j) => {
        b.disabled = true;
        if (j === st.trapIdx) {
          b.classList.add("right");
          const txtEl = b.querySelector(".enq-seg-txt");
          if (txtEl && st.fix) txtEl.innerHTML = `<s class="enq-bad">${esc(st.segments[j])}</s> ➜ <b>${esc(st.fix)}</b>`;
        }
      });
      if (!ok) el.classList.add("wrong");
      if (st.fr) speak(st.fr);
      resolve(ok, {
        title: ok ? "🕵️ Anomalie stylistique démasquée !" : "🧭 L'anomalie se cachait dans un autre segment…",
        note: `Correction : « ${esc(st.segments[st.trapIdx])} » ➜ <b>« ${esc(st.fix)} »</b>`,
        answer: st.fr,
        why: st.why || "",
        user: st.segments[i] || "",
        q: st.en || st.title || ""
      });
    },
    joutepick(el) {
      const st = cur(); if (SES.answered) return;
      const rounds = st.rounds || [];
      const phIdx = clamp(st._phase || 0, 0, Math.max(0, rounds.length - 1));
      const curRd = rounds[phIdx];
      if (!curRd) return;
      const i = +el.dataset.i;
      const o = curRd.options && curRd.options[i];
      if (!o) return;
      const right = (curRd.options || []).find((x) => x.ok) || curRd.options[0];
      if (o.ok && phIdx + 1 < rounds.length) {
        st._chain = Array.isArray(st._chain) ? st._chain.slice() : [];
        st._chain.push({ phase: curRd.phase, fr: o.fr });
        st._phase = phIdx + 1;
        SFX.combo(phIdx + 2);
        speak(o.fr);
        SES.lastMood = "happy";
        SES.lastBubble = `${o.why || "Mouvement dialectique validé !"} Passez au mouvement ${st._phase + 1}/${rounds.length}.`;
        savePartial(false);
        rerenderKeepFoot();
        AFTER.joute(st);
        return;
      }
      document.querySelectorAll(".ody-choice").forEach((b, j) => {
        b.disabled = true;
        if (curRd.options[j] && curRd.options[j].ok) b.classList.add("right");
      });
      if (!o.ok) el.classList.add("wrong");
      speak(right.fr);
      if (o.ok) {
        st._chain = Array.isArray(st._chain) ? st._chain.slice() : [];
        st._chain.push({ phase: curRd.phase, fr: o.fr });
        CH().reputation = Math.max(0, (CH().reputation || 0) + 20);
        const repEl = $("ody-rep-val");
        if (repEl) repEl.textContent = String(CH().reputation);
      }
      const fullSynthese = (st._chain || []).map((x) => x.fr).join(" ");
      resolve(!!o.ok, {
        title: o.ok ? "⚖️ Triomphe Dialectique ! (+20 ⚜️ Réputation)" : `🧭 Rupture dialectique (${curRd.phase})`,
        note: o.ok ? `<b>Discours complet :</b> « ${esc(fullSynthese)} »` : `Mouvement attendu (${esc(curRd.phase)}) :`,
        answer: right.fr,
        why: o.why || right.why || "",
        user: o.fr,
        q: st.thesisFr
      });
    },
    questpick(el) {
      const st = cur(); if (SES.answered) return;
      const o = st.options[+el.dataset.i];
      if (!o) return;
      const right = st.options.find((x) => x.ok) || st.options[0];
      document.querySelectorAll(".ody-choice").forEach((b, j) => { b.disabled = true; if (st.options[j] && st.options[j].ok) b.classList.add("right"); });
      if (!o.ok) el.classList.add("wrong");
      const delta = typeof o.repDelta === "number" ? o.repDelta : (o.ok ? 12 : -5);
      CH().reputation = Math.max(0, (CH().reputation || 0) + delta);
      const repEl = $("ody-rep-val");
      if (repEl) repEl.textContent = String(CH().reputation);
      speak(right.fr);
      const repNote = `${delta >= 0 ? "⚜️ +" + delta : "⚠️ " + delta} Réputation (${esc(o.reg || o.register || "Standard")})`;
      resolve(!!o.ok, {
        title: o.ok ? `⚜️ Réplique magistrale ! (+${delta} Réputation)` : `🧭 Faux pas de registre (${delta} Réputation)`,
        note: repNote,
        answer: right.fr,
        why: o.why || o.feedback || st.why || "",
        user: o.fr,
        q: st.npc
      });
    },
    idiomepick(el) {
      const st = cur(); if (SES.answered) return;
      const i = +el.dataset.i;
      const chosen = st.choices[i];
      const ok = normLoose(chosen) === normLoose(st.answer);
      document.querySelectorAll(".ody-choice").forEach((b, j) => { b.disabled = true; if (normLoose(st.choices[j]) === normLoose(st.answer)) b.classList.add("right"); });
      if (!ok) el.classList.add("wrong");
      if (ok) {
        CH().reputation = Math.max(0, (CH().reputation || 0) + 15);
        const repEl = $("ody-rep-val");
        if (repEl) repEl.textContent = String(CH().reputation);
      }
      speak(st.reparteeFr || st.contextFr || st.answer);
      const repNote = st.reparteeFr ? `<div><b>Réplique d'éloquence :</b> <span class="fr-tap" data-a="say" data-t="${esc(st.reparteeFr)}">« ${esc(st.reparteeFr)} » 🔊</span></div>` : "";
      resolve(ok, {
        title: ok ? `🎭 Sous-entendu décodé ! (+15 ⚜️ Réputation)` : `🧭 Contresens pragmatique sur « ${esc(st.idiomFr || st.idiom || "")} »`,
        note: repNote,
        answer: st.answer,
        why: st.why || "",
        user: chosen,
        q: st.contextFr
      });
    },
    synthesepick(el) {
      const st = cur(); if (SES.answered) return;
      const i = +el.dataset.i;
      const chosen = st.choices[i];
      const ok = normLoose(chosen) === normLoose(st.answer);
      document.querySelectorAll(".ody-choice").forEach((b, j) => { b.disabled = true; if (normLoose(st.choices[j]) === normLoose(st.answer)) b.classList.add("right"); });
      if (!ok) el.classList.add("wrong");
      if (ok) {
        CH().reputation = Math.max(0, (CH().reputation || 0) + 15);
        const repEl = $("ody-rep-val");
        if (repEl) repEl.textContent = String(CH().reputation);
      }
      speak(st.answer);
      resolve(ok, {
        title: ok ? "📰 Synthèse Critique DALF Validée ! (+15 ⚜️ Réputation)" : "🧭 Synthèse déséquilibrée (un texte manque ou est trahi)",
        answer: st.answer,
        why: st.why || "",
        user: chosen,
        q: st.title
      });
    },
    periodepick(el) {
      const st = cur(); if (SES.answered) return;
      const clauses = st.clauses || [];
      st._picked = Array.isArray(st._picked) ? st._picked.slice() : [];
      const expectedIdx = st._picked.length;
      const chosenIdx = +el.dataset.ci;
      const chosenClause = clauses[chosenIdx] || { role: "", fr: "" };
      const expectedClause = clauses[expectedIdx] || { role: "", fr: "" };
      if (chosenIdx === expectedIdx) {
        st._picked.push(chosenIdx);
        SFX.combo(st._picked.length + 1);
        speak(chosenClause.fr);
        if (st._picked.length < clauses.length) {
          SES.lastMood = "happy";
          SES.lastBubble = `Proposition #${st._picked.length} (${chosenClause.role}) scellée ! Posez maintenant la proposition #${st._picked.length + 1}.`;
          savePartial(false);
          rerenderKeepFoot();
          AFTER.periode(st);
          return;
        }
        CH().reputation = Math.max(0, (CH().reputation || 0) + 20);
        const repEl = $("ody-rep-val");
        if (repEl) repEl.textContent = String(CH().reputation);
        resolve(true, {
          title: "✒️ Période Oratoire Scellée ! (+20 ⚜️ Réputation)",
          note: `<b>Période complète :</b> <span class="fr-tap" data-a="say" data-t="${esc(st.fullFr)}">« ${esc(st.fullFr)} » 🔊</span>`,
          answer: st.fullFr,
          why: st.why || "",
          user: st.fullFr,
          q: st.en
        });
      } else {
        document.querySelectorAll(".ody-choice").forEach((b) => {
          b.disabled = true;
          if (+b.dataset.ci === expectedIdx) b.classList.add("right");
        });
        el.classList.add("wrong");
        speak(expectedClause.fr);
        resolve(false, {
          title: `🧭 Rupture syntaxique à la proposition #${expectedIdx + 1} (${expectedClause.role})`,
          note: `Attendu en #${expectedIdx + 1} : <b>« ${esc(expectedClause.fr)} »</b>`,
          answer: st.fullFr,
          why: st.why || "",
          user: chosenClause.fr,
          q: st.en
        });
      }
    },
    concordancepick(el) {
      const st = cur(); if (SES.answered) return;
      const i = +el.dataset.i;
      const chosen = st.choices[i];
      const ok = normLoose(chosen) === normLoose(st.answer);
      document.querySelectorAll(".ody-choice").forEach((b, j) => { b.disabled = true; if (normLoose(st.choices[j]) === normLoose(st.answer)) b.classList.add("right"); });
      if (!ok) el.classList.add("wrong");
      if (ok) {
        CH().reputation = Math.max(0, (CH().reputation || 0) + 12);
        const repEl = $("ody-rep-val");
        if (repEl) repEl.textContent = String(CH().reputation);
      }
      speak(st.fullFr || st.answer);
      resolve(ok, {
        title: ok ? `⚡ Concordance Maîtrisée (${st.modeLabel}) ! (+12 ⚜️ Réputation)` : `🧭 Discordance modale après « ${esc(st.trigger)} »`,
        note: `<b>Phrase complète :</b> <span class="fr-tap" data-a="say" data-t="${esc(st.fullFr)}">« ${esc(st.fullFr)} » 🔊</span>`,
        answer: st.answer,
        why: st.why || "",
        user: chosen,
        q: st.stemFr
      });
    },
    amepick(el) {
      const st = cur(); if (SES.answered) return;
      const i = +el.dataset.i;
      const chosen = st.choices[i];
      const ok = normLoose(chosen) === normLoose(st.answer);
      document.querySelectorAll(".ody-choice").forEach((b, j) => { b.disabled = true; if (normLoose(st.choices[j]) === normLoose(st.answer)) b.classList.add("right"); });
      if (!ok) el.classList.add("wrong");
      if (ok) {
        CH().reputation = Math.max(0, (CH().reputation || 0) + 15);
        const repEl = $("ody-rep-val");
        if (repEl) repEl.textContent = String(CH().reputation);
      }
      speak(st.nativeFr || st.answer);
      resolve(ok, {
        title: ok ? `🇫🇷 Réflexe Natif Adopté (${st.pillar}) ! (+15 ⚜️ Réputation)` : `📘 Piège Scolaire ou Faux-Pas Culturel`,
        note: `<b>Vrai Français :</b> <span class="fr-tap" data-a="say" data-t="${esc(st.nativeFr)}">« ${esc(st.nativeFr)} » 🔊</span>${st.trapNote ? `<br><b>⚠️ Piège à éviter :</b> ${esc(st.trapNote)}` : ""}`,
        answer: st.answer,
        why: st.culturalSecret || "",
        user: chosen,
        q: st.question
      });
    },
    penseepick(el) {
      const st = cur(); if (SES.answered) return;
      const i = +el.dataset.i;
      const chosen = st.choices[i];
      const ok = normLoose(chosen) === normLoose(st.answer);
      document.querySelectorAll(".ody-choice").forEach((b, j) => { b.disabled = true; if (normLoose(st.choices[j]) === normLoose(st.answer)) b.classList.add("right"); });
      if (!ok) el.classList.add("wrong");
      if (ok) {
        CH().reputation = Math.max(0, (CH().reputation || 0) + 15);
        const repEl = $("ody-rep-val");
        if (repEl) repEl.textContent = String(CH().reputation);
      }
      speak(st.innerMonologueFr || st.answer);
      resolve(ok, {
        title: ok ? `🧠 Pensée Directe Câblée (${st.category}) ! (+15 ⚜️ Réputation)` : `🚫 Calque Anglais Détecté — Pensez en Français !`,
        note: `<b>Monologue intérieur français :</b> <span class="fr-tap" data-a="say" data-t="${esc(st.innerMonologueFr || st.answer)}">« ${esc(st.innerMonologueFr || st.answer)} » 🔊</span>`,
        answer: st.answer,
        why: st.whyDirect || "",
        user: chosen,
        q: st.promptFr
      });
    },
    usesfkw(el) {
      const ta = $("ody-sf-ta"); if (!ta) return;
      const kw = el.dataset.kw || "";
      const prefix = ta.value && !/\s$/.test(ta.value) ? " " : "";
      ta.value = ta.value + prefix + kw + " ";
      ta.focus();
      ta.dispatchEvent(new Event("input"));
    },
    sfsay() {
      const ta = $("ody-sf-ta");
      const st = cur();
      const txt = (ta && ta.value.trim()) || (st && st._transcript) || (st && st.model_fr) || "";
      if (txt) speak(txt);
    },
    showsfmodel() {
      const st = cur(); if (!st) return;
      showSpeakModel(st);
    },
    sfsubmit() {
      gradeSpeakFree(cur());
    },
    radiotext() {
      const st = cur(); if (!st) return;
      st._showText = !st._showText;
      savePartial(false);
      rerenderKeepFoot();
    },
    usebuilder(el) {
      const ta = $("ody-ta"); if (!ta) return;
      const phrase = el.dataset.b || "";
      const prefix = ta.value && !/\s$/.test(ta.value) ? " " : "";
      ta.value = ta.value + prefix + phrase + " ";
      ta.focus();
      ta.dispatchEvent(new Event("input"));
    },
    inspectprop(el) {
      const st = cur(); if (!SES || !st) return;
      const theme = sceneThemeFor(SES.node, SES.mode, st);
      const propsList = scenePropsFor(theme, SES.node, st);
      const idx = +el.dataset.pidx;
      const prop = propsList && propsList[idx];
      if (!prop) return;
      st._inspected = st._inspected || {};
      const c = CH();
      c.inspected = c.inspected || {};
      const firstTime = !st._inspected[prop.id] && !c.inspected[prop.id];
      st._inspected[prop.id] = true;
      c.inspected[prop.id] = true;
      if (firstTime) {
        SES.xp += 5;
        if (API().addXP) API().addXP(0, 2);
        if (window.RPG_VFX && window.RPG_VFX.floatText) window.RPG_VFX.floatText("+5 XP · +2 Or 🔍", "#fde047");
      }
      el.classList.add("inspected");
      const badge = el.querySelector(".prop-badge");
      if (badge) badge.textContent = "✓ Vu";
      speak(prop.fr);
      const out = $("ody-prop-out");
      if (out) {
        out.hidden = false;
        out.innerHTML = `<div class="prop-card-in">
          <div class="prop-card-top"><b>${prop.iconText || prop.icon} ${esc(prop.label)}</b> <button type="button" class="ody-btn tiny" data-a="say" data-t="${esc(prop.fr)}">🔊 Écouter</button></div>
          <div class="prop-card-fr">« ${esc(prop.fr)} »</div>
          <div class="prop-card-en">${esc(prop.en)}</div>
          ${prop.note ? `<div class="prop-card-note">💡 ${esc(prop.note)}</div>` : ""}
        </div>`;
      }
      savePartial(false);
    },
    userelic(el) {
      if (!SES || SES.answered) return;
      const r = el.dataset.r;
      const s = SAVE();
      s.inventory = s.inventory || {};
      const count = s.inventory[r] || 0;
      if (count <= 0) {
        toast("Relique épuisée", "Visitez la Boutique sur l'écran d'accueil pour acquérir des reliques avec votre Or.", "🏺");
        return;
      }
      const st = cur();
      if (r === "fiftyFifty") {
        const btns = Array.from(document.querySelectorAll(".ody-choice:not(:disabled)"));
        if (btns.length < 3) { toast("50/50 indisponible", "Utilisez 50/50 sur une question à choix multiples.", "⚡"); return; }
        const wrongBtns = btns.filter((b) => {
          if (st.k === "periode" && b.dataset.ci !== undefined) {
            return +b.dataset.ci !== (Array.isArray(st._picked) ? st._picked.length : 0);
          }
          if (st.k === "joute" && st.rounds && b.dataset.i !== undefined) {
            const rd = st.rounds[clamp(st._phase || 0, 0, st.rounds.length - 1)];
            return rd && rd.options && !(rd.options[+b.dataset.i] && rd.options[+b.dataset.i].ok);
          }
          if (st.trapIdx !== undefined && b.dataset.i !== undefined) return +b.dataset.i !== st.trapIdx;
          if (st.options && b.dataset.i !== undefined) return !(st.options[+b.dataset.i] && st.options[+b.dataset.i].ok);
          if (st.choices && b.dataset.i !== undefined) return normLoose(st.choices[+b.dataset.i]) !== normLoose(st.answer);
          return false;
        });
        shuffle(wrongBtns).slice(0, Math.min(2, Math.max(1, btns.length - 2))).forEach((b) => { b.disabled = true; b.classList.add("eliminated"); });
        s.inventory[r] = count - 1;
        SFX.ok();
      } else if (r === "shield") {
        if (SES.shielded) return;
        SES.shielded = true;
        s.inventory[r] = count - 1;
        SFX.ok();
        toast("🛡️ Bouclier activé", "Votre prochain faux pas sera absorbé sans perte de cœur.", "🛡️");
      } else if (r === "critElixir") {
        if (SES.critMult > 1) return;
        SES.critMult = 2.5;
        s.inventory[r] = count - 1;
        SFX.ok();
        toast("🧪 Élixir Critique actif", "XP ×2.5 sur cette étape en cas de réussite !", "🧪");
      }
      const rBar = $("ody-relics");
      if (rBar) rBar.outerHTML = relicToolbarHtml();
      savePartial(false);
    },
    dlgen() { const st = cur(); st._en = true; renderStep(); },
    dlgpick(el) {
      const st = cur(); if (SES.answered) return;
      const o = st.options[+el.dataset.i]; const right = st.options.find((x) => x.ok);
      document.querySelectorAll(".ody-choice").forEach((b, j) => { b.disabled = true; if (st.options[j].ok) b.classList.add("right"); });
      if (!o.ok) el.classList.add("wrong");
      speak(right.fr);
      resolve(!!o.ok, { answer: right.fr, why: o.why || "", user: o.fr, q: st.npc });
    },
    reflexpick(el) {
      const st = cur(); if (SES.answered) return;
      clearStepTimers();
      const i = +el.dataset.i; const chosen = st.choices[i]; const ok = normLoose(chosen) === normLoose(st.answer);
      document.querySelectorAll(".ody-choice").forEach((b, j) => { b.disabled = true; if (normLoose(st.choices[j]) === normLoose(st.answer)) b.classList.add("right"); });
      if (!ok) el.classList.add("wrong");
      speak(looksFrench(st.answer) ? st.answer : st.fr || st.answer);
      const fast = ok && (Date.now() - SES.stepT0 < 3200);
      if (fast) SES.xp += 15;
      resolve(ok, { title: fast ? "⚡ RÉFLEXE NATIF ! (+15 Bonus XP)" : undefined, answer: st.answer, why: st.why || "", user: chosen, q: st.big || "" });
    },
    peek() {
      const st = cur(); const box = $("ody-mem-box");
      if (!box || SES.answered) return;
      box.classList.remove("vanished");
      const cue = $("ody-mem-cue"); if (cue) cue.textContent = "👁️ Peeking for 1.2s…";
      speak(st.fr);
      STEP_TIMERS.tos.push(setTimeout(() => {
        if (!SES || SES.answered || cur() !== st) return;
        st._vanished = true;
        box.classList.add("vanished");
        if (cue) cue.textContent = "✨ Vanished again — recall it from memory below!";
        const inp = $("ody-in"); if (inp) inp.focus();
      }, 1200));
    },
    shadowheard() {
      const st = cur(); if (SES.answered) return;
      SES.spoke += 1;
      resolve(true, { title: "🎙️ Rhythm locked!", note: `<span class="fr-tap" data-a="say" data-t="${esc(st.fr)}">${esc(st.fr)} 🔊</span>` });
    },
    shadowmic() {
      const st = cur(); if (SES.answered) return;
      if (!micSupported()) return recordFallback(st, false);
      micUi("on", `<span class="listening">🎙️ Listening… echo the rhythm now</span>`);
      micListen({
        onInterim: (t) => micUi("on", `<span class="listening">🎙️ ${esc(t)}</span>`),
        onError: (code) => micUi("", `<span class="warn">${esc(MIC_ERR[code] || code)}</span>`),
        onFinal: (alts) => {
          if (!alts.length) return;
          const sc = Math.max(...alts.map((a) => speechScore(a, st.fr)));
          const best = alts.reduce((b, a) => (speechScore(a, st.fr) > speechScore(b, st.fr) ? a : b), alts[0]);
          const inp = $("ody-in"); if (inp) { inp.value = best; inp.dispatchEvent(new Event("input")); }
          if (sc >= 0.7) { SES.spoke += 1; micUi("", ""); return resolve(true, { title: `🎙️ Native rhythm! ${Math.round(sc * 100)}%`, note: `Heard: “${esc(best)}”` }); }
          SFX.bad();
          micUi("", `<span class="warn">🔁 ${Math.round(sc * 100)}% — heard “${esc(best)}”. ${diffHtml(best, st.fr)}</span>`);
        }
      });
    },
    simmic() {
      const st = cur(); if (SES.answered) return;
      if (!micSupported()) { st.fr = st.fr || st.model_fr || "Bonjour"; return recordFallback(st, false); }
      micUi("on", `<span class="listening">🎙️ Listening… speak your French reply</span>`);
      micListen({
        onInterim: (t) => {
          micUi("on", `<span class="listening">🎙️ ${esc(t)}</span>`);
          const inp = $("ody-in"); if (inp) { inp.value = t; inp.dispatchEvent(new Event("input")); }
        },
        onError: (code) => micUi("", `<span class="warn">${esc(MIC_ERR[code] || code)}</span>`),
        onFinal: (alts) => {
          if (!alts.length) return;
          const best = alts[0];
          const inp = $("ody-in"); if (inp) { inp.value = best; inp.dispatchEvent(new Event("input")); }
          SES.spoke += 1;
          micUi("", `<span class="good">🎙️ Captured: “${esc(best)}” — click Send reply</span>`);
        }
      });
    },
    tile(el) { const st = cur(); if (SES.answered) return; st._picked.push(+el.dataset.ti); SFX.tap(); savePartial(false); rerenderKeepFoot(); },
    untile(el) { const st = cur(); if (SES.answered) return; st._picked.splice(+el.dataset.j, 1); savePartial(false); rerenderKeepFoot(); },
    check() {
      const st = cur(); if (SES.answered) return;
      if (st.k === "build") {
        const user = st._picked.map((ti) => st.tiles[ti]).join(" ");
        if (!user) return;
        const ok = normLoose(user) === normLoose(st.answer.join(" ")) || normLoose(user) === normLoose(st.fr);
        speak(st.fr);
        return resolve(ok, { answer: st.fr, user, q: st.en, note: ok ? `<span class="fr-tap" data-a="say" data-t="${esc(st.fr)}">${esc(st.fr)} 🔊</span>` : "" });
      }
      const inp = $("ody-in"); const val = inp ? inp.value : "";
      if (!val.trim()) { if (inp) inp.focus(); return; }
      if (inp) inp.disabled = true;
      if (st.k === "type") {
        const j = judgeText(val, st.accept && st.accept.length ? st.accept : [st.answer]);
        const note = j.accent ? "⚠️ Watch the accents: " + esc(j.best) : j.typo ? "Small typo — correct form: " + esc(j.best) : "";
        speak(firstAlt(st.answer));
        return resolve(j.ok, { answer: firstAlt(st.answer), note, why: j.ok ? (st.right || "") : (st.wrong || ""), user: val, q: st.q || stripTags(st.qHtml || ""), extra: j.ok || !diffUseful(val, firstAlt(st.answer)) ? "" : `<div class="fb-diff">${diffHtml(val, firstAlt(st.answer))}</div>` });
      }
      if (st.k === "dictee") {
        let j = judgeText(val, [st.fr]);
        if (!j.ok && !st.strict && homNorm(val) === homNorm(st.fr)) j = { ok: true, homophone: true, best: st.fr };
        const ok = st.strict ? (j.exact || j.typo) : j.ok;
        const note = j.homophone ? "Sounds identical ✔ — but the exact spelling is: " + esc(st.fr) : j.accent ? "⚠️ Watch the accents" + (st.strict ? " (they count in a dictation)" : "") : j.typo ? "Small typo" : "";
        return resolve(ok, { answer: st.fr, note, user: val, extra: ok || !diffUseful(val, st.fr) ? "" : `<div class="fb-diff">${diffHtml(val, st.fr)}</div>` });
      }
      if (st.k === "shadow" || st.k === "memory") {
        const targets = st.accept && st.accept.length ? st.accept : [st.fr];
        const j = judgeText(val, targets);
        const ok = j.ok || (st.k === "shadow" && speechScore(val, st.fr) >= 0.72);
        speak(st.fr);
        const note = j.accent ? "⚠️ Watch the accents: " + esc(j.best) : j.typo ? "Small typo — exact: " + esc(j.best) : "";
        return resolve(ok, { answer: st.fr, note, why: st.en || "", user: val, q: st.en || st.fr, extra: ok || !diffUseful(val, st.fr) ? "" : `<div class="fb-diff">${diffHtml(val, st.fr)}</div>` });
      }
      if (st.k === "simturn") {
        const tN = " " + normLoose(val) + " ";
        const kwHit = (st.keywords || []).filter((k) => tN.includes(" " + normLoose(k) + " ") || tN.includes(normLoose(k)));
        const sc = st.model_fr ? speechScore(val, st.model_fr) : 0;
        const ok = kwHit.length >= 1 || sc >= 0.45 || (words(val).length >= 3 && FR_STOP.test(val));
        SES.wrote += 1;
        if (st.model_fr) speak(st.model_fr);
        const note = st.model_fr ? `Native alternative: <b class="fr-tap" data-a="say" data-t="${esc(st.model_fr)}">${esc(st.model_fr)} 🔊</b>` : "";
        return resolve(ok, { title: ok ? "🎭 Natural French reply!" : "Use one of the French cues above or write a full French sentence", answer: st.model_fr || "", note, why: ok ? "" : (st.npc_en || ""), user: val, q: st.npc });
      }
    },
    usestarter() { const st = cur(); const ta = $("ody-ta"); if (ta && st.starter_fr) { const st0 = st.starter_fr.replace(/[.…]+$/, ""); if (!ta.value.startsWith(st0)) ta.value = st0 + " " + ta.value; ta.focus(); ta.dispatchEvent(new Event("input")); } },
    hint() { const st = cur(); const h = $("ody-hint"); if (h) h.innerHTML = rich(st.hint); },
    letterhint() {
      const st = cur(); if (!st || SES.answered) return;
      st._showLetters = true;
      const wbox = $("ody-wordlocks");
      const inp = $("ody-in");
      if (wbox) {
        wbox.dataset.hide = "0";
        const target = wbox.dataset.target || firstAlt(st.answer) || st.fr || "";
        const res = liveWordLockHtml(target, inp ? inp.value : (st._val || ""), false);
        wbox.innerHTML = res.html;
      }
      if (inp) inp.focus();
    },
    toggleenhelp() {
      const st = cur(); if (!st || SES.answered) return;
      st._enHelp = !st._enHelp;
      rerenderKeepFoot();
    },
    fbecho(el) {
      const st = cur(); if (!SES || !st) return;
      const target = el.dataset.t || st.nativeFr || st.fr || "";
      const out = $("fb-prod-out");
      speak(target);
      if (!st._fbEchoed) {
        st._fbEchoed = true;
        SES.spoke = (SES.spoke || 0) + 1;
        SES.xp = (SES.xp || 0) + 10;
        CH().reputation = (CH().reputation || 0) + 5;
        skillAdd(["speaking", "pronunciation"], true);
        SFX.ok();
      }
      if (out) {
        out.innerHTML = `<span class="good">✅ Ancrage oral validé : « ${esc(target)} » prononcé à voix haute (+10 XP · +5 ⚜️) !</span>`;
      }
    },
    fbwrite(el) {
      const st = cur(); if (!SES || !st) return;
      const target = el.dataset.t || st.nativeFr || st.fr || "";
      const out = $("fb-prod-out");
      if (!out) return;
      out.innerHTML = `<div class="fb-write-row">
        <input type="text" id="fb-write-in" class="ody-input small" placeholder="Tapez de mémoire : « ${esc(target.slice(0, 28))}… »" autocomplete="off" spellcheck="false">
        <button type="button" class="ody-btn tiny primary" data-a="fbwritecheck" data-t="${esc(target)}">✓ Ancrer (+10 XP)</button>
      </div>`;
      const inp = $("fb-write-in");
      if (inp) setTimeout(() => inp.focus(), 30);
    },
    fbwritecheck(el) {
      const st = cur(); if (!SES || !st) return;
      const target = el.dataset.t || st.nativeFr || st.fr || "";
      const inp = $("fb-write-in");
      const out = $("fb-prod-out");
      const val = inp ? inp.value.trim() : "";
      if (!val) { if (inp) inp.focus(); return; }
      if (!st._fbWrote) {
        st._fbWrote = true;
        SES.wrote = (SES.wrote || 0) + 1;
        SES.xp = (SES.xp || 0) + 10;
        CH().reputation = (CH().reputation || 0) + 5;
        skillAdd("writing", true);
        SFX.ok();
      }
      if (out) {
        out.innerHTML = `<span class="good">✅ Ancrage écrit verrouillé dans votre mémoire : « ${esc(target)} » (+10 XP · +5 ⚜️) !</span>`;
      }
    },
    giveup() {
      const st = cur(); if (SES.answered) return;
      const ans = st.k === "build" ? st.fr : (st.k === "dictee" || st.k === "shadow" || st.k === "memory") ? st.fr : st.k === "simturn" ? (st.model_fr || firstAlt(st.answer || "")) : firstAlt(st.answer);
      speak(ans);
      resolve(false, { answer: ans, why: st.wrong || "", title: "No problem — here's the answer", q: st.q || st.en || stripTags(st.qHtml || "") });
    },
    cantlisten() { const st = cur(); if (SES.answered) return; SES.answered = true; foot(`<span class="ody-foot-hint">Skipped — the text was: <b>${esc(st.fr)}</b></span>${btnCont()}`); },
    skipspeak() { if (SES.answered) return; SES.answered = true; next(); },
    skipspeakfree() { const st = cur(); st._score = null; SES.answered = true; if (st.sec) SES.secs[st.sec] = { n: 1, ok: 0 }; next(); },
    mt(el) {
      const st = cur(); if (SES.answered) return;
      const side = el.dataset.s, i = +el.dataset.i;
      if (side === "L") speak(st.pairs[i].fr);
      if (!st._sel || st._sel[0] === side) { st._sel = side + i; SFX.tap(); return rerenderKeepFoot(); }
      const other = +st._sel.slice(1);
      if (other === i) { st._done[i] = true; st._sel = null; SFX.ok(); savePartial(false); }
      else { st._miss += 1; st._sel = null; SFX.bad(); el.classList.add("shake"); savePartial(false); setTimeout(rerenderKeepFoot, 280); return; }
      rerenderKeepFoot();
      if (Object.keys(st._done).length === st.pairs.length) setTimeout(() => resolve(st._miss <= 1, { title: st._miss <= 1 ? "All matched!" : `Matched with ${st._miss} mistakes`, note: st._miss > 1 ? "These pairs will come back." : "" }), 250);
    },
    mic() { const st = cur(); if (st.k === "example") return micExample(st); return micSpeak(st); },
    recfb() { recordFallback(cur()); },
    selfok() { resolve(true, { title: "Great — keep shadowing like that" }); },
    selfagain() { renderStep(); },
    sfmic() { speakFreeMic(cur()); },
    showmodel() { const st = cur(); const m = $("ody-model"); if (m) m.innerHTML = `<div class="ody-model"><div class="ody-k-label">Model answer <button class="ody-link" data-a="say" data-t="${esc(st.model_fr)}">🔊</button></div><div>${esc(st.model_fr)}</div>${st.model_en ? `<div class="ody-ex-en">${esc(st.model_en)}</div>` : ""}</div>`; },
    writesubmit() { writeSubmit(cur()); },
    quit() {
      if (SES && sessionSaveKey(SES)) {
        savePartial(SES.answered);
        const stepNum = Math.min(SES.steps.length, (SES.answered ? SES.i + 2 : SES.i + 1));
        const label = SES.node ? SES.node.title : "Session en cours";
        toast("💾 Progression sauvegardée", `${label} · Étape ${stepNum} sur ${SES.steps.length}`, "💾");
      }
      clearStepTimers(); stopAudio(); micStop(); SES = null; renderHome();
    },
    quitno() { const st = cur(); if (SES.answered) { SES.answered = false; } renderStep(); },
    quityes() { if (SES && sessionSaveKey(SES)) savePartial(SES.answered); clearStepTimers(); stopAudio(); micStop(); SES = null; renderHome(); },
    ask() {},
    askwhy() {}
  };
  const stripTags = (h) => String(h || "").replace(/<[^>]+>/g, "");
  function rerenderKeepFoot() {
    const st = cur(); const stage = $("ody-stage");
    stage.innerHTML = `${renderDiorama(st)}<div class="ody-card ody-k-${st.k}">${RENDER[st.k](st)}</div>`;
  }

  // ----------------------------------------------------------------- mic flows
  function micUi(state, html) { const o = $("ody-mic-out"); if (o) o.innerHTML = html || ""; const b = $("ody-mic-btn"); if (b) b.classList.toggle("on", state === "on"); }
  function micExample(st) {
    if (!micSupported()) return recordFallback(st, true);
    micUi("on", `<span class="listening">🎙️ Listening… say it now</span>`);
    micListen({
      onInterim: (t) => micUi("on", `<span class="listening">🎙️ ${esc(t)}</span>`),
      onError: (code) => micUi("", `<span class="warn">${esc(MIC_ERR[code] || code)}</span>`),
      onFinal: (alts) => {
        if (!alts.length) return;
        const sc = Math.max(...alts.map((a) => speechScore(a, st.fr)));
        const best = alts.reduce((b, a) => (speechScore(a, st.fr) > speechScore(b, st.fr) ? a : b), alts[0]);
        skillAdd("speaking", sc >= 0.7); SES.spoke += 1;
        if (sc >= 0.7) { SES.xp += 5; SFX.ok(); }
        micUi("", sc >= 0.7 ? `<span class="good">✅ ${Math.round(sc * 100)}% — “${esc(best)}” (+5 XP)</span>` : `<span class="warn">🔁 ${Math.round(sc * 100)}% — heard “${esc(best)}”. ${diffHtml(best, st.fr)}</span>`);
      }
    });
  }
  function micSpeak(st) {
    if (SES.answered) return;
    if (!micSupported()) return recordFallback(st);
    st._tries = (st._tries || 0) + 1;
    micUi("on", `<span class="listening">🎙️ Listening… say: <b>${esc(st.fr)}</b></span>`);
    micListen({
      onInterim: (t) => micUi("on", `<span class="listening">🎙️ ${esc(t)}</span>`),
      onError: (code) => {
        micUi("", `<span class="warn">${esc(MIC_ERR[code] || code)}</span>`);
        if (code === "not-allowed" || code === "service-not-allowed" || code === "audio-capture" || code === "network") foot(`<button class="ody-btn ghost" data-a="recfb">🎙️ Record & compare instead</button><button class="ody-btn ghost" data-a="skipspeak">Skip</button>`);
      },
      onFinal: (alts) => {
        if (!alts.length) return;
        const sc = Math.max(...alts.map((a) => speechScore(a, st.fr)));
        const best = alts.reduce((b, a) => (speechScore(a, st.fr) > speechScore(b, st.fr) ? a : b), alts[0]);
        SES.spoke += 1;
        if (sc >= 0.75) { micUi("", ""); return resolve(true, { title: `${pick(PRAISE)} ${Math.round(sc * 100)}%`, note: `Heard: “${esc(best)}”` }); }
        if (st._tries < 3) { SFX.bad(); micUi("", `<span class="warn">🔁 ${Math.round(sc * 100)}% — heard “${esc(best)}”<br>${diffHtml(best, st.fr)}<br>Listen again and retry (${3 - st._tries} left).</span>`); return; }
        resolve(sc >= 0.5, { title: sc >= 0.5 ? "Good enough — keep practising" : "Let's come back to this one", note: `Heard: “${esc(best)}”`, answer: st.fr, extra: `<div class="fb-diff">${diffHtml(best, st.fr)}</div>` });
      }
    });
  }
  async function recordFallback(st, isExample) {
    const out = $("ody-mic-out"); if (!out) return;
    if (!navigator.mediaDevices || !window.MediaRecorder) { out.innerHTML = `<span class="warn">${MIC_ERR.unsupported}</span>`; return; }
    const secs = clamp(Math.ceil(words(st.fr).length * 0.6) + 2, 3, 9);
    out.innerHTML = `<span class="listening">🔴 Recording ${secs}s… say it now</span>`;
    try {
      const url = await recordClip(secs);
      out.innerHTML = `<div class="ody-rec"><div>Your voice: <audio controls src="${url}"></audio></div><div>Camille: <button class="ody-btn small" data-a="play">🔊</button></div>
        ${isExample ? "" : `<div class="ody-row center"><button class="ody-btn primary small" data-a="selfok">✅ I sounded like her</button><button class="ody-btn small ghost" data-a="selfagain">🔁 Try again</button></div>`}</div>`;
      const a = out.querySelector("audio"); if (a) { a.onended = () => speak(st.fr); a.play().catch(() => {}); }
    } catch (e) { out.innerHTML = `<span class="warn">${MIC_ERR["not-allowed"]}</span>`; }
  }
  function speakFreeMic(st) {
    if (st._rec) { micStop(); return; }
    const btn = $("ody-mic-btn"), live = $("ody-sf-live"), tm = $("ody-sf-timer"), ta = $("ody-sf-ta");
    if (!micSupported()) return speakFreeRecord(st);
    st._t0 = Date.now(); st._transcript = ta && ta.value.trim() ? ta.value.trim() : "";
    btn.classList.add("on"); btn.querySelector("small").textContent = "Tap to stop";
    const tick = setInterval(() => { if (!tm) return; const s = Math.round((Date.now() - st._t0) / 1000); tm.innerHTML = `⏱ ${s}s / ${st.seconds || 45}s`; if (s >= (st.seconds || 45) + 30) micStop(); }, 500);
    let restarts = 0;
    const startRec = () => {
      st._rec = micListen({
        continuous: true,
        onInterim: (t) => {
          const full = (st._transcript + " " + t).trim();
          if (live) live.textContent = full;
          if (ta) { ta.value = full; ta.dispatchEvent(new Event("input")); }
          markKeywords(st, full);
        },
        onError: (code) => { if (code !== "no-speech" && code !== "aborted") { if (live) live.innerHTML = `<span class="warn">${esc(MIC_ERR[code] || code)}</span>`; st._fatal = true; } },
        onFinal: (alts) => {
          st._transcript = (st._transcript + " " + (alts[0] || "")).trim();
          if (ta) { ta.value = st._transcript; ta.dispatchEvent(new Event("input")); }
        },
        onEnd: () => {
          const s = (Date.now() - st._t0) / 1000;
          if (!st._stop && !st._fatal && s < (st.seconds || 45) + 30 && restarts < 12) { restarts += 1; startRec(); return; }
          clearInterval(tick); st._rec = null; btn.classList.remove("on"); btn.querySelector("small").textContent = "Reprendre le micro";
          gradeSpeakFree(st);
        }
      });
    };
    st._stop = false; st._fatal = false;
    startRec();
    btn.onclick = (e) => { e.stopPropagation(); st._stop = true; micStop(); btn.onclick = null; };
  }
  function markKeywords(st, text) {
    const t = " " + normLoose(text) + " ";
    document.querySelectorAll(".ody-kwc").forEach((k) => {
      const hit = t.includes(" " + normLoose(k.dataset.kw) + " ") || t.includes(normLoose(k.dataset.kw));
      k.classList.toggle("hit", hit);
    });
  }
  async function speakFreeRecord(st) {
    const live = $("ody-sf-live");
    if (!navigator.mediaDevices || !window.MediaRecorder) { if (live) live.innerHTML = `<span class="warn">${MIC_ERR.unsupported} — utilisez la Tribune Oratoire ci-dessous !</span>`; return; }
    if (live) live.innerHTML = `<span class="listening">🔴 Recording ${st.seconds || 45}s…</span>`;
    try {
      const url = await recordClip(st.seconds || 45);
      if (live) live.innerHTML = `<div class="ody-rec">Your answer: <audio controls src="${url}"></audio></div>`;
      showSpeakModel(st);
      foot(`<button class="ody-btn ghost" data-a="selfagain">🔁 Try again</button><button class="ody-btn primary" data-a="sfselfok" id="ody-primary">✅ I covered the task</button>`);
      ACT.sfselfok = () => { st._score = 75; st._graded = true; if (st.sec) SES.secs[st.sec] = { n: 1, ok: 0.75 }; SES.xp += 25; skillAdd("speaking", true); SES.answered = true; savePartial(true); foot(btnCont()); };
    } catch (e) { if (live) live.innerHTML = `<span class="warn">${MIC_ERR["not-allowed"]} — utilisez la Tribune Oratoire ci-dessous !</span>`; }
  }
  function showSpeakModel(st) {
    const g = $("ody-grade"); if (!g || !st.model_fr) return;
    if (g.querySelector(".ody-model")) return;
    g.insertAdjacentHTML("beforeend", `<div class="ody-model"><div class="ody-k-label">Réplique Modèle C2 <button class="ody-btn small" data-a="say" data-t="${esc(st.model_fr)}">🔊 Écouter</button></div><div>${esc(st.model_fr)}</div></div>`);
  }
  async function gradeSpeakFree(st) {
    if (!st || st._busy) return;
    const ta = $("ody-sf-ta");
    if (ta && ta.value.trim()) st._transcript = ta.value.trim();
    const text = (st._transcript || "").trim();
    const g = $("ody-grade"); if (!g) return;
    const n = words(text).length;
    if (n < 4) { g.innerHTML = `<div class="warn">Votre prise de parole compte seulement ${n} mot${n === 1 ? "" : "s"}. Parlez au micro ou composez au moins 1 phrase complète dans la Tribune Oratoire ci-dessus.</div>`; return; }
    st._busy = true;
    const kws = st.keywords || []; const tN = " " + normLoose(text) + " ";
    const hit = kws.filter((k) => tN.includes(normLoose(k))).length;
    const localRhet = analyzeRhetoricLocal(text, st);
    const targetWords = Math.max(8, Math.round((st.seconds || 35) * 0.45));
    let score = Math.round(clamp((kws.length ? hit / kws.length : 0.7) * 42 + clamp(n / targetWords, 0, 1.15) * 46 + Math.min(18, localRhet.hitMetrics.length * 6), 45, 98));
    g.innerHTML = `<div class="ody-grading">🎙️ Analyse prosodique et rhétorique du Grand Oral…</div>`;
    let ai = null;
    await checkServer();
    if (SRV.ai) { const r = await aiGrade({ kind: "speak", level: st.level, prompt: st.prompt_fr || st.prompt_en, text, model: st.model_fr, criteria: (st.keywords || []).map((k) => "Uses «" + k + "» or an equivalent") }); if (r && r.ok) ai = r.data; }
    if (ai && typeof ai.score === "number") score = clamp(Math.round(ai.score), 0, 100);
    st._busy = false; st._score = score; st._graded = true; st._rhet = localRhet;
    if (st.sec) SES.secs[st.sec] = { n: 1, ok: Math.max(score, 60) / 100 };
    skillAdd(["speaking", "pronunciation"], score >= 60); SES.spoke += 1;
    const xp = Math.round(18 + score / 3); SES.xp += xp;
    if (ta) ta.readOnly = true;
    g.innerHTML = gradeHtml(score, ai, text, "speak", st);
    showSpeakModel(st);
    SES.answered = true;
    score >= 60 ? SFX.win() : SFX.ok();
    savePartial(true);
    foot(`<button class="ody-btn ghost" data-a="sfretry">🔁 Reformuler ma prise de parole</button>${btnCont()}`);
    ACT.sfretry = () => { st._graded = false; SES.answered = false; renderStep(); };
  }
  function analyzeRhetoricLocal(text, st) {
    const lvRk = cefrRank((st && st.level) || currentLevel());
    const rub = C2_RUBRIC();
    const lowText = String(text || "").toLowerCase();
    const hitMetrics = [];
    if (lvRk <= 2) {
      const tieredChecks = lvRk === 0 ? [
        { label: "Salutation & Politesse A1", re: /\b(bonjour|salut|bonsoir|merci|s'il vous plaît|s'il te plaît|à bientôt)\b/gi },
        { label: "Connecteurs simples (et / mais / parce que)", re: /\b(et|mais|parce que|aussi|avec)\b/gi },
        { label: "Accents français soignés", re: /[éèêàùçîô]/gi }
      ] : lvRk === 1 ? [
        { label: "Récit au Passé (Passé Composé / Imparfait)", re: /\b(j'ai|je suis|nous avons|il faisait|c'était|était|étaient)\b/gi },
        { label: "Marqueurs de temps A2", re: /\b(hier|samedi|dimanche|ensuite|puis|d'abord|enfin|demain)\b/gi },
        { label: "Politesse & Conditionnel A2", re: /\b(voudrais|serait-il|merci|cordialement|désolé)\b/gi }
      ] : [
        { label: "Connecteurs d'opinion B1", re: /\b(cependant|pourtant|en revanche|d'une part|par conséquent|à mon avis|donc)\b/gi },
        { label: "Pronoms & fluidité B1", re: /\b(j'y|j'en|m'y|nous en|qui|que|dont)\b/gi },
        { label: "Nuance & structure", re: /\b(bien que|malgré|toutefois|en conclusion|afin de)\b/gi }
      ];
      tieredChecks.forEach((chk) => {
        const m = text.match(chk.re);
        if (m && m.length) hitMetrics.push({ label: chk.label, count: m.length, tip: "" });
      });
    } else {
      const metrics = Array.isArray(rub.metrics) ? rub.metrics : [];
      metrics.forEach((m) => {
        try {
          if (Array.isArray(m.markers) && m.markers.length) {
            const hits = m.markers.filter((mk) => mk && lowText.includes(String(mk).toLowerCase()));
            if (hits.length) hitMetrics.push({ label: m.name || m.label || m.id, count: hits.length, tip: m.upgradeTip || m.tip || "" });
          } else if (m.regex) {
            const re = m.regex instanceof RegExp ? m.regex : new RegExp(m.regex, "gi");
            const matches = text.match(re);
            if (matches && matches.length) hitMetrics.push({ label: m.name || m.label || m.id, count: matches.length, tip: m.upgradeTip || m.tip || "" });
          }
        } catch (e) {}
      });
    }
    const musts = st.must_use || st.checklist || [];
    const metMusts = musts.map((c) => {
      const frBitsInC = (c.match(/«([^»]+)»/g) || []).map((x) => x.replace(/[«»]/g, ""));
      const rawKey = String(c).split("(")[0].trim();
      const met = frBitsInC.length ? frBitsInC.some((b) => normLoose(text).includes(normLoose(b))) : (rawKey ? normLoose(text).includes(normLoose(rawKey)) : words(text).length >= (st.minWords || 20));
      return { criterion: c, met };
    });
    const upgrades = lvRk <= 1
      ? [{ plain: "Je veux…", native: "Je voudrais…", why: "Plus poli et 100% naturel en France (A1–A2)." }, { plain: "C'est très bien", native: "C'est super / génial !", why: "Plus vivant au quotidien." }]
      : (rub.registerUpgrades || []).slice(0, 4).map((u) => ({ plain: u.basic || u.casual || "", native: u.c2Upgrade || u.c2 || "", why: u.note || "" }));
    return { hitMetrics, metMusts, upgrades };
  }

  async function writeSubmit(st) {
    const ta = $("ody-ta"); if (!ta || st._busy) return;
    const text = ta.value.trim(); const n = words(text).length; const min = st.minWords || 20;
    const g = $("ody-grade");
    if (n < Math.ceil(min * 0.6)) { g.innerHTML = `<div class="warn">Écrivez au moins ${Math.ceil(min * 0.6)} mots (vous en avez ${n}). Objectif : ${min} mots.</div>`; return; }
    st._busy = true; st._text = text;
    g.innerHTML = `<div class="ody-grading">✒️ Analyse stylistique et rhétorique en cours…</div>`;
    let ai = null;
    await checkServer();
    if (SRV.ai) { const r = await aiGrade({ kind: "write", level: st.level, prompt: (st.prompt_fr || "") + " / " + (st.prompt_en || ""), text, model: st.model_fr, criteria: st.must_use || st.checklist || [] }); if (r && r.ok) ai = r.data; }
    const localRhet = analyzeRhetoricLocal(text, st);
    let score;
    if (ai && typeof ai.score === "number") score = clamp(Math.round(ai.score), 0, 100);
    else {
      const lenScore = clamp(n / min, 0, 1.15) * 62;
      const rhetBonus = Math.min(28, localRhet.hitMetrics.length * 8 + localRhet.metMusts.filter((m) => m.met).length * 5);
      score = clamp(Math.round(lenScore + rhetBonus), 45, 96);
    }
    st._busy = false; st._graded = true; st._score = score; st._ai = ai; st._rhet = localRhet;
    if (st.sec) SES.secs[st.sec] = { n: 1, ok: (ai ? score : Math.max(score, 60)) / 100 };
    skillAdd(["writing", "grammar"], score >= 60); SES.wrote += 1;
    SES.xp += Math.round(20 + score / 2.5);
    if (st.atelierId) { const s = SAVE(); s.completedWritings = s.completedWritings || {}; s.completedWritings[st.atelierId] = true; }
    const c = CH(); c.portfolio = c.portfolio || []; c.portfolio.push({ date: today(), level: st.level, prompt: st.prompt_en || st.prompt_fr, text, score, ai: !!ai }); if (c.portfolio.length > 120) c.portfolio.shift();
    g.innerHTML = gradeHtml(score, ai, text, "write", st);
    if (!ai) ACT.showmodel();
    SES.answered = true; ta.readOnly = true;
    score >= 60 ? SFX.win() : SFX.ok();
    savePartial(true);
    foot(`<button class="ody-btn ghost" data-a="writeedit">✏️ Affiner et soumettre à nouveau</button>${btnCont()}`);
    ACT.writeedit = () => { st._graded = false; SES.answered = false; renderStep(); };
  }
  function gradeHtml(score, ai, text, kind, st) {
    const col = score >= 75 ? "#4ade80" : score >= 55 ? "#fde047" : "#fb7185";
    const rhet = (st && st._rhet) || (kind === "write" ? analyzeRhetoricLocal(text, st || {}) : null);
    let h = `<div class="ody-grade-card"><div class="ody-score" style="--c:${col}"><b>${score}</b><small>/100</small></div><div class="ody-grade-main">`;
    if (ai) {
      h += `<div class="ody-verdict">${esc(ai.verdict_en || "")} ${ai.cefr ? `<span class="ody-chip">Registre : ${esc(ai.cefr)}</span>` : ""}</div>`;
      if ((ai.strengths || []).length) h += `<div class="ody-str">💪 ${ai.strengths.map(esc).join(" · ")}</div>`;
    } else if (rhet) {
      const mList = rhet.hitMetrics.length ? rhet.hitMetrics.map((m) => `${m.label} (×${m.count})`).join(" · ") : "Structure claire — ajoutez des connecteurs C1/C2 pour élever le registre";
      h += `<div class="ody-verdict">✒️ <b>Bilan Stylistique de l'Atelier :</b> ${esc(mList)}</div>`;
    } else {
      h += `<div class="ody-verdict">🎙️ <b>Bilan d'Expression :</b> Pertinence lexicale et fluidité vérifiées. Comparez avec le modèle ci-dessous.</div>`;
    }
    h += `</div></div>`;
    if (ai && (ai.errors || []).length) h += `<div class="ody-errs"><div class="ody-k-label">Corrections</div>${ai.errors.map((e) => `<div class="ody-err"><s>${esc(e.wrong)}</s> → <b class="fr-tap" data-a="say" data-t="${esc(e.right)}">${esc(e.right)}</b><div class="why">${esc(e.why)}</div></div>`).join("")}</div>`;
    if (ai && ai.improved_fr) h += `<div class="ody-model"><div class="ody-k-label">Votre texte rehaussé <button class="ody-link" data-a="say" data-t="${esc(ai.improved_fr)}">🔊</button></div><div>${esc(ai.improved_fr)}</div></div>`;
    const ups = (ai && (ai.native_upgrades || []).length) ? ai.native_upgrades : (rhet && rhet.upgrades) || [];
    if (ups.length) h += `<div class="ody-ups"><div class="ody-k-label">Élévations de Registre (Standard ➜ C2)</div>${ups.map((u) => `<div class="ody-up"><span>${esc(u.plain)}</span> ➜ <b class="fr-tap" data-a="say" data-t="${esc(u.native)}">${esc(u.native)} 🔊</b><div class="why">${esc(u.why)}</div></div>`).join("")}</div>`;
    const crits = (ai && (ai.criteria || []).length) ? ai.criteria : (rhet && rhet.metMusts) || [];
    if (crits.length) h += `<ul class="ody-crit">${crits.map((c) => `<li class="${c.met ? "met" : ""}">${c.met ? "✅" : "⬜"} ${esc(c.criterion)}</li>`).join("")}</ul>`;
    return h;
  }

  // ----------------------------------------------------------------- finish
  function bossFail() {
    clearStepTimers();
    const n = SES.node;
    const c = CH();
    const key = sessionSaveKey(SES);
    if (key && c.partial) { delete c.partial[key]; if (c.activeNodeId === key) c.activeNodeId = null; persist(); }
    SES = null; SFX.bad();
    $("ody-stage") && ($("app-main").innerHTML = `<div class="ody-result fail"><div class="ody-boss-emblem">🐉</div><h2>Le Gardien l'emporte cette fois</h2>
      <p>Vos cœurs sont épuisés. Chaque point fragile a rejoint votre carnet de révision — consolidez-les puis revenez triompher.</p>
      <div class="ody-row center"><button class="ody-btn primary" data-a2="retry" data-id="${esc(n.id)}" id="ody-primary">⚔️ Relever le défi</button><button class="ody-btn ghost" data-a2="review">🔁 Réviser d'abord</button><button class="ody-btn ghost" data-a2="home">🏠 Carte</button></div></div>`);
    document.body.classList.remove("ody-in-session");
  }
  function finishSession() {
    clearStepTimers();
    const S = SES; if (!S) return;
    const c = CH(); const n = S.node;
    const key = sessionSaveKey(S);
    const mCap = S.microCap;
    if (key && c.partial) { delete c.partial[key]; if (c.activeNodeId === key) c.activeNodeId = null; }
    const acc = S.graded ? S.right / S.graded : 1;
    const mins = Math.max(1, Math.round((Date.now() - S.t0) / 60000));
    let stars = acc >= 0.9 ? 3 : acc >= 0.75 ? 2 : acc >= 0.65 ? 1 : 0;
    if (S.hearts != null) stars = Math.max(1, S.hearts);
    let exam = null, placement = null, bonus = 15;
    if (S.mode === "placement") placement = finishPlacement(S);
    else if (S.exam && n) { exam = scoreExam(S, n.level); bonus = exam.passed ? 150 : 30; if (exam.passed) stars = exam.overall >= 0.9 ? 3 : exam.overall >= 0.8 ? 2 : 1; }
    else if (n && n.kind === "boss") bonus = 50;
    const passedSession = !exam ? (S.graded === 0 || acc >= 0.65 || S.hearts != null) : exam.passed;
    let passedNode = !!(n && passedSession);
    let microProgressAfter = null;
    if (n && mCap && passedSession) {
      c.microDone = c.microDone || {};
      c.microDone[n.id] = c.microDone[n.id] || {};
      c.microDone[n.id][mCap.idx] = true;
      c.capsulesCleared = (c.capsulesCleared || 0) + 1;
      const mp = nodeMicroProgress(n);
      microProgressAfter = mp;
      if (!mp.allDone) {
        passedNode = false;
      }
    } else if (passedSession) {
      c.capsulesCleared = (c.capsulesCleared || 0) + 1;
    }
    if (n && passedNode && stars < 1) stars = 1;
    if (n && mCap && passedSession && stars < 1) stars = 1;
    const firstClear = n && passedNode && !c.done[n.id];
    if (firstClear && (n.kind === "boss" || n.kind === "district" || n.kind === "atelier")) {
      const gold = (n.kind === "boss" ? 80 : 45) + cefrRank(n.cefr) * 35;
      if (API().addXP) API().addXP(0, gold);
      setTimeout(() => toast(`🎁 Coffre de Maîtrise : +${gold} Or`, `${n.title} accompli avec succès !`, "🎁"), 600);
    }
    if (n && passedNode) {
      c.done[n.id] = Math.max(c.done[n.id] || 0, stars);
      c.plays[n.id] = (c.plays[n.id] || 0) + 1;
      const s = SAVE();
      if (n.stage) { s.clearedStages = s.clearedStages || {}; s.clearedStages[n.stage.stageId] = Math.max(s.clearedStages[n.stage.stageId] || 0, stars); s.tutorDone = s.tutorDone || {}; s.tutorDone[n.stage.stageId] = true; }
      if (n.kind === "boss" && n.world) { s.masteredLessons = s.masteredLessons || {}; s.masteredLessons[n.world.id] = true; s.stats = s.stats || {}; s.stats.bossesSlain = (s.stats.bossesSlain || 0) + 1; }
      if (n.kind === "boot" && n.data) { s.bootcamp = s.bootcamp || {}; s.bootcamp.done = s.bootcamp.done || {}; s.bootcamp.done[n.data.id] = true; }
      if (n.kind === "district" && n.data) { s.clearedDistricts = s.clearedDistricts || {}; s.clearedDistricts[n.data.id] = true; }
      if (n.kind === "atelier" && n.data) { s.completedWritings = s.completedWritings || {}; s.completedWritings[n.data.id] = true; }
    }
    if (S.mode === "review") { c.lastReview = today(); }
    if (S.mode && String(S.mode).startsWith("chronique_") && passedSession) {
      const epId = String(S.mode).slice("chronique_".length);
      c.chroniquesDone = c.chroniquesDone || {};
      const firstEp = !c.chroniquesDone[epId];
      c.chroniquesDone[epId] = true;
      const ep = getChroniques().find((x) => x.id === epId);
      c.reputation = (c.reputation || 0) + (firstEp ? 25 : 10);
      if (ep && ep.friendId) addBond(ep.friendId, firstEp ? 20 : 8);
      if (firstEp && ep) {
        setTimeout(() => toast(`🎬 ${ep.title} accompli !`, `+25 ⚜️ Réputation · +20 ❤️ Lien avec ${ep.friendName}`, "🎬"), 500);
      }
    }
    if (c.daily.date !== today()) c.daily = { date: today(), xp: 0, sessions: 0, nodes: 0, capsules: 0 };
    c.daily.sessions += 1;
    c.daily.capsules = (c.daily.capsules || 0) + 1;
    if (n && passedNode) c.daily.nodes = (c.daily.nodes || 0) + 1;
    if (passedSession) {
      c.heatStreak = Math.min(10, (c.heatStreak || 0) + 1);
    } else {
      c.heatStreak = 0;
    }
    const heatMult = c.heatStreak >= 5 ? 3 : c.heatStreak >= 3 ? 2 : c.heatStreak >= 2 ? 1.5 : 1;
    markActiveDay();
    const totalXp = Math.round((S.xp + bonus) * heatMult);
    gainXP(totalXp);
    const lootDrop = passedSession ? rollLootBox() : null;
    persist();
    SES = null;
    document.body.classList.remove("ody-in-session");
    SFX.win();
    renderResult({ node: n, stars, acc, xp: totalXp, mins, combo: S.bestCombo, exam, placement, spoke: S.spoke, mode: S.mode, graded: S.graded, microCap: mCap, microProgress: microProgressAfter, lootDrop, passedSession, heatMult, heatStreak: c.heatStreak });
  }
  function scoreExam(S, level) {
    const E = EXAMS()[level] || {}; const secs = ["listening", "dictation", "grammar", "reading", "writing", "speaking"];
    const res = {}; let sum = 0, k = 0;
    secs.forEach((s) => { const x = S.secs[s]; if (x && x.n) { res[s] = x.ok / x.n; } else if (E[s === "dictation" ? "dictation" : s]) { res[s] = 0; } else return; sum += res[s]; k += 1; });
    const overall = k ? sum / k : 0;
    const pm = E.passMark || 0.7;
    const passed = overall >= pm && Object.values(res).every((v) => v >= 0.5);
    const c = CH(); const prev = c.gates[level];
    c.gates[level] = { score: Math.round(overall * 100), passed: passed || !!(prev && prev.passed), date: today(), secs: res, best: Math.max(Math.round(overall * 100), (prev && prev.best) || 0) };
    if (level === "NATIF" && passed) {
      const missing = CEFR.filter((lv) => !(c.gates[lv] && c.gates[lv].passed && !c.gates[lv].placed));
      if (!missing.length) c.natif = { date: today(), score: Math.round(overall * 100) };
      else c.natifMissing = missing;
    }
    return { level, overall, res, passed, pm };
  }
  function finishPlacement(S) {
    const lv = ["A1", "A2", "B1", "B2", "C1"]; let placed = "A1";
    for (const l of lv) { const x = S.secs[l]; const a = x && x.n ? x.ok / x.n : 0; if (a >= 0.75) placed = CEFR[cefrRank(l) + 1]; else break; }
    const c = CH(); c.placed = placed;
    lv.forEach((l) => { if (cefrRank(l) < cefrRank(placed) && !(c.gates[l] && c.gates[l].passed)) c.gates[l] = { passed: true, placed: true, date: today(), score: null }; });
    if (placed !== "A1") c.skipBoot = true;
    return { placed };
  }
  function renderResult(r) {
    const main = $("app-main");
    const nx = nextNode();
    const st = "⭐".repeat(r.stars) + `<span class="dim">${"☆".repeat(3 - r.stars)}</span>`;
    const isMicro = !!(r.microCap && r.node);
    const mp = r.microProgress || (r.node ? nodeMicroProgress(r.node) : null);
    const stampHtml = r.passedSession ? `<div class="ody-mission-stamp"><span>🏆 MISSION ACCOMPLIE</span>${r.heatMult > 1 ? `<span class="stamp-heat">🔥 HEAT ×${r.heatMult}</span>` : ""}</div>` : "";
    let head = `${stampHtml}<h2>${r.mode === "quick60" ? "⚡ Capsule Express 60s accomplie !" : isMicro && mp && !mp.allDone ? `⚡ ${esc(r.microCap.title)} verrouillée ! (${mp.doneCount}/${mp.total})` : r.mode === "review" ? "Review complete!" : r.node && r.node.kind === "boss" ? "Boss defeated!" : "Session complete!"}</h2><div class="ody-stars">${st}</div>`;
    let body = "";
    if (isMicro && mp) {
      const pills = mp.caps.map((cp) => {
        const done = !!mp.doneMask[cp.idx];
        return `<span class="micro-res-pill ${done ? "done" : ""}">${done ? "✓" : "○"} ${esc(cp.title)}</span>`;
      }).join("");
      body += `<div class="ody-micro-summary"><div class="ody-k-label">Progression Micro-Capsules · ${esc(r.node.title)} (${mp.doneCount}/${mp.total})</div><div class="micro-res-row">${pills}</div></div>`;
    }
    if (r.lootDrop) {
      body += `<div class="ody-loot-chest">
        <div class="loot-ico">🎁</div>
        <div class="loot-txt">
          <div class="loot-k">COFFRE DE DOPAMINE DÉBLOQUÉ !</div>
          <b>${esc(r.lootDrop.label)}</b>
          <small>${esc(r.lootDrop.desc)}</small>
        </div>
      </div>`;
    }
    if (r.exam) {
      const names = { listening: "🎧 Listening", dictation: "✍️ Dictation", grammar: "📘 Grammar", reading: "📰 Reading", writing: "📝 Writing", speaking: "🎙️ Speaking" };
      head = r.exam.passed
        ? `<div class="ody-seal">${r.exam.level === "NATIF" ? "👑" : "🏛️"}</div><h2>${r.exam.level === "NATIF" ? "Grand Examen Natif: passed" : `Level ${r.exam.level} confirmed!`}</h2><div class="ody-stars">${st}</div>`
        : `<div class="ody-seal dim">🏛️</div><h2>Not this time: ${Math.round(r.exam.overall * 100)}%</h2><p class="ody-goal">You need ${Math.round(r.exam.pm * 100)}% overall and at least 50% in every part. Your weak parts are below. Review, then try again.</p>`;
      body += `<div class="ody-secbars">${Object.entries(r.exam.res).map(([k, v]) => `<div class="sb"><span>${names[k] || k}</span><div class="bar"><i style="width:${Math.round(v * 100)}%;background:${v >= 0.7 ? "#4ade80" : v >= 0.5 ? "#fde047" : "#fb7185"}"></i></div><b>${Math.round(v * 100)}%</b></div>`).join("")}</div>`;
      if (r.exam.passed && r.exam.level === "NATIF") body += CH().natif ? certificateHtml() : `<p class="ody-goal">Exam passed! To receive the native certificate, also pass these level exams for real (not by placement): <b>${(CH().natifMissing || []).join(", ")}</b>.</p>`;
    }
    if (r.placement) { head = `<div class="ody-seal">🧭</div><h2>Your starting level: ${r.placement.placed}</h2>`; body += `<p class="ody-goal">Everything before ${r.placement.placed} is unlocked. You can still replay any earlier lesson.</p>`; }
    const stats = `<div class="ody-stats">
      ${r.graded ? `<div><b>${Math.round(r.acc * 100)}%</b><span>accuracy</span></div>` : ""}
      <div><b>+${r.xp}</b><span>XP</span></div>
      ${r.combo >= 3 ? `<div><b>🔥 ${r.combo}</b><span>best combo</span></div>` : ""}
      <div><b>${r.mins}′</b><span>time</span></div>
      ${r.spoke ? `<div><b>🎙️ ${r.spoke}</b><span>spoken</span></div>` : ""}</div>`;
    const daily = CH().daily; const goal = CH().goal;
    const goalLine = `<div class="ody-goalbar"><span>Daily goal</span><div class="bar"><i style="width:${Math.min(100, Math.round(daily.xp / goal * 100))}%"></i></div><b>${daily.xp}/${goal} XP</b></div>`;
    const retry = (r.exam && !r.exam.passed) || (r.node && !r.exam && r.stars === 0);
    if (r.node && !r.exam && r.stars === 0) {
      head = `<div class="ody-seal dim">🧭</div><h2>Presque maîtrisé (${Math.round(r.acc * 100)}%)</h2><p class="ody-goal">Atteignez au moins 65% de précision pour valider cette étape. Vos erreurs ont été ajoutées à votre carnet de révision !</p>`;
    }
    let nextBtnHtml = `<button class="ody-btn primary big" data-a2="go" data-id="${esc(nx.id)}" id="ody-primary">▶ Suite : ${esc(nx.title.slice(0, 48))}</button>`;
    if (retry && r.node) {
      nextBtnHtml = `<button class="ody-btn primary" data-a2="retry" data-id="${esc(r.node.id)}" id="ody-primary">🔁 Rejouer l'étape</button>`;
    } else if (isMicro && mp && !mp.allDone) {
      const nextCp = mp.caps[mp.nextCapIdx] || mp.caps[0];
      nextBtnHtml = `<button class="ody-btn primary big" data-a2="microcap" data-id="${esc(r.node.id)}" data-cap="${mp.nextCapIdx}" id="ody-primary">⚡ Suite : ${esc(nextCp.title)} (${mp.nextCapIdx + 1}/${mp.total} · 90s)</button>`;
    }
    main.innerHTML = `<div class="ody-result">${head}${stats}${body}${goalLine}
      <div class="ody-row center">
        ${nextBtnHtml}
        <button class="ody-btn ghost" data-a2="quick60">⚡ Encore 60s</button>
        <button class="ody-btn ghost" data-a2="home">🏠 Carte</button>
      </div></div>`;
    if (r.stars === 3 && window.RPG_VFX && window.RPG_VFX.burst) { try { window.RPG_VFX.burst(window.innerWidth / 2, 200, "#fbbf24", 40); } catch (e) {} }
    setTimeout(() => { const b = $("ody-primary"); if (b) b.focus({ preventScroll: true }); }, 60);
    updateBar();
  }
  function certificateHtml() {
    const c = CH(); const name = c.name || "Apprenant·e";
    return `<div class="ody-cert"><div class="cert-in">
      <div class="cert-k">L'Odyssée Française</div>
      <div class="cert-t">Certificat de maîtrise · niveau natif</div>
      <div class="cert-n">${esc(name)}</div>
      <div class="cert-d">has passed every level gate from A1 to C2 and the Grand Examen Natif<br>(listening at native speed, dictation, grammar and nuance, literary reading, argued writing, spoken argument).</div>
      <div class="cert-s">${esc(c.natif ? c.natif.date : today())} · Score ${c.natif ? c.natif.score : ""}% · Signed: Camille</div>
    </div></div>`;
  }

  // =================================================================== HOME — LE CHEMIN
  const LEVEL_NAMES = { A1: "Débutant", A2: "Élémentaire", B1: "Intermédiaire", B2: "Avancé", C1: "Autonome", C2: "Maîtrise", NATIF: "Natif" };
  const HOME = { open: {}, unitOpen: {} };
  function nodeStars(n) { return CH().done[n.id] || 0; }
  function levelNodes(lv, forceAll) {
    const c = CH();
    const all = NODES.filter((n) => levelOfNode(n) === lv);
    if (forceAll || c.pathMode === "integral") return all;
    const roy = all.filter((n) => n.royal);
    return roy.length ? roy : all;
  }
  const partStepLen = (p) => (p && Array.isArray(p.steps) && p.steps.length) || (p && p.stepCount) || 8;
  function nodeHtml(n, nx) {
    const done = nodeStars(n); const open = isUnlocked(n); const isCur = n.id === nx.id;
    const part = CH().partial && CH().partial[n.id];
    const hasPart = hasPartialProgress(part);
    const meta = KIND_META[n.kind] || { icon: "•" };
    const mp = (!done && open && n.kind !== "gate" && n.kind !== "natif" && n.kind !== "boss") ? nodeMicroProgress(n) : null;
    const hasMicroProg = !!(mp && mp.total > 1 && mp.doneCount > 0 && !mp.allDone);
    const cls = ["ody-node", "k-" + n.kind, done ? "done" : "", (hasPart || hasMicroProg) ? "partial" : "", isCur ? "cur" : "", !open ? "locked" : ""].join(" ");
    const dotsHtml = (mp && mp.total > 1) ? `<span class="nd-caps" title="${mp.doneCount}/${mp.total} Micro-Capsules">${mp.caps.map((cp) => `<i class="${mp.doneMask[cp.idx] ? "on" : ""}"></i>`).join("")}</span>` : "";
    return `<button class="${cls}" data-a2="node" data-id="${esc(n.id)}" title="${esc(n.title)}">
      <span class="nd-ic">${!open ? "🔒" : meta.icon}</span>
      ${done ? `<span class="nd-st">${"★".repeat(done)}</span>` : dotsHtml}
      ${hasPart ? `<span class="nd-go resume">STEP ${part.i + 1}/${partStepLen(part)}</span>` : hasMicroProg ? `<span class="nd-go resume">CAP ${mp.doneCount}/${mp.total}</span>` : isCur ? `<span class="nd-go">START</span>` : ""}
      <span class="nd-l">${esc(n.title.length > 26 ? n.title.slice(0, 25) + "…" : n.title)}</span>
    </button>`;
  }
  function unitHtml(u, nx) {
    const c = CH();
    const isRoyal = c.pathMode !== "integral";
    const visNodes = isRoyal ? u.nodes.filter((n) => n.royal) : u.nodes;
    if (!visNodes.length) return "";
    const total = visNodes.length, done = visNodes.filter((n) => nodeStars(n)).length;
    const hasCur = visNodes.some((n) => n.id === nx.id);
    const hasPart = visNodes.some((n) => (c.partial && hasPartialProgress(c.partial[n.id])) || (c.microDone && c.microDone[n.id] && Object.keys(c.microDone[n.id]).length > 0));
    const nxUnitIdx = UNITS.indexOf(nx.unitObj);
    const isOpen = HOME.unitOpen[u.id] != null ? HOME.unitOpen[u.id] : (isRoyal || hasCur || hasPart || UNITS.indexOf(u) === nxUnitIdx + 1);
    const label = u.gate ? `${u.gate === "NATIF" ? "👑" : "🏛️"} ${esc(u.title)}` : u.num === 0 ? `🐣 Unité 0 · ${esc(u.title)}` : `World ${u.num} · ${esc(u.title)}`;
    const g = u.gate ? CH().gates[u.gate] : null;
    const right = u.gate ? (g && g.passed ? `<span class="ok">✔ ${g.placed ? "placed" : (g.best || g.score) + "%"}</span>` : g ? `<span class="warn">${g.score}% — retry</span>` : "") : `<span>${done}/${total}</span>`;
    return `<div class="ody-unit ${isOpen ? "open" : ""} ${hasCur ? "has-cur" : ""} ${done === total ? "complete" : ""} ${u.gate ? "gate" : ""}">
      <button class="ody-unit-h" data-a2="unit" data-id="${u.id}"><span class="t">${done === total && !u.gate ? "✓ " : ""}${label}</span><span class="r">${right} <i class="pbar"><b style="width:${Math.round(done / total * 100)}%"></b></i></span></button>
      ${isOpen ? `<div class="ody-nodes">${visNodes.map((n) => nodeHtml(n, nx)).join("")}</div>` : ""}
    </div>`;
  }
  function levelSynergyBarHtml(lv) {
    if (lv === "NATIF") return "";
    const ns = levelNodes(lv);
    const nextN = ns.find((n) => !nodeStars(n) && n.kind === "core") || ns.find((n) => !nodeStars(n)) || ns[0];
    const distNode = NODES.find((n) => n.kind === "district" && n.cefr === lv) || NODES.find((n) => n.kind === "district");
    const atelNode = NODES.find((n) => n.kind === "atelier" && n.cefr === lv) || NODES.find((n) => n.kind === "atelier");
    const ameCnt = AME_CASES.filter((c) => c.cefr === lv).length;
    const penseeCnt = PENSEE_CASES.filter((c) => c.cefr === lv).length;
    return `<div class="ody-synergy-strip" data-synergy-lv="${lv}">
      <div class="syn-head">
        <span class="syn-badge">🔗 SYNERGIE ${lv} · ÉCOSYSTÈME NATIF COMPLET</span>
        <span class="syn-sub">Chaque pilier du niveau ${lv} nourrit les autres : Grammaire ⇄ Oral ⇄ Pensée Directe ⇄ Culture ⇄ Plume</span>
      </div>
      <div class="syn-grid">
        ${nextN ? `<button type="button" class="syn-pill syn-cap" data-a2="microcap" data-id="${esc(nextN.id)}" data-cap="0"><b>⚡ Capsule 90s (${lv})</b><small>${esc(nextN.title)}</small></button>` : ""}
        <button type="button" class="syn-pill syn-ame" data-a2="amerun" data-lv="${lv}"><b>🇫🇷 Âme &amp; Pensée (${lv})</b><small>${ameCnt} codes sociaux + ${penseeCnt} pensées directes</small></button>
        ${distNode ? `<button type="button" class="syn-pill syn-dist" data-a2="go" data-id="${esc(distNode.id)}"><b>🗺️ Quartier ${lv}</b><small>${esc((distNode.data && distNode.data.icon) || "🏙️")} ${esc(distNode.title)}</small></button>` : ""}
        ${atelNode ? `<button type="button" class="syn-pill syn-atel" data-a2="go" data-id="${esc(atelNode.id)}"><b>✍️ Plume ${lv}</b><small>${esc((atelNode.data && atelNode.data.icon) || "✒️")} ${esc(atelNode.title)}</small></button>` : ""}
        <button type="button" class="syn-pill syn-per" data-a2="allperiodes"><b>✒️ Périodes &amp; Modes (${lv})</b><small>Syntaxe &amp; Subjonctif ${lv}</small></button>
        <button type="button" class="syn-pill syn-amis" data-a2="amis"><b>🥂 Cercle d'Amis (${lv})</b><small>Pratiquer ${lv} avec vos 4 amis</small></button>
      </div>
    </div>`;
  }

  function levelMasteryBarHtml(lv) {
    if (!CEFR.includes(lv)) return "";
    const c = CH();
    const lsk = (c.levelSkills && c.levelSkills[lv]) || {};
    const pillars = [
      { k: "pronunciation", ic: "👄", lbl: "Sons", act: "scene", sc: "soundlab" },
      { k: "listening", ic: "🎧", lbl: "Écoute", act: "pillarrep", p: "listen" },
      { k: "speaking", ic: "🎙️", lbl: "Oral", act: "pillarrep", p: "speak" },
      { k: "reading", ic: "📖", lbl: "Lecture", act: "pillarrep", p: "read" },
      { k: "writing", ic: "✍️", lbl: "Écrit/Gram.", act: "pillarrep", p: "write" }
    ];
    let weakest = pillars[0], lowVal = 101;
    const bars = pillars.map((pl) => {
      const x = lsk[pl.k] || (pl.k === "writing" ? lsk.grammar : null);
      const pct = x && x.n ? Math.round((typeof x.ema === "number" ? x.ema : x.ok / x.n) * 100) : 0;
      if (pct < lowVal) { lowVal = pct; weakest = pl; }
      return `<button type="button" class="lm-pill" data-a2="${pl.act}" ${pl.sc ? `data-s="${pl.sc}"` : `data-p="${pl.p}" data-lv="${lv}"`} title="Renforcer ${pl.lbl} au niveau ${lv} (${pct}%)">
        <span>${pl.ic} ${pl.lbl}</span>
        <i><b style="width:${Math.max(4, pct)}%"></b></i>
        <small>${pct}%</small>
      </button>`;
    }).join("");
    return `<div class="ody-level-mastery" data-lv="${lv}">
      <div class="lm-head">
        <span>⚖️ <b>Maîtrise Complète ${lv}</b> · 5 Compétences</span>
        <button type="button" class="ody-btn tiny ghost" data-a2="${weakest.act}" ${weakest.sc ? `data-s="${weakest.sc}"` : `data-p="${weakest.p}" data-lv="${lv}"`}>🎯 Renforcer ${weakest.lbl} (${lv})</button>
      </div>
      <div class="lm-grid">${bars}</div>
    </div>`;
  }

  function levelHtml(lv, nx) {
    const c = CH();
    const ns = levelNodes(lv); if (!ns.length) return "";
    const allNs = levelNodes(lv, true);
    const done = ns.filter((n) => nodeStars(n)).length;
    let microFrac = 0;
    ns.forEach((n) => {
      if (!nodeStars(n) && c.microDone && c.microDone[n.id]) {
        const cnt = Object.keys(c.microDone[n.id]).length;
        if (cnt > 0) microFrac += Math.min(0.85, cnt * 0.2);
      }
    });
    const pct = Math.min(100, Math.round(((done + microFrac) / Math.max(1, ns.length)) * 100));
    const curLv = levelOfNode(nx);
    const isOpen = HOME.open[lv] != null ? HOME.open[lv] : lv === curLv;
    const gate = c.gates[lv];
    const isLvUnlocked = !!(c.unlockedLevels && c.unlockedLevels[lv]);
    const ahead = cefrRank(lv) > cefrRank(curLv) && !isLvUnlocked;
    const isRoyal = c.pathMode !== "integral";
    const units = UNITS.filter((u) => {
      if (!u.nodes.length || levelOfNode(u.nodes[0]) !== lv) return false;
      return isRoyal ? u.nodes.some((n) => n.royal) : true;
    });
    const modeTag = lv === "NATIF" ? "" : (isRoyal ? ` · 👑 Voie Royale (${ns.length} étapes clés sur ${allNs.length})` : ` · 📚 Intégral (${allNs.length} étapes)`);
    return `<section class="ody-lvl ${isOpen ? "open" : ""} ${lv === curLv ? "cur" : ""}">
      <button class="ody-lvl-h" data-a2="lvl" data-lv="${lv}">
        <span class="lv-badge">${lv === "NATIF" ? "👑" : lv}</span>
        <span class="lv-t">${LEVEL_NAMES[lv]}<small>${done}/${ns.length} done (${pct}%)${modeTag}${gate && gate.passed ? " · level confirmed ✔" : isLvUnlocked ? " · 🔓 Accès libre actif" : ""}</small></span>
        <i class="pbar"><b style="width:${pct}%"></b></i>
        <span class="lv-chev">${isOpen ? "▾" : "▸"}</span>
      </button>
      ${ahead && lv !== "NATIF" ? `<div class="ody-lvl-bridge-row">
        ${!(gate && gate.passed) && EXAMS()[lv] ? `<button class="ody-skip" data-a2="skip" data-lv="${prevLevel(lv)}">🧭 Passer l'examen ${prevLevel(lv)} pour valider d'un coup</button>` : ""}
        <button class="ody-skip unlock-bridge-btn" data-a2="unlocklvl" data-lv="${lv}">🔓 Débloquer le niveau ${lv} immédiatement (Zéro Blocage)</button>
      </div>` : ""}
      ${isOpen ? levelMasteryBarHtml(lv) : ""}
      ${isOpen ? levelSynergyBarHtml(lv) : ""}
      ${isOpen ? `<div class="ody-units">${units.map((u) => unitHtml(u, nx)).join("")}</div>` : ""}
    </section>`;
  }
  function prevLevel(lv) { const i = cefrRank(lv); return i > 0 ? LEVELS[i - 1] : null; }
  function weakestSkillKey() {
    const sk = CH().skills || {};
    let bestKey = "grammar", bestVal = Infinity;
    ALL_SKILLS.forEach((s) => {
      const k = s.k || s.key;
      const x = sk[k] || { n: 0, ok: 0, ema: 0 };
      const score = x.n ? (typeof x.ema === "number" ? x.ema : (x.ok / x.n)) : 0;
      if (score < bestVal) { bestVal = score; bestKey = k; }
    });
    return bestKey;
  }
  function skillPanel() {
    const sk = CH().skills || {};
    const rows = ALL_SKILLS.map((s) => {
      const k = s.k || s.key;
      const ic = s.ic || s.icon || "✨";
      const x = sk[k] || { n: 0, ok: 0, ema: 0 };
      const pct = x.n ? Math.round((typeof x.ema === "number" ? x.ema : (x.ok / x.n)) * 100) : 0;
      const barW = x.n ? Math.max(8, Math.min(100, Math.round(pct * 0.7 + Math.min(30, Math.sqrt(x.ok) * 4)))) : 0;
      return `<div class="ody-skill" data-sk="${k}"><span>${ic} ${s.label}</span><i class="pbar"><b style="width:${barW}%"></b></i><small>${x.ok} ✓${x.n ? ` · ${pct}%` : ""}</small></div>`;
    }).join("");
    const wk = weakestSkillKey();
    const wkMeta = ALL_SKILLS.find((s) => (s.k || s.key) === wk) || ALL_SKILLS[0];
    const wkIc = wkMeta.ic || wkMeta.icon || "🎯";
    return rows + `<button class="ody-btn small ghost" style="width:100%;margin-top:.55rem" data-a2="weakspot">🎯 Renforcer : ${wkIc} ${esc(wkMeta.label)}</button>`;
  }
  function gatesPanel() {
    return LEVELS.map((lv) => { const g = CH().gates[lv]; return `<div class="ody-gate-pill ${g && g.passed ? "ok" : ""}">${lv === "NATIF" ? "👑" : lv}<small>${g && g.passed ? (g.placed ? "placed" : "✔ " + (g.best || g.score) + "%") : g ? g.score + "%" : "—"}</small></div>`; }).join("");
  }
  const MASTERY_EPOCHS = [
    { lv: "A1", title: "Époque I · Fondation & Oreille Parisienne", focus: "Sons du français, liaisons, salutations, café, présent et survie immédiate" },
    { lv: "A2", title: "Époque II · Récits & Vie Quotidienne", focus: "Passé composé, imparfait, futur proche, démarches et dialogues de quartier" },
    { lv: "B1", title: "Époque III · Indépendance & Argumentation", focus: "Opinions nuancées, récits croisés, presse francophone et débats" },
    { lv: "B2", title: "Époque IV · Maîtrise du Subjonctif & Nuance", focus: "Subjonctif, concession, ironie, synthèses et négociations complexes" },
    { lv: "C1", title: "Époque V · Autonomie Éloquente & Registres", focus: "Alchimie des 3 registres, français exécutif, littérature et rhétorique" },
    { lv: "C2", title: "Époque VI · Sommet C2 & Couronne Native", focus: "Stylistique C2, essais académiques, éloquence spontanée & Grand Examen Natif", includeNatif: true }
  ];
  function odysseyAtlasSummary() {
    const c = CH();
    const total = NODES.length || 1;
    const doneCount = NODES.filter((n) => nodeStars(n)).length;
    const remaining = Math.max(0, total - doneCount);
    const dToday = (c.daily && c.daily.date === today()) ? (c.daily.nodes || 0) : 0;
    const districtsDone = NODES.filter((n) => n.kind === "district" && nodeStars(n)).length;
    const districtsTotal = NODES.filter((n) => n.kind === "district").length;
    const ateliersDone = NODES.filter((n) => n.kind === "atelier" && nodeStars(n)).length;
    const ateliersTotal = NODES.filter((n) => n.kind === "atelier").length;
    const nx = nextNode();
    const queue = [];
    if (nx) {
      for (let idx = nx.idx; idx < NODES.length && queue.length < 8; idx++) {
        queue.push(NODES[idx]);
      }
    }
    return { total, doneCount, pct: Math.round((doneCount / total) * 100), remaining, dToday, districtsDone, districtsTotal, ateliersDone, ateliersTotal, rep: c.reputation || 0, queue };
  }
  function odysseyAtlasPanel() {
    const p = odysseyAtlasSummary();
    return `<div class="ody-panel ody-atlas-card">
      <div class="ody-panel-t">🗺️ Atlas de Maîtrise C2 · Sans Limite</div>
      <div class="p90-row"><span>Odyssée accomplie</span><b>${p.doneCount}/${p.total} (${p.pct}%)</b></div>
      <i class="pbar wide"><b style="width:${p.pct}%"></b></i>
      <div class="p90-row" style="margin-top:.45rem"><span>Quêtes de Quartier</span><b>🏙️ ${p.districtsDone}/${p.districtsTotal}</b></div>
      <div class="p90-row" style="margin-top:.25rem"><span>Ateliers Rhétoriques</span><b>✒️ ${p.ateliersDone}/${p.ateliersTotal}</b></div>
      <div class="p90-row" style="margin-top:.25rem"><span>Réputation à Paris</span><b>⚜️ ${p.rep} pts</b></div>
      <div class="ody-mini" style="margin-top:.45rem">Progression par la maîtrise réelle (écoute, parole, lecture, écriture, grammaire, vocabulaire, phonétique) à votre propre rythme.</div>
      <button class="ody-btn small ghost" style="width:100%;margin-top:.5rem" data-a2="atlas">🧭 Ouvrir l'Atlas de Maîtrise C2</button>
    </div>`;
  }
  function renderOdysseyAtlas(fromBack) {
    closeDrawer(); closeSheet(); SES = null; stopAudio(); micStop();
    document.body.classList.remove("ody-in-session");
    document.body.dataset.scene = "atlas";
    if (!fromBack) NAV.push({ kind: "view", scene: "atlas" });
    updateBar();
    const main = $("app-main"); if (!main) return;
    const c = CH(); const p = odysseyAtlasSummary();
    const phasesHtml = MASTERY_EPOCHS.map((ph) => {
      const ns = NODES.filter((n) => levelOfNode(n) === ph.lv || (ph.includeNatif && levelOfNode(n) === "NATIF"));
      const dn = ns.filter((n) => nodeStars(n)).length;
      const pct = ns.length ? Math.round((dn / ns.length) * 100) : 0;
      const g = c.gates[ph.lv];
      const firstOpen = ns.find((n) => !nodeStars(n)) || ns[0];
      return `<div class="p90-phase">
        <div class="p90-ph-top"><span class="lv-badge">${ph.lv}</span><div><b>${ph.title}</b><small>${ph.focus}</small></div><b>${dn}/${ns.length} (${pct}%)${g && g.passed ? " ✔" : ""}</b></div>
        <i class="pbar wide"><b style="width:${pct}%"></b></i>
        <div class="ody-row between" style="margin:.4rem 0 0"><span class="ody-mini">${Math.max(0, ns.length - dn)} étapes restantes dans cette époque</span>${firstOpen && isUnlocked(firstOpen) ? `<button class="ody-btn small ghost" data-a2="go" data-id="${esc(firstOpen.id)}">▶ Explorer ${ph.lv}</button>` : `<span class="ody-mini">🔒 Débloqué par la maîtrise de l'époque précédente</span>`}</div>
      </div>`;
    }).join("");
    const queueHtml = p.queue.map((n, idx) => {
      const done = nodeStars(n);
      const part = c.partial && c.partial[n.id];
      const hasPart = hasPartialProgress(part);
      const meta = KIND_META[n.kind] || { icon: "•", label: "" };
      return `<button class="p90-qitem ${done ? "done" : hasPart ? "partial" : ""}" data-a2="go" data-id="${esc(n.id)}">
        <span class="ic">${meta.icon}</span>
        <span class="txt"><b>#${idx + 1} · ${esc(n.title)}</b><small>${esc(levelOfNode(n))} · ${esc(meta.label)}${hasPart ? ` · Sauvegardé à l'étape ${part.i + 1}/${partStepLen(part)}` : ""}</small></span>
        <span class="tag">${done ? "⭐".repeat(done) : hasPart ? "▶ Reprendre" : "▶ Jouer"}</span>
      </button>`;
    }).join("");
    main.innerHTML = `<div class="ody-result wide p90-page">
      <div class="ody-row between"><h2>🗺️ Atlas de Maîtrise C2 &amp; Couronne Native</h2><button class="ody-btn ghost small" data-a2="home">← Retour à la Carte</button></div>
      <p class="ody-goal" style="text-align:left;max-width:none;margin-left:0">Progressez par la maîtrise authentique des <b>7 dimensions</b> (Écoute, Parole, Lecture, Écriture, Grammaire, Vocabulaire, Prononciation) sans limite de calendrier fixe. Chaque étape est sauvegardée en temps réel.</p>
      <div class="ody-stats">
        <div><b>${p.doneCount}/${p.total}</b><span>Étapes Maîtrisées</span></div>
        <div><b>🏙️ ${p.districtsDone}/${p.districtsTotal}</b><span>Quartiers de Paris</span></div>
        <div><b>✒️ ${p.ateliersDone}/${p.ateliersTotal}</b><span>Ateliers C1/C2</span></div>
        <div><b>⚜️ ${p.rep}</b><span>Réputation</span></div>
      </div>
      <div class="ody-k-label" style="margin-top:1rem">Prochaines Étapes Recommandées (${p.dToday} accomplies aujourd'hui)</div>
      <div class="p90-queue">${queueHtml || "<p>Toutes les étapes de l'Odyssée sont accomplies ! 🎉</p>"}</div>
      <div class="ody-k-label" style="margin-top:1.2rem">Les 6 Époques de Maîtrise (A1 → C2 → Grand Examen Natif)</div>
      <div class="p90-phases">${phasesHtml}</div>
    </div>`;
    updateBar();
  }
  const renderPlan90 = renderOdysseyAtlas;

  function parisMapStripHtml() {
    const c = CH();
    const spots = [
      { id: "dist:district_gare_du_nord", xp: 9, yp: 24, ic: "🚄", name: "Gare du Nord", sub: "Contrôle RATP · A1" },
      { id: "atel:write_a1_brasserie", xp: 14, yp: 76, ic: "☕", name: "Saint-Germain", sub: "Café de Flore · A1" },
      { id: "dist:district_montmartre_bistrot", xp: 26, yp: 22, ic: "🥐", name: "Montmartre", sub: "Bistrot · A2" },
      { id: "dist:district_marais_galerie", xp: 34, yp: 72, ic: "🎨", name: "Le Marais", sub: "Place des Vosges · A2" },
      { id: "dist:district_haussmann_immobilier", xp: 45, yp: 28, ic: "🏛️", name: "Haussmann", sub: "Bail & Visite · B1" },
      { id: "dist:district_canal_saint_martin", xp: 54, yp: 74, ic: "🌉", name: "Canal St-Martin", sub: "Quai de Valmy · B1" },
      { id: "dist:district_cabinet_medical", xp: 65, yp: 26, ic: "🩺", name: "Quartier Latin", sub: "Cabinet · B2" },
      { id: "dist:district_palais_justice", xp: 74, yp: 74, ic: "⚖️", name: "Palais de Justice", sub: "Cour d'Appel · C1" },
      { id: "dist:district_la_defense_comex", xp: 85, yp: 24, ic: "💼", name: "La Défense", sub: "COMEX · C1" },
      { id: "dist:district_academie_coupole", xp: 91, yp: 74, ic: "👑", name: "Sous la Coupole", sub: "Académie · C2" }
    ];
    const pinsHtml = spots.map((sp) => {
      const done = !!(c.done && c.done[sp.id]);
      const part = c.partial && c.partial[sp.id];
      const hasPart = hasPartialProgress(part);
      return `<button type="button" class="pm-pin ${done ? "done" : ""} ${hasPart ? "partial" : ""}" style="left:${sp.xp}%;top:${sp.yp}%" data-a2="landmark" data-id="${sp.id}" title="${esc(sp.name)} — ${esc(sp.sub)}">
        <span class="pm-ico">${sp.ic}</span>
        <span class="pm-txt"><b>${esc(sp.name)}</b><small>${hasPart ? `Étape ${part.i + 1}/${partStepLen(part)}` : done ? "★ Accompli" : esc(sp.sub)}</small></span>
      </button>`;
    }).join("");
    return `<section class="ody-paris-map" aria-label="Carte Vivante de Paris">
      <div class="pm-head">
        <div>
          <span class="pm-kicker">🗺️ CARTE VIVANTE DE PARIS · 10 QUARTIERS &amp; 12 ATELIERS C2</span>
          <h3>Explorez les Quartiers, Joutes Oratoires &amp; Studios de la Capitale</h3>
        </div>
        <div class="pm-actions">
          <button type="button" class="ody-btn small ghost" data-a2="perioderun">✒️ Période &amp; Modes</button>
          <button type="button" class="ody-btn small ghost" data-a2="idiomerun">🎭 Idiomes &amp; Litotes</button>
          <button type="button" class="ody-btn small ghost" data-a2="jouterun">⚖️ Joute C2</button>
          <button type="button" class="ody-btn small ghost" data-a2="sleuthrun">🕵️ Enquête &amp; Forge</button>
          <button type="button" class="ody-btn small ghost" data-a2="radiorun">📻 Radio Lumière</button>
          <button type="button" class="ody-btn small ghost" data-a2="alldistricts">🏙️ 10 Quartiers</button>
          <button type="button" class="ody-btn small ghost" data-a2="allateliers">✒️ 12 Ateliers</button>
          <button type="button" class="ody-btn small ghost" data-a2="allidiomes">📚 18 Idiomes</button>
          <button type="button" class="ody-btn small ghost" data-a2="allperiodes">📜 16 Périodes</button>
          <button type="button" class="ody-btn small ghost" data-a2="pantheon">🏛️ Panthéon</button>
        </div>
      </div>
      <div class="pm-canvas" style="background-image:linear-gradient(180deg, rgba(15, 23, 42, 0.25), rgba(15, 23, 42, 0.55)), url('assets/bg_paris_seine_map.jpg');background-size:cover;background-position:center;">
        <svg class="pm-svg" viewBox="0 0 900 180" preserveAspectRatio="none" aria-hidden="true">
          <path d="M81,43 L126,136 L234,40 L306,130 L405,50 L486,133 L585,47 L666,133 L765,43 L819,133" fill="none" stroke="#fbbf24" stroke-width="2.5" stroke-dasharray="6 6" opacity="0.85"/>
        </svg>
        <div class="pm-pins">${pinsHtml}</div>
      </div>
    </section>`;
  }

  function dailyContractsPanel() {
    const c = CH();
    const s = SAVE();
    s.inventory = s.inventory || {};
    s.perks = s.perks || {};
    const daily = c.daily.date === today() ? c.daily : { xp: 0, sessions: 0, nodes: 0 };
    c.contractsClaimed = (c.contractsDate === today() && c.contractsClaimed) ? c.contractsClaimed : {};
    c.contractsDate = today();
    const inspectedCount = Object.keys(c.inspected || {}).length;
    const contracts = [
      { id: "curiosite", ic: "🔍", title: "Curiosité Parisienne", desc: `Inspecter 3 objets de décor (${Math.min(3, inspectedCount)}/3)`, ok: inspectedCount >= 3, rewardTxt: "+40 🪙 · +10 ⚜️", gold: 40, rep: 10 },
      { id: "epreuve", ic: "⚔️", title: "Épreuve de Maîtrise", desc: `Accomplir 1 étape ou session (${Math.min(1, daily.sessions || daily.nodes || 0)}/1)`, ok: (daily.sessions || 0) >= 1 || (daily.nodes || 0) >= 1, rewardTxt: "+60 🪙 · +1 ⚡50/50", gold: 60, relic: "fiftyFifty" },
      { id: "elan", ic: "🔥", title: "Élan Cognitif", desc: `Atteindre ${c.goal} XP aujourd'hui (${Math.min(c.goal, daily.xp || 0)}/${c.goal})`, ok: (daily.xp || 0) >= c.goal, rewardTxt: "+80 🪙 · +1 🧪Élixir", gold: 80, relic: "critElixir" }
    ];
    const rowsHtml = contracts.map((ct) => {
      const claimed = !!c.contractsClaimed[ct.id];
      return `<div class="ody-contract-row ${claimed ? "claimed" : ct.ok ? "ready" : ""}">
        <span class="ct-ic">${ct.ic}</span>
        <div class="ct-txt"><b>${esc(ct.title)}</b><small>${esc(ct.desc)} · <em>${ct.rewardTxt}</em></small></div>
        ${claimed ? `<span class="ct-tag done">✓ Reçu</span>` : ct.ok ? `<button type="button" class="ody-btn tiny primary" data-a2="claimcontract" data-cid="${ct.id}">🎁 Réclamer</button>` : `<span class="ct-tag">En cours</span>`}
      </div>`;
    }).join("");
    const f50 = s.inventory.fiftyFifty || 0;
    const sh = s.inventory.shield || 0;
    const cr = s.inventory.critElixir || 0;
    const perksList = [
      { id: "plumeVoltaire", ic: "🪶", name: "Plume de Voltaire", desc: "+20% XP permanent", cost: 100 },
      { id: "oreilleMarin", ic: "🎧", name: "Oreille de Marin", desc: "+15% XP & +15 ⚜️", cost: 100 },
      { id: "sceauSorbonne", ic: "🛡️", name: "Sceau Sorbonne", desc: "4 ❤️ aux Boss", cost: 120 }
    ];
    const perksHtml = perksList.map((pk) => {
      const owned = !!s.perks[pk.id];
      return `<button type="button" class="ody-btn tiny ${owned ? "primary" : "ghost"} ody-perk-btn" data-a2="buyperk" data-p="${pk.id}" ${owned ? "disabled" : ""} title="${esc(pk.name)} : ${esc(pk.desc)}">${pk.ic} ${esc(pk.name)} <small>${owned ? "✓ Actif" : pk.cost + "🪙"}</small></button>`;
    }).join("");
    return `<div class="ody-panel ody-contracts-card">
      <div class="ody-panel-t">📜 Contrats du Jour &amp; Forge de Reliques</div>
      <div class="ody-contracts-list">${rowsHtml}</div>
      <div class="ody-relic-shop">
        <div class="ody-mini" style="margin:.45rem 0 .3rem">🏺 <b>Forge de Reliques</b> (50 🪙 l'unité · Or : <b>${(s.gold || 0).toLocaleString()} 🪙</b>)</div>
        <div class="ody-relic-buy-row">
          <button type="button" class="ody-btn tiny ghost" data-a2="buyrelic" data-r="fiftyFifty">⚡ 50/50 (${f50}) · 50🪙</button>
          <button type="button" class="ody-btn tiny ghost" data-a2="buyrelic" data-r="shield">🛡️ Bouclier (${sh}) · 50🪙</button>
          <button type="button" class="ody-btn tiny ghost" data-a2="buyrelic" data-r="critElixir">🧪 Élixir (${cr}) · 50🪙</button>
        </div>
        <div class="ody-mini" style="margin:.5rem 0 .3rem">🏅 <b>Privilèges Souverains Permanents</b></div>
        <div class="ody-relic-buy-row">${perksHtml}</div>
      </div>
    </div>`;
  }

  function isEnGuide() {
    const c = CH();
    if (c.uiLang === "en") return true;
    if (c.uiLang === "fr") return false;
    return cefrRank(currentLevel()) <= 1;
  }

  function bondLevelInfo(pts) {
    const p = pts || 0;
    if (p >= 180) return { lv: 5, label: "Âme Parisienne", next: 180, pct: 100 };
    if (p >= 100) return { lv: 4, label: "Confident", next: 180, pct: Math.round(((p - 100) / 80) * 100) };
    if (p >= 50) return { lv: 3, label: "Complice", next: 100, pct: Math.round(((p - 50) / 50) * 100) };
    if (p >= 20) return { lv: 2, label: "Habitué", next: 50, pct: Math.round(((p - 20) / 30) * 100) };
    return { lv: 1, label: "Nouveau", next: 20, pct: Math.round((p / 20) * 100) };
  }

  function addBond(fid, pts) {
    if (!fid) return;
    const c = CH();
    c.bonds = c.bonds || {};
    const prevLv = bondLevelInfo(c.bonds[fid] || 0).lv;
    c.bonds[fid] = (c.bonds[fid] || 0) + (pts || 10);
    const nextInfo = bondLevelInfo(c.bonds[fid]);
    if (nextInfo.lv > prevLv) {
      const f = AMIS_DE_PARIS.find((x) => x.id === fid);
      toast(`❤️ Lien renforcé · ${f ? f.name : fid} (Lv.${nextInfo.lv})`, `Nouveau rang d'amitié : ${nextInfo.label} !`, "❤️");
    }
  }

  const PARIS_DISPATCHES = [
    { id: "d_cafe", fid: "camille", place: "Café de Flore · Saint-Germain", icon: "☕", quoteFr: "« Viens ! Le serveur arrive, tu commandes quoi ? »", subEn: "Camille waves you over at Café de Flore — jump into a 90s live micro-scene.", subFr: "Camille vous fait signe en terrasse — plongez dans une micro-scène de 90s.", act: "microcap", ctaEn: "Step Into Scene (90s)", ctaFr: "Entrer en Scène (90s)" },
    { id: "d_canal", fid: "yanis", place: "Canal Saint-Martin · 10e", icon: "🌉", quoteFr: "« T'es où mec ? Décode le vrai français de rue avant qu'on parte ! »", subEn: "Yanis challenges you to decode real Parisian street French & direct thought.", subFr: "Yanis vous défie de décoder le vrai français parlé sans traduire.", act: "amerun", ctaEn: "Meet Yanis (90s)", ctaFr: "Rejoindre Yanis (90s)" },
    { id: "d_metro", fid: "camille", place: "Métro Ligne 1 · Châtelet", icon: "🚇", quoteFr: "« Les portes vont se fermer ! Un sprint de 60s sur les 4 piliers ! »", subEn: "High-speed 60s Parisian sprint across Read, Listen, Write & Speak.", subFr: "Sprint éclair de 60s à travers Lire, Écouter, Écrire et Parler.", act: "quick60", ctaEn: "Catch the Train (60s)", ctaFr: "Attraper la Rame (60s)" },
    { id: "d_marais", fid: "celeste", place: "Galerie du Marais · 3e", icon: "🎨", quoteFr: "« Un collectionneur vient de te parler — réponds à voix haute ! »", subEn: "Step into Céleste's gallery and speak aloud with native Parisian cadence.", subFr: "Entrez dans la galerie de Céleste et prenez la parole avec élégance.", act: "pillarrep", p: "speak", ctaEn: "Speak Aloud (90s)", ctaFr: "Prendre la Parole (90s)" },
    { id: "d_oberkampf", fid: "yanis", place: "Rue Oberkampf · 11e", icon: "🎧", quoteFr: "« Écoute bien ce qu'il vient de lâcher à vitesse réelle ! »", subEn: "Catch fast street French, elisions & liaisons in 90 seconds.", subFr: "Captez le français parlé rapide, les élisions et les liaisons en 90s.", act: "pillarrep", p: "listen", ctaEn: "Intercept Audio (90s)", ctaFr: "Capter l'Audio (90s)" },
    { id: "d_vosges", fid: "celeste", place: "Place des Vosges · 4e", icon: "✍️", quoteFr: "« Écris cette réplique de mémoire pure — sans filet ! »", subEn: "Blank-slate memory recall challenge under the arcades of Place des Vosges.", subFr: "Défi de mémoire page blanche sous les arcades de la Place des Vosges.", act: "pillarrep", p: "write", ctaEn: "Take the Challenge (90s)", ctaFr: "Relever le Défi (90s)" },
    { id: "d_sorbonne", fid: "valcourt", place: "Sous la Coupole · 6e", icon: "🏛️", quoteFr: "« Décryptez le sous-entendu caché dans cette dépêche parisienne. »", subEn: "Read between the lines like an educated Parisian with Prof. Valcourt.", subFr: "Lisez entre les lignes et décodez les nuances avec le Prof. Valcourt.", act: "pillarrep", p: "read", ctaEn: "Decode Dispatch (90s)", ctaFr: "Décrypter (90s)" },
    { id: "d_terrasse", fid: "camille", place: "Terrasse du 6e · Rive Gauche", icon: "🥂", quoteFr: "« Raconte-moi ta journée en français — même une seule phrase ! »", subEn: "Drop by the terrace and chat live with your 4 Parisian friends.", subFr: "Passez en terrasse discuter librement avec vos 4 amis parisiens.", act: "amis", ctaEn: "Join the Table", ctaFr: "Rejoindre la Table" }
  ];
  let DISPATCH_IDX = 0;

  function parisDispatchHtml(activeNode, mpActive) {
    const c = CH();
    const en = isEnGuide();
    const d = PARIS_DISPATCHES[DISPATCH_IDX % PARIS_DISPATCHES.length];
    const friend = AMIS_DE_PARIS.find((x) => x.id === d.fid) || AMIS_DE_PARIS[0];
    const bond = bondLevelInfo((c.bonds && c.bonds[d.fid]) || 0);
    const heat = c.heatStreak >= 5 ? 3 : c.heatStreak >= 3 ? 2 : c.heatStreak >= 2 ? 1.5 : 1;
    const capIdx = (mpActive && mpActive.nextCapIdx != null) ? mpActive.nextCapIdx : 0;
    return `<section class="ody-dispatch-card" id="ody-paris-dispatch" aria-label="Live Paris Street Dispatch">
      <div class="disp-top">
        <span class="disp-live-pill">📞 ${en ? "LIVE IN PARIS · STREET ENCOUNTER" : "EN DIRECT DE PARIS · RENCONTRE DE RUE"}</span>
        <span class="disp-place">${d.icon} ${esc(d.place)}</span>
        <span class="disp-bond-pill" title="Character Bond Level">❤️ ${esc(friend.name)} · Lv.${bond.lv} ${esc(bond.label)}</span>
        ${heat > 1 ? `<span class="disp-heat-pill">🔥 HEAT ×${heat}</span>` : ""}
      </div>
      <div class="disp-body">
        <img src="${friend.img}" class="disp-av" alt="${esc(friend.name)}" onerror="this.style.display='none'">
        <div class="disp-txt">
          <div class="disp-quote" data-a="say" data-t="${esc(d.quoteFr.replace(/[«»]/g, ""))}">${esc(d.quoteFr)} 🔊</div>
          <div class="disp-sub">${esc(en ? d.subEn : d.subFr)}</div>
        </div>
        <div class="disp-actions">
          <button type="button" class="ody-btn primary small" id="ody-dispatch-go" data-a2="launchdispatch" data-idx="${DISPATCH_IDX % PARIS_DISPATCHES.length}" data-nid="${esc(activeNode.id)}" data-cap="${capIdx}">▶ ${esc(en ? d.ctaEn : d.ctaFr)}</button>
          <button type="button" class="ody-btn ghost tiny" id="ody-dispatch-reroll" data-a2="rerolldispatch">🎲 ${en ? "Next Call" : "Autre Appel"}</button>
        </div>
      </div>
    </section>`;
  }

  function getChroniques() {
    return Array.isArray(window.CHRONIQUES_DE_PARIS) ? window.CHRONIQUES_DE_PARIS : [];
  }

  function buildChroniqueSession(epId) {
    const ep = getChroniques().find((x) => x.id === epId) || getChroniques()[0];
    if (!ep) return [];
    const steps = [{
      k: "intro",
      title: ep.title,
      place: `${ep.icon} ${ep.place} · ${ep.cefr}`,
      goal: `${isEnGuide() ? ep.subEn : ep.subFr} (5 scènes vivantes : Écouter · Lire · Écrire · Parler)`
    }];
    (ep.scenes || []).forEach((sc) => {
      const copy = JSON.parse(JSON.stringify(sc));
      if (copy.k === "dialogue" && Array.isArray(copy.options)) copy.options = shuffle(copy.options);
      if ((copy.k === "listen" || copy.k === "mcq") && Array.isArray(copy.choices)) copy.choices = shuffle(copy.choices);
      steps.push(copy);
    });
    return steps;
  }

  function chroniquesStripHtml() {
    const eps = getChroniques();
    if (!eps.length) return "";
    const c = CH();
    const done = c.chroniquesDone || {};
    const en = isEnGuide();
    const doneCount = eps.filter((e) => done[e.id]).length;
    const cardsHtml = eps.map((ep) => {
      const isDone = !!done[ep.id];
      return `<button type="button" class="chr-card ${isDone ? "done" : ""}" data-a2="playchronique" data-ep="${esc(ep.id)}" title="${esc(en ? ep.subEn : ep.subFr)}">
        ${ep.coverImg ? `<div class="chr-thumb" style="background-image:url('${ep.coverImg}')"></div>` : ""}
        <div class="chr-top">
          <span class="chr-cefr">${esc(ep.cefr)}</span>
          <span class="chr-ic">${ep.icon}</span>
          <span class="chr-state">${isDone ? "✅" : "▶"}</span>
        </div>
        <div class="chr-title">${esc(ep.title.replace(/^Épisode \d+ · /, ""))}</div>
        <div class="chr-meta">${esc(ep.friendName)} · 5 scènes</div>
      </button>`;
    }).join("");
    return `<section class="ody-chroniques-strip" id="ody-chroniques-strip" aria-label="Les Chroniques de Paris">
      <div class="chr-head">
        <div>
          <span class="chr-badge">🎬 ${en ? "STORY CAMPAIGN · A1 → C2" : "CAMPAGNE NARRATIVE · A1 → C2"}</span>
          <h3>Les Chroniques de Paris <small>(${doneCount}/${eps.length} ${en ? "episodes lived" : "épisodes vécus"})</small></h3>
        </div>
        <button type="button" class="ody-btn ghost tiny" data-a2="chroniques">${en ? "All 6 Episodes" : "Voir les 6 Épisodes"} ▸</button>
      </div>
      <div class="chr-grid">${cardsHtml}</div>
    </section>`;
  }

  let STUDIO_LV = null;
  function levelStudioDeckHtml() {
    const curLv = currentLevel() === "NATIF" ? "C2" : currentLevel();
    const lv = CEFR.includes(STUDIO_LV) ? STUDIO_LV : curLv;
    const en = isEnGuide();
    const pills = CEFR.map((x) => `<button type="button" class="lsd-pill ${x === lv ? "active" : ""}" data-a2="studiolevel" data-lv="${x}">${x}</button>`).join("");
    const levelExtras = {
      A1: [
        { ic: "👄", t: "Labo des Sons (A1)", sub: "18 sons, paires minimales & bouche", act: "scene", sc: "soundlab" },
        { ic: "🥖", t: "Quartier Boulangerie (A1)", sub: "Commander & politesse parisienne", act: "alldistricts" }
      ],
      A2: [
        { ic: "⏳", t: "Passé Composé vs Imparfait", sub: "Forge des temps & récits A2", act: "sleuthrun" },
        { ic: "🏠", t: "Coloc & Pharmacie (A2)", sub: "Scènes visuelles du quotidien", act: "explore", sid: "coloc_10e" }
      ],
      B1: [
        { ic: "🔀", t: "Pronoms Y/EN & Métro (B1)", sub: "Réflexes de conversation B1", act: "explore", sid: "metro_chatelet" },
        { ic: "📻", t: "Radio & Vitesse Réelle (B1)", sub: "Comprendre les Français vite", act: "scene", sc: "gym" }
      ],
      B2: [
        { ic: "⚖️", t: "Subjonctif & Débat Odéon (B2)", sub: "Nuance, concession & cinéma", act: "perioderun" },
        { ic: "🕯️", t: "Dîner du Marais (B2)", sub: "Codes de table & ironie", act: "explore", sid: "diner_marais" }
      ],
      C1: [
        { ic: "🏛️", t: "Banque & Comex (C1)", sub: "3 registres & synthèse exécutive", act: "explore", sid: "prefecture_banque" },
        { ic: "⚖️", t: "Joute Oratoire (C1)", sub: "Concession · Réfutation · Synthèse", act: "jouterun" }
      ],
      C2: [
        { ic: "✨", t: "Pont des Arts Minuit (C2)", sub: "Éloquence, litotes & Académie", act: "explore", sid: "pont_des_arts" },
        { ic: "🏛️", t: "Panthéon & Période (C2)", sub: "18 Sceaux & Architecture C2", act: "pantheon" }
      ]
    }[lv] || [];
    const cards = [
      { ic: "🗺️", t: `Explorer Paris (${lv})`, sub: en ? "Tap objects in illustrated scenes · 0 English" : "Touchez les objets dans l'image · 0 anglais", act: "openexplorepicker", cls: "is-visual" },
      { ic: "⚡", t: `Arcade Swipe (${lv})`, sub: en ? "Fast Left/Right touch & keyboard reflexes" : "Glissez ⬅️/➡️ · Réflexes éclairs", act: "swipe", lv, cls: "is-swipe" },
      { ic: "👁️", t: `Voir & Entendre (${lv})`, sub: en ? "Hear French → Tap the right Paris scene" : "Écoutez → Touchez la bonne scène", act: "visreflex", lv, cls: "is-vis" },
      ...levelExtras
    ];
    return `<section class="ody-level-studio-deck" id="ody-level-studio-deck" aria-label="Ateliers Visuels & Interactifs par Niveau">
      <div class="lsd-head">
        <div>
          <span class="lsd-badge">🎨 ${en ? "VISUAL & INTERACTIVE · NO WALLS OF TEXT" : "VISUEL & INTERACTIF · ZÉRO LECTURE PASSIVE"}</span>
          <h3>${en ? `Master Level ${lv} Thoroughly` : `Maîtriser le Niveau ${lv} à Fond`}</h3>
        </div>
        <div class="lsd-pills" role="tablist">${pills}</div>
      </div>
      <div class="lsd-grid">
        ${cards.map((k) => `<button type="button" class="lsd-card ${k.cls || ""}" data-a2="${k.act}" ${k.lv ? `data-lv="${k.lv}"` : ""} ${k.sid ? `data-sid="${k.sid}"` : ""} ${k.sc ? `data-s="${k.sc}"` : ""}>
          <span class="lsd-ic">${k.ic}</span>
          <span><b>${esc(k.t)}</b><small>${esc(k.sub)}</small></span>
        </button>`).join("")}
      </div>
    </section>`;
  }

  function openExplorePickerSheet() {
    closeSheet(); closeDrawer();
    const scenes = Array.isArray(window.VISUAL_SCENES) ? window.VISUAL_SCENES : [];
    const d = document.createElement("div"); d.className = "ody-sheet-wrap"; d.id = "ody-sheet";
    d.innerHTML = `<div class="ody-sheet wide-sheet">
      <div class="ody-row between">
        <div>
          <div class="ody-kind">🗺️ REGARDER &amp; TOUCHER · 10 SCÈNES VISUELLES DE PARIS (A1 → C2)</div>
          <h3>Apprenez par l'Image et l'Oreille — Zéro Traduction Anglaise</h3>
          <div class="ody-mini">Choisissez un lieu de Paris, touchez les objets directement dans l'illustration, puis relevez la Chasse Audio !</div>
        </div>
        <button class="ody-btn ghost small" data-a2="closesheet">✕ Fermer</button>
      </div>
      <div class="exp-picker-grid">
        ${scenes.map((sc) => `<button type="button" class="exp-pick-card" data-a2="explore" data-sid="${esc(sc.id)}">
          <div class="epc-img" style="background-image:url('${sc.bg}')"><span class="chr-cefr">${esc(sc.cefr)}</span></div>
          <div class="epc-body"><b>${esc(sc.title)}</b><small>${esc(sc.place)} · ${(sc.hotspots || []).length} objets</small></div>
        </button>`).join("")}
      </div>
    </div>`;
    document.body.appendChild(d);
    d.addEventListener("click", (e) => { if (e.target === d) closeSheet(); });
  }

  function openChroniquesSheet() {
    closeSheet(); closeDrawer();
    const eps = getChroniques();
    const done = CH().chroniquesDone || {};
    const en = isEnGuide();
    const listHtml = eps.map((ep) => {
      const isDone = !!done[ep.id];
      return `<div class="chr-sheet-card ${isDone ? "done" : ""}">
        <div class="chr-sheet-left">
          <div class="chr-sheet-k"><span class="chr-cefr">${esc(ep.cefr)}</span> ${ep.icon} ${esc(ep.place)} · ❤️ ${esc(ep.friendName)}</div>
          <div class="chr-sheet-t">${esc(ep.title)} ${isDone ? "✅" : ""}</div>
          <div class="chr-sheet-sub">${esc(en ? ep.subEn : ep.subFr)}</div>
          <div class="chr-sheet-pills"><span>🎧 Écouter (⚡ 1.25x)</span><span>📰 Lire</span><span>✍️ Écrire (AZERTY)</span><span>🎙️ Parler</span></div>
        </div>
        <button type="button" class="ody-btn ${isDone ? "ghost" : "primary"} small" data-a2="playchronique" data-ep="${esc(ep.id)}">${isDone ? "🔁 Rejouer" : "▶ Vivre l'Épisode"}</button>
      </div>`;
    }).join("");
    const d = document.createElement("div"); d.className = "ody-sheet-wrap"; d.id = "ody-sheet";
    d.innerHTML = `<div class="ody-sheet wide-sheet">
      <div class="ody-row between">
        <div>
          <div class="ody-kind">🎬 LES CHRONIQUES DE PARIS · 6 ÉPISODES · 30 SCÈNES VIVANTES</div>
          <h3>Vivez votre histoire parisienne du zéro (A1) à la fluidité native (C2)</h3>
          <div class="ody-mini">Chaque épisode tisse Écoute, Lecture, Écriture et Oral dans une vraie scène de Paris — +25 ⚜️ Réputation &amp; +20 ❤️ Lien !</div>
        </div>
        <button class="ody-btn ghost small" data-a2="closesheet">✕ Fermer</button>
      </div>
      <div class="chr-sheet-list">${listHtml}</div>
    </div>`;
    document.body.appendChild(d);
    d.addEventListener("click", (e) => { if (e.target === d) closeSheet(); });
  }

  function quatuorAndPathBarHtml() {
    const c = CH();
    const sk = c.skills || {};
    const en = isEnGuide();
    const isRoyal = c.pathMode !== "integral";
    const royalTotal = NODES.filter((n) => n.royal).length;
    const integralTotal = NODES.length;
    const pctFor = (k) => {
      const x = sk[k] || { n: 0, ok: 0, ema: 0 };
      return x.n ? Math.round((typeof x.ema === "number" ? x.ema : (x.ok / x.n)) * 100) : 0;
    };
    const lv = currentLevel() === "NATIF" ? "C2" : currentLevel();
    return `<section class="ody-quatuor-deck" aria-label="Les 4 Piliers Natifs & Sélecteur de Parcours">
      <div class="ody-voie-bar">
        <div class="voie-left">
          <img src="assets/pixel_voie_royale.png?v=26.0" class="voie-crest" alt="👑">
          <div class="voie-txt">
            <span class="voie-kicker">${en ? "🧭 LEARNING PACE · NEVER GET STUCK BETWEEN LEVELS" : "🧭 RYTHME D'AVANCEMENT · ZÉRO ENLISEMENT ENTRE LES NIVEAUX"}</span>
            <b>${isRoyal ? (en ? `👑 Royal Fast-Track Active (${royalTotal} core milestones A1→C2 · ~12/level)` : `👑 Voie Royale Active (${royalTotal} étapes clés A1→C2 · ~12 par niveau)`) : (en ? `📚 Complete Archive Active (${integralTotal} full stages · 62 Worlds)` : `📚 Parcours Intégral Actif (${integralTotal} étapes complètes · 62 Mondes)`)}</b>
            <small>${en ? "Switch freely between the fast-track milestones and the full 62-world course, or unlock any CEFR level in 1 click." : "Passez librement du parcours accéléré (sans jamais stagner) au parcours complet, ou débloquez n'importe quel niveau en 1 clic."}</small>
          </div>
        </div>
        <div class="voie-toggle-btns">
          <button type="button" class="ody-btn small ${isRoyal ? "primary" : "ghost"}" data-a2="pathmode" data-m="royal">👑 ${en ? "Royal Track (~12/lvl)" : "Voie Royale (~12/niv.)"}</button>
          <button type="button" class="ody-btn small ${!isRoyal ? "primary" : "ghost"}" data-a2="pathmode" data-m="integral">📚 ${en ? `Full (${integralTotal})` : `Intégral (${integralTotal})`}</button>
        </div>
      </div>
      <div class="quatuor-head">
        <img src="assets/pixel_quatuor.png?v=26.0" class="quatuor-crest" alt="4 Piliers">
        <div>
          <span class="quatuor-kicker">${en ? `🎯 THE 4 NATIVE FRENCH PILLARS · ACTIVE TRAINING (${lv})` : `🎯 LES 4 PILIERS DU FRANÇAIS NATIF · ENTRAÎNEMENT ACTIF (${lv})`}</span>
          <h4>${en ? "Read · Listen · Write · Speak like a real native (90s active reps — no passive MCQ)" : "Lire · Écouter · Écrire · Parler comme un vrai Français (Reps de 90s sans QCM passif)"}</h4>
        </div>
      </div>
      <div class="quatuor-grid">
        <button type="button" class="quatuor-card q-read" data-a2="pillarrep" data-p="read">
          <span class="qc-top"><span class="qc-ic">📖</span><b>${en ? "1. READ · LIRE" : "1. LIRE"}</b><span class="qc-pct">${pctFor("reading")}%</span></span>
          <small>${en ? "Real French texts, cultural nuances & direct thinking without translating" : "Textes authentiques, sous-entendus, litotes &amp; pensée directe"}</small>
          <span class="qc-go">▶ ${en ? "Reading Rep (90s)" : "Rep Lecture (90s)"}</span>
        </button>
        <button type="button" class="quatuor-card q-listen" data-a2="pillarrep" data-p="listen">
          <span class="qc-top"><span class="qc-ic">👂</span><b>${en ? "2. LISTEN · ÉCOUTER" : "2. ÉCOUTER"}</b><span class="qc-pct">${pctFor("listening")}%</span></span>
          <small>${en ? "Fast spoken French (« chais pas »), liaisons, radio & pure dictation" : "Élisions de rue (« chais pas »), liaisons, Radio &amp; Dictée pure"}</small>
          <span class="qc-go">▶ ${en ? "Listening Rep (90s)" : "Rep Écoute (90s)"}</span>
        </button>
        <button type="button" class="quatuor-card q-write" data-a2="pillarrep" data-p="write">
          <span class="qc-top"><span class="qc-ic">✍️</span><b>${en ? "3. WRITE · ÉCRIRE" : "3. ÉCRIRE"}</b><span class="qc-pct">${pctFor("writing")}%</span></span>
          <small>${en ? "Blank-slate memory recall (no hints), verb forge & C2 sentences" : "Mémoire page blanche (zéro indice), verbes &amp; périodes C2"}</small>
          <span class="qc-go">▶ ${en ? "Writing Rep (90s)" : "Rep Écriture (90s)"}</span>
        </button>
        <button type="button" class="quatuor-card q-speak" data-a2="pillarrep" data-p="speak">
          <span class="qc-top"><span class="qc-ic">🎙️</span><b>${en ? "4. SPEAK · PARLER" : "4. PARLER"}</b><span class="qc-pct">${pctFor("speaking")}%</span></span>
          <small>${en ? "Rhythm shadowing, live microphone scoring, social codes & improv" : "Shadowing rythmique, voix au micro, codes sociaux &amp; improv"}</small>
          <span class="qc-go">▶ ${en ? "Speaking Rep (90s)" : "Rep Parole (90s)"}</span>
        </button>
      </div>
    </section>`;
  }

  function renderHome() {
    if (!isPrivateAuthorized()) {
      renderPrivateLockGate();
      return;
    }
    document.body.classList.remove("ody-locked");
    if (!NODES.length) buildPath();
    SES = null; stopAudio(); micStop();
    document.body.classList.remove("ody-in-session");
    document.body.dataset.scene = "home";
    NAV.stack = [{ kind: "view", scene: "home" }];
    const main = $("app-main"); if (!main) return;
    const c = CH();
    if (!c.onboarded) return renderOnboarding(0);
    const nx = nextNode();
    const activeKey = c.activeNodeId;
    const isStandaloneActive = !!(activeKey && String(activeKey).startsWith("__mode:") && c.partial && hasPartialProgress(c.partial[activeKey]));
    const standalonePart = isStandaloneActive ? c.partial[activeKey] : null;
    const activeNode = (!isStandaloneActive && activeKey && c.partial && hasPartialProgress(c.partial[activeKey]) && !c.done[activeKey] && NODE_BY_ID[activeKey]) || nx;
    const activePart = c.partial && c.partial[activeNode.id];
    const isResuming = hasPartialProgress(activePart);
    const meta = KIND_META[activeNode.kind] || {};
    const rv = reviewCards().length;
    const name = c.name ? ` ${esc(c.name)}` : "";
    const started = Object.keys(c.done).length > 0 || isResuming || isStandaloneActive;
    const daily = c.daily.date === today() ? c.daily : { xp: 0, sessions: 0, nodes: 0 };
    const actLen = partStepLen(activePart);
    const stndLen = partStepLen(standalonePart);
    const progPct = isResuming ? Math.max(8, Math.round(((activePart.i + 1) / actLen) * 100)) : 0;
    const modeProgPct = standalonePart ? Math.max(8, Math.round(((standalonePart.i + 1) / stndLen) * 100)) : 0;
    const curTitle = c.equippedTitle || "🐣 Flâneur de la Seine";
    const mpActive = (activeNode.kind !== "gate" && activeNode.kind !== "natif" && activeNode.kind !== "boss") ? nodeMicroProgress(activeNode) : null;
    const microDeckHtml = (mpActive && mpActive.total > 1) ? `<div class="ody-micro-deck">
      <div class="micro-deck-head">
        <span>⚡ <b>Micro-Modules (~90s chacun)</b> · ${mpActive.doneCount}/${mpActive.total} capsules verrouillées</span>
        <small>Jouez 1 capsule entre deux cours ou toute l'étape d'un coup !</small>
      </div>
      <div class="micro-deck-pills">
        ${mpActive.caps.map((cp) => {
          const isDone = !!mpActive.doneMask[cp.idx];
          const isNext = !isDone && cp.idx === mpActive.nextCapIdx;
          return `<button type="button" class="micro-cap-btn ${isDone ? "done" : ""} ${isNext ? "next" : ""}" data-a2="microcap" data-id="${esc(activeNode.id)}" data-cap="${cp.idx}" title="Lancer ${esc(cp.title)} (${cp.steps.length} micro-actions · ~90 sec)">
            <span class="mc-ic">${isDone ? "✅" : isNext ? "⚡" : "○"}</span>
            <span class="mc-txt"><b>${esc(cp.title)}</b><small>${cp.steps.length} étapes · ~90s</small></span>
          </button>`;
        }).join("")}
      </div>
    </div>` : "";
    main.innerHTML = `<div class="ody-home">
      <div class="ody-home-main">
        <section class="ody-hero">
          ${camille("lg")}
          <div class="ody-hero-txt">
            <div class="ody-hello">Bonjour${name} ! · <span class="ody-rep-inline">⚜️ ${c.reputation || 0} Réputation</span> · <button type="button" class="ody-title-badge" data-a2="pantheon" title="Ouvrir le Panthéon des Immortels pour changer de titre">${esc(curTitle)}</button></div>
            <div class="ody-next-k">${meta.icon || ""} ${esc(meta.label || "")} · ${esc(levelOfNode(activeNode))}${activeNode.unitObj && activeNode.unitObj.num ? ` · World ${activeNode.unitObj.num}` : ""}</div>
            <div class="ody-next-t">${esc(activeNode.title)}</div>
            ${isResuming ? `<div class="ody-hero-prog">⏳ Saved at <b>Step ${activePart.i + 1} of ${actLen}</b> (${progPct}%) <i class="pbar"><b style="width:${progPct}%"></b></i></div>` : ""}
            ${isStandaloneActive ? `<div class="ody-hero-prog">⚡ En pause : <b>${esc(standalonePart.title || standalonePart.mode)} · Step ${standalonePart.i + 1} of ${stndLen}</b> (${modeProgPct}%)</div>` : ""}
            ${microDeckHtml}
          </div>
          <div class="ody-hero-actions">
            <button class="ody-btn primary huge" data-a2="go" data-id="${esc(activeNode.id)}" id="ody-primary">▶ ${isResuming ? `Resume (Step ${activePart.i + 1}/${actLen})` : started ? "Continue" : "Start"}</button>
            ${mpActive && mpActive.total > 1 ? `<button class="ody-btn small micro-hero-btn" data-a2="microcap" data-id="${esc(activeNode.id)}" data-cap="${mpActive.nextCapIdx}">⚡ Capsule ${mpActive.nextCapIdx + 1}/${mpActive.total} (90s)</button>` : ""}
            <button class="ody-btn ghost small" data-a2="quick60">⚡ Express 60s</button>
            ${isResuming ? `<button class="ody-btn ghost small" data-a2="restart" data-id="${esc(activeNode.id)}">🔄 Restart from Step 1</button>` : ""}
            ${isStandaloneActive ? `<button class="ody-btn ghost small" data-a2="resumemode" data-k="${esc(activeKey)}">▶ Resume ${esc(standalonePart.title || standalonePart.mode)} (${standalonePart.i + 1}/${stndLen})</button>` : ""}
          </div>
        </section>
        ${parisDispatchHtml(activeNode, mpActive)}
        ${levelStudioDeckHtml()}
        ${chroniquesStripHtml()}
        ${quatuorAndPathBarHtml()}
        ${parisMapStripHtml()}
        <div class="ody-neuro-bar">
          <button class="ody-neuro-btn quick60" data-a2="quick60"><span class="ni">⚡</span><span><b>Capsule Express 60s</b><small>4 micro-actions · Dopamine &amp; Coffre</small></span></button>
          <button class="ody-neuro-btn ame" data-a2="amerun"><span class="ni">🇫🇷</span><span><b>L'Âme &amp; Pensée Directe</b><small>36 réflexes natifs · Zéro traduction</small></span></button>
          <button class="ody-neuro-btn amis" data-a2="amis"><span class="ni">🥂</span><span><b>Mes Amis de Paris</b><small>4 vrais amis · Zéro solitude · Vocal</small></span></button>
          <button class="ody-neuro-btn blitz" data-a2="blitz"><span class="ni">🔥</span><span><b>Blitz Réflexe</b><small>6s speed wiring · zero English</small></span></button>
          <button class="ody-neuro-btn shad" data-a2="shadowrun"><span class="ni">🎙️</span><span><b>Studio Shadowing</b><small>Native rhythm &amp; mouth muscle</small></span></button>
          <button class="ody-neuro-btn imp" data-a2="improvrun"><span class="ni">🎭</span><span><b>Improv à Paris</b><small>Live street scenes · no MCQ</small></span></button>
          <button class="ody-neuro-btn sleuth" data-a2="sleuthrun"><span class="ni">🕵️</span><span><b>Enquête &amp; Forge C2</b><small>Sleuth errors, verbs &amp; liaisons</small></span></button>
          <button class="ody-neuro-btn joute" data-a2="jouterun"><span class="ni"><img src="assets/pixel_balance.png" class="ob-mini-px" alt="⚖️"></span><span><b>Joute Oratoire C2</b><small>Concession · Réfutation · Synthèse</small></span></button>
          <button class="ody-neuro-btn idiome" data-a2="idiomerun"><span class="ni"><img src="assets/pixel_masque.png" class="ob-mini-px" alt="🎭"></span><span><b>Idiomes &amp; Litotes C2</b><small>18 sous-entendus &amp; Synthèse DALF</small></span></button>
          <button class="ody-neuro-btn periode" data-a2="perioderun"><span class="ni"><img src="assets/pixel_plume.png" class="ob-mini-px" alt="✒️"></span><span><b>Architecte de la Période</b><small>16 périodes &amp; 18 modes (Subjonctif)</small></span></button>
          <button class="ody-neuro-btn pantheon" data-a2="pantheon"><span class="ni"><img src="assets/pixel_pantheon.png" class="ob-mini-px" alt="🏛️"></span><span><b>Panthéon des Immortels</b><small>12 Sceaux de Paris &amp; Titres C2</small></span></button>
        </div>
        ${rv >= 1 ? `<button class="ody-review-card" data-a2="review"><span class="ic">🔁</span><span><b>Carnet de révision actif · ${Math.min(rv, 12)} expressions</b><small>Consolidez vos points fragiles avant qu'ils ne s'effacent.</small></span><span class="go">▶</span></button>` : ""}
        <div class="ody-levels">${LEVELS.map((lv) => levelHtml(lv, activeNode)).join("")}</div>
      </div>
      <aside class="ody-side">
        <div class="ody-panel">
          <div class="ody-ring" style="--p:${Math.min(100, Math.round(daily.xp / c.goal * 100))}"><b>${daily.xp}</b><small>/ ${c.goal} XP</small></div>
          <div class="ody-streak">🔥 <b>${SAVE().streak || 0}</b> day streak${(SAVE().streakFreezes || 0) ? ` · ❄️ ${SAVE().streakFreezes}` : ""}</div>
        </div>
        ${dailyContractsPanel()}
        ${odysseyAtlasPanel()}
        <div class="ody-panel"><div class="ody-panel-t">7 Compétences vers le C2</div>${skillPanel()}<div class="ody-gates">${gatesPanel()}</div><div class="ody-mini" style="margin-top:.5rem">${Object.values(c.gates).filter((g) => g && g.passed && !g.placed).length}/7 examens de niveau validés.</div></div>
        <div class="ody-panel quick">
          <button data-a2="allames">🇫🇷 36 Codes Natifs &amp; Pensée Directe</button>
          <button data-a2="pantheon">🏛️ Panthéon &amp; Titres (12 Sceaux)</button>
          <button data-a2="allperiodes">✒️ 16 Périodes &amp; Modes C2</button>
          <button data-a2="allidiomes">🎭 18 Idiomes &amp; Litotes C2</button>
          <button data-a2="jouterun">⚖️ Joute Oratoire C2</button>
          <button data-a2="weakspot">🎯 Entraînement Ciblé</button>
          <button data-a2="scene" data-s="soundlab">👄 Studio Phonétique</button>
          <button data-a2="drawer">☰ Tous les Quartiers &amp; Modes</button>
        </div>
      </aside>
    </div>`;
    updateBar();
    setTimeout(() => { const el = document.querySelector(".ody-node.partial, .ody-node.cur"); if (el && el.getBoundingClientRect && el.getBoundingClientRect().bottom > window.innerHeight - 20) el.scrollIntoView({ block: "center", behavior: "smooth" }); }, 120);
  }
  function nodeSheet(n) {
    const meta = KIND_META[n.kind] || {}; const open = isUnlocked(n); const st = nodeStars(n);
    const part = CH().partial && CH().partial[n.id];
    const hasPart = hasPartialProgress(part);
    const mp = (open && n.kind !== "gate" && n.kind !== "natif" && n.kind !== "boss") ? nodeMicroProgress(n) : null;
    closeSheet();
    const d = document.createElement("div"); d.className = "ody-sheet-wrap"; d.id = "ody-sheet";
    const g = (n.kind === "gate" || n.kind === "natif") ? CH().gates[n.level] : null;
    const microListHtml = (mp && mp.total > 1) ? `<div class="ody-sheet-micro">
      <div class="ody-k-label">⚡ Micro-Modules (~90s chacun · ${mp.doneCount}/${mp.total} accomplis)</div>
      <div class="micro-deck-pills">
        ${mp.caps.map((cp) => {
          const isDone = !!mp.doneMask[cp.idx];
          const isNext = !isDone && cp.idx === mp.nextCapIdx;
          return `<button type="button" class="micro-cap-btn ${isDone ? "done" : ""} ${isNext ? "next" : ""}" data-a2="microcap" data-id="${esc(n.id)}" data-cap="${cp.idx}">
            <span class="mc-ic">${isDone ? "✅" : isNext ? "⚡" : "○"}</span>
            <span class="mc-txt"><b>${esc(cp.title)}</b><small>${cp.steps.length} micro-actions · ~90 sec</small></span>
          </button>`;
        }).join("")}
      </div>
    </div>` : "";
    d.innerHTML = `<div class="ody-sheet">
      <div class="ody-kind">${meta.icon || ""} ${esc(meta.label || "")} · ${esc(levelOfNode(n))}${n.unitObj && n.unitObj.num ? ` · World ${n.unitObj.num}` : ""}</div>
      <h3>${esc(n.title)}</h3>
      ${st ? `<div class="ody-stars small">${"⭐".repeat(st)}</div>` : ""}
      ${hasPart ? `<div class="ody-goal small">⏳ Saved at Step ${part.i + 1} of ${partStepLen(part)} (${Math.max(8, Math.round(((part.i + 1) / partStepLen(part)) * 100))}%)</div>` : ""}
      ${g ? `<div class="ody-goal small">Best score: ${g.best || g.score || 0}% ${g.passed ? "✔" : ""}</div>` : ""}
      ${microListHtml}
      ${open ? "" : `<p class="ody-goal small">🔒 Cette étape est en aval de votre position actuelle — mais vous pouvez la débloquer en 1 clic ci-dessous si vous souhaitez y accéder immédiatement.</p>`}
      <div class="ody-row center">
        ${open ? (hasPart ? `<button class="ody-btn primary" data-a2="go" data-id="${esc(n.id)}">▶ Resume (Step ${part.i + 1}/${partStepLen(part)})</button><button class="ody-btn ghost" data-a2="restart" data-id="${esc(n.id)}">🔄 Restart from Step 1</button>` : `<button class="ody-btn primary" data-a2="go" data-id="${esc(n.id)}">${st ? "🔁 Replay Full" : "▶ Start Full"}</button>${mp && mp.total > 1 ? `<button class="ody-btn small micro-hero-btn" data-a2="microcap" data-id="${esc(n.id)}" data-cap="${mp.nextCapIdx}">⚡ Capsule ${mp.nextCapIdx + 1}/${mp.total} (90s)</button>` : ""}`) : `<button class="ody-btn primary" data-a2="unlocknode" data-id="${esc(n.id)}">🔓 Débloquer &amp; Jouer maintenant</button>`}
        <button class="ody-btn ghost" data-a2="closesheet">Close</button>
      </div></div>`;
    document.body.appendChild(d);
    d.addEventListener("click", (e) => { if (e.target === d) closeSheet(); });
  }
  function closeSheet() { const s = $("ody-sheet"); if (s) s.remove(); }
  function openCollectionSheet(kind) {
    closeSheet();
    const c = CH();
    const isDist = kind === "district";
    const list = NODES.filter((n) => n.kind === kind);
    const itemsHtml = list.map((n) => {
      const st = nodeStars(n);
      const part = c.partial && c.partial[n.id];
      const hasPart = hasPartialProgress(part);
      const d = n.data || {};
      const sub = isDist ? `${d.arrondissement || ""} · Registre : ${d.targetRegister || "Courant"} · ${d.npc ? d.npc.name : ""}` : `${d.location || "Paris"} · ${d.category || n.cefr}`;
      return `<button type="button" class="p90-qitem ${st ? "done" : hasPart ? "partial" : ""}" data-a2="go" data-id="${esc(n.id)}">
        <span class="ic">${d.icon || (isDist ? "🏙️" : "✒️")}</span>
        <span class="txt"><b>${esc(n.title)}</b><small>${esc(n.cefr)} · ${esc(sub)}${hasPart ? ` · Étape ${part.i + 1}/${partStepLen(part)}` : ""}</small></span>
        <span class="tag">${st ? "⭐".repeat(st) : hasPart ? "▶ Reprendre" : "▶ Explorer"}</span>
      </button>`;
    }).join("");
    const d = document.createElement("div"); d.className = "ody-sheet-wrap"; d.id = "ody-sheet";
    d.innerHTML = `<div class="ody-sheet wide-sheet">
      <div class="ody-row between">
        <div>
          <div class="ody-kind">${isDist ? "🏙️ EXPLORATION URBAINE · 3 REGISTRES" : "✒️ RHÉTORIQUE & STYLE · A1 → C2"}</div>
          <h3>${isDist ? `Les ${list.length} Grands Quartiers de Paris` : `Les ${list.length} Ateliers d'Écriture & d'Éloquence`}</h3>
        </div>
        <button class="ody-btn ghost small" data-a2="closesheet">✕ Fermer</button>
      </div>
      <div class="ody-collection-list">${itemsHtml}</div>
    </div>`;
    document.body.appendChild(d);
    d.addEventListener("click", (e) => { if (e.target === d) closeSheet(); });
  }
  function openIdiomeSheet() {
    closeSheet();
    const itemsHtml = IDIOME_CASES.map((it) => {
      return `<div class="p90-qitem idiome-sheet-item">
        <span class="ic">🎭</span>
        <span class="txt">
          <b>${esc(it.cefr)} · « ${esc(it.idiomFr || it.idiom)} » <small style="opacity:.8">(${esc(it.category)})</small></b>
          <small>Littéral : <em>${esc(it.literalEn)}</em> ➜ Sens réel : <b>${esc(it.answer)}</b></small>
          <small style="display:block;margin-top:.15rem;color:#cbd5e1">${esc(it.speaker)} : « ${esc(it.contextFr)} »</small>
        </span>
        <span class="ody-row" style="gap:.35rem">
          <button type="button" class="ody-btn tiny ghost" data-a="say" data-t="${esc(it.contextFr)}">🔊</button>
          <button type="button" class="ody-btn tiny primary" data-a2="idiomerun" data-cid="${esc(it.id)}">▶ Jouer</button>
        </span>
      </div>`;
    }).join("");
    const d = document.createElement("div"); d.className = "ody-sheet-wrap"; d.id = "ody-sheet";
    d.innerHTML = `<div class="ody-sheet wide-sheet">
      <div class="ody-row between">
        <div>
          <div class="ody-kind">🎭 CODEX PRAGMATIQUE · IDIOMES, LITOTES &amp; SOUS-ENTENDUS (A1 → C2)</div>
          <h3>Les ${IDIOME_CASES.length} Expressions Figurées &amp; Litotes Diplomatiques</h3>
        </div>
        <button class="ody-btn ghost small" data-a2="closesheet">✕ Fermer</button>
      </div>
      <div class="ody-collection-list">${itemsHtml}</div>
    </div>`;
    document.body.appendChild(d);
    d.addEventListener("click", (e) => { if (e.target === d) closeSheet(); });
  }
  function openPeriodeSheet() {
    closeSheet();
    const itemsHtml = PERIODE_CASES.map((it) => {
      const fullTxt = it.fullFr || (it.clauses || []).map((c) => c.fr).join(" ");
      return `<div class="p90-qitem idiome-sheet-item periode-sheet-item">
        <span class="ic">✒️</span>
        <span class="txt">
          <b>${esc(it.cefr)} · ${esc(it.title)} <small style="opacity:.8">(${it.clauses.length} propositions)</small></b>
          <small style="display:block;color:#fde68a">« ${esc(fullTxt)} »</small>
          <small style="display:block;margin-top:.15rem;color:#cbd5e1">${esc(it.en)} · <em>${esc(it.why)}</em></small>
        </span>
        <span class="ody-row" style="gap:.35rem">
          <button type="button" class="ody-btn tiny ghost" data-a="say" data-t="${esc(fullTxt)}">🔊</button>
          <button type="button" class="ody-btn tiny primary" data-a2="perioderun" data-cid="${esc(it.id)}">▶ Tisser</button>
        </span>
      </div>`;
    }).join("");
    const d = document.createElement("div"); d.className = "ody-sheet-wrap"; d.id = "ody-sheet";
    d.innerHTML = `<div class="ody-sheet wide-sheet">
      <div class="ody-row between">
        <div>
          <div class="ody-kind">✒️ ARCHITECTURE SYNTAXIQUE · PÉRIODES ORATOIRES &amp; MODES (A1 → C2)</div>
          <h3>Les ${PERIODE_CASES.length} Grandes Périodes Oratoires &amp; ${CONCORDANCE_CASES.length} Cas de Concordance</h3>
        </div>
        <button class="ody-btn ghost small" data-a2="closesheet">✕ Fermer</button>
      </div>
      <div class="ody-collection-list">${itemsHtml}</div>
    </div>`;
    document.body.appendChild(d);
    d.addEventListener("click", (e) => { if (e.target === d) closeSheet(); });
  }
  function openAmeSheet(filterLv) {
    closeSheet();
    const lvFilter = (filterLv && filterLv !== "ALL") ? filterLv : null;
    const ames = lvFilter ? AME_CASES.filter((x) => x.cefr === lvFilter) : AME_CASES;
    const pensees = lvFilter ? PENSEE_CASES.filter((x) => x.cefr === lvFilter) : PENSEE_CASES;
    const filterBar = ["ALL", "A1", "A2", "B1", "B2", "C1", "C2"].map((lv) =>
      `<button type="button" class="ody-btn tiny ${(!lvFilter && lv === "ALL") || lvFilter === lv ? "primary" : "ghost"}" data-a2="allames" data-lv="${lv}">${lv === "ALL" ? "Tous (A1→C2)" : lv}</button>`
    ).join("");
    const ameHtml = ames.map((it) => `<div class="p90-qitem idiome-sheet-item ame-sheet-item">
      <span class="ic">🇫🇷</span>
      <span class="txt">
        <b>${esc(it.cefr)} · ${esc(it.pillar)} · <span style="color:#fde68a">« ${esc(it.nativeFr)} »</span></b>
        <small>📘 Manuel : <em>« ${esc(it.textbookFr)} »</em> ➜ 🎯 <b>${esc(it.title || it.phoneticHint || "")}</b></small>
        <small style="display:block;margin-top:.15rem;color:#cbd5e1">🗝️ ${esc(it.secret || it.culturalSecret || "")}</small>
      </span>
      <span class="ody-row" style="gap:.35rem">
        <button type="button" class="ody-btn tiny ghost" data-a="say" data-t="${esc(it.nativeFr)}">🔊</button>
        <button type="button" class="ody-btn tiny primary" data-a2="amerun" data-cid="${esc(it.id)}">▶ Jouer</button>
      </span>
    </div>`).join("");
    const penseeHtml = pensees.map((it) => `<div class="p90-qitem idiome-sheet-item pensee-sheet-item">
      <span class="ic">${esc(it.sceneIcon || "🧠")}</span>
      <span class="txt">
        <b>${esc(it.cefr)} · ${esc(it.category)} · <span style="color:#a7f3d0">« ${esc(it.answer)} »</span></b>
        <small>💭 Indices : ${(it.indicesFr || []).map((c) => `<em>${esc(c)}</em>`).join(" · ")}</small>
        <small style="display:block;margin-top:.15rem;color:#cbd5e1">🧠 ${esc(it.trapNote || it.whyDirect || "")}</small>
      </span>
      <span class="ody-row" style="gap:.35rem">
        <button type="button" class="ody-btn tiny ghost" data-a="say" data-t="${esc(it.innerMonologueFr || it.answer)}">🔊</button>
        <button type="button" class="ody-btn tiny primary" data-a2="amerun" data-cid="${esc(it.id)}">▶ Câbler</button>
      </span>
    </div>`).join("");
    const d = document.createElement("div"); d.className = "ody-sheet-wrap"; d.id = "ody-sheet";
    d.innerHTML = `<div class="ody-sheet wide-sheet">
      <div class="ody-row between">
        <div>
          <div class="ody-kind">🇫🇷 CODEX DE L'ÂME FRANÇAISE &amp; PENSÉE DIRECTE (A1 → C2)</div>
          <h3>${AME_CASES.length} Codes Sociaux Parisiens &amp; ${PENSEE_CASES.length} Réflexes de Pensée Directe (Zéro Traduction)</h3>
        </div>
        <button class="ody-btn ghost small" data-a2="closesheet">✕ Fermer</button>
      </div>
      <div class="ody-row" style="gap:.35rem;flex-wrap:wrap;margin:.45rem 0 .65rem">${filterBar}</div>
      <div class="ody-collection-list">
        <div class="ody-k-label" style="margin:.2rem 0">🇫🇷 L'Âme Française · Codes Sociaux, Élisions &amp; Second Degré (${ames.length})</div>
        ${ameHtml}
        <div class="ody-k-label" style="margin:.65rem 0 .2rem">🧠 La Fabrique de Pensée Directe · Penser en Français sans Traduire (${pensees.length})</div>
        ${penseeHtml}
      </div>
    </div>`;
    document.body.appendChild(d);
    d.addEventListener("click", (e) => { if (e.target === d) closeSheet(); });
  }
  const PANTHEON_SEALS = [
    { id: "seal_flaneur", icon: "🐣", title: "🐣 Flâneur de la Seine", desc: "Faire ses premiers pas dans L'Odyssée Française à Paris.", rewardGold: 40, rewardRep: 10, goAction: "home", check: () => true },
    { id: "seal_saint_germain", icon: "☕", title: "☕ Habitué de Saint-Germain", desc: "Valider au moins 1 étape, quête ou session de maîtrise.", rewardGold: 60, rewardRep: 15, goAction: "alldistricts", check: (c) => Object.keys(c.done || {}).length >= 1 || (c.reputation || 0) >= 15 || (c.daily && (c.daily.sessions || 0) >= 1) },
    { id: "seal_louvre", icon: "🔍", title: "🔍 Détective du Louvre", desc: "Inspecter au moins 3 objets interactifs dans les décors parisiens.", rewardGold: 75, rewardRep: 20, goAction: "alldistricts", check: (c) => Object.keys(c.inspected || {}).length >= 3 },
    { id: "seal_montmartre", icon: "🥐", title: "🥐 Conteur de Montmartre", desc: "Explorer un Quartier de Paris ou atteindre 40 ⚜️ Réputation.", rewardGold: 90, rewardRep: 25, goAction: "alldistricts", check: (c, s) => Object.keys(s.clearedDistricts || {}).length >= 1 || (c.reputation || 0) >= 40 },
    { id: "seal_radio", icon: "📻", title: "📻 Auditeur de Radio Lumière", desc: "Pratiquer l'écoute active et la prononciation française.", rewardGold: 80, rewardRep: 20, goAction: "radiorun", check: (c) => ((c.skills && c.skills.listening && c.skills.listening.n) || 0) >= 2 || Object.keys(c.done || {}).length >= 3 },
    { id: "seal_forgeron", icon: "⚒️", title: "⚒️ Maître Forgeron des Verbes", desc: "Forger la grammaire et les conjugaisons en contexte.", rewardGold: 100, rewardRep: 25, goAction: "sleuthrun", check: (c) => ((c.skills && c.skills.grammar && c.skills.grammar.n) || 0) >= 2 || Object.keys(c.done || {}).length >= 5 },
    { id: "seal_limier", icon: "🕵️", title: "🕵️ Limier du Quai des Orfèvres", desc: "Démasquer les pièges stylistiques et solécismes dans l'Enquête.", rewardGold: 110, rewardRep: 30, goAction: "sleuthrun", check: (c) => ((c.skills && c.skills.reading && c.skills.reading.n) || 0) >= 3 || (c.reputation || 0) >= 80 },
    { id: "seal_litote", icon: "🎭", title: "🎭 Maître des Litotes & Sous-Entendus", desc: "Décoder l'implicite, les proverbes et les litotes diplomatiques.", rewardGold: 120, rewardRep: 35, goAction: "idiomerun", check: (c) => ((c.skills && c.skills.vocabulary && c.skills.vocabulary.n) || 0) >= 2 || (c.reputation || 0) >= 60 },
    { id: "seal_sorbonne", icon: "⚖️", title: "⚖️ Orateur de la Sorbonne", desc: "Triompher dans la Joute Oratoire Contradictoire ou rédiger un texte.", rewardGold: 140, rewardRep: 40, goAction: "jouterun", check: (c, s) => (c.portfolio && c.portfolio.length >= 1) || Object.keys(s.completedWritings || {}).length >= 1 || (c.reputation || 0) >= 100 },
    { id: "seal_periode", icon: "✒️", title: "✒️ Architecte de la Période", desc: "Maîtriser l'architecture syntaxique et la concordance des modes.", rewardGold: 150, rewardRep: 45, goAction: "perioderun", check: (c) => ((c.skills && c.skills.writing && c.skills.writing.n) || 0) >= 2 || (c.reputation || 0) >= 120 },
    { id: "seal_dignitaire", icon: "⚜️", title: "⚜️ Grand Dignitaire de Paris", desc: "Élever sa Réputation Parisienne au-delà de 150 ⚜️ ou valider un examen.", rewardGold: 200, rewardRep: 50, goAction: "alldistricts", check: (c) => (c.reputation || 0) >= 150 || Object.values(c.gates || {}).some((g) => g && g.passed) },
    { id: "seal_immortel", icon: "👑", title: "👑 Immortel sous la Coupole", desc: "Atteindre le sommet C2 / Natif ou 300 ⚜️ de Réputation à l'Académie.", rewardGold: 350, rewardRep: 100, goAction: "atlas", check: (c) => !!(c.natif || (c.gates && c.gates.C2 && c.gates.C2.passed) || (c.reputation || 0) >= 300) },
    { id: "seal_lv_a1", icon: "🌱", title: "🌱 Sceau Maîtrise A1 (Fondations)", desc: "Compléter au moins 5 étapes A1 ou réussir l'examen A1.", rewardGold: 80, rewardRep: 20, goAction: "home", check: (c) => !!(c.gates && c.gates.A1 && c.gates.A1.passed) || levelNodes("A1").filter((n) => nodeStars(n)).length >= 5 },
    { id: "seal_lv_a2", icon: "🥖", title: "🥖 Sceau Maîtrise A2 (Quotidien)", desc: "Compléter au moins 5 étapes A2 ou réussir l'examen A2.", rewardGold: 100, rewardRep: 25, goAction: "home", check: (c) => !!(c.gates && c.gates.A2 && c.gates.A2.passed) || levelNodes("A2").filter((n) => nodeStars(n)).length >= 5 },
    { id: "seal_lv_b1", icon: "🚇", title: "🚇 Sceau Maîtrise B1 (Autonomie)", desc: "Compléter au moins 5 étapes B1 ou réussir l'examen B1.", rewardGold: 120, rewardRep: 30, goAction: "home", check: (c) => !!(c.gates && c.gates.B1 && c.gates.B1.passed) || levelNodes("B1").filter((n) => nodeStars(n)).length >= 5 },
    { id: "seal_lv_b2", icon: "🎨", title: "🎨 Sceau Maîtrise B2 (Débat & Nuance)", desc: "Compléter au moins 5 étapes B2 ou réussir l'examen B2.", rewardGold: 150, rewardRep: 35, goAction: "home", check: (c) => !!(c.gates && c.gates.B2 && c.gates.B2.passed) || levelNodes("B2").filter((n) => nodeStars(n)).length >= 5 },
    { id: "seal_lv_c1", icon: "🏢", title: "🏢 Sceau Maîtrise C1 (Stratège)", desc: "Compléter au moins 5 étapes C1 ou réussir l'examen C1.", rewardGold: 200, rewardRep: 45, goAction: "home", check: (c) => !!(c.gates && c.gates.C1 && c.gates.C1.passed) || levelNodes("C1").filter((n) => nodeStars(n)).length >= 5 },
    { id: "seal_lv_c2", icon: "🏛️", title: "🏛️ Sceau Maîtrise C2 (Académicien)", desc: "Compléter au moins 5 étapes C2 ou réussir l'examen C2.", rewardGold: 300, rewardRep: 80, goAction: "home", check: (c) => !!(c.gates && c.gates.C2 && c.gates.C2.passed) || levelNodes("C2").filter((n) => nodeStars(n)).length >= 5 }
  ];
  function openPantheonSheet() {
    closeSheet();
    const c = CH();
    const s = SAVE();
    c.sealsClaimed = c.sealsClaimed || {};
    const curTitle = c.equippedTitle || "🐣 Flâneur de la Seine";
    const unlockedCount = PANTHEON_SEALS.filter((sl) => sl.check(c, s) || c.sealsClaimed[sl.id]).length;
    const cardsHtml = PANTHEON_SEALS.map((sl) => {
      const unlocked = !!(sl.check(c, s) || c.sealsClaimed[sl.id]);
      const claimed = !!c.sealsClaimed[sl.id];
      const isEquipped = curTitle === sl.title;
      return `<div class="pantheon-seal-card ${unlocked ? "unlocked" : "locked"} ${isEquipped ? "equipped" : ""}">
        <div class="ps-top">
          <span class="ps-ico">${sl.icon}</span>
          <div class="ps-meta">
            <b>${esc(sl.title)}</b>
            <small>${esc(sl.desc)}</small>
          </div>
        </div>
        <div class="ps-foot">
          <span class="ps-rew">+${sl.rewardGold} 🪙 · +${sl.rewardRep} ⚜️</span>
          <div class="ody-row" style="gap:.35rem">
            ${unlocked && !claimed ? `<button type="button" class="ody-btn tiny primary" data-a2="claimseal" data-sid="${sl.id}">🎁 Réclamer</button>` : ""}
            ${unlocked ? `<button type="button" class="ody-btn tiny ${isEquipped ? "primary" : "ghost"}" data-a2="equiptitle" data-sid="${sl.id}" data-title="${esc(sl.title)}" ${isEquipped ? "disabled" : ""}>${isEquipped ? "✓ Titre porté" : "👑 Porter ce titre"}</button>` : `<button type="button" class="ody-btn tiny ghost" data-a2="${sl.goAction}">▶ Accomplir</button>`}
          </div>
        </div>
      </div>`;
    }).join("");
    const d = document.createElement("div"); d.className = "ody-sheet-wrap"; d.id = "ody-sheet";
    d.innerHTML = `<div class="ody-sheet wide-sheet">
      <div class="ody-row between">
        <div>
          <div class="ody-kind"><img src="assets/pixel_pantheon.png" class="ob-mini-px" alt=""> LE PANTHÉON DES IMMORTELS · ${unlockedCount}/${PANTHEON_SEALS.length} SCEAUX DÉBLOQUÉS</div>
          <h3>Sceaux de Prestige Parisien &amp; Titres de Noblesse Linguistique</h3>
          <div class="ody-mini">Titre actuel affiché sur votre profil : <b style="color:#fde047">${esc(curTitle)}</b></div>
        </div>
        <button class="ody-btn ghost small" data-a2="closesheet">✕ Fermer</button>
      </div>
      <div class="pantheon-grid">${cardsHtml}</div>
    </div>`;
    document.body.appendChild(d);
    d.addEventListener("click", (e) => { if (e.target === d) closeSheet(); });
  }
  function computeNativeUpgrade(msg, friendId) {
    const raw = String(msg || "").trim();
    if (!raw) return null;
    const low = raw.toLowerCase();
    const isFormal = friendId === "valcourt" || friendId === "celeste";
    const rules = [
      { re: /\b(c['’]est\s+tr[eè]s\s+bien|tr[eè]s\s+bien)\b/i, nativeFr: isFormal ? "C'est tout à fait remarquable." : "C'est nickel, franchement ça gère !", noteEn: "Sound like a real Parisian instead of textbook 'très bien'." },
      { re: /\bje\s+veux\b/i, nativeFr: isFormal ? "Je souhaiterais volontiers…" : "J'ai trop envie de… / Je voudrais bien…", noteEn: "'Je veux' sounds abrupt in Paris; soften it for instant native polish." },
      { re: /\bje\s+suis\s+content/i, nativeFr: isFormal ? "Je m'en réjouis vivement." : "Je suis trop content / ravi !", noteEn: "Natural Parisian warmth & precision." },
      { re: /\bmerci\s+beaucoup\b/i, nativeFr: isFormal ? "Je vous remercie infiniment." : "Merci mille fois, c'est trop sympa !", noteEn: "Elevate your gratitude beyond textbook 'merci beaucoup'." },
      { re: /\bje\s+pense\s+que\b/i, nativeFr: isFormal ? "Il me semble que… / À mon sens…" : "Franchement, je trouve que…", noteEn: "Native Parisian opinion openers." },
      { re: /\bje\s+ne\s+sais\s+pas\b/i, nativeFr: isFormal ? "Je ne saurais vous le dire avec certitude." : "Aucune idée / J'en sais trop rien !", noteEn: "Spoken Parisian rhythm vs. literary elegance." },
      { re: /\bbeaucoup\s+de\b/i, nativeFr: isFormal ? "Une multitude de / Bon nombre de…" : "Plein de… / Pas mal de…", noteEn: "Parisians almost always say 'plein de' or 'pas mal de' in speech." },
      { re: /\btr[eè]s\s+bon/i, nativeFr: isFormal ? "C'est absolument exquis." : "C'est une tuerie / C'est délicieux !", noteEn: "Parisian food & café enthusiasm." }
    ];
    for (const r of rules) {
      if (r.re.test(low)) return { nativeFr: r.nativeFr, noteEn: r.noteEn };
    }
    return isFormal
      ? { nativeFr: "En effet, il me semble tout à fait pertinent d'aborder la question ainsi.", noteEn: "C1/C2 Parisian salon phrasing to elevate your reply." }
      : { nativeFr: "Franchement, carrément ! On fait comme ça !", noteEn: "Everyday Parisian connector ('Franchement, carrément !')." };
  }
  const AMIS_STATE = { friendId: "camille", history: {}, busy: false };
  function openAmisSheet(friendId) {
    closeSheet(); closeDrawer();
    if (friendId) AMIS_STATE.friendId = friendId;
    const frObj = AMIS_DE_PARIS.find((f) => f.id === AMIS_STATE.friendId) || AMIS_DE_PARIS[0];
    if (!AMIS_STATE.history[frObj.id] || !AMIS_STATE.history[frObj.id].length) {
      AMIS_STATE.history[frObj.id] = [{
        role: "npc",
        fr: frObj.greetingFr,
        en: frObj.greetingEn,
        words: [{ fr: "enchanté(e)", en: "nice to meet you" }, { fr: "on avance", en: "we move forward" }]
      }];
    }
    const hist = AMIS_STATE.history[frObj.id];
    const activePts = (CH().bonds && CH().bonds[frObj.id]) || 0;
    const activeBond = bondLevelInfo(activePts);
    const tabsHtml = AMIS_DE_PARIS.map((f) => {
      const b = bondLevelInfo((CH().bonds && CH().bonds[f.id]) || 0);
      return `<button type="button" class="amis-tab ${f.id === frObj.id ? "active" : ""}" data-a2="amis" data-fid="${f.id}">
        <span class="am-av">${f.avatar}</span>
        <span class="am-meta"><b>${esc(f.name)} <span class="bond-pill">❤️ Lv.${b.lv}</span></b><small>${esc(f.role)}</small></span>
      </button>`;
    }).join("");
    const msgsHtml = hist.map((m) => {
      if (m.role === "user") {
        return `<div class="amis-msg user"><div class="amis-bub user-bub"><b>Vous :</b> « ${esc(m.fr)} »</div></div>`;
      }
      const corrHtml = (m.correction && m.correction.has_error && m.correction.corrected_fr)
        ? `<div class="amis-corr">✨ <b>Correction :</b> <span class="fr-tap" data-a="say" data-t="${esc(m.correction.corrected_fr)}">« ${esc(m.correction.corrected_fr)} » 🔊</span> <small>(${esc(m.correction.explanation_en || "")})</small></div>`
        : "";
      const nativeHtml = (m.nativeUpgrade && m.nativeUpgrade.nativeFr)
        ? `<div class="amis-native-up">✨ <b>Upgrade Natif (Parler comme un vrai Parisien) :</b> <button type="button" class="fr-tap-btn" data-a="say" data-t="${esc(m.nativeUpgrade.nativeFr)}">« ${esc(m.nativeUpgrade.nativeFr)} » 🔊</button> <button type="button" class="ody-btn tiny ghost" data-a="say" data-t="${esc(m.nativeUpgrade.nativeFr)}" data-r="1.25" title="Vitesse Parisienne 1.25x">⚡ 1.25x</button><div class="an-note">${esc(m.nativeUpgrade.noteEn || "")}</div></div>`
        : "";
      const nwHtml = (m.words && m.words.length)
        ? `<div class="amis-words">${m.words.map((w) => `<span class="amis-w-pill" data-a="say" data-t="${esc(w.fr)}">💎 <b>${esc(w.fr)}</b> : ${esc(w.en)} 🔊</span>`).join("")}</div>`
        : "";
      return `<div class="amis-msg npc">
        <img src="${frObj.img}" class="amis-npc-img" alt="${esc(frObj.name)}" onerror="this.style.display='none'">
        <div class="amis-bub npc-bub">
          <div class="amis-bub-top"><b>${frObj.avatar} ${esc(frObj.name)}</b> · <small>${esc(frObj.place)}</small></div>
          <div class="amis-voice-bar">
            <button type="button" class="avb-play" data-a="say" data-t="${esc(m.fr)}" title="Écouter la note vocale (1.0x)">▶ 🔊 Note vocale</button>
            <span class="avb-wave" aria-hidden="true">▁▃▆█▅▇▃▅▂▆█▄▂</span>
            <button type="button" class="avb-fast" data-a="say" data-t="${esc(m.fr)}" data-r="1.25" title="Vitesse Parisienne 1.25x">⚡ 1.25x</button>
          </div>
          <div class="amis-fr">« ${esc(m.fr)} »</div>
          ${m.en ? `<div class="amis-en">${esc(m.en)}</div>` : ""}
          ${corrHtml}
          ${nativeHtml}
          ${nwHtml}
        </div>
      </div>`;
    }).join("");
    const starters = (hist.length > 1 && hist[hist.length - 1].suggestions && hist[hist.length - 1].suggestions.length)
      ? hist[hist.length - 1].suggestions.map((s) => ({ fr: s, en: "Suggestion de réponse" }))
      : frObj.starters;
    const startersHtml = (starters || []).map((st) => `<button type="button" class="amis-starter-btn" data-a2="amissend" data-msg="${esc(st.fr)}" title="${esc(st.en || "")}">
      <span class="as-fr">💬 « ${esc(st.fr)} »</span>
      ${st.en ? `<small class="as-en">${esc(st.en)}</small>` : ""}
    </button>`).join("");
    const d = document.createElement("div"); d.className = "ody-sheet-wrap"; d.id = "ody-sheet";
    d.innerHTML = `<div class="ody-sheet wide-sheet amis-sheet">
      <div class="ody-row between">
        <div>
          <div class="ody-kind">📱 LE TÉLÉPHONE DE PARIS · NOTES VOCALES &amp; UPGRADE NATIF</div>
          <h3>${frObj.avatar} ${esc(frObj.name)} · <span class="amis-bond-head">❤️ Lv.${activeBond.lv} ${esc(activeBond.label)}</span></h3>
          <div class="amis-bond-bar-wrap" id="amis-bond-bar">
            <div class="amis-bond-track"><b style="width:${activeBond.pct}%"></b></div>
            <small>${activePts} / ${activeBond.next} pts · Chaque message = +15 XP, +15 ❤️ Lien &amp; +5 ⚜️</small>
          </div>
        </div>
        <button class="ody-btn ghost small" data-a2="closesheet">✕ Fermer</button>
      </div>
      <div class="amis-tabs">${tabsHtml}</div>
      <div class="amis-chat-box" id="amis-chat-box">${msgsHtml}</div>
      <div class="amis-starters">
        <div class="ody-k-label">Répliques prêtes à envoyer (1 clic si vous débutez de zéro) :</div>
        <div class="amis-starters-grid">${startersHtml}</div>
      </div>
      <div class="amis-input-row">
        <button type="button" class="ody-btn mic small" data-a2="amismic" id="amis-mic-btn" title="Parler en français au micro">🎙️</button>
        <input class="ody-input" id="amis-in" autocomplete="off" spellcheck="false" placeholder="Écrivez ou parlez à ${esc(frObj.name)} en français (ou cliquez sur une réplique ci-dessus)…">
        <button type="button" class="ody-btn primary" data-a2="amissend" id="amis-send-btn">Envoyer ▸</button>
      </div>
      ${accentBar("amis-in")}
    </div>`;
    document.body.appendChild(d);
    d.addEventListener("click", (e) => { if (e.target === d) closeSheet(); });
    const box = $("amis-chat-box");
    if (box) box.scrollTop = box.scrollHeight;
    const lastNpc = hist.slice().reverse().find((m) => m.role === "npc");
    if (lastNpc && lastNpc.fr && CH().autoAudio) speak(lastNpc.fr);
  }
  async function sendAmisMessage(rawText) {
    if (AMIS_STATE.busy) return;
    const frObj = AMIS_DE_PARIS.find((f) => f.id === AMIS_STATE.friendId) || AMIS_DE_PARIS[0];
    const inp = $("amis-in");
    const msg = String(rawText || (inp && inp.value) || "").trim();
    if (!msg) { if (inp) inp.focus(); return; }
    if (inp) inp.value = "";
    const hist = AMIS_STATE.history[frObj.id] = AMIS_STATE.history[frObj.id] || [];
    hist.push({ role: "user", fr: msg });
    AMIS_STATE.busy = true;
    openAmisSheet(frObj.id);
    const sendBtn = $("amis-send-btn");
    if (sendBtn) { sendBtn.disabled = true; sendBtn.textContent = "…"; }
    let replyData = null;
    try {
      if (SERVED && IS_LOCAL_SERVER) {
        const sysPrompt = `Tu es ${frObj.name} (${frObj.role}) à ${frObj.place}. Style: ${frObj.vibe}. L'apprenant s'appelle Sreenath (niveau actuel ${currentLevel()}). Réponds chaleureusement en français naturel (1 à 2 phrases) avec traduction anglaise, corrige gentiment son message s'il y a une faute, et propose 2 réponses simples.`;
        const convoText = hist.slice(-6).map((m) => `${m.role === "user" ? "Sreenath" : frObj.name}: ${m.fr}`).join("\n");
        const r = await fetch("/api/partner", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ system: sysPrompt, conversation: convoText })
        });
        const j = await r.json();
        if (j && j.ok && j.data && j.data.reply_fr) replyData = j.data;
      }
    } catch (e) {}
    if (!replyData) {
      let hasErr = false, fixedMsg = msg, errWhy = "";
      if (/\bje\s+([aàeéèêiîoôuù])/i.test(msg)) {
        hasErr = true;
        fixedMsg = msg.replace(/\bje\s+([aàeéèêiîoôuù])/gi, "j'$1");
        errWhy = "Élision : devant une voyelle, « je » devient « j' ».";
      } else if (/\bje\s+suis\s+(faim|soif|froid|chaud|peur|besoin|envie|\d+\s*ans)\b/i.test(msg)) {
        hasErr = true;
        fixedMsg = msg.replace(/\bje\s+suis\s+/i, "J'ai ");
        errWhy = "En français, on utilise « avoir » (J'ai faim / J'ai 20 ans) et non « être ».";
      }
      const fallbacks = {
        camille: {
          reply_fr: "C'est super Sreenath ! Tu progresses à chaque phrase. On continue ensemble : qu'est-ce que tu aimes faire pendant ton temps libre ?",
          reply_en: "That's great Sreenath! You're progressing with every sentence. Let's keep going together: what do you like doing in your free time?",
          suggestions_fr: ["J'aime écouter de la musique et apprendre le français.", "Je préfère me promener dans Paris."]
        },
        yanis: {
          reply_fr: "Franchement, tu gères de ouf ! Continue comme ça et dans quelques semaines tu parleras comme un vrai Parisien du 10e.",
          reply_en: "Honestly, you're crushing it! Keep it up and in a few weeks you'll talk like a real Parisian from the 10th.",
          suggestions_fr: ["Carrément, je suis ultra motivé !", "On se retrouve au canal demain ?"]
        },
        celeste: {
          reply_fr: "Votre tournure est pleine de charme ! À Paris, chaque conversation est une toile que l'on peint mot après mot.",
          reply_en: "Your phrasing is full of charm! In Paris, every conversation is a canvas painted word by word.",
          suggestions_fr: ["Je vous remercie pour votre bienveillance, Céleste.", "Quelle exposition me conseillez-vous ce mois-ci ?"]
        },
        valcourt: {
          reply_fr: "Voilà une prise de parole prometteuse ! N'hésitez jamais à élever votre syntaxe par des connecteurs de concession.",
          reply_en: "That is a promising statement! Never hesitate to elevate your syntax with concessive connectors.",
          suggestions_fr: ["Bien que l'exercice soit exigeant, je persévérerai.", "Il convient en effet de soigner la précision du verbe."]
        }
      }[frObj.id] || {
        reply_fr: "Bravo Sreenath ! Continuez ainsi, votre français gagne en assurance.",
        reply_en: "Well done Sreenath! Keep it up, your French is gaining confidence.",
        suggestions_fr: ["Merci beaucoup !", "Continuons à discuter."]
      };
      replyData = Object.assign({
        correction: { has_error: hasErr, corrected_fr: fixedMsg, explanation_en: errWhy },
        new_words: [{ fr: "persévérer", en: "to persevere" }]
      }, fallbacks);
    }
    hist.push({
      role: "npc",
      fr: replyData.reply_fr,
      en: replyData.reply_en || "",
      correction: replyData.correction || null,
      nativeUpgrade: computeNativeUpgrade(msg, frObj.id),
      suggestions: replyData.suggestions_fr || [],
      words: replyData.new_words || []
    });
    AMIS_STATE.busy = false;
    const c = CH();
    c.reputation = (c.reputation || 0) + 5;
    addBond(frObj.id, 15);
    gainXP(15);
    SFX.ok();
    persist();
    openAmisSheet(frObj.id);
    updateBar();
  }
  function go(id, force) {
    closeSheet(); closeDrawer();
    const n = NODE_BY_ID[id]; if (!n) return renderHome();
    if (!force && !isUnlocked(n)) { SFX.bad(); toast("Locked 🔒", "Finish the previous nodes first, or click Unlock to jump directly here.", "🔒"); return; }
    if ((n.kind === "gate" || n.kind === "natif") && !EXAMS()[n.level]) { toast("Exam loading", "The exam content isn't installed yet.", "⚠️"); return; }
    if (n.kind === "mission" && !n.data) return;
    const s = SAVE(); if (n.stage) { s.currentLessonNum = n.stage.worldNum || (n.world && n.world.number); s.currentStageId = n.stage.stageId; }
    const part = force !== "restart" && CH().partial && CH().partial[n.id];
    if (hasPartialProgress(part)) {
      if (!Array.isArray(part.steps) || !part.steps.length) {
        if (part.microCap && typeof part.microCap.idx === "number") {
          const caps = getMicroCapsules(n);
          const cap = caps[part.microCap.idx];
          if (cap && Array.isArray(cap.steps)) part.steps = cap.steps.slice();
        }
        if (!Array.isArray(part.steps) || !part.steps.length) {
          part.steps = buildSessionFor(n);
        }
      }
      return startSession(n, part.steps, part.mode || n.kind, part);
    }
    if (force !== "restart" && force !== "full" && n.kind !== "gate" && n.kind !== "natif" && n.kind !== "boss") {
      const mp = nodeMicroProgress(n);
      if (mp && mp.total > 1 && mp.doneCount > 0 && !mp.allDone) {
        return startMicroCapsule(n.id, mp.nextCapIdx);
      }
    }
    startSession(n, buildSessionFor(n));
  }
  function startOrResumeMode(mode, builderFn, emptyMsg, icon) {
    closeSheet(); closeDrawer();
    const key = "__mode:" + mode;
    const part = CH().partial && CH().partial[key];
    if (hasPartialProgress(part)) return startSession(null, part.steps, mode, part);
    const steps = builderFn();
    if (!steps || !steps.length) return toast(emptyMsg || "Indisponible", "", icon || "⚠️");
    startSession(null, steps, mode);
  }
  const HOME_ACT = {
    go(el) { go(el.dataset.id); },
    back() { NAV.back(); },
    openexplorepicker() { openExplorePickerSheet(); },
    explore(el) {
      const sid = (el && el.dataset && (el.dataset.sid || el.dataset.lv)) || "boulangerie";
      closeSheet(); closeDrawer();
      const steps = buildExploreSession(sid);
      if (!steps.length) return toast("Scènes visuelles indisponibles", "", "🗺️");
      startSession(null, steps, "explore_" + sid);
    },
    swipe(el) {
      const lv = (el && el.dataset && el.dataset.lv) || STUDIO_LV || (currentLevel() === "NATIF" ? "C2" : currentLevel());
      closeSheet(); closeDrawer();
      const steps = buildSwipeSession(lv);
      if (!steps.length) return toast("Arcade Swipe indisponible", "", "⚡");
      startSession(null, steps, "swipe_" + lv);
    },
    visreflex(el) {
      const lv = (el && el.dataset && el.dataset.lv) || STUDIO_LV || (currentLevel() === "NATIF" ? "C2" : currentLevel());
      closeSheet(); closeDrawer();
      const steps = [{ k: "intro", title: `👁️ Voir & Entendre (${lv})`, place: "🎧 Zéro Traduction · Audio + Image", goal: "Écoutez le Parisien sans texte et touchez la scène correspondante !" }].concat(buildVisReflexSteps(lv, 4));
      startSession(null, steps, "visreflex_" + lv);
    },
    studiolevel(el) {
      const lv = el && el.dataset && el.dataset.lv;
      if (CEFR.includes(lv)) { STUDIO_LV = lv; HOME.open[lv] = true; renderHome(); }
    },
    chroniques() { openChroniquesSheet(); },
    playchronique(el) {
      const epId = (el && el.dataset && el.dataset.ep) || "ep1_flore";
      closeSheet(); closeDrawer();
      const steps = buildChroniqueSession(epId);
      if (!steps.length) return toast("Chroniques indisponibles", "", "🎬");
      const modeKey = "chronique_" + epId;
      const c = CH();
      if (c.partial) delete c.partial["__mode:" + modeKey];
      startSession(null, steps, modeKey);
    },
    microcap(el) { startMicroCapsule(el.dataset.id, el.dataset.cap); },
    pathmode(el) {
      const m = el.dataset.m === "integral" ? "integral" : "royal";
      const c = CH();
      c.pathMode = m;
      persist();
      SFX.tap();
      toast(m === "royal" ? "👑 Voie Royale activée" : "📚 Parcours Intégral activé", m === "royal" ? "~12 étapes essentielles par niveau (A1→C2) pour progresser vite sans jamais stagner." : "Les 62 Mondes et 600+ étapes sont affichés dans leur intégralité.", m === "royal" ? "👑" : "📚");
      renderHome();
    },
    unlocklvl(el) {
      const lv = el.dataset.lv;
      if (!lv) return;
      const c = CH();
      c.unlockedLevels = c.unlockedLevels || {};
      c.unlockedLevels[lv] = true;
      HOME.open[lv] = true;
      persist();
      SFX.win();
      toast(`🔓 Niveau ${lv} débloqué !`, `Toutes les étapes du niveau ${lv} (${LEVEL_NAMES[lv] || lv}) sont désormais accessibles librement.`, "🔓");
      renderHome();
    },
    unlocknode(el) {
      const id = el.dataset.id;
      if (!id || !NODE_BY_ID[id]) return;
      const c = CH();
      c.unlockedNodes = c.unlockedNodes || {};
      c.unlockedNodes[id] = true;
      persist();
      SFX.ok();
      go(id, true);
    },
    pillarrep(el) {
      const p = (el && el.dataset && el.dataset.p) || "speak";
      const lv = (el && el.dataset && el.dataset.lv) || null;
      closeSheet(); closeDrawer();
      const modeKey = "pillar_" + p;
      const c = CH();
      if (c.partial) delete c.partial["__mode:" + modeKey];
      startSession(null, buildPillarRepSession(p, lv), modeKey);
    },
    quick60() {
      closeSheet(); closeDrawer();
      const key = "__mode:quick60";
      const c = CH();
      if (c.partial) delete c.partial[key];
      startSession(null, buildQuick60Session(), "quick60");
    },
    amis(el) { openAmisSheet(el && el.dataset && el.dataset.fid ? el.dataset.fid : null); },
    amissend(el) { sendAmisMessage(el && el.dataset && el.dataset.msg ? el.dataset.msg : ""); },
    amismic() {
      const inp = $("amis-in");
      const btn = $("amis-mic-btn");
      if (!micSupported()) { toast("Micro indisponible", MIC_ERR.unsupported, "🎙️"); return; }
      if (btn) btn.classList.add("on");
      micListen({
        onInterim: (t) => { if (inp) inp.value = t; },
        onError: () => { if (btn) btn.classList.remove("on"); },
        onFinal: (alts) => {
          if (btn) btn.classList.remove("on");
          if (alts && alts[0] && inp) { inp.value = alts[0]; inp.focus(); }
        }
      });
    },
    landmark(el) {
      const id = el.dataset.id;
      if (NODE_BY_ID[id]) return go(id, true);
      const fallback = NODES.find((n) => n.kind === "district" || n.kind === "atelier");
      if (fallback) return go(fallback.id, true);
    },
    resumemode(el) { const k = el.dataset.k; const part = CH().partial && CH().partial[k]; if (hasPartialProgress(part)) startSession(null, part.steps, part.mode || "review", part); },
    restart(el) { const c = CH(); if (c.partial && el.dataset.id) { delete c.partial[el.dataset.id]; if (c.activeNodeId === el.dataset.id) c.activeNodeId = null; persist(); } go(el.dataset.id, "restart"); },
    atlas() { renderOdysseyAtlas(); },
    plan90() { renderOdysseyAtlas(); },
    node(el) { const n = NODE_BY_ID[el.dataset.id]; if (!n) return; const part = CH().partial && CH().partial[n.id]; if (n.id === nextNode().id || hasPartialProgress(part)) return go(n.id); nodeSheet(n); },
    closesheet() { closeSheet(); },
    lvl(el) { const lv = el.dataset.lv; const curLv = levelOfNode(nextNode()); const isOpen = HOME.open[lv] != null ? HOME.open[lv] : lv === curLv; HOME.open[lv] = !isOpen; renderHome(); },
    unit(el) { const u = UNITS.find((x) => x.id === el.dataset.id); if (!u) return; const nx = nextNode(); const cur = HOME.unitOpen[u.id] != null ? HOME.unitOpen[u.id] : (u.nodes.some((n) => n.id === nx.id) || UNITS.indexOf(u) === UNITS.indexOf(nx.unitObj) + 1); HOME.unitOpen[u.id] = !cur; const y = window.scrollY; renderHome(); window.scrollTo(0, y); },
    skip(el) { const lv = el.dataset.lv; if (!lv || !EXAMS()[lv]) return toast("Exam not available", "", "⚠️"); const n = NODE_BY_ID["gate:" + lv]; if (n) startSession(n, buildExamSession(lv)); },
    review() { startOrResumeMode("review", buildReviewSession, "Nothing to review yet", "🔁"); },
    blitz() { startOrResumeMode("blitz", buildBlitzSession, "Not enough cards yet", "⚡"); },
    shadowrun() { startOrResumeMode("shadowrun", buildShadowSession, "Studio unavailable", "🎙️"); },
    improvrun() { startOrResumeMode("improvrun", buildImprovSession, "No improv scenes loaded", "🎭"); },
    sleuthrun() { startOrResumeMode("sleuthrun", buildSleuthForgeSession, "Enquête indisponible", "🕵️"); },
    jouterun() { startOrResumeMode("jouterun", buildJouteSession, "Joute indisponible", "⚖️"); },
    idiomerun(el) {
      const cid = el && el.dataset && el.dataset.cid;
      if (cid) {
        closeSheet(); closeDrawer();
        const key = "__mode:idiomerun";
        const c = CH();
        if (c.partial) delete c.partial[key];
        return startSession(null, buildIdiomeSession(cid), "idiomerun");
      }
      startOrResumeMode("idiomerun", () => buildIdiomeSession(), "Atelier indisponible", "🎭");
    },
    perioderun(el) {
      const cid = el && el.dataset && el.dataset.cid;
      if (cid) {
        closeSheet(); closeDrawer();
        const key = "__mode:perioderun";
        const c = CH();
        if (c.partial) delete c.partial[key];
        return startSession(null, buildPeriodeSession(cid), "perioderun");
      }
      startOrResumeMode("perioderun", () => buildPeriodeSession(), "Architecte indisponible", "✒️");
    },
    alldistricts() { openCollectionSheet("district"); },
    allateliers() { openCollectionSheet("atelier"); },
    allidiomes() { openIdiomeSheet(); },
    allperiodes() { openPeriodeSheet(); },
    allames(el) { openAmeSheet(el && el.dataset && el.dataset.lv ? el.dataset.lv : null); },
    amerun(el) {
      const cid = el && el.dataset && el.dataset.cid;
      const lv = el && el.dataset && el.dataset.lv;
      if (cid || lv) {
        closeSheet(); closeDrawer();
        const key = "__mode:amerun";
        const c = CH();
        if (c.partial) delete c.partial[key];
        return startSession(null, buildAmeSession(cid || null, lv || null), "amerun");
      }
      startOrResumeMode("amerun", () => buildAmeSession(), "Atelier indisponible", "🇫🇷");
    },
    pantheon() { openPantheonSheet(); },
    claimseal(el) {
      const sid = el.dataset.sid;
      const sl = PANTHEON_SEALS.find((x) => x.id === sid);
      if (!sl) return;
      const c = CH();
      const s = SAVE();
      c.sealsClaimed = c.sealsClaimed || {};
      if (c.sealsClaimed[sid]) return;
      c.sealsClaimed[sid] = true;
      s.gold = (s.gold || 0) + (sl.rewardGold || 50);
      c.reputation = (c.reputation || 0) + (sl.rewardRep || 15);
      c.equippedTitle = sl.title;
      SFX.win();
      toast(`🏛️ Sceau du Panthéon réclamé !`, `${sl.title} · +${sl.rewardGold} 🪙 · +${sl.rewardRep} ⚜️ Réputation`, "👑");
      persist();
      if (!SES && document.body.dataset.scene === "home") renderHome();
      openPantheonSheet();
      updateBar();
    },
    equiptitle(el) {
      const title = el.dataset.title;
      if (!title) return;
      const c = CH();
      c.equippedTitle = title;
      SFX.ok();
      toast("👑 Titre de Noblesse porté !", `Vous portez désormais le titre « ${title} ».`, "👑");
      persist();
      if (!SES && document.body.dataset.scene === "home") renderHome();
      openPantheonSheet();
      updateBar();
    },
    weakspot() { startOrResumeMode("weakspot", buildWeakSpotSession, "Entraînement indisponible", "🎯"); },
    claimcontract(el) {
      const cid = el.dataset.cid;
      const c = CH();
      const s = SAVE();
      s.inventory = s.inventory || {};
      c.contractsClaimed = (c.contractsDate === today() && c.contractsClaimed) ? c.contractsClaimed : {};
      c.contractsDate = today();
      if (c.contractsClaimed[cid]) return;
      c.contractsClaimed[cid] = true;
      if (cid === "curiosite") {
        s.gold = (s.gold || 0) + 40;
        c.reputation = (c.reputation || 0) + 10;
        toast("🎁 Contrat accompli !", "+40 Or · +10 ⚜️ Réputation", "🔍");
      } else if (cid === "epreuve") {
        s.gold = (s.gold || 0) + 60;
        s.inventory.fiftyFifty = (s.inventory.fiftyFifty || 0) + 1;
        toast("🎁 Contrat accompli !", "+60 Or · +1 Relique ⚡ 50/50", "⚔️");
      } else if (cid === "elan") {
        s.gold = (s.gold || 0) + 80;
        s.inventory.critElixir = (s.inventory.critElixir || 0) + 1;
        toast("🎁 Contrat accompli !", "+80 Or · +1 Relique 🧪 Élixir Critique", "🔥");
      }
      SFX.win();
      persist();
      renderHome();
    },
    buyrelic(el) {
      const r = el.dataset.r;
      const s = SAVE();
      s.inventory = s.inventory || {};
      if ((s.gold || 0) < 50) {
        SFX.bad();
        toast("Or insuffisant", "Il vous faut 50 🪙 pour forger cette relique.", "🪙");
        return;
      }
      s.gold -= 50;
      s.inventory[r] = (s.inventory[r] || 0) + 1;
      SFX.ok();
      const names = { fiftyFifty: "⚡ 50/50", shield: "🛡️ Bouclier", critElixir: "🧪 Élixir Critique" };
      toast("🏺 Relique forgée !", `+1 ${names[r] || r} ajouté à votre inventaire.`, "🏺");
      persist();
      renderHome();
    },
    buyperk(el) {
      const p = el.dataset.p;
      const s = SAVE();
      const c = CH();
      s.perks = s.perks || {};
      if (s.perks[p]) return;
      const meta = {
        plumeVoltaire: { cost: 100, name: "🪶 Plume de Voltaire", desc: "+20% XP permanent sur toute l'Odyssée !" },
        oreilleMarin: { cost: 100, name: "🎧 Oreille de Marin", desc: "+15% XP & +15 ⚜️ Réputation Parisienne !", rep: 15 },
        sceauSorbonne: { cost: 120, name: "🛡️ Sceau de la Sorbonne", desc: "Vous débutez désormais chaque Boss avec 4 ❤️ Cœurs !" }
      }[p];
      if (!meta) return;
      if ((s.gold || 0) < meta.cost) {
        SFX.bad();
        toast("Or insuffisant", `Il vous faut ${meta.cost} 🪙 pour débloquer ${meta.name}.`, "🪙");
        return;
      }
      s.gold -= meta.cost;
      s.perks[p] = true;
      if (meta.rep) c.reputation = (c.reputation || 0) + meta.rep;
      SFX.win();
      toast("🏅 Privilège débloqué !", `${meta.name} — ${meta.desc}`, "🏅");
      persist();
      renderHome();
    },
    radiorun() {
      startOrResumeMode("radiorun", () => {
        const rs = buildRadioSteps(currentLevel(), 4);
        return [{ k: "intro", kind: "stage", title: "📻 Radio Lumière · Direct de Paris", cefr: currentLevel(), sub: "Comprenez les émissions françaises à vitesse réelle." }, ...rs];
      }, "Radio indisponible", "📻");
    },
    placement() { const s = buildPlacementSession(); if (!s) return toast("Placement test unavailable", "", "⚠️"); CH().onboarded = true; persist(); startSession(null, s, "placement"); },
    home() { renderHome(); },
    retry(el) { go(el.dataset.id, true); },
    drawer() { openDrawer(); },
    closedrawer() { closeDrawer(); },
    scene(el) { closeDrawer(); window.navigateScene(el.dataset.s); },
    goal(el) { CH().goal = +el.dataset.v; persist(); openDrawer(); updateBar(); },
    autoaudio() { CH().autoAudio = !CH().autoAudio; persist(); openDrawer(); },
    soundtest() { speak("Bonjour ! Je m'appelle Camille. Bienvenue dans l'Odyssée française."); },
    mictest(el) { const out = $("ody-mictest"); if (!out) return; if (!micSupported()) { out.textContent = MIC_ERR.unsupported; return; } out.textContent = "🎙️ Say: « Bonjour Camille »"; micListen({ onInterim: (t) => (out.textContent = "🎙️ " + t), onError: (c) => (out.textContent = MIC_ERR[c] || c), onFinal: (a) => { out.textContent = a.length ? `✅ Heard: “${a[0]}” — the microphone works.` : "Nothing heard."; } }); },
    freeroam() { if (window.toggleFreeRoamMode) { const s = SAVE(); s.freeRoamUnlocked = !s.freeRoamUnlocked; persist(); } openDrawer(); },
    savename() { const i = $("ody-name"); if (i) { CH().name = i.value.trim().slice(0, 30); persist(); toast("Saved", "", "✅"); } },
    exportsave() { if (window.exportSaveFile) window.exportSaveFile(); },
    portfolio() { renderPortfolio(); },
    ob(el) { onboardingAction(el.dataset.v); },
    privunlock() {
      const inp = document.getElementById("ody-priv-in");
      const pin = document.getElementById("ody-priv-pin");
      unlockPrivateGate(inp ? inp.value : "", pin ? pin.value : "");
    },
    toggleuilang() {
      const c = CH();
      c.uiLang = isEnGuide() ? "fr" : "en";
      persist();
      SFX.tap();
      updateBar();
      if (!SES && document.body.dataset.scene === "home") renderHome();
      toast(c.uiLang === "en" ? "🇬🇧 Beginner Guide (EN+FR) Active" : "🇫🇷 Mode Immersion 100% Français", c.uiLang === "en" ? "Clear English guidance paired with French keywords." : "Toute l'interface passe en immersion française.", c.uiLang === "en" ? "🇬🇧" : "🇫🇷");
    },
    rerolldispatch() {
      DISPATCH_IDX = (DISPATCH_IDX + 1) % PARIS_DISPATCHES.length;
      SFX.tap();
      if (!SES && document.body.dataset.scene === "home") renderHome();
    },
    launchdispatch(el) {
      const d = PARIS_DISPATCHES[+(el.dataset.idx || 0)] || PARIS_DISPATCHES[0];
      if (d && d.fid) addBond(d.fid, 10);
      DISPATCH_IDX = (DISPATCH_IDX + 1) % PARIS_DISPATCHES.length;
      persist();
      if (d.act === "microcap") return startMicroCapsule(el.dataset.nid, +(el.dataset.cap || 0));
      if (d.act === "pillarrep") return HOME_ACT.pillarrep({ dataset: { p: d.p || "speak" } });
      if (HOME_ACT[d.act]) return HOME_ACT[d.act](el);
    },
    cloudsync() { openCloudSyncSheet(); },
    syncnow() {
      pullFromCloud(true).then(() => {
        pushToCloudNow(false).then(() => {
          if ($("ody-cloud-sheet")) openCloudSyncSheet();
        });
      });
    },
    copylink() {
      try { navigator.clipboard.writeText(TABLET_PWA_URL); } catch (e) {}
      toast("🔗 Lien Tablette copié !", TABLET_PWA_URL, "📱");
    },
    copycode() {
      const code = btoa(unescape(encodeURIComponent(JSON.stringify(compactSaveForCloud(SAVE())))));
      const inp = $("ody-sync-code-box");
      if (inp) { inp.value = code; inp.select(); }
      try { navigator.clipboard.writeText(code); } catch (e) {}
      toast("📋 Code de Sauvegarde copié !", "Vous pouvez aussi le coller sur n'importe quel appareil.", "✅");
    },
    importcode() {
      const inp = $("ody-sync-code-box");
      const raw = inp ? inp.value.trim() : "";
      if (!raw) { toast("Collez un code d'abord", "Collez votre code ou JSON dans le champ ci-dessus.", "⚠️"); return; }
      try {
        const obj = raw.startsWith("{") ? JSON.parse(raw) : JSON.parse(decodeURIComponent(escape(atob(raw))));
        if (mergeExternalSave(obj)) {
          persist();
          buildPath();
          updateBar();
          if (!SES && document.body.dataset.scene === "home") renderHome();
          toast("✅ Progression fusionnée !", "Vos niveaux, capsules, XP et Or ont été mis à jour.", "🎉");
          openCloudSyncSheet();
        } else {
          toast("Déjà à jour", "Cet appareil contient déjà toute cette progression.", "✅");
        }
      } catch (e) {
        toast("Code invalide", "Vérifiez que le code copié est complet.", "⚠️");
      }
    }
  };

  function openCloudSyncSheet() {
    closeSheet(); closeDrawer();
    const s = SAVE(), c = CH();
    const d = document.createElement("div");
    d.id = "ody-sheet";
    d.className = "ody-drawer-wrap";
    const lastStr = CLOUD_SYNC.lastSyncAt ? new Date(CLOUD_SYNC.lastSyncAt).toLocaleTimeString() : "Synchronisation automatique active";
    const capsDone = c.capsulesCleared || 0;
    const stagesDone = Object.keys(c.done || {}).length;
    d.innerHTML = `<div class="ody-drawer wide" id="ody-cloud-sheet">
      <div class="ody-row between">
        <div>
          <div class="ody-k-label">☁️ SYNCHRONISATION BIDIRECTIONNELLE · TABLETTE REDMI PAD 2 PRO 5G ↔ PC</div>
          <h3>📱 Édition Tablette Redmi Pad 2 Pro 5G &amp; Clavier Français Logitech</h3>
        </div>
        <button class="ody-btn ghost small" data-a2="closesheet">✕</button>
      </div>
      <p class="ody-goal" style="margin:.35rem 0 .75rem">Votre progression (<b>${(s.xp || 0).toLocaleString()} XP</b> · <b>${(s.gold || 0).toLocaleString()} Or</b> · <b>${stagesDone} étapes</b> · <b>${capsDone} micro-capsules</b>) est synchronisée automatiquement dans les deux sens entre votre <b>Redmi Pad 2 Pro 5G</b> et votre <b>PC portable</b>. Vous ne repartirez jamais de zéro.</p>

      <div class="cloud-sync-grid">
        <div class="cloud-sync-card">
          <div class="cloud-sync-head">
            <span class="cloud-badge ok" id="cloud-sheet-status">☁️ ${CLOUD_SYNC.status === "syncing" ? "Synchronisation en cours…" : "Synchronisation Cloud 24/7 Active ✓"}</span>
            <small class="ody-mini">Dernière sync : ${esc(lastStr)}</small>
          </div>
          <div class="cloud-stats-row">
            <span>🎓 Niveau : <b>${esc(currentLevel())}</b></span>
            <span>⚡ XP : <b>${(s.xp || 0).toLocaleString()}</b></span>
            <span>🪙 Or : <b>${(s.gold || 0).toLocaleString()}</b></span>
            <span>🧩 Capsules : <b>${capsDone}</b></span>
          </div>
          <div class="ody-row" style="gap:.5rem;margin-top:.65rem;flex-wrap:wrap">
            <button type="button" class="ody-btn primary small" data-a2="syncnow" id="ody-sync-now-btn">🔄 Synchroniser maintenant (Tablette ↔ PC)</button>
            <button type="button" class="ody-btn ghost small" data-a2="exportsave">💾 Sauvegarder fichier (.json)</button>
          </div>
        </div>

        <div class="cloud-sync-card">
          <div class="ody-k-label">📱 OUVRIR SUR VOTRE REDMI PAD 2 PRO 5G (5G / WI-FI / HORS-LIGNE)</div>
          <div class="cloud-url-box">
            <input class="ody-input small" readonly value="${esc(TABLET_PWA_URL)}" onclick="this.select()">
            <button type="button" class="ody-btn small primary" data-a2="copylink">📋 Copier le lien</button>
          </div>
          <ul class="cloud-steps-list">
            <li><b>1. En un tap depuis Google Drive :</b> Ouvrez l'application <b>Google Drive</b> sur votre Redmi Pad 2 Pro 5G (dossier <i>L'Odyssée Française</i>) et touchez <b>🚀 OUVRIR SUR REDMI PAD</b>.</li>
            <li><b>2. Application Plein Écran (PWA) :</b> Dans Chrome sur la tablette, touchez <b>⋮ → Installer l'application (Ajouter à l'écran d'accueil)</b> pour avoir l'icône pixel-art et les 22 Mo en cache hors-ligne.</li>
            <li><b>3. Clavier Français Logitech (AZERTY) prêt :</b> Touches <b>1–6</b> (même sans Maj : <code>&amp; é " ' ( -</code>) pour choisir les réponses, <b>Entrée</b> pour valider/avancer, <b>Espace</b> / <b>Maj+Espace</b> pour l'audio français normal/lent.</li>
          </ul>
        </div>
      </div>

      <details class="cloud-manual-details" style="margin-top:.75rem">
        <summary>🛡️ Secours Manuel Instantané (Copier / Coller un Code de Sauvegarde hors-ligne)</summary>
        <div style="margin-top:.5rem">
          <div class="ody-row" style="gap:.45rem;flex-wrap:wrap">
            <input id="ody-sync-code-box" class="ody-input small" style="flex:1" placeholder="Cliquez sur « Générer mon code » ou collez un code ici…">
            <button type="button" class="ody-btn small ghost" data-a2="copycode">📋 Générer &amp; Copier mon code</button>
            <button type="button" class="ody-btn small primary" data-a2="importcode">📥 Fusionner ce code</button>
          </div>
        </div>
      </details>
    </div>`;
    document.body.appendChild(d);
    d.addEventListener("click", (e) => { if (e.target === d) closeSheet(); });
  }

  // ----------------------------------------------------------------- top bar & drawer
  function ensureBar() {
    let bar = $("ody-bar"); if (bar) return bar;
    bar = document.createElement("header"); bar.id = "ody-bar"; bar.className = "ody-bar";
    document.body.insertBefore(bar, document.body.firstChild);
    return bar;
  }
  function updateBar() {
    const bar = ensureBar(); if (!NODES.length) return;
    const s = SAVE(), c = CH(); const daily = c.daily.date === today() ? c.daily : { xp: 0 };
    const rv = reviewCards().length;
    const lvl = currentLevel();
    const curScene = document.body.dataset.scene || "home";
    bar.innerHTML = `
      ${curScene !== "home" ? `<button type="button" class="ob-back" data-a2="back" title="Retour (Échap / Alt+←)">← Retour</button>` : ""}
      <button class="ob-home" data-a2="home" title="Your path"><img src="assets/odyssee_icon.png?v=27.0" class="ob-pixel-icon" alt=""> <span>L'Odyssée</span></button>
      <span class="ob-lvl" title="Current level">${lvl === "NATIF" ? "👑" : lvl}</span>
      <button class="ob-stat btn ob-nav-pill ob-vis-pill" data-a2="openexplorepicker" title="Regarder & Toucher · 10 Scènes Visuelles de Paris (0 anglais)">🗺️ Explorer</button>
      <button class="ob-stat btn ob-nav-pill ob-chr-pill" data-a2="chroniques" title="Les Chroniques de Paris · 6 Épisodes Narratifs A1→C2">🎬 Chroniques</button>
      <button class="ob-stat btn ob-nav-pill ob-quick-pill" data-a2="swipe" title="Arcade Swipe Réflexe · Glissez ⬅️/➡️ par niveau A1→C2">⚡ Swipe</button>
      <button class="ob-stat btn ob-nav-pill" data-a2="amis" title="Le Téléphone de Paris · Camille, Yanis, Céleste & Valcourt">📱 Amis</button>
      <button class="ob-stat btn ob-nav-pill" data-a2="pantheon" title="Panthéon des Immortels & Sceaux A1→C2"><img src="assets/pixel_pantheon.png" class="ob-mini-px" alt=""> Panthéon</button>
      <button class="ob-stat btn ob-nav-pill" data-a2="atlas" title="Atlas de Maîtrise A1 → C2">🗺️ Atlas</button>
      <button class="ob-stat btn ob-nav-pill ${CLOUD_SYNC.status === "synced" ? "ok" : ""}" id="ob-cloud-pill" data-a2="cloudsync" title="Synchronisation Bidirectionnelle Tablette Redmi Pad 2 Pro 5G ↔ PC">☁️ Sync ✓</button>
      <button class="ob-stat btn ob-nav-pill" id="ob-lang-pill" data-a2="toggleuilang" title="Switch between Beginner English+French Guide and 100% French Immersion">${isEnGuide() ? "🇬🇧 EN+FR" : "🇫🇷 FR"}</button>
      <div class="ob-sp"></div>
      <span class="ob-stat" title="Day streak">🔥 ${s.streak || 0}</span>
      <span class="ob-stat ${daily.xp >= c.goal ? "ok" : ""}" title="Today's XP / daily goal">⚡ ${daily.xp}/${c.goal}</span>
      <span class="ob-stat" title="Réputation Parisienne">⚜️ ${c.reputation || 0}</span>
      <span class="ob-stat" title="Gold">🪙 ${(s.gold || 0).toLocaleString()}</span>
      ${rv >= 1 ? `<button class="ob-stat btn" data-a2="review" title="Phrases to review">🔁 ${Math.min(rv, 99)}</button>` : ""}
      <button class="ob-stat btn" data-a2="sfx" id="ob-sfx" title="Sound effects">${window.RPG_SFX && window.RPG_SFX.muted ? "🔇" : "🔊"}</button>
      <button class="ob-menu" data-a2="drawer">☰ <span>Menu</span></button>`;
  }
  HOME_ACT.sfx = () => { if (window.RPG_SFX) { window.RPG_SFX.muted = !window.RPG_SFX.muted; } updateBar(); };
  function openDrawer() {
    closeDrawer();
    const c = CH(), s = SAVE();
    const d = document.createElement("div"); d.id = "ody-drawer"; d.className = "ody-drawer-wrap";
    const tile = (sc, ic, t, sub) => `<button class="ody-tile-m" data-a2="scene" data-s="${sc}"><span class="ic">${ic}</span><b>${t}</b><small>${sub}</small></button>`;
    d.innerHTML = `<div class="ody-drawer">
      <div class="ody-row between"><h3><img src="assets/odyssee_icon.png?v=27.0" class="ob-pixel-icon" alt=""> Menu · L'Odyssée v27.0</h3><button class="ody-btn ghost small" data-a2="closedrawer">✕</button></div>
      <button class="ody-tile-m wide" data-a2="openexplorepicker"><span class="ic">🗺️</span><b>Explorer Paris en Images (Regarder &amp; Toucher)</b><small>10 scènes illustrées interactives A1→C2 · Touchez les objets &amp; Chasse Audio (0 anglais)</small></button>
      <button class="ody-tile-m wide" data-a2="chroniques"><span class="ic">🎬</span><b>Les Chroniques de Paris (A1 → C2)</b><small>6 épisodes narratifs vivants · 30 scènes illustrées (Écouter · Lire · Écrire · Parler)</small></button>
      <button class="ody-tile-m wide" data-a2="home"><span class="ic">🧭</span><b>Carte &amp; Odyssée</b><small>62 Mondes, Synergie A1→C2, Micro-Capsules 90s, Quartiers, Ateliers &amp; Examens</small></button>
      <button class="ody-tile-m wide" data-a2="cloudsync"><span class="ic">☁️</span><b>Tablette Redmi Pad 2 Pro 5G &amp; Sync Cloud</b><small>Synchronisation automatique Tablette ↔ PC &amp; Clavier Français Logitech</small></button>
      <button class="ody-tile-m wide" data-a2="atlas"><span class="ic">🗺️</span><b>Atlas de Maîtrise C2</b><small>Les 6 Époques (A1 → C2 → Natif) &amp; 7 Compétences sans limite de temps</small></button>
      <div class="ody-k-label">Quartiers, Micro-Modules &amp; Studios C2</div>
      <div class="ody-tiles">
        <button class="ody-tile-m" data-a2="quick60"><span class="ic">⚡</span><b>Capsule Express 60s</b><small>4 micro-défis · Dopamine &amp; Coffre</small></button>
        <button class="ody-tile-m" data-a2="amerun"><span class="ic">🇫🇷</span><b>Âme &amp; Pensée Directe</b><small>18 codes sociaux + 18 pensées A1→C2</small></button>
        <button class="ody-tile-m" data-a2="allames"><span class="ic">🧠</span><b>Codex 36 Réflexes Natifs</b><small>Zéro traduction · Vrai français parlé</small></button>
        <button class="ody-tile-m" data-a2="amis"><span class="ic">🥂</span><b>Mes Amis de Paris</b><small>Camille, Yanis, Céleste &amp; Valcourt</small></button>
        <button class="ody-tile-m" data-a2="pantheon"><span class="ic"><img src="assets/pixel_pantheon.png" class="ob-mini-px" alt="🏛️"></span><b>Panthéon C2</b><small>12 Sceaux de Paris &amp; Titres</small></button>
        <button class="ody-tile-m" data-a2="perioderun"><span class="ic"><img src="assets/pixel_plume.png" class="ob-mini-px" alt="✒️"></span><b>Période &amp; Modes</b><small>16 périodes &amp; 18 concordances</small></button>
        <button class="ody-tile-m" data-a2="alldistricts"><span class="ic">🏙️</span><b>10 Quartiers</b><small>Gare du Nord → Sous la Coupole C2</small></button>
        <button class="ody-tile-m" data-a2="allateliers"><span class="ic">✒️</span><b>12 Ateliers C2</b><small>Rhétorique, style &amp; Grand Oral</small></button>
        <button class="ody-tile-m" data-a2="jouterun"><span class="ic">⚖️</span><b>Joute Oratoire</b><small>Concession · Réfutation · Synthèse</small></button>
        <button class="ody-tile-m" data-a2="allidiomes"><span class="ic">🎭</span><b>18 Idiomes &amp; Litotes</b><small>Expressions figurées &amp; sous-entendus</small></button>
        <button class="ody-tile-m" data-a2="sleuthrun"><span class="ic">🕵️</span><b>Enquête &amp; Forge</b><small>Pièges C2, 94 verbes &amp; liaisons</small></button>
        <button class="ody-tile-m" data-a2="review"><span class="ic">🔁</span><b>Carnet SRS</b><small>Révision espacée + vos erreurs</small></button>
        <button class="ody-tile-m" data-a2="weakspot"><span class="ic">🎯</span><b>Point Faible</b><small>Entraînement ciblé sur vos lacunes</small></button>
        ${tile("soundlab", "👄", "Pronunciation lab", "French sounds, minimal pairs, mouth position")}
        ${tile("gym", "🧠", "Native gym", "Spoken French, definitions, culture, scenes")}
        ${tile("writing", "✍️", "Writing studio", "DALF-style writing missions")}
        ${tile("forge", "⚒️", "Verb forge", "94 verbs × every tense")}
        ${tile("cafe", "☕", "Le Café", "Visual-novel dialogues")}
        ${tile("paris_sim", "🏙️", "Life in Paris", "Real-life situations in 3 registers")}
        ${tile("radio", "📻", "Radio Paris", "Real French podcasts and shows")}
      </div>
      <div class="ody-k-label">Reference & rewards</div>
      <div class="ody-tiles">
        ${tile("grammar", "📘", "Grammar", "Every rule, searchable")}
        ${tile("codex", "📜", "Codex", "Vocabulary themes")}
        ${tile("grimoire", "📕", "Mistakes book", "Everything you got wrong")}
        <button class="ody-tile-m" data-a2="portfolio"><span class="ic">📓</span><b>My writing</b><small>Every text you've written + scores</small></button>
        ${tile("worldmap", "🗺️", "World map", "The 62 worlds")}
        ${tile("shop", "🪙", "Shop & trophies", "Spend your gold")}
      </div>
      <div class="ody-k-label">Settings</div>
      <div class="ody-settings">
        <div class="ody-row"><span>Your name</span><input id="ody-name" class="ody-input small" value="${esc(c.name || "")}" placeholder="Name"><button class="ody-btn small" data-a2="savename">Save</button></div>
        <div class="ody-row"><span>Daily goal</span>${[30, 60, 100, 150].map((v) => `<button class="ody-btn small ${c.goal === v ? "primary" : "ghost"}" data-a2="goal" data-v="${v}">${v} XP</button>`).join("")}</div>
        <div class="ody-row"><span>Auto-play French audio</span><button class="ody-btn small ${c.autoAudio ? "primary" : "ghost"}" data-a2="autoaudio">${c.autoAudio ? "On" : "Off"}</button><button class="ody-btn small ghost" data-a2="soundtest">🔊 Test the voice</button></div>
        <div class="ody-row"><span>Microphone</span><button class="ody-btn small ghost" data-a2="mictest">🎙️ Test the mic</button><span id="ody-mictest" class="ody-mini"></span></div>
        <div class="ody-row"><span>Free roam (unlock everything)</span><button class="ody-btn small ${s.freeRoamUnlocked ? "primary" : "ghost"}" data-a2="freeroam">${s.freeRoamUnlocked ? "On" : "Off"}</button></div>
        <div class="ody-row"><span>Placement test</span><button class="ody-btn small ghost" data-a2="placement">🧭 Find my level</button><button class="ody-btn small ghost" data-a2="exportsave">💾 Export my save</button></div>
        <div class="ody-mini">Audio: ${SERVED ? "local server with offline cache ✅" : "direct mode — use the desktop shortcut for the most reliable audio"} · Sauvegarde disque automatique ✅ · ${esc(window.ODYSSEE_VERSION || "")}</div>
      </div></div>`;
    document.body.appendChild(d);
    d.addEventListener("click", (e) => { if (e.target === d) closeDrawer(); });
  }
  function closeDrawer() { const d = $("ody-drawer"); if (d) d.remove(); }
  function renderPortfolio(fromBack) {
    closeDrawer(); closeSheet(); SES = null; document.body.classList.remove("ody-in-session");
    document.body.dataset.scene = "portfolio";
    if (!fromBack) NAV.push({ kind: "view", scene: "portfolio" });
    updateBar();
    const p = (CH().portfolio || []).slice().reverse();
    $("app-main").innerHTML = `<div class="ody-result wide">
      <div class="ody-row between" style="margin-bottom:.6rem"><h2>📓 My writing</h2><button class="ody-btn ghost small" data-a2="back">← Retour</button></div>
      <p class="ody-goal">${p.length} texts. Rereading your old texts is the fastest way to see your progress.</p>
      ${p.map((x) => `<div class="ody-port"><div class="ody-row between"><b>${esc(x.prompt || "")}</b><span class="ody-chip">${esc(x.level || "")} · ${x.score}/100 · ${esc(x.date)}</span></div><div class="ody-port-t">${esc(x.text)}</div></div>`).join("") || "<p>Nothing yet: missions and exams add your texts here.</p>"}
      <div class="ody-row center"><button class="ody-btn primary" data-a2="home">🏠 Path</button></div></div>`;
  }

  // ----------------------------------------------------------------- onboarding
  let OB = { step: 0, heard: null };
  function renderOnboarding(step) {
    OB.step = step;
    document.body.dataset.scene = "onboarding";
    const main = $("app-main");
    const backRow = step > 0 ? `<div class="ody-row" style="margin-bottom:.5rem"><button class="ody-btn ghost small" data-a2="back">← Précédent</button></div>` : "";
    const steps = [
      `<div class="ody-ob">${camille("xl")}<h2>Bonjour ! I'm Camille.</h2><p class="ody-goal">I'll be your French teacher from your very first word to native-level French. First, let's check you can hear me.</p>
        <button class="ody-btn primary big" data-a2="ob" data-v="hear">🔊 Play Camille's voice</button>
        <div class="ody-row center" id="ody-ob-heard" style="${OB.heard === null ? "display:none" : ""}"><button class="ody-btn" data-a2="ob" data-v="yes">✅ I heard her</button><button class="ody-btn ghost" data-a2="ob" data-v="no">❌ No sound</button></div>
        <div id="ody-ob-help"></div></div>`,
      `<div class="ody-ob">${backRow}${camille("lg")}<h2>What's your name?</h2><input class="ody-input" id="ody-ob-name" placeholder="Your first name" value="${esc(CH().name || "")}">
        <div class="ody-row center"><button class="ody-btn primary big" data-a2="ob" data-v="name">Continue ▸</button></div></div>`,
      `<div class="ody-ob">${backRow}${camille("lg")}<h2>Do you already speak some French?</h2>
        <div class="ody-ob-opts">
          <button class="ody-tile-m" data-a2="ob" data-v="zero"><span class="ic">🐣</span><b>Not at all</b><small>Start from the sounds of French</small></button>
          <button class="ody-tile-m" data-a2="ob" data-v="basics"><span class="ic">🙂</span><b>A little</b><small>Start at World 1 (skip the sounds)</small></button>
          <button class="ody-tile-m" data-a2="ob" data-v="test"><span class="ic">🧭</span><b>Find my level</b><small>20-question placement test</small></button>
        </div></div>`,
      `<div class="ody-ob">${backRow}${camille("lg")}<h2>Your daily goal</h2><p class="ody-goal">Native-level French comes from a little every day. Pick what you can really keep up.</p>
        <div class="ody-ob-opts">${[[30, "10 min", "Relaxed"], [60, "20 min", "Steady"], [100, "30 min", "Serious"], [150, "45 min", "Intense"]].map(([v, t, l]) => `<button class="ody-tile-m" data-a2="ob" data-v="goal${v}"><span class="ic">⚡</span><b>${t}</b><small>${l} · ${v} XP</small></button>`).join("")}</div></div>`
    ];
    main.innerHTML = steps[step] || "";
    updateBar();
    if (step === 1) setTimeout(() => { const i = $("ody-ob-name"); if (i) i.focus(); }, 50);
  }
  function onboardingAction(v) {
    const c = CH();
    if (v === "hear") { speak("Bonjour ! Je m'appelle Camille. Bienvenue !"); OB.heard = false; const h = $("ody-ob-heard"); if (h) h.style.display = ""; return; }
    if (v === "yes") return renderOnboarding(1);
    if (v === "no") {
      const h = $("ody-ob-help");
      if (h) h.innerHTML = `<div class="ody-help"><b>Let's fix the sound:</b><ol><li>Turn up the volume and check the right speakers/headphones are selected in Windows.</li><li>${SERVED ? "Check your internet connection — the voice is downloaded once, then cached." : "Close this tab and open the game with the desktop shortcut <b>L'Odyssée Française</b> (it starts the audio server)."}</li><li>If Chrome shows a 🔇 icon on the tab, right-click the tab → Unmute site.</li></ol>
        <div class="ody-row center"><button class="ody-btn" data-a2="ob" data-v="hear">🔊 Try again</button><button class="ody-btn ghost" data-a2="ob" data-v="yes">Continue anyway</button></div></div>`;
      return;
    }
    if (v === "name") { const i = $("ody-ob-name"); c.name = i ? i.value.trim().slice(0, 30) : ""; persist(); return renderOnboarding(2); }
    if (v === "zero") { c.skipBoot = false; return renderOnboarding(3); }
    if (v === "basics") { c.skipBoot = true; return renderOnboarding(3); }
    if (v === "test") { c.pendingPlacement = true; return renderOnboarding(3); }
    if (v.startsWith("goal")) {
      c.goal = +v.slice(4); c.onboarded = true; persist();
      if (c.pendingPlacement) { c.pendingPlacement = false; return HOME_ACT.placement(); }
      return go(nextNode().id);
    }
  }

  // ----------------------------------------------------------------- events
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-a]");
    if (a && ACT[a.dataset.a] && (SES || a.dataset.a === "say" || a.dataset.a === "acc")) { e.preventDefault(); try { ACT[a.dataset.a](a, e); } catch (err) { console.error("ODY action", a.dataset.a, err); } return; }
    const b = e.target.closest("[data-a2]");
    if (b && HOME_ACT[b.dataset.a2]) { e.preventDefault(); try { HOME_ACT[b.dataset.a2](b, e); } catch (err) { console.error("ODY home action", b.dataset.a2, err); } }
  });
  document.addEventListener("keydown", (e) => {
    const tag = (document.activeElement && document.activeElement.tagName) || "";
    const inInput = tag === "INPUT" || tag === "TEXTAREA";
    if (e.key === "Escape") {
      if (NAV.canGoBack()) { e.preventDefault(); NAV.back(); return; }
    }
    if (e.altKey && e.key === "ArrowLeft") {
      e.preventDefault();
      if (SES && SES.i > 0 && !SES.exam) { prev(); return; }
      NAV.back();
      return;
    }
    if (!SES) {
      if (e.key === "Enter" && document.activeElement && document.activeElement.id === "amis-in") { e.preventDefault(); sendAmisMessage(); return; }
      if (e.key === "Enter" && !inInput && document.body.dataset.scene === "home") { const b = $("ody-primary"); if (b) { e.preventDefault(); b.click(); } }
      return;
    }
    const st = cur(); if (!st) return;
    if (st.k === "swipe" && !SES.answered && !inInput && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
      e.preventDefault();
      ACT.swipepick({ dataset: { side: e.key === "ArrowLeft" ? "left" : "right" } });
      return;
    }
    if (e.key === "Enter") {
      if (st.k === "write" && inInput && !e.ctrlKey && !SES.answered) return;
      if ((st.k === "speakfree" || st.k === "speak" || st.k === "match" || st.k === "explore" || st.k === "swipe" || st.k === "visreflex") && !SES.answered) return;
      if (["mcq", "listen", "dialogue", "reflex", "quest", "register", "radio", "enquete", "liaison", "forgeron", "joute", "idiome", "synthese", "periode", "concordance", "ame", "pensee"].includes(st.k) && !SES.answered) return;
      e.preventDefault();
      if (SES.answered) return ACT.next();
      if (["type", "dictee", "build", "shadow", "memory", "simturn"].includes(st.k)) return ACT.check();
      return ACT.next();
    }
    const digitKey = /^[1-6]$/.test(e.key) ? +e.key : (/^(?:Digit|Numpad)([1-6])$/.test(e.code || "") ? +RegExp.$1 : 0);
    if (!inInput && digitKey >= 1 && digitKey <= 6 && !SES.answered) {
      const btns = document.querySelectorAll(".ody-choice, .vis-opt");
      const b = btns[digitKey - 1];
      if (b && !b.disabled) { e.preventDefault(); b.click(); return; }
    }
    if (!inInput && e.key === " " && (st.fr || st.npc)) {
      e.preventDefault();
      speak(st.fr || st.npc, (e.ctrlKey && e.shiftKey) ? 1.25 : e.shiftKey ? 0.7 : 1);
      return;
    }
    if (!inInput && !e.ctrlKey && !e.altKey && (e.key === "f" || e.key === "F") && (st.fr || st.npc)) {
      e.preventDefault();
      speak(st.fr || st.npc, 1.25);
      return;
    }
    if ((e.altKey && (e.key === "h" || e.key === "H")) && !SES.answered && (st.k === "type" || st.k === "memory") && ACT.letterhint) {
      e.preventDefault();
      ACT.letterhint();
      return;
    }
  });

  // ----------------------------------------------------------------- take over navigation
  function install() {
    if (window.ODYSSEE_DISK_SAVE && typeof window.ODYSSEE_DISK_SAVE === "object") {
      mergeExternalSave(window.ODYSSEE_DISK_SAVE);
    }
    buildPath();
    const legacyNav = window.navigateScene;
    window.navigateScene = function (scene) {
      if (!isPrivateAuthorized()) {
        renderPrivateLockGate();
        return;
      }
      if (scene === "title" || scene === "home" || scene === "bootcamp" || scene === "chemin") {
        if (SES) return; // never yank the player out of a running session
        NAV.stack = [{ kind: "view", scene: "home" }];
        return renderHome();
      }
      if (scene === "academy") {
        const a = window.RPG_ACTIVE && window.RPG_ACTIVE();
        const id = a && a.stage ? "st:" + a.stage.stageId : null;
        if (id && NODE_BY_ID[id]) return go(id, true);
        return renderHome();
      }
      if (scene === "revision") return HOME_ACT.review();
      SES = null; stopAudio(); micStop(); closeDrawer(); closeSheet();
      document.body.classList.remove("ody-in-session");
      document.body.dataset.scene = scene;
      NAV.push({ kind: "view", scene });
      if (legacyNav) legacyNav(scene);
      updateBar();
    };
    window.continueJourney = () => go(nextNode().id);
    window.ODY_HOME = renderHome;
    window.ODY_BACK = () => NAV.back();
    window.speakFrench = (t, r) => speak(t, r);
    Object.assign(window.ODY, { go, prev, NAV, startSession, startMicroCapsule, getMicroCapsules, nodeMicroProgress, activeArcCards, buildQuick60Session, buildPillarRepSession, buildChroniqueSession, openChroniquesSheet, buildExploreSession, openExplorePickerSheet, buildVisReflexSteps, buildSwipeSession, computeNativeUpgrade, openAmisSheet, sendAmisMessage, AMIS_DE_PARIS, AME_CASES, PENSEE_CASES, buildAmeSteps, buildPenseeSteps, buildAmeSession, openAmeSheet, levelSynergyBarHtml, levelMasteryBarHtml, levelNodes, buildSessionFor, buildExamSession, buildReviewSession, buildPlacementSession, buildBlitzSession, buildShadowSession, buildImprovSession, buildSleuthForgeSession, buildJouteSession, buildJouteSteps, buildIdiomeSession, buildIdiomeSteps, buildSyntheseSteps, buildPeriodeSession, buildPeriodeSteps, buildConcordanceSteps, buildEnqueteSteps, buildLiaisonSteps, buildForgeronSteps, buildQuestSteps, buildWeakSpotSession, buildDistrictSession, buildAtelierSession, openCollectionSheet, openIdiomeSheet, openPeriodeSheet, openPantheonSheet, openCloudSyncSheet, pullFromCloud, pushToCloudNow, mergeExternalSave, isPrivateAuthorized, unlockPrivateGate, renderPrivateLockGate, PRIV_KEY, CLOUD_SYNC, TABLET_PWA_URL, renderHome, renderOdysseyAtlas, renderPlan90, hasPartialProgress, savePartial, state: () => SES, cur, ACT, HOME_ACT, reviewCards, levelOfNode, currentLevel });
    document.body.classList.add("ody14");
    if (!isPrivateAuthorized()) {
      renderPrivateLockGate();
      return;
    }
    ensureBar();
    if (SERVED && IS_LOCAL_SERVER) {
      fetch("/api/save", { cache: "no-store" }).then((r) => r.json()).then((j) => {
        if (j && j.ok && j.data && mergeExternalSave(j.data)) {
          buildPath();
          if (!SES && document.body.dataset.scene === "home") renderHome();
        }
      }).catch(() => {}).finally(() => {
        pullFromCloud(false);
      });
    } else if (SERVED) {
      pullFromCloud(false);
    } else {
      CLOUD_SYNC.hydrated = true;
    }
    window.addEventListener("focus", () => {
      if (SERVED && !window.__odySkipCloudSync && Date.now() - CLOUD_SYNC.lastSyncAt > 4000) pullFromCloud(false);
    });
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && SERVED && !window.__odySkipCloudSync && Date.now() - CLOUD_SYNC.lastSyncAt > 4000) {
        pullFromCloud(false);
      }
    });
    window.addEventListener("online", () => {
      if (SERVED && !window.__odySkipCloudSync) {
        pullFromCloud(false).then(() => pushToCloudNow(false));
      }
    });
    checkServer().then(() => { if (!SES && document.body.dataset.scene === "home") updateBar(); });
  }
  install();
})();
