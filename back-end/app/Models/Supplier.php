<?php

namespace App\Models;

// use App\Models\WProvider;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Supplier extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'wallet_name',
        'payin_fees',
        'payout_fees',
    ];
    
    public function providers()
    {
        return $this->belongsToMany(WProvider::class, 'provider_supplier');
    }
}
