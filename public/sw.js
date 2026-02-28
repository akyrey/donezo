// Donezo Service Worker for Push Notifications
'use strict';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

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
        icon: payload.icon || '/images/icon-192.png',
        badge: payload.badge || '/images/badge-72.png',
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

    event.waitUntil(
        self.registration.showNotification(payload.title || 'Donezo', options),
    );
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
