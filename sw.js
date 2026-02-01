const CACHE = "nziyo-dzekereke-1.0.0";

const CORE = [
  "./",
  "./index_final.html",
  "./manifest.webmanifest",
  "./icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(cached =>
      cached || fetch(event.request).then(resp => {
        if (resp.ok && resp.type === "basic") {
          caches.open(CACHE).then(c => c.put(event.request, resp.clone()));
        }
        return resp;
      }).catch(() => cached)
    )
  );
});
