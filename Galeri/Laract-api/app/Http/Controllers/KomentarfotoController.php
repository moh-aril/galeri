<?php

namespace App\Http\Controllers;

use App\Models\KomentarFoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class KomentarfotoController extends Controller
{
    public function index(){
        $komentar = DB::table('komentarfoto')
        ->join('users', 'komentarfoto.user_id','=', 'users.user_id')
        ->join('foto', 'komentarfoto.foto_id', '=', 'foto.foto_id')
        ->select('komentarfoto.*', 'users.nama_lengkap', 'users.profil_foto', 'foto.judul_foto')->get();
        return response()->json([
            'results'=>$komentar
        ],200);
    }

    public function store(Request $request){
        $komentar = new KomentarFoto();
        $komentar->foto_id = $request->foto_id;
        $komentar->isi_komentar = $request->isi_komentar;
        $komentar->user_id = $request->user_id;
        $komentar->tanggal_komentar = $request->tanggal_komentar;
        $komentar->save();

        return response()->json([
            'success'=>"Data berhasil disimpan"
        ],200);
    }
}
