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
use App\Http\Services\PayDunyaService;
use App\Http\Services\TransactionService;
use App\Http\Resources\TransactionResource;

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
        private readonly LoggerService $logger,
        private readonly TransactionService $process,
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
    }

    /**
     * Store a newly created resource in storage.
     */

     public function store(Request $request)
     {
         $suplier = Supplier::where("name", "feexpay")->first();
         $supplier_grid = json_decode($suplier->wallet_name, true);
         $payin_provider = WProvider::find($request->payin_wprovider_id);
         $payout_provider = WProvider::find($request->payout_wprovider_id);
         $user = $request->user();
 
         if (!$user->is_active || !$user->is_verified) {
             return $this->handleError(
                 __('validation.valid_sender_account'),
                 ['error' => 'Votre compte n\'est pas vérifié.'],
             );
         }
 
         //variables initialisation
         $payloads = $this->handleValidate($request->post(), $this->rules);
 
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
         $reference = $this->feexpay->initPayin($amount, $phoneNumber, $supplier_grid[$payin_provider->name], $fullname, $email, $callback_info, $custom_id, $otp);
 
         //get status
         // $status = $this->feexpay->payinStatus($payin_params);
 
         Transaction::create([
             ...$payloads,
             'payin_status' => Transaction::PENDING_STATUS,
             'payout_status' => Transaction::PENDING_STATUS,
             'payin_phone_number' => $request->payin_phone_number,
             'payout_phone_number' => $request->payout_phone_number,
             'payin_wprovider_id' => $request->payin_wprovider_id,
             'payout_wprovider_id' => $request->payout_wprovider_id,
             'type' => $request->type ?? 'others',
             'token' => $reference,
             'user_id' => $user->id,
             'amount' => $amount,
             'amountWithoutFees' => $amountWithoutFees,
             'otp_code' => $request->input('otp_code', 1),
         ]);
 
         return response()->json($reference);
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
    //             'token' => $receiveStatus['token'],
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

    public function payinStatus(string $reference)
    {
        return response()->json($this->feexpay->payinStatus($reference));
        // return $this->handleResponse($this->payDunya->payinStatus($token));

        // return $this->handleResponse($this->payDunya->payoutStatus($token));
    }

    // public function payinStatus($reference){
    //     $suplier = Supplier::where("name", "feexpay")->first();
    //     $supplier_grid = json_decode($suplier->wallet_name, true);

    //     $status = $this->feexpay->getPaymentStatus($reference);
    //     $transaction = Transaction::where('token', $reference)->first();
    //     $provider = WProvider::find($transaction->payout_wprovider_id);

    //     if($transaction && $status['status'] == 'FAILED'){
    //         $transaction->update(['payin_status' => "failed",'payout_status' => "failed"]);
    //     }
    //     if($transaction && $status['status'] == 'SUCCESSFUL'){
    //         $transaction->update(['payin_status' => "success"]);
            
    //         $payout = $this->feexpay->initPayout(
    //             $transaction->amountWithoutFees,
    //             str_replace('+', '', $transaction->payout_phone_number),
    //             $supplier_grid[$provider->name],
    //             "payout"
    //         );
            
    //         if (array_key_exists('reference', $payout)) {
    //             $transaction->update(['disburse_token' => $payout['reference']]);
    //         }
    //         if (isset($payout['status']) && $payout['status'] == 'SUCCESSFUL') {
    //             $transaction->update(['payout_status' => "success"]);
    //         }else{
    //             $transaction->update(['payout_status' => "failed"]);
    //         }
    //         return response()->json($payout);
    //     }
        
    //     return response()->json($status);
    // }

    public function update_payin_status(Request $request)
    {
        $calculate_hash = hash('sha512', env('$this->payDunya_MASTER_KEY'));

        $data = $request->data;

        if ($calculate_hash !== $data['hash']) {
            return;
        }

        $transaction = Transaction::where('token', $data['invoice']['token'])->firstOrFail();
        $serverStatus = $data['status'];

        $status = $serverStatus === 'completed' ? 'success' : ($serverStatus == 'canceled' ? 'failed' : ($serverStatus == 'failed' ? 'failed' : 'failed'));
        $transaction->update(['payin_status' => $status]);

        if ($status == Transaction::APPROVED_STATUS) {
            $sendStatus = $this->payDunya::send(
                $transaction->payout_wprovider->withdraw_mode,
                $transaction->payout_phone_number,
                $transaction->amountWithoutFees,
            );
            if ($sendStatus['status'] == $this->payDunya::STATUS_OK) {
                $transaction->update(['disburse_token' => $sendStatus['token']]);
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
                $transaction = Transaction::where('disburse_token', $data['token'])->first();

                $transaction->update(['payout_status' => $data['status']]);

                $this->generateAndSendInvoice($transaction);
            }
        }
    }

    public function refresh_transaction(Request $request, string $payin_token)
    {
        $user = $request->user();

        $transaction = Transaction::where('token', $payin_token)->firstOrFail();

        if ($user->id != $transaction->user_id) {
            return $this->handleError(
                "Unauthorized action",
                ['error' => 'Action non autorisée'],
            );
        }

        if (
            $transaction->payin_status !== Transaction::APPROVED_STATUS
            && $transaction->payin_status !== Transaction::PENDING_STATUS
        ) {

            $sender = [
                'fullname' => $user->first_name . ' ' . $user->last_name,
                'email' => $user->email,
                'country' => $user->country->slug,
                'phone_num' => $transaction->payin_phone_number,
                'otp_code' => $transaction->otp_code,
            ];

            return $this->payDunya::receive(
                $transaction->amount,
                $transaction->payin_wprovider,
                $sender
            );
        }

        if (
            $transaction->payin_status === Transaction::APPROVED_STATUS
            && $transaction->payout_status !== Transaction::APPROVED_STATUS
            && $transaction->payout_status !== Transaction::PENDING_STATUS
        ) {

            $sendStatus = $this->payDunya::send(
                $transaction->payout_wprovider->withdraw_mode,
                $transaction->payout_phone_number,
                $transaction->amountWithoutFees,
            );

            if ($sendStatus['status'] == $this->payDunya::STATUS_OK) {

                $transaction->update(['disburse_token' => $sendStatus['token']]);
            }

            return $sendStatus;
        }
        return $this->handleResponse("Cette transaction est bien complète!");
    }

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

        $findTransaction = Transaction::where('token' == $transactionId);

        if ($FindTransaction) {
            $phoneNumber = $request->payin_phone_number;
            $amount = $findTransaction->amount;
            $operatorName = $findTransaction->amount;
            $motif = $request->$request->motif;
        }

    }

    public function initPayout(Request $request){
        $suplier = Supplier::where("name", "feexpay")->first();
        $supplier_grid = json_decode($suplier->wallet_name, true);
        $provider = WProvider::find($request->payin_wprovider_id);
        $user = $request->user();

        if (!$user->is_active || !$user->is_verified) {
            return $this->handleError(
                __('validation.valid_sender_account'),
                ['error' => 'Votre compte n\'est pas vérifié.'],
            );
        }
    }

    public function payoutStatus($reference){
        $suplier = Supplier::where("name", "feexpay")->first();
        $supplier_grid = json_decode($suplier->wallet_name, true);

    }
}
