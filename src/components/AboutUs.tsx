'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import Link from 'next/link';

type StatItem = { number: number; suffix: string; label: string };

const AboutUs = ({ text, stats }: { text?: string; stats?: StatItem[] }) => {
  const aboutText = text || 'About section content will be available soon.';
  const aboutStats = stats?.length ? stats : [];
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <section id="about" className="section-padding bg-white">
      <div className="container-custom">
        {/* Title */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-primary">About Us</h2>
          <div className="w-24 h-1 bg-accent mx-auto mt-4" />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          <p className="text-body text-lg md:text-xl leading-relaxed">
            {aboutText}
          </p>
        </motion.div>

        {/* Stats */}
        {aboutStats.length > 0 ? (
          <div
            ref={statsRef}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {aboutStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="aspect-square rounded-2xl border-2 border-gray-200 p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col items-center justify-center bg-white hover:border-primary">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-primary mb-3">
                    {statsInView && (
                      <CountUp
                        end={stat.number}
                        duration={2.5}
                        separator="," 
                        suffix={stat.suffix}
                      />
                    )}
                  </div>
                  <p className="text-primary font-medium text-xs sm:text-sm md:text-base tracking-wide leading-tight">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p
            ref={statsRef}
            className="text-center text-gray-600"
          >
            Key achievements will appear here once available.
          </p>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={statsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <Link
            href="/about"
            className="btn-primary inline-flex items-center gap-2 group"
          >
            <span>More</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;
