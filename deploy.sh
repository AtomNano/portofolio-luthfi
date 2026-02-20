#!/bin/bash
set -e

echo "Deploying application..."

# Enter maintenance mode
(php artisan down --retry=60) || true

# Update codebase
git fetch origin main
git reset --hard origin/main

# Install dependencies tightly
composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev
npm ci

# Build frontend assets using Vite
npm run build

# Run database migrations forcefully
php artisan migrate --force

# Clear and rebuild cache
php artisan optimize:clear
php artisan optimize
php artisan view:cache
php artisan event:cache

# Exit maintenance mode
php artisan up

echo "Application deployed successfully!"
