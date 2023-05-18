import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';

import CheckListManager from './CheckListManager';
import AuthUtility from '../frontend/auth/AuthUtility';
import LoadingSpinner from '../frontend/LoadingSpinner';

import DoneIcon from "@material-ui/icons/Done";

import Alert from "@material-ui/lab/Alert";

import {Button, Snackbar} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

//import $ from "jquery";
import axios from 'axios';
import swal from 'sweetalert';

import add_icon from '../../assets/frontend/images/add_icon.png';
import edit_icon from '../../assets/frontend/images/edit_icon.png';
import check_icon from '../../assets/frontend/images/check_icon.png';
import check_icon_disabled from '../../assets/frontend/images/check_icon_disabled.png';
import cancel_icon from '../../assets/frontend/images/cancel_icon.png';
import delete_icon from '../../assets/frontend/images/delete_red_light.png';
import arrow_left_90 from '../../assets/frontend/images/arrow_left_90.png';
import arrow_right_90 from '../../assets/frontend/images/arrow_right_90.png';

function CheckList(){
	
	const navHistory = useNavigate();
  
    // Initial states
    const [isLoading, setIsLoading] = useState(true);
    const [isAdd, setAdd] = useState(false);
    const [isEdit, setEdit] = useState(false);
    const [disable, setDisable] = useState(true);
    const [openAlertSaved, setOpenAlertSaved] = useState(false);
    const [openAlertDeleted, setOpenAlertDeleted] = useState(false);
	const [checkList, setCheckList] = useState({
		name: '',
		random_id: '',
		data: [
        //{ id: data.length + 1, user_id: "", name: "", status: "", order: rows.length + 1, random_id: "", created: "", updated: "" },
        ],
	});
	const [checkListForCancel, setCheckListForCancel] = useState({
		data: [
        //{ id: data.length + 1, user_id: "", name: "", status: "", order: rows.length + 1, random_id: "", created: "", updated: "" },
        ],
	});
    const [showConfirmAll, setShowConfirmAll] = useState(false);
    //const [showConfirmIndividual, setShowConfirmIndividual] = useState(false);

	const handleCheckListManagerOpen = (isCheckListManagerOpen) => {
		if(isCheckListManagerOpen){
			//hide some elements
		}else{
			//show some elements
		}
	};

	const handleCheckListData = (defaultCheckList, defaultCheckListData) => {//properties coming from PortfolioManager

		if(defaultCheckListData && defaultCheckListData.length > 0){
			setCheckList({...checkList, name: defaultCheckList.name, random_id: defaultCheckList.random_id, data: defaultCheckListData});
		}else if(defaultCheckList){
			setCheckList({...checkList, name: defaultCheckList.name, random_id: defaultCheckList.random_id, data: []});
		}else{
			setCheckList({...checkList, name: '', random_id: '', data: []});
		}
		
		setIsLoading(false);
	};
	
    // Function For closing the alert snackbar
    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        
        setOpenAlertSaved(false);
        setOpenAlertDeleted(false);
    };
  
    // Function For adding new row object
    const handleAdd = () => {
        const list = [...checkList.data];
        	
		//cache on first click of add button
		if(!isAdd){
			
			const clonedList = JSON.parse(JSON.stringify(list));
			
			//cache rows before changing for cancelling
			if(list.length === 0){
				setCheckListForCancel({...checkListForCancel, data: []});
			}else{
				setCheckListForCancel({...checkListForCancel, data: clonedList});
			}
		}
		
		list.push({ id: checkList.data.length + 1, name: "", status: ""});
        setCheckList({...checkList, data: list});

        setAdd(true);
        setEdit(true);
    };
  
    // Function to handle edit
    const handleEdit = (i) => {
        const list = [...checkList.data];
        
		const clonedList = JSON.parse(JSON.stringify(list));
		
		//cache rows before changing for cancelling
		if(list.length === 0){
			setCheckListForCancel([]);
		}else{
			setCheckListForCancel({...checkListForCancel, data: clonedList});
		}
		
        // toggle edit mode
        setEdit(!isEdit);
    };

	const handleCancel = () => {
        const list = [...checkListForCancel.data];
		const clonedList = JSON.parse(JSON.stringify(list));
		
		//set rows to the old cached rows
		setCheckList({...checkList, data: clonedList});

        setDisable(true);
        setAdd(!isAdd);
        setEdit(!isEdit);
	}
  
    // The handleInputChange handler can be set up to handle
    // many different inputs in the form, listen for changes 
    // to input elements and record their values in state
    const handleInputChange = (event, index) => {
		event.stopPropagation();
		
        const { name, value } = event.target;

        const list = [...checkList.data];
		
		if(name === 'status_'+index){// specific to the status value
			if(event.target.checked){
        		list[index]["status"] = 'checked';
			}else{
        		list[index]["status"] = 'unchecked';
			}
		}else{
        	list[index][name] = value;
		}
		
		setCheckList({...checkList, data: list});
        
        setDisable(false);
        
    };
  
    // Function to handle save
    const handleSave = () => {

		saveCheckListItem();

        setAdd(!isAdd);
        setEdit(!isEdit);
        setDisable(true);

		//remove cached rows  for cancelling
		setCheckListForCancel([]);
    };

	function saveCheckListItem(){
		
		setIsLoading(true);
			
		//values sent to api
		var data = {
			check_list_random_id: checkList.random_id,
			//entire rows list converted to string
			check_list_items_json_string: JSON.stringify(checkList.data),
		}
	
		axios.post('/api/save_items', data, {
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
			}
		}).then(response =>{
			
			var check_list_data;
			var error_message;
			
			if(response.data.status === 200){//HTTP_OK
			
				//update all state properties
				check_list_data = response.data.check_list_data;
			
				error_message = '';
				for (let i = 0; i < check_list_data.length; i++) {
					if (check_list_data[i].hasOwnProperty('error')) {
						error_message = error_message + ' ' + check_list_data[i]['symbol']+' '+check_list_data[i]['error'];
						check_list_data.splice(i, 1);
						i--;
					}
				}
				
				if(error_message){
                	swal("Warning", error_message, "warning");
				}else{
					setOpenAlertSaved(true);
				}
			
				//update all state properties
				setCheckList({...checkList, data: check_list_data});
					
            }else if(response.data.status === 401){//HTTP_UNAUTHORIZED
				
				//user not authenticated on server so remove from local storage
				AuthUtility.clearAuthData();
				/*
	            localStorage.removeItem('auth_token');
	            localStorage.removeItem('auth_role');
	
				if(!isChecked){
	            	localStorage.removeItem('auth_users_name');
	            	localStorage.removeItem('auth_users_last_name');
	            	localStorage.removeItem('auth_email');
	            	localStorage.removeItem('password');
	            	localStorage.removeItem('remember_me');
				}
				*/
            
				swal("Warning",response.data.message,"warning");
				navHistory('/login');

            }else if(response.data.status === 422){//HTTP_UNPROCESSABLE_ENTITY
				check_list_data = response.data.check_list_data;
			
				error_message = '';
				for (let i = 0; i < check_list_data.length; i++) {
					if (check_list_data[i].hasOwnProperty('error')) {
						error_message = error_message + ' ' + check_list_data[i]['symbol']+' '+check_list_data[i]['error'];
						check_list_data.splice(i, 1);
						i--;
					}
				}
				
				if(error_message){
			
					//update all state properties
					setCheckList({...checkList, data: check_list_data});
                	swal("Warning", error_message, "warning");
				}else{
                	swal("Warning", response.data.message, "warning");
				}
            }else{//more errors
            }
            
			setIsLoading(false);
			
		}).catch(function (error) {
			console.log('[saveCheckListItem] error: ',error + ' back-end api call error');
		
			setIsLoading(false);
			swal("Error",error,"error");
			navHistory('/check_list');
		});
	}
	
    // Showing delete all confirmation to users
    const handleConfirmAll = () => {
        setShowConfirmAll(true);
    };
  
    // Delete row of id:i
    const handleRemoveClick = (i) => {
        const list = [...checkList.data];

		if(list[i]['random_id'] && list[i]['random_id'] !== ''){
			deleteCheckListItems(list[i]['random_id']);//send a specific unique ID to delete
		}
    };

    const handleRemoveAllClick = () => {

		// No unique ID to delete all
		deleteCheckListItems();
        setShowConfirmAll(false);
    };

    // Handle delete confirmation  where user click no 
    const handleNoAll = () => {
        setShowConfirmAll(false);
    };

	function deleteCheckListItems(check_list_item_random_id){
		
		setIsLoading(true);
		
		/*
		//values sent to api for an individual check list item delete
		var data;
		if(!check_list_item_random_id || check_list_item_random_id === ''){
			data = {
				check_list_random_id: checkList.random_id,
			}
		}else{
			data = {
				check_list_random_id: checkList.random_id,
				check_list_item_random_id: check_list_item_random_id,
			}
		}
		*/
		if(!check_list_item_random_id || check_list_item_random_id === ''){
			check_list_item_random_id = 'none';
		}
	
		axios.delete('/api/delete_item/'+checkList.random_id+'/'+check_list_item_random_id, {
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
			}
		}).then(response =>{
			if(response.data.status === 200){//HTTP_OK
			
				var list = [];
				
				if(check_list_item_random_id && check_list_item_random_id !== 'none' && response.data.check_list_data){
					list = response.data.check_list_data;
				}
			
				//update state properties
				setCheckList({...checkList, data: list});
					
            }else if(response.data.status === 401){//HTTP_UNAUTHORIZED
				
				//user not authenticated on server so remove from local storage
				AuthUtility.clearAuthData();
				/*
	            localStorage.removeItem('auth_token');
	            localStorage.removeItem('auth_role');
	
				if(!isChecked){
	            	localStorage.removeItem('auth_users_name');
	            	localStorage.removeItem('auth_users_last_name');
	            	localStorage.removeItem('auth_email');
	            	localStorage.removeItem('password');
	            	localStorage.removeItem('remember_me');
				}
				*/
            
				swal("Warning",response.data.message,"warning");
				navHistory('/login');
				
            }else if(response.data.status === 422){//HTTP_UNPROCESSABLE_ENTITY
                swal("Warning",response.data.message,"warning");
            }else{//more errors
            }
            
			setIsLoading(false);
	
		}).catch(function (error) {
			console.log('[deleteCheckListItems] error: ',error + ' back-end api call error');
		
			setIsLoading(false);
			swal("Error",error,"error");
			navHistory('/check_list');
		});
	}

  	return (
		<div className="body-content bg-fff pt-70l-110m-50s">
		
			<Snackbar open={openAlertSaved} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }} style={{ marginTop: "70px" }}>
				<Alert onClose={handleClose} severity="success">List Item saved successfully!</Alert>
			</Snackbar>
			<Snackbar open={openAlertDeleted} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }} style={{ marginTop: "70px" }}>
				<Alert onClose={handleClose} severity="error">List Item deleted successfully!</Alert>
			</Snackbar>
			
			<div className="panel largeX ptb-20l-10s plr-20l-10s">
			
				<div className="grid-x">
				
					<div className="large-11 medium-11 small-10 cell text-left">
						<div className="font-raleway page-header font-weight-800 italic txt-dark-blue bb2-dark-blue uppercase pb-5">Check List</div>
						<div className="pt-5">
							<span className="font-raleway font-text font-weight-600">
							{checkList.name}
							</span>
						</div>
					</div>
					<div className="large-1 medium-1 small-2 cell text-right">
						<CheckListManager onCheckListData={handleCheckListData} onCheckListManagerOpen={handleCheckListManagerOpen} />
					</div>
					
					{checkList.name  ? (
					<div className="large-12 medium-12 small-12 cell ptb-10">
				        {isEdit ? (
						<div className="clearfix">
							<span className="left">
				            <Link onClick={handleAdd} className=" icon-with-text">
				            	<img src={add_icon} className="" width="20" alt="add items"/> <span className="txt-blue">ADD</span>
				            </Link>
				            </span>
				            {checkList.data.length > 0 && (
							<span className="left pl-20">
				                {disable ? (
									<Link disabled className="icon-with-text hover-opacity-50 no-underline disabled">
										<img src={check_icon_disabled} className="" width="20" alt="save items"/> <span className="txt-ccc">SAVE</span>
									</Link>
				                ) : (
									<Link onClick={handleSave} className="icon-with-text hover-opacity-50 no-underline">
										<img src={check_icon} className="" width="20" alt="save items"/> <span className="txt-blue">SAVE</span>
									</Link>
				                )}
								<span className="pl-20">
								<Link onClick={handleCancel} className="icon-with-text hover-opacity-50 no-underline">
									<img src={cancel_icon} className="" width="20" alt="cancel add items"/> <span className="txt-blue">CANCEL</span>
								</Link>
								</span>
							</span>
				            )}
						</div>
				        ) : (
						<div className="clearfix">
							<span className="left">
					            <Link onClick={handleAdd} className="icon-with-text hover-opacity-50 no-underline">
					            	<img src={add_icon} className="" width="20" alt="add items"/> <span className="txt-blue">ADD</span>
					            </Link>
					            {checkList.data.length > 0 && (
								<span className="pl-20">
				            	<Link align="left" onClick={handleEdit} className="icon-with-text hover-opacity-50 no-underline">
					            	<img src={edit_icon} className="" width="20" alt="edit items"/> <span className="txt-blue">EDIT</span>
				            	</Link>
				            	</span>
				            	)}
							</span>
							<span className="right pl-20">
				            	{checkList.data.length > 0 && (
				            	<Link onClick={handleConfirmAll} onTouchEnd={handleConfirmAll}  className="hover-opacity-50 no-underline icon-with-text">
									<img src={delete_icon} className="" width="17" alt="delete check list"/> <span className="txt-red">DELETE ALL</span>
								</Link>
				            	)}
				                {showConfirmAll && (
									<Dialog open={showConfirmAll} onClose={handleNoAll} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
										<DialogTitle id="alert-dialog-title" style={{padding:"0px",paddingTop:"20px", }}><DialogContentText style={{fontFamily:"Raleway",fontSize:20,fontWeight:800,color:"#0E1F2F", fontStyle:"italic",letterSpacing:1,textDecoration:"underline",textTransform:"uppercase"}}>Confirm Delete All</DialogContentText></DialogTitle>
										<DialogContent><DialogContentText id="alert-dialog-description" style={{fontFamily:'Raleway',fontSize:14,fontWeight:500,color:"#0E1F2F"}}>Are you sure to delete all items on the check list</DialogContentText></DialogContent>
										<DialogActions>
											<Button onClick={handleRemoveAllClick} autoFocus style={{fontFamily:"Raleway",fontSize:12, padding:7}} className="button tiny">Yes</Button>
											<Button onClick={handleNoAll} autoFocus style={{fontFamily:"Raleway",fontSize:12, padding:7}} className="button tiny">No</Button>
										</DialogActions>
									</Dialog>
				                )}
							</span>
						</div>
						)}
					</div>
					) : (
						<></>
					)}
					
					{checkList.data.length > 0 ? ( 
					<div id="fportfolio_data" className="large-12 medium-12 small-12 cell ">
						<table className="mb-0">
							<tbody>
				        	{checkList.data.map((data_item, i) => (
								isEdit ? (
								<tr key={'edit'+data_item.id+data_item.random_id}>
									<td  key={'edit_td3'+data_item.id+data_item.random_id} className="parent-to-checkboxx text-left pt-2 pl-2 width-50px">
					        			<input type="checkbox" value="1" name={"status_"+i} id={"status_"+i} checked={data_item.status === 'checked' ? true : false} onChange={(e) => handleInputChange(e, i)} />
										<label htmlFor={"status_"+i} className="checkbox-label "><span className="checkbox "></span></label>
									</td>
									<td  key={'edit_td2'+data_item.id+data_item.random_id} className="text-left pl-5"><input type="text" className="small width-100per" value={data_item.name} name="name" onChange={(e) => handleInputChange(e, i)} placeholder="Item Title"/></td>
									<td  key={'edit_td1'+data_item.id+data_item.random_id} className="text-left pl-5 width-40px"><input type="text" className="small" value={data_item.order} name="order" onChange={(e) => handleInputChange(e, i)} /></td>
									{/*<td  key={'edit_td4'+data_item.id+data_item.random_id} className="font-source-sans font-standard font-weight-500 txt-333 text-center width-75px hide-for-small-only">{convertDateTimeToText(data_item.created_at)}</td>*/}
									<td  key={'edit_td5'+data_item.id+data_item.random_id} className="font-source-sans font-standard font-weight-500 txt-333 text-center width-75px hide-for-small-only">{convertDateTimeToText(data_item.updated_at)}</td>
									<td  key={'edit_td6'+data_item.random_id+data_item.random_id} className="text-center p-10 width-40px">
					            	<Link disabled className="hover-opacity-50 disabled">
										<img src={delete_icon} className="grayscale" width="17" alt="delete check list"/>
									</Link>
									</td>
								</tr>
				        		) : (
								<tr key={'no_edit'+data_item.id+data_item.random_id}>
									<td  key={'noedit_td3'+data_item.id+data_item.random_id} className="font-source-sans page-text font-weight-400 txt-333 text-center width-40px">
									{data_item.status === 'checked' && 
										<DoneIcon style={{ transform: "scale(1.25)" }} />
									}</td>
									<td  key={'noedit_td2'+data_item.id+data_item.random_id} className={"font-source-sans page-text font-weight-600 " + (data_item.name === '' ? "italic txt-999" : "txt-333") + ' pl-5'}>{(data_item.name === '' ? "No Title" : data_item.name)}</td>
									<td  key={'noedit_td1'+data_item.id+data_item.random_id} className="font-source-sans page-text font-weight-600 txt-333 text-left pl-5 width-40px">{/*data_item.order*/' '}</td>
									{/*<td  key={'noedit_td4'+data_item.id+data_item.random_id} className="font-source-sans font-standard font-weight-500 txt-333 text-center width-75px hide-for-small-only">{convertDateTimeToText(data_item.created_at)}</td>*/}
									<td  key={'noedit_td5'+data_item.id+data_item.random_id} className="font-source-sans font-standard font-weight-500 txt-333 text-center width-75px hide-for-small-only">{convertDateTimeToText(data_item.updated_at)}</td>
									<td  key={'noedit_td6'+data_item.id+data_item.random_id} className="text-center p-10 width-40px">
					            	<Link onClick={() => handleRemoveClick(i)} onTouchEnd={() => handleRemoveClick(i)} className="hover-opacity-50">
										<img src={delete_icon} className="" width="17" alt="delete check list"/>
									</Link>
									</td>
								</tr>
								)
							))}
					        {isEdit &&
								<tr>
									<td className="pt-5"><img src={arrow_left_90} width="35" alt="note for order"/></td>
									<td className="font-source-sans page-standard font-weight-400 txt-333 text-left pt-5 pr-10x">Check Off Items</td>
									<td align="center" className="pt-5"><img src={arrow_left_90} width="35" alt="note for order"/></td>
									<td colSpan="2" className="font-source-sans page-standard font-weight-400 txt-333 text-left pt-5 plr-10">Order Items</td>
								</tr>
							}
							</tbody>
						</table>
					</div>
					): (
					<div className="large-12 medium-12 small-12 cell text-left">
						{checkList.name  ? (
							checkList.data.length > 0 ? ( 
							<></>
							) : (
							<div className="clearfix vertical-center-content pr-5">
								<span className="font-raleway page-standard font-weight-600 txt-dark-blue left"><img src={arrow_left_90} width="35" alt="note for order"/> Add Check List Items</span>
							</div>
							)
						) : (
						<div className="clearfix vertical-center-content pt-10 pr-5">
							<span className="font-raleway page-text font-weight-600 txt-dark-blue left">No Check List <br className="show-for-520px"/>Selected</span>
							<span className="font-raleway page-standard font-weight-600 txt-dark-blue right">Add Check List <img src={arrow_right_90} width="35" alt="note for order"/></span>
						</div>
						)}
					</div>
					)
					}
					
					
					{isLoading && 
					<div className="large-12 medium-12 small-12 cell text-center">
					<LoadingSpinner paddingClass="p-20l-10s" />
					</div>
					}
				</div>
			</div>
			
		</div>
	);
}

export default CheckList;

function convertDateTimeToText(some_date_time){
	
	if(!some_date_time || some_date_time === ''){
		return '';
	}else{
		var date = new Date(some_date_time);
		
	    var day = date.getDate() < 10 ? '0'+date.getDate() : date.getDate();
	    var month = (date.getMonth()+1) < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1;
		var year = date.getFullYear();
	
		return month + '/' + day + '/' + year;
	}
	
}
					