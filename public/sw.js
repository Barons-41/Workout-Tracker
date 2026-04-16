const CACHE = 'workout-tracker-v1';

const OFFLINE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Offline – Workout Tracker</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#151515;color:#f0f0f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
    .card{background:#1e1e1e;border:1px solid #2a2a2a;border-radius:16px;padding:32px 24px;max-width:360px;width:100%;text-align:center}
    .icon{font-size:48px;margin-bottom:16px}
    h1{font-size:20px;font-weight:700;margin-bottom:8px}
    p{font-size:14px;color:#999;line-height:1.5;margin-bottom:24px}
    button{background:#1D9E75;border:none;border-radius:12px;color:#fff;font-size:15px;font-weight:600;padding:14px 24px;width:100%;cursor:pointer}
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">📶</div>
    <h1>You're offline</h1>
    <p>No internet connection. Your logged sessions are saved in Supabase and will sync when you're back online.</p>
    <button onclick="location.reload()">Try again</button>
  </div>
</body>
</html>`;

// ── Install: pre-cache the offline page ───────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.put('/__offline', new Response(OFFLINE_HTML, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      }))
    )
  );
  self.skipWaiting();
});

// ── Activate: remove stale caches ─────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Fetch: network-first; offline fallback for navigation requests ─────────
self.addEventListener('fetch', (event) => {
  // Only intercept same-origin navigation requests (page loads)
  if (
    event.request.mode === 'navigate' &&
    event.request.url.startsWith(self.location.origin)
  ) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/__offline'))
    );
    return;
  }
  // All other requests: network only, no interference with Supabase/CDN
});
