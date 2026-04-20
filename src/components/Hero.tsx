'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

type HeroData = {
  videoUrl: string;
  headlines: string[];
  subheadline: string;
};

const Hero = ({ data }: { data?: HeroData | null }) => {
  const heroHeadlines = data?.headlines?.length
    ? data.headlines
    : ['Welcome to Mark Designers'];
  const heroSubheadline = data?.subheadline || 'Home page content will be updated soon.';
  const heroVideo = data?.videoUrl || '/videos/hero-video.mp4';
  const [currentHeadline, setCurrentHeadline] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeadline((prev) => (prev + 1) % heroHeadlines.length);
    }, 4000); // Change headline every 4 seconds

    return () => clearInterval(interval);
  }, [heroHeadlines.length]);

  // Defer video loading until after the page has fully loaded
  // so it doesn't block LCP or TTI
  useEffect(() => {
    const startVideo = () => {
      const video = videoRef.current;
      if (!video) return;
      video.src = heroVideo;
      video.load();
      video.play().catch(() => {
        // Autoplay blocked — browser will still show poster
      });
    };

    if (document.readyState === 'complete') {
      // Page already loaded; start video after a short yield so paint completes
      const t = setTimeout(startVideo, 200);
      return () => clearTimeout(t);
    }

    window.addEventListener('load', startVideo, { once: true });
    return () => window.removeEventListener('load', startVideo);
  }, [heroVideo]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster="/p1.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center px-4">
        <div className="text-center max-w-5xl">
          {/* Animated Headlines */}
          <div className="h-[200px] md:h-[250px] lg:h-[300px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.h1
                key={currentHeadline}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{
                  duration: 0.8,
                  ease: [0.6, 0.01, 0.05, 0.95],
                }}
                className="text-4xl md:text-6xl lg:text-8xl font-playfair font-bold text-white leading-tight"
              >
                {heroHeadlines[currentHeadline]}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg md:text-xl lg:text-2xl text-white/90 font-light mb-12 max-w-3xl mx-auto"
          >
            {heroSubheadline}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a
              href="#about"
              className="btn-accent px-10 py-4 text-lg hover:scale-105 transition-transform"
            >
              Discover Our Story
            </a>
            <a
              href="#products"
              className="px-10 py-4 text-lg bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-sm font-medium hover:bg-white hover:text-primary transition-all duration-300"
            >
              View Products
            </a>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="flex flex-col items-center gap-2 cursor-pointer"
              onClick={() => {
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="text-white/80 text-sm tracking-widest">SCROLL</span>
              <svg
                className="w-6 h-6 text-white/80"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Subtle parallax effect overlay */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.1 }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        }}
        className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-primary/10 pointer-events-none"
      />
    </section>
  );
};

export default Hero;
