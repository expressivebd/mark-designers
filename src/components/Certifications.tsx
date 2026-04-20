'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { useState } from 'react';

type CertificationItem = {
  name: string;
  logo?: string;
  logoUrl?: string;
};

const Certifications = ({ items }: { items?: CertificationItem[] }) => {
  const list = items?.length ? items : [];
  const duplicatedCertifications = [...list, ...list];
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="section-padding bg-slate-50 overflow-hidden">
      <div className="container-custom">
        {/* Title */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-primary">Certifications & Compliance</h2>
          <div className="w-24 h-1 bg-accent mx-auto mt-4" />
          <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
            Our commitment to quality and compliance is recognized globally
          </p>
        </motion.div>
      </div>

      {duplicatedCertifications.length > 0 ? (
        <div className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <motion.div
              className="flex gap-8 pr-8"
              animate={{
                x: isPaused ? undefined : [0, '-50%'],
              }}
              transition={{
                x: {
                  duration: 30,
                  repeat: Infinity,
                  ease: 'linear',
                },
              }}
            >
              {duplicatedCertifications.map((cert, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[200px] h-[120px] bg-white rounded-sm shadow-md hover:shadow-xl transition-all duration-300 flex cursor-pointer items-center justify-center p-6 hover:scale-105"
                  title={cert.name}
                >
                  <Image
                    src={cert.logoUrl || cert.logo || '/certificates/1.png'}
                    alt={cert.name}
                    width={200}
                    height={120}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Gradient Overlays */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none" />
        </div>
      ) : (
        <p className="text-center text-gray-600">Certification logos will appear here once available.</p>
      )}
    </section>
  );
};

export default Certifications;
