var version = '1';

self.addEventListener('install', function(event) {
  console.log('SW installed ', version , ' -> ', new Date().toLocaleString());
  self.skipWaiting();
  event.waitUntil(
    caches.open(version)
    .then(function(cache) {
      return cache.addAll([
        '/offline.html',
        '/offline.css',
        '/offline.js',
        '/style.css'
        ]);
    }));
});

self.addEventListener('activate', function(event) {
  console.log('SW activated ', version, ' -> ', new Date().toLocaleString());
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) {
          return key !== version;
        }).map(function(key) {
          return caches.delete(key);
      }));
    }));
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
    .then(function(response) {
      if(response) {
        return response;
      }

      if(!navigator.onLine) {
        return caches.match(new Request('/offline.html'));
      }
      // The below line is buggy. The fetch header needs to be cleared after a request is done.
      return fetch(event.request);
    }));
});
