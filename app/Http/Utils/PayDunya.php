<?php

namespace App\Http\Utils;

use Illuminate\Support\Facades\Http;

class PayDunya
{
    private const TRANSFER = "TRANSFER";

    private const WITHDRAWAL = "WITHDRAWAL";

    private const CREATE_INVOICE_URL = "https://app.paydunya.com/api/v1/checkout-invoice/create";

    public const PAYEMENT_MAPPING = [
        'moov-benin' => 'moov_benin',
        'mtn-benin' => 'mtn_benin',
    ];


    private static function getToken(
        float $amount = 500,
        string $desc = self::TRANSFER
    ): array {
        $data = [
            'invoice' => [
                'total_amount' => $amount,
                'description' => $desc
            ],
            'store' => [
                'name' => env('PAYDUNYA_STORE_NAME')
            ]
        ];

        $headers = [
            'Content-Type' => 'application/json',
            'PAYDUNYA-MASTER-KEY' => env("PAYDUNYA_MASTER_KEY"),
            'PAYDUNYA-PRIVATE-KEY' => env("PAYDUNYA_PRIVATE_KEY"),
            'PAYDUNYA-TOKEN' => env("PAYDUNYA_TOKEN")
        ];

        $response = Http::withHeaders($headers)->post(self::CREATE_INVOICE_URL, $data);

        if ($response->successful()) {
            $responseData = $response->json();
            return [
                'status' => 200,
                'token' => $responseData['token']
            ];
        }
        return [
            'status' => 403,
        ];
    }

    private static function resolve_wallet_provider_name(
        string $token,
        string $providerName,
        array $user
    ): array {

        $castProviderName = self::PAYEMENT_MAPPING[$providerName];

        $data = [
            $castProviderName . "_customer_fullname" => $user['first_name'] . ' ' . $user['last_name'],
            $castProviderName . "_email" => $user['email'],
            $castProviderName . "_phone_number" => preg_replace('/^\+\d{3}/', '', $user['phone_num']),
            "payment_token" => $token
        ];

        if ($providerName == 'mtn-benin' || $providerName == 'mtn-ci') {
            $data = [
                ...$data,
                ...[
                    $castProviderName . "_wallet_provider" => self::convertToUpperCaseWithoutDash($providerName)
                ]
            ];
        }

        return [
            'url' => "https://app.paydunya.com/api/v1/softpay/$providerName",
            'data' => $data
        ];
    }

    public static function receive(float $amount, string $providerName = 'mtn-benin', array $user)
    {

        if ($token = self::getToken($amount, self::TRANSFER)['token']) {

            $traitedData = self::resolve_wallet_provider_name($token, $providerName, user: $user);

            $response = Http::post($traitedData['url'], $traitedData['data']);

            if ($response->successful()) {
                return $response->json();
            }

            return "Erreur lors de la requête : " . $response->status();
        }
    }

    public static function send()
    {
        //
    }

    private static function convertToUpperCaseWithoutDash($text)
    {
        $textWithoutDash = str_replace('-', '', $text);
        $textInUpperCase = strtoupper($textWithoutDash);
        return $textInUpperCase;
    }
}
