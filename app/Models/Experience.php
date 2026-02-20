<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'user_id',
        'role',
        'company',
        'period',
        'description',
        'order',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
