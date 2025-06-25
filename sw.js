const CACHE_NAME = 'flappymusha-cache-v1';
const ASSETS_TO_CACHE = [
 const ASSETS_TO_CACHE = [
  const ASSETS_TO_CACHE = [
  '/',
  'index.html',
  'game.index.html',
  'game-style.css',
  'script.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
