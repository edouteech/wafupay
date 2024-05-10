<?php

namespace App\Http\Controllers\API;

use App\Mail\SuccessInvoice;
use Dompdf\Dompdf;
use Dompdf\Options;
use App\Models\Transaction;
use App\Models\WProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class TransactionBaseController extends BaseController
{
    protected array $rules = [
        'payin_phone_number' => 'required|min_digits:8|numeric|max_digits:10',
        'payin_wprovider_id' => ['required', 'exists:w_providers,id'],
        'payout_phone_number' => 'required|min_digits:8|numeric|max_digits:10',
        'payout_wprovider_id' => ['required', 'exists:w_providers,id'],
        'amount' => 'required|numeric|min:200',
        'sender_support_fee' => 'required',
        'type' => 'in:school_help,family_help,rent,others',
        'otp_code' => 'string|min:4',
    ];

    protected function calculate_fees(Request $request): array
    {
        $isSupportedFee = filter_var($request->post('sender_support_fee'), FILTER_VALIDATE_BOOLEAN);

        $amountWithoutFees = $request->amount;

        $payinProvider = WProvider::find($request->payin_wprovider_id);
        $payoutProvider = WProvider::find($request->payout_wprovider_id);

        $totalFees = $payinProvider->getFee($amountWithoutFees)->payin_fee +
            $payoutProvider->getFee($amountWithoutFees)->payout_fee;

        $amountWithFees = (($amountWithoutFees * $totalFees) / 100) + $amountWithoutFees;

        if (!$isSupportedFee) {
            $amountWithoutFees -= ($amountWithFees - $amountWithoutFees);
            $amountWithFees = $request->amount;
        }

        return [
            'payinProvider' => $payinProvider,
            'payoutProvider' => $payoutProvider,
            'totalFees' => $totalFees,
            'amountWithoutFees' => ceil($amountWithoutFees),
            'amountWithFees' => ceil($amountWithFees),
        ];
    }


    public function generateInvoice($transactionId)
    {
        $transaction = Transaction::findOrFail($transactionId);

        $invoice_num = 'WafuPay-' . $transaction->id;

        $invoiceView = view('invoices.success', compact('transaction', 'invoice_num'));

        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isRemoteEnabled', true);

        $dompdf = new Dompdf($options);

        $dompdf->loadHtml($invoiceView->render());

        $dompdf->render();

        $filename = 'REÇU_SUCCESS_TRANSACTION_' . $invoice_num . '.pdf';

        Storage::disk('local')->put('invoices/' . $filename, $dompdf->output());

        Mail::to($transaction->user->email)->send(new SuccessInvoice($transaction, $filename));

        return 'Facture générée et envoyée avec succès.';
    }
}
