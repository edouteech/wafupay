<?php

namespace App\Http\Controllers\API\Auth;

use App\Http\Controllers\API\BaseController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends BaseController
{

    private array $rules = [
        'email' => 'required|email',
        'password' => 'required'
    ];

    /**
     * Login user and create a jwt token
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function login(Request $request): JsonResponse
    {
        $this->handleValidate($request->post(), $this->rules);

        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $token = $request->user()->createToken($request->email);

            return $this->handleResponse(['token' => $token->plainTextToken], 'User logged-in!');
        }
        return $this->handleError('Unauthorised.', ['error' => 'Invalid credentials'], 202);
    }


    /**
     * Verifies the user's authentication and returns a response.
     *
     * @param Request $request The incoming request.
     * @return JsonResponse A JSON response containing the user's data and a token.
     */
    public function verify(Request $request): JsonResponse
    {
        return $this->handleResponse($request->user());
    }
}
