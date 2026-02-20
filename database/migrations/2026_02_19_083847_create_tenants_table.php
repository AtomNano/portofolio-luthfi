<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tenants', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique(); // used as username in URL: /username
            $table->string('custom_domain')->unique()->nullable();
            $table->foreignId('plan_id')->constrained('plans');
            $table->unsignedBigInteger('owner_id')->nullable(); // set after user created

            // Branding
            $table->string('logo')->nullable();
            $table->string('favicon')->nullable();
            $table->string('primary_color', 7)->default('#0ea5e9');

            // Settings
            $table->json('settings')->nullable();

            // Status
            $table->string('status', 20)->default('active'); // active, suspended, cancelled
            $table->string('subscription_status', 20)->default('active');
            $table->timestamp('subscription_ends_at')->nullable();

            // Stripe (for later)
            $table->string('stripe_customer_id')->nullable();

            $table->timestamps();

            $table->index('slug');
            $table->index('custom_domain');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tenants');
    }
};
