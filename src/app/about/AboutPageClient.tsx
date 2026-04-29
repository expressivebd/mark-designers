'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import Image from 'next/image';
import SEOHead from '@/components/SEOHead';

type AboutStat = {
    label: string;
    number: number;
    suffix: string;
};

type FacilityItem = {
    name: string;
    imageUrl: string;
};

type ExpertiseItem = {
    name: string;
    details: string;
    imageUrl: string;
};

type CertificationItem = {
    id?: string;
    name: string;
    logoUrl: string;
};

type AboutData = {
    journey?: string;
    stats?: AboutStat[];
    facilities?: FacilityItem[];
    expertise?: ExpertiseItem[];
} | null;

type Props = {
    about: AboutData;
    certifications: CertificationItem[];
};

const defaultStats: AboutStat[] = [
    { number: 3, suffix: '', label: 'Sister Concerns' },
    { number: 45000, suffix: '+', label: 'Daily Capacity (pcs)' },
    { number: 8000, suffix: '+', label: 'Personnel' },
    { number: 30, suffix: '+', label: 'Years Experience' },
];

const defaultExpertiseItems: ExpertiseItem[] = [
    {
        name: 'Design',
        details: 'Our experienced design team creates innovative patterns and styles that align with global fashion trends and client specifications.',
        imageUrl: '/products/1.png',
    },
    {
        name: 'Pattern',
        details: 'Precision pattern making with state-of-the-art CAD systems ensuring perfect fit and minimal fabric wastage.',
        imageUrl: '/products/2.png',
    },
    {
        name: 'Sampling',
        details: 'Rapid prototyping and sampling capabilities to bring concepts to life quickly and accurately.',
        imageUrl: '/products/3.png',
    },
    {
        name: 'Cutting',
        details: 'Automated cutting systems with computerized marker making for maximum efficiency and precision.',
        imageUrl: '/products/4.png',
    },
    {
        name: 'Stitching',
        details: 'Skilled operators and advanced sewing technology deliver superior craftsmanship on every garment.',
        imageUrl: '/products/1.png',
    },
    {
        name: 'Washing',
        details: 'In-house washing facilities with eco-friendly processes for various finishes and treatments.',
        imageUrl: '/products/2.png',
    },
    {
        name: 'Finishing',
        details: 'Meticulous finishing processes including pressing, folding, and presentation to meet the highest standards.',
        imageUrl: '/products/3.png',
    },
    {
        name: 'Quality Control',
        details: 'Rigorous multi-stage inspection processes ensuring every piece meets international quality standards.',
        imageUrl: '/products/4.png',
    },
    {
        name: 'Packing',
        details: 'Custom packing solutions tailored to brand requirements with sustainable packaging options.',
        imageUrl: '/products/1.png',
    },
    {
        name: 'Shipment',
        details: 'Efficient logistics management ensuring timely delivery to destinations worldwide.',
        imageUrl: '/products/2.png',
    },
];

const defaultCertifications: CertificationItem[] = [
    { name: 'ISO 9001', logoUrl: '/certificates/1.png' },
    { name: 'WRAP', logoUrl: '/certificates/2.png' },
    { name: 'BSCI', logoUrl: '/certificates/3.png' },
    { name: 'OEKO-TEX', logoUrl: '/certificates/4.png' },
    { name: 'Accord', logoUrl: '/certificates/5.png' },
    { name: 'RSC', logoUrl: '/certificates/6.png' },
    { name: 'SEDEX', logoUrl: '/certificates/7.png' },
    { name: 'GOTS', logoUrl: '/certificates/8.png' },
    { name: 'GRS', logoUrl: '/certificates/9.png' },
    { name: 'OCS', logoUrl: '/certificates/10.png' },
    { name: 'Higg', logoUrl: '/certificates/11.png' },
    { name: 'CTPAT', logoUrl: '/certificates/12.png' },
];

const defaultFacilities: FacilityItem[] = [
    { imageUrl: '/concerns/1.png', name: 'Production Floor' },
    { imageUrl: '/concerns/2.png', name: 'Sewing Section' },
    { imageUrl: '/concerns/3.png', name: 'Cutting Section' },
    { imageUrl: '/products/1.png', name: 'Finishing Line' },
    { imageUrl: '/products/2.png', name: 'Quality Lab' },
    { imageUrl: '/products/3.png', name: 'Washing Plant' },
];

const defaultJourney = [
    'Since 1995, Mark Designers Ltd. has been a cornerstone of the Bangladeshi garment industry, serving clients across Europe, North America, and Asia with unwavering quality and commitment. What began as a single manufacturing unit has grown into a group of three state-of-the-art production facilities.',
    'The company portfolio expanded by setting up two additional production facilities - Mark Wear Limited and Mark 2000 Limited. All three facilities are fully compliant under the supervision of Accord and RSC, maintaining the highest international standards in safety, quality, and ethical manufacturing.',
    'Over three decades, we have built lasting partnerships with leading global brands, consistently delivering premium garments that meet the exacting standards of the international fashion industry. Our commitment to innovation, sustainability, and excellence continues to drive our growth.',
].join('\n\n');

export default function AboutPageClient({ about, certifications: certData }: Props) {
    const [historyRef, historyInView] = useInView({ triggerOnce: true, threshold: 0.2 });
    const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.2 });
    const [machineryRef, machineryInView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [expertiseRef, expertiseInView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [certRef, certInView] = useInView({ triggerOnce: true, threshold: 0.1 });

    const journey = about?.journey || defaultJourney;
    const stats = Array.isArray(about?.stats) && about.stats.length > 0
        ? about.stats.map((item) => ({
            label: String(item.label || ''),
            number: Number(item.number || 0),
            suffix: String(item.suffix || ''),
        }))
        : defaultStats;
    const facilities = Array.isArray(about?.facilities) && about.facilities.length > 0
        ? about.facilities.map((item) => ({
            name: String(item.name || ''),
            imageUrl: String(item.imageUrl || ''),
        }))
        : defaultFacilities;
    const expertiseItems = Array.isArray(about?.expertise) && about.expertise.length > 0
        ? about.expertise.map((item) => ({
            name: String(item.name || ''),
            details: String(item.details || ''),
            imageUrl: String(item.imageUrl || ''),
        }))
        : defaultExpertiseItems;
    const certifications = Array.isArray(certData) && certData.length > 0 ? certData : defaultCertifications;

    const journeyParagraphs = useMemo(
        () => journey.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean),
        [journey]
    );

    return (
        <>
            <SEOHead
                title="About Us"
                description="Learn about Mark Designers Ltd — a leading garment manufacturer in Bangladesh since 1995, with 3 sister concerns, 8000+ personnel, and 45,000+ daily capacity."
                keywords="Mark Designers about, garment manufacturer Bangladesh, manufacturing history"
            />
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
                <Image
                    src="/p1.jpg"
                    alt="About Mark Designers"
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
                    <h1 className="text-5xl md:text-7xl lg:text-9xl font-playfair font-bold text-white tracking-tight">
                        ABOUT US
                    </h1>
                    <div className="w-24 h-1 bg-accent mx-auto mt-6" />
                </motion.div>
            </section>

            {/* History Section */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <motion.div
                        ref={historyRef}
                        initial={{ opacity: 0, y: 30 }}
                        animate={historyInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto"
                    >
                        <h2 className="heading-secondary text-center mb-8">Our Journey</h2>
                        <div className="w-16 h-1 bg-accent mx-auto mb-12" />
                        <div className="space-y-6 text-body">
                            {journeyParagraphs.map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 md:py-20 bg-primary">
                <div className="container-custom">
                    <div
                        ref={statsRef}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-accent mb-2">
                                    {statsInView && (
                                        <CountUp end={stat.number} duration={2.5} separator="," suffix={stat.suffix} />
                                    )}
                                </div>
                                <p className="text-white/80 font-medium text-sm md:text-base tracking-wide">
                                    {stat.label}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Facilities Section */}
            <section className="section-padding bg-slate-50">
                <div className="container-custom">
                    <motion.div
                        ref={machineryRef}
                        initial={{ opacity: 0, y: 30 }}
                        animate={machineryInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="heading-secondary">The Process</h2>
                        <div className="w-16 h-1 bg-accent mx-auto mt-4" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={machineryInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                    >
                        {facilities.map((item, index) => (
                            <div key={index} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                                <div className="relative h-40 md:h-48 w-full">
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="px-4 py-3 text-center">
                                    <h3 className="text-sm md:text-base font-semibold text-primary">{item.name}</h3>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Expertise Section */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <motion.div
                        ref={expertiseRef}
                        initial={{ opacity: 0, y: 30 }}
                        animate={expertiseInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="heading-secondary">Our Expertise</h2>
                        <div className="w-16 h-1 bg-accent mx-auto mt-4" />
                        <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
                            End-to-end garment manufacturing capabilities under one roof
                        </p>
                    </motion.div>

                    <div className="space-y-0">
                        {expertiseItems.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={expertiseInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                    } items-center gap-8 md:gap-12 lg:gap-16 py-12 md:py-16 border-b border-gray-100 last:border-0`}
                            >
                                <div className="relative w-full md:w-2/5 h-64 md:h-80 overflow-hidden rounded-2xl shadow-xl">
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.name}
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-700"
                                    />
                                </div>

                                <div className="flex-1 flex items-center p-8 md:p-12 lg:p-16">
                                    <div>
                                        <span className="text-accent text-sm font-semibold tracking-widest">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-bold text-primary mt-2 mb-4">
                                            {item.name}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                                            {item.details}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Certifications Marquee */}
            <section className="py-16 md:py-20 bg-slate-50 overflow-hidden">
                <div className="container-custom mb-10">
                    <motion.div
                        ref={certRef}
                        initial={{ opacity: 0, y: 30 }}
                        animate={certInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h2 className="heading-secondary">Our Certifications</h2>
                        <div className="w-16 h-1 bg-accent mx-auto mt-4" />
                    </motion.div>
                </div>

                <div className="relative pause-on-hover">
                    <div className="flex animate-marquee-left">
                        {[...certifications, ...certifications].map((cert, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 w-[180px] h-[100px] bg-white rounded-lg shadow-md flex items-center justify-center p-4 mx-3 hover:shadow-xl hover:scale-105 transition-all duration-300"
                            >
                                <Image
                                    src={cert.logoUrl}
                                    alt={cert.name}
                                    width={160}
                                    height={80}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none" />
                </div>
            </section>
        </>
    );
}
