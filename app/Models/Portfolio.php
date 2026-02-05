<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Portfolio extends Model
{
    protected $fillable = [
        'title',
        'category',
        'description',
        'project_url',
        'image_path',
        'development_time',
        'tools',
        'github_url',
        'video_url',
    ];

    protected $casts = [
        'tools' => 'array',
    ];

    public function images(): HasMany
    {
        return $this->hasMany(PortfolioImage::class)->orderBy('order');
    }

    public function pageViews(): HasMany
    {
        return $this->hasMany(PageView::class);
    }
}
