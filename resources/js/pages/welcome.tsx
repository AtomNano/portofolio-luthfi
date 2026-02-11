import { Head, Link, usePage } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code, Github, Linkedin, PenTool, Smartphone, Twitter, Terminal, Cpu, Globe, ArrowRight, Instagram, Phone, Menu, X, ArrowUp } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { DiAndroid, DiCode, DiCss3, DiDatabase, DiDocker, DiGithubBadge, DiHtml5, DiLaravel, DiLinux, DiPhp, DiUbuntu } from 'react-icons/di'
import { SiFlutter } from 'react-icons/si'
import { TypeAnimation } from 'react-type-animation'
import FrontNavbar from '@/components/front-navbar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { SERVICES } from '@/constants/services'
import { login } from '@/routes'
import dashboard from '@/routes/dashboard'
import type { Portfolio, SharedData, User } from '@/types'
import { getAvatarUrl, getPortfolioImageUrl } from '@/utils/image'

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

// Hero Section
const HeroSection = ({ owner }: { owner?: User }) => (
    <section id="hero" className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background pt-5">
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
                    className="font-mono text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Hello, I'm <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                        {owner?.name || 'Muhammad Luthfi Naldi'}
                    </span>
                </motion.h1>

                <div className="mt-6 h-8 text-xl text-muted-foreground sm:text-2xl font-mono">
                    <span>&gt; </span>
                    <TypeAnimation
                        sequence={[
                            owner?.job_title || 'Full Stack Developer',
                            2000,
                            'Mobile App Developer',
                            2000,
                            'UI/UX Enthusiast',
                            2000,
                            'IT Support',
                            2000,
                            '3D Artist',
                            2000,
                        ]}
                        wrapper="span"
                        speed={50}
                        repeat={Infinity}
                    />
                    <span className="animate-blink">_</span>
                </div>

                <motion.p
                    className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed"
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
                        className="group flex items-center gap-2 rounded bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground transition-all hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                    >
                        View Projects
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                    <a
                        href="#contact"
                        className="rounded border border-border bg-secondary/50 px-6 py-3 text-lg font-semibold text-foreground transition-all hover:bg-secondary hover:border-gray-500"
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
                    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
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

// Services Section
const ServicesSection = () => (
    <AnimatedSection className="bg-background !pt-10 lg:!pt-20">
        <div id="services" className="container mx-auto">
            <div className="flex flex-col items-center text-center">
                <span className="text-cyan-400 font-mono mb-2">./expertise</span>
                <h2 className="text-3xl font-bold text-white sm:text-4xl">What I Do</h2>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {SERVICES.map((service, index) => (
                    <div
                        key={index}
                        className="group relative overflow-hidden rounded-xl border border-border bg-card/50 p-8 transition-all hover:border-cyan-500/50 hover:bg-card"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        <service.icon className="h-10 w-10 text-cyan-400 mb-6" />
                        <h3 className="mb-3 text-xl font-bold text-foreground">{service.title}</h3>
                        <p className="text-muted-foreground leading-relaxed text-sm">{service.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </AnimatedSection>
)

// Portfolio Section
const PortfolioSection = ({ portfolios }: { portfolios: Portfolio[] }) => {
    const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);

    return (
        <AnimatedSection className="bg-muted/50 !py-6">
            <div id="portfolio" className="container mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <span className="text-cyan-400 font-mono mb-2 block">./projects</span>
                        <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Featured Work</h2>
                    </div>
                    {/* <a href="#" className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        View All <ArrowRight className="h-4 w-4" />
                    </a> */}
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {portfolios.length > 0 ? (
                        portfolios.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedPortfolio(item)}
                                className="group relative block h-full overflow-hidden rounded-xl bg-card/30 backdrop-blur-md border border-border transition-all hover:-translate-y-2 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10 cursor-pointer"
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
                                            <span className="inline-block rounded border border-border bg-secondary/50 px-2 py-1 text-xs font-medium text-muted-foreground">
                                                {item.tools[0]}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="mb-2 text-xl font-bold text-foreground group-hover:text-cyan-400 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="line-clamp-2 text-sm text-muted-foreground">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-16 text-center border border-dashed border-border rounded-xl">
                            <Terminal className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-foreground">No projects found</h3>
                            <p className="text-muted-foreground">I'm currently working on something awesome.</p>
                        </div>
                    )}
                </div>

                {/* Mobile View All button - hidden for now as per design */}
                {/* <div className="mt-12 flex justify-center md:hidden">
                    <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        View All <ArrowRight className="h-4 w-4" />
                    </a>
                </div> */}
            </div>

            {/* Portfolio Modal */}
            <Dialog open={!!selectedPortfolio} onOpenChange={(open) => !open && setSelectedPortfolio(null)}>
                <DialogContent className="sm:max-w-7xl w-[95vw] md:w-full bg-background/90 backdrop-blur-xl border-border text-foreground p-0 overflow-hidden max-h-[90vh] md:h-[85vh] flex flex-col md:flex-row">
                    {selectedPortfolio && (
                        <>
                            {/* Image Section (65-70% width) */}
                            <div className="w-full md:w-[65%] lg:w-[70%] bg-black relative min-h-[300px] md:h-full flex items-center justify-center overflow-hidden group">
                                {/* Blurred Background Layer */}
                                <div
                                    className="absolute inset-0 opacity-30 blur-xl scale-110 transition-transform duration-700 group-hover:scale-105"
                                    style={{
                                        backgroundImage: `url(${selectedPortfolio.image_path ? `/storage/${selectedPortfolio.image_path}` : 'https://placehold.co/600x400/0f172a/38bdf8?text=Project+Preview'})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                />

                                {/* Main Image Layer */}
                                <img
                                    src={selectedPortfolio.image_path ? `/storage/${selectedPortfolio.image_path}` : 'https://placehold.co/600x400/0f172a/38bdf8?text=Project+Preview'}
                                    alt={selectedPortfolio.title}
                                    className="relative z-10 max-h-full max-w-full object-contain shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
                                />

                                {/* Gradient Overlay for better blend */}
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/50 via-transparent to-transparent pointer-events-none md:bg-gradient-to-r" />
                            </div>

                            {/* Content Section (30-35% width) */}
                            <div className="w-full md:w-[35%] lg:w-[30%] flex flex-col h-full bg-card border-l border-border">
                                {/* Header */}
                                <div className="p-6 md:p-8 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-20">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/30 px-3 py-1 text-xs font-semibold text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                                            {selectedPortfolio.category}
                                        </span>
                                        {selectedPortfolio.created_at && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                                                {new Date(selectedPortfolio.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short' })}
                                            </span>
                                        )}
                                    </div>
                                    <DialogTitle className="text-2xl md:text-3xl font-bold text-foreground leading-tight tracking-tight">
                                        {selectedPortfolio.title}
                                    </DialogTitle>
                                </div>

                                {/* Scrollable Content */}
                                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                                    <div className="prose prose-invert prose-sm max-w-none">
                                        <DialogDescription className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm md:text-base font-light">
                                            {selectedPortfolio.description}
                                        </DialogDescription>
                                    </div>

                                    {/* Tech Stack */}
                                    {selectedPortfolio.tools && selectedPortfolio.tools.length > 0 && (
                                        <div>
                                            <h4 className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest mb-4">
                                                <Terminal className="h-4 w-4" />
                                                Technologies
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedPortfolio.tools.map((tool, index) => (
                                                    <span
                                                        key={index}
                                                        className="group flex items-center gap-1.5 rounded-md border border-border bg-secondary/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-cyan-500/50 hover:bg-cyan-950/20 hover:text-cyan-300"
                                                    >
                                                        <Code className="h-3 w-3 text-muted-foreground transition-colors group-hover:text-cyan-400" />
                                                        {tool}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer / Actions */}
                                <div className="p-6 md:p-8 border-t border-border bg-card sticky bottom-0 z-20">
                                    <div className="flex flex-col gap-3">
                                        {selectedPortfolio.project_url && (
                                            <a
                                                href={selectedPortfolio.project_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:-translate-y-0.5"
                                            >
                                                <Globe className="h-4 w-4" />
                                                Visit Live Project
                                            </a>
                                        )}
                                        {selectedPortfolio.github_url ? (
                                            <a
                                                href={selectedPortfolio.github_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm font-semibold text-foreground transition-all hover:bg-secondary hover:border-gray-500 hover:text-cyan-300"
                                            >
                                                <Github className="h-4 w-4" />
                                                View Source Code
                                            </a>
                                        ) : (
                                            <a
                                                href="#contact"
                                                onClick={() => setSelectedPortfolio(null)}
                                                className="flex items-center justify-center gap-2 rounded-lg border border-border bg-transparent px-4 py-3 text-sm font-semibold text-muted-foreground transition-all hover:bg-white/5 hover:text-foreground"
                                            >
                                                <ArrowRight className="h-4 w-4" />
                                                Contact for details
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </AnimatedSection>
    );
}

// About Section
const AboutSection = ({ owner }: { owner?: User }) => (
    <AnimatedSection className="bg-card">
        <div id="about" className="container mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="order-2 lg:order-1 relative">
                <div className="absolute -left-4 -top-4 text-9xl font-bold text-gray-800/20 pointer-events-none select-none">
                    01
                </div>
                <h2 className="text-3xl font-bold text-cyan-400 sm:text-4xl font-mono">// About_Me</h2>
                <h3 className="mt-4 text-2xl font-bold text-foreground">Coding with passion, Designing with purpose.</h3>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                    {owner?.about_me || "I am a multi-talented professional navigating the intersection of technology and creativity. From architecting complex backend systems with modern frameworks to crafting pixel-perfect interfaces, I view every project as an opportunity to solve problems elegantly."}
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="rounded border border-border bg-background p-4">
                        <span className="block text-3xl font-bold text-foreground">{owner?.years_experience || 3}+</span>
                        <span className="text-sm text-muted-foreground">Years Experience</span>
                    </div>
                    <div className="rounded border border-border bg-background p-4">
                        <span className="block text-3xl font-bold text-foreground">{owner?.projects_completed || 20}+</span>
                        <span className="text-sm text-muted-foreground">Projects Completed</span>
                    </div>
                </div>
            </div>
            <div className="order-1 lg:order-2 grid grid-cols-3 sm:grid-cols-4 gap-4">
                {[
                    { icon: DiPhp, color: "text-purple-400" },
                    { icon: DiHtml5, color: "text-orange-500" },
                    { icon: DiCss3, color: "text-blue-500" },
                    { icon: DiAndroid, color: "text-green-500" },
                    { icon: DiLaravel, color: "text-red-500" },
                    { icon: SiFlutter, color: "text-cyan-400" },
                    { icon: DiDocker, color: "text-blue-400" },
                    { icon: DiUbuntu, color: "text-orange-600" },
                    { icon: DiLinux, color: "text-yellow-500" },
                    { icon: DiGithubBadge, color: "text-white" },
                    { icon: DiDatabase, color: "text-gray-400" },
                    { icon: DiCode, color: "text-green-400" },
                ].map((tech, index) => (
                    <div key={index} className="aspect-square rounded-2xl bg-secondary flex items-center justify-center p-4 border border-border hover:border-cyan-500/50 hover:bg-secondary/80 transition-all duration-300 group">
                        <tech.icon className={`w-12 h-12 ${tech.color} group-hover:scale-110 transition-transform duration-300`} />
                    </div>
                ))}
            </div>
        </div>
    </AnimatedSection>
)

// Footer Component
const Footer = ({ owner }: { owner?: User }) => {
    return (
        <footer id="contact" className="border-t border-border bg-background py-12 px-4 font-mono">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold text-foreground mb-2">{owner?.name || 'Luthfi Naldi'}</h3>
                    <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} All rights reserved.</p>
                    {owner?.phone && (
                        <p className="text-sm text-muted-foreground mt-2 flex items-center justify-center md:justify-start gap-2">
                            <Phone className="h-4 w-4" /> {owner.phone}
                        </p>
                    )}
                </div>

                <div className="flex gap-6">
                    {owner?.github && (
                        <a href={owner.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-cyan-400 transition-colors">
                            <Github className="h-6 w-6" />
                        </a>
                    )}
                    {owner?.linkedin && (
                        <a href={owner.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-cyan-400 transition-colors">
                            <Linkedin className="h-6 w-6" />
                        </a>
                    )}
                    {owner?.instagram && (
                        <a href={owner.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-cyan-400 transition-colors">
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
    portfolios,
    owner,
}: {
    portfolios: Portfolio[]
    owner?: User
}) {
    const [showScrollTop, setShowScrollTop] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <>
            <Head>
                <title>{`${owner?.name || 'Luthfi Naldi'} - ${owner?.job_title || 'Full Stack Developer'}`}</title>
                <meta name="description" content={`Portfolio website of ${owner?.name || 'Luthfi Naldi'} - ${owner?.job_title || 'Full Stack Developer'}. View my projects and get in touch.`} />
                <style>{`
                    html { scroll-behavior: smooth; }
                    ::selection { background-color: rgba(34, 211, 238, 0.3); color: #fff; }
                `}</style>
            </Head>

            <div className="min-h-screen bg-background text-foreground font-sans selection:bg-cyan-500/30">
                <FrontNavbar />
                <main>
                    <HeroSection owner={owner} />
                    <PortfolioSection portfolios={portfolios} />
                    <ServicesSection />
                    <AboutSection owner={owner} />
                </main>
                <Footer owner={owner} />

                {/* Scroll to Top Button */}
                <AnimatePresence>
                    {showScrollTop && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={scrollToTop}
                            className="fixed bottom-6 right-6 z-40 rounded-full bg-cyan-600/80 p-3 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-cyan-500 hover:scale-110"
                            aria-label="Scroll to top"
                        >
                            <ArrowUp className="h-5 w-5" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </>
    )
}