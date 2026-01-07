'use client';

import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePwaInstall } from '@/hooks/use-pwa-install';

export function PwaInstallPrompt() {
  const { isInstallable, install } = usePwaInstall();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isInstallable) {
      // Show prompt after a small delay
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isInstallable]);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="w-80 shadow-lg border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="absolute right-2 top-2">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleDismiss}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Uygulamayı Yükle
          </CardTitle>
          <CardDescription>
            Daha hızlı erişim ve çevrimdışı kullanım için Fokus'u ana ekranına ekle.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={install} className="w-full">
              Yükle
            </Button>
            <Button variant="outline" onClick={handleDismiss} className="w-full">
              Belki Sonra
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
