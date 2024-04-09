<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Utils\ValidationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class BaseController extends Controller
{
    /**
     * Handle successful responses.
     *
     * @param mixed $result The result data.
     * @param string $msg The message.
     * @return JsonResponse The JSON response.
     */
    public function handleResponse($result, $msg = null): JsonResponse
    {
        $res = [
            'success' => true,
            'data' => $result,
            'message' => $msg,
        ];
        return response()->json($res, 200);
    }

    /**
     * Handle error responses.
     *
     * @param string $error The error message.
     * @param array $errorMsg Additional error data.
     * @param int $code The HTTP status code.
     * @return JsonResponse The JSON response.
     */
    public function handleError($error, $errorMsg = [], $code = 404): JsonResponse
    {
        $res = [
            'success' => false,
            'message' => $error,
        ];
        if (!empty($errorMsg)) {
            $res['data'] = $errorMsg;
        }
        return response()->json($res, $code);
    }

    /**
     * Validate data against provided rules.
     * Throws ValidationException if validation fails.
     *
     * @param array $data The data to be validated.
     * @param array $rules The validation rules.
     * @return JsonResponse|null Returns null on successful validation or throws ValidationException on failure.
     * @throws ValidationException If validation fails.
     */
    public function handleValidate(array $data, array $rules): JsonResponse | null
    {
        $validator = Validator::make($data, $rules);

        if ($validator->fails()) {
            throw new ValidationException($validator->errors());
        }
        return null;
    }
}
