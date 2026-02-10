<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\PortfolioImageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route for the public-facing welcome page
Route::get('/', [HomeController::class, 'index'])->name('home');

// Authenticated and verified routes for the dashboard
Route::middleware(['auth', 'verified'])
    ->prefix('dashboard')
    ->name('dashboard.')
    ->group(function () {
        // Main dashboard view
        Route::get('/', function () {
            return Inertia::render('dashboard');
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

        // Statistics API
        Route::get('api/statistics', [PortfolioController::class, 'statistics'])
            ->name('api.statistics');
    });

// Public portfolio route
Route::get('/portfolios/{portfolio}', [PortfolioController::class, 'show'])->name('portfolios.show');

// Google OAuth routes
Route::get('auth/google', [\App\Http\Controllers\SocialAuthController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('auth/google/callback', [\App\Http\Controllers\SocialAuthController::class, 'handleGoogleCallback']);

// Include additional settings routes
require __DIR__ . '/settings.php';