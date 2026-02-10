import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft, Upload, Trash2, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { index, edit } from '@/routes/dashboard/portfolios';

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
    project_url: string | null;
    image_path: string | null;
    development_time: string | null;
    tools: string[] | null;
    github_url: string | null;
    video_url: string | null;
    images: PortfolioImage[];
};

type Props = {
    portfolio: Portfolio;
};

export default function PortfolioShow({ portfolio }: Props) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Get all images (including main image_path if exists)
    const allImages = [
        ...(portfolio.image_path ? [{ id: 0, image_path: portfolio.image_path, order: -1 }] : []),
        ...portfolio.images,
    ];

    // Auto-rotate carousel
    useEffect(() => {
        if (allImages.length <= 1 || isPaused) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % allImages.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [allImages.length, isPaused]);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % allImages.length);
    }, [allImages.length]);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + allImages.length) % allImages.length);
    }, [allImages.length]);

    // Upload form
    const { post, processing } = useForm({});

    const handleUpload = () => {
        if (!selectedFiles || selectedFiles.length === 0) return;

        const formData = new FormData();
        Array.from(selectedFiles).forEach((file, index) => {
            formData.append(`images[${index}]`, file);
        });

        router.post(`/dashboard/portfolios/${portfolio.id}/images`, formData, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedFiles(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    const handleDeleteImage = (imageId: number) => {
        if (imageId === 0) return; // Can't delete main image from here
        if (confirm('Apakah Anda yakin ingin menghapus gambar ini?')) {
            router.delete(`/dashboard/portfolios/${portfolio.id}/images/${imageId}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout>
            <Head title={`Detail: ${portfolio.title}`} />

            <div className="container max-w-6xl mx-auto py-10 px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            href={index.url()}
                            className={buttonVariants({ variant: 'outline', size: 'sm' })}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">{portfolio.title}</h1>
                            <p className="text-muted-foreground">{portfolio.category}</p>
                        </div>
                    </div>
                    <Link
                        href={edit.url({ portfolio: portfolio.id })}
                        className={buttonVariants()}
                    >
                        Edit Portofolio
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Carousel Section */}
                    <Card className="border-gray-800 bg-gray-900">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <Images className="h-5 w-5" />
                                Carousel Gambar
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {allImages.length > 0 ? (
                                <div
                                    className="relative"
                                    onMouseEnter={() => setIsPaused(true)}
                                    onMouseLeave={() => setIsPaused(false)}
                                >
                                    {/* Main Carousel Image */}
                                    <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-800">
                                        <img
                                            src={`/storage/${allImages[currentSlide]?.image_path}`}
                                            alt={`Slide ${currentSlide + 1}`}
                                            className="h-full w-full object-cover transition-transform duration-500"
                                        />

                                        {/* Navigation Arrows */}
                                        {allImages.length > 1 && (
                                            <>
                                                <button
                                                    onClick={prevSlide}
                                                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70"
                                                >
                                                    <ChevronLeft className="h-6 w-6" />
                                                </button>
                                                <button
                                                    onClick={nextSlide}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70"
                                                >
                                                    <ChevronRight className="h-6 w-6" />
                                                </button>
                                            </>
                                        )}

                                        {/* Slide Counter */}
                                        <div className="absolute bottom-2 right-2 rounded bg-black/50 px-2 py-1 text-sm text-white">
                                            {currentSlide + 1} / {allImages.length}
                                        </div>
                                    </div>

                                    {/* Dots Navigation */}
                                    {allImages.length > 1 && (
                                        <div className="mt-4 flex justify-center gap-2">
                                            {allImages.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentSlide(index)}
                                                    className={`h-2 w-2 rounded-full transition-all ${index === currentSlide
                                                        ? 'bg-cyan-500 w-4'
                                                        : 'bg-gray-600 hover:bg-gray-500'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Auto-rotate indicator */}
                                    <div className="mt-2 text-center text-sm text-gray-400">
                                        {isPaused ? 'Hover - Pause' : 'Auto-rotate: 4s'}
                                    </div>
                                </div>
                            ) : (
                                <div className="aspect-video flex items-center justify-center rounded-lg bg-gray-800 text-gray-400">
                                    Tidak ada gambar
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Upload Section */}
                    <Card className="border-gray-800 bg-gray-900">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <Upload className="h-5 w-5" />
                                Upload Gambar Baru
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => setSelectedFiles(e.target.files)}
                                    className="block w-full text-sm text-gray-400
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-md file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-cyan-600 file:text-white
                                        hover:file:bg-cyan-500"
                                />
                                <p className="mt-2 text-sm text-gray-400">
                                    Pilih satu atau lebih gambar (max 2MB per gambar)
                                </p>
                            </div>

                            {selectedFiles && selectedFiles.length > 0 && (
                                <div className="rounded-md bg-gray-800 p-3">
                                    <p className="text-sm text-gray-300">
                                        {selectedFiles.length} gambar dipilih
                                    </p>
                                    <ul className="mt-2 text-xs text-gray-400">
                                        {Array.from(selectedFiles).map((file, index) => (
                                            <li key={index}>• {file.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <Button
                                onClick={handleUpload}
                                disabled={!selectedFiles || selectedFiles.length === 0 || processing}
                                className="w-full bg-cyan-600 hover:bg-cyan-500"
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                {processing ? 'Mengupload...' : 'Upload Gambar'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Grid Section */}
                <Card className="mt-8 border-gray-800 bg-gray-900">
                    <CardHeader>
                        <CardTitle className="text-white">
                            Semua Gambar ({allImages.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {allImages.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {allImages.map((image, index) => (
                                    <div
                                        key={image.id}
                                        className={`group relative aspect-square overflow-hidden rounded-lg bg-gray-800 cursor-pointer border-2 transition-all ${index === currentSlide
                                            ? 'border-cyan-500'
                                            : 'border-transparent hover:border-gray-600'
                                            }`}
                                        onClick={() => setCurrentSlide(index)}
                                    >
                                        <img
                                            src={`/storage/${image.image_path}`}
                                            alt={`Image ${index + 1}`}
                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                        />

                                        {/* Delete button (only for portfolio_images, not main image) */}
                                        {image.id !== 0 && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteImage(image.id);
                                                }}
                                                className="absolute top-2 right-2 rounded-full bg-red-600 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}

                                        {/* Main image badge */}
                                        {image.id === 0 && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-1">
                                                <span className="text-xs text-white">Gambar Utama</span>
                                            </div>
                                        )}

                                        {/* Index indicator */}
                                        <div className="absolute top-2 left-2 rounded bg-black/50 px-1.5 py-0.5 text-xs text-white">
                                            {index + 1}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-400 py-8">
                                Belum ada gambar. Upload gambar pertama Anda di atas.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Portfolio Info */}
                <Card className="mt-8 border-gray-800 bg-gray-900">
                    <CardHeader>
                        <CardTitle className="text-white">Informasi Portofolio</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400">Deskripsi</h3>
                            <p className="mt-1 text-gray-200 whitespace-pre-line">{portfolio.description}</p>
                        </div>

                        {portfolio.development_time && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400">Waktu Pengerjaan</h3>
                                <p className="mt-1 text-gray-200">{portfolio.development_time}</p>
                            </div>
                        )}

                        {portfolio.tools && portfolio.tools.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400">Tools</h3>
                                <div className="mt-1 flex flex-wrap gap-2">
                                    {portfolio.tools.map((tool, index) => (
                                        <span
                                            key={index}
                                            className="rounded border border-cyan-500/20 bg-cyan-900/20 px-2 py-1 text-sm text-cyan-300"
                                        >
                                            {tool}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4 pt-4">
                            {portfolio.project_url && (
                                <a
                                    href={portfolio.project_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={buttonVariants({ variant: 'outline', size: 'sm' })}
                                >
                                    Lihat Website
                                </a>
                            )}
                            {portfolio.github_url && (
                                <a
                                    href={portfolio.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={buttonVariants({ variant: 'outline', size: 'sm' })}
                                >
                                    GitHub
                                </a>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
