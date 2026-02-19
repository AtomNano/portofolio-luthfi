# 🗄️ Panduan Migrasi Database - SaaS Transformation

## 📋 Ringkasan

Panduan lengkap untuk migrasi dari single-user portfolio ke multi-tenant SaaS platform.

---

## 🎯 Pre-Migration Checklist

- [ ] Backup database existing
- [ ] Export semua data portfolio, images, experience
- [ ] Setup environment baru (PostgreSQL direkomendasikan)
- [ ] Install dependencies baru (`stripe/stripe-php`)
- [ ] Review dan test migration scripts di staging

---

## 📦 Migration Files

### Step 1: Create Tenants Table

```php
// database/migrations/2026_02_15_100000_create_tenants_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tenants', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique(); // subdomain
            $table->string('custom_domain')->unique()->nullable();
            $table->foreignId('plan_id')->constrained('plans');
            $table->foreignId('owner_id')->nullable()->constrained('users');
            
            // Branding
            $table->string('logo')->nullable();
            $table->string('favicon')->nullable();
            $table->string('primary_color', 7)->default('#0ea5e9');
            
            // Settings
            $table->json('settings')->default('{}');
            
            // Status
            $table->string('status', 20)->default('active');
            $table->string('subscription_status', 20)->default('trialing');
            $table->timestamp('subscription_ends_at')->nullable();
            
            // Stripe
            $table->string('stripe_customer_id')->nullable();
            
            $table->timestamps();
            
            $table->index('slug');
            $table->index('custom_domain');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tenants');
    }
};
```

### Step 2: Create Plans Table

```php
// database/migrations/2026_02_15_100001_create_plans_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            
            // Pricing
            $table->decimal('price_monthly', 10, 2)->default(0);
            $table->decimal('price_yearly', 10, 2)->default(0);
            $table->string('currency', 3)->default('USD');
            
            // Stripe
            $table->string('stripe_price_monthly_id')->nullable();
            $table->string('stripe_price_yearly_id')->nullable();
            
            // Features & Limits
            $table->json('features');
            $table->json('limits');
            
            // Display
            $table->boolean('is_popular')->default(false);
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
```

### Step 3: Create Subscriptions Table

```php
// database/migrations/2026_02_15_100002_create_subscriptions_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('plan_id')->constrained();
            
            // Stripe
            $table->string('stripe_subscription_id')->nullable()->unique();
            $table->string('stripe_customer_id')->nullable();
            $table->string('stripe_price_id')->nullable();
            
            // Status
            $table->string('status', 20)->default('trialing');
            
            // Period
            $table->timestamp('current_period_start')->nullable();
            $table->timestamp('current_period_end')->nullable();
            $table->timestamp('trial_ends_at')->nullable();
            
            // Cancellation
            $table->timestamp('cancelled_at')->nullable();
            $table->text('cancellation_reason')->nullable();
            
            $table->timestamps();
            
            $table->index(['tenant_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
```

### Step 4: Create Invoices Table

```php
// database/migrations/2026_02_15_100003_create_invoices_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('subscription_id')->nullable()->constrained();
            
            // Stripe
            $table->string('stripe_invoice_id')->nullable();
            
            // Amount
            $table->decimal('amount_due', 10, 2);
            $table->decimal('amount_paid', 10, 2)->default(0);
            $table->string('currency', 3)->default('USD');
            
            // Status
            $table->string('status', 20)->default('draft');
            
            // Period
            $table->timestamp('period_start')->nullable();
            $table->timestamp('period_end')->nullable();
            $table->timestamp('due_date')->nullable();
            $table->timestamp('paid_at')->nullable();
            
            // PDF
            $table->string('invoice_pdf')->nullable();
            
            $table->timestamps();
            
            $table->index(['tenant_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
```

### Step 5: Create Payment Methods Table

```php
// database/migrations/2026_02_15_100004_create_payment_methods_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Stripe
            $table->string('stripe_payment_method_id');
            
            // Card Info (safe to store)
            $table->string('brand')->nullable();
            $table->string('last_four', 4)->nullable();
            $table->tinyInteger('exp_month')->nullable();
            $table->smallInteger('exp_year')->nullable();
            
            // Status
            $table->boolean('is_default')->default(false);
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_methods');
    }
};
```

### Step 6: Add Tenant ID to Existing Tables

```php
// database/migrations/2026_02_15_100100_add_tenant_id_to_existing_tables.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Users table
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('tenant_id')->nullable()->after('id');
            $table->string('role', 20)->default('user')->after('twitter');
            
            // Remove unique constraint from email, add composite unique
            $table->dropUnique(['email']);
            $table->unique(['tenant_id', 'email']);
        });
        
        // Portfolios table
        Schema::table('portfolios', function (Blueprint $table) {
            $table->foreignId('tenant_id')->nullable()->after('id');
            $table->string('slug')->nullable()->after('title');
            $table->json('content')->nullable()->after('description');
            $table->boolean('is_published')->default(false)->after('featured');
            $table->timestamp('published_at')->nullable()->after('is_published');
            $table->string('meta_title')->nullable()->after('published_at');
            $table->text('meta_description')->nullable()->after('meta_title');
            $table->string('og_image')->nullable()->after('meta_description');
            $table->integer('view_count')->default(0)->after('og_image');
            $table->integer('click_count')->default(0)->after('view_count');
            
            // Change unique constraint
            $table->unique(['tenant_id', 'slug']);
        });
        
        // Portfolio images table
        Schema::table('portfolio_images', function (Blueprint $table) {
            $table->foreignId('tenant_id')->nullable()->after('id');
            $table->string('caption')->nullable()->after('image_path');
        });
        
        // Experiences table
        Schema::table('experiences', function (Blueprint $table) {
            $table->foreignId('tenant_id')->nullable()->after('id');
            $table->foreignId('user_id')->nullable()->after('tenant_id');
        });
        
        // Page views table
        Schema::table('page_views', function (Blueprint $table) {
            $table->foreignId('tenant_id')->nullable()->after('id');
            $table->foreignId('portfolio_id')->nullable()->after('tenant_id');
            $table->string('referrer')->nullable()->after('user_agent');
            $table->string('country', 2)->nullable()->after('referrer');
            $table->string('session_id')->nullable()->after('country');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['tenant_id', 'email']);
            $table->dropColumn(['tenant_id', 'role']);
            $table->unique('email');
        });
        
        Schema::table('portfolios', function (Blueprint $table) {
            $table->dropUnique(['tenant_id', 'slug']);
            $table->dropColumn([
                'tenant_id', 'slug', 'content', 'is_published', 'published_at',
                'meta_title', 'meta_description', 'og_image', 'view_count', 'click_count'
            ]);
        });
        
        Schema::table('portfolio_images', function (Blueprint $table) {
            $table->dropColumn(['tenant_id', 'caption']);
        });
        
        Schema::table('experiences', function (Blueprint $table) {
            $table->dropColumn(['tenant_id', 'user_id']);
        });
        
        Schema::table('page_views', function (Blueprint $table) {
            $table->dropColumn(['tenant_id', 'portfolio_id', 'referrer', 'country', 'session_id']);
        });
    }
};
```

---

## 🔄 Data Migration Script

### Migration Command

```php
// app/Console/Commands/MigrateToSaaS.php
<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Tenant;
use App\Models\Plan;
use App\Models\Portfolio;
use App\Models\PortfolioImage;
use App\Models\Experience;
use App\Models\PageView;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class MigrateToSaaS extends Command
{
    protected $signature = 'saas:migrate {--slug=} {--name=}';
    protected $description = 'Migrate existing data to SaaS structure';
    
    public function handle()
    {
        $this->info('Starting SaaS migration...');
        
        // Get or create default plan
        $freePlan = Plan::firstOrCreate(
            ['slug' => 'free'],
            [
                'name' => 'Free',
                'description' => 'Free tier',
                'price_monthly' => 0,
                'price_yearly' => 0,
                'features' => [
                    'max_portfolios' => 3,
                    'max_storage_mb' => 100,
                    'custom_domain' => false,
                    'analytics' => false,
                    'remove_branding' => false,
                ],
                'limits' => [],
            ]
        );
        
        // Get existing user (owner)
        $owner = User::first();
        
        if (!$owner) {
            $this->error('No existing user found!');
            return 1;
        }
        
        // Create tenant for existing user
        $slug = $this->option('slug') ?? Str::slug($owner->name);
        $name = $this->option('name') ?? $owner->name . '\'s Portfolio';
        
        $this->info("Creating tenant: {$slug}");
        
        $tenant = Tenant::create([
            'name' => $name,
            'slug' => $slug,
            'plan_id' => $freePlan->id,
            'owner_id' => $owner->id,
            'status' => 'active',
            'subscription_status' => 'active',
        ]);
        
        // Update owner with tenant_id and role
        $owner->update([
            'tenant_id' => $tenant->id,
            'role' => 'admin',
        ]);
        
        $this->info("Migrated user: {$owner->email}");
        
        // Migrate portfolios
        $portfolios = Portfolio::all();
        foreach ($portfolios as $portfolio) {
            $portfolio->update([
                'tenant_id' => $tenant->id,
                'user_id' => $owner->id,
                'slug' => Str::slug($portfolio->title),
                'is_published' => true,
                'published_at' => $portfolio->created_at,
            ]);
            
            $this->info("Migrated portfolio: {$portfolio->title}");
        }
        
        // Migrate portfolio images
        $images = PortfolioImage::all();
        foreach ($images as $image) {
            $portfolio = $image->portfolio;
            if ($portfolio) {
                $image->update([
                    'tenant_id' => $tenant->id,
                ]);
            }
        }
        
        $this->info("Migrated " . $images->count() . " images");
        
        // Migrate experiences
        $experiences = Experience::all();
        foreach ($experiences as $experience) {
            $experience->update([
                'tenant_id' => $tenant->id,
                'user_id' => $owner->id,
            ]);
        }
        
        $this->info("Migrated " . $experiences->count() . " experiences");
        
        // Migrate page views
        $pageViews = PageView::all();
        foreach ($pageViews as $pageView) {
            $pageView->update([
                'tenant_id' => $tenant->id,
            ]);
        }
        
        $this->info("Migrated " . $pageViews->count() . " page views");
        
        // Create subscription record
        \App\Models\Subscription::create([
            'tenant_id' => $tenant->id,
            'plan_id' => $freePlan->id,
            'status' => 'active',
            'current_period_start' => now(),
            'current_period_end' => now()->addYear(),
        ]);
        
        $this->info('Migration completed successfully!');
        $this->info("Tenant URL: http://{$slug}.localhost:8000");
        
        return 0;
    }
}
```

---

## 🔧 Post-Migration Setup

### 1. Update Models

```php
// app/Models/Tenant.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tenant extends Model
{
    protected $fillable = [
        'name', 'slug', 'custom_domain', 'plan_id', 'owner_id',
        'logo', 'favicon', 'primary_color', 'settings',
        'status', 'subscription_status', 'subscription_ends_at',
        'stripe_customer_id',
    ];
    
    protected $casts = [
        'settings' => 'array',
        'subscription_ends_at' => 'datetime',
    ];
    
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
    
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }
    
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
    
    public function portfolios(): HasMany
    {
        return $this->hasMany(Portfolio::class);
    }
    
    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }
    
    public function getStorageUsage(): float
    {
        // Calculate total storage in MB
        $totalBytes = 0;
        
        foreach ($this->portfolios as $portfolio) {
            foreach ($portfolio->images as $image) {
                $path = storage_path('app/public/' . $image->image_path);
                if (file_exists($path)) {
                    $totalBytes += filesize($path);
                }
            }
        }
        
        return round($totalBytes / 1024 / 1024, 2);
    }
}
```

```php
// app/Models/Plan.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    protected $fillable = [
        'name', 'slug', 'description',
        'price_monthly', 'price_yearly', 'currency',
        'stripe_price_monthly_id', 'stripe_price_yearly_id',
        'features', 'limits',
        'is_popular', 'display_order', 'is_active',
    ];
    
    protected $casts = [
        'features' => 'array',
        'limits' => 'array',
        'price_monthly' => 'decimal:2',
        'price_yearly' => 'decimal:2',
        'is_popular' => 'boolean',
        'is_active' => 'boolean',
    ];
    
    public function tenants(): HasMany
    {
        return $this->hasMany(Tenant::class);
    }
    
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }
    
    public function isFree(): bool
    {
        return $this->price_monthly === 0.00 && $this->price_yearly === 0.00;
    }
}
```

### 2. Update User Model

```php
// app/Models/User.php - Add tenant relationship

public function tenant(): BelongsTo
{
    return $this->belongsTo(Tenant::class);
}

public function isAdmin(): bool
{
    return $this->role === 'admin';
}

public function isOwner(): bool
{
    return $this->tenant?->owner_id === $this->id;
}
```

### 3. Add Tenant Scope

```php
// app/Scopes/TenantScope.php
<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class TenantScope implements Scope
{
    protected static ?int $tenantId = null;
    
    public static function setTenant(?int $tenantId): void
    {
        self::$tenantId = $tenantId;
    }
    
    public static function getTenant(): ?int
    {
        return self::$tenantId;
    }
    
    public static function clear(): void
    {
        self::$tenantId = null;
    }
    
    public function apply(Builder $builder, Model $model): void
    {
        if (self::$tenantId !== null) {
            $builder->where($model->getTable() . '.tenant_id', self::$tenantId);
        }
    }
}
```

### 4. Add BelongsToTenant Trait

```php
// app/Traits/BelongsToTenant.php
<?php

namespace App\Traits;

use App\Scopes\TenantScope;

trait BelongsToTenant
{
    protected static function bootBelongsToTenant(): void
    {
        static::addGlobalScope(new TenantScope);
        
        static::creating(function ($model) {
            if (!$model->tenant_id && $tenantId = TenantScope::getTenant()) {
                $model->tenant_id = $tenantId;
            }
        });
    }
    
    public function tenant()
    {
        return $this->belongsTo(\App\Models\Tenant::class);
    }
}
```

### 5. Update Portfolio Model

```php
// app/Models/Portfolio.php

use App\Traits\BelongsToTenant;

class Portfolio extends Model
{
    use BelongsToTenant;
    
    protected $fillable = [
        'tenant_id', 'user_id', 'title', 'slug', 'description',
        'content', 'technologies', 'github_url', 'live_url',
        'featured', 'is_published', 'published_at', 'display_order',
        'meta_title', 'meta_description', 'og_image',
        'view_count', 'click_count',
    ];
    
    protected $casts = [
        'technologies' => 'array',
        'content' => 'array',
        'featured' => 'boolean',
        'is_published' => 'boolean',
        'published_at' => 'datetime',
        'view_count' => 'integer',
        'click_count' => 'integer',
    ];
    
    // ... rest of the model
}
```

---

## 🧪 Testing Migration

```bash
# 1. Backup existing database
cp database/database.sqlite database/database.sqlite.backup

# 2. Run migrations
php artisan migrate

# 3. Seed plans
php artisan db:seed --class=PlanSeeder

# 4. Run migration command
php artisan saas:migrate --slug=luthfi --name="Luthfi Portfolio"

# 5. Verify migration
php artisan tinker
>>> Tenant::first();
>>> Portfolio::first();
```

---

## 🚨 Rollback Plan

```bash
# If something goes wrong:

# 1. Restore database
mv database/database.sqlite.backup database/database.sqlite

# 2. Clear cache
php artisan cache:clear
php artisan config:clear
php artisan view:clear

# 3. Restart server
```

---

## 📋 Migration Checklist

- [ ] Backup database
- [ ] Run new migrations
- [ ] Seed plans table
- [ ] Run saas:migrate command
- [ ] Update .env with Stripe keys
- [ ] Test tenant subdomain access
- [ ] Verify all data migrated correctly
- [ ] Test CRUD operations
- [ ] Deploy to staging
- [ ] Deploy to production
