import AppLayout from '@/layouts/app-layout'
import { Head, useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { InputError } from '@/components/input-error'
import portfolios from '@/routes/dashboard/portfolios'

const categories = [
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Graphic Design',
    'IT Support',
]

export default function PortfolioCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        category: categories[0],
        description: '',
        project_url: '',
        image: null as File | null,
    })

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        post(portfolios.store.url())
    }

    return (
        <AppLayout>
            <Head title="Tambah Portofolio Baru" />

            <div className="container max-w-2xl py-10">
                <h1 className="text-2xl font-bold">Tambah Portofolio Baru</h1>

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
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 sm:text-sm"
                        >
                            {categories.map((category) => (
                                <option key={category}>{category}</option>
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

                    <div>
                        <Label htmlFor="project_url">URL Proyek (Opsional)</Label>
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
                        <Label htmlFor="image">Gambar Proyek</Label>
                        <Input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('image', e.target.files ? e.target.files[0] : null)}
                        />
                        <InputError message={errors.image} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Portofolio'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    )
}
