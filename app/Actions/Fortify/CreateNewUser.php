<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user + their tenant.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'username' => [
                'required',
                'string',
                'min:3',
                'max:30',
                'alpha_dash',
                Rule::unique('users', 'username'),
                // Reserved slugs that clash with app routes
                Rule::notIn(['dashboard', 'login', 'register', 'logout', 'api', 'auth', 'admin', 'settings', 'up']),
            ],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => $this->passwordRules(),
        ], [
            'username.alpha_dash' => 'Username hanya boleh huruf, angka, dan tanda hubung.',
            'username.not_in' => 'Username tersebut tidak dapat digunakan.',
        ])->validate();

        return DB::transaction(function () use ($input) {
            // 1. Get the free plan
            $freePlan = Plan::where('slug', 'free')->firstOrFail();

            // 2. Create the user (without tenant_id yet)
            $user = User::create([
                'name' => $input['name'],
                'username' => Str::lower($input['username']),
                'email' => $input['email'],
                'password' => $input['password'],
                'role' => 'admin',
            ]);

            // 3. Create a Tenant for this user
            $tenant = Tenant::create([
                'name' => $input['name']."'s Portfolio",
                'slug' => Str::lower($input['username']),
                'plan_id' => $freePlan->id,
                'owner_id' => $user->id,
                'status' => 'active',
                'subscription_status' => 'active',
            ]);

            // 4. Link user to their tenant
            $user->update(['tenant_id' => $tenant->id]);

            // 5. Create subscription record
            Subscription::create([
                'tenant_id' => $tenant->id,
                'plan_id' => $freePlan->id,
                'status' => 'active',
                'current_period_start' => now(),
                'current_period_end' => now()->addYear(),
            ]);

            return $user;
        });
    }
}
