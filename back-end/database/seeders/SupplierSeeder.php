<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class SupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
//         Benin
//         MTN
//         See details
//         Collections
//         2.2%
//         Disbursements
//         1.5%
//         MOOV
//         See details
//         Collections
//         2.2%
//         Disbursements
//         1%
//         Burkina Faso
//         Moov
//         See details
//         Collections
//         3%
//         Disbursements
//         2%
//         Orange
//         See details
//         Collections
//         3.3%
//         Disbursements
//         N/A
//         Cameroon
//         MTN
//         See details
//         Collections
//         1.75%
//         Disbursements
//         1.3%
//         ORANGE
//         See details
//         Collections
//         1.77%
//         Disbursements
//         1%
//         Congo-Brazzaville
//         Airtel
//         See details
//         Collections
//         4%
//         Disbursements
//         1%
//         DRC
//         AIRTEL
//         See details
//         Collections
//         3%
//         Disbursements
//         2%
//         ORANGE
//         See details
//         Collections
//         3%
//         Disbursements
//         1%
//         VODACOM
//         See details
//         Collections
//         2.5%
//         Disbursements
//         2%
//         Gabon
//         Airtel
//         See details
//         Collections
//         2%
//         Disbursements
//         1%
//         Ghana
//         AT
//         See details
//         Collections
//         2%
//         Disbursements
//         1%
//         MTN
//         See details
//         Collections
//         2%
//         Disbursements
//         1%
//         Telecel
//         See details
//         Collections
//         2%
//         Disbursements
//         1%
//         Ivory Coast
//         MTN
//         See details
//         Collections
//         2.5%
//         Disbursements
//         1.2%
//         ORANGE
//         See details
//         Collections
//         2.5%
//         Disbursements
//         2%
//         Enterprise
//         Wave
//         See details
//         Collections
//         2%
//         Disbursements
//         2%
//         Kenya
//         M-PESA
//         See details
//         Collections
//         Tiered
//         Disbursements
//         Tiered
//         Malawi
//         AIRTEL
//         See details
//         Collections
//         3.33%
//         Disbursements
//         2.75%
//         TNM
//         See details
//         Collections
//         3%
//         Disbursements
//         2.5%
//         Senegal
// FREE
// See details
// Collections
// 2%
// Disbursements
// 1.5%
// ORANGE
// See details
// Collections
// 2%
// Disbursements
// 1.8%
// Enterprise
// Wave
// See details
// Collections
// 2%
// Disbursements
// 2%
        $suppliers = [
            [
                'name' => "feexpay",
                'wallet_name' => json_encode( [
                    'MTN BENIN' => 'MTN',
                    'MOOV BENIN' => 'MOOV',
                    'MOOV TOGO' => 'MOOV TG',
                    'TOGOCOM TOGO' => 'TOGOCOM TG',
                    'MTN COTE D\'IVOIRE' => 'MTN CI',
                    'ORANGE COTE D\'IVOIRE' => 'ORANGE CI',
                    'MOOV COTE D\'IVOIRE' => 'MOOV CI',
                    'WAVE COTE D\'IVOIRE' => 'WAVE CI',
                    'ORANGE SENEGAL' => 'ORANGE SN',
                    'FREE SENEGAL' => 'FREE SN',
                    'MOOV BURKINA FASO' => 'MOOV BF',
                    'ORANGE BURKINA FASO' => 'ORANGE BF',
                ]),
                'payin_fees' => json_encode([
                    'MTN BENIN' => 1.7,
                    'MOOV BENIN' => 1.7,
                    'MOOV TOGO' => 3,
                    'TOGOCOM TOGO' => 3,
                    'MTN COTE D\'IVOIRE' => 2.9,
                    'ORANGE COTE D\'IVOIRE' => 2.9,
                    'MOOV COTE D\'IVOIRE' => 2.9,
                    'WAVE COTE D\'IVOIRE' => 3.2,
                    'ORANGE SENEGAL' => 1.9,
                    'FREE SENEGAL' => 1.9,
                    'MOOV BURKINA FASO' => 3.2,
                    'ORANGE BURKINA FASO' => 3.9,
                ]),
                'payout_fees' => json_encode([
                    'MTN BENIN' => 1,
                    'MOOV BENIN' => 1,
                    'MOOV TOGO' => 2.4,
                    'TOGOCOM TOGO' => 2.4,
                    'MTN COTE D\'IVOIRE' => 1,
                    'ORANGE COTE D\'IVOIRE' => 3,
                    'MOOV COTE D\'IVOIRE' => 3,
                    'WAVE COTE D\'IVOIRE' => 3,
                    'ORANGE SENEGAL' => 1,
                    'FREE SENEGAL' => 3,
                    'MOOV BURKINA FASO' => 1,
                    'ORANGE BURKINA FASO' => 1,
                ]),
            ],
            [
                'name' => 'PAWAPAY',
                'wallet_name' => json_encode( [
                    "MOOV BENIN" => "MOOV_BEN",
                    "MTN BENIN" => "MTN_MOMO_BEN",
                    "MTN MONEY COTE D'IVOIRE" => "MTN_MOMO_CIV",
                    "ORANGE MONEY COTE D'IVOIRE" => "ORANGE_CIV",
                    "ORANGE MONEY SENEGAL" => "ORANGE_SEN",
                    "FREE MONEY SENEGAL" => "FREE_SEN",
                    "ORANGE MONEY BURKINA FASO" => "ORANGE_BFA",
                    "MOOV BURKINA FASO" => "MOOV_BFA"
                ]),
                'payin_fees' => json_encode([
                    "MOOV BENIN" => 2.2,
                    "MTN BENIN" => 2.2,
                    "MTN MONEY COTE D'IVOIRE" => 2.5,
                    "ORANGE MONEY COTE D'IVOIRE" => 2.5,
                    "ORANGE MONEY SENEGAL" => 2,
                    "FREE MONEY SENEGAL" => 2,
                    "ORANGE MONEY BURKINA FASO" => 3.3,
                    "MOOV BURKINA FASO" => 3,
                ]),
                'payout_fees' => json_encode([
                    "MOOV BENIN" => 1,
                    "MTN BENIN" => 1.5,
                    "MTN MONEY COTE D'IVOIRE" => 1.2,
                    "ORANGE MONEY COTE D'IVOIRE" => 2,
                    "ORANGE MONEY SENEGAL" => 1.8,
                    "FREE MONEY SENEGAL" => 1.5,
                    "ORANGE MONEY BURKINA FASO" => 0,
                    "MOOV BURKINA FASO" => 2,
                ])
            ],
        ];

        foreach ($suppliers as $supplier) {
            Supplier::create($supplier);
        }

    }
}