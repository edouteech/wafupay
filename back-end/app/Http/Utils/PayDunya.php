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

    public const RESPONSE_TEXT_KEY = 'Transaction Found';

    public const STATUS_COMPLETED_KEY = 'completed';

    public const STATUS_OK = 200;

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
            ],
        ];

        if (env('APP_ENV') == 'production') {
            $data['actions']  = [
                'callback_url' => route('transaction.updateStatus')
            ];
        }

        $response = Http::withHeaders(self::getHeaders())->post(self::CREATE_INVOICE_URL, $data);

        $responseData = $response->json();

        if (isset($responseData['token'])) {

            return [
                'status' => 200,
                'token' => $responseData['token']
            ];
        }

        throw new ValidationException(json_encode($response->json()));
    }

    private static function resolve_wallet_provider_name(
        string $token,
        mixed $providerName,
        array $user,
        $otp_code
    ): array {

        $castProviderName = $providerName->sending_mode;
        $_providerName = $providerName->withdraw_mode;

        $data = [
            $castProviderName . "_customer_fullname" => $user['fullname'],
            $castProviderName . "_email" => $user['email'],
            $castProviderName . "_phone_number" => $user['phone_num'],
            "payment_token" => $token
        ];

        if (
            $_providerName == 'orange-money-burkina'
        ) {
            $data = [
                "name_bf" => $user['fullname'],
                "email_bf" => $user['email'],
                "phone_bf" => $user['phone_num'],
                "payment_token" => $token
            ];
        }

        if (
            $_providerName == 'moov-burkina'
        ) {
            unset($data['payment_token']);
            $data['moov_burkina_faso_payment_token'] = $token;
        }

        if ($providerName->with_otp) {
            $data = [
                ...$data,
                $castProviderName . "_otp" => $user['otp']
            ];
        }

        if ($castProviderName == 'mtn_benin' || $castProviderName == 'mtn_ci') {
            $data = [
                ...$data,
                $castProviderName . "_wallet_provider" => self::convertToUpperCaseWithoutDash($castProviderName)
            ];
        }

        if ($castProviderName == 'moov_togo') {
            $data = [
                ...$data, $castProviderName . "_customer_address" => $user['country']
            ];
        }

        if ($_providerName == 'orange-money-mali') {
            unset($data['orange_money_mali_otp']);
            $data['orange_money_mali_wallet_otp'] = $token;
        }

        if (
            $_providerName == 'orange-money-senegal' ||
            $_providerName == 'wizall-money-senegal'
        ) {
            $data = [
                "customer_name" => $user['fullname'],
                "customer_email" => $user['email'],
                "phone_number" => $user['phone_num'],
                "authorization_code" => $otp_code,
                "invoice_token" => $token
            ];
        }

        if (
            $_providerName == 't-money-togo'
        ) {
            $data = [
                "name_t_money" => $user['fullname'],
                "email_t_money" => $user['email'],
                "phone_t_money" => $user['phone_num'],
                "payment_token" => $token,
            ];
        }

        if (
            $_providerName == 'wave-ci' ||
            $_providerName == 'wave-senegal'
        ) {
            $data = [
                $castProviderName . "_fullName" => $user['fullname'],
                $castProviderName . "_email" => $user['email'],
                $castProviderName . "_phone" => $user['phone_num'],
                $castProviderName . "_payment_token" => $token
            ];
        }

        if ($_providerName == 'wizall-money-senegal') unset($data['authorization_code']);

        if ($_providerName == 'free-money-senegal') {
            $data = [
                "customer_name" => $user['fullname'],
                "customer_email" => $user['email'],
                "phone_number" => $user['phone_num'],
                "payment_token" => $token
            ];
        }

        return [
            'url' => self::BASE_API_URL . "v1/softpay/" . $_providerName,
            'data' => $data
        ];
    }

    public static function receive(float $amount, mixed $payinProvider, array $user)
    {

        if ($token = self::getToken($amount, self::TRANSFER)['token']) {

            $traitedData = self::resolve_wallet_provider_name($token, $payinProvider, $user, $user['otp_code']);

            $response = Http::post($traitedData['url'], $traitedData['data']);

            // if ($response->successful()) {
            //     return self::handleResponse($response, $token);
            // }
            return self::handleResponse($response, $token);
            //return "Erreur lors de la requête : " . $response->status();
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
            "callback_url" => route('transaction.store_disburse')
        ];

        $response = Http::withHeaders(self::getHeaders())->post(self::DISBURSE_URL, $data);

        $responseData = $response->json();

        if (isset($responseData['disburse_token'])) {
            return $responseData;
        }

        throw new ValidationException(json_encode($responseData));
    }

    public static function send(string $withdraw_mode, string $phone_num, float $amount): array
    {
        if ($token = self::disburse_token($withdraw_mode, $phone_num, $amount)['disburse_token']) {
            $data = [
                "disburse_invoice" => $token,
                "disburse_id" => env('PAYDUNYA_DISBURSE_ID')
            ];

            $url = self::BASE_API_URL . "v2/disburse/submit-invoice";

            $response = Http::withHeaders(self::getHeaders())->post($url, $data);

            $responseData = $response->json();

            if ($response->successful()) {
                return self::handleResponse($responseData, $token);
            }

            throw new ValidationException(json_encode($responseData));
        }
        return [
            'status' => 403,
            'message' => 'error'
        ];
    }

    public static function is_received(string $token): array
    {
        $url = self::BASE_API_URL . "v1/checkout-invoice/confirm/$token";
        $res = Http::withHeaders(self::getHeaders())->get($url);
        return $res->json();
    }

    public static function is_sent(string $disburse_invoice): array
    {
        $data = [
            "disburse_invoice" => $disburse_invoice
        ];

        $url = self::BASE_API_URL . "v2/disburse/check-status";

        $res = Http::withHeaders(self::getHeaders())->post($url, $data);
        return $res->json();
    }

    private static function convertToUpperCaseWithoutDash($text): string
    {
        $textWithoutDash = str_replace('_', '', $text);
        $textInUpperCase = strtoupper($textWithoutDash);
        return $textInUpperCase;
    }

    private static function handleResponse($response, $token = ''): array
    {
        return [
            'status' => $response->status(),
            'message' => $response->json(),
            'token' => $token
        ];
    }
}
