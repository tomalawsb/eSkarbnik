const CACHE_NAME = "eskarbnik-v1-6-3-etap4-clean-ui";
const APP_SHELL = [
  "./",
  "./index.html",
  "./index.html?v=1.6.3-etap4-clean-ui",
  "./reload-cache.html",
  "./version.json",
  "./style.css",
  "./db.js",
  "./app.js",
  "./db.js?v=1.6.3-etap4-clean-ui",
  "./app.js?v=1.6.3-etap4-clean-ui",
  "./manifest.json",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/maskable-icon-192.png",
  "./assets/icons/maskable-icon-512.png",
  "./assets/logo-eskarbnik-icon.png",
  "./assets/logo-eskarbnik-full.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames
        .filter((cacheName) => cacheName !== CACHE_NAME)
        .map((cacheName) => caches.delete(cacheName)),
    )),
  );
  self.clients.claim();
});

function shouldUseNetworkFirst(request, url) {
  if (request.mode === "navigate") return true;
  if (["document", "script", "style", "manifest"].includes(request.destination)) return true;
  return ["/", "/index.html", "/reload-cache.html", "/version.json", "/manifest.json"].some((suffix) => url.pathname.endsWith(suffix));
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (shouldUseNetworkFirst(request, url)) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          return networkResponse;
        })
        .catch(() => caches.match(request).then((cachedResponse) => cachedResponse || caches.match("./index.html"))),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(request)
        .then((networkResponse) => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          return networkResponse;
        })
        .catch(() => caches.match("./index.html"));
    }),
  );
});
