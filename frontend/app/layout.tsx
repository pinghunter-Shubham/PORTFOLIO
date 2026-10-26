import type { Metadata, Viewport } from 'next'
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google'
import '@/styles/globals.css'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

// ── Google Fonts ──────────────────────────────────────────────────────────────
const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

// ── Metadata ──────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: 'Shubham Singh — ML Engineer & Data Scientist',
    template: '%s | Shubham Singh',
  },
  description:
    'Shubham Singh — Machine Learning Engineer and Data Scientist from West Bengal, India. Specializing in Computer Vision, Deep Learning, NLP, and AI-powered applications.',
  keywords: [
    'Shubham Singh',
    'Machine Learning Engineer',
    'Data Scientist',
    'Computer Vision',
    'Deep Learning',
    'Python',
    'TensorFlow',
    'AI Engineer',
    'West Bengal',
    'India',
    'Cognizant',
  ],
  authors: [{ name: 'Shubham Singh' }],
  creator: 'Shubham Singh',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Shubham Singh — ML Engineer & Data Scientist',
    description:
      'Machine Learning Engineer specializing in Computer Vision, Deep Learning, and AI-powered applications.',
    siteName: 'Shubham Singh Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shubham Singh — ML Engineer & Data Scientist',
    description:
      'Machine Learning Engineer specializing in Computer Vision, Deep Learning, and AI applications.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export const viewport: Viewport = {
  themeColor: '#f5f3ed',
  width: 'device-width',
  initialScale: 1,
}

// ── Root Layout ───────────────────────────────────────────────────────────────
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
