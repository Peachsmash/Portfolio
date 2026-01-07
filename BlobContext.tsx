import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useMotionValue, MotionValue } from 'framer-motion';

interface BlobContextType {
  isHovered: boolean;
  setHovered: (hovered: boolean) => void;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

const BlobContext = createContext<BlobContextType | undefined>(undefined);

export const BlobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isHovered, setHovered] = useState(false);

  // Initialize with center screen coordinates
  const initialX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
  const initialY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;

  const mouseX = useMotionValue(initialX);
  const mouseY = useMotionValue(initialY);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <BlobContext.Provider value={{ isHovered, setHovered, mouseX, mouseY }}>
      {children}
    </BlobContext.Provider>
  );
};

export const useBlob = () => {
  const context = useContext(BlobContext);
  if (!context) throw new Error('useBlob must be used within a BlobProvider');
  return context;
};
