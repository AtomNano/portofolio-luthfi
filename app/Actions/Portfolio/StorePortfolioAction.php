<?php

namespace App\Actions\Portfolio;

use App\Actions\OptimizeImageAction;
use App\Models\Portfolio;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;

class StorePortfolioAction
{
    public function __construct(
        private OptimizeImageAction $optimizeImage,
    ) {}

    /**
     * Store a newly created portfolio.
     *
     * @param  array<string, mixed>  $validated
     * @param  array<int, UploadedFile>  $additionalImages
     */
    public function handle(array $validated, ?UploadedFile $mainImage = null, array $additionalImages = []): Portfolio
    {
        if ($mainImage) {
            $optimized = $this->optimizeImage->handle($mainImage);
            $validated['image_path'] = $optimized['path'];
            $validated['thumbnail_path'] = $optimized['thumbnail_path'];
        }

        $portfolio = Portfolio::create([
            'user_id' => Auth::id(),
            'title' => $validated['title'],
            'category' => $validated['category'],
            'description' => $validated['description'],
            'project_url' => $validated['project_url'] ?? null,
            'image_path' => $validated['image_path'] ?? null,
            'thumbnail_path' => $validated['thumbnail_path'] ?? null,
            'development_time' => $validated['development_time'] ?? null,
            'tools' => $validated['tools'] ?? null,
            'github_url' => $validated['github_url'] ?? null,
            'video_url' => $validated['video_url'] ?? null,
        ]);

        foreach ($additionalImages as $index => $image) {
            $optimized = $this->optimizeImage->handle($image);
            $portfolio->images()->create([
                'image_path' => $optimized['path'],
                'thumbnail_path' => $optimized['thumbnail_path'],
                'order' => $index,
            ]);
        }

        return $portfolio;
    }
}
