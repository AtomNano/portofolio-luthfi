<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    protected $fillable = [
        'tenant_id',
        'gateway_reference',
        'amount',
        'currency',
        'status',
        'plan_slug',
        'is_renewal',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'is_renewal' => 'boolean',
        ];
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
}
