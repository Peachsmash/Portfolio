import React, { useState, useEffect } from 'react';
import { PaintBucket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Theme } from '../types';

interface ThemeToggleProps {
  currentTheme: Theme;
  toggleTheme: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ currentTheme, toggleTheme }) => {
  const [isSpilling, setIsSpilling] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // The color we are spilling INTO. If current is light, we spill dark color.
  const spillColor = currentTheme === 'light' ? '#0f172a' : '#ffffff'; 

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleToggle = () => {
    if (isSpilling) return;
    setIsSpilling(true);
    
    // Duration matches the animation duration below
    setTimeout(() => {
      toggleTheme();
      setIsSpilling(false);
    }, 600); // Trigger theme switch midway or near end of fill
  };

  // Determine clipPath origin based on device
  // Mobile (Bottom-Right): 
  // Button is bottom-8 (2rem), right-4 (1rem). Size 12 (3rem).
  // Center X from right: 1rem + 1.5rem = 2.5rem.
  // Center Y from bottom: 2rem + 1.5rem = 3.5rem.
  // Desktop (Top-Right): 
  // Button is top-8 (2rem), right-8 (2rem). Size 9 (2.25rem).
  // Center X from right: 2rem + 1.125rem = 3.125rem. (Approximated to 3.5rem in old code, let's keep or refine).
  // Center Y from top: 2rem + 1.125rem = 3.125rem. (Approximated to 3.5rem in old code).
  
  const clipPathInitial = isMobile 
    ? 'circle(0% at calc(100% - 2.5rem) calc(100% - 3.5rem))'
    : 'circle(0% at calc(100% - 3.5rem) 3.5rem)';

  const clipPathAnimate = isMobile
    ? 'circle(150% at calc(100% - 2.5rem) calc(100% - 3.5rem))'
    : 'circle(150% at calc(100% - 3.5rem) 3.5rem)';

  return (
    <>
      <div className="fixed bottom-8 right-4 md:bottom-auto md:top-8 md:right-8 z-50 group">
        <button
          onClick={handleToggle}
          className="p-3 md:p-2 rounded-full bg-white dark:bg-white/10 backdrop-blur-md border border-gray-300 dark:border-gray-600 shadow-xl hover:scale-110 transition-transform active:scale-95 w-12 h-12 md:w-9 md:h-9 flex items-center justify-center relative"
          aria-label="Toggle Theme"
        >
          <div className="transform scale-x-[-1] flex items-center justify-center">
            <PaintBucket 
              className={`w-6 h-6 md:w-5 md:h-5 transition-all duration-500 text-gray-600 dark:text-gray-300 ${
                isSpilling 
                  ? 'rotate-[45deg]' 
                  : 'group-hover:rotate-12'
              }`}
            />
          </div>
        </button>

        {/* Tooltip: Above on mobile, Below on desktop */}
        <div className="absolute 
          bottom-full mb-3 right-0 
          md:bottom-auto md:mb-0 md:top-full md:mt-3 md:left-1/2 md:right-auto md:-translate-x-1/2 
          px-3 py-1.5 
          bg-white text-gray-900 border border-gray-200
          dark:bg-gray-800 dark:text-white dark:border-gray-700
          text-xs font-medium rounded-lg 
          opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-xl">
          {currentTheme === 'light' ? 'Dark Mode' : 'Light Mode'}
          
          {/* Arrow */}
          <div className="absolute w-2 h-2 
            bg-white border-gray-200
            dark:bg-gray-800 dark:border-gray-700
            rotate-45
            -bottom-1 right-5 md:right-auto border-b border-r
            md:bottom-auto md:-top-1 md:left-1/2 md:right-auto md:-translate-x-1/2 md:border-b-0 md:border-r-0 md:border-t md:border-l">
          </div>
        </div>
      </div>

      {/* The Paint Spill Layer */}
      <AnimatePresence>
        {isSpilling && (
          <motion.div
            initial={{ clipPath: clipPathInitial }} 
            animate={{ clipPath: clipPathAnimate }}
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ 
              backgroundColor: spillColor,
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 45, // Just below the button (z-50) but above everything else
              pointerEvents: 'none'
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};