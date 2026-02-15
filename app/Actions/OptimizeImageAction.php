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
        $filename = uniqid().'_'.time();

        // Process main image: resize to max 1920x1080, convert to WebP
        $mainImage = $this->manager->read($file->getPathname());
        $mainImage->scaleDown(width: 1920, height: 1080);
        $mainEncoded = $mainImage->toWebp(quality: 80);

        $mainPath = "{$directory}/{$filename}.webp";
        Storage::disk('public')->put($mainPath, (string) $mainEncoded);

        // Generate thumbnail: 400x300, WebP
        $thumbnail = $this->manager->read($file->getPathname());
        $thumbnail->cover(400, 300);
        $thumbEncoded = $thumbnail->toWebp(quality: 75);

        $thumbPath = "{$directory}/thumbnails/{$filename}_thumb.webp";
        Storage::disk('public')->put($thumbPath, (string) $thumbEncoded);

        return [
            'path' => $mainPath,
            'thumbnail_path' => $thumbPath,
        ];
    }
}
