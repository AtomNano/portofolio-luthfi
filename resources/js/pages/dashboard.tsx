import { Head, Link, usePage } from '@inertiajs/react';
import { PlusCircle, Eye, MousePointer, TrendingUp, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import dashboard from '@/routes/dashboard';
import type { BreadcrumbItem, SharedData } from '@/types';
import { usePageEffects } from '@/hooks/use-page-effects';

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
};

export default function Dashboard() {
    usePageEffects('Dashboard');
    const { auth } = usePage<SharedData>().props;
    const [stats, setStats] = useState<Statistics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/dashboard/api/statistics')
            .then((res) => res.json())
            .then((data) => {
                setStats(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Welcome Card */}
                <Card className="glass text-gray-200 hover:scale-[1.02] transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="text-white">Selamat Datang, {auth.user.name}!</CardTitle>
                        <CardDescription className="text-gray-400">
                            Ini adalah pusat kendali untuk website portofolio Anda.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Mulai kelola Portofolio Anda.</p>
                        <div className="mt-4 flex gap-3">
                            <Button asChild className="bg-cyan-600 hover:bg-cyan-500 text-white border-0">
                                <Link href={dashboard.portfolios.index.url()}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Kelola Portofolio
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="border-gray-700 hover:bg-gray-800">
                                <a href="/" target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Lihat Landing Page
                                </a>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Total Website Visitors */}
                    <Card className="glass text-gray-200 hover:scale-105 transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">
                                Pengunjung Website
                            </CardTitle>
                            <Eye className="h-4 w-4 text-cyan-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">
                                {loading ? '...' : stats?.total_home_views ?? 0}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                                Total kunjungan ke halaman utama
                            </p>
                        </CardContent>
                    </Card>

                    {/* Total Portfolio Clicks */}
                    <Card className="glass text-gray-200 hover:scale-105 transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">
                                Klik Portofolio
                            </CardTitle>
                            <MousePointer className="h-4 w-4 text-green-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">
                                {loading ? '...' : stats?.total_portfolio_views ?? 0}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                                Total klik pada portofolio Anda
                            </p>
                        </CardContent>
                    </Card>

                    {/* Engagement Rate */}
                    <Card className="glass text-gray-200 hover:scale-105 transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">
                                Tingkat Interaksi
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-purple-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">
                                {loading
                                    ? '...'
                                    : stats && stats.total_home_views > 0
                                        ? `${Math.round((stats.total_portfolio_views / stats.total_home_views) * 100)}%`
                                        : '0%'}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                                Pengunjung yang melihat portofolio
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Portfolio Stats */}
                {stats && stats.portfolio_stats.length > 0 && (
                    <Card className="glass text-gray-200 hover:scale-[1.02] transition-all duration-300">
                        <CardHeader>
                            <CardTitle className="text-white">Statistik Per Portofolio</CardTitle>
                            <CardDescription className="text-gray-400">
                                Portofolio yang paling sering dilihat
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats.portfolio_stats.slice(0, 5).map((item, index) => (
                                    <div key={item.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-sm font-medium text-cyan-400">
                                                {index + 1}
                                            </span>
                                            <span className="text-gray-200">{item.title}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-2 rounded-full bg-gray-700 overflow-hidden">
                                                <div
                                                    className="h-full bg-cyan-500 rounded-full"
                                                    style={{
                                                        width: `${stats.portfolio_stats[0].views > 0
                                                            ? (item.views / stats.portfolio_stats[0].views) * 100
                                                            : 0
                                                            }%`,
                                                    }}
                                                />
                                            </div>
                                            <span className="text-sm text-gray-400 w-12 text-right">
                                                {item.views}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}

