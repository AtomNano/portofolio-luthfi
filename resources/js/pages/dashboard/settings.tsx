import { Head, useForm, Link } from '@inertiajs/react';
import { Settings as SettingsIcon, Globe, Palette, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePageEffects } from '@/hooks/use-page-effects';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Settings', href: '/dashboard/settings' },
];

interface TenantData {
    id: number;
    name: string;
    slug: string;
    custom_domain: string | null;
    primary_color: string | null;
    has_custom_domain_feature: boolean;
}

export default function Settings({ tenantData }: { tenantData: TenantData }) {
    usePageEffects('Settings');

    const { data, setData, patch, processing, errors } = useForm({
        custom_domain: tenantData.custom_domain || '',
        primary_color: tenantData.primary_color || '#0ea5e9',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch('/dashboard/settings', {
            preserveScroll: true,
            onSuccess: () => {
                alert('Pengaturan berhasil diperbarui!');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Settings" />
            
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-hidden rounded-xl p-4 md:p-8 lg:p-12">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <SettingsIcon className="h-6 w-6 text-primary" />
                        Pengaturan Portfolio
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Kelola domain kustom dan tema portofolio Anda.
                    </p>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    
                    {/* Domain Settings */}
                    <Card className="glass relative overflow-hidden">
                        {!tenantData.has_custom_domain_feature && (
                            <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
                                <Lock className="h-10 w-10 text-muted-foreground mb-3" />
                                <h3 className="text-lg font-semibold">Fitur Pro</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Gunakan domain kustom Anda sendiri (contoh: portofolioku.com) dengan upgrade ke paket Pro.
                                </p>
                                <Button asChild variant="default">
                                    <Link href="/dashboard/billing">
                                        Upgrade ke Pro
                                    </Link>
                                </Button>
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5 text-primary" />
                                Custom Domain
                            </CardTitle>
                            <CardDescription>
                                Hubungkan portofolio Anda ke nama domain milik Anda.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 relative">
                            <div className="space-y-2">
                                <Label htmlFor="custom_domain">Domain Kustom</Label>
                                <Input
                                    id="custom_domain"
                                    placeholder="www.portofoliosaya.com"
                                    value={data.custom_domain}
                                    onChange={(e) => setData('custom_domain', e.target.value)}
                                    disabled={!tenantData.has_custom_domain_feature || processing}
                                />
                                {errors.custom_domain && (
                                    <p className="text-sm font-medium text-destructive">{errors.custom_domain}</p>
                                )}
                            </div>
                            {tenantData.custom_domain && tenantData.has_custom_domain_feature && (
                                <div className="bg-primary/10 border-primary/20 flex flex-col items-start gap-3 rounded-lg border p-3">
                                    <div className="flex gap-2">
                                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                      <p className="font-semibold text-foreground">Domain Tersimpan</p>
                                    </div>
                                    <div className="text-sm">
                                        <p className="text-muted-foreground mt-1">
                                            Arahkan CNAME Record dari <strong>{tenantData.custom_domain}</strong> ke <strong>cname.portfolify.app</strong> pada pengaturan DNS domain Anda agar portofolio ini dapat diakses.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Branding Settings */}
                    <Card className="glass">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Palette className="h-5 w-5 text-primary" />
                                Tema & Warna
                            </CardTitle>
                            <CardDescription>
                                Sesuaikan tampilan identitas warna utama portofolio Anda.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="primary_color">Warna Utama (Hex)</Label>
                                <div className="flex gap-3">
                                    <Input
                                        id="primary_color_picker"
                                        type="color"
                                        className="h-10 w-16 p-1 cursor-pointer"
                                        value={data.primary_color}
                                        onChange={(e) => setData('primary_color', e.target.value)}
                                        disabled={processing}
                                    />
                                    <Input
                                        id="primary_color"
                                        type="text"
                                        placeholder="#0ea5e9"
                                        value={data.primary_color}
                                        onChange={(e) => setData('primary_color', e.target.value)}
                                        disabled={processing}
                                        className="font-mono"
                                    />
                                </div>
                                {errors.primary_color && (
                                    <p className="text-sm font-medium text-destructive">{errors.primary_color}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Warna ini akan digunakan pada tombol dan aksen grafis di portofolio publik Anda.
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/50 justify-end rounded-b-xl border-t p-4 mt-6">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                            </Button>
                        </CardFooter>
                    </Card>

                </form>
            </div>
        </AppLayout>
    );
}
