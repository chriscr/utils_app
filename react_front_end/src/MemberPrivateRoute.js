import { Outlet, Navigate } from 'react-router-dom'

const MemberPrivateRoutes = () => {
	
    let auth = {'token':false, 'role':'none'};
	let nav_path = '';

    if(localStorage.getItem('auth_users_name') && localStorage.getItem('auth_email')
	&& localStorage.getItem('auth_token') && localStorage.getItem('auth_role')){
		
		auth.token = true;
		
		if(localStorage.getItem('auth_role') === 'member'){
			auth.role = 'member';
		}else if(localStorage.getItem('auth_role') === 'admin'){
			auth.role = 'admin';
			nav_path = 'admin/dashboard';
		}
	}else{
			nav_path = '/login';
	}
		
    return(
        auth.token && auth.role === 'member' ? <Outlet/> : <Navigate to={nav_path}/>
    )
}

export default MemberPrivateRoutes