import type { Metadata } from "next";
import { Inter } from "next/font/google";
import './globals.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'InstaPulse - Emergency Alert & Rapid Response System',
  description: 'Advanced emergency alert and monitoring system for communities and establishments. Professional security solutions for homes and businesses.',
  keywords: ['emergency alert', 'security system', 'rapid response', 'monitoring', 'CCTV', 'alarm system'],
  authors: [{ name: 'InstaPulse' }],
  openGraph: {
    title: 'InstaPulse - Emergency Alert & Rapid Response System',
    description: 'Advanced emergency alert and monitoring system for communities and establishments.',
    type: 'website',
    locale: 'en_US',
    siteName: 'InstaPulse',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InstaPulse - Emergency Alert & Rapid Response System',
    description: 'Advanced emergency alert and monitoring system for communities and establishments.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
