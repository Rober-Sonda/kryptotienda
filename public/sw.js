// Service Worker "Killer" - Remueve el SW antiguo para evitar problemas en desarrollo
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.registration.unregister().then(() => {
      return self.clients.claim();
    })
  );
});
