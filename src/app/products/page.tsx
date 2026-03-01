'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { useState } from 'react';
import SEOHead from '@/components/SEOHead';

interface Product {
    name: string;
    description: string;
    image: string;
    height: string;
}

interface ProductGroup {
    id: string;
    title: string;
    subtitle: string;
    products: Product[];
}

const productGroups: ProductGroup[] = [
    {
        id: 'tops',
        title: 'Tops',
        subtitle: 'T-Shirts, Polo Shirts & Casual Tops',
        products: [
            { name: 'Crew Neck T-Shirt', description: 'Classic cotton crew neck in various fits', image: '/products/1.png', height: 'h-[300px] md:h-[380px]' },
            { name: 'Polo Shirt', description: 'Premium pique polo with embroidered details', image: '/products/2.png', height: 'h-[350px] md:h-[420px]' },
            { name: 'V-Neck T-Shirt', description: 'Slim-fit V-neck in soft jersey fabric', image: '/products/3.png', height: 'h-[280px] md:h-[350px]' },
            { name: 'Henley', description: 'Button placket henley in waffle knit', image: '/products/4.png', height: 'h-[320px] md:h-[400px]' },
            { name: 'Tank Top', description: 'Relaxed fit tank for warm weather', image: '/products/1.png', height: 'h-[260px] md:h-[320px]' },
            { name: 'Long Sleeve Tee', description: 'Essential long sleeve in organic cotton', image: '/products/2.png', height: 'h-[340px] md:h-[390px]' },
        ],
    },
    {
        id: 'outerwear',
        title: 'Outerwear',
        subtitle: 'Hoodies, Jackets & Sweaters',
        products: [
            { name: 'Pullover Hoodie', description: 'Brushed fleece pullover with kangaroo pocket', image: '/products/4.png', height: 'h-[360px] md:h-[430px]' },
            { name: 'Zip-Up Jacket', description: 'Lightweight zip jacket with DWR coating', image: '/products/3.png', height: 'h-[300px] md:h-[370px]' },
            { name: 'Bomber Jacket', description: 'Classic bomber with ribbed cuffs and hem', image: '/products/2.png', height: 'h-[340px] md:h-[410px]' },
            { name: 'Crewneck Sweater', description: 'Fine gauge knit sweater in merino blend', image: '/products/1.png', height: 'h-[280px] md:h-[350px]' },
            { name: 'Windbreaker', description: 'Packable windbreaker with reflective details', image: '/products/4.png', height: 'h-[320px] md:h-[380px]' },
            { name: 'Cardigan', description: 'Chunky knit cardigan with shawl collar', image: '/products/3.png', height: 'h-[350px] md:h-[420px]' },
        ],
    },
    {
        id: 'bottoms',
        title: 'Bottoms',
        subtitle: 'Trousers, Jeans & Shorts',
        products: [
            { name: 'Chino Trousers', description: 'Tailored chinos in stretch cotton twill', image: '/products/2.png', height: 'h-[340px] md:h-[410px]' },
            { name: 'Denim Jeans', description: 'Premium selvedge denim in classic fits', image: '/products/1.png', height: 'h-[360px] md:h-[440px]' },
            { name: 'Cargo Shorts', description: 'Utility cargo shorts with reinforced pockets', image: '/products/4.png', height: 'h-[280px] md:h-[340px]' },
            { name: 'Jogger Pants', description: 'Technical joggers with tapered leg', image: '/products/3.png', height: 'h-[320px] md:h-[380px]' },
            { name: 'Bermuda Shorts', description: 'Classic bermuda in performance fabric', image: '/products/2.png', height: 'h-[260px] md:h-[320px]' },
        ],
    },
    {
        id: 'specialty',
        title: 'Specialty',
        subtitle: 'Activewear, Formal & Casual Collections',
        products: [
            { name: 'Performance Tee', description: 'Moisture-wicking athletic top', image: '/products/3.png', height: 'h-[300px] md:h-[370px]' },
            { name: 'Dress Shirt', description: 'Non-iron dress shirt in fine poplin', image: '/products/1.png', height: 'h-[350px] md:h-[420px]' },
            { name: 'Sports Jacket', description: 'Breathable sports jacket with ventilation', image: '/products/4.png', height: 'h-[330px] md:h-[400px]' },
            { name: 'Linen Shirt', description: 'Relaxed linen shirt for summer', image: '/products/2.png', height: 'h-[290px] md:h-[360px]' },
            { name: 'Track Pants', description: 'Athletic track pants with side stripes', image: '/products/3.png', height: 'h-[340px] md:h-[400px]' },
            { name: 'Blazer', description: 'Unstructured blazer in textured fabric', image: '/products/4.png', height: 'h-[360px] md:h-[430px]' },
        ],
    },
];

function ProductCard({ product }: { product: Product }) {
    const [isActive, setIsActive] = useState(false);

    return (
        <div
            className={`masonry-item relative rounded-xl overflow-hidden group cursor-pointer ${product.height}`}
            onMouseEnter={() => setIsActive(true)}
            onMouseLeave={() => setIsActive(false)}
            onClick={() => setIsActive(!isActive)}
        >
            <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />

            {/* Dark Overlay + Content on Hover/Click */}
            <div
                className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 transition-all duration-400"
                style={{
                    background: isActive
                        ? 'linear-gradient(to top, rgba(26,35,50,0.9) 0%, rgba(26,35,50,0.6) 50%, rgba(26,35,50,0.3) 100%)'
                        : 'transparent',
                }}
            >
                <div
                    className="transition-all duration-400"
                    style={{
                        transform: isActive ? 'translateY(0)' : 'translateY(20px)',
                        opacity: isActive ? 1 : 0,
                    }}
                >
                    <h3 className="text-white text-lg md:text-xl font-playfair font-bold mb-1">
                        {product.name}
                    </h3>
                    <p className="text-white/80 text-sm leading-relaxed">
                        {product.description}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <>
            <SEOHead
                title="Products"
                description="Explore our premium garment collections — T-Shirts, Polo Shirts, Hoodies, Jackets, Jeans, Activewear, and more. Crafted with precision at Mark Designers."
                keywords="garment products, t-shirts, polo shirts, hoodies, jackets, Bangladesh manufacturer"
            />
            <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
                <Image src="/p3.jpg" alt="Our Products" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-black/50" />
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative z-10 text-center"
                >
                    <h1 className="text-4xl md:text-6xl lg:text-8xl font-playfair font-bold text-white">
                        OUR PRODUCTS
                    </h1>
                    <div className="w-24 h-1 bg-accent mx-auto mt-6" />
                    <p className="text-white/80 mt-6 text-lg md:text-xl font-light max-w-2xl mx-auto">
                        Premium garments crafted with precision and passion
                    </p>
                </motion.div>
            </section>

            {/* Quick Navigation */}
            <section className="sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
                <div className="container-custom">
                    <nav className="flex items-center gap-2 py-4 overflow-x-auto hide-scrollbar">
                        {productGroups.map((group) => (
                            <a
                                key={group.id}
                                href={`#${group.id}`}
                                className="flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium text-primary hover:bg-primary hover:text-white transition-all duration-300 border border-gray-200 hover:border-primary"
                            >
                                {group.title}
                            </a>
                        ))}
                    </nav>
                </div>
            </section>

            {/* Product Groups */}
            {productGroups.map((group, groupIndex) => (
                <section
                    key={group.id}
                    id={group.id}
                    className={`section-padding ${groupIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                >
                    <div className="container-custom">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <h2 className="heading-secondary">{group.title}</h2>
                            <p className="text-gray-500 mt-2 text-lg">{group.subtitle}</p>
                            <div className="w-16 h-1 bg-accent mx-auto mt-4" />
                        </motion.div>

                        <div className="masonry-grid">
                            {group.products.map((product, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            ))}
        </>
    );
}
