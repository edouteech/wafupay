<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;
use Carbon\Carbon;
use App\Models\User; // Assurez-vous que le modèle User est correctement importé
use App\Models\WProvider; // Assurez-vous que le modèle WProvider est correctement importé

class TransactionSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();
        
        // Assurez-vous d'avoir des utilisateurs et des w_providers dans votre base de données
        $userIds = User::pluck('id')->toArray();
        $wProviderIds = WProvider::pluck('id')->toArray();

        foreach (range(1, 100) as $index) {
            $amount = $faker->randomFloat(2, 500, 100000);
            $feePercentage = $faker->randomFloat(2, 0.02, 0.06);
            $amountWithoutFees = $amount - ($amount * $feePercentage);
            $createdAt = $faker->dateTimeBetween('-1 year', 'now');

            DB::table('transactions')->insert([
                'user_id' => $faker->randomElement($userIds),
                'payin_phone_number' => $faker->phoneNumber,
                'payin_wprovider_id' => $faker->randomElement($wProviderIds),
                'payin_status' => $faker->randomElement(['pending', 'success', 'success', 'success', 'success', 'success', 'success', 'success', 'success', 'success', 'success', 'success', 'success', 'success', 'success', 'success', 'failed']),
                'payout_phone_number' => $faker->phoneNumber,
                'payout_wprovider_id' => $faker->randomElement($wProviderIds),
                'payout_status' => $faker->randomElement(['pending', 'success', 'success', 'success', 'success', 'success', 'success', 'success', 'success', 'success', 'success', 'success', 'success', 'success', 'success', 'success', 'failed']),
                'amount' => $amount,
                'amountWithoutFees' => $amountWithoutFees,
                'type' => $faker->randomElement(['school_help', 'family_help', 'rent', 'others']),
                'token' => $faker->uuid,
                'disburse_token' => $faker->uuid,
                'otp_code' => $faker->numerify('######'),
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);
        }
    }
}
