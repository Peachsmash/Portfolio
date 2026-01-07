import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PaintBucket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Theme } from '../types';
import { useUI } from '../UIContext';

interface ThemeToggleProps {
  currentTheme: Theme;
  toggleTheme: () => void;
  variant?: 'fixed' | 'mobile';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  currentTheme,
  toggleTheme,
  variant = 'fixed',
  className = ''
}) => {
  const [isSpilling, setIsSpilling] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [spillOrigin, setSpillOrigin] = useState<string>('50% 50%');
  const [spillKey, setSpillKey] = useState(0); // Add key state to force remount
  const { isLightboxOpen } = useUI();

  // Initialize state based on window width to ensure correct initial animation
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  // The color we are spilling INTO. If current is light, we spill dark color.
  const spillColor = currentTheme === 'light' ? '#0f172a' : '#ffffff';

  const isDark = currentTheme === 'dark';

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent interaction if locked
    if (isLocked) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    setSpillOrigin(`${x}px ${y}px`);
    setSpillKey(prev => prev + 1); // Increment key to force new animation instance
    setIsSpilling(true);
    setIsLocked(true);

    // Disable all CSS transitions to prevent color lag when theme actually switches
    document.body.classList.add('disable-transitions');

    // Perform theme switch and end spill animation at 600ms
    setTimeout(() => {
      toggleTheme();
      setIsSpilling(false);

      // Re-enable transitions after a short delay to allow the DOM to update colors instantly
      requestAnimationFrame(() => {
        setTimeout(() => {
          document.body.classList.remove('disable-transitions');
        }, 50);
      });
    }, 600);

    // Keep button disabled for an extra 200ms (total 800ms) to prevent spamming
    setTimeout(() => {
      setIsLocked(false);
    }, 800);
  };

  const clipPathInitial = `circle(0% at ${spillOrigin})`;
  const clipPathAnimate = `circle(150% at ${spillOrigin})`;

  // Dynamic Styles
  const baseBg = variant === 'mobile'
    ? (isDark ? 'bg-slate-800/80' : 'bg-white/80')
    : (isDark ? 'bg-white/10' : 'bg-white');

  const borderColor = isDark ? 'border-gray-600' : 'border-gray-300';
  const iconColor = isDark ? 'text-gray-300' : 'text-gray-600';

  // Variants for the icon animation
  const iconVariants = {
    rest: { scaleX: -1, rotate: 0 },
    hover: { scaleX: -1, rotate: isSpilling ? 45 : 12 },
    spilling: { scaleX: -1, rotate: 45 }
  };

  const ButtonContent = (
    <motion.button
      onClick={handleToggle}
      disabled={isLocked}
      className={`p-3 md:p-2 rounded-full backdrop-blur-md border shadow-xl w-12 h-12 md:w-9 md:h-9 flex items-center justify-center relative ${baseBg} ${borderColor} ${isLocked ? 'cursor-default' : 'cursor-pointer'}`}
      aria-label="Toggle Theme"
      style={{
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)' // Force GPU promotion for the container
      }}
      // Propagate state to children
      initial="rest"
      animate={isSpilling ? "spilling" : "rest"}
      whileHover="hover"
      whileTap="hover"
    >
      <div className="w-full h-full flex items-center justify-center">
        <motion.div
          variants={iconVariants}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          style={{ originX: 0.5, originY: 0.5 }} // Ensure transform origin is center
        >
          <PaintBucket
            className={`w-6 h-6 md:w-5 md:h-5 ${iconColor}`}
          />
        </motion.div>
      </div>
    </motion.button>
  );

  const Tooltip = (
    <div className={`absolute 
      ${variant === 'mobile' ? 'bottom-full mb-3 left-1/2 -translate-x-1/2' : 'bottom-full mb-3 right-0 md:bottom-auto md:mb-0 md:top-full md:mt-3 md:left-1/2 md:right-auto md:-translate-x-1/2'} 
      px-3 py-1.5 
      bg-white text-gray-900 border border-gray-200
      dark:bg-gray-800 dark:text-white dark:border-gray-700
      text-xs font-medium rounded-lg 
      opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-xl z-50`}>
      {currentTheme === 'light' ? 'Dark Mode' : 'Light Mode'}

      {/* Arrow */}
      <div className={`absolute w-2 h-2 
        bg-white border-gray-200
        dark:bg-gray-800 dark:border-gray-700
        rotate-45
        ${variant === 'mobile' ? '-bottom-1 left-1/2 -translate-x-1/2 border-b border-r' : '-bottom-1 right-5 md:right-auto md:bottom-auto md:-top-1 md:left-1/2 md:right-auto md:-translate-x-1/2 md:border-b-0 md:border-r-0 md:border-t md:border-l border-b border-r'}`}>
      </div>
    </div>
  );

  return (
    <>
      {variant === 'fixed' ? (
        <motion.div
          initial={{ y: isMobile ? 100 : -100, opacity: 0 }}
          animate={{
            y: isLightboxOpen ? (isMobile ? 100 : -100) : 0,
            opacity: isLightboxOpen ? 0 : 1,
            scale: isLightboxOpen ? 0.5 : 1
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`fixed bottom-10 right-4 max-[400px]:right-2 max-[400px]:scale-90 origin-bottom-right md:bottom-auto md:top-8 md:right-8 z-50 group ${isLightboxOpen ? 'pointer-events-none' : ''} ${className}`}
        >
          {ButtonContent}
          {Tooltip}
        </motion.div>
      ) : (
        <div className={`relative group ${className}`}>
          {ButtonContent}
          {Tooltip}
        </div>
      )}

      {/* The Paint Spill Layer - Rendered via Portal to escape stacking contexts */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isSpilling && (
            <motion.div
              key={spillKey}
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
                zIndex: 9999, // High z-index to cover everything
                pointerEvents: 'none'
              }}
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};
