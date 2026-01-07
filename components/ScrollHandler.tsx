import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Component to handle scroll/touch navigation between pages
export const ScrollHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isNavigating, setIsNavigating] = useState(false);

    // Ref to track when the bottom of the Works page was reached
    const worksBottomReachedRef = useRef<number | null>(null);

    // Disable browser's default scroll restoration to handle it manually
    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
    }, []);

    // Reset navigation lock on route change
    useEffect(() => {
        // Ensure scrolling is blocked immediately upon route change
        setIsNavigating(true);
        worksBottomReachedRef.current = null; // Reset works bottom timer

        // Note: Scroll-to-top logic has been moved to App.tsx (AnimatePresence onExitComplete)
        // to prevent visual jumps during page exit animations.

        // Dynamic timeout: 1s for About page, 0.5s for others
        const timeoutDuration = location.pathname === '/about' ? 1000 : 500;

        const timer = setTimeout(() => setIsNavigating(false), timeoutDuration);

        return () => {
            clearTimeout(timer);
        };
    }, [location.pathname]);

    // Monitor scroll position on Works page to manage the blockade timer
    useEffect(() => {
        const checkBottom = () => {
            // Optimization: Don't run logic on mobile/tablets (width < 1024px)
            if (window.innerWidth < 1024) return;

            if (location.pathname !== '/works') {
                worksBottomReachedRef.current = null;
                return;
            }

            // Use a slightly larger buffer (20px) than the navigation trigger (10px)
            // to start the timer as the user approaches the bottom.
            const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 20;

            if (isBottom) {
                if (worksBottomReachedRef.current === null) {
                    worksBottomReachedRef.current = Date.now();
                }
            } else {
                worksBottomReachedRef.current = null;
            }
        };

        window.addEventListener('scroll', checkBottom);
        checkBottom(); // Initial check

        return () => window.removeEventListener('scroll', checkBottom);
    }, [location.pathname]);

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            // Disable custom scroll navigation on mobile devices and tablets (width < 1024px)
            if (window.innerWidth < 1024) return;

            if (isNavigating) return;

            // DO NOT navigate if the lightbox is open (marked by class on html)
            if (document.documentElement.classList.contains('lightbox-open')) return;

            // Ignore horizontal scrolling
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

            const isTop = window.scrollY <= 5;
            const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;
            const threshold = 10; // Minimum scroll intensity to trigger

            if (Math.abs(e.deltaY) < threshold) return;

            if (location.pathname === '/') {
                // HOME PAGE (1st)
                // Scroll Down -> Works
                if (e.deltaY > 0 && isBottom) {
                    setIsNavigating(true);
                    navigate('/works');
                }
            } else if (location.pathname === '/works') {
                // WORKS PAGE (2nd)
                if (e.deltaY < 0 && isTop) {
                    // Scroll Up -> Home
                    setIsNavigating(true);
                    navigate('/');
                } else if (e.deltaY > 0 && isBottom) {
                    // Scroll Down -> About

                    // Check Blockade
                    const now = Date.now();
                    if (worksBottomReachedRef.current === null) {
                        worksBottomReachedRef.current = now;
                        return; // Block first attempt if not already tracked
                    }

                    // 0.6 second delay (600ms)
                    if (now - worksBottomReachedRef.current < 600) {
                        return;
                    }

                    setIsNavigating(true);
                    navigate('/about');
                }
            } else if (location.pathname === '/about') {
                // ABOUT PAGE (3rd)
                // Scroll Up -> Works
                if (e.deltaY < 0 && isTop) {
                    setIsNavigating(true);
                    navigate('/works');
                }
            }
        };

        // Use passive: false to ensure we can control event flow if needed, 
        // though we are not preventing default here, just capturing.
        // React's event system is passive by default for wheel.
        window.addEventListener('wheel', handleWheel);

        return () => {
            window.removeEventListener('wheel', handleWheel);
        };
    }, [location.pathname, isNavigating, navigate]);

    return null;
};