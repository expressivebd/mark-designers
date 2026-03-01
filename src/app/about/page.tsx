'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import Image from 'next/image';
import SEOHead from '@/components/SEOHead';

const stats = [
    { number: 3, suffix: '', label: 'Sister Concerns' },
    { number: 45000, suffix: '+', label: 'Daily Capacity (pcs)' },
    { number: 8000, suffix: '+', label: 'Personnel' },
    { number: 30, suffix: '+', label: 'Years Experience' },
];

const expertiseItems = [
    {
        title: 'Design',
        description: 'Our experienced design team creates innovative patterns and styles that align with global fashion trends and client specifications.',
        image: '/products/1.png',
    },
    {
        title: 'Pattern',
        description: 'Precision pattern making with state-of-the-art CAD systems ensuring perfect fit and minimal fabric wastage.',
        image: '/products/2.png',
    },
    {
        title: 'Sampling',
        description: 'Rapid prototyping and sampling capabilities to bring concepts to life quickly and accurately.',
        image: '/products/3.png',
    },
    {
        title: 'Cutting',
        description: 'Automated cutting systems with computerized marker making for maximum efficiency and precision.',
        image: '/products/4.png',
    },
    {
        title: 'Stitching',
        description: 'Skilled operators and advanced sewing technology deliver superior craftsmanship on every garment.',
        image: '/products/1.png',
    },
    {
        title: 'Washing',
        description: 'In-house washing facilities with eco-friendly processes for various finishes and treatments.',
        image: '/products/2.png',
    },
    {
        title: 'Finishing',
        description: 'Meticulous finishing processes including pressing, folding, and presentation to meet the highest standards.',
        image: '/products/3.png',
    },
    {
        title: 'Quality Control',
        description: 'Rigorous multi-stage inspection processes ensuring every piece meets international quality standards.',
        image: '/products/4.png',
    },
    {
        title: 'Packing',
        description: 'Custom packing solutions tailored to brand requirements with sustainable packaging options.',
        image: '/products/1.png',
    },
    {
        title: 'Shipment',
        description: 'Efficient logistics management ensuring timely delivery to destinations worldwide.',
        image: '/products/2.png',
    },
];

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
    { name: 'Higg', logo: '/certificates/11.png' },
    { name: 'CTPAT', logo: '/certificates/12.png' },
];

const machineryImages = [
    { src: '/concerns/1.png', alt: 'Production Floor', span: 'col-span-2 row-span-2' },
    { src: '/concerns/2.png', alt: 'Sewing Section', span: 'col-span-1 row-span-1' },
    { src: '/concerns/3.png', alt: 'Cutting Section', span: 'col-span-1 row-span-1' },
    { src: '/products/1.png', alt: 'Finishing Line', span: 'col-span-1 row-span-2' },
    { src: '/products/2.png', alt: 'Quality Lab', span: 'col-span-1 row-span-1' },
    { src: '/products/3.png', alt: 'Washing Plant', span: 'col-span-1 row-span-1' },
];

export default function AboutPage() {
    const [historyRef, historyInView] = useInView({ triggerOnce: true, threshold: 0.2 });
    const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.2 });
    const [machineryRef, machineryInView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [expertiseRef, expertiseInView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [certRef, certInView] = useInView({ triggerOnce: true, threshold: 0.1 });

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
                            <p>
                                Since 1995, Mark Designers Ltd. has been a cornerstone of the Bangladeshi garment
                                industry, serving clients across Europe, North America, and Asia with unwavering
                                quality and commitment. What began as a single manufacturing unit has grown into a
                                group of three state-of-the-art production facilities.
                            </p>
                            <p>
                                The company portfolio expanded by setting up two additional production facilities —
                                Mark Wear Limited and Mark 2000 Limited. All three facilities are fully compliant
                                under the supervision of Accord and RSC, maintaining the highest international
                                standards in safety, quality, and ethical manufacturing.
                            </p>
                            <p>
                                Over three decades, we have built lasting partnerships with leading global
                                brands, consistently delivering premium garments that meet the exacting standards
                                of the international fashion industry. Our commitment to innovation, sustainability,
                                and excellence continues to drive our growth.
                            </p>
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

            {/* Machinery Bento Box Section */}
            <section className="section-padding bg-slate-50">
                <div className="container-custom">
                    <motion.div
                        ref={machineryRef}
                        initial={{ opacity: 0, y: 30 }}
                        animate={machineryInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="heading-secondary">Our Facilities</h2>
                        <div className="w-16 h-1 bg-accent mx-auto mt-4" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={machineryInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="grid grid-cols-2 md:grid-cols-3 auto-rows-[200px] md:auto-rows-[250px] gap-3 md:gap-4"
                    >
                        {machineryImages.map((img, index) => (
                            <div
                                key={index}
                                className={`relative rounded-xl overflow-hidden group ${img.span}`}
                            >
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/60 transition-all duration-300 flex items-center justify-center">
                                    <span className="text-white font-playfair font-semibold text-lg md:text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                                        {img.alt}
                                    </span>
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
                                    } items-stretch border-b border-gray-100 last:border-0`}
                            >
                                {/* Image */}
                                <div className="relative w-full md:w-2/5 h-64 md:h-80 overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-700"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex items-center p-8 md:p-12 lg:p-16">
                                    <div>
                                        <span className="text-accent text-sm font-semibold tracking-widest">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-bold text-primary mt-2 mb-4">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                                            {item.description}
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
                                    src={cert.logo}
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
