<?php

namespace App\Http\Controllers;

use App\Models\Experience;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class ExperienceController extends Controller
{
    /**
     * Reorder the specified resources.
     */
    public function reorder(Request $request)
    {
        $request->validate([
            'order' => 'required|array',
            'order.*.id' => 'required|exists:experiences,id',
            'order.*.order' => 'required|integer',
        ]);

        foreach ($request->order as $item) {
            Experience::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return Redirect::back()->with('success', 'Experience order updated successfully.');
    }

    /**
     * Display a listing of the resource (Public).
     */
    public function index()
    {
        return Inertia::render('experience', [
            'experiences' => Experience::orderBy('order')->orderByDesc('created_at')->get(),
        ]);
    }

    /**
     * Display a listing of the resource (Admin).
     */
    public function dashboardIndex()
    {
        return Inertia::render('dashboard/experiences/index', [
            'experiences' => Experience::orderBy('order')->orderByDesc('created_at')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'role' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'period' => 'required|string|max:255',
            'description' => 'required|string',
            'order' => 'nullable|integer',
        ]);

        Experience::create($validated);

        return Redirect::route('dashboard.experiences.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Experience $experience)
    {
        $validated = $request->validate([
            'role' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'period' => 'required|string|max:255',
            'description' => 'required|string',
            'order' => 'nullable|integer',
        ]);

        $experience->update($validated);

        return Redirect::route('dashboard.experiences.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Experience $experience)
    {
        $experience->delete();

        return Redirect::route('dashboard.experiences.index');
    }
}
