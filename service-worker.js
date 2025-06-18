const CACHE_NAME = "merceria-cache-v3";
const urlsToCache = [
  "/",
  "/index.html",
  "/offline.html",
  "/js/main.js",
  "/css/style.css",
  "/manifest.json",
  "/images/icon-96x96.png",
  "/images/icon-192x192.png",
  "/images/icon-512x512.png",
  "/splash.html"
];

// Instalación: Precarga de recursos
self.addEventListener("install", event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      for (const url of urlsToCache) {
        try {
          await cache.add(url);
        } catch (err) {
          console.warn(`No se pudo cachear ${url}:`, err);
        }
      }
      await self.skipWaiting();
    })()
  );
});

// Activación: Limpia caches antiguos
self.addEventListener("activate", event => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
      await self.clients.claim();
    })()
  );
});

// Fetch: Red, caché o fallback
self.addEventListener("fetch", event => {
  event.respondWith(
    (async () => {
      const req = event.request;

      // Navegaciones (documentos HTML)
      const isHtmlRequest = req.mode === "navigate" ||
        (req.method === "GET" &&
         req.headers.get("accept")?.includes("text/html"));

      if (isHtmlRequest) {
        try {
          const networkResponse = await fetch(req);
          return networkResponse;
        } catch (error) {
          return caches.match("/offline.html");
        }
      }

      // Otros recursos (CSS, JS, imágenes, etc.)
      const cachedResponse = await caches.match(req);
      if (cachedResponse) return cachedResponse;

      try {
        const networkResponse = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, networkResponse.clone());
        return networkResponse;
      } catch {
        // Fallback solo si es un documento
        if (req.destination === "document") {
          return caches.match("/offline.html");
        }

        return new Response("Recurso no disponible sin conexión", {
          status: 503,
          statusText: "Service Unavailable",
          headers: { "Content-Type": "text/plain" }
        });
      }
    })()
  );
});
