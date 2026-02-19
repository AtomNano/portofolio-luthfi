<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SkillController extends Controller
{
    /**
     * Display the skills manager.
     */
    public function index(Request $request)
    {
        return Inertia::render('dashboard/skills/index', [
            'skills' => $request->user()->skills ?? [],
            'soft_skills' => $request->user()->soft_skills ?? [],
            'social_links' => $request->user()->social_links ?? [],
        ]);
    }

    /**
     * Update the skills and social links.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'skills' => ['nullable', 'array'],
            'skills.*.name' => ['required', 'string', 'max:255'],
            'skills.*.level' => ['required', 'integer', 'min:1', 'max:100'],
            'skills.*.category' => ['required', 'string', 'max:50'],
            'soft_skills' => ['nullable', 'array'],
            'soft_skills.*.name' => ['required', 'string', 'max:255'],
            'soft_skills.*.icon' => ['nullable', 'string', 'max:255'],
            'social_links' => ['nullable', 'array'],
            'social_links.*.platform' => ['required', 'string', 'max:50'],
            'social_links.*.url' => ['required', 'string', 'max:255'],
        ]);

        $request->user()->update([
            'skills' => $validated['skills'] ?? [],
            'soft_skills' => $validated['soft_skills'] ?? [],
            'social_links' => $validated['social_links'] ?? [],
        ]);

        return back()->with('success', 'Skills and social links updated successfully.');
    }
}
