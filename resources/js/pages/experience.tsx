import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Terminal } from 'lucide-react';
import React from 'react';
import FrontNavbar from '@/components/front-navbar';
import type { Experience } from '@/types';

// Animated Section
const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <motion.div
        className={`w-full ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
    >
        {children}
    </motion.div>
)

// ...

export default function ExperiencePage({ experiences }: { experiences: Experience[] }) {
    return (
        <div className="min-h-screen bg-background font-mono text-foreground selection:bg-cyan-500/30">
            <Head title="Experience" />
            <FrontNavbar />

            <div className="container mx-auto px-4 py-20 mt-10">

                <AnimatedSection>
                    <div className="flex flex-col items-center text-center mb-16">
                        <span className="text-cyan-400 font-mono mb-2">./history</span>
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Professional Experience</h1>
                        <p className="text-muted-foreground max-w-2xl">
                            A timeline of my professional journey, highlighting roles, responsibilities, and achievements throughout my career.
                        </p>
                    </div>

                    <div className="relative max-w-4xl mx-auto">
                        {/* Vertical Line */}
                        <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-0.5 bg-border transform md:-translate-x-1/2"></div>

                        <div className="space-y-12">
                            {experiences.length > 0 ? (
                                experiences.map((exp, index) => (
                                    <div key={exp.id} className={`relative flex items-center md:justify-between ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                        {/* Dot */}
                                        <div className="absolute left-[20px] md:left-1/2 w-4 h-4 bg-background border-2 border-cyan-500 rounded-full transform -translate-x-1/2 z-10"></div>

                                        {/* Content */}
                                        <motion.div
                                            initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            className={`ml-12 md:ml-0 md:w-[45%] ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}
                                        >
                                            <div className="bg-card border border-border p-6 rounded-xl hover:border-cyan-500/30 transition-colors group shadow-sm">
                                                <span className="inline-block px-3 py-1 mb-2 text-xs font-mono text-cyan-500 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                                                    {exp.period}
                                                </span>
                                                <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-cyan-500 transition-colors">{exp.role}</h3>
                                                <h4 className="text-muted-foreground mb-4 font-semibold">{exp.company}</h4>
                                                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                                                    {exp.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20">
                                    <Terminal className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">No experience records found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </div>
    );
}
