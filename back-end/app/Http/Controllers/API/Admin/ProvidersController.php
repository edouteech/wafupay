<?php

namespace App\Http\Controllers\API\Admin;

use App\Models\Supplier;
use App\Models\WProvider;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\API\BaseController;

class ProvidersController extends BaseController
{
    private $rules = [
        'name' => 'required|string|unique:w_providers,name|max:255',
        'withdraw_mode' => 'required|string|max:255',
        'sending_mode' => 'required|string|max:255',
        'with_otp' => 'nullable|boolean',
        'payin_fee' => 'required|numeric|min:0',
        'payout_fee' => 'required|numeric|min:0',
        'logo' => 'extensions:jpg,jpeg,png,bmp,gif,svg,webp|file|max:2048',
        'country_id' => 'required|exists:countries,id',
    ];
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $per_page = request()->input('per_page', 10);
        $providers = WProvider::with('country', 'suppliers')->orderBy('name')->paginate($per_page);
        return $this->handleResponse( $providers,
            'wallet providers and their associated transaction fees retrieved successfully'
        );
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $this->handleValidate($request->all(), $this->rules);
        $provider = WProvider::create($validatedData);
        return $this->handleResponse($provider, 'provider created successfully');
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function provider_supplier(Request $request)
    {
        $rules = [
            'provider_id' => 'required|exists:w_providers,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'type' => 'required|string|in:payin,payout',
        ];
        $validatedData = $this->handleValidate($request->all(), $rules);
        $provider = WProvider::find($validatedData['provider_id']);
        $supplier = Supplier::find($validatedData['supplier_id']);
        $old_supplier = $provider->suppliers()->wherePivot('type', $validatedData['type'])->first();
        $provider->suppliers()->wherePivot('type', $validatedData['type'])->detach($old_supplier);
        $supplier->providers()->attach(
            $provider, ['type' => $validatedData['type'], 'priority' => true]
        );
        // return response()->json($provider->suppliers()->wherePivot('type', $validatedData['type'])->get());
        // $provider->suppliers()->attach(
        //     $supplier, ['type' => $validatedData['type'], 'priority' => true]
        // );
        return $this->handleResponse($provider, 'provider supplier updated successfully');
    }
}
