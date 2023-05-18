import React, {useState, useEffect, useRef} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { OffCanvas, OffCanvasMenu, OffCanvasBody } from "react-offcanvas";

import AuthUtility from '../../components/frontend/auth/AuthUtility';

import axios from 'axios';

//import mobile_icon from '../../assets/frontend/images/mobile_icon_white_2.png';
import close_icon from '../../assets/frontend/images/close_icon_black.png';

const OffCanvasNav = () => {
	
	//check if clicked target is not within the offcanvasnav
	const mobileIconRef = useRef();
	const navRef = useRef();
	const closeNavRef = useRef();
	
	//logout should be its own component
	const navHistory = useNavigate();
	
	// using hooks
	const [isNavOpen, setIsNavOpen] = useState(false);
	const [isHomeOpen, setIsHomeOpen] = useState(false);
	const [isUtilitiesOpen, setIsUtilitiesOpen] = useState(false);
	const [isUsersnameOpen, setIsUsersnameOpen] = useState(false);
	
	useEffect(() => {
		const handleClickOutside = (event) => {
			
			// add event listener to close menu when clicked outside		
			if (navRef.current && !navRef.current.contains(event.target)) {
				setIsNavOpen(false);
			}
			
			//open nav with mobile icon click which is in the div id=navigation
			if (!isNavOpen && mobileIconRef.current && mobileIconRef.current.contains(event.target) && mobileIconRef.current.id === 'mobile_icon') {
				setIsNavOpen(true);
			}
		}
		
		document.addEventListener("mousedown", handleClickOutside)
			
		return () => {
			// Cleanup the event listener
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [isNavOpen]);

	const toggleNav = (event) => {
		event.preventDefault();
		
		setIsNavOpen(!isNavOpen);
	}

	const toggleMenuItem = (event) => {
		event.stopPropagation();
			
		//open nav with mobile icon click which is in the div id=navigation
		if (event.target.id === 'home') {
			setIsHomeOpen(!isHomeOpen);
		}else if (event.target.id === 'utilities') {
			setIsUtilitiesOpen(!isUtilitiesOpen);
		}else if (event.target.id === 'usersname') {
			setIsUsersnameOpen(!isUsersnameOpen);
		}
	};

	const handleMenuLinkItemClick = (event) => {
		event.stopPropagation();
		
		// close menu when submenu link item is clicked
		setIsNavOpen(false);
	};
	
	const logoutSubmit = (event) => {
		event.preventDefault();
		
		axios.get('/api/logout').then(response =>{
			if(response.data.status === 200){//HTTP_OK
			
				//user logged out on server so remove from local storage
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
				
				//redirect to home page
				navHistory('/');
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
            }else{
				console.log('Error 4**: api call failed');
            }
		}).catch(function (error) {
			console.log('[logoutSubmit] error: ',error + ' back-end api call error');

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
		});
	}

	var RoleProfileLink = '';
	var HomeLinks = '';
	var UtilDashLinks = '';
	var RoleLinks = '';
	var AuthButtons = '';
	
	var submenuLinkPadding = (
		<span className="pl-25"></span>
	);

    if(localStorage.getItem('auth_users_name') && localStorage.getItem('auth_email')
	&& localStorage.getItem('auth_token') && localStorage.getItem('auth_role')){
		
		HomeLinks = (
			<ul className="menu-mobile-nav pt-5">
				<li className={isHomeOpen ? 'submenu-active' : ''}><Link id="home" className="uppercase" onClick={toggleMenuItem} onTouchEnd={toggleMenuItem}>Website</Link>
					<ul className="submenu-mobile-nav">
						<li><Link to="/" className="uppercase" onClick={handleMenuLinkItemClick} onTouchEnd={handleMenuLinkItemClick} >{submenuLinkPadding}Home</Link></li>
						<li><Link to="/about" className="uppercase" onClick={handleMenuLinkItemClick} onTouchEnd={handleMenuLinkItemClick} >{submenuLinkPadding}About</Link></li>
						<li><Link to="/contact" className="uppercase" onClick={handleMenuLinkItemClick} onTouchEnd={handleMenuLinkItemClick} >{submenuLinkPadding}Contact</Link></li>
						<li><Link to="/help" className="uppercase" onClick={handleMenuLinkItemClick} onTouchEnd={handleMenuLinkItemClick} >{submenuLinkPadding}Help</Link></li>
						<li><Link to="/technical_highlights" className="uppercase" onClick={handleMenuLinkItemClick} onTouchEnd={handleMenuLinkItemClick} >{submenuLinkPadding}Technical</Link></li>
						<li><Link to="/instructions" className="uppercase" onClick={handleMenuLinkItemClick} onTouchEnd={handleMenuLinkItemClick} >{submenuLinkPadding}Instructions</Link></li>
					</ul>
				</li>
			</ul>
		);

		if(localStorage.getItem('auth_role') === 'member'){
			RoleProfileLink = '/member/profile';
			
			UtilDashLinks = (
				<ul className="menu-mobile-nav pt-5">
					<li className={isUtilitiesOpen ? 'submenu-active' : ''}><Link id="utilities" className="uppercase" onClick={toggleMenuItem} onTouchEnd={toggleMenuItem}>Utilities</Link>
						<ul className="submenu-mobile-nav">
							<li><Link to="/member/dashboard" className="uppercase" onClick={handleMenuLinkItemClick} onTouchEnd={handleMenuLinkItemClick} >{submenuLinkPadding}Dashboard</Link></li>
							<li><Link to="/member/check_list" className="uppercase" onClick={handleMenuLinkItemClick} onTouchEnd={handleMenuLinkItemClick} >{submenuLinkPadding}Check List</Link></li>
							<li><Link to="/member/portfolio" className="uppercase" onClick={handleMenuLinkItemClick} onTouchEnd={handleMenuLinkItemClick} >{submenuLinkPadding}Portfolio</Link></li>
							<li><Link to="/member/traffic" className="uppercase" onClick={handleMenuLinkItemClick} onTouchEnd={handleMenuLinkItemClick} >{submenuLinkPadding}Traffic</Link></li>
							<li><Link to="/member/weather" className="uppercase" onClick={handleMenuLinkItemClick} onTouchEnd={handleMenuLinkItemClick} >{submenuLinkPadding}Weather</Link></li>
							<li><Link to="/member/videos" className="uppercase" onClick={handleMenuLinkItemClick} onTouchEnd={handleMenuLinkItemClick} >{submenuLinkPadding}Videos</Link></li>
							<li><Link to="/member/payemtns" className="uppercase" onClick={handleMenuLinkItemClick} onTouchEnd={handleMenuLinkItemClick} >{submenuLinkPadding}Payments</Link></li>
						</ul>
					</li>
				</ul>
			);
		}else if(localStorage.getItem('auth_role') === 'admin'){
			RoleProfileLink = '/admin/profile';
			
			UtilDashLinks = (
				<ul className="menu-mobile-nav pt-5">
					<li className={isUtilitiesOpen ? 'submenu-active' : ''}><Link id="utilities" className="uppercase" onClick={toggleMenuItem} onTouchEnd={toggleMenuItem}>Utilities</Link>
						<ul className="submenu-mobile-nav">
							<li><Link to="/admin/dashboard" className="uppercase" onClick={handleMenuLinkItemClick} onTouchEnd={handleMenuLinkItemClick} >{submenuLinkPadding}Dashboard</Link></li>
							<li><Link to="/admin/users" className="uppercase" onClick={handleMenuLinkItemClick} onTouchEnd={handleMenuLinkItemClick} >{submenuLinkPadding}Users</Link></li>
							<li><Link to="/admin/check_list" className="uppercase" onClick={handleMenuLinkItemClick} onTouchEnd={handleMenuLinkItemClick} >{submenuLinkPadding}Check List</Link></li>
							<li><Link to="/admin/portfolio" className="uppercase" onClick={handleMenuLinkItemClick} onTouchEnd={handleMenuLinkItemClick} >{submenuLinkPadding}Portfolio</Link></li>
							<li><Link to="/admin/traffic" className="uppercase" onClick={handleMenuLinkItemClick} onTouchEnd={handleMenuLinkItemClick} >{submenuLinkPadding}Traffic</Link></li>
							<li><Link to="/admin/weather" className="uppercase" onClick={handleMenuLinkItemClick} onTouchEnd={handleMenuLinkItemClick} >{submenuLinkPadding}Weather</Link></li>
						</ul>
					</li>
				</ul>
			);
		}
		
		RoleLinks = (
			<ul className="menu-mobile-nav">
				<li className={isUsersnameOpen ? 'submenu-active' : ''}><Link id="usersname" className="uppercase" onClick={toggleMenuItem} onTouchEnd={toggleMenuItem}>{localStorage.getItem('auth_users_name')}</Link>
					<ul className="submenu-mobile-nav">
						<li><Link to={RoleProfileLink} className="uppercase" onClick={handleMenuLinkItemClick} onTouchEnd={handleMenuLinkItemClick} >{submenuLinkPadding}Profile</Link></li>
						<li><Link to="#" className="uppercase" onClick={logoutSubmit} onTouchEnd={logoutSubmit}>{submenuLinkPadding}Logout</Link></li>
					</ul>
				</li>
			</ul>
		);
	}else{
        AuthButtons = (
			<ul className="menu-mobile-nav">
				<li><Link to="/login" className="uppercase" onClick={handleMenuLinkItemClick} onTouchEnd={handleMenuLinkItemClick} >Login</Link></li>
				<li><Link to="/register" className="uppercase" onClick={handleMenuLinkItemClick} onTouchEnd={handleMenuLinkItemClick} >Register</Link></li>
				<li><Link to="/" className="uppercase" onClick={handleMenuLinkItemClick} onTouchEnd={handleMenuLinkItemClick} >Home</Link></li>
				<li><Link to="/about" className="uppercase" onClick={handleMenuLinkItemClick} onTouchEnd={handleMenuLinkItemClick} >About</Link></li>
				<li><Link to="/contact" className="uppercase" onClick={handleMenuLinkItemClick} onTouchEnd={handleMenuLinkItemClick} >Contact</Link></li>
				<li><Link to="/help" className="uppercase" onClick={handleMenuLinkItemClick} onTouchEnd={handleMenuLinkItemClick} >Help</Link></li>
				<li><Link to="/technical_highlights" className="uppercase" onClick={handleMenuLinkItemClick} onTouchEnd={handleMenuLinkItemClick} >Technical</Link></li>
				<li><Link to="/instructions" className="uppercase" onClick={handleMenuLinkItemClick} onTouchEnd={handleMenuLinkItemClick} >Instructions</Link></li>
			</ul>
		);
	}
	
	return(
		<OffCanvas width={200} transitionDuration={300} effect={"parallax"} isMenuOpened={isNavOpen} position={"right"}>
			<OffCanvasBody>
				<div id="mobile_icon" className="" ref={mobileIconRef}>
					<button className="button mobile-icon right" type="button" onClick={toggleNav} onTouchEnd={toggleNav}>
						<div className="hamburger-mobile-nav">
						  <span className="bar"></span>
						  <span className="bar"></span>
						  <span className="bar"></span>
						</div>
					</button>
				</div>
			</OffCanvasBody>
			<OffCanvasMenu>
				<div id="mobile_nav" className="bg-fafafa bl1-ccc" ref={navRef}>
					<div className="clearfix pt-10 pr-10">
						<Link to="#" className="button icon close-mobile-nav text-center right" onClick={toggleNav} onTouchEnd={toggleNav} ref={closeNavRef}><img src={close_icon} className="" width="30" alt="close navigation"/></Link>
					</div>
					<div className="p-10">
						{RoleLinks}
						{UtilDashLinks}
						{HomeLinks}
						{AuthButtons}
					</div>
		
					<div className="text-center bt1-ccc ptb-20 mlr-10">
						<div className="font-raleway font-standard font-weight-500 txt-333 uppercase">&copy;&nbsp;2023 UTILS APP</div>
						<div className="font-raleway font-small font-weight-400 txt-333  pt-10">Update: 03/21/2023</div>
					</div>
				</div>
			</OffCanvasMenu>
		</OffCanvas>
	);
	
}

export default OffCanvasNav;