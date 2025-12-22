import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { useBlob } from '../BlobContext';
import { useUI } from '../UIContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { setHovered } = useBlob();
  const { isLightboxOpen } = useUI();

  // Initialize state based on window width to ensure correct initial animation
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    // Listener is sufficient as we already initialized state
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navItems = [
    { label: t.nav.works, path: '/works' },
    { label: t.nav.home, path: '/' },
    { label: t.nav.about, path: '/about' },
  ];

  return (
    <motion.nav
      // Slide up from bottom on mobile (y: 100), slide down from top on desktop (y: -100)
      // When lightbox is open, reverse the animation to hide it
      initial={{ y: isMobile ? 100 : -100, opacity: 0 }}
      animate={{
        y: isLightboxOpen ? (isMobile ? 100 : -100) : 0,
        opacity: isLightboxOpen ? 0 : 1
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed bottom-7 md:bottom-auto md:top-6 left-0 right-0 z-40 flex justify-center items-center pointer-events-none"
    >
      <div className="pointer-events-auto bg-nav/80 backdrop-blur-md shadow-lg rounded-full px-2 py-2 border border-black/10 dark:border-white/20">
        <ul className="flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  className={`px-3 md:px-6 py-2 rounded-full text-base font-medium transition-all duration-300 block relative ${isActive
                    ? 'text-black dark:text-white bg-gray-200 dark:bg-white/10 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                    }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.nav>
  );
};
