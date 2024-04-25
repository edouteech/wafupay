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
            ['slug' => 'Benin', 'code' => 'BJ', 'country_code' => '+229'],
            ['slug' => 'Burkina-faso', 'code' => 'BF', 'country_code' => '+226'],
            ['slug' => 'Cote-d\'Ivoire', 'code' => 'CI', 'country_code' => '+225'],
            ['slug' => 'Guinee-bissau', 'code' => 'GW', 'country_code' => '+245'],
            ['slug' => 'Mali', 'code' => 'ML', 'country_code' => '+223'],
            ['slug' => 'Niger', 'code' => 'NE', 'country_code' => '+227'],
            ['slug' => 'Senegal', 'code' => 'SN', 'country_code' => '+221'],
            ['slug' => 'Togo', 'code' => 'TG', 'country_code' => '+228'],
        ];

        foreach ($countries as $country) {
            Country::create($country);
        }
    }
}
