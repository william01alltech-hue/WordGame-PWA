const CACHE_NAME = 'wordgame-v3';
const ASSETS = [
    './',
    './index.html',
    './game_defense.html',
    './game_dice.html',
    './game_slot.html',
    './words.json',
    './manifest.json',
    './privacy.html'
];

// 安裝階段：將核心檔案存入快取
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('快取寫入中 (v3)...');
            return cache.addAll(ASSETS);
        })
    );
    // 強制立即進入啟動階段，不需等待舊版 Service Worker 關閉
    self.skipWaiting(); 
});

// 啟動階段：清除舊版本的快取
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('清除舊快取:', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    // 立即接管所有頁面的控制權
    self.clients.claim();
});

// 攔截請求：優先讀取快取，若無則透過網路抓取
self.addEventListener('fetch', (event) => {
    // 忽略非 http/https 的請求 (解決 chrome-extension 報錯)
    if (!event.request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});