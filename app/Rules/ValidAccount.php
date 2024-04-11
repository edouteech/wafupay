<?php

namespace App\Rules;

use App\Models\Account;
use App\Models\User;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidAccount implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $validUser = User::where(
            [
                'phone_num' => $value,
                'is_active' => true
            ]
        )->first();

        if (!$validUser || !$validUser->account || !$validUser->account->is_verified) {
            $fail('validation.valid_receiver_account')->translate();
        }
    }
}
