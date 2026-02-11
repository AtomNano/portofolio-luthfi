<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if user exists to avoid duplicates
        if (!User::where('email', 'admin@luthfi.com')->exists()) {
            User::create([
                'name' => 'Luthfi',
                'email' => 'admin@luthfi.com',
                'password' => 'password', // Default password for development
                'job_title' => 'Full Stack Developer',
                'about_me' => 'I craft robust digital solutions with a focus on performance, aesthetics, and user experience.',
            ]);
            $this->command->info('User "Luthfi" created successfully.');
            $this->command->info('Email: admin@luthfi.com');
            $this->command->info('Password: password');
        } else {
            $this->command->info('User "Luthfi" already exists.');
        }
    }
}
