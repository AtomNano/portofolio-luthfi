<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('avatar')->nullable()->after('email');
            $table->string('job_title')->nullable()->after('avatar');
            $table->string('phone')->nullable()->after('job_title');
            $table->string('instagram')->nullable()->after('phone');
            $table->string('linkedin')->nullable()->after('instagram');
            $table->string('github')->nullable()->after('linkedin');
            $table->text('about_me')->nullable()->after('github');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'avatar',
                'job_title',
                'phone',
                'instagram',
                'linkedin',
                'github',
                'about_me',
            ]);
        });
    }
};
