import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
}

// Comprehensive list of high-value keywords for SEO positioning
const GLOBAL_KEYWORDS = [
  // English - Core Competencies
  "Web Design", "Web Development", "UI/UX Design", "User Interface", "User Experience",
  "Frontend Developer", "React Developer", "Creative Developer", "Full Stack Developer",
  "Product Design", "Interactive Design", "Motion Design", "Animation", "Visual Identity",

  // English - Technical Stack & Attributes
  "React", "TypeScript", "Next.js", "Tailwind CSS", "Framer Motion", "JavaScript",
  "HTML5", "CSS3", "Node.js", "SPA", "PWA", "Responsive Design", "Mobile First",
  "Accessible Web Design", "WCAG", "SEO Optimization", "Performance Optimization",
  "Fast Loading Websites", "Clean Code",

  // Polish - Core Competencies (Projektowanie & Programowanie)
  "Projektowanie Stron WWW", "Tworzenie Stron Internetowych", "Strony WWW",
  "Web Designer Polska", "Programista Frontend", "Programista React",
  "Nowoczesne Strony Internetowe", "Responsywne Strony WWW", "Strony Mobilne",
  "Projektowanie UI", "Projektowanie UX", "Interfejsy Użytkownika",
  "Doświadczenia Użytkownika", "Grafika Komputerowa", "Identyfikacja Wizualna",

  // Polish - Services & Attributes
  "Freelancer", "Usługi Programistyczne", "Portfolio WWW", "Agencja Interaktywna",
  "Pozycjonowanie Stron", "Optymalizacja SEO", "Szybkie Strony WWW",
  "Kodowanie Stron", "Aplikacje Internetowe", "Rozwój Oprogramowania",
  "Budowa Stron", "Indywidualne Projekty", "Wizytówki Internetowe"
].join(", ");

export const SEO: React.FC<SEOProps> = ({ title, description, image }) => {
  const location = useLocation();

  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // Helper function to safely update or create meta tags in the <head>
    const updateMeta = (attributeName: string, attributeValue: string, content: string) => {
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    updateMeta('name', 'description', description);
    updateMeta('name', 'keywords', GLOBAL_KEYWORDS);
    updateMeta('name', 'author', "Maciej 'Saplu' Rogowski");
    updateMeta('name', 'robots', 'index, follow');
    updateMeta('name', 'viewport', 'width=device-width, initial-scale=1.0');

    // 3. Open Graph (Facebook, LinkedIn, Discord, etc.)
    const currentUrl = window.location.href;
    updateMeta('property', 'og:type', 'website');
    updateMeta('property', 'og:url', currentUrl);
    updateMeta('property', 'og:title', title);
    updateMeta('property', 'og:description', description);
    updateMeta('property', 'og:locale', 'pl_PL');
    updateMeta('property', 'og:site_name', "Maciej 'Saplu' Rogowski - Portfolio");

    // Add OG Image if provided, otherwise you might want a default fallback here
    if (image) {
      updateMeta('property', 'og:image', image);
    }

    // 4. Twitter Card Tags
    updateMeta('name', 'twitter:card', 'summary_large_image');
    updateMeta('name', 'twitter:url', currentUrl);
    updateMeta('name', 'twitter:title', title);
    updateMeta('name', 'twitter:description', description);

    if (image) {
      updateMeta('name', 'twitter:image', image);
    }

    // 5. Canonical Link (Prevents duplicate content issues)
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', currentUrl);

  }, [title, description, image, location]);

  return null;
};