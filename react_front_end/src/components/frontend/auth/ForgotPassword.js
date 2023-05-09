import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';

import LoadingSpinner from '../LoadingSpinner';

import axios from 'axios';
import swal from 'sweetalert';

const error_style = 'font-raleway font-s font-weight-500 txt-error bg-error p-5';

function ForgotPassword(){
	
	const navHistory = useNavigate();

	// using hooks
    const [isLoading, setIsLoading] = React.useState(false);
	const [forgotPasswordInput, setForgotPassword] = useState({
		email: '',
		errorList: [],
		errorStyle: [],
	});
	
	const handleInput = (event) => {
		event.persist();
		
		setForgotPassword({...forgotPasswordInput, [event.target.name]: event.target.value });
		
		//remove the target error message no matter the new input, it will be validated on the server
		if (forgotPasswordInput.errorList.hasOwnProperty(event.target.name)){
			delete forgotPasswordInput.errorList[event.target.name];
			delete forgotPasswordInput.errorStyle[event.target.name];
		}
	}

	const forgotPasswordSubmit = (event) => {
		event.preventDefault();
		
		setIsLoading(true);
			
		//values sent to api
		const data = {
			email: forgotPasswordInput.email,
		}
		
		axios.get('/sanctum/csrf-cookie').then(response1 => {// CSRF Protection through Laravel
			axios.post('/api/forgot_password', data).then(response2 =>{
				if(response2.data.status === 200){//HTTP_OK

                	localStorage.removeItem('password');
                	
					//sweet alert on next page
                    swal("Success",response2.data.message,"success");
					
                    navHistory('/login');
					
                }else if(response2.data.status === 404){//HTTP_NOT_FOUND
					setForgotPassword({...forgotPasswordInput, errorList: {email: [response2.data.message]}, errorStyle: {email: [error_style]}});
				}else if(response2.data.status === 800){//HTTP_FORM_VALIDATION_FAILED
				
					var errorStyleTemp = JSON.parse(JSON.stringify(response2.data.validation_errors));
					Object.keys(errorStyleTemp).map((key) => (
						errorStyleTemp[key] = error_style
					));
					
					//validation errors mapped to input fields
					setForgotPassword({...forgotPasswordInput, errorList: response2.data.validation_errors, errorStyle: errorStyleTemp });
                }else{//more errors
				}
		
				setIsLoading(false);
				
			}).catch(function (error) {
				console.log('[forgotPasswordSubmit - forgot_password] error: ',error + ' back-end api call error');
		
				setIsLoading(false);
				
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_role');

				if(!localStorage.getItem('remember_me') || localStorage.getItem('remember_me') !== 'true'){
            		localStorage.removeItem('auth_users_name');
                	localStorage.removeItem('auth_users_last_name');
                	localStorage.removeItem('auth_email');
                	localStorage.removeItem('password');
                	localStorage.removeItem('remember_me');
				}
	                	
				navHistory('/forgot_password');
					
				swal("Error",error,"error");
			});
		}).catch(function (error) {
			console.log('[forgotPasswordSubmit - forgot_password] error: ',error + ' csrf-cookie is outdated');
		
			setIsLoading(false);
				
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_role');

			if(!localStorage.getItem('remember_me') || localStorage.getItem('remember_me') !== 'true'){
            	localStorage.removeItem('auth_users_name');
                localStorage.removeItem('auth_users_last_name');
            	localStorage.removeItem('auth_email');
            	localStorage.removeItem('password');
            	localStorage.removeItem('remember_me');
			}
	                	
			navHistory('/forgot_password');
					
			swal("Error",error,"error");
		});
	}
	
	return(
		<div className="body-content bg-fff pt-70l-110m-50s pb-40">
		
			<div className="panel small pt-20l-10s">
				{isLoading && 
				<LoadingSpinner paddingClass="pb-20l-10s" />
				}
				<div className="grid-x bg-fff b1-ddd p-20l-10s">
					<div className="large-12 medium-12 small-12 cell text-center">
						<div className="font-raleway page-header font-weight-800 italic txt-dark-blue underline uppercase">Password Assistance</div>
						<div className="font-raleway page-text text-center p-10">Not registered with us yet? <Link to="/register" className="font-raleway page-text font-weight-600">Register</Link></div>
						
						<div id="sign_in_info_and_error" className="font-raleway font-medium text-center ptb-10 hide"></div>
		
						<form onSubmit={forgotPasswordSubmit}>
							<div className="grid-x">
								<div className="large-12 medium-12 small-12 cell text-left">
									<div className={forgotPasswordInput.errorStyle.email}>{forgotPasswordInput.errorList.email}</div>
									<div className="input-group">
										<span className="input-group-label"><span className="fas fa-envelope txt-555"></span></span>
										<input type="text" name="email" onChange={handleInput}  value={forgotPasswordInput.email} className="input-group-field" placeholder="name@example.com" />
									</div>
								</div>
								<div className="large-12 medium-12 small-12 cell text-right">
									<button type="submit" className="button width-125px-100px uppercase">Continue</button>
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

export default ForgotPassword;