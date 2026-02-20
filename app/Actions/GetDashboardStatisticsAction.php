<?php

namespace App\Actions;

use App\Models\PageView;
use App\Models\Portfolio;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

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

        // Daily views for the last 30 days
        $dailyViews = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $dailyViews[$date] = [
                'date' => Carbon::now()->subDays($i)->format('M d'),
                'views' => 0,
            ];
        }

        // Fetch actual views grouped by date
        $viewsData = PageView::select(
            DB::raw('DATE(created_at) as date_string'),
            DB::raw('count(*) as views')
        )
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->groupBy('date_string')
            ->get();

        foreach ($viewsData as $data) {
            $dateString = $data->date_string;
            if (isset($dailyViews[$dateString])) {
                $dailyViews[$dateString]['views'] = $data->views;
            }
        }

        return [
            'total_home_views' => $totalHomeViews,
            'total_portfolio_views' => $totalPortfolioViews,
            'portfolio_stats' => $portfolioStats,
            'daily_views' => array_values($dailyViews),
        ];
    }
}
