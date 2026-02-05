# Contributing to Portofolio Luthfi

Terima kasih telah tertarik untuk berkontribusi! 🎉

## 📌 Panduan Cepat

### 1. Setup Development

```bash
# Clone & install
git clone https://github.com/yourusername/portofolio-luthfi.git
cd portofolio-luthfi
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link

# Run development server
composer run dev
```

### 2. Struktur Branch

| Branch | Deskripsi |
|--------|-----------|
| `main` | Production-ready code |
| `develop` | Development branch |
| `feature/*` | Fitur baru |
| `fix/*` | Bug fixes |

### 3. Commit Convention

Gunakan format commit yang konsisten:

```
type(scope): deskripsi singkat

Contoh:
feat(portfolio): tambah fitur multi-image upload
fix(auth): perbaiki redirect setelah login
style(dashboard): update warna tombol
docs(readme): update dokumentasi instalasi
```

**Types:**
- `feat` - Fitur baru
- `fix` - Bug fix
- `style` - Perubahan styling (CSS, UI)
- `refactor` - Refactoring code
- `docs` - Dokumentasi
- `test` - Testing

### 4. Code Style

- **PHP**: Gunakan Laravel Pint (`./vendor/bin/pint`)
- **JavaScript/TypeScript**: Gunakan ESLint & Prettier (`npm run lint`)
- **Tailwind**: Gunakan utility classes yang konsisten

### 5. Testing

```bash
# Run PHP tests
php artisan test

# Run Pint (PHP linter)
./vendor/bin/pint

# Run ESLint
npm run lint
```

---

## 📁 Struktur Folder Penting

```
app/
├── Http/Controllers/     # Controller logic
│   ├── HomeController.php
│   ├── PortfolioController.php
│   └── PortfolioImageController.php
└── Models/               # Database models
    ├── Portfolio.php
    ├── PortfolioImage.php
    └── PageView.php

resources/js/
├── components/           # Reusable components
├── layouts/              # Page layouts
└── pages/
    ├── welcome.tsx       # Landing page
    ├── dashboard.tsx     # Admin dashboard
    └── portfolios/       # Portfolio pages
```

---

## ❓ Pertanyaan?

Buat issue di GitHub atau hubungi maintainer.

**Happy coding!** 🚀
