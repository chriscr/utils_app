<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\MessagingController;
use App\Http\Controllers\API\CheckListController;
use App\Http\Controllers\API\PortfolioController;
use App\Http\Controllers\API\TrafficController;
use App\Http\Controllers\API\WeatherController;

use App\Http\Controllers\API\ProductController;

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
Route::get('read_users', [AdminController::class, 'read_users']);

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('forgot_password', [AuthController::class, 'forgot_password']);
Route::put('reset_password', [AuthController::class, 'reset_password']);
Route::get('logout', [AuthController::class, 'logout']);
Route::put('activate_account', [AuthController::class, 'activate_account']);
Route::put('save_password', [AuthController::class, 'save_password']);

Route::post('contact', [MessagingController::class, 'contact']);

Route::post('save_check_list', [CheckListController::class, 'save']);
Route::get('read_check_lists', [CheckListController::class, 'read']);
Route::delete('delete_check_list/{id}', [CheckListController::class, 'delete']);
Route::put('change_default_check_list/{id}', [CheckListController::class, 'change_default']);
Route::post('save_items', [CheckListController::class, 'save_items']);
Route::delete('delete_item/{id}/{checkListId}', [CheckListController::class, 'delete_item']);

Route::post('save_portfolio', [PortfolioController::class, 'save']);
Route::get('read_portfolios', [PortfolioController::class, 'read']);
Route::delete('delete_portfolio/{id}', [PortfolioController::class, 'delete']);
Route::put('change_default_portfolio/{id}', [PortfolioController::class, 'change_default']);
Route::post('save_symbols', [PortfolioController::class, 'save_symbols']);
Route::delete('delete_symbol/{id}/{symbolId}', [PortfolioController::class, 'delete_symbol']);

Route::post('save_traffic_location', [TrafficController::class, 'save']);
Route::get('read_traffic_locations', [TrafficController::class, 'read']);
Route::delete('delete_traffic_location/{id}', [TrafficController::class, 'delete']);
Route::put('change_default_traffic_location/{id}', [TrafficController::class, 'change_default']);

Route::post('save_weather_location', [WeatherController::class, 'save']);
Route::get('read_weather_locations', [WeatherController::class, 'read']);
Route::delete('delete_weather_location/{id}', [WeatherController::class, 'delete']);
Route::put('change_default_weather_location/{id}', [WeatherController::class, 'change_default']);

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
