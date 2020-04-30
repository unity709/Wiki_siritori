// Service Worker のバージョンとキャッシュする App Shell を定義する
const CACHE_NAME = 'Wiki-Shiritori-v1'
const urlsToCache = [
  './index.html',
  './siritori.js',
  './chat_UI.css',
  './jquery-3.4.1.min.js',
  './icons/human_icon.png',
  './icons/Wikipedia-logo-v2-ja.png',
  'https://kit.fontawesome.com/ede971a779.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
      caches.open(CACHE_NAME)
          .then(
          function(cache){
              return cache.addAll(urlsToCache);
          })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(
      function (response) {
          if (response) {
              return response;
          }
          return fetch(event.request);
      })
  );
});