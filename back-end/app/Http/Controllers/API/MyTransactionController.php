<?php

namespace App\Http\Controllers\API;

use App\Models\Supplier;
use App\Models\WProvider;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Services\LoggerService;
use Illuminate\Support\Facades\Auth;
use App\Http\Services\FeexPayService;
use App\Http\Services\PaytechService;
use App\Http\Services\PayDunyaService;
use App\Http\Services\TransactionService;
use App\Http\Resources\TransactionResource;
use Illuminate\Support\Facades\Http;

class MyTransactionController extends BaseController
{

    private array $rules = [
        'payin_phone_number' => 'required|numeric',
        'payin_wprovider_id' => ['required', 'exists:w_providers,id'],
        'payout_phone_number' => 'required|numeric',
        'payout_wprovider_id' => ['required', 'exists:w_providers,id'],
        'amount' => 'required|numeric|min:10',
        'sender_support_fee' => 'required',
        'type' => 'in:school_help,family_help,rent,others',
        'otp_code' => 'string|min:4',
    ];

    public function __construct(
        private readonly PayDunyaService $payDunya,
        private readonly FeexPayService $feexpay,
        private readonly PaytechService $paytech,
        private readonly LoggerService $logger,
        // private readonly TransactionService $process,
    ) {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $per_page = request()->query('per_page', 10);
        $transactions = Transaction::with("payin_wprovider:id,name", "payout_wprovider:id,name")->where('user_id', $request->user()->id)->orderBy('created_at', 'desc')->paginate($per_page);
        return $this->handleResponse($transactions);
        // return response()->json($transactions);
    }

    /**
     * Store a newly created resource in storage.
     */

     public function store(Request $request)
     {
        $user = $request->user();
        if (!$user->is_active || !$user->is_verified) {
            return $this->handleError(
                __('validation.valid_sender_account'),
                ['error' => 'Votre compte n\'est pas vérifié.'],
            );
        }
        //variables initialisation
        $payloads = $this->handleValidate($request->post(), $this->rules);
        
        $payin_provider = WProvider::find($request->payin_wprovider_id);
        $payout_provider = WProvider::find($request->payout_wprovider_id);
        // dd($payin_provider->suppliers);
        $suplier = $payin_provider->suppliers()->where('type', 'payin')->first();
        $supplier_grid = json_decode($suplier->wallet_name, true);

        $amount = $request->amount;
        // calculate fees
        $fees_rate = $payin_provider->payin_fee + $payout_provider->payout_fee;
        $fees = $amount * $fees_rate / 100;
        if ($request->input('sender_support_fee') == true) {
            $amountWithoutFees = $amount;
            $amount = ceil($amount + $fees);
        } else {
            $amountWithoutFees = ceil($amount - $fees);
        }
        //  dd($request->input('sender_support_fee') == true, $amount, $amountWithoutFees);
        $fullname =  $user->first_name . ' ' . $user->last_name;
        $email =  $user->email;
        $phoneNumber = str_replace('+', '', $request->payin_phone_number);
        $otp = "";
        $callback_info = "Redirection";
        $custom_id = "test_transactions";

        // initiate payment
        switch ($suplier->name) {
            case 'feexpay':
                $reference = $this->feexpay->initPayin($amount, $phoneNumber, $supplier_grid[$payin_provider->name], $fullname, $email, $callback_info, $custom_id, $otp);
                break;
            case 'paytech':
                $reference = $this->paytech->initPayin($amount, $phoneNumber, $supplier_grid[$payin_provider->name], $fullname, $email, $callback_info, $custom_id, $otp);
                break;
            case 'pawapay':
                $reference = 'pawapay';
                break;
            default:
                return $this->handleError(
                    "Supplier not found",
                    ['error' => 'Le fournisseur n\'est pas trouvé'],
                );
                break;
        }
        // check if reference is string
        if (is_string($reference)) {
            Transaction::create([
                ...$payloads,
                'payin_status' => Transaction::PENDING_STATUS,
                'payout_status' => Transaction::PENDING_STATUS,
                'payin_phone_number' => $request->payin_phone_number,
                'payout_phone_number' => $request->payout_phone_number,
                'payin_wprovider_id' => $request->payin_wprovider_id,
                'payout_wprovider_id' => $request->payout_wprovider_id,
                'type' => $request->type ?? 'others',
                'payin_reference' => $reference,
                'user_id' => $user->id,
                'amount' => $amount,
                'amountWithoutFees' => $amountWithoutFees,
                'otp_code' => $request->input('otp_code', 1),
            ]);
        }

        return response()->json(['reference' => $reference]);
     }
    // public function store(Request $request)
    // {
    //     $user = $request->user();

    //     if (!$user->is_active || !$user->is_verified) {
    //         return $this->handleError(
    //             __('validation.valid_sender_account'),
    //             ['error' => 'Votre compte n\'est pas vérifié.'],
    //         );
    //     }

    //     $payloads = $this->handleValidate($request->post(), $this->rules);

    //     $additionalData = $this->process->calculate_fees($request);

    //     $sender = [
    //         'fullname' => $user->first_name . ' ' . $user->last_name,
    //         'email' => $user->email,
    //         'country' => $user->country->slug,
    //         'phone_num' => $request->payin_phone_number,
    //         'otp_code' => $request->input('otp_code', 1),
    //     ];
    //     $receiveStatus = $this->payDunya->receive(
    //         $additionalData['amountWithFees'],
    //         $additionalData['payinProvider'],
    //         $sender
    //     );

    //     if (
    //         $receiveStatus['status'] == $this->payDunya::STATUS_OK &&
    //         $receiveStatus['message']['success'] === true &&
    //         $receiveStatus['token']
    //     ) {

    //         unset($payloads['amount']);

    //         Transaction::create([
    //             ...$payloads,
    //             'payin_status' => Transaction::PENDING_STATUS,
    //             'payout_status' => Transaction::PENDING_STATUS,
    //             'type' => $request->type ?? 'others',
    //             'payin_reference' => $receiveStatus['token'],
    //             'user_id' => $user->id,
    //             'amount' => $additionalData['amountWithFees'],
    //             'amountWithoutFees' => $additionalData['amountWithoutFees'],
    //             'otp_code' => $request->input('otp_code', 1),
    //         ]);

    //         $this->logger->saveLog($request, $this->logger::TRANSFER);

    //         return $this->handleResponse($receiveStatus);
    //     }
    //     return $this->handleResponse($receiveStatus);
    // }

    // public function calculate_fees(Request $request)
    // {
    //     $payinProvider = WProvider::find($request->payin_wprovider_id);
    //     $payoutProvider = WProvider::find($request->payout_wprovider_id);
    //     $isSupportedFee = filter_var($request->post('sender_support_fee'), FILTER_VALIDATE_BOOLEAN);

    //     $amountWithoutFees = $request->amount;
    //     $totalFees = $payinProvider->payin_fee + $payoutProvider->payout_fee;
    //     $amountWithFees = (($amountWithoutFees * $totalFees) / 100) + $amountWithoutFees;

    //     if (!$isSupportedFee) {
    //         $amountWithoutFees -= ($amountWithFees - $amountWithoutFees);
    //         $amountWithFees = $request->amount;
    //     }

    //     return [
    //         'payinProvider' => $payinProvider,
    //         'payoutProvider' => $payoutProvider,
    //         'totalFees' => $totalFees,
    //         'amountWithoutFees' => ceil($amountWithoutFees),
    //         'amountWithFees' => ceil($amountWithFees),
    //     ];
    // }

    // public function check_transaction_status(string $token, string $type)
    // {
    //     if ($type == 'payin') {
    //         return $this->handleResponse($this->payDunya->payinStatus($token));
    //     }

    //     return $this->handleResponse($this->payDunya->payoutStatus($token));
    // }

    public function payin_status(string $reference)
    {
        $transaction = Transaction::where('payin_reference', $reference)->first();
        $provider = WProvider::find($transaction->payout_wprovider_id);
        
        $suplier = $provider->suppliers()->where("type", "payin")->first();
        $supplier_grid = json_decode($suplier->wallet_name, true);

        switch ($suplier->name) {
            case 'feexpay':
                $infos = $this->feexpay->payinStatus($reference);
                $status_table = ['FAILED' => 'failed', 'SUCCESSFUL' => 'success', 'PENDING' => 'pending'];
                $status = $status_table[$infos['status']];
                if($transaction && $status == 'failed'){
                    $transaction->update(['payin_status' => $status,'payout_status' => $status]);
                }
                if($transaction && $status == 'success'){
                    $transaction->update(['payin_status' => $status]);
                    $payout_reference = $this->initPayout($reference);
                    return response()->json(['status' => $status, 'payout' => $payout_reference]);
                }
                break;
            case 'paytech':
                $status = 'paytech';
                break;
            // case 'pawapay'
            //     $status = 'pawapay';
            //     break;
            default:
                $status = 'failed';
                break;
            
        }
        return response()->json(['status' => $status]);
    }

    public function initPayout($reference, $phone_number=null, $provider_name=null){
        // return response()->json($phone_number);
        $transaction = Transaction::where('payin_reference', $reference)->first();
        if($provider_name){
            $provider = WProvider::where("name", $provider_name)->first();
        }else{
            $provider = WProvider::find($transaction->payout_wprovider_id);
            $provider_name = $provider->name;
        }
        if($phone_number){
            $transaction->update(['payout_phone_number' => $phone_number, 'payout_wprovider_id' => $provider->id]);
        }else{
            $phone_number = $transaction->payout_phone_number;
        }
        if ($transaction->payin_status != 'success' || $transaction->payout_status == 'success') {
            return response()->json("Impossible d'effectuer cette transaction");
        }
        $suplier = $provider->suppliers()->where("type", "payout")->first();
        $supplier_grid = json_decode($suplier->wallet_name, true);
        
        switch ($suplier->name) {
            case 'feexpay':
                $payout = ['status' => 'pending'];
                $skeleton = $this->feexpay->initPayout(
                    $transaction->amountWithoutFees,
                    str_replace('+', '', $phone_number),
                    $supplier_grid[$provider_name],
                    "payout",
                    str_replace('+', '', $provider->country->country_code),
                );
                // return response()->json($skeleton);
                if (array_key_exists('reference', $skeleton)) {
                    $transaction->update(['payout_reference' => $skeleton['reference']]);
                }
                if (isset($skeleton['status']) && $skeleton['status'] == 'SUCCESSFUL') {
                    $transaction->update(['payout_status' => "success"]);
                    $payout = ['status' => 'success', 'reference' => $skeleton['reference']];
                }else{
                    $transaction->update(['payout_status' => "failed"]);
                    $message = $skeleton['amount']['msg'] ?? "Le destinataire n'a pas reçu les fonds";
                    $message .= "\n";
                    $message .= $skeleton['phoneNumber']['msg'] ?? "";
                    $payout = ['status' => 'failed', 'message' => $message, 'datas' => $skeleton];
                }
                break;
            case 'paytech':
                $payout = 'paytech';
                break;
            case 'pawapay':
                $payout = 'pawapay';
                break;
            default:
                $payout = 'failed';
                break;
        }
        return $payout;
    }
    public function payoutStatus($reference){
        $transaction = Transaction::where('payin_reference', $reference)->first();
        $provider = WProvider::find($transaction->payout_wprovider_id);
        
        $suplier = $provider->suppliers()->where("type", "payout")->first();
        $supplier_grid = json_decode($suplier->wallet_name, true);

    }
    function retry_payout(Transaction $transaction, string $phone_number){
        // check if transaction exist and return error if not
        if(!$transaction){
            return response()->json(['message' => 'Transaction not found']);
        }else{
            // check if transaction is not completed
            // return response()->json(['in' => $transaction->payin_status == "success", 'out' => $transaction->payout_status != "success"]);
            if($transaction->payin_status == "success" && $transaction->payout_status != "success"){
                $infos = $this->initPayout($transaction->payin_reference, $phone_number);
                return response()->json($infos, ($infos['status'] == 'success' ? 200 : 400));
            }else{
                return response()->json(['message' => 'Transaction already completed']);
            }
        }
    }


    public function update_payin_status(Request $request)
    {
        $calculate_hash = hash('sha512', env('$this->payDunya_MASTER_KEY'));

        $data = $request->data;

        if ($calculate_hash !== $data['hash']) {
            return;
        }

        $transaction = Transaction::where('payin_reference', $data['invoice']['token'])->firstOrFail();
        $serverStatus = $data['status'];

        $status = $serverStatus === 'completed' ? 'success' : ($serverStatus == 'canceled' ? 'failed' : ($serverStatus == 'failed' ? 'failed' : 'failed'));
        $transaction->update(['payin_status' => $status]);

        if ($status == Transaction::APPROVED_STATUS) {
            $sendStatus = $this->payDunya::send(
                // $transaction->payout_wprovider->withdraw_mode,
                $transaction->payout_phone_number,
                $transaction->amountWithoutFees,
            );
            if ($sendStatus['status'] == $this->payDunya::STATUS_OK) {
                $transaction->update(['payout_reference' => $sendStatus['token']]);
            }
            return $sendStatus;
        }
        return;
    }

    public function update_payout_status(Request $request)
    {
        $data = $request->data ?? [];

        if (isset($data['status'])) {
            if ($data['status'] == Transaction::APPROVED_STATUS) {
                $transaction = Transaction::where('payout_reference', $data['token'])->first();

                $transaction->update(['payout_status' => $data['status']]);

                $this->generateAndSendInvoice($transaction);
            }
        }
    }

    // public function refresh_transaction(Request $request, string $payin_token)
    // {
    //     $user = $request->user();

    //     $transaction = Transaction::where('payin_reference', $payin_token)->firstOrFail();

    //     if ($user->id != $transaction->user_id) {
    //         return $this->handleError(
    //             "Unauthorized action",
    //             ['error' => 'Action non autorisée'],
    //         );
    //     }

    //     if (
    //         $transaction->payin_status !== Transaction::APPROVED_STATUS
    //         && $transaction->payin_status !== Transaction::PENDING_STATUS
    //     ) {

    //         $sender = [
    //             'fullname' => $user->first_name . ' ' . $user->last_name,
    //             'email' => $user->email,
    //             'country' => $user->country->slug,
    //             'phone_num' => $transaction->payin_phone_number,
    //             'otp_code' => $transaction->otp_code,
    //         ];

    //         return $this->payDunya::receive(
    //             $transaction->amount,
    //             $transaction->payin_wprovider,
    //             $sender
    //         );
    //     }

    //     if (
    //         $transaction->payin_status === Transaction::APPROVED_STATUS
    //         && $transaction->payout_status !== Transaction::APPROVED_STATUS
    //         && $transaction->payout_status !== Transaction::PENDING_STATUS
    //     ) {

    //         $sendStatus = $this->payDunya::send(
    //             // $transaction->payout_wprovider->withdraw_mode,
    //             $transaction->payout_phone_number,
    //             $transaction->amountWithoutFees,
    //         );

    //         if ($sendStatus['status'] == $this->payDunya::STATUS_OK) {

    //             $transaction->update(['payout_reference' => $sendStatus['token']]);
    //         }

    //         return $sendStatus;
    //     }
    //     return $this->handleResponse("Cette transaction est bien complète!");
    // }

    /**
     * Display the specified resource.
     */
    public function show($transaction)
    {
        $transaction = Transaction::findOrFail($transaction);

        return $this->handleResponse(new TransactionResource($transaction));
    }


    public function destroy(Request $request, Transaction $transaction)
    {
        if ($request->user()->id != $transaction->user_id) {
            return $this->handleError(
                "Unauthorized action",
                ['error' => 'Action non autorisée'],
                403
            );
        }

        $transaction->delete();
        return $this->handleResponse($transaction, 'Your transaction deleted successfully.');
    }

    //test du code de feexpay


    public function payback(Request $request)
    {
        $user = $request->user();

        if (!$user->is_active || !$user->is_verified) {
            return $this->handleError(
                __('validation.valid_sender_account'),
                ['error' => 'Votre compte n\'est pas vérifié.'],
            );
        }

        $transactionId = $request->transactionId;

        $findTransaction = Transaction::where('payin_reference' == $transactionId);

        if ($FindTransaction) {
            $phoneNumber = $request->payin_phone_number;
            $amount = $findTransaction->amount;
            $operatorName = $findTransaction->amount;
            $motif = $request->$request->motif;
        }

    }
    public function paytechPayment(Request $request)
    {
        $apiUrl = 'https://paytech.sn/api/payment/request-payment';
        $params = [
            'item_name' => "mom produit",
            'item_price' => 100,
            'currency' => 'XOF',
            'ref_command' => uniqid(),
            'command_name' => 'Paiement via PayTech',
            'env' => 'test',
            'ipn_url' => url('/my-ipn'), // URL pour IPN
            'success_url' => url('/success'),
            'cancel_url' => url('/cancel'),
            'custom_field' => json_encode(['custom_field1' => 'value1']),
        ];

        $response = Http::withHeaders([
            'API_KEY' => env('PAYTECH_API_KEY'),
            'API_SECRET' => env('PAYTECH_API_SECRET'),
            'Content-Type' => 'application/json',
        ])->post($apiUrl, $params);

        $responseBody = $response->json();

        if ($responseBody['success'] === 1) {
            return redirect($responseBody['redirect_url']);
        }

        return back()->withErrors(['message' => 'Erreur lors de la demande de paiement.']);
    }


    public function paytechStatus(Request $request): JsonResponse
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
