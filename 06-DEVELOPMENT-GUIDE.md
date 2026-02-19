# 💻 Development Guide - Portfolify SaaS

## 📋 Ringkasan

Panduan lengkap untuk development, kontribusi, dan pengembangan fitur Portfolify SaaS.

---

## 🚀 Quick Start

### Prerequisites

- PHP 8.2+
- Composer 2.x
- Node.js 20+
- PostgreSQL 14+ (atau SQLite untuk development)
- Redis 7+ (opsional, untuk queue/cache)

### Setup Development Environment

```bash
# 1. Clone repository
git clone https://github.com/yourusername/portfolify.git
cd portfolify

# 2. Install PHP dependencies
composer install

# 3. Install Node dependencies
npm install

# 4. Copy environment file
cp .env.example .env

# 5. Generate app key
php artisan key:generate

# 6. Setup database (SQLite untuk development)
touch database/database.sqlite

# 7. Run migrations
php artisan migrate

# 8. Seed data
php artisan db:seed --class=PlanSeeder

# 9. Create your tenant
php artisan saas:migrate --slug=dev --name="Development"

# 10. Link storage
php artisan storage:link

# 11. Generate Wayfinder routes
php artisan wayfinder:generate

# 12. Start development server
composer run dev
```

### Development URLs

| Service | URL |
|---------|-----|
| App | http://localhost:8000 |
| Vite Dev Server | http://localhost:5173 |
| Mailpit (email testing) | http://localhost:8025 |
| MinIO Console | http://localhost:9001 |

---

## 📁 Project Structure

```
portfolify/
├── app/
│   ├── Actions/              # Custom actions
│   ├── Concerns/             # Reusable traits
│   ├── Console/
│   │   └── Commands/         # Artisan commands
│   ├── Helpers/              # Helper classes
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/          # API controllers
│   │   │   ├── Dashboard/    # Dashboard controllers
│   │   │   ├── Webhook/      # Webhook handlers
│   │   │   └── ...
│   │   ├── Middleware/
│   │   │   ├── IdentifyTenant.php
│   │   │   ├── EnsureFeatureEnabled.php
│   │   │   └── ...
│   │   └── Requests/         # Form requests
│   ├── Mail/                 # Mailable classes
│   ├── Models/
│   │   ├── Tenant.php
│   │   ├── Plan.php
│   │   ├── Subscription.php
│   │   └── ...
│   ├── Scopes/               # Eloquent scopes
│   ├── Services/             # Business logic
│   │   ├── StripeService.php
│   │   └── ...
│   └── Traits/               # Reusable traits
├── config/
├── database/
│   ├── migrations/
│   └── seeders/
├── deployment/               # Deployment configs
├── resources/
│   ├── js/
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom hooks
│   │   ├── layouts/          # Page layouts
│   │   ├── pages/            # Inertia pages
│   │   ├── templates/        # Portfolio templates
│   │   └── types/            # TypeScript types
│   └── views/
├── routes/
│   ├── api.php
│   ├── web.php
│   └── webhooks.php
├── tests/
│   ├── Feature/
│   └── Unit/
└── docker-compose.yml
```

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
php artisan test

# Run specific test
php artisan test --filter=PortfolioTest

# Run with coverage
php artisan test --coverage

# Run Pest dengan verbose output
vendor/bin/pest --verbose
```

### Test Structure

```php
// tests/Feature/Api/PortfolioApiTest.php
<?php

use App\Models\Tenant;
use App\Models\User;
use App\Models\Portfolio;

beforeEach(function () {
    $this->tenant = Tenant::factory()->create();
    $this->user = User::factory()->create(['tenant_id' => $this->tenant->id]);
    $this->actingAs($this->user);
});

it('can list portfolios', function () {
    Portfolio::factory()->count(5)->create([
        'tenant_id' => $this->tenant->id,
        'user_id' => $this->user->id,
    ]);
    
    $response = $this->getJson('/api/v1/portfolios');
    
    $response->assertOk()
        ->assertJsonCount(5, 'data');
});

it('cannot create portfolio beyond plan limit', function () {
    // Create max portfolios for free plan
    Portfolio::factory()->count(3)->create([
        'tenant_id' => $this->tenant->id,
        'user_id' => $this->user->id,
    ]);
    
    $response = $this->postJson('/api/v1/portfolios', [
        'title' => 'Fourth Portfolio',
        'description' => 'Should fail',
    ]);
    
    $response->assertForbidden()
        ->assertJsonPath('error.code', 'PLAN_LIMIT_REACHED');
});
```

### Frontend Testing

```bash
# Run Vitest tests
npm run test

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage
```

```typescript
// resources/js/__tests__/components/PortfolioCard.test.tsx
import { render, screen } from '@testing-library/react';
import { PortfolioCard } from '@/components/portfolio-card';

const mockPortfolio = {
  id: 1,
  title: 'Test Project',
  description: 'Test description',
  slug: 'test-project',
  images: [],
  view_count: 100,
};

describe('PortfolioCard', () => {
  it('renders portfolio title', () => {
    render(<PortfolioCard portfolio={mockPortfolio} />);
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });
  
  it('displays view count', () => {
    render(<PortfolioCard portfolio={mockPortfolio} />);
    expect(screen.getByText('100 views')).toBeInTheDocument();
  });
});
```

---

## 📝 Code Standards

### PHP (Laravel Pint)

```bash
# Check code style
vendor/bin/pint

# Fix code style
vendor/bin/pint --fix
```

### TypeScript/JavaScript (ESLint + Prettier)

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Git Hooks (Husky)

```bash
# Setup hooks
npx husky install

# Pre-commit akan menjalankan:
# - lint-staged (Prettier + ESLint)
# - Laravel Pint
```

---

## 🌿 Git Workflow

### Branching Strategy

```
main        → Production branch
  ↑
develop     → Development branch
  ↑
feature/*   → Feature branches
  ↑
hotfix/*    → Hotfix branches
```

### Commit Convention

```
feat:     New feature
fix:      Bug fix
docs:     Documentation
style:    Code style (formatting)
refactor: Code refactoring
test:     Tests
chore:    Build/config changes
ci:       CI/CD changes
```

Example:
```bash
git commit -m "feat: add portfolio reordering with drag and drop"
git commit -m "fix: resolve tenant scope issue in queue workers"
git commit -m "docs: update API documentation for billing endpoints"
```

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

---

## 🎨 Frontend Development

### Component Structure

```typescript
// resources/js/components/portfolio-card.tsx
import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Portfolio } from '@/types';

interface PortfolioCardProps {
  portfolio: Portfolio;
  showActions?: boolean;
}

export function PortfolioCard({ portfolio, showActions = false }: PortfolioCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Card 
      className="group overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/portfolios/${portfolio.slug}`}>
        {/* Card content */}
      </Link>
      
      {showActions && (
        <CardActions portfolio={portfolio} />
      )}
    </Card>
  );
}
```

### Custom Hooks

```typescript
// resources/js/hooks/use-tenant.ts
import { usePage } from '@inertiajs/react';

export function useTenant() {
  const { props } = usePage();
  return props.tenant as Tenant;
}

// resources/js/hooks/use-plan-features.ts
import { useTenant } from './use-tenant';

export function usePlanFeatures() {
  const tenant = useTenant();
  
  const hasFeature = (feature: string): boolean => {
    return tenant.plan.features[feature] ?? false;
  };
  
  const withinLimit = (key: string, current: number): boolean => {
    const limit = tenant.plan.limits[key];
    if (limit === null) return true;
    return current < limit;
  };
  
  return { hasFeature, withinLimit, plan: tenant.plan };
}
```

### Inertia.js Pages

```typescript
// resources/js/pages/dashboard/portfolios/index.tsx
import { Head } from '@inertiajs/react';
import { DashboardLayout } from '@/layouts/dashboard-layout';
import { PortfolioList } from '@/components/portfolio-list';
import { PageProps, Portfolio } from '@/types';

interface Props extends PageProps {
  portfolios: {
    data: Portfolio[];
    meta: PaginationMeta;
  };
}

export default function PortfolioIndex({ portfolios }: Props) {
  return (
    <DashboardLayout>
      <Head title="Portfolios" />
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Portfolios</h1>
          <CreatePortfolioButton />
        </div>
        
        <PortfolioList portfolios={portfolios.data} />
      </div>
    </DashboardLayout>
  );
}
```

---

## 🔧 Backend Development

### Controller Pattern

```php
// app/Http/Controllers/Api/PortfolioController.php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePortfolioRequest;
use App\Http\Requests\UpdatePortfolioRequest;
use App\Http\Resources\PortfolioResource;
use App\Models\Portfolio;
use App\Helpers\PlanFeatures;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PortfolioController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $portfolios = Portfolio::query()
            ->when($request->search, fn($q, $search) => 
                $q->where('title', 'like', "%{$search}%")
            )
            ->when($request->featured, fn($q) => 
                $q->where('featured', true)
            )
            ->orderBy($request->sort ?? 'created_at', $request->order ?? 'desc')
            ->paginate($request->per_page ?? 20);
        
        return response()->json([
            'success' => true,
            'data' => PortfolioResource::collection($portfolios),
            'meta' => [
                'current_page' => $portfolios->currentPage(),
                'last_page' => $portfolios->lastPage(),
                'per_page' => $portfolios->perPage(),
                'total' => $portfolios->total(),
            ],
        ]);
    }
    
    public function store(StorePortfolioRequest $request): JsonResponse
    {
        $tenant = app('current_tenant');
        $features = new PlanFeatures($tenant);
        
        // Check limit
        $currentCount = Portfolio::count();
        if (!$features->withinLimit('max_portfolios', $currentCount)) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'PLAN_LIMIT_REACHED',
                    'message' => 'You have reached your portfolio limit.',
                ],
            ], 403);
        }
        
        $portfolio = Portfolio::create([
            ...$request->validated(),
            'slug' => Str::slug($request->title),
            'user_id' => auth()->id(),
        ]);
        
        return response()->json([
            'success' => true,
            'data' => new PortfolioResource($portfolio),
        ], 201);
    }
    
    public function show(Portfolio $portfolio): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => new PortfolioResource($portfolio->load('images')),
        ]);
    }
    
    public function update(UpdatePortfolioRequest $request, Portfolio $portfolio): JsonResponse
    {
        $portfolio->update($request->validated());
        
        return response()->json([
            'success' => true,
            'data' => new PortfolioResource($portfolio),
        ]);
    }
    
    public function destroy(Portfolio $portfolio): JsonResponse
    {
        $portfolio->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Portfolio deleted successfully',
        ]);
    }
}
```

### Form Request Validation

```php
// app/Http/Requests/StorePortfolioRequest.php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePortfolioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'technologies' => ['nullable', 'array'],
            'technologies.*' => ['string', 'max:50'],
            'github_url' => ['nullable', 'url', 'max:255'],
            'live_url' => ['nullable', 'url', 'max:255'],
            'featured' => ['boolean'],
            'is_published' => ['boolean'],
            'content' => ['nullable', 'array'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
        ];
    }
    
    public function messages(): array
    {
        return [
            'title.required' => 'Portfolio title is required',
            'github_url.url' => 'Please enter a valid GitHub URL',
            'live_url.url' => 'Please enter a valid live URL',
        ];
    }
}
```

### API Resource

```php
// app/Http/Resources/PortfolioResource.php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PortfolioResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'content' => $this->content,
            'technologies' => $this->technologies,
            'github_url' => $this->github_url,
            'live_url' => $this->live_url,
            'featured' => $this->featured,
            'is_published' => $this->is_published,
            'view_count' => $this->view_count,
            'click_count' => $this->click_count,
            'published_at' => $this->published_at?->toISOString(),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
            'images' => PortfolioImageResource::collection($this->whenLoaded('images')),
            'user' => new UserResource($this->whenLoaded('user')),
        ];
    }
}
```

---

## 🔄 Queue Jobs

### Creating Jobs

```php
// app/Jobs/ProcessImageUpload.php
<?php

namespace App\Jobs;

use App\Models\PortfolioImage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class ProcessImageUpload implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    
    public function __construct(
        public PortfolioImage $image
    ) {}
    
    public function handle(): void
    {
        $path = Storage::path($this->image->image_path);
        
        // Generate thumbnails
        $sizes = [
            'thumb' => [300, 200],
            'medium' => [800, 600],
            'large' => [1600, 1200],
        ];
        
        foreach ($sizes as $name => [$width, $height]) {
            $img = Image::make($path);
            $img->fit($width, $height, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });
            
            $thumbnailPath = str_replace(
                '.',
                "_{$name}.",
                $this->image->image_path
            );
            
            Storage::put($thumbnailPath, $img->encode());
        }
        
        // Update image record
        $this->image->update([
            'processed_at' => now(),
        ]);
    }
    
    public function failed(\Throwable $exception): void
    {
        // Log failure
        logger()->error('Image processing failed', [
            'image_id' => $this->image->id,
            'error' => $exception->getMessage(),
        ]);
        
        // Notify user
        $this->image->user->notify(new ImageProcessingFailed($this->image));
    }
}
```

### Dispatching Jobs

```php
// In controller
use App\Jobs\ProcessImageUpload;

// Dispatch immediately
ProcessImageUpload::dispatch($image);

// Dispatch with delay
ProcessImageUpload::dispatch($image)->delay(now()->addMinutes(5));

// Dispatch on specific queue
ProcessImageUpload::dispatch($image)->onQueue('image-processing');

// Dispatch batch
$jobs = $images->map(fn($img) => new ProcessImageUpload($img));
Bus::batch($jobs)->dispatch();
```

---

## 📧 Email Notifications

### Creating Mailables

```php
// app/Mail/PortfolioPublished.php
<?php

namespace App\Mail;

use App\Models\Portfolio;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PortfolioPublished extends Mailable
{
    use Queueable, SerializesModels;
    
    public function __construct(
        public Portfolio $portfolio
    ) {}
    
    public function build(): self
    {
        return $this->subject("Your portfolio '{$this->portfolio->title}' is now live!")
            ->markdown('emails.portfolio-published');
    }
}
```

```blade
{{-- resources/views/emails/portfolio-published.blade.php --}}
@component('mail::message')
# 🎉 Portfolio Published!

Hi {{ $portfolio->user->name }},

Your portfolio **"{{ $portfolio->title }}"** has been published and is now live!

@component('mail::button', ['url' => route('portfolios.show', $portfolio->slug)])
View Portfolio
@endcomponent

@component('mail::button', ['url' => route('dashboard.portfolios.edit', $portfolio->id)])
Edit Portfolio
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
```

### Sending Emails

```php
// Send immediately
Mail::to($user)->send(new PortfolioPublished($portfolio));

// Queue for later
Mail::to($user)->queue(new PortfolioPublished($portfolio));

// Send later
Mail::to($user)->later(now()->addHour(), new PortfolioPublished($portfolio));
```

---

## 🌐 Localization

### Adding Translations

```php
// lang/en/messages.php
return [
    'portfolio' => [
        'created' => 'Portfolio created successfully',
        'updated' => 'Portfolio updated successfully',
        'deleted' => 'Portfolio deleted successfully',
        'limit_reached' => 'You have reached your portfolio limit',
    ],
    'billing' => [
        'upgrade_required' => 'Please upgrade your plan to access this feature',
        'payment_failed' => 'Payment failed. Please check your payment method',
    ],
];

// lang/id/messages.php
return [
    'portfolio' => [
        'created' => 'Portfolio berhasil dibuat',
        'updated' => 'Portfolio berhasil diperbarui',
        'deleted' => 'Portfolio berhasil dihapus',
        'limit_reached' => 'Anda telah mencapai batas portfolio',
    ],
];
```

### Using Translations

```php
// In PHP
__('messages.portfolio.created');

// In Blade
@lang('messages.portfolio.created')
{{ __('messages.portfolio.created') }}

// With parameters
__('messages.welcome', ['name' => $user->name]);
```

---

## 🔍 Debugging

### Laravel Telescope

```bash
# Install Telescope
php artisan telescope:install
php artisan migrate

# Access at /telescope
# Configure authorization in App\Providers\TelescopeServiceProvider
```

### Debugbar

```bash
# Install debugbar (development only)
composer require barryvdh/laravel-debugbar --dev
```

### Logging

```php
// Different log levels
Log::emergency($message);
Log::alert($message);
Log::critical($message);
Log::error($message);
Log::warning($message);
Log::notice($message);
Log::info($message);
Log::debug($message);

// With context
Log::info('Portfolio created', [
    'portfolio_id' => $portfolio->id,
    'user_id' => auth()->id(),
    'tenant_id' => $portfolio->tenant_id,
]);
```

---

## 📚 Useful Commands

```bash
# Artisan commands
php artisan migrate:fresh --seed
php artisan migrate:rollback
php artisan db:seed --class=PlanSeeder

# Cache commands
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan optimize:clear

# Optimization
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Queue
php artisan queue:work
php artisan queue:work --queue=high,default
php artisan queue:restart

# Schedule
php artisan schedule:work
php artisan schedule:run

# Tinker
php artisan tinker

# Wayfinder
php artisan wayfinder:generate

# Testing
php artisan test
php artisan test --filter=PortfolioTest
vendor/bin/pest --coverage

# Code style
vendor/bin/pint
vendor/bin/pint --fix
```

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Review Checklist

- [ ] Tests pass
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] No console errors
- [ ] Responsive design tested
- [ ] Accessibility checked

---

## 📖 Resources

- [Laravel Documentation](https://laravel.com/docs/12.x)
- [Inertia.js Documentation](https://inertiajs.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
