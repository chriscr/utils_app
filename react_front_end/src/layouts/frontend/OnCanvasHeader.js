import React from 'react';
import {Link, useNavigate} from 'react-router-dom';

import axios from 'axios';

import logo from '../../assets/frontend/images/logo.png';

import OffCanvasNav from './OffCanvasNav';

const OnCanvasHeader = () => {
	
	//logout should be its own component
	const navHistory = useNavigate();

	const logoutSubmit = (event) => {
		event.preventDefault();
		
		axios.get('/api/logout').then(response =>{
			if(response.data.status === 200){//success
			
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_role');

				if(!localStorage.getItem('remember_me') || localStorage.getItem('remember_me') !== 'true'){
                	localStorage.removeItem('auth_users_name');
                	localStorage.removeItem('auth_users_last_name');
                	localStorage.removeItem('auth_email');
                	localStorage.removeItem('password');
				}
				
				//redirect to home page
				navHistory('/');
            }else if(response.data.status === 401){//user was not logged in

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
            }else{
				console.log('Error 40X: api call failed');
            }
		}).catch(function (error) {
			console.log('[logoutSubmit - logout] error: ',error + ' back-end api call error');
			
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
		});
	}

	var RoleDashboardLink = '';
	var RoleProfileLink = '';
	var UtilDashLinks = '';
	var Navigation = '';

    if(localStorage.getItem('auth_users_name') && localStorage.getItem('auth_email')
	&& localStorage.getItem('auth_token') && localStorage.getItem('auth_role')){
		
		RoleProfileLink = '/' + localStorage.getItem('auth_role') + '/profile';
		if(localStorage.getItem('auth_role') === 'member'){
			RoleDashboardLink = '/member/dashboard';
			RoleProfileLink = '/member/profile';
			
			UtilDashLinks = (
				<ul>
					<li className="util-dash"><Link to="/member/check_list" className="font-raleway font-small font-weight-500 uppercase">Check List</Link></li>
					<li className="util-dash"><Link to="/member/portfolio" className="font-raleway font-small font-weight-500 uppercase">Portfolio</Link></li>
					<li className="util-dash"><Link to="/member/traffic" className="font-raleway font-small font-weight-500 uppercase">Traffic</Link></li>
					<li className="util-dash"><Link to="/member/weather" className="font-raleway font-small font-weight-500 uppercase">Weather</Link></li>
				</ul>
			);
		}else if(localStorage.getItem('auth_role') === 'admin'){
			RoleDashboardLink = '/member/dashboard';
			RoleProfileLink = '/admin/profile';
			
			UtilDashLinks = (
				<ul>
					<li className="util-dash"><Link to="/admin/users" className="font-raleway font-small font-weight-500 uppercase">Users</Link></li>
					<li className="util-dash"><Link to="/admin/check_list" className="font-raleway font-small font-weight-500 uppercase">Check List</Link></li>
					<li className="util-dash"><Link to="/admin/portfolio" className="font-raleway font-small font-weight-500 uppercase">Portfolio</Link></li>
					<li className="util-dash"><Link to="/admin/traffic" className="font-raleway font-small font-weight-500 uppercase">Traffic</Link></li>
					<li className="util-dash"><Link to="/admin/weather" className="font-raleway font-small font-weight-500 uppercase">Weather</Link></li>
				</ul>
			);
		}
	
		Navigation = (
			<nav className="nav right">
				<ul>
					<li className="dropdown text-center">
						<Link to="/home" className="home font-raleway font-small font-weight-500 uppercase">Home</Link>
						<ul>
							<li className="home"><Link to="/about" className="home font-raleway font-small font-weight-500 uppercase">About</Link></li>
							<li className="home"><Link to="/contact" className="home font-raleway font-small font-weight-500 uppercase">Contact</Link></li>
							<li className="home"><Link to="/help" className="home font-raleway font-small font-weight-500 uppercase">Help</Link></li>
							<li className="home"><Link to="/technical_highlights" className="home font-raleway font-small font-weight-500 uppercase">Technical</Link></li>
						</ul>
					</li>
					<li className="dropdown text-center">
						<Link to={RoleDashboardLink}  className="util-dash font-raleway font-small font-weight-500 uppercase">Utilities</Link>
						{UtilDashLinks}
					</li>
					<li className="dropdown text-center">
						<Link to={RoleProfileLink} className="username font-raleway font-small font-weight-500 uppercase">{localStorage.getItem('auth_users_name')}</Link>
						<ul>
							<li className="username"><Link to={RoleProfileLink} className="home font-raleway font-small font-weight-500 uppercase">Profile</Link></li>
							<li className="username"><Link to="#" className="home font-raleway font-small font-weight-500 uppercase" onClick={logoutSubmit}>Logout</Link></li>
						</ul>
					</li>
				</ul>
			</nav>
		);
	}else{
	
		Navigation = (
			<nav className="nav right">
				<ul>
					<li className="home"><Link to="/login" className="font-raleway font-small font-weight-500 uppercase">Login</Link></li>
					<li className="home"><Link to="/register" className="font-raleway font-small font-weight-500 uppercase">Register</Link></li>
					<li className="dropdown text-center">
						<Link to="/home" className="home font-raleway font-small font-weight-500 uppercase">Home</Link>
						<ul>
							<li className="home"><Link to="/about" className="home font-raleway font-small font-weight-500 uppercase">About</Link></li>
							<li className="home"><Link to="/contact" className="home font-raleway font-small font-weight-500 uppercase">Contact</Link></li>
							<li className="home"><Link to="/help" className="home font-raleway font-small font-weight-500 uppercase">Help</Link></li>
							<li className="home"><Link to="/technical_highlights" className="home font-raleway font-small font-weight-500 uppercase">Technical</Link></li>
						</ul>
					</li>
				</ul>
			</nav>
		);
	}

	return(
		<div className="sticky-by-cr">
			<div className="sticky bg-fafafa bb1-ddd plr-20l-10s">
				
				<div className="panel">
				
					<div id="nav_bar" className="nav-bar">
						<div className="nav-bar-left">
							<div className="clearfix">
								<Link to="/" className="hover-opacity-50 hide-for-small-only">
									<span className="left">
										<img src={logo} alt="logo" width="50"/>
									</span>
									<span className="text-left pl-10 left">
										<div className="font-raleway font-x-large font-weight-800 italic txt-dark-blue bb2-dark-blue uppercase pb-5">UTILS APP</div>
										<div className="font-raleway font-standard font-weight-600 italic txt-dark-blue letter-spacing-0px uppercase pt-10">
										<span className="txt-coral">Demo Tools</span>
										</div>
									</span>
								</Link>
								<Link to="/" className="hover-opacity-50 show-for-small-only">
									<span className="left">
										<img src={logo} alt="logo" width="40"/>
									</span>
									<span className="text-left pl-7 left">
										<div className="font-raleway font-medium font-weight-800 italic txt-dark-blue bb2-dark-blue uppercase pb-3">UTILS APP</div>
										<div className="font-raleway font-small font-weight-600 italic txt-dark-blue letter-spacing-0px uppercase pt-7">
										<span className="txt-coral">Demo Tools</span>
										</div>
									</span>
								</Link>
							</div>
						</div>
						<div className="nav-bar-right  hide-for-small-only">
							{Navigation}
						</div>
						<div className="nav-bar-right show-for-small-only">
							<OffCanvasNav />
						</div>
					</div>
				</div>
			
			</div>
		</div>
	);
}

export default OnCanvasHeader;