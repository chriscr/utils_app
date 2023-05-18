import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {useNavigate, useParams } from 'react-router-dom';

import AuthUtility from './AuthUtility';
import LoadingSpinner from '../LoadingSpinner';

import axios from 'axios';
import swal from 'sweetalert';

const error_style = 'font-raleway font-s font-weight-500 txt-error bg-error p-5';

function ResetPassword(){
	
	const navHistory = useNavigate();

	// using hooks
    const [isLoading, setIsLoading] = React.useState(false);
	const [resetPasswordInput, setResetPassword] = useState({
		password: '',
		errorList: [],
		errorStyle: [],
	});
	
	const { id, email } = useParams();
	
	const handleInput = (event) => {
		event.persist();
		
		setResetPassword({...resetPasswordInput, [event.target.name]: event.target.value });
		
		//remove the target error message no matter the new input, it will be validated on the server
		if (resetPasswordInput.errorList.hasOwnProperty(event.target.name)){
			delete resetPasswordInput.errorList[event.target.name];
			delete resetPasswordInput.errorStyle[event.target.name];
		}
	}

	const resetPasswordSubmit = (event) => {
		event.preventDefault();
		
		setIsLoading(true);
			
		//values sent to api
		const data = {
			email: email,
			password: resetPasswordInput.password,
			random_id: id,
		}
		
		axios.get('/sanctum/csrf-cookie').then(response1 => {// CSRF Protection through Laravel
			axios.put('/api/reset_password', data).then(response2 =>{
				if(response2.data.status === 200){//HTTP_OK
				
					if(localStorage.getItem('remember_me') === 'true'){
                		localStorage.setItem('password', resetPasswordInput.password);
                	}

                    swal("Success",response2.data.message + ' Please login.',"success");
                    navHistory('/login');
					
                }else if(response2.data.status === 404){//HTTP_NOT_FOUND
                
					swal("Warning",response2.data.message + ' Can not reset the password. Please click on the link in your email with the subject "Reset Password with FAST AI".',"warning");
	                	
				}else if(response2.data.status === 800){//HTTP_FORM_VALIDATION_FAILED
				
					var errorStyleTemp = JSON.parse(JSON.stringify(response2.data.validation_errors));
					Object.keys(errorStyleTemp).map((key) => (
						errorStyleTemp[key] = error_style
					));
					
					//validation errors mapped to input fields
					setResetPassword({...resetPasswordInput, errorList: response2.data.validation_errors, errorStyle: errorStyleTemp });
                }else{//more errors
				}
		
				setIsLoading(false);
				
			}).catch(function (error) {
				console.log('[resetPasswordSubmit] error: ',error + ' back-end api call error');
		            
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
				swal("Error",error,"error");
				navHistory('/reset_password/'+id+'/'+email);
					
			});
		}).catch(function (error) {
			console.log('[resetPasswordSubmit] error: ',error + ' csrf-cookie is outdated');
		            
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
			swal("Error",error,"error");
			navHistory('/reset_password/'+id+'/'+email);
					
		});
	}
	
	return(
		<div className="body-content bg-fff pt-70l-110m-50s pb-40">
		
			<div className="panel medium pt-20l-10s">
				{isLoading && 
				<LoadingSpinner paddingClass="pb-20l-10s" />
				}
				<div className="grid-x bg-fff b1-ddd p-20l-10s">
					<div className="large-12 medium-12 small-12 cell text-center">
						<div className="font-raleway page-header font-weight-800 italic txt-dark-blue underline uppercase">Reset Password</div>
						<div className="font-raleway page-text text-center p-10">Not registered with us yet? <Link to="/register" className="font-raleway page-text font-weight-600">Register</Link></div>
						
						<div id="sign_in_info_and_error" className="font-raleway font-medium text-center ptb-10 hide"></div>
		
						<form onSubmit={resetPasswordSubmit}>
							<div className="grid-x">
								<div className="large-6 medium-6 small-12 cell text-left pr-5l-0s">
									<div className="input-group">
										<span className="input-group-label"><span className="fas fa-envelope txt-555"></span></span>
										<input type="text" name="email" value={email} className="input-group-field" placeholder="Email" disabled/>
									</div>
								</div>
								<div className="large-6 medium-6 small-12 cell text-left pl-5l-0s">
									<div className={resetPasswordInput.errorStyle.password}>{resetPasswordInput.errorList.password}</div>
									<div className="input-group">
										<span className="input-group-label"><span className="fas fa-lock txt-555"></span></span>
										<input type="password" name="password" onChange={handleInput} value={resetPasswordInput.password} className="input-group-field" placeholder="Reset Password" />
									</div>
								</div>
								<div className="large-12 medium-12 small-12 cell text-right">
									<button type="submit" className="button width-125px-100px uppercase">Reset</button>
								</div>
							</div>
							<div className="grid-x pt-20">
								<div className="large-12 medium-12 small-12 cell text-center bg-fafafa p-20 br-5">
									<Link to="/login" className="font-raleway page-text font-weight-600">Have an account? Login!</Link>
								</div>
							</div>
						</form>
		
					</div>
				</div>
			</div>
		
		</div>
	);
}

export default ResetPassword;