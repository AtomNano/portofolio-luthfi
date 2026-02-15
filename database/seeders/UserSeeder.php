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
        $user = User::firstOrCreate(
            ['email' => 'luthfi2264a@gmail.com'],
            [
                'name' => 'Muhammad Luthfi Naldi',
                'password' => Hash::make('password'), // Default password, change in prod
                'job_title' => 'Full Stack Developer',
                'phone' => '085805786626',
                'address' => 'Batam, Indonesia',
                'bio' => 'Coding with passion, Designing with purpose. A proactive and creative college student...',
                'skills' => [
                    // Backend
                    ['name' => 'Laravel', 'level' => 95, 'category' => 'Backend'],
                    ['name' => 'PHP', 'level' => 90, 'category' => 'Backend'],
                    ['name' => 'Node.js', 'level' => 85, 'category' => 'Backend'],
                    ['name' => 'PostgreSQL', 'level' => 88, 'category' => 'Backend'],
                    ['name' => 'MySQL', 'level' => 90, 'category' => 'Backend'],
                    ['name' => 'Redis', 'level' => 75, 'category' => 'Backend'],
                    // Frontend
                    ['name' => 'React', 'level' => 92, 'category' => 'Frontend'],
                    ['name' => 'TypeScript', 'level' => 88, 'category' => 'Frontend'],
                    ['name' => 'Tailwind CSS', 'level' => 95, 'category' => 'Frontend'],
                    ['name' => 'Vue.js', 'level' => 80, 'category' => 'Frontend'],
                    ['name' => 'Next.js', 'level' => 85, 'category' => 'Frontend'],
                    ['name' => 'JavaScript', 'level' => 95, 'category' => 'Frontend'],
                    // DevOps
                    ['name' => 'Docker', 'level' => 82, 'category' => 'DevOps'],
                    ['name' => 'AWS', 'level' => 78, 'category' => 'DevOps'],
                    ['name' => 'Git', 'level' => 90, 'category' => 'DevOps'],
                    ['name' => 'CI/CD', 'level' => 80, 'category' => 'DevOps'],
                    ['name' => 'Linux', 'level' => 85, 'category' => 'DevOps'],
                    ['name' => 'Nginx', 'level' => 75, 'category' => 'DevOps'],
                ],
                'soft_skills' => [
                    ['name' => 'Problem Solving'],
                    ['name' => 'Team Leadership'],
                    ['name' => 'Communication'],
                    ['name' => 'Time Management'],
                    ['name' => 'Adaptability'],
                    ['name' => 'Critical Thinking'],
                ],
                // Assuming migrated from previous columns or fresh
                'social_links' => [
                    ['platform' => 'GitHub', 'url' => 'https://github.com/luthfigithub', 'icon' => 'Github'],
                    ['platform' => 'LinkedIn', 'url' => 'https://linkedin.com/in/luthfi', 'icon' => 'Linkedin'],
                    ['platform' => 'Instagram', 'url' => 'https://instagram.com/luthfi', 'icon' => 'Instagram'],
                ],
            ]
        );

        // Update if exists to ensure new fields are populated
        if ($user->wasRecentlyCreated === false) {
            $user->update([
                'job_title' => 'Full Stack Developer',
                'phone' => '085805786626',
                'address' => 'Batam, Indonesia',
                'bio' => 'Coding with passion, Designing with purpose. A proactive and creative college student...',
                'skills' => [
                    // Backend
                    ['name' => 'Laravel', 'level' => 95, 'category' => 'Backend'],
                    ['name' => 'PHP', 'level' => 90, 'category' => 'Backend'],
                    ['name' => 'Node.js', 'level' => 85, 'category' => 'Backend'],
                    ['name' => 'PostgreSQL', 'level' => 88, 'category' => 'Backend'],
                    ['name' => 'MySQL', 'level' => 90, 'category' => 'Backend'],
                    ['name' => 'Redis', 'level' => 75, 'category' => 'Backend'],
                    // Frontend
                    ['name' => 'React', 'level' => 92, 'category' => 'Frontend'],
                    ['name' => 'TypeScript', 'level' => 88, 'category' => 'Frontend'],
                    ['name' => 'Tailwind CSS', 'level' => 95, 'category' => 'Frontend'],
                    ['name' => 'Vue.js', 'level' => 80, 'category' => 'Frontend'],
                    ['name' => 'Next.js', 'level' => 85, 'category' => 'Frontend'],
                    ['name' => 'JavaScript', 'level' => 95, 'category' => 'Frontend'],
                    // DevOps
                    ['name' => 'Docker', 'level' => 82, 'category' => 'DevOps'],
                    ['name' => 'AWS', 'level' => 78, 'category' => 'DevOps'],
                    ['name' => 'Git', 'level' => 90, 'category' => 'DevOps'],
                    ['name' => 'CI/CD', 'level' => 80, 'category' => 'DevOps'],
                    ['name' => 'Linux', 'level' => 85, 'category' => 'DevOps'],
                    ['name' => 'Nginx', 'level' => 75, 'category' => 'DevOps'],
                ],
                'soft_skills' => [
                    ['name' => 'Problem Solving'],
                    ['name' => 'Team Leadership'],
                    ['name' => 'Communication'],
                    ['name' => 'Time Management'],
                    ['name' => 'Adaptability'],
                    ['name' => 'Critical Thinking'],
                ],
            ]);
        }
    }
}
