# Portofolio Luthfi

Welcome to the **Portofolio Luthfi** project! This is a modern, responsive personal portfolio website built to showcase skills, services, and projects. It is designed with a focus on aesthetics, user experience, and performance.

## 🚀 Features

-   **Dynamic Portfolio**: Showcase your projects with images, descriptions, and links.
-   **Services Section**: Highlight the services you offer (Web Dev, Mobile Dev, UI/UX, IT Support).
-   **Animated UI**: Smooth transitions and animations using `framer-motion` and `react-type-animation`.
-   **Responsive Design**: Fully responsive layout optimized for all devices.
-   **Admin Dashboard**: Manage your portfolio items securely (authentication required).
-   **Modern Tech Stack**: Built with the latest technologies for speed and scalability.

## 🛠️ Technology Stack

This project leverages the power of the TALL stack (Tailwind, Alpine - *replaced by React here*, Laravel, Livewire - *replaced by Inertia here*) ecosystem, specifically:

-   **Backend**: [Laravel 11](https://laravel.com) - A robust PHP framework.
-   **Frontend**: [React 19](https://react.dev) - A JavaScript library for building user interfaces.
-   **Adapter**: [Inertia.js](https://inertiajs.com) - The glue between Laravel and React.
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com) - A utility-first CSS framework.
-   **Icons**: [Lucide React](https://lucide.dev) - Beautiful & consistent icons.
-   **Database**: SQLite (default) or MySQL.

## ⚙️ Installation & Setup

Follow these steps to get the project running on your local machine.

### Prerequisites

-   PHP >= 8.2
-   Composer
-   Node.js & npm

### Steps

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/portofolio-luthfi.git
    cd portofolio-luthfi
    ```

2.  **Install PHP dependencies**
    ```bash
    composer install
    ```

3.  **Install Node.js dependencies**
    ```bash
    npm install
    ```

4.  **Environment Setup**
    Copy the `.env.example` file to `.env` and configure it (a default SQLite setup is provided).
    ```bash
    cp .env.example .env
    ```
    *Note: If you are using Windows, you can just manually copy and rename or use `copy .env.example .env`.*

5.  **Generate Application Key**
    ```bash
    php artisan key:generate
    ```

6.  **Run Database Migrations**
    ```bash
    php artisan migrate
    ```

## 🏃‍♂️ Running the Project

To start the development server, simply run:

```bash
npm run dev
```

This command uses `concurrently` to run the Laravel server, queue listener, logs, and Vite development server simultaneously.

Access the application at: `http://localhost:8000`

## 📝 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
