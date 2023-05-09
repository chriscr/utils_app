import React, {useState, useRef} from 'react';
import {Link} from 'react-router-dom';

import WeatherLocationFinder from './WeatherLocationFinder';

import LoadingSpinner from '../frontend/LoadingSpinner';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import $ from "jquery";

import wind_icon from '../../assets/frontend/images/wind_icon.png';
import precip_icon from '../../assets/frontend/images/precip_icon.png';
import arrow_right_90 from '../../assets/frontend/images/arrow_right_90.png';

function Weather(){
	
	const chartRef = useRef();
	
	// using hooks
    const [isLoading, setIsLoading] = useState(true);
	const [weatherForecastData, setWeatherForecastData] = useState({
		current: {
			condition: {
				icon: ''
			}
		},
		location: {
			name: '',
			country: '',
			lat: '',
			lon: '',
		},
		forecast: {},
		daily_forecast_chart_options: [],
		daily_forecast_toggle: [false, false, false],
		daily_forecast_toggle_index: -1,
	});

	const handleLocationFinderOpen = (isLocationFinderOpen) => {
		if(isLocationFinderOpen){
			$('#highchart').addClass('hide');
			$('#forecast_data').addClass('hide');
		}else{
			$('#highchart').removeClass('hide');
			$('#forecast_data').removeClass('hide');
			
		    if (chartRef.current) {
				weatherForecastData.daily_forecast_toggle.map((daily_forecast_toggle_item, index) => {
					if(daily_forecast_toggle_item){
						const chart = chartRef.chart;
					}
				});
		    }
		}
	};

	const handleWeatherForecastData = (weatherForecastDataFromLocationFinder, locations) => {

		if(weatherForecastDataFromLocationFinder){
			
			//prepare highcharts series data
			var daily_forecast_chart_options = [];
			for (let i = 0; i < weatherForecastDataFromLocationFinder.forecast.forecastday.length; i++) {
				var daily_item = weatherForecastDataFromLocationFinder.forecast.forecastday[i];
				
				var hourly_temperature_data = [];
				for (let j = 0; j < daily_item.hour.length; j++) {
					var hourly_item = daily_item.hour[j];
					
					var date_string = hourly_item.date.replace(':00', ':00 ');
					const date = new Date(Date.parse(date_string));
					const hourly_item_timestamp_UTC = Date.UTC(
					  date.getUTCFullYear(),
					  date.getUTCMonth(),
					  date.getUTCDate(),
					  date.getUTCHours(),
					  date.getUTCMinutes(),
					  date.getUTCSeconds(),
					  date.getUTCMilliseconds()
					);
					hourly_temperature_data.push([hourly_item_timestamp_UTC, hourly_item.temp_f]);
				}
				
				var options = {
					chart: {
						height: 200,
						backgroundColor: 'transparent',
						spacing: [20, 0, 0, 0], // set spacing to 0 on all sides
					    margin: {
					      top: 0,
					      right: 0,
					      bottom: 20, // set a larger bottom margin to give x-axis labels more space
					      left: 30, // set a larger left margin to give y-axis title more space
					    },
					},
					title: {
						text: ''
					},
					xAxis: {
						type: 'datetime',
						labels: {
							formatter: function() {
								return Highcharts.dateFormat("%I:%M", this.value);
							}
						}
					},
					yAxis: {
						title: ''
					},
					legend: {
						enabled: false,
					},
					series: [{
						name: 'Temp (F)',
						data: hourly_temperature_data,
						type: 'spline',
						zIndex: 2
					}],
					tooltip: {
						useHTML: true,
						headerFormat: '',
						pointFormat: '{point.y} &#176;F'
					}
				};
				
				daily_forecast_chart_options.push(options);
				
			}
			
			setWeatherForecastData({...weatherForecastData,
				current: weatherForecastDataFromLocationFinder.current,
				location: weatherForecastDataFromLocationFinder.location,
				forecast: weatherForecastDataFromLocationFinder.forecast,
				daily_forecast_chart_options: daily_forecast_chart_options,
				daily_forecast_toggle: [true, false, false],
				daily_forecast_toggle_index: 0,
			});
		}else{
			setWeatherForecastData({...weatherForecastData,
				current: {
					condition: {
						icon: '',
					},
				},
				location: {
					name: '',
					region: '',
					country: '',
					lat: '',
					lon: '',
				},
				forecast: {},
				daily_forecast_chart_options: [],
				daily_forecast_toggle: [false, false, false],
				daily_forecast_toggle_index: -1,
			});
		}
		
		setIsLoading(false);
	};
	
	const handleDailyForecastToggle = (event, daily_index) => {
		event.persist();
		
		var daily_forecast_toggle_updated = [false, false, false];
		weatherForecastData.daily_forecast_toggle.map((toggle_daily_chart_item, index) => {
			if(index === daily_index){
				daily_forecast_toggle_updated[index] = true;
			}else{
				daily_forecast_toggle_updated[index] = false;
			}
		});
		setWeatherForecastData((prev) => ({...prev, daily_forecast_toggle: daily_forecast_toggle_updated, daily_forecast_toggle_index: daily_index}));
		
		//remove the focus off the button after it is clicked
		event.currentTarget.blur();
	}

	return(
		<div className="body-content z-index-0 bg-fff pt-70l-110m-50s pb-20l-10s">
		
			<div className="panel large  pt-20l-10s">
			
				<div className="grid-x">
				
					<div className="large-11 medium-11 small-10 cell text-left">
						<div className="font-raleway page-header font-weight-800 italic txt-dark-blue bb2-dark-blue uppercase pb-5">Weather</div>
						<div className="pt-5">
							<span className="font-raleway font-medium font-weight-600">
							{weatherForecastData.location.name ? weatherForecastData.location.name+', '+weatherForecastData.location.region +' '+weatherForecastData.location.country: ''}
							</span>
							<span className="font-source-sans font-standard font-weight-500 pl-5 hide-for-480px">
							{weatherForecastData.location.name ? '('+weatherForecastData.location.lat+', '+weatherForecastData.location.lon+')' : ''}
							</span>
						</div>
					</div>
					<div className="large-1 medium-1 small-2 cell text-right">
						<WeatherLocationFinder onWeatherForecastData={handleWeatherForecastData} onLocationFinderOpen={handleLocationFinderOpen} />
					</div>
					
				</div>
				
				{weatherForecastData.location.name ? (
				<div className="grid-x">
					<div className="large-12 medium-12 small-12 cell pt-10">
						<div className="grid-x bg-fafafa b1-ccc p-20l-10s">
							<div className="large-3 medium-6 small-6 cell text-center">
								<div className="font-raleway font-standard font-weight-600 txt-333">{weatherForecastData.location.localtime ? weatherForecastData.location.date : ''}</div>
								<div className="font-raleway font-xx-large font-weight-500 txt-333 pt-10">{weatherForecastData.location.localtime ? weatherForecastData.location.localtime : ''}</div>
							</div>
							<div className="large-3 medium-6 small-6 cell text-center">
								<span className="font-raleway font-v-large font-weight-600 txt-333">
								{weatherForecastData.current.temp_f ? Math.round(weatherForecastData.current.temp_f) : ''}&#176;
								</span>
							</div>
							<div className="large-3 medium-6 small-6 cell text-center">
								<img src={weatherForecastData.current.condition.icon} width="45" alt="current condition" />
								<div className="font-raleway font-standard font-weight-600 txt-333 text-center">
								{weatherForecastData.current.condition.text}
								</div>
							</div>
							<div className="large-3 medium-6 small-6 cell text-center">
								<div className="font-raleway font-standard font-weight-600 txt-333 text-center pt-20">
									Max: {Math.round(weatherForecastData.forecast.forecastday[0].day.maxtemp_f)}&deg;&nbsp;&nbsp;Min: {Math.round(weatherForecastData.forecast.forecastday[0].day.mintemp_f)}&deg;
								</div>
								<div className="font-raleway font-standard font-weight-600 txt-333 text-center pt-5">
									Wind: {weatherForecastData.current.wind_dir}&nbsp;&nbsp;{Math.round(weatherForecastData.current.wind_mph)}&nbsp;mph
								</div>
							</div>
						</div>
					</div>
					<div id="highchart" className="large-12 medium-12 small-12 cell pt-10">
						<div className="grid-x bg-fafafa b1-ccc p-20l-10s">
							{weatherForecastData.forecast.forecastday.map((day_item, daily_index) =>
							<div key={day_item.day_of_week} className="large-4 medium-4 small-4 cell text-center">
								<Link key={'daily_link_'+daily_index} to="#" onClick={(event) => handleDailyForecastToggle(event, daily_index)} onTouchEnd={(event) => handleDailyForecastToggle(event, daily_index)} className={daily_index === weatherForecastData.daily_forecast_toggle_index ? 'button day active' : 'button day'} disabled={daily_index === weatherForecastData.daily_forecast_toggle_index ? 'disabled' : ''}><span className="font-raleway font-standard font-weight-600 text-center">{day_item.day_of_week}&nbsp;24hr</span></Link>
							</div>
							)}
							<div className="large-12 medium-12 small-12 cell text-center pt-10">
								<HighchartsReact highcharts={Highcharts} options={weatherForecastData.daily_forecast_chart_options[weatherForecastData.daily_forecast_toggle_index]} ref={chartRef}/>
							</div>
						</div>
					</div>
					<div id="forecast_data" className="large-12 medium-12 small-12 cell pt-10">
						<div className="bg-fafafa b1-ccc p-20l-10s">
						{weatherForecastData.daily_forecast_toggle.map((day_forecast, daily_index) => {
							if (day_forecast) {
							return (
							<table key={'table_'+daily_index} className="unstriped unbordered">
								<tbody>
								{weatherForecastData.forecast.forecastday[daily_index].hour.map((hourly_data) => (
									<tr key={hourly_data.time} className="bb1-ccc">
										<td key={hourly_data.time + '_1'} className="font-raleway font-standard font-weight-600 width-100px"><span className="pl5">{hourly_data.day_of_week + ' ' + hourly_data.time}</span></td>
										<td key={hourly_data.time + '_2'} className="font-raleway font-large font-weight-600 width-50px">{Math.round(hourly_data.temp_f)}&#176;</td>
										<td key={hourly_data.time + '_3'} className="font-raleway font-standard font-weight-500 width-150pxx"><img src={hourly_data.condition.icon} alt="condition" width="40"/><br className="show-for-480px" />{hourly_data.condition.text}</td>
										<td key={hourly_data.time + '_4'} className="font-sraleway font-standard font-weight-500 width-150pxx hide-for-580px"><img src={wind_icon} width="25" alt="wind"/> <br className="show-for-480px" />Wind {hourly_data.wind_dir}&nbsp;&nbsp;{Math.round(hourly_data.wind_mph)} mph</td>
										<td key={hourly_data.time + '_5'} className="font-raleway font-standard font-weight-500 width-80pxx"><img src={precip_icon} width="25" alt="precipitation"/> <br className="show-for-480px" />{hourly_data.precip_mm} mm</td>
									</tr>
						    	))}
						    	</tbody>
						    </table>
						    )
						  }
						})}
						</div>
					</div>
				</div>
				) : (
				<div className="grid-x">
					<div className="large-12 medium-12 small-12 cell">
						{weatherForecastData.location.name  ? (
							weatherForecastData.forecast.length > 0 ? (
								<></>
							) : (
							<span className="font-raleway page-text font-weight-600 txt-dark-blue left">No Weather Forecasts</span>
							)
						) : (
						<div>
						<div className="clearfix vertical-center-content pt-10 pr-5">
							<span className="font-raleway page-text font-weight-600 txt-dark-blue left">No Location Selected</span>
							<span className="font-raleway page-standard font-weight-600 txt-dark-blue right">Add Location <img src={arrow_right_90} width="35" alt="note for order"/></span>
						</div>
						<div className="text-center p-20 b1-ccc bg-fafafa mt-20">
							<span className="font-raleway page-text font-weight-600 txt-333">Data Provided by WeatherAPI.com API</span>
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

export default Weather;