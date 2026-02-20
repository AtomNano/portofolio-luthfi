<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'tenant_id',
        'name',
        'username',
        'email',
        'password',
        'role',
        'google_id',
        'avatar',
        'job_title',
        'phone',
        'address',
        'bio',
        'skills',
        'soft_skills',
        'social_links',
        'years_experience',
        'projects_completed',
        'tech_stack',
        'is_admin',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_recovery_codes',
        'two_factor_secret',
    ];

    protected $appends = [
        'profile_photo_url',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'skills' => 'array',
            'soft_skills' => 'array',
            'social_links' => 'array',
            'tech_stack' => 'array',
            'is_admin' => 'boolean',
        ];
    }

    // ── Relationships ──────────────────────────────────────────────────

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function ownedTenant(): HasMany
    {
        return $this->hasMany(Tenant::class, 'owner_id');
    }

    public function portfolios(): HasMany
    {
        return $this->hasMany(Portfolio::class);
    }

    public function experiences(): HasMany
    {
        return $this->hasMany(Experience::class);
    }

    // ── Helper Methods ─────────────────────────────────────────────────

    public function isAdmin(): bool
    {
        return (bool) $this->is_admin;
    }

    public function isOwner(): bool
    {
        return $this->tenant?->owner_id === $this->id;
    }

    public function isOnPlan(string $planSlug): bool
    {
        return $this->tenant?->plan?->slug === $planSlug;
    }

    public function getProfilePhotoUrlAttribute(): string
    {
        if (!$this->avatar) {
            return 'https://ui-avatars.com/api/?name=' . urlencode($this->name) . '&color=7F9CF5&background=EBF4FF';
        }

        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = \Illuminate\Support\Facades\Storage::disk('public');

        return $disk->url($this->avatar);
    }
}
