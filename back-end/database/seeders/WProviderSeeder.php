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
                "country_id" => "1",
                "payin_fee" => "2.5",
                "payout_fee" => "1",
            ], [
                "name" => "MTN BENIN",
                "country_id" => "1",
                "payin_fee" => "2.5",
                "payout_fee" => "1",
            ],
            [
                "name" => "MOOV TOGO",
                "country_id" => "8",
                "payin_fee" => "3.5",
                "payout_fee" => "2",
            ], [
                "name" => "T-MONEY TOGO",
                "country_id" => "8",
                "payin_fee" => "3.5",
                "payout_fee" => "1",
            ],
            [
                "name" => "MTN MONEY COTE D'IVOIRE",
                "country_id" => "3",
                "payin_fee" => "3.5",
                "payout_fee" => "1",
            ],
            [
                "name" => "MOOV CÔTE D'IVOIRE",
                "country_id" => "3",
                "payin_fee" => "3.5",
                "payout_fee" => "1.8",
            ], [
                "name" => "ORANGE MONEY COTE D'IVOIRE",
                "country_id" => "3",
                "with_otp" => true,
                "payin_fee" => "3.5",
                "payout_fee" => "1.8",
            ], [
                "name" => "WAVE CÔTE D'IVOIRE",
                "country_id" => "3",
                "payin_fee" => "3",
                "payout_fee" => "2.5",
            ],
            [
                "name" => "ORANGE MONEY SENEGAL",
                "country_id" => "7",
                "with_otp" => true,
                "payin_fee" => "2.5",
                "payout_fee" => "1.8",
            ],
            [
                "name" => "FREE MONEY SENEGAL",
                "country_id" => "7",
                "payin_fee" => "2.5",
                "payout_fee" => "1",
            ],
            [
                "name" => "EXPRESSO SENEGAL",
                "country_id" => "7",
                "payin_fee" => "2.5",
                "payout_fee" => "1",
            ],
            [
                "name" => "Wizall Money Sénégal",
                "country_id" => "7",
                "payin_fee" => "2.5",
                "payout_fee" => "1",
            ], [
                "name" => "WAVE SENEGAL",
                "country_id" => "7",
                "payin_fee" => "3",
                "payout_fee" => "2.5",
            ],
            [
                "name" => "Orange Money Mali",
                "country_id" => "5",
                "with_otp" => true,
                "payin_fee" => "2.5",
                "payout_fee" => "2",
            ], [
                "name" => "MOOV MALI",
                "country_id" => "5",
                "payin_fee" => "3.5",
                "payout_fee" => "2",
            ], [
                "name" => "ORANGE MONEY BURKINA FASO",
                "country_id" => "2",
                "with_otp" => true,
                "payin_fee" => "3.5",
                "payout_fee" => "2.5",
            ], [
                "name" => "MOOV BURKINA FASO",
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
