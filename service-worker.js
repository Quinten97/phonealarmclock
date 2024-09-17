const CACHE_NAME = "my-pwa-cache-v1";
const urlsToCache = ["/", "/app.js"]; // Removed "/index.html" and "/styles.css"

// Install the service worker and cache files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache); // Only caching necessary files
    })
  );
});

// Fetch files from cache when offline
self.addEventListener("fetch", (event) => {
  // Always bypass cache and fetch the latest index.html from the network
  if (event.request.url.endsWith("index.html")) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Bypass cache for CSS files as well
  if (event.request.url.endsWith(".css")) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Fetch from cache if available, else fallback to network
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
