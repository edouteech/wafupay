<?php

namespace App\Http\Controllers\API\Auth;

use App\Http\Controllers\API\BaseController;
use App\Http\Resources\User as UserResource;
use App\Mail\TwoFactor;
use App\Rules\ValidPhoneNumber;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use RobThree\Auth\TwoFactorAuth;


class AuthenticatedSessionController extends BaseController
{

    private array $rules = [
        'email' => 'required_without:phone_num|email',
        'password' => 'required',
        'two_factor' => 'string|min:7'
    ];


    /**
     * Login user and create a jwt token
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function login(Request $request): JsonResponse
    {
        $this->handleValidate($request->post(), [
            ...$this->rules,
            'phone_num' => ['required_without:email', 'unique:users', new ValidPhoneNumber],
        ]);

        $credentials = $request->only('phone_num', 'password');

        if (Auth::attempt($credentials)) {
            return $this->auth($request);
        }

        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {

            if ($request->two_factor) {
                return $this->check2fa($request);
            }

            $user = $request->user();

            if ($user->is_2fa_active) {

                $app = new TwoFactorAuth();
                $secret =  $app->createSecret(32);

                $expirationTime = Carbon::now()->addMinutes(15);

                $user->otp_codes()->create([
                    'code' => $secret,
                    'type' => '2fa',
                    'expired_at' => $expirationTime,
                ]);

                Mail::to($user->email)->send(new TwoFactor($secret, [
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name
                ]));

                return $this->handleResponse([], 'Two Factor Authentication Required, Check your mail');
            }

            return $this->auth($request);
        }
        return $this->handleError('Unauthorised.', ['error' => __('auth.failed')], 202);
    }


    /**
     * Verifies the user's authentication and returns a response.
     *
     * @param Request $request The incoming request.
     * @return JsonResponse A JSON response containing the user's data and a token.
     */
    public function verify(Request $request): JsonResponse
    {
        return $this->handleResponse(new UserResource($request->user()));
    }

    private function auth(Request $request): JsonResponse
    {
        $user = $request->user();

        $token = $user->createToken($request->email);

        $user->otp_codes()->where(['code' => $user->otp_code, 'type' => '2fa'])->update(['is_verified' => true]);

        $user->logs()->create([
            'action' => 'login',
            'ip_address' => $request->ip()
        ]);

        return $this->handleResponse(['token' => $token->plainTextToken], 'User logged-in!');
    }

    private function check2fa(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($otp = $user->otp_codes()
            ->where(['code' => $request->two_factor, 'is_verified' => false])
            ->latest()
            ->first()
        ) {

            if ($otp !== null && ($otp->expired_at !== null && Carbon::parse($otp->expired_at)->lte(Carbon::now()))) {
                return $this->handleError('Two Factor Code is expired');
            }
            return $this->auth($request);
        }
        return $this->handleError('Invalid Two Factor Code');
    }
}
