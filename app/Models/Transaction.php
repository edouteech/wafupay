<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Transaction extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'payin_phone_number',
        'payin_wprovider_id',
        'payin_status',
        'payout_phone_number',
        'payout_wprovider_id',
        'payout_status',
        'amount',
        'type'
    ];

    public function payin_wprovider(): BelongsTo
    {
        return $this->belongsTo(WProvider::class);
    }

    public function payout_wprovider(): BelongsTo
    {
        return $this->belongsTo(WProvider::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
