import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { useBlob } from '../BlobContext';
import { SEO } from './SEO';

export const NotFound: React.FC = () => {
    const { t } = useLanguage();
    const { setHovered } = useBlob();

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col justify-center items-center text-center px-4 pt-20"
        >
            <SEO
                title={`${t.notFound.title} | Maciej 'Saplu' Rogowski`}
                description={t.notFound.description}
            />

            <div className="z-10 flex flex-col items-center w-full max-w-lg">
                <motion.h1
                    className="text-8xl md:text-9xl font-bold font-display bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 bg-clip-text text-transparent select-none"
                    initial={{ y: 20, opacity: 0, filter: "blur(10px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    {t.notFound.title}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="mt-6 text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-sans font-medium"
                >
                    {t.notFound.description}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="mt-12"
                >
                    <Link
                        to="/"
                        className="px-8 py-3 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    >
                        {t.notFound.button}
                    </Link>
                </motion.div>
            </div>
        </motion.section>
    );
};