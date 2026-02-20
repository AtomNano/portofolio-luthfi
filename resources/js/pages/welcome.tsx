import { Head } from '@inertiajs/react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import {
    ArrowRight,
    ArrowUp,
    Code,
    Github,
    Globe,
    Heart,
    Instagram,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    Send,
    Terminal,
    Twitter,
    Facebook,
    Youtube,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { TypeAnimation } from 'react-type-animation';
import FrontNavbar from '@/components/front-navbar';
import { AVAILABLE_ICONS } from '@/components/icon-selector';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';
import { SERVICES } from '@/constants/services';
import type { Portfolio } from '@/types';
import type { UserProfile } from '@/types/profile';

// Helper component for animating sections on scroll
const AnimatedSection = ({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <motion.section
        className={`w-full px-4 py-20 md:px-8 lg:py-28 ${className}`}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
    >
        {children}
    </motion.section>
);

// Hero Section
const HeroSection = ({ owner }: { owner?: UserProfile }) => (
    <section
        id="hero"
        className="relative flex min-h-[calc(100vh-4rem)] w-full items-center justify-center overflow-hidden bg-background pt-20 lg:min-h-screen lg:pt-0"
    >
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#64748b_1px,transparent_1px),linear-gradient(to_bottom,#64748b_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#475569_1px,transparent_1px),linear-gradient(to_bottom,#475569_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:4rem_4rem] opacity-10 dark:opacity-20" />

        <div className="relative container mx-auto flex flex-col-reverse gap-10 px-6 md:px-12 lg:flex-row lg:items-center lg:px-20">
            <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-400 backdrop-blur-sm lg:mb-4 lg:rounded lg:px-3 lg:py-1"
                >
                    <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-cyan-400"></span>
                    Available for hire
                </motion.div>

                <motion.h1
                    className="font-mono text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Hello, I'm <br />
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                        {owner?.name || 'Muhammad Luthfi Naldi'}
                    </span>
                </motion.h1>

                <div className="mt-4 h-8 font-mono text-lg text-muted-foreground sm:mt-6 sm:text-l md:text-2xl">
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
                        ]}
                        wrapper="span"
                        speed={50}
                        repeat={Infinity}
                    />
                    <span className="animate-blink">_</span>
                </div>

                <motion.p
                    className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {owner?.bio ||
                        'I craft robust digital solutions with a focus on performance, aesthetics, and user experience. Merging code and design to build the future.'}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:mt-10 lg:justify-start"
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
                        className="rounded border border-border bg-secondary/50 px-6 py-3 text-lg font-semibold text-foreground transition-all hover:border-gray-500 hover:bg-secondary text-center"
                    >
                        Contact Me
                    </a>
                </motion.div>
            </div>

            {/* Profile Image / Terminal Graphic */}
            <motion.div
                className="flex flex-1 justify-center lg:justify-end"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className="relative h-64 w-64 sm:h-80 sm:w-80 lg:h-96 lg:w-96">
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
                            src={
                                owner?.avatar
                                    ? `/storage/${owner.avatar}`
                                    : '/images/profile.jpg'
                            }
                            onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(owner?.name || 'Luthfi Naldi')}&background=0D8ABC&color=fff&size=512`;
                            }}
                            alt={owner?.name || 'Muhammad Luthfi Naldi'}
                            className="h-full w-full object-cover"
                        />

                        {/* Overlay Code Effect (Optional) */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    </div>
                </div>
            </motion.div>
        </div>
    </section>
);

// Services Section
const ServicesSection = () => (
    <AnimatedSection className="bg-background !pt-10 lg:!pt-20">
        <div id="services" className="container mx-auto">
            <div className="flex flex-col items-center text-center">
                <span className="mb-2 font-mono text-cyan-400">
                    ./expertise
                </span>
                <h2 className="text-3xl font-bold text-white sm:text-4xl">
                    What I Do
                </h2>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 md:mt-12 md:gap-6 lg:grid-cols-4">
                {SERVICES.map((service, index) => (
                    <div
                        key={index}
                        className="group relative overflow-hidden rounded-xl border border-border bg-card/50 p-5 transition-all hover:border-cyan-500/50 hover:bg-card md:p-8"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        <service.icon className="mb-4 h-8 w-8 text-cyan-400 md:mb-6 md:h-10 md:w-10" />
                        <h3 className="mb-2 text-lg font-bold text-foreground md:mb-3 md:text-xl">
                            {service.title}
                        </h3>
                        <p className="text-xs leading-relaxed text-muted-foreground md:text-sm">
                            {service.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    </AnimatedSection>
);

// Image Carousel Component (extracted to respect Rules of Hooks)
const ImageCarousel = ({ portfolio }: { portfolio: Portfolio }) => {
    const allImages = [
        ...(portfolio.image_path
            ? [{ id: 0, image_path: portfolio.image_path }]
            : []),
        ...(portfolio.images || []),
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Reset index when portfolio changes
    useEffect(() => {
        // eslint-disable-next-line
        setCurrentImageIndex(0);
    }, [portfolio.id]);

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentImageIndex(
            (prev) => (prev - 1 + allImages.length) % allImages.length,
        );
    };

    const currentImage = allImages[currentImageIndex];

    return (
        <>
            {/* Blurred Background Layer */}
            <div
                className="absolute inset-0 scale-110 opacity-30 blur-xl transition-transform duration-700 group-hover:scale-105"
                style={{
                    backgroundImage: `url(${currentImage?.image_path ? `/storage/${currentImage.image_path}` : 'https://placehold.co/600x400/0f172a/38bdf8?text=Project+Preview'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            {/* Main Image Layer */}
            <div className="relative z-10 flex h-full w-full items-center justify-center p-4">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={`main-image-${currentImageIndex}`}
                        src={
                            currentImage?.image_path
                                ? `/storage/${currentImage.image_path}`
                                : 'https://placehold.co/600x400/0f172a/38bdf8?text=Project+Preview'
                        }
                        alt={portfolio.title}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="max-h-full max-w-full object-contain shadow-2xl"
                    />
                </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            {allImages.length > 1 && (
                <>
                    <button
                        onClick={prevImage}
                        className="absolute top-1/2 left-4 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-colors group-hover:opacity-100 hover:bg-cyan-500/80"
                    >
                        <ArrowRight className="h-6 w-6 rotate-180" />
                    </button>
                    <button
                        onClick={nextImage}
                        className="absolute top-1/2 right-4 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-colors group-hover:opacity-100 hover:bg-cyan-500/80"
                    >
                        <ArrowRight className="h-6 w-6" />
                    </button>

                    {/* Thumbnails / Dots */}
                    <div className="absolute bottom-4 left-1/2 z-20 flex max-w-[90%] -translate-x-1/2 gap-2 overflow-x-auto rounded-lg bg-black/30 p-2 backdrop-blur-sm">
                        {allImages.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentImageIndex(idx);
                                }}
                                className={`relative h-12 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                                    currentImageIndex === idx
                                        ? 'scale-105 border-cyan-500 shadow-lg shadow-cyan-500/20'
                                        : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                            >
                                <img
                                    src={`/storage/${img.image_path}`}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </>
            )}

            {/* Gradient Overlay for better blend */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-950/50 via-transparent to-transparent md:bg-gradient-to-r" />
        </>
    );
};

// Portfolio Section
const PortfolioSection = ({ portfolios }: { portfolios: Portfolio[] }) => {
    const [selectedPortfolio, setSelectedPortfolio] =
        useState<Portfolio | null>(null);

    return (
        <AnimatedSection className="bg-muted/50 !py-6">
            <div id="portfolio" className="container mx-auto">
                <div className="mb-12 flex items-center justify-between">
                    <div>
                        <span className="mb-2 block font-mono text-cyan-400">
                            ./projects
                        </span>
                        <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                            Featured Work
                        </h2>
                    </div>
                    {/* <a href="#" className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        View All <ArrowRight className="h-4 w-4" />
                    </a> */}
                </div>

                <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:grid md:overflow-visible md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
                    {portfolios.length > 0 ? (
                        portfolios.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedPortfolio(item)}
                                className="group relative block h-full min-w-[85vw] snap-center cursor-pointer overflow-hidden rounded-xl border border-border bg-card/30 backdrop-blur-md transition-all hover:-translate-y-2 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10 sm:min-w-[60vw] md:min-w-0"
                            >
                                <div className="aspect-[16/10] w-full overflow-hidden">
                                    <img
                                        src={
                                            item.image_path
                                                ? `/storage/${item.image_path}`
                                                : 'https://placehold.co/600x400/0f172a/38bdf8?text=Project+Preview'
                                        }
                                        alt={item.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                        <span className="translate-y-4 transform rounded-full bg-cyan-500 px-6 py-2 font-bold text-gray-900 transition-transform duration-300 group-hover:translate-y-0">
                                            View Details
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col p-6">
                                    <div className="mb-4 flex flex-wrap gap-2">
                                        <span className="inline-block rounded border border-cyan-500/20 bg-cyan-950/30 px-2 py-1 text-xs font-medium text-cyan-300">
                                            {item.category}
                                        </span>
                                        {item.tools &&
                                            item.tools.length > 0 && (
                                                <span className="inline-block rounded border border-border bg-secondary/50 px-2 py-1 text-xs font-medium text-muted-foreground">
                                                    {item.tools[0]}
                                                </span>
                                            )}
                                    </div>
                                    <h3 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-cyan-400">
                                        {item.title}
                                    </h3>
                                    <p className="line-clamp-2 text-sm text-muted-foreground">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full rounded-xl border border-dashed border-border py-16 text-center">
                            <Terminal className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="text-xl font-bold text-foreground">
                                No projects found
                            </h3>
                            <p className="text-muted-foreground">
                                I'm currently working on something awesome.
                            </p>
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
            <Dialog
                open={!!selectedPortfolio}
                onOpenChange={(open) => !open && setSelectedPortfolio(null)}
            >
                <DialogContent className="flex max-h-[90vh] w-[95vw] flex-col overflow-hidden border-border bg-background/90 p-0 text-foreground backdrop-blur-xl sm:max-w-7xl md:h-[85vh] md:w-full md:flex-row">
                    {selectedPortfolio && (
                        <>
                            {/* Image Section (65-70% width) */}
                            <div className="group relative flex min-h-[300px] w-full flex-col justify-center overflow-hidden bg-black md:h-full md:w-[65%] lg:w-[70%]">
                                <ImageCarousel portfolio={selectedPortfolio} />
                            </div>

                            {/* Content Section (30-35% width) */}
                            <div className="flex h-full w-full flex-col border-l border-border bg-card md:w-[35%] lg:w-[30%]">
                                {/* Header */}
                                <div className="sticky top-0 z-20 border-b border-border bg-card/50 p-6 backdrop-blur-sm md:p-8">
                                    <div className="mb-4 flex flex-wrap gap-2">
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/30 px-3 py-1 text-xs font-semibold text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                                            {selectedPortfolio.category}
                                        </span>
                                        {selectedPortfolio.created_at && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                                                {new Date(
                                                    selectedPortfolio.created_at,
                                                ).toLocaleDateString('id-ID', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                })}
                                            </span>
                                        )}
                                    </div>
                                    <DialogTitle className="text-2xl leading-tight font-bold tracking-tight text-foreground md:text-3xl">
                                        {selectedPortfolio.title}
                                    </DialogTitle>
                                </div>

                                {/* Scrollable Content */}
                                <div className="flex-1 space-y-8 overflow-y-auto p-6 md:p-8">
                                    <div className="prose prose-invert prose-sm max-w-none">
                                        <DialogDescription className="text-sm leading-relaxed font-light whitespace-pre-line text-muted-foreground md:text-base">
                                            {selectedPortfolio.description}
                                        </DialogDescription>
                                    </div>

                                    {/* Tech Stack */}
                                    {selectedPortfolio.tools &&
                                        selectedPortfolio.tools.length > 0 && (
                                            <div>
                                                <h4 className="mb-4 flex items-center gap-2 text-xs font-bold tracking-widest text-cyan-400 uppercase">
                                                    <Terminal className="h-4 w-4" />
                                                    Technologies
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedPortfolio.tools.map(
                                                        (tool, index) => (
                                                            <span
                                                                key={index}
                                                                className="group flex items-center gap-1.5 rounded-md border border-border bg-secondary/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-cyan-500/50 hover:bg-cyan-950/20 hover:text-cyan-300"
                                                            >
                                                                <Code className="h-3 w-3 text-muted-foreground transition-colors group-hover:text-cyan-400" />
                                                                {tool}
                                                            </span>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                </div>

                                {/* Footer / Actions */}
                                <div className="sticky bottom-0 z-20 border-t border-border bg-card p-6 md:p-8">
                                    <div className="flex flex-col gap-3">
                                        {selectedPortfolio.project_url && (
                                            <a
                                                href={
                                                    selectedPortfolio.project_url
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary/90"
                                            >
                                                <Globe className="h-4 w-4" />
                                                Visit Live Project
                                            </a>
                                        )}
                                        {selectedPortfolio.github_url ? (
                                            <a
                                                href={
                                                    selectedPortfolio.github_url
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm font-semibold text-foreground transition-all hover:border-gray-500 hover:bg-secondary hover:text-cyan-300"
                                            >
                                                <Github className="h-4 w-4" />
                                                View Source Code
                                            </a>
                                        ) : (
                                            <a
                                                href="#contact"
                                                onClick={() =>
                                                    setSelectedPortfolio(null)
                                                }
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
};

// About Section
const AboutSection = ({ owner }: { owner?: UserProfile }) => (
    <AnimatedSection className="bg-card">
        <div
            id="about"
            className="container mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-20"
        >
            <div className="relative order-2 lg:order-1">
                <div className="pointer-events-none absolute -top-4 -left-4 text-9xl font-bold text-gray-800/20 select-none">
                    01
                </div>
                <h2 className="font-mono text-3xl font-bold text-cyan-400 sm:text-4xl">
                    // About_Me
                </h2>
                <h3 className="mt-4 text-2xl font-bold text-foreground">
                    Coding with passion, Designing with purpose.
                </h3>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                    {owner?.bio ||
                        'I am a multi-talented professional navigating the intersection of technology and creativity. From architecting complex backend systems with modern frameworks to crafting pixel-perfect interfaces, I view every project as an opportunity to solve problems elegantly.'}
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="rounded border border-border bg-background p-4">
                        <span className="block text-3xl font-bold text-foreground">
                            {owner?.years_experience || 0}+
                        </span>
                        <span className="text-sm text-muted-foreground">
                            Years Experience
                        </span>
                    </div>
                    <div className="rounded border border-border bg-background p-4">
                        <span className="block text-3xl font-bold text-foreground">
                            {owner?.projects_completed || 0}+
                        </span>
                        <span className="text-sm text-muted-foreground">
                            Projects Completed
                        </span>
                    </div>
                </div>
            </div>
            <div className="order-1 grid grid-cols-3 gap-4 sm:grid-cols-4 lg:order-2">
                {(owner?.tech_stack && owner.tech_stack.length > 0 ? owner.tech_stack : [
                    'php', 'html', 'css', 'android', 'laravel', 'flutter', 'docker', 'ubuntu', 'linux', 'git', 'db', 'code'
                ]).map((techId, index) => {
                     // Import AVAILABLE_ICONS first
                     const iconItem = AVAILABLE_ICONS.find(i => i.id === techId);
                     if (!iconItem) return null;
                     
                     return (
                        <div
                            key={index}
                            className="group flex aspect-square items-center justify-center rounded-2xl border border-border bg-secondary p-4 transition-all duration-300 hover:border-cyan-500/50 hover:bg-secondary/80"
                        >
                            <iconItem.icon
                                className={`h-12 w-12 transition-transform duration-300 group-hover:scale-110 text-cyan-400`}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    </AnimatedSection>
);

// Skills Section
const SkillsSection = ({ owner }: { owner?: UserProfile }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    // Helper to group skills by category
    const getSkillsByCategory = (category: string) => {
        return owner?.skills?.filter((s) => s.category === category) || [];
    };

    // Dynamic categories from owner skills
    const uniqueCategories = Array.from(new Set(owner?.skills?.map(s => s.category) || []));
    
    const categoryColors = [
        'from-purple-500 to-pink-500', // Index 0
        'from-cyan-500 to-blue-500',   // Index 1
        'from-emerald-500 to-teal-500', // Index 2
        'from-orange-500 to-red-500',   // Index 3
        'from-blue-600 to-indigo-600',  // Index 4
        'from-yellow-400 to-orange-500', // Index 5
    ];

    const categories = uniqueCategories.map((category, index) => ({
        name: category,
        color: categoryColors[index % categoryColors.length]
    }));

    // Fallback if no skills
    if (categories.length === 0) {
        categories.push(
             { name: 'Backend', color: 'from-purple-500 to-pink-500' },
             { name: 'Frontend', color: 'from-cyan-500 to-blue-500' },
             { name: 'DevOps', color: 'from-emerald-500 to-teal-500' },
        );
    }

    const softSkills = owner?.soft_skills?.length ? owner.soft_skills : [
        { name: 'Problem Solving', icon: '🧩' },
        { name: 'Team Leadership', icon: '👥' },
        { name: 'Communication', icon: '💬' },
        { name: 'Time Management', icon: '⏰' },
        { name: 'Adaptability', icon: '🔄' },
        { name: 'Critical Thinking', icon: '🤔' },
        { name: 'Attention to Detail', icon: '🔍' },
        { name: 'Continuous Learning', icon: '📚' },
    ];

    // Use dynamic skills for tech stack cloud, or fallback if empty
    const techStack = owner?.skills?.map(s => s.name) || [
        'Laravel', 'React', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'
    ];

    return (
        <AnimatedSection className="bg-muted/30">
            <div id="skills" className="container mx-auto" ref={ref}>
                <div className="mb-12 flex flex-col items-center text-center">
                    <span className="mb-2 font-mono text-cyan-400">
                        ./skills
                    </span>
                    <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                        Tech Stack & Skills
                    </h2>
                    <p className="mt-4 max-w-2xl text-muted-foreground">
                        Technologies I use daily to build modern, scalable
                        applications.
                    </p>
                </div>

                {/* Skills Progress Bars */}
                <div className="mb-16 grid gap-8 md:grid-cols-3">
                    {categories.map((category, categoryIndex) => (
                        <motion.div
                            key={category.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{
                                duration: 0.6,
                                delay: 0.1 + categoryIndex * 0.1,
                            }}
                        >
                            <div className="h-full rounded-xl border border-border bg-card/50 p-6 shadow-sm hover:border-cyan-500/30 transition-colors">
                                <h3
                                    className={`mb-6 bg-gradient-to-r text-xl font-bold ${category.color} bg-clip-text text-transparent`}
                                >
                                    {category.name}
                                </h3>
                                <div className="space-y-5">
                                    {getSkillsByCategory(category.name).length > 0 ? (
                                        getSkillsByCategory(category.name).map(
                                            (skill, skillIndex) => (
                                                <div key={skillIndex}>
                                                    <div className="mb-2 flex justify-between">
                                                        <span className="text-sm font-medium text-foreground">
                                                            {skill.name}
                                                        </span>
                                                        <span className="text-sm text-muted-foreground">
                                                            {skill.level}%
                                                        </span>
                                                    </div>
                                                    <div className="h-2 overflow-hidden rounded-full bg-secondary">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={
                                                                isInView
                                                                    ? {
                                                                          width: `${skill.level}%`,
                                                                      }
                                                                    : {}
                                                            }
                                                            transition={{
                                                                duration: 1,
                                                                delay:
                                                                    0.3 +
                                                                    skillIndex *
                                                                        0.1,
                                                            }}
                                                            className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                                                        />
                                                    </div>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">No skills listed for this category.</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Tech Stack Cloud */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mb-16"
                >
                    <h3 className="mb-6 text-center font-mono text-lg font-semibold text-foreground">
                        // tech_cloud
                    </h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        {techStack.map((tech, index) => (
                            <motion.span
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={
                                    isInView ? { opacity: 1, scale: 1 } : {}
                                }
                                transition={{
                                    duration: 0.4,
                                    delay: 0.5 + index * 0.03,
                                }}
                                className="cursor-default rounded-lg border border-border bg-card/50 px-4 py-2 text-sm text-foreground transition-colors hover:border-cyan-500/50 hover:text-cyan-400 backdrop-blur-sm"
                            >
                                {tech}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>

                {/* Soft Skills */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <h3 className="mb-6 text-center font-mono text-lg font-semibold text-foreground">
                        // soft_skills
                    </h3>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {softSkills.map((skill, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{
                                    duration: 0.4,
                                    delay: 0.7 + index * 0.05,
                                }}
                                className="flex items-center gap-3 rounded-xl border border-border bg-card/50 p-4 transition-colors hover:border-purple-500/30 backdrop-blur-sm"
                            >
                                <span className="text-2xl">{skill.icon || '✨'}</span>
                                <span className="text-sm font-medium text-foreground">
                                    {skill.name}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </AnimatedSection>
    );
};

// Helper to get social icon
const getSocialIcon = (platform: string) => {
    const lower = platform.toLowerCase();
    if (lower.includes('github')) return Github;
    if (lower.includes('linkedin')) return Linkedin;
    if (lower.includes('instagram')) return Instagram;
    if (lower.includes('twitter') || lower.includes('x')) return Twitter;
    if (lower.includes('facebook')) return Facebook;
    if (lower.includes('youtube')) return Youtube;
    return Globe; // Fallback
};

// Contact Section
const ContactSection = ({ owner }: { owner?: UserProfile }) => {
    const contactInfo = [
        {
            icon: Mail,
            label: 'Email',
            value: owner?.email || 'hello@luthfinaldi.dev',
            href: `mailto:${owner?.email || 'hello@luthfinaldi.dev'}`,
        },
        {
            icon: Phone,
            label: 'Phone',
            value: owner?.phone || '+62 xxx-xxxx-xxxx',
            href: owner?.phone ? `tel:${owner.phone}` : undefined,
        },
        {
            icon: MapPin,
            label: 'Location',
            value: owner?.address || 'Batam, Indonesia',
            href: undefined,
        },
    ];

    // Use dynamic social links if available, else fallback (though DB should have them now)
    // Use dynamic social links if available, else fallback
    const socialLinks = owner?.social_links?.map(link => {
        return {
            icon: getSocialIcon(link.platform),
            label: link.platform,
            href: link.url,
            color: link.color || 'hover:text-cyan-400',
        };
    }) || [];

    return (
        <AnimatedSection className="bg-card">
            <div id="contact" className="container mx-auto max-w-5xl">
                <div className="mb-12 flex flex-col items-center text-center">
                    <span className="mb-2 font-mono text-cyan-400">
                        ./contact
                    </span>
                    <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                        Get in Touch
                    </h2>
                    <p className="mt-4 max-w-2xl text-muted-foreground">
                        Have a project in mind or want to collaborate? Feel free
                        to reach out.
                    </p>
                </div>

                <div className="mb-12 grid gap-6 md:grid-cols-3">
                    {contactInfo.map((info, index) => (
                        <motion.div
                            key={info.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex flex-col items-center justify-center rounded-xl border border-border bg-background p-6 text-center transition-colors hover:border-cyan-500/30"
                        >
                            <div className="mb-4 rounded-full bg-secondary p-3 text-cyan-400">
                                <info.icon className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 font-semibold text-foreground">
                                {info.label}
                            </h3>
                            {info.href ? (
                                <a
                                    href={info.href}
                                    className="text-sm text-muted-foreground transition-colors hover:text-cyan-400"
                                >
                                    {info.value}
                                </a>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    {info.value}
                                </p>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Social Links */}
                {socialLinks.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mb-12 flex justify-center gap-4"
                    >
                        {socialLinks.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-all ${social.color}`}
                                aria-label={social.label}
                            >
                                <social.icon className="h-6 w-6" />
                            </a>
                        ))}
                    </motion.div>
                )}

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/30 to-blue-950/30 p-8 text-center">
                        <h3 className="mb-3 text-2xl font-bold text-foreground">
                            Let's Build Something Amazing
                        </h3>
                        <p className="mx-auto mb-6 max-w-lg text-muted-foreground">
                            I'm always excited about new projects and
                            collaborations. Drop me a message!
                        </p>
                        <a
                            href={`mailto:${owner?.email || 'hello@luthfinaldi.dev'}`}
                            className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-8 py-3 text-lg font-semibold text-white transition-all hover:bg-cyan-500 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                        >
                            <Send className="h-5 w-5" />
                            Send Email
                        </a>
                    </div>
                </motion.div>
            </div>
        </AnimatedSection>
    );
};

// Scroll Progress
const ScrollProgress = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight =
                document.documentElement.scrollHeight - window.innerHeight;
            setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed top-0 right-0 left-0 z-[60] h-1">
            <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
            />
        </div>
    );
};

// Enhanced Footer Component
const Footer = ({ owner }: { owner?: UserProfile }) => {
    const footerLinks = [
        {
            title: 'Navigation',
            links: [
                { label: 'Home', href: '#hero' },
                { label: 'Portfolio', href: '#portfolio' },
                { label: 'Skills', href: '#skills' },
                { label: 'Contact', href: '#contact' },
            ],
        },
        {
            title: 'Services',
            links: [
                { label: 'Full Stack Dev', href: '#services' },
                { label: 'Mobile Apps', href: '#services' },
                { label: 'UI/UX Design', href: '#services' },
                { label: 'SysAdmin', href: '#services' },
            ],
        },
    ];

    return (
        <footer className="border-t border-border bg-background px-4 py-16 font-mono">
            <div className="container mx-auto">
                <div className="mb-12 grid gap-12 md:grid-cols-4">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <a
                            href="#hero"
                            className="group mb-4 flex items-center gap-2"
                        >
                            <div className="rounded-lg bg-gradient-to-br from-cyan-600 to-blue-600 p-2 transition-shadow group-hover:shadow-lg group-hover:shadow-cyan-500/25">
                                <Terminal className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-cyan-400">
                                {owner?.name || 'Luthfi Naldi'}
                            </span>
                        </a>
                        <p className="mb-6 max-w-md text-sm leading-relaxed text-muted-foreground">
                            Full Stack Developer passionate about building
                            modern web applications with Laravel, React, and
                            cutting-edge technologies.
                        </p>
                            <div className="flex gap-3">
                                {owner?.social_links?.map((link, index) => {
                                    const Icon = getSocialIcon(link.platform);
                                    return (
                                        <a
                                            key={index}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-cyan-500/30 hover:text-cyan-400"
                                            aria-label={link.platform}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </a>
                                    );
                                })}
                            </div>
                    </div>

                    {/* Links */}
                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h4 className="mb-4 text-sm font-semibold tracking-wider text-foreground uppercase">
                                {section.title}
                            </h4>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-muted-foreground transition-colors hover:text-cyan-400"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()}{' '}
                        {owner?.name || 'Muhammad Luthfi Naldi'}. All rights
                        reserved.
                    </p>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        Built with{' '}
                        <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />{' '}
                        using React & Laravel
                    </p>
                </div>
            </div>
        </footer>
    );
};

// Main Welcome Component
export default function Welcome({
    portfolios,
    owner,
}: {
    portfolios: Portfolio[];
    owner?: UserProfile;
}) {
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <Head>
                <title>{`${owner?.name || 'Luthfi Naldi'} - ${owner?.job_title || 'Full Stack Developer'}`}</title>
                <meta
                    name="description"
                    content={`Portfolio website of ${owner?.name || 'Luthfi Naldi'} - ${owner?.job_title || 'Full Stack Developer'}. View my projects and get in touch.`}
                />
                
                {/* Open Graph */}
                <meta property="og:title" content={`${owner?.name || 'Luthfi Naldi'} - ${owner?.job_title || 'Full Stack Developer'}`} />
                <meta property="og:description" content={owner?.bio || `Portfolio website of ${owner?.name || 'Luthfi Naldi'}. View my projects and get in touch.`} />
                <meta property="og:image" content={owner?.avatar ? `/storage/${owner.avatar}` : '/default-og.jpg'} />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:type" content="website" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${owner?.name || 'Luthfi Naldi'} - ${owner?.job_title || 'Full Stack Developer'}`} />
                <meta name="twitter:description" content={owner?.bio || `Portfolio website of ${owner?.name || 'Luthfi Naldi'}. View my projects and get in touch.`} />
                <meta name="twitter:image" content={owner?.avatar ? `/storage/${owner.avatar}` : '/default-og.jpg'} />

                <style>{`
                    html { scroll-behavior: smooth; }
                    ::selection { background-color: rgba(34, 211, 238, 0.3); color: #fff; }
                `}</style>
            </Head>

            <div className="min-h-screen bg-background font-sans text-foreground selection:bg-cyan-500/30">
                {/* Scroll Progress Bar */}
                <ScrollProgress />

                {/* Parallax Background Orbs */}
                <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                    <div
                        className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500 opacity-[0.03] blur-[120px]"
                        style={{ transform: `translateY(${scrollY * 0.15}px)` }}
                    />
                    <div
                        className="absolute top-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-500 opacity-[0.03] blur-[120px]"
                        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
                    />
                    <div
                        className="absolute bottom-1/4 left-1/3 h-[350px] w-[350px] rounded-full bg-emerald-500 opacity-[0.03] blur-[120px]"
                        style={{ transform: `translateY(${scrollY * 0.08}px)` }}
                    />
                </div>

                <FrontNavbar />
                <main className="relative z-10">
                    <HeroSection owner={owner} />
                    <PortfolioSection portfolios={portfolios} />
                    <ServicesSection />
                    <SkillsSection owner={owner} />
                    <AboutSection owner={owner} />
                    <ContactSection owner={owner} />
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
                            className="fixed right-6 bottom-6 z-40 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 p-3 text-white shadow-lg shadow-cyan-500/25 backdrop-blur-sm transition-all hover:scale-110 hover:shadow-cyan-500/40"
                            aria-label="Scroll to top"
                        >
                            <ArrowUp className="h-5 w-5" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
