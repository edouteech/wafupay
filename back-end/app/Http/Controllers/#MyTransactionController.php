<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

use App\Http\Resources\TransactionResource;
use App\Http\Services\LoggerService;
use App\Http\Services\PayDunyaService;
use App\Http\Services\TransactionService;
use App\Models\Transaction;
use App\Http\Controllers\API\BaseController;

class MyTransactionController extends Controller
{with("payin_wprovider", "payout_wprovider","user")->

    public function __construct(
        private readonly PayDunyaService $payDunya,
        private readonly LoggerService $logger,
        private readonly TransactionService $process,
    ) {
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $transactions = TransactionResource::collection(Transaction::orderByDesc('id')->get());
        $transactions = Transaction::orderByDesc('id')->paginate(10);
        return $this->handleResponse($transactions);
    }
    public function getTrans()
    {
        $transactions = TransactionResource::collection(Transaction::orderByDesc('id')->get());
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
                // $transaction->payout_wprovider->withdraw_mode,
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
                // $transaction->payout_wprovider->withdraw_mode,
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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        $transaction->delete();
        return $this->handleResponse($transaction, 'Transaction deleted successfully.');
    }

    public function destroyByUser(Request $request, Transaction $transaction)
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
}
