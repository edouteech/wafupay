<?php

namespace App\Http\Controllers\API;

use App\Http\Resources\TransactionResource;
use App\Http\Utils\PayDunya;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TransactionController extends TransactionBaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $transactions = TransactionResource::collection(Transaction::orderByDesc('id')->get());
        return $this->handleResponse($transactions);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user->is_active || !$user->is_verified) {
            return $this->handleError(
                __('validation.valid_sender_account'),
                ['error' => 'Your account is not verified.'],
                403
            );
        }

        $payloads = $this->handleValidate($request->post(), $this->rules);

        $additionalData = $this->calculate_fees($request);

        $sender = [
            'fullname' => $user->first_name . ' ' . $user->last_name,
            'email' => $user->email,
            'country' => $user->country->slug,
            'phone_num' => $request->payin_phone_number,
            'otp_code' => $request->input('otp_code', 1),
        ];

        $receiveStatus = PayDunya::receive(
            $additionalData['amountWithFees'],
            $additionalData['payinProvider'],
            $sender
        );

        if (
            $receiveStatus['status'] == PayDunya::STATUS_OK &&
            $receiveStatus['message']['success'] === true &&
            $receiveStatus['token']
        ) {

            unset($payloads['amount']);

            Transaction::create([
                ...$payloads,
                'payin_status' => Transaction::PENDING_STATUS,
                'payout_status' => Transaction::PENDING_STATUS,
                'type' => $request->type ?? 'others',
                'token' => $receiveStatus['token'],
                'user_id' => $user->id,
                'amount' => $additionalData['amountWithFees'],
                'amountWithoutFees' => $additionalData['amountWithoutFees'],
                'otp_code' => $request->input('otp_code', 1),
            ]);

            return $this->handleResponse($receiveStatus);
        }
        return $this->handleResponse($receiveStatus);
    }

    public function checkTransactionStatus(Request $request, $token)
    {
        $this->handleValidate($request->input(), ['payin' => 'required']);

        if ($request->payin == true) {
            return $this->handleResponse(PayDunya::is_received($token));
        }

        return $this->handleResponse(PayDunya::is_sent($token));
    }

    public function updatePayinStatus(Request $request)
    {
        $invoice = json_encode($request->all()) . ',' . Storage::get('public/transaction.json');
        Storage::put('public/transaction.json', $invoice);

        $calculate_hash = hash('sha512', env('PAYDUNYA_MASTER_KEY'));

        if ($calculate_hash !== $request->hash) {
            return;
        }

        $transaction = Transaction::where('token', $request->invoice['token'])->firstOrFail();
        $serverStatus = $request->status;

        $status = $serverStatus === 'completed' ? 'success' : ($serverStatus === 'canceled' ? 'failed' : ($serverStatus === 'failed' ? 'failed' : null));
        $transaction->update(['payin_status' => $status]);

        if ($status == Transaction::APPROVED_STATUS) {
            return PayDunya::send(
                $transaction->payout_wprovider->withdraw_mode,
                $transaction->payout_phone_number,
                $transaction->amountWithoutFees,
            );
        }
        return;
    }

    public function updatePayoutStatus(Request $request)
    {
        if ($request->data['status'] == Transaction::APPROVED_STATUS) {
            $transaction = Transaction::where('disburse_token', $request->data['token'])->firstOrFail();

            $transaction->update(['payout_status' => $request->data['status']]);
        }
        $invoice = json_encode($request->all()) . ',' .  Storage::get('public/disburse.json');
        return Storage::put('public/disburse.json', $invoice);
    }

    public function refresh_transaction(Request $request, $payin_token)
    {
        $user = $request->user();

        $transaction = Transaction::where('token', $payin_token)->firstOrFail();

        if ($user->id != $transaction->user_id) {
            return $this->handleError(
                "Unauthorized action",
                ['error' => 'Action non autorisée'],
                403
            );
        }

        if ($transaction->payin_status !== Transaction::APPROVED_STATUS) {

            $sender = [
                'fullname' => $user->first_name . ' ' . $user->last_name,
                'email' => $user->email,
                'country' => $user->country->slug,
                'phone_num' => $transaction->payin_phone_number,
                'otp_code' => $transaction->otp_code,
            ];

            return PayDunya::receive(
                $transaction->amount,
                $transaction->payin_wprovider,
                $sender
            );
        }

        if (
            $transaction->payin_status == Transaction::APPROVED_STATUS
            && $transaction->payout_status !== Transaction::APPROVED_STATUS
        ) {
            return PayDunya::send(
                $transaction->payout_wprovider->withdraw_mode,
                $transaction->payout_phone_number,
                $transaction->amountWithoutFees,
            );
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($transaction)
    {
        $transaction = Transaction::findOrFail($transaction);

        return $this->handleResponse(new TransactionResource($transaction));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        $transaction->delete();
        return $this->handleResponse($transaction, 'Transaction deleted successfully.');
    }

    public function destroyByUser(Request $request, Transaction $transaction)
    {
        if ($request->user()->id != $transaction->user_id) {
            return $this->handleError(
                "Unauthorized action",
                ['error' => 'Action non autorisée'],
                403
            );
        }

        $transaction->delete();
        return $this->handleResponse($transaction, 'Your transaction deleted successfully.');
    }
}
