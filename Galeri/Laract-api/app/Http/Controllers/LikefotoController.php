<?php

namespace App\Http\Controllers;

use App\Models\Foto;
use App\Models\LikeFoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class LikefotoController extends Controller
{
   public function index($user_id){
    $likedPhotos = LikeFoto::where('user_id', $user_id)->pluck('foto_id')->toArray();

    return response()->json([
        'likedPhotos' => $likedPhotos,
        'totalLike' => count($likedPhotos),
    ]);
}

public function postLike(Request $request)
{
    $photoId = $request->input('photoId');
    $userId = auth()->user()->id;

    // Check if the user has already liked the photo
    $existingLike = LikeFoto::where('foto_id', $photoId)->where('user_id', $userId)->first();

    if ($existingLike) {
        $existingLike->delete();
        $liked = false;
    } else {
        LikeFoto::create(['foto_id' => $photoId, 'user_id' => $userId]);
        $liked = true;
    }

    // Return the updated like status to the frontend
    return response()->json(['liked' => $liked]);
}


    public function store(Request $request){
        $user_id = $request->input('user_id');
        $photoId = $request->input('photoId');
    
        $existingLike = LikeFoto::where('user_id', $user_id)
                                 ->where('foto_id', $photoId)
                                 ->first();
    
        if ($existingLike) {
            $existingLike->delete();
    
            return response()->json(['liked' => false]);
        }

        $like = LikeFoto::create([
            'user_id' => $user_id,
            'foto_id' => $photoId,
            'tanggal_like' => now(),
        ]);
    
        return response()->json(['liked' => true, 'like' => $like], 200);
    }

    public function countLike($fotoId){
        $likeCount = LikeFoto::where('foto_id', $fotoId)->count();

        $isLikedByUser = auth()->check() ? LikeFoto::where('foto_id', $fotoId)->where('user_id', auth()->user()->id)->exists() : false;
        return response()->json([
            'count' => $likeCount,
            'isLikedByUser' => $isLikedByUser,
        ]);
    }   
}
