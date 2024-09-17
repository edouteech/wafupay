<?php

namespace App\Http\Services;

use Illuminate\Support\Facades\Http;

class PawapayService
{
    protected $baseUrl = "https://api.sandbox.pawapay.cloud"; // Sandbox URL
    protected $paymentUrl = "/payments"; // Endpoint for initiating payments
    protected $payoutUrl = "/payouts"; // Endpoint for initiating payouts

    /**
     * Get headers for API requests.
     *
     * @return array
     */
    private static function getHeaders()
    {
        return [
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . env('PAWAPAY_API_TOKEN'), // API token from environment variables
        ];
    }

    /**
     * Initialize a payin transaction.
     *
     * @param float $amount
     * @param string $phoneNumber
     * @param string $currency
     * @param string $recipientType
     * @param string $recipientAddress
     * @return array
     */
    public function initPayin(float $amount, string $phoneNumber, string $operatorName, string $fullname, string $email, string $callback_info, string $custom_id, string $otp="" )
    {
        $currency = "XOF";
        $recipientType = "MSISDN";
        // add the code to generate th depositId string <uuid> = 36 characters A UUIDv4 based ID specified by you, that uniquely identifies the deposit.
        $data = [
            "depositId" => Uuid::uuid4()->toString(),
            "amount" => $amount,
            "currency" => $currency,
            "correspondent" => $operatorName,
            "recipient" => [
                "type" => $recipientType,
                "address" => [
                    "value" => $recipientAddress,
                ],
                "customerTimestamp" => now()->toISOString(), // Current timestamp
                "statementDescription" => "Payment for services",
            ],
        ];

        $response = Http::withHeaders(self::getHeaders())->post($this->baseUrl . $this->paymentUrl, $data);

        return $this->handleResponse($response);
    }

    /**
     * Check the status of a payin transaction.
     *
     * @param string $transactionId
     * @return array
     */
    public function payinStatus(string $transactionId)
    {
        $response = Http::withHeaders(self::getHeaders())->get($this->baseUrl . $this->paymentUrl . "/{$transactionId}");

        return $this->handleResponse($response);
    }

    /**
     * Initialize a payout transaction.
     *
     * @param float $amount
     * @param string $recipientAddress
     * @param string $currency
     * @return array
     */
    public function initPayout(float $amount, string $recipientAddress, string $currency = "ZMW")
    {
        $data = [
            "amount" => $amount,
            "currency" => $currency,
            "correspondent" => "MTN_MOMO_ZMB", // Example correspondent
            "recipient" => [
                "type" => "MSISDN",
                "address" => [
                    "value" => $recipientAddress,
                ],
                "customerTimestamp" => now()->toISOString(), // Current timestamp
                "statementDescription" => "Payout for services",
            ],
        ];

        $response = Http::withHeaders(self::getHeaders())->post($this->baseUrl . $this->payoutUrl, $data);

        return $this->handleResponse($response);
    }

    /**
     * Check the status of a payout transaction.
     *
     * @param string $transactionId
     * @return array
     */
    public function payoutStatus(string $transactionId)
    {
        $response = Http::withHeaders(self::getHeaders())->get($this->baseUrl . $this->payoutUrl . "/{$transactionId}");

        return $this->handleResponse($response);
    }

    /**
     * Handle the API response.
     *
     * @param \Illuminate\Http\Client\Response $response
     * @return array
     */
    protected function handleResponse($response)
    {
        if ($response->successful()) {
            return $response->json(); // Return the JSON response
        } else {
            return [
                'success' => false,
                'message' => 'Request failed.',
                'error' => $response->json(), // Include error details
            ];
        }
    }
}