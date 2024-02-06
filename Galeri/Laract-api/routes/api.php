<?php

use App\Http\Controllers\AlbumController;
use App\Http\Controllers\FotoController;
use App\Http\Controllers\KomentarfotoController;
use App\Http\Controllers\LikefotoController;
use App\Http\Controllers\SessionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/users/get-user-id/{user_id}', [SessionController::class, 'getUser']);
Route::post('/users/login-user', [SessionController::class, 'login']);
Route::post('/users/logout-user', [SessionController::class, 'logout']);
Route::middleware('auth:api')->get('/users/user', [SessionController::class, 'user']);

Route::get('/users/get-data', [SessionController::class, 'index']);
Route::get('/users/get-foto-user/{user_id}', [SessionController::class, 'profile']);
Route::get('/users/get-id-user/{user_id}', [SessionController::class, 'getId']);
Route::get('/users/edit-id/{user_id}', [SessionController::class, 'edit']);
Route::post('/users/update/{user_id}', [SessionController::class, 'update']);
Route::post('/users/register/store', [SessionController::class, 'store']);
Route::post('/get-user-details', [SessionController::class, 'getUserDetails']);
Route::delete('/users/delete-data/{user_id}', [SessionController::class, 'delete']);

Route::controller(FotoController::class)->group(function () {
    Route::get('/get-data/foto', 'index');
    Route::get('/new-foto/slider', 'newFoto');
    Route::get('/foto/select', 'filterFoto');
    Route::get('/get-data/get-id-foto/{foto_id}', 'edit');
    Route::post('/upload/foto-proses', 'store');
    Route::post('/foto/update/{foto_id}', 'update');
    Route::delete('/delete/delete-foto/{foto_id}', 'delete');
});

Route::controller(AlbumController::class)->group(function () {
    Route::get('/album/get-data', 'index');
    Route::get('/album/watch/{album_id}', 'show');
    Route::get('/album/edit-data/{album_id}', 'edit');
    Route::put('/album/edit-post/{album_id}', 'update');
    Route::post('/album/store', 'store');
    Route::delete('/album/delete-data/{album_id}', 'delete');
});

Route::get('/get-data/komentar', [KomentarfotoController::class, 'index']);
Route::post('/komentar/post-komentar', [KomentarfotoController::class, 'store']);

Route::controller(LikefotoController::class)->group(function () {
    Route::get('/like/get-liked-foto', 'index');
    Route::get('/most/{fotoId}/like', 'countLike');
    Route::post('/like/post-like', 'store');
});
