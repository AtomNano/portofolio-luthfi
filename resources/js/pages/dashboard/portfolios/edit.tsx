import AppLayout from '@/layouts/app-layout'
import { Head, useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import InputError from '@/components/input-error'
import portfolios from '@/routes/dashboard/portfolios';
import { PORTFOLIO_CATEGORIES } from '@/constants/portfolio'
import { parseCommaSeparated, joinWithComma } from '@/utils/format'

type Portfolio = {
    id: number;
    title: string;
    category: string;
    description: string;
    project_url: string;
    image_path: string;
    development_time: string | null;
    tools: string[] | null;
    github_url: string | null;
    video_url: string | null;
};

type Props = {
    portfolio: Portfolio;
};

export default function PortfolioEdit({ portfolio }: Props) {
    const { data, setData, post, processing, errors, transform } = useForm({
        title: portfolio.title,
        category: portfolio.category,
        description: portfolio.description,
        project_url: portfolio.project_url || '',
        development_time: portfolio.development_time || '',
        tools: portfolio.tools ? joinWithComma(portfolio.tools) : '',
        github_url: portfolio.github_url || '',
        video_url: portfolio.video_url || '',
        image: null as File | null,
        _method: 'PUT',
    });

    transform((data) => ({
        ...data,
        tools: parseCommaSeparated(data.tools),
    }))

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(portfolios.update.url({ portfolio: portfolio.id }));
    }

    return (
        <AppLayout>
            <Head title={`Edit Portofolio: ${portfolio.title}`} />

            <div className="container max-w-2xl mx-auto py-10">
                <h1 className="text-2xl font-bold">Edit Portofolio</h1>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                        <Label htmlFor="title">Judul</Label>
                        <Input
                            id="title"
                            name="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            required
                        />
                        <InputError message={errors.title} className="mt-2" />
                    </div>

                    <div>
                        <Label htmlFor="category">Kategori</Label>
                        <select
                            id="category"
                            name="category"
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 py-2 pl-3 pr-10 text-base text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:text-sm"
                        >
                            {PORTFOLIO_CATEGORIES.map((category) => (
                                <option key={category} className="bg-gray-800">{category}</option>
                            ))}
                        </select>
                        <InputError message={errors.category} className="mt-2" />
                    </div>

                    <div>
                        <Label htmlFor="description">Deskripsi</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={4}
                            required
                        />
                        <InputError message={errors.description} className="mt-2" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="development_time">Waktu Pengerjaan</Label>
                            <Input
                                id="development_time"
                                name="development_time"
                                placeholder="Contoh: 2 Minggu"
                                value={data.development_time}
                                onChange={(e) => setData('development_time', e.target.value)}
                            />
                            <InputError message={errors.development_time} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="tools">Tools (Pisahkan dengan koma)</Label>
                            <Input
                                id="tools"
                                name="tools"
                                placeholder="React, Laravel, Tailwind"
                                value={data.tools}
                                onChange={(e) => setData('tools', e.target.value)}
                            />
                            <InputError message={errors.tools} className="mt-2" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="project_url">URL Domain (Opsional)</Label>
                            <Input
                                id="project_url"
                                name="project_url"
                                type="url"
                                value={data.project_url}
                                onChange={(e) => setData('project_url', e.target.value)}
                            />
                            <InputError message={errors.project_url} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="github_url">URL GitHub (Opsional)</Label>
                            <Input
                                id="github_url"
                                name="github_url"
                                type="url"
                                value={data.github_url}
                                onChange={(e) => setData('github_url', e.target.value)}
                            />
                            <InputError message={errors.github_url} className="mt-2" />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="video_url">URL Video (Opsional)</Label>
                        <Input
                            id="video_url"
                            name="video_url"
                            placeholder="Contoh: https://youtube.com/watch?v=..."
                            value={data.video_url}
                            onChange={(e) => setData('video_url', e.target.value)}
                        />
                        <InputError message={errors.video_url} className="mt-2" />
                    </div>

                    <div>
                        <Label htmlFor="image">Gambar Proyek</Label>
                        <input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('image', e.target.files ? e.target.files[0] : null)}
                            className="mt-1 block w-full text-sm text-gray-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-cyan-600 file:text-white
                                hover:file:bg-cyan-500
                                cursor-pointer"
                        />
                        {portfolio.image_path && (
                            <p className="mt-2 text-sm text-gray-500">
                                Gambar saat ini: <a href={`/storage/${portfolio.image_path}`} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Lihat Gambar</a>
                            </p>
                        )}
                        <InputError message={errors.image} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}