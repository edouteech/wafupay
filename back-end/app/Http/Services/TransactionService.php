<?php

namespace App\Http\Services;

use App\Mail\SuccessInvoice;
use Dompdf\Dompdf;
use Dompdf\Options;
use App\Models\Transaction;
use App\Models\WProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class TransactionService
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

    public function getRules(): array
    {
        return $this->rules;
    }

    public function calculate_fees(Request $request): array
    {
        $isSupportedFee = filter_var($request->post('sender_support_fee'), FILTER_VALIDATE_BOOLEAN);

        $amountWithoutFees = $request->amount;

        $payinProvider = WProvider::find($request->payin_wprovider_id);
        $payoutProvider = WProvider::find($request->payout_wprovider_id);

        $totalFees = $payinProvider->payin_fee + $payoutProvider->payout_fee;

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


    private function generateInvoice(Transaction $transaction)
    {
        $invoice_num = 'WafuPay-' . $transaction->id;

        $invoiceView = view('invoices.success', compact('transaction', 'invoice_num'));

        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isRemoteEnabled', true);

        $dompdf = new Dompdf($options);

        $dompdf->loadHtml($invoiceView->render());

        $dompdf->render();

        $filename = 'TRANSACTION_INVOICE_SUCCESS_' . $invoice_num . '.pdf';

        Storage::disk('local')->put('invoices/' . $filename, $dompdf->output());

        return $filename;
    }

    public function generateAndSendInvoice(Transaction $transaction)
    {
        $filename = $this->generateInvoice($transaction);

        $email = $transaction->user->email;

        Mail::to($email)
            ->send(new SuccessInvoice($transaction, $filename));

        return 'Facture générée et envoyée avec succès.';
    }
}
