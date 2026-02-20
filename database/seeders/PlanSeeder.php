<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Free',
                'slug' => 'free',
                'description' => 'Perfect for getting started',
                'price_monthly' => 0,
                'price_yearly' => 0,
                'currency' => 'IDR',
                'features' => [
                    'max_portfolios' => 3,
                    'max_storage_mb' => 100,
                    'custom_domain' => false,
                    'analytics' => false,
                    'remove_branding' => false,
                    'api_access' => false,
                    'priority_support' => false,
                ],
                'limits' => [
                    'max_portfolios' => 3,
                    'max_storage_mb' => 100,
                ],
                'display_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Pro',
                'slug' => 'pro',
                'description' => 'For serious professionals',
                'price_monthly' => 49000,  // IDR 49k/month
                'price_yearly' => 490000,  // IDR 490k/year (save 2 months)
                'currency' => 'IDR',
                'features' => [
                    'max_portfolios' => null, // unlimited
                    'max_storage_mb' => 5120, // 5GB
                    'custom_domain' => true,
                    'analytics' => true,
                    'remove_branding' => true,
                    'api_access' => true,
                    'priority_support' => true,
                ],
                'limits' => [
                    'max_portfolios' => null,
                    'max_storage_mb' => 5120,
                ],
                'is_popular' => true,
                'display_order' => 2,
                'is_active' => true,
            ],
        ];

        foreach ($plans as $plan) {
            Plan::firstOrCreate(['slug' => $plan['slug']], $plan);
        }
    }
}
