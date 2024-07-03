<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class UserSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        foreach (range(1, 20) as $index) {
            DB::table('users')->insert([
                'first_name' => $faker->firstName,
                'last_name' => $faker->lastName,
                'email' => $faker->unique()->safeEmail,
                'phone_num' => $faker->phoneNumber,
                'is_admin' => false,
                'is_active' => true,
                'is_verified' => false,
                'email_verified_at' => now(),
                'password' => Hash::make('Limit123#'),
                'avatar' => null,
                'id_card' => 'user',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
