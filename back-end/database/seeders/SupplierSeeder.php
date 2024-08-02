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
        ];


        foreach ($suppliers as $supplier) {
            Supplier::create($supplier);
        }

    }
}
