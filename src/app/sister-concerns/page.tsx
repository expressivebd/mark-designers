'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';

const concerns = [
    {
        name: 'Mark Designers Limited',
        slug: 'mark-designers',
        image: '/p1.jpg',
        description: 'Our flagship manufacturing facility, operational since 1995. Specializing in premium woven and knit garments for leading international brands.',
        location: 'Gazipur, Dhaka',
        established: '1995',
        capacity: '15,000 pcs/day',
        personnel: '3,000+',
    },
    {
        name: 'Mark Wear Limited',
        slug: 'mark-wear',
        image: '/p2.jpg',
        description: 'Established to meet growing demand, specializing in contemporary fashion, casualwear, and active lifestyle garments.',
        location: 'Narayanganj, Dhaka',
        established: '2005',
        capacity: '18,000 pcs/day',
        personnel: '3,500+',
    },
    {
        name: 'Mark 2000 Limited',
        slug: 'mark-2000',
        image: '/p3.jpg',
        description: 'Our newest and most advanced facility, focusing on technical and performance apparel with cutting-edge automation.',
        location: 'Savar, Dhaka',
        established: '2012',
        capacity: '12,000 pcs/day',
        personnel: '2,500+',
    },
];

export default function SisterConcernsPage() {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <>
            {/* Hero Section */}
            <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
                <Image
                    src="/p2.jpg"
                    alt="Sister Concerns"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/50" />
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative z-10 text-center"
                >
                    <h1 className="text-4xl md:text-6xl lg:text-8xl font-playfair font-bold text-white tracking-tight">
                        SISTER CONCERNS
                    </h1>
                    <div className="w-24 h-1 bg-accent mx-auto mt-6" />
                    <p className="text-white/80 mt-6 text-lg md:text-xl max-w-2xl mx-auto font-light">
                        Three state-of-the-art production facilities working in harmony
                    </p>
                </motion.div>
            </section>

            {/* Concerns Grid */}
            <section className="section-padding bg-white">
                <div className="container-custom" ref={ref}>
                    <div className="space-y-24">
                        {concerns.map((concern, index) => (
                            <motion.div
                                key={concern.slug}
                                initial={{ opacity: 0, y: 50 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.7, delay: index * 0.2 }}
                                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                                    } gap-8 lg:gap-16 items-center`}
                            >
                                {/* Image */}
                                <div className="w-full lg:w-1/2 relative h-[350px] md:h-[450px] rounded-2xl overflow-hidden group">
                                    <Image
                                        src={concern.image}
                                        alt={concern.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                </div>

                                {/* Content */}
                                <div className="w-full lg:w-1/2 space-y-6">
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-primary">
                                        {concern.name}
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed text-lg">
                                        {concern.description}
                                    </p>

                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 rounded-xl p-4">
                                            <p className="text-accent text-sm font-semibold tracking-wider mb-1">ESTABLISHED</p>
                                            <p className="text-primary text-xl font-playfair font-bold">{concern.established}</p>
                                        </div>
                                        <div className="bg-slate-50 rounded-xl p-4">
                                            <p className="text-accent text-sm font-semibold tracking-wider mb-1">LOCATION</p>
                                            <p className="text-primary text-lg font-semibold">{concern.location}</p>
                                        </div>
                                        <div className="bg-slate-50 rounded-xl p-4">
                                            <p className="text-accent text-sm font-semibold tracking-wider mb-1">CAPACITY</p>
                                            <p className="text-primary text-xl font-playfair font-bold">{concern.capacity}</p>
                                        </div>
                                        <div className="bg-slate-50 rounded-xl p-4">
                                            <p className="text-accent text-sm font-semibold tracking-wider mb-1">PERSONNEL</p>
                                            <p className="text-primary text-xl font-playfair font-bold">{concern.personnel}</p>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/sister-concerns/${concern.slug}`}
                                        className="btn-primary inline-flex items-center gap-2 group"
                                    >
                                        <span>Explore More</span>
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
