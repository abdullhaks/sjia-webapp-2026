import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import ThemeToggle from '../common/ThemeToggle';

const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'About', href: '#about' },
        { name: 'Programs', href: '#programs' },
        { name: 'Campus', href: '#campus' },
        { name: 'Faculty', href: '#faculty' },
        { name: 'Admissions', href: '#admissions' },
    ];

    const scrollToSection = (href: string) => {
        const element = document.querySelector(href);
        if (element) {
            const headerHeight = 80;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: elementPosition - headerHeight,
                behavior: 'smooth',
            });
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                    ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl border-b border-emerald-100 dark:border-slate-800'
                    : 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg'
                    }`}
            >
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-3">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <motion.div
                                className="relative flex-shrink-0"
                                whileHover={{ rotate: 5 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300" />
                                <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg sm:text-xl" style={{ fontFamily: 'Amiri, serif' }}>ج</span>
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                                    <FaStar className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" />
                                </div>
                            </motion.div>
                            <div className="hidden md:block">
                                <h1 className="text-sm lg:text-base font-bold bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-800 dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-500 bg-clip-text text-transparent leading-tight">
                                    Sheikh Jeelani Islamic Academy
                                </h1>
                                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                                    • Knowledge • Faith • Excellence
                                </p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-1 xl:gap-2">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection(link.href);
                                    }}
                                    className="text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 font-semibold text-sm px-3 xl:px-4 py-2 xl:py-3 rounded-xl transition-all duration-300 relative group"
                                >
                                    {link.name}
                                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:w-3/4 transition-all duration-300 rounded-full" />
                                </a>
                            ))}
                        </div>

                        {/* CTA Button & Theme Toggle */}
                        <div className="hidden lg:flex items-center gap-3">
                            <ThemeToggle />
                            <Link to="/login">
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-6 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300"
                                >
                                    Login Portal
                                </motion.button>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden flex items-center gap-2">
                            <ThemeToggle />
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                <motion.div
                                    animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                                </motion.div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="lg:hidden border-t border-gray-100 dark:border-slate-800 overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl"
                        >
                            <div className="py-4 space-y-1 px-4">
                                {navLinks.map((link, index) => (
                                    <motion.a
                                        key={link.name}
                                        href={link.href}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            scrollToSection(link.href);
                                        }}
                                        className="flex items-center text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 font-medium transition-all duration-200 py-3 px-4 rounded-lg"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05, duration: 0.3 }}
                                        whileHover={{ x: 4 }}
                                    >
                                        {link.name}
                                    </motion.a>
                                ))}
                                <Link to="/login" className="block pt-2">
                                    <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-colors shadow-lg">
                                        Login Portal
                                    </button>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Overlay for mobile menu */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    );
};

export default Navbar;
