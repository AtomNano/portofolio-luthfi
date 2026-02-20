import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, GripVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { Button, buttonVariants } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { create, show, edit, destroy } from '@/routes/dashboard/portfolios';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Portfolios', href: '/dashboard/portfolios' },
];

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
    project_url: string;
    image_path: string;
    images: PortfolioImage[];
    order: number;
};

type Props = {
    portfolios: Portfolio[];
    can_add_portfolio: boolean;
    max_portfolios: number | null;
    current_count: number;
};

// Sortable Portfolio Card Component
function SortablePortfolioCard({ portfolio, onDelete }: { portfolio: Portfolio; onDelete: (id: number) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: portfolio.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleCardClick = (e: React.MouseEvent) => {
        // Prevent navigation if clicking on buttons or drag handle
        if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('[data-drag-handle]')) {
            return;
        }
        router.visit(show.url({ portfolio: portfolio.id }));
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group relative flex flex-col rounded-lg border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden transition-all hover:border-cyan-500/50 hover:shadow-lg cursor-pointer"
            onClick={handleCardClick}
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                data-drag-handle
                className="absolute top-2 left-2 z-10 cursor-grab active:cursor-grabbing bg-gray-800/80 rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <GripVertical className="h-5 w-5 text-gray-400" />
            </div>

            {/* Thumbnail */}
            {(portfolio.image_path || portfolio.images?.length > 0) && (
                <div className="aspect-video w-full overflow-hidden bg-gray-800">
                    <img
                        src={`/storage/${portfolio.image_path || portfolio.images[0]?.image_path}`}
                        alt={portfolio.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                </div>
            )}

            {/* Content */}
            <div className="flex flex-col flex-1 p-4">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                        <h2 className="font-semibold text-white text-lg line-clamp-1">{portfolio.title}</h2>
                        <p className="text-sm text-cyan-400">{portfolio.category}</p>
                    </div>
                </div>

                {portfolio.images?.length > 0 && (
                    <p className="text-xs text-gray-500 mb-3">
                        {portfolio.images.length} gambar tambahan
                    </p>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-800">
                    <Link
                        href={show.url({ portfolio: portfolio.id })}
                        className={buttonVariants({ variant: 'outline', size: 'sm', className: 'flex-1' })}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Eye className="h-4 w-4 mr-1" />
                        Detail
                    </Link>
                    <Link
                        href={edit.url({ portfolio: portfolio.id })}
                        className={buttonVariants({ variant: 'outline', size: 'sm', className: 'flex-1' })}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                    </Link>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(portfolio.id);
                        }}
                        className="flex-1"
                    >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Hapus
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function PortfolioIndex({ portfolios: initialPortfolios, can_add_portfolio, max_portfolios, current_count }: Props) {
    const [portfolios, setPortfolios] = useState(initialPortfolios);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setPortfolios((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                const newItems = arrayMove(items, oldIndex, newIndex);

                // Update order on server
                const orderData = newItems.map((item, index) => ({
                    id: item.id,
                    order: index,
                }));

                router.post('/dashboard/portfolios/reorder', { portfolios: orderData }, {
                    preserveScroll: true,
                    preserveState: true,
                });

                return newItems;
            });
        }
    };

    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: 'Portfolio ini akan dihapus permanen!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
            background: '#1f2937',
            color: '#fff',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(destroy.url({ portfolio: id }), {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Terhapus!',
                            text: 'Portfolio berhasil dihapus.',
                            icon: 'success',
                            background: '#1f2937',
                            color: '#fff',
                            confirmButtonColor: '#06b6d4',
                        });
                    },
                    onError: (errors) => {
                        Swal.fire({
                            title: 'Gagal!',
                            text: 'Terjadi kesalahan saat menghapus portfolio.',
                            icon: 'error',
                            background: '#1f2937',
                            color: '#fff',
                            confirmButtonColor: '#ef4444',
                        });
                        console.error('Delete error:', errors);
                    },
                });
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Portofolio" />

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Manajemen Portofolio</h1>
                        <p className="text-gray-400 mt-1">Kelola dan atur urutan portfolio Anda</p>
                    </div>
                    {can_add_portfolio ? (
                        <Link href={create.url()} className={buttonVariants()}>
                            Tambah Baru
                        </Link>
                    ) : (
                        <Button disabled className="opacity-50 cursor-not-allowed hidden sm:inline-flex">
                            Maksimal {max_portfolios} Item
                        </Button>
                    )}
                </div>

                {!can_add_portfolio && max_portfolios !== null && (
                    <div className="mb-8 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-semibold text-orange-400">Batas Kuota Portofolio Tercapai ({current_count}/{max_portfolios})</h3>
                            <p className="text-sm text-gray-300 mt-1">Anda menggunakan paket Free yang hanya mengizinkan maksimal {max_portfolios} portofolio. Upgrade ke paket Pro untuk membuat item baru.</p>
                        </div>
                        <Link href="/dashboard/billing" className={buttonVariants({ variant: 'default', size: 'sm', className: 'whitespace-nowrap shrink-0 bg-orange-600 hover:bg-orange-700 text-white' })}>
                            Upgrade ke Pro
                        </Link>
                    </div>
                )}

                {portfolios.length > 0 ? (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={portfolios.map((p) => p.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {portfolios.map((portfolio) => (
                                    <SortablePortfolioCard
                                        key={portfolio.id}
                                        portfolio={portfolio}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                ) : (
                    <div className="text-center py-16 border border-dashed border-gray-800 rounded-xl">
                        <p className="text-gray-400 text-lg">Belum ada item portofolio.</p>
                        <p className="text-gray-500 mt-2">Mulai dengan membuat yang baru.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
