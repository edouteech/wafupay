<?php

namespace App\Http\Services;

use Illuminate\Support\Facades\Http;

use Feexpay\FeexpayPhp\FeexpayClass;

class FeexPayService
{
    protected $skeleton;

    private static function getHeaders()
    {
        return [
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . env('FEEXPAY_API_KEY'),
        ];
    }

    public function __construct()
    {
        $api = env('FEEXPAY_API_KEY');
        $shop = env('FEEXPAY_SHOP_ID');
        $callback_url = env('FEEXPAY_CALLBACK_URL');
        $mode = env('FEEXPAY_MODE');
        $error_url = env('FEEXPAY_ERROR_URL');

        $this->skeleton = new FeexpayClass(
            $shop,
            $api,
            $callback_url,
            $error_url
        );
    }

    public function initiateLocalPayment(string $amount, int $phoneNumber, string $operatorName, string $fullname, string $email, string $callback_info, string $custom_id, string $otp="" )
    {

        return $this->skeleton->paiementLocal(
            $amount,
            $phoneNumber,
            $operatorName,
            $fullname,
            $email,
            $callback_info,
            $custom_id,
            $otp
        );
    }

    public function getPaymentStatus($transactionId)
    {
        return $this->skeleton->getPaiementStatus($transactionId);
    }

    public function initiatePayout( string $amount, string $phoneNumber,string $network, string $motif){
       $shop = env('FEEXPAY_SHOP_ID');
        try {
            $data = [
                "amount" => $amount,
                "phoneNumber" => $phoneNumber,
                "network" => $network,
                "shop" => $shop,
                "motif" => $motif
            ];

            $response = Http::withHeaders(self::getHeaders())->post("https://api.feexpay.me/api/payouts/public/transfer/global", $data);

            return $response->json();

        } catch (\Throwable $th) {
            return response()->json(['error' => 'Exception lors de la requête: ' . $th->getMessage()], 500);
        }
    }

}
