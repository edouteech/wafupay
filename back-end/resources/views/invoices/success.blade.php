<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice</title>
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
            <h2>Réçu N°: 111111111111111111111</h2>
            <p>Adresse: 123 Main Street, Abomey-Calavi, Benin</p>
            <p>Phone: +123 456 789</p>
            <p>Email: info@wafupay.com</p>
        </div>
        <div class="invoice-details">
            <table>
                <tr>
                    <td><strong>Date transaction</strong></td>
                    <td>{{ date('Y-m-d H-m-i') }}</td>
                </tr>
                <tr>
                    <td><strong>Expéditeur(trice)</strong></td>
                    <td>
                        <span class="bold">Nom</span> ALASSANE Kabirou<br>
                        <span class="bold">Tél:</span> 95181019<br>
                        <span class="flex self-center">
                            <span><span class="bold">Méthode de paiement:</span> MTN BENIN</span>
                            <img class="mx-2" src="{{ '/storage/wproviders/mtn-benin.png' }}" alt="Sender Logo"
                                style="max-width: 35px;">
                        </span>
                    </td>
                </tr>
                <tr>
                    <td><strong>Destinataire</strong></td>
                    <td>
                        <span class="bold">Nom</span> Fortunatus KIDJE<br>
                        <span class="bold">Tél:</span> 96457545<br>
                        <span class="flex self-center">
                            <span><span class="bold">Méthode de paiement:</span> MTN BENIN</span>
                            <img class="mx-2" src="{{ '/storage/wproviders/mtn-benin.png' }}" alt="Sender Logo"
                                style="max-width: 35px;">
                        </span>
                    </td>
                </tr>
                <tr>
                    <td><strong>Montant Envoyer</strong></td>
                    <td>
                        1035 FCFA
                    </td>
                </tr>
                <tr>
                    <td><strong>Frais de Transfert</strong></td>
                    <td>
                        35 FCFA
                    </td>
                </tr>
                <tr>
                    <td><strong>Montant Réçu</strong></td>
                    <td>
                        1000 FCFA
                    </td>
                </tr>
                <tr>
                    <td><strong>Statut transaction</strong></td>
                    <td>
                        Sucess
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
