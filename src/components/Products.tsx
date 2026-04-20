'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import Image from 'next/image';

type ProductItem = {
  id?: string;
  name: string;
  description?: string;
  imageUrl: string;
};

const Products = ({ items }: { items?: ProductItem[] }) => {
  const list = items?.length ? items : [];
  const displayProducts = list.slice(0, 12);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="products" className="section-padding bg-white">
      <div className="container-custom">
        {/* Title */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-primary">Our Products</h2>
          <div className="w-24 h-1 bg-accent mx-auto mt-4" />
        </motion.div>

        {/* Products Grid */}
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {displayProducts.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="card overflow-hidden hover-glow">
                  {/* Product Image - 1:1 Aspect Ratio */}
                  <div className="relative aspect-square overflow-hidden bg-blue-200">
                    <Image
                      src={product.imageUrl || '/products/1.png'}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white font-medium">View Details</span>
                    </div>
                  </div>

                  {/* Product Name */}
                  <div className="p-4 text-center">
                    <h3 className="text-lg md:text-xl font-playfair font-semibold text-primary group-hover:text-accent transition-colors duration-300">
                      {product.name}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">Products will appear here once available.</p>
        )}

        {/* View All Button */}
        {displayProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-12"
          >
            <Link
              href="/products"
              className="btn-accent inline-flex items-center gap-2 group"
            >
              <span>View All Products</span>
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
        )}

        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
              onClick={() => setSelectedProduct(null)}
            >
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
                onClick={(event) => event.stopPropagation()}
              >
                {/* Image — natural aspect ratio, no cropping */}
                <div className="relative w-full bg-white">
                  <div className="relative w-full" style={{ paddingBottom: '100%' }}>
                    <Image
                      src={selectedProduct.imageUrl || '/products/1.png'}
                      alt={selectedProduct.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 768px"
                    />
                  </div>
                  {/* Close button — sticky top-right */}
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-primary shadow z-10"
                  >
                    Close
                  </button>
                </div>

                {/* Horizontal divider */}
                <hr className="border-t border-gray-200" />

                {/* Content — this area scrolls with the modal */}
                <div className="p-6 md:p-8">
                  <h3 className="text-2xl md:text-3xl font-playfair font-bold text-primary">
                    {selectedProduct.name}
                  </h3>
                  <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-accent">
                    Product Description
                  </p>
                  <p className="mt-2 text-base leading-relaxed text-gray-700">
                    {selectedProduct.description || 'Product details will be updated soon.'}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Products;
