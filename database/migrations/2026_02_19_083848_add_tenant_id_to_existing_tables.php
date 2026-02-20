<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── users ──────────────────────────────────────────────────────
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('tenant_id')->nullable()->after('id');
            $table->string('username')->unique()->nullable()->after('name'); // public URL slug
            $table->string('role', 20)->default('admin')->after('username'); // admin, member
        });

        // ── portfolios ──────────────────────────────────────────────────
        Schema::table('portfolios', function (Blueprint $table) {
            $table->unsignedBigInteger('tenant_id')->nullable()->after('id');
            $table->unsignedBigInteger('user_id')->nullable()->after('tenant_id');
            $table->boolean('is_published')->default(true)->after('video_url');
            $table->integer('view_count')->default(0)->after('is_published');

            $table->index('tenant_id');
        });

        // ── portfolio_images ────────────────────────────────────────────
        Schema::table('portfolio_images', function (Blueprint $table) {
            $table->unsignedBigInteger('tenant_id')->nullable()->after('id');

            $table->index('tenant_id');
        });

        // ── experiences ─────────────────────────────────────────────────
        Schema::table('experiences', function (Blueprint $table) {
            $table->unsignedBigInteger('tenant_id')->nullable()->after('id');
            $table->unsignedBigInteger('user_id')->nullable()->after('tenant_id');

            $table->index('tenant_id');
        });

        // ── page_views ──────────────────────────────────────────────────
        if (Schema::hasTable('page_views')) {
            Schema::table('page_views', function (Blueprint $table) {
                $table->unsignedBigInteger('tenant_id')->nullable()->after('id');

                $table->index('tenant_id');
            });
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['tenant_id', 'username', 'role']);
        });

        Schema::table('portfolios', function (Blueprint $table) {
            $table->dropIndex(['tenant_id']);
            $table->dropColumn(['tenant_id', 'user_id', 'is_published', 'view_count']);
        });

        Schema::table('portfolio_images', function (Blueprint $table) {
            $table->dropIndex(['tenant_id']);
            $table->dropColumn('tenant_id');
        });

        Schema::table('experiences', function (Blueprint $table) {
            $table->dropIndex(['tenant_id']);
            $table->dropColumn(['tenant_id', 'user_id']);
        });

        if (Schema::hasTable('page_views')) {
            Schema::table('page_views', function (Blueprint $table) {
                $table->dropIndex(['tenant_id']);
                $table->dropColumn('tenant_id');
            });
        }
    }
};
