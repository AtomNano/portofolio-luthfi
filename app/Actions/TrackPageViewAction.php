<?php

namespace App\Actions;

use App\Models\PageView;
use Illuminate\Http\Request;

class TrackPageViewAction
{
    /**
     * Track a page view for analytics.
     */
    public function handle(Request $request, string $pageType, ?int $portfolioId = null): PageView
    {
        return PageView::create([
            'page_type' => $pageType,
            'portfolio_id' => $portfolioId,
            'ip_address' => $request->ip(),
        ]);
    }
}
