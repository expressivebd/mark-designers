'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import SEOHead from '@/components/SEOHead';

const offices = [
    {
        name: 'Head Office',
        type: 'Corporate Headquarters',
        address: 'House 42, Road 8, Block F, Banani, Dhaka 1213, Bangladesh',
        phone: '+880 2 9820445',
        phone2: '+880 2 9820446',
        email: 'info@markdesigners.com',
        mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.4783!2d90.4025!3d23.7945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ3JzQwLjIiTiA5MMKwMjQnMDkuMCJF!5e0!3m2!1sen!2sbd!4v1',
    },
    {
        name: 'Mark Designers Limited',
        type: 'Manufacturing Facility',
        address: 'Tongi Industrial Area, Gazipur Sadar, Gazipur 1704, Bangladesh',
        phone: '+880 2 9802345',
        phone2: '+880 2 9802346',
        email: 'factory1@markdesigners.com',
        mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.5!2d90.4!3d23.88!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDUyJzQ4LjAiTiA5MMKwMjQnMDAuMCJF!5e0!3m2!1sen!2sbd!4v1',
    },
    {
        name: 'Mark Wear Limited',
        type: 'Manufacturing Facility',
        address: 'Fatullah Industrial Zone, Narayanganj 1420, Bangladesh',
        phone: '+880 2 7642345',
        phone2: '+880 2 7642346',
        email: 'factory2@markdesigners.com',
        mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3653.5!2d90.5!3d23.68!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQwJzQ4LjAiTiA5MMKwMzAnMDAuMCJF!5e0!3m2!1sen!2sbd!4v1',
    },
    {
        name: 'Mark 2000 Limited',
        type: 'Manufacturing Facility',
        address: 'Hemayetpur, Savar, Dhaka 1340, Bangladesh',
        phone: '+880 2 7745123',
        phone2: '+880 2 7745124',
        email: 'factory3@markdesigners.com',
        mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.0!2d90.26!3d23.78!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ2JzQ4LjAiTiA5MMKwMTUnMzYuMCJF!5e0!3m2!1sen!2sbd!4v1',
    },
];

export default function ContactPage() {
    const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <>
            {/* Hero */}
            <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
                <Image src="/p1.jpg" alt="Contact Us" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-black/50" />
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative z-10 text-center px-4"
                >
                    <h1 className="text-4xl md:text-6xl lg:text-8xl font-playfair font-bold text-white">
                        CONTACT US
                    </h1>
                    <div className="w-24 h-1 bg-accent mx-auto mt-6" />
                    <p className="text-white/80 mt-6 text-lg md:text-xl font-light max-w-2xl mx-auto">
                        Get in touch with our offices across Bangladesh
                    </p>
                </motion.div>
            </section>

            {/* Offices */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="space-y-16 md:space-y-24">
                        {offices.map((office, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                                    } gap-8 lg:gap-12`}
                            >
                                {/* Map */}
                                <div className="w-full lg:w-1/2 h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                                    <iframe
                                        src={office.mapEmbed}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title={`Map - ${office.name}`}
                                    />
                                </div>

                                {/* Info */}
                                <div className="w-full lg:w-1/2 flex items-center">
                                    <div className="space-y-6 w-full">
                                        <div>
                                            <p className="text-accent text-sm font-semibold tracking-widest mb-1">{office.type}</p>
                                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-bold text-primary">
                                                {office.name}
                                            </h2>
                                        </div>

                                        {/* Address */}
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-primary mb-1">Address</p>
                                                <p className="text-gray-600">{office.address}</p>
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-primary mb-1">Phone</p>
                                                <a href={`tel:${office.phone}`} className="text-gray-600 hover:text-accent transition-colors block">{office.phone}</a>
                                                <a href={`tel:${office.phone2}`} className="text-gray-600 hover:text-accent transition-colors block">{office.phone2}</a>
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-primary mb-1">Email</p>
                                                <a href={`mailto:${office.email}`} className="text-gray-600 hover:text-accent transition-colors">{office.email}</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-20 bg-primary">
                <div className="container-custom text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-4">
                            Ready to Start a Project?
                        </h2>
                        <p className="text-white/80 mb-8 max-w-xl mx-auto">
                            Contact our team to discuss your manufacturing requirements and get a personalized quote.
                        </p>
                        <a
                            href="mailto:info@markdesigners.com"
                            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-primary rounded-full font-semibold text-lg hover:bg-gray-50 transition-all duration-300 hover:shadow-xl hover:scale-105 group"
                        >
                            <span>Email Us Now</span>
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
