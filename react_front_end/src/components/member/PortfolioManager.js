import React, {useState, useEffect, useRef} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { OffCanvas, OffCanvasMenu, OffCanvasBody } from "react-offcanvas";

import AuthUtility from '../frontend/auth/AuthUtility';
import LoadingSpinner from '../frontend/LoadingSpinner';

import DoneIcon from "@material-ui/icons/Done";
import {Button} from "@material-ui/core";

import $ from "jquery";
import axios from 'axios';
import swal from 'sweetalert';

import portfolio_icon from '../../assets/frontend/images/portfolio_icon.png';
import plus_icon from '../../assets/frontend/images/plus_icon_white.png';
import close_icon from '../../assets/frontend/images/close_icon_black.png';
import delete_icon from '../../assets/frontend/images/delete_red_light.png';

const PortfolioManager = ({ onPortfolioData, onPortfolioManagerOpen }) => {//sends portfolio data and boolean for opening/closing the manager
	
	const navHistory = useNavigate();
	
	//check if clicked target is not within the offcanvasnav
	const portfolioIconRef = useRef();
	const portfolioManagerRef = useRef();
	const closePortfolioManagerRef = useRef();
	
	// using hooks
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
	const [isPortfolioManagerOpen, setIsPortfolioManagerOpen] = useState(false);
	const [newPortfolio, setNewPortfolio] = useState({
		name: '',
		info: '',
	});
	const [portfolios, setPortfolios] = useState([]);
	
	//handles click outside slide out
	useEffect(() => {
		const handleClickOutside = (event) => {
			
			// add event listener to close menu when clicked outside		
			if (portfolioManagerRef.current && !portfolioManagerRef.current.contains(event.target)) {
				onPortfolioManagerOpen(false);
				setIsPortfolioManagerOpen(false);
			}
			
			//open nav with mobile icon click which is in the div id=navigation
			if (!isPortfolioManagerOpen && portfolioIconRef.current && portfolioIconRef.current.contains(event.target) && portfolioIconRef.current.id === 'portfolio_icon') {
				onPortfolioManagerOpen(true);
				setIsPortfolioManagerOpen(true);
			}
		}
		
		document.addEventListener("mousedown", handleClickOutside)
			
		return () => {
			// Cleanup the event listener
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [isPortfolioManagerOpen, onPortfolioManagerOpen]);
  
	// Initial call for user list items
	useEffect(() => {

		setIsLoading(true);
		
		if (isMounted) {
			
			console.log('[PortfolioManager - useEffect] mounted');
		
			axios.get('/api/read_portfolios', {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
				}
			}).then(response =>{
				if(response.data.status === 200){//HTTP_OK
				
					//set data
					if(response.data.portfolios){
						setPortfolios(response.data.portfolios);
					}
				
					onPortfolioManagerOpen(false);
					setIsPortfolioManagerOpen(false);
					
					onPortfolioData(response.data.default_portfolio, response.data.default_portfolio_data);
					setNewPortfolio({...newPortfolio, name: '', info: ''});
						
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
	                	
					navHistory('/login');
					
	            }else if(response.data.status === 422){//HTTP_UNPROCESSABLE_ENTITY
					onPortfolioData(null);
	            }else{//more errors
					onPortfolioData(null);
	            }
		
				setIsLoading(false);
				
			}).catch(function (error) {
				console.log('[PortfolioManager - useEffect] error: ',error + ' back-end api call error');
				
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
			
				setIsLoading(false);
				onPortfolioData(null);
				navHistory('/login');
			});
			
		}else {
	      setIsMounted(true);
	    }
		
	}, [isMounted]);

	const togglePortfolioManager = (event) => {
		event.preventDefault();
		
		onPortfolioManagerOpen(!isPortfolioManagerOpen);
		
		setIsPortfolioManagerOpen(!isPortfolioManagerOpen);
	}

    const handleInputChange = (event) => {
		event.stopPropagation();
		
        const { name, value } = event.target;
        
		setNewPortfolio({...newPortfolio, name: value, info: '',});

		$('.portfolio-info').removeClass('font-source-sans font-standard font-weight-600 txt-red plr-10 pb-10').addClass('font-source-sans font-small font-weight-400').html('');
    };
    
    const handleKeyDown = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault(); // Prevent form submission
			
			if (event.target.name === 'newPortfolio') {
		        const { name, value } = event.target;
		        
				setNewPortfolio({...newPortfolio, name: value, info: '',});
		
				$('.portfolio-info').removeClass('font-source-sans font-standard font-weight-600 txt-red plr-10 pb-10').addClass('font-source-sans font-small font-weight-400').html('');
				
				handleSaveNewPortfolio(event);
			}
		}
	};
  
    // Function to handle save
    const handleSaveNewPortfolio = (event) => {
		event.stopPropagation();
		
		if(newPortfolio.name){
			savePortfolio(newPortfolio.name);
		}else{
			setNewPortfolio({...newPortfolio, info: 'Error: Empty Portfolio Name'});
			
			$('.portfolio-info').removeClass('font-source-sans font-small font-weight-400').addClass('font-source-sans font-standard font-weight-600 txt-red plr-10 pb-10');
			
		}
    };
    
	function savePortfolio(portfolio_name){
		
		setIsLoading(true);
		setIsSaving(true);
			
		var data = {
			new_portfolio_name: portfolio_name,
		}
		
		axios.post('/api/save_portfolio', data, {
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
			}
		}).then(response =>{
			if(response.data.status === 200){//HTTP_OK
			
				//update all state properties
				if(response.data.portfolios){
					setPortfolios(response.data.portfolios);
					if(response.data.portfolios.length === 1){
						onPortfolioData(response.data.default_portfolio, response.data.default_portfolio_data);
						onPortfolioManagerOpen(!isPortfolioManagerOpen);
						setIsPortfolioManagerOpen(!isPortfolioManagerOpen);
					}
				}
				setNewPortfolio({...newPortfolio, name: '', info: ''});
					
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
				setNewPortfolio({...newPortfolio, info: 'Error: location does not exist.'});
			
				$('.portfolio-info').removeClass('font-source-sans font-small font-weight-400').addClass('font-source-sans font-standard font-weight-600 txt-red plr-10 pb-10');
			
            }else{//more errors
            }
            
			setIsLoading(false);
			setIsSaving(false);
	
		}).catch(function (error) {
			console.log('[savePortfolio] error: ',error + ' back-end api call error');
				
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
		
			setIsLoading(false);
			setIsSaving(false);
			swal("Error",error,"error");
			navHistory('/portfolio');
		});
		
	}
	
    // Delete row of id:i
    const handleRemoveClick = (i) => {
        const list = [...portfolios];

		if(list[i]['random_id'] && list[i]['random_id'] !== ''){
			deletePortfolio(list[i]['random_id']);//send a specific unique ID to delete
		}
    };
    
	function deletePortfolio(portfolio_random_id){
		
		setIsLoading(true);
		setIsDeleting(true);
		
		/*
		//values sent to api for an individual list item delete
		var data;
		if(portfolio_random_id && portfolio_random_id !== ''){
			data = {
				portfolio_random_id: portfolio_random_id,
			} 
		}
		*/
		axios.delete('/api/delete_portfolio/'+portfolio_random_id, {
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
			}
		}).then(response =>{
			if(response.data.status === 200){//HTTP_OK
			
				//update all state properties
				if(response.data.portfolios){
					setPortfolios(response.data.portfolios);
					if(response.data.portfolios.length === 1){
						onPortfolioManagerOpen(!isPortfolioManagerOpen);
						setIsPortfolioManagerOpen(!isPortfolioManagerOpen);
					}
				}else{//update by filtering it out
				    setPortfolios(oldPortfolios => {
				      return oldPortfolios.filter(portfolio => portfolio.random_id !== portfolio_random_id)
				    });
				}
				
				if(response.data.default_portfolio_data){
					onPortfolioData(response.data.default_portfolio, response.data.default_portfolio_data);
				}
				
				setNewPortfolio({...newPortfolio, name: '', info: ''});
					
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
			setIsDeleting(false);
	
		}).catch(function (error) {
			console.log('[deletePortfolio - delete_location] error: ',error + ' back-end api call error');
		
			setIsLoading(false);
			setIsDeleting(false);
			swal("Error",error,"error");
			navHistory('/portfolio');
		});
	}
	
    // Delete row of id:i
    const handleChangeDefaultPortfolio = (i) => {
        const list = [...portfolios];

		if(list[i]['random_id'] && list[i]['random_id'] !== ''){
			changeDefaultPortfolio(list[i]['random_id']);//send a specific unique ID to delete
		}
    };
    
	function changeDefaultPortfolio(portfolio_random_id){
		
		setIsLoading(true);
		
		/*
		//values sent to api for an individual list item delete
		var data;
		if(portfolio_random_id && portfolio_random_id !== ''){
			data = {
				default_portfolio_random_id: portfolio_random_id,
			} 
		}
		*/
	
		axios.put('/api/change_default_portfolio/'+portfolio_random_id, {
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
			}
		}).then(response =>{
			if(response.data.status === 200){//HTTP_OK
			
				//update all state properties
				if(response.data.portfolios){
					setPortfolios(response.data.portfolios);
				}
				onPortfolioData(response.data.default_portfolio, response.data.default_portfolio_data);
				setNewPortfolio({...newPortfolio, name: '', info: ''});
				
				onPortfolioManagerOpen(false);
				setIsPortfolioManagerOpen(false);
					
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
			console.log('[changeDefaultPortfolio] error: ',error + ' back-end api call error');
		
			setIsLoading(false);
			swal("Error",error,"error");
			navHistory('/portfolio');
		});
	}
	
	return(
		<OffCanvas width={300} transitionDuration={300} effect={"parallax"} isMenuOpened={isPortfolioManagerOpen} position={"right"}>
			<OffCanvasBody>
				<div id="portfolio_icon" className="p-0 m-0" ref={portfolioIconRef}>
					<Link to="#" className="hover-opacity-50" onClick={togglePortfolioManager} onTouchEnd={togglePortfolioManager}>
						<img src={portfolio_icon} className="br-5" width="40" alt="portfolio manager"/>
					</Link>
				</div>
			</OffCanvasBody>
			<OffCanvasMenu >
				<div id="portfolio_manager" className="z-index-2100 bg-fafafa bl1-ccc pt-70l-110m-50s" style={{height:"2000px", overflow:"hidden"}} ref={portfolioManagerRef}>
					<div className="clearfix p-10">
						{isLoading && 
						<span className="left"><LoadingSpinner paddingClass="none" /></span>
						}
						<Link to="#" className="button icon close-mobile-nav text-center right" onClick={togglePortfolioManager}  onTouchEnd={togglePortfolioManager} ref={closePortfolioManagerRef}>
							<img src={close_icon} className="" width="40" alt="add new city"/>
						</Link>
					</div>
					<div className="clearfix bt1-ccc ptb-10 mlr-10">
						<span className="left"><input type="text" className="medium" value={newPortfolio.name} name="newPortfolio" onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="My Portfolio" /></span>
						<span className="right">
						{isSaving ? (
							<span className="button icon disabled">
								<img src={plus_icon} width="40" alt="add new location"/>
							</span>
						) : (
							<Link onMouseDown={handleSaveNewPortfolio} onTouchStart={handleSaveNewPortfolio} className="button icon">
								<img src={plus_icon} width="40" alt="add new location"/>
							</Link>
						)}
						</span>
					</div>
					<div className="portfolio-info text-left">{newPortfolio.info}</div>
		
					{portfolios.length > 0 ? ( 
					<div className="ptb-5 bt1-ccc mlr-10">
			        	{portfolios.map((portfolio, i) => (
							<div key={i} className="clearfix vertical-center-content">
							<span key={'symbol_'+i} className="left">
							{portfolio.default ? (
							<Button onClick={() => handleChangeDefaultPortfolio(i)} onTouchEnd={() => handleChangeDefaultPortfolio(i)} variant="text" style={{ width:220, justifyContent: 'flex-start', textTransform: 'none'}}>
	            			<DoneIcon style={{ color: '#10A37F' }} /><span className="font-raleway font-weight-600 txt-green">{shortenString(portfolio.name)}</span>
	            			</Button>
							) : (
							<Button onClick={() => handleChangeDefaultPortfolio(i)} onTouchEnd={() => handleChangeDefaultPortfolio(i)} variant="text" style={{ width:220, justifyContent: 'flex-start', textTransform: 'none'}}>
	            			<DoneIcon /><span className="font-raleway font-weight-600 txt-333">{shortenString(portfolio.name)}</span>
	            			</Button>
							)
							}
							</span>
							{isDeleting ? (
							<span key={'delete_'+i} className="right">
								<span className="opacity-50">
									<img src={delete_icon} className="" width="17" alt="delete portfolio"/>
								</span>
							</span>
							) : (
							<span key={'delete_'+i} className="right">
								<Link onClick={() => handleRemoveClick(i)} onTouchEnd={() => handleRemoveClick(i)}  className="hover-opacity-50">
									<img src={delete_icon} className="" width="17" alt="delete portfolio"/>
								</Link>
							</span>
							)}
							</div>
						))}
					</div>
					) : (
					<div className="font-raleway page-text font-weight-600 txt-dark-blue text-center ptb-20 bt1-ccc mlr-10">No Portfolios</div>
					)
					}
					
					<div className="text-center bt1-ccc ptb-20 mlr-10">
						<div className="font-raleway font-standard font-weight-500 txt-333 uppercase">&copy;&nbsp;2023 UTILS APP</div>
						<div className="font-raleway font-small font-weight-400 txt-333 pt-10">Update: 02/07/2023</div>
					</div>
				</div>
			</OffCanvasMenu>
		</OffCanvas>
	);
	
}

export default PortfolioManager;

function shortenString(str) {
  if (str.length > 24) {
    return str.substring(0, 24);
  } else {
    return str;
  }
}
