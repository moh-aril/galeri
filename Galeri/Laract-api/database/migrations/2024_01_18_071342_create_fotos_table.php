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
        Schema::create('foto', function (Blueprint $table) {
            $table->integer('foto_id')->autoIncrement();
            $table->string('judul_foto');
            $table->text('deskripsi_foto');
            $table->date('tanggal_unggah');
            $table->string('lokasi_file');
            $table->integer('album_id');
            $table->integer('user_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fotos');
    }
};
