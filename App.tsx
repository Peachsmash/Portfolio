import { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Works } from './components/Works';
import { About } from './components/About';
import { ThemeToggle } from './components/ThemeToggle';
import { LanguageToggle } from './components/LanguageToggle';
import { LanguageProvider } from './LanguageContext';
import { BlobProvider, useBlob } from './BlobContext';
import { Theme } from './types';
import { Analytics } from "@vercel/analytics/react"
// Component to handle scroll/touch navigation between pages
const ScrollHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  
  // Ref to track when the bottom of the Works page was reached
  const worksBottomReachedRef = useRef<number | null>(null);

  // Reset navigation lock and scroll position on route change
  useEffect(() => {
    // Ensure scrolling is blocked immediately upon route change
    setIsNavigating(true);
    setTouchStart(null); // Reset touch state
    worksBottomReachedRef.current = null; // Reset works bottom timer
    window.scrollTo(0, 0);

    // Dynamic timeout: 1s for About page, 0.5s for others
    const timeoutDuration = location.pathname === '/about' ? 1000 : 500;

    const timer = setTimeout(() => setIsNavigating(false), timeoutDuration);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Monitor scroll position on Works page to manage the blockade timer
  useEffect(() => {
    const checkBottom = () => {
      if (location.pathname !== '/works') {
        worksBottomReachedRef.current = null;
        return;
      }
      
      // Use a slightly larger buffer (20px) than the navigation trigger (10px)
      // to start the timer as the user approaches the bottom.
      const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 20;
      
      if (isBottom) {
        if (worksBottomReachedRef.current === null) {
          worksBottomReachedRef.current = Date.now();
        }
      } else {
        worksBottomReachedRef.current = null;
      }
    };

    window.addEventListener('scroll', checkBottom);
    checkBottom(); // Initial check
    
    return () => window.removeEventListener('scroll', checkBottom);
  }, [location.pathname]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isNavigating) return;

      // Ignore horizontal scrolling
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      const isTop = window.scrollY <= 5;
      const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;
      const threshold = 10; // Minimum scroll intensity to trigger

      if (Math.abs(e.deltaY) < threshold) return;

      if (location.pathname === '/') {
        // HOME PAGE (1st)
        // Scroll Down -> Works
        if (e.deltaY > 0 && isBottom) {
          setIsNavigating(true);
          navigate('/works');
        }
      } else if (location.pathname === '/works') {
        // WORKS PAGE (2nd)
        if (e.deltaY < 0 && isTop) {
           // Scroll Up -> Home
           setIsNavigating(true);
           navigate('/');
        } else if (e.deltaY > 0 && isBottom) {
           // Scroll Down -> About
           
           // Check Blockade
           const now = Date.now();
           if (worksBottomReachedRef.current === null) {
             worksBottomReachedRef.current = now;
             return; // Block first attempt if not already tracked
           }
           
           // 0.6 second delay (600ms)
           if (now - worksBottomReachedRef.current < 600) {
             return;
           }

           setIsNavigating(true);
           navigate('/about');
        }
      } else if (location.pathname === '/about') {
        // ABOUT PAGE (3rd)
        // Scroll Up -> Works
        if (e.deltaY < 0 && isTop) {
          setIsNavigating(true);
          navigate('/works');
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      // Crucial for mobile lock: Do not record touch start if currently locked.
      // This ignores swipes that began during the lock period.
      if (isNavigating) {
        setTouchStart(null);
        return;
      }
      setTouchStart(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isNavigating || touchStart === null) return;
      
      const touchEnd = e.touches[0].clientY;
      const deltaY = touchStart - touchEnd; // Positive = swipe up (scroll down)
      
      // Increased buffer for mobile logic
      const isTop = window.scrollY <= 10; 
      const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;
      
      // Higher threshold for touch to prevent accidental swipes
      if (Math.abs(deltaY) < 60) return; 

      if (location.pathname === '/') {
        // Home -> Works (Down)
        if (deltaY > 0 && isBottom) {
          setIsNavigating(true);
          navigate('/works');
        }
      } else if (location.pathname === '/works') {
        // Works -> Home (Up)
        if (deltaY < 0 && isTop) {
          setIsNavigating(true);
          navigate('/');
        } 
        // Works -> About (Down)
        else if (deltaY > 0 && isBottom) {
          
          // Check Blockade
          const now = Date.now();
          if (worksBottomReachedRef.current === null) {
            worksBottomReachedRef.current = now;
            return;
          }
          // 0.6 second delay (600ms)
          if (now - worksBottomReachedRef.current < 600) {
            return;
          }

          setIsNavigating(true);
          navigate('/about');
        }
      } else if (location.pathname === '/about') {
        // About -> Works (Up)
        if (deltaY < 0 && isTop) {
          setIsNavigating(true);
          navigate('/works');
        }
      }
    };

    // Use passive: false to ensure we can control event flow if needed, 
    // though we are not preventing default here, just capturing.
    // React's event system is passive by default for wheel.
    window.addEventListener('wheel', handleWheel);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [location.pathname, isNavigating, navigate, touchStart]);

  return null;
};

// Wrapper component to use useLocation hook for AnimatePresence
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Hero />} />
        <Route path="/works" element={<Works />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </AnimatePresence>
  );
};

// Component for the background blob logic
const BackgroundBlob = () => {
  const location = useLocation();
  const { isHovered } = useBlob();
  const isWorksPage = location.pathname === '/works';
  
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

  const baseSize = isMobile ? 520 : 840;
  // Increase size by 50px on hover
  const currentSize = (isHovered && !isWorksPage) ? baseSize + 50 : baseSize;

  return (
    <>
      {/* Main Central Blob (Home & About) */}
      <motion.div 
        className="fixed inset-0 flex items-center justify-center pointer-events-none z-0"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isWorksPage ? 0 : 1, 
          scale: isWorksPage ? 0.9 : 1
        }}
        transition={{ 
          duration: 1.2,
          ease: "easeOut"
        }}
      >
        <motion.div
          className="rounded-full blur-[100px] 
            bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 
            opacity-40 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen"
          animate={{
             width: currentSize,
             height: currentSize,
             rotate: 360
          }}
          transition={{
            width: { duration: 0.5, ease: "easeOut", delay: isHovered ? 0 : 0.2 },
            height: { duration: 0.5, ease: "easeOut", delay: isHovered ? 0 : 0.2 },
            rotate: { duration: 25, ease: "linear", repeat: Infinity }
          }}
          style={{ willChange: 'transform, width, height' }} 
        />
      </motion.div>
    </>
  );
};

// Component for the subtle background texture
const BackgroundTexture = () => (
  <div 
    className="fixed inset-0 z-[1] pointer-events-none opacity-[0.03] dark:opacity-[0.06] mix-blend-overlay"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }}
  />
);

// Footer component to use hook
import { useLanguage } from './LanguageContext';
const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="absolute bottom-2 md:bottom-4 left-0 right-0 text-center text-xs text-gray-400 opacity-50 pointer-events-none z-0">
       <p className="pointer-events-auto inline-block">
         © {new Date().getFullYear()} {t.footer}
       </p>
    </footer>
  );
};

function AppContent() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      setTheme(savedTheme);
    } else if (systemPrefersDark) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <HashRouter>
      <ScrollHandler />
      <main className="min-h-screen relative font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-500 overflow-x-hidden">
        
        {/* Background Blobs Logic */}
        <BackgroundBlob />
        
        {/* Subtle noise texture */}
        <BackgroundTexture />

        <Navbar />
        <LanguageToggle />
        <ThemeToggle currentTheme={theme} toggleTheme={toggleTheme} />
        
        {/* Content wrapped in z-10 to stay above the blob */}
        <div className="relative z-10">
          <AnimatedRoutes />
          <Footer />
        </div>
      </main>
      <Analytics />
    </HashRouter>
  );
}

function App() {
  return (
    <LanguageProvider>
      <BlobProvider>
        <AppContent />
      </BlobProvider>
    </LanguageProvider>
  );
}

export default App;
