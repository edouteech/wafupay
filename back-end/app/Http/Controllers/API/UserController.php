<?php

namespace App\Http\Controllers\API;

use App\Http\Resources\User as ResourcesUser;
use App\Models\User;
use App\Rules\ValidPhoneNumber;
use Illuminate\Http\Request;

class UserController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $per_page = $request->per_page ?? 10;

        $admin = User::where('is_admin', true)->get();
        $users = User::where('is_admin', false)->orderByDesc('created_at');
        if ($request->search) {
            $users = $users->where('first_name', 'like', '%' . $request->search . '%')
                ->orWhere('last_name', 'like', '%' . $request->search . '%')
                ->orWhere('first_name', 'like', '%' . $request->search . '%')
                ->orWhere('email', 'like', '%' . $request->search . '%')
                ->orWhere('phone_num', 'like', '%' . $request->search . '%');
        }
        $users = $users->paginate($per_page);
        return $this->handleResponse([
            'admins' => $admin,
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->handleValidate($request->post(), [
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|email|unique:users',
            'phone_num' => ['required', 'unique:users', new ValidPhoneNumber],
            'password' => 'required|min:8',
            'confirm_password' => 'required|same:password',
        ]);

        $user = User::create($request->post());

        if ($request->is_admin) {
            $user->update(['is_admin' => true, 'is_verified' => true]);
        }

        return $this->handleResponse(new ResourcesUser($user), "Utilisateur créé avec succès");
    }

    public function activate(Request $request, User $user)
    {

        $this->handleValidate($request->post(), [
            'activate' => 'required',
        ]);
        $activate = filter_var($request->post('activate'), FILTER_VALIDATE_BOOLEAN);

        $user->update(['is_verified' => $activate]);

        $state = "Le compte utilisateur a été" . ($activate ? 'activé' : 'désactivé');
        return $this->handleResponse(new ResourcesUser($user), $state);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return $this->handleResponse(new ResourcesUser($user), "Utilisateur récupéré avec succès");
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
        return $this->handleResponse(new ResourcesUser($user), "Utilisateur supprimé avec succès");
    }
}
