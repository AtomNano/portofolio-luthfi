<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    /**
     * Display the settings page.
     */
    public function index(): Response
    {
        $tenant = Auth::user()->tenant;
        $tenant->load('plan');

        return Inertia::render('dashboard/settings', [
            'tenantData' => [
                'id' => $tenant->id,
                'name' => $tenant->name,
                'slug' => $tenant->slug,
                'custom_domain' => $tenant->custom_domain,
                'primary_color' => $tenant->primary_color,
                'has_custom_domain_feature' => $tenant->plan?->hasFeature('custom_domain') ?? false,
            ],
        ]);
    }

    /**
     * Update tenant settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $tenant = Auth::user()->tenant;
        $hasCustomDomainFeature = $tenant->plan?->hasFeature('custom_domain') ?? false;

        $validated = $request->validate([
            'primary_color' => ['nullable', 'string', 'max:7', 'starts_with:#'],
            'custom_domain' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('tenants')->ignore($tenant->id),
            ],
        ]);

        $tenant->primary_color = $validated['primary_color'] ?? $tenant->primary_color;

        if ($hasCustomDomainFeature && array_key_exists('custom_domain', $validated)) {
            $domain = preg_replace('/^https?:\/\//', '', $validated['custom_domain']);
            $domain = preg_replace('/\/$/', '', $domain); // Remove trailing slash
            $tenant->custom_domain = empty($domain) ? null : strtolower($domain);
        }

        $tenant->save();

        return redirect()->back()->with('success', 'Settings updated successfully.');
    }
}
