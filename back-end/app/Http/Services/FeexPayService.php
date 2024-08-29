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

    public function initPayin(string $amount, int $phoneNumber, string $operatorName, string $fullname, string $email, string $callback_info, string $custom_id, string $otp="" )
    {
        $local_payment = ['MTN', 'MOOV', 'MOOV TG', 'TOGOCOM TG', 'ORANGE SN', 'MTN CI'];
        $web_request = ['FREE SN', 'ORANGE CI', 'MOOV CI', 'WAVE CI', 'MOOV BF', 'ORANGE BF'];
        if(in_array($operatorName, $local_payment)){
            return $this->skeleton->paiementLocal(
                $amount, $phoneNumber, $operatorName, $fullname,
                $email, $callback_info, $custom_id, $otp
            );
        }else if(in_array($operatorName, $web_request)){
            return $this->skeleton->requestToPayWeb(
                $amount, $phoneNumber, $operatorName, $fullname,
                $email, $callback_info, "retrun url"
            );
        }
    }

    public function payinStatus($reference)
    {
        return $this->skeleton->getPaiementStatus($reference);
    }

    // public function initPayout( string $amount, string $phoneNumber,string $network, string $motif){
    //    $shop = env('FEEXPAY_SHOP_ID');
    //     try {
    //         $data = [
    //             "amount" => $amount,
    //             "phoneNumber" => $phoneNumber,
    //             "network" => $network,
    //             "shop" => $shop,
    //             "motif" => $motif
    //         ];
    //         $response = Http::withHeaders(self::getHeaders())->post("https://api.feexpay.me/api/payouts/public/transfer/global", $data);
    //         return $response->json();

    //     } catch (\Throwable $th) {
    //         return response()->json(['error' => 'Exception lors de la requête: ' . $th->getMessage()], 500);
    //     }
    // }
    public function initPayout(string $amount, string $phoneNumber, string $network, string $motif, string $country) {
        // Define the shop ID from environment variables
        $shop = env('FEEXPAY_SHOP_ID');
    
        // Map country codes to their respective API endpoints
        $endpoints = [
            '229' => 'https://api.feexpay.me/api/payouts/public/transfer/global', // Benin
            '228' => 'https://api.feexpay.me/api/payouts/public/togo', // Togo
            '225' => 'https://api.feexpay.me/api/payouts/public/mtn_ci', // MTN Côte d'Ivoire
            '221' => 'https://api.feexpay.me/api/payouts/public/orange_sn', // Orange Sénégal
            // Add more countries as needed
        ];
    
        // Extract the country code from the phone number and check if it's supported
        $countryCode = substr($phoneNumber, 0, 3);
        if (!array_key_exists($countryCode, $endpoints)) {
            return response()->json(['error' => 'Unsupported country based on phone number.'], 400);
        }
    
        // Prepare the data for the request
        $data = [
            "amount" => $amount,
            "phoneNumber" => $phoneNumber,
            "network" => $network,
            "shop" => $shop,
            "motif" => $motif
        ];

        try {
            // Send the POST request to the appropriate endpoint
            $response = Http::withHeaders(self::getHeaders())->post($endpoints[$countryCode], $data);
            return $response->json();

        } catch (\Throwable $th) {
            return response()->json(['error' => 'Exception lors de la requête: ' . $th->getMessage()], 500);
        }
    }
    public function payoutStatus($transactionId)
    {
        return $this->skeleton->getPaiementStatus($transactionId);
    }
}
