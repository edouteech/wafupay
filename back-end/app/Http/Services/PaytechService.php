<?php

namespace App\Http\Services;

use Illuminate\Support\Facades\Http;

class PaytechService
{
    
    public function initPayin(string $amount, int $phoneNumber, string $operatorName, string $fullname, string $email, string $callback_info, string $custom_id, string $otp="" )
    {
        

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
            "success_url"  => "https://monsite.net", // don't use deep link create your redirect code
            "ipn_url"      => "https://monsite.net/api/ipn",
            "cancel_url"   => "https://monsite.net", // don't use deep link create your redirect code
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
