import React, {useState, useEffect, useRef} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { OffCanvas, OffCanvasMenu, OffCanvasBody } from "react-offcanvas";

import LoadingSpinner from '../frontend/LoadingSpinner';

import DoneIcon from "@material-ui/icons/Done";

import {Button} from "@material-ui/core";

import $ from "jquery";
import axios from 'axios';
import swal from 'sweetalert';

import weather_icon from '../../assets/frontend/images/weather_icon.png';
import plus_icon from '../../assets/frontend/images/plus_icon_white.png';
import close_icon from '../../assets/frontend/images/close_icon_black.png';
import delete_icon from '../../assets/frontend/images/delete_red_light.png';

const WeatherLocationFinder = ({ onWeatherForecastData, onLocationFinderOpen }) => {//sends forecast data and boolean for opening/closing the location finder
	
	const navHistory = useNavigate();
	
	//check if clicked target is not within the offcanvasnav
	const locationIconRef = useRef();
	const locationFinderRef = useRef();
	const closeLocationFinderRef = useRef();
	
	// using hooks
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
	const [isLocationFinderOpen, setIsLocationFinderOpen] = useState(false);
	const [newLocation, setNewLocation] = useState({
			location: '',
			info: '',
			weatherData: [],
	});
	const [weatherLocations, setWeatherLocations] = useState([]);
	
	//handles click outside slide out location finder
	useEffect(() => {
		const handleClickOutside = (event) => {
			
			// add event listener to close menu when clicked outside		
			if (locationFinderRef.current && !locationFinderRef.current.contains(event.target)) {
				onLocationFinderOpen(false);
				setIsLocationFinderOpen(false);
			}
			
			//open nav with mobile icon click which is in the div id=navigation
			if (!isLocationFinderOpen && locationIconRef.current && locationIconRef.current.contains(event.target) && locationIconRef.current.id === 'location_icon') {
				onLocationFinderOpen(true);
				setIsLocationFinderOpen(true);
			}
		}
		
		document.addEventListener("mousedown", handleClickOutside)
			
		return () => {
			// Cleanup the event listener
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [isLocationFinderOpen, onLocationFinderOpen]);
  
	// Initial call for user list items
	useEffect(() => {
		
		setIsLoading(true);
		
		if (isMounted) {
			
			console.log('[WeatherLocationFinder - useEffect] mounted');

			axios.get('/api/read_weather_locations', {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
				}
			}).then(response =>{
				if(response.data.status === 200){//HTTP_OK
				
					//update all state properties
					if(response.data.locations){
						setWeatherLocations(response.data.locations);
					}
					
					onWeatherForecastData(response.data.weather_forecast_data, response.data.locations);
						
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
					onWeatherForecastData(null);
		
	            }else{//more errors
					onWeatherForecastData(null);
	            }
		
				setIsLoading(false);
				
			}).catch(function (error) {
				console.log('[WeatherLocationFinder - useEffect - read_locations] error: ',error + ' back-end api call error');
			
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
				
				onWeatherForecastData(null);
	                	
				navHistory('/login');
			});
			
		}else {
	      setIsMounted(true);
	    }
	    
	}, [isMounted]);

	const toggleLocationFinder = (event) => {
		event.preventDefault();
		
		onLocationFinderOpen(!isLocationFinderOpen);
		
		setIsLocationFinderOpen(!isLocationFinderOpen);
	}

    const handleInputChange = (event) => {
		event.stopPropagation();
		
        const { name, value } = event.target;
        
		setNewLocation({...newLocation, location: value, info: '',});

		$('.location-info').removeClass('font-source-sans font-standard font-weight-600 txt-red plr-10 pb-10').addClass('font-source-sans font-small font-weight-400').html('');
    };
  
    // Function to handle save
    const handleSaveNewLocation = (event) => {
		event.stopPropagation();
		
		if(newLocation.location){
			saveLocationFromDB(newLocation.location);
		}else{
			setNewLocation({...newLocation, info: 'Error: Empty Location'});
			
			$('.location-info').removeClass('font-source-sans font-small font-weight-400').addClass('font-source-sans font-standard font-weight-600 txt-red plr-10 pb-10');
			
		}
    };
    
	function saveLocationFromDB(location_name){
		
		setIsLoading(true);
		setIsSaving(true);
			
		var data = {
			new_location: location_name,
		}
		
		axios.post('/api/save_weather_location', data, {
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
			}
		}).then(response =>{
			if(response.data.status === 200){//HTTP_OK
			
				//update all state properties
				if(response.data.locations){
					setWeatherLocations(response.data.locations);
					if(response.data.locations.length === 1){
						onWeatherForecastData(response.data.weather_forecast_data);
						onLocationFinderOpen(!isLocationFinderOpen);
						setIsLocationFinderOpen(!isLocationFinderOpen);
					}
				}
				setNewLocation({...newLocation, location: '', info: '',});
					
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
				setNewLocation({...newLocation, info: 'Error: location does not exist.'});
			
				$('.location-info').removeClass('font-source-sans font-small font-weight-400').addClass('font-source-sans font-standard font-weight-600 txt-red plr-10 pb-10');
			
            }else{//more errors
            }
            
			setIsLoading(false);
			setIsSaving(false);
	
		}).catch(function (error) {
			console.log('[saveLocationFromDB2 - save_location] error: ',error + ' back-end api call error');
		
			setIsLoading(false);
			setIsSaving(false);
				
			swal("Error",error,"error");
	                	
			navHistory('/weather');
		});
		
	}
	
    // Delete row of id:i
    const handleRemoveClick = (i) => {
        const list = [...weatherLocations];

		if(list[i]['random_id'] && list[i]['random_id'] !== ''){
			deleteLocationFromDB(list[i]['random_id']);//send a specific unique ID to delete
		}
    };
    
	function deleteLocationFromDB(location_random_id){
		
		setIsLoading(true);
		setIsDeleting(true);
			
		//values sent to api for an individual list item delete
		var data;
		if(location_random_id && location_random_id !== ''){
			data = {
				location_random_id: location_random_id,
			} 
		}
	
		axios.delete('/api/delete_weather_location', data, {
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
			}
		}).then(response =>{
			if(response.data.status === 200){//HTTP_OK
			
				//update all state properties
				if(response.data.locations){
					setWeatherLocations(response.data.locations);
					if(response.data.locations.length === 1){
						onLocationFinderOpen(!isLocationFinderOpen);
						setIsLocationFinderOpen(!isLocationFinderOpen);
					}
				}
				onWeatherForecastData(response.data.weather_forecast_data);
				setNewLocation({...newLocation, location: '', info: '',});
					
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
			console.log('[deleteLocationFromDB - delete_location] error: ',error + ' back-end api call error');
		
			setIsLoading(false);
			setIsDeleting(false);
				
			swal("Error",error,"error");
	                	
			navHistory('/weather');
		});
	}
	
    // Delete row of id:i
    const handleChangeDefaultLocation = (i) => {
        const list = [...weatherLocations];

		if(list[i]['random_id'] && list[i]['random_id'] !== ''){
			changeDefaultLocationInDB(list[i]['random_id']);//send a specific unique ID to delete
		}
    };
    
	function changeDefaultLocationInDB(location_random_id){
		
		setIsLoading(true);
			
		//values sent to api for an individual list item delete
		var data;
		if(location_random_id && location_random_id !== ''){
			data = {
				default_location_random_id: location_random_id,
			} 
		}
	
		axios.put('/api/change_default_weather_location', data, {
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
			}
		}).then(response =>{
			if(response.data.status === 200){//HTTP_OK
			
				//update all state properties
				if(response.data.locations){
					setWeatherLocations(response.data.locations);
				}
				onWeatherForecastData(response.data.weather_forecast_data);
				setNewLocation({...newLocation, location: '', info: '',});
				
				onLocationFinderOpen(false);
				setIsLocationFinderOpen(false);
					
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
			console.log('[changeDefaultLocationInDB - change_default_location] error: ',error + ' back-end api call error');
		
			setIsLoading(false);
				
			swal("Error",error,"error");
	                	
			navHistory('/weather');
		});
	}
	
	return(
		<OffCanvas width={300} transitionDuration={300} effect={"parallax"} isMenuOpened={isLocationFinderOpen} position={"right"}>
			<OffCanvasBody>
				<div id="location_icon" className="p-0 m-0" ref={locationIconRef}>
					<Link to="#" className="hover-opacity-50" onClick={toggleLocationFinder} onTouchEnd={toggleLocationFinder}>
						<img src={weather_icon} className="br-5" width="40" alt="location finder"/>
					</Link>
				</div>
			</OffCanvasBody>
			<OffCanvasMenu >
				<div id="location_finder" className="z-index-2100 bg-fafafa bl1-ccc pt-70l-110m-50s" style={{height:"2000px", overflow:"hidden"}} ref={locationFinderRef}>
					<div className="clearfix p-10">
						{isLoading && 
						<span className="left"><LoadingSpinner paddingClass="none" /></span>
						}
						<Link to="#" className="button icon close-mobile-nav text-center right" onClick={toggleLocationFinder}  onTouchEnd={toggleLocationFinder} ref={closeLocationFinderRef}><img src={close_icon} className="" width="40" alt="add new city"/></Link>
					</div>
					<div className="clearfix bt1-ccc ptb-10 mlr-10">
						<span className="left"><input type="text" className="medium" value={newLocation.location} name="newLocation" onChange={handleInputChange}  placeholder="San Francisco, CA" /></span>
						<span className="right">
						{isSaving ? (
							<span className="button icon disabled">
								<img src={plus_icon} width="40" alt="add new location"/>
							</span>
						) : (
							<Link onMouseDown={handleSaveNewLocation} onTouchStart={handleSaveNewLocation} className="button icon">
								<img src={plus_icon} width="40" alt="add new location"/>
							</Link>
						)}
						</span>
					</div>
					<div className="location-info text-left">{newLocation.info}</div>
		
					{weatherLocations.length > 0 ? ( 
					<div className="ptb-5 bt1-ccc mlr-10">
			        	{weatherLocations.map((location, i) => (
							<div key={i} className="clearfix vertical-center-content">
							<span key={'name_'+i} className="left">
							{location.default ? (
							<Button onClick={() => handleChangeDefaultLocation(i)} onTouchEnd={() => handleChangeDefaultLocation(i)} variant="text" style={{ width:220, justifyContent: 'flex-start', textTransform: 'none'}}>
	            			<DoneIcon style={{ color: '#10A37F' }} /><span className="font-raleway font-weight-600 txt-green">{shortenString(location.name)}</span>
	            			</Button>
							) : (
							<Button onClick={() => handleChangeDefaultLocation(i)} onTouchEnd={() => handleChangeDefaultLocation(i)} variant="text" style={{ width:220, justifyContent: 'flex-start', textTransform: 'none'}}>
	            			<DoneIcon /><span className="font-raleway font-weight-600 txt-333">{shortenString(location.name)}</span>
	            			</Button>
							)
							}
							</span>
							{isDeleting ? (
							<span key={'delete_'+i} className="right">
								<span className="opacity-50">
									<img src={delete_icon} className="" width="20" alt="delete location"/>
								</span>
							</span>
							) : (
							<span key={'delete_'+i} className="right">
								<Link onClick={() => handleRemoveClick(i)} onTouchEnd={() => handleRemoveClick(i)}  className="hover-opacity-50">
									<img src={delete_icon} className="" width="20" alt="delete location"/>
								</Link>
							</span>
							)}
							</div>
						))}
					</div>
					) : (
					<div className="font-raleway page-text font-weight-600 txt-dark-blue text-center ptb-20 bt1-ccc mlr-10">No Locations</div>
					)
					}
					
					<div className="text-center bt1-ccc ptb-20 mlr-10">
						<div className="font-raleway font-standard font-weight-500 txt-333 uppercase">&copy;&nbsp;2023 SMART UTIL</div>
						<div className="font-raleway font-small font-weight-400 txt-333 pt-10">Update: 02/07/2023</div>
					</div>
				</div>
			</OffCanvasMenu>
		</OffCanvas>
	);
	
}

export default WeatherLocationFinder;

function shortenString(str) {
  if (str.length > 24) {
    return str.substring(0, 24);
  } else {
    return str;
  }
}
