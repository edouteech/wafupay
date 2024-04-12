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

        $this->handleValidate($request->post(), [
            'receiver_phone_number' => ['required'],
            'currency_id' => 'exists:currencies,id',
            'amount' => 'required|numeric|min:100',
            'type' => 'in:school_help,family_help,rent,others',
            'provider_name' => ['required', new ValidProviderName],
        ]);

        $sender = [
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'phone_num' => $request->receiver_phone_number,
            'country' => $user->country,
        ];

        return PayDunya::receive($request->amount, $request->provider_name, $sender);
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
