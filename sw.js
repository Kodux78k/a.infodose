// HUB UNO — sw.js (cache-first for core)
const CACHE = "uno-core-v1";

const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./config/apps.json",
  "./config/archetypes.json"
];

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    try { await cache.addAll(CORE); } catch {}
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k === CACHE) ? null : caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("message", (e) => {
  if (!e.data) return;
  if (e.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET") return;
  if (url.origin === location.origin) {
    e.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(req);
      if (cached) return cached;
      try {
        const res = await fetch(req);
        // only cache basic opaque/success
        if (res && res.ok && (res.type === "basic" || res.type === "opaque")) {
          cache.put(req, res.clone());
        }
        return res;
      } catch {
        return cached || new Response("offline", {status: 503});
      }
    })());
  }
});
