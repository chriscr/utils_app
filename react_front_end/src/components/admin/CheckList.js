import React from 'react';

import home_main_image from '../../assets/frontend/images/home_main_large.png';
import home_main_image_medium from '../../assets/frontend/images/home_main.png';
import home_main_image_mobile from '../../assets/frontend/images/home_main_mobile.png';

function CheckList(){
	return(
		<div className="body-content bg-fff pt-70l-110m-50s pb-40">
		
			<div className="panel large pt-20l-10s">
				<div className="grid-x">
			
					<div className="large-12 medium-12 small-12 cell text-left">
						<div className="font-raleway page-header font-weight-800 italic txt-dark-blue bb2-dark-blue uppercase pb-5">Check List</div>
					</div>

					<div className="large-12 medium-12 small-12 cell text-left">
						<div className="text-overlay-wrapper text-center">
							<div className="text-overlay-100per">
								<div className="vertical-center-wrapper">
									<div className="font-raleway font-v-large font-weight-800 italic txt-dark-blue underline uppercase show-for-large">Coming Soon</div>
									<div className="font-raleway font-xxx-large font-weight-800 italic txt-dark-blue underline uppercase hide-for-large">Coming Soon</div>
								</div>
							</div>
							<img src={home_main_image} className="show-for-large" alt="shopping list" width="100%"/>
							<div className="show-for-medium-only">
								<img src={home_main_image_medium} className="hide-for-small-only" alt="shopping list" width="100%"/>
							</div>
							<img src={home_main_image_mobile} className="show-for-small-only" alt="shopping list" width="100%"/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CheckList;