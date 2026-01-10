import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();
  const location = useLocation();
  
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const isAbout = location.pathname === '/about';
  
  // Logic: 
  // Mobile: Hidden everywhere except About.
  // Desktop: Always visible.
  const shouldShow = !isMobile || isAbout;

  return (
    <motion.footer 
      className="absolute bottom-2 md:bottom-4 left-0 right-0 text-center text-xs text-gray-600 dark:text-gray-400 pointer-events-none z-0 pt-[4px]"
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: shouldShow ? 1 : 0
      }}
      transition={{ 
        duration: 0.5, 
        ease: "easeInOut",
        delay: (isMobile && shouldShow) ? 1 : 0
      }}
    >
       {/* Opacity classes moved to inner element to preserve specific design values while allowing full fade out */}
       <p className={`inline-block opacity-80 dark:opacity-50 ${shouldShow ? 'pointer-events-auto' : 'pointer-events-none'}`}>
         © {new Date().getFullYear()} {t.footer}
       </p>
    </motion.footer>
  );
};
