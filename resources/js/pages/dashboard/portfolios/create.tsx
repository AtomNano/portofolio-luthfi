import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Briefcase, Image as ImageIcon, Loader2, X, ArrowLeft } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { PORTFOLIO_CATEGORIES } from '@/constants/portfolio';

// Define strict interface for Form Data matching the model
interface PortfolioFormData {
    title: string;
    description: string;
    category: string;
    project_url: string;
    development_time: string;
    tools: string;
    github_url: string;
    video_url: string;
    images: File[];
    image: File | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Portfolios',
        href: '/dashboard/portfolios',
    },
    {
        title: 'Create',
        href: '/dashboard/portfolios/create',
    },
];

export default function Create() {
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    
    // Initial data with strict typing
    const { data, setData, post, processing, errors, transform } = useForm<PortfolioFormData>({
        title: '',
        description: '',
        category: PORTFOLIO_CATEGORIES[0] || '', // Default to first category
        project_url: '',
        development_time: '',
        tools: '',
        github_url: '',
        video_url: '',
        images: [],
        image: null,
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Revoke old object URLs to avoid memory leaks
        imagePreviews.forEach((url) => URL.revokeObjectURL(url));

        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews(newPreviews);
        setData('images', files);
    };

    const removeImage = (index: number) => {
        const newImages = data.images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        
        setData('images', newImages);
        setImagePreviews(newPreviews);
    };

    // Helper to parse comma separated tools
    const parseCommaSeparated = (value: string): string[] => {
        if (!value) return [];
        return value.split(',').map((item) => item.trim()).filter(Boolean);
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        
        transform((data) => ({
            ...data,
            tools: parseCommaSeparated(data.tools),
        }));

        post('/dashboard/portfolios');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Portfolio" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mx-auto w-full max-w-4xl">
                    <div className="mb-6">
                        <Link
                            href="/dashboard/portfolios"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Portfolios
                        </Link>
                    </div>

                    <Card className="border-border bg-card">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <Briefcase className="h-6 w-6 text-cyan-500" />
                                Create New Project
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="mt-8 space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* Left Column */}
                                    <div className="space-y-6">
                                        <div>
                                            <Label htmlFor="title">
                                                Project Title
                                            </Label>
                                            <Input
                                                id="title"
                                                value={data.title}
                                                onChange={(e) =>
                                                    setData(
                                                        'title',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="e.g. E-Commerce Platform"
                                                required
                                            />
                                            <InputError
                                                message={errors.title}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="category">Category</Label>
                                            <select
                                                id="category"
                                                value={data.category}
                                                onChange={(e) => setData('category', e.target.value)}
                                                className="mt-1 block w-full rounded-md border border-input bg-background py-2 pl-3 pr-10 text-base focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:text-sm"
                                            >
                                                {PORTFOLIO_CATEGORIES.map((category) => (
                                                    <option key={category} value={category}>{category}</option>
                                                ))}
                                            </select>
                                            <InputError
                                                message={errors.category}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            <div>
                                                <Label htmlFor="development_time">
                                                    Development Time
                                                </Label>
                                                <Input
                                                    id="development_time"
                                                    value={data.development_time}
                                                    onChange={(e) =>
                                                        setData(
                                                            'development_time',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="e.g. 2 Weeks"
                                                />
                                                <InputError
                                                    message={errors.development_time}
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="project_url">
                                                Project URL (Optional)
                                            </Label>
                                            <Input
                                                id="project_url"
                                                type="url"
                                                value={data.project_url}
                                                onChange={(e) =>
                                                    setData(
                                                        'project_url',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="https://example.com"
                                            />
                                            <InputError
                                                message={errors.project_url}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-6">
                                        <div>
                                            <Label htmlFor="tools">
                                                Technologies (comma
                                                separated)
                                            </Label>
                                            <Input
                                                id="tools"
                                                value={data.tools}
                                                onChange={(e) =>
                                                    setData(
                                                        'tools',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="React, Laravel, Tailwind CSS"
                                                required
                                            />
                                            <InputError
                                                message={errors.tools}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="github_url">
                                                GitHub URL (Optional)
                                            </Label>
                                            <Input
                                                id="github_url"
                                                type="url"
                                                value={data.github_url}
                                                onChange={(e) =>
                                                    setData(
                                                        'github_url',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="https://github.com/..."
                                            />
                                            <InputError
                                                message={errors.github_url}
                                                className="mt-2"
                                            />
                                        </div>

                                         <div>
                                            <Label htmlFor="video_url">
                                                Video URL (Optional)
                                            </Label>
                                            <Input
                                                id="video_url"
                                                value={data.video_url}
                                                onChange={(e) =>
                                                    setData(
                                                        'video_url',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="https://youtube.com/watch?v=..."
                                            />
                                            <InputError
                                                message={errors.video_url}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        className="min-h-[120px]"
                                        placeholder="Describe the project details..."
                                        required
                                    />
                                    <InputError
                                        message={errors.description}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <Label>Project Images</Label>
                                            <div className="mt-2 flex flex-col gap-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {imagePreviews.map(
                                                        (
                                                            preview,
                                                            index,
                                                        ) => (
                                                            <div
                                                                key={
                                                                    index
                                                                }
                                                                className="relative h-20 w-20 overflow-hidden rounded-lg border border-border"
                                                            >
                                                                <img
                                                                    src={
                                                                        preview
                                                                    }
                                                                    alt={`Preview ${index}`}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeImage(index)}
                                                                    className="absolute top-0 right-0 rounded-bl-lg bg-red-500/80 p-1 text-white hover:bg-red-600"
                                                                >
                                                                    <X className="h-3 w-3" />
                                                                </button>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                        <label className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border p-8 transition-colors hover:border-cyan-500/50 hover:bg-secondary/50">
                                            <div className="flex flex-col items-center gap-2 text-center">
                                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                                <span className="text-sm font-medium text-muted-foreground">
                                                    Click to
                                                    upload
                                                    images
                                                </span>
                                                <span className="text-xs text-muted-foreground/60">
                                                    PNG, JPG up
                                                    to 5MB
                                                </span>
                                            </div>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageChange}
                                            />
                                        </label>
                                    </div>
                                    <InputError
                                        message={errors.images}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button
                                        type="submit"
                                        className="bg-cyan-500 text-white hover:bg-cyan-600"
                                        disabled={processing}
                                    >
                                        {processing && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Create Project
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
