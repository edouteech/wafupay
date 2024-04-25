<?php

namespace App\Http\Controllers\API;

use App\Http\Utils\PayDunya;
use App\Http\Utils\ValidationException;
use App\Models\Transaction;
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
        'otp_code' => 'string|min:4',
    ];

    protected function calculate_fees(Request $request): array
    {
        $isSupportedFee = filter_var($request->post('sender_support_fee'), FILTER_VALIDATE_BOOLEAN);

        $amountWithoutFees = $request->amount;

        $payinProvider = WProvider::find($request->payin_wprovider_id);
        $payoutProvider = WProvider::find($request->payout_wprovider_id);

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
            'amountWithoutFees' => (float) $amountWithoutFees,
            'amountWithFees' => (float) $amountWithFees,
        ];
    }

    protected function confirm_received_status_in_async_mode(string $token)
    {
        $maxAttempts = 5;
        $attempt = 0;

        while ($attempt < $maxAttempts) {
            $check = PayDunya::is_received($token);
            $responseStatus = $check['status'];

            if ($responseStatus == PayDunya::STATUS_COMPLETED_KEY) {
                return true;
            } elseif ($responseStatus == 'cancelled' || $responseStatus == 'failed') {
                $transaction = Transaction::where('token', $token);

                $status = ($responseStatus === 'canceled' ? 'failed' : ($responseStatus === 'failed' ? 'failed' : null));
                $transaction->update(['payin_status' => $status]);
                return false;
            } else {
                sleep(3);
                $attempt++;
            }
        }

        if ($attempt >= $maxAttempts) {
            return false;
        }
    }
}
