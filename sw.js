// L'Odyssée Française v24.0 — Offline-First Tablet & PC Service Worker
const CACHE_NAME = "odyssee-francaise-v24.0";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./styles.css",
  "./v12.css",
  "./sound_lab.css",
  "./chemin.css",
  "./course_data.js",
  "./card_align.js",
  "./data_fixes.js",
  "./native_worlds.js",
  "./academie_worlds.js",
  "./gym_data.js",
  "./gym_extra.js",
  "./native_gym.js",
  "./tutor_lessons.js",
  "./tutor.js",
  "./sound_lab_data.js",
  "./sound_lab.js",
  "./paris_c2_systems.js",
  "./radio_data.js",
  "./aaa_combat.js",
  "./exams_data.js",
  "./missions_data.js",
  "./app.js",
  "./chemin.js",
  "./assets/odyssee_icon.png",
  "./assets/tutor_camille.jpg",
  "./assets/pixel_voie_royale.png",
  "./assets/pixel_quatuor.png",
  "./assets/pixel_pantheon.png",
  "./assets/pixel_plume.png",
  "./assets/pixel_balance.png",
  "./assets/pixel_masque.png"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(CORE_ASSETS.map((url) => cache.add(url)))
    )
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : Promise.resolve()))
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

  // For HTML/JS/CSS app shell: Network-first with offline cache fallback so Antigravity updates propagate immediately
  const isCode = /\.(html|js|css|webmanifest)$/i.test(url.pathname) || url.pathname.endsWith("/");
  if (isCode && url.origin === self.location.origin) {
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

  // For images/icons/audio assets: Cache-first with network fallback
  if (url.origin === self.location.origin) {
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
  }
});
