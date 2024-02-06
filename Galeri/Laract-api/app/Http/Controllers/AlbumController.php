<?php

namespace App\Http\Controllers;

use App\Models\Album;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AlbumController extends Controller
{
    public function index(){
        $album = DB::table('album')->join('users', 'album.user_id', '=', 'users.user_id')
        ->select('album.*', 'users.nama_lengkap')->get();
        return response()->json([
            'results'=>$album
        ],200);
    }

    public function show($album_id){
        $album = DB::table('foto')->where('album_id',$album_id)->get();

        return response()->json([
            'results' => $album
        ], 200);
    }

    public function store(Request $request){
        $album = Album::create([
            'nama_album' => $request['namaAlbum'],
            'deskripsi' => $request['deskripsiAlbum'],
            'user_id' => $request['userId'],
            'tanggal_dibuat' => $request['tanggal'],
        ]);
        return response()->json([
            'message'=> 'Data berhasil dikirim'
        ],200);
    }

    public function edit($album_id){
        $album = Album::find($album_id);
        if(!$album){
            return response()->json([
                'warning'=>"Data dengan id ini tidak diteukan"
            ],404);
        }
        return response()->json([
            'results'=>$album
        ],200);
    }

    public function update(Request $request,$album_id){
        try{
            $album = Album::find($album_id);
            if (!$album) {
                return response()->json([
                    'warning'=>"Data dengan id ini tidak ditemukan"
                ],404);
            }

            $album->nama_album = $request->nama_album;
            $album->deskripsi = $request->deskripsi;
            $album->tanggal_dibuat = $request->tanggal_dibuat;
            $album->user_id = $request->user_id;
            $album->save();

            return response()->json([
                "message"=>"Data berhasil di rubah"
            ],200);
        }catch (\Exception $e){
            return response()->json([
                'error'=>"Terjadi kesalahan"
            ],500);
        }
    }

    public function delete($album_id){
        $album = Album::find($album_id);
        $album = Album::find($album_id);
            if (!$album) {
                return response()->json([
                    'warning'=>"Data dengan id ini tidak ditemukan"
                ],404);
            }
        
            $album->delete();

            return response()->json([
                'success'=>"Data berhasil dihapus"
            ]);
    }
}
