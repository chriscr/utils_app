import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';

import LoadingSpinner from '../LoadingSpinner';

import axios from 'axios';
import swal from 'sweetalert';

const error_style = 'font-raleway font-small font-weight-500 txt-error bg-error p-5';

function Register(){

	const navHistory = useNavigate();

	// using hooks
    const [isLoading, setIsLoading] = React.useState(false);
	const [registerInput, setRegister] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		//confirmPassword: '',
		terms: '',
		errorList: [],
		errorStyle: [],
	});

	const handleInput = (event) => {
		event.persist();

		setRegister({...registerInput, [event.target.name]: event.target.value });

		//remove the target error message no matter the new input, it will be validated on the server
		if (registerInput.errorList.hasOwnProperty(event.target.name)){
			delete registerInput.errorList[event.target.name];
			delete registerInput.errorStyle[event.target.name];
		}
	}

	const registerSubmit = (event) => {
		event.preventDefault();
		
		setIsLoading(true);

		//values sent to api
		const data = {
			firstName: registerInput.firstName,
			lastName: registerInput.lastName,
			email: registerInput.email,
			password: registerInput.password,
			//confirmPassword: registerInput.confirmPassword,
			terms: registerInput.terms,
		}

		axios.get('/sanctum/csrf-cookie').then(response1 => {// CSRF Protection through Laravel
			axios.post('/api/register', data).then(response2 =>{
				if(response2.data.status === 200){//HTTP_OK
					localStorage.setItem('auth_users_name', response2.data.auth_users_name);
					localStorage.setItem('auth_email', response2.data.auth_email);

					//sweet alert on next page
					swal("Success",response2.data.message,"success");
					navHistory('/');
					
				}else if(response2.data.status === 800){//HTTP_FORM_VALIDATION_FAILED

					var errorStyleTemp = JSON.parse(JSON.stringify(response2.data.validation_errors));
					Object.keys(errorStyleTemp).map((key) => (
						errorStyleTemp[key] = error_style
					));
					
					//validation errors mapped to input fields
					setRegister({...registerInput, errorList: response2.data.validation_errors, errorStyle: errorStyleTemp });
					
				}else{//more errors
				}
		
				setIsLoading(false);
				
			}).catch(function (error) {
				console.log('[registerSubmit - register] error: ',error + ' back-end api call error');
			
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
	                	
				navHistory('/register');
					
				swal("Error",error,"error");
			});
		}).catch(function (error) {
			//csrf-cookie is outdated
			console.log('[registerSubmit - register] error: ',error + ' csrf-cookie is outdated');
		
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
		
			navHistory('/register');
					
			swal("Error",error,"error");
		});
	}
	
	const showTermsConditions = (event) => {
		event.preventDefault();
	
		//Type appropriate comment here, and begin script below
		swal({
			title: 'Terms & Conditions',
			text: 'Do you understand the terms & conditions?',
			html: true,
			icon: 'info',
			showCancelButton: true,
			confirmButtonText: 'Yes, I understand the terms!'
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
						<div className="font-raleway page-header font-weight-800 italic txt-dark-blue underline uppercase">Register</div>
						<div className="font-raleway font-medium text-center p-10">Already a member? <Link to="/login" className="font-raleway font-medium font-weight-600">Login</Link></div>
		
						<form onSubmit={registerSubmit}>
							<div className="grid-x">
								<div className="large-6 medium-6 small-12 cell text-left pr-5l-0s">
									<div className={registerInput.errorStyle.firstName}>{registerInput.errorList.firstName}</div>
									<div className="input-group">
										<span className="input-group-label"><span className="fas fa-user txt-555"></span></span>
										<input type="text" name="firstName" onChange={handleInput} value={registerInput.firstName} className="input-group-field" placeholder="First Name" />
									</div>
								</div>
								<div className="large-6 medium-6 small-12 cell text-left pl-5l-0s">
									<div className={registerInput.errorStyle.lastName}>{registerInput.errorList.lastName}</div>
									<div className="input-group">
										<span className="input-group-label"><span className="fas fa-user txt-555"></span></span>
										<input type="text" name="lastName" onChange={handleInput} value={registerInput.lastName} className="input-group-field" placeholder="Last Name" />
									</div>
								</div>
								<div className="large-6 medium-6 small-12 cell text-left pr-5l-0s">
									<div className={registerInput.errorStyle.email}>{registerInput.errorList.email}</div>
									<div className="input-group">
										<span className="input-group-label"><span className="fas fa-envelope txt-555"></span></span>
										<input type="text" name="email" onChange={handleInput} value={registerInput.email} className="input-group-field" placeholder="Email" />
									</div>
								</div>
								<div className="large-6 medium-6 small-12 cell text-left pl-5l-0s">
									<div className={registerInput.errorStyle.password}>{registerInput.errorList.password}</div>
									<div className="input-group">
										<span className="input-group-label"><span className="fas fa-lock txt-555"></span></span>
										<input type="password" name="password" onChange={handleInput} value={registerInput.password} className="input-group-field" placeholder="Password" />
									</div>
								</div>
								<div className="large-6 medium-6 small-6 cell text-left pr-5l-0s">
									<div className={registerInput.errorStyle.terms}>{registerInput.errorList.terms}</div>
			        				<input type="checkbox" name="terms" id="terms_a" onChange={handleInput} value="1" />
			        				<label htmlFor="terms_a" className="checkbox-label"><span className="checkbox"></span><span className="message">&nbsp;&nbsp;&nbsp;<Link to="#" className="font-raleway page-text font-weight-600" onClick={showTermsConditions}>Terms<span className="hide-for-small-only"> & Conditions</span></Link></span></label>
								</div>
								<div className="large-6 medium-6 small-6 cell text-right pl-5l-0s">
									<button type="submit" className="button width-125px-100px uppercase">Register</button>
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

export default Register;