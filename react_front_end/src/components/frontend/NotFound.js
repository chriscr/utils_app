import React from 'react';
import { Link } from 'react-router-dom';

function NotFound(){
	
	var AuthLinks = '';
	
    if(localStorage.getItem('auth_users_name') && localStorage.getItem('auth_email')
	&& localStorage.getItem('auth_token') && localStorage.getItem('auth_role')){
		
		var dashboard_link;
		if(localStorage.getItem('auth_role') === 'admin'){
			dashboard_link = '/' + localStorage.getItem('auth_role') + '/dashboard';
		}else if(localStorage.getItem('auth_role') === 'member'){
			dashboard_link = '/' + localStorage.getItem('auth_role') + '/dashboard';
		}
		var profile_link = '/' + localStorage.getItem('auth_role') + '/profile';
		
		AuthLinks = (
			<div>
			<br/>
			<Link to={dashboard_link} className="font-raleway font-weight-600">Go to Dashboard</Link>
			<br/><br/>
			<Link to={profile_link} className="font-raleway font-weight-600">Go to Profile</Link>
			</div>
		)
	}
	
	return(
		<div className="body-content bg-fff pt-70l-110m-50s pb-40">
		
			<div className="panel large pt-20l-10s">
				<div className="grid-x">
			
					<div className="large-12 medium-12 small-12 cell text-left">
						<div className="font-raleway page-header font-weight-800 italic txt-dark-blue bb2-dark-blue uppercase pb-5">404 - Page Not Found!</div>
					</div>
					<div className="large-12 medium-12 small-12 cell text-left pt-20">
			    		<Link to="/home" className="font-raleway font-weight-600">Go Home</Link>
						{AuthLinks}
					</div>
				</div>
			</div>
		</div>
	);
}

export default NotFound;