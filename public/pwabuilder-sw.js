const CACHE = 'pwabuilder-precache-1.2';

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

workbox.routing.registerRoute(
  /^\//,
  new workbox.strategies.NetworkFirst({
    cacheName: CACHE
  })
);
