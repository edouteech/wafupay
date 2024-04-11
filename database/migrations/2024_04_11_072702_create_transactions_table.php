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
            $table->float('amount');
            $table->foreignId('sender_id')->constrained('accounts', 'id');
            $table->foreignId('receiver_id')->constrained('accounts', 'id');
            $table->foreignId('currency_id')->constrained();
            $table->enum('type', ['school_help', 'family_help', 'rent', 'others'])->default('others');
            $table->enum('status', ['pending', 'success', 'failed'])->default('pending');
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
