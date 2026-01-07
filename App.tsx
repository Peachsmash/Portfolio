import React, { useState, useEffect } from 'react';
import { HashRouter, useRoutes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Works } from './components/Works';
import { About } from './components/About';
import { NotFound } from './components/NotFound';
import { ThemeToggle } from './components/ThemeToggle';
import { LanguageToggle } from './components/LanguageToggle';
import { LanguageProvider } from './LanguageContext';
import { BlobProvider } from './BlobContext';
import { UIProvider } from './UIContext';
import { Theme } from './types';
import { ScrollHandler } from './components/ScrollHandler';
import { BackgroundBlob, BackgroundTexture, WorksBlob } from './components/BackgroundElements';
import { Footer } from './components/Footer';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Wrapper component to use useLocation hook for AnimatePresence
const AnimatedRoutes = () => {
  const location = useLocation();

  const element = useRoutes([
    { path: "/", element: <Hero /> },
    { path: "/works", element: <Works /> },
    { path: "/about", element: <About /> },
    { path: "*", element: <NotFound /> }
  ]);

  return (
    <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
      {element && React.cloneElement(element, { key: location.pathname })}
    </AnimatePresence>
  );
};

function AppContent() {
  // Initialize theme directly from localStorage or System Preference
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  // Sync state changes to DOM and LocalStorage and Meta Theme Color
  useEffect(() => {
    const root = window.document.documentElement;

    const updateThemeColor = (color: string) => {
      let meta = document.querySelector('meta[name="theme-color"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'theme-color');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', color);
    };

    if (theme === 'dark') {
      root.classList.add('dark');
      updateThemeColor('#0f172a');
    } else {
      root.classList.remove('dark');
      updateThemeColor('#ffffff');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Force scroll to top on initial mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <HashRouter>
      <ScrollHandler />
        {/* 2. ADD VERCEL COMPONENTS HERE */}
        <Analytics />
        <SpeedInsights />

      <main className="min-h-screen relative font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black overflow-x-hidden">

        {/* Background Blobs Logic */}
        <BackgroundBlob />
        <WorksBlob />

        {/* Subtle noise texture */}
        <BackgroundTexture />

        <Navbar theme={theme} toggleTheme={toggleTheme} />

        {/* Desktop Toggles (Hidden on Mobile) */}
        <LanguageToggle
          className="hidden md:flex scrollbar-compensate-margin"
          theme={theme}
        />
        <ThemeToggle
          currentTheme={theme}
          toggleTheme={toggleTheme}
          className="hidden md:flex scrollbar-compensate-margin"
        />

        {/* Content wrapped in z-10 to stay above the blob */}
        <div className="relative z-10">
          <AnimatedRoutes />
          <Footer />
        </div>
      </main>
    </HashRouter>
  );
}

function App() {
  return (
    <LanguageProvider>
      <BlobProvider>
        <UIProvider>
          <AppContent />
        </UIProvider>
      </BlobProvider>
    </LanguageProvider>
  );
}

export default App;
