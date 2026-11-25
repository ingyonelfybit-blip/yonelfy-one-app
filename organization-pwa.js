/* global self, caches, Response, URL */
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const scope = new URL(self.registration.scope);
  const path = url.pathname.slice(scope.pathname.length);
  if (event.request.method !== 'GET' || url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)
    || !/^installation\/[0-9a-f-]{36}\/(manifest\.webmanifest|icon-(192|512|maskable)\.png)$/i.test(path)) return;
  event.respondWith(caches.open('yonelfy-installation-v1').then(async (cache) =>
    await cache.match(event.request, { ignoreSearch: true }) ?? new Response(null, { status: 404 })));
});
