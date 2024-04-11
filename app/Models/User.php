<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Http\Resources\User as ResourcesUser;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone_num',
        'is_admin',
        'is_active',
        'avatar',
        'country_id',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'deleted_at'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'created_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function otp_codes(): HasMany
    {
        return $this->hasMany(OtpCode::class);
    }

    public function logs(): HasMany
    {
        return $this->hasMany(Log::class);
    }

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function account(): HasOne
    {
        return $this->hasOne(Account::class);
    }

    static public function create(array $attributes): self | ResourcesUser
    {
        $model = new self;
        $model->fill($attributes);
        if ($model->save()) {
            $model->account()->create([
                'account_num' => 'wafupay-' . $attributes['phone_num'] . '-' . $model->id,
                'currency_id' => $attributes['currency_id']
            ]);
            return new ResourcesUser($model);
        }
        return new static();
    }
}
