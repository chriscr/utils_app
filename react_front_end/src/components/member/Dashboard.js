import React from 'react';
import {Link} from 'react-router-dom';

import check_list_icon from '../../assets/frontend/images/check_list_icon.png';
import portfolio_icon from '../../assets/frontend/images/portfolio_icon.png';
import location_finder_icon from '../../assets/frontend/images/location_finder_icon.png';
import weather_icon from '../../assets/frontend/images/weather_icon.png';

function Dashboard(){
    
	return(
		<div className="body-content bg-fff pt-70l-110m-50s pb-40">
		
			<div className="panel large pt-20l-10s">
				<div className="grid-x">
					<div className="large-12 medium-12 small-12 cell text-left">
						<div className="font-raleway page-header font-weight-800 italic txt-dark-blue bb2-dark-blue uppercase pb-5">Utilities Dashboard</div>
					</div>
					
					<div className="large-3 medium-4 small-6 cell text-left pt-20">
						<Link to="/member/check_list" className="icon-with-text hover-opacity-50 no-underline">
							<img src={check_list_icon} className="" width="40" alt="save items"/> <span className="txt-blue">CHECK LIST</span>
						</Link>
					</div>
					<div className="large-3 medium-4 small-6 cell text-left pt-20">
						<Link to="/member/portfolio" className="icon-with-text hover-opacity-50 no-underline">
							<img src={portfolio_icon} className="" width="50" alt="save items"/> <span className="txt-blue">PORTFOLIO</span>
						</Link>
					</div>
					<div className="large-3 medium-4 small-6 cell text-left pt-20">
						<Link to="/member/traffic" className="icon-with-text hover-opacity-50 no-underline">
							<img src={location_finder_icon} className="" width="40" alt="save items"/> <span className="txt-blue">TRAFFIC</span>
						</Link>
					</div>
					<div className="large-3 medium-4 small-6 cell text-left pt-20">
						<Link to="/member/weather" className="icon-with-text hover-opacity-50 no-underline">
							<img src={weather_icon} className="br-5" width="42" alt="save items"/> <span className="txt-blue">WEATHER</span>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;