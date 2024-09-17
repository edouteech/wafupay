<?php

namespace App\Http\Controllers\API\Auth;

use App\Http\Controllers\API\BaseController;
use App\Http\Resources\User as UserResource;
use App\Http\Services\LoggerService;
use App\Http\Services\TwoFactorService;
use App\Models\OtpCode;
use App\Models\User;
use App\Rules\ValidPhoneNumber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class LoginController extends BaseController
{

    private array $rules = [
        'email' => 'required_without:phone_num|email',
        'password' => 'required',
        'two_factor' => 'string|min:7'
    ];

    public function __construct(
        public readonly LoggerService $logger,
        private readonly TwoFactorService $twoFactorService,
    ) {
    }


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
                ['error' => 'Votre compte est inactif, veuillez confirmer votre adresse email ou contacter le support']
            );

            if ($request->two_factor) {
                return $this->check2fa($request);
            }

            if ($user->is_2fa_active) {
                return $this->twoFactorService->send2FAToken($user);
            }

            return $this->auth($request);
        }
        return $this->handleError('Unauthorised.', ['error' => 'Vos identifiants de connexion sont invalides']);
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

        $this->logger->saveLog($request, $this->logger::LOGIN, $user);

        $user = new UserResource($user);
        $user['token'] = $user->createToken($request->email)->plainTextToken;

        return $this->handleResponse($user, 'User successfully registered or login!');
    }


    private function auth(Request $request): JsonResponse
    {
        $user = $request->user();

        $token = $user->createToken(isset($request->email) ? $request->email : $request->phone_num);

        $this->twoFactorService->markVerified($user);

        $this->logger->saveLog($request, $this->logger::LOGIN);

        $data = [
            "token" => $token->plainTextToken,
            "id" => $user->id,
            "first_name" => $user->first_name,
            "last_name" => $user->last_name,
            "email" => $user->email,
            "phone_num" => $user->phone_num,
            "avatar" => $user->avatar,
            "id_card" => $user->id_card,
            "country_id" => $user->country_id,
            "is_verified" => $user->is_verified,
            "is_admin" => $user->is_admin,
        ];
        // return $this->handleResponse(['token' => $token->plainTextToken], 'User logged-in!');
        return $this->handleResponse($data, 'User logged-in!');
    }

    private function check2fa(Request $request): JsonResponse
    {
        $user = $request->user();

        $checkedStatus = $this->twoFactorService->checkToken($user, $request->two_factor);

        if (!$checkedStatus instanceof JsonResponse) {
            return $this->auth($request);
        }
        return $checkedStatus;
    }
}
