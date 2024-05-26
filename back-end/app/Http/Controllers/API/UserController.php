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

    public function submit_card(Request $request)
    {

        $this->handleValidate($request->post(), [
            'identity_card' => 'extensions:jpg,jpeg,png,bmp,gif,svg,pdf|file',
        ]);

        if ($request->hasFile('identity_card')) {
            $idPath = $request->file('identity_card')->store('ID', 'public');

            $request->user()->update(['id_card' => $idPath]);

            return $this->handleResponse("Votre carte d'identité a été reçue, veuillez patienter pendant son traitement");
        }

        return $this->handleError("Merci d'envoyer votre carte d'identité");
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
