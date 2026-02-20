<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Plan>
 */
class PlanFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => 'Free',
            'slug' => 'free',
            'description' => 'Free tier',
            'price_monthly' => 0,
            'price_yearly' => 0,
            'currency' => 'IDR',
            'features' => [
                'max_portfolios' => 3,
                'max_storage_mb' => 100,
                'custom_domain' => false,
                'analytics' => false,
                'remove_branding' => false,
            ],
            'limits' => [
                'max_portfolios' => 3,
                'max_storage_mb' => 100,
            ],
            'display_order' => 1,
            'is_active' => true,
            'is_popular' => false,
        ];
    }

    public function pro(): static
    {
        return $this->state(fn () => [
            'name' => 'Pro',
            'slug' => 'pro',
            'price_monthly' => 49000,
            'price_yearly' => 490000,
            'features' => [
                'max_portfolios' => null,
                'max_storage_mb' => 5120,
                'custom_domain' => true,
                'analytics' => true,
                'remove_branding' => true,
            ],
            'limits' => [
                'max_portfolios' => null,
                'max_storage_mb' => 5120,
            ],
            'is_popular' => true,
        ]);
    }
}
