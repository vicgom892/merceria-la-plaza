const CACHE_NAME = "merceria-cache-v6";
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

// Límite opcional de objetos en caché
const MAX_CACHE_ITEMS = 50;

async function cleanCache(cache) {
  const keys = await cache.keys();
  if (keys.length > MAX_CACHE_ITEMS) {
    await cache.delete(keys[0]); // elimina el más antiguo
  }
}

// Instalación: precarga de recursos
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(urlsToCache).catch(err => {
        console.warn("❌ Error en cache.addAll", err);
      })
    )
  );
});

// Activación: limpiar versiones anteriores
self.addEventListener("activate", event => {
  self.clients.claim();
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
});

// Fetch: red primero, luego caché, fallback offline
self.addEventListener("fetch", event => {
  const req = event.request;

  event.respondWith(
    (async () => {
      // HTML navigation
      if (
        req.mode === "navigate" ||
        (req.method === "GET" &&
          req.headers.get("accept")?.includes("text/html"))
      ) {
        try {
          const netRes = await fetch(req);
          return netRes;
        } catch {
          const fallback = await caches.match("./offline.html");
          if (fallback) return fallback;

          // fallback alternativo si no se encuentra offline.html
          return new Response(
            `<h1>Estás sin conexión</h1><p>No se pudo cargar esta página.</p>`,
            {
              headers: { "Content-Type": "text/html" }
            }
          );
        }
      }

      // Otros archivos estáticos
      const cached = await caches.match(req);
      if (cached) return cached;

      try {
        const netRes = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, netRes.clone());
        cleanCache(cache); // control de tamaño
        return netRes;
      } catch {
        return new Response("⚠️ Recurso no disponible sin conexión", {
          status: 503,
          statusText: "Service Unavailable",
          headers: { "Content-Type": "text/plain" }
        });
      }
    })()
  );
});
