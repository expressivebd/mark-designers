'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';

type SustainabilityItem = {
  title: string;
  image?: string;
  imageUrl?: string;
  description: string;
  link: string;
};

const Sustainability = ({ items }: { items?: SustainabilityItem[] }) => {
  const list = items?.length ? items : [];
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
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
          <h2 className="heading-primary">Sustainability</h2>
          <div className="w-24 h-1 bg-accent mx-auto mt-4" />
          <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
            Building a better future through responsible manufacturing
          </p>
        </motion.div>

        {list.length > 0 ? (
          <>
            {/* Desktop: Expandable Panels */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:flex h-[600px] lg:h-[700px] gap-2 rounded-2xl overflow-hidden"
            >
              {list.map((item, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden cursor-pointer group"
                  style={{
                    flex: activeIndex === index ? 3 : activeIndex === null ? 1 : 0.5,
                    transition: 'flex 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {/* Background Image */}
                  <Image
                    src={item.imageUrl || item.image || '/concerns/1.png'}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />

                  {/* Dark Overlay */}
                  <div
                    className="absolute inset-0 transition-all duration-500"
                    style={{
                      background:
                        activeIndex === index
                          ? 'linear-gradient(to top, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.2) 100%)'
                          : 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 100%)',
                    }}
                  />

                  {/* Label (always visible) */}
                  <div
                    className="absolute bottom-6 left-6 right-6 transition-all duration-500"
                    style={{
                      transform: activeIndex === index ? 'translateY(-100px)' : 'translateY(0)',
                      opacity: activeIndex === index ? 0 : 1,
                    }}
                  >
                    <h3 className="text-white text-2xl lg:text-3xl font-playfair font-bold tracking-wider">
                      {item.title}
                    </h3>
                  </div>

                  {/* Expanded Content (visible on hover) */}
                  <div
                    className="absolute bottom-0 left-0 right-0 p-8 lg:p-10 transition-all duration-500"
                    style={{
                      transform: activeIndex === index ? 'translateY(0)' : 'translateY(100%)',
                      opacity: activeIndex === index ? 1 : 0,
                    }}
                  >
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 lg:p-8 shadow-2xl">
                      <h3 className="text-primary text-2xl lg:text-3xl font-playfair font-bold mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-700 text-sm lg:text-base leading-relaxed mb-4">
                        {item.description}
                      </p>
                      <a
                        href={item.link}
                        className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:text-accent transition-colors"
                      >
                        KNOW MORE
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Mobile: Stacked Cards with tap-to-expand */}
            <div className="md:hidden space-y-4">
              {list.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="relative rounded-xl overflow-hidden cursor-pointer"
                  style={{
                    height: activeIndex === index ? '450px' : '200px',
                    transition: 'height 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                >
                  <Image
                    src={item.imageUrl || item.image || '/concerns/1.png'}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Label */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white text-xl font-playfair font-bold tracking-wider">
                        {item.title}
                      </h3>
                      <svg
                        className={`w-5 h-5 text-white transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    {/* Expanded Content */}
                    <div
                      className="overflow-hidden transition-all duration-500"
                      style={{
                        maxHeight: activeIndex === index ? '300px' : '0px',
                        opacity: activeIndex === index ? 1 : 0,
                        marginTop: activeIndex === index ? '12px' : '0px',
                      }}
                    >
                      <div className="bg-white/95 backdrop-blur-sm rounded-lg p-5 shadow-xl">
                        <p className="text-gray-700 text-sm leading-relaxed mb-3">
                          {item.description}
                        </p>
                        <a
                          href={item.link}
                          className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:text-accent transition-colors"
                        >
                          KNOW MORE
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600">Sustainability initiatives will appear here once available.</p>
        )}
      </div>
    </section>
  );
};

export default Sustainability;
