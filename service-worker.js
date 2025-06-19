const CACHE_NAME = "merceria-cache-v5";
const urlsToCache = [
  "./",
  "./index.html",
  "./offline.html",
  "./js/main.js",
  "./css/style.css",
  "./manifest.json",
  "./images/icon-96x96.png",
  "./images/icon-192x192.png",
  "./images/icon-512x512.png",
  "./splash.html",
  "./hilos.html",
  "./estampados.html"
];

// Instalación: precarga de recursos
self.addEventListener("install", event => {
  self.skipWaiting(); // Activar inmediatamente
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      for (const url of urlsToCache) {
        try {
          await cache.add(url);
        } catch (err) {
          console.warn(`❌ No se pudo cachear: ${url}`, err);
        }
      }
    })()
  );
});

// Activación: limpieza de cachés anteriores
self.addEventListener("activate", event => {
  self.clients.claim(); // Control inmediato de las pestañas
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })()
  );
});

// Fetch: red, caché o fallback
self.addEventListener("fetch", event => {
  const req = event.request;

  event.respondWith(
    (async () => {
      // Páginas HTML
      if (req.mode === "navigate" || (req.method === "GET" && req.headers.get("accept")?.includes("text/html"))) {
        try {
          const networkResponse = await fetch(req);
          return networkResponse;
        } catch (error) {
          console.warn("🔌 Sin conexión para:", req.url);
          return caches.match("./offline.html");
        }
      }

      // Recursos estáticos
      const cachedResponse = await caches.match(req);
      if (cachedResponse) return cachedResponse;

      try {
        const networkResponse = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, networkResponse.clone());
        return networkResponse;
      } catch (error) {
        console.warn("⚠️ Fallo en recurso estático:", req.url);
        return new Response("Recurso no disponible sin conexión", {
          status: 503,
          statusText: "Service Unavailable",
          headers: { "Content-Type": "text/plain" }
        });
      }
    })()
  );
});
