# Dokumentasi Proyek Portofolio

## Stack Teknologi (Technology Stack)
Proyek ini dibangun menggunakan modern full-stack implementation dengan teknologi berikut:

### Backend
- **Laravel 12**: Framework PHP utama untuk backend logic, routing, dan database management.
- **Inertia.js v2 (Server-Side)**: Menghubungkan Backend Laravel dengan Frontend React tanpa perlu membangun API terpisah.
- **Laravel Fortify**: Menangani autentikasi backend (login, register, reset password, update profile).
- **Laravel Socialite**: Menangani login pihak ketiga (Google OAuth).
- **Wayfinder**: Helper untuk generate route Laravel agar bisa dipanggil di Frontend secara type-safe.
- **MySQL**: Database relasional untuk menyimpan data user, portofolio, dan statistik.

### Frontend
- **React 19**: Library JavaScript untuk membangun UI yang interaktif.
- **TypeScript**: Superset JavaScript yang memberikan static typing untuk keamanan kode.
- **Inertia.js v2 (Client-Side)**: Routing client-side yang terasa seperti SPA (Single Page Application).
- **Tailwind CSS v4**: Framework CSS utility-first untuk styling.
- **Shadcn UI**: Koleksi komponen UI (Button, Input, Sidebar, dll) berbasis Radix UI dan Tailwind.
- **Lucide React**: Library ikon.
- **Framer Motion**: Library untuk animasi.
- **Dnd Kit**: Library untuk fitur drag-and-drop (digunakan di manajemen portofolio).
- **SweetAlert2**: Library untuk pop-up konfirmasi yang cantik.

### Tools & Utilitas
- **Vite**: Build tool yang sangat cepat untuk frontend resource.
- **ESLint & Prettier**: Linter dan formatter untuk menjaga kualitas kode JavaScript/TypeScript.
- **Pint**: Code style fixer untuk PHP.
- **Composer**: Dependency manager untuk PHP.
- **NPM**: Dependency manager untuk JavaScript/Node.js.

---

## Struktur Proyek (Project Structure)
Berikut adalah struktur folder utama dan fungsinya:

### `app/` (Backend Logic)
- **Http/Controllers/**: Mengatur logika aplikasi.
    - `PortfolioController.php`: CRUD portofolio, statistik, reorder.
    - `SocialAuthController.php`: Login via Google.
- **Models/**: Representasi tabel database.
    - `User.php`: Data pengguna.
    - `Portfolio.php`: Data portofolio.
    - `PortfolioImage.php`: Gambar-gambar portofolio.
    - `PageView.php`: Tracking jumlah pengunjung.

### `resources/js/` (Frontend React)
- **pages/**: Halaman-halaman aplikasi (Views).
    - `welcome.tsx`: Halaman depan (Landing page).
    - `dashboard/`: Area admin.
        - `portfolios/`: Manajemen portofolio (List, Create, Edit, Show).
- **components/**: Komponen UI yang bisa dipakai ulang.
    - `ui/`: Komponen dasar dari Shadcn (Button, Card, Sidebar, dll).
    - `app-sidebar.tsx`: Sidebar navigasi dashboard.
- **layouts/**: Template tata letak halaman.
    - `app/app-sidebar-layout.tsx`: Layout utama dashboard dengan sidebar.
- **routes/**: Definisi route frontend yang digenerate oleh Wayfinder.

### `database/`
- **migrations/**: File untuk membuat struktur tabel database.

### `routes/`
- **web.php**: Definisi URL/Route aplikasi.

---

## Fitur Utama yang Telah Diimplementasikan

1.  **Manajemen Portofolio (CRUD)**
    - Tambah, Edit, Hapus portofolio.
    - Upload banyak gambar sekaligus (Multi-image upload).
    - Drag-and-drop untuk mengatur urutan portofolio.
    - Statistik jumlah views per portofolio.

2.  **Autentikasi Modern**
    - Login & Register custom.
    - **Google OAuth**: Login menggunakan akun Google.
    - Update profil & password.

3.  **Halaman Publik Dinamis**
    - Halaman welcome yang menampilkan data portofolio dari database.
    - Counter "Years Experience" dan "Projects Completed" yang dinamis.
    - Detail portofolio dengan carousel gambar.

4.  **UI/UX Premium**
    - Desain Dark Mode.
    - Sidebar responsif yang bisa di-collapse.
    - Animasi loading dan transisi halaman.

---

## Catatan Perbaikan Terakhir
Beberapa perbaikan teknis yang telah dilakukan untuk memastikan aplikasi berjalan lancar:
- **Sidebar fix**: Memperbaiki layout sidebar yang menumpuk konten dengan menstabilkan lebar sidebar dan padding konten (`AppContent`).
- **Google Login**: Menambahkan integrasi Google Sign-In.
- **Build System**: Memperbaiki error TypeScript pada saat build (`npm run build`).
- **Reorder Bug**: Memperbaiki error saat drag-and-drop portofolio.

## Cara Menjalankan Project
1. Pastikan `.env` sudah dikonfigurasi (Database & Google Credentials).
2. Jalankan migrasi database: `php artisan migrate`.
3. Jalankan backend: `composer run dev` (Menjalankan server Laravel, Queue, dan Vite secara bersamaan via concurrently).
