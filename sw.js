const CACHE = "rewear-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./home.html",
  "./donar.html",
  "./solicitar.html",
  "./impacto.html",
  "./organizaciones.html",
  "./empresas.html",
  "./perfil.html",
  "./404.html",
  "./manifest.json",
  "./assets/css/tokens.css",
  "./assets/css/app.css",
  "./assets/js/app.js",
  "./assets/img/logo.svg",
  "./assets/img/favicon.svg",
  "./assets/img/icon-192.png",
  "./assets/img/icon-512.png",
  "./assets/img/texture.png",
  "./assets/img/photo-prendas.png",
  "./assets/img/photo-comunidad.png",
  "./assets/img/photo-voluntariado.png",
  "./design/index.html",
  "./design/moodboard.html",
  "./design/style-guide.html",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetched = fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          if (response.ok) {
            caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached || caches.match("./index.html"));
      return cached || fetched;
    })
  );
});
