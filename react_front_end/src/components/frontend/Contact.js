import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import LoadingSpinner from './LoadingSpinner';

import axios from 'axios';
import swal from 'sweetalert';

const error_style = 'font-raleway font-small font-weight-500 txt-error bg-error p-5';

function Contact(){

	const navHistory = useNavigate();

	// using hooks
    const [isLoading, setIsLoading] = React.useState(false);
	const [contactInput, setContact] = useState({
		firstName: localStorage.getItem('auth_users_name') ? localStorage.getItem('auth_users_name') : '',
		lastName: '',
		email: localStorage.getItem('auth_email') ? localStorage.getItem('auth_email') : '',
		message: '',
		phone: '',
		errorList: [],
		errorStyle: [],
	});
	
	const handleInput = (event) => {
		event.persist();

		setContact({...contactInput, [event.target.name]: event.target.value });

		//remove the target error message no matter the new input, it will be validated on the server
		if (contactInput.errorList.hasOwnProperty(event.target.name)){
			delete contactInput.errorList[event.target.name];
			delete contactInput.errorStyle[event.target.name];
		}
	}

	const contactSubmit = (event) => {
		event.preventDefault();
		
		setIsLoading(true);

		//values sent to api
		const data = {
			firstName: contactInput.firstName,
			lastName: contactInput.lastName,
			email: contactInput.email,
			phone: contactInput.phone,
			message: contactInput.message,
		}

		axios.get('/sanctum/csrf-cookie').then(response1 => {// CSRF Protection through Laravel
			axios.post('/api/contact', data).then(response2 =>{
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
					setContact({...contactInput, errorList: response2.data.validation_errors, errorStyle: errorStyleTemp });
					
				}else{//more errors
				}
		
				setIsLoading(false);
					
			}).catch(function (error) {
				console.log('[contactSubmit - contact] error: ',error + ' back-end api call error');
				
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
		
				navHistory('/contact');
					
				//swal("Error",error,"error");
		
				setIsLoading(false);
			});
		}).catch(function (error) {
			//csrf-cookie is outdated
			console.log('[contactSubmit - contact] error: ',error + ' csrf-cookie is outdated');
			
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
	                	
			navHistory('/contact');
		
			setIsLoading(false);
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
						<div className="font-raleway page-header font-weight-800 italic txt-dark-blue underline uppercase">Contact</div>
						<div className="font-raleway page-text text-center p-10">Please provide your information.</div>
		
						<form onSubmit={contactSubmit}>
							<div className="grid-x">
								<div className="large-6 medium-6 small-12 cell text-left pr-5l-0s">
									<div className={contactInput.errorStyle.firstName}>{contactInput.errorList.firstName}</div>
									<div className="input-group">
										<span className="input-group-label"><span className="fas fa-user txt-555"></span></span>
										<input type="text" name="firstName" onChange={handleInput} value={contactInput.firstName} className="input-group-fieldx" placeholder="First Name" />
									</div>
								</div>
								<div className="large-6 medium-6 small-12 cell text-left pl-5l-0s">
									<div className={contactInput.errorStyle.lastName}>{contactInput.errorList.lastName}</div>
									<div className="input-group">
										<span className="input-group-label"><span className="fas fa-user txt-555"></span></span>
										<input type="text" name="lastName" onChange={handleInput} value={contactInput.lastName} className="input-group-field" placeholder="Last Name" />
									</div>
								</div>
								<div className="large-6 medium-6 small-12 cell text-left pr-5l-0s">
									<div className={contactInput.errorStyle.email}>{contactInput.errorList.email}</div>
									<div className="input-group">
										<span className="input-group-label"><span className="fas fa-envelope txt-555"></span></span>
										<input type="text" name="email" onChange={handleInput} value={contactInput.email} className="input-group-field" placeholder="Email" />
									</div>
								</div>
								<div className="large-6 medium-6 small-12 cell text-left pl-5l-0s">
									<div className={contactInput.errorStyle.phone}>{contactInput.errorList.phone}</div>
									<div className="input-group">
										<span className="input-group-label"><span className="fas fa-lock txt-555"></span></span>
										<input type="text" name="phone" onChange={handleInput} value={contactInput.phone} className="input-group-field" placeholder="Phone" />
									</div>
								</div>
								<div className="large-12 medium-12 small-12 cell text-left">
									<div className={contactInput.errorStyle.message}>{contactInput.errorList.message}</div>
									<div className="input-group">
										<textarea  name="message" onChange={handleInput} value={contactInput.message} className="input-group-field" placeholder="Message" />
									</div>
								</div>
								<div className="large-12 medium-12 small-12 cell text-right">
									<button type="submit" className="button width-125px-100px uppercase">Submit</button>
								</div>
							</div>
						</form>
		
					</div>
				</div>
			</div>
		</div>
	);
}

export default Contact;