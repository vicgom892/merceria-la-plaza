const CACHE_NAME = 'mercera-la-plaza-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './offline.html',
  './hilos.html',
  './estampados.html',
  './splash.html',
  './css/style.css',
  './css/styles.css',
  './js/main.js',
  './manifest.json',
  './images/ahuja.webp',
  './images/banner-fondo.jpeg',
  './images/banner-liso.jpeg',
  './images/banner-sin-fondo.png',
  './images/banner.jpeg',
  './images/bobina-de-hilo.webp',
  './images/botones-hilo.webp',
  './images/botones.webp',
  './images/buso.webp',
  './images/fila-de-hilos.webp',
  './images/hilo.webp',
  './images/icon-512x512.png',
  './images/icon-192x192.png',
  './images/lana.webp',
  './images/logo-buscador-modified.png',
  './images/logo-buscador.jpeg',
  './images/logo-merceria-modified.png',
  './images/logo-merceria.jpeg',
  './images/maquina-de-coser.webp',
  './images/mochila.webp',
  './images/remera.webp',
  './images/taza.webp',
  './images/tijera-hilos.webp',
  './images/tijera.webp'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cacheResponse => {
        return cacheResponse || fetch(event.request).then(networkResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      }).catch(() => {
        // fallback offline
        return caches.match('./offline.html').then(fallback => {
          if (fallback) return fallback;
          return new Response('<h1>Estás sin conexión</h1><p>No se pudo cargar la página.</p>', {
            headers: { 'Content-Type': 'text/html' }
          });
        });
      })
  );
});
