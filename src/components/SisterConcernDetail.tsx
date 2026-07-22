'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';

interface ConcernData {
    name: string;
    location: string;
    fullAddress: string;
    established: string;
    heroImage: string;
    description: string[];
    companyProfileUrl: string;
    stats: { value: string; label: string }[];
    machineryImages: { src: string; alt: string; description: string }[];
}

export default function SisterConcernDetail({ data }: { data: ConcernData }) {
    const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.2 });
    const [machineryRef, machineryInView] = useInView({ triggerOnce: true, threshold: 0.1 });

    const bentoPatterns = [
        'col-span-2 row-span-2',
        'col-span-1 row-span-1',
        'col-span-1 row-span-1',
        'col-span-1 row-span-2',
        'col-span-1 row-span-1',
        'col-span-2 row-span-1',
    ];

    return (
        <>
            {/* Hero */}
            <section className="relative h-[50vh] md:h-[65vh] flex items-center justify-center overflow-hidden">
                <Image src={data.heroImage} alt={data.name} fill className="object-cover" priority />
                {/* <Image src="/p1.jpg" alt={data.name} fill className="object-cover" priority /> */}
                <div className="absolute inset-0 bg-black/50" />
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative z-10 text-center px-4"
                >
                    <h1 className="text-3xl md:text-5xl lg:text-7xl font-playfair font-bold text-white">
                        {data.name}
                    </h1>
                    <div className="w-24 h-1 bg-accent mx-auto mt-6" />
                    <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-white/70 text-sm md:text-base">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {data.location}
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Est. {data.established}
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* About */}
            <section className="section-padding bg-white">
                <div className="container-custom max-w-4xl mx-auto">
                    {data.description.map((para, i) => (
                        <motion.p
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="text-body mb-6 last:mb-0"
                        >
                            {para}
                        </motion.p>
                    ))}

                    {data.companyProfileUrl && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="mt-6 flex justify-center"
                        >
                            <a
                                href={data.companyProfileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary inline-flex items-center gap-2"
                            >
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>View Detailed Company Profile</span>
                            </a>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 md:py-20 bg-primary" ref={statsRef}>
                <div className="container-custom">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {data.stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-accent mb-2">
                                    {stat.value}
                                </div>
                                <p className="text-white/80 font-medium text-sm md:text-base">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Machinery Bento Box */}
            <section className="section-padding bg-slate-50">
                <div className="container-custom">
                    <motion.div
                        ref={machineryRef}
                        initial={{ opacity: 0, y: 30 }}
                        animate={machineryInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="heading-primary">Machinery and Facilities</h2>
                        <div className="w-32 h-1 bg-accent mx-auto mt-4" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={machineryInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="grid grid-cols-2 md:grid-cols-3 auto-rows-[180px] md:auto-rows-[220px] gap-3 md:gap-4"
                    >
                        {data.machineryImages.map((img, index) => (
                            <div
                                key={index}
                                className={`relative rounded-xl overflow-hidden group cursor-pointer ${bentoPatterns[index % bentoPatterns.length]
                                    }`}
                            >
                                <Image src={img.src} alt={img.alt} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/75 transition-all duration-400 flex flex-col items-center justify-center p-4">
                                    <h4 className="text-white font-playfair font-bold text-lg md:text-xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 text-center">
                                        {img.alt}
                                    </h4>
                                    {img.description && (
                                        <p className="text-white/80 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100 translate-y-4 group-hover:translate-y-0 text-center max-w-xs">
                                            {img.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {data.machineryImages.length === 0 && (
                        <div className="rounded-xl border border-dashed border-slate-300 py-10 text-center text-slate-500">
                            Factory photos are not available yet.
                        </div>
                    )}
                </div>
            </section>

            {/* Back Link */}
            <section className="py-12 bg-white">
                <div className="container-custom text-center">
                    <Link
                        href="/sister-concerns"
                        className="btn-primary inline-flex items-center gap-2 group"
                    >
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                        </svg>
                        <span>All Facilities</span>
                    </Link>
                </div>
            </section>
        </>
    );
}
