<?php

namespace App\Http\Controllers\API\Auth;

use App\Http\Controllers\API\BaseController;
use App\Http\Resources\User as UserResource;
use App\Mail\TwoFactor;
use App\Models\User;
use App\Rules\ValidPhoneNumber;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use RobThree\Auth\TwoFactorAuth;


class AuthenticatedSessionController extends BaseController
{

    /**
     * Verifies the user's authentication and returns a response.
     *
     * @param Request $request The incoming request.
     * @return JsonResponse A JSON response containing the user's data and a token.
     */
    public function me(Request $request): JsonResponse
    {
        return $this->handleResponse(new UserResource($request->user()));
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

}
