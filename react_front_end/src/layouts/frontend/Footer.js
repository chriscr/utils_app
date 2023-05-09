import React from 'react';
import {Link} from 'react-router-dom';

import swal from 'sweetalert';

import logo_grey from '../../assets/frontend/images/logo_grey.png';

function Footer(){
	
	const showPrivacyPolicy = (event) => {
		event.preventDefault();
	
		//Type appropriate comment here, and begin script below
		swal({
			title: 'Privacy Policy',
			text: 'Do you understand the privacy policy?',
			html: true,
			icon: 'info',
			showCancelButton: true,
			confirmButtonText: 'Yes, I understand the privacy policy!'
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
		<div className="footer ptb-20 bg-dark-blue">
			<div className="panel large">
				<div className="grid-x">
					<div className="large-6 medium-6 small-12 cell">
						<Link to="/" className="hover-opacity-50">
							<span className="left">
								<img src={logo_grey} alt="logo" width="46"/>
							</span>
							<span className="text-left pl-10 left">
								<div className="font-raleway font-medium font-weight-800 italic txt-ccc bb2-ccc uppercase pb-3">UTILS APP</div>
								<div className="font-raleway font-small font-weight-600 italic txt-ccc letter-spacing-0px uppercase pt-7">Demo Tools</div>
							</span>
						</Link>
					</div>
					<div className="large-6 medium-6 small-12 cell"></div>
					
					<div className="large-12 medium-12 small-12 cell bt1-bbb bb1-bbb ptb-20 mt-10">
						<div className="hide-for-small-only">
							<span className="pr-10"><Link to="/" className="font-raleway font-small font-weight-400 letter-spacing-0px uppercase">HOME</Link></span>
							<span className="plr-10"><Link to="/about" className="font-raleway font-small font-weight-400 letter-spacing-0px uppercase">ABOUT</Link></span>
							<span className="plr-10"><Link to="/contact" className="font-raleway font-small font-weight-400 letter-spacing-0px uppercase">CONTACT</Link></span>
							<span className="plr-10"><Link to="#" className="font-raleway font-small font-weight-400 letter-spacing-0px uppercase" onClick={showTermsConditions}>Terms & Conditions</Link></span>
							<span className="plr-10"><Link to="#" className="font-raleway font-small font-weight-400 letter-spacing-0px uppercase" onClick={showPrivacyPolicy}>Privacy Policy</Link></span>
						</div>
						<div className="show-for-small-only">
							<span className="pr-10"><Link to="/about" className="font-raleway font-small font-weight-400 letter-spacing-0px uppercase">ABOUT</Link></span>
							<span className="plr-10"><Link to="/contact" className="font-raleway font-small font-weight-400 letter-spacing-0px uppercase">CONTACT</Link></span>
							<span className="plr-10"><Link to="#" className="font-raleway font-small font-weight-400 letter-spacing-0px uppercase" onClick={showTermsConditions}>Terms</Link></span>
							<span className="plr-10"><Link to="#" className="font-raleway font-small font-weight-400 letter-spacing-0px uppercase" onClick={showPrivacyPolicy}>Privacy</Link></span>
						</div>
					</div>
					<div className="large-12 medium-12 small-12 cell pt-20">
						<span className="font-raleway font-standard font-weight-500 txt-ccc uppercase pr-25">&copy;&nbsp;2023 UTILS APP</span>
						<span className="font-raleway font-small font-weight-400 txt-ccc ">Update: 03/21/2023</span>
					</div>
				</div>
			</div>
		</div>
	);
	
}

export default Footer;