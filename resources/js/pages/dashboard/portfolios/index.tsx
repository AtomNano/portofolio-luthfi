import AppLayout from '@/layouts/app-layout';
import portfolios from '@/routes/dashboard/portfolios';
import { Button, buttonVariants } from '@/components/ui/button';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye } from 'lucide-react';

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
};

type Props = {
    portfolios: Portfolio[];
};

export default function PortfolioIndex({ portfolios: portfolioData }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus portofolio ini?')) {
            destroy(portfolios.destroy.url({ portfolio: id }));
        }
    };

    return (
        <AppLayout>
            <Head title="Manajemen Portofolio" />

            <div className="container max-w-4xl mx-auto py-10">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Manajemen Portofolio</h1>
                    <Link href={portfolios.create.url()} className={buttonVariants()}>
                        Tambah Baru
                    </Link>
                </div>

                <div className="mt-8">
                    {portfolioData.length > 0 ? (
                        <ul className="space-y-4">
                            {portfolioData.map((portfolio) => (
                                <li
                                    key={portfolio.id}
                                    className="flex items-center justify-between rounded-lg border p-4"
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Thumbnail */}
                                        {(portfolio.image_path || portfolio.images?.length > 0) && (
                                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-800">
                                                <img
                                                    src={`/storage/${portfolio.image_path || portfolio.images[0]?.image_path}`}
                                                    alt={portfolio.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <h2 className="font-semibold">{portfolio.title}</h2>
                                            <p className="text-sm text-muted-foreground">
                                                {portfolio.category}
                                            </p>
                                            {portfolio.images?.length > 0 && (
                                                <p className="text-xs text-cyan-400">
                                                    {portfolio.images.length} gambar tambahan
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={portfolios.show.url({ portfolio: portfolio.id })}
                                            className={buttonVariants({ variant: 'outline', size: 'sm' })}
                                        >
                                            <Eye className="h-4 w-4 mr-1" />
                                            Detail
                                        </Link>
                                        <Link
                                            href={portfolios.edit.url({ portfolio: portfolio.id })}
                                            className={buttonVariants({ variant: 'outline', size: 'sm' })}
                                        >
                                            Edit
                                        </Link>
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(portfolio.id)}>
                                            Hapus
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center text-muted-foreground">
                            <p>Belum ada item portofolio. Mulai dengan membuat yang baru.</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

