<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReorderExperiencesRequest;
use App\Http\Requests\StoreExperienceRequest;
use App\Models\Experience;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ExperienceController extends Controller
{
    /**
     * Reorder the specified resources.
     */
    public function reorder(ReorderExperiencesRequest $request)
    {
        foreach ($request->validated()['order'] as $item) {
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
    public function store(StoreExperienceRequest $request)
    {
        Experience::create($request->validated());

        return Redirect::route('dashboard.experiences.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreExperienceRequest $request, Experience $experience)
    {
        $experience->update($request->validated());

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
