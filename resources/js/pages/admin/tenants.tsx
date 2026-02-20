import { Head, router, useForm } from '@inertiajs/react';
import { MoreVertical, UserPlus, Pencil, Trash, Lock } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Superadmin', href: '/admin/dashboard' },
    { title: 'Tenants & Subscriptions', href: '/admin/tenants' },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Modal({ isOpen, onClose, title, children }: any) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#1f2937] border border-white/10 w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-black/20">
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AdminTenants({ users }: any) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [editingUser, setEditingUser] = useState<any>(null);

    const createForm = useForm({
        name: '',
        email: '',
        password: '',
        plan_slug: 'free',
    });

    const editForm = useForm({
        name: '',
        email: '',
        password: '',
    });

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/admin/tenants', {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                createForm.reset();
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Akun baru berhasil dibuat.',
                    icon: 'success',
                    background: '#1f2937', color: '#fff'
                });
            },
        });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const openEditModal = (user: any) => {
        setEditingUser(user);
        editForm.setData({ name: user.name, email: user.email, password: '' });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!editingUser) return;

        editForm.put(`/admin/tenants/${editingUser.id}`, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                editForm.reset();
                Swal.fire({
                    title: 'Tersimpan!',
                    text: 'Data pengguna diperbarui.',
                    icon: 'success',
                    background: '#1f2937', color: '#fff'
                });
            },
        });
    };

    const deleteUser = (userId: number, userName: string) => {
        Swal.fire({
            title: `Hapus Permanen ${userName}?`,
            text: "Aksi ini akan menghapus akun beserta seluruh data portofolio miliknya. Tindakan ini tidak bisa dibatalkan!",
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#1f2937',
            confirmButtonText: 'Ya, Hapus!',
            background: '#1f2937', color: '#fff',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/tenants/${userId}`, {
                    preserveScroll: true,
                    onSuccess: () => {
                        window.alert('Akun berhasil dihapus selamanya dari sistem.');
                    },
                });
            }
        });
    };

    const swapPlan = (userId: number, currentPlan: string, userName: string) => {
        const targetPlan = currentPlan === 'free' ? 'pro' : 'free';
        const targetLabel = targetPlan === 'pro' ? 'Upgrade ke Pro' : 'Downgrade ke Free';
        
        Swal.fire({
            title: `${targetLabel}?`,
            text: `Ubah paket untuk ${userName} menjadi ${targetPlan.toUpperCase()}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: targetPlan === 'pro' ? '#f97316' : '#6b7280',
            cancelButtonColor: '#1f2937',
            confirmButtonText: `Ya, ${targetPlan.toUpperCase()}`,
            background: '#1f2937', color: '#fff',
        }).then((result) => {
            if (result.isConfirmed) {
                router.patch(`/admin/tenants/${userId}/plan`, { plan: targetPlan });
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tenant Management" />
            
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-hidden rounded-xl p-4 md:p-8 lg:p-12">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Users & Tenants</h1>
                        <p className="text-gray-400 mt-1">Manage user subscriptions, accounts, and platform limits</p>
                    </div>
                    <Button onClick={() => setIsCreateModalOpen(true)} className="bg-cyan-600 hover:bg-cyan-500 text-white">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add New User
                    </Button>
                </div>

                <Card className="bg-black/40 border-white/10">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-white/5 text-gray-400">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Tenant / URL</th>
                                    <th className="px-6 py-4">State</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {users?.data?.map((user: any) => user ? (
                                    <tr key={user.id} className="hover:bg-white/5">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white">{user.name}</div>
                                            <div className="text-gray-500">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-cyan-400">/{user.tenant_name}</div>
                                            <div className="text-xs text-gray-500 mt-1">Joined: {user.joined_at}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${user.plan_slug === 'pro' ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                                {user.plan_slug?.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreVertical className="h-4 w-4 text-gray-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 bg-[#1f2937] border-white/10 text-gray-200">
                                                    <DropdownMenuItem onClick={() => openEditModal(user)} className="cursor-pointer focus:bg-white/10">
                                                        <Pencil className="mr-2 h-4 w-4" /> Edit Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => swapPlan(user.id, user.plan_slug, user.name)} className="cursor-pointer focus:bg-white/10">
                                                        <Lock className="mr-2 h-4 w-4" /> Toggle Premium
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => deleteUser(user.id, user.name)} className="cursor-pointer text-red-400 focus:bg-red-400/10 focus:text-red-400">
                                                        <Trash className="mr-2 h-4 w-4" /> Terminate Account
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ) : null)}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* CREATE MODAL */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Add New Platform User">
                <form onSubmit={handleCreateSubmit} className="space-y-4">
                    <div>
                        <Label>Name</Label>
                        <Input value={createForm.data.name} onChange={e => createForm.setData('name', e.target.value)} required className="bg-black/40 border-white/10" />
                    </div>
                    <div>
                        <Label>Email</Label>
                        <Input type="email" value={createForm.data.email} onChange={e => createForm.setData('email', e.target.value)} required className="bg-black/40 border-white/10" />
                    </div>
                    <div>
                        <Label>Initial Password</Label>
                        <Input type="password" value={createForm.data.password} onChange={e => createForm.setData('password', e.target.value)} required minLength={8} className="bg-black/40 border-white/10" />
                    </div>
                    <div>
                        <Label>Starting Plan</Label>
                        <select 
                            value={createForm.data.plan_slug} 
                            onChange={e => createForm.setData('plan_slug', e.target.value)} 
                            className="mt-1 flex h-9 w-full rounded-md border border-white/10 bg-black/40 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="free">Free</option>
                            <option value="pro">Pro (Bypass Billing)</option>
                        </select>
                    </div>
                    <div className="pt-2 flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)} className="border-white/10 hover:bg-white/5">Cancel</Button>
                        <Button type="submit" disabled={createForm.processing} className="bg-cyan-600 hover:bg-cyan-500 text-white">Create Account</Button>
                    </div>
                </form>
            </Modal>

            {/* EDIT MODAL */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit User Identity">
                <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div>
                        <Label>Name</Label>
                        <Input value={editForm.data.name} onChange={e => editForm.setData('name', e.target.value)} required className="bg-black/40 border-white/10" />
                    </div>
                    <div>
                        <Label>Email</Label>
                        <Input type="email" value={editForm.data.email} onChange={e => editForm.setData('email', e.target.value)} required className="bg-black/40 border-white/10" />
                    </div>
                    <div>
                        <Label>New Password (Optional)</Label>
                        <Input type="password" placeholder="Leave blank to keep current" value={editForm.data.password} onChange={e => editForm.setData('password', e.target.value)} className="bg-black/40 border-white/10" />
                    </div>
                    <div className="pt-2 flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)} className="border-white/10 hover:bg-white/5">Cancel</Button>
                        <Button type="submit" disabled={editForm.processing} className="bg-cyan-600 hover:bg-cyan-500 text-white">Save Changes</Button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
