import { Deferred, Head, Link, usePage } from '@inertiajs/react';
import { PlusCircle, Eye, MousePointer, TrendingUp, ExternalLink, Zap, Globe, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Line, LineChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { usePageEffects } from '@/hooks/use-page-effects';
import { useTenant, usePlanFeatures } from '@/hooks/use-tenant';
import AppLayout from '@/layouts/app-layout';
import dashboard from '@/routes/dashboard';
import type { BreadcrumbItem, SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard.index.url(),
    },
];

type Statistics = {
    total_home_views: number;
    total_portfolio_views: number;
    portfolio_stats: {
        id: number;
        title: string;
        views: number;
    }[];
    daily_views: {
        date: string;
        views: number;
    }[];
};

interface DashboardProps extends SharedData {
    statistics?: Statistics;
}

export default function Dashboard({ statistics }: DashboardProps) {
    usePageEffects('Dashboard');
    const { auth } = usePage<SharedData>().props;
    const tenant = useTenant();
    const { isFree, plan } = usePlanFeatures();

    const publicPortfolioUrl = tenant?.slug ? `/${tenant.slug}` : '/';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-hidden rounded-xl p-4 md:p-8 lg:p-12">

                {/* Plan Banner — Free tier upgrade prompt */}
                {isFree && (
                    <div className="from-primary/10 to-purple-500/10 border-primary/20 flex flex-col items-start justify-between gap-3 rounded-xl border bg-gradient-to-r p-4 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/20 rounded-lg p-2">
                                <Sparkles className="text-primary h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Anda menggunakan <span className="text-primary">Free Plan</span></p>
                                <p className="text-muted-foreground text-xs">Upgrade ke Pro untuk portfolio tak terbatas, custom domain & analytics.</p>
                            </div>
                        </div>
                        <Button size="sm" className="w-full shrink-0 sm:w-auto">
                            <Zap className="mr-1 h-3.5 w-3.5" />
                            Upgrade ke Pro
                        </Button>
                    </div>
                )}

                {/* Welcome Card */}
                <Card className="glass text-foreground transition-all duration-300 hover:scale-[1.02]">
                    <CardHeader>
                        <div className="flex flex-wrap items-start justify-between gap-2">
                            <CardTitle className="text-foreground">Selamat Datang, {auth.user.name}!</CardTitle>
                            {plan && (
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${isFree ? 'bg-secondary text-secondary-foreground' : 'bg-primary/20 text-primary'}`}>
                                    {plan.name}
                                </span>
                            )}
                        </div>
                        <CardDescription className="text-muted-foreground">
                            Pusat kendali portfolio Anda.
                            {tenant?.slug && (
                                <span className="text-primary ml-1">
                                    URL Anda: <a href={publicPortfolioUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">portfolify.app/{tenant.slug}</a>
                                </span>
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mt-1 flex flex-col gap-3 sm:flex-row">
                            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground w-full border-0 sm:w-auto">
                                <Link href={dashboard.portfolios.index.url()}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Kelola Portofolio
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="border-border hover:bg-accent hover:text-accent-foreground w-full sm:w-auto">
                                <a href={publicPortfolioUrl} target="_blank" rel="noopener noreferrer">
                                    <Globe className="mr-2 h-4 w-4" />
                                    Lihat Portfolio Publik
                                </a>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics Section using Deferred Props */}
                <Deferred data="statistics" fallback={
                   <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                             <Card key={i} className={`glass h-32 animate-pulse ${i === 3 ? 'col-span-2 md:col-span-1' : ''}`} />
                        ))}
                   </div>
                }>
                    {statistics && (
                        <>
                            {/* Analytics Chart */}
                            <Card className="glass text-foreground mb-4">
                                <CardHeader>
                                    <CardTitle>Trend Kunjungan (30 Hari Terakhir)</CardTitle>
                                    <CardDescription>Aktivitas penayangan portofolio Anda</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="w-full mt-4" style={{ minHeight: '300px' }}>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={statistics.daily_views} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" />
                                                <XAxis 
                                                    dataKey="date" 
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#a1a1aa', fontSize: 12 }}
                                                    dy={10}
                                                />
                                                <YAxis 
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#a1a1aa', fontSize: 12 }}
                                                    allowDecimals={false}
                                                />
                                                <RechartsTooltip 
                                                    contentStyle={{ 
                                                        backgroundColor: '#18181b', // zinc-900
                                                        borderColor: '#27272a',    // zinc-800
                                                        borderRadius: '0.5rem',
                                                        color: '#f4f4f5'           // zinc-100
                                                    }}
                                                    itemStyle={{ color: '#06b6d4' }} // cyan-500
                                                />
                                                <Line 
                                                    type="monotone" 
                                                    dataKey="views" 
                                                    name="Kunjungan"
                                                    stroke="#06b6d4" // cyan-500
                                                    strokeWidth={3}
                                                    dot={false}
                                                    activeDot={{ r: 6, fill: '#06b6d4' }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {/* Total Website Visitors */}
                                <Card className="glass text-foreground transition-all duration-300 hover:scale-105">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-400">
                                            Pengunjung Website
                                        </CardTitle>
                                        <Eye className="h-4 w-4 text-cyan-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-foreground text-3xl font-bold">
                                            {statistics.total_home_views}
                                        </div>
                                        <p className="text-muted-foreground mt-1 text-xs">
                                            Total kunjungan ke halaman utama
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Total Portfolio Clicks */}
                                <Card className="glass text-gray-200 transition-all duration-300 hover:scale-105">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-400">
                                            Klik Portofolio
                                        </CardTitle>
                                        <MousePointer className="h-4 w-4 text-green-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-foreground text-3xl font-bold">
                                            {statistics.total_portfolio_views}
                                        </div>
                                        <p className="text-muted-foreground mt-1 text-xs">
                                            Total klik pada portofolio Anda
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Engagement Rate */}
                                <Card className="glass col-span-2 text-gray-200 transition-all duration-300 hover:scale-105 md:col-span-1">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-400">
                                            Tingkat Interaksi
                                        </CardTitle>
                                        <TrendingUp className="h-4 w-4 text-purple-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-foreground text-3xl font-bold">
                                            {statistics.total_home_views > 0
                                                    ? `${Math.round((statistics.total_portfolio_views / statistics.total_home_views) * 100)}%`
                                                    : '0%'}
                                        </div>
                                        <p className="text-muted-foreground mt-1 text-xs">
                                            Pengunjung yang melihat portofolio
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Portfolio Stats */}
                            {statistics.portfolio_stats.length > 0 && (
                                <Card className="glass text-foreground transition-all duration-300 hover:scale-[1.02]">
                                    <CardHeader>
                                        <CardTitle className="text-foreground">Statistik Per Portofolio</CardTitle>
                                        <CardDescription className="text-muted-foreground">
                                            Portofolio yang paling sering dilihat
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {statistics.portfolio_stats.slice(0, 5).map((item, index) => (
                                                <div key={item.id} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <span className="bg-secondary flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium text-cyan-500">
                                                            {index + 1}
                                                        </span>
                                                        <span className="text-foreground">{item.title}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="bg-secondary h-2 w-24 overflow-hidden rounded-full">
                                                            <div
                                                                className="h-full rounded-full bg-cyan-500"
                                                                style={{
                                                                    width: `${statistics.portfolio_stats[0].views > 0
                                                                        ? (item.views / statistics.portfolio_stats[0].views) * 100
                                                                        : 0
                                                                        }%`,
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="text-muted-foreground w-12 text-right text-sm">
                                                            {item.views}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    )}
                </Deferred>
            </div>
        </AppLayout>
    );
}
