<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Response;
use App\Models\CheckList;
use App\Models\CheckListItem;
use App\Libraries\RandomGenerator;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
//use Illuminate\Support\Facades\Log;

class CheckListController extends Controller{
    
    public function save_check_list(Request $request){
        
        $json_data = [];
        
        if (Auth::check()) {
            
            $check_list_name = null;
            if($request->check_list_name){
                $check_list_name = $request->check_list_name;
            }
            
            $users_check_lists = CheckList::where('user_id', Auth::id())->orderBy('order', 'asc')->get();
            
            //unique random ID
            $randomGenerator = new RandomGenerator;
            $prefix = '';
            $suffix = date("mdY").'_mem_chl_'.substr(strtolower(trim($check_list_name)), 0, 2);
            $random_id = $randomGenerator->generate(10,$prefix,$suffix,'_');
            
            if(!$users_check_lists || sizeof($users_check_lists) == 0){//first check_list to save, set to default
                
                $check_list_data = array(
                    'user_id'=>Auth::id(),
                    'name'=>trim($check_list_name),
                    'default'=>true,
                    'order'=>1,
                    'random_id'=>$random_id
                );
                
            }else{
                
                $check_list_data = array(
                    'user_id'=>Auth::id(),
                    'name'=>trim($check_list_name),
                    'default'=>false,
                    'order'=>1,
                    'random_id'=>$random_id
                );
            }
            
            $check_list_db = CheckList::create($check_list_data);
            
            $check_lists = CheckList::where('user_id', Auth::id())->orderBy('order', 'asc')->get();
            
            $default_check_list = null;
            foreach($check_lists as $check_list){
                if($check_list->default){
                    $default_check_list = $check_list;
                    break;
                }
            }
            
            $default_check_list_data = null;
            
            if($default_check_list){
                $default_check_list_data = CheckListItem::where('user_id', Auth::id())->where('check_list_id', $default_check_list->id)->orderBy('order', 'asc')->get();
            }
            
            if($check_list_db){
                $json_data = [
                    'status'=>Response::HTTP_OK,
                    'status_message'=> Response::$statusMessages[Response::HTTP_OK],
                    'message' => 'Created Check List',
                    'check_list_name' => $check_list_name,
                    'check_lists' => $check_lists,
                    'default_check_list' => $default_check_list,
                    'default_check_list_data' => $default_check_list_data
                ];
            }else{
                $json_data = [
                    'status'=>Response::HTTP_UNPROCESSABLE_ENTITY,
                    'status_message'=> Response::$statusMessages[Response::HTTP_UNPROCESSABLE_ENTITY],
                    'message' => 'Could not create check list',
                    'check_list_name' => $check_list_name,
                    'check_lists' => $check_lists,
                    'default_check_list' => $default_check_list,
                    'default_check_list_data' => $default_check_list_data
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
    }//end save check list
    
    public function read_check_lists(Request $request){
        
        $json_data = [];
        
        if (Auth::check()) {
            
            $check_lists = CheckList::select('*')->where('user_id', Auth::id())->orderBy('order', 'asc')->get();
            
            $default_check_list = null;
            foreach($check_lists as $check_list){
                if($check_list->default){
                    $default_check_list = $check_list;
                    break;
                }
            }
            
            $default_check_list_data = null;
            
            if($default_check_list){
                $default_check_list_data = CheckListItem::where('user_id', Auth::id())->where('check_list_id', $default_check_list->id)->orderBy('order', 'asc')->get();
            }
            
            
            if($check_lists && sizeof($check_lists) > 0){
                
                $json_data = [
                    'status'=>Response::HTTP_OK,
                    'status_message'=> Response::$statusMessages[Response::HTTP_OK],
                    'message' => 'Retrieved check_lists',
                    'check_lists' => $check_lists,
                    'default_check_list' => $default_check_list,
                    'default_check_list_data' => $default_check_list_data
                ];
            }else{
                $json_data = [
                    'status'=>Response::HTTP_UNPROCESSABLE_ENTITY,
                    'status_message'=> Response::$statusMessages[Response::HTTP_UNPROCESSABLE_ENTITY],
                    'message' => 'Could not retrieve check_lists',
                    'check_lists' => $check_lists,
                    'default_check_list' => $default_check_list,
                    'default_check_list_data' => $default_check_list_data
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
    }//end read check lists
    
    public function delete_check_list(Request $request){
        
        $json_data = [];
        
        if (Auth::check()) {
            
            $check_list_random_id = null;
            $delete_result = null;
            if($request->check_list_random_id){
                $check_list_random_id = $request->check_list_random_id;
                
                $check_list = CheckList::select('*')->where('user_id', Auth::id())->where('random_id', $check_list_random_id)->first();
                $delete_result = CheckListItem::where('user_id', Auth::id())->where('check_list_id', $check_list->id)->delete();
                
                $delete_result = CheckList::where('random_id', $check_list_random_id)->delete();
            }
            
            $check_lists = null;
            $default_check_list = null;
            $default_check_list_data = null;
            
            if($delete_result > 0){
                
                $check_lists = CheckList::select('*')->where('user_id', Auth::id())->orderBy('order', 'asc')->get();
                
                foreach($check_lists as $check_list){
                    if($check_list->default){
                        $default_check_list = $check_list;
                        break;
                    }
                }
                
                if(sizeof($check_lists) == 1){
                    foreach($check_lists as $check_list){
                        $check_list->default = true;
                        $check_list->save();
                        $default_check_list = $check_list;
                    }
                }
                
                if($default_check_list){
                    $default_check_list_data = CheckListItem::where('user_id', Auth::id())->where('check_list_id', $default_check_list->id)->orderBy('order', 'asc')->get();
                }
                
                $json_data = [
                    'status'=>Response::HTTP_OK,
                    'status_message'=> Response::$statusMessages[Response::HTTP_OK],
                    'message' => 'Deleted check_list',
                    'check_list_random_id' => $check_list_random_id,
                    'check_lists' => $check_lists,
                    'default_check_list' => $default_check_list,
                    'default_check_list_data' => $default_check_list_data
                ];
            }else{
                $json_data = [
                    'status'=>Response::HTTP_UNPROCESSABLE_ENTITY,
                    'status_message'=> Response::$statusMessages[Response::HTTP_UNPROCESSABLE_ENTITY],
                    'message' => 'Could not delete check_list',
                    'check_list_random_id' => $check_list_random_id,
                    'check_lists' => $check_lists,
                    'default_check_list' => $default_check_list,
                    'default_check_list_data' => $default_check_list_data
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
    }//end delete check list
    
    public function change_default_check_list(Request $request){
        
        $json_data = [];
        
        if (Auth::check()) {
            
            $default_check_list_random_id = null;
            if($request->default_check_list_random_id){
                $default_check_list_random_id = $request->default_check_list_random_id;
            }
            
            $check_lists = CheckList::select('*')->where('user_id', Auth::id())->orderBy('order', 'asc')->get();
            
            $default_check_list = null;
            $default_check_list_data = null;
            $change_default_check_list = false;
            
            foreach($check_lists as $check_list){
                if($check_list->random_id == $default_check_list_random_id){
                    $check_list->default = true;
                    $check_list->save();
                    
                    $default_check_list = $check_list;
                    $change_default_check_list = true;
                    break;
                }
            }
            
            if($change_default_check_list){
                
                //update all other locations if we updated a new default check_list
                foreach($check_lists as $check_list){
                    if($check_list->random_id != $default_check_list_random_id){
                        $check_list->default = false;
                        $check_list->save();
                    }
                }
                
                if($default_check_list){
                    $default_check_list_data = CheckListItem::where('user_id', Auth::id())->where('check_list_id', $default_check_list->id)->orderBy('order', 'asc')->get();
                }
                
                $json_data = [
                    'status'=>Response::HTTP_OK,
                    'status_message'=> Response::$statusMessages[Response::HTTP_OK],
                    'message' => 'Changed default check_list',
                    'default_check_list_random_id' => $default_check_list_random_id,
                    'check_lists' => $check_lists,
                    'default_check_list' => $default_check_list,
                    'default_check_list_data' => $default_check_list_data
                ];
            }else{
                $json_data = [
                    'status'=>Response::HTTP_UNPROCESSABLE_ENTITY,
                    'status_message'=> Response::$statusMessages[Response::HTTP_UNPROCESSABLE_ENTITY],
                    'message' => 'Could not change default check_list',
                    'default_check_list_random_id' => $default_check_list_random_id,
                    'check_lists' => $check_lists,
                    'default_check_list' => $default_check_list,
                    'default_check_list_data' => $default_check_list_data
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
    }//end change default check list
    
    public function save_check_list_items(Request $request){
        
        $json_data = [];
        
        if (Auth::check()) {
            
            $check_list_random_id = null;
            if($request->check_list_random_id){
                $check_list_random_id = trim($request->check_list_random_id);
            }
            
            $check_list_data = null;
            if($request->check_list_items_json_string){
                $check_list_data = json_decode(trim($request->check_list_items_json_string));
            }
            
            $default_check_list = null;
            $default_check_list_data = null;
            
            if($check_list_data && sizeof($check_list_data) > 0){
                
                $default_check_list = CheckList::select('*')->where('user_id', Auth::id())->where('random_id', $check_list_random_id)->first();
                
                if(isset($default_check_list)){
                    
                    $save_or_update = false;
                    
                    //find the max number for order
                    $check_list_items_order = 0;
                    foreach ($check_list_data as $check_list_item) {
                        if(isset($check_list_item->order) && $check_list_item->order > $check_list_items_order){
                            $check_list_items_order = $check_list_item->order;
                        }
                    }
                    
                    foreach ($check_list_data as $check_list_item) {
                        
                        if(!$check_list_item->status || $check_list_item->status == ''){
                            $check_list_item->status = 'unchecked';
                        }
                        
                        if(!isset($check_list_item->order) || $check_list_item->order == ''){
                            $check_list_items_order++;
                            $check_list_item->order = $check_list_items_order;
                        }
                        
                        if(property_exists($check_list_item, 'random_id')){
                            
                            $check_list_item_db = CheckListItem::where('random_id', '=', $check_list_item->random_id)->firstOrFail();
                            
                            if($check_list_item_db){
                                $check_list_item_db->name = trim($check_list_item->name);
                                $check_list_item_db->status = $check_list_item->status;
                                $check_list_item_db->order = intval($check_list_item->order);
                                $check_list_item_db->save();
                                
                                $save_or_update = true;
                            }
                            
                        }else{
                            //unique random ID
                            $randomGenerator = new RandomGenerator;
                            $prefix = '';
                            $suffix = date("mdY").'_mem_chli_'.substr(strtolower(trim($check_list_item->name)), 0, 2);
                            $random_id = $randomGenerator->generate(10,$prefix,$suffix,'_');
                            
                            $list_item_data = array(
                                'user_id'=>Auth::id(),
                                'check_list_id'=>$default_check_list->id,
                                'name'=>trim($check_list_item->name),
                                'status'=>$check_list_item->status,
                                'order'=>intval($check_list_item->order),
                                'random_id'=>$random_id
                            );
                            
                            $check_list_item_db = CheckListItem::create($list_item_data);
                            
                            $save_or_update = true;
                        }
                    }
                    
                    if($save_or_update){
                        $default_check_list_data = CheckListItem::where('user_id', Auth::id())->where('check_list_id', $default_check_list->id)->orderBy('order', 'asc')->get();
                        $default_check_list_data = $this->reorder_check_list_items($default_check_list_data);
                        
                        foreach ($default_check_list_data as $check_list_item) {
                            $check_list_item->save();
                        }
                    }
                }
            }
            
            if($save_or_update){
                $json_data = [
                    'status'=>Response::HTTP_OK,
                    'status_message'=> Response::$statusMessages[Response::HTTP_OK],
                    'message' => 'Saved check list item(s)',
                    'default_check_list' => $default_check_list,
                    'default_check_list_data' => $default_check_list_data
                ];
            }else{
                $json_data = [
                    'status'=>Response::HTTP_UNPROCESSABLE_ENTITY,
                    'status_message'=> Response::$statusMessages[Response::HTTP_UNPROCESSABLE_ENTITY],
                    'message' => 'Could not create check list item(s)',
                    'default_check_list' => $default_check_list,
                    'default_check_list_data' => $default_check_list_data
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
    }//end save check list items
    
    public function delete_check_list_items(Request $request){
        
        $json_data = [];
        
        if (Auth::check()) {
            
            $delete_result = false;
            
            $check_list_random_id = null;
            if($request->check_list_random_id){
                $check_list_random_id = trim($request->check_list_random_id);
            }
            
            $check_list_item_random_id = null;
            if($request->check_list_item_random_id){
                $check_list_item_random_id = $request->check_list_item_random_id;
                $delete_result = CheckListItem::where('random_id', $check_list_item_random_id)->delete();
            }else{//delete all
                $check_list = CheckList::select('*')->where('user_id', Auth::id())->where('random_id', $check_list_random_id)->first();
                $delete_result = CheckListItem::where('user_id', Auth::id())->where('check_list_id', $check_list->id)->delete();
            }
            
            $default_check_list = null;
            $default_check_list_data = null;
            
            if($delete_result){
                
                $default_check_list = CheckList::select('*')->where('user_id', Auth::id())->where('random_id', $check_list_random_id)->first();
                
                if($default_check_list){
                    
                    $default_check_list_data = CheckListItem::where('user_id', Auth::id())->where('check_list_id', $default_check_list->id)->orderBy('order', 'asc')->get();
                    
                    if($default_check_list_data && sizeof($default_check_list_data) > 0){
                        $default_check_list_data = $this->reorder_check_list_items($default_check_list_data);
                    }
                }
                
                $json_data = [
                    'status'=>Response::HTTP_OK,
                    'status_message'=> Response::$statusMessages[Response::HTTP_OK],
                    'message' => 'Deleted check list item(s)',
                    'check_list_random_id' => $check_list_random_id,
                    'check_list_item_random_id' => $check_list_item_random_id,
                    'default_check_list' => $default_check_list,
                    'default_check_list_data' => $default_check_list_data
                ];
            }else{
                $json_data = [
                    'status'=>Response::HTTP_UNPROCESSABLE_ENTITY,
                    'status_message'=> Response::$statusMessages[Response::HTTP_UNPROCESSABLE_ENTITY],
                    'message' => 'Could not delete check list item(s)',
                    'check_list_random_id' => $check_list_random_id,
                    'check_list_item_random_id' => $check_list_item_random_id,
                    'default_check_list' => $default_check_list,
                    'default_check_list_data' => $default_check_list_data
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
    }//end delete check list items
    
    private function reorder_check_list_items($list){
        
        $sorted_list = $list->sortBy('order');
        
        // Reassign order values in sequence
        $counter = 1;
        foreach ($sorted_list as $item_obj) {
            $item_obj->order = $counter;
            $counter++;
        }
        
        return $sorted_list;
    }//end reorder check list items
}
