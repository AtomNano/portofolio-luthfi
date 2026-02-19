# 💳 Subscription System - Portfolify SaaS

## 📋 Ringkasan

Sistem subscription lengkap dengan Stripe integration untuk billing, trial management, dan feature gating berdasarkan plan.

---

## 🎯 Pricing Strategy

### Tier Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                         FREE TIER                               │
│                         $0/month                                │
├─────────────────────────────────────────────────────────────────┤
│  ✓ 3 Portfolios                                                │
│  ✓ 100 MB Storage                                              │
│  ✓ Basic Templates (2)                                         │
│  ✓ Community Support                                           │
│  ✗ Custom Domain                                               │
│  ✗ Portfolify Branding                                         │
│  ✗ Analytics                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          PRO TIER                               │
│                         $9/month                                │
│                    or $90/year (17% off)                        │
├─────────────────────────────────────────────────────────────────┤
│  ✓ Unlimited Portfolios                                        │
│  ✓ 5 GB Storage                                                │
│  ✓ All Templates                                               │
│  ✓ Custom Domain                                               │
│  ✓ Remove Branding                                             │
│  ✓ Advanced Analytics                                          │
│  ✓ Priority Support                                            │
│  ✓ API Access                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ENTERPRISE TIER                            │
│                         $29/month                               │
│                    or $290/year (17% off)                       │
├─────────────────────────────────────────────────────────────────┤
│  ✓ Everything in Pro                                           │
│  ✓ 50 GB Storage                                               │
│  ✓ Custom Template                                             │
│  ✓ Team Members (Unlimited)                                    │
│  ✓ White Label                                                 │
│  ✓ Dedicated Support                                           │
│  ✓ SLA Guarantee                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema (Billing)

### Plans Table

```php
// database/migrations/2026_02_15_000001_create_plans_table.php
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
            $table->string('name'); // Free, Pro, Enterprise
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            
            // Pricing
            $table->decimal('price_monthly', 10, 2)->default(0);
            $table->decimal('price_yearly', 10, 2)->default(0);
            $table->string('currency', 3)->default('USD');
            
            // Stripe Price IDs
            $table->string('stripe_price_monthly_id')->nullable();
            $table->string('stripe_price_yearly_id')->nullable();
            
            // Features (JSON)
            $table->json('features');
            $table->json('limits');
            
            // Display
            $table->boolean('is_popular')->default(false);
            $table->integer('display_order')->default(0);
            
            // Status
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

### Subscriptions Table

```php
// database/migrations/2026_02_15_000002_create_subscriptions_table.php
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
            
            // Stripe Integration
            $table->string('stripe_subscription_id')->nullable()->unique();
            $table->string('stripe_customer_id')->nullable();
            $table->string('stripe_price_id')->nullable();
            
            // Status
            $table->string('status')->default('trialing'); // trialing, active, cancelled, past_due, unpaid
            
            // Period
            $table->timestamp('current_period_start')->nullable();
            $table->timestamp('current_period_end')->nullable();
            
            // Trial
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

### Payment Methods Table

```php
// database/migrations/2026_02_15_000003_create_payment_methods_table.php
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
            
            // Card Info (last 4 digits only)
            $table->string('brand')->nullable(); // visa, mastercard, etc
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

---

## 🌟 Plan Seeder

```php
// database/seeders/PlanSeeder.php
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
                'features' => [
                    'max_portfolios' => 3,
                    'max_storage_mb' => 100,
                    'max_team_members' => 1,
                    'custom_domain' => false,
                    'analytics' => false,
                    'remove_branding' => false,
                    'api_access' => false,
                    'priority_support' => false,
                    'templates' => ['developer', 'minimal'],
                ],
                'limits' => [
                    'monthly_page_views' => 1000,
                    'portfolio_images' => 5,
                ],
                'display_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Pro',
                'slug' => 'pro',
                'description' => 'For serious professionals',
                'price_monthly' => 9.00,
                'price_yearly' => 90.00,
                'features' => [
                    'max_portfolios' => null, // unlimited
                    'max_storage_mb' => 5120, // 5GB
                    'max_team_members' => 3,
                    'custom_domain' => true,
                    'analytics' => true,
                    'remove_branding' => true,
                    'api_access' => true,
                    'priority_support' => true,
                    'templates' => ['all'],
                ],
                'limits' => [
                    'monthly_page_views' => 50000,
                    'portfolio_images' => 20,
                ],
                'is_popular' => true,
                'display_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Enterprise',
                'slug' => 'enterprise',
                'description' => 'For teams and agencies',
                'price_monthly' => 29.00,
                'price_yearly' => 290.00,
                'features' => [
                    'max_portfolios' => null,
                    'max_storage_mb' => 51200, // 50GB
                    'max_team_members' => null,
                    'custom_domain' => true,
                    'analytics' => true,
                    'remove_branding' => true,
                    'api_access' => true,
                    'priority_support' => true,
                    'templates' => ['all', 'custom'],
                    'white_label' => true,
                    'sla' => true,
                ],
                'limits' => [
                    'monthly_page_views' => null,
                    'portfolio_images' => null,
                ],
                'display_order' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($plans as $plan) {
            Plan::create($plan);
        }
    }
}
```

---

## 💰 Stripe Integration

### 1. Install Stripe PHP SDK

```bash
composer require stripe/stripe-php
```

### 2. Stripe Service

```php
// app/Services/StripeService.php
<?php

namespace App\Services;

use App\Models\Tenant;
use App\Models\Plan;
use Stripe\Stripe;
use Stripe\Customer;
use Stripe\Subscription;
use Stripe\PaymentMethod;
use Stripe\Invoice;

class StripeService
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }
    
    /**
     * Create Stripe Customer untuk tenant
     */
    public function createCustomer(Tenant $tenant, array $data): Customer
    {
        $customer = Customer::create([
            'email' => $data['email'],
            'name' => $data['name'],
            'metadata' => [
                'tenant_id' => $tenant->id,
                'tenant_slug' => $tenant->slug,
            ],
        ]);
        
        return $customer;
    }
    
    /**
     * Create Subscription
     */
    public function createSubscription(
        Tenant $tenant, 
        Plan $plan, 
        string $paymentMethodId,
        string $billingInterval = 'month'
    ): Subscription {
        // Attach payment method to customer
        PaymentMethod::retrieve($paymentMethodId)->attach([
            'customer' => $tenant->stripe_customer_id,
        ]);
        
        // Set as default payment method
        Customer::update($tenant->stripe_customer_id, [
            'invoice_settings' => [
                'default_payment_method' => $paymentMethodId,
            ],
        ]);
        
        // Create subscription
        $priceId = $billingInterval === 'year' 
            ? $plan->stripe_price_yearly_id 
            : $plan->stripe_price_monthly_id;
        
        $subscription = Subscription::create([
            'customer' => $tenant->stripe_customer_id,
            'items' => [['price' => $priceId]],
            'trial_period_days' => $plan->slug === 'free' ? 0 : 14, // 14-day trial
            'metadata' => [
                'tenant_id' => $tenant->id,
                'plan_id' => $plan->id,
            ],
        ]);
        
        return $subscription;
    }
    
    /**
     * Cancel Subscription
     */
    public function cancelSubscription(string $stripeSubscriptionId, bool $atPeriodEnd = true): Subscription
    {
        $subscription = Subscription::retrieve($stripeSubscriptionId);
        
        if ($atPeriodEnd) {
            return $subscription->cancel_at_period_end();
        }
        
        return $subscription->cancel();
    }
    
    /**
     * Update Subscription Plan
     */
    public function updateSubscriptionPlan(
        string $stripeSubscriptionId,
        Plan $newPlan,
        string $billingInterval = 'month'
    ): Subscription {
        $subscription = Subscription::retrieve($stripeSubscriptionId);
        
        $priceId = $billingInterval === 'year' 
            ? $newPlan->stripe_price_yearly_id 
            : $newPlan->stripe_price_monthly_id;
        
        return Subscription::update($stripeSubscriptionId, [
            'items' => [
                [
                    'id' => $subscription->items->data[0]->id,
                    'price' => $priceId,
                ],
            ],
            'proration_behavior' => 'create_prorations',
        ]);
    }
    
    /**
     * Get Upcoming Invoice
     */
    public function getUpcomingInvoice(string $customerId): ?Invoice
    {
        try {
            return Invoice::upcoming(['customer' => $customerId]);
        } catch (\Exception $e) {
            return null;
        }
    }
}
```

### 3. Webhook Handler

```php
// app/Http/Controllers/Webhook/StripeWebhookController.php
<?php

namespace App\Http\Controllers\Webhook;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\Invoice;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Stripe\Webhook;
use Stripe\Exception\SignatureVerificationException;

class StripeWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $secret = config('services.stripe.webhook_secret');
        
        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $secret);
        } catch (SignatureVerificationException $e) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }
        
        match ($event->type) {
            'customer.subscription.created' => $this->handleSubscriptionCreated($event->data->object),
            'customer.subscription.updated' => $this->handleSubscriptionUpdated($event->data->object),
            'customer.subscription.deleted' => $this->handleSubscriptionDeleted($event->data->object),
            'invoice.payment_succeeded' => $this->handleInvoicePaymentSucceeded($event->data->object),
            'invoice.payment_failed' => $this->handleInvoicePaymentFailed($event->data->object),
            'customer.subscription.trial_will_end' => $this->handleTrialWillEnd($event->data->object),
            default => null,
        };
        
        return response()->json(['status' => 'success']);
    }
    
    protected function handleSubscriptionCreated($stripeSubscription)
    {
        $tenant = Tenant::where('stripe_customer_id', $stripeSubscription->customer)->first();
        
        if (!$tenant) return;
        
        Subscription::updateOrCreate(
            ['stripe_subscription_id' => $stripeSubscription->id],
            [
                'tenant_id' => $tenant->id,
                'plan_id' => $stripeSubscription->metadata->plan_id ?? $tenant->plan_id,
                'stripe_customer_id' => $stripeSubscription->customer,
                'stripe_price_id' => $stripeSubscription->items->data[0]->price->id,
                'status' => $stripeSubscription->status,
                'current_period_start' => \Carbon\Carbon::createFromTimestamp($stripeSubscription->current_period_start),
                'current_period_end' => \Carbon\Carbon::createFromTimestamp($stripeSubscription->current_period_end),
                'trial_ends_at' => $stripeSubscription->trial_end 
                    ? \Carbon\Carbon::createFromTimestamp($stripeSubscription->trial_end)
                    : null,
            ]
        );
    }
    
    protected function handleSubscriptionUpdated($stripeSubscription)
    {
        $subscription = Subscription::where('stripe_subscription_id', $stripeSubscription->id)->first();
        
        if (!$subscription) return;
        
        $subscription->update([
            'status' => $stripeSubscription->status,
            'current_period_start' => \Carbon\Carbon::createFromTimestamp($stripeSubscription->current_period_start),
            'current_period_end' => \Carbon\Carbon::createFromTimestamp($stripeSubscription->current_period_end),
            'cancelled_at' => $stripeSubscription->canceled_at 
                ? \Carbon\Carbon::createFromTimestamp($stripeSubscription->canceled_at)
                : null,
        ]);
        
        // Update tenant status
        $subscription->tenant->update([
            'subscription_status' => $stripeSubscription->status,
        ]);
    }
    
    protected function handleSubscriptionDeleted($stripeSubscription)
    {
        $subscription = Subscription::where('stripe_subscription_id', $stripeSubscription->id)->first();
        
        if (!$subscription) return;
        
        $subscription->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
        ]);
        
        // Downgrade to free plan
        $freePlan = \App\Models\Plan::where('slug', 'free')->first();
        $subscription->tenant->update([
            'plan_id' => $freePlan->id,
            'subscription_status' => 'cancelled',
        ]);
    }
    
    protected function handleInvoicePaymentSucceeded($stripeInvoice)
    {
        $tenant = Tenant::where('stripe_customer_id', $stripeInvoice->customer)->first();
        
        if (!$tenant) return;
        
        Invoice::create([
            'tenant_id' => $tenant->id,
            'subscription_id' => $tenant->subscription?->id,
            'stripe_invoice_id' => $stripeInvoice->id,
            'amount_due' => $stripeInvoice->amount_due / 100,
            'amount_paid' => $stripeInvoice->amount_paid / 100,
            'currency' => $stripeInvoice->currency,
            'status' => $stripeInvoice->status,
            'period_start' => \Carbon\Carbon::createFromTimestamp($stripeInvoice->period_start),
            'period_end' => \Carbon\Carbon::createFromTimestamp($stripeInvoice->period_end),
            'due_date' => $stripeInvoice->due_date 
                ? \Carbon\Carbon::createFromTimestamp($stripeInvoice->due_date)
                : null,
            'paid_at' => now(),
            'invoice_pdf' => $stripeInvoice->invoice_pdf,
        ]);
    }
    
    protected function handleInvoicePaymentFailed($stripeInvoice)
    {
        $subscription = Subscription::where('stripe_subscription_id', $stripeInvoice->subscription)->first();
        
        if (!$subscription) return;
        
        // Notify tenant admin
        // Send email notification
        \Mail::to($subscription->tenant->owner->email)->send(
            new \App\Mail\PaymentFailed($subscription->tenant, $stripeInvoice)
        );
    }
    
    protected function handleTrialWillEnd($stripeSubscription)
    {
        $subscription = Subscription::where('stripe_subscription_id', $stripeSubscription->id)->first();
        
        if (!$subscription) return;
        
        // Send trial ending notification
        \Mail::to($subscription->tenant->owner->email)->send(
            new \App\Mail\TrialEndingSoon($subscription->tenant, $subscription)
        );
    }
}
```

---

## 🚪 Feature Gating

### Plan Feature Helper

```php
// app/Helpers/PlanFeatures.php
<?php

namespace App\Helpers;

use App\Models\Tenant;

class PlanFeatures
{
    protected Tenant $tenant;
    
    public function __construct(Tenant $tenant)
    {
        $this->tenant = $tenant;
    }
    
    /**
     * Check if feature is available
     */
    public function has(string $feature): bool
    {
        $features = $this->tenant->plan->features;
        
        return $features[$feature] ?? false;
    }
    
    /**
     * Get feature limit
     */
    public function limit(string $key, mixed $default = 0): mixed
    {
        $limits = $this->tenant->plan->limits;
        
        return $limits[$key] ?? $default;
    }
    
    /**
     * Check if within limit
     */
    public function withinLimit(string $key, int $current): bool
    {
        $limit = $this->limit($key);
        
        // null means unlimited
        if ($limit === null) {
            return true;
        }
        
        return $current < $limit;
    }
    
    /**
     * Get max portfolios
     */
    public function maxPortfolios(): ?int
    {
        return $this->limit('max_portfolios');
    }
    
    /**
     * Get max storage in MB
     */
    public function maxStorage(): ?int
    {
        return $this->limit('max_storage_mb');
    }
    
    /**
     * Check if custom domain allowed
     */
    public function allowsCustomDomain(): bool
    {
        return $this->has('custom_domain');
    }
    
    /**
     * Check if analytics enabled
     */
    public function hasAnalytics(): bool
    {
        return $this->has('analytics');
    }
    
    /**
     * Check if branding should be removed
     */
    public function removesBranding(): bool
    {
        return $this->has('remove_branding');
    }
}
```

### Middleware for Feature Check

```php
// app/Http/Middleware/EnsureFeatureEnabled.php
<?php

namespace App\Http\Middleware;

use App\Helpers\PlanFeatures;
use Closure;
use Illuminate\Http\Request;

class EnsureFeatureEnabled
{
    public function handle(Request $request, Closure $next, string $feature)
    {
        $tenant = app('current_tenant');
        $features = new PlanFeatures($tenant);
        
        if (!$features->has($feature)) {
            if ($request->expectsJson()) {
                return response()->json([
                    'error' => 'This feature requires a higher plan.',
                    'upgrade_url' => route('billing.upgrade'),
                ], 403);
            }
            
            return redirect()->route('billing.upgrade')
                ->with('error', 'This feature requires a higher plan. Please upgrade.');
        }
        
        return $next($request);
    }
}
```

### Usage Examples

```php
// In Controller
public function store(Request $request)
{
    $tenant = app('current_tenant');
    $features = new PlanFeatures($tenant);
    
    // Check portfolio limit
    $currentPortfolios = $tenant->portfolios()->count();
    if (!$features->withinLimit('max_portfolios', $currentPortfolios)) {
        return redirect()->back()
            ->with('error', 'You have reached your portfolio limit. Please upgrade your plan.');
    }
    
    // Check storage
    $currentStorage = $tenant->getStorageUsage(); // in MB
    $uploadSize = $request->file('image')->getSize() / 1024 / 1024;
    if (!$features->withinLimit('max_storage_mb', $currentStorage + $uploadSize)) {
        return redirect()->back()
            ->with('error', 'Not enough storage space. Please upgrade your plan.');
    }
    
    // Create portfolio...
}

// In Routes
Route::middleware(['auth', 'feature:custom_domain'])
    ->group(function () {
        Route::get('/settings/domain', [DomainController::class, 'edit']);
        Route::post('/settings/domain', [DomainController::class, 'update']);
    });
```

---

## 📧 Email Notifications

### Trial Ending Email

```php
// app/Mail/TrialEndingSoon.php
<?php

namespace App\Mail;

use App\Models\Tenant;
use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TrialEndingSoon extends Mailable
{
    use Queueable, SerializesModels;
    
    public function __construct(
        public Tenant $tenant,
        public Subscription $subscription
    ) {}
    
    public function build()
    {
        return $this->subject('Your trial ends in 3 days')
            ->markdown('emails.trial-ending-soon');
    }
}
```

```blade
{{-- resources/views/emails/trial-ending-soon.blade.php --}}
@component('mail::message')
# Your Trial Ends Soon

Hi {{ $tenant->owner->name }},

Your trial for **{{ $tenant->name }}** ends in 3 days on **{{ $subscription->trial_ends_at->format('F j, Y') }}**.

To keep your portfolio live and unlock all features, upgrade to a paid plan.

@component('mail::button', ['url' => route('billing.upgrade')])
Upgrade Now
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
```

---

## 📊 Usage Tracking & Limits

### Storage Usage Command

```php
// app/Console/Commands/CheckStorageLimits.php
<?php

namespace App\Console\Commands;

use App\Models\Tenant;
use App\Helpers\PlanFeatures;
use Illuminate\Console\Command;

class CheckStorageLimits extends Command
{
    protected $signature = 'tenants:check-storage';
    protected $description = 'Check storage usage for all tenants';
    
    public function handle()
    {
        $tenants = Tenant::all();
        
        foreach ($tenants as $tenant) {
            $features = new PlanFeatures($tenant);
            $limit = $features->maxStorage();
            
            if ($limit === null) continue;
            
            $usage = $tenant->getStorageUsage();
            $percentage = ($usage / $limit) * 100;
            
            if ($percentage >= 90) {
                // Send warning email
                \Mail::to($tenant->owner->email)->send(
                    new \App\Mail\StorageWarning($tenant, $usage, $limit)
                );
                
                $this->warn("Tenant {$tenant->slug}: {$percentage}% storage used");
            }
        }
        
        return 0;
    }
}
```

---

## 🔄 Next Steps

1. **Setup Stripe Account** → Create products and prices in Stripe Dashboard
2. **Configure Webhooks** → Setup webhook endpoint di Stripe
3. **Test Payment Flow** → Gunakan Stripe test cards
4. **Implement Frontend** → Billing page dan upgrade flow

Lihat `03-MIGRASI-DATABASE.md` untuk langkah migrasi database.
