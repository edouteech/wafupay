<?php

namespace App\Http\Controllers\API;

use App\Http\Resources\TransactionResource;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends BaseController
{
    private array $rules = [
        'to_id' => 'required|exists:accounts,id',
        'from_id' => 'required|exists:accounts,id',
        'currency_id' => 'exists:currencies,id',
        'amount' => 'required|numeric|min:100',
        'type' => 'in:school_help,family_help,rent,others'
    ];
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
        $this->handleValidate($request->post(), $this->rules);

        return $this->handleResponse([], 'Transaction saved successfully');
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
