import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { useBlob } from '../BlobContext';
import { useUI } from '../UIContext';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { Theme } from '../types';

interface NavbarProps {
  theme?: Theme;
  toggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
  const location = useLocation();
  const { t } = useLanguage();
  const { setHovered } = useBlob();
  const { isLightboxOpen, setNavHoverIndex } = useUI();

  // Initialize state based on window width to ensure correct initial animation
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  // State to track if the user is at the top of the page (for mobile toggle visibility)
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    const handleScroll = () => {
      // Consider "at top" if scroll Y is less than 30px
      setIsAtTop(window.scrollY < 30);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
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
      className="fixed bottom-10 md:bottom-auto md:top-6 left-0 right-0 z-40 flex justify-center items-center pointer-events-none max-[400px]:scale-90 origin-bottom scrollbar-compensate-padding"
    >
      <div className="grid grid-cols-[3rem_1fr_3rem] md:flex md:items-center md:justify-center md:gap-0 w-full max-w-md md:max-w-none px-4 md:px-0 pointer-events-none gap-2 md:gap-0">

        {/* Mobile Left: Language Toggle - Centered in its fixed column */}
        <div className="md:hidden pointer-events-auto flex items-center justify-center">
          <motion.div
            animate={{
              opacity: isAtTop ? 1 : 0,
              scale: isAtTop ? 1 : 0.8,
              pointerEvents: isAtTop ? "auto" : "none"
            }}
            transition={{ duration: 0.3 }}
          >
            <LanguageToggle variant="mobile" theme={theme} />
          </motion.div>
        </div>

        {/* Center: Nav Pill */}
        <div className="pointer-events-auto bg-nav/80 backdrop-blur-md shadow-lg rounded-full px-2 py-2 border border-black/10 dark:border-white/20 relative z-10 justify-self-center mx-auto md:mx-0 w-auto">
          <ul className="flex items-center space-x-1">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onMouseEnter={() => {
                      setHovered(true);
                      setNavHoverIndex(index);
                    }}
                    onMouseLeave={() => {
                      setHovered(false);
                      setNavHoverIndex(null);
                    }}
                    // Add touch events for mobile responsiveness on interaction
                    onTouchStart={() => setNavHoverIndex(index)}
                    onTouchEnd={() => setNavHoverIndex(null)}
                    onTouchCancel={() => setNavHoverIndex(null)}
                    className={`w-20 md:w-auto md:px-6 py-2 rounded-full text-base font-medium transition-all duration-300 flex items-center justify-center md:block relative whitespace-nowrap ${isActive
                      ? 'text-black dark:text-white bg-gray-200 dark:bg-white/10 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-white/15'
                      }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Mobile Right: Theme Toggle - Centered in its fixed column */}
        <div className="md:hidden pointer-events-auto flex items-center justify-center">
          <motion.div
            animate={{
              opacity: isAtTop ? 1 : 0,
              scale: isAtTop ? 1 : 0.8,
              pointerEvents: isAtTop ? "auto" : "none"
            }}
            transition={{ duration: 0.3 }}
          >
            {theme && toggleTheme && (
              <ThemeToggle
                variant="mobile"
                currentTheme={theme}
                toggleTheme={toggleTheme}
              />
            )}
          </motion.div>
        </div>

      </div>
    </motion.nav>
  );
};
