const CACHE_NAME = 'word-defender-v1';

// 這裡列出我們需要「強制快取」存到手機硬碟裡的檔案
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    // 連您放在 GitHub 上的題庫 API 也一併快取下來！
    'https://william01alltech-hue.github.io/english-words-api/words.json' 
];

// 1. 安裝階段：把檔案抓下來存進 Cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log('快取寫入中...');
            return cache.addAll(ASSETS_TO_CACHE);
        })
        .then(() => self.skipWaiting())
    );
});

// 2. 啟動階段：清除舊版本的 Cache (方便未來更新)
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('清除舊快取:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// 3. 攔截請求階段 (Cache-First 策略)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            // 如果在快取裡有找到，就直接回傳 (0秒啟動、免網路)
            if (response) {
                return response;
            }
            // 如果沒有，才真的去網路上抓
            return fetch(event.request).then(fetchRes => {
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request.url, fetchRes.clone());
                    return fetchRes;
                });
            });
        }).catch(() => {
            console.log('網路斷線且無快取可讀');
        })
    );
});