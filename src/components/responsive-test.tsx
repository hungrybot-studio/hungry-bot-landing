'use client';

import { useState, useEffect } from 'react';

export function ResponsiveTest() {
  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: 0,
    breakpoint: '',
  });

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      let breakpoint = '';
      if (width < 640) breakpoint = 'Mobile (sm)';
      else if (width < 768) breakpoint = 'Large Mobile (md)';
      else if (width < 1024) breakpoint = 'Tablet (lg)';
      else if (width < 1280) breakpoint = 'Desktop (xl)';
      else breakpoint = 'Large Desktop (2xl)';
      
      setScreenSize({ width, height, breakpoint });
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  if (process.env.NODE_ENV === 'production') {
    return null; // Не показуємо в продакшні
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-3 rounded-lg text-xs z-50">
      <div className="font-mono">
        <div>Width: {screenSize.width}px</div>
        <div>Height: {screenSize.height}px</div>
        <div>Breakpoint: {screenSize.breakpoint}</div>
      </div>
    </div>
  );
}
