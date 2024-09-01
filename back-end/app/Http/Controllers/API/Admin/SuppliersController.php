<?php

namespace App\Http\Controllers\API\Admin;

use App\Models\Supplier;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\API\BaseController;

class SuppliersController extends BaseController
{
    private array $rules = [
        'name' => 'required|string|max:255|unique:suppliers,name',
        'wallet_name' => 'required|json',
        'payin_fees' => 'required|json',
        'payout_fees' => 'required|json',
    ];
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $suppliers = Supplier::get();
        return response()->json([
            'data' => $suppliers,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            // Decode JSON objects to arrays
            $request->merge([
                'wallet_name' => json_encode($request->input('wallet_name')),
                'payin_fees' => json_encode($request->input('payin_fees')),
                'payout_fees' => json_encode($request->input('payout_fees')),
            ]);
    
            // Validate the request data
            $validatedData = $this->handleValidate($request->all(), $this->rules);
        } catch (ValidationException $e) {
            // If validation fails, handle error and return a 404 error
            return $this->handleError('Validation failed', $e->getMessage(), 404);
        }
    
        // Create a new supplier with the validated data
        $supplier = Supplier::create($validatedData);
    
        // Return a success response with the created supplier
        return $this->handleResponse($supplier, 'Supplier created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Supplier $supplier)
    {
        try {
            // Decode JSON objects to arrays
            $request->merge([
                'wallet_name' => json_encode($request->input('wallet_name')),
                'payin_fees' => json_encode($request->input('payin_fees')),
                'payout_fees' => json_encode($request->input('payout_fees')),
            ]);

            // Update validation rules to allow unique name except for the current supplier
            $rules = $this->rules;
            $rules['name'] = 'nullable|string|max:255|unique:suppliers,name,' . $supplier->id;

            // Validate the request data
            $validatedData = $this->handleValidate($request->all(), $rules);
        } catch (ValidationException $e) {
            // If validation fails, handle error and return a 422 error
            return $this->handleError('Validation failed', $e->validator->errors(), 422);
        }

        // Update the supplier with the validated data
        $supplier->update($validatedData);
        $supplier->save();

        // Return a success response with the updated supplier
        return $this->handleResponse($supplier, 'Supplier updated successfully');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
