# 🔌 API Documentation - Portfolify SaaS

## 📋 Ringkasan

Dokumentasi lengkap API Portfolify SaaS untuk integrasi pihak ketiga dan custom development.

---

## 🔐 Authentication

### API Token

Semua request ke API memerlukan authentication token.

```http
GET /api/v1/portfolios
Authorization: Bearer {your-api-token}
```

### Mendapatkan API Token

```http
POST /api/v1/auth/token
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "expires_at": "2026-03-15T12:00:00Z"
}
```

---

## 📍 Base URL

```
Production:  https://api.portfolify.app/v1
Staging:     https://api-staging.portfolify.app/v1
Local:       http://localhost:8000/api/v1
```

---

## 📊 Rate Limiting

| Plan | Rate Limit |
|------|------------|
| Free | 100 requests/hour |
| Pro | 1000 requests/hour |
| Enterprise | 10000 requests/hour |

**Headers:**
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1644925200
```

---

## 🔁 Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "current_page": 1,
    "last_page": 10,
    "per_page": 20,
    "total": 200
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The given data was invalid.",
    "details": {
      "title": ["The title field is required."]
    }
  }
}
```

---

## 📁 Endpoints

### 1. Portfolios

#### List Portfolios

```http
GET /api/v1/portfolios
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number |
| `per_page` | integer | Items per page (max 100) |
| `search` | string | Search by title |
| `featured` | boolean | Filter featured only |
| `sort` | string | `created_at`, `updated_at`, `title`, `view_count` |
| `order` | string | `asc` or `desc` |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "E-Commerce Platform",
      "slug": "e-commerce-platform",
      "description": "Full-stack e-commerce solution",
      "technologies": ["Laravel", "React", "MySQL"],
      "github_url": "https://github.com/user/project",
      "live_url": "https://example.com",
      "featured": true,
      "is_published": true,
      "view_count": 1250,
      "click_count": 340,
      "published_at": "2026-01-15T10:00:00Z",
      "created_at": "2026-01-10T08:00:00Z",
      "updated_at": "2026-02-01T12:00:00Z",
      "images": [
        {
          "id": 1,
          "url": "https://cdn.portfolify.app/tenants/1/portfolios/1/image1.jpg",
          "caption": "Homepage",
          "is_main": true
        }
      ]
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 20,
    "total": 100
  }
}
```

#### Get Single Portfolio

```http
GET /api/v1/portfolios/{slug}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "E-Commerce Platform",
    "slug": "e-commerce-platform",
    "description": "Full-stack e-commerce solution",
    "content": {
      "blocks": [
        {
          "type": "text",
          "content": "Detailed project description..."
        },
        {
          "type": "image",
          "url": "https://cdn.portfolify.app/...",
          "caption": "Architecture diagram"
        }
      ]
    },
    "technologies": ["Laravel", "React", "MySQL", "Redis"],
    "github_url": "https://github.com/user/project",
    "live_url": "https://example.com",
    "featured": true,
    "is_published": true,
    "view_count": 1250,
    "click_count": 340,
    "meta_title": "E-Commerce Platform | Portfolio",
    "meta_description": "Full-stack e-commerce solution built with Laravel and React",
    "og_image": "https://cdn.portfolify.app/...",
    "published_at": "2026-01-15T10:00:00Z",
    "created_at": "2026-01-10T08:00:00Z",
    "updated_at": "2026-02-01T12:00:00Z",
    "images": [...],
    "experiences": [...]
  }
}
```

#### Create Portfolio

```http
POST /api/v1/portfolios
Content-Type: application/json

{
  "title": "New Project",
  "description": "Project description",
  "technologies": ["Vue.js", "Node.js", "MongoDB"],
  "github_url": "https://github.com/user/new-project",
  "live_url": "https://new-project.com",
  "featured": false,
  "is_published": true,
  "content": {
    "blocks": [
      {
        "type": "text",
        "content": "Project overview..."
      }
    ]
  },
  "meta_title": "New Project | Portfolio",
  "meta_description": "Description for SEO"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "New Project",
    "slug": "new-project",
    ...
  }
}
```

#### Update Portfolio

```http
PUT /api/v1/portfolios/{slug}
Content-Type: application/json

{
  "title": "Updated Project Name",
  "description": "Updated description"
}
```

#### Delete Portfolio

```http
DELETE /api/v1/portfolios/{slug}
```

**Response:**
```json
{
  "success": true,
  "message": "Portfolio deleted successfully"
}
```

#### Upload Portfolio Images

```http
POST /api/v1/portfolios/{slug}/images
Content-Type: multipart/form-data

images[]: <file1.jpg>
images[]: <file2.jpg>
captions[]: "Screenshot 1"
captions[]: "Screenshot 2"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "url": "https://cdn.portfolify.app/...",
      "caption": "Screenshot 1",
      "is_main": false
    },
    {
      "id": 4,
      "url": "https://cdn.portfolify.app/...",
      "caption": "Screenshot 2",
      "is_main": false
    }
  ]
}
```

#### Reorder Images

```http
POST /api/v1/portfolios/{slug}/images/reorder
Content-Type: application/json

{
  "order": [3, 1, 2, 4]
}
```

---

### 2. Experiences

#### List Experiences

```http
GET /api/v1/experiences
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "company": "Tech Corp",
      "position": "Senior Developer",
      "description": "Leading development team...",
      "start_date": "2024-01-01",
      "end_date": null,
      "is_current": true,
      "order": 1
    },
    {
      "id": 2,
      "company": "Startup Inc",
      "position": "Full Stack Developer",
      "description": "Built core product...",
      "start_date": "2022-06-01",
      "end_date": "2023-12-31",
      "is_current": false,
      "order": 2
    }
  ]
}
```

#### Create Experience

```http
POST /api/v1/experiences
Content-Type: application/json

{
  "company": "New Company",
  "position": "Tech Lead",
  "description": "Leading engineering team",
  "start_date": "2025-01-01",
  "is_current": true
}
```

#### Update Experience

```http
PUT /api/v1/experiences/{id}
Content-Type: application/json

{
  "position": "Senior Tech Lead",
  "description": "Updated description"
}
```

#### Delete Experience

```http
DELETE /api/v1/experiences/{id}
```

---

### 3. Analytics

#### Get Dashboard Stats

```http
GET /api/v1/analytics/dashboard
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_views": 15234,
    "total_clicks": 4521,
    "unique_visitors": 8932,
    "views_change": 12.5,
    "clicks_change": 8.3,
    "period": "last_30_days"
  }
}
```

#### Get Portfolio Analytics

```http
GET /api/v1/analytics/portfolios
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "portfolio_id": 1,
      "title": "E-Commerce Platform",
      "views": 5234,
      "clicks": 1234,
      "ctr": 23.6
    },
    {
      "portfolio_id": 2,
      "title": "Mobile App",
      "views": 3123,
      "clicks": 890,
      "ctr": 28.5
    }
  ]
}
```

#### Get Time Series Data

```http
GET /api/v1/analytics/timeseries?period=30d&metric=views
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `period` | string | `7d`, `30d`, `90d`, `1y` |
| `metric` | string | `views`, `clicks`, `visitors` |
| `portfolio_id` | integer | Filter by portfolio (optional) |

**Response:**
```json
{
  "success": true,
  "data": {
    "labels": ["2026-01-15", "2026-01-16", "2026-01-17", ...],
    "datasets": [
      {
        "label": "Views",
        "data": [120, 145, 132, 189, 201, ...]
      }
    ]
  }
}
```

#### Get Geographic Data

```http
GET /api/v1/analytics/geography
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "country": "US",
      "country_name": "United States",
      "views": 5234,
      "percentage": 45.2
    },
    {
      "country": "ID",
      "country_name": "Indonesia",
      "views": 3123,
      "percentage": 27.1
    }
  ]
}
```

---

### 4. Billing

#### Get Current Plan

```http
GET /api/v1/billing/plan
```

**Response:**
```json
{
  "success": true,
  "data": {
    "plan": {
      "id": 2,
      "name": "Pro",
      "slug": "pro",
      "description": "For serious professionals",
      "price_monthly": 9.00,
      "price_yearly": 90.00,
      "features": {
        "max_portfolios": null,
        "max_storage_mb": 5120,
        "custom_domain": true,
        "analytics": true,
        "remove_branding": true
      }
    },
    "subscription": {
      "status": "active",
      "current_period_start": "2026-02-01T00:00:00Z",
      "current_period_end": "2026-03-01T00:00:00Z",
      "trial_ends_at": null,
      "cancel_at_period_end": false
    },
    "usage": {
      "portfolios": 12,
      "storage_mb": 2345,
      "storage_percentage": 45.7
    }
  }
}
```

#### Get Available Plans

```http
GET /api/v1/billing/plans
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Free",
      "slug": "free",
      "price_monthly": 0,
      "price_yearly": 0,
      "features": { ... },
      "is_current": false
    },
    {
      "id": 2,
      "name": "Pro",
      "slug": "pro",
      "price_monthly": 9.00,
      "price_yearly": 90.00,
      "features": { ... },
      "is_current": true,
      "is_popular": true
    },
    {
      "id": 3,
      "name": "Enterprise",
      "slug": "enterprise",
      "price_monthly": 29.00,
      "price_yearly": 290.00,
      "features": { ... },
      "is_current": false
    }
  ]
}
```

#### Create Checkout Session

```http
POST /api/v1/billing/checkout
Content-Type: application/json

{
  "plan_slug": "pro",
  "billing_interval": "year", // or "month"
  "success_url": "https://yourdomain.com/billing/success",
  "cancel_url": "https://yourdomain.com/billing/cancel"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "session_id": "cs_live_...",
    "checkout_url": "https://checkout.stripe.com/..."
  }
}
```

#### Get Invoices

```http
GET /api/v1/billing/invoices
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "amount_due": 9.00,
      "amount_paid": 9.00,
      "currency": "USD",
      "status": "paid",
      "period_start": "2026-01-01T00:00:00Z",
      "period_end": "2026-02-01T00:00:00Z",
      "paid_at": "2026-01-01T10:30:00Z",
      "invoice_pdf": "https://pay.stripe.com/invoice/..."
    }
  ]
}
```

#### Cancel Subscription

```http
POST /api/v1/billing/cancel
Content-Type: application/json

{
  "at_period_end": true,
  "reason": "Switching to another platform"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription will be cancelled at the end of the billing period",
  "data": {
    "cancel_at": "2026-03-01T00:00:00Z"
  }
}
```

---

### 5. Settings

#### Get Settings

```http
GET /api/v1/settings
```

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "Luthfi's Portfolio",
    "slug": "luthfi",
    "custom_domain": "portfolio.luthfi.dev",
    "primary_color": "#0ea5e9",
    "logo": "https://cdn.portfolify.app/...",
    "favicon": "https://cdn.portfolify.app/...",
    "seo": {
      "meta_title": "Luthfi | Full Stack Developer",
      "meta_description": "Portfolio of Luthfi, a full stack developer...",
      "og_image": "https://cdn.portfolify.app/..."
    },
    "social": {
      "github": "https://github.com/luthfi",
      "linkedin": "https://linkedin.com/in/luthfi",
      "twitter": "https://twitter.com/luthfi"
    }
  }
}
```

#### Update Settings

```http
PUT /api/v1/settings
Content-Type: application/json

{
  "name": "Updated Name",
  "primary_color": "#3b82f6",
  "seo": {
    "meta_title": "Updated Title",
    "meta_description": "Updated description"
  },
  "social": {
    "github": "https://github.com/newusername"
  }
}
```

#### Update Custom Domain

```http
PUT /api/v1/settings/domain
Content-Type: application/json

{
  "custom_domain": "portfolio.newdomain.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "custom_domain": "portfolio.newdomain.com",
    "dns_records": [
      {
        "type": "CNAME",
        "name": "portfolio",
        "value": "cname.portfolify.app",
        "ttl": 3600
      }
    ],
    "status": "pending_verification"
  }
}
```

---

## 🚨 Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing API token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Invalid input data |
| `RATE_LIMITED` | 429 | Too many requests |
| `PLAN_LIMIT_REACHED` | 403 | Plan limit exceeded |
| `INTERNAL_ERROR` | 500 | Server error |

---

## 📚 SDK Examples

### JavaScript/TypeScript

```typescript
// api-client.ts
class PortfolifyAPI {
  private baseURL: string;
  private token: string;
  
  constructor(token: string, baseURL = 'https://api.portfolify.app/v1') {
    this.token = token;
    this.baseURL = baseURL;
  }
  
  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    return response.json();
  }
  
  // Portfolios
  async getPortfolios(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params) : '';
    return this.request(`/portfolios${query}`);
  }
  
  async getPortfolio(slug: string) {
    return this.request(`/portfolios/${slug}`);
  }
  
  async createPortfolio(data: Record<string, any>) {
    return this.request('/portfolios', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  async updatePortfolio(slug: string, data: Record<string, any>) {
    return this.request(`/portfolios/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
  
  async deletePortfolio(slug: string) {
    return this.request(`/portfolios/${slug}`, {
      method: 'DELETE',
    });
  }
  
  // Analytics
  async getDashboardStats() {
    return this.request('/analytics/dashboard');
  }
  
  async getTimeSeries(period: string, metric: string) {
    return this.request(`/analytics/timeseries?period=${period}&metric=${metric}`);
  }
  
  // Billing
  async getCurrentPlan() {
    return this.request('/billing/plan');
  }
  
  async getInvoices() {
    return this.request('/billing/invoices');
  }
}

// Usage
const api = new PortfolifyAPI('your-api-token');

const portfolios = await api.getPortfolios({ page: '1', per_page: '10' });
const stats = await api.getDashboardStats();
```

### Python

```python
# portfolify_api.py
import requests
from typing import Optional, Dict, Any

class PortfolifyAPI:
    def __init__(self, token: str, base_url: str = "https://api.portfolify.app/v1"):
        self.token = token
        self.base_url = base_url
        self.headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
    
    def _request(self, method: str, endpoint: str, **kwargs) -> Dict[str, Any]:
        url = f"{self.base_url}{endpoint}"
        response = requests.request(method, url, headers=self.headers, **kwargs)
        response.raise_for_status()
        return response.json()
    
    def get_portfolios(self, **params) -> Dict[str, Any]:
        return self._request("GET", "/portfolios", params=params)
    
    def get_portfolio(self, slug: str) -> Dict[str, Any]:
        return self._request("GET", f"/portfolios/{slug}")
    
    def create_portfolio(self, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._request("POST", "/portfolios", json=data)
    
    def update_portfolio(self, slug: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._request("PUT", f"/portfolios/{slug}", json=data)
    
    def delete_portfolio(self, slug: str) -> Dict[str, Any]:
        return self._request("DELETE", f"/portfolios/{slug}")
    
    def get_dashboard_stats(self) -> Dict[str, Any]:
        return self._request("GET", "/analytics/dashboard")
    
    def get_time_series(self, period: str, metric: str) -> Dict[str, Any]:
        return self._request("GET", "/analytics/timeseries", 
                           params={"period": period, "metric": metric})

# Usage
api = PortfolifyAPI("your-api-token")

portfolios = api.get_portfolios(page=1, per_page=10)
stats = api.get_dashboard_stats()
```

---

## 🧪 Testing with cURL

```bash
# Get portfolios
curl -X GET \
  https://api.portfolify.app/v1/portfolios \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create portfolio
curl -X POST \
  https://api.portfolify.app/v1/portfolios \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Project",
    "description": "Project description",
    "technologies": ["React", "Node.js"]
  }'

# Get analytics
curl -X GET \
  https://api.portfolify.app/v1/analytics/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get billing info
curl -X GET \
  https://api.portfolify.app/v1/billing/plan \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📖 Changelog

### v1.0.0 (2026-02-15)
- Initial API release
- Portfolio CRUD operations
- Analytics endpoints
- Billing integration
- Settings management
