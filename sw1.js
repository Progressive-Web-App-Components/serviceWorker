var version = '2';

// for github
var CacheArray = [
  'https://progressive-web-app-components.github.io/serviceWorker/offline.html',
  'https://progressive-web-app-components.github.io/serviceWorker/offline.css',
  'https://progressive-web-app-components.github.io/serviceWorker/offline.js',
  'https://progressive-web-app-components.github.io/serviceWorker/style.css',
];
var offlineHtml = 'https://progressive-web-app-components.github.io/serviceWorker/offline.html';

// // for local
// var CacheArray = [
//   './offline.html',
//   './offline.css',
//   './offline.js',
//   './style.css',
// ];
// var offlineHtml = './offline.html';


self.addEventListener('install', function(event) {
  console.log('SW installed ', version , ' -> ', new Date().toLocaleString());
  self.skipWaiting();
  event.waitUntil(
    caches.open(version)
    .then(function(cache) {
      return cache.addAll(CacheArray);
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

// Cache first
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
    .then(function(res) {
      if(res) {
        return res;
      }

      if(!navigator.onLine) {
        return caches.match(new Request(offlineHtml));
      }
      // The below line is buggy. The fetch header needs to be cleared after a request is done.
      //
      return fetch(event.request);
    }));
});
