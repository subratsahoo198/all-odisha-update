const CACHE_NAME = 'odisha-update-cache-v7';
const ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap'
];

// Install Event
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell assets');
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache storage');
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event (Cache First with Network Fallback)
self.addEventListener('fetch', (e) => {
  // Only intercept HTTP/HTTPS requests (ignores chrome-extension schemas etc.)
  if (!(e.request.url.indexOf('http') === 0)) return;

  // Skip API caching to ensure real-time news retrieval
  if (e.request.url.includes('/api/')) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request).then((networkResponse) => {
        // Cache newly requested resources if they are static files
        if (
          e.request.method === 'GET' && 
          (networkResponse.url.includes('.png') || 
           networkResponse.url.includes('.jpg') || 
           networkResponse.url.includes('.css') || 
           networkResponse.url.includes('.js') ||
           networkResponse.url.includes('fonts.'))
        ) {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, networkResponse.clone());
            return networkResponse;
          });
        }
        return networkResponse;
      });
    }).catch(() => {
      // Offline fallback can be defined here if necessary
    })
  );
});
