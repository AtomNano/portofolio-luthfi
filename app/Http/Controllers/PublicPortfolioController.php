<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use App\Models\User;
use App\Scopes\TenantScope;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Serves the public-facing portfolio page at /:username
 * No authentication required.
 */
class PublicPortfolioController extends Controller
{
    public function show(Request $request, string $username): Response
    {
        // Find the user by username (public access)
        $user = User::where('username', $username)->firstOrFail();

        if (! $user->tenant_id) {
            abort(404);
        }

        // Bypass tenant scope (we're loading a specific tenant without auth context)
        $tenant = Tenant::withoutGlobalScopes()
            ->with('plan')
            ->find($user->tenant_id);

        if (! $tenant || $tenant->status !== 'active') {
            abort(404);
        }

        // Load portfolios scoped to this tenant (published only)
        $portfolios = \App\Models\Portfolio::withoutGlobalScope(TenantScope::class)
            ->where('tenant_id', $user->tenant_id)
            ->where('is_published', true)
            ->with(['images' => fn ($q) => $q->orderBy('order')])
            ->orderBy('order')
            ->orderBy('created_at', 'desc')
            ->get();

        // Load experiences scoped to this tenant
        $experiences = \App\Models\Experience::withoutGlobalScope(TenantScope::class)
            ->where('tenant_id', $user->tenant_id)
            ->where('user_id', $user->id)
            ->orderBy('order')
            ->get();

        // Track page view
        $this->trackPageView($request, $user->tenant_id);

        return Inertia::render('welcome', [
            'owner' => [
                'name' => $user->name,
                'username' => $user->username,
                'avatar' => $user->avatar,
                'job_title' => $user->job_title,
                'bio' => $user->bio,
                'location' => $user->address,
                'email' => $user->email,
                'skills' => $user->skills ?? [],
                'soft_skills' => $user->soft_skills ?? [],
                'social_links' => $user->social_links ?? [],
            ],
            'portfolios' => $portfolios,
            'experiences' => $experiences,
            'tenant' => [
                'slug' => $tenant->slug,
                'primary_color' => $tenant->primary_color,
                'remove_branding' => $tenant->plan?->hasFeature('remove_branding') ?? false,
            ],
        ]);
    }

    private function trackPageView(Request $request, int $tenantId): void
    {
        try {
            \App\Models\PageView::withoutGlobalScope(TenantScope::class)->create([
                'tenant_id' => $tenantId,
                'page_type' => 'portfolio',
                'ip_address' => $request->ip(),
            ]);
        } catch (\Throwable) {
            // Never let analytics break the page
        }
    }
}
