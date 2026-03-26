// Donezo Service Worker — Push Notifications + PWA caching
'use strict';

const CACHE_NAME = 'donezo-v1';
const OFFLINE_URL = '/';

// Assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// ─── Install ──────────────────────────────────────────────────────────────────

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        Promise.all(
          PRECACHE_ASSETS.map((url) =>
            cache.add(url).catch(() => console.warn('[SW] Precache skipped (not found):', url)),
          ),
        ),
      ),
  );
  self.skipWaiting();
});

// ─── Activate ─────────────────────────────────────────────────────────────────

self.addEventListener('activate', (event) => {
  // Remove old caches
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

// ─── Fetch — Network-first with cache fallback ────────────────────────────────

self.addEventListener('fetch', (event) => {
  // Only handle same-origin GET requests; skip API, Vite HMR, etc.
  if (
    event.request.method !== 'GET' ||
    !event.request.url.startsWith(self.location.origin) ||
    event.request.url.includes('/api/') ||
    event.request.url.includes('hot') // Vite HMR
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses for static assets
        if (response.ok) {
          const url = new URL(event.request.url);
          const isStaticAsset =
            url.pathname.startsWith('/build/') ||
            url.pathname.startsWith('/icons/') ||
            url.pathname === '/manifest.webmanifest';

          if (isStaticAsset) {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
          }
        }
        return response;
      })
      .catch(() =>
        // Offline fallback: serve from cache, or the root page
        caches.match(event.request).then((cached) => cached || caches.match(OFFLINE_URL)),
      ),
  );
});

// ─── Push Notifications ───────────────────────────────────────────────────────

self.addEventListener('push', (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = {
      title: 'Donezo',
      body: event.data.text(),
    };
  }

  const options = {
    body: payload.body || 'You have a notification.',
    icon: payload.icon || '/icons/icon-192x192.png',
    badge: payload.badge || '/icons/icon-72x72.png',
    data: payload.data || {},
    vibrate: [100, 50, 100],
    actions: [
      {
        action: 'open',
        title: 'Open',
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(payload.title || 'Donezo', options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing window if available
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      // Open new window
      return self.clients.openWindow(url);
    }),
  );
});
