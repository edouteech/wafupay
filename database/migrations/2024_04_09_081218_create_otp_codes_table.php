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
        Schema::create('otp_codes', function (Blueprint $table) {
            $table->id();
            $table->string('code');
            $table->enum('type', ['2fa', 'reset_password']);
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->boolean('is_verified')->default(false);
            $table->timestamps();
            $table->dateTime('expired_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('otp_codes');
    }
};
