<?php

namespace App\Http\Controllers\API;

use App\Models\Transaction;
use Illuminate\Http\Request;
use App\Http\Services\LoggerService;
use Illuminate\Support\Facades\Auth;
use App\Http\Services\PayDunyaService;
use App\Http\Services\FeexPayService;
use App\Http\Services\TransactionService;
use App\Http\Resources\TransactionResource;

class MyTransactionController extends BaseController
{

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
        $transactions = Transaction::where('user_id', $request->user()->id)->orderBy('created_at', 'desc')->paginate($per_page);
        return $this->handleResponse($transactions);
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

        $payloads = $this->handleValidate($request->post(), $this->process->getRules());

        $additionalData = $this->process->calculate_fees($request);

        $sender = [
            'fullname' => $user->first_name . ' ' . $user->last_name,
            'email' => $user->email,
            'country' => $user->country->slug,
            'phone_num' => $request->payin_phone_number,
            'otp_code' => $request->input('otp_code', 1),
        ];
        $receiveStatus = $this->payDunya->receive(
            $additionalData['amountWithFees'],
            $additionalData['payinProvider'],
            $sender
        );

        if (
            $receiveStatus['status'] == $this->payDunya::STATUS_OK &&
            $receiveStatus['message']['success'] === true &&
            $receiveStatus['token']
        ) {

            unset($payloads['amount']);

            Transaction::create([
                ...$payloads,
                'payin_status' => Transaction::PENDING_STATUS,
                'payout_status' => Transaction::PENDING_STATUS,
                'type' => $request->type ?? 'others',
                'token' => $receiveStatus['token'],
                'user_id' => $user->id,
                'amount' => $additionalData['amountWithFees'],
                'amountWithoutFees' => $additionalData['amountWithoutFees'],
                'otp_code' => $request->input('otp_code', 1),
            ]);

            $this->logger->saveLog($request, $this->logger::TRANSFER);

            return $this->handleResponse($receiveStatus);
        }
        return $this->handleResponse($receiveStatus);
    }

    public function calculate_fees(Request $request)
    {
        return $this->process->calculate_fees($request);
    }

    public function check_transaction_status(string $token, string $type)
    {
        if ($type == 'payin') {
            return $this->handleResponse($this->payDunya->payinStatus($token));
        }

        return $this->handleResponse($this->payDunya->payoutStatus($token));
    }

    public function check_status(string $token, string $type)
    {
        if ($type == 'payin') {
            return $this->handleResponse($this->payDunya->payinStatus($token));
        }

        return $this->handleResponse($this->payDunya->payoutStatus($token));
    }

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

    public function paiementLocal(Request $request)
    {
        $user = $request->user();

        $amount = $request->input('amount');
        $operatorName = $request->input('network');
        $fullname =  $user->first_name . ' ' . $user->last_name;
        $email =  $user->email;
        $phoneNumber = $request->input('payin_PhoneNumber');
        $otp = "";
        $callback_info = "Redirection";
        $custom_id = "test_transactions";

      // initiate payment
        $response = $this->feexpay->initiateLocalPayment($amount, $phoneNumber, $operatorName, $fullname, $email, $callback_info, $custom_id, $otp);

        //get status
        $status = $this->feexpay->getPaymentStatus($response);

        if ($status["status"]  == "PENDING") {

        }
        while ($status["status"]  == "PENDING") {
            $status = $this->feexpay->getPaymentStatus($response);
        }

        if ($status["status"]  == "SUCCESSFUL") {

            $phoneNumber = $request->input('payout_PhoneNumber');
            $amount = $request->input('amount');
            $network = $request->input('network');
            $motif = $request->input('motif');

            $payout = $this->feexpay->initiatePayout($amount, $phoneNumber, $network, $motif);

            return response()->json($payout);
        } else{
            return response()->json("Request failed");
        }
            return response()->json($status);
    }
}
