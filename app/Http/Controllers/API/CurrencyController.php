<?php

namespace App\Http\Controllers\API;

use App\Models\Currency;
use Illuminate\Http\Request;

class CurrencyController extends BaseController
{
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Currency $currency)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Currency $currency)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Currency $currency)
    {
        //
    }
}
