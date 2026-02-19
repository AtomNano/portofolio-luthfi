<?php

namespace App\Http\Controllers;

use App\Actions\TrackPageViewAction;
use App\Models\Portfolio;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Laravel\Fortify\Features;

class HomeController extends Controller
{
    public function index(Request $request, TrackPageViewAction $trackPageView)
    {
        $trackPageView->handle($request, 'home');

        return Inertia::render('welcome', [
            'portfolios' => Portfolio::with('images')->latest()->get(),
            'canRegister' => Features::enabled(Features::registration()),
            'owner' => $request->user() ?? \App\Models\User::latest('updated_at')->first(),
        ]);
    }
}
