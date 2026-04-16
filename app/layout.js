import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "Workout Tracker",
  description: "Track your workouts, body stats, and PRs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* iOS home screen support */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Workouts" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />

        {/* Theme colour for browser chrome */}
        <meta name="theme-color" content="#151515" />

        {/* Viewport – prevent iOS auto-zoom on inputs */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
      </head>
      <body>
        {children}

        {/* Register service worker after page load */}
        <Script
          id="register-sw"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function () {
                  navigator.serviceWorker.register('/sw.js', { scope: '/' })
                    .catch(function (err) { console.warn('SW registration failed:', err); });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
