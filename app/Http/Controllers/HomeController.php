<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Laravel\Fortify\Features;

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('welcome', [
            'portfolios' => Portfolio::latest()->get(),
            'canRegister' => Features::enabled(Features::registration()),
        ]);
    }
}
