'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface MenuItem {
  label: string;
  href: string;
  number: string;
  children?: { label: string; href: string }[];
}

type SisterConcernNavItem = {
  id: string;
  name: string;
  href: string;
};

const menuItems: MenuItem[] = [
  { label: 'Home', href: '/', number: '01' },
  { label: 'About', href: '/about', number: '02' },
  {
    label: 'Our Facilities',
    href: '/sister-concerns',
    number: '03',
    children: [],
  },
  { label: 'Products', href: '/products', number: '04' },
  { label: 'Certifications', href: '/certifications', number: '05' },
  { label: 'Clients', href: '/clients', number: '06' },
  { label: 'Contact', href: '/contact', number: '07' },
];

const socialLinks = [
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'Facebook', href: 'https://facebook.com' },
  { label: 'Instagram', href: 'https://instagram.com' },
];

interface StaggeredMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const StaggeredMenu = ({ isOpen, onClose }: StaggeredMenuProps) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [sisterConcerns, setSisterConcerns] = useState<SisterConcernNavItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setExpandedItem(null);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const loadSisterConcerns = async () => {
      try {
        const response = await fetch('/api/sister-concerns');
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as SisterConcernNavItem[];
        setSisterConcerns(data || []);
      } catch {
        setSisterConcerns([]);
      }
    };

    if (isOpen) {
      loadSisterConcerns();
    }
  }, [isOpen]);

  const menuVariants = {
    closed: {
      x: '-100%',
      transition: {
        duration: 0.5,
        ease: [0.6, 0.01, 0.05, 0.95],
      },
    },
    open: {
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.6, 0.01, 0.05, 0.95],
      },
    },
  };

  const itemVariants = {
    closed: { x: -50, opacity: 0 },
    open: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: 0.1 + i * 0.05,
        duration: 0.5,
        ease: [0.6, 0.01, 0.05, 0.95],
      },
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 z-[998] backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed top-0 left-0 h-full w-full md:w-[500px] lg:w-[600px] bg-primary z-[999] shadow-2xl overflow-y-auto"
          >
            <div className="p-8 md:p-12 lg:p-16 h-full flex flex-col">
              {/* Close Button */}
              <div className="flex justify-end mb-12">
                <button
                  onClick={onClose}
                  className="text-white hover:text-accent transition-colors duration-300 group"
                  aria-label="Close menu"
                >
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Menu Items */}
              <nav className="flex-1">
                <ul className="space-y-2">
                  {menuItems.map((item, index) => (
                    <motion.li
                      key={item.href}
                      custom={index}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      variants={itemVariants}
                    >
                      {item.label === 'Our Facilities' ? (
                        /* Accordion Item */
                        <div>
                          <div className="group flex items-center gap-6 py-3 text-white">
                            <span className="text-sm font-light text-accent/60 min-w-[2rem]">
                              {item.number}
                            </span>
                            <Link
                              href={item.href}
                              onClick={onClose}
                              className="text-3xl md:text-4xl lg:text-5xl font-playfair font-semibold hover:text-accent transition-colors duration-300"
                            >
                              {item.label}
                            </Link>
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedItem(expandedItem === item.label ? null : item.label)
                              }
                              aria-label="Toggle sister concerns list"
                              className="ml-auto hover:text-accent transition-colors duration-300"
                            >
                              <svg
                                className={`h-6 w-6 md:h-8 md:w-8 transition-transform duration-300 ${
                                  expandedItem === item.label ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>
                          </div>

                          {/* Accordion Children */}
                          <AnimatePresence>
                            {expandedItem === item.label && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="overflow-hidden"
                              >
                                <ul className="pl-14 md:pl-16 space-y-1 pb-2">
                                  {sisterConcerns.map((child) => (
                                    <li key={child.href}>
                                      <Link
                                        href={child.href}
                                        onClick={onClose}
                                        className="block py-2 text-lg md:text-xl font-inter text-white/70 hover:text-accent transition-colors duration-300"
                                      >
                                        {child.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : item.children && item.children.length > 0 ? (
                        <div>
                          <button
                            onClick={() =>
                              setExpandedItem(
                                expandedItem === item.label ? null : item.label
                              )
                            }
                            className="group flex items-center gap-6 py-3 text-white hover:text-accent transition-colors duration-300 w-full text-left"
                          >
                            <span className="text-sm font-light text-accent/60 min-w-[2rem]">
                              {item.number}
                            </span>
                            <span className="text-3xl md:text-4xl lg:text-5xl font-playfair font-semibold">
                              {item.label}
                            </span>
                            <svg
                              className={`w-6 h-6 md:w-8 md:h-8 ml-auto transition-transform duration-300 ${expandedItem === item.label ? 'rotate-180' : ''
                                }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>

                          <AnimatePresence>
                            {expandedItem === item.label && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="overflow-hidden"
                              >
                                <ul className="pl-14 md:pl-16 space-y-1 pb-2">
                                  {item.children.map((child) => (
                                    <li key={child.href}>
                                      <Link
                                        href={child.href}
                                        onClick={onClose}
                                        className="block py-2 text-lg md:text-xl font-inter text-white/70 hover:text-accent transition-colors duration-300"
                                      >
                                        {child.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        /* Regular Item */
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className="group flex items-center gap-6 py-3 text-white hover:text-accent transition-colors duration-300"
                        >
                          <span className="text-sm font-light text-accent/60 min-w-[2rem]">
                            {item.number}
                          </span>
                          <span className="text-3xl md:text-4xl lg:text-5xl font-playfair font-semibold">
                            {item.label}
                          </span>
                        </Link>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Social Links */}
              {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-12 pt-8 border-t border-white/20"
              >
                <p className="text-accent text-sm font-medium mb-4 tracking-wider">
                  FOLLOW US
                </p>
                <div className="flex gap-6">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-accent transition-colors duration-300 text-lg font-inter"
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
              </motion.div> */}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StaggeredMenu;
