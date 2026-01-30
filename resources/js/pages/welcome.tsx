import { login, register } from '@/routes'
import dashboard from '@/routes/dashboard'
import type { Portfolio, SharedData } from '@/types'
import { Head, Link, usePage } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { Code, Github, Linkedin, PenTool, Smartphone, Twitter, Wrench } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { TypeAnimation } from 'react-type-animation'

// Helper component for animating sections on scroll
const AnimatedSection = ({ children }: { children: React.ReactNode }) => (
    <motion.section
        className="w-full py-20 px-4 md:px-8 lg:py-28"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
    >
        {children}
    </motion.section>
)

// Header Component
const Header = () => {
    const { auth, canRegister } = usePage<SharedData>().props
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinkClasses = 'transition-colors hover:text-cyan-400'

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled ? 'bg-gray-900/80 shadow-lg backdrop-blur-sm' : 'bg-transparent'
            }`}
        >
            <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
                <a href="#hero" className="text-xl font-bold tracking-wider transition-transform hover:scale-105">
                    LUTHFI
                </a>
                <nav className="hidden items-center gap-8 md:flex">
                    <a href="#about" className={navLinkClasses}>
                        Tentang
                    </a>
                    <a href="#services" className={navLinkClasses}>
                        Layanan
                    </a>
                    <a href="#portfolio" className={navLinkClasses}>
                        Portofolio
                    </a>
                </nav>
                <div className="flex items-center gap-4">
                    {auth.user ? (
                        <Link
                            href={dashboard.index.url()}
                            className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-600"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href={login.url()} className={navLinkClasses}>
                                Log in
                            </Link>
                            {canRegister && (
                                <Link
                                    href={register.url()}
                                    className="rounded-md border border-cyan-400 px-4 py-2 text-sm font-semibold text-cyan-400 transition-all hover:bg-cyan-400 hover:text-gray-900"
                                >
                                    Register
                                </Link>
                            )}
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}

// Hero Section
const HeroSection = () => (
    <section id="hero" className="flex h-screen min-h-[700px] w-full items-center justify-center bg-gray-900">
        <div className="container mx-auto flex flex-col items-center text-center">
            <motion.h1
                className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                Muhammad Luthfi Naldi
            </motion.h1>
            <div className="mt-4 h-10 text-xl text-cyan-400 sm:h-12 sm:text-3xl">
                <TypeAnimation
                    sequence={[
                        'Web Developer',
                        2000,
                        'Mobile Developer',
                        2000,
                        'UI/UX Enthusiast',
                        2000,
                        'Graphic Designer',
                        2000,
                        'IT Support Specialist',
                        2000,
                    ]}
                    wrapper="span"
                    speed={50}
                    repeat={Infinity}
                    className="font-mono"
                />
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-10"
            >
                <a
                    href="#portfolio"
                    className="rounded-full bg-cyan-500 py-3 px-8 text-lg font-semibold text-white shadow-lg shadow-cyan-500/30 transition-all hover:bg-cyan-600 hover:scale-105"
                >
                    Lihat Karya Saya
                </a>
            </motion.div>
        </div>
    </section>
)

// About Section
const AboutSection = () => (
    <AnimatedSection>
        <div id="about" className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-cyan-400 sm:text-4xl">Tentang Saya</h2>
            <p className="mt-6 text-lg leading-relaxed text-gray-300">
                Saya adalah seorang profesional multi-talenta dengan semangat tinggi di dunia teknologi dan desain.
                Dengan keahlian yang membentang dari pengembangan web dan mobile hingga desain UI/UX dan dukungan
                teknis, saya berdedikasi untuk menciptakan solusi digital yang fungsional, intuitif, dan
                menarik secara visual.
            </p>
        </div>
    </AnimatedSection>
)

// Services Section
const services = [
    {
        icon: Code,
        title: 'Web Development',
        description: 'Membangun aplikasi web yang responsif, cepat, dan modern.',
    },
    {
        icon: Smartphone,
        title: 'Mobile Development',
        description: 'Mengembangkan aplikasi mobile untuk platform Android dan iOS.',
    },
    {
        icon: PenTool,
        title: 'UI/UX & Desain Grafis',
        description: 'Merancang antarmuka yang indah dan pengalaman pengguna yang mulus.',
    },
    {
        icon: Wrench,
        title: 'IT Support',
        description: 'Memberikan dukungan teknis dan solusi untuk masalah komputer.',
    },
]

const ServicesSection = () => (
    <AnimatedSection>
        <div id="services" className="container mx-auto">
            <h2 className="text-center text-3xl font-bold text-cyan-400 sm:text-4xl">Layanan Saya</h2>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                {services.map((service, index) => (
                    <div
                        key={index}
                        className="transform rounded-xl border border-gray-700 bg-gray-800/50 p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/20"
                    >
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
                            <service.icon className="h-8 w-8" />
                        </div>
                        <h3 className="mt-6 text-xl font-bold">{service.title}</h3>
                        <p className="mt-2 text-gray-400">{service.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </AnimatedSection>
)

// Portfolio Section
const PortfolioSection = ({ portfolios }: { portfolios: Portfolio[] }) => (
    <AnimatedSection>
        <div id="portfolio" className="container mx-auto">
            <h2 className="text-center text-3xl font-bold text-cyan-400 sm:text-4xl">Portofolio</h2>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {portfolios.length > 0 ? (
                    portfolios.map((item) => (
                        <a
                            key={item.id}
                            href={item.project_url ?? '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block overflow-hidden rounded-lg border border-gray-700 transition-transform duration-300 hover:-translate-y-2"
                        >
                            <div className="aspect-video w-full overflow-hidden bg-gray-700">
                                <img
                                    src={item.image_path ? `/storage/${item.image_path}` : 'https://placehold.co/600x400/0f172a/38bdf8?text=Project'}
                                    alt={item.title}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                            <div className="bg-gray-800 p-4">
                                <p className="text-sm font-medium text-cyan-400">{item.category}</p>
                                <h3 className="mt-1 text-lg font-semibold">{item.title}</h3>
                            </div>
                        </a>
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-400">
                        <p>Portofolio akan segera ditambahkan. Silakan cek kembali nanti!</p>
                    </div>
                )}
            </div>
        </div>
    </AnimatedSection>
)

// Footer Component
const Footer = () => {
    return (
        <footer className="w-full border-t border-gray-800 bg-gray-900 py-8 px-4">
            <div className="container mx-auto flex flex-col items-center justify-between gap-6 sm:flex-row">
                <p className="text-sm text-gray-400">
                    © {new Date().getFullYear()} Muhammad Luthfi Naldi. All rights reserved.
                </p>
                <div className="flex items-center gap-6">
                    <a href="#" className="text-gray-400 transition-colors hover:text-cyan-400">
                        <Twitter />
                    </a>
                    <a href="#" className="text-gray-400 transition-colors hover:text-cyan-400">
                        <Github />
                    </a>
                    <a href="#" className="text-gray-400 transition-colors hover:text-cyan-400">
                        <Linkedin />
                    </a>
                </div>
            </div>
        </footer>
    )
}

// Main Welcome Component
export default function Welcome({
    canRegister,
    portfolios,
}: {
    canRegister?: boolean
    portfolios: Portfolio[]
}) {
    return (
        <>
            <Head>
                <title>Luthfi Naldi - Developer Portfolio</title>
                <meta
                    name="description"
                    content="Portofolio Muhammad Luthfi Naldi, seorang Web & Mobile Developer, UI/UX Enthusiast, dan IT Support."
                />
                <style>{`
                    html {
                        scroll-behavior: smooth;
                    }
                `}</style>
            </Head>

            <div className="min-h-screen bg-gray-900 text-white">
                <Header />
                <main>
                    <HeroSection />
                    <AboutSection />
                    <ServicesSection />
                    <PortfolioSection portfolios={portfolios} />
                </main>
                <Footer />
            </div>
        </>
    )
}