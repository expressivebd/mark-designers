'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import Image from 'next/image';

type ProductItem = {
  id?: string;
  name: string;
  description?: string;
  imageUrl: string;
};

const defaultProducts: ProductItem[] = [
  {
    name: 'T-Shirts',
    imageUrl: '/products/1.png',
  },
  {
    name: 'Polo Shirts',
    imageUrl: '/products/2.png',
  },
  {
    name: 'Dress Shirts',
    imageUrl: '/products/3.png',
  },
  {
    name: 'Hoodies',
    imageUrl: '/products/4.png',
  },
  {
    name: 'Jackets',
    imageUrl: '/products/4.png',
  },
  {
    name: 'Sweaters',
    imageUrl: '/products/3.png',
  },
  {
    name: 'Trousers',
    imageUrl: '/products/2.png',
  },
  {
    name: 'Jeans',
    imageUrl: '/products/1.png',
  },
  {
    name: 'Shorts',
    imageUrl: '/products/1.png',
  },
  {
    name: 'Activewear',
    imageUrl: '/products/2.png',
  },
  {
    name: 'Formal Wear',
    imageUrl: '/products/3.png',
  },
  {
    name: 'Casual Wear',
    imageUrl: '/products/4.png',
  },
];

const Products = ({ items }: { items?: ProductItem[] }) => {
  const list = items || defaultProducts;
  const displayProducts = list.slice(0, 12);
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {displayProducts.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group cursor-pointer"
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
                  <p className="mt-2 text-sm text-gray-600">{product.description || 'Premium quality product.'}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
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
      </div>
    </section>
  );
};

export default Products;
