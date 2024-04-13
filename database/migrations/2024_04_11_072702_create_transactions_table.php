<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->string('payin_phone_number');
            $table->foreignId('payin_wprovider_id')->constrained('w_providers', 'id');
            $table->enum('payin_status', ['pending', 'success', 'failed'])->default('pending');
            $table->string('payout_phone_number');
            $table->foreignId('payout_wprovider_id')->constrained('w_providers', 'id');
            $table->enum('payout_status', ['pending', 'success', 'failed'])->default('pending');
            $table->float('amount');
            $table->enum('type', ['school_help', 'family_help', 'rent', 'others'])->default('others');
            $table->string('token')->nullable();
            $table->string('disburse_token')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
