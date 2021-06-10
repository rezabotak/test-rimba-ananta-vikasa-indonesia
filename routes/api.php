<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\SaleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/customers/load-list', [CustomerController::class, 'loadAll']);
Route::resource('/customers', CustomerController::class);

Route::get('/items/load-list', [ItemController::class, 'loadAll']);
Route::resource('/items', ItemController::class);

Route::resource('/sales', SaleController::class);
