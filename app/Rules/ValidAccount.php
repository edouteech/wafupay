<?php

namespace App\Rules;

use App\Models\Account;
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
        $validAccount = Account::where(['id' => $value, 'is_verified' => true])
            ->first();
        $validAccount = !$validAccount ?? $validAccount->user->is_active;

        if (!$validAccount) {
            $fail('validation.valid_receiver_account')->translate();
        }
    }
}
