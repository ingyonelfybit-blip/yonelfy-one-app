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

const payrollId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function noticeRoute(notice) {
  if (typeof notice?.organization !== 'string' || !payrollId.test(notice.organization)) return;
  if (typeof notice.run === 'string' && payrollId.test(notice.run)) return `/payslips?run=${notice.run}`;
  if (typeof notice.reference !== 'string' || !payrollId.test(notice.reference)) return;
  if (notice.kind === 'attendance') return '/attendance/calendar?avisos=asistencia';
  if (notice.kind === 'payroll') return `/payroll/runs/${notice.reference}`;
  if (notice.kind === 'devices') return `/devices/${notice.reference}`;
}

self.addEventListener('push', (event) => {
  let notice;
  try { notice = event.data?.json(); } catch { return; }
  if (!noticeRoute(notice)) return;
  event.waitUntil(self.registration.showNotification('HL Presencia', {
    body: 'Tiene un nuevo aviso.',
    icon: new URL('icon-192.png', self.registration.scope).href,
    tag: notice.kind === 'attendance' ? `attendance-${notice.organization}` : `${notice.kind ?? 'payslip'}-${notice.reference ?? notice.run}`,
    data: { run: notice.run, kind: notice.kind, reference: notice.reference, organization: notice.organization },
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const notice = event.notification.data;
  const route = noticeRoute(notice);
  if (!route) return;
  const target = new URL(self.registration.scope);
  target.searchParams.set('empresa', notice.organization);
  target.hash = route;
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window' });
    const current = windows.find((client) => client.url === target.href);
    if (current) await current.focus();
    else await self.clients.openWindow(target.href);
  })());
});
