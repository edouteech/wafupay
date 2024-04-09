<?php

namespace App\Http\Controllers\API;

use App\Models\Currency;
use Illuminate\Http\Request;

class CurrencyController extends BaseController
{
    private array $rules = [
        'slug' => 'required|string',
        'code' => 'required|string|min:3|uppercase|unique:currencies',
        'symbol' => 'required',
    ];

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->handleResponse(Currency::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->handleValidate($request->post(), $this->rules);

        $currency = Currency::create([...$request->post(), ...['user_id' => $request->user()->id]]);

        return $this->handleResponse($currency, 'Currency created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Currency $currency)
    {
        return $this->handleResponse($currency);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Currency $currency)
    {
        $this->handleValidate($request->post(), [
            'slug' => 'required|string',
            'code' => 'required|string|min:3|uppercase',
            'symbol' => 'required',
        ]);

        $currency->update($request->post());

        return $this->handleResponse($currency, 'Currency updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Currency $currency)
    {
        $currency->delete();

        return $this->handleResponse($currency, 'Currency deleted successfully.');
    }
}
