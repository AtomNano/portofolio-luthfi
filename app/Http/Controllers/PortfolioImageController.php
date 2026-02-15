<?php

namespace App\Http\Controllers;

use App\Actions\OptimizeImageAction;
use App\Http\Requests\ReorderPortfolioImagesRequest;
use App\Http\Requests\StorePortfolioImagesRequest;
use App\Models\Portfolio;
use App\Models\PortfolioImage;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;

class PortfolioImageController extends Controller
{
    /**
     * Store new images for a portfolio.
     */
    public function store(StorePortfolioImagesRequest $request, Portfolio $portfolio, OptimizeImageAction $optimizeImage)
    {
        $maxOrder = $portfolio->images()->max('order') ?? -1;

        foreach ($request->file('images') as $index => $image) {
            $optimized = $optimizeImage->handle($image);
            $portfolio->images()->create([
                'image_path' => $optimized['path'],
                'thumbnail_path' => $optimized['thumbnail_path'],
                'order' => $maxOrder + $index + 1,
            ]);
        }

        return Redirect::back()->with('success', 'Gambar berhasil diupload.');
    }

    /**
     * Remove the specified image.
     */
    public function destroy(Portfolio $portfolio, PortfolioImage $image)
    {
        if ($image->portfolio_id !== $portfolio->id) {
            abort(404);
        }

        if ($image->image_path) {
            Storage::disk('public')->delete($image->image_path);
        }

        if ($image->thumbnail_path) {
            Storage::disk('public')->delete($image->thumbnail_path);
        }

        $image->delete();

        return Redirect::back()->with('success', 'Gambar berhasil dihapus.');
    }

    /**
     * Reorder images.
     */
    public function reorder(ReorderPortfolioImagesRequest $request, Portfolio $portfolio)
    {
        foreach ($request->validated()['images'] as $imageData) {
            PortfolioImage::where('id', $imageData['id'])
                ->where('portfolio_id', $portfolio->id)
                ->update(['order' => $imageData['order']]);
        }

        return Redirect::back()->with('success', 'Urutan gambar berhasil diubah.');
    }
}
