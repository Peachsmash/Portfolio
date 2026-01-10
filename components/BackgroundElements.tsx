import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useBlob } from '../BlobContext';
import { useUI } from '../UIContext';

// Component for the background blob logic (Home/About)
export const BackgroundBlob = () => {
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

  // On mobile, the blob should ALWAYS be visible (permanently displayed).
  // On desktop, it should hide when on the Works page (because WorksBlob takes over).
  const shouldHide = !isMobile && isWorksPage;

  return (
    <>
      {/* Main Central Blob (Home & About & Mobile Works) */}
      <motion.div
        className="fixed inset-0 flex items-center justify-center pointer-events-none z-0"
        initial={{
          opacity: isMobile ? 1 : 0, // Instantly visible on mobile
          scale: isMobile ? 1 : 0.8
        }}
        animate={{
          opacity: shouldHide ? 0 : 1,
          scale: shouldHide ? 0.9 : 1
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
          initial={{
             width: baseSize,
             height: baseSize,
             rotate: 0
          }}
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

// Component for the cursor-following blob on the Works page
export const WorksBlob = () => {
  const location = useLocation();
  const { mouseX, mouseY } = useBlob();
  const { isLightboxOpen } = useUI();
  const isWorksPage = location.pathname === '/works';

  const springConfig = { damping: 30, stiffness: 500 };
  const xSpring = useSpring(mouseX, springConfig);
  const ySpring = useSpring(mouseY, springConfig);

  const blobX = useTransform(xSpring, value => value - 200);
  const blobY = useTransform(ySpring, value => value - 200);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none hidden md:block"
      style={{
        x: blobX,
        y: blobY,
        zIndex: 0
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isWorksPage && !isLightboxOpen ? 1 : 0 }}
      transition={{
        opacity: {
          duration: 0.6,
          // Add delay only when appearing (entering Works page) to allow page transition to settle.
          // No delay when exiting so it disappears immediately.
          delay: isWorksPage ? 0.45 : 0,
          ease: "easeOut"
        }
      }}
    >
        <motion.div
          className="w-[400px] h-[400px] rounded-full blur-[80px] bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 opacity-30 mix-blend-multiply dark:mix-blend-screen"
          animate={{ rotate: 360 }}
          transition={{ rotate: { duration: 25, ease: "linear", repeat: Infinity } }}
        />
    </motion.div>
  );
};

// Component for the subtle background texture
export const BackgroundTexture = () => (
  <div
    className="fixed inset-0 z-[1] pointer-events-none opacity-[0.03] dark:opacity-[0.06] mix-blend-overlay"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }}
  />
);
