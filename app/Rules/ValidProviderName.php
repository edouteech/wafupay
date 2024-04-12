<?php

namespace App\Rules;

use App\Http\Utils\PayDunya;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidProviderName implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!array_key_exists($value, PayDunya::PAYEMENT_MAPPING)) {
            $fail('validation.valid_provider_name')
                ->translate(['providers' => implode(', ', PayDunya::PAYEMENT_MAPPING)]);
        }
    }
}
