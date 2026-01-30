<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\PortfolioController;
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
    });

// Include additional settings routes
require __DIR__.'/settings.php';