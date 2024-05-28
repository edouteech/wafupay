<?php

namespace App\Http\Controllers\API\Auth;

use App\Http\Controllers\API\BaseController;
use App\Http\Utils\ValidationException;
use App\Models\User;
use App\Rules\ValidPhoneNumber;
use App\Http\Services\TwoFactorService;
use App\Models\OtpCode;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rules;
use Illuminate\Http\Request;

class ForgotPasswordController extends BaseController
{

    public function __construct(
        private readonly TwoFactorService $twoFactorService,
    ) {
    }

    public function send_otp(Request $request)
    {
        $this->handleValidate($request->post(), [
            'email' => 'required_without:phone_num|email',
        ]);

        if ($user = User::where('email', $request->post('email'))
            ->first()
        ) {
            return $this->twoFactorService->sendPasswordResetToken($user);
        }

        return $this->handleError('Adresse email invalide');
    }

    public function reset_password(Request $request)
    {
        $this->handleValidate($request->post(), [
            'otp' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', Rules\Password::defaults()],
            'confirm_password' => 'required|same:password',
        ]);

        $user = User::where('email', $request->email)->firstOrFail();

        $checkedStatus = $this->check2fa($request->otp, $user);

        if ($checkedStatus instanceof JsonResponse) {
            return $checkedStatus;
        }

        if ($user->update(['password' => $request->password])) {
            event(new PasswordReset($user));
            return $this->handleResponse('Votre mot de passe a été réinitialisé avec succès.');
        }
    }

    private function check2fa(string $token, User $user)
    {
        $checkedStatus = $this->twoFactorService->checkToken($user, $token, OtpCode::PASSWORD_RESET);

        if (!$checkedStatus instanceof JsonResponse) {
            return $this->twoFactorService->markVerified($user, OtpCode::PASSWORD_RESET);
        }
        return $checkedStatus;
    }
}
