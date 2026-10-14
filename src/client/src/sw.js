/* eslint-disable no-restricted-globals */
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
import { registerRoute } from 'workbox-routing';

cleanupOutdatedCaches();
clientsClaim();

// Precache hashed JS/CSS (index.html is excluded in vite injectManifest config).
precacheAndRoute(self.__WB_MANIFEST || []);

const HTML_NAV_CACHE = 'html-navigations';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.delete(HTML_NAV_CACHE).catch(() => undefined)
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      await caches.delete(HTML_NAV_CACHE);
      await self.clients.claim();
    })()
  );
});

const fetchIndexShell = async (request) => {
  const indexUrl = new URL('/index.html', request.url).href;

  try {
    const response = await fetch(indexUrl, { cache: 'no-store' });
    if (response.ok) {
      const cache = await caches.open(HTML_NAV_CACHE);
      await cache.put(indexUrl, response.clone());
      return response;
    }
  } catch {
    // Offline or network error — fall back to last cached shell below.
  }

  const cache = await caches.open(HTML_NAV_CACHE);
  return cache.match(indexUrl);
};

// Always fetch navigations from the network when online so deploys never pin old asset hashes.
registerRoute(
  ({ request }) => request.mode === 'navigate',
  async ({ request, url }) => {
    const indexUrl = new URL('/index.html', url).href;

    try {
      const response = await fetch(request, { cache: 'no-store' });
      if (response?.ok) {
        const cache = await caches.open(HTML_NAV_CACHE);
        await cache.put(indexUrl, response.clone());
        return response;
      }
    } catch {
      // Offline — fall through to cached shell.
    }

    const cache = await caches.open(HTML_NAV_CACHE);
    const cached = await cache.match(indexUrl);
    if (cached) {
      return cached;
    }

    const shell = await fetchIndexShell(request);
    if (shell?.ok) {
      return shell;
    }

    return Response.error();
  }
);

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data?.text?.() };
  }

  const title = data.title || 'Me vs Yall';
  const body = data.body || 'Upcoming games need your picks';
  const url = data.url || '/';
  const icon = data.icon || '/favicon.png';
  const badge = data.badge || '/favicon.png';
  const tag = data.tag || 'pick-reminders';
  const actions = Array.isArray(data.actions) ? data.actions : [];
  const renotify = Boolean(data.renotify);

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      badge,
      tag,
      renotify,
      actions,
      data: { url },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const url = event.notification?.data?.url || '/';

  event.waitUntil(
    (async () => {
      const windowClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of windowClients) {
        if ('focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })()
  );
});
