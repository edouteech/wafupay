<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\API\BaseController as BaseController;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;


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
     * @param Request $request
     * @return JsonResponse
     */
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->post(), $this->rules);

        if ($validator->fails()) {
            return $this->handleError($validator->errors(), [], 202);
        }

        $input = $request->all();
        $input['password'] = Hash::make($input['password']);
        $user = User::create($input);
        $user['user'] = $user->createToken('LaravelSanctumAuth')->plainTextToken;

        return $this->handleResponse($user, 'User successfully registered!');
    }

    public function verify(Request $request): JsonResponse
    {
        if ($user = Auth::user()) {
            $user['token'] = $request->bearerToken();
            return $this->handleResponse($user, 'Welcome' . $user->first_name);
        }
        return $this->handleError('Unauthorised.', ['error' => 'Unauthorised'], 202);
    }

    public function revoke(Request $request): JsonResponse
    {
        $request->user()->token()->revoke();
        return $this->handleResponse([], 'User logged out!');
    }
}
