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
        'to_id',
        'from_id',
        'amount',
        'currency_id',
        'type',
        'status'
    ];

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class);
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function receiver(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }
}
