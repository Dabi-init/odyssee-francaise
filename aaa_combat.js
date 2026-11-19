(function () {
  const DATA = window.ALEXA_COURSE_DATA || {
    lessons: [],
    verbs: [],
    vocabThemes: [],
    flashcards: [],
    drills: [],
    exercises: []
  };

  // =========================================================================
  // 1. O(1) PRE-INDEXED LOOKUP TABLES (ZERO LAG ACROSS 16,000+ ITEMS)
  // =========================================================================
  const CARDS_BY_LESSON = {};
  const CARDS_BY_CEFR = { ALL: DATA.flashcards };
  const DRILLS_BY_LESSON = {};
  const DRILLS_BY_CEFR = { ALL: DATA.drills };

  for (let i = 0; i < DATA.flashcards.length; i++) {
    const c = DATA.flashcards[i];
    if (c.lessonId) {
      (CARDS_BY_LESSON[c.lessonId] || (CARDS_BY_LESSON[c.lessonId] = [])).push(c);
    }
    const lv = String(c.cefr || "A1").slice(0, 2);
    (CARDS_BY_CEFR[lv] || (CARDS_BY_CEFR[lv] = [])).push(c);
  }

  for (let i = 0; i < DATA.drills.length; i++) {
    const d = DATA.drills[i];
    if (d.lessonId) {
      (DRILLS_BY_LESSON[d.lessonId] || (DRILLS_BY_LESSON[d.lessonId] = [])).push(d);
    }
    const lv = String(d.cefr || "A1").slice(0, 2);
    (DRILLS_BY_CEFR[lv] || (DRILLS_BY_CEFR[lv] = [])).push(d);
  }

  window.RPG_INDEX = {
    CARDS_BY_LESSON,
    CARDS_BY_CEFR,
    DRILLS_BY_LESSON,
    DRILLS_BY_CEFR
  };

  // =========================================================================
  // 2. WEB AUDIO SYNTH SFX ENGINE (AUTO-DISCONNECTING NODES)
  // =========================================================================
  const SFX = {
    ctx: null,
    muted: false,
    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
    },
    playTone(freq, type, duration, gainVal = 0.1, slideFreq = null) {
      if (this.muted) return;
      try {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type || "triangle";
        osc.frequency.setValueAtTime(freq, now);
        if (slideFreq) {
          osc.frequency.exponentialRampToValueAtTime(slideFreq, now + duration);
        }
        gain.gain.setValueAtTime(gainVal, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.onended = () => {
          try { osc.disconnect(); gain.disconnect(); } catch (e) {}
        };
        osc.start(now);
        osc.stop(now + duration);
      } catch (e) {}
    },
    swordSlash() {
      this.playTone(520, "sawtooth", 0.14, 0.11, 180);
      setTimeout(() => this.playTone(784, "triangle", 0.22, 0.12, 1046), 70);
    },
    critStrike() {
      [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => {
        setTimeout(() => this.playTone(f, "triangle", 0.22, 0.13), i * 45);
      });
    },
    damageHit() {
      this.playTone(150, "sawtooth", 0.26, 0.13, 62);
    },
    shieldBlock() {
      this.playTone(440, "sine", 0.18, 0.11, 880);
    },
    tileClick() {
      this.playTone(620, "sine", 0.06, 0.07, 760);
    },
    matchCombo(combo = 1) {
      const base = 440 * Math.pow(1.06, Math.min(12, combo));
      this.playTone(base, "triangle", 0.15, 0.1, base * 1.25);
    },
    potionUse() {
      [440, 554, 659, 880].forEach((f, i) => {
        setTimeout(() => this.playTone(f, "sine", 0.14, 0.09), i * 45);
      });
    },
    victoryFanfare() {
      [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98].forEach((f, i) => {
        setTimeout(() => this.playTone(f, "triangle", 0.28, 0.13), i * 80);
      });
    }
  };
  window.RPG_SFX = SFX;

  window.toggleRpgMute = function () {
    SFX.muted = !SFX.muted;
    const icon = document.getElementById("hud-sfx-icon");
    if (icon) icon.textContent = SFX.muted ? "🔇" : "🔊";
  };

  // =========================================================================
  // 3. GLOBAL VFX PARTICLE & FLOATING TEXT OVERLAY
  // =========================================================================
  const VFX = {
    canvas: null,
    ctx: null,
    particles: [],
    floats: [],
    running: false,
    boundResize: false,
    init() {
      if (!this.canvas) {
        this.canvas = document.getElementById("vfx-canvas");
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext("2d");
        const resize = () => {
          if (!this.canvas) return;
          this.canvas.width = window.innerWidth;
          this.canvas.height = window.innerHeight;
        };
        resize();
        if (!this.boundResize) {
          this.boundResize = true;
          window.addEventListener("resize", resize, { passive: true });
        }
      }
    },
    burst(x, y, color = "#fbbf24", count = 24) {
      this.init();
      if (!this.ctx) return;
      const cx = x || window.innerWidth / 2;
      const cy = y || window.innerHeight / 2;
      if (this.particles.length > 75) {
        this.particles.splice(0, this.particles.length - 50);
      }
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
        const speed = 2.5 + Math.random() * 6.5;
        this.particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          r: 2.5 + Math.random() * 4,
          alpha: 1,
          color
        });
      }
      this.startLoop();
    },
    floatText(text, color = "#fde047", x = null, y = null) {
      this.init();
      if (!this.ctx) return;
      if (this.floats.length > 12) this.floats.shift();
      this.floats.push({
        text,
        color,
        x: x || window.innerWidth / 2 + (Math.random() - 0.5) * 110,
        y: y || window.innerHeight * 0.36,
        vy: -1.8,
        alpha: 1,
        scale: 1.15
      });
      this.startLoop();
    },
    toast(title, desc, icon = "🏆") {
      const stack = document.getElementById("toast-stack");
      if (!stack) return;
      while (stack.children.length >= 3) {
        stack.firstElementChild.remove();
      }
      const el = document.createElement("div");
      el.className = "achievement-toast";
      el.innerHTML = `
        <div style="font-size:2rem;">${icon}</div>
        <div>
          <div style="font-size:0.72rem;font-weight:900;color:#fbbf24;text-transform:uppercase;letter-spacing:0.08em;">Royal Decree</div>
          <div style="font-size:0.98rem;font-weight:800;color:#fff;">${title}</div>
          <div style="font-size:0.8rem;color:#cbd5e1;">${desc}</div>
        </div>
      `;
      stack.appendChild(el);
      setTimeout(() => {
        el.style.opacity = "0";
        el.style.transform = "translateX(40px)";
        el.style.transition = "all 0.3s ease";
        setTimeout(() => el.remove(), 320);
      }, 3600);
    },
    startLoop() {
      if (this.running) return;
      this.running = true;
      const tick = () => {
        if (!this.ctx || !this.canvas) {
          this.running = false;
          return;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = this.particles.length - 1; i >= 0; i--) {
          const p = this.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.14;
          p.alpha -= 0.024;
          if (p.alpha <= 0) {
            this.particles.splice(i, 1);
            continue;
          }
          this.ctx.save();
          this.ctx.globalAlpha = Math.max(0, p.alpha);
          this.ctx.fillStyle = p.color;
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.restore();
        }
        for (let i = this.floats.length - 1; i >= 0; i--) {
          const f = this.floats[i];
          f.y += f.vy;
          f.alpha -= 0.02;
          if (f.alpha <= 0) {
            this.floats.splice(i, 1);
            continue;
          }
          this.ctx.save();
          this.ctx.globalAlpha = Math.max(0, f.alpha);
          this.ctx.font = "900 23px 'Segoe UI', system-ui, sans-serif";
          this.ctx.textAlign = "center";
          this.ctx.shadowColor = "#000";
          this.ctx.shadowBlur = 8;
          this.ctx.fillStyle = f.color;
          this.ctx.fillText(f.text, f.x, f.y);
          this.ctx.restore();
        }
        if (this.particles.length > 0 || this.floats.length > 0) {
          requestAnimationFrame(tick);
        } else {
          this.running = false;
        }
      };
      requestAnimationFrame(tick);
    }
  };
  window.RPG_VFX = VFX;

  // =========================================================================
  // 4. PLAYABLE 2D OVERWORLD MAP OF FRANCE ENGINE (52 WORLDS, ZOOM/PAN CAMERA)
  // =========================================================================
  const MAP_NODES_COORDS = [
    // A1: Provence & Lavender Villages (Worlds 1-12)
    [455, 520], [490, 510], [525, 500], [560, 515], [595, 530], [630, 540],
    [665, 550], [705, 555], [740, 535], [720, 495], [680, 475], [640, 460],
    // A2: Rhône Valley & Marseille Coast (Worlds 13-19)
    [600, 440], [555, 425], [510, 415], [465, 425], [420, 440], [375, 455], [330, 470],
    // B1: Citadelle de Bordeaux & Aquitaine (Worlds 20-29)
    [280, 450], [245, 415], [235, 375], [265, 345], [305, 330], [345, 315],
    [385, 300], [425, 290], [465, 280], [505, 270],
    // B2: Châteaux de la Loire & Brittany (Worlds 30-36)
    [285, 240], [325, 220], [370, 215], [415, 225], [460, 220], [505, 210], [550, 225],
    // C1: Sommet des Alpes (Worlds 37-38)
    [790, 390], [845, 330],
    // C2: Paris & La Défense Executive / DALF C2 Mastery Citadel (Worlds 39-46)
    [575, 175], [615, 160], [655, 150], [695, 145], [735, 135], [690, 105], [640, 95], [590, 88],
    // Native Path: real spoken French, unlocked by level (Worlds 47-52)
    [905, 245], [950, 205], [985, 160], [955, 115], [905, 90], [860, 120],
    // Académie des Îles: islands in the Atlantic & the Channel (Worlds 53-62)
    [150, 385], [105, 352], [150, 318], [105, 282], [62, 250], [45, 205], [58, 155], [78, 108], [130, 72], [195, 55]
  ];
  // Only draw nodes for worlds that exist in the data.
  function nodeCount() {
    const n = (window.ALEXA_COURSE_DATA && window.ALEXA_COURSE_DATA.lessons || []).length || MAP_NODES_COORDS.length;
    return Math.min(MAP_NODES_COORDS.length, n);
  }

  const MAP_W = 1120, MAP_H = 630;
  const OVERWORLD = {
    canvas: null,
    ctx: null,
    bgImg: null,
    bgLoaded: false,
    animId: null,
    selectedNodeNum: 1,
    heroX: 455,
    heroY: 520,
    targetX: 455,
    targetY: 520,
    frameTick: 0,
    onSelectCallback: null,
    keyListenerBound: false,
    // Camera: zoom 1 = whole map visible. Drag to pan, wheel / buttons to zoom.
    zoom: 1,
    camX: 0,
    camY: 0,
    camTargetX: 0,
    camTargetY: 0,
    zoomTarget: 1,
    hoverNum: null,
    drag: null,

    clampCam() {
      const vw = MAP_W / this.zoomTarget, vh = MAP_H / this.zoomTarget;
      this.camTargetX = Math.max(0, Math.min(MAP_W - vw, this.camTargetX));
      this.camTargetY = Math.max(0, Math.min(MAP_H - vh, this.camTargetY));
    },
    centerOn(x, y) {
      this.camTargetX = x - MAP_W / this.zoomTarget / 2;
      this.camTargetY = y - MAP_H / this.zoomTarget / 2;
      this.clampCam();
    },
    setZoom(z, fx, fy) {
      const nz = Math.max(1, Math.min(3.2, z));
      // keep the focus point (map coords) under the same screen spot
      const fxm = fx == null ? this.camTargetX + MAP_W / this.zoomTarget / 2 : fx;
      const fym = fy == null ? this.camTargetY + MAP_H / this.zoomTarget / 2 : fy;
      const rx = (fxm - this.camTargetX) / (MAP_W / this.zoomTarget);
      const ry = (fym - this.camTargetY) / (MAP_H / this.zoomTarget);
      this.zoomTarget = nz;
      this.camTargetX = fxm - rx * (MAP_W / nz);
      this.camTargetY = fym - ry * (MAP_H / nz);
      this.clampCam();
    },
    zoomIn() { this.setZoom(this.zoomTarget * 1.35); },
    zoomOut() { this.setZoom(this.zoomTarget / 1.35); },
    fit() { this.zoomTarget = 1; this.camTargetX = 0; this.camTargetY = 0; },
    focusHero() { if (this.zoomTarget < 1.8) this.zoomTarget = 1.8; this.centerOn(this.targetX, this.targetY); },
    toggleFullscreen() {
      const frame = this.canvas && this.canvas.closest(".worldmap-canvas-frame");
      if (!frame) return;
      if (document.fullscreenElement) document.exitFullscreen();
      else if (frame.requestFullscreen) frame.requestFullscreen();
    },
    toMap(e) {
      const rect = this.canvas.getBoundingClientRect();
      const sx = (e.clientX - rect.left) * (MAP_W / rect.width);
      const sy = (e.clientY - rect.top) * (MAP_H / rect.height);
      return [this.camX + sx / this.zoom, this.camY + sy / this.zoom];
    },
    nodeAt(mx, my) {
      let bestNum = null;
      let bestDist = 22 / Math.sqrt(this.zoom) + 6;
      for (let i = 0; i < nodeCount(); i++) {
        const [cx, cy] = MAP_NODES_COORDS[i];
        const d = Math.hypot(mx - cx, my - cy);
        if (d < bestDist) { bestDist = d; bestNum = i + 1; }
      }
      return bestNum;
    },

    init(canvasId, initialLessonNum, onSelect) {
      this.stop();
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext("2d");
      this.selectedNodeNum = initialLessonNum || 1;
      this.onSelectCallback = onSelect;

      const idx = Math.max(0, Math.min(MAP_NODES_COORDS.length - 1, this.selectedNodeNum - 1));
      const [nx, ny] = MAP_NODES_COORDS[idx];
      this.heroX = nx;
      this.heroY = ny;
      this.targetX = nx;
      this.targetY = ny;
      this.zoom = this.zoomTarget = 1;
      this.camX = this.camY = this.camTargetX = this.camTargetY = 0;

      if (!this.bgImg) {
        this.bgImg = new Image();
        this.bgImg.onload = () => { this.bgLoaded = true; };
        this.bgImg.src = "assets/bg_worldmap.jpg";
      }

      const cv = this.canvas;
      cv.onpointerdown = (e) => {
        this.drag = { x: e.clientX, y: e.clientY, cx: this.camTargetX, cy: this.camTargetY, moved: false };
        try { cv.setPointerCapture(e.pointerId); } catch (_) {}
      };
      cv.onpointermove = (e) => {
        if (this.drag) {
          const rect = cv.getBoundingClientRect();
          const dx = (e.clientX - this.drag.x) * (MAP_W / rect.width) / this.zoomTarget;
          const dy = (e.clientY - this.drag.y) * (MAP_H / rect.height) / this.zoomTarget;
          if (Math.abs(e.clientX - this.drag.x) + Math.abs(e.clientY - this.drag.y) > 5) this.drag.moved = true;
          if (this.drag.moved) {
            this.camTargetX = this.drag.cx - dx;
            this.camTargetY = this.drag.cy - dy;
            this.clampCam();
            this.camX = this.camTargetX; this.camY = this.camTargetY;
            cv.style.cursor = "grabbing";
          }
          return;
        }
        const [mx, my] = this.toMap(e);
        this.hoverNum = this.nodeAt(mx, my);
        cv.style.cursor = this.hoverNum ? "pointer" : (this.zoomTarget > 1 ? "grab" : "default");
      };
      cv.onpointerup = (e) => {
        const d = this.drag;
        this.drag = null;
        cv.style.cursor = "default";
        if (d && !d.moved) {
          const [mx, my] = this.toMap(e);
          const n = this.nodeAt(mx, my);
          if (n !== null) this.moveToNode(n, { keepCam: true });
        }
      };
      cv.onpointerleave = () => { this.hoverNum = null; };
      cv.onwheel = (e) => {
        e.preventDefault();
        const [mx, my] = this.toMap(e);
        this.setZoom(this.zoomTarget * (e.deltaY < 0 ? 1.18 : 1 / 1.18), mx, my);
      };
      cv.ondblclick = (e) => {
        const [mx, my] = this.toMap(e);
        const n = this.nodeAt(mx, my);
        if (n && window.openAcademyForLesson) window.openAcademyForLesson(n);
      };

      if (!this.keyListenerBound) {
        this.keyListenerBound = true;
        window.addEventListener("keydown", (e) => {
          if (!this.canvas || !document.body.contains(this.canvas)) return;
          if (["INPUT", "TEXTAREA", "SELECT"].includes((e.target && e.target.tagName) || "")) return;
          if (e.altKey) return;
          if (e.key === "ArrowRight" || e.key === "ArrowUp" || e.code === "KeyD") {
            e.preventDefault();
            this.moveToNode(Math.min(nodeCount(), this.selectedNodeNum + 1));
          } else if (e.key === "ArrowLeft" || e.key === "ArrowDown" || e.code === "KeyA") {
            e.preventDefault();
            this.moveToNode(Math.max(1, this.selectedNodeNum - 1));
          } else if (e.key === "+" || e.key === "=" || e.code === "Equal" || e.code === "NumpadAdd") {
            this.zoomIn();
          } else if (e.key === "-" || e.key === "_" || e.code === "Minus" || e.code === "NumpadSubtract") {
            this.zoomOut();
          } else if (e.key === "0" || e.code === "Digit0" || e.code === "Numpad0") {
            this.fit();
          } else if (e.key === "Enter") {
            e.preventDefault();
            if (window.openAcademyForLesson) window.openAcademyForLesson(this.selectedNodeNum);
          }
        });
      }

      const renderLoop = () => {
        if (!this.canvas || !document.body.contains(this.canvas)) {
          this.stop();
          return;
        }
        this.frameTick += 1;
        this.draw();
        this.animId = requestAnimationFrame(renderLoop);
      };
      this.animId = requestAnimationFrame(renderLoop);
    },

    moveToNode(num, opts) {
      num = Math.max(1, Math.min(nodeCount(), Number(num) || 1));
      this.selectedNodeNum = num;
      const [tx, ty] = MAP_NODES_COORDS[num - 1];
      this.targetX = tx;
      this.targetY = ty;
      // When zoomed in, the camera follows the hero so nothing gets lost off-screen.
      if (this.zoomTarget > 1.01 && !(opts && opts.keepCam)) this.centerOn(tx, ty);
      SFX.tileClick();
      if (this.onSelectCallback) this.onSelectCallback(num);
    },

    stop() {
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
    },

    draw() {
      const ctx = this.ctx;
      const w = MAP_W;
      const h = MAP_H;
      if (this.canvas.width !== w) this.canvas.width = w;
      if (this.canvas.height !== h) this.canvas.height = h;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = "#070d1f";
      ctx.fillRect(0, 0, w, h);

      // ease camera
      this.zoom += (this.zoomTarget - this.zoom) * 0.2;
      if (Math.abs(this.zoomTarget - this.zoom) < 0.002) this.zoom = this.zoomTarget;
      this.camX += (this.camTargetX - this.camX) * 0.2;
      this.camY += (this.camTargetY - this.camY) * 0.2;
      const z = this.zoom;
      ctx.setTransform(z, 0, 0, z, -this.camX * z, -this.camY * z);
      const k = 1 / Math.sqrt(z); // keep labels readable when zoomed

      // Background Map Image
      if (this.bgLoaded && this.bgImg) {
        ctx.drawImage(this.bgImg, 0, 0, w, h);
      } else {
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(0, 0, w, h);
      }

      // Subtle atmospheric vignette
      const grad = ctx.createRadialGradient(w / 2, h / 2, w * 0.28, w / 2, h / 2, w * 0.65);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, "rgba(2,6,23,0.42)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Draw Golden Campaign Path connecting all worlds
      ctx.save();
      ctx.beginPath();
      for (let i = 0; i < nodeCount(); i++) {
        const [x, y] = MAP_NODES_COORDS[i];
        if (i === 0 || i === 52) ctx.moveTo(x, y); // islands start a new sea route
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(251, 191, 36, 0.78)";
      ctx.lineWidth = 4 * k;
      ctx.setLineDash([8 * k, 6 * k]);
      ctx.lineDashOffset = -this.frameTick * 0.35;
      ctx.stroke();
      ctx.restore();

      const masteredMap = (window.RPG_GET_MASTERED && window.RPG_GET_MASTERED()) || {};

      // Draw Region Banners
      const regions = [
        { label: "🌸 PROVENCE (A1 • W1-12)", x: 600, y: 600, color: "#10b981" },
        { label: "⛵ CÔTE & RHÔNE (A2 • W13-19)", x: 500, y: 390, color: "#38bdf8" },
        { label: "🍷 BORDEAUX (B1 • W20-29)", x: 200, y: 300, color: "#fbbf24" },
        { label: "🏰 LOIRE (B2 • W30-36)", x: 400, y: 182, color: "#f97316" },
        { label: "🏔️ ALPES (C1 • W37-38)", x: 755, y: 300, color: "#c084fc" },
        { label: "👑 PARIS, CARRIÈRE & DALF C2 (W39-46)", x: 660, y: 56, color: "#f43f5e" },
        { label: "🗼 VOIE DU NATIF (W47-52)", x: 968, y: 290, color: "#2dd4bf" }
      ];
      if (nodeCount() > 52) regions.push({ label: `🏝️ ACADÉMIE DES ÎLES (W53-${nodeCount()})`, x: 120, y: 428, color: "#a78bfa" });
      for (const r of regions) {
        ctx.save();
        ctx.font = `900 ${12 * k}px 'Segoe UI', sans-serif`;
        const tw = ctx.measureText(r.label).width + 18 * k;
        ctx.fillStyle = "rgba(6, 10, 25, 0.85)";
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 1.5 * k;
        ctx.beginPath();
        ctx.roundRect(r.x - tw / 2, r.y - 13 * k, tw, 24 * k, 99);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(r.label, r.x, r.y);
        ctx.restore();
      }

      // Draw All World Nodes
      for (let i = 0; i < nodeCount(); i++) {
        const num = i + 1;
        const [nx, ny] = MAP_NODES_COORDS[i];
        const wId = `World_${String(num).padStart(2, "0")}`;
        const lId = `Lesson_${String(num).padStart(2, "0")}`;
        const isMastered = !!(masteredMap[wId] || masteredMap[lId]);
        const isSelected = num === this.selectedNodeNum;
        const isHover = num === this.hoverNum;
        const isC2Expansion = num >= 41 && num <= 46;
        const isNative = num >= 47 && num <= 52;
        const isAcademie = num >= 53;

        ctx.save();
        if (isSelected) {
          const pulse = (16 + Math.sin(this.frameTick * 0.12) * 4) * k;
          ctx.beginPath();
          ctx.arc(nx, ny, pulse, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(253, 224, 71, 0.38)";
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(nx, ny, (isSelected ? 13 : (isHover ? 12 : 9.5)) * k, 0, Math.PI * 2);
        ctx.fillStyle = isMastered ? "#10b981" : (isSelected ? "#f59e0b" : (isAcademie ? "#4c1d95" : (isNative ? "#115e59" : (isC2Expansion ? "#831843" : "#1e293b"))));
        ctx.fill();
        ctx.lineWidth = (isSelected ? 3 : 2) * k;
        ctx.strokeStyle = isSelected || isHover ? "#ffffff" : (isMastered ? "#6ee7b7" : (isAcademie ? "#c4b5fd" : (isNative ? "#2dd4bf" : (isC2Expansion ? "#f43f5e" : "#fbbf24"))));
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = isSelected ? `900 ${10.5 * k}px 'Segoe UI', sans-serif` : `800 ${9 * k}px 'Segoe UI', sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(num), nx, ny);
        ctx.restore();
      }

      // Smoothly interpolate Hero Avatar position toward target node
      this.heroX += (this.targetX - this.heroX) * 0.16;
      this.heroY += (this.targetY - this.heroY) * 0.16;
      const bob = Math.sin(this.frameTick * 0.15) * 3.5 * k;

      // Draw Hero Sprite on Overworld Map
      ctx.save();
      const hx = this.heroX;
      const hy = this.heroY - 22 * k + bob;

      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.beginPath();
      ctx.ellipse(this.heroX, this.heroY - 2 * k, 12 * k, 5 * k, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2 * k;
      ctx.beginPath();
      ctx.arc(hx, hy, 18 * k, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#2563eb";
      ctx.beginPath();
      ctx.arc(hx, hy, 15 * k, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#fde047";
      ctx.lineWidth = 2.5 * k;
      ctx.stroke();

      ctx.font = `${18 * k}px 'Segoe UI Emoji', sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🧙‍♂️", hx, hy);

      ctx.fillStyle = "#fde047";
      ctx.font = `900 ${10 * k}px 'Segoe UI', sans-serif`;
      ctx.shadowColor = "#000";
      ctx.shadowBlur = 4;
      ctx.fillText("▼ YOU", hx, hy - 23 * k);
      ctx.restore();

      // Hover tooltip with the world's name (screen space)
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const tipNum = this.hoverNum || null;
      if (tipNum) {
        const [tx, ty] = MAP_NODES_COORDS[tipNum - 1];
        const sx = (tx - this.camX) * z, sy = (ty - this.camY) * z;
        const L = (window.ALEXA_COURSE_DATA && window.ALEXA_COURSE_DATA.lessons || []).find(l => l.number === tipNum);
        const label = `W${tipNum} • ${L ? L.title : ""}`.slice(0, 60);
        ctx.font = "800 13px 'Segoe UI', sans-serif";
        const tw = ctx.measureText(label).width + 20;
        let bx = Math.max(6, Math.min(w - tw - 6, sx - tw / 2));
        let by = sy - 46; if (by < 6) by = sy + 22;
        ctx.fillStyle = "rgba(6,10,25,0.92)";
        ctx.strokeStyle = "#fde047";
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.roundRect(bx, by, tw, 26, 8); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#fff"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
        ctx.fillText(label, bx + 10, by + 13);
      }

      // Zoom indicator
      if (z > 1.02) {
        ctx.font = "800 12px 'Segoe UI', sans-serif";
        ctx.fillStyle = "rgba(6,10,25,0.8)";
        ctx.beginPath(); ctx.roundRect(w - 150, h - 34, 140, 24, 8); ctx.fill();
        ctx.fillStyle = "#fde047"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(`🔍 ${z.toFixed(1)}× • drag to move`, w - 80, h - 22);
      }
    }
  };
  window.RPG_OVERWORLD = OVERWORLD;

  // =========================================================================
  // 5. ANIMATED 2D TURN-BASED RPG BATTLE CANVAS ENGINE
  // =========================================================================
  const BOSS_ARCHETYPES = [
    { name: "Le Chevalier de Lavande", icon: "🛡️", color: "#38bdf8", aura: "rgba(56,189,248,0.35)" },
    { name: "La Gargouille de Notre-Dame", icon: "🦇", color: "#a855f7", aura: "rgba(168,85,247,0.35)" },
    { name: "L'Automate de la Loire", icon: "⚙️", color: "#f59e0b", aura: "rgba(245,158,11,0.35)" },
    { name: "Le Fantôme de l'Opéra", icon: "🎭", color: "#ec4899", aura: "rgba(236,72,153,0.35)" },
    { name: "Le Dragon de la Sorbonne", icon: "🐉", color: "#f43f5e", aura: "rgba(244,63,94,0.38)" },
    { name: "L'Archon du Panthéon (C2)", icon: "👑", color: "#fde047", aura: "rgba(253,224,71,0.42)" }
  ];

  const BATTLE_STAGE = {
    canvas: null,
    ctx: null,
    bgImg: null,
    bgLoaded: false,
    animId: null,
    tick: 0,
    shakeFrames: 0,
    heroHP: 100,
    heroMaxHP: 100,
    heroShield: false,
    bossHP: 300,
    bossMaxHP: 300,
    bossInfo: BOSS_ARCHETYPES[0],
    lessonTitle: "Chapter 01",
    projectiles: [],
    heroLunge: 0,
    bossLunge: 0,
    bossHitFlash: 0,
    heroHitFlash: 0,

    init(canvasId, state) {
      this.stop();
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext("2d");
      this.updateState(state);

      if (!this.bgImg) {
        this.bgImg = new Image();
        this.bgImg.onload = () => { this.bgLoaded = true; };
        this.bgImg.src = "assets/bg_battle.jpg";
      }

      const loop = () => {
        if (!this.canvas || !document.body.contains(this.canvas)) {
          this.stop();
          return;
        }
        this.tick += 1;
        this.draw();
        this.animId = requestAnimationFrame(loop);
      };
      this.animId = requestAnimationFrame(loop);
    },

    updateState(state = {}) {
      if (typeof state.heroHP === "number") this.heroHP = state.heroHP;
      if (typeof state.heroMaxHP === "number") this.heroMaxHP = state.heroMaxHP;
      if (typeof state.heroShield === "boolean") this.heroShield = state.heroShield;
      if (typeof state.bossHP === "number") this.bossHP = state.bossHP;
      if (typeof state.bossMaxHP === "number") this.bossMaxHP = state.bossMaxHP;
      if (state.lessonTitle) this.lessonTitle = state.lessonTitle;
      const idx = ((state.lessonNum || 1) - 1) % BOSS_ARCHETYPES.length;
      this.bossInfo = BOSS_ARCHETYPES[idx];
    },

    triggerHeroAttack(damage, isCrit = false) {
      this.heroLunge = 18;
      this.projectiles.push({
        x: 290,
        y: 265,
        tx: 760,
        ty: 250,
        progress: 0,
        color: isCrit ? "#fde047" : "#38bdf8",
        isCrit,
        onImpact: () => {
          this.bossHitFlash = 14;
          this.shakeFrames = isCrit ? 16 : 9;
          if (isCrit) SFX.critStrike();
          else SFX.swordSlash();
          VFX.burst(window.innerWidth * 0.65, window.innerHeight * 0.28, isCrit ? "#fde047" : "#38bdf8", isCrit ? 34 : 22);
          VFX.floatText(isCrit ? `⚡ CRIT -${damage} HP!` : `⚔️ -${damage} HP`, isCrit ? "#fde047" : "#38bdf8", window.innerWidth * 0.65, window.innerHeight * 0.26);
        }
      });
    },

    triggerBossAttack(damage, blocked = false) {
      this.bossLunge = 18;
      this.projectiles.push({
        x: 750,
        y: 250,
        tx: 280,
        ty: 265,
        progress: 0,
        color: "#f43f5e",
        isCrit: false,
        onImpact: () => {
          if (blocked) {
            SFX.shieldBlock();
            VFX.floatText("🛡️ SHIELD BLOCKED!", "#38bdf8", window.innerWidth * 0.32, window.innerHeight * 0.26);
          } else {
            this.heroHitFlash = 14;
            this.shakeFrames = 12;
            SFX.damageHit();
            VFX.floatText(`💥 -${damage} HP`, "#f43f5e", window.innerWidth * 0.32, window.innerHeight * 0.26);
          }
        }
      });
    },

    stop() {
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
    },

    draw() {
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;
      ctx.save();

      if (this.shakeFrames > 0) {
        this.shakeFrames -= 1;
        ctx.translate((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 10);
      }

      if (this.bgLoaded && this.bgImg) {
        ctx.drawImage(this.bgImg, 0, 0, w, h);
      } else {
        ctx.fillStyle = "#090f24";
        ctx.fillRect(0, 0, w, h);
      }

      // Darken top & bottom slightly for HUD contrast
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "rgba(2,6,23,0.65)");
      grad.addColorStop(0.5, "rgba(2,6,23,0.12)");
      grad.addColorStop(1, "rgba(2,6,23,0.72)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Update lunge & flash timers
      if (this.heroLunge > 0) this.heroLunge -= 1.5;
      if (this.bossLunge > 0) this.bossLunge -= 1.5;
      if (this.bossHitFlash > 0) this.bossHitFlash -= 1;
      if (this.heroHitFlash > 0) this.heroHitFlash -= 1;

      const heroX = 255 + this.heroLunge * 2.5;
      const heroY = 285 + Math.sin(this.tick * 0.08) * 5;

      const bossX = 785 - this.bossLunge * 2.5;
      const bossY = 265 + Math.cos(this.tick * 0.07) * 7;

      // 1. Draw HERO Character on Left Azure Magic Circle
      ctx.save();
      // Magic circle glow pulse
      ctx.beginPath();
      ctx.ellipse(255, 348, 88 + Math.sin(this.tick * 0.06) * 5, 28, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(56, 189, 248, 0.22)";
      ctx.fill();

      // Shield dome if active
      if (this.heroShield) {
        ctx.beginPath();
        ctx.arc(heroX, heroY - 10, 66, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(56, 189, 248, 0.18)";
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#38bdf8";
        ctx.stroke();
      }

      // Hero Sprite Medallion Body
      ctx.beginPath();
      ctx.arc(heroX, heroY - 12, 46, 0, Math.PI * 2);
      ctx.fillStyle = this.heroHitFlash > 0 ? "#f43f5e" : "#1d4ed8";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#fde047";
      ctx.stroke();

      ctx.font = "46px 'Segoe UI Emoji', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🧙‍♂️", heroX, heroY - 12);

      // Hero Floating Weapon
      ctx.font = "30px 'Segoe UI Emoji', sans-serif";
      ctx.fillText("⚔️", heroX + 48, heroY - 22 + Math.sin(this.tick * 0.14) * 4);
      ctx.restore();

      // 2. Draw BOSS Character on Right Crimson Magic Circle
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(785, 348, 102 + Math.cos(this.tick * 0.06) * 6, 32, 0, 0, Math.PI * 2);
      ctx.fillStyle = this.bossInfo.aura;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(bossX, bossY - 18, 58, 0, Math.PI * 2);
      ctx.fillStyle = this.bossHitFlash > 0 ? "#ffffff" : "#3b0764";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = this.bossInfo.color;
      ctx.stroke();

      ctx.font = "58px 'Segoe UI Emoji', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(this.bossInfo.icon, bossX, bossY - 18);
      ctx.restore();

      // 3. Draw Projectiles
      for (let i = this.projectiles.length - 1; i >= 0; i--) {
        const p = this.projectiles[i];
        p.progress += 0.085;
        if (p.progress >= 1) {
          if (p.onImpact) p.onImpact();
          this.projectiles.splice(i, 1);
          continue;
        }
        const px = p.x + (p.tx - p.x) * p.progress;
        const py = p.y + (p.ty - p.y) * p.progress - Math.sin(p.progress * Math.PI) * 45;
        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, p.isCrit ? 16 : 11, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.restore();
      }

      // 4. Draw Top Battle HUD Bars inside Canvas
      this.drawHealthBar(ctx, 40, 28, 340, 24, this.heroHP, this.heroMaxHP, "#10b981", `🧙‍♂️ CHEVALIER DE LUMIÈRE${this.heroShield ? ' (🛡️ SHIELDED)' : ''}`);
      this.drawHealthBar(ctx, w - 380, 28, 340, 24, this.bossHP, this.bossMaxHP, "#f43f5e", `${this.bossInfo.icon} ${this.bossInfo.name.toUpperCase()}`);

      // Center VS Banner
      ctx.save();
      ctx.fillStyle = "rgba(6, 10, 25, 0.85)";
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(w / 2 - 125, 22, 250, 34, 99);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#fde047";
      ctx.font = "900 12px 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(this.lessonTitle.slice(0, 32).toUpperCase(), w / 2, 39);
      ctx.restore();

      ctx.restore();
    },

    drawHealthBar(ctx, x, y, w, h, hp, maxHp, color, label) {
      const pct = Math.max(0, Math.min(1, hp / Math.max(1, maxHp)));
      ctx.save();
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 12px 'Segoe UI', sans-serif";
      ctx.fillText(label, x, y - 7);

      ctx.fillStyle = "rgba(2, 6, 23, 0.88)";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 99);
      ctx.fill();
      ctx.stroke();

      if (pct > 0) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(x + 2, y + 2, (w - 4) * pct, h - 4, 99);
        ctx.fill();
      }

      ctx.fillStyle = "#ffffff";
      ctx.font = "900 11.5px 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${hp} / ${maxHp} HP`, x + w / 2, y + h / 2);
      ctx.restore();
    }
  };
  window.RPG_BATTLE_STAGE = BATTLE_STAGE;
})();
