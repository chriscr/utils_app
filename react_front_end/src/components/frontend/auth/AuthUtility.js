const AuthUtility = {
	setAuthData: (users_name, users_last_name, email, token, role, password, remember_me) => {
    
		localStorage.setItem('auth_users_name', users_name);
        localStorage.setItem('auth_users_last_name', users_last_name);
        localStorage.setItem('auth_email', email);
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_role', role);
        
        if (typeof remember_me === 'boolean') {
			if(remember_me){
	        	localStorage.setItem('password', password);
	        	localStorage.setItem('remember_me', 'true');
			}else{
	        	localStorage.removeItem('password');
	        	localStorage.removeItem('remember_me');
			}
		}
	},
	clearAuthData: () => {
			
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_role');

		if(!localStorage.getItem('remember_me') || localStorage.getItem('remember_me') !== 'true'){
        	localStorage.removeItem('auth_users_name');
        	localStorage.removeItem('auth_users_last_name');
        	localStorage.removeItem('auth_email');
        	localStorage.removeItem('password');
		}
	},
	getAuthData: () => {
	    const users_name = localStorage.getItem('auth_users_name');
	    const users_last_name = localStorage.getItem('auth_users_last_name');
	    const email = localStorage.getItem('auth_email');
	    const token = localStorage.getItem('auth_token');
	    const role = localStorage.getItem('auth_role');
	    return { users_name, users_last_name, email, token, role };
	},
};

export default AuthUtility;
