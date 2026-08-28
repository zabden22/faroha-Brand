'use client';

import { useState } from 'react';
import SizeGuide from './SizeGuide';
import { RulerIcon } from '@/components/Icons';

export default function SizeGuideButton() {
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  return (
    <>
      <button
        className="btn btn-outline"
        onClick={() => setIsSizeGuideOpen(true)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
      >
        <RulerIcon size={18} style={{ color: 'var(--color-primary)' }} />
        عرض دليل المقاسات
      </button>
      <SizeGuide isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </>
  );
}
