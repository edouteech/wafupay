<?php

namespace App\Http\Utils;

use Illuminate\Support\Facades\Http;

class PayDunya
{
    private const TRANSFER = "TRANSFER";

    private const WITHDRAWAL = "WITHDRAWAL";

    private const BASE_API_URL = 'https://app.paydunya.com/api/';

    private const CREATE_INVOICE_URL = self::BASE_API_URL . "v1/checkout-invoice/create";

    private const DISBURSE_URL = self::BASE_API_URL . "v2/disburse/get-invoice";

    public const PAYEMENT_MAPPING = [
        'moov-benin' => 'moov_benin',
        'mtn-benin' => 'mtn_benin',
    ];

    private static function getHeaders()
    {
        return [
            'Content-Type' => 'application/json',
            'PAYDUNYA-MASTER-KEY' => env("PAYDUNYA_MASTER_KEY"),
            'PAYDUNYA-PRIVATE-KEY' => env("PAYDUNYA_PRIVATE_KEY"),
            'PAYDUNYA-TOKEN' => env("PAYDUNYA_TOKEN")
        ];
    }

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

        $response = Http::withHeaders(self::getHeaders())->post(self::CREATE_INVOICE_URL, $data);

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
            'url' => self::BASE_API_URL . "v1/softpay/$providerName",
            'data' => $data
        ];
    }

    public static function receive(float $amount, string $providerName = 'mtn-benin', array $user)
    {

        if ($token = self::getToken($amount, self::TRANSFER)['token']) {

            $traitedData = self::resolve_wallet_provider_name($token, $providerName, user: $user);

            $response = Http::post($traitedData['url'], $traitedData['data']);

            if ($response->successful()) {
                return self::handleResponse($response);
            }

            return "Erreur lors de la requête : " . $response->status();
        }
    }

    private static function disburse_token(
        string $withdraw_mode,
        string $phone_num,
        float $amount
    ): array {
        $data = [
            "account_alias" => $phone_num,
            "amount" => $amount,
            "withdraw_mode" => $withdraw_mode,
            "callback_url" => route('transactions.store')
        ];

        $response = Http::withHeaders(self::getHeaders())->post(self::DISBURSE_URL, $data);

        return $response->json();
    }

    public static function send(string $withdraw_mode, string $phone_num, float $amount)
    {
        if ($token = self::disburse_token($withdraw_mode, $phone_num, $amount)['disburse_token']) {
            $data = [
                "disburse_invoice" => $token,
                "disburse_id" => env('PAYDUNYA_DISBURSE_ID')
            ];

            $url = self::BASE_API_URL . "v2/disburse/submit-invoice";

            $response = Http::withHeaders(self::getHeaders())->post($url, $data);
            return self::handleResponse($response);
        }
        return [
            'status' => 403,
            'message' => 'error'
        ];
    }

    public static function is_received(string $token)
    {
        $url = self::BASE_API_URL . "v1/checkout-invoice/confirm/$token";
        $res = Http::withHeaders(self::getHeaders())->get($url);
        return $res->successful();
    }

    private static function convertToUpperCaseWithoutDash($text)
    {
        $textWithoutDash = str_replace('-', '', $text);
        $textInUpperCase = strtoupper($textWithoutDash);
        return $textInUpperCase;
    }

    private static function handleResponse($response, $error = false): array
    {
        return [
            'status' => $response->status(),
            'message' => $response->json(),
        ];
    }
}
