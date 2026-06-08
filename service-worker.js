/* Service Worker — PWA instalace + lehká offline záloha.
   Strategie: NETWORK-FIRST (na stavbě chceš vždy čerstvý index a výkresy;
   cache slouží jen jako offline fallback). Při změně appky zvyš CACHE_VERSION. */
var CACHE_VERSION = 'brezany-v1';

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k){ return k !== CACHE_VERSION; })
                            .map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  // Jen stejný origin (Firebase/Mapy.cz/CDN nechej projít přímo na síť).
  if (new URL(req.url).origin !== self.location.origin) return;

  e.respondWith(
    fetch(req).then(function(res) {
      if (res && res.status === 200 && res.type === 'basic') {
        var copy = res.clone();
        caches.open(CACHE_VERSION).then(function(c){ c.put(req, copy); });
      }
      return res;
    }).catch(function() {
      return caches.match(req);
    })
  );
});
