<!DOCTYPE html>
<html>
<head>
    <title>Code de vérification de votre adresse email</title>
</head>
<body>
    <h1>Votre code de vérification de votre adresse email</h1>
    <p>Bonjour {{ $fullname }},</p>
    <p>Pour continuer votre inscription et accéder à votre compte WafuPay, veuillez recuperer le code secret ci-dessous pour continuer :</p>
    <h2 style="color: #FFA500">{{ $code }}</h2>
    <p>Si vous n'avez pas demandé cette action, veuillez supprimer ce message.</p>
    <p>Merci,</p>
    <p>La {{ config('app.name') }}</p>
</body>
</html>
