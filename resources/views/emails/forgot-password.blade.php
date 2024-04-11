<!DOCTYPE html>
<html>
<head>
    <title>Réinitialisation du mot de passe</title>
</head>
<body>
    <h1>Mot de passe</h1>
    <p>Bonjour {{ $username }},</p>
    <p>Vous avez demandé à réinitialiser votre mot de passe pour acceder à votre compte WuraPay. Veuillez suivre le lien ci-dessous pour continuer :</p>
    <h2 style="color: #008bcb">{{ $token }}</h2>
    <p>Si vous n'avez pas demandé cette action, veuillez supprimer ce message.</p>
    <p>Merci,</p>
    <p>La {{ config('app.name') }}</p>
</body>
</html>
