<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create(
            [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'email' => 'exemple@exemple.com',
                'phone_num' => '+22996431150',
                'password' => 'Limit123#',
                'is_verified' => true,
                'is_admin' => true,
                'is_active' => true,
            ],
        );
    }
}
