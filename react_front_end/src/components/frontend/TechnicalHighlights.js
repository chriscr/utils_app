import React from 'react';

function TechnicalHighlights(){
	return(
		<div className="body-content bg-fff pt-70l-110m-50s pb-40">
		
			<div className="panel large pt-20l-10s">
				<div className="grid-x">
			
					<div className="large-12 medium-12 small-12 cell text-left">
						<div className="font-raleway page-header font-weight-800 italic txt-dark-blue bb2-dark-blue uppercase pb-5">Technical Highlights</div>
					</div>

					<div className="large-12 medium-12 small-12 cell text-left">
						<div className="font-raleway font-standard font-weight-600 txt-333 justify line-height-125per pt-20">
						The SMART UTIL demonstration app was created to demonstrate using the modern front-end framework React.js and leveraging its key components,
						utilize a RESTful API and back-end logic with PHP Laravel, database capability with MySQL, and consuming 3rd party APIs for various types of data. 
						Below are the key technical higlights for each of the major areas of development.
						</div>
						
						<div className="font-raleway font-medium font-weight-800 txt-333 text-left pt-20">Front-End SPA - React.js</div>
						<ul className="pt-10">
							<li className="font-raleway font-standard font-weight-600 txt-333 line-height-125per pt-5">Routes for open use, authenticated users, and authenticated adminstrators of the web application.</li>
							<li className="font-raleway font-standard font-weight-600 txt-333 line-height-125per pt-5">Master Layout to handle content for on-canvas, off-canvas, body, footer.</li>
							<li className="font-raleway font-standard font-weight-600 txt-333 line-height-125per pt-5">Local Storage for user info and web token.</li>
							<li className="font-raleway font-standard font-weight-600 txt-333 line-height-125per pt-5">Axios for AJAX calls (post, get, delete, put) to the RESTful API end-points, including handling HTTP Response Codes.</li>
							<li className="font-raleway font-standard font-weight-600 txt-333 line-height-125per pt-5">Mobile Responsiveness using the Foundation Framework and custom media queries.</li>
							<li className="font-raleway font-standard font-weight-600 txt-333 line-height-125per pt-5">Off-Canvas capability for the mobile navigation and each of the utility child components.</li>
							<li className="font-raleway font-standard font-weight-600 txt-333 line-height-125per pt-5">Framework components such as useEffect, useState, handlers, toggling, navigation, mounting, properties, states to handle "cancel" and return to the original objects.</li>
							<li className="font-raleway font-standard font-weight-600 txt-333 line-height-125per pt-5">SPA Authentication for each RESTful API end-point including headers.</li>
							<li className="font-raleway font-standard font-weight-600 txt-333 line-height-125per pt-5">User Authentication for both both users and adminstrators including registration, automated email, account activation, login, logout, forgot password, reset password, and profile.</li>
							<li className="font-raleway font-standard font-weight-600 txt-333 line-height-125per pt-5">Validation of input fields.</li>
							<li className="font-raleway font-standard font-weight-600 txt-333 line-height-125per pt-5">Child-parent component relationship and passing properties, where the child does most of the heavy lifting and the parent provides the presentation.</li>
							<li className="font-raleway font-standard font-weight-600 txt-333 line-height-125per pt-5">4 app utilities to CRUD high level and low level objects through the parent and child components.</li>
							<li className="font-raleway font-standard font-weight-600 txt-333 line-height-125per pt-5"><b>CheckList Utility</b> allows a user to create/delete multiple checklists, then CRUD the checklist items. A key feature is multiple checklist items can be managed in one API call.</li>
							<li className="font-raleway font-standard font-weight-600 txt-333 line-height-125per pt-5"><b>Portfolio Utility</b> allows a user to create/delete multiple portfolios, then CRUD the individual symbols. A key feature is multiple symbols can be managed in one API call. The utility uses the AlphaVantage API for 15-minute quote data.</li>
							<li className="font-raleway font-standard font-weight-600 txt-333 line-height-125per pt-5"><b>Traffic Utility</b> allows a user to create/delete multiple locations, then list out all traffic incidents in a 10 mile radius, but only provides lat-long coordinates. The utility uses the MapQuest API. <u>Note</u>: the Google API could easily be integrated for geocodes for addresses and a map with location markers.</li>
							<li className="font-raleway font-standard font-weight-600 txt-333 line-height-125per pt-5"><b>Weather Utility</b> allows a user to create/delete multiple locations, then provide current weather conditions and a 3-day forcast with toggling and a temperature profile chart using the HighCharts library. A key feature is no additional API calls are required when toggling the 3-day forecast. The utility uses the WeatherAPI.com API.</li>
							<li className="font-raleway font-standard font-weight-600 txt-333 line-height-125per pt-5">Each of the 4 app utilities has a default high level object (can toggle) in which the child component will request and pass the low level data automatically upon mounting.</li>
						</ul>
						
						<div className="font-raleway font-medium font-weight-800 txt-333 text-left pt-20">RESTful API - PHP Laravel</div>
						<ul className="pt-10">
							<li className="font-raleway font-standard font-weight-600 txt-333 line-height-125per pt-5">Use PHP artisan for create, make, serve, migrate, require, clear, list, etc.</li>
							<li className="font-raleway font-standard font-weight-600 txt-333 line-height-125per pt-5">Routes for the RESTful API end-points for open usage, authenticated users utilizing feature specific calls, and authenticated adminstrators utilizing feature specific calls.</li>
							<li className="font-raleway font-standard font-weight-600 txt-333 line-height-125per pt-5">Sanctum for SPA Authentication and CSRF-Cookies.</li>
							<li className="font-raleway font-standard font-weight-600 txt-333 line-height-125per pt-5">CORS accounted for because using two different subdomains.</li>
							<li className="font-raleway font-standard font-weight-600 txt-333 line-height-125per pt-5">Migrations used for new models and modified models and personal access tokens.</li>
							<li className="font-raleway font-standard font-weight-600 txt-333 line-height-125per pt-5">Form Validation mapped by name to the front-end form input fields.</li>
							<li className="font-raleway font-standard font-weight-600 txt-333 line-height-125per pt-5">Consuming 3rd party APIs and Exception Handling.</li>
							<li className="font-raleway font-standard font-weight-600 txt-333 line-height-125per pt-5">HTTP Response Codes.</li>
							<li className="font-raleway font-standard font-weight-600 txt-333 line-height-125per pt-5">Libraries for the 3rd party APIs, EmailTemplate, Random ID Generation, and Global Data.</li>
							<li className="font-raleway font-standard font-weight-600 txt-333 line-height-125per pt-5"><b>AuthController</b> register, activate account, automated email, login, logout, forgot password, reset password. Uses the Validator, Auth, Session, Hash, Mail, Libraries, HTTP Response Codes.</li>
							<li className="font-raleway font-standard font-weight-600 txt-333 line-height-125per pt-5"><b>MessagingController</b> contact. Uses the Validator and Mail.</li>
							<li className="font-raleway font-standard font-weight-600 txt-333 line-height-125per pt-5"><b>CheckListController</b> save checklists, read checklists, delete checklists, change default checklist, save checklist items, delete checklist items. Uses the Auth, Libraries, HTTP Response Codes.</li>
							<li className="font-raleway font-standard font-weight-600 txt-333 line-height-125per pt-5"><b>PortfolioController</b> save portfolios, read portfolios, delete portfolios, change default portfolio, save portfolio symbols, delete portfolio symbols. Uses the Auth, Libraries, Exceptions, HTTP Response Codes, AlphaVantage API.</li>
							<li className="font-raleway font-standard font-weight-600 txt-333 line-height-125per pt-5"><b>TrafficController</b> save locations, read locations, delete locations, change default locations. Uses the Auth, Libraries, Exceptions, HTTP Response Codes, MapQuest API.</li>
							<li className="font-raleway font-standard font-weight-600 txt-333 line-height-125per pt-5"><b>WeatherController</b> save locations, read locations, delete locations, change default locations. Uses the Auth, Libraries, Exceptions, HTTP Response Codes, WeatherAPI.com API.</li>
						</ul>
					
					</div>
				</div>
			</div>
		</div>
	);
}

export default TechnicalHighlights;