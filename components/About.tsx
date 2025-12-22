import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Mail, Phone, ArrowUpRight, Check, Github, Linkedin } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useBlob } from '../BlobContext';
import { SEO } from './SEO';

export const About: React.FC = () => {
  const { t } = useLanguage();
  const { setHovered } = useBlob();
  const [phoneCopied, setPhoneCopied] = useState(false);
  const [emailClicked, setEmailClicked] = useState(false);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText("+48 515964117");
    setPhoneCopied(true);
    setTimeout(() => setPhoneCopied(false), 2000);
  };

  const handleEmailClick = () => {
    setEmailClicked(true);
    setTimeout(() => setEmailClicked(false), 2000);
  };

  // Unified Variants for consistent entrance animations across Stack, Contact, and Socials
  const sectionVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  // Using a strict tween with linear ease prevents any easing curve
  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "tween",
        ease: "linear",
        duration: 0.4
      }
    }
  };

  // Skills with brand color mappings for BORDER only.
  const skills = [
    { name: 'React', borderClass: 'hover:border-[#61DAFB] dark:hover:border-[#61DAFB]' },
    { name: 'TypeScript', borderClass: 'hover:border-[#3178C6] dark:hover:border-[#3178C6]' },
    { name: 'Tailwind CSS', borderClass: 'hover:border-[#38BDF8] dark:hover:border-[#38BDF8]' },
    { name: 'Framer Motion', borderClass: 'hover:border-[#D946EF] dark:hover:border-[#D946EF]' },
    { name: 'Node.js', borderClass: 'hover:border-[#339933] dark:hover:border-[#339933]' },
    { name: 'Design Systems', borderClass: 'hover:border-purple-500 dark:hover:border-purple-500' },
    { name: 'Figma', borderClass: 'hover:border-[#F24E1E] dark:hover:border-[#F24E1E]' },
    { name: 'Next.js', borderClass: 'hover:border-black dark:hover:border-white' }
  ];

  // Social links configuration with styling
  const socialLinks = [
    /*{
      id: 'github',
      label: 'GitHub',
      href: 'https://github.com',
      icon: <Github size={20} />,
      borderClass: 'hover:border-black dark:hover:border-white'
    },*/
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/maciej-rogowski-367436231/',
      icon: <Linkedin size={20} />,
      borderClass: 'hover:border-[#0077b5] dark:hover:border-[#0077b5]'
    },
    /*{
      id: 'x',
      label: 'X / Twitter',
      href: 'https://x.com',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      borderClass: 'hover:border-black dark:hover:border-white'
    }*/
  ];

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
      className="min-h-screen flex items-center justify-center pt-20 pb-32 md:py-28 px-4"
    >
      <SEO
        title={`${t.about.title} | Maciej`}
        description={t.about.p1}
      />
      <div className="max-w-4xl mx-auto text-center relative w-full">
        <h2
          className="text-3xl md:text-5xl lg:text-6xl font-bold font-display mb-8 md:mb-12 tracking-tight"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {t.about.title}
        </h2>

        <div
          className="space-y-6 md:space-y-8 text-lg md:text-xl leading-relaxed text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto font-sans font-medium"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <p>{t.about.p1}</p>
          <p>{t.about.p2}</p>
        </div>

        {/* Stack Section */}
        <div
          className="mb-6"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <h3 className="text-base font-bold font-mono uppercase tracking-widest text-gray-600 dark:text-gray-400 mb-6">{t.about.stack}</h3>
          <motion.div
            className="flex flex-wrap justify-center gap-3"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {skills.map(skill => (
              <motion.span
                key={skill.name}
                variants={itemVariants}
                className={`px-4 py-2 bg-white/40 backdrop-blur-md dark:bg-white/5 border border-gray-400 dark:border-white/30 rounded-full text-base font-medium font-mono text-gray-600 dark:text-gray-400 cursor-default hover:bg-white/60 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all duration-300 ${skill.borderClass}`}
              >
                {skill.name}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Contact Section */}
        <div className="pt-6 border-t border-gray-400 dark:border-white/30 w-full max-w-4xl mx-auto mb-6">
          <h3
            className="text-base font-bold font-mono uppercase tracking-widest text-gray-600 dark:text-gray-400 mb-6"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {t.about.contact}
          </h3>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Email Box */}
            <motion.a
              href="mailto:contact@sapplu.pl"
              onClick={handleEmailClick}
              variants={itemVariants}
              className="relative group overflow-hidden p-4 md:p-5 bg-white/60 backdrop-blur-md dark:bg-white/5 border border-gray-400 dark:border-white/30 rounded-3xl hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-300 flex items-center justify-between focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              aria-label="Email address: contact@sapplu.pl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-white dark:bg-white/10 rounded-2xl text-blue-500 shadow-sm transform-gpu group-hover:scale-110 transition-transform duration-300 ease-out flex-shrink-0">
                <Mail size={24} className="md:w-7 md:h-7" />
              </div>

              <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4">
                <span className="text-xs md:text-sm font-bold font-mono text-gray-400 uppercase tracking-widest mb-1">{t.about.emailLabel}</span>
                <span className="text-lg md:text-xl font-semibold font-mono text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 underline decoration-transparent group-hover:decoration-blue-500/40 underline-offset-4 transition-all duration-300 break-all text-center">contact@sapplu.pl</span>
                <span className="text-xs md:text-sm font-medium font-mono text-gray-400 dark:text-gray-500 mt-1 transition-colors duration-300 group-hover:text-blue-500/80">{t.about.clickToEmail}</span>
              </div>

              <div className="relative z-10 flex-shrink-0">
                {emailClicked ? (
                  <Check className="text-blue-500 transition-all duration-300" size={24} />
                ) : (
                  <ArrowUpRight className="text-gray-300 dark:text-gray-600 group-hover:text-blue-500 transform-gpu group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-300 ease-out" size={24} />
                )}
              </div>
            </motion.a>

            {/* Phone Box */}
            <motion.div
              onClick={handleCopyPhone}
              variants={itemVariants}
              className="relative group overflow-hidden p-4 md:p-5 bg-white/60 backdrop-blur-md dark:bg-white/5 border border-gray-400 dark:border-white/30 rounded-3xl hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors duration-300 flex items-center justify-between cursor-pointer md:flex-row-reverse focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              role="button"
              tabIndex={0}
              aria-label="Phone number: (+48) 515 964 117"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCopyPhone();
                }
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-white dark:bg-white/10 rounded-2xl text-emerald-500 shadow-sm transform-gpu group-hover:scale-110 transition-transform duration-300 ease-out flex-shrink-0">
                <Phone size={24} className="md:w-7 md:h-7 md:scale-x-[-1]" />
              </div>

              <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4">
                <span className="text-xs md:text-sm font-bold font-mono text-gray-400 uppercase tracking-widest mb-1">{t.about.phoneLabel}</span>
                <span className="text-lg md:text-xl font-semibold font-mono text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 underline decoration-transparent group-hover:decoration-emerald-500/40 underline-offset-4 transition-all duration-300 whitespace-nowrap text-center">(+48) 515 964 117</span>
                <span className="text-xs md:text-sm font-medium font-mono text-gray-400 dark:text-gray-500 mt-1 transition-colors duration-300 group-hover:text-emerald-500/80">
                  {phoneCopied ? t.about.copied : t.about.clickToCopy}
                </span>
              </div>

              <div className="relative z-10 flex-shrink-0">
                {phoneCopied ? (
                  <Check className="text-emerald-500 transition-all duration-300" size={24} />
                ) : (
                  <ArrowUpRight className="text-gray-300 dark:text-gray-600 group-hover:text-emerald-500 transform-gpu group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-300 ease-out md:scale-x-[-1]" size={24} />
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Social Section */}
        <div className="pt-6 border-t border-gray-400 dark:border-white/30 w-full max-w-4xl mx-auto">
          <h3
            className="text-base font-bold font-mono uppercase tracking-widest text-gray-600 dark:text-gray-400 mb-6"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {t.about.social}
          </h3>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {socialLinks.map((social) => (
              <motion.a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                className={`flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-md dark:bg-white/5 border border-gray-400 dark:border-white/30 rounded-full transition-all duration-300 group focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${social.borderClass}`}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                <span className="text-gray-900 dark:text-white group-hover:scale-110 transition-transform duration-300 group-hover:text-black dark:group-hover:text-white">
                  {social.icon}
                </span>
                <span className="font-mono text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors group-hover:text-gray-900 dark:group-hover:text-white">
                  {social.label}
                </span>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
