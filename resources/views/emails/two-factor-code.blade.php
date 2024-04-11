<!DOCTYPE html>
<html>
<head>
    <title>Code d'authentification à deux facteurs</title>
</head>
<body>
    <h1>Votre code secret</h1>
    <p>Bonjour {{ $fullname }},</p>
    <p>Vous avez demandé à accéder à votre compte WuraPay. Veuillez recuperer le code secret ci-dessous pour continuer :</p>
    <h2 style="color: #FFA500">{{ $code }}</h2>
    <p>Si vous n'avez pas demandé cette action, veuillez supprimer ce message.</p>
    <p>Merci,</p>
    <p>La {{ config('app.name') }}</p>
</body>
</html>
