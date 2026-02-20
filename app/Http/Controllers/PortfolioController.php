<?php

namespace App\Http\Controllers;

use App\Actions\GetDashboardStatisticsAction;
use App\Actions\Portfolio\DeletePortfolioAction;
use App\Actions\Portfolio\StorePortfolioAction;
use App\Actions\Portfolio\UpdatePortfolioAction;
use App\Actions\TrackPageViewAction;
use App\Http\Requests\ReorderPortfoliosRequest;
use App\Http\Requests\StorePortfolioRequest;
use App\Http\Requests\UpdatePortfolioRequest;
use App\Models\Portfolio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tenant = auth()->user()->tenant;
        $maxPortfolios = $tenant->plan->limits['max_portfolios'] ?? null;
        $currentCount = $tenant->portfolios()->count();
        $canAdd = $maxPortfolios === null || $currentCount < $maxPortfolios;

        return Inertia::render('dashboard/portfolios/index', [
            'portfolios' => Portfolio::with('images')->orderBy('order')->get(),
            'can_add_portfolio' => $canAdd,
            'max_portfolios' => $maxPortfolios,
            'current_count' => $currentCount,
        ]);
    }

    /**
     * Display the specified resource (public view).
     */
    public function show(Request $request, Portfolio $portfolio, TrackPageViewAction $trackPageView)
    {
        $trackPageView->handle($request, 'portfolio', $portfolio->id);

        return Inertia::render('portfolios/show', [
            'portfolio' => $portfolio->load('images'),
            'related_portfolios' => Portfolio::where('id', '!=', $portfolio->id)
                ->inRandomOrder()
                ->take(5)
                ->get(),
        ]);
    }

    /**
     * Display the specified resource in dashboard (for image management).
     */
    public function dashboardShow(Portfolio $portfolio)
    {
        return Inertia::render('dashboard/portfolios/show', [
            'portfolio' => $portfolio->load('images'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $tenant = auth()->user()->tenant;
        $maxPortfolios = $tenant->plan->limits['max_portfolios'] ?? null;

        if ($maxPortfolios !== null && $tenant->portfolios()->count() >= $maxPortfolios) {
            return Redirect::route('dashboard.portfolios.index')
                ->with('error', 'Limit tercapai. Silakan upgrade paket Anda untuk menambah portfolio baru.');
        }

        return Inertia::render('dashboard/portfolios/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePortfolioRequest $request, StorePortfolioAction $action)
    {
        $tenant = auth()->user()->tenant;
        $maxPortfolios = $tenant->plan->limits['max_portfolios'] ?? null;

        if ($maxPortfolios !== null && $tenant->portfolios()->count() >= $maxPortfolios) {
            return Redirect::route('dashboard.portfolios.index')
                ->with('error', 'Limit tercapai. Silakan upgrade paket Anda untuk menambah portfolio baru.');
        }

        $validated = $request->validated();
        $mainImage = $request->file('image');
        $additionalImages = $request->file('images', []) ?? [];

        // Fallback: If no dedicated main image, use the first one from the gallery
        if (! $mainImage && ! empty($additionalImages)) {
            $mainImage = array_shift($additionalImages);
        }

        $action->handle(
            $validated,
            $mainImage,
            $additionalImages,
        );

        return Redirect::route('dashboard.portfolios.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Portfolio $portfolio)
    {
        return Inertia::render('dashboard/portfolios/edit', [
            'portfolio' => $portfolio->load('images'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePortfolioRequest $request, Portfolio $portfolio, UpdatePortfolioAction $action)
    {
        $action->handle(
            $portfolio,
            $request->validated(),
            $request->file('image'),
            $request->file('images', []),
        );

        return Redirect::route('dashboard.portfolios.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Portfolio $portfolio, DeletePortfolioAction $action)
    {
        $action->handle($portfolio);

        return Redirect::route('dashboard.portfolios.index');
    }

    /**
     * Reorder portfolios.
     */
    public function reorder(ReorderPortfoliosRequest $request)
    {
        foreach ($request->validated()['portfolios'] as $portfolioData) {
            Portfolio::where('id', $portfolioData['id'])->update(['order' => $portfolioData['order']]);
        }

        return Redirect::back();
    }

    /**
     * Get dashboard statistics.
     */
    public function statistics(GetDashboardStatisticsAction $action)
    {
        return response()->json($action->handle());
    }
}
