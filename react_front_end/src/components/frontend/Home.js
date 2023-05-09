import React from 'react';

import home_main_image from '../../assets/frontend/images/home_main_large.png';
import home_main_image_medium from '../../assets/frontend/images/home_main.png';
import home_main_image_mobile from '../../assets/frontend/images/home_main_mobile.png';
function Home(){

	return(
		<div className="body-content bg-fff text-center pt70-110-50-mr">

			<div className="text-overlay-wrapper text-center">
				<div className="text-overlay-100per">
					<div className="vertical-center-wrapper">
						<div className="font-raleway font-v-large font-weight-800 italic txt-dark-blue underline uppercase show-for-large">Demo Tools</div>
						<div className="font-raleway font-xxx-large font-weight-800 italic txt-dark-blue underline uppercase hide-for-large">Demo Tools</div>
						<div  className="font-raleway font-large font-weight-600 italic txt-dark-blue pt-20">Check List, Portfolio, <br/>Traffic, Weather</div>
					</div>
				</div>
				<img src={home_main_image} className="show-for-large" alt="shopping list" width="100%"/>
				<div className="show-for-medium-only">
					<img src={home_main_image_medium} className="hide-for-small-only" alt="shopping list" width="100%"/>
				</div>
				<img src={home_main_image_mobile} className="show-for-small-only" alt="shopping list" width="100%"/>
			</div>

		</div>
	);
}

export default Home;