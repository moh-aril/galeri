<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KomentarFoto extends Model
{
    use HasFactory;
    protected $table = 'komentarfoto';
    protected $primaryKey = 'komentar_id';
    protected $guarded = [];
}
