// Service worker mínimo — habilita instalação do PWA.
// Não faz cache agressivo, para o painel sempre carregar dados atualizados.
const CACHE = 'millenium-admin-v1';
const ASSETS = ['admin.html', 'config.js', 'manifest.json'];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS).catch(() => {})));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = e.request.url;
  // Nunca cachear chamadas ao Supabase (dados sempre frescos)
  if (url.includes('supabase.co')) return;
  // Network-first para o resto, com fallback ao cache
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
