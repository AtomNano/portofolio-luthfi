<?php

use App\Actions\OptimizeImageAction;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

uses(TestCase::class);

function createTestActionImage(): UploadedFile
{
    $base64 = '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkYWJnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigD//2Q==';
    $path = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'test_action_image_' . uniqid() . '.jpg';
    file_put_contents($path, base64_decode($base64));
    return new UploadedFile($path, 'test.jpg', 'image/jpeg', null, true);
}

test('it optimizes image and generates thumbnail', function () {
    if (!extension_loaded('gd')) {
        $this->markTestSkipped('GD extension is not loaded.');
    }

    Storage::fake('public');

    // Create valid image file
    $file = createTestActionImage();

    try {
        $action = new OptimizeImageAction();
        $result = $action->handle($file);

        expect($result)->toBeArray()
            ->toHaveKeys(['path', 'thumbnail_path']);

        expect($result['path'])->toEndWith('.webp');
        expect($result['thumbnail_path'])->toEndWith('_thumb.webp');

        expect(Storage::disk('public')->exists($result['path']))->toBeTrue();
        expect(Storage::disk('public')->exists($result['thumbnail_path']))->toBeTrue();
    } catch (\Throwable $e) {
        if (str_contains($e->getMessage(), 'undefined function')) {
            $this->markTestSkipped('Image processing dependencies missing: ' . $e->getMessage());
        }
        throw $e;
    }
});
