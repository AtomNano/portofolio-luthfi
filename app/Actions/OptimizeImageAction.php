<?php

namespace App\Actions;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class OptimizeImageAction
{
    private ImageManager $manager;

    public function __construct()
    {
        $this->manager = new ImageManager(new Driver);
    }

    /**
     * Optimize an uploaded image: resize, convert to WebP, and generate thumbnail.
     *
     * @return array{path: string, thumbnail_path: string}
     */
    public function handle(UploadedFile $file, string $directory = 'portfolios'): array
    {
        $filename = uniqid() . '_' . time();

        // Determine available driver
        $useWebp = function_exists('imagewebp');
        $useJpeg = function_exists('imagejpeg');
        $usePng = function_exists('imagepng');

        if ($useWebp) {
            $extension = 'webp';
            $encoder = fn($image) => $image->toWebp(quality: 80);
            $thumbEncoder = fn($image) => $image->toWebp(quality: 75);
        } elseif ($useJpeg) {
            $extension = 'jpg';
            $encoder = fn($image) => $image->toJpeg(quality: 80);
            $thumbEncoder = fn($image) => $image->toJpeg(quality: 75);
        } elseif ($usePng) {
            $extension = 'png';
            $encoder = fn($image) => $image->toPng();
            $thumbEncoder = fn($image) => $image->toPng();
        } else {
            // Last resort: assume PNG or just let Intervention try its best with default save?
            // But we need strict return types from encoders usually.
            // Let's fallback to PNG as it's most likely supported if GD is on.
            $extension = 'png';
            $encoder = fn($image) => $image->toPng();
            $thumbEncoder = fn($image) => $image->toPng();
        }

        // Process main image
        $mainImage = $this->manager->read($file->getPathname());
        $mainImage->scaleDown(width: 1920, height: 1080);
        $mainEncoded = $encoder($mainImage);

        $mainPath = "{$directory}/{$filename}.{$extension}";
        Storage::disk('public')->put($mainPath, (string) $mainEncoded);

        // Generate thumbnail
        $thumbnail = $this->manager->read($file->getPathname());
        $thumbnail->cover(400, 300);
        $thumbEncoded = $thumbEncoder($thumbnail);

        $thumbPath = "{$directory}/thumbnails/{$filename}_thumb.{$extension}";
        Storage::disk('public')->put($thumbPath, (string) $thumbEncoded);

        return [
            'path' => $mainPath,
            'thumbnail_path' => $thumbPath,
        ];
    }
}
