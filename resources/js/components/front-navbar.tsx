import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Terminal, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SharedData } from '@/types';
import dashboard from '@/routes/dashboard';
import { login } from '@/routes';
import { ModeToggle } from './mode-toggle';

export default function FrontNavbar() {
    const { props, url } = usePage<SharedData>()
    const { auth } = props
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [activeSection, setActiveSection] = useState('')

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)

            // Scroll Spy Logic
            if (url.startsWith('/experience')) {
                setActiveSection('experience')
                return
            }

            const sections = ['hero', 'services', 'portfolio', 'about']
            let current = ''

            for (const section of sections) {
                const element = document.getElementById(section)
                if (element) {
                    const rect = element.getBoundingClientRect()
                    // Check if element is roughly in view (top third of screen)
                    if (rect.top <= 300 && rect.bottom >= 300) {
                        current = section
                    }
                }
            }

            // Default to hero if at top and no specific section found
            if (window.scrollY < 100) current = 'hero'

            setActiveSection(current)
        }

        // Initial check
        handleScroll()

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [url])

    // Close mobile menu on navigation
    const handleNavClick = () => {
        setIsMobileMenuOpen(false)
    }

    const getNavLinkClasses = (section: string) => {
        const isActive = activeSection === section
        const baseClasses = 'transition-all duration-300 underline-offset-4'

        if (isActive) {
            return `${baseClasses} text-cyan-400 font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] active-glow`
        }

        return `${baseClasses} text-gray-400 hover:text-cyan-400 hover:underline decoration-cyan-500/50`
    }

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-mono border-b ${isScrolled ? 'bg-gray-950/90 shadow-lg backdrop-blur-sm border-cyan-500/20' : 'bg-transparent border-transparent'
                }`}
        >
            <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-20">
                <a href="/#hero" className="flex items-center gap-2 text-xl font-bold tracking-wider text-cyan-400 transition-transform hover:scale-105">
                    <Terminal className="h-6 w-6" />
                    <span>~/{auth.user ? 'admin' : 'visitor'}</span>
                </a>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-8 md:flex text-sm">
                    <a href="/#portfolio" className={getNavLinkClasses('portfolio')}>
                        ./portfolio
                    </a>
                    <a href="/#services" className={getNavLinkClasses('services')}>
                        ./services
                    </a>
                    <Link href="/experience" className={getNavLinkClasses('experience')}>
                        ./experience
                    </Link>
                    <a href="/#about" className={getNavLinkClasses('about')}>
                        ./about
                    </a>
                </nav>

                <div className="flex items-center gap-4">
                    {auth.user ? (
                        <Link
                            href={dashboard.index.url()}
                            className="rounded border border-cyan-500/50 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400 transition-all hover:bg-cyan-500 hover:text-gray-900"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <Link href={login.url()} className="hidden md:block text-sm font-medium text-gray-500 hover:text-gray-300">
                            Login
                        </Link>
                    )}

                    <ModeToggle />

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden border-t border-gray-800 bg-gray-950/95 backdrop-blur-sm"
                    >
                        <nav className="container mx-auto flex flex-col px-4 py-4 space-y-4">
                            <a
                                href="/#services"
                                onClick={handleNavClick}
                                className={`text-lg py-2 border-b border-gray-800 ${activeSection === 'services' ? 'text-cyan-400 font-bold' : 'text-gray-300 hover:text-cyan-400'}`}
                            >
                                ./services
                            </a>
                            <a
                                href="/#portfolio"
                                onClick={handleNavClick}
                                className={`text-lg py-2 border-b border-gray-800 ${activeSection === 'portfolio' ? 'text-cyan-400 font-bold' : 'text-gray-300 hover:text-cyan-400'}`}
                            >
                                ./portfolio
                            </a>
                            <Link
                                href="/experience"
                                onClick={handleNavClick}
                                className={`text-lg py-2 border-b border-gray-800 ${activeSection === 'experience' ? 'text-cyan-400 font-bold' : 'text-gray-300 hover:text-cyan-400'}`}
                            >
                                ./experience
                            </Link>
                            <a
                                href="/#contact"
                                onClick={handleNavClick}
                                className={`text-lg py-2 ${activeSection === 'contact' ? 'text-cyan-400 font-bold' : 'text-gray-300 hover:text-cyan-400'}`}
                            >
                                ./contact
                            </a>
                            <a
                                href="/#about"
                                onClick={handleNavClick}
                                className={`text-lg py-2 border-b border-gray-800 ${activeSection === 'about' ? 'text-cyan-400 font-bold' : 'text-gray-300 hover:text-cyan-400'}`}
                            >
                                ./about
                            </a>
                            {!auth.user && (
                                <Link
                                    href={login.url()}
                                    className="text-lg text-gray-500 hover:text-gray-300 transition-colors py-2"
                                >
                                    Login
                                </Link>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
