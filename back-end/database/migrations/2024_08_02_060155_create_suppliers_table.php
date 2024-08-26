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
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string("name")->unique()->comment("The name of the supplier");
            $table->json("wallet_name")->comment("The name to specify providers in transactions (MTN, MOOV TG, ...)");
            $table->json("payin_fees")->comment("The fees in payin for each provider");
            $table->json("payout_fees")->comment("The fees in payout for each provider");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suppliers');
    }
};
