<?php

namespace App\Http\Controllers\API;

use App\Http\Resources\TransactionResource;
use App\Http\Utils\PayDunya;
use App\Models\Transaction;
use App\Rules\ValidAccount;
use App\Rules\ValidProviderName;
use Illuminate\Http\Request;

class TransactionController extends BaseController
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

        if (!$user->is_active || (!$user->account || !$user->account->is_verified)) {
            return $this->handleError(
                __('validation.valid_sender_account'),
                ['error' => 'Your account is not verified.'],
                202
            );
        }

        $payloads = $this->handleValidate($request->post(), [
            'payin_phone_number' => 'required|min:8|numeric',
            'payin_wprovider_id' => ['required', new ValidProviderName],
            'payout_phone_number' => 'required|min:8|numeric',
            'payout_wprovider_id' => ['required', new ValidProviderName],
            'amount' => 'required|numeric|min:100',
            'type' => 'in:school_help,family_help,rent,others',
        ]);

        $sender = [
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'phone_num' => $request->payin_phone_number,
        ];

        $receiveStatus = PayDunya::receive(
            $request->amount,
            $request->sender_provider_name,
            $sender
        );

        if (
            $receiveStatus['status'] == PayDunya::STATUS_OK &&
            $receiveStatus['message']['success'] === 'success' &&
            $receiveStatus['token']
        ) {

            $transaction = Transaction::create([
                'payin_phone_number' => $request->sender_phone_number,
                'payin_wprovider_id' => $request->sender_provider_name,
                'payin_status' => $request->receiver_phone_number,
                'payout_phone_number' => $request->receiver_provider_name,
                'payout_wprovider_id' => $request->amount,
                'payout_status' => $request->type,
                'amount' => $request->type,
                'type' => $request->type,
                'token' => $receiveStatus['token'],
            ]);

            $check = PayDunya::is_received($receiveStatus['token']);

            if ($check['response_text'] == PayDunya::STATUS_COMPLETED_KEY) {

                $sendStatus = PayDunya::send(
                    $request->receiver_provider_name,
                    $request->receiver_phone_num,
                    $request->amount
                );

                if ($sendStatus['status'] == PayDunya::STATUS_OK) {
                    $check = PayDunya::is_sent($sendStatus['token']);

                    if ($check['response_code'] == PayDunya::STATUS_OK) {



                        return $this->handleResponse($transaction);
                    }
                }
                return $this->handleError($sendStatus['description'], $sendStatus);
            }
            return $this->handleResponse($receiveStatus, 'Sender: ' . $receiveStatus['fail_reason']);
        }
        return $this->handleError($receiveStatus['message']['message'], $receiveStatus);
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction)
    {
        //
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
