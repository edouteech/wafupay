<?php

namespace Database\Seeders;

use App\Models\Supplier;
use App\Models\WProvider;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class WProviderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $default_supplier = Supplier::where("name", "feexpay")->first();

        $wproviders = [
            [
                "name" => "MOOV BENIN",
                "withdraw_mode" => "moov-benin",
                "sending_mode" => "moov_benin",
                "country_id" => "1",
                "payin_fee" => "2.5",
                "payout_fee" => "1",
            ], [
                "name" => "MTN BENIN",
                "withdraw_mode" => "mtn-benin",
                "sending_mode" => "mtn_benin",
                "country_id" => "1",
                "payin_fee" => "2.5",
                "payout_fee" => "1",
            ],
            [
                "name" => "MOOV TOGO",
                "withdraw_mode" => "moov-togo",
                "sending_mode" => "moov_togo",
                "country_id" => "8",
                "payin_fee" => "3.5",
                "payout_fee" => "2",
            ], [
                "name" => "T-MONEY TOGO",
                "withdraw_mode" => "t-money-togo",
                "sending_mode" => "t_money_togo",
                "country_id" => "8",
                "payin_fee" => "3.5",
                "payout_fee" => "1",
            ],
            [
                "name" => "MTN MONEY COTE D'IVOIRE",
                "withdraw_mode" => "mtn-ci",
                "sending_mode" => "mtn_ci",
                "country_id" => "3",
                "payin_fee" => "3.5",
                "payout_fee" => "1",
            ],
            [
                "name" => "MOOV CÔTE D'IVOIRE",
                "withdraw_mode" => "moov-ci",
                "sending_mode" => "moov_ci",
                "country_id" => "3",
                "payin_fee" => "3.5",
                "payout_fee" => "1.8",
            ], [
                "name" => "ORANGE MONEY COTE D'IVOIRE",
                "withdraw_mode" => "orange-money-ci",
                "sending_mode" => "orange_money_ci",
                "country_id" => "3",
                "with_otp" => true,
                "payin_fee" => "3.5",
                "payout_fee" => "1.8",
            ], [
                "name" => "WAVE CÔTE D'IVOIRE",
                "withdraw_mode" => "wave-ci",
                "sending_mode" => "wave_ci",
                "country_id" => "3",
                "payin_fee" => "3",
                "payout_fee" => "2.5",
            ],
            [
                "name" => "ORANGE MONEY SENEGAL",
                "withdraw_mode" => "orange-money-senegal",
                "sending_mode" => "orange_money_senegal",
                "country_id" => "7",
                "with_otp" => true,
                "payin_fee" => "2.5",
                "payout_fee" => "1.8",
            ],
            [
                "name" => "FREE MONEY SENEGAL",
                "withdraw_mode" => "free-money-senegal",
                "sending_mode" => "free_money_senegal",
                "country_id" => "7",
                "payin_fee" => "2.5",
                "payout_fee" => "1",
            ],
            [
                "name" => "EXPRESSO SENEGAL",
                "withdraw_mode" => "expresso-senegal",
                "sending_mode" => "expresso_sn",
                "country_id" => "7",
                "payin_fee" => "2.5",
                "payout_fee" => "1",
            ],
            [
                "name" => "Wizall Money Sénégal",
                "withdraw_mode" => "wizall-money-senegal",
                "sending_mode" => "wizall_sn",
                "country_id" => "7",
                "payin_fee" => "2.5",
                "payout_fee" => "1",
            ], [
                "name" => "WAVE SENEGAL",
                "withdraw_mode" => "wave-senegal",
                "sending_mode" => "wave_senegal",
                "country_id" => "7",
                "payin_fee" => "3",
                "payout_fee" => "2.5",
            ],
            [
                "name" => "Orange Money Mali",
                "withdraw_mode" => "orange-money-mali",
                "sending_mode" => "orange_money_mali",
                "country_id" => "5",
                "with_otp" => true,
                "payin_fee" => "2.5",
                "payout_fee" => "2",
            ], [
                "name" => "MOOV MALI",
                "withdraw_mode" => "moov-mali",
                "sending_mode" => "moov_ml",
                "country_id" => "5",
                "payin_fee" => "3.5",
                "payout_fee" => "2",
            ], [
                "name" => "ORANGE MONEY BURKINA FASO",
                "withdraw_mode" => "orange-money-burkina",
                "sending_mode" => "orange_bf",
                "country_id" => "2",
                "with_otp" => true,
                "payin_fee" => "3.5",
                "payout_fee" => "2.5",
            ], [
                "name" => "MOOV BURKINA FASO",
                "withdraw_mode" => "moov-burkina",
                "sending_mode" => "moov_burkina",
                "country_id" => "2",
                "with_otp" => true,
                "payin_fee" => "3.5",
                "payout_fee" => "2.5",
            ],
        ];

        foreach ($wproviders as $wProviderData) {
            $provider = WProvider::create($wProviderData);
            // $wProvider->suppliers()->attach($default_supplier);
            $default_supplier->providers()->attach(
                $provider,
                ['type' => 'payin', 'priority' => true]
            );
            $default_supplier->providers()->attach(
                $provider,
                ['type' => 'payout', 'priority' => true]
            );
        }
    }
}
