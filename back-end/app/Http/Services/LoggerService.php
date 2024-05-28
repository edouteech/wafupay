<?php

namespace App\Http\Services;

use App\Models\User;
use Illuminate\Http\Request;

class LoggerService
{
    public const LOGIN = 'login';

    public const LOGOUT = 'logout';

    public const TRANSFER = 'transfer';

    public function saveLog(Request $request, string $type, ?User $user = null)
    {
        $user = $user ?? $request->user();
        $user->logs()->create([
            'action' => $type,
            'ip_address' => $request->ip()
        ]);
    }
}
