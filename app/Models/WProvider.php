<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class WProvider extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'withdraw_mode',
        'sending_mode',
        'logo',
    ];

    public function transaction_fees(): HasMany
    {
        return $this->hasMany(TransactionFees::class);
    }

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }
}
