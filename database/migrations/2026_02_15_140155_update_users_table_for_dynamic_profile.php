<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('address')->nullable();
            $table->text('bio')->nullable();
            $table->json('skills')->nullable();
            $table->json('soft_skills')->nullable();
            $table->json('social_links')->nullable();

            // Drop individual columns as they are now in social_links
            $table->dropColumn(['instagram', 'linkedin', 'github', 'about_me']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
};
