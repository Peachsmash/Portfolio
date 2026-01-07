import React from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

export const Footer = () => {
    const { t } = useLanguage();
    const location = useLocation();

    // Logic: 
    // Mobile: Hidden everywhere except About.
    // Desktop: Always visible.

    const isAbout = location.pathname === '/about';

    return (
        <footer className={`absolute bottom-2 md:bottom-4 left-0 right-0 text-center text-xs text-gray-400 opacity-50 pointer-events-none z-0 pt-[4px] ${!isAbout ? 'hidden md:block' : ''}`}>
            <p className="pointer-events-auto inline-block">
                © {new Date().getFullYear()} {t.footer}
            </p>
        </footer>
    );
};