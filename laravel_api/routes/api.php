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

Route::get('read_check_lists', [CheckListController::class, 'read_check_lists']);
Route::post('save_check_list', [CheckListController::class, 'save_check_list']);
Route::delete('delete_check_list', [CheckListController::class, 'delete_check_list']);
Route::put('change_default_check_list', [CheckListController::class, 'change_default_check_list']);
Route::post('save_check_list_items', [CheckListController::class, 'save_check_list_items']);
Route::delete('delete_check_list_items', [CheckListController::class, 'delete_check_list_items']);

Route::get('read_weather_locations', [WeatherController::class, 'read_weather_locations']);
Route::post('save_weather_location', [WeatherController::class, 'save_weather_location']);
Route::delete('delete_weather_location', [WeatherController::class, 'delete_weather_location']);
Route::put('change_default_weather_location', [WeatherController::class, 'change_default_weather_location']);

Route::get('read_traffic_locations', [TrafficController::class, 'read_traffic_locations']);
Route::post('save_traffic_location', [TrafficController::class, 'save_traffic_location']);
Route::delete('delete_traffic_location', [TrafficController::class, 'delete_traffic_location']);
Route::put('change_default_traffic_location', [TrafficController::class, 'change_default_traffic_location']);

Route::get('read_portfolios', [PortfolioController::class, 'read_portfolios']);
Route::post('save_portfolio', [PortfolioController::class, 'save_portfolio']);
Route::delete('delete_portfolio', [PortfolioController::class, 'delete_portfolio']);
Route::put('change_default_portfolio', [PortfolioController::class, 'change_default_portfolio']);
Route::post('save_portfolio_symbols', [PortfolioController::class, 'save_portfolio_symbols']);
Route::delete('delete_portfolio_symbols', [PortfolioController::class, 'delete_portfolio_symbols']);

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
