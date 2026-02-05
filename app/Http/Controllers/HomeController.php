<?php

namespace App\Http\Controllers;

use App\Models\PageView;
use App\Models\Portfolio;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Laravel\Fortify\Features;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        // Track page view
        PageView::create([
            'page_type' => 'home',
            'ip_address' => $request->ip(),
        ]);

        return Inertia::render('welcome', [
            'portfolios' => Portfolio::with('images')->latest()->get(),
            'canRegister' => Features::enabled(Features::registration()),
            'owner' => \App\Models\User::first(),
        ]);
    }
}

