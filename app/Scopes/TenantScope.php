<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

/**
 * Global Scope that automatically filters all queries by the current tenant's ID.
 * Applied via the BelongsToTenant trait on tenant-aware models.
 */
class TenantScope implements Scope
{
    protected static ?int $tenantId = null;

    public static function setTenant(?int $tenantId): void
    {
        self::$tenantId = $tenantId;
    }

    public static function getTenant(): ?int
    {
        return self::$tenantId;
    }

    public static function clear(): void
    {
        self::$tenantId = null;
    }

    public function apply(Builder $builder, Model $model): void
    {
        if (self::$tenantId !== null) {
            $builder->where($model->getTable().'.tenant_id', self::$tenantId);
        }
    }
}
