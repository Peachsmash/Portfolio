import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BlobContextType {
  isHovered: boolean;
  setHovered: (hovered: boolean) => void;
}

const BlobContext = createContext<BlobContextType | undefined>(undefined);

export const BlobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isHovered, setHovered] = useState(false);
  
  return (
    <BlobContext.Provider value={{ isHovered, setHovered }}>
      {children}
    </BlobContext.Provider>
  );
};

export const useBlob = () => {
  const context = useContext(BlobContext);
  if (!context) throw new Error('useBlob must be used within a BlobProvider');
  return context;
};