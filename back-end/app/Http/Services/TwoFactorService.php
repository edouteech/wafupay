<?php

namespace App\Http\Services;

use App\Models\User;
use App\Models\OtpCode;
use App\Http\Controllers\API\BaseController;
use App\Mail\EmailVerification;
use App\Mail\ResetPasswordEmail;
use App\Mail\TwoFactor;
use Carbon\Carbon;
use Illuminate\Contracts\Mail\Mailable;
use RobThree\Auth\TwoFactorAuth;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;

class TwoFactorService extends BaseController
{
    private TwoFactorAuth $app;


    public function __construct()
    {
        $this->app = new TwoFactorAuth();
    }

    public function sendPasswordResetToken(?User $user): JsonResponse
    {
        $secret = $this->create_and_store_token($user, OtpCode::PASSWORD_RESET);

        $this->process_mail(
            $user,
            new ResetPasswordEmail($secret, $this->getFullname($user), '15')
        );

        return $this->handleResponse([$user], "Un message contenant le code de vérification a été envoyé à votre adresse email");
    }

    public function send2FAToken(?User $user): JsonResponse
    {
        $secret = $this->create_and_store_token($user);

        $this->process_mail(
            $user,
            new TwoFactor($secret, $this->getFullname($user))
        );

        return $this->handleResponse([$user], "Votre code d'authentication à deux facteur est envoyé à votre adresse email");
    }

    public function sendEmailVerificationToken(?User $user): JsonResponse
    {
        $secret = $this->create_and_store_token($user, OtpCode::EmailVerificationTYPE);

        $this->process_mail(
            $user,
            new EmailVerification($secret, $this->getFullname($user))
        );

        return $this->handleResponse($user, "Vérifier votre boite email pour vérifier votre adresse email avec le code OTP récu");
    }

    public function create_and_store_token(?User $user, string $type = OtpCode::TwoFactor): string
    {
        $secret = $this->generateToken();

        $this->saveOTPCode($secret, $user, $type);

        return $secret;
    }

    public function generateToken(): string
    {
        // return $this->app->createSecret(32);
        $secret = $this->app->createSecret(32);
        return $this->app->getCode($secret);
    }

    public function verifyToken(string $token, string $secret): bool
    {
        return $this->app->verifyCode($secret, $token);
    }

    public function saveOTPCode(
        string $secret,
        ?User $user = null,
        string $type = OtpCode::TwoFactor,
    ): void {
        $expirationTime = Carbon::now()->addMinutes(15);

        $user->otp_codes()->create([
            'code' => $secret,
            'type' => $type,
            'expired_at' => $expirationTime,
        ]);
    }

    public function checkToken(
        User $user,
        string $token,
        string $type = OtpCode::TwoFactor
    ) {

        if ($otp = $user->otp_codes()
            ->where(['code' => $token, 'is_verified' => false, 'type' => $type])
            ->latest()
            ->first()
        ) {

            if ($otp !== null && ($otp->expired_at !== null && Carbon::parse($otp->expired_at)->lte(Carbon::now()))) {
                return $this->handleError('Le code à deux facteurs est expiré');
            }
            return $otp->code;
        }
        return $this->handleError('Code à deux facteurs invalide');
    }

    public function markVerified(
        User $user,
        string $type = OtpCode::TwoFactor
    ) {

        $user->otp_codes()
            ->where(['type' => $type])
            ->update(['is_verified' => true]);
    }


    public function process_mail(
        ?User $user = null,
        Mailable $mailer
    ) {
        Mail::to($user->email)->send($mailer);
    }

    private function getFullname(?User $user)
    {
        return $user->first_name . " " . $user->last_name;
    }
}
