<?php

namespace App\Http\Controllers\API\Auth;

use App\Http\Controllers\API\BaseController;
use App\Http\Resources\User as ResourcesUser;
use App\Http\Services\LoggerService;
use App\Http\Services\TwoFactorService;
use App\Models\OtpCode;
use App\Models\User;
use App\Rules\ValidPhoneNumber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RegistrationController extends BaseController
{

    public function __construct(
        private readonly LoggerService $logger,
        private readonly TwoFactorService $twoFactorService,
    ) {
    }

    private array $rules = [
        'first_name' => 'required|string',
        'last_name' => 'required|string',
        'email' => 'required|email|unique:users',
        'country_id' => 'required|exists:countries,id',
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
        $payloads = $this->handleValidate($request->post(), [
            ...$this->rules,
            'phone_num' => ['required', 'unique:users', new ValidPhoneNumber],
        ]);

        $user = new User($payloads);
        // remove the + at start of phone_num if exists
        if (substr($user->phone_num, 0, 1) == '+') {
            $user->phone_num = substr($user->phone_num, 1);
        }
        $user->is_active = false;
        $user->is_verified = false;
        $user->save();
        return $this->twoFactorService->sendEmailVerificationToken($user);
    }

    public function resendEmailVerificationToken(Request $request)
    {
        $this->handleValidate($request->post(), [
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->post('email'))
            ->firstOrFail();

        return $this->twoFactorService->sendEmailVerificationToken($user);
    }

    /**
     * Verify the user's email address.
     *
     * @param Request $request
     * @return JsonResponse
     * @throws \LogicException
     */

    public function verifyEmailAddress(Request $request)
    {
        $this->handleValidate($request->post(), [
            'token' => ['required'],
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $request->post('email'))
            ->firstOrFail();

        $checkedStatus = $this->twoFactorService->checkToken($user, $request->token, OtpCode::EmailVerificationTYPE);

        if (!$checkedStatus instanceof JsonResponse) {
            $this->twoFactorService->markVerified($user, OtpCode::EmailVerificationTYPE);
            $this->logger->saveLog($request, $this->logger::LOGIN, $user);
            $user->update(['email_verified_at' => new \DateTime()]);

            $user = new ResourcesUser($user);
            $user['token'] = $user->createToken($request->email)->plainTextToken;

            return $this->handleResponse($user, 'User successfully registered!');
        }

        return $checkedStatus;
    }
}
