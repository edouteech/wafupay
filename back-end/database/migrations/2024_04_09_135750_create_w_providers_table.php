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
        Schema::create('w_providers', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            // $table->string('withdraw_mode')->comment("The name of the means of payment point when sending");
            // $table->string('sending_mode');
            $table->boolean('with_otp')->default(false);
            $table->float('payin_fee');
            $table->float('payout_fee');
            $table->string('logo')->nullable();
            $table->foreignId('country_id')->constrained();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('w_providers');
    }
};
