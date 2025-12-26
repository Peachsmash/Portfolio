import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, Variants, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X, ExternalLink, Layers, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useUI } from '../UIContext';
import { SEO } from './SEO';
import { Project } from '../types';

// Tech stack color mapping (matching About section styles)
const techColors: Record<string, string> = {
  'React': 'hover:border-[#61DAFB] dark:hover:border-[#61DAFB]',
  'TypeScript': 'hover:border-[#3178C6] dark:hover:border-[#3178C6]',
  'Tailwind CSS': 'hover:border-[#38BDF8] dark:hover:border-[#38BDF8]',
  'Framer Motion': 'hover:border-[#D946EF] dark:hover:border-[#D946EF]',
  'Node.js': 'hover:border-[#339933] dark:hover:border-[#339933]',
  'Figma': 'hover:border-[#F24E1E] dark:hover:border-[#F24E1E]',
  'Next.js': 'hover:border-black dark:hover:border-white',
  'React Native': 'hover:border-[#61DAFB] dark:hover:border-[#61DAFB]',
  'Redux': 'hover:border-[#764ABC] dark:hover:border-[#764ABC]',
  'D3.js': 'hover:border-[#F9A03C] dark:hover:border-[#F9A03C]',
  'Sanity.io': 'hover:border-[#F03E2F] dark:hover:border-[#F03E2F]',
  'Web WebGL': 'hover:border-[#990000] dark:hover:border-[#ff0000]',
  'Flutter': 'hover:border-[#02569B] dark:hover:border-[#02569B]',
  'Firebase': 'hover:border-[#FFCA28] dark:hover:border-[#FFCA28]',
  'Google Maps API': 'hover:border-[#4285F4] dark:hover:border-[#4285F4]',
  'Gatsby': 'hover:border-[#663399] dark:hover:border-[#663399]',
  'GraphQL': 'hover:border-[#E10098] dark:hover:border-[#E10098]',
  'Netlify': 'hover:border-[#00C7B7] dark:hover:border-[#00C7B7]',
};

// Hardcoded images mapped by ID - Updated to high res for larger cards
export const projectImages: Record<number, string> = {
  1: "/Overload-dc4.png",
  2: "/web_design_portfolio_photo4.webp",
  3: "/web_design_portfolio_photo1.webp",
  4: "/szybka-wymianka5.png", // Added leading slash for absolute path reliability
  5: "/web_design_portfolio_photo3.webp",
  6: "/web_design_portfolio_photo2.webp",
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

// IDs of projects that are currently ongoing
const ongoingIds = [2, 3, 6];

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
      className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
      >
        <X size={24} />
      </button>

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
        
        {images.length > 1 && (
           <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-50 pointer-events-none">
             {images.map((_, i) => (
               <div 
                 key={i}
                 className={`w-2 h-2 rounded-full transition-all duration-300 ${i === index ? 'bg-white scale-125' : 'bg-white/30'}`}
               />
             ))}
           </div>
        )}
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
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, imageSrc, isOngoing, language, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

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
          loading="eager" 
          variants={{
            rest: { scale: isOngoing ? 1.05 : 1 },
            hover: { scale: 1.05 }
          }}
          style={{ 
            x: isOngoing ? 0 : mouseX, 
            y: isOngoing ? 0 : mouseY 
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`absolute inset-0 w-full h-full will-change-transform object-cover object-center ${
            isOngoing ? 'blur-[2px] grayscale brightness-[0.4] opacity-80' : ''
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
  
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Modal State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Gallery State
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

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

  // Handle keyboard events (ESC to close modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close gallery first if open
      if (e.key === 'Escape') {
         if (isGalleryOpen) setIsGalleryOpen(false);
         else if (selectedProject) setSelectedProject(null);
      }
    };
    
    // Manage body lock and context
    if (selectedProject) {
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
  }, [selectedProject, setLightboxOpen, isGalleryOpen]);

  const handleOpenGallery = () => {
    if (!selectedProject) return;
    setIsGalleryOpen(true);
    setGalleryIndex(0);
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
      className="min-h-screen py-24 md:py-32 px-4 md:px-8 max-w-7xl mx-auto"
    >
      <SEO 
        title={`${t.works.title} | Maciej`} 
        description={t.works.p} 
      />

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 w-full max-w-6xl max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl relative flex flex-col scrollbar-hide"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-20 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-black dark:text-white rounded-full p-2 transition-all backdrop-blur-sm"
              >
                <X size={24} />
              </button>

              {/* Header Image (Clickable for Gallery) */}
              <div 
                className="relative w-full aspect-video md:aspect-[21/9] bg-gray-100 dark:bg-gray-800 flex-shrink-0 group cursor-zoom-in overflow-hidden"
                onClick={handleOpenGallery}
              >
                <img 
                  src={projectImages[selectedProject.id]} 
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 transition-opacity group-hover:opacity-70" />
                
                {/* Maximize Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="bg-black/40 backdrop-blur-sm p-4 rounded-full text-white">
                     <Maximize2 size={32} />
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white pointer-events-none">
                  <motion.p 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.2 }}
                     className="text-sm font-mono tracking-wider uppercase opacity-90 mb-2"
                  >
                    {selectedProject.category}
                  </motion.p>
                  <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl md:text-6xl font-bold font-display"
                  >
                    {selectedProject.title}
                  </motion.h2>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 md:p-12 flex flex-col md:flex-row gap-8 md:gap-16">
                <div className="flex-1 space-y-8">
                  {/* Description */}
                  <div>
                    <h3 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
                       {t.works.aboutProject}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base md:text-lg">
                      {selectedProject.description}
                    </p>
                  </div>

                   {/* Tech Stack */}
                  {selectedProject.stack && (
                    <div>
                      <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                        <Layers size={16} />
                        {t.works.technologies}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.stack.map((tech) => (
                          <span 
                            key={tech} 
                            className={`px-3 py-1.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full text-sm font-medium font-mono text-gray-700 dark:text-gray-300 transition-colors duration-300 cursor-default ${techColors[tech] || 'hover:border-gray-400 dark:hover:border-gray-500'}`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar / Actions */}
                <div className="md:w-72 flex-shrink-0 flex flex-col gap-4">
                  {selectedProject.links?.demo && (
                    <a 
                      href={selectedProject.links.demo} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium transition-colors shadow-lg shadow-blue-500/20 text-lg group"
                    >
                      <span>{t.works.visitSite}</span>
                      <ExternalLink size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
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

      {/* Cursor Following Blob (Works Only) - Visible on Desktop */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none hidden md:block"
        style={{
          x: blobX,
          y: blobY,
          zIndex: -1 // Behind content
        }}
        animate={{ opacity: selectedProject ? 0 : 1 }}
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
      
      {/* Reverted to 2-Column Layout */}
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
                setSelectedProject(project);
              }
            }}
          />
        ))}
      </div>
    </motion.section>
  );
};
