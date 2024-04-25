<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Country;
use App\Models\User;
use App\Models\WProvider;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create(
            [
                'first_name' => 'Kabirou',
                'last_name' => 'ALASSANE',
                'email' => 'kabirou2001@gmail.com',
                'phone_num' => '96431150',
                'password' => 'Limit123#',
                'is_verified' => true
            ],
        );
    }
}
