# 🏗️ Arsitektur SaaS - Portofolio Platform

## 📋 Ringkasan Transformasi

Transformasi dari **Personal Portfolio** menjadi **Portfolio SaaS Platform** dengan arsitektur multi-tenant yang memungkinkan banyak pengguna memiliki portfolio mereka sendiri dalam satu platform.

---

## 🎯 Visi Produk

**Nama Produk**: `Portfolify` / `PortoSpace` / `DevFolio` (pilih salah satu)

**Tagline**: *"Create Your Professional Portfolio in Minutes"*

**Value Proposition**:
- Portfolio builder untuk developer, designer, dan profesional kreatif
- Hosting included dengan custom domain support
- Analytics dan visitor tracking
- Template yang customizable

---

## 🏛️ Arsitektur Sistem

### 1. Multi-Tenant Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        LOAD BALANCER                            │
│                     (Nginx / CloudFlare)                        │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   App Server  │    │   App Server  │    │   App Server  │
│     (PHP)     │    │     (PHP)     │    │     (PHP)     │
└───────────────┘    └───────────────┘    └───────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (PostgreSQL)                        │
│              ├── Tenants Table (tenant isolation)               │
│              ├── Users Table (per tenant)                       │
│              ├── Portfolios Table (per tenant)                  │
│              └── Subscriptions Table (billing)                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FILE STORAGE (S3/MinIO)                      │
│              ├── tenant-1/                                      │
│              ├── tenant-2/                                      │
│              └── tenant-n/                                      │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Tenant Isolation Strategy

**Approach**: **Shared Database with Tenant ID Column**

| Aspek | Implementasi |
|-------|--------------|
| Database | Single database dengan `tenant_id` column di setiap tabel |
| File Storage | Folder per tenant: `/storage/tenants/{tenant_slug}/` |
| Cache | Prefix cache key dengan tenant ID |
| Queue | Queue per tenant atau tenant-aware job processing |

**Keuntungan**:
- ✅ Cost-effective (satu database)
- ✅ Easy backup dan maintenance
- ✅ Simple horizontal scaling
- ✅ Data sharing antar tenant (jika diperlukan)

---

## 📦 Domain Structure

### Subdomain-based Tenancy

```
# Free Tier
luthfi.portfolify.app
john.portfolify.app
sarah.portfolify.app

# Pro Tier (Custom Domain)
portfolio.luthfi.dev
works.johndoe.com
```

### Route Resolution

```php
// Middleware: IdentifyTenant
public function handle($request, Closure $next)
{
    $host = $request->getHost();
    
    // Extract tenant from subdomain
    if (Str::endsWith($host, '.portfolify.app')) {
        $subdomain = Str::before($host, '.portfolify.app');
        $tenant = Tenant::where('subdomain', $subdomain)->firstOrFail();
    } else {
        // Custom domain
        $tenant = Tenant::where('custom_domain', $host)->firstOrFail();
    }
    
    // Set tenant context for entire request
    app()->instance('current_tenant', $tenant);
    
    // Apply tenant scope to all queries
    TenantScope::setTenant($tenant->id);
    
    return $next($request);
}
```

---

## 🗄️ Database Schema (SaaS Version)

### Core Tables

```sql
-- ============================================
-- TENANTS (Platform Level)
-- ============================================
CREATE TABLE tenants (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL, -- subdomain
    custom_domain VARCHAR(255) UNIQUE NULL,
    plan_id BIGINT NOT NULL,
    owner_id BIGINT NOT NULL, -- users.id (first admin)
    
    -- Branding
    logo VARCHAR(255) NULL,
    favicon VARCHAR(255) NULL,
    primary_color VARCHAR(7) DEFAULT '#0ea5e9',
    
    -- Settings
    settings JSONB DEFAULT '{}',
    
    -- Status
    status VARCHAR(20) DEFAULT 'active', -- active, suspended, cancelled
    
    -- Billing
    subscription_status VARCHAR(20) DEFAULT 'trialing',
    subscription_ends_at TIMESTAMP NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (plan_id) REFERENCES plans(id)
);

-- ============================================
-- PLANS (Subscription Tiers)
-- ============================================
CREATE TABLE plans (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL, -- Free, Pro, Enterprise
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NULL,
    
    -- Pricing
    price_monthly DECIMAL(10,2) DEFAULT 0,
    price_yearly DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Features (JSON untuk flexibility)
    features JSONB NOT NULL DEFAULT '{
        "max_portfolios": 3,
        "max_storage_mb": 100,
        "custom_domain": false,
        "analytics": false,
        "priority_support": false,
        "remove_branding": false
    }',
    
    -- Limits
    limits JSONB NOT NULL DEFAULT '{}',
    
    -- Display
    is_popular BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- USERS (Tenant-scoped)
-- ============================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    
    -- Basic Info
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    
    -- Profile (dari portfolio lama)
    avatar VARCHAR(255) NULL,
    bio TEXT NULL,
    location VARCHAR(255) NULL,
    website VARCHAR(255) NULL,
    
    -- Social Links
    github VARCHAR(255) NULL,
    linkedin VARCHAR(255) NULL,
    twitter VARCHAR(255) NULL,
    dribbble VARCHAR(255) NULL,
    behance VARCHAR(255) NULL,
    
    -- Role dalam tenant
    role VARCHAR(20) DEFAULT 'user', -- admin, editor, user
    
    -- OAuth
    google_id VARCHAR(255) NULL,
    
    -- 2FA
    two_factor_secret TEXT NULL,
    two_factor_recovery_codes TEXT NULL,
    two_factor_confirmed_at TIMESTAMP NULL,
    
    -- Timestamps
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Unique per tenant
    UNIQUE(tenant_id, email),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- ============================================
-- PORTFOLIOS (Tenant-scoped)
-- ============================================
CREATE TABLE portfolios (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    
    -- Basic Info
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT NULL,
    
    -- Content
    content JSONB NULL, -- Rich content blocks
    technologies JSONB DEFAULT '[]',
    
    -- Links
    github_url VARCHAR(255) NULL,
    live_url VARCHAR(255) NULL,
    
    -- Display
    featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP NULL,
    display_order INTEGER DEFAULT 0,
    
    -- SEO
    meta_title VARCHAR(255) NULL,
    meta_description TEXT NULL,
    og_image VARCHAR(255) NULL,
    
    -- Stats
    view_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Unique slug per tenant
    UNIQUE(tenant_id, slug),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- PORTFOLIO_IMAGES (Tenant-scoped)
-- ============================================
CREATE TABLE portfolio_images (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    portfolio_id BIGINT NOT NULL,
    
    image_path VARCHAR(255) NOT NULL,
    caption VARCHAR(255) NULL,
    is_main BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
);

-- ============================================
-- EXPERIENCES (Tenant-scoped)
-- ============================================
CREATE TABLE experiences (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    
    company VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    description TEXT NULL,
    
    start_date DATE NOT NULL,
    end_date DATE NULL,
    is_current BOOLEAN DEFAULT FALSE,
    
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- PAGE_VIEWS (Tenant-scoped Analytics)
-- ============================================
CREATE TABLE page_views (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    
    page VARCHAR(255) NOT NULL,
    portfolio_id BIGINT NULL,
    
    -- Visitor Info
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT NULL,
    referrer VARCHAR(255) NULL,
    country VARCHAR(2) NULL,
    
    -- Session
    session_id VARCHAR(255) NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE SET NULL
);

-- ============================================
-- SUBSCRIPTIONS (Billing)
-- ============================================
CREATE TABLE subscriptions (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    plan_id BIGINT NOT NULL,
    
    -- Stripe Integration
    stripe_subscription_id VARCHAR(255) NULL,
    stripe_customer_id VARCHAR(255) NULL,
    stripe_price_id VARCHAR(255) NULL,
    
    -- Status
    status VARCHAR(20) DEFAULT 'trialing', -- trialing, active, cancelled, past_due
    
    -- Period
    current_period_start TIMESTAMP NULL,
    current_period_end TIMESTAMP NULL,
    
    -- Trial
    trial_ends_at TIMESTAMP NULL,
    
    -- Cancellation
    cancelled_at TIMESTAMP NULL,
    cancellation_reason TEXT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES plans(id)
);

-- ============================================
-- INVOICES (Billing History)
-- ============================================
CREATE TABLE invoices (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    subscription_id BIGINT NULL,
    
    -- Stripe
    stripe_invoice_id VARCHAR(255) NULL,
    
    -- Amount
    amount_due DECIMAL(10,2) NOT NULL,
    amount_paid DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Status
    status VARCHAR(20) DEFAULT 'draft', -- draft, open, paid, void, uncollectible
    
    -- Period
    period_start TIMESTAMP NULL,
    period_end TIMESTAMP NULL,
    
    -- Dates
    due_date TIMESTAMP NULL,
    paid_at TIMESTAMP NULL,
    
    -- PDF
    invoice_pdf VARCHAR(255) NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_portfolios_tenant ON portfolios(tenant_id);
CREATE INDEX idx_portfolios_user ON portfolios(user_id);
CREATE INDEX idx_portfolio_images_portfolio ON portfolio_images(portfolio_id);
CREATE INDEX idx_experiences_tenant ON experiences(tenant_id);
CREATE INDEX idx_page_views_tenant ON page_views(tenant_id);
CREATE INDEX idx_page_views_created ON page_views(created_at);
CREATE INDEX idx_subscriptions_tenant ON subscriptions(tenant_id);
```

---

## 🔐 Tenant Scope Implementation

### Global Scope

```php
<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class TenantScope implements Scope
{
    protected static $tenantId = null;
    
    public static function setTenant($tenantId)
    {
        self::$tenantId = $tenantId;
    }
    
    public static function getTenant()
    {
        return self::$tenantId;
    }
    
    public function apply(Builder $builder, Model $model)
    {
        if (self::$tenantId) {
            $builder->where($model->getTable() . '.tenant_id', self::$tenantId);
        }
    }
}
```

### Tenant-aware Model Trait

```php
<?php

namespace App\Traits;

use App\Scopes\TenantScope;

trait BelongsToTenant
{
    protected static function bootBelongsToTenant()
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
        return $this->belongsTo(Tenant::class);
    }
}
```

---

## 🎨 Template System

### Template Structure

```
resources/js/templates/
├── modern/                 # Template: Modern
│   ├── components/
│   │   ├── Hero.tsx
│   │   ├── PortfolioGrid.tsx
│   │   ├── ExperienceTimeline.tsx
│   │   └── ContactSection.tsx
│   ├── styles/
│   │   └── theme.css
│   ├── config.ts           # Template configuration
│   └── index.tsx           # Template entry
├── minimal/                # Template: Minimal
├── creative/               # Template: Creative
└── developer/              # Template: Developer (current)
```

### Template Config

```typescript
// templates/modern/config.ts
export const templateConfig = {
  id: 'modern',
  name: 'Modern',
  description: 'Clean and modern portfolio template',
  thumbnail: '/templates/modern/thumbnail.jpg',
  
  // Supported sections
  sections: [
    'hero',
    'about',
    'portfolio',
    'experience',
    'skills',
    'contact'
  ],
  
  // Customizable options
  options: {
    heroLayout: ['centered', 'split', 'full'],
    colorScheme: ['light', 'dark', 'auto'],
    animations: ['none', 'subtle', 'full']
  },
  
  // Plan requirements
  requiredPlan: 'free' // atau 'pro' untuk template premium
};
```

---

## 📊 Feature Matrix by Plan

| Feature | Free | Pro ($9/mo) | Enterprise ($29/mo) |
|---------|------|-------------|---------------------|
| **Portfolios** | 3 | Unlimited | Unlimited |
| **Storage** | 100 MB | 5 GB | 50 GB |
| **Custom Domain** | ❌ | ✅ | ✅ |
| **Remove Branding** | ❌ | ✅ | ✅ |
| **Analytics** | Basic | Advanced | Advanced + Export |
| **Templates** | 2 | All | All + Custom |
| **Support** | Community | Priority | Dedicated |
| **Team Members** | 1 | 3 | Unlimited |
| **API Access** | ❌ | ✅ | ✅ |
| **White Label** | ❌ | ❌ | ✅ |

---

## 🚀 Deployment Architecture

### Production Setup

```yaml
# docker-compose.production.yml
version: '3.8'

services:
  # Load Balancer
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app

  # Application (Horizontally scalable)
  app:
    image: portfolify/app:latest
    environment:
      - APP_ENV=production
      - DB_HOST=postgres
      - REDIS_HOST=redis
      - AWS_S3_BUCKET=portfolify-assets
    deploy:
      replicas: 3
    depends_on:
      - postgres
      - redis

  # Queue Workers
  queue:
    image: portfolify/app:latest
    command: php artisan queue:work --queue=default,emails,exports
    deploy:
      replicas: 2
    depends_on:
      - postgres
      - redis

  # Scheduler
  scheduler:
    image: portfolify/app:latest
    command: php artisan schedule:work
    depends_on:
      - postgres

  # Database
  postgres:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=portfolify
      - POSTGRES_USER=portfolify
      - POSTGRES_PASSWORD=${DB_PASSWORD}

  # Cache
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  # File Storage (MinIO untuk self-hosted S3)
  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data
    environment:
      - MINIO_ROOT_USER=${MINIO_USER}
      - MINIO_ROOT_PASSWORD=${MINIO_PASSWORD}

volumes:
  postgres_data:
  redis_data:
  minio_data:
```

---

## 📋 Next Steps

1. **Setup Database Migration** → Lihat `02-MIGRASI-DATABASE.md`
2. **Implement Subscription System** → Lihat `03-SUBSCRIPTION-SYSTEM.md`
3. **API Documentation** → Lihat `04-API-DOCUMENTATION.md`
4. **Deployment Guide** → Lihat `05-DEPLOYMENT-GUIDE.md`

---

## 📝 Catatan Penting

1. **Data Migration**: Backup data existing sebelum migrasi
2. **Testing**: Buat test suite untuk multi-tenant functionality
3. **Security**: Implement rate limiting per tenant
4. **Monitoring**: Setup monitoring untuk tenant resource usage
5. **Compliance**: Pastikan GDPR compliance untuk EU users
