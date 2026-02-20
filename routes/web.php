<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\PortfolioImageController;
use App\Http\Controllers\PublicPortfolioController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route for the public-facing welcome page (owner's own portfolio)
Route::middleware(['throttle:page-views'])->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');
});

// Redirect /dashboard to /dashboard/
Route::redirect('/dashboard', '/dashboard/', 301)->name('dashboard');

// Authenticated and verified routes for the dashboard
Route::middleware(['auth', 'verified', 'identify.tenant'])
    ->prefix('dashboard')
    ->name('dashboard.')
    ->group(function () {
        // Main dashboard view

        Route::get('/', function (\App\Actions\GetDashboardStatisticsAction $action) {
            return Inertia::render('dashboard', [
                'statistics' => Inertia::defer(fn () => $action->handle()),
            ]);
        })->name('index');

        // Portfolio management resource routes (excluding 'show')
        Route::resource('portfolios', PortfolioController::class)->except(['show']);

        // Portfolio detail view in dashboard (for image management)
        Route::get('portfolios/{portfolio}/detail', [PortfolioController::class, 'dashboardShow'])
            ->name('portfolios.show');

        // Portfolio image management
        Route::post('portfolios/{portfolio}/images', [PortfolioImageController::class, 'store'])
            ->name('portfolios.images.store');
        Route::delete('portfolios/{portfolio}/images/{image}', [PortfolioImageController::class, 'destroy'])
            ->name('portfolios.images.destroy');
        Route::post('portfolios/{portfolio}/images/reorder', [PortfolioImageController::class, 'reorder'])
            ->name('portfolios.images.reorder');

        // Portfolio reordering
        Route::post('portfolios/reorder', [PortfolioController::class, 'reorder'])
            ->name('portfolios.reorder');

        // Statistic API
        Route::get('api/statistics', [PortfolioController::class, 'statistics'])
            ->name('api.statistics');

        // Experience Resource
        Route::put('experiences/reorder', [\App\Http\Controllers\ExperienceController::class, 'reorder'])
            ->name('experiences.reorder');
        Route::resource('experiences', \App\Http\Controllers\ExperienceController::class)
            ->only(['store', 'update', 'destroy']);
        Route::get('experiences', [\App\Http\Controllers\ExperienceController::class, 'dashboardIndex'])
            ->name('experiences.index');

        // Skills Management
        Route::get('skills', [\App\Http\Controllers\Dashboard\SkillController::class, 'index'])
            ->name('skills.index');
        Route::patch('skills', [\App\Http\Controllers\Dashboard\SkillController::class, 'update'])
            ->name('skills.update');

        // Billing & Subscription
        Route::get('billing', [\App\Http\Controllers\Dashboard\BillingController::class, 'index'])
            ->name('billing.index');
        Route::post('billing/upgrade/{plan:slug}', [\App\Http\Controllers\Dashboard\BillingController::class, 'upgrade'])
            ->name('billing.upgrade');

        // Tenant Settings (Domain & Branding)
        Route::get('settings', [\App\Http\Controllers\Dashboard\SettingsController::class, 'index'])
            ->name('settings.index');
        Route::patch('settings', [\App\Http\Controllers\Dashboard\SettingsController::class, 'update'])
            ->name('settings.update');
    });

// Public portfolio route by path (existing)
Route::middleware(['throttle:page-views'])->group(function () {
    Route::get('/portfolios/{portfolio}', [PortfolioController::class, 'show'])->name('portfolios.show');
});
Route::get('/experience', [\App\Http\Controllers\ExperienceController::class, 'index'])->name('experience.index');

// Google OAuth routes
Route::get('auth/google', [\App\Http\Controllers\SocialAuthController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('auth/google/callback', [\App\Http\Controllers\SocialAuthController::class, 'handleGoogleCallback']);

// Include additional settings routes
require __DIR__.'/settings.php';

// ── Webhooks (Agnostic Payment Receivers) ──
Route::post('webhooks/payment', [\App\Http\Controllers\Webhook\PaymentWebhookController::class, 'handle'])->name('webhooks.payment');

// ── Superadmin Routes ──
Route::middleware(['auth', 'verified', 'is_admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
        Route::get('/tenants', [\App\Http\Controllers\Admin\TenantController::class, 'index'])->name('tenants.index');
        Route::get('/transactions', [\App\Http\Controllers\Admin\TransactionController::class, 'index'])->name('transactions.index');
        Route::get('/portfolios', [\App\Http\Controllers\Admin\PortfolioController::class, 'index'])->name('portfolios.index');
        Route::delete('/portfolios/{portfolio}', [\App\Http\Controllers\Admin\PortfolioController::class, 'destroy'])->name('portfolios.destroy');
        Route::post('/tenants', [\App\Http\Controllers\Admin\TenantController::class, 'store'])->name('tenants.store');
        Route::put('/tenants/{user}', [\App\Http\Controllers\Admin\TenantController::class, 'update'])->name('tenants.update');
        Route::delete('/tenants/{user}', [\App\Http\Controllers\Admin\TenantController::class, 'destroy'])->name('tenants.destroy');
        Route::patch('/tenants/{user}/plan', [\App\Http\Controllers\Admin\TenantController::class, 'swapPlan'])->name('tenants.plan');
    });

// ── Public portfolio by username (:username must come LAST to avoid conflicts) ──
Route::middleware(['throttle:page-views'])->group(function () {
    Route::get('/{username}', [PublicPortfolioController::class, 'show'])
        ->name('portfolio.public')
        ->where('username', '^(?!dashboard|login|register|logout|api|auth|admin|settings|up|portfolios|experience)[a-z0-9_-]+$');
});
