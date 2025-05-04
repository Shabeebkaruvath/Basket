// src/sw.js
const CACHE_NAME = 'basket-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/192x192.png',
  '/icons/512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});