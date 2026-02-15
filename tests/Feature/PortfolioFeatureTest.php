<?php

use App\Actions\OptimizeImageAction;
use App\Models\Portfolio;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Mockery\MockInterface;

uses(RefreshDatabase::class);

function createTestImage(): UploadedFile
{
    $base64 = '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkYWJnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigD//2Q==';
    $path = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'test_image_' . uniqid() . '.jpg';
    file_put_contents($path, base64_decode($base64));

    // Mark as test file so Laravel handles cleanup
    return new UploadedFile($path, 'test.jpg', 'image/jpeg', null, true);
}

test('guest cannot access dashboard', function () {
    $this->get(route('dashboard.index'))->assertRedirect(route('login'));
});

test('user can access dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user)->get(route('dashboard.index'))->assertOk();
});

test('user can create portfolio with image', function () {
    Storage::fake('public');
    $user = User::factory()->create();

    // Mock the action to avoid GD requirement
    $this->mock(OptimizeImageAction::class, function (MockInterface $mock) {
        $mock->shouldReceive('handle')
            ->once()
            ->andReturn([
                'path' => 'portfolios/optimized.webp',
                'thumbnail_path' => 'portfolios/thumbnails/thumb.webp'
            ]);
    });

    $file = createTestImage();

    $response = $this->actingAs($user)->post(route('dashboard.portfolios.store'), [
        'title' => 'My Awesome Project',
        'category' => 'Web Development',
        'description' => 'A very cool project.',
        'image' => $file,
    ]);

    $response->assertRedirect(route('dashboard.portfolios.index'));

    $this->assertDatabaseHas('portfolios', [
        'title' => 'My Awesome Project',
        'image_path' => 'portfolios/optimized.webp',
        'thumbnail_path' => 'portfolios/thumbnails/thumb.webp',
    ]);
});

test('user can update portfolio', function () {
    Storage::fake('public');
    $user = User::factory()->create();

    $portfolio = Portfolio::create([
        'title' => 'Old Title',
        'category' => 'Old Category',
        'description' => 'Old Desc',
        'image_path' => 'old.webp',
        'thumbnail_path' => 'old_thumb.webp',
    ]);

    $response = $this->actingAs($user)->put(route('dashboard.portfolios.update', $portfolio), [
        'title' => 'Updated Title',
        'category' => 'Mobile App',
        'description' => 'Updated description.',
    ]);

    $response->assertRedirect(route('dashboard.portfolios.index'));

    $this->assertDatabaseHas('portfolios', [
        'id' => $portfolio->id,
        'title' => 'Updated Title',
    ]);
});

test('user can delete portfolio', function () {
    Storage::fake('public');
    $user = User::factory()->create();

    $portfolio = Portfolio::create([
        'title' => 'Title to Delete',
        'category' => 'Category',
        'description' => 'Description',
        'image_path' => 'delete.webp',
        'thumbnail_path' => 'delete_thumb.webp',
    ]);

    $response = $this->actingAs($user)->delete(route('dashboard.portfolios.destroy', $portfolio));

    $response->assertRedirect(route('dashboard.portfolios.index'));
    $this->assertDatabaseMissing('portfolios', ['id' => $portfolio->id]);
});
