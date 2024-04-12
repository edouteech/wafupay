<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidPhoneNumber implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
         // Expression régulière pour valider le numéro de téléphone dans la zone UEMOA
        $isValidNumber = preg_match("/^\+(229|225|223|228|226|241|232|233|240|224)(\d{8}|\d{10})$/", $value);
        if (!$isValidNumber) {
            $fail('validation.phone_valid_number')->translate(['attribute' => $attribute]);
        }
    }
}
