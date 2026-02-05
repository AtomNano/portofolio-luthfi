<?php

namespace App\Http\Controllers;

use App\Models\PageView;
use App\Models\Portfolio;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;

use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class PortfolioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('dashboard/portfolios/index', [
            'portfolios' => Portfolio::with('images')->latest()->get(),
        ]);
    }

    /**
     * Display the specified resource (public view).
     */
    public function show(Request $request, Portfolio $portfolio)
    {
        // Track page view
        PageView::create([
            'page_type' => 'portfolio',
            'portfolio_id' => $portfolio->id,
            'ip_address' => $request->ip(),
        ]);

        return Inertia::render('portfolios/show', [
            'portfolio' => $portfolio->load('images'),
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
        return Inertia::render('dashboard/portfolios/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Log::info('Attempting to store a new portfolio.', $request->all());

        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'category' => 'required|string|max:255',
                'description' => 'required|string',
                'project_url' => 'nullable|url',
                'image' => 'nullable|image|max:2048', // Main image optional now
                'images' => 'nullable|array', // Multiple images
                'images.*' => 'image|max:2048',
                'development_time' => 'nullable|string|max:255',
                'tools' => 'nullable|array',
                'tools.*' => 'string',
                'github_url' => 'nullable|url',
                'video_url' => 'nullable|string',
            ]);

            // Handle main image
            if ($request->hasFile('image')) {
                $validated['image_path'] = $request->file('image')->store('portfolios', 'public');
            }

            $portfolio = Portfolio::create([
                'title' => $validated['title'],
                'category' => $validated['category'],
                'description' => $validated['description'],
                'project_url' => $validated['project_url'] ?? null,
                'image_path' => $validated['image_path'] ?? null,
                'development_time' => $validated['development_time'] ?? null,
                'tools' => $validated['tools'] ?? null,
                'github_url' => $validated['github_url'] ?? null,
                'video_url' => $validated['video_url'] ?? null,
            ]);

            // Handle multiple images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $image) {
                    $path = $image->store('portfolios', 'public');
                    $portfolio->images()->create([
                        'image_path' => $path,
                        'order' => $index,
                    ]);
                }
            }

            Log::info('Portfolio stored successfully.');

            return Redirect::route('dashboard.portfolios.index');
        } catch (ValidationException $e) {
            Log::error('Validation failed.', $e->errors());
            throw $e;
        } catch (\Exception $e) {
            Log::error('An unexpected error occurred.', ['message' => $e->getMessage()]);
            return Redirect::back()->withErrors(['error' => 'Gagal menyimpan portofolio. Silakan coba lagi.']);
        }
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
    public function update(Request $request, Portfolio $portfolio)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'project_url' => 'nullable|url',
            'image' => 'nullable|image|max:2048',
            'images' => 'nullable|array',
            'images.*' => 'image|max:2048',
            'development_time' => 'nullable|string|max:255',
            'tools' => 'nullable|array',
            'tools.*' => 'string',
            'github_url' => 'nullable|url',
            'video_url' => 'nullable|string',
        ]);

        if ($request->hasFile('image')) {
            if ($portfolio->image_path) {
                Storage::disk('public')->delete($portfolio->image_path);
            }
            $validated['image_path'] = $request->file('image')->store('portfolios', 'public');
        }

        $portfolio->update($validated);

        // Handle new images
        if ($request->hasFile('images')) {
            $maxOrder = $portfolio->images()->max('order') ?? -1;
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('portfolios', 'public');
                $portfolio->images()->create([
                    'image_path' => $path,
                    'order' => $maxOrder + $index + 1,
                ]);
            }
        }

        return Redirect::route('dashboard.portfolios.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Portfolio $portfolio)
    {
        // Delete main image
        if ($portfolio->image_path) {
            Storage::disk('public')->delete($portfolio->image_path);
        }

        // Delete all associated images
        foreach ($portfolio->images as $image) {
            if ($image->image_path) {
                Storage::disk('public')->delete($image->image_path);
            }
        }

        $portfolio->delete();

        return Redirect::route('dashboard.portfolios.index');
    }

    /**
     * Get dashboard statistics.
     */
    public function statistics()
    {
        $totalHomeViews = PageView::where('page_type', 'home')->count();
        $totalPortfolioViews = PageView::where('page_type', 'portfolio')->count();

        $portfolioStats = Portfolio::withCount('pageViews')
            ->orderByDesc('page_views_count')
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'title' => $p->title,
                'views' => $p->page_views_count,
            ]);

        return response()->json([
            'total_home_views' => $totalHomeViews,
            'total_portfolio_views' => $totalPortfolioViews,
            'portfolio_stats' => $portfolioStats,
        ]);
    }
}

