import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useBlob } from '../BlobContext';
import { useUI } from '../UIContext';
import { SEO } from './SEO';

export const Hero: React.FC = () => {
  const { t } = useLanguage();
  const { setHovered } = useBlob();
  const { navHoverIndex } = useUI();
  const [isCtaHovered, setIsCtaHovered] = useState(false);

  // Robust mobile check with listener
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

  const greetingLetters = Array.from(t.hero.greeting);

  const greetingContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.025 : 0.1, // Faster stagger on mobile
        delayChildren: isMobile ? 0.1 : 0.2
      }
    }
  };

  const letterVariants: Variants = {
    hidden: {
      y: 20,
      opacity: 0,
      filter: "blur(10px)",
      rotate: 5
    },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // Determine arrow rotation based on hovered nav item
  const getArrowRotation = () => {
    if (navHoverIndex === null) return 0;

    if (isMobile) {
      // Mobile: Nav is at bottom
      // Works (index 0) is Left -> Rotate +45deg (Clockwise points SW)
      // Home (index 1) is Center -> 0deg
      // About (index 2) is Right -> Rotate -45deg (Counter-clockwise points SE)
      if (navHoverIndex === 0) return 45;
      if (navHoverIndex === 2) return -45;
    }

    // Desktop: No rotation
    return 0;
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: isMobile ? 0.3 : 0.5 }}
      className="min-h-screen flex flex-col justify-center items-center text-center px-4 relative overflow-hidden pt-20"
    >
      <SEO
        title="Maciej 'Saplu' Rogowski - Web Designer & Developer"
        description={t.hero.p}
      />
      <div className="z-10 flex flex-col items-center w-full max-w-4xl">
        <h1
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold font-display tracking-tight leading-tight flex flex-col items-center w-full gap-2 md:gap-4 cursor-default"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Animated Greeting */}
          <motion.div
            className="flex flex-wrap justify-center"
            variants={greetingContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {greetingLetters.map((char, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className="inline-block origin-bottom"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.div>

          {/* Title Wrapper with Gradient */}
          <motion.div
            className="font-display bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 bg-clip-text text-transparent select-none py-2"
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            // Adjusted delay on mobile to 0.5s for faster appearance
            transition={{ delay: isMobile ? 0.5 : 2.0, duration: 0.8, ease: "easeOut" }}
          >
            {t.hero.title}
          </motion.div>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          // Reduced delay from 1.4s to 0.9s to appear faster on mobile
          transition={{ delay: isMobile ? 0.9 : 2.5, duration: 0.8 }}
          className="mt-12 md:mt-20 text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-lg mx-auto px-4 font-sans font-medium"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {t.hero.p}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          // Reduced delay from 2.0s to 1.3s to maintain flow
          transition={{ delay: isMobile ? 1.3 : 2.8, duration: 0.8 }}
          className="mt-12 flex flex-col items-center gap-8"
        >
          <Link
            to="/about"
            className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 transition-all duration-300 underline underline-offset-8 decoration-1 decoration-gray-400 dark:decoration-gray-500 hover:decoration-black dark:hover:decoration-white hover:decoration-2"
            onMouseEnter={() => {
              setHovered(true);
              setIsCtaHovered(true);
            }}
            onMouseLeave={() => {
              setHovered(false);
              setIsCtaHovered(false);
            }}
          >
            {t.hero.cta}
          </Link>

          <motion.div
            animate={{
              y: [0, 8, 0],
              rotate: getArrowRotation()
            }}
            transition={{
              y: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              },
              rotate: {
                type: "spring",
                stiffness: 200,
                damping: 20
              }
            }}
            className={`origin-center transition-colors duration-300 ${isCtaHovered ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}
          >
            <ArrowDown size={24} />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};
