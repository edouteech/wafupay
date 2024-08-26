<?php

namespace App\Http\Controllers\API\Admin;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->only('index');
    }

    public function index()
    {
        $transactions_success = Transaction::where(['payin_status' => 'success', 'payout_status' => 'success']);
        $transactions_amount = $transactions_success->sum('amount');
        $transactions_amount_without_fees = $transactions_success->sum('amountWithoutFees');
        $transactions_count = $transactions_success->count();

        $last_transactions = Transaction::orderBy('created_at', 'desc')->take(5)->get();

        $daily_transactions = Transaction::where('created_at', '>=', now()->subDays(7))->get();

        $daily_transactions = Transaction::where('created_at', '>=', now()->subDays(7))
            ->where(['payin_status' => 'success', 'payout_status' => 'success'])
            ->groupBy(DB::raw('DATE(created_at)'))
            ->selectRaw('DATE(created_at) as date, SUM(amount) as amount')
            ->orderBy('date')
            ->get();

        // $weekly_transactions = Transaction::where('created_at', '>=', now()->subWeeks(8))
        //     ->where(['payin_status' => 'success', 'payout_status' => 'success'])
        //     ->groupBy(DB::raw('YEAR(created_at), WEEK(created_at)'))
        //     ->selectRaw('YEAR(created_at) as year, WEEK(created_at) as week, SUM(amount) as amount')
        //     ->orderBy('year')
        //     ->orderBy('week')
        //     ->get();
        $weekly_transactions = Transaction::where('created_at', '>=', now()->subWeeks(8))
            ->where(['payin_status' => 'success', 'payout_status' => 'success'])
            ->groupBy(DB::raw('YEAR(created_at), WEEK(created_at)'))
            ->selectRaw('YEAR(created_at) as year, WEEK(created_at) as week, SUM(amount) as amount, DATE(MIN(DATE_SUB(created_at, INTERVAL WEEKDAY(created_at) DAY))) as week_start_date')
            ->orderBy('year')
            ->orderBy('week')
            ->get();



        $monthly_transactions = Transaction::where('created_at', '>=', now()->subMonths(12))
            ->where(['payin_status' => 'success', 'payout_status' => 'success'])
            ->groupBy(DB::raw('YEAR(created_at), MONTH(created_at)'))
            ->selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, SUM(amount) as amount')
            ->orderBy('year')
            ->orderBy('month')
            ->get();


        return response()->json([
            'transactions_amount' => $transactions_amount,
            'transactions_count' => $transactions_count,
            'turnover' => $transactions_amount - $transactions_amount_without_fees,
            'partners_fees' => 0,
            'brut_margin' => 0,
            'last_transactions' => $last_transactions,
            'daily_transactions' => $daily_transactions,
            'weekly_transactions' => $weekly_transactions,
            'monthly_transactions' => $monthly_transactions,
        ]);
    }
}
