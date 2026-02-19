# ✅ Checklist Transformasi SaaS

Checklist detail untuk transformasi portfolio personal menjadi platform SaaS.

---

## 📊 Progress Tracking

```
Phase 1: Foundation      [░░░░░░░░░░] 0%
Phase 2: Subscription    [░░░░░░░░░░] 0%
Phase 3: API             [░░░░░░░░░░] 0%
Phase 4: Frontend        [░░░░░░░░░░] 0%
Phase 5: Deployment      [░░░░░░░░░░] 0%
─────────────────────────────────────
Total Progress           [░░░░░░░░░░] 0%
```

---

## Phase 1: Foundation (Database & Core Infrastructure)

### 1.1 Database Migrations

```php
// Priority: CRITICAL
// Estimasi: 2-3 hari
```

- [ ] **Create `plans` table**
  - [ ] Migration file
  - [ ] Model dengan casts
  - [ ] Seeder dengan 3 plans (Free, Pro, Enterprise)

- [ ] **Create `tenants` table**
  - [ ] Migration file
  - [ ] Model dengan relationships
  - [ ] Factory untuk testing

- [ ] **Create `subscriptions` table**
  - [ ] Migration file
  - [ ] Model dengan Stripe integration
  - [ ] Event listeners

- [ ] **Create `invoices` table**
  - [ ] Migration file
  - [ ] Model

- [ ] **Create `payment_methods` table**
  - [ ] Migration file
  - [ ] Model

- [ ] **Update existing tables**
  - [ ] Add `tenant_id` to `users`
  - [ ] Add `tenant_id` to `portfolios`
  - [ ] Add `tenant_id` to `portfolio_images`
  - [ ] Add `tenant_id` to `experiences`
  - [ ] Add `tenant_id` to `page_views`
  - [ ] Update unique constraints

### 1.2 Core Models

- [ ] **Create `Plan` model**
```php
// app/Models/Plan.php
- Fillable fields
- JSON casts untuk features & limits
- Relationships: hasMany tenants, subscriptions
- Methods: isFree(), hasFeature(), getLimit()
```

- [ ] **Create `Tenant` model**
```php
// app/Models/Tenant.php
- Fillable fields
- Casts: settings (array), subscription_ends_at (datetime)
- Relationships: owner, plan, users, portfolios, subscription
- Methods: getStorageUsage(), isActive(), isSubscribed()
```

- [ ] **Create `Subscription` model**
```php
// app/Models/Subscription.php
- Fillable fields
- Casts: dates
- Relationships: tenant, plan
- Methods: isActive(), isCancelled(), isOnTrial(), daysUntilExpiration()
```

- [ ] **Update `User` model**
```php
// app/Models/User.php
- Add tenant() relationship
- Add role field
- Methods: isAdmin(), isOwner(), belongsToTenant()
```

### 1.3 Tenant Scope & Trait

- [ ] **Create `TenantScope`**
```php
// app/Scopes/TenantScope.php
- Static tenant ID storage
- apply() method untuk filtering
- setTenant(), getTenant(), clear() methods
```

- [ ] **Create `BelongsToTenant` trait**
```php
// app/Traits/BelongsToTenant.php
- bootBelongsToTenant() method
- Auto-set tenant_id on create
- tenant() relationship
```

- [ ] **Update models dengan trait**
```php
// Apply to:
- Portfolio
- PortfolioImage
- Experience
- PageView
```

### 1.4 Middleware

- [ ] **Create `IdentifyTenant` middleware**
```php
// app/Http/Middleware/IdentifyTenant.php
- Extract subdomain dari host
- Lookup tenant by subdomain/custom_domain
- Set tenant context
- Apply TenantScope
- Handle tenant not found
```

- [ ] **Create `EnsureFeatureEnabled` middleware**
```php
// app/Http/Middleware/EnsureFeatureEnabled.php
- Check feature availability
- Redirect ke upgrade page jika tidak tersedia
- Return JSON error untuk API requests
```

- [ ] **Create `CheckSubscription` middleware**
```php
// app/Http/Middleware/CheckSubscription.php
- Check subscription status
- Handle expired subscriptions
- Allow grace period
```

### 1.5 Helpers

- [ ] **Create `PlanFeatures` helper**
```php
// app/Helpers/PlanFeatures.php
- has(string $feature): bool
- limit(string $key): mixed
- withinLimit(string $key, int $current): bool
- maxPortfolios(): ?int
- maxStorage(): ?int
- allowsCustomDomain(): bool
- hasAnalytics(): bool
- removesBranding(): bool
```

- [ ] **Create `TenantHelper` helper**
```php
// app/Helpers/TenantHelper.php
- current(): ?Tenant
- id(): ?int
- isSubscribed(): bool
- plan(): ?Plan
```

---

## Phase 2: Subscription System

### 2.1 Stripe Integration

```php
// Priority: CRITICAL
// Estimasi: 3-4 hari
// Requires: Stripe account, API keys
```

- [ ] **Install Stripe SDK**
```bash
composer require stripe/stripe-php
```

- [ ] **Create `StripeService`**
```php
// app/Services/StripeService.php
- createCustomer(Tenant $tenant, array $data): Customer
- createSubscription(Tenant $tenant, Plan $plan, string $paymentMethodId): Subscription
- cancelSubscription(string $stripeSubscriptionId, bool $atPeriodEnd): Subscription
- updateSubscriptionPlan(string $stripeSubscriptionId, Plan $newPlan): Subscription
- getUpcomingInvoice(string $customerId): ?Invoice
- createCheckoutSession(Tenant $tenant, Plan $plan, string $interval): Session
```

- [ ] **Create Stripe webhook handler**
```php
// app/Http/Controllers/Webhook/StripeWebhookController.php
- handle(Request $request): JsonResponse
- handleSubscriptionCreated($stripeSubscription)
- handleSubscriptionUpdated($stripeSubscription)
- handleSubscriptionDeleted($stripeSubscription)
- handleInvoicePaymentSucceeded($stripeInvoice)
- handleInvoicePaymentFailed($stripeInvoice)
- handleTrialWillEnd($stripeSubscription)
```

- [ ] **Configure Stripe webhooks**
```
Endpoint: https://portfolify.app/webhooks/stripe
Events:
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_succeeded
- invoice.payment_failed
- customer.subscription.trial_will_end
```

### 2.2 Billing Controllers

- [ ] **Create `BillingController`**
```php
// app/Http/Controllers/Dashboard/BillingController.php
- index() - Show current plan & usage
- plans() - Show available plans
- checkout(CheckoutRequest $request) - Create checkout session
- success(Request $request) - Handle successful payment
- cancel() - Handle cancelled payment
- cancelSubscription(Request $request) - Cancel subscription
- resumeSubscription() - Resume cancelled subscription
- invoices() - List invoices
```

- [ ] **Create `PaymentMethodController`**
```php
// app/Http/Controllers/Dashboard/PaymentMethodController.php
- index() - List payment methods
- store(Request $request) - Add new payment method
- setDefault(string $id) - Set default payment method
- destroy(string $id) - Remove payment method
```

### 2.3 Mailables

- [ ] **Create email templates**
```php
// app/Mail/
- TrialEndingSoon.php
- SubscriptionActivated.php
- SubscriptionCancelled.php
- PaymentFailed.php
- PaymentSucceeded.php
- InvoiceGenerated.php
```

```blade
// resources/views/emails/
- trial-ending-soon.blade.php
- subscription-activated.blade.php
- subscription-cancelled.blade.php
- payment-failed.blade.php
- payment-succeeded.blade.php
- invoice-generated.blade.php
```

### 2.4 Feature Gating Implementation

- [ ] **Add feature checks to controllers**
```php
// PortfolioController@store
$features = new PlanFeatures($tenant);
if (!$features->withinLimit('max_portfolios', Portfolio::count())) {
    return redirect()->back()->with('error', 'Limit reached');
}

// PortfolioImageController@store
$storageUsage = $tenant->getStorageUsage();
$newFileSize = $request->file('image')->getSize() / 1024 / 1024;
if (!$features->withinLimit('max_storage_mb', $storageUsage + $newFileSize)) {
    return redirect()->back()->with('error', 'Storage limit reached');
}
```

- [ ] **Add middleware to routes**
```php
// routes/web.php
Route::middleware(['auth', 'feature:custom_domain'])
    ->group(function () {
        Route::get('/settings/domain', [DomainController::class, 'edit']);
        Route::post('/settings/domain', [DomainController::class, 'update']);
    });

Route::middleware(['auth', 'feature:analytics'])
    ->group(function () {
        Route::get('/analytics', [AnalyticsController::class, 'index']);
    });
```

---

## Phase 3: API Development

### 3.1 API Controllers

```php
// Priority: HIGH
// Estimasi: 3-4 hari
```

- [ ] **Create `PortfolioController` (API)**
```php
// app/Http/Controllers/Api/PortfolioController.php
- index(Request $request): JsonResponse
- store(StorePortfolioRequest $request): JsonResponse
- show(Portfolio $portfolio): JsonResponse
- update(UpdatePortfolioRequest $request, Portfolio $portfolio): JsonResponse
- destroy(Portfolio $portfolio): JsonResponse
- reorder(Request $request): JsonResponse
```

- [ ] **Create `ExperienceController` (API)**
```php
// app/Http/Controllers/Api/ExperienceController.php
- index(): JsonResponse
- store(StoreExperienceRequest $request): JsonResponse
- update(UpdateExperienceRequest $request, Experience $experience): JsonResponse
- destroy(Experience $experience): JsonResponse
- reorder(Request $request): JsonResponse
```

- [ ] **Create `AnalyticsController` (API)**
```php
// app/Http/Controllers/Api/AnalyticsController.php
- dashboard(): JsonResponse
- portfolios(): JsonResponse
- timeseries(Request $request): JsonResponse
- geography(): JsonResponse
```

- [ ] **Create `BillingController` (API)**
```php
// app/Http/Controllers/Api/BillingController.php
- plan(): JsonResponse
- plans(): JsonResponse
- checkout(Request $request): JsonResponse
- invoices(): JsonResponse
- cancel(Request $request): JsonResponse
```

### 3.2 API Resources

- [ ] **Create `PortfolioResource`**
```php
// app/Http/Resources/PortfolioResource.php
- toArray(Request $request): array
- Include: id, title, slug, description, content, technologies, 
  github_url, live_url, featured, is_published, view_count, 
  click_count, published_at, created_at, updated_at, images, user
```

- [ ] **Create `ExperienceResource`**
```php
// app/Http/Resources/ExperienceResource.php
```

- [ ] **Create `PlanResource`**
```php
// app/Http/Resources/PlanResource.php
```

- [ ] **Create `SubscriptionResource`**
```php
// app/Http/Resources/SubscriptionResource.php
```

- [ ] **Create `InvoiceResource`**
```php
// app/Http/Resources/InvoiceResource.php
```

### 3.3 API Routes

```php
// routes/api.php
Route::middleware(['auth:sanctum', 'identify.tenant'])
    ->prefix('v1')
    ->group(function () {
        
        // Portfolios
        Route::apiResource('portfolios', PortfolioController::class);
        Route::post('portfolios/reorder', [PortfolioController::class, 'reorder']);
        Route::post('portfolios/{portfolio}/images', [PortfolioImageController::class, 'store']);
        Route::delete('portfolios/{portfolio}/images/{image}', [PortfolioImageController::class, 'destroy']);
        Route::post('portfolios/{portfolio}/images/reorder', [PortfolioImageController::class, 'reorder']);
        
        // Experiences
        Route::apiResource('experiences', ExperienceController::class);
        Route::post('experiences/reorder', [ExperienceController::class, 'reorder']);
        
        // Analytics
        Route::get('analytics/dashboard', [AnalyticsController::class, 'dashboard']);
        Route::get('analytics/portfolios', [AnalyticsController::class, 'portfolios']);
        Route::get('analytics/timeseries', [AnalyticsController::class, 'timeseries']);
        Route::get('analytics/geography', [AnalyticsController::class, 'geography']);
        
        // Billing
        Route::get('billing/plan', [BillingController::class, 'plan']);
        Route::get('billing/plans', [BillingController::class, 'plans']);
        Route::post('billing/checkout', [BillingController::class, 'checkout']);
        Route::get('billing/invoices', [BillingController::class, 'invoices']);
        Route::post('billing/cancel', [BillingController::class, 'cancel']);
        
        // Settings
        Route::get('settings', [SettingsController::class, 'index']);
        Route::put('settings', [SettingsController::class, 'update']);
        Route::put('settings/domain', [SettingsController::class, 'domain']);
    });
```

### 3.4 API Authentication

- [ ] **Create API token system**
```php
// app/Http/Controllers/Api/AuthController.php
- token(CreateTokenRequest $request): JsonResponse
- revoke(Request $request): JsonResponse
```

- [ ] **Configure Sanctum**
```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

---

## Phase 4: Frontend Updates

### 4.1 Billing Pages

```typescript
// Priority: HIGH
// Estimasi: 4-5 hari
```

- [ ] **Create `BillingPage`**
```typescript
// resources/js/pages/dashboard/billing/index.tsx
- Current plan display
- Usage statistics
- Upgrade/downgrade buttons
- Cancel subscription
```

- [ ] **Create `PlansPage`**
```typescript
// resources/js/pages/dashboard/billing/plans.tsx
- Plan comparison table
- Pricing cards
- Checkout button
- Feature list
```

- [ ] **Create `CheckoutPage`**
```typescript
// resources/js/pages/dashboard/billing/checkout.tsx
- Stripe Elements integration
- Payment form
- Billing interval toggle (month/year)
```

- [ ] **Create `InvoicesPage`**
```typescript
// resources/js/pages/dashboard/billing/invoices.tsx
- Invoice list
- Download PDF
- Payment status
```

### 4.2 Analytics Dashboard

- [ ] **Create `AnalyticsPage`**
```typescript
// resources/js/pages/dashboard/analytics/index.tsx
- Overview stats cards
- Charts (views, clicks, visitors)
- Top portfolios
- Geographic data
```

- [ ] **Create chart components**
```typescript
// resources/js/components/analytics/
- ViewsChart.tsx
- ClicksChart.tsx
- GeographyChart.tsx
- TopPortfoliosTable.tsx
```

### 4.3 Settings Pages

- [ ] **Create `DomainSettingsPage`**
```typescript
// resources/js/pages/dashboard/settings/domain.tsx
- Custom domain input
- DNS instructions
- Verification status
```

- [ ] **Create `BrandingSettingsPage`**
```typescript
// resources/js/pages/dashboard/settings/branding.tsx
- Logo upload
- Favicon upload
- Primary color picker
```

### 4.4 Feature Gates in UI

- [ ] **Create `FeatureGate` component**
```typescript
// resources/js/components/feature-gate.tsx
interface FeatureGateProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const { hasFeature } = usePlanFeatures();
  
  if (!hasFeature(feature)) {
    return fallback || <UpgradePrompt feature={feature} />;
  }
  
  return children;
}
```

- [ ] **Create `UpgradePrompt` component**
```typescript
// resources/js/components/upgrade-prompt.tsx
- Feature description
- Upgrade button
- Plan comparison teaser
```

### 4.5 Custom Hooks

- [ ] **Create `useTenant` hook**
```typescript
// resources/js/hooks/use-tenant.ts
export function useTenant(): Tenant {
  const { props } = usePage();
  return props.tenant;
}
```

- [ ] **Create `usePlanFeatures` hook**
```typescript
// resources/js/hooks/use-plan-features.ts
export function usePlanFeatures() {
  const tenant = useTenant();
  
  return {
    hasFeature: (feature: string) => !!tenant.plan.features[feature],
    withinLimit: (key: string, current: number) => {
      const limit = tenant.plan.limits[key];
      return limit === null || current < limit;
    },
    plan: tenant.plan,
  };
}
```

- [ ] **Create `useSubscription` hook**
```typescript
// resources/js/hooks/use-subscription.ts
export function useSubscription() {
  const tenant = useTenant();
  
  return {
    isSubscribed: tenant.subscription?.status === 'active',
    isOnTrial: !!tenant.subscription?.trial_ends_at,
    daysUntilExpiration: () => {
      if (!tenant.subscription?.current_period_end) return null;
      return differenceInDays(
        new Date(tenant.subscription.current_period_end),
        new Date()
      );
    },
  };
}
```

---

## Phase 5: Deployment

### 5.1 Docker Setup

```
Priority: HIGH
Estimasi: 2-3 hari
```

- [ ] **Create PHP Dockerfile**
```dockerfile
// deployment/docker/php/Dockerfile
- Base: php:8.2-fpm-alpine
- Extensions: pdo_pgsql, gd, zip, redis
- Composer install
- Supervisor for queue workers
```

- [ ] **Create Nginx Dockerfile**
```dockerfile
// deployment/docker/nginx/Dockerfile
- Base: nginx:alpine
- Custom nginx.conf
- SSL support
```

- [ ] **Create docker-compose.yml**
```yaml
// deployment/docker-compose.yml
Services:
- nginx (reverse proxy)
- app (PHP-FPM)
- queue (queue workers)
- scheduler (cron)
- postgres (database)
- redis (cache/queue)
- minio (file storage)
```

### 5.2 Kubernetes Setup

- [ ] **Create namespace**
```yaml
// deployment/k8s/namespace.yaml
```

- [ ] **Create ConfigMap**
```yaml
// deployment/k8s/configmap.yaml
```

- [ ] **Create Secrets**
```yaml
// deployment/k8s/secrets.yaml
```

- [ ] **Create PostgreSQL StatefulSet**
```yaml
// deployment/k8s/postgres.yaml
```

- [ ] **Create App Deployment**
```yaml
// deployment/k8s/app.yaml
```

- [ ] **Create Queue Workers Deployment**
```yaml
// deployment/k8s/queue.yaml
```

- [ ] **Create Nginx Ingress**
```yaml
// deployment/k8s/ingress.yaml
- Wildcard subdomain support
- SSL termination
- Rate limiting
```

- [ ] **Create HPA**
```yaml
// deployment/k8s/hpa.yaml
- Auto-scaling berdasarkan CPU/memory
```

### 5.3 CI/CD Pipeline

- [ ] **Create GitHub Actions workflow**
```yaml
// .github/workflows/deploy.yml
- Run tests
- Build Docker images
- Push to registry
- Deploy to server
```

### 5.4 Monitoring

- [ ] **Setup Laravel Telescope**
```bash
php artisan telescope:install
```

- [ ] **Setup Prometheus/Grafana**
```yaml
// deployment/k8s/monitoring.yaml
```

- [ ] **Configure error tracking (Sentry)**
```bash
composer require sentry/sentry-laravel
```

---

## 🧪 Testing Checklist

### Unit Tests
- [ ] Plan model tests
- [ ] Tenant model tests
- [ ] Subscription model tests
- [ ] PlanFeatures helper tests

### Feature Tests
- [ ] Tenant identification tests
- [ ] Portfolio CRUD tests
- [ ] Subscription flow tests
- [ ] Feature gating tests
- [ ] API endpoint tests

### Integration Tests
- [ ] Stripe webhook tests
- [ ] Email notification tests
- [ ] File upload tests
- [ ] Queue job tests

---

## 📋 Pre-Launch Checklist

### Security
- [ ] SSL certificates configured
- [ ] Rate limiting enabled
- [ ] CSRF protection active
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] Security headers set

### Performance
- [ ] Database indexes created
- [ ] Caching configured
- [ ] Queue workers running
- [ ] CDN configured
- [ ] Image optimization enabled

### Monitoring
- [ ] Error tracking active
- [ ] Performance monitoring
- [ ] Uptime monitoring
- [ ] Log aggregation

### Legal
- [ ] Privacy policy
- [ ] Terms of service
- [ ] GDPR compliance
- [ ] Cookie consent

---

## 🎉 Launch Day Checklist

- [ ] Database backup created
- [ ] Environment variables set
- [ ] Migrations run
- [ ] Seeders executed
- [ ] Storage linked
- [ ] Queue workers started
- [ ] SSL certificates valid
- [ ] DNS records propagated
- [ ] Stripe webhooks configured
- [ ] Email service working
- [ ] File uploads working
- [ ] Monitoring dashboards accessible

---

## 📈 Post-Launch

- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Gather user feedback
- [ ] Track conversion rates
- [ ] Analyze usage patterns
- [ ] Plan feature improvements
