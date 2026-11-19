// L'Odyssée Française v28.0 — Instant <80ms Tablet Startup & Offline TTS Service Worker
const CACHE_NAME = "odyssee-shell-v28.0";
const DATA_CACHE = "odyssee-data-v28.0";
const TTS_CACHE = "odyssee-tts-v1";
const MAX_TTS_ENTRIES = 400;

const HEAVY_DATA_FILES = [
  "course_data.js",
  "tutor_lessons.js",
  "gym_data.js",
  "gym_extra.js",
  "exams_data.js",
  "missions_data.js",
  "chroniques_data.js",
  "visual_scenes.js",
  "essec_c2_pack.js",
  "paris_c2_systems.js",
  "academie_worlds.js",
  "native_worlds.js",
  "sound_lab_data.js",
  "radio_data.js",
  "card_align.js",
  "data_fixes.js"
];

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./styles.css",
  "./v12.css",
  "./sound_lab.css",
  "./chemin.css",
  "./app.js",
  "./essec_c2_pack.js",
  "./chemin.js",
  "./tutor.js",
  "./sound_lab.js",
  "./native_gym.js",
  "./aaa_combat.js",
  "./assets/odyssee_icon.png",
  "./assets/tutor_camille.jpg",
  "./assets/bg_title.jpg",
  "./assets/bg_paris_seine_map.jpg",
  "./assets/pixel_voie_royale.png",
  "./assets/pixel_quatuor.png",
  "./assets/pixel_pantheon.png",
  "./assets/pixel_plume.png",
  "./assets/pixel_balance.png",
  "./assets/pixel_masque.png"
];

function isHeavyDataPath(pathname) {
  return HEAVY_DATA_FILES.some((f) => pathname.endsWith("/" + f) || pathname === f);
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(CORE_ASSETS.map((url) => cache.add(url)))
    )
  );
});

self.addEventListener("activate", (event) => {
  const keep = new Set([CACHE_NAME, DATA_CACHE, TTS_CACHE]);
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((k) => (!keep.has(k) ? caches.delete(k) : Promise.resolve()))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Never cache live Cloud Sync or local API status/save endpoints
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.endsWith("/save_data.js") ||
    url.hostname.includes("ntfy.sh") ||
    url.hostname.includes("api.github.com")
  ) {
    return;
  }

  // Offline French Neural TTS Cache (Cache-First for repeated phrases in classrooms)
  if (url.hostname.includes("translate.googleapis.com") && url.pathname.includes("translate_tts")) {
    event.respondWith(
      caches.open(TTS_CACHE).then((cache) =>
        cache.match(req).then((cached) => {
          if (cached) return cached;
          return fetch(req).then((res) => {
            if (res && (res.ok || res.type === "opaque")) {
              const copy = res.clone();
              cache.put(req, copy).then(() => {
                cache.keys().then((ks) => {
                  if (ks.length > MAX_TTS_ENTRIES) cache.delete(ks[0]);
                }).catch(() => {});
              }).catch(() => {});
            }
            return res;
          });
        })
      )
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  // Heavy Static Course Data Bundles (28.5 MB course_data.js etc.): CACHE-FIRST (<80ms startup, 0 MB 5G re-download!)
  if (isHeavyDataPath(url.pathname)) {
    event.respondWith(
      caches.open(DATA_CACHE).then((cache) =>
        cache.match(req).then((cached) => {
          if (cached) return cached;
          return fetch(req).then((res) => {
            if (res && res.ok) {
              cache.put(req, res.clone()).catch(() => {});
            }
            return res;
          }).catch(() => cache.match(req, { ignoreSearch: true }));
        })
      )
    );
    return;
  }

  // Lightweight App Shell & Engine (index.html, chemin.js, chemin.css, app.js): Network-First so Antigravity updates appear immediately
  const isCode = /\.(html|js|css|webmanifest)$/i.test(url.pathname) || url.pathname.endsWith("/");
  if (isCode) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match(req, { ignoreSearch: true }))
    );
    return;
  }

  // Images / Pixel Art / Portraits: Cache-First with network fallback
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      });
    })
  );
});
