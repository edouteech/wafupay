<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Country;
use Illuminate\Http\Request;

class CountryController extends BaseController
{
    private array $rules = [
        'slug' => 'required|string',
        'code' => 'required|string|uppercase|unique:countries',
    ];

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->handleResponse(
            Country::with('users')->get(),
            'Countries retrieved successfully'
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->handleValidate($request->post(), $this->rules);
        $country = Country::create($request->all());

        return $this->handleResponse(
            $country->with(['users'])->get(),
            'Country successfully created.'
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Country $country)
    {
        return $this->handleResponse($country->with(['users'])->get());
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Country $country)
    {
        $this->handleValidate($request->post(), [
            'slug' => 'required|string',
            'code' => 'required|string|uppercase',
        ]);

        $country->update($request->all());

        return $this->handleResponse(
            $country->with(['users'])->get(),
            'Country updated successfully'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Country $country)
    {
        $country->delete();
        return $this->handleResponse($country, 'Currency deleted successfully.');
    }
}
