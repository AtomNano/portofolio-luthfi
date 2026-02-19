<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSkillsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first(); // Assuming the first user is the admin/owner

        if ($user) {
            $skills = [
                ['name' => 'Laravel', 'category' => 'Backend', 'level' => 95], // Changed 'percent' to 'level' to match existing schema if needed, but request said percent. Checking ProfileValidationRules it used 'level'. I'll stick to 'level' 
                ['name' => 'PHP', 'category' => 'Backend', 'level' => 90],
                ['name' => 'Node.js', 'category' => 'Backend', 'level' => 85],
                ['name' => 'PostgreSQL', 'category' => 'Backend', 'level' => 88],
                ['name' => 'MySQL', 'category' => 'Backend', 'level' => 90],
                ['name' => 'Redis', 'category' => 'Backend', 'level' => 75],
                ['name' => 'React', 'category' => 'Frontend', 'level' => 92],
                ['name' => 'TypeScript', 'category' => 'Frontend', 'level' => 88],
                ['name' => 'Tailwind CSS', 'category' => 'Frontend', 'level' => 95],
                ['name' => 'Vue.js', 'category' => 'Frontend', 'level' => 80],
                ['name' => 'Next.js', 'category' => 'Frontend', 'level' => 85],
                ['name' => 'JavaScript', 'category' => 'Frontend', 'level' => 95],
                ['name' => 'Docker', 'category' => 'DevOps', 'level' => 82],
                ['name' => 'AWS', 'category' => 'DevOps', 'level' => 78],
                ['name' => 'Git', 'category' => 'DevOps', 'level' => 90],
                ['name' => 'CI/CD', 'category' => 'DevOps', 'level' => 80],
                ['name' => 'Linux', 'category' => 'DevOps', 'level' => 85],
                ['name' => 'Nginx', 'category' => 'DevOps', 'level' => 75]
            ];

            $socials = [
                ['platform' => 'GitHub', 'url' => 'https://github.com/yourusername'],
                ['platform' => 'LinkedIn', 'url' => 'https://linkedin.com/in/yourusername'],
                ['platform' => 'Email', 'url' => 'mailto:luthfi2264a@gmail.com']
            ];

            $user->update([
                'skills' => $skills,
                'social_links' => $socials
            ]);
        }
    }
}
