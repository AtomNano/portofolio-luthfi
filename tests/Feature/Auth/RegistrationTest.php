<?php

use App\Models\Plan;

beforeEach(function () {
    // CreateNewUser requires a Free plan to exist
    Plan::factory()->create([
        'name' => 'Free',
        'slug' => 'free',
        'price_monthly' => 0,
        'price_yearly' => 0,
        'currency' => 'IDR',
        'features' => ['max_portfolios' => 3, 'max_storage_mb' => 100],
        'limits' => ['max_portfolios' => 3, 'max_storage_mb' => 100],
    ]);
});

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users can register', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'username' => 'testuser',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('registration fails without username', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasErrors('username');
    $this->assertGuest();
});

test('registration fails with reserved username', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'username' => 'dashboard',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasErrors('username');
    $this->assertGuest();
});

test('registration fails with duplicate username', function () {
    Plan::factory()->create(['slug' => 'free-alt', 'name' => 'Free']);

    $this->post(route('register.store'), [
        'name' => 'User One',
        'username' => 'uniqueuser',
        'email' => 'one@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->post(route('logout'));

    $response = $this->post(route('register.store'), [
        'name' => 'User Two',
        'username' => 'uniqueuser',
        'email' => 'two@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasErrors('username');
});

test('tenant and subscription are created on registration', function () {
    $this->post(route('register.store'), [
        'name' => 'Test User',
        'username' => 'mytestuser',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $user = \App\Models\User::where('email', 'test@example.com')->first();

    expect($user)->not->toBeNull();
    expect($user->username)->toBe('mytestuser');
    expect($user->tenant_id)->not->toBeNull();
    expect($user->tenant->slug)->toBe('mytestuser');
    expect($user->tenant->subscription)->not->toBeNull();
    expect($user->tenant->subscription->status)->toBe('active');
});
