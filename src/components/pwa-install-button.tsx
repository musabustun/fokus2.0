'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePwaInstall } from '@/hooks/use-pwa-install';

export function PwaInstallButton() {
  const { isInstallable, install } = usePwaInstall();

  if (!isInstallable) return null;

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="hidden md:flex gap-2" 
      onClick={install}
    >
      <Download className="h-4 w-4" />
      Uygulamayı Yükle
    </Button>
  );
}
