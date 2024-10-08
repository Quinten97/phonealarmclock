// app.js
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((err) => {
        console.error("Service Worker registration failed:", err);
      });
  });
}

let wakeLock = null;

const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request("screen");
    // Re-activate the lock if it gets released
    wakeLock.addEventListener("release", () => {});
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
};

requestWakeLock();

// Request the wake lock when the PWA is active
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    requestWakeLock();
  } else if (wakeLock !== null) {
    wakeLock.release();
    wakeLock = null;
  }
});
