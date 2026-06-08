/* Service Worker pro Firebase Cloud Messaging (push notifikace úkolníčku).
   POZOR: FIREBASE_CONFIG musí být SHODNÝ s index.html.
   Doplň apiKey / messagingSenderId / appId z Firebase Console. */
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            'DOPLNIT',
  authDomain:        'ii-101-dolni-brezany.firebaseapp.com',
  databaseURL:       'https://ii-101-dolni-brezany-default-rtdb.firebaseio.com',
  projectId:         'ii-101-dolni-brezany',
  storageBucket:     'ii-101-dolni-brezany.appspot.com',
  messagingSenderId: 'DOPLNIT',
  appId:             'DOPLNIT'
});

var messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  var n = (payload && payload.notification) || {};
  self.registration.showNotification(n.title || 'II/101 Břežany', {
    body: n.body || '',
    icon: 'manifest.json',
    data: (payload && payload.data) || {}
  });
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.matchAll({ type: 'window' }).then(function(list) {
    for (var i = 0; i < list.length; i++) { if ('focus' in list[i]) return list[i].focus(); }
    if (clients.openWindow) return clients.openWindow('./index.html');
  }));
});
