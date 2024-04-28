<?php

namespace App\Http\Controllers\API;

use App\Models\Country;
use Illuminate\Http\Request;

class CountryController extends BaseController
{
    private array $rules = [
        'slug' => 'required|string',
        'code' => 'required|string|uppercase|unique:countries',
        'country_code' => 'required|string|min:4|unique:countries',
    ];

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->handleResponse(
            Country::all(),
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
            $country,
            'Country successfully created.'
        );
    }

    /**
     * Display the specified resource.
     */
    public function show($country)
    {
        $country = Country::with('users')->findOrFail($country);
        return $this->handleResponse($country);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $country)
    {
        $this->handleValidate($request->post(), [
            'slug' => 'required|string',
            'code' => 'required|string|uppercase',
            'country_code' => 'required|string|min:4',
        ]);

        $country = Country::findOrFail($country);

        $country->update($request->all());

        return $this->handleResponse(
            $country,
            'Country updated successfully'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($country)
    {
        $country = Country::findOrFail($country);
        $country->delete();
        return $this->handleResponse($country, 'Currency deleted successfully.');
    }
}
