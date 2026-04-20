/* eslint-disable */
// @ts-nocheck
// Service Worker custom handlers — compiled into the Workbox SW by next-pwa

self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}
  const title = data.title ?? 'Food·Mood'
  const options = {
    body:    data.body ?? '',
    icon:    '/icon-192x192.png',
    badge:   '/icon-192x192.png',
    data:    { url: data.url ?? '/retos' },
    vibrate: [100, 50, 100],
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url ?? '/retos'
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) return client.focus()
        }
        return self.clients.openWindow(url)
      })
  )
})
