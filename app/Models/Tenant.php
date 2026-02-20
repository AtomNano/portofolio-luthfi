<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Tenant extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'custom_domain',
        'plan_id',
        'owner_id',
        'logo',
        'favicon',
        'primary_color',
        'settings',
        'status',
        'subscription_status',
        'subscription_ends_at',
        'stripe_customer_id',
    ];

    protected function casts(): array
    {
        return [
            'settings' => 'array',
            'subscription_ends_at' => 'datetime',
        ];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function portfolios(): HasMany
    {
        return $this->hasMany(Portfolio::class);
    }

    public function experiences(): HasMany
    {
        return $this->hasMany(Experience::class);
    }

    public function subscription(): HasOne
    {
        return $this->hasOne(Subscription::class)->latestOfMany();
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /** Calculates total storage used (MB) across all portfolio images. */
    public function getStorageUsageMb(): float
    {
        $totalBytes = 0;

        foreach ($this->portfolios()->with('images')->get() as $portfolio) {
            foreach ($portfolio->images as $image) {
                $path = storage_path('app/public/'.$image->image_path);
                if (file_exists($path)) {
                    $totalBytes += filesize($path);
                }
            }
        }

        return round($totalBytes / 1024 / 1024, 2);
    }
}
