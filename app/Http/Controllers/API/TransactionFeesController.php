<?php

namespace App\Http\Controllers\API;

use App\Models\TransactionFees;
use Illuminate\Http\Request;

class TransactionFeesController extends BaseController
{
    private array $rules = [
        'min_amount' => 'required|numeric',
        'max_amount' => 'required|numeric',
        'fee_amount' => 'required|numeric',
        'currency_id' => 'required',
    ];

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $transactionFees = TransactionFees::with(['currency', 'user'])->get();
        return $this->handleResponse($transactionFees);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->handleValidate($request->post(), $this->rules);

        $transactionFees = TransactionFees::create([...$request->post(), ...['user_id' => $request->user()->id]]);

        return $this->handleResponse($transactionFees, 'TransactionFees created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(TransactionFees $transactionFees)
    {
        return $this->handleResponse($transactionFees->with(['currency', 'user'])->get());
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TransactionFees $transactionFees)
    {
        $payloads = $this->handleValidate($request->post(), $this->rules);

        $transactionFees = $transactionFees->with(['currency', 'user']);

        $transactionFees->update($payloads);

        return $this->handleResponse(
            $transactionFees->get(),
            'TransactionsFees updated successfully.'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TransactionFees $transactionFees)
    {
        $transactionFees->delete();
        return $this->handleResponse($transactionFees, 'Currency deleted successfully.');
    }
}
