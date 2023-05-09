
import Home from './components/frontend/Home';
import About from './components/frontend/About';
import Contact from './components/frontend/Contact';
import Help from './components/frontend/Help';
import TechnicalHighlights from './components/frontend/TechnicalHighlights';

import Login from './components/frontend/auth/Login';
import Register from './components/frontend/auth/Register';
import ActivateAccount from './components/frontend/auth/ActivateAccount';
import ForgotPassword from './components/frontend/auth/ForgotPassword';
import ResetPassword from './components/frontend/auth/ResetPassword';

import MemberDashboard from './components/member/Dashboard';
import MemberProfile from './components/member/Profile';
import MemberCheckList from './components/member/CheckList';
import MemberPortfolio from './components/member/Portfolio';
import MemberTraffic from './components/member/Traffic';
import MemberWeather from './components/member/Weather';

import AdminDashboard from './components/admin/Dashboard';
import AdminProfile from './components/admin/Profile';
import AdminUsers from './components/admin/Users';
import AdminCheckList from './components/admin/CheckList';
import AdminPortfolio from './components/admin/Portfolio';
import AdminTraffic from './components/admin/Traffic';
import AdminWeather from './components/admin/Weather';

const ActivateAccountWithId = ({ id }) => <ActivateAccount id={id} />;
const ResetPasswordWithIdEmail =  ({ id, email }) => <ResetPassword id={id} email={email} />;

const routes = [
	{
		path: '/',
		element: <Home />,
		type: 'public',
	}, {
		path: '/home',
		element: <Home />,
		type: 'public',
	}, {
		path: '/about',
		element: <About />,
		type: 'public',
	}, {
		path: '/contact',
		element: <Contact />,
		type: 'public',
	}, {
		path: '/help',
		element: <Help />,
		type: 'public',
	}, {
		path: '/technical_highlights',
		element: <TechnicalHighlights />,
		type: 'public',
	}, {
		path: '/login',
		element: <Login />,
		type: 'public',
	}, {
		path: '/register',
		element: <Register />,
		type: 'public',
	}, {
		path: '/activate_account/:id',
		element: <ActivateAccountWithId />,
		type: 'public',
	}, {
		path: '/forgot_password',
		element: <ForgotPassword />,
		type: 'public',
	}, {
		path: '/reset_password/:id/:email',
		element: <ResetPasswordWithIdEmail />,
		type: 'public',
	}, {
		path: '/member/dashboard',
		element: <MemberDashboard />,
		type: 'private member',
	}, {
		path: '/member/profile',
		element: <MemberProfile />,
		type: 'private member',
	}, {
		path: '/member/check_list',
		element: <MemberCheckList />,
		type: 'private member',
	}, {
		path: '/member/portfolio',
		element: <MemberPortfolio />,
		type: 'private member',
	}, {
		path: '/member/traffic',
		element: <MemberTraffic />,
		type: 'private member',
	}, {
		path: '/member/weather',
		element: <MemberWeather />,
		type: 'private member',
	}, {
		path: '/admin/dashboard',
		element: <AdminDashboard />,
		type: 'private admin',
	}, {
		path: '/admin/profile',
		element: <AdminProfile />,
		type: 'private admin',
	}, {
		path: '/admin/users',
		element: <AdminUsers />,
		type: 'private admin',
	}, {
		path: '/admin/check_list',
		element: <AdminCheckList />,
		type: 'private admin',
	}, {
		path: '/admin/portfolio',
		element: <AdminPortfolio />,
		type: 'private admin',
	}, {
		path: '/admin/traffic',
		element: <AdminTraffic />,
		type: 'private admin',
	}, {
		path: '/admin/weather',
		element: <AdminWeather />,
		type: 'private admin',
	},
	// And so on.
];

export default routes;