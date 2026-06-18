'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import StaggeredMenu from './StaggeredMenu';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isTopBarOpen, setIsTopBarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine if scrolling down or up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide header
        setShowTopBar(false);
      } else {
        // Scrolling up - show header
        setShowTopBar(true);
      }

      setLastScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${showTopBar ? 'translate-y-0' : '-translate-y-full'
          } ${isScrolled ? 'bg-gradient-to-b from-white/40 via-white/30 to-transparent backdrop-blur-md shadow-lg' : 'bg-gradient-to-b from-white/50 via-white/30 to-transparent backdrop-blur-sm'
          }`}
      >
        {/* Top Bar */}
        <div className="bg-primary text-white py-2 text-sm">
          <div className="container-custom">
            {/* Desktop View */}
            <div className="hidden md:flex justify-between items-center gap-2 md:gap-4 text-center md:text-left">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="font-light">Dhaka, Bangladesh</span>
              </div>

              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:info@markdesigners.com"
                  className="font-light hover:text-accent transition-colors"
                >
                  info@markdesignersltd.com
                </a>
              </div>

              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  href="tel:+880248034501"
                  className="font-light hover:text-accent transition-colors"
                >
                  +88 02 48034501

                </a>
              </div>
            </div>

            {/* Mobile View - Icons Only */}
            <div className="md:hidden">
              <button
                onClick={() => setIsTopBarOpen(!isTopBarOpen)}
                className="flex items-center justify-center gap-4 w-full"
              >
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <svg className={`w-4 h-4 transition-transform ${isTopBarOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              {isTopBarOpen && (
                <div className="mt-2 space-y-2 text-center pb-2">
                  <a href="tel:+880123456789" className="block font-light hover:text-accent transition-colors">
                    +880 123 456 789
                  </a>
                  <a href="mailto:info@markdesigners.com" className="block font-light hover:text-accent transition-colors">
                    info@markdesigners.com
                  </a>
                  <span className="block font-light">
                    Dhaka, Bangladesh
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="py-4 md:py-5">
          <div className="container-custom">
            <div className="flex items-center justify-between">
              {/* Menu Button */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="flex items-center gap-3 text-primary hover:text-accent transition-colors duration-300 group border border-primary/20 rounded-full px-3 py-2 md:px-4 md:py-2.5 hover:border-accent/40"
                aria-label="Open menu"
              >
                <div className="flex flex-col gap-1.5">
                  <span className="w-6 h-0.5 bg-current group-hover:w-8 transition-all duration-300"></span>
                  <span className="w-6 h-0.5 bg-current transition-all duration-300"></span>
                  <span className="w-4 h-0.5 bg-current group-hover:w-8 transition-all duration-300"></span>
                </div>
                <span className="hidden md:inline font-medium text-sm tracking-wider">
                  MENU
                </span>
              </button>

              {/* Logo - Always Centered */}
              <Link
                href="/"
                className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center group"
              >
                <h1 className="text-xl md:text-3xl lg:text-4xl font-playfair font-bold text-primary group-hover:text-accent transition-colors duration-300">
                  Mark Designers
                </h1>
                <p className="text-xs md:text-sm text-accent tracking-widest font-light">
                  SINCE 1995
                </p>
              </Link>

              {/* Download buttons */}
              <div className="flex items-center gap-2">
                <a
                  href="/Mark_fashion_book.pdf"
                  download
                  className="btn-primary text-xs md:text-base px-3 py-2 md:px-8 md:py-3 rounded-md inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="hidden md:inline">Catalog</span>
                </a>
                <a
                  href="/Mark_Company_Profile.pdf"
                  download
                  className="btn-accent text-xs md:text-base px-3 py-2 md:px-8 md:py-3 rounded-md inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="hidden md:inline">Profile</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Staggered Menu */}
      <StaggeredMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Header;
