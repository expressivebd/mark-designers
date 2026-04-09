'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { useState } from 'react';

type ClientItem = {
  name: string;
  logo?: string;
  logoUrl?: string;
};

const defaultClients: ClientItem[] = [
  { name: 'a', logo: '/brands/1.png' },
  { name: 'b', logo: '/brands/2.png' },
  { name: 'c', logo: '/brands/3.png' },
  { name: 'd', logo: '/brands/4.png' },
  { name: 'e', logo: '/brands/5.png' },
  { name: 'f', logo: '/brands/6.png' },
  { name: 'g', logo: '/brands/7.png' },
  { name: 'h', logo: '/brands/8.png' },
  { name: 'i', logo: '/brands/9.png' },
  { name: 'j', logo: '/brands/10.png' },
];

const BrandsClients = ({ items }: { items?: ClientItem[] }) => {
  const list = items?.length ? items : defaultClients;
  const duplicatedClients = [...list, ...list];
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="section-padding bg-white overflow-hidden">
      <div className="container-custom">
        {/* Title */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-primary">Our Clients & Partners</h2>
          <div className="w-24 h-1 bg-accent mx-auto mt-4" />
          <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
            Trusted by leading global brands across multiple continents
          </p>
        </motion.div>
      </div>

      {/* Scrolling Carousel - Left to Right */}
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
              x: isPaused ? undefined : ['-50%', 0],
            }}
            transition={{
              x: {
                duration: 30,
                repeat: Infinity,
                ease: 'linear',
              },
            }}
          >
            {duplicatedClients.map((client, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[200px] h-[120px] bg-slate-50 rounded-sm shadow-md hover:shadow-xl transition-all duration-300 flex cursor-pointer items-center justify-center border border-slate-100 p-6 hover:scale-105"
                title={client.name}
              >
                <Image
                  src={client.logoUrl || client.logo || '/brands/1.png'}
                  alt={client.name}
                  width={200}
                  height={120}
                  className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Gradient Overlays */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>
    </section>
  );
};

export default BrandsClients;
