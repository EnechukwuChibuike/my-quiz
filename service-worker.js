const CACHE_NAME = "pwa-api-cache-v1";
const urlsToCache = [
  "/", // Add your app's static assets here
  "/index.html",
  "/styles.css",
  "/app.js",
];

// Install Event: Cache Static Files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch Event: Cache API Responses
self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // Check if the request is for the API
  if (
    url.includes(
      "https://opentdb.com/api.php?amount=50&category=9&difficulty=medium&type=multiple"
    )
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        fetch(event.request)
          .then((response) => {
            // Clone and store the response in the cache
            const clonedResponse = response.clone();
            cache.put(event.request, clonedResponse);
            return response;
          })
          .catch(() => {
            // Return cached API data when offline
            return caches.match(event.request);
          })
      )
    );
  } else {
    // Handle other requests (e.g., static files)
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
