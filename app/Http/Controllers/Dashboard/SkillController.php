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
            'social_links' => $request->user()->social_links ?? [],
        ]);
    }

    /**
     * Update the user's skills and social links.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'skills' => ['nullable', 'array'],
            'skills.*.name' => ['required', 'string', 'max:255'],
            'skills.*.level' => ['required', 'integer', 'min:1', 'max:100'],
            'skills.*.category' => ['required', 'string', 'max:50'],
            'social_links' => ['nullable', 'array'],
            'social_links.*.platform' => ['required', 'string', 'max:50'],
            'social_links.*.url' => ['required', 'url', 'max:255'],
        ]);

        $request->user()->update([
            'skills' => $validated['skills'] ?? [],
            'social_links' => $validated['social_links'] ?? [],
        ]);

        return back()->with('success', 'Skills and social links updated successfully.');
    }
}
