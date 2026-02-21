'use client';

import { useEffect } from 'react';
import { ADS_CONFIG } from '@/lib/constants';

interface AdSlotProps {
  slot: 'horizontal-top' | 'horizontal-bottom' | 'sidebar' | 'in-feed';
}

export default function AdSlot({ slot }: AdSlotProps) {
  useEffect(() => {
    if (ADS_CONFIG.enabled) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, []);

  if (!ADS_CONFIG.enabled) {
    return null;
  }

  const sizes = {
    'horizontal-top': { width: 728, height: 90 },
    'horizontal-bottom': { width: 728, height: 90 },
    'sidebar': { width: 300, height: 600 },
    'in-feed': { width: 728, height: 90 },
  };

  const size = sizes[slot];

  return (
    <div className="flex justify-center my-4">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADS_CONFIG.adsenseId}
        data-ad-slot={ADS_CONFIG.adSlots[slot]}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
