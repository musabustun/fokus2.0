import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/navigation/sidebar";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { RegisterServiceWorker } from "@/components/register-sw";
import { PwaInstallPrompt } from "@/components/pwa-install-prompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Fokus | YKS Sınav Gelişim Takip Platformu",
    template: "%s | Fokus"
  },
  description: "YKS (TYT, AYT) hazırlık sürecinizi profesyonelce yönetin. Konu takibi, deneme sonuçları ve çalışma istatistikleri ile hedefinize odaklanın.",
  keywords: [
    "Fokus", "YKS Koçu", "Dijital Koç", "YKS Takip", "TYT Konu Takibi", "AYT Net Takibi", 
    "YKS Deneme Takibi", "Sınav Hazırlık", "Ders Çalışma Programı", "YKS Sayacı", "Üniversite Hazırlık"
  ],
  authors: [{ name: "Fokus Team" }],
  creator: "Fokus",
  publisher: "Fokus",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Fokus | YKS Sınav Gelişim Takip Platformu",
    description: "YKS hazırlık sürecinizi dijitalleştirin. Netlerinizi artırın, gelişiminizi izleyin.",
    url: '/',
    siteName: 'Fokus',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Fokus YKS Hazırlık Platformu',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Fokus | YKS Sınav Gelişim Takip Platformu",
    description: "YKS hazırlık sürecinizi dijitalleştirin. Netlerinizi artırın, gelişiminizi izleyin.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/appimages/ios/180.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/appimages/ios/180.png',
    },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Fokus',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <RegisterServiceWorker />
          <PwaInstallPrompt />
          <Sidebar />
          <main className="lg:pl-64 pb-20 lg:pb-0 min-h-screen">
            {children}
          </main>
          <MobileNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
