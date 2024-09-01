<?php

namespace App\Models;

use App\Http\Utils\ValidationException;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class WProvider extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'logo',
        'country_id',
        'with_otp',
        'payin_fee',
        'payout_fee',
    ];

    // public function transaction_fees(): HasMany
    // {
    //     return $this->hasMany(TransactionFees::class);
    // }

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function getFee(float | string $amount)
    {
        return array_filter(
                array(...$this->transaction_fees),
                function ($fee) use ($amount) {
                    // return ($fee['min_amount'] <= $amount) &&  ($amount <= $fee['max_amount']);
                    return true;
                }
            )[0] ??
            throw new ValidationException(json_encode([
                'status' => 403,
                'message' => "Le solde que vous essayez d'envoyer est trop inferieur ou trop grande, nous supportons de 500 à 500 000 FCFA pour ce gestionnaire de portefeuil"
            ]));
    }
    public function suppliers()
    {
        return $this->belongsToMany(Supplier::class, 
        'provider_supplier', 'provider_id', 'supplier_id')
        ->withPivot('type', 'priority');
    }
    public function payin_supplier()
    {
        return $this->belongsToMany(Supplier::class, 
        'provider_supplier', 'provider_id', 'supplier_id')
        ->wherePivot('type', 'payin')
        ->withPivot('type', 'priority');
    }
    public function payout_supplier()
    {
        return $this->belongsToMany(Supplier::class, 
        'provider_supplier', 'provider_id', 'supplier_id')
        ->wherePivot('type', 'payout')
        ->withPivot('type', 'priority');
    }
}
