<?php

use App\Http\Controllers\API\Auth\AuthenticatedSessionController;
use App\Http\Controllers\API\Auth\RegistrationController;
use App\Http\Controllers\API\CountryController;
use App\Http\Controllers\API\CurrencyController;
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

Route::prefix('/v1')->group((function () {
    Route::middleware('guest')->group(function () {
        Route::prefix('/token')->group(function () {
            Route::post('/', [AuthenticatedSessionController::class, 'login'])->name('token.obtain');
            Route::post('/register', [RegistrationController::class, 'register'])->name('token.register');
        });
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::prefix('/token')->group(function () {
            Route::get('/verify', [AuthenticatedSessionController::class, 'verify'])->name('token.verify');
            Route::post('/revoke', [RegistrationController::class, 'revoke'])->name('token.revoke');
        });

        Route::middleware('admin')->group(function () {
            Route::apiResource('transactions-fees', TransactionFeesController::class);
            Route::apiResource('countries', CountryController::class);
            Route::apiResource('wallet-providers', WProviderController::class);
            Route::apiResource('users', UserController::class);
            Route::post('activate-account/{user}', [UserController::class, 'activate']);
            Route::apiResource('transactions', TransactionController::class)->except('store', 'show');
        });

        Route::apiResource('transactions', TransactionController::class)->only('store', 'show');
    });
}));
