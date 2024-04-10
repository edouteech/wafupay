<?php

namespace App\Http\Controllers\API\Auth;

use App\Http\Controllers\API\BaseController;
use App\Models\User;
use App\Rules\ValidPhoneNumber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RegistrationController extends BaseController
{

    private array $rules = [
        'first_name' => 'required|string',
        'last_name' => 'required|string',
        'email' => 'required|email|unique:users',
        'password' => 'required|min:8',
        'confirm_password' => 'required|same:password',
        'country_id' => 'required|exists:countries,id',
        'currency_id' => 'required|exists:currencies,id',
    ];

    /**
     * Register a new user.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function register(Request $request): JsonResponse
    {
        $this->handleValidate(
            $request->post(),
            [
                ...$this->rules,
                ...['phone_num' => ['required', 'unique:users', new ValidPhoneNumber],]
            ]
        );

        $user = User::create($request->post());
        $user['token'] = $user->createToken($request->email)->plainTextToken;

        return $this->handleResponse($user, 'User successfully registered!');
    }

    /**
     * Revoke the user's authentication token.
     *
     * @param Request $request The incoming request.
     * @return JsonResponse A JSON response containing an empty array and a message.
     */
    public function revoke(Request $request): JsonResponse
    {
        $request->user()->token()->revoke();
        $request->user()->logs()->create([
            'action' => 'logout',
            'ip_address' => $request->ip()
        ]);
        return $this->handleResponse([], 'User logged out!');
    }
}
