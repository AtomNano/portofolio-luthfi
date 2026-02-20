<?php

namespace App\Http\Middleware;

use App\Models\Plan;
use App\Models\Tenant;
use App\Scopes\TenantScope;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * Identifies the current tenant from the authenticated user and
 * sets TenantScope so all tenant-aware model queries are automatically filtered.
 */
class IdentifyTenant
{
    public function handle(Request $request, Closure $next): mixed
    {
        $user = $request->user();

        if ($user) {
            // Auto-provision a tenant if the user lacks one (e.g. seeded admin)
            if (!$user->tenant_id) {
                $freePlan = Plan::firstOrCreate(
                    ['slug' => 'free'],
                    [
                        'name' => 'Free',
                        'description' => 'A free plan for everyone.',
                        'price_monthly' => 0,
                        'price_yearly' => 0,
                        'currency' => 'USD',
                        'features' => [],
                        'limits' => ['portfolios' => 3, 'skills' => 5],
                        'is_popular' => false,
                        'is_active' => true,
                    ]
                );

                $tenant = Tenant::create([
                    'name' => $user->name . "'s Team",
                    'slug' => Str::slug($user->name . '-' . Str::random(6)),
                    'owner_id' => $user->id,
                    'plan_id' => $freePlan->id,
                    'status' => 'active',
                    'primary_color' => '#06b6d4',
                ]);

                $user->tenant_id = $tenant->id;
                $user->save();
            }

            // Set the global tenant scope so all model queries are scoped to this tenant
            TenantScope::setTenant($user->tenant_id);

            // Make the tenant available on the request for controllers
            $tenant = Tenant::withoutGlobalScopes()->find($user->tenant_id);
            if ($tenant) {
                app()->instance('current_tenant', $tenant);
            }
        }

        $response = $next($request);

        // Clear after request completes (important for long-running workers)
        TenantScope::clear();

        return $response;
    }
}
