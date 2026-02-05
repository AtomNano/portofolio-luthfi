import { login } from '@/routes'
import dashboard from '@/routes/dashboard'
import type { Portfolio, SharedData, User } from '@/types'
import { Head, Link, usePage } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { Code, Github, Linkedin, PenTool, Smartphone, Twitter, Terminal, Cpu, Globe, ArrowRight, Instagram, Phone } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { TypeAnimation } from 'react-type-animation'

// Helper component for animating sections on scroll
const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <motion.section
        className={`w-full py-20 px-4 md:px-8 lg:py-28 ${className}`}
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
    const { auth } = usePage<SharedData>().props
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinkClasses = 'text-gray-400 transition-colors hover:text-cyan-400 hover:underline decoration-cyan-500/50 underline-offset-4'

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-mono border-b ${isScrolled ? 'bg-gray-950/90 shadow-lg backdrop-blur-sm border-cyan-500/20' : 'bg-transparent border-transparent'
                }`}
        >
            <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-20">
                <a href="#hero" className="flex items-center gap-2 text-xl font-bold tracking-wider text-cyan-400 transition-transform hover:scale-105">
                    <Terminal className="h-6 w-6" />
                    <span>~/{auth.user ? 'admin' : 'visitor'}</span>
                </a>
                <nav className="hidden items-center gap-8 md:flex text-sm">
                    <a href="#about" className={navLinkClasses}>
                        ./about
                    </a>
                    <a href="#services" className={navLinkClasses}>
                        ./services
                    </a>
                    <a href="#portfolio" className={navLinkClasses}>
                        ./portfolio
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
                        <Link href={login.url()} className="text-sm font-medium text-gray-500 hover:text-gray-300">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}

// Hero Section
const HeroSection = ({ owner }: { owner?: User }) => (
    <section id="hero" className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gray-950 pt-5">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

        <div className="container relative mx-auto flex flex-col-reverse gap-10 lg:flex-row lg:items-center px-20">
            <div className="flex flex-1 flex-col items-start lg:items-start text-left">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-4 inline-flex items-center rounded border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-400"
                >
                    <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-cyan-400"></span>
                    Available for hire
                </motion.div>

                <motion.h1
                    className="font-mono text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Hello, I'm <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                        {owner?.name || 'Muhammad Luthfi Naldi'}
                    </span>
                </motion.h1>

                <div className="mt-6 h-8 text-xl text-gray-400 sm:text-2xl font-mono">
                    <span>&gt; </span>
                    <TypeAnimation
                        sequence={[
                            owner?.job_title || 'Full Stack Developer',
                            2000,
                            'Mobile App Developer',
                            2000,
                            'UI/UX Enthusiast',
                            2000,
                            'System Administrator',
                            2000,
                        ]}
                        wrapper="span"
                        speed={50}
                        repeat={Infinity}
                    />
                    <span className="animate-blink">_</span>
                </div>

                <motion.p
                    className="mt-6 max-w-xl text-lg text-gray-400 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {owner?.about_me || "I craft robust digital solutions with a focus on performance, aesthetics, and user experience. Merging code and design to build the future."}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-10 flex gap-4"
                >
                    <a
                        href="#portfolio"
                        className="group flex items-center gap-2 rounded bg-cyan-500 px-6 py-3 text-lg font-semibold text-gray-900 transition-all hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                    >
                        View Projects
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                    <a
                        href="#contact"
                        className="rounded border border-gray-700 bg-gray-900/50 px-6 py-3 text-lg font-semibold text-white transition-all hover:bg-gray-800 hover:border-gray-500"
                    >
                        Contact Me
                    </a>
                </motion.div>
            </div>

            {/* Profile Image / Terminal Graphic */}
            <motion.div
                className="flex-1 flex justify-center lg:justify-end"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className="relative h-80 w-80 lg:h-96 lg:w-96">
                    <div className="absolute inset-0 rotate-6 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 opacity-20 blur-2xl filter" />
                    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">
                        {/* Fake Terminal Header */}
                        <div className="flex h-8 items-center gap-2 border-b border-gray-800 bg-gray-800/50 px-4">
                            <div className="h-3 w-3 rounded-full bg-red-500" />
                            <div className="h-3 w-3 rounded-full bg-yellow-500" />
                            <div className="h-3 w-3 rounded-full bg-green-500" />
                        </div>
                        {/* Profile Image - Placeholder until user uploads */}
                        <img
                            src={owner?.avatar ? `/storage/${owner.avatar}` : "/images/profile.jpg"}
                            onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(owner?.name || 'Luthfi Naldi')}&background=0D8ABC&color=fff&size=512`
                            }}
                            alt={owner?.name || "Muhammad Luthfi Naldi"}
                            className="h-full w-full object-cover"
                        />

                        {/* Overlay Code Effect (Optional) */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    </div>
                </div>
            </motion.div>
        </div>
    </section>
)

// About Section
const AboutSection = ({ owner }: { owner?: User }) => (
    <AnimatedSection className="bg-gray-900">
        <div id="about" className="container mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="order-2 lg:order-1 relative">
                <div className="absolute -left-4 -top-4 text-9xl font-bold text-gray-800/20 pointer-events-none select-none">
                    01
                </div>
                <h2 className="text-3xl font-bold text-cyan-400 sm:text-4xl font-mono">// About_Me</h2>
                <h3 className="mt-4 text-2xl font-bold text-white">Coding with passion, Designing with purpose.</h3>
                <p className="mt-6 text-lg leading-relaxed text-gray-400">
                    {owner?.about_me || "I am a multi-talented professional navigating the intersection of technology and creativity. From architecting complex backend systems with modern frameworks to crafting pixel-perfect interfaces, I view every project as an opportunity to solve problems elegantly."}
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="rounded border border-gray-800 bg-gray-950 p-4">
                        <span className="block text-3xl font-bold text-white">3+</span>
                        <span className="text-sm text-gray-500">Years Experience</span>
                    </div>
                    <div className="rounded border border-gray-800 bg-gray-950 p-4">
                        <span className="block text-3xl font-bold text-white">20+</span>
                        <span className="text-sm text-gray-500">Projects Completed</span>
                    </div>
                </div>
            </div>
            <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-8">
                    <div className="aspect-square rounded-2xl bg-gray-800 flex items-center justify-center p-6 border border-gray-700"> <Code className="w-12 h-12 text-cyan-500" /> </div>
                    <div className="aspect-square rounded-2xl bg-gray-800 flex items-center justify-center p-6 border border-gray-700"> <Globe className="w-12 h-12 text-blue-500" /> </div>
                </div>
                <div className="space-y-4">
                    <div className="aspect-square rounded-2xl bg-gray-800 flex items-center justify-center p-6 border border-gray-700"> <Cpu className="w-12 h-12 text-purple-500" /> </div>
                    <div className="aspect-square rounded-2xl bg-gray-800 flex items-center justify-center p-6 border border-gray-700"> <Smartphone className="w-12 h-12 text-green-500" /> </div>
                </div>
            </div>
        </div>
    </AnimatedSection>
)

// Services Section
const services = [
    {
        icon: Code,
        title: 'Full Stack Dev',
        description: 'Building end-to-end web solutions using Laravel, React, and modern tech stacks.',
    },
    {
        icon: Smartphone,
        title: 'Mobile Apps',
        description: 'Native and cross-platform mobile application development for iOS and Android.',
    },
    {
        icon: PenTool,
        title: 'UI/UX Design',
        description: 'Creating intuitive and visually stunning interfaces that users love.',
    },
    {
        icon: Terminal,
        title: 'SysAdmin & Support',
        description: 'Server management, deployment automation, and technical infrastructure support.',
    },
]

const ServicesSection = () => (
    <AnimatedSection className="bg-gray-950 !pt-10 lg:!pt-20">
        <div id="services" className="container mx-auto">
            <div className="flex flex-col items-center text-center">
                <span className="text-cyan-400 font-mono mb-2">./expertise</span>
                <h2 className="text-3xl font-bold text-white sm:text-4xl">What I Do</h2>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {services.map((service, index) => (
                    <div
                        key={index}
                        className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-8 transition-all hover:border-cyan-500/50 hover:bg-gray-900"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        <service.icon className="h-10 w-10 text-cyan-400 mb-6" />
                        <h3 className="mb-3 text-xl font-bold text-white">{service.title}</h3>
                        <p className="text-gray-400 leading-relaxed text-sm">{service.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </AnimatedSection>
)

// Portfolio Section
const PortfolioSection = ({ portfolios }: { portfolios: Portfolio[] }) => (
    <AnimatedSection className="bg-gray-900">
        <div id="portfolio" className="container mx-auto">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <span className="text-cyan-400 font-mono mb-2 block">./projects</span>
                    <h2 className="text-3xl font-bold text-white sm:text-4xl">Featured Work</h2>
                </div>
                <a href="#" className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    View All <ArrowRight className="h-4 w-4" />
                </a>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {portfolios.length > 0 ? (
                    portfolios.map((item) => (
                        <Link
                            key={item.id}
                            href={`/portfolios/${item.id}`} // Using direct URL since route helper might be unavailable in this context without props. Or use portfolios.show.url(item.id) if available. Assuming standard resource route.
                            className="group relative block h-full overflow-hidden rounded-xl bg-gray-950 border border-gray-800 transition-all hover:-translate-y-2 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10"
                        >
                            <div className="aspect-[16/10] w-full overflow-hidden">
                                <img
                                    src={item.image_path ? `/storage/${item.image_path}` : 'https://placehold.co/600x400/0f172a/38bdf8?text=Project+Preview'}
                                    alt={item.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-gray-900/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                                    <span className="rounded-full bg-cyan-500 px-6 py-2 font-bold text-gray-900 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        View Details
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col p-6">
                                <div className="mb-4 flex flex-wrap gap-2">
                                    <span className="inline-block rounded border border-cyan-500/20 bg-cyan-950/30 px-2 py-1 text-xs font-medium text-cyan-300">
                                        {item.category}
                                    </span>
                                    {item.tools && item.tools.length > 0 && (
                                        <span className="inline-block rounded border border-gray-700 bg-gray-800/50 px-2 py-1 text-xs font-medium text-gray-400">
                                            {item.tools[0]}
                                        </span>
                                    )}
                                </div>
                                <h3 className="mb-2 text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="line-clamp-2 text-sm text-gray-400">
                                    {item.description}
                                </p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full py-16 text-center border border-dashed border-gray-800 rounded-xl">
                        <Terminal className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white">No projects found</h3>
                        <p className="text-gray-500">I'm currently working on something awesome.</p>
                    </div>
                )}
            </div>

            <div className="mt-12 flex justify-center md:hidden">
                <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    View All <ArrowRight className="h-4 w-4" />
                </a>
            </div>
        </div>
    </AnimatedSection>
)

// Footer Component
const Footer = ({ owner }: { owner?: User }) => {
    return (
        <footer id="contact" className="border-t border-gray-800 bg-gray-950 py-12 px-4 font-mono">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold text-white mb-2">{owner?.name || 'Luthfi Naldi'}</h3>
                    <p className="text-sm text-gray-500">© {new Date().getFullYear()} All rights reserved.</p>
                    {owner?.phone && (
                        <p className="text-sm text-gray-400 mt-2 flex items-center justify-center md:justify-start gap-2">
                            <Phone className="h-4 w-4" /> {owner.phone}
                        </p>
                    )}
                </div>

                <div className="flex gap-6">
                    {owner?.github && (
                        <a href={owner.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyan-400 transition-colors">
                            <Github className="h-6 w-6" />
                        </a>
                    )}
                    {owner?.linkedin && (
                        <a href={owner.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyan-400 transition-colors">
                            <Linkedin className="h-6 w-6" />
                        </a>
                    )}
                    {owner?.instagram && (
                        <a href={owner.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyan-400 transition-colors">
                            <Instagram className="h-6 w-6" />
                        </a>
                    )}
                </div>
            </div>
        </footer>
    )
}

// Main Welcome Component
export default function Welcome({
    canRegister,
    portfolios,
    owner,
}: {
    canRegister?: boolean
    portfolios: Portfolio[]
    owner?: User
}) {
    return (
        <>
            <Head>
                <title>{`${owner?.name || 'Luthfi Naldi'} - ${owner?.job_title || 'Full Stack Developer'}`}</title>
                <style>{`
                    html { scroll-behavior: smooth; }
                    ::selection { background-color: rgba(34, 211, 238, 0.3); color: #fff; }
                `}</style>
            </Head>

            <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-cyan-500/30">
                <Header />
                <main>
                    <HeroSection owner={owner} />
                    <AboutSection owner={owner} />
                    <ServicesSection />
                    <PortfolioSection portfolios={portfolios} />
                </main>
                <Footer owner={owner} />
            </div>
        </>
    )
}