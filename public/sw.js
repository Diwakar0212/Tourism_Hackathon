const CACHE_NAME = 'safesolo-v1.2.0';
const STATIC_CACHE = 'safesolo-static-v1.2.0';
const DYNAMIC_CACHE = 'safesolo-dynamic-v1.2.0';

// Essential files to cache for offline functionality
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  // Core JavaScript and CSS will be added by Vite's PWA plugin
];

// Routes that should work offline
const OFFLINE_ROUTES = [
  '/',
  '/safety',
  '/profile',
  '/trips'
];

// API endpoints to cache for offline use
const CACHEABLE_APIS = [
  '/api/user/profile',
  '/api/safety/contacts',
  '/api/trips'
];

// Emergency offline page
const OFFLINE_FALLBACK = '/offline.html';

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Precaching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
              console.log('[SW] Removing old cache:', key);
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => {
        // Claim all clients
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // Handle different types of requests with appropriate strategies
  if (isStaticAsset(request)) {
    // Static assets: Cache First strategy
    event.respondWith(cacheFirst(request));
  } else if (isAPIRequest(request)) {
    // API requests: Network First with cache fallback
    event.respondWith(networkFirst(request));
  } else if (isNavigationRequest(request)) {
    // Page navigation: Stale While Revalidate
    event.respondWith(staleWhileRevalidate(request));
  } else {
    // Default: Network First
    event.respondWith(networkFirst(request));
  }
});

// Background Sync for offline safety data
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync event:', event.tag);
  
  if (event.tag === 'safety-checkin') {
    event.waitUntil(syncSafetyCheckins());
  } else if (event.tag === 'emergency-alert') {
    event.waitUntil(syncEmergencyAlerts());
  } else if (event.tag === 'location-update') {
    event.waitUntil(syncLocationUpdates());
  }
});

// Push notifications for safety alerts
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: 'You have a safety-related notification',
    icon: '/icon-192.png',
    badge: '/icon-72.png',
    vibrate: [200, 100, 200],
    tag: 'safety-notification',
    renotify: true,
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View Details',
        icon: '/icon-view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icon-dismiss.png'
      }
    ]
  };

  if (event.data) {
    const data = event.data.json();
    options.body = data.message || options.body;
    options.tag = data.tag || options.tag;
    
    // Handle emergency notifications with high priority
    if (data.type === 'emergency') {
      options.requireInteraction = true;
      options.vibrate = [500, 200, 500, 200, 500];
      options.body = `🚨 EMERGENCY: ${data.message}`;
    }
  }

  event.waitUntil(
    self.registration.showNotification('SafeSolo', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/safety')
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then((clients) => {
          // Focus existing window if available
          for (const client of clients) {
            if (client.url.includes('safesolo') && 'focus' in client) {
              return client.focus();
            }
          }
          // Open new window
          return clients.openWindow('/safety');
        })
    );
  }
});

// Caching Strategies Implementation

async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache first failed:', error);
    return new Response('Offline content not available', { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (isNavigationRequest(request)) {
      return caches.match(OFFLINE_FALLBACK) || new Response('Offline', { status: 503 });
    }
    
    return new Response('Offline', { status: 503 });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    return cachedResponse || caches.match(OFFLINE_FALLBACK);
  });

  return cachedResponse || fetchPromise;
}

// Background Sync Handlers

async function syncSafetyCheckins() {
  try {
    console.log('[SW] Syncing safety check-ins...');
    
    // Get pending check-ins from IndexedDB
    const pendingCheckins = await getPendingData('checkins');
    
    for (const checkin of pendingCheckins) {
      try {
        const response = await fetch('/api/safety/checkin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${checkin.token}`
          },
          body: JSON.stringify(checkin.data)
        });
        
        if (response.ok) {
          await removePendingData('checkins', checkin.id);
          console.log('[SW] Synced check-in:', checkin.id);
        }
      } catch (error) {
        console.error('[SW] Failed to sync check-in:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Sync safety check-ins failed:', error);
  }
}

async function syncEmergencyAlerts() {
  try {
    console.log('[SW] Syncing emergency alerts...');
    
    const pendingAlerts = await getPendingData('emergencyAlerts');
    
    for (const alert of pendingAlerts) {
      try {
        const response = await fetch('/api/safety/emergency', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${alert.token}`
          },
          body: JSON.stringify(alert.data)
        });
        
        if (response.ok) {
          await removePendingData('emergencyAlerts', alert.id);
          console.log('[SW] Synced emergency alert:', alert.id);
        }
      } catch (error) {
        console.error('[SW] Failed to sync emergency alert:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Sync emergency alerts failed:', error);
  }
}

async function syncLocationUpdates() {
  try {
    console.log('[SW] Syncing location updates...');
    
    const pendingLocations = await getPendingData('locations');
    
    for (const location of pendingLocations) {
      try {
        const response = await fetch('/api/safety/location', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${location.token}`
          },
          body: JSON.stringify(location.data)
        });
        
        if (response.ok) {
          await removePendingData('locations', location.id);
          console.log('[SW] Synced location update:', location.id);
        }
      } catch (error) {
        console.error('[SW] Failed to sync location update:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Sync location updates failed:', error);
  }
}

// Helper Functions

function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico|woff|woff2)$/);
}

function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/');
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept').includes('text/html'));
}

// IndexedDB helpers for offline data storage
async function getPendingData(storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SafeSoloOfflineDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id' });
      }
    };
  });
}

async function removePendingData(storeName, id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SafeSoloOfflineDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}

console.log('[SW] SafeSolo Service Worker loaded successfully');
