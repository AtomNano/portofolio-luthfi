# Portofolio Luthfi

> 🚀 Modern Personal Portfolio built with **Laravel 12**, **React 19**, and **Inertia.js 2.0**.

![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=flat&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Inertia.js](https://img.shields.io/badge/Inertia.js-2-9553E9?style=flat&logo=inertia&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

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
| 🎨 **Modern UI/UX** | **Dark/Light Mode** support with a custom "Blue Programming" theme, Glassmorphism effects, and smooth Framer Motion animations. |
| 📱 **Responsive Design** | Mobile-first approach with a responsive sidebar and navigation. |
| 🖼️ **Portfolio Management** | scalable CRUD system for projects with **multi-image upload**, drag-and-drop reordering, and automated image optimization. |
| 💼 **Experience Timeline** | Professional experience management with a visual timeline layout. |
| 📊 **Dashboard & Stats** | Admin dashboard with real-time visitor statistics (page views, portfolio clicks) and chart visualizations. |
| 🔐 **Authentication** | Secure login system using **Laravel Fortify** and **Google OAuth** (Socialite). |
| ⚡ **High Performance** | Built as a Single Page Application (SPA) using **Inertia.js** for seamless navigation without full page reloads. |

---

## 🛠️ Tech Stack

### Backend
- **[Laravel 12](https://laravel.com)** - The PHP Framework for Web Artisans.
- **[Inertia.js v2](https://inertiajs.com)** - Server-driven React apps.
- **[Laravel Fortify](https://laravel.com/docs/fortify)** - Headless authentication backend.
- **[Laravel Socialite](https://laravel.com/docs/socialite)** - OAuth integration.
- **[Wayfinder](https://github.com/tomschlick/wayfinder)** - Type-safe route generation for frontend.
- **MySQL / SQLite** - Database.

### Frontend
- **[React 19](https://react.dev)** - The library for web and native user interfaces.
- **[TypeScript](https://www.typescriptlang.org/)** - Strictly typed JavaScript.
- **[Tailwind CSS v4](https://tailwindcss.com)** - A utility-first CSS framework (Oxide engine).
- **[Shadcn UI](https://ui.shadcn.com)** - Reusable components built with Radix UI and Tailwind.
- **[Framer Motion](https://www.framer.com/motion/)** - Production-ready animation library.
- **[Lucide React](https://lucide.dev)** - Beautiful & consistent icons.
- **[Dnd Kit](https://dndkit.com)** - Lightweight, performant, accessible drag and drop.

---

## 📁 Project Structure

```
portofolio-luthfi/
├── app/
│   ├── Http/Controllers/    # Backend logic (Portfolio, Experience, Stats)
│   └── Models/              # Eloquent Models (User, Portfolio, PageView)
├── database/
│   └── migrations/          # Database schemas
├── resources/
│   ├── css/                 # Tailwind CSS v4 entry
│   ├── js/
│   │   ├── components/      # Reusable React components (UI, Forms)
│   │   ├── hooks/           # Custom hooks (useAppearance, use-mobile)
│   │   ├── layouts/         # App layouts (AppSidebarLayout, GuestLayout)
│   │   └── pages/           # Inertia Pages (Welcome, Dashboard, etc.)
│   └── views/               # Root Blade template
├── routes/
│   └── web.php              # Web Routes
├── public/                  # Static assets & build output
└── storage/                 # Uploaded files
```

---

## ⚙️ Installation

### Prerequisites
- PHP >= 8.2
- Composer
- Node.js >= 20 & npm
- MySQL or SQLite

### Quick Start

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/portofolio-luthfi.git
    cd portofolio-luthfi
    ```

2.  **Install Dependencies**
    ```bash
    composer install
    npm install
    ```

3.  **Environment Setup**
    ```bash
    cp .env.example .env
    php artisan key:generate
    ```
    *Configure your database credentials in `.env`.*

4.  **Database Migration**
    ```bash
    php artisan migrate
    ```

5.  **Storage Link**
    ```bash
    php artisan storage:link
    ```

---

## 🏃 Development

Start the development server with a single command (runs Laravel, Vite, and Queue Worker concurrently):

```bash
composer run dev
```

**Access:** http://localhost:8000

---

## 🚀 Deployment

1.  **Build Assets**
    ```bash
    npm run build
    ```

2.  **Optimize Laravel**
    ```bash
    php artisan optimize
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    ```

3.  **Ensure Storage Permissions**
    ```bash
    chmod -R 775 storage bootstrap/cache
    ```

---

## 📝 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

Copyright © 2026 **Muhammad Luthfi Naldi**.
