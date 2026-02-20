import { Head, Link } from '@inertiajs/react';
import { Users, Presentation, Eye, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Superadmin', href: '/admin/dashboard' },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AdminDashboard({ stats, recent_users }: any) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Platform Dashboard" />
            
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-hidden rounded-xl p-4 md:p-8 lg:p-12">
                <div>
                    <h1 className="text-3xl font-bold text-white">Platform Dashboard</h1>
                    <p className="text-gray-400 mt-1">SaaS Global Statistics Overview</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">Total Registrations</CardTitle>
                            <Users className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_users}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">Total Portfolios</CardTitle>
                            <Presentation className="h-4 w-4 text-cyan-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_portfolios}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">Pro Subscriptions</CardTitle>
                            <Star className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pro_users}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">All-Time Views</CardTitle>
                            <Eye className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_views}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Recent Signups</h2>
                        <Link href="/admin/tenants" className="text-cyan-400 text-sm hover:underline">View all users</Link>
                    </div>
                    
                    <Card className="bg-black/40 border-white/10">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-white/5 text-gray-400">
                                    <tr>
                                        <th className="px-6 py-3">Name</th>
                                        <th className="px-6 py-3">Email</th>
                                        <th className="px-6 py-3">Plan</th>
                                        <th className="px-6 py-3">Identifier</th>
                                        <th className="px-6 py-3">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {recent_users.map((user: any) => (
                                        <tr key={user.id} className="hover:bg-white/5">
                                            <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                                            <td className="px-6 py-4 text-gray-400">{user.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${user.plan === 'Pro' ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                                    {user.plan}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-cyan-400">{user.domain}</td>
                                            <td className="px-6 py-4 text-gray-400">{user.joined}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
