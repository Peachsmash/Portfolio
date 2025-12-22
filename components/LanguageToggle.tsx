import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../LanguageContext';
import { useUI } from '../UIContext';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { isLightboxOpen } = useUI();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'pl' : 'en');
  };

  return (
    <motion.div
      animate={{
        opacity: isLightboxOpen ? 0 : 1,
        scale: isLightboxOpen ? 0.5 : 1
      }}
      transition={{ duration: 0.3 }}
      className={`fixed z-50 bottom-8 left-4 md:bottom-auto md:top-8 md:left-auto md:right-24 group ${isLightboxOpen ? 'pointer-events-none' : ''}`}
    >
      <button
        onClick={toggleLanguage}
        className="relative p-2 rounded-full bg-white dark:bg-white/10 backdrop-blur-md border border-gray-300 dark:border-gray-600 shadow-xl hover:scale-110 transition-transform active:scale-95 overflow-hidden w-12 h-12 md:w-9 md:h-9 flex items-center justify-center"
        aria-label="Toggle Language"
      >
        <motion.div
          key={language}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center"
        >
          {/* If current language is EN, show PL flag to switch to Polish. 
              If current is PL, show EN flag to switch to English. */}
          {language === 'en' ? (
            <svg
              role="img"
              aria-label="Polish Flag"
              viewBox="0 0 32 20"
              className="w-6 h-auto md:w-5 rounded-[2px] shadow-sm ring-1 ring-black/10"
            >
              <path fill="#ffffff" d="M0 0h32v10H0z" />
              <path fill="#dc143c" d="M0 10h32v10H0z" />
            </svg>
          ) : (
            <svg
              role="img"
              aria-label="UK Flag"
              viewBox="0 0 60 30"
              className="w-6 h-auto md:w-5 rounded-[2px] shadow-sm ring-1 ring-black/10"
            >
              <clipPath id="t">
                <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
              </clipPath>
              <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
              <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
              <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4" />
              <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
              <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
            </svg>
          )}
        </motion.div>
      </button>

      {/* Tooltip: Above on mobile, Below on desktop */}
      <div className="absolute 
        bottom-full mb-3 left-0 
        md:bottom-auto md:mb-0 md:top-full md:mt-3 md:left-1/2 md:-translate-x-1/2 
        px-3 py-1.5 
        bg-white text-gray-900 border border-gray-200
        dark:bg-gray-800 dark:text-white dark:border-gray-700
        text-xs font-medium rounded-lg 
        opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-xl">
        {language === 'en' ? 'Polski' : 'English'}

        {/* Arrow */}
        <div className="absolute w-2 h-2 
          bg-white border-gray-200
          dark:bg-gray-800 dark:border-gray-700
          rotate-45
          -bottom-1 left-5 md:left-auto md:bottom-auto md:-top-1 md:left-1/2 md:-translate-x-1/2 md:border-b-0 md:border-r-0 md:border-t md:border-l">
        </div>
      </div>
    </motion.div>
  );
};
