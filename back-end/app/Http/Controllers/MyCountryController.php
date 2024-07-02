<?php

namespace App\Http\Controllers;

use App\Models\Country;
use Illuminate\Http\Request;

class MyCountryController extends Controller
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

}
