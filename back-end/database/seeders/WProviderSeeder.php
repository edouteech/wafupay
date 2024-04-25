<?php

namespace Database\Seeders;

use App\Models\WProvider;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WProviderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $wproviders = [
            [
                "name" => "MOOV BENIN",
                "withdraw_mode" => "moov-benin",
                "sending_mode" => "moov_benin",
                "country_id" => "1",
                "fees" => [
                    [
                        "payin_fee" => "2.5",
                        "payout_fee" => "1",
                        "min_amount" => "500",
                        "max_amount" => "500000"
                    ]
                ]
            ], [
                "name" => "MTN BENIN",
                "withdraw_mode" => "mtn-benin",
                "sending_mode" => "mtn_benin",
                "country_id" => "1",
                "fees" => [
                    [
                        "payin_fee" => "2.5",
                        "payout_fee" => "1",
                        "min_amount" => "500",
                        "max_amount" => "500000"
                    ]
                ]
            ],
            [
                "name" => "MOOV TOGO",
                "withdraw_mode" => "moov-togo",
                "sending_mode" => "moov_togo",
                "country_id" => "8",
                "fees" => [
                    [
                        "payin_fee" => "3.5",
                        "payout_fee" => "2",
                        "min_amount" => "500",
                        "max_amount" => "500000"
                    ]
                ]
            ], [
                "name" => "T-MONEY TOGO",
                "withdraw_mode" => "t-money-togo",
                "sending_mode" => "t_money_togo",
                "country_id" => "8",
                "fees" => [
                    [
                        "payin_fee" => "3.5",
                        "payout_fee" => "1",
                        "min_amount" => "500",
                        "max_amount" => "500000"
                    ]
                ]
            ],
            [
                "name" => "MTN MONEY COTE D'IVOIRE",
                "withdraw_mode" => "mtn-ci",
                "sending_mode" => "mtn_ci",
                "country_id" => "3",
                "fees" => [
                    [
                        "payin_fee" => "3.5",
                        "payout_fee" => "1",
                        "min_amount" => "500",
                        "max_amount" => "500000"
                    ]
                ]
            ],
            [
                "name" => "MOOV CÔTE D'IVOIRE",
                "withdraw_mode" => "moov-ci",
                "sending_mode" => "moov_ci",
                "country_id" => "3",
                "fees" => [
                    [
                        "payin_fee" => "3.5",
                        "payout_fee" => "1.8",
                        "min_amount" => "500",
                        "max_amount" => "500000"
                    ]
                ]
            ], [
                "name" => "ORANGE MONEY COTE D'IVOIRE",
                "withdraw_mode" => "orange-money-ci",
                "sending_mode" => "orange_money_ci",
                "country_id" => "3",
                "with_otp" => true,
                "fees" => [
                    [
                        "payin_fee" => "3.5",
                        "payout_fee" => "1.8",
                        "min_amount" => "500",
                        "max_amount" => "500000"
                    ]
                ]
            ], [
                "name" => "WAVE CÔTE D'IVOIRE",
                "withdraw_mode" => "wave-ci",
                "sending_mode" => "wave_ci",
                "country_id" => "3",
                "fees" => [
                    [
                        "payin_fee" => "3",
                        "payout_fee" => "2.5",
                        "min_amount" => "500",
                        "max_amount" => "500000"
                    ]
                ]
            ],
            [
                "name" => "ORANGE MONEY SENEGAL",
                "withdraw_mode" => "orange-money-senegal",
                "sending_mode" => "orange_money_senegal",
                "country_id" => "7",
                "with_otp" => true,
                "fees" => [
                    [
                        "payin_fee" => "2.5",
                        "payout_fee" => "1.8",
                        "min_amount" => "500",
                        "max_amount" => "500000"
                    ]
                ]
            ],
            [
                "name" => "FREE MONEY SENEGAL",
                "withdraw_mode" => "free-money-senegal",
                "sending_mode" => "free_money_senegal",
                "country_id" => "7",
                "fees" => [
                    [
                        "payin_fee" => "2.5",
                        "payout_fee" => "1",
                        "min_amount" => "500",
                        "max_amount" => "500000"
                    ]
                ]
            ],
            [
                "name" => "EXPRESSO SENEGAL",
                "withdraw_mode" => "expresso-senegal",
                "sending_mode" => "expresso_sn",
                "country_id" => "7",
                "fees" => [
                    [
                        "payin_fee" => "2.5",
                        "payout_fee" => "1",
                        "min_amount" => "500",
                        "max_amount" => "500000"
                    ]
                ]
            ],
            [
                "name" => "Wizall Money Sénégal",
                "withdraw_mode" => "wizall-money-senegal",
                "sending_mode" => "wizall_sn",
                "country_id" => "7",
                "fees" => [
                    [
                        "payin_fee" => "2.5",
                        "payout_fee" => "1",
                        "min_amount" => "500",
                        "max_amount" => "500000"
                    ]
                ]
            ], [
                "name" => "WAVE SENEGAL",
                "withdraw_mode" => "wave-senegal",
                "sending_mode" => "wave_senegal",
                "country_id" => "7",
                "fees" => [
                    [
                        "payin_fee" => "3",
                        "payout_fee" => "2.5",
                        "min_amount" => "500",
                        "max_amount" => "500000"
                    ]
                ]
            ],
            [
                "name" => "Orange Money Mali",
                "withdraw_mode" => "orange-money-mali",
                "sending_mode" => "orange_money_mali",
                "country_id" => "5",
                "with_otp" => true,
                "fees" => [
                    [
                        "payin_fee" => "2.5",
                        "payout_fee" => "2",
                        "min_amount" => "500",
                        "max_amount" => "500000"
                    ]
                ]
            ], [
                "name" => "MOOV MALI",
                "withdraw_mode" => "moov-mali",
                "sending_mode" => "moov_ml",
                "country_id" => "5",
                "fees" => [
                    [
                        "payin_fee" => "3.5",
                        "payout_fee" => "2",
                        "min_amount" => "500",
                        "max_amount" => "500000"
                    ]
                ]
            ], [
                "name" => "ORANGE MONEY BURKINA FASO",
                "withdraw_mode" => "orange-money-burkina",
                "sending_mode" => "orange_bf",
                "country_id" => "2",
                "with_otp" => true,
                "fees" => [
                    [
                        "payin_fee" => "3.5",
                        "payout_fee" => "2.5",
                        "min_amount" => "500",
                        "max_amount" => "500000"
                    ]
                ]
            ], [
                "name" => "MOOV BURKINA FASO",
                "withdraw_mode" => "moov-burkina",
                "sending_mode" => "moov_burkina",
                "country_id" => "2",
                "with_otp" => true,
                "fees" => [
                    [
                        "payin_fee" => "3.5",
                        "payout_fee" => "2.5",
                        "min_amount" => "500",
                        "max_amount" => "500000"
                    ]
                ]
            ],
        ];

        foreach ($wproviders as $wProviderData) {
            $wProviderData['user_id'] = 1;
            $wProvider = WProvider::create($wProviderData);
            $feesData = $wProviderData['fees'];

            foreach ($feesData as $fee) {
                $wProvider->transaction_fees()->create([
                    'payin_fee' => $fee['payin_fee'],
                    'payout_fee' => $fee['payout_fee'],
                    'min_amount' => $fee['min_amount'],
                    'max_amount' => $fee['max_amount'],
                    'user_id' => 1,
                ]);
            }
        }
    }
}
