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
        $user = parent::toArray($request);
        unset($user['country_id']);

        $transactions = $this->transactions->sortByDesc('id');

        return [
            ...$user,
            'country_id' => $this->id,
            'country' => $this->country,
            'otp_codes' => $this->otp_codes,
            'logs' => $this->logs,
            'transactions' => TransactionResource::collection($transactions),
        ];
    }
}
