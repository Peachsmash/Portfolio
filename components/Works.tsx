import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, Variants, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useUI } from '../UIContext';
import { SEO } from './SEO';
// Hardcoded images mapped by ID
export const projectImages: Record<number, string> = {
  1: "/Overload-dc4.png",
  2: "/IMG_8036.JPEG",
  3: "/IMG_8011.JPEG",
  4: "/szybka-wymianka5.png", // Added leading slash for absolute path reliability
  5: "/IMG_8021.JPEG",
  6: "/IMG_8031.JPEG",
};

// Gallery images for the lightbox carousel
// Only Project 1 has a carousel with multiple images
export const projectGalleries: Record<number, string[]> = {
  1: [
    "/Overload-dc4.png",
    "/Overload-dc6.png",
    "/Overload-dc5.png"
  ]
};

const getProjectGallery = (id: number): string[] => {
  return projectGalleries[id] || [projectImages[id]];
};

// IDs of projects that are currently ongoing
const ongoingIds = [2, 3, 6];

const textContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const textItemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  }
};

const viewButtonVariants: Variants = {
  rest: { opacity: 0, scale: 0.5, y: 20 },
  hover: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 25 }
  }
};

// Carousel Variants
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.95
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.95
  })
};

interface ProjectCardProps {
  project: { id: number; title: string; category: string };
  imageSrc: string;
  isOngoing: boolean;
  language: string;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, imageSrc, isOngoing, language, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isOngoing || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;

    x.set(xPct * 6);
    y.set(yPct * 6);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={`group ${isOngoing ? 'cursor-default' : 'cursor-pointer'}`}
      initial="rest"
      whileHover={isOngoing ? "rest" : "hover"}
      onClick={onClick}
    >
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full aspect-[4/3] overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-800 mb-4 relative shadow-sm hover:shadow-md transition-shadow transform-gpu"
      >
        <motion.img
          src={imageSrc}
          alt={project.title}
          loading="lazy"
          variants={{
            rest: { scale: isOngoing ? 1.05 : 1 },
            hover: { scale: 1.05 }
          }}
          style={{
            x: isOngoing ? 0 : mouseX,
            y: isOngoing ? 0 : mouseY
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`absolute inset-0 w-full h-full will-change-transform ${project.id === 4 ? 'object-fill' :
            project.id === 1 ? 'object-contain bg-gray-50' :
              'object-cover object-center'
            } ${isOngoing ? 'blur-[2px] grayscale brightness-[0.4] opacity-80' : ''
            }`}
        />

        {!isOngoing && (
          <>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            <motion.div
              variants={viewButtonVariants}
              className="absolute bottom-5 right-5 p-3 bg-white text-black rounded-full shadow-xl z-20 flex items-center justify-center"
            >
              <ArrowUpRight size={20} />
            </motion.div>
          </>
        )}

        {isOngoing && (
          <>
            <div
              className="absolute inset-0 z-[1] opacity-70 pointer-events-none mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center z-10 p-4">
              <motion.div
                initial={{ opacity: 0.8 }}
                animate={{
                  opacity: [0.8, 1, 0.8],
                  scale: [1, 1.03, 1]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg shadow-lg"
              >
                <span className="text-white/90 font-mono text-sm md:text-base uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-400/80 shadow-[0_0_8px_rgba(250,204,21,0.4)]" />
                  {language === 'pl' ? 'W REALIZACJI' : 'ONGOING PROJECT'}
                </span>
              </motion.div>
            </div>
            <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center pointer-events-none">
              <p className="text-[10px] font-mono text-white/50 tracking-wider uppercase bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/5">
                {language === 'pl' ? 'ZDJĘCIE POGLĄDOWE • PRACA W TOKU' : 'PLACEHOLDER PHOTO • WORK IN PROGRESS'}
              </p>
            </div>
          </>
        )}
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        variants={textContainerVariants}
      >
        <motion.h3
          variants={textItemVariants}
          className={`text-xl md:text-2xl font-bold font-display ${isOngoing ? 'text-gray-400 dark:text-gray-600' : ''}`}
        >
          {project.title}
        </motion.h3>
        <motion.p
          variants={textItemVariants}
          className={`text-sm md:text-base mt-1 font-mono ${isOngoing ? 'text-gray-400 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'}`}
        >
          {project.category}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export const Works: React.FC = () => {
  const { t, language } = useLanguage();
  const { setLightboxOpen } = useUI();

  // Lightbox State: project ID, current image index, and animation direction
  const [lightboxState, setLightboxState] = useState<{ id: number; index: number; direction: number } | null>(null);

  const initialX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
  const initialY = 60;

  const mouseX = useMotionValue(initialX);
  const mouseY = useMotionValue(initialY);

  const springConfig = { damping: 30, stiffness: 500 };
  const xSpring = useSpring(mouseX, springConfig);
  const ySpring = useSpring(mouseY, springConfig);

  const blobX = useTransform(xSpring, value => value - 200);
  const blobY = useTransform(ySpring, value => value - 200);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Handle navigation
  const paginate = useCallback((newDirection: number) => {
    if (!lightboxState) return;
    const gallery = getProjectGallery(lightboxState.id);
    let newIndex = lightboxState.index + newDirection;

    if (newIndex < 0) newIndex = gallery.length - 1;
    if (newIndex >= gallery.length) newIndex = 0;

    setLightboxState({ ...lightboxState, index: newIndex, direction: newDirection });
  }, [lightboxState]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxState) return;
      if (e.key === 'Escape') setLightboxState(null);
      if (e.key === 'ArrowRight') paginate(1);
      if (e.key === 'ArrowLeft') paginate(-1);
    };

    if (lightboxState) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.classList.add('lightbox-open');
      setLightboxOpen(true);
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.classList.remove('lightbox-open');
      setLightboxOpen(false);
      window.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.classList.remove('lightbox-open');
      setLightboxOpen(false);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxState, setLightboxOpen, paginate]);

  // Current active data
  const currentGallery = lightboxState ? getProjectGallery(lightboxState.id) : [];
  const currentImageSrc = lightboxState ? currentGallery[lightboxState.index] : '';

  return (
    <motion.section
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
      className="min-h-screen py-24 md:py-32 px-4 md:px-8 max-w-7xl mx-auto"
    >
      <SEO
        title={`${t.works.title} | Maciej`}
        description={t.works.p}
      />

      {/* Lightbox / Full Screen Image Modal */}
      <AnimatePresence>
        {lightboxState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-0 md:p-8"
            onClick={() => setLightboxState(null)}
          >
            {/* Image Container */}
            <div
              className="relative w-full h-full flex items-center justify-center overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button - Moved inside container */}
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxState(null); }}
                className="absolute top-4 right-4 md:top-0 md:right-0 bg-black/40 hover:bg-black/60 text-white/80 hover:text-white rounded-full p-2 transition-all z-[60] backdrop-blur-sm border border-white/10"
                aria-label="Close"
              >
                <X size={24} />
              </button>

              {/* Navigation Buttons (Only if multiple images) - Moved inside container */}
              {currentGallery.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                    className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/50 text-white/70 hover:text-white rounded-full p-3 transition-all z-[60] backdrop-blur-sm border border-white/5 hover:border-white/20"
                    aria-label="Previous Image"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); paginate(1); }}
                    className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/50 text-white/70 hover:text-white rounded-full p-3 transition-all z-[60] backdrop-blur-sm border border-white/5 hover:border-white/20"
                    aria-label="Next Image"
                  >
                    <ChevronRight size={32} />
                  </button>
                </>
              )}

              <AnimatePresence initial={false} custom={lightboxState.direction} mode="popLayout">
                <motion.img
                  key={currentImageSrc}
                  src={currentImageSrc}
                  custom={lightboxState.direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  alt="Project View"
                  className="max-w-full max-h-[85vh] md:max-h-[90vh] object-contain shadow-2xl absolute"
                />
              </AnimatePresence>

              {/* Counter Indicator */}
              {currentGallery.length > 1 && (
                <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 z-[60]">
                  <span className="text-white/90 font-mono text-sm">
                    {lightboxState.index + 1} / {currentGallery.length}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cursor Following Blob (Works Only) - Visible on Desktop */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none hidden md:block"
        style={{
          x: blobX,
          y: blobY,
          zIndex: -1 // Behind content
        }}
        animate={{ opacity: lightboxState ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="w-[400px] h-[400px] rounded-full blur-[80px] bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 opacity-30 mix-blend-multiply dark:mix-blend-screen"
          animate={{ rotate: 360 }}
          transition={{ rotate: { duration: 25, ease: "linear", repeat: Infinity } }}
        />
      </motion.div>

      <div className="mb-12 md:mb-16 text-center md:text-left relative z-10">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold font-display mb-6 tracking-tight">{t.works.title}</h2>
        <div className="h-1 w-20 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto md:mx-0"></div>
        <p className="mt-6 text-gray-600 dark:text-gray-400 max-w-2xl text-lg md:text-xl leading-relaxed mx-auto md:mx-0 font-sans font-medium">
          {t.works.p}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pb-24 md:pb-20 relative z-10">
        {t.works.projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            imageSrc={projectImages[project.id]}
            isOngoing={ongoingIds.includes(project.id)}
            language={language}
            onClick={() => {
              if (!ongoingIds.includes(project.id)) {
                setLightboxState({ id: project.id, index: 0, direction: 0 });
              }
            }}
          />
        ))}
      </div>
    </motion.section>
  );
};
