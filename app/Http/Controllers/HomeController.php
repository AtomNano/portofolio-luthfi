<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(Request $request): Response
    {
        // Serve the SaaS Landing Page with featured portfolios
        $latestPortfolios = Portfolio::with(['user', 'images'])
            ->where('is_published', true)
            ->latest()
            ->limit(6)
            ->get();

        return Inertia::render('landing', [
            'portfolios' => $latestPortfolios,
        ]);
    }
}
