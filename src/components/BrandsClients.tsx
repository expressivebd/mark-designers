'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type ClientItem = {
  name: string;
  logo?: string;
  logoUrl?: string;
};

const MarqueeRow = ({
  items,
  direction,
  isPaused,
}: {
  items: ClientItem[];
  direction: 'left' | 'right';
  isPaused: boolean;
}) => {
  const duplicated = [...items, ...items];

  return (
    <motion.div
      className="flex gap-8 pr-8"
      animate={{
        x: isPaused ? undefined : direction === 'left' ? [0, '-50%'] : ['-50%', 0],
      }}
      transition={{
        x: {
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        },
      }}
    >
      {duplicated.map((client, index) => (
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
  );
};

const BrandsClients = ({ items }: { items?: ClientItem[] }) => {
  const list = items?.length ? items : [];
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
          <h2 className="heading-primary">Clients and Partners</h2>
          <div className="w-24 h-1 bg-accent mx-auto mt-4" />
          <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
            Trusted by leading global brands across multiple continents
          </p>
        </motion.div>
      </div>

      {list.length > 0 ? (
        <div className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col gap-8"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <MarqueeRow items={list} direction="left" isPaused={isPaused} />
            <MarqueeRow items={[...list].reverse()} direction="right" isPaused={isPaused} />
          </motion.div>

          {/* Gradient Overlays */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>
      ) : (
        <p className="text-center text-gray-600">Client and partner logos will appear here once available.</p>
      )}

      {/* Explore All Button */}
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            href="/clients"
            className="btn-primary inline-flex items-center gap-2 group"
          >
            <span>Explore All</span>
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

export default BrandsClients;
