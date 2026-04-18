// Service Worker (PWA Enabler) para Krypton Tienda
const CACHE_NAME = 'krypton-pwa-v5';

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Fuerza la activación inmediata del SW
});

self.addEventListener('activate', (event) => {
  // Limpia cualquier cache viejo que pudiera tener guardado un index.html roto
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Passthrough puro: Bypass the cache entirely to always fetch fresh network version
  // We use timestamp to bust the network cache if needed, but normally just fetch.
  event.respondWith(
    fetch(event.request).catch(() => {
      // Return offline fallback if network fails
      return caches.match(event.request);
    })
  );
});
