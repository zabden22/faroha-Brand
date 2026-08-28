'use client';

import { useState } from 'react';
import SizeGuide from './SizeGuide';

export default function SizeGuideButton() {
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  return (
    <>
      <button className="btn btn-outline" onClick={() => setIsSizeGuideOpen(true)}>
        عرض دليل المقاسات 📏
      </button>
      <SizeGuide isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </>
  );
}
