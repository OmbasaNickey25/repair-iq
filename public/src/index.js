import { App } from './App.js';

document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();

    // Register Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/serviceWorker.js')
            .then(reg => console.log('Service Worker registered', reg))
            .catch(err => console.error('Service Worker registration failed', err));
    }
});
