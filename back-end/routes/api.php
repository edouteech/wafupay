<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\CountryController;
use App\Http\Controllers\API\MyCountryController;
use App\Http\Controllers\API\WProviderController;
use App\Http\Controllers\API\Auth\LoginController;
use App\Http\Controllers\API\TransactionController;
use App\Http\Controllers\API\MyTransactionController;
use App\Http\Controllers\API\Admin\DashboardController;
use App\Http\Controllers\API\Admin\SuppliersController;
use App\Http\Controllers\API\TransactionFeesController;
use App\Http\Controllers\API\Auth\RegistrationController;
use App\Http\Controllers\API\Auth\ForgotPasswordController;
use App\Http\Controllers\API\Auth\AuthenticatedSessionController;

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
            Route::post('/', [LoginController::class, 'login'])
                ->name('token.obtain');
            Route::post('/register', [RegistrationController::class, 'register'])
                ->name('token.register');
            Route::post('/login-with-google', [LoginController::class, 'login_with_google'])
                ->name('token.google');
            Route::post('/verify-email', [RegistrationController::class, 'verifyEmailAddress'])
                ->name('token.verify.email');
            Route::post('/resend-email-token', [RegistrationController::class, 'resendEmailVerificationToken'])
                ->name('token.verify.email.resend');
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
            // Route::get('/verify', [AuthenticatedSessionController::class, 'me'])
            //     ->name('token.verify');
            Route::post('/revoke', [AuthenticatedSessionController::class, 'revoke'])
                ->name('token.revoke');
        });

        Route::post('submit-identity-card', [AuthenticatedSessionController::class, 'submit_legal_document']);

        Route::prefix('/user')->group(function () {
            Route::get('/profile', [AuthenticatedSessionController::class, 'profile'])->name('profile');
            Route::get('/dashboard', [AuthenticatedSessionController::class, 'dashboard'])->name('dashboard');
            Route::post('update-profile', [AuthenticatedSessionController::class, 'update_profile']);
        });

        // routes de transactions pour l'user
        Route::apiResource('transactions', MyTransactionController::class)->only('index', 'store', 'show',);
        Route::get('payin-status/{reference}', [MyTransactionController::class, 'payin_status']);
        Route::get('refresh-transaction/{reference}', [MyTransactionController::class, 'refresh_transaction'])->name('transaction.refresh');
        // Route::post('calculate-transaction-fees', [MyTransactionController::class, 'calculate_fees'])->name('transaction.calculateFees');
        Route::delete('delete-transaction/{transaction}', [MyTransactionController::class, 'destroyByUser'])->name('transaction.destroyYours');

        //route test de feexpay
        Route::post('/feexpay/paiment-local', [MyTransactionController::class, 'paiementLocal']);
        Route::get('/feexpay/{transactionId}', [MyTransactionController::class, 'feexpayStatus']);

        Route::apiResource('wallet-providers', WProviderController::class)->only('index');
        Route::any('update-transaction-status', [MyTransactionController::class, 'update_payin_status'])->name('transaction.updateStatus');
        Route::any('disburse', [MyTransactionController::class, 'update_payout_status'])->name('transaction.store_disburse');

        // routes des admins
        Route::middleware('admin')->prefix('admin')->group(function () {
            Route::apiResource('transactions-fees', TransactionFeesController::class);
            Route::apiResource('countries', CountryController::class)->except('index');
            Route::apiResource('wallet-providers', WProviderController::class);
            Route::apiResource('users', UserController::class);
            Route::apiResource('suppliers', SuppliersController::class);
            Route::post('activate-account/{user}', [UserController::class, 'activate']);
            Route::get('check-transaction-status/{token}/{type}', [TransactionController::class, 'check_transaction_status']);
            Route::apiResource('transactions', TransactionController::class)->except('store', 'show', 'delete');
            Route::get('dashboard', [DashboardController::class, 'index']);
        });
    });
    Route::apiResource('countries', CountryController::class)->only('index');

}));
