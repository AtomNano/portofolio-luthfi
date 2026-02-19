# 🚀 Deployment Guide - Portfolify SaaS

## 📋 Ringkasan

Panduan lengkap untuk deployment Portfolify SaaS ke production environment dengan Docker, Kubernetes, dan cloud providers.

---

## 🎯 Deployment Options

| Option | Best For | Complexity | Cost |
|--------|----------|------------|------|
| **Docker Compose** | Single server, small scale | Low | $ |
| **Kubernetes** | Large scale, high availability | High | $$$ |
| **Laravel Forge** | Laravel-optimized, managed | Low | $$ |
| **Platform.sh** | PaaS, auto-scaling | Low | $$ |
| **AWS/GCP/Azure** | Enterprise, full control | High | $$$ |

---

## 🐳 Docker Compose Deployment

### Directory Structure

```
deployment/
├── docker/
│   ├── php/
│   │   └── Dockerfile
│   ├── nginx/
│   │   ├── Dockerfile
│   │   └── nginx.conf
│   └── supervisor/
│       └── Dockerfile
├── docker-compose.yml
├── docker-compose.prod.yml
└── .env.production
```

### PHP Dockerfile

```dockerfile
# deployment/docker/php/Dockerfile
FROM php:8.2-fpm-alpine

# Install dependencies
RUN apk add --no-cache \
    postgresql-dev \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    supervisor \
    nginx

# Install PHP extensions
RUN docker-php-ext-install \
    pdo_pgsql \
    pdo_mysql \
    gd \
    zip \
    bcmath \
    opcache

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy application
COPY . /var/www

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage \
    && chmod -R 755 /var/www/bootstrap/cache

# Copy PHP configuration
COPY deployment/docker/php/php.ini /usr/local/etc/php/php.ini
COPY deployment/docker/php/opcache.ini /usr/local/etc/php/conf.d/opcache.ini

# Copy supervisor config
COPY deployment/docker/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose port
EXPOSE 9000

# Start supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
```

### Nginx Configuration

```nginx
# deployment/docker/nginx/nginx.conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=general:10m rate=1r/s;

    upstream php-fpm {
        server app:9000;
    }

    server {
        listen 80;
        server_name _;
        root /var/www/public;
        index index.php index.html;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;

        # Handle tenant subdomains
        location / {
            try_files $uri $uri/ /index.php?$query_string;
        }

        # PHP files
        location ~ \.php$ {
            fastcgi_pass php-fpm;
            fastcgi_index index.php;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            include fastcgi_params;
            
            # Performance
            fastcgi_buffer_size 128k;
            fastcgi_buffers 4 256k;
            fastcgi_busy_buffers_size 256k;
        }

        # Static files
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Deny access to sensitive files
        location ~ /\.(?!well-known).* {
            deny all;
        }

        location ~ ^/(storage|bootstrap|config|database|resources|routes|tests|vendor)/ {
            deny all;
        }
    }
}
```

### Docker Compose Production

```yaml
# deployment/docker-compose.prod.yml
version: '3.8'

services:
  # Load Balancer / Reverse Proxy
  nginx:
    build:
      context: ..
      dockerfile: deployment/docker/nginx/Dockerfile
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ../public:/var/www/public:ro
      - ./ssl:/etc/nginx/ssl:ro
      - nginx_logs:/var/log/nginx
    depends_on:
      - app
    networks:
      - portfolify
    restart: unless-stopped

  # Application
  app:
    build:
      context: ..
      dockerfile: deployment/docker/php/Dockerfile
    environment:
      - APP_ENV=production
      - APP_DEBUG=false
      - APP_URL=https://portfolify.app
      - DB_CONNECTION=pgsql
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_DATABASE=portfolify
      - DB_USERNAME=portfolify
      - DB_PASSWORD=${DB_PASSWORD}
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - CACHE_DRIVER=redis
      - SESSION_DRIVER=redis
      - QUEUE_CONNECTION=redis
      - MAIL_MAILER=smtp
      - MAIL_HOST=${MAIL_HOST}
      - MAIL_PORT=${MAIL_PORT}
      - MAIL_USERNAME=${MAIL_USERNAME}
      - MAIL_PASSWORD=${MAIL_PASSWORD}
      - STRIPE_KEY=${STRIPE_KEY}
      - STRIPE_SECRET=${STRIPE_SECRET}
      - STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
      - AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION}
      - AWS_BUCKET=${AWS_BUCKET}
    volumes:
      - ../storage:/var/www/storage
      - ../bootstrap/cache:/var/www/bootstrap/cache
    depends_on:
      - postgres
      - redis
    networks:
      - portfolify
    restart: unless-stopped

  # Queue Workers
  queue:
    build:
      context: ..
      dockerfile: deployment/docker/php/Dockerfile
    command: php artisan queue:work --queue=default,emails,exports --sleep=3 --tries=3 --timeout=90
    environment:
      - APP_ENV=production
      - DB_CONNECTION=pgsql
      - DB_HOST=postgres
      - REDIS_HOST=redis
    volumes:
      - ../storage:/var/www/storage
      - ../bootstrap/cache:/var/www/bootstrap/cache
    depends_on:
      - postgres
      - redis
    networks:
      - portfolify
    restart: unless-stopped
    deploy:
      replicas: 2

  # Scheduler
  scheduler:
    build:
      context: ..
      dockerfile: deployment/docker/php/Dockerfile
    command: php artisan schedule:work
    environment:
      - APP_ENV=production
      - DB_CONNECTION=pgsql
      - DB_HOST=postgres
      - REDIS_HOST=redis
    volumes:
      - ../storage:/var/www/storage
      - ../bootstrap/cache:/var/www/bootstrap/cache
    depends_on:
      - postgres
      - redis
    networks:
      - portfolify
    restart: unless-stopped

  # Database
  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=portfolify
      - POSTGRES_USER=portfolify
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - portfolify
    restart: unless-stopped

  # Cache
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    networks:
      - portfolify
    restart: unless-stopped

  # File Storage (MinIO untuk self-hosted S3)
  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      - MINIO_ROOT_USER=${MINIO_USER}
      - MINIO_ROOT_PASSWORD=${MINIO_PASSWORD}
    volumes:
      - minio_data:/data
    ports:
      - "9000:9000"
      - "9001:9001"
    networks:
      - portfolify
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
  minio_data:
  nginx_logs:

networks:
  portfolify:
    driver: bridge
```

### Environment Variables

```bash
# deployment/.env.production
APP_NAME="Portfolify"
APP_ENV=production
APP_KEY=base64:your-app-key-here
APP_DEBUG=false
APP_URL=https://portfolify.app
APP_LOCALE=id

# Database
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=portfolify
DB_USERNAME=portfolify
DB_PASSWORD=your-secure-password

# Redis
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

# Mail
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=postmaster@portfolify.app
MAIL_PASSWORD=your-mail-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@portfolify.app
MAIL_FROM_NAME="Portfolify"

# Stripe
STRIPE_KEY=pk_live_...
STRIPE_SECRET=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AWS S3 (atau MinIO)
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=portfolify-assets
AWS_URL=https://cdn.portfolify.app
AWS_ENDPOINT=https://minio:9000
AWS_USE_PATH_STYLE_ENDPOINT=true

# MinIO
MINIO_USER=minioadmin
MINIO_PASSWORD=minioadmin123
```

### Deployment Script

```bash
#!/bin/bash
# deployment/deploy.sh

set -e

echo "🚀 Starting deployment..."

# Pull latest code
git pull origin main

# Copy environment file
cp .env.production .env

# Build and start containers
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose -f docker-compose.prod.yml exec -T app php artisan migrate --force

# Optimize
docker-compose -f docker-compose.prod.yml exec -T app php artisan optimize
docker-compose -f docker-compose.prod.yml exec -T app php artisan config:cache
docker-compose -f docker-compose.prod.yml exec -T app php artisan route:cache
docker-compose -f docker-compose.prod.yml exec -T app php artisan view:cache

# Storage link
docker-compose -f docker-compose.prod.yml exec -T app php artisan storage:link

# Clear caches
docker-compose -f docker-compose.prod.yml exec -T app php artisan cache:clear
docker-compose -f docker-compose.prod.yml exec -T app php artisan queue:restart

echo "✅ Deployment completed!"
```

---

## ☸️ Kubernetes Deployment

### Namespace

```yaml
# deployment/k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: portfolify
```

### ConfigMap

```yaml
# deployment/k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: portfolify-config
  namespace: portfolify
data:
  APP_ENV: "production"
  APP_DEBUG: "false"
  APP_URL: "https://portfolify.app"
  DB_CONNECTION: "pgsql"
  DB_HOST: "postgres"
  DB_PORT: "5432"
  DB_DATABASE: "portfolify"
  REDIS_HOST: "redis"
  REDIS_PORT: "6379"
  CACHE_DRIVER: "redis"
  SESSION_DRIVER: "redis"
  QUEUE_CONNECTION: "redis"
  MAIL_MAILER: "smtp"
  MAIL_HOST: "smtp.mailgun.org"
  MAIL_PORT: "587"
  MAIL_ENCRYPTION: "tls"
  MAIL_FROM_ADDRESS: "noreply@portfolify.app"
  MAIL_FROM_NAME: "Portfolify"
```

### Secrets

```yaml
# deployment/k8s/secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: portfolify-secrets
  namespace: portfolify
type: Opaque
stringData:
  APP_KEY: "base64:your-app-key"
  DB_PASSWORD: "your-db-password"
  REDIS_PASSWORD: ""
  MAIL_USERNAME: "postmaster@portfolify.app"
  MAIL_PASSWORD: "your-mail-password"
  STRIPE_KEY: "pk_live_..."
  STRIPE_SECRET: "sk_live_..."
  STRIPE_WEBHOOK_SECRET: "whsec_..."
  AWS_ACCESS_KEY_ID: "your-key"
  AWS_SECRET_ACCESS_KEY: "your-secret"
```

### PostgreSQL Deployment

```yaml
# deployment/k8s/postgres.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: portfolify
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:15-alpine
          env:
            - name: POSTGRES_DB
              value: "portfolify"
            - name: POSTGRES_USER
              value: "portfolify"
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: portfolify-secrets
                  key: DB_PASSWORD
          ports:
            - containerPort: 5432
          volumeMounts:
            - name: postgres-data
              mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
    - metadata:
        name: postgres-data
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 20Gi
---
apiVersion: v1
kind: Service
metadata:
  name: postgres
  namespace: portfolify
spec:
  selector:
    app: postgres
  ports:
    - port: 5432
      targetPort: 5432
```

### Application Deployment

```yaml
# deployment/k8s/app.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: portfolify-app
  namespace: portfolify
spec:
  replicas: 3
  selector:
    matchLabels:
      app: portfolify-app
  template:
    metadata:
      labels:
        app: portfolify-app
    spec:
      containers:
        - name: app
          image: portfolify/app:latest
          ports:
            - containerPort: 9000
          envFrom:
            - configMapRef:
                name: portfolify-config
            - secretRef:
                name: portfolify-secrets
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          livenessProbe:
            tcpSocket:
              port: 9000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            tcpSocket:
              port: 9000
            initialDelaySeconds: 5
            periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: portfolify-app
  namespace: portfolify
spec:
  selector:
    app: portfolify-app
  ports:
    - port: 9000
      targetPort: 9000
```

### Queue Workers

```yaml
# deployment/k8s/queue.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: portfolify-queue
  namespace: portfolify
spec:
  replicas: 2
  selector:
    matchLabels:
      app: portfolify-queue
  template:
    metadata:
      labels:
        app: portfolify-queue
    spec:
      containers:
        - name: queue
          image: portfolify/app:latest
          command: ["php", "artisan", "queue:work", "--queue=default,emails,exports", "--sleep=3", "--tries=3", "--timeout=90"]
          envFrom:
            - configMapRef:
                name: portfolify-config
            - secretRef:
                name: portfolify-secrets
          resources:
            requests:
              memory: "128Mi"
              cpu: "100m"
            limits:
              memory: "256Mi"
              cpu: "250m"
```

### Nginx Ingress

```yaml
# deployment/k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: portfolify-ingress
  namespace: portfolify
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: "50m"
spec:
  tls:
    - hosts:
        - portfolify.app
        - "*.portfolify.app"
      secretName: portfolify-tls
  rules:
    - host: portfolify.app
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: portfolify-nginx
                port:
                  number: 80
    - host: "*.portfolify.app"
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: portfolify-nginx
                port:
                  number: 80
```

### Horizontal Pod Autoscaler

```yaml
# deployment/k8s/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: portfolify-app-hpa
  namespace: portfolify
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: portfolify-app
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

---

## 🔒 SSL/TLS dengan Let's Encrypt

### Cert Manager

```yaml
# deployment/k8s/cert-manager.yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@portfolify.app
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
      - http01:
          ingress:
            class: nginx
```

---

## 📊 Monitoring

### Prometheus + Grafana

```yaml
# deployment/k8s/monitoring.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: portfolify
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
    scrape_configs:
      - job_name: 'portfolify-app'
        static_configs:
          - targets: ['portfolify-app:9000']
```

### Laravel Telescope (Production)

```bash
# Enable Telescope untuk monitoring
php artisan telescope:install
php artisan migrate

# Add to .env
TELESCOPE_ENABLED=true
TELESCOPE_DOMAIN=monitoring.portfolify.app
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          extensions: pdo_pgsql, redis
      
      - name: Install dependencies
        run: composer install --no-dev
      
      - name: Run tests
        run: php artisan test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: |
          docker build -t portfolify/app:${{ github.sha }} -f deployment/docker/php/Dockerfile .
          docker tag portfolify/app:${{ github.sha }} portfolify/app:latest
      
      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push portfolify/app:${{ github.sha }}
          docker push portfolify/app:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /opt/portfolify
            ./deployment/deploy.sh
```

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] Database backup created
- [ ] Environment variables configured
- [ ] SSL certificates ready
- [ ] Domain DNS configured
- [ ] Stripe webhook configured
- [ ] Email service configured
- [ ] S3/MinIO storage configured

### Deployment
- [ ] Run database migrations
- [ ] Seed plans table
- [ ] Build frontend assets
- [ ] Deploy containers
- [ ] Verify health checks
- [ ] Test all endpoints

### Post-Deployment
- [ ] SSL certificate valid
- [ ] All subdomains working
- [ ] Stripe webhooks receiving
- [ ] Email sending working
- [ ] File uploads working
- [ ] Monitoring dashboards accessible
- [ ] Error tracking active

---

## 📈 Scaling Strategy

### Horizontal Scaling

```yaml
# Scale app replicas
kubectl scale deployment portfolify-app --replicas=5 -n portfolify

# Scale queue workers
kubectl scale deployment portfolify-queue --replicas=4 -n portfolify
```

### Database Scaling

```yaml
# Read replicas untuk PostgreSQL
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres-replica
spec:
  replicas: 2
  # ... configuration untuk read replicas
```

### CDN Setup

```bash
# CloudFlare configuration
# 1. Add domain to CloudFlare
# 2. Enable CDN untuk static assets
# 3. Configure caching rules
# 4. Enable DDoS protection
```

---

## 🆘 Troubleshooting

### Common Issues

```bash
# Check pod status
kubectl get pods -n portfolify

# View logs
kubectl logs -f deployment/portfolify-app -n portfolify

# Exec into container
kubectl exec -it deployment/portfolify-app -n portfolify -- /bin/sh

# Restart deployment
kubectl rollout restart deployment/portfolify-app -n portfolify

# Check resource usage
kubectl top pods -n portfolify
```

---

## 📚 Resources

- [Laravel Deployment Docs](https://laravel.com/docs/12.x/deployment)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Cert Manager Docs](https://cert-manager.io/docs/)
