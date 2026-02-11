import { Head, useForm, router } from '@inertiajs/react';
import { Pencil, Trash2, Plus, Calendar, Building2, Briefcase } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Experience } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"

// Routes helper (assuming these exist or will use manual paths)
const routes = {
    index: '/dashboard/experiences',
    store: '/dashboard/experiences',
    reorder: '/dashboard/experiences/reorder',
    update: (id: number) => `/dashboard/experiences/${id}`,
    destroy: (id: number) => `/dashboard/experiences/${id}`,
};

const SortableExperienceItem = ({ experience, openEditDialog, handleDelete }: { experience: Experience, openEditDialog: (exp: Experience) => void, handleDelete: (id: number) => void }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: experience.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col hover:border-cyan-500/30 transition-colors group touch-none"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gray-800 rounded-lg group-hover:bg-cyan-900/20 transition-colors cursor-grab active:cursor-grabbing">
                    <Briefcase className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(experience)} className="cursor-pointer" onPointerDown={(e) => e.stopPropagation()}>
                        <Pencil className="w-4 h-4 text-gray-400 hover:text-cyan-400" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(experience.id)} className="cursor-pointer" onPointerDown={(e) => e.stopPropagation()}>
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                    </Button>
                </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{experience.role}</h3>

            <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                <Building2 className="w-4 h-4" />
                <span className="line-clamp-1">{experience.company}</span>
            </div>

            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-4 bg-cyan-950/30 py-1 px-2 rounded w-fit border border-cyan-500/20">
                <Calendar className="w-3 h-3" />
                <span>{experience.period}</span>
            </div>

            <p className="text-gray-400 text-sm line-clamp-3 mt-auto">
                {experience.description}
            </p>
        </div>
    );
};

export default function ExperienceIndex({ experiences }: { experiences: Experience[] }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
    const [items, setItems] = useState(experiences);

    // Update local state when prop changes
    useState(() => {
        setItems(experiences);
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);

                const newItems = arrayMove(items, oldIndex, newIndex);

                // Send reorder request
                const orderMap = newItems.map((item, index) => ({
                    id: item.id,
                    order: index
                }));

                router.visit(routes.reorder, {
                    method: 'put',
                    data: { order: orderMap },
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: () => {
                        // Optional: Show success toast
                    }
                });

                return newItems;
            });
        }
    };

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        role: '',
        company: '',
        period: '',
        description: '',
        order: 0,
    });

    const openCreateDialog = () => {
        setEditingExperience(null);
        reset();
        clearErrors();
        setIsDialogOpen(true);
    };

    const openEditDialog = (experience: Experience) => {
        setEditingExperience(experience);
        setData({
            role: experience.role,
            company: experience.company,
            period: experience.period,
            description: experience.description,
            order: experience.order,
        });
        clearErrors();
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingExperience) {
            put(routes.update(editingExperience.id), {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Experience updated successfully',
                        background: '#1f2937',
                        color: '#fff',
                        confirmButtonColor: '#06b6d4',
                    });
                },
            });
        } else {
            post(routes.store, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Experience created successfully',
                        background: '#1f2937',
                        color: '#fff',
                        confirmButtonColor: '#06b6d4',
                    });
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
            background: '#1f2937',
            color: '#fff',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(routes.destroy(id), {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Experience has been deleted.',
                            icon: 'success',
                            background: '#1f2937',
                            color: '#fff',
                            confirmButtonColor: '#06b6d4',
                        });
                    },
                });
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Manage Experiences" />

            <div className="container max-w-7xl mx-auto py-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Manage Experiences</h1>
                        <p className="text-gray-400 mt-1">Add, edit, or remove your professional experiences.</p>
                    </div>
                    <Button onClick={openCreateDialog} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New
                    </Button>
                </div>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={items}
                        strategy={rectSortingStrategy}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {items.map((experience) => (
                                <SortableExperienceItem
                                    key={experience.id}
                                    experience={experience}
                                    openEditDialog={openEditDialog}
                                    handleDelete={handleDelete}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                {experiences.length === 0 && (
                    <div className="text-center py-20 border border-dashed border-gray-800 rounded-xl">
                        <Briefcase className="h-12 w-12 text-gray-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No experiences yet</h3>
                        <p className="text-gray-500">Get started by adding your first professional experience.</p>
                    </div>
                )}
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingExperience ? 'Edit Experience' : 'Add New Experience'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="role">Role / Job Title</Label>
                            <Input
                                id="role"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                placeholder="e.g. Senior Frontend Developer"
                                className="bg-gray-800 border-gray-700 focus:border-cyan-500"
                                required
                            />
                            {errors.role && <p className="text-red-500 text-xs">{errors.role}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="company">Company Name</Label>
                            <Input
                                id="company"
                                value={data.company}
                                onChange={(e) => setData('company', e.target.value)}
                                placeholder="e.g. Google Inc."
                                className="bg-gray-800 border-gray-700 focus:border-cyan-500"
                                required
                            />
                            {errors.company && <p className="text-red-500 text-xs">{errors.company}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="period">Period</Label>
                            <Input
                                id="period"
                                value={data.period}
                                onChange={(e) => setData('period', e.target.value)}
                                placeholder="e.g. Jan 2023 - Present"
                                className="bg-gray-800 border-gray-700 focus:border-cyan-500"
                                required
                            />
                            {errors.period && <p className="text-red-500 text-xs">{errors.period}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Describe your responsibilities and achievements..."
                                className="bg-gray-800 border-gray-700 focus:border-cyan-500 min-h-[100px]"
                                required
                            />
                            {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
                        </div>

                        <DialogFooter className="mt-6">
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="mr-2">
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white" disabled={processing}>
                                {processing ? 'Saving...' : (editingExperience ? 'Update Experience' : 'Create Experience')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
