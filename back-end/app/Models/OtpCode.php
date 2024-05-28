<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OtpCode extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'code',
        'type',
        'is_verified',
        'expired_at',
    ];

    public const TwoFactor = '2fa';

    public const PASSWORD_RESET = 'reset_password';

    public const EmailVerificationTYPE = 'email_verification';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isExpired(): bool
    {
        return $this->expired_at !== null && $this->expired_at->lte(Carbon::now());
    }
}
