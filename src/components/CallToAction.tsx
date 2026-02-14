'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';

const CallToAction = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <section className="section-padding bg-slate-50">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-primary p-12 md:p-16 lg:p-20 shadow-2xl"
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 text-center max-w-4xl mx-auto">
            {/* Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-white mb-6">
              Ready to Partner with Excellence?
            </h2>

            {/* Description */}
            <p className="text-base md:text-lg lg:text-xl text-white/95 font-light mb-10 leading-relaxed">
              Join hundreds of global brands who trust Mark Designers for premium garment manufacturing. Let&apos;s create something exceptional together.
            </p>

            {/* CTA Button */}
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-10 py-4 bg-white text-primary rounded-full font-semibold text-lg hover:bg-gray-50 transition-all duration-300 hover:shadow-xl hover:scale-105 group"
            >
              <span>Get in Touch</span>
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
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
