import AppLayout from '@/layouts/app-layout';
import dashboard from '@/routes/dashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { BreadcrumbItem, SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { PlusCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard.index.url(),
    },
];

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Selamat Datang, {auth.user.name}!</CardTitle>
                        <CardDescription>
                            Ini adalah pusat kendali untuk website portofolio Anda.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Mulai kelola konten Anda menggunakan tautan di bawah ini.</p>
                        <div className="mt-4">
                            <Button asChild>
                                <Link href={dashboard.portfolios.index.url()}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Kelola Portofolio
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
