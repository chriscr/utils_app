import React, {useState} from 'react';
//import { useJsApiLoader  } from '@react-google-maps/api';

import TrafficLocationFinder from './TrafficLocationFinder';

import LoadingSpinner from '../frontend/LoadingSpinner';

import $ from "jquery";

import arrow_right_90 from '../../assets/frontend/images/arrow_right_90.png';

function Traffic(){
	
	//google maps api key
	/*
	const { isLoaded } = useJsApiLoader({
	    id: 'google-map-script',
	    googleMapsApiKey: "AIzaSyDEpzf8k-2rcVs06WNFZiOfwsOyAaFOz0E"
	});
	*/
	
	//const mapRef = useRef();
	
	// using hooks
    const [isLoading, setIsLoading] = useState(true);
	const [trafficIncidentData, setTrafficIncidentData] = useState({
		location: {
			city: '',
			state: '',
			country: '',
			lat: '',
			lng: '',
		},
		incidents: [],
		incident_locations: [],
	});
	
	//google maps api to convert lat-long to street address
    //const [isGeoCodesLoaded, setGeoCodesLoaded,] = useState(false);

	const handleLocationFinderOpen = (isLocationFinderOpen) => {
		if(isLocationFinderOpen){
			$('#map_container').addClass('hide');
			$('#incident_data').addClass('hide');
		}else{
			$('#map_container').removeClass('hide');
			$('#incident_data').removeClass('hide');
		}
	};

	const handleTrafficIncidentData = (trafficIncidentDataFromLocationFinder, locations) => {

		if(trafficIncidentDataFromLocationFinder && trafficIncidentDataFromLocationFinder.incidents && trafficIncidentDataFromLocationFinder.incidents.length > 0){
			
			var incident_locations  = [];
			for (let i = 0; i < trafficIncidentDataFromLocationFinder.incidents.length; i++) {
				if(trafficIncidentDataFromLocationFinder.incidents[i].severity === 1){
					incident_locations.push({ lat: trafficIncidentDataFromLocationFinder.incidents[i].lat, lng: trafficIncidentDataFromLocationFinder.incidents[i].lng, icon: 'yellow', short_desc:  trafficIncidentDataFromLocationFinder.incidents[i].shortDesc});
				}else if(trafficIncidentDataFromLocationFinder.incidents[i].severity === 2){
					incident_locations.push({ lat: trafficIncidentDataFromLocationFinder.incidents[i].lat, lng: trafficIncidentDataFromLocationFinder.incidents[i].lng, icon: 'orange', short_desc:  trafficIncidentDataFromLocationFinder.incidents[i].shortDesc });
				}else if(trafficIncidentDataFromLocationFinder.incidents[i].severity === 3){
					incident_locations.push({ lat: trafficIncidentDataFromLocationFinder.incidents[i].lat, lng: trafficIncidentDataFromLocationFinder.incidents[i].lng, icon: 'red', short_desc:  trafficIncidentDataFromLocationFinder.incidents[i].shortDesc });
				}else if(trafficIncidentDataFromLocationFinder.incidents[i].severity === 4){
					incident_locations.push({ lat: trafficIncidentDataFromLocationFinder.incidents[i].lat, lng: trafficIncidentDataFromLocationFinder.incidents[i].lng, icon: 'purple', short_desc:  trafficIncidentDataFromLocationFinder.incidents[i].shortDesc });
				}if(trafficIncidentDataFromLocationFinder.incidents[i].severity === 5){
					incident_locations.push({ lat: trafficIncidentDataFromLocationFinder.incidents[i].lat, lng: trafficIncidentDataFromLocationFinder.incidents[i].lng, icon: 'pink', short_desc:  trafficIncidentDataFromLocationFinder.incidents[i].shortDesc });
				}
        
			}
			
			setTrafficIncidentData({...trafficIncidentData,
				location: trafficIncidentDataFromLocationFinder.location,
				incidents: trafficIncidentDataFromLocationFinder.incidents,
				incident_locations: incident_locations,
			});
			
		}else{
			setTrafficIncidentData({...trafficIncidentData,
				location: {
					city: '',
					state: '',
					country: '',
					lat: '',
					lng: '',
				},
				incidents: [],
				incident_locations: [],
			});
		}
		
		setIsLoading(false);
	};

	return(
		<div className="body-content z-index-0 bg-fff pt-70l-110m-50s pb-20l-10s">
		
			<div className="panel largeX ptb-20l-10s plr-20l-10s">
			
				<div className="grid-x">
				
					<div className="large-11 medium-11 small-10 cell text-left">
						<div className="font-raleway page-header font-weight-800 italic txt-dark-blue bb2-dark-blue uppercase pb-5">Traffic </div>
						<div className="pt-5">
							<span className="font-raleway font-medium font-weight-600">
							{trafficIncidentData.location.city ? trafficIncidentData.location.city+', '+trafficIncidentData.location.state +' '+trafficIncidentData.location.country: ''}
							</span>
							<span className="font-source-sans font-standard font-weight-500 pl-5 hide-for-480px">
							{trafficIncidentData.location.city ? '('+trafficIncidentData.location.lat+', '+trafficIncidentData.location.lng+')' : ''}
							</span>
						</div>
					</div>
					<div className="large-1 medium-1 small-2 cell text-right">
						<TrafficLocationFinder onTrafficIncidentData={handleTrafficIncidentData} onLocationFinderOpen={handleLocationFinderOpen} />
 					</div>
				
				</div>
				
				{trafficIncidentData.incidents.length > 0 ? ( 
				<div className="grid-x pt-10">
					<div id="incident_data" className="large-12 medium-12 small-12 cell pt-10">
							<table className=" ">
								<thead className="bg-ccc">
									<td className="p-5">Sev.</td>
									<td></td>
									<td></td>
									<td>Start</td>
									<td>End</td>
								</thead>
								<tbody>
								{trafficIncidentData.incidents.map((incident, index) => (
									<tr key={incident.id}>
										<td key={incident.id + '_4'} className="font-raleway font-standard font-weight-500 plr-10">{incident.severity}</td>
										<td key={incident.id + '_2'} className="width-40px"><img src={incident.iconURL} width="40" alt="incident"/></td>
										<td key={incident.id + '_3'} className="font-raleway font-standard font-weight-500 ptb-10 pl-5">{incident.address}<div className="pt-5">{incident.fullDesc}<br/>{'('+incident.lat+', '+incident.lng+')'}</div></td>
										<td key={incident.id + '_5'} className="font-raleway font-small font-weight-500">{incident.startTime}</td>
										<td key={incident.id + '_6'} className="font-raleway font-small font-weight-500">{incident.endTime}</td>
									</tr>
						    	))}
						    	</tbody>
						    </table>
					</div>
				</div>
				): (
				<div className="grid-x">
					<div className="large-12 medium-12 small-12 cell">
						{trafficIncidentData.location.city  ? (
							trafficIncidentData.incidents.length > 0 ? (
								<></>
							) : (
							<span className="font-raleway page-text font-weight-600 txt-dark-blue left">No Traffic Incidents</span>
							)
						) : (
						<div>
						<div className="clearfix vertical-center-content pt-10 pr-5">
							<span className="font-raleway page-text font-weight-600 txt-dark-blue left">No Location Selected</span>
							<span className="font-raleway page-standard font-weight-600 txt-dark-blue right">Add Location <img src={arrow_right_90} width="35" alt="note for order"/></span>
						</div>
						<div className="text-center p-20 b1-ccc bg-fafafa mt-20">
							<span className="font-raleway page-text font-weight-600 txt-333">Data Provided by MapQuest API</span>
						</div>
						</div>
						)}
					</div>
				</div>
				)
				}
					
				{isLoading && 
				<div className="grid-x">
					<div className="large-12 medium-12 small-12 cell text-center">
					<LoadingSpinner paddingClass="p-20l-10s" />
					</div>
				</div>
				}
			</div>
		</div>
	);
}

export default Traffic;