<?php

use App\Http\Controllers\API\AuthController;
use Illuminate\Http\Request;
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
            Route::post('obtain', [AuthController::class, 'login'])->name('token.obtain');
            Route::post('verify', [AuthController::class, 'verify'])->name('token.verify');
            Route::post('create', [AuthController::class, 'register'])->name('token.register');
        });
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::prefix('/token')->group(function () {
            Route::post('revoke', [AuthController::class, 'revoke'])->name('revoke');
        });
    });
}));
