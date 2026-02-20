import { Head, router } from '@inertiajs/react';
import { Check, X, CreditCard, Zap } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Plan, Tenant } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Billing & Subscriptions',
        href: '/dashboard/billing',
    },
];

interface Props {
    tenant: Tenant;
    currentPlan: Plan | null;
    availablePlans: Plan[];
}

export default function Billing({ tenant, currentPlan, availablePlans }: Props) {
    const [processingId, setProcessingId] = useState<number | null>(null);

    const handleUpgrade = (plan: Plan) => {
        setProcessingId(plan.id);
        router.post(`/dashboard/billing/upgrade/${plan.slug}`, {}, {
            preserveScroll: true,
            onFinish: () => setProcessingId(null),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Billing & Subscriptions" />
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 p-6">
                
                {/* Current Plan Overview */}
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold">Your Subscription</h2>
                    <p className="text-muted-foreground">Manage your billing and choose the plan that is right for you.</p>
                </div>

                <Card className="border-border bg-card">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl">Current Plan</CardTitle>
                            <CardDescription>
                                You are currently on the <strong className="text-primary">{currentPlan?.name || 'Free'}</strong> plan.
                            </CardDescription>
                        </div>
                        {currentPlan?.slug === 'pro' && (
                            <div className="rounded-full bg-cyan-500/20 px-4 py-1.5 text-sm font-semibold text-cyan-400 border border-cyan-500/30 flex items-center gap-2">
                                <Zap className="h-4 w-4" />
                                Active Pro
                            </div>
                        )}
                    </CardHeader>
                    {tenant.subscription_ends_at && (
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Your subscription cycle ends on: {new Date(tenant.subscription_ends_at).toLocaleDateString()}
                            </p>
                        </CardContent>
                    )}
                </Card>

                {/* Pricing Table */}
                <div className="mt-8">
                    <h3 className="mb-6 text-xl font-bold">Available Plans</h3>
                    <div className="grid gap-8 md:grid-cols-2">
                        {availablePlans.map((plan) => {
                            const isCurrentPlan = currentPlan?.id === plan.id;
                            
                            return (
                                <Card 
                                    key={plan.id} 
                                    className={`relative overflow-hidden flex flex-col transition-all ${
                                        isCurrentPlan 
                                            ? 'border-primary/50 bg-primary/5 shadow-lg shadow-primary/10' 
                                            : 'border-border bg-card hover:border-primary/30'
                                    }`}
                                >
                                    <CardHeader>
                                        <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                        <CardDescription>{plan.slug === 'pro' ? 'For serious professionals' : 'Perfect for getting started'}</CardDescription>
                                        <div className="mt-4 text-4xl font-bold flex items-baseline gap-1">
                                            {plan.name === 'Free' ? 'Rp 0' : 'Rp 49.000'}
                                            <span className="text-lg font-normal text-muted-foreground">/mo</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <ul className="space-y-4 text-sm mt-4">
                                            <li className="flex items-center gap-3">
                                                <Check className="h-5 w-5 text-primary" />
                                                <span>{plan.limits?.max_portfolios ? `${plan.limits.max_portfolios} Portfolios limit` : 'Unlimited Portfolios'}</span>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <Check className="h-5 w-5 text-primary" />
                                                <span>{(plan.limits?.max_storage_mb || 0) / 1024 > 1 ? `${(plan.limits?.max_storage_mb || 0) / 1024}GB Storage` : `${plan.limits?.max_storage_mb}MB Storage`}</span>
                                            </li>
                                            
                                            <li className="flex items-center gap-3">
                                                {plan.features?.custom_domain ? (
                                                    <Check className="h-5 w-5 text-primary" />
                                                ) : (
                                                    <X className="h-5 w-5 text-muted-foreground/50" />
                                                )}
                                                <span className={!plan.features?.custom_domain ? 'text-muted-foreground/80' : ''}>Custom Domain</span>
                                            </li>
                                            
                                            <li className="flex items-center gap-3">
                                                {plan.features?.analytics ? (
                                                    <Check className="h-5 w-5 text-primary" />
                                                ) : (
                                                    <X className="h-5 w-5 text-muted-foreground/50" />
                                                )}
                                                <span className={!plan.features?.analytics ? 'text-muted-foreground/80' : ''}>Advanced Analytics</span>
                                            </li>
                                        </ul>
                                    </CardContent>
                                    <CardFooter className="pt-6">
                                        <Button 
                                            className="w-full" 
                                            variant={isCurrentPlan ? "outline" : "default"}
                                            disabled={isCurrentPlan || processingId === plan.id}
                                            onClick={() => handleUpgrade(plan)}
                                        >
                                            {isCurrentPlan 
                                                ? 'Current Plan' 
                                                : processingId === plan.id 
                                                    ? 'Processing...' 
                                                    : plan.slug === 'pro' ? 'Upgrade to Pro' : 'Downgrade to Free'}
                                            {!isCurrentPlan && <CreditCard className="ml-2 h-4 w-4" />}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
