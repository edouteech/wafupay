<?php

namespace Database\Seeders;

use App\Models\Country;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CountrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $countries = [
            ['slug' => 'benin', 'code' => 'BJ', 'country_code' => '+229'],
            ['slug' => 'burkina-faso', 'code' => 'BF', 'country_code' => '+226'],
            ['slug' => 'cote-d\'Ivoire', 'code' => 'CI', 'country_code' => '+225'],
            ['slug' => 'guinee-bissau', 'code' => 'GW', 'country_code' => '+245'],
            ['slug' => 'mali', 'code' => 'ML', 'country_code' => '+223'],
            ['slug' => 'niger', 'code' => 'NE', 'country_code' => '+227'],
            ['slug' => 'senegal', 'code' => 'SN', 'country_code' => '+221'],
            ['slug' => 'togo', 'code' => 'TG', 'country_code' => '+228'],
        ];

        foreach ($countries as $country) {
            Country::create($country);
        }
    }
}
