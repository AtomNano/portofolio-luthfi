import { Head, router, Link } from '@inertiajs/react';
import { Search, Trash, FilterX, Layers, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Superadmin', href: '/admin/dashboard' },
    { title: 'Global Portfolios', href: '/admin/portfolios' },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AdminPortfolios({ portfolios, filters, tenants }: any) {
    const [search, setSearch] = useState(filters.search || '');
    const [tenantId, setTenantId] = useState(filters.tenant_id || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/portfolios', { search, tenant_id: tenantId }, { preserveState: true, replace: true });
    };

    const resetFilters = () => {
        setSearch('');
        setTenantId('');
        router.get('/admin/portfolios');
    };

    const deletePortfolio = (id: number, title: string) => {
        Swal.fire({
            title: `Hapus Portfolio: ${title}?`,
            text: "Data akan dihapus permanen dari platform. Tindakan ini tidak bisa dibatalkan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#1f2937',
            confirmButtonText: 'Ya, Hapus!',
            background: '#1f2937', color: '#fff',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/portfolios/${id}`, {
                    preserveScroll: true,
                    onSuccess: () => {
                        window.alert('Portfolio berhasil di-take down.');
                    },
                });
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Global Portfolios" />
            
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-hidden rounded-xl p-4 md:p-8 lg:p-12">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                            <Layers className="h-8 w-8 text-cyan-500" />
                            Global Portfolios
                        </h1>
                        <p className="text-gray-400 mt-1">Cross-tenant moderation and portfolio administration</p>
                    </div>
                </div>

                <Card className="bg-black/40 border-white/10 p-4">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-center w-full">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input 
                                type="text"
                                placeholder="Cari judul portfolio..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 bg-black/40 border-white/10"
                            />
                        </div>
                        <select
                            value={tenantId}
                            onChange={(e) => setTenantId(e.target.value)}
                            className="w-full md:w-64 h-9 rounded-md border border-white/10 bg-black/40 px-3 py-1 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        >
                            <option value="">Semua User / Tenant</option>
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {tenants.map((t: any) => (
                                <option key={t.id} value={t.id}>{t.name} ({t.owner})</option>
                            ))}
                        </select>
                        <Button type="submit" className="w-full md:w-auto bg-cyan-600 hover:bg-cyan-500 text-white">
                            Filter
                        </Button>
                        {(search || tenantId) && (
                            <Button type="button" variant="ghost" onClick={resetFilters} className="w-full md:w-auto text-gray-400 hover:text-white hover:bg-white/5">
                                <FilterX className="h-4 w-4 mr-2" /> Reset
                            </Button>
                        )}
                    </form>
                </Card>

                <Card className="bg-black/40 border-white/10">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-white/5 text-gray-400">
                                <tr>
                                    <th className="px-6 py-4">Portfolio Info</th>
                                    <th className="px-6 py-4">Tenant / Owner</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Visibility</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {portfolios.data.length > 0 ? portfolios.data.map((p: any) => (
                                    <tr key={p.id} className="hover:bg-white/5 group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {p.thumbnail ? (
                                                    <img src={p.thumbnail} alt={p.title} className="w-12 h-12 rounded object-cover border border-white/10" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded bg-white/5 border border-white/10 flex items-center justify-center text-gray-500">
                                                        <Layers className="w-5 h-5" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium text-white">{p.title}</div>
                                                    <div className="text-xs text-gray-500 mt-0.5">{p.created_at}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-cyan-400">/{p.tenant_name}</div>
                                            <div className="text-xs text-gray-500 mt-1">By: {p.owner_name}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">
                                            {p.category}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${p.is_published ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                                {p.is_published ? 'PUBLISHED' : 'DRAFT'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <a href={`/portfolios/${p.id}`} target="_blank" rel="noreferrer">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300" title="Lihat Detail Portfolio">
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Button>
                                                </a>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:bg-red-500/10 hover:text-red-300" onClick={() => deletePortfolio(p.id, p.title)} title="Take Down Portfolio">
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            <Layers className="mx-auto h-8 w-8 mb-3 opacity-50" />
                                            Tidak ada portfolio yang ditemukan atau belum ada portfolio yang diposting.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Pagination */}
                {portfolios.links && portfolios.data.length > 0 && (
                    <div className="flex justify-center mt-4 pb-8">
                        <div className="flex gap-1">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {portfolios.links.map((link: any, i: number) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`px-3 py-1 border rounded text-sm ${link.active ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'} ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
