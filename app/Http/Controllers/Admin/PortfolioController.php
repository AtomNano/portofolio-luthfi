<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    public function index(Request $request)
    {
        $tenants = Tenant::with('owner')->get()->map(function ($t) {
            return [
                'id' => $t->id,
                'name' => $t->name,
                'owner' => $t->owner?->name ?? 'N/A',
            ];
        });

        $query = Portfolio::with(['tenant.owner', 'images']);

        if ($request->filled('tenant_id')) {
            $query->where('tenant_id', $request->tenant_id);
        }

        if ($request->filled('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        $portfolios = $query->latest()->paginate(12)
            ->through(function ($p) {
                return [
                    'id' => $p->id,
                    'title' => $p->title,
                    'is_published' => $p->is_published,
                    'category' => $p->category ?? 'Uncategorized',
                    'tenant_name' => $p->tenant?->name ?? 'Unknown',
                    'owner_name' => $p->tenant?->owner?->name ?? 'N/A',
                    'created_at' => $p->created_at->format('M d, Y'),
                    'thumbnail' => $p->image_path
                        ? asset('storage/'.$p->image_path)
                        : ($p->images->first()?->image_path ? asset('storage/'.$p->images->first()->image_path) : null),
                ];
            });

        return Inertia::render('admin/portfolios', [
            'portfolios' => $portfolios,
            'filters' => $request->only(['search', 'tenant_id']),
            'tenants' => $tenants,
        ]);
    }

    public function destroy(Portfolio $portfolio)
    {
        $portfolio->delete();

        return back()->with('success', 'Portfolio was permanently deleted from the platform.');
    }
}
