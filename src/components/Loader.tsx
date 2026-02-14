'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoaderProps {
  onLoadingComplete: () => void;
}

const Loader = ({ onLoadingComplete }: LoaderProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Force loader to show for 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onLoadingComplete();
      }, 600); // Wait for exit animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-primary"
        >
          <div className="text-center">
            {/* Mark Designers - First Line */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold text-white tracking-wide">
                Mark Designers
              </h1>
            </motion.div>

            {/* Limited - Second Line */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
              className="overflow-hidden mt-2"
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold text-white tracking-wide">
                Limited
              </h1>
            </motion.div>

            {/* Since 1995 - Third Line (comes from bottom) */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2, ease: [0.6, 0.01, 0.05, 0.95] }}
              className="overflow-hidden mt-8"
            >
              <p className="text-2xl md:text-3xl lg:text-4xl font-inter font-light text-accent tracking-widest">
                SINCE 1995
              </p>
            </motion.div>

            {/* Decorative line */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '200px' }}
              transition={{ duration: 0.8, delay: 1.8 }}
              className="h-[1px] bg-accent mx-auto mt-8"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
