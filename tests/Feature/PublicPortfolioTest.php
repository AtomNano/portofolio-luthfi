<?php

use App\Models\Plan;
use App\Models\Portfolio;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Create plans needed for factories
    Plan::factory()->create(['name' => 'Free', 'slug' => 'free']);
});

test('guest can visit landing page at root url', function () {
    $response = $this->get('/');

    $response->assertStatus(200)
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('landing')
                ->has('portfolios')
        );
});

test('guest can visit public portfolio by username', function () {
    // Create user with tenant
    $user = User::factory()->create([
        'username' => 'johndoe',
    ]);

    // Create tenant manually if factory doesn't (User factory might not create Tenant automatically unless customized)
    // But our RegisterController does. Let's assume factory doesn't, so we create it.
    // Actually our User factory might not. Let's check or just create it.
    if (! $user->tenant_id) {
        $tenant = Tenant::create(['name' => 'John Tenant', 'slug' => 'johndoe', 'plan_id' => Plan::first()->id]);
        $user->tenant_id = $tenant->id;
        $user->role = 'admin';
        $user->save();
    }

    // Create portfolio
    Portfolio::create([
        'tenant_id' => $user->tenant_id,
        'user_id' => $user->id,
        'title' => 'My Awesome Project',
        'category' => 'Web App',
        'description' => 'Cool stuff',
        'is_published' => true,
        'order' => 1,
    ]);

    $response = $this->get('/johndoe');

    $response->assertStatus(200)
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('welcome')
                ->has('portfolios', 1)
                ->where('portfolios.0.title', 'My Awesome Project')
                ->where('owner.username', 'johndoe')
                ->where('tenant.slug', 'johndoe')
        );
});

test('visiting non-existent username returns 404', function () {
    $response = $this->get('/nonexistentuser');

    $response->assertStatus(404);
});
