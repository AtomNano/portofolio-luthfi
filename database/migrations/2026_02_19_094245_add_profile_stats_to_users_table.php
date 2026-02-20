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
            if (! Schema::hasColumn('users', 'years_experience')) {
                $table->integer('years_experience')->nullable();
            }
            if (! Schema::hasColumn('users', 'projects_completed')) {
                $table->integer('projects_completed')->nullable();
            }
            if (! Schema::hasColumn('users', 'tech_stack')) {
                $table->json('tech_stack')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['years_experience', 'projects_completed', 'tech_stack']);
        });
    }
};
