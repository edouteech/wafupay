<?php

use App\Http\Controllers\API\TransactionBaseController;
use App\Models\Transaction;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/invoice', function () {
    $invoice_method = new TransactionBaseController();
    return $invoice_method->generateInvoice(92);
});
