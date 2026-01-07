import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, Variants, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X, Layers, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useUI } from '../UIContext';
import { SEO } from './SEO';
import { Project } from '../types';
import { techStackColors } from '../constants/techStack';
import { projectImages, projectGalleries, ongoingIds } from '../constants/images';

const textItemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  }
};

const viewButtonVariants: Variants = {
  rest: {
    opacity: 0,
    scale: 0.8,
    y: 10,
    x: 0, // Force X stability
    rotate: 0,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  hover: {
    opacity: 1,
    scale: 1,
    y: 0,
    x: 0, // Force X stability
    rotate: 0,
    transition: { type: "spring", stiffness: 400, damping: 25 } // Higher damping to prevent oscillation
  }
};

const modalContainerVariants: Variants = {
  hidden: { scale: 0.95, opacity: 0, y: 20 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 300,
      staggerChildren: 0.08, // Stagger entrance
      delayChildren: 0.2
    }
  },
  exit: {
    scale: 0.98,
    opacity: 0,
    y: 10,
    transition: {
      duration: 0.25,
      ease: "easeInOut",
      when: "afterChildren", // Wait for content to animate out
      staggerChildren: 0.04,
      staggerDirection: -1
    }
  }
};

const modalContentVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 400
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: "blur(4px)",
    transition: { duration: 0.18, ease: "easeIn" }
  }
};

// Animation variants for the grid container
const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

// Animation variants for individual project cards
const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 20
    }
  }
};

interface ImageViewerProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ images, initialIndex, onClose }) => {
  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDirection(1);
    setIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDirection(-1);
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center cursor-default"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
      >
        <X size={24} />
      </button>

      {/* Image Counter Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-black/20 backdrop-blur-md rounded-full text-white font-mono text-sm border border-white/10 pointer-events-none">
        {index + 1} / {images.length}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      <div className="relative w-full h-full flex items-center justify-center p-4 md:p-10" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.img
            key={index}
            src={images[index]}
            custom={direction}
            variants={{
              enter: (direction: number) => ({
                x: direction > 0 ? 1000 : -1000,
                opacity: 0,
                scale: 0.9
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
                scale: 0.9
              })
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;
              if (swipe < -10000) handleNext();
              else if (swipe > 10000) handlePrev();
            }}
            className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
          />
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

interface ProjectCardProps {
  project: Project;
  imageSrc: string;
  isOngoing: boolean;
  language: string;
  onClick: () => void;
  disabled?: boolean;
  index: number;
  variants?: Variants; // Added variants prop
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, imageSrc, isOngoing, language, onClick, disabled, index, variants }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isFirstProject = project.id === 1;

  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  const textContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.05 : 0.1,
        delayChildren: 0.1
      }
    }
  };

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
      className={`group ${isOngoing ? 'cursor-default' : 'cursor-pointer'} ${disabled ? 'pointer-events-none' : ''}`}
      variants={variants} // Use the passed variants for entrance animation
      initial={isOngoing ? "rest" : "rest"} // Ensure correct initial state relative to hover variants
      whileHover={isOngoing ? "rest" : "hover"}
      onClick={onClick}
    >
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        // Removed transform-gpu to prevent potential compositing jitter with absolute children
        className={`w-full aspect-[4/3] overflow-hidden rounded-2xl mb-4 relative shadow-sm hover:shadow-md transition-shadow ${isFirstProject
            ? 'bg-gray-200 dark:bg-white'
            : 'bg-gray-200 dark:bg-gray-800'
          }`}
      >
        <motion.img
          src={imageSrc}
          alt={project.title}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          variants={{
            rest: { scale: 1 },
            hover: { scale: 1.05 }
          }}
          style={{
            x: isOngoing ? 0 : mouseX,
            y: isOngoing ? 0 : mouseY
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`absolute inset-0 w-full h-full will-change-transform object-center ${isFirstProject ? 'object-contain' : 'object-cover'
            } ${isOngoing ? 'blur-[2px] grayscale brightness-[0.4] opacity-80' : ''
            }`}
        />

        {!isOngoing && (
          <>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
            <motion.div
              variants={viewButtonVariants}
              className="absolute bottom-5 right-5 p-3 bg-white text-black rounded-full shadow-xl z-20 flex items-center justify-center pointer-events-none will-change-transform"
              style={{ transform: 'translateZ(0)' }} // Force GPU promotion for stability
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

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Modal State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isTransitioningRef = useRef(false);

  // Gallery State
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Scroll Lock Helpers
  const lockScroll = () => {
    // Calculate scrollbar width to prevent content jump
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    document.body.classList.add('scroll-locked');
    document.documentElement.classList.add('lightbox-open');
  };

  const unlockScroll = () => {
    document.body.classList.remove('scroll-locked');
    document.documentElement.classList.remove('lightbox-open');
    document.documentElement.style.removeProperty('--scrollbar-width');
  };

  // Clean up on unmount to prevent stuck states
  useEffect(() => {
    return () => {
      unlockScroll();
      setLightboxOpen(false);
    };
  }, [setLightboxOpen]);

  // Handle keyboard events (ESC)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isGalleryOpen) setIsGalleryOpen(false);
        else if (selectedProject && !isTransitioning) {
          handleCloseModal();
        }
      }
    };

    if (selectedProject) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, isGalleryOpen, isTransitioning]);

  const handleOpenGallery = () => {
    // Prevent opening if modal is currently transitioning (closing)
    if (isTransitioningRef.current) return;
    if (!selectedProject) return;
    setIsGalleryOpen(true);
    setGalleryIndex(0);
  };

  const handleCloseModal = () => {
    // Prevent closing if we are already transitioning out or if not open
    if (isTransitioning || !selectedProject) return;

    setIsTransitioning(true);
    isTransitioningRef.current = true;

    // Update global UI state immediately so navbar/controls return while modal exits
    setLightboxOpen(false);

    setSelectedProject(null);
  };

  const handleOpenModal = (project: Project) => {
    // Prevent opening if we are transitioning (closing/opening) or already open
    if (isTransitioning || selectedProject) return;

    // Lock immediately
    setIsTransitioning(true);
    isTransitioningRef.current = true;

    lockScroll();
    setLightboxOpen(true);

    setSelectedProject(project);
  };

  const handleModalExitComplete = () => {
    setIsTransitioning(false);
    isTransitioningRef.current = false;
    // Ensure cleanup happens after animation is fully done
    unlockScroll();
  };

  const handleModalEnterComplete = () => {
    // Enable interaction only after entrance animation is done
    setIsTransitioning(false);
    isTransitioningRef.current = false;
  };

  // Prepare images for gallery
  const currentGalleryImages = selectedProject
    ? (projectGalleries[selectedProject.id] || [projectImages[selectedProject.id]])
    : [];

  return (
    <motion.section
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: isMobile ? 0.3 : 0.5, ease: [0.33, 1, 0.68, 1] }}
      className="min-h-screen pt-24 pb-12 md:pt-32 md:pb-16 px-4 md:px-8 max-w-7xl mx-auto"
    >
      <SEO
        title={`${t.works.title} | Maciej 'Saplu' Rogowski - Web Designer & Developer`}
        description={t.works.p}
      />

      {/* Project Details Modal */}
      <AnimatePresence
        onExitComplete={handleModalExitComplete}
      >
        {selectedProject && (
          <motion.div
            key="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: 0.35, ease: "easeInOut", delay: 0.4 } // Delayed to wait for modal content to exit
            }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md pl-4 py-4 cursor-default"
            style={{ paddingRight: 'calc(1rem + var(--scrollbar-width, 0px))' }}
            onClick={handleCloseModal}
          >
            <motion.div
              key={selectedProject.id}
              variants={modalContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onAnimationComplete={handleModalEnterComplete}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 w-full max-w-6xl max-h-[95vh] rounded-3xl shadow-2xl relative flex flex-col overflow-hidden"
              style={{
                WebkitMaskImage: "-webkit-radial-gradient(white, black)", // Fix for corner bleeding
                maskImage: "radial-gradient(white, black)"
              }}
            >
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 z-50 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all shadow-sm group"
              >
                <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>

              <div className="overflow-y-auto flex-1 scrollbar-hide w-full">
                {/* Header Image */}
                <div
                  className="relative w-full aspect-video md:aspect-[21/9] bg-gray-100 dark:bg-gray-800 flex-shrink-0 group cursor-zoom-in overflow-hidden"
                  onClick={handleOpenGallery}
                >
                  <motion.img
                    key={selectedProject.id}
                    src={projectImages[selectedProject.id]}
                    alt={selectedProject.title}
                    initial={{ scale: 1, y: "0%" }}
                    animate={{
                      y: isMobile ? "0%" : ["0%", "-20%", "0%"]
                    }}
                    transition={{
                      duration: 25,
                      ease: "easeInOut",
                      repeat: Infinity
                    }}
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden'
                    }}
                    className="absolute top-0 left-0 w-full min-h-full object-cover object-left-top transform-gpu"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 transition-opacity group-hover:opacity-70 z-10 pointer-events-none" />

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                    <div className="bg-black/60 p-4 rounded-full text-white shadow-sm transform-gpu" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                      <Maximize2 size={32} />
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white pointer-events-none z-20">
                    <motion.p
                      variants={modalContentVariants}
                      className="text-sm font-mono tracking-wider uppercase opacity-90 mb-2"
                    >
                      {selectedProject.category}
                    </motion.p>
                    <motion.h2
                      variants={modalContentVariants}
                      className="text-3xl md:text-6xl font-bold font-display"
                    >
                      {selectedProject.title}
                    </motion.h2>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 md:p-12 flex flex-col md:flex-row gap-8 md:gap-16 items-start">

                  {/* Left Column: Description & Stack */}
                  <div className="flex-1 space-y-8">
                    <motion.div variants={modalContentVariants}>
                      <h3 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
                        {t.works.aboutProject}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base md:text-lg">
                        {selectedProject.description}
                      </p>
                    </motion.div>

                    {selectedProject.stack && (
                      <motion.div variants={modalContentVariants}>
                        <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                          <Layers size={16} />
                          {t.works.technologies}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.stack.map((tech) => (
                            <span
                              key={tech}
                              className={`px-3 py-1.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full text-sm font-medium font-mono text-gray-900 dark:text-gray-100 transition-colors duration-300 cursor-default ${techStackColors[tech] || 'hover:border-gray-400 dark:hover:border-gray-500'}`}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Right Column: Sticky Sidebar (Button Only) */}
                  {selectedProject.links?.demo && (
                    <motion.div
                      variants={modalContentVariants}
                      className="w-full md:w-80 flex-shrink-0 flex flex-col gap-8 md:sticky md:top-8"
                    >
                      <motion.a
                        href={selectedProject.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover="hover"
                        initial="rest"
                        className="relative w-full flex items-center justify-between px-6 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-300"
                      >
                        <motion.div
                          className="absolute inset-0 bg-[linear-gradient(90deg,#60a5fa_0%,#60a5fa_70%,#a855f7_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />

                        <span className="relative z-10 font-display font-bold text-lg tracking-wide group-hover:text-white dark:group-hover:text-white transition-colors duration-300">{t.works.visitSite}</span>

                        <div className="relative z-10 flex items-center justify-center w-10 h-10 bg-white/20 dark:bg-black/10 group-hover:bg-white/20 dark:group-hover:bg-white/20 backdrop-blur-sm rounded-full overflow-hidden transition-colors duration-300">
                          <ArrowUpRight
                            size={22}
                            className="text-white dark:text-gray-900 group-hover:text-white dark:group-hover:text-white transition-colors duration-300"
                          />
                        </div>
                      </motion.a>
                    </motion.div>
                  )}

                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Gallery Overlay */}
      <AnimatePresence>
        {isGalleryOpen && (
          <ImageViewer
            images={currentGalleryImages}
            initialIndex={galleryIndex}
            onClose={() => setIsGalleryOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="mb-12 md:mb-16 text-center md:text-left relative z-10">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold font-display mb-6 tracking-tight">{t.works.title}</h2>
        <div className="h-1 w-20 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto md:mx-0"></div>
        <p className="mt-6 text-gray-600 dark:text-gray-400 max-w-2xl text-lg md:text-xl leading-relaxed mx-auto md:mx-0 font-sans font-medium">
          {t.works.p}
        </p>
      </div>

      <motion.div
        variants={gridContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pb-24 md:pb-8 relative z-10"
      >
        {t.works.projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            imageSrc={projectImages[project.id]}
            isOngoing={ongoingIds.includes(project.id)}
            language={language}
            disabled={!!selectedProject || isTransitioning}
            index={index}
            variants={cardVariants}
            onClick={() => {
              if (!ongoingIds.includes(project.id)) {
                handleOpenModal(project);
              }
            }}
          />
        ))}
      </motion.div>
    </motion.section>
  );
};
