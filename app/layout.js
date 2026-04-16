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
        {/* Favicon */}
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16.png" />

        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* iOS home screen support */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Forge" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />

        {/* Theme colour for browser chrome */}
        <meta name="theme-color" content="#141416" />

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
