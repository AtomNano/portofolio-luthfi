<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage; // Import the Storage facade

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
            'portfolios' => Portfolio::latest()->get(),
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
                'image' => 'required|image|max:2048', // Max 2MB
            ]);

            if ($request->hasFile('image')) {
                $validated['image_path'] = $request->file('image')->store('portfolios', 'public');
            }

            Portfolio::create([
                'title' => $validated['title'],
                'category' => $validated['category'],
                'description' => $validated['description'],
                'project_url' => $validated['project_url'],
                'image_path' => $validated['image_path'],
            ]);

            Log::info('Portfolio stored successfully.');

            return Redirect::route('dashboard.portfolios.index');
        } catch (ValidationException $e) {
            Log::error('Validation failed.', $e->errors());
            // Re-throw the exception to let Inertia handle displaying errors
            throw $e;
        } catch (\Exception $e) {
            Log::error('An unexpected error occurred.', ['message' => $e->getMessage()]);
            // Redirect back with a generic error
            return Redirect::back()->withErrors(['error' => 'Gagal menyimpan portofolio. Silakan coba lagi.']);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Portfolio $portfolio)
    {
        return Inertia::render('dashboard/portfolios/edit', [
            'portfolio' => $portfolio,
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
            'image' => 'nullable|image|max:2048', // Image is optional for update
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($portfolio->image_path) {
                Storage::disk('public')->delete($portfolio->image_path);
            }
            $validated['image_path'] = $request->file('image')->store('portfolios', 'public');
        }

        $portfolio->update($validated);

        return Redirect::route('dashboard.portfolios.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Portfolio $portfolio)
    {
        if ($portfolio->image_path) {
            Storage::disk('public')->delete($portfolio->image_path);
        }

        $portfolio->delete();

        return Redirect::route('dashboard.portfolios.index');
    }
}
