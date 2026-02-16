'use client';

import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import { useState, useEffect } from 'react'
import Loader from '@/components/Loader'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Set document metadata
    document.title = 'Mark Designers Ltd';
    
    // Set or update meta tags
    const setMetaTag = (name: string, content: string, property?: boolean) => {
      const attribute = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    setMetaTag('description', 'Mark Designers - Leading manufacturing company in Bangladesh since 1995, specializing in premium quality products with sustainable practices and international certifications.');
    setMetaTag('keywords', 'Mark Designers, manufacturing, Bangladesh, sustainable manufacturing, quality products, ISO certified, premium manufacturing');
    setMetaTag('author', 'Mark Designers');
    setMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    
    // Open Graph tags
    setMetaTag('og:title', 'Mark Designers - Premium Manufacturing Excellence Since 1995', true);
    setMetaTag('og:description', 'Leading manufacturing company in Bangladesh, specializing in premium quality products with sustainable practices.', true);
    setMetaTag('og:type', 'website', true);
    setMetaTag('og:site_name', 'Mark Designers', true);
    
    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', 'Mark Designers - Premium Manufacturing Excellence');
    setMetaTag('twitter:description', 'Leading manufacturing company in Bangladesh since 1995');
  }, []);

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-inter">
        <RootContent>{children}</RootContent>
      </body>
    </html>
  )
}

function RootContent({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <Loader onLoadingComplete={() => setIsLoading(false)} />}
      
      {!isLoading && (
        <>
          <Header />
          <main className="overflow-x-hidden">
            {children}
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
