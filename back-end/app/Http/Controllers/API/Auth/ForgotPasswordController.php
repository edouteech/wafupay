<?php

namespace App\Http\Controllers\API\Auth;

use App\Http\Controllers\API\BaseController;
use App\Http\Resources\User;
use App\Mail\ResetPasswordEmail;
use App\Rules\ValidPhoneNumber;
use Carbon\Carbon;
use Illuminate\Http\Client\Request;
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
}
