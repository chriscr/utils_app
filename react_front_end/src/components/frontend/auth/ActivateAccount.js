import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {useNavigate, useParams} from 'react-router-dom';

import LoadingSpinner from '../LoadingSpinner';

import axios from 'axios';
import swal from 'sweetalert';

function ActivateAccount(){

	const navHistory = useNavigate();

	// using hooks
    const [isLoading, setIsLoading] = React.useState(false);
    const [isMounted, setIsMounted] = useState(false);
	const [isActivated, setIsActivated] = useState(false);
	const [navPath, setNavPath] = useState('');
	
	const { id } = useParams();
  
	// Initial call to activate account
	useEffect(() => {
		
		setIsLoading(true);
		
		if (isMounted) {
	
			//values sent to api
			const data = {
				random_id: id,
			}
	
			axios.get('/sanctum/csrf-cookie').then(response1 => {// CSRF Protection through Laravel
				axios.put('/api/activate_account', data).then(response2 =>{
					if(response2.data.status === 200){//HTTP_OK
					
						//update all state properties
	                    localStorage.setItem('auth_users_name', response2.data.auth_users_name);
	                    localStorage.setItem('auth_users_last_name', response2.data.auth_users_last_name);
	                    localStorage.setItem('auth_email', response2.data.auth_email);
	                    localStorage.setItem('auth_token', response2.data.auth_token);
	                    localStorage.setItem('auth_role', response2.data.auth_role);
						
						if(localStorage.getItem('auth_role') === 'member'){
							setNavPath('/member/dashboard');
						}else if(localStorage.getItem('auth_role') === 'admin'){
							setNavPath('/admin/dashboard');
						}
		
						setIsActivated(true);
							
		            }else if(response2.data.status === 401 || response2.data.status === 404){//HTTP_UNAUTHORIZED OR HTTP_NOT_FOUND
		            
						//user not authenticated or not found on server so remove from local storage
		                localStorage.removeItem('auth_token');
		                localStorage.removeItem('auth_role');
		
						if(!localStorage.getItem('remember_me')){
		                	localStorage.removeItem('auth_users_name');
	                		localStorage.removeItem('auth_users_last_name');
		                	localStorage.removeItem('auth_email');
		                	localStorage.removeItem('password');
						}
	                
						swal("Warning",response2.data.message + ' Can not activate account. Please click on the link in your email after registering.',"warning");
		                	
						navHistory('/login');
	
					}else{//more errors
	
					}
			
					setIsLoading(false);
					
				}).catch(function (error) {
					console.log('[useEffect - activate_account] error: ',error + ' back-end api call error');
					
					setIsLoading(false);
						
					swal("Error",error,"error");
			                	
					navHistory('/activate_account/'+id);
				
				});
			}).catch(function (error) {
				//csrf-cookie is outdated
				console.log('[useEffect - activate_account] error: ',error + ' csrf-cookie is outdated');
			
				setIsLoading(false);
				
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
					
				swal("Error",error,"error");
		                	
				navHistory('/login');
			});
			
		}else {
	      setIsMounted(true);
	    }
		
	}, [isMounted, id, navHistory]);

	return(
		<div className="body-content bg-fff pt-70l-110m-50s pb-40">
		
			<div className="panel large pt-20l-10s">
				<div className="grid-x">
			
					<div className="large-12 medium-12 small-12 cell text-left">
						<div className="font-raleway page-header font-weight-800 italic txt-dark-blue bb2-dark-blue uppercase pb-5">Activate Account</div>
					</div>
				
					{isLoading && 
					<div className="large-12 medium-12 small-12 cell text-center">
					<LoadingSpinner paddingClass="p-20l-10s" />
					</div>
					}
					{isActivated && 
					<div className="large-12 medium-12 small-12 cell text-left pt-20">
						<table className="unstriped unbordered mb-0">
							<tbody>
							<tr><td className="font-raleway font-weight-400 width-75px pb20">Name:</td><td className="font-raleway font-weight-600 pb-20">{localStorage.getItem('auth_users_name')}</td></tr>
							<tr><td className="font-raleway font-weight-400 width-75px pb20">Email:</td><td className="font-raleway font-weight-600 pb-20">{localStorage.getItem('auth_email')}</td></tr>
							<tr><td className="font-raleway font-weight-400 width-75px pb20">Role:</td><td className="font-raleway font-weight-600 pb-20">{localStorage.getItem('auth_role')}</td></tr>
							<tr><td className="font-raleway font-weight-400 width-75px">Status:</td><td className="font-raleway font-weight-600">Activated</td></tr>
							</tbody>
						</table>
						<div className="text-center pt-40">
							<Link to={navPath} className="button width-125px uppercase">DASHBOARD</Link>
						</div>
					</div>
					}
				</div>
			</div>
			
		</div>
	);
}

export default ActivateAccount;