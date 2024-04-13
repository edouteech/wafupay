<?php

namespace App\Http\Controllers\API;

use App\Http\Resources\TransactionFeesResource;
use App\Models\TransactionFees;
use Illuminate\Http\Request;

class TransactionFeesController extends BaseController
{
    private array $rules = [
        'min_amount' => 'required|numeric',
        'max_amount' => 'required|numeric',
        'payin_fee' => 'required|numeric|max:100|min:0',
        'payout_fee' => 'required|numeric|max:100|min:0',
        'wprovider_id' => 'required|exists:w_providers,id'
    ];

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $transactionFees = TransactionFeesResource::collection(TransactionFees::all());
        return $this->handleResponse($transactionFees);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->handleValidate($request->post(), $this->rules);

        $transactionFees = TransactionFees::create([...$request->post(), ...['user_id' => $request->user()->id]]);

        return $this->handleResponse(new TransactionFeesResource($transactionFees), 'TransactionFees created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(TransactionFees $transactionFees)
    {
        if ($transactionFees) {
            return $this->handleResponse(
                new TransactionFeesResource($transactionFees),
                'wallet provider retrieved successfully'
            );
        }
        return $this->handleError('transaction fees provider not found');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TransactionFees $transactionFees)
    {
        $payloads = $this->handleValidate($request->post(), $this->rules);


        $transactionFees->update($payloads);

        return $this->handleResponse(
            new TransactionFeesResource($transactionFees),
            'TransactionFees updated successfully.'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TransactionFees $transactionFees)
    {
        $transactionFees->delete();
        return $this->handleResponse($transactionFees, 'transaction fees deleted successfully.');
    }
}
