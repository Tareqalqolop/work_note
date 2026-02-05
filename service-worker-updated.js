const CACHE_NAME = 'tareq-app-v1';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icons/icon-72x72.png',
  './icons/icon-96x96.png',
  './icons/icon-128x128.png',
  './icons/icon-144x144.png',
  './icons/icon-152x152.png',
  './icons/icon-192x192.png',
  './icons/icon-384x384.png',
  './icons/icon-512x512.png'
];

// تثبيت Service Worker وتخزين الملفات المطلوبة
self.addEventListener('install', event => {
  console.log('Installing Service Worker');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  // تخطي فترة الانتظار للتفعيل الفوري
  self.skipWaiting();
});

// تفعيل السيطرة على الصفحات فور التفعيل
self.addEventListener('activate', event => {
  console.log('Activating Service Worker');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// استراتيجية الكاش ثم الشبكة للأداء الأفضل
self.addEventListener('fetch', event => {
  console.log('Fetching:', event.request.url);
  
  // تجاهل طلبات Google Docs لتجنب مشاكل CORS
  if (event.request.url.includes('docs.google.com')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إرجاع الاستجابة المخزنة إذا وجدت
        if (response) {
          return response;
        }
        
        // نسخ الطلب لأننا سنستهلكه مرة واحدة
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest)
          .then(response => {
            // التحقق من صحة الاستجابة
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // نسخ الاستجابة لأننا سنستهلكها مرتين
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          })
          .catch(error => {
            console.log('Fetch failed:', error);
            // يمكن إضافة استجابة احتياطية هنا للعمل في وضع عدم الاتصال
          });
      })
  );
});
