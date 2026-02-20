<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Portfolio extends Model
{
    use BelongsToTenant, HasFactory;

    protected $fillable = [
        'tenant_id',
        'user_id',
        'title',
        'category',
        'description',
        'project_url',
        'image_path',
        'thumbnail_path',
        'development_time',
        'tools',
        'github_url',
        'video_url',
        'is_published',
        'view_count',
        'order',
    ];

    protected $casts = [
        'tools' => 'array',
        'is_published' => 'boolean',
        'view_count' => 'integer',
        'order' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(PortfolioImage::class)->orderBy('order');
    }

    public function pageViews(): HasMany
    {
        return $this->hasMany(PageView::class);
    }
}
