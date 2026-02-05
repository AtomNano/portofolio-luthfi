# Code Structure Documentation

> 📚 Panduan struktur kode untuk developer

## 🗂️ Struktur Direktori

```
portofolio-luthfi/
│
├── app/                          # Backend Laravel
│   ├── Http/
│   │   └── Controllers/          # Request handlers
│   │       ├── HomeController.php           # Landing page + tracking
│   │       ├── PortfolioController.php      # Portfolio CRUD + stats
│   │       └── PortfolioImageController.php # Multi-image management
│   │
│   └── Models/                   # Database models
│       ├── Portfolio.php         # Portfolio model
│       ├── PortfolioImage.php    # Portfolio images
│       ├── PageView.php          # Visitor tracking
│       └── User.php              # User authentication
│
├── database/
│   └── migrations/               # Database schemas
│       ├── *_create_portfolios_table.php
│       ├── *_create_portfolio_images_table.php
│       └── *_create_page_views_table.php
│
├── resources/
│   ├── js/
│   │   ├── components/           # Reusable React components
│   │   │   ├── app-logo.tsx      # Sidebar logo (dynamic user name)
│   │   │   ├── app-sidebar.tsx   # Main sidebar navigation
│   │   │   └── ui/               # Shadcn UI components
│   │   │
│   │   ├── layouts/              # Page layouts
│   │   │   ├── app-layout.tsx    # Dashboard layout
│   │   │   └── auth/             # Auth layouts
│   │   │
│   │   ├── pages/                # Inertia pages
│   │   │   ├── welcome.tsx       # Landing page (public)
│   │   │   ├── dashboard.tsx     # Admin dashboard
│   │   │   ├── portfolios/
│   │   │   │   └── show.tsx      # Public portfolio detail
│   │   │   └── dashboard/
│   │   │       └── portfolios/
│   │   │           ├── index.tsx # Portfolio list (admin)
│   │   │           ├── create.tsx # Create portfolio
│   │   │           ├── edit.tsx  # Edit portfolio
│   │   │           └── show.tsx  # Portfolio detail (admin)
│   │   │
│   │   └── routes/               # Auto-generated route helpers
│   │
│   └── views/
│       └── app.blade.php         # Main HTML template
│
├── routes/
│   └── web.php                   # Web routes definition
│
└── public/
    └── storage/                  # Symlinked storage (uploads)
        └── portfolios/           # Portfolio images
```

---

## 🔑 Key Files Explained

### Backend

| File | Purpose |
|------|---------|
| `HomeController.php` | Landing page + visitor tracking |
| `PortfolioController.php` | Portfolio CRUD + statistics API |
| `PortfolioImageController.php` | Multi-image upload/delete/reorder |
| `Portfolio.php` | Portfolio model with `images` relationship |
| `PortfolioImage.php` | Image model with `portfolio` relationship |
| `PageView.php` | Visitor tracking model |

### Frontend

| File | Purpose |
|------|---------|
| `welcome.tsx` | Landing page (hero, about, services, portfolio) |
| `dashboard.tsx` | Admin dashboard with statistics |
| `portfolios/show.tsx` | Public portfolio detail (carousel, lightbox) |
| `dashboard/portfolios/index.tsx` | Admin portfolio list |
| `dashboard/portfolios/show.tsx` | Admin portfolio detail (image management) |
| `app-sidebar.tsx` | Dashboard sidebar navigation |

---

## 🔄 Data Flow

### Portfolio Creation Flow
```
User fills form (create.tsx)
    ↓
POST /dashboard/portfolios
    ↓
PortfolioController::store()
    ↓
Save to database + upload images
    ↓
Redirect to portfolio list
```

### Visitor Tracking Flow
```
User visits page
    ↓
HomeController/PortfolioController
    ↓
PageView::create() with IP
    ↓
Statistics displayed in dashboard
```

---

## 🎨 Styling Convention

- **Theme**: Dark mode (`bg-gray-950`, `bg-gray-900`, `bg-gray-800`)
- **Accent**: Cyan (`text-cyan-400`, `bg-cyan-600`)
- **Borders**: `border-gray-800`, `border-gray-700`
- **Focus**: `focus:ring-cyan-500`, `focus:border-cyan-500`

---

## 📝 Naming Conventions

- **Controllers**: `PascalCase` + `Controller` suffix
- **Models**: `PascalCase` (singular)
- **Components**: `PascalCase` + `.tsx`
- **Routes**: `kebab-case` URLs
- **Database**: `snake_case` tables/columns

---

## 🔧 Common Tasks

### Add New Page
1. Create page in `resources/js/pages/`
2. Add route in `routes/web.php`
3. Create controller method
4. Return `Inertia::render('page-name', $data)`

### Add New Component
1. Create in `resources/js/components/`
2. Import where needed
3. Use TypeScript for props

### Add New Model
1. Create migration: `php artisan make:migration create_table_name`
2. Create model: `php artisan make:model ModelName`
3. Define relationships in model
4. Run migration: `php artisan migrate`
