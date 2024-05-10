<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice {{ $invoice_num }} </title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
        rel="stylesheet">
    <style>
        body {
            font-family: "Montserrat", sans-serif;
            font-optical-sizing: auto;
            font-weight: <weight>;
            font-style: normal;
        }

        .invoice {
            width: 80%;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ccc;
        }

        .invoice-header {
            text-align: center;
            margin-bottom: 20px;
        }

        .invoice-header img {
            max-width: 200px;
            margin-bottom: 10px;
        }

        .invoice-details {
            margin-bottom: 20px;
        }

        .invoice-details table {
            width: 100%;
            border-collapse: collapse;
        }

        .invoice-details table td {
            padding: 8px;
            border: 1px solid #ccc;
        }

        .invoice-items table {
            width: 100%;
            border-collapse: collapse;
        }

        .invoice-items table th,
        .invoice-items table td {
            padding: 8px;
            border: 1px solid #ccc;
        }

        .bold {
            font-weight: bold;
        }

        .flex {
            display: flex;
        }

        .justify-between {
            justify-content: space-between;
        }

        .text-center {
            text-align: center
        }

        .self-center {
            align-items: center
        }

        .mx-2 {
            margin-left: .5rem;
            margin-right: .5rem;
        }
    </style>
</head>

<body>
    <div class="invoice">
        <div class="invoice-header">
            <img src="{{ asset('logo.png') }}" alt="WafuPay Logo">
            <h2>Réçu N°: {{ $invoice_num }} </h2>
            <p>Adresse: 123 Main Street, Abomey-Calavi, Benin</p>
            <p>Phone: +123 456 789</p>
            <p>Email: info@wafupay.com</p>
        </div>
        <div class="invoice-details">
            <table>
                <tr>
                    <td><strong>Date d’initiation</strong></td>
                    <td>{{ $transaction->created_at->format('d F Y H:i:s (UTC + 1)') }}</td>
                </tr>
                <tr>
                    <td><strong>Date transaction</strong></td>
                    <td>{{ $transaction->updated_at->format('d F Y H:i:s (UTC + 1)') }}</td>
                </tr>
                <tr>
                    <td><strong>Expéditeur(trice)</strong></td>
                    <td>
                        <span class="bold">Nom</span> {{ $transaction->user->first_name }} {{ $transaction->user->last_name }} <br>
                        <span class="bold">Tél:</span> {{ $transaction->payin_wprovider->country->country_code }} {{ $transaction->payin_phone_number }}<br>
                        <span class="flex self-center">
                            <span><span class="bold">Méthode de paiement:</span> {{ $transaction->payin_wprovider->slug }} </span>
                            <img class="mx-2" src="{{ '/storage/wproviders/' . $transaction->payin_wprovider->withdraw_mode . '.png' }}" alt="{{ $transaction->payin_wprovider->slug }} Logo"
                                style="max-width: 35px;">
                        </span>
                    </td>
                </tr>
                <tr>
                    <td><strong>Destinataire</strong></td>
                    <td>
                        <span class="bold">Nom</span> {{ $transaction->user->first_name }} {{ $transaction->user->last_name }} <br>
                        <span class="bold">Tél:</span> {{ $transaction->payout_wprovider->country->country_code }} {{ $transaction->payout_phone_number }}<br>
                        <span class="flex self-center">
                            <span><span class="bold">Méthode de paiement:</span> {{ $transaction->payout_wprovider->slug }} </span>
                            <img class="mx-2" src="{{ '/storage/wproviders/' . $transaction->payout_wprovider->withdraw_mode . '.png' }}" alt="{{ $transaction->payout_wprovider->slug }} Logo"
                                style="max-width: 35px;">
                        </span>
                    </td>
                </tr>
                <tr>
                    <td><strong>Montant Envoyer</strong></td>
                    <td>
                        {{ $transaction->amount }} FCFA
                    </td>
                </tr>
                <tr>
                    <td><strong>Frais de Transfert</strong></td>
                    <td>
                        {{ $transaction->amount - $transaction->amountWithoutFees }} FCFA
                    </td>
                </tr>
                <tr>
                    <td><strong>Montant Réçu</strong></td>
                    <td>
                        {{ $transaction->amountWithoutFees }} FCFA
                    </td>
                </tr>
                <tr>
                    <td><strong>Statut transaction</strong></td>
                    <td>
                        Succès
                    </td>
                </tr>
            </table>
        </div>
        <div class="invoice-total">
            <h4 style="margin: 0">Paiement effectué via <a href="https://wafupay.com" target="_blank">WafuPay</a></h4>
            <p>Solution de paiement simple et sécurisée pour particuliers & entreprises.</p>
        </div>
    </div>
</body>

</html>
