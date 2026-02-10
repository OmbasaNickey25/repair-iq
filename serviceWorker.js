const CACHE_NAME = 'repair-iq-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/manifest.json',
    '/src/index.js',
    '/src/App.js',
    '/src/components/CameraScanner.js',
    '/src/components/ComponentCard.js',
    '/src/components/VoicePlayer.js',
    '/src/components/AROverlay.js',
    '/src/ai/prompts.js',
    '/src/utils/textToSpeech.js',
    '/src/utils/decisionTree.js',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (event) => {
    // Cache-first strategy for static assets
    // Network-first or Network-only for API calls

    if (event.request.url.includes('/predict')) {
        // API calls: Network only (or fallback to user message)
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});
