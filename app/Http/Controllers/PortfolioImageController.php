<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use App\Models\PortfolioImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;

class PortfolioImageController extends Controller
{
    /**
     * Store new images for a portfolio.
     */
    public function store(Request $request, Portfolio $portfolio)
    {
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'image|max:2048',
        ]);

        $maxOrder = $portfolio->images()->max('order') ?? -1;

        foreach ($request->file('images') as $index => $image) {
            $path = $image->store('portfolios', 'public');
            $portfolio->images()->create([
                'image_path' => $path,
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
        // Ensure the image belongs to the portfolio
        if ($image->portfolio_id !== $portfolio->id) {
            abort(404);
        }

        // Delete the file
        if ($image->image_path) {
            Storage::disk('public')->delete($image->image_path);
        }

        $image->delete();

        return Redirect::back()->with('success', 'Gambar berhasil dihapus.');
    }

    /**
     * Reorder images.
     */
    public function reorder(Request $request, Portfolio $portfolio)
    {
        $request->validate([
            'images' => 'required|array',
            'images.*.id' => 'required|integer|exists:portfolio_images,id',
            'images.*.order' => 'required|integer|min:0',
        ]);

        foreach ($request->images as $imageData) {
            PortfolioImage::where('id', $imageData['id'])
                ->where('portfolio_id', $portfolio->id)
                ->update(['order' => $imageData['order']]);
        }

        return Redirect::back()->with('success', 'Urutan gambar berhasil diubah.');
    }
}
