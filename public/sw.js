const cacheName = 'hello-pwa';

const filesToCache = [
  '/',
  '/index.html',
  '/css/app.min.css',
  '/js/app.js',
  '/images/logo.png'
];

// Add assets to cache
function addCache() {
  return caches.open(cacheName)
    .then(cache => cache.addAll(filesToCache));
}

// Get assets from cache
function getCache(request) {
  return caches.open(cacheName).then(function (cache) {
    return cache.match(request)
      .then(response => response || Promise.reject('no-match'));
  });
}

// Update cache with most recent assets
function updateCache(request) {
  return caches.open(cacheName).then(function (cache) {
    return fetch(request)
      .then(response => cache.put(request, response));
  });
}

self.addEventListener('install', function(e) {
  e.waitUntil(addCache());
});

self.addEventListener('fetch', function(e) {
  e.respondWith(getCache(e.request));
  e.waitUntil(updateCache(e.request));
});