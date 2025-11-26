import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BrandArchitect - The Board Game',
  description: 'Build logos with geometric shapes and find the saboteur!',
  manifest: '/manifest.json',
  icons: {
    icon: '/brandarchitect-logo-squared.svg',
    apple: '/brandarchitect-logo-squared.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'BrandArchitect',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#f1e9e2',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {/* Subtle Pattern Background */}
        <div className="pattern-background" />
        
        {/* Floating Decorative Shapes */}
        <div className="shape shape-circle" style={{ top: '10%', left: '-5%', animationDelay: '0s' }} />
        <div className="shape shape-square" style={{ top: '60%', right: '-5%', animationDelay: '2s' }} />
        <div className="shape shape-circle" style={{ bottom: '10%', left: '60%', animationDelay: '4s', width: '100px', height: '100px' }} />
        
        <main className="relative min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
