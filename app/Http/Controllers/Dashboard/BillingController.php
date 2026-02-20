<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class BillingController extends Controller
{
    /**
     * Display the billing and subscription page.
     */
    public function index(): Response
    {
        $tenant = Auth::user()->tenant;

        $currentPlan = $tenant->plan;

        $availablePlans = Plan::where('is_active', true)
            ->orderBy('display_order')
            ->get();

        return Inertia::render('dashboard/billing', [
            'tenant' => $tenant,
            'currentPlan' => $currentPlan,
            'availablePlans' => $availablePlans,
        ]);
    }

    /**
     * Handle the upgrade request to a specific plan.
     */
    public function upgrade(Request $request, Plan $plan): RedirectResponse
    {
        $tenant = Auth::user()->tenant;

        // Basic check: Don't downgrade or upgrade to the same plan
        if ($tenant->plan_id === $plan->id) {
            return back()->with('error', 'You are already on this plan.');
        }

        // TODO: In a real Stripe/Midtrans integration, we would create a checkout session
        // For Phase 3, we simply assign the plan to the tenant immediately to test the SAAS foundation.

        $tenant->update([
            'plan_id' => $plan->id,
            'subscription_status' => 'active',
            // Assign next month for pro plan dummy status
            'subscription_ends_at' => $plan->price_monthly > 0 ? now()->addMonth() : null,
        ]);

        // Create an internal subscription record (optional dummy)
        $tenant->subscription()->create([
            'plan_id' => $plan->id,
            'status' => 'active',
            'starts_at' => now(),
            'ends_at' => $plan->price_monthly > 0 ? now()->addMonth() : null,
        ]);

        return back()->with('success', 'Successfully upgraded to '.$plan->name.' plan!');
    }
}
