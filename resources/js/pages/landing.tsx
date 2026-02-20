import { Head, Link, usePage } from '@inertiajs/react';
import { Portfolio } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { 
    Check, 
    ChevronRight, 
    Code, 
    Globe, 
    Layout, 
    Zap, 
    BarChart, 
    Shield, 
    Terminal 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SharedData } from '@/types';
import { login, register } from '@/routes';

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="group rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card hover:shadow-lg"
    >
        <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-primary/10 p-3 text-primary group-hover:bg-primary/20">
            <Icon className="h-6 w-6" />
        </div>
        <h3 className="mb-2 text-xl font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
    </motion.div>
);

export default function Landing({ portfolios = [] }: { portfolios: Portfolio[] }) {
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
            <Head title="Portfolify - Build Your Professional Portfolio" />

            {/* Navbar */}
            <nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
                <div className="container mx-auto flex h-16 items-center justify-between px-6">
                    <div className="flex items-center gap-2 font-mono text-xl font-bold tracking-tighter">
                        <Terminal className="h-6 w-6 text-primary" />
                        <span>Portfolify<span className="text-primary">.app</span></span>
                    </div>
                    <div className="flex items-center gap-4">
                        {auth.user ? (
                            <Link href="/dashboard">
                                <Button variant="default">Dashboard</Button>
                            </Link>
                        ) : (
                            <>
                                <Link href={login.url()}>
                                    <Button variant="ghost">Log in</Button>
                                </Link>
                                <Link href={register.url()}>
                                    <Button>Get Started</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative flex min-h-[85vh] items-center justify-center pt-20 pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>

                <div className="container relative z-10 px-1 ps-15">
                    <div className="grid items-center gap-12 lg:grid-cols-12">
                        {/* Text Content (6 columns) */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-left lg:col-span-6 xl:col-span-7"
                        >
                            <span className="mb-6 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                                🚀 Portfolio Online for Developers
                            </span>
                            <h1 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
                                Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Professional</span> Portfolio in Minutes.
                            </h1>
                            <p className="mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                                Showcase your projects, skills, and experience with a stunning, fast, and SEO-optimized portfolio. Get your own unique URL instantly.
                            </p>
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <Link href={register.url()}>
                                    <Button size="lg" className="h-12 px-8 text-lg">
                                        Start Building Free <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href="#features">
                                    <Button variant="outline" size="lg" className="h-12 px-8 text-lg">
                                        Learn More
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>

                        {/* Image/Icon Content (4 columns, offset by layout) */}
                        <motion.div 
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="lg:col-span-6 xl:col-span-5 flex items-center justify-center"
                        >
                            <img 
                                src="/images/hero-icon.png" 
                                alt="Portfolify Icon" 
                                className="w-full max-w-lg object-contain drop-shadow-2xl sm:max-w-xl"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-muted/30">
                <div className="container mx-auto px-6">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Everything You Need</h2>
                        <p className="mx-auto max-w-2xl text-muted-foreground">
                            Powerful features designed for developers, by developers. Focusing on speed, design, and ease of use.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <FeatureCard 
                            icon={Globe} 
                            title="Custom Subdomain" 
                            description="Get your own unique URL (e.g., portfolify.app/yourname) instantly upon registration." 
                        />
                         <FeatureCard 
                            icon={Layout} 
                            title="Modern Templates" 
                            description="Choose from professionally designed, responsive templates that look great on any device." 
                        />
                         <FeatureCard 
                            icon={Code} 
                            title="Developer Friendly" 
                            description="Built with React & Tailwind. Show off your tech stack with dedicated skill sections." 
                        />
                         <FeatureCard 
                            icon={BarChart} 
                            title="Analytics" 
                            description="Track views and engagement on your portfolio with built-in simple analytics." 
                        />
                         <FeatureCard 
                            icon={Zap} 
                            title="Blazing Fast" 
                            description="Powered by Inertia.js and Laravel, ensuring your portfolio loads instantly." 
                        />
                         <FeatureCard 
                            icon={Shield} 
                            title="Secure & Hosted" 
                            description="We handle the hosting, security, and updates so you can focus on building." 
                        />
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24">
                <div className="container mx-auto px-6">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Simple, Transparent Pricing</h2>
                        <p className="text-muted-foreground">Start for free, upgrade when you need more power.</p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:max-w-4xl lg:mx-auto">
                        {/* Free Plan */}
                        <Card className="relative overflow-hidden border-border bg-card transition-all hover:border-primary/50">
                            <CardHeader>
                                <CardTitle className="text-2xl">Free</CardTitle>
                                <CardDescription>Perfect for getting started</CardDescription>
                                <div className="mt-4 text-4xl font-bold">Rp 0<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="space-y-3 text-sm">
                                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Public Portfolio URL</li>
                                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Up to 5 Projects</li>
                                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Basic Analytics</li>
                                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Standard Theme</li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Link href={register.url()} className="w-full">
                                    <Button variant="outline" className="w-full">Get Started</Button>
                                </Link>
                            </CardFooter>
                        </Card>

                        {/* Pro Plan */}
                        <Card className="relative overflow-hidden border-primary bg-primary/5 shadow-2xl">
                            <div className="absolute top-0 right-0 bg-primary px-3 py-1 text-xs font-bold text-primary-foreground rounded-bl-lg">
                                POPULAR
                            </div>
                            <CardHeader>
                                <CardTitle className="text-2xl text-primary">Pro</CardTitle>
                                <CardDescription>For serious professionals</CardDescription>
                                <div className="mt-4 text-4xl font-bold">Rp 49.000<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="space-y-3 text-sm">
                                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> <b>Unlimited</b> Projects</li>
                                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> <b>Custom Domain</b> Support</li>
                                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Advanced Analytics</li>
                                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Premium Themes</li>
                                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Remove Branding</li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Link href={register.url()} className="w-full">
                                    <Button className="w-full">Upgrade to Pro</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-primary/5">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="mb-6 text-3xl font-bold sm:text-4xl">Ready to Showcase Your Work?</h2>
                    <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
                        Join hundreds of developers building their personal brand with Portfolify.
                    </p>
                    <Link href={register.url()}>
                        <Button size="lg" className="h-14 px-10 text-xl font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105">
                            Create My Portfolio Now
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Featured Portfolios Section */}
            {portfolios.length > 0 && (
                <section className="py-24 bg-background">
                    <div className="container mx-auto px-6">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Featured Portfolios</h2>
                            <p className="mx-auto max-w-2xl text-muted-foreground">
                                Check out what others are building with Portfolify.
                            </p>
                        </div>

                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {portfolios.map((portfolio) => (
                                <Link 
                                    href={`/${portfolio.user?.username || portfolio.user?.id}`} 
                                    key={portfolio.id}
                                    className="group block overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg"
                                >
                                    <div className="aspect-video w-full overflow-hidden bg-muted">
                                        <img 
                                            src={
                                                portfolio.thumbnail_path 
                                                    ? `/storage/${portfolio.thumbnail_path}` 
                                                    : (portfolio.images?.[0]?.image_path 
                                                        ? `/storage/${portfolio.images[0].image_path}` 
                                                        : (portfolio.image_path 
                                                            ? `/storage/${portfolio.image_path}` 
                                                            : `https://placehold.co/600x400/1e293b/cbd5e1?text=${encodeURIComponent(portfolio.title)}`)
                                                    )
                                            }
                                            alt={portfolio.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="mb-1 text-lg font-bold group-hover:text-primary">{portfolio.title}</h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">by @{portfolio.user?.username}</span>
                                            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                                {portfolio.category}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="border-t border-border bg-background py-12">
                <div className="container mx-auto px-6 flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div className="flex items-center gap-2 font-mono font-bold text-muted-foreground">
                        <Terminal className="h-5 w-5" />
                        <span>Portfolify.app</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Portfolify. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-muted-foreground">
                        <Link href="#" className="hover:text-foreground">Privacy</Link>
                        <Link href="#" className="hover:text-foreground">Terms</Link>
                        <Link href="#" className="hover:text-foreground">Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
