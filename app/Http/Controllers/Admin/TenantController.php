<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TenantController extends Controller
{
    public function index()
    {
        $users = User::with(['tenant.plan', 'tenant.portfolios'])->latest()->paginate(15);

        $users->getCollection()->transform(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'joined_at' => $user->created_at->format('M d, Y'),
                'tenant_name' => $user->tenant?->name ?? 'N/A',
                'plan_name' => $user->tenant?->plan?->name ?? 'None',
                'plan_slug' => $user->tenant?->plan?->slug ?? 'free',
                'portfolios_count' => $user->tenant ? $user->tenant->portfolios->count() : 0,
            ];
        });

        return Inertia::render('admin/tenants', [
            'users' => $users,
        ]);
    }

    public function swapPlan(Request $request, User $user)
    {
        $validated = $request->validate([
            'plan' => ['required', 'string', 'in:free,pro'],
        ]);

        $plan = Plan::where('slug', $validated['plan'])->firstOrFail();

        if ($user->tenant) {
            $user->tenant->plan_id = $plan->id;
            $user->tenant->save();
        }

        return back()->with('success', "Paket pengguna {$user->name} berhasil diubah menjadi {$plan->name}.");
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'plan_slug' => ['required', 'string', 'in:free,pro'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $plan = Plan::where('slug', $validated['plan_slug'])->first();
        $tenant = Tenant::create([
            'name' => $user->name."'s Team",
            'slug' => Str::slug($user->name.'-'.Str::random(6)),
            'owner_id' => $user->id,
            'plan_id' => $plan ? $plan->id : null,
            'status' => 'active',
            'primary_color' => '#06b6d4',
        ]);

        $user->tenant_id = $tenant->id;
        $user->save();

        return back()->with('success', 'User successfully created.');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        if (! empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }
        $user->save();

        return back()->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Cannot delete yourself.');
        }

        if ($user->tenant) {
            $user->tenant->portfolios()->delete();
            $user->tenant->delete();
        }
        $user->delete();

        return back()->with('success', 'User entirely deleted from platform.');
    }
}
