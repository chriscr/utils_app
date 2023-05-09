import React, {useState, useEffect, useRef} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { OffCanvas, OffCanvasMenu, OffCanvasBody } from "react-offcanvas";

import LoadingSpinner from '../frontend/LoadingSpinner';

import DoneIcon from "@material-ui/icons/Done";

import {Button} from "@material-ui/core";

import $ from "jquery";
import axios from 'axios';
import swal from 'sweetalert';

import check_list_icon from '../../assets/frontend/images/check_list_icon.png';
import plus_icon from '../../assets/frontend/images/plus_icon_white.png';
import close_icon from '../../assets/frontend/images/close_icon_black.png';
import delete_icon from '../../assets/frontend/images/delete_red_light.png';

const CheckListManager = ({ onCheckListData, onCheckListManagerOpen }) => {//sends forecast data and boolean for opening/closing the location finder
	
	const navHistory = useNavigate();
	
	//check if clicked target is not within the offcanvasnav
	const checkListIconRef = useRef();
	const checkListManagerRef = useRef();
	const closeCheckListFinderRef = useRef();
	
	// using hooks
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
	const [isCheckListManagerOpen, setIsCheckListManagerOpen] = useState(false);
	const [newCheckList, setNewCheckList] = useState({
		name: '',
		info: '',
	});
	const [checkLists, setCheckLists] = useState([]);
	
	//handles click outside slide out location finder
	useEffect(() => {
		const handleClickOutside = (event) => {
			
			// add event listener to close menu when clicked outside		
			if (checkListManagerRef.current && !checkListManagerRef.current.contains(event.target)) {
				onCheckListManagerOpen(false);
				setIsCheckListManagerOpen(false);
			}
			
			//open nav with mobile icon click which is in the div id=navigation
			if (!isCheckListManagerOpen && checkListIconRef.current && checkListIconRef.current.contains(event.target) && checkListIconRef.current.id === 'checkList_icon') {
				onCheckListManagerOpen(true);
				setIsCheckListManagerOpen(true);
			}
		}
		
		document.addEventListener("mousedown", handleClickOutside)
			
		return () => {
			// Cleanup the event listener
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [isCheckListManagerOpen, onCheckListManagerOpen]);
  
	// Initial call for user list items
	useEffect(() => {

		setIsLoading(true);
		
		if (isMounted) {
			
			console.log('[CheckListManager - useEffect] mounted');
		
			axios.get('/api/read_check_lists', {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
				}
			}).then(response =>{
				if(response.data.status === 200){//HTTP_OK
					
					//set data
					if(response.data.check_lists){
						setCheckLists(response.data.check_lists);
					}
				
					onCheckListManagerOpen(false);
					setIsCheckListManagerOpen(false);
				
					onCheckListData(response.data.default_check_list, response.data.default_check_list_data);
					setNewCheckList({...newCheckList, name: '', info: ''});
						
	            }else if(response.data.status === 401){//HTTP_UNAUTHORIZED
	            
					//user not authenticated on server so remove from local storage
	                localStorage.removeItem('auth_token');
	                localStorage.removeItem('auth_role');
	
					if(!localStorage.getItem('remember_me') || localStorage.getItem('remember_me') !== 'true'){
		            	localStorage.removeItem('auth_users_name');
	            		localStorage.removeItem('auth_users_last_name');
	                	localStorage.removeItem('auth_email');
	                	localStorage.removeItem('password');
					}
	                	
					navHistory('/login');
					
	            }else if(response.data.status === 422){//HTTP_UNPROCESSABLE_ENTITY
					onCheckListData(null);
	            }else{//more errors
					onCheckListData(null);
	            }
		
				setIsLoading(false);
				
			}).catch(function (error) {
				console.log('[CheckListManager - useEffect - read_locations] error: ',error + ' back-end api call error');
			
				setIsLoading(false);
	            
				//user not authenticated on server so remove from local storage
	            localStorage.removeItem('auth_token');
	            localStorage.removeItem('auth_role');
	
				if(!localStorage.getItem('remember_me') || localStorage.getItem('remember_me') !== 'true'){
	            	localStorage.removeItem('auth_users_name');
	        		localStorage.removeItem('auth_users_last_name');
	            	localStorage.removeItem('auth_email');
	            	localStorage.removeItem('password');
				}
				
				onCheckListData(null);
	                	
				navHistory('/login');
			});
			
		}else {
	      setIsMounted(true);
	    }
		
	}, [isMounted]);

	const toggleCheckListManager = (event) => {
		event.preventDefault();
		
		onCheckListManagerOpen(!isCheckListManagerOpen);
		
		setIsCheckListManagerOpen(!isCheckListManagerOpen);
	}

    const handleInputChange = (event) => {
		event.stopPropagation();
		
        const { name, value } = event.target;
        
		setNewCheckList({...newCheckList, name: value, info: '',});

		$('.location-info').removeClass('font-source-sans font-standard font-weight-600 txt-red plr-10 pb-10').addClass('font-source-sans font-small font-weight-400').html('');
    };
  
    // Function to handle save
    const handleSaveNewCheckList = (event) => {
		event.stopPropagation();
		
		if(newCheckList.name){
			saveCheckListFromDB(newCheckList.name);
		}else{
			setNewCheckList({...newCheckList, info: 'Error: Empty Check List'});
			
			$('.location-info').removeClass('font-source-sans font-small font-weight-400').addClass('font-source-sans font-standard font-weight-600 txt-red plr-10 pb-10');
			
		}
    };
    
	function saveCheckListFromDB(check_list_name){
		
		setIsLoading(true);
		setIsSaving(true);
			
		var data = {
			check_list_name: check_list_name,
		}
		
		axios.post('/api/save_check_list', data, {
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
			}
		}).then(response =>{
			if(response.data.status === 200){//HTTP_OK
			
				//update all state properties
				if(response.data.check_lists){
					
					setCheckLists(response.data.check_lists);
					
					if(response.data.check_lists.length === 1){
						
						onCheckListManagerOpen(!isCheckListManagerOpen);
						setIsCheckListManagerOpen(!isCheckListManagerOpen);
						
						onCheckListData(response.data.default_check_list, response.data.default_check_list_data);
					}
				}
				
				setNewCheckList({...newCheckList, name: '', info: ''});
					
            }else if(response.data.status === 401){//HTTP_UNAUTHORIZED
		
				//user not authenticated on server so remove from local storage
	            localStorage.removeItem('auth_token');
	            localStorage.removeItem('auth_role');
	
				if(!localStorage.getItem('remember_me') || localStorage.getItem('remember_me') !== 'true'){
	            	localStorage.removeItem('auth_users_name');
            		localStorage.removeItem('auth_users_last_name');
	            	localStorage.removeItem('auth_email');
	            	localStorage.removeItem('password');
	            	localStorage.removeItem('remember_me');
				}
            
				swal("Warning",response.data.message,"warning");
                	
				navHistory('/login');
				
            }else if(response.data.status === 422){//HTTP_UNPROCESSABLE_ENTITY
				setNewCheckList({...newCheckList, info: 'Error: location does not exist.'});
			
				$('.location-info').removeClass('font-source-sans font-small font-weight-400').addClass('font-source-sans font-standard font-weight-600 txt-red plr-10 pb-10');
			
            }else{//more errors
            }
            
			setIsLoading(false);
			setIsSaving(false);
	
		}).catch(function (error) {
			console.log('[saveCheckListFromDB2 - save_location] error: ',error + ' back-end api call error');
		
			setIsLoading(false);
			setIsSaving(false);
				
			swal("Error",error,"error");
	                	
			navHistory('/weather');
		});
		
	}
	
    // Delete row of id:i
    const handleRemoveClick = (i) => {
        const list = [...checkLists];

		if(list[i]['random_id'] && list[i]['random_id'] !== ''){
			deleteCheckListFromDB(list[i]['random_id']);//send a specific unique ID to delete
		}
    };
    
	function deleteCheckListFromDB(check_list_random_id){
		
		setIsLoading(true);
		setIsDeleting(true);
			
		//values sent to api for an individual list item delete
		var data;
		if(check_list_random_id && check_list_random_id !== ''){
			data = {
				check_list_random_id: check_list_random_id,
			} 
		}
	
		axios.delete('/api/delete_check_list', data, {
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
			}
		}).then(response =>{
			if(response.data.status === 200){//HTTP_OK
			
				//update all state properties
				if(response.data.check_lists){
					
					setCheckLists(response.data.check_lists);
					
					if(response.data.check_lists.length === 1){
						onCheckListManagerOpen(!isCheckListManagerOpen);
						setIsCheckListManagerOpen(!isCheckListManagerOpen);
					}
				}
				
				onCheckListData(response.data.default_check_list, response.data.default_check_list_data);
				setNewCheckList({...newCheckList, name: '', info: ''});
					
            }else if(response.data.status === 401){//HTTP_UNAUTHORIZED
		
				//user not authenticated on server so remove from local storage
	            localStorage.removeItem('auth_token');
	            localStorage.removeItem('auth_role');
	
				if(!localStorage.getItem('remember_me') || localStorage.getItem('remember_me') !== 'true'){
	            	localStorage.removeItem('auth_users_name');
					localStorage.removeItem('auth_users_last_name');
	            	localStorage.removeItem('auth_email');
	            	localStorage.removeItem('password');
	            	localStorage.removeItem('remember_me');
				}
            
				swal("Warning",response.data.message,"warning");
                	
				navHistory('/login');
				
            }else if(response.data.status === 422){//HTTP_UNPROCESSABLE_ENTITY
                swal("Warning",response.data.message,"warning");
            }else{//more errors
            }
            
			setIsLoading(false);
			setIsDeleting(false);
	
		}).catch(function (error) {
			console.log('[deleteCheckListFromDB - delete_location] error: ',error + ' back-end api call error');
		
			setIsLoading(false);
			setIsDeleting(false);
				
			swal("Error",error,"error");
	                	
			navHistory('/weather');
		});
	}
	
    // Delete row of id:i
    const handleChangeDefaultCheckList = (i) => {
        const list = [...checkLists];

		if(list[i]['random_id'] && list[i]['random_id'] !== ''){
			changeDefaultCheckListInDB(list[i]['random_id']);//send a specific unique ID to delete
		}
    };
    
	function changeDefaultCheckListInDB(check_list_random_id){
		
		setIsLoading(true);
			
		//values sent to api for an individual list item delete
		var data;
		if(check_list_random_id && check_list_random_id !== ''){
			data = {
				default_check_list_random_id: check_list_random_id,
			} 
		}
	
		axios.put('/api/change_default_check_list', data, {
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
			}
		}).then(response =>{
			if(response.data.status === 200){//HTTP_OK
			
				//update all state properties
				if(response.data.check_lists){
					setCheckLists(response.data.check_lists);
				}
				
				onCheckListManagerOpen(false);
				setIsCheckListManagerOpen(false);
				
				onCheckListData(response.data.default_check_list, response.data.default_check_list_data);
				setNewCheckList({...newCheckList, name: '', info: ''});
					
            }else if(response.data.status === 401){//HTTP_UNAUTHORIZED
		
				//user not authenticated on server so remove from local storage
	            localStorage.removeItem('auth_token');
	            localStorage.removeItem('auth_role');
	
				if(!localStorage.getItem('remember_me') || localStorage.getItem('remember_me') !== 'true'){
	            	localStorage.removeItem('auth_users_name');
            		localStorage.removeItem('auth_users_last_name');
	            	localStorage.removeItem('auth_email');
	            	localStorage.removeItem('password');
	            	localStorage.removeItem('remember_me');
				}
            
				swal("Warning",response.data.message,"warning");
                	
				navHistory('/login');
				
            }else if(response.data.status === 422){//HTTP_UNPROCESSABLE_ENTITY
                swal("Warning",response.data.message,"warning");
            }else{//more errors
            }
            
			setIsLoading(false);
	
		}).catch(function (error) {
			console.log('[changeDefaultCheckListInDB - change_default_location] error: ',error + ' back-end api call error');
		
			setIsLoading(false);
				
			swal("Error",error,"error");
	                	
			navHistory('/weather');
		});
	}
	
	return(
		<OffCanvas width={300} transitionDuration={300} effect={"parallax"} isMenuOpened={isCheckListManagerOpen} position={"right"}>
			<OffCanvasBody>
				<div id="checkList_icon" className="p-0 m-0" ref={checkListIconRef}>
					<Link to="#" className="hover-opacity-50" onClick={toggleCheckListManager} onTouchEnd={toggleCheckListManager}>
						<img src={check_list_icon} className="br-5" width="40" alt="check list manager"/>
					</Link>
				</div>
			</OffCanvasBody>
			<OffCanvasMenu >
				<div id="check_list_manger" className="z-index-2100 bg-fafafa bl1-ccc pt-70l-110m-50s" style={{height:"2000px", overflow:"hidden"}} ref={checkListManagerRef}>
					<div className="clearfix p-10">
						{isLoading && 
						<span className="left"><LoadingSpinner paddingClass="none" /></span>
						}
						<Link to="#" className="button icon close-mobile-nav text-center right" onClick={toggleCheckListManager}  onTouchEnd={toggleCheckListManager} ref={closeCheckListFinderRef}>
							<img src={close_icon} className="" width="40" alt="add new city"/>
						</Link>
					</div>
					<div className="clearfix bt1-ccc ptb-10 mlr-10">
						<span className="left"><input type="text" className="medium" value={newCheckList.name} name="newCheckList" onChange={handleInputChange}  placeholder="My Shopping  List" /></span>
						<span className="right">
						{isSaving ? (
							<span className="button icon disabled">
								<img src={plus_icon} width="40" alt="add new location"/>
							</span>
						) : (
							<Link onMouseDown={handleSaveNewCheckList} onTouchStart={handleSaveNewCheckList} className="button icon">
								<img src={plus_icon} width="40" alt="add new location"/>
							</Link>
						)}
						</span>
					</div>
					<div className="location-info text-left">{newCheckList.info}</div>
		
					{checkLists.length > 0 ? ( 
					<div className="bt1-ccc ptb-5 mlr-10">
			        	{checkLists.map((checkList, i) => (
							<div key={i} className="clearfix vertical-center-content">
							<span key={'symbol_'+i} className="left">
								{checkList.default ? (
								<Button onClick={() => handleChangeDefaultCheckList(i)} onTouchEnd={() => handleChangeDefaultCheckList(i)} variant="text" style={{ width:220, justifyContent: 'flex-start', textTransform: 'none'}}>
		            			<DoneIcon style={{ color: '#10A37F' }} /><span className="font-raleway font-weight-600 txt-green">{shortenString(checkList.name)}</span>
		            			</Button>
								) : (
								<Button onClick={() => handleChangeDefaultCheckList(i)} onTouchEnd={() => handleChangeDefaultCheckList(i)} variant="text" style={{ width:220, justifyContent: 'flex-start', textTransform: 'none'}}>
		            			<DoneIcon /><span className="font-raleway font-weight-600 txt-333">{shortenString(checkList.name)}</span>
		            			</Button>
								)
								}
							</span>
							{isDeleting ? (
							<span key={'delete_'+i} className="right">
								<span className="opacity-50">
									<img src={delete_icon} className="" width="17" alt="delete check list"/>
								</span>
							</span>
							) : (
							<span key={'delete_'+i} className="right">
								<Link onClick={() => handleRemoveClick(i)} onTouchEnd={() => handleRemoveClick(i)}  className="hover-opacity-50">
									<img src={delete_icon} className="" width="17" alt="delete check list"/>
								</Link>
							</span>
							)}
							</div>
						))}
					</div>
					) : (
					<div className="font-raleway page-text font-weight-600 txt-dark-blue text-center ptb-20 bt1-ccc mlr-10">No Check Lists</div>
					)
					}
					
					<div className="text-center bt1-ccc ptb-20 mlr-10">
						<div className="font-raleway font-standard font-weight-500 txt-333 uppercase">&copy;&nbsp;2023 SMART UTIL</div>
						<div className="font-raleway font-small font-weight-400 txt-333  pt-10">Update: 02/07/2023</div>
					</div>
				</div>
			</OffCanvasMenu>
		</OffCanvas>
	);
	
}

export default CheckListManager;

function shortenString(str) {
  if (str.length > 24) {
    return str.substring(0, 24);
  } else {
    return str;
  }
}
