<?php

namespace App\Actions;

use App\Models\PageView;
use App\Models\Portfolio;

class GetDashboardStatisticsAction
{
    /**
     * Get dashboard statistics for page views and portfolio performance.
     *
     * @return array<string, mixed>
     */
    public function handle(): array
    {
        $totalHomeViews = PageView::where('page_type', 'home')->count();
        $totalPortfolioViews = PageView::where('page_type', 'portfolio')->count();

        $portfolioStats = Portfolio::withCount('pageViews')
            ->orderByDesc('page_views_count')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'title' => $p->title,
                'views' => $p->page_views_count,
            ]);

        return [
            'total_home_views' => $totalHomeViews,
            'total_portfolio_views' => $totalPortfolioViews,
            'portfolio_stats' => $portfolioStats,
        ];
    }
}
