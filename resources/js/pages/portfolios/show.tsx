import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Calendar, Grid, Terminal, ChevronLeft, ChevronRight, X, ArrowUp, Layers } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';

type PortfolioImage = {
    id: number;
    image_path: string;
    order: number;
};

type Portfolio = {
    id: number;
    title: string;
    category: string;
    description: string;
    project_url: string | null;
    image_path: string | null;
    development_time: string | null;
    tools: string[] | null;
    github_url: string | null;
    video_url: string | null;
    images: PortfolioImage[];
};

export default function PortfolioShow({ portfolio, related_portfolios }: { portfolio: Portfolio, related_portfolios: Portfolio[] }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Show scroll-to-top button when scrolled down
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Get all images (including main image_path if exists)
    const allImages = [
        ...(portfolio.image_path ? [{ id: 0, image_path: portfolio.image_path, order: -1 }] : []),
        ...(portfolio.images || []),
    ];

    // Auto-rotate carousel
    useEffect(() => {
        if (allImages.length <= 1 || isPaused || lightboxOpen) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % allImages.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [allImages.length, isPaused, lightboxOpen]);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % allImages.length);
    }, [allImages.length]);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + allImages.length) % allImages.length);
    }, [allImages.length]);

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const nextLightbox = () => {
        setLightboxIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevLightbox = () => {
        setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    // Keyboard navigation for lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!lightboxOpen) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextLightbox();
            if (e.key === 'ArrowLeft') prevLightbox();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen]);

    // Helper to extract YouTube ID
    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const youtubeId = portfolio.video_url ? getYoutubeId(portfolio.video_url) : null;

    return (
        <div className="min-h-screen bg-gray-950 font-mono text-gray-200 selection:bg-cyan-500/30">
            <Head title={`${portfolio.title} - Portfolio`} />

            <div className="container mx-auto max-w-7xl px-4 py-12 md:py-20">
                {/* Back Button */}
                <Link
                    href="/"
                    className="group mb-8 inline-flex items-center gap-2 text-cyan-400 transition-colors hover:text-cyan-300"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    <span className="text-lg">cd ..</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm"
                >
                    {/* Header Image Carousel */}
                    <div
                        className="relative aspect-video w-full overflow-hidden border-b border-gray-800 bg-gray-900"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {allImages.length > 0 ? (
                            <>
                                <img
                                    src={`/storage/${allImages[currentSlide]?.image_path}`}
                                    alt={portfolio.title}
                                    className="h-full w-full object-cover cursor-pointer transition-transform duration-500"
                                    onClick={() => openLightbox(currentSlide)}
                                />

                                {/* Navigation Arrows */}
                                {allImages.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevSlide}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70"
                                        >
                                            <ChevronLeft className="h-6 w-6" />
                                        </button>
                                        <button
                                            onClick={nextSlide}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70"
                                        >
                                            <ChevronRight className="h-6 w-6" />
                                        </button>
                                    </>
                                )}

                                {/* Slide Counter */}
                                {allImages.length > 1 && (
                                    <div className="absolute top-4 right-4 rounded bg-black/50 px-3 py-1 text-sm text-white">
                                        {currentSlide + 1} / {allImages.length}
                                    </div>
                                )}

                                {/* Dots Navigation */}
                                {allImages.length > 1 && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                        {allImages.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentSlide(index)}
                                                className={`h-2 rounded-full transition-all ${index === currentSlide
                                                    ? 'bg-cyan-500 w-6'
                                                    : 'bg-white/50 w-2 hover:bg-white/70'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <img
                                src="https://placehold.co/1200x600/0f172a/38bdf8?text=Project+Preview"
                                alt={portfolio.title}
                                className="h-full w-full object-cover"
                            />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-0 left-0 p-6 md:p-10">
                            <span className="mb-2 inline-block rounded border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-400 backdrop-blur-md">
                                {portfolio.category}
                            </span>
                            <h1 className="mt-2 text-3xl font-bold text-white md:text-5xl lg:text-6xl text-shadow-lg">
                                {portfolio.title}
                            </h1>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 p-6 md:p-10">
                        {/* Main Content (80%) represented by 9/12 columns */}
                        <div className="md:col-span-9 space-y-12">
                            {/* Project Description */}
                            <div>
                                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
                                    <Terminal className="h-5 w-5 text-cyan-400" />
                                    Project Description
                                </h2>
                                <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                                    {portfolio.description}
                                </div>
                            </div>

                            {/* Image Grid */}
                            {allImages.length > 1 && (
                                <div>
                                    <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
                                        <Grid className="h-5 w-5 text-cyan-400" />
                                        Gallery ({allImages.length} images)
                                    </h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {allImages.map((image, index) => (
                                            <div
                                                key={image.id}
                                                className={`group relative aspect-square overflow-hidden rounded-lg bg-gray-800 cursor-pointer border-2 transition-all ${index === currentSlide
                                                    ? 'border-cyan-500'
                                                    : 'border-transparent hover:border-gray-600'
                                                    }`}
                                                onClick={() => openLightbox(index)}
                                            >
                                                <img
                                                    src={`/storage/${image.image_path}`}
                                                    alt={`Gallery ${index + 1}`}
                                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Video Section */}
                            {youtubeId && (
                                <div>
                                    <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
                                        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                        Demo Preview
                                    </h2>
                                    <div className="aspect-video w-full overflow-hidden rounded-lg border border-gray-800 bg-black">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${youtubeId}`}
                                            title="YouTube video player"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="h-full w-full"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar Details (20%) represented by 3/12 columns */}
                        <div className="md:col-span-3 space-y-8 md:border-l md:border-gray-800 md:pl-8">
                            {/* Actions */}
                            <div className="flex flex-col gap-4">
                                {portfolio.project_url && (
                                    <a
                                        href={portfolio.project_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 rounded-md bg-cyan-600 px-6 py-3 font-bold text-white shadow-lg shadow-cyan-500/20 transition-all hover:bg-cyan-500 hover:scale-105 active:scale-95"
                                    >
                                        <ExternalLink className="h-5 w-5" />
                                        Visit Website
                                    </a>
                                )}
                                {portfolio.github_url && (
                                    <a
                                        href={portfolio.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 rounded-md border border-gray-700 bg-gray-800 px-6 py-3 font-bold text-white transition-all hover:bg-gray-700 hover:border-gray-600 active:scale-95"
                                    >
                                        <Github className="h-5 w-5" />
                                        View Source
                                    </a>
                                )}
                            </div>

                            {/* Info Grid */}
                            <div className="space-y-6 rounded-lg bg-gray-900/50 p-6 border border-gray-800">
                                <div>
                                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                                        <Calendar className="h-4 w-4" />
                                        Timeline
                                    </h3>
                                    <p className="font-medium text-white text-lg">
                                        {portfolio.development_time || 'Not specified'}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                                        <Grid className="h-4 w-4" />
                                        Tech Stack
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {portfolio.tools && portfolio.tools.length > 0 ? (
                                            portfolio.tools.map((tool, index) => (
                                                <span
                                                    key={index}
                                                    className="rounded border border-cyan-500/20 bg-cyan-900/20 px-2 py-1 text-sm text-cyan-300"
                                                >
                                                    {tool}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-500 italic">No tools listed</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Related Portfolios */}
                            <div>
                                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                                    <Layers className="h-4 w-4" />
                                    Other Portfolios
                                </h3>
                                <div className="space-y-4">
                                    {related_portfolios.length > 0 ? (
                                        related_portfolios.map((related) => (
                                            <Link
                                                key={related.id}
                                                href={`/portfolios/${related.id}`} // Using direct URL for simplicity, ideally use route helper
                                                className="block group rounded-lg border border-gray-800 bg-gray-900/50 p-3 transition-colors hover:border-cyan-500/50 hover:bg-gray-800"
                                            >
                                                <div className="flex gap-3">
                                                    <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded bg-gray-800">
                                                        {related.image_path ? (
                                                            <img
                                                                src={`/storage/${related.image_path}`}
                                                                alt={related.title}
                                                                className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                                            />
                                                        ) : (
                                                            <div className="h-full w-full bg-gray-800 flex items-center justify-center text-xs text-gray-500">No Image</div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-white line-clamp-2 group-hover:text-cyan-400 transition-colors">
                                                            {related.title}
                                                        </h4>
                                                        <span className="text-xs text-cyan-500/80">
                                                            {related.category}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">No other portfolios found.</p>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </motion.div>

                {/* Bottom Navigation */}
                <div className="mt-8 flex items-center justify-between">
                    <Link
                        href="/"
                        className="group inline-flex items-center gap-2 rounded-md border border-gray-700 bg-gray-800/50 px-4 py-2 text-cyan-400 transition-all hover:bg-gray-800 hover:border-gray-600"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        <span>Back to Home</span>
                    </Link>
                    <button
                        onClick={scrollToTop}
                        className="inline-flex items-center gap-2 rounded-md border border-gray-700 bg-gray-800/50 px-4 py-2 text-gray-300 transition-all hover:bg-gray-800 hover:border-gray-600"
                    >
                        <ArrowUp className="h-4 w-4" />
                        <span>Up Top</span>
                    </button>
                </div>
            </div>

            {/* Lightbox Modal */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
                    onClick={closeLightbox}
                >
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                    >
                        <X className="h-6 w-6" />
                    </button>

                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevLightbox(); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                            >
                                <ChevronLeft className="h-8 w-8" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextLightbox(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                            >
                                <ChevronRight className="h-8 w-8" />
                            </button>
                        </>
                    )}

                    <div className="max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={`/storage/${allImages[lightboxIndex]?.image_path}`}
                            alt={`Image ${lightboxIndex + 1}`}
                            className="max-h-[90vh] max-w-[90vw] object-contain"
                        />
                    </div>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded bg-black/50 px-4 py-2 text-white">
                        {lightboxIndex + 1} / {allImages.length}
                    </div>

                </div>
            )}

            {/* Floating Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 z-40 rounded-full bg-cyan-600/80 p-3 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-cyan-500 hover:scale-110"
                    aria-label="Scroll to top"
                >
                    <ArrowUp className="h-5 w-5" />
                </button>
            )}
        </div>
    );
}
