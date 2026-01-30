import AppLayout from '@/layouts/app-layout';
import portfolios from '@/routes/dashboard/portfolios'; // Corrected import
import { Button } from '@/components/ui/button';
import { Head, Link, useForm } from '@inertiajs/react';

type Portfolio = {
    id: number;
    title: string;
    category: string;
    description: string;
    project_url: string;
    image_path: string;
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

            <div className="container py-10">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Manajemen Portofolio</h1>
                    <Button asChild>
                        <Link href={portfolios.create.url()}>Tambah Baru</Link>
                    </Button>
                </div>

                <div className="mt-8">
                    {portfolioData.length > 0 ? (
                        <ul className="space-y-4">
                            {portfolioData.map((portfolio) => (
                                <li
                                    key={portfolio.id}
                                    className="flex items-center justify-between rounded-lg border p-4"
                                >
                                    <div>
                                        <h2 className="font-semibold">{portfolio.title}</h2>
                                        <p className="text-sm text-muted-foreground">
                                            {portfolio.category}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={portfolios.edit.url({ portfolio: portfolio.id })}>Edit</Link>
                                        </Button>
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
