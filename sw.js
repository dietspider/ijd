'use strict';

self.importScripts('https://amdouglas.com/assets/js/serviceworker-cache-polyfill.js');

const CACHE_VERSION = 16;
const CURRENT_CACHES = {
  prefetch: 'amdgls-v' + CACHE_VERSION
};

self.addEventListener('install', function(event) {
  const urlsToPrefetch = [
    '/',
    '/assets/css/main.css',
    '/assets/js/main.js',
    '/assets/js/search.js',
    '/assets/js/contact.js',
    '/assets/js/toad.js',
    '/assets/js/serviceworker-cache-polyfill.js',
    '/favicon.ico',
    '/manifest.json'
  ];
  self.skipWaiting();
  event.waitUntil(
    caches.open(CURRENT_CACHES.prefetch).then(function (cache) {
      return cache.addAll(urlsToPrefetch);
    })
  );
});

self.addEventListener('activate', function(event) {
  const expectedCacheNames = Object.keys(CURRENT_CACHES).map(function (key) {
    return CURRENT_CACHES[key];
  });
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (expectedCacheNames.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        return response || fetch(event.request);
      })
  );
});
