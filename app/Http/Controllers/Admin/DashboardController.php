<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PageView;
use App\Models\Portfolio;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalUsers = User::count();
        $totalPortfolios = Portfolio::count();
        $totalViews = PageView::count();
        $proUsers = User::whereHas('tenant.plan', function ($q) {
            $q->where('slug', 'pro');
        })->count();

        // Pass some structured data to React
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'total_users' => $totalUsers,
                'total_portfolios' => $totalPortfolios,
                'total_views' => $totalViews,
                'pro_users' => $proUsers,
            ],
            'recent_users' => User::with('tenant.plan')->latest()->take(5)->get()->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'plan' => $user->tenant?->plan?->name ?? '-',
                    'domain' => $user->tenant?->custom_domain ?? $user->tenant?->slug,
                    'joined' => $user->created_at->diffForHumans(),
                ];
            }),
        ]);
    }
}
