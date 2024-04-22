<?php

namespace App\Http\Controllers\API;

use App\Http\Resources\TransactionResource;
use App\Http\Utils\PayDunya;
use App\Models\Transaction;
use Illuminate\Http\Request;

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
                202
            );
        }

        $payloads = $this->handleValidate($request->post(), $this->rules);

        $additionalData = $this->calculate_fees($request);

        $sender = [
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'country' => $user->country->slug,
            'phone_num' => $request->payin_phone_number,
            'otp' => $request->opt,
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

            $transaction = Transaction::create([
                ...$payloads,
                'payin_status' => Transaction::PENDING_STATUS,
                'payout_status' => Transaction::PENDING_STATUS,
                'type' => $request->type ?? 'others',
                'token' => $receiveStatus['token'],
                'user_id' => $user->id,
            ]);

            //$check = PayDunya::is_received($receiveStatus['token']);

            if ($this->confirm_received_status_in_async_mode($receiveStatus['token'])) {

                $transaction->update(['payin_status' => Transaction::APPROVED_STATUS]);

                $sendStatus = PayDunya::send(
                    $additionalData['payoutProvider']->withdraw_mode,
                    $request->payout_phone_num,
                    $additionalData['amountWithoutFees']
                );

                if ($sendStatus['status'] == PayDunya::STATUS_OK) {

                    $transaction->update(['disburse_token' => $sendStatus['token']]);

                    $check = PayDunya::is_sent($sendStatus['token']);

                    if ($check['response_code'] == PayDunya::STATUS_OK) {

                        $transaction->update(['payout_status' => Transaction::APPROVED_STATUS]);

                        return $this->handleResponse($transaction);
                    }
                }
                return $this->handleError($sendStatus['description'], $sendStatus);
            }
            return $this->handleError('Delai d\'attente depassé, transaction échoué', $receiveStatus);
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

    public function updateTransactionStatus(Request $request)
    {
        $calculate_hash = hash('sha512', env('PAYDUNYA_MASTER_KEY'));

        if ($calculate_hash !== $request->hash) {
            return;
        }

        $transaction = Transaction::where('token', $request->invoice['token']);
        $serverStatus = $request->status;

        $status = $serverStatus === 'completed' ? 'success' : ($serverStatus === 'canceled' ? 'failed' : ($serverStatus === 'failed' ? 'failed' : null));
        $transaction->update(['payin_status' => $status]);
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
     * Update the specified resource in storage.
     */
    public function update(Request $request, Transaction $transaction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        //
    }
}
