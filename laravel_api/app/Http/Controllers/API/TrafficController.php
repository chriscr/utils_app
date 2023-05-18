<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Response;
use App\Models\Location;
use App\Libraries\RandomGenerator;
use App\Libraries\TrafficAPI;
use App\Libraries\GlobalData;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

use Exception;
use Exception as BaseException;

use DateTime;

class TrafficController extends Controller{
    
    public function save(Request $request){
        
        $json_data = [];
        
        if (Auth::check()) {
            
            $new_location = null;
            if($request->new_location){
                $new_location = $request->new_location;
            }
            
            $radius_miles = null;
            $radius_meters = null;
            if($request->radius){
                $radius_miles = intval($request->radius);
                $radius_meters = 1609.34 * $radius_miles;
            }
            
            $user_locations = Location::where('user_id', Auth::id())->where('component', 'traffic')->orderBy('order', 'asc')->get();
            
            $trafficAPI = new TrafficAPI;
            
            $traffic_incident_data = null;
            $traffic_location_data = null;
            $traffic_api_message = null;
            if(empty($user_locations) || sizeof($user_locations) == 0){//first location to save, get all data
                
                try {
                    //json decoded already
                    $traffic_incident_data = $trafficAPI->getTrafficIncidentData($new_location, $radius_meters);
                    
                    // Check if the Geocoding API returned an error
                    if ($traffic_incident_data === false) {
                        throw new BaseException('Error: API call failed.');
                    }
                    
                    if (!$traffic_incident_data || empty($traffic_incident_data)) {
                        throw new BaseException('Error: Empty response from API.');
                    }
                    
                    if(isset($traffic_incident_data['error'])){
                        throw new BaseException('Error: '.$traffic_incident_data['error']);
                    }
                    
                    if($traffic_incident_data['info']['statuscode'] === 400){//OK
                        throw new BaseException('Error: '.$traffic_incident_data['info']['messages'][0]);
                    }
                } catch (Exception $e) {
                    
                    // Handle API errors
                    $traffic_api_message = $e->getMessage();
                    $traffic_incident_data = null;
                }
                
                $this->convert_formats($traffic_incident_data);
            }else{//just check location from api to save to app DB
                
                try {
                    //json decoded already
                    $traffic_location_data = $trafficAPI->getTrafficLocation($new_location);
                    
                    // Check if the Geocoding API returned an error
                    if ($traffic_location_data === false) {
                        throw new BaseException('Error: API call failed.');
                    }
                    
                    if (!$traffic_location_data || empty($traffic_location_data)) {
                        throw new BaseException('Error: Empty response from API.');
                    }
                    
                    if($traffic_location_data['info']['statuscode'] === 400){//OK
                        throw new BaseException('Error: '.$traffic_location_data['info']['messages'][0]);
                    }
                    
                    if($traffic_location_data['info']['statuscode'] === 0
                        && $traffic_location_data['results'][0]['locations'][0]['adminArea5'] === ''
                        && $traffic_location_data['results'][0]['locations'][0]['adminArea4'] === ''
                        && $traffic_location_data['results'][0]['locations'][0]['adminArea3'] === ''){
                            throw new BaseException('Error: Location does not exist');
                    }
                } catch (Exception $e) {
                    
                    // Handle API errors
                    $traffic_api_message = $e->getMessage();
                    $traffic_location_data = null;
                }
            }
            
            $traffic_locations = null;
            
            if($new_location &&
            ($traffic_incident_data || $traffic_location_data)){
                
                //unique random ID
                $randomGenerator = new RandomGenerator;
                $prefix = '';
                $suffix = date("mdY").'_mem_tl_'.substr(strtolower(trim($new_location)), 0, 2);
                $random_id = $randomGenerator->generate(10,$prefix,$suffix,'_');
                
                if($traffic_incident_data){
                    $location_name = $traffic_incident_data['location']['city'].' '.$traffic_incident_data['location']['state'];
                }else if($traffic_location_data){
                    $location_name = $traffic_location_data['results'][0]['locations'][0]['adminArea5'].' '.$traffic_location_data['results'][0]['locations'][0]['adminArea3'];
                }
                
                $location_data = null;
                if(!$user_locations || sizeof($user_locations) == 0){//first location to save, set to defaul
                    $location_data = array(
                        'user_id'=>Auth::id(),
                        'name'=>$location_name,
                        'component'=>'traffic',
                        'default'=>true,
                        'radius'=>$radius_miles,
                        'order'=>1,
                        'random_id'=>$random_id
                    );
                }else{
                    $location_data = array(
                        'user_id'=>Auth::id(),
                        'name'=>$location_name,
                        'component'=>'traffic',
                        'default'=>false,
                        'radius'=>$radius_miles,
                        'order'=>1,
                        'random_id'=>$random_id
                    );
                }
                
                $location_db = Location::create($location_data);
                
                $traffic_locations = Location::where('user_id', Auth::id())->where('component', 'traffic')->orderBy('order', 'asc')->get();
            
                $json_data = [
                    'status'=>Response::HTTP_OK,
                    'status_message'=> Response::$statusMessages[Response::HTTP_OK],
                    'message' => 'Created location',
                    'locations' => $traffic_locations,
                    'new_location' => $new_location,
                    'traffic_incident_data' => $traffic_incident_data
                ];
                
            }else{
                
                $json_data = [
                    'status'=>Response::HTTP_UNPROCESSABLE_ENTITY,
                    'status_message'=> Response::$statusMessages[Response::HTTP_UNPROCESSABLE_ENTITY],
                    'message' => $traffic_api_message,
                    'locations' => $traffic_locations,
                    'new_location' => $new_location,
                    'traffic_incident_data' => $traffic_incident_data
                ];
            }
        }else{
            $json_data = [
                'status'=>Response::HTTP_UNAUTHORIZED,
                'status_message'=> Response::$statusMessages[Response::HTTP_UNAUTHORIZED],
                'message'=>'Invalid Credentials.',
            ];
        }
        
        return response()->json($json_data);
    }//end save traffic location
    
    public function read(Request $request){
        
        $json_data = [];
        
        if (Auth::check()) {
            
            $traffic_locations = Location::where('user_id', Auth::id())->where('component', 'traffic')->orderBy('order', 'asc')->get();
            $traffic_incident_data = null;
            $traffic_api_message = null;
            
            if($traffic_locations && sizeof($traffic_locations) > 0){
                
                $default_location = null;
                foreach($traffic_locations as $location){
                    if($location->default){
                        $default_location = $location;
                        break;
                    }
                }
                
                if($default_location){
                    
                    $default_location_radius = 1609.34 * $default_location->radius;
                    
                    $trafficAPI = new TrafficAPI;
                    
                    try {
                        //json decoded already
                        $traffic_incident_data = $trafficAPI->getTrafficIncidentData($default_location->name, $default_location_radius);
                        
                        $traffic_incident_data = $this->convert_formats($traffic_incident_data);
                        
                        // Check if the Geocoding API returned an error
                        if ($traffic_incident_data === false) {
                            throw new BaseException('Error: API call failed.');
                        }
                        
                        if (!$traffic_incident_data || empty($traffic_incident_data)) {
                            throw new BaseException('Error: Empty response from API.');
                        }
                        
                        if(isset($traffic_incident_data['error'])){
                            throw new BaseException('Error: '.$traffic_incident_data['error']);
                        }
                        
                        if($traffic_incident_data['info']['statuscode'] === 400){//OK
                            throw new BaseException('Error: '.$traffic_incident_data['info']['messages'][0]);
                        }
                    } catch (Exception $e) {
                        
                        // Handle API errors
                        $traffic_api_message = $e->getMessage();
                        $traffic_incident_data = null;
                    }
                }
                
                $json_data = [
                    'status'=>Response::HTTP_OK,
                    'status_message'=> Response::$statusMessages[Response::HTTP_OK],
                    'message' => 'Retrieved locations',
                    'locations' => $traffic_locations,
                    'traffic_incident_data' => $traffic_incident_data
                ];
            }else{
                $json_data = [
                    'status'=>Response::HTTP_UNPROCESSABLE_ENTITY,
                    'status_message'=> Response::$statusMessages[Response::HTTP_UNPROCESSABLE_ENTITY],
                    'message' => $traffic_api_message,
                    'locations' => $traffic_locations,
                    'traffic_incident_data' => $traffic_incident_data
                ];
            }
        }else{
            $json_data = [
                'status'=>Response::HTTP_UNAUTHORIZED,
                'status_message'=> Response::$statusMessages[Response::HTTP_UNAUTHORIZED],
                'message'=>'Invalid Credentials.',
            ];
        }
        
        return response()->json($json_data);
    }//end read traffic locations
    
    public function delete($location_random_id){
        
        $json_data = [];
        
        if (Auth::check()) {
            
            $traffic_location_to_delete = null;
            $location_random_id = null;
            $delete_result = null;
            if($location_random_id){
                $traffic_location_to_delete = Location::where('random_id', $location_random_id)->get()->first();
                Log::debug('traffic_location_to_delete random_id: '.$traffic_location_to_delete->random_id);
                $delete_result = Location::where('random_id', $location_random_id)->delete();
            }
            
            $traffic_locations = null;
            $traffic_incident_data = null;
            $traffic_api_message = null;
            
            if($delete_result > 0){
                
                //find new default if default was deleted
                if($traffic_location_to_delete->default == true){
                    
                    $location_name = null;
                    
                    $traffic_locations = Location::where('user_id', Auth::id())->where('component', 'traffic')->orderBy('order', 'asc')->get();
                    
                    if(sizeof($traffic_locations) > 0){
                        
                        $location_name = null;
                        $location_radius = null;
                        
                        foreach($traffic_locations as $location){
                            $location->default = true;
                            $location->save();
                            $location_name = $location->name;
                            $location_radius = 1609.34 * $location->radius;
                            break;
                        }
                        
                        if($location_name){
                            
                            $trafficAPI = new TrafficAPI;
                            
                            try {
                                //json decoded already
                                $traffic_incident_data = $trafficAPI->getTrafficIncidentData($location_name, $location_radius);
                                
                                // Check if the Geocoding API returned an error
                                if ($traffic_incident_data === false) {
                                    throw new BaseException('Error: API call failed.');
                                }
                                
                                if (!$traffic_incident_data || empty($traffic_incident_data)) {
                                    throw new BaseException('Error: Empty response from API.');
                                }
                                
                                if(isset($traffic_incident_data['error'])){
                                    throw new BaseException('Error: '.$traffic_incident_data['error']);
                                }
                                
                                if($traffic_incident_data['info']['statuscode'] === 400){//OK
                                    throw new BaseException('Error: '.$traffic_incident_data['info']['messages'][0]);
                                }
                            } catch (Exception $e) {
                                
                                // Handle API errors
                                $traffic_api_message = $e->getMessage();
                                $traffic_incident_data = null;
                            }
                            
                            $this->convert_formats($traffic_incident_data);
                        }
                    }
                }
                
                $json_data = [
                    'status'=>Response::HTTP_OK,
                    'status_message'=> Response::$statusMessages[Response::HTTP_OK],
                    'message' => 'Deleted location',
                    'locations' => $traffic_locations,
                    'location_random_id' => $location_random_id,
                    'traffic_incident_data' => $traffic_incident_data
                ];
            }else{
                $json_data = [
                    'status'=>Response::HTTP_UNPROCESSABLE_ENTITY,
                    'status_message'=> Response::$statusMessages[Response::HTTP_UNPROCESSABLE_ENTITY],
                    'message' => $traffic_api_message,
                    'locations' => $traffic_locations,
                    'location_random_id' => $location_random_id,
                    'traffic_incident_data' => $traffic_incident_data
                ];
            }
        }else{
            $json_data = [
                'status'=>Response::HTTP_UNAUTHORIZED,
                'status_message'=> Response::$statusMessages[Response::HTTP_UNAUTHORIZED],
                'message'=>'Invalid Credentials.',
            ];
        }
        
        return response()->json($json_data);
    }//end delete traffic location
    
    public function change_default($location_random_id){
        
        $json_data = [];
        
        if (Auth::check()) {
            
            $traffic_locations = Location::where('user_id', Auth::id())->where('component', 'traffic')->orderBy('order', 'asc')->get();
            
            $default_location_name = null;
            $default_location_radius = null;
            $traffic_incident_data = null;
            $traffic_api_message = null;
            
            foreach($traffic_locations as $location){
                if($location->random_id == $location_random_id){
                    $location->default = true;
                    $default_location_name = $location->name;
                    $default_location_radius = 1609.34 * $location->radius;
                }else{
                    $location->default = false;
                }
                $location->save();
            }

            if($default_location_name){
                
                $trafficAPI = new TrafficAPI;
                
                try {
                    //json decoded already
                    $traffic_incident_data = $trafficAPI->getTrafficIncidentData($default_location_name, $default_location_radius);
                    
                    // Check if the Geocoding API returned an error
                    if ($traffic_incident_data === false) {
                        throw new BaseException('Error: API call failed.');
                    }
                    
                    if (!$traffic_incident_data || empty($traffic_incident_data)) {
                        throw new BaseException('Error: Empty response from API.');
                    }
                    
                    if(isset($traffic_incident_data['error'])){
                        throw new BaseException('Error: '.$traffic_incident_data['error']);
                    }
                    
                    if($traffic_incident_data['info']['statuscode'] === 400){//OK
                        throw new BaseException('Error: '.$traffic_incident_data['info']['messages'][0]);
                    }
                } catch (Exception $e) {
                    
                    // Handle API errors
                    $traffic_api_message = $e->getMessage();
                    $traffic_incident_data = null;
                }
                
                $this->convert_formats($traffic_incident_data);
                
                $json_data = [
                    'status'=>Response::HTTP_OK,
                    'status_message'=> Response::$statusMessages[Response::HTTP_OK],
                    'message' => 'Changed default location',
                    'locations' => $traffic_locations,
                    'default_location_random_id' => $default_location_random_id,
                    'traffic_incident_data' => $traffic_incident_data
                ];
            }else{
                $json_data = [
                    'status'=>Response::HTTP_UNPROCESSABLE_ENTITY,
                    'status_message'=> Response::$statusMessages[Response::HTTP_UNPROCESSABLE_ENTITY],
                    'message' => $traffic_api_message,
                    'locations' => $traffic_locations,
                    'default_location_random_id' => $location_random_id,
                    'traffic_incident_data' => $traffic_incident_data
                ];
            }
        }else{
            $json_data = [
                'status'=>Response::HTTP_UNAUTHORIZED,
                'status_message'=> Response::$statusMessages[Response::HTTP_UNAUTHORIZED],
                'message'=>'Invalid Credentials.',
            ];
        }
        
        return response()->json($json_data);
    }//end change default traffic location
    
    private function convert_formats($traffic_incident_data){
        
        if($traffic_incident_data['location']){
            $traffic_incident_data['location']['country'] = GlobalData::convert_country_to_abbreviation($traffic_incident_data['location']['country']);
            $traffic_incident_data['location']['state'] = GlobalData::convert_state_to_abbreviation($traffic_incident_data['location']['state']);
        }
        
        if($traffic_incident_data['incidents']){
            
            for ($i = 0; $i < sizeof($traffic_incident_data['incidents']); $i++){
                
                $datetime = new DateTime($traffic_incident_data['incidents'][$i]['startTime']);
                $traffic_incident_data['incidents'][$i]['startTime'] = $datetime->format('m/d/y g:i a');
                
                $datetime = new DateTime($traffic_incident_data['incidents'][$i]['endTime']);
                $traffic_incident_data['incidents'][$i]['endTime'] = $datetime->format('m/d/y g:i a');
            }
        }
        
        return $traffic_incident_data;
    }//end convert formats
}