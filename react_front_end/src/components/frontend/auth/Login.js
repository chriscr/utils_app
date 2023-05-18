import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';

import AuthUtility from './AuthUtility';
import LoadingSpinner from '../LoadingSpinner';

import axios from 'axios';
import swal from 'sweetalert';

const error_style = 'font-raleway font-small font-weight-500 txt-error bg-error p-5';

function Login(){
	
	const navHistory = useNavigate();

	// using hooks
    const [isLoading, setIsLoading] = React.useState(false);
	const [loginInput, setLogin] = useState({
		email: localStorage.getItem('auth_email') ? localStorage.getItem('auth_email') : '',
		password: localStorage.getItem('password') ? localStorage.getItem('password') : '',
		errorList: [],
		errorStyle: [],
	});

	const [isChecked, setIsChecked] = useState(localStorage.getItem('remember_me') && localStorage.getItem('remember_me') === 'true' ? true : false);
	
	const handleInput = (event) => {
		event.persist();
		
		if(event.target.name !== 'rememberMe'){
			setLogin({...loginInput, [event.target.name]: event.target.value });
		}
		
		//remove the target error message no matter the new input, it will be validated on the server
		if (loginInput.errorList.hasOwnProperty(event.target.name)){
			delete loginInput.errorList[event.target.name];
			delete loginInput.errorStyle[event.target.name];
		}
	}

	const loginSubmit = (event) => {
		event.preventDefault();
		
		setIsLoading(true);
			
		//values sent to api
		const data = {
			email: loginInput.email,
			password: loginInput.password,
		}
		
		axios.get('/sanctum/csrf-cookie').then(response1 => {// CSRF Protection through Laravel
			axios.post('/api/login', data).then(response2 =>{
				if(response2.data.status === 200){//HTTP_OK
					
					AuthUtility.setAuthData(response2.data.auth_users_name, response2.data.auth_users_last_name, 
					response2.data.auth_email, response2.data.auth_token, response2.data.auth_role,
					loginInput.password, isChecked);
					/*
                    localStorage.setItem('auth_users_name', response2.data.auth_users_name);
                    localStorage.setItem('auth_users_last_name', response2.data.auth_users_last_name);
                    localStorage.setItem('auth_email', response2.data.auth_email);
                    localStorage.setItem('auth_token', response2.data.auth_token);
                    localStorage.setItem('auth_role', response2.data.auth_role);

					if(isChecked){
                    	localStorage.setItem('password', loginInput.password);
                    	localStorage.setItem('remember_me', 'true');
					}else{
                    	localStorage.removeItem('password');
                    	localStorage.removeItem('remember_me');
					}
					*/
					
					//redirect to proper dashboard based on role
					if(response2.data.auth_role === 'admin'){
                    	navHistory('/admin/dashboard');
					}else if(response2.data.auth_role === 'member'){
                    	navHistory('/member/dashboard');
					}else{
                    	navHistory('/');
					}
					
                }else if(response2.data.status === 401){//HTTP_UNAUTHORIZED
                    swal("Warning",response2.data.message,"warning");
				}else if(response2.data.status === 800){//HTTP_FORM_VALIDATION_FAILED
					
					var errorStyleTemp = JSON.parse(JSON.stringify(response2.data.validation_errors));
					Object.keys(errorStyleTemp).map((key) => (
						errorStyleTemp[key] = error_style
					));
					
					//validation errors mapped to input fields
					setLogin({...loginInput, errorList: response2.data.validation_errors, errorStyle: errorStyleTemp });
					
				}else{//more errors
				}
		
				setIsLoading(false);
					
			}).catch(function (error) {
				console.log('[loginSubmit] error: ',error + ' back-end api call error');
				
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
				//swal("Error",error,"error");
				navHistory('/login');
				
			});
		}).catch(function (error) {
			//csrf-cookie is outdated
			console.log('[loginSubmit] error: ',error + ' csrf-cookie is outdated');
			
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
			//swal("Error",error,"error");
			navHistory('/login');
					
		});
	}

	const handleCheckboxChange = (event) => {
	    const { checked } = event.target;
	    setIsChecked(checked);
	    localStorage.setItem('remember_me', checked);
	};
	
	return(
		<div className="body-content bg-fff pt-70l-110m-50s pb-40">
			
			<div className="panel medium pt-20l-10s">
				{isLoading && 
				<LoadingSpinner paddingClass="pb-20l-10s" />
				}
				<div className="grid-x bg-fff b1-ddd p-20l-10s">
					<div className="large-12 medium-12 small-12 cell text-center">
						<div className="font-raleway page-header font-weight-800 italic txt-dark-blue underline uppercase">Login</div>
						<div className="font-raleway page-text text-center p-10">Not registered with us yet? <Link to="/register" className="font-raleway page-text font-weight-600">Register</Link></div>
						
						<div id="sign_in_info_and_error" className="font-raleway font-medium text-center ptb-10 hide"></div>
		
						<form onSubmit={loginSubmit}>
							<div className="grid-x">
								<div className="large-6 medium-6 small-12 cell text-left pr-5l-0s">
									<div className={loginInput.errorStyle.email}>{loginInput.errorList.email}</div>
									<div className="input-group">
										<span className="input-group-label"><span className="fas fa-envelope txt-555"></span></span>
										<input type="text" name="email" onChange={handleInput}  value={loginInput.email} className="input-group-field" placeholder="name@example.com" />
									</div>
								</div>
								<div className="large-6 medium-6 small-12 cell text-left pl-5l-0s">
									<div className={loginInput.errorStyle.password}>{loginInput.errorList.password}</div>
									<div className="input-group">
										<span className="input-group-label"><span className="fas fa-lock txt-555"></span></span>
										<input type="password" name="password" onChange={handleInput} value={loginInput.password} className="input-group-field" placeholder="Enter Password" />
									</div>
								</div>
								<div className="large-6 medium-6 small-7 cell text-left">
			        				<input type="checkbox" name="rememberMe" id="remember_me" value="1" checked={isChecked} onChange={handleCheckboxChange} />
			        				<label htmlFor="remember_me" className="checkbox-label"><span className="checkbox"></span><span className="message font-raleway page-text font-weight-600">&nbsp;&nbsp;&nbsp;Remember<span className="hide-for-small-only"> Me</span></span></label>
								</div>
								<div className="large-6 medium-6 small-5 cell text-right">
									<button type="submit" className="button width-125px-100px uppercase">Login</button>
								</div>
							</div>
							<div className="grid-x pt-20">
								<div className="large-12 medium-12 small-12 cell text-center bg-fafafa p-20 br-5">
									<Link to="/forgot_password" className="font-raleway page-text font-weight-600">Forgot Password?</Link>
								</div>
							</div>
						</form>
		
					</div>
				</div>
			</div>
		
		</div>
	);
}

export default Login;
