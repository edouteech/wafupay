<?php

namespace App\Http\Controllers\API\Auth;

use App\Http\Controllers\API\BaseController;
use App\Http\Resources\User as UserResource;
use App\Mail\TwoFactor;
use App\Models\User;
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
            'phone_num' => ['required_without:email', new ValidPhoneNumber],
        ]);

        $credentialsWithPhone = $request->only('phone_num', 'password');

        $credentialsWithEmail = $request->only('email', 'password');

        if (Auth::attempt($credentialsWithPhone) || Auth::attempt($credentialsWithEmail)) {

            $user = $request->user();

            if (!$user->is_active) return $this->handleError(
                "Unauthorized action",
                ['error' => 'Votre compte a été suspendu, veuillez ecrire au support technique'],
            );

            if ($request->two_factor) {
                return $this->check2fa($request);
            }

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

                return $this->handleResponse([], 'Authentification à deux facteurs requise, vérifiez votre courrier');
            }

            return $this->auth($request);
        }
        return $this->handleError('Unauthorised.', ['error' => 'Vos identifiant de connexion sont invalides']);
    }

    public function login_with_google(Request $request)
    {
        $this->handleValidate($request->post(), [
            'email' => 'required|email',
            'first_name' => 'required',
            'last_name' => 'required',
            'googleId' => 'required',
        ]);

        $user = User::updateOrCreate([
            'email' => $request->email,
        ], [
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'password' => $request->googleId,
            'avatar' => $request->avatar,
        ]);

        $user = new UserResource($user);
        $user['token'] = $user->createToken($request->email)->plainTextToken;
        return $this->handleResponse($user, 'User successfully registered or login!');
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

        $token = $user->createToken(isset($request->email) ? $request->email : $request->phone_num);

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
                return $this->handleError('Le code à deux facteurs est expiré');
            }
            return $this->auth($request);
        }
        return $this->handleError('Code à deux facteurs invalide');
    }
}
