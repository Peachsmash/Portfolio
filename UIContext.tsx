import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
  isLightboxOpen: boolean;
  setLightboxOpen: (open: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLightboxOpen, setLightboxOpen] = useState(false);
  
  return (
    <UIContext.Provider value={{ isLightboxOpen, setLightboxOpen }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within a UIProvider');
  return context;
};
