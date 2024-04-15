<?php

namespace App\Http\Controllers\API;

use App\Models\WProvider;
use Illuminate\Http\Request;

class TransactionBaseController extends BaseController
{
    protected array $rules = [
        'payin_phone_number' => 'required|min_digits:8|numeric|max_digits:10',
        'payin_wprovider_id' => ['required', 'exists:w_providers,id'],
        'payout_phone_number' => 'required|min_digits:8|numeric|max_digits:10',
        'payout_wprovider_id' => ['required', 'exists:w_providers,id'],
        'amount' => 'required|numeric|min:200',
        'sender_support_fee' => 'required',
        'type' => 'in:school_help,family_help,rent,others',
    ];

    protected function calculate_fees(Request $request): array
    {
        $isSupportedFee = filter_var($request->post('sender_support_fee'), FILTER_VALIDATE_BOOLEAN);

        $amountWithoutFees = $request->amount;

        $payinProvider = WProvider::where('id', $request->payin_wprovider_id)->first();
        $payoutProvider = WProvider::where('id', $request->payout_wprovider_id)->first();

        $totalFees = $payinProvider->getFee($amountWithoutFees)->payin_fee +
            $payoutProvider->getFee($amountWithoutFees)->payout_fee;

        $amountWithFees = (($amountWithoutFees * $totalFees) / 100) + $amountWithoutFees;

        if (!$isSupportedFee) {
            $amountWithoutFees -= ($amountWithFees - $amountWithoutFees);
            $amountWithFees = $request->amount;
        }

        return [
            'payinProvider' => $payinProvider,
            'payoutProvider' => $payoutProvider,
            'totalFees' => $totalFees,
            'amountWithoutFees' => $amountWithoutFees,
            'amountWithFees' => $amountWithFees,
        ];
    }
}
