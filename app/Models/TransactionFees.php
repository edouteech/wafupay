<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransactionFees extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'min_amount',
        'max_amount',
        'payin_fee',
        'payout_fee',
        'wprovider_id',
        'user_id'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function wprovider(): BelongsTo
    {
        return $this->belongsTo(WProvider::class);
    }
}
