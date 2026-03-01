'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import SEOHead from '@/components/SEOHead';

const certifications = [
    { name: 'ISO 9001', logo: '/certificates/1.png' },
    { name: 'WRAP', logo: '/certificates/2.png' },
    { name: 'BSCI', logo: '/certificates/3.png' },
    { name: 'OEKO-TEX', logo: '/certificates/4.png' },
    { name: 'Accord', logo: '/certificates/5.png' },
    { name: 'RSC', logo: '/certificates/6.png' },
    { name: 'SEDEX', logo: '/certificates/7.png' },
    { name: 'GOTS', logo: '/certificates/8.png' },
    { name: 'GRS', logo: '/certificates/9.png' },
    { name: 'OCS', logo: '/certificates/10.png' },
    { name: 'Higg Index', logo: '/certificates/11.png' },
    { name: 'CTPAT', logo: '/certificates/12.png' },
];

const compliances = [
    {
        title: 'Social Compliance',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
        items: [
            'Fair wages and benefits for all workers',
            'No child labor or forced labor',
            'Freedom of association',
            'Anti-discrimination policies',
            'Regular third-party social audits',
            'Worker grievance mechanisms',
        ],
    },
    {
        title: 'Environmental Compliance',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        items: [
            'Effluent Treatment Plant (ETP) in all facilities',
            'Water recycling and conservation',
            'Energy-efficient manufacturing processes',
            'Reduced carbon footprint initiatives',
            'Sustainable material sourcing',
            'Zero liquid discharge targets',
        ],
    },
    {
        title: 'Safety Compliance',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        items: [
            'Fire safety systems and regular drills',
            'Structural integrity assessments',
            'Personal protective equipment (PPE)',
            'Emergency evacuation plans',
            'First aid and medical facilities',
            'Regular safety training programs',
        ],
    },
    {
        title: 'Quality Compliance',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
        ),
        items: [
            'ISO 9001 Quality Management System',
            'AQL 2.5 inspection standards',
            'In-house testing laboratory',
            'Multi-stage quality checkpoints',
            'Traceability from raw materials to shipment',
            'Continuous improvement programs',
        ],
    },
];

export default function CertificationsPage() {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [compRef, compInView] = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <>
            {/* Hero */}
            <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
                <Image src="/p3.jpg" alt="Certifications" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-black/50" />
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative z-10 text-center"
                >
                    <h1 className="text-4xl md:text-6xl lg:text-8xl font-playfair font-bold text-white">
                        CERTIFICATIONS
                    </h1>
                    <div className="w-24 h-1 bg-accent mx-auto mt-6" />
                    <p className="text-white/80 mt-6 text-lg md:text-xl font-light max-w-2xl mx-auto">
                        Our commitment to quality and compliance, recognized globally
                    </p>
                </motion.div>
            </section>

            {/* Certifications Marquee */}
            <section className="section-padding bg-white overflow-hidden" ref={ref}>
                <div className="container-custom mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h2 className="heading-secondary">Our Certifications</h2>
                        <div className="w-16 h-1 bg-accent mx-auto mt-4" />
                        <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
                            We hold internationally recognized certifications that validate our commitment to quality, safety, and sustainability.
                        </p>
                    </motion.div>
                </div>

                {/* Marquee Row 1 */}
                <div className="relative pause-on-hover mb-4">
                    <div className="flex animate-marquee-left">
                        {[...certifications, ...certifications].map((cert, index) => (
                            <div
                                key={`row1-${index}`}
                                className="flex-shrink-0 w-[200px] h-[120px] bg-slate-50 rounded-xl shadow-md flex items-center justify-center p-5 mx-3 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100"
                            >
                                <Image
                                    src={cert.logo}
                                    alt={cert.name}
                                    width={180}
                                    height={100}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none" />
                </div>

                {/* Marquee Row 2 (reverse) */}
                <div className="relative pause-on-hover">
                    <div className="flex animate-marquee-right">
                        {[...certifications.slice().reverse(), ...certifications.slice().reverse()].map((cert, index) => (
                            <div
                                key={`row2-${index}`}
                                className="flex-shrink-0 w-[200px] h-[120px] bg-slate-50 rounded-xl shadow-md flex items-center justify-center p-5 mx-3 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100"
                            >
                                <Image
                                    src={cert.logo}
                                    alt={cert.name}
                                    width={180}
                                    height={100}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none" />
                </div>
            </section>

            {/* Compliances Section */}
            <section className="section-padding bg-slate-50" ref={compRef}>
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={compInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="heading-secondary">Compliance Standards</h2>
                        <div className="w-16 h-1 bg-accent mx-auto mt-4" />
                        <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
                            We maintain the highest standards across social, environmental, safety, and quality parameters
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {compliances.map((compliance, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={compInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-50"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                                        {compliance.icon}
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-playfair font-bold text-primary">
                                        {compliance.title}
                                    </h3>
                                </div>
                                <ul className="space-y-3">
                                    {compliance.items.map((item, itemIndex) => (
                                        <li key={itemIndex} className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-gray-600 text-sm md:text-base">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
