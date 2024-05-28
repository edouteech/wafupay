<?php

namespace App\Http\Controllers\API\Auth;

use App\Http\Controllers\API\BaseController;
use App\Http\Utils\ValidationException;
use App\Mail\ResetPasswordEmail;
use App\Models\User;
use App\Rules\ValidPhoneNumber;
use Carbon\Carbon;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Validation\Rules;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use RobThree\Auth\TwoFactorAuth;

class ForgotPasswordController extends BaseController
{
    public function send_otp(Request $request)
    {
        $this->handleValidate($request->post(), [
            'email' => 'required_without:phone_num|email',
            'phone_num' => ['required_without:email', new ValidPhoneNumber]
        ]);

        $user = User::where('email', $request->post('email'))
            ->orWhere('phone_num', $request->post('phone_num'))
            ->first();

        if (!$user) {
            return $this->handleError('User not found');
        }
        $app = new TwoFactorAuth();
        $secret =  $app->createSecret(32);

        $expirationTime = Carbon::now()->addMinutes(15);

        $user->otp_codes()->create([
            'code' => $secret,
            'type' => 'reset_password',
            'expired_at' => $expirationTime,
        ]);

        $fullname = $user->first_name . ' ' . $user->last_name;

        Mail::to($user->email)->send(new ResetPasswordEmail($secret, $fullname, '15'));

        return $this->handleResponse([], 'Your verification code is sent to your email address');
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

        $this->check2fa($request->otp, $user);

        if ($user->update(['password' => $request->password])) {
            event(new PasswordReset($user));
            return $this->handleResponse('Votre mot de passe a été réinitialisé avec succès.');
        }
    }

    private function check2fa(string $user_otp, User $user)
    {
        if ($otp = $user->otp_codes()
            ->where(['code' => $user_otp, 'is_verified' => false])
            ->latest()
            ->first()
        ) {

            if ($otp !== null && ($otp->expired_at !== null && Carbon::parse($otp->expired_at)->lte(Carbon::now()))) {
                throw new ValidationException(json_encode('Two Factor Code is expired'));
            }

            if ($user_otp == $otp->code) {
                return;
            }
        }
        throw new ValidationException(json_encode('Invalid Two Factor Code'));
    }
}
