<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction WafuPay réussie</title>
    <style>
        body {
            font-size: 18px;
        }
    </style>
</head>
<body>
    <div style="background-color: #f0f0f0; padding: 20px;text-align:center">
        <table style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 5px; padding: 20px;">
            <tr>
                <td>
                    <p style="text-align: center"><img src="{{ asset('logo.png') }}" alt="WafuPay Logo"></p>
                    <p>Hi {{ $user->first_name }} {{ $user->last_name }},</p>
                    <p>Merci d’avoir utilisé WafuPay.</p>
                    <p>Votre transaction a bien été éffectuée avec succès, Vous trouverez en pièce jointe le reçu associé à votre paiement</p>
                    <p>L’équipe de WafuPay</p>
                </td>
            </tr>
            <tr>
                <td style="text-align: center; padding-top: 20px;">
                    <h3 style="font-size: 18px; color: #333333;">Découvrez notre nouveau service</h3>
                    <p>Faites votre 1er transfert maintenant</p>
                    <p>Téléchargez l'app sur <a href="#">Play Store</a></p>
                    <p>Téléchargez l'app sur <a href="#">Apple Store</a></p>
                    <p>L’équipe de WafuPay</p>
                </td>
            </tr>
            <tr>
                <td style="padding-top: 20px;">
                    <p>info@wafupay.com</p>
                    <p>123 Main Street, Abomey-Calavi, Benin</p>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
