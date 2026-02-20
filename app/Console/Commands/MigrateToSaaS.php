<?php

namespace App\Console\Commands;

use App\Models\Experience;
use App\Models\PageView;
use App\Models\Plan;
use App\Models\Portfolio;
use App\Models\PortfolioImage;
use App\Models\Subscription;
use App\Models\Tenant;
use App\Models\User;
use App\Scopes\TenantScope;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Migrates existing single-user data to the SaaS multi-tenant structure.
 * Run this ONCE after running migrations on an existing database.
 *
 * Usage: php artisan saas:migrate [--slug=luthfi] [--name="Luthfi Portfolio"]
 */
class MigrateToSaaS extends Command
{
    protected $signature = 'saas:migrate {--slug= : Subdomain/username for the tenant} {--name= : Display name for the tenant}';

    protected $description = 'Migrate existing single-user data to SaaS multi-tenant structure';

    public function handle(): int
    {
        $this->info('🚀 Starting SaaS migration...');

        // Bypass all global scopes for migration
        TenantScope::clear();

        return DB::transaction(function () {
            // 1. Get or create Free plan
            $freePlan = Plan::firstOrCreate(
                ['slug' => 'free'],
                [
                    'name' => 'Free',
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
                ]
            );

            // 2. Find the existing owner user
            $owner = User::withoutGlobalScopes()->whereNull('tenant_id')->first();

            if (! $owner) {
                $this->info('ℹ️  No unmigrated users found. Migration may have already run.');

                return self::SUCCESS;
            }

            $slug = $this->option('slug') ?? Str::slug($owner->name);
            $name = $this->option('name') ?? $owner->name."'s Portfolio";

            // Make slug unique
            $originalSlug = $slug;
            $i = 1;
            while (Tenant::where('slug', $slug)->exists()) {
                $slug = $originalSlug.$i++;
            }

            $this->info("📦 Creating tenant: {$slug}");

            // 3. Create the tenant
            $tenant = Tenant::create([
                'name' => $name,
                'slug' => $slug,
                'plan_id' => $freePlan->id,
                'owner_id' => $owner->id,
                'status' => 'active',
                'subscription_status' => 'active',
            ]);

            // 4. Set username if not set
            if (! $owner->username) {
                $owner->username = $slug;
            }

            // 5. Link user to tenant
            $owner->tenant_id = $tenant->id;
            $owner->role = 'admin';
            $owner->save();

            $this->info("✅ Migrated user: {$owner->email} → @{$slug}");

            // 6. Migrate portfolios
            $portfolios = Portfolio::withoutGlobalScope(TenantScope::class)
                ->whereNull('tenant_id')
                ->get();

            foreach ($portfolios as $portfolio) {
                $portfolio->update([
                    'tenant_id' => $tenant->id,
                    'user_id' => $owner->id,
                    'is_published' => true,
                ]);
            }
            $this->info("📁 Migrated {$portfolios->count()} portfolios");

            // 7. Migrate portfolio images
            $images = PortfolioImage::withoutGlobalScope(TenantScope::class)
                ->whereNull('tenant_id')
                ->get();

            foreach ($images as $image) {
                $image->update(['tenant_id' => $tenant->id]);
            }
            $this->info("🖼  Migrated {$images->count()} images");

            // 8. Migrate experiences
            $experiences = Experience::withoutGlobalScope(TenantScope::class)
                ->whereNull('tenant_id')
                ->get();

            foreach ($experiences as $experience) {
                $experience->update([
                    'tenant_id' => $tenant->id,
                    'user_id' => $owner->id,
                ]);
            }
            $this->info("💼 Migrated {$experiences->count()} experiences");

            // 9. Migrate page views
            if (class_exists(PageView::class)) {
                $views = PageView::withoutGlobalScope(TenantScope::class)
                    ->whereNull('tenant_id')
                    ->get();

                foreach ($views as $view) {
                    $view->update(['tenant_id' => $tenant->id]);
                }
                $this->info("👁  Migrated {$views->count()} page views");
            }

            // 10. Create subscription record
            Subscription::create([
                'tenant_id' => $tenant->id,
                'plan_id' => $freePlan->id,
                'status' => 'active',
                'current_period_start' => now(),
                'current_period_end' => now()->addYear(),
            ]);

            $this->newLine();
            $this->info('🎉 Migration completed successfully!');
            $this->table(
                ['Key', 'Value'],
                [
                    ['Tenant Slug', $slug],
                    ['Owner', $owner->email],
                    ['Plan', 'Free'],
                    ['Public URL', url("/{$slug}")],
                ]
            );

            return self::SUCCESS;
        });
    }
}
