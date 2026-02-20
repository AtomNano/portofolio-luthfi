import { usePage } from '@inertiajs/react';
import type { SharedData, Tenant } from '@/types';

/**
 * Returns the current authenticated user's tenant data from Inertia shared props.
 * Returns null if the user is not logged in or has no tenant yet.
 */
export function useTenant(): Tenant | null {
    const { tenant } = usePage<SharedData>().props;
    return tenant ?? null;
}

/**
 * Returns feature/limit helpers for the current tenant's plan.
 */
export function usePlanFeatures() {
    const tenant = useTenant();
    const plan = tenant?.plan ?? null;

    return {
        plan,
        isFree: plan?.is_free ?? true,
        isPro: plan?.slug === 'pro',
        hasFeature: (feature: string): boolean => {
            return Boolean(plan?.features?.[feature]);
        },
        getLimit: (key: string): number | null => {
            return (plan?.limits?.[key] as number | null) ?? null;
        },
        withinLimit: (key: string, current: number): boolean => {
            const limit = (plan?.limits?.[key] as number | null) ?? null;
            if (limit === null) return true; // null = unlimited
            return current < limit;
        },
    };
}

/**
 * Returns subscription-related helpers for the current tenant.
 */
export function useSubscription() {
    const tenant = useTenant();

    return {
        isActive: tenant?.subscription_status === 'active',
        isTenant: tenant !== null,
        needsUpgrade: tenant?.plan?.is_free ?? false,
    };
}

/**
 * Returns a Tailwind-compatible CSS var for the tenant's primary color.
 * Use as style prop: style={tenantColor()}
 */
export function useTenantColor(): Record<string, string> {
    const tenant = useTenant();
    return tenant ? { '--color-primary': tenant.primary_color } : {};
}
