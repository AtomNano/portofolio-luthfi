<?php

namespace App\Traits;

use App\Models\Tenant;
use App\Scopes\TenantScope;

/**
 * Automatically applies TenantScope to all queries on the model.
 * Also auto-sets tenant_id on create.
 */
trait BelongsToTenant
{
    protected static function bootBelongsToTenant(): void
    {
        static::addGlobalScope(new TenantScope);

        static::creating(function ($model) {
            if (! $model->tenant_id && $tenantId = TenantScope::getTenant()) {
                $model->tenant_id = $tenantId;
            }
        });
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}
