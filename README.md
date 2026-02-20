# OmsetHarian x Portolink 🚀

Welcome to **OmsetHarian x Portolink**, a complete Software-as-a-Service (SaaS) platform built for modern freelancers and agencies. It combines highly customizable portfolio generation with deeply integrated sales & daily revenue (omset) tracking analytics.

This repository operates on a true **Multi-Tenant Architecture**, meaning a single codebase powers distinct and isolated workspaces for hundreds of different registered users natively.

---

## 🛠 Tech Stack

- **Backend:** Laravel 12.x (PHP 8.4)
- **Frontend:** React 19 + Inertia.js v2 + TailwindCSS v4
- **Database:** SQLite (Local) / MySQL or PostgreSQL (Production)
- **Testing:** Pest PHP v4
- **UI Components:** Shadcn UI + Radix UI + Recharts
- **Icons:** Lucide-React

---

## 💻 Local Development (Installation)

To set up this project locally on your machine for development or testing:

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/your-username/portolink.git
    cd portolink
    ```

2.  **Install PHP Dependencies**

    ```bash
    composer install
    ```

3.  **Install Node Dependencies**

    ```bash
    npm install
    ```

4.  **Environment Configuration**

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

    _Open `.env` and set your preferred database (sqlite is recommended for local)._

5.  **Run Database Migrations & Seeders**

    ```bash
    php artisan migrate:fresh --seed
    ```

    _This will create the "Free" and "Pro" SaaS Subscription Plans, and generate the default Superadmin account._

6.  **Run the Development Servers**
    Open two terminal tabs:

    ```bash
    # Terminal 1: Vite Frontend Server
    npm run dev

    # Terminal 2: Laravel Backend Server
    php artisan serve
    ```

---

## 👑 Superadmin Panel & Moderation

This system comes with a "God Mode" panel for the repository owner to monitor all tenants, adjust billing, and moderate content.

**Login Credentials (Seeded):**

- **Email:** `admin@admin.com`
- **Password:** `password`

From the Dashboard sidebar, administrators have exclusive access to:

- **Global Portfolios:** View every single portfolio uploaded by any user. Admins can click the 🔗 external link to view what the public sees, or click the Trash icon to take down inappropriate content instantly.
- **Users & Tenants:** Manually upgrade users to "Pro" plans to bypass paywalls, edit their credentials, or permanently ban/delete them from the platform.
- **Revenue Ledger:** View all incoming international/local payment gateway webhook events.

---

## 🚀 Deployment Guide (Production)

This repository is strictly designed to be deployed on both **Shared Hosting (cPanel)** or **Virtual Private Servers (VPS)** gracefully.

### Option A: Shared Hosting / cPanel Setup

1.  **Repository Upload:** Compress the entire project into a `.zip` and upload it to your domain's root folder (e.g., `public_html/portolink/`).
2.  **The `.htaccess` Router:** We have included a bespoke `.htaccess` file at the root of the project. This script tells Apache to natively strip away `/public/` from URLs and route traffic seamlessly, protecting your `.env` variables from public exposure.
3.  **Database:** Create a MySQL Database in cPanel, update your `.env` credentials, and run your migrations.

### Option B: VPS (Nginx / DigitalOcean / AWS)

If deploying to a VPS (Ubuntu), do **not** use `artisan serve` or Apache.

1.  **Nginx Block:** Copy the contents of the `nginx.conf.example` file provided in this repository, and paste it into `/etc/nginx/sites-available/yourdomain.com`.
2.  **PHP-FPM:** Ensure the `fastcgi_pass` directive points to your active PHP 8.4 FPM sock limit (`/var/run/php/php8.4-fpm.sock`).

### 🔄 The Quick-Deploy CLI Script (`deploy.sh`)

For VPS setups, pulling new updates from GitHub manually can cause temporary crashes or N+1 caching errors. To update your live application safely, run the provided bash script:

```bash
bash deploy.sh
```

**What `deploy.sh` does natively:**

1.  Puts the live application into a beautiful `503 Maintenance Mode`.
2.  Pulls the latest code from the `main` git branch.
3.  Runs `composer install --optimize-auto` avoiding dev dependencies.
4.  Compiles the newest React JSX components `npm run build`.
5.  Triggers new structural migrations `php artisan migrate --force`.
6.  Re-caches routes, views, and events for maximum loading speed.
7.  Takes the application elegantly out of Maintenance Mode.

---

## 🧪 Automated Testing (Pest PHP)

This application strictly enforces test-driven stability. Before deploying any massive structural changes, execute the Pest testing suite to verify system integrity:

```bash
php artisan test --compact
```

_Zero failures are expected out-of-the-box. The `IdentifyTenant` middleware is explicitly designed to adapt to unseeded test environments securely._

---

_Built with ❤️ for modern software scalability._
