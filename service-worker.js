// Install the service worker without caching anything
self.addEventListener("install", (event) => {
  console.log("Service worker installed, but not caching any files.");
  // Force the waiting service worker to become active immediately
  self.skipWaiting();
});

// Activate the service worker and take control of all pages immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    clients.claim() // Take control of all clients (pages) immediately
  );
});

// Intercept fetch requests and always bypass cache
self.addEventListener("fetch", (event) => {
  // Always fetch from the network, never use cache
  event.respondWith(fetch(event.request));
});

// Optional: Handle orientation lock
if (screen.orientation && screen.orientation.lock) {
  screen.orientation.lock("landscape").catch(function (error) {
    console.error("Orientation lock failed: ", error);
  });
}
