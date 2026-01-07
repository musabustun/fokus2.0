'use client';

import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <svg
            className="w-24 h-24 mx-auto text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M18.364 5.636a9 9 0 010 12.728m-3.536-3.536a4 4 0 000-5.656m-7.072 7.072a4 4 0 010-5.656m-3.536 9.192a9 9 0 010-12.728"
            />
            <line
              x1="4"
              y1="4"
              x2="20"
              y2="20"
              strokeLinecap="round"
              strokeWidth={2}
            />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-4">
          Çevrimdışısınız
        </h1>
        
        <p className="text-muted-foreground mb-8">
          İnternet bağlantınız yok gibi görünüyor. Lütfen bağlantınızı kontrol edin ve tekrar deneyin.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Tekrar Dene
          </button>
          
          <Link
            href="/"
            className="block w-full px-6 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-accent transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
