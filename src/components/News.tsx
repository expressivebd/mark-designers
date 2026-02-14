'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';

const newsItems = [
  {
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2940',
    date: 'January 15, 2026',
    title: 'Mark Designers Expands Production Capacity',
    excerpt:
      'New state-of-the-art facility increases our daily output and enhances efficiency across all production lines.',
  },
  {
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2940',
    date: 'December 10, 2025',
    title: 'Sustainability Award Recognition',
    excerpt:
      'Honored for outstanding commitment to environmental sustainability and ethical manufacturing practices.',
  },
  {
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2874',
    date: 'November 20, 2025',
    title: 'Partnership with Global Fashion Brands',
    excerpt:
      'Strategic collaborations strengthen our position as a leading garment manufacturer in the international market.',
  },
  {
    image: '/concerns/1.png',
    date: 'October 5, 2025',
    title: 'Innovation in Textile Technology',
    excerpt:
      'Investing in cutting-edge machinery and techniques to deliver superior quality products to our clients.',
  },
];

const News = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Title */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-primary">News & Media</h2>
          <div className="w-24 h-1 bg-accent mx-auto mt-4" />
        </motion.div>

        {/* News Grid - Horizontal scroll on mobile */}
        <div className="overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4 md:overflow-visible">
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 min-w-max md:min-w-0">
            {newsItems.map((news, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-[280px] md:w-auto flex-shrink-0 group cursor-pointer"
              >
                <div className="card overflow-hidden h-full hover:-translate-y-2 transition-all duration-500">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <Image
                      src={news.image}
                      alt={news.title}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Date */}
                    <p className="text-accent text-sm font-medium mb-2 tracking-wide">
                      {news.date}
                    </p>

                    {/* Title */}
                    <h3 className="text-xl font-playfair font-bold text-primary mb-3 group-hover:text-accent transition-colors duration-300 line-clamp-2">
                      {news.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                      {news.excerpt}
                    </p>

                    {/* Read More */}
                    <Link
                      href="/news"
                      className="inline-flex items-center gap-2 text-primary font-medium hover:text-accent transition-colors duration-300 text-sm group/link"
                    >
                      <span>Read More</span>
                      <svg
                        className="w-4 h-4 group-hover/link:translate-x-1 transition-transform"
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
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            href="/news"
            className="btn-primary inline-flex items-center gap-2 group"
          >
            <span>View All News</span>
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

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default News;
