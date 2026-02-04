import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'StudyMate - AI 학습 파트너',
    template: '%s | StudyMate',
  },
  description:
    'AI와 함께하는 스마트 학습. 개인화된 학습 계획, 진도 관리, 취약점 분석으로 효율적인 학습을 도와드립니다.',
  keywords: ['학습', '공부', 'AI', '교육', '학습 관리', '진도 관리'],
  authors: [{ name: 'StudyMate Team' }],
  creator: 'StudyMate',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://studymate.app',
    siteName: 'StudyMate',
    title: 'StudyMate - AI 학습 파트너',
    description:
      'AI와 함께하는 스마트 학습. 개인화된 학습 계획, 진도 관리, 취약점 분석으로 효율적인 학습을 도와드립니다.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudyMate - AI 학습 파트너',
    description: 'AI와 함께하는 스마트 학습',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
