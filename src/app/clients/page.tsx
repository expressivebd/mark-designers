'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import SEOHead from '@/components/SEOHead';

// Split clients into 3 rows for marquee
const clientsRow1 = [
    { name: 'Brand 1', logo: '/brands/1.png' },
    { name: 'Brand 2', logo: '/brands/2.png' },
    { name: 'Brand 3', logo: '/brands/3.png' },
    { name: 'Brand 4', logo: '/brands/4.png' },
    { name: 'Brand 5', logo: '/brands/5.png' },
    { name: 'Brand 6', logo: '/brands/6.png' },
    { name: 'Brand 7', logo: '/brands/7.png' },
];

const clientsRow2 = [
    { name: 'Brand 8', logo: '/brands/8.png' },
    { name: 'Brand 9', logo: '/brands/9.png' },
    { name: 'Brand 10', logo: '/brands/10.png' },
    { name: 'Brand 1b', logo: '/brands/1.png' },
    { name: 'Brand 2b', logo: '/brands/2.png' },
    { name: 'Brand 3b', logo: '/brands/3.png' },
    { name: 'Brand 4b', logo: '/brands/4.png' },
];

const clientsRow3 = [
    { name: 'Brand 5b', logo: '/brands/5.png' },
    { name: 'Brand 6b', logo: '/brands/6.png' },
    { name: 'Brand 7b', logo: '/brands/7.png' },
    { name: 'Brand 8b', logo: '/brands/8.png' },
    { name: 'Brand 9b', logo: '/brands/9.png' },
    { name: 'Brand 10b', logo: '/brands/10.png' },
    { name: 'Brand 1c', logo: '/brands/1.png' },
];

function MarqueeRow({
    clients,
    direction,
    speed,
}: {
    clients: { name: string; logo: string }[];
    direction: 'left' | 'right';
    speed: 'fast' | 'normal' | 'slow';
}) {
    const doubled = [...clients, ...clients];
    const speedClass =
        speed === 'fast'
            ? 'animate-marquee-left-fast'
            : speed === 'slow'
                ? direction === 'left'
                    ? 'animate-marquee-left-slow'
                    : 'animate-marquee-right-slow'
                : direction === 'left'
                    ? 'animate-marquee-left'
                    : 'animate-marquee-right';

    return (
        <div className="relative pause-on-hover overflow-hidden py-4">
            <div className={`flex ${speedClass}`}>
                {doubled.map((client, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 w-[160px] h-[90px] md:w-[200px] md:h-[110px] bg-white/80 backdrop-blur-sm rounded-xl shadow-md flex items-center justify-center p-4 mx-3 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-white/50"
                    >
                        <Image
                            src={client.logo}
                            alt={client.name}
                            width={160}
                            height={80}
                            className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ClientsPage() {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <>
            {/* Hero */}
            <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
                <Image src="/p2.jpg" alt="Our Clients" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-black/50" />
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative z-10 text-center"
                >
                    <h1 className="text-4xl md:text-6xl lg:text-8xl font-playfair font-bold text-white">
                        OUR CLIENTS
                    </h1>
                    <div className="w-24 h-1 bg-accent mx-auto mt-6" />
                    <p className="text-white/80 mt-6 text-lg md:text-xl font-light max-w-2xl mx-auto">
                        We bring an edge to every brand we work with
                    </p>
                </motion.div>
            </section>

            {/* Clients Section with World Map */}
            <section className="section-padding bg-slate-50 relative overflow-hidden" ref={ref}>
                {/* World Map Background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
                    <svg viewBox="0 0 1200 600" className="w-full max-w-6xl" fill="currentColor">
                        {/* Simple world map outline */}
                        <ellipse cx="600" cy="300" rx="550" ry="250" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                        {/* North America */}
                        <path d="M150,150 Q200,100 280,120 Q320,130 340,160 Q350,200 300,220 Q260,240 220,250 Q180,240 160,210 Q140,180 150,150Z" opacity="0.3" />
                        {/* South America */}
                        <path d="M250,300 Q280,280 310,290 Q330,320 340,370 Q330,420 310,450 Q280,460 260,430 Q240,380 250,300Z" opacity="0.3" />
                        {/* Europe */}
                        <path d="M480,120 Q520,100 560,110 Q580,130 570,160 Q540,170 510,165 Q490,150 480,120Z" opacity="0.3" />
                        {/* Africa */}
                        <path d="M500,200 Q540,190 570,210 Q590,260 580,330 Q560,380 530,390 Q500,370 490,310 Q485,250 500,200Z" opacity="0.3" />
                        {/* Asia */}
                        <path d="M600,100 Q700,80 780,110 Q830,150 820,200 Q790,230 740,240 Q680,250 640,220 Q610,180 600,140 Q595,120 600,100Z" opacity="0.3" />
                        {/* Australia */}
                        <path d="M780,350 Q830,340 870,360 Q880,390 860,410 Q830,420 800,410 Q780,390 780,350Z" opacity="0.3" />
                        {/* Connection dots */}
                        <circle cx="250" cy="180" r="4" opacity="0.5" />
                        <circle cx="530" cy="140" r="4" opacity="0.5" />
                        <circle cx="720" cy="160" r="4" opacity="0.5" />
                        <circle cx="840" cy="380" r="4" opacity="0.5" />
                        {/* Bangladesh dot */}
                        <circle cx="730" cy="200" r="6" className="text-accent" fill="currentColor" opacity="0.8" />
                    </svg>
                </div>

                <div className="container-custom relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="heading-secondary">Trusted by Leading Global Brands</h2>
                        <div className="w-16 h-1 bg-accent mx-auto mt-4" />
                        <p className="text-gray-600 mt-6 max-w-3xl mx-auto text-lg">
                            Serving clients across Europe, North America, and Asia with premium manufacturing excellence
                        </p>
                    </motion.div>
                </div>

                {/* 3 Marquee Rows */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="space-y-4 relative z-10"
                >
                    <MarqueeRow clients={clientsRow1} direction="left" speed="normal" />
                    <MarqueeRow clients={clientsRow2} direction="right" speed="slow" />
                    <MarqueeRow clients={clientsRow3} direction="left" speed="fast" />
                </motion.div>

                {/* Stats */}
                <div className="container-custom mt-20 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { number: '50+', label: 'Global Brands' },
                            { number: '25+', label: 'Countries Served' },
                            { number: '30+', label: 'Years of Trust' },
                            { number: '100%', label: 'Client Satisfaction' },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-2">
                                    {stat.number}
                                </div>
                                <p className="text-gray-500 text-sm md:text-base">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
