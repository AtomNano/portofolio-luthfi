# Portofolio Luthfi

> 🚀 Personal portfolio website built with Laravel + React + Inertia.js

![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=flat&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Inertia.js](https://img.shields.io/badge/Inertia.js-2-9553E9?style=flat&logo=inertia&logoColor=white)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Development](#-development)
- [Deployment](#-deployment)
- [License](#-license)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎨 **Modern UI** | Dark theme with cyan accents, smooth animations |
| 📱 **Responsive** | Mobile-first design with hamburger menu |
| 🖼️ **Multi-Image Portfolio** | Carousel, lightbox, and image management |
| 📊 **Visitor Statistics** | Track page views and portfolio clicks |
| 🔐 **Admin Dashboard** | Secure content management |
| ⚡ **Fast** | Inertia.js SPA-like navigation |

---

## 🛠️ Tech Stack

### Backend
- **[Laravel 11](https://laravel.com)** - PHP Framework
- **[Inertia.js](https://inertiajs.com)** - Modern monolith

### Frontend
- **[React 19](https://react.dev)** - UI Library
- **[Tailwind CSS 4](https://tailwindcss.com)** - Styling
- **[Framer Motion](https://www.framer.com/motion/)** - Animations
- **[Lucide React](https://lucide.dev)** - Icons
- **[Shadcn UI](https://ui.shadcn.com)** - Component library

### Database
- **SQLite** (default) or **MySQL**

---

## 📁 Project Structure

```
portofolio-luthfi/
├── app/
│   ├── Http/Controllers/    # API & page controllers
│   └── Models/              # Eloquent models
├── database/
│   └── migrations/          # Database schemas
├── resources/
│   ├── js/
│   │   ├── components/      # Reusable React components
│   │   ├── layouts/         # App layouts (auth, dashboard)
│   │   └── pages/           # Inertia pages
│   └── views/               # Blade templates (app.blade.php)
├── routes/
│   └── web.php              # Web routes
├── public/                  # Static assets
└── storage/                 # Uploads & cache
```

---

## ⚙️ Installation

### Prerequisites

- PHP >= 8.2
- Composer
- Node.js >= 18 & npm
- SQLite or MySQL

### Quick Start

```bash
# 1. Clone repository
git clone https://github.com/yourusername/portofolio-luthfi.git
cd portofolio-luthfi

# 2. Install dependencies
composer install
npm install

# 3. Environment setup
cp .env.example .env
php artisan key:generate

# 4. Database setup
php artisan migrate

# 5. Storage link (for image uploads)
php artisan storage:link
```

---

## 🏃 Development

Start the development server:

```bash
composer run dev
```

This runs Laravel + Vite + Queue concurrently.

**Access:** http://localhost:8000

### Available Scripts

| Command | Description |
|---------|-------------|
| `composer run dev` | Start dev server (all services) |
| `npm run build` | Build for production |
| `php artisan migrate` | Run migrations |
| `php artisan queue:work` | Process queued jobs |

---

## 🚀 Deployment

```bash
# Build production assets
npm run build

# Optimize Laravel
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 📝 License

Open-sourced under the [MIT License](https://opensource.org/licenses/MIT).

---

**Made with ❤️ by Muhammad Luthfi Naldi**
