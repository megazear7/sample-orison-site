var appCacheName = 'app-cache-v2';
var offlinePage = '/offline.html';
var offlineFragment = '/offline.fragment.html';

var preCacheFiles = [
  offlinePage,
  offlineFragment,
  '/',
  '/index.fragment.html',
  '/about',
  '/about/index.fragment.html',
  '/blog',
  '/blog/index.fragment.html',
];

self.addEventListener('install', function(e) {
  self.skipWaiting();
  console.debug('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(appCacheName).then(function(cache) {
      console.debug('[ServiceWorker] Caching');
      return cache.addAll(preCacheFiles);
    })
  );
});

self.addEventListener('fetch', function(e) {
  console.debug('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    caches.open(appCacheName).then(function(cache) {
      return cache.match(e.request)
      .then(function(cachedResponse) {
        let networkResponse = fetch(e.request)
        .then(function(response){
          console.debug('[ServiceWorker] Updating cache', e.request.url);
          cache.put(e.request.url, response.clone());
          return response;
        })
        .catch(function() {
          console.debug('[ServiceWorker] Using offline page from cache');
          if (e.request.url.includes('.fragment')) {
            return cache.match(offlineFragment);
          } else {
            return cache.match(offlinePage);
          }
        });

        if (cachedResponse) {
          console.debug('[ServiceWorker] Using cached response');
          return cachedResponse;
        } else {
          console.debug('[ServiceWorker] Using network response');
          return networkResponse;
        }
      });
    })
  );
});
