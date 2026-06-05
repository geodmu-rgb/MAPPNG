// ХЭЭР·ГЕО service worker — офлайн дэмжлэг
const CACHE = 'kheer-geo-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
// stale-while-revalidate: CDN (Leaflet/фонт) болон газрын зургийн хавтанг ачаалсны дараа кэшилнэ
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const net = fetch(e.request).then(resp => {
        try { const copy = resp.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); } catch (_) {}
        return resp;
      }).catch(() => cached);
      return cached || net;
    })
  );
});
