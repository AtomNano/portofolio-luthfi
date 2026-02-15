<?php

namespace App\Actions\Portfolio;

use App\Actions\OptimizeImageAction;
use App\Models\Portfolio;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class UpdatePortfolioAction
{
    public function __construct(
        private OptimizeImageAction $optimizeImage,
    ) {}

    /**
     * Update an existing portfolio.
     *
     * @param  array<string, mixed>  $validated
     * @param  array<int, UploadedFile>  $additionalImages
     */
    public function handle(Portfolio $portfolio, array $validated, ?UploadedFile $mainImage = null, array $additionalImages = []): Portfolio
    {
        if ($mainImage) {
            // Delete old images
            if ($portfolio->image_path) {
                Storage::disk('public')->delete($portfolio->image_path);
            }

            if ($portfolio->thumbnail_path) {
                Storage::disk('public')->delete($portfolio->thumbnail_path);
            }

            $optimized = $this->optimizeImage->handle($mainImage);
            $validated['image_path'] = $optimized['path'];
            $validated['thumbnail_path'] = $optimized['thumbnail_path'];
        }

        $portfolio->update($validated);

        if (! empty($additionalImages)) {
            $maxOrder = $portfolio->images()->max('order') ?? -1;

            foreach ($additionalImages as $index => $image) {
                $optimized = $this->optimizeImage->handle($image);
                $portfolio->images()->create([
                    'image_path' => $optimized['path'],
                    'thumbnail_path' => $optimized['thumbnail_path'],
                    'order' => $maxOrder + $index + 1,
                ]);
            }
        }

        return $portfolio;
    }
}
