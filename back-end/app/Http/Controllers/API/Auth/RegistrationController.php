<?php

namespace App\Http\Controllers\API\Auth;

use App\Http\Controllers\API\BaseController;
use App\Http\Resources\User as ResourcesUser;
use App\Http\Services\LoggerService;
use App\Models\User;
use App\Rules\ValidPhoneNumber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RegistrationController extends BaseController
{

    public function __construct(
        private readonly LoggerService $logger
    ) {
    }

    private array $rules = [
        'first_name' => 'required|string',
        'last_name' => 'required|string',
        'email' => 'required|email|unique:users',
        'country_id' => 'required|exists:countries,id',
        'password' => 'required|min:8',
        'confirm_password' => 'required|same:password',
    ];

    /**
     * Register a new user.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function register(Request $request): JsonResponse
    {
        $payloads = $this->handleValidate($request->post(), [
            ...$this->rules,
            'phone_num' => ['required', 'unique:users', new ValidPhoneNumber],
        ]);

        try {

            $user = User::create($payloads);

            $this->logger->saveLog($request, $this->logger::LOGIN, $user);

            $user = new ResourcesUser($user);
            $user['token'] = $user->createToken($request->email)->plainTextToken;

            return $this->handleResponse($user, 'User successfully registered!');
        } catch (\Throwable $th) {
            return $this->handleError($th);
        }
    }
}
