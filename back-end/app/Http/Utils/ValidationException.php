<?php

namespace App\Http\Utils;

use Illuminate\Http\JsonResponse;

class ValidationException extends \Exception
{
    public function __construct(private array | string $errors)
    {
    }

    public function render(): JsonResponse
    {
        return response()->json(json_decode($this->errors), 402);
    }
}
