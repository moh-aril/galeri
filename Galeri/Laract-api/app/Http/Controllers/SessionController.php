<?php

namespace App\Http\Controllers;

use App\Models\Foto;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;

class SessionController extends Controller
{
    public function index()
    {
        $user = User::all();
        return response()->json([
            'results' => $user
        ], 200);
    }

    public function getUser($user_id){
        try {
            $user = User::find($user_id);

            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            return response()->json($user, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'profil_foto' => 'required|image|mimes:jpeg,png,jpg,gif',
            'username' => 'required|string',
            'password' => 'required|string|min:6',
            'email' => 'required|email|unique:users',
            'nama_lengkap' => 'required|string',
            'alamat' => 'required|string',
        ]);

        try {
            $lokasiFile = $request->file('profil_foto')->store('profile', 'public');

            $user = User::create([
                'profil_foto' => $lokasiFile,
                'username' => $validatedData['username'],
                'email' => $validatedData['email'],
                'password' => bcrypt($validatedData['password']),
                'nama_lengkap' => $validatedData['nama_lengkap'],
                'alamat' => $validatedData['alamat'],
            ]);
    
            return response()->json([
                'message' => $user,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'User gagal ditambahkan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $credentials = $request->only('username', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            return response()->json(['user' => $user], 200);
        }

        return response()->json(['error' => 'Unauthorized'], 401);
    }
    public function logout()
    {
        Auth::logout();
        return response()->json(['message' => 'Logout successful']);
    }

    public function user()
    {
        $user = Auth::user();
        return response()->json(['username' => $user->username]);
    }

    public function edit($user_id)
    {
        $user = User::find($user_id);
        if (!$user) {
            return response()->json([
                'message' => 'not found.'
            ], 404);
        }
        return response()->json([
            'results' => $user
        ], 200);
    }

    public function update(Request $request, $user_id)
    {
        try {
            $user = User::find($user_id);
            if (!$user) {
                return response()->json([
                    'message' => 'User tidak ditemukan'
                ], 404);
            }

            if ($request->hasFile('profil_foto')) {
                Storage::disk('public')->delete($user->profil_foto);
                $lokasiFile = $request->file('profil_foto')->store('profile', 'public');
                $user->profil_foto = $lokasiFile;
            }

            $user->nama_lengkap = $request->nama_lengkap;
            $user->username = $request->username;
            $user->email = $request->email;
            $user->alamat = $request->alamat;
            $user->save();

            return response()->json([
                'message' => 'Berhasil merubah data'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e
            ], 500);
        }
    }

    public function delete($user_id)
    {
        $user = User::find($user_id);
        if (!$user) {
            return response()->json([
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        Storage::disk('public')->delete($user->profil_foto);
        $user->delete();
        return response()->json([
            'message' => 'User berhasil dihapus'
        ], 200);
    }

    public function getId($user_id){
        try{
            $user = User::find($user_id);
            if (!$user) {
                return response()->json(['message', 'user dengan id ini tidak ditemukan'],200);
            }

            return response()->json($user);
        }catch (\Exception $e){
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getUserDetails(Request $request)
{
    $userIds = $request->input('userIds', []);
    $users = User::whereIn('user_id', $userIds)->get(['user_id', 'profil_foto']);

    $userDetails = $users->keyBy('user_id')->map(function ($user) {
        return [
            'profil_foto' => $user->profil_foto,
        ];
    });

    return response()->json($userDetails);
}

public function profile($user_id){
    $profile = DB::table('foto')->where('user_id',$user_id)->get();

    return response()->json([
        'results' => $profile
    ], 200);
}
}
