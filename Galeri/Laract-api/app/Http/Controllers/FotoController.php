<?php

namespace App\Http\Controllers;

use App\Models\Foto;
use App\Models\KomentarFoto;
use App\Models\LikeFoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class FotoController extends Controller
{
    public function index(){
        $foto = DB::table('foto')
        ->join('users','foto.user_id', '=','users.user_id')
        ->join('album','foto.album_id', '=', 'album.album_id')
        ->select('foto.*', 'users.user_id', 'users.nama_lengkap', 'album.nama_album')->get();
        return response()->json([
            'results' => $foto
        ],200);
    }

    public function store(Request $request){
        $lokasiFile = $request->file('lokasi_file')->store('photos', 'public');

        $photo = Foto::create([
            'lokasi_file' => $lokasiFile,
            'judul_foto' => $request->input('judulFoto'),
            'deskripsi_foto' => $request->input('deskripsiFoto'),
            'tanggal_unggah' => $request->input('tanggalUnggah'),
            'album_id' => $request->input('albumId'),
            'user_id' => $request->input('userId'),
        ]);
        return response()->json(['message' => 'Photo uploaded successfully', 'photo' => $photo], 200);
    }

    public function edit($foto_id){
        $foto = Foto::find($foto_id);
        if (!$foto) {
            response()->json([
                'message'=> 'Data dengan id ini tidak ditemukan'
            ],404);
        }
        return response()->json([
            'results' => $foto
        ],200);
    }

    public function update(Request $request,$foto_id){
        $foto = Foto::find($foto_id);

    try {
        if (!$foto) {
            return response()->json([
                'message' => "Data dengan id ini tidak ditemukan"
            ], 404);
        }

        $inputData = $request->all();

        if ($request->hasFile('lokasi_file')) {
            Storage::disk('public')->delete($foto->lokasi_file);
            $lokasiFile = $request->file('lokasi_file')->store('photos', 'public');
            $inputData['lokasi_file'] = $lokasiFile;
        }

        $foto->update($inputData);

        return response()->json([
            'message' => "Data berhasil diubah",
            'foto' => $foto
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'message' => "Something wrong",
            'error' => $e->getMessage()
        ], 500);
    }
    }

    public function delete($foto_id){
        $foto = Foto::find($foto_id);
        if(!$foto){
            response()->json([
                'message'=> 'Data tidak ditemukan'
            ],404);
        }

        Storage::disk('public')->delete($foto->lokasi_file);
        $foto->delete();
        return response()->json([
            'message'=> 'Data berhasil di hapus'
        ],200);
    }

    public function newFoto(){
        $new_foto = DB::table('foto')->latest()->limit(5)->get();
        return response()->json($new_foto);
    }

    public function filterFoto(Request $request){
        $filter = $request->query('filter');
        $foto = LikeFoto::query();
        $komentar = KomentarFoto::query();
    
        if ($filter === 'most-like') {
            $foto->select('foto_id', DB::raw('COUNT(*) as like_count'))
                ->groupBy('foto_id')
                ->orderByDesc('like_count');
        } elseif ($filter === 'most-comment') {
            $komentar->select('foto_id', DB::raw('COUNT(*) as comment_count'))
                ->groupBy('foto_id')
                ->orderByDesc('comment_count');
        } elseif ($filter === 'newed') {
            $foto->latest();
        }

        $combinedQuery = $foto->unionAll($komentar);
        $filteredFoto = $combinedQuery->get();
    
        return response()->json(['results' => $filteredFoto]);
    }

    public function countLike($fotoId)
{
    $likeCount = LikeFoto::where('foto_id', $fotoId)->count();

    $isLikedByUser = auth()->check() ? LikeFoto::where('foto_id', $fotoId)->where('user_id', auth()->user()->id)->exists() : false;
    return response()->json([
        'count' => $likeCount,
        'isLikedByUser' => $isLikedByUser,
    ]);
}

}
