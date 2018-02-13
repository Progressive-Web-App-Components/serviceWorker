var version = '7';
// for github
var path = "serviceWorkerSpike/";
// for local
// var path = "./";

self.addEventListener('install', function(event) {
  console.log('SW installed ', version , ' -> ', new Date().toLocaleString());
  self.skipWaiting();
  event.waitUntil(
    caches.open(version)
    .then(function(cache) {
      return cache.addAll([
        path + 'offline.html',
        path + 'offline.css',
        path + 'offline.js',
        path + 'style.css'
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
    .then(function(res) {
      if(res) {
        return res;
      }

      if(!navigator.onLine) {
        return caches.match(new Request(path + 'offline.html'));
      }
      // The below line is buggy. The fetch header needs to be cleared after a request is done.
      return fetch(event.request);
    }));
});
