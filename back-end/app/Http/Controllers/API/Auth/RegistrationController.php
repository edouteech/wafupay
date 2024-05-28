<?php

namespace App\Http\Controllers\API\Auth;

use App\Http\Controllers\API\BaseController;
use App\Http\Resources\User as ResourcesUser;
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
        'country_id' => 'required|exists:countries,id',
        'id_card' => 'extensions:jpg,jpeg,png,bmp,gif,svg,pdf|file',
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
        $this->handleValidate($request->post(), [
            ...$this->rules,
            'phone_num' => ['required', 'unique:users', new ValidPhoneNumber],
        ]);

        try {
            $userData = $request->except('id_card');

            if ($request->hasFile('id_card')) {
                $logoPath = $request->file('id_card')->store('ID', 'public');
                $userData['id_card'] = $logoPath;
            }
            $user = User::create($userData);
            $user = new ResourcesUser($user);
            $user['token'] = $user->createToken($request->email)->plainTextToken;

            return $this->handleResponse($user, 'User successfully registered!');
        } catch (\Throwable $th) {
            return $this->handleError($th);
        }
    }
}
