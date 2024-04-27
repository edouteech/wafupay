<?php

use App\Http\Controllers\API\Auth\AuthenticatedSessionController;
use App\Http\Controllers\API\Auth\ForgotPasswordController;
use App\Http\Controllers\API\Auth\RegistrationController;
use App\Http\Controllers\API\CountryController;
use App\Http\Controllers\API\TransactionController;
use App\Http\Controllers\API\TransactionFeesController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\WProviderController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('/check-api', function () {
    return response()->json(['message' => 'API is working']);
});

Route::prefix('/v1')->group((function () {
    Route::middleware('guest')->group(function () {
        Route::prefix('/token')->group(function () {
            Route::post('/', [AuthenticatedSessionController::class, 'login'])
                ->name('token.obtain');
            Route::post('/register', [RegistrationController::class, 'register'])
                ->name('token.register');
        });

        Route::prefix('/password')->group(function () {
            Route::post('/forgot', [ForgotPasswordController::class, 'send_otp'])
                ->name('password.forgot');
            Route::post('/reset', [ForgotPasswordController::class, 'reset_password'])
                ->name('password.reset');
        });
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::prefix('/token')->group(function () {
            Route::get('/verify', [AuthenticatedSessionController::class, 'verify'])
                ->name('token.verify');
            Route::post('/revoke', [RegistrationController::class, 'revoke'])
                ->name('token.revoke');
        });

        Route::post('submit-identity-card', [UserController::class, 'submit_card']);

        Route::middleware('admin')->group(function () {
            Route::apiResource('transactions-fees', TransactionFeesController::class);
            Route::apiResource('countries', CountryController::class)->except('index');
            Route::apiResource('wallet-providers', WProviderController::class);
            Route::apiResource('users', UserController::class);
            Route::post('activate-account/{user}', [UserController::class, 'activate']);
            Route::get('check-transaction-status/{token}', [TransactionController::class, 'checkTransactionStatus']);
            Route::apiResource('transactions', TransactionController::class)
                ->except('store', 'show', 'delete');
        });

        Route::apiResource('transactions', TransactionController::class)->only('store', 'show');
        Route::get('refresh-transaction/{payin_token}', [TransactionController::class, 'refresh_transaction'])->name('transaction.refresh');
        Route::post('calculate-transaction-fees', [TransactionController::class, 'calculate_fees'])->name('transaction.calculateFees');
        Route::delete('delete-transaction/{transaction}', [TransactionController::class, 'destroyByUser'])->name('transaction.destroyYours');
    });

    Route::apiResource('countries', CountryController::class)->only('index');
    Route::any('update-transaction-status', [TransactionController::class, 'updatePayinStatus'])->name('transaction.updateStatus');
    Route::any('disburse', [TransactionController::class, 'updatePayoutStatus'])->name('transaction.store_disburse');
}));
