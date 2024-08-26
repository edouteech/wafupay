<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\WProviderResource;
use App\Models\WProvider;
use Illuminate\Http\Request;

class WProviderController extends BaseController
{
    private array $rules = [
        'name' => 'required|string|unique:w_providers',
        'withdraw_mode' => 'required|string|unique:w_providers',
        'sending_mode' => 'required|string|unique:w_providers',
        'country_id' => 'required|exists:countries,id',
        'logo' => 'extensions:jpg,jpeg,png,bmp,gif,svg,webp|file|max:2048',
        'fees' => 'required|array',
        'fees.*.payin_fee' => 'required|numeric',
        'fees.*.payout_fee' => 'required|numeric',
        'fees.*.min_amount' => 'required|numeric|min:10',
        'fees.*.max_amount' => 'required|numeric|max:500000',
    ];

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $providers = WProvider::with('country')->orderBy('name')->get();
        return $this->handleResponse( $providers,
            'wallet providers and their associated transaction fees retrieved successfully'
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->handleValidate($request->post(), $this->rules);

        try {
            $wProviderData = $request->except('logo');
            $wProviderData['user_id'] = $request->user()->id;

            if ($request->hasFile('logo')) {
                $logoPath = $request->file('logo')->store('wprovider-logos', 'public');
                $wProviderData['logo'] = $logoPath;
            }
            $wProvider = WProvider::create($wProviderData);

            $feesData = $request->input('fees');

            // foreach ($feesData as $fee) {
            //     $wProvider->transaction_fees()->create([
            //         'payin_fee' => $fee['payin_fee'],
            //         'payout_fee' => $fee['payout_fee'],
            //         'min_amount' => $fee['min_amount'],
            //         'max_amount' => $fee['max_amount'],
            //         'user_id' => $request->user()->id,
            //     ]);
            // }

            return $this->handleResponse(
                new WProviderResource($wProvider),
                'wallet provider created with ' . count($feesData) . ' transaction fees'
            );
        } catch (\Throwable $th) {
            return $this->handleError($th);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($wProvider)
    {
        $wProvider = WProvider::findOrFail($wProvider);
        if ($wProvider->id) {
            return $this->handleResponse(
                new WProviderResource($wProvider),
                'Wallet provider retrieved successfully'
            );
        }
        return $this->handleError('wallet provider not found');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $wProvider)
    {

        $this->handleValidate($request->post(), [
            'name' => 'required|string',
            'withdraw_mode' => 'required|string',
            'sending_mode' => 'required|string',
            'country_id' => 'required|exists:countries,id',
            'logo' => 'extensions:jpg,jpeg,png,bmp,gif,svg,webp|file',
        ]);

        $wProvider = WProvider::findOrFail($wProvider);
        $wProviderData = $request->except('logo');

        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('wprovider-logos', 'public');
            $wProviderData['logo'] = $logoPath;
        }

        $wProvider->update($wProviderData);

        $feesData = $request->input('fees', []);

        // foreach ($feesData as $fee) {
        //     $transactionFee = $wProvider->transaction_fees()->first();

        //     $transactionFee->update([
        //         'payin_fee' => $fee['payin_fee'],
        //         'payout_fee' => $fee['payout_fee'],
        //         'min_amount' => $fee['min_amount'],
        //         'max_amount' => $fee['max_amount'],
        //     ]);
        // }

        return $this->handleResponse(
            new WProviderResource($wProvider),
            'wallet provider updated successfully'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($wProvider)
    {
        $wProvider = WProvider::findOrFail($wProvider);
        $wProvider->delete();
        return $this->handleResponse($wProvider->sending_mode . ' wallet provider deleted successfully');
    }
}
