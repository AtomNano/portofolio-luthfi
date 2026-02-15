<?php

namespace App\Actions\Portfolio;

use App\Models\Portfolio;
use Illuminate\Support\Facades\Storage;

class DeletePortfolioAction
{
    /**
     * Delete a portfolio and all its associated images from storage.
     */
    public function handle(Portfolio $portfolio): void
    {
        // Delete main image and thumbnail
        if ($portfolio->image_path) {
            Storage::disk('public')->delete($portfolio->image_path);
        }

        if ($portfolio->thumbnail_path) {
            Storage::disk('public')->delete($portfolio->thumbnail_path);
        }

        // Delete all associated images and thumbnails
        foreach ($portfolio->images as $image) {
            if ($image->image_path) {
                Storage::disk('public')->delete($image->image_path);
            }

            if ($image->thumbnail_path) {
                Storage::disk('public')->delete($image->thumbnail_path);
            }
        }

        $portfolio->delete();
    }
}
