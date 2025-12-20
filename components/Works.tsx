import React, { useRef, useEffect } from 'react';
import { motion, Variants, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { SEO } from './SEO';

// Hardcoded images mapped by ID since translation file only has text
const projectImages: Record<number, string> = {
  1: "https://picsum.photos/800/600?random=1",
  2: "https://picsum.photos/800/600?random=2",
  3: "https://picsum.photos/800/600?random=3",
  4: "https://picsum.photos/800/600?random=4",
  5: "https://picsum.photos/800/600?random=5",
  6: "https://picsum.photos/800/600?random=6",
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

interface ProjectCardProps {
  project: { id: number; title: string; category: string };
  imageSrc: string;
  isOngoing: boolean;
  language: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, imageSrc, isOngoing, language }) => {
  // Ref now points to the image container to localize parallax calculations
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for parallax
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isOngoing || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    
    // Parallax intensity
    x.set(xPct * 20); 
    y.set(yPct * 20);
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
      // Removed 'animate="rest"' to allow whileHover to control the state correctly
    >
      {/* 
        Image Container 
        - aspect-[4/3] enforces ratio
        - relative + overflow-hidden clips the image
        - w-full ensures it takes full grid width
        - Mouse events moved here to limit parallax to image area
      */}
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
            hover: { scale: 1.1 }
          }}
          style={{ 
            x: isOngoing ? 0 : mouseX, 
            y: isOngoing ? 0 : mouseY 
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          // Absolute inset-0 ensures image fills the aspect-ratio container perfectly
          // Enhanced grayed out effect: full grayscale, reduced brightness, slight blur, opacity
          className={`absolute inset-0 object-cover w-full h-full will-change-transform ${
            isOngoing ? 'blur-[2px] grayscale brightness-[0.4] opacity-80' : ''
          }`}
        />

        {!isOngoing && (
          <>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            
            {/* View Project Button Indicator - Position fixed to bottom-right */}
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
          // Dimmed text for ongoing projects
          className={`text-xl md:text-2xl font-bold font-display ${isOngoing ? 'text-gray-400 dark:text-gray-600' : ''}`}
        >
          {project.title}
        </motion.h3>
        <motion.p 
          variants={textItemVariants}
          // Dimmed text for ongoing projects
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

  // Mouse tracking for background blob
  // Initialize at nav position (top center) as requested for page transitions
  const initialX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
  // Approx 60px from top (center of desktop navbar)
  const initialY = 60; 

  const mouseX = useMotionValue(initialX);
  const mouseY = useMotionValue(initialY);
  
  // Tighter spring for faster following (higher stiffness, appropriate damping)
  const springConfig = { damping: 30, stiffness: 500 }; 
  const xSpring = useSpring(mouseX, springConfig);
  const ySpring = useSpring(mouseY, springConfig);

  // Center the blob (400px width/height -> 200px offset)
  // We use useTransform instead of translateX CSS to avoid transform conflicts
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

      {/* Cursor Following Blob (Works Only) - Visible on Desktop */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none hidden md:block"
        style={{
          x: blobX,
          y: blobY,
          zIndex: -1 // Behind content
        }}
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
          />
        ))}
      </div>
    </motion.section>
  );
};