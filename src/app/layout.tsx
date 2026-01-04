import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/navigation/sidebar";
import { MobileNav } from "@/components/navigation/mobile-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YKS Tracker - Sınav Gelişiminizi Takip Edin",
  description: "YKS sınav hazırlık sürecinizi, çalışma oturumlarınızı ve hedeflerinizi takip edin. Organize kalın ve üniversite sınavında başarıyı yakalayın.",
  keywords: ["YKS", "sınav", "çalışma", "takip", "TYT", "AYT", "üniversite", "hazırlık"],
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
          enableSystem
          disableTransitionOnChange
        >
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
