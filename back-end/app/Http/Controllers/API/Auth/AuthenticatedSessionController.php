<?php

namespace App\Http\Controllers\API\Auth;

use App\Http\Controllers\API\BaseController;
use App\Http\Resources\User as UserResource;
use App\Http\Services\LoggerService;
use App\Rules\ValidPhoneNumber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;


class AuthenticatedSessionController extends BaseController
{

    /**
     * Verifies the user's authentication and returns a response.
     *
     * @param Request $request The incoming request.
     * @return JsonResponse A JSON response containing the user's data and a token.
     */
    public function profile(Request $request): JsonResponse
    {
        return $this->handleResponse(new UserResource($request->user()));
    }

    public function submit_legal_document(Request $request)
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

    public function update_profile(Request $request)
    {
        $this->handleValidate($request->post(), [
            'first_name' => 'required',
            'last_name' => 'required',
            'phone_number' => ['required', new ValidPhoneNumber()],
            'email' => 'required',
            'country_id' => 'required|exists:countries,id',
        ]);

        $request->user()->update([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'phone_number' => $request->phone_number,
            'email' => $request->email,
            'country_id'=>$request->country_id,
        ]);

        return $this->handleResponse("Votre profil a été mis à jour avec succès");
    }

    /**
     * Revoke the user's authentication token.
     *
     * @param Request $request The incoming request.
     * @return JsonResponse A JSON response containing an empty array and a message.
     */
    public function revoke(
        Request $request,
        LoggerService $logger
    ): JsonResponse {

        $logger->saveLog($request, $logger::LOGOUT);

        $token = $request->user()->currentAccessToken();

        if ($token) {
            $token->delete();
        }

        return $this->handleResponse([], 'User logged out!');
    }
}
