'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import Image from 'next/image';

type SisterConcernItem = {
  id?: string;
  name: string;
  tagline?: string;
  thumbnailUrl?: string;
  image?: string;
  description: string;
  link?: string;
};

const SisterConcerns = ({ items }: { items?: SisterConcernItem[] }) => {
  const list = items?.length ? items : [];
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="section-padding bg-slate-50">
      <div className="container-custom">
        {/* Title */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-primary">Sister Concerns</h2>
          <div className="w-24 h-1 bg-accent mx-auto mt-4" />
        </motion.div>

        {/* Cards */}
        {list.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {list.map((concern, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -100 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                  ease: [0.6, 0.01, 0.05, 0.95],
                }}
                className="group"
              >
                <div className="card overflow-hidden h-[500px] md:h-[600px] flex flex-col hover:-translate-y-2 transition-all duration-500">
                  {/* Image */}
                  <div className="relative h-[60%] overflow-hidden">
                    <Image
                      src={concern.thumbnailUrl || concern.image || '/concerns/1.png'}
                      alt={concern.name}
                      width={600}
                      height={800}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-8 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-playfair font-bold text-primary mb-4 group-hover:text-accent transition-colors duration-300">
                        {concern.name}
                      </h3>
                      <p className="text-gray-600 leading-relaxed line-clamp-2">
                        {concern.tagline || 'Tagline will be updated soon.'}
                      </p>
                    </div>

                    <Link
                      href={concern.link || '/sister-concerns'}
                      className="inline-flex items-center gap-2 text-primary font-medium hover:text-accent transition-colors duration-300 group/link mt-6"
                    >
                      <span>Know More</span>
                      <svg
                        className="w-5 h-5 group-hover/link:translate-x-1 transition-transform"
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
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">Sister concerns will appear here once published.</p>
        )}
      </div>
    </section>
  );
};

export default SisterConcerns;
