<?php

namespace App\Http\Services;

use Illuminate\Support\Facades\Http;

class PaytechService
{
    protected $baseUrl = "https://paytech.sn/api";
    protected $paymentUrl = "/payment/request-payment";

    public function initPayin(
        string $amount, int $phoneNumber, string $operatorName, string $fullname,
        string $email, string $callback_info, string $custom_id, string $otp = ""
    ) {
        // Set default values for optional parameters
        $ref_command = "ref_" . uniqid(); // Unique reference for the payment
        $command_name = "Payment for " . $fullname; // Command name
        $currency = "XOF"; // Default currency
        $env = "prod"; // Default environment
        $ipn_url = env('PAYTECH_IPN_URL');
        $success_url = env('PAYTECH_SUCCESS_URL');
        $cancel_url = env('PAYTECH_CANCEL_URL');
        $custom_field = json_encode([
            "custom_id" => $custom_id,
            "email" => $email,
        ]);

        // Prepare the data for the payment request
        $data = [
            "item_name"    => "Payment for " . $fullname,
            "item_price"   => $amount,
            "currency"     => $currency,
            "ref_command"  => $ref_command,
            "command_name" => $command_name,
            "env"          => $env,
            "ipn_url"      => $ipn_url,
            "success_url"  => $success_url,
            "cancel_url"   => $cancel_url,
            "custom_field" => $custom_field
        ];

        // Set headers for the API request
        $headers = [
            'API_KEY' => env('PAYTECH_API_KEY'), // Get API key from environment variables
            'API_SECRET' => env('PAYTECH_API_SECRET'), // Get API secret from environment variables
            'Content-Type' => 'application/json',
        ];

        // Send the POST request to the Paytech API
        $response = Http::withHeaders($headers)->post($this->baseUrl . $this->paymentUrl, $data);

        // Handle the response
        if ($response->successful()) {
            return $response->json(); // Return the JSON response
        } else {
            // Handle error response
            return [
                'success' => false,
                'message' => 'Payment initiation failed.',
                'error' => $response->json(), // Include error details
            ];
        }
    }

    /**
     * @param $url
     * @param array $data
     * @param array $header
     * @return bool|string
     */
    protected function post($url, array $data = [], array $header = []): bool|string
    {
        $strPostField = http_build_query($data);

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $strPostField);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt(
            $ch,
            CURLOPT_HTTPHEADER, array_merge(
                $header,
                [
                    'Content-Type: application/x-www-form-urlencoded;charset=utf-8',
                    'Content-Length: ' . mb_strlen(
                        $strPostField,
                    )
                ],
            ),
        );

        return curl_exec($ch);
    }

    public function paymentRequest(Request $request): bool|string
    {

        // create a commande in your own DB
        $command = Commandes::create([
            "item_name"    => $commandName,
            "item_price"   => "100",
            "currency"     => "XOF",
            "ref_command"  => "ref_azerty",
            "command_name" => "commande 001",
            "status"       => "running"
        ]);

        return $this->post($this->paymentUrl, array(
            "item_name"    => $command->item_name,
            "item_price"   => $command->item_price,
            "currency"     => "XOF",
            "ref_command"  => "ref_azerty",
            "command_name" => "commande 001",
            "env"          => "test",
            "success_url"  => "https://api.wafupay.com",
            "ipn_url"      => "https://api.wafupay.com/api/ipn",
            "cancel_url"   => "https://api.wafupay.com",
            "custom_field" => json_encode(
                [
                    "command_id"          => $command->id,
                    "customer_email"      => "client@mail.com",
                ]
            )
        ), [
            "API_KEY: " .  "your public key from paytech.sn",
            "API_SECRET: " .  "your private key from paytech.sn"
        ]);

        // response should look like : {
        // "success": 1,
        // "token": "XJJDKS8S8SHNS2",
        // "redirect_url": "https://paytech.sn/payment/checkout/XJJDKS8S8SHNS2", // use this for exemple web or mobile redirection
        // }
    }

    // Your callback controller for "ipn_url" => "https://monsite.net/api/ipn",
    public function paymentIPnCallBackGateway(Request $request): JsonResponse
    {
        $type_event        = $request->type_event;
        $client_phone      = $request->client_phone;
        $payment_method    = $request->payment_method;
        $env               = $request->env;
        $custom_field      = json_decode($request->custom_field);
        $token             = $request->token;
        $api_key_sha256    = $request->api_key_sha256;
        $api_secret_sha256 = $request->api_secret_sha256;

        // payment origin check
        if (hash('sha256', "your public key from paytech.sn") === $api_key_sha256 && hash('sha256', "your private key from paytech.sn") === $api_secret_sha256)
        {
            if ($type_event == "sale_complete") {

                Commandes::where("id", $custom_field->command_id)->update([
                    "status" => "success"
                ]);

                Transactions::create([
                    "commande_id"    => $custom_field->command_id,
                    "type_event"     => $type_event,
                    "client_phone"   => $client_phone,
                    "payment_method" => $payment_method,
                    "token"          => $token,
                    "env"            => $env
                ]);

                Helper::sendMail(
                    "support@monsite.net",
                    type: 3,
                    options: [
                        "customer_email" => $custom_field->customer_email
                    ]
                );

            } else {
                Commandes::where("id", $custom_field->command_id)->update([
                    "status" => "canceled"
                ]);
            }
            //from PayTech
            return response()->json(
                [
                    'success'  => true,
                    'data'    => [
                        'success' => true,
                        'command_id' => $custom_field->command_id
                    ],
                    'message' => "Paiement réussi!"
                ],
                200
            );
        } else {
            //not from PayTech
            return response()->json(
                [
                    'success'  => false,
                    'data'    => [],
                    'message' => "Ce paiement ne vient pas de paytech"
                ],
                200
            );
        }
    }
}
