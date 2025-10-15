const CACHE = 'uno-pro-pwa-v1';
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
  // Adicione aqui assets críticos para precache (ex. archetypes, apps.json, libs, etc.)
  // './archetypes/atlas.html',
  // './apps/apps.json',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k!==CACHE && caches.delete(k)))));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(e.request).then(res => res || fetch(e.request).then(rsp => {
        const copy = rsp.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return rsp;
      }).catch(_ => caches.match('./index.html')))
    );
  }
});
