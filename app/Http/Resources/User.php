<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class User extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            ...parent::toArray($request),
            'country' => $this->country,
            'account' => $this->account,
            'otp_codes' => $this->otp_codes,
            'logs' => $this->logs,
        ];
    }
}
