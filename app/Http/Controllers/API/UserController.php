<?php

namespace App\Http\Controllers\API;

use App\Http\Resources\User as ResourcesUser;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = ResourcesUser::collection(User::orderByDesc('id')->get());
        return $this->handleResponse($users);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $rules = [
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
            'confirm_password' => 'required|same:password',
            'currency_id' => 'required|exists:currencies,id',
        ];

        $this->handleValidate(
            $request->post(),
            $rules
        );

        $user = User::create($request->post());

        if ($request->is_admin) {
            $user->update(['is_admin' => true]);
        }

        return $this->handleResponse(new ResourcesUser($user), "User created successfully");
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return $this->handleResponse(new ResourcesUser($user),"User retrieved successfully");
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
        return $this->handleResponse(new ResourcesUser($user), "User deleted successfully");
    }
}
