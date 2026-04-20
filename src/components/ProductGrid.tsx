'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

type ProductItem = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
};

type ProductGridProps = {
  products: ProductItem[];
};

export default function ProductGrid({ products }: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  return (
    <>
      {/* Cards */}
      <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.04 }}
            className="group cursor-pointer"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="card overflow-hidden hover-glow">
              {/* Image — square */}
              <div className="relative aspect-square overflow-hidden bg-blue-200">
                <Image
                  src={product.imageUrl || '/products/1.png'}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-medium">View Details</span>
                </div>
              </div>

              {/* Name */}
              <div className="p-4 text-center">
                <h3 className="text-lg md:text-xl font-playfair font-semibold text-primary group-hover:text-accent transition-colors duration-300">
                  {product.name}
                </h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal — identical to homepage */}
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
              onClick={(e) => e.stopPropagation()}
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
                {/* Close button */}
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-primary shadow z-10"
                >
                  Close
                </button>
              </div>

              {/* Divider */}
              <hr className="border-t border-gray-200" />

              {/* Content */}
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
    </>
  );
}
