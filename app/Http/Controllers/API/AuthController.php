<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\API\BaseController as BaseController;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends BaseController
{

    private array $rules = [
        'first_name' => 'required|string',
        'last_name' => 'required|string',
        'email' => 'required|email|unique:users',
        'phone_num' => 'required|unique:users',
        'password' => 'required|min:8',
        'confirm_password' => 'required|same:password',
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
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $auth = Auth::user();
            $success['token'] = $auth->createToken('LaravelSanctumAuth')->plainTextToken;
            $success['email'] = $auth->email;

            return $this->handleResponse($success, 'User logged-in!');
        }
        return $this->handleError('Unauthorised.', ['error' => 'Invalid credentials'], 202);
    }

    /**
     * Register a new user.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function register(Request $request): JsonResponse
    {
        $this->handleValidate($request->post(), $this->rules);

        $input['password'] = Hash::make($request->post('password'));
        $user = User::create($input);
        $user['user'] = $user->createToken('LaravelSanctumAuth')->plainTextToken;

        return $this->handleResponse($user, 'User successfully registered!');
    }

    /**
     * Verifies the user's authentication and returns a response.
     *
     * @param Request $request The incoming request.
     * @return JsonResponse A JSON response containing the user's data and a token.
     */
    public function verify(Request $request): JsonResponse
    {
        if ($user = Auth::user()) {
            $user['token'] = $request->bearerToken();
            return $this->handleResponse($user, 'Welcome' . $user->first_name);
        }
        return $this->handleError('Unauthorised.', ['error' => 'Unauthorised'], 202);
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
        return $this->handleResponse([], 'User logged out!');
    }
}
