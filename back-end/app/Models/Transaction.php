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
        'amountWithoutFees',
        'token',
        'disburse_token',
        'type'
    ];

    public const PENDING_STATUS = 'pending';

    public const APPROVED_STATUS = 'success';

    public const REJECTED_STATUS = 'failed';

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

    public function scopeSuccess($query)
    {
        return $this->where(['payin_status' => 'success', 'payout_status' => 'success']);
        // return $query->where('payin_status', 'success')
        //              .where('payout_status', 'success');
    }
}
