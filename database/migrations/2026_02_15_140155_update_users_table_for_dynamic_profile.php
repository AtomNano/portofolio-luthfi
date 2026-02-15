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
            $table->string('address')->nullable()->after('phone');
            $table->text('bio')->nullable()->after('address');
            $table->json('skills')->nullable()->after('bio');
            $table->json('soft_skills')->nullable()->after('skills');
            $table->json('social_links')->nullable()->after('soft_skills');

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
