import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';

import PortfolioManager from './PortfolioManager';
import AuthUtility from '../frontend/auth/AuthUtility';
import LoadingSpinner from '../frontend/LoadingSpinner';

import Alert from "@material-ui/lab/Alert";

import {Button, Snackbar} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

//import $ from "jquery";
import axios from 'axios';
import swal from 'sweetalert';

import add_icon from '../../assets/frontend/images/add_icon.png';
import check_icon from '../../assets/frontend/images/check_icon.png';
import check_icon_disabled from '../../assets/frontend/images/check_icon_disabled.png';
import cancel_icon from '../../assets/frontend/images/cancel_icon.png';
import delete_icon from '../../assets/frontend/images/delete_red_light.png';
import arrow_left_90 from '../../assets/frontend/images/arrow_left_90.png';
import arrow_right_90 from '../../assets/frontend/images/arrow_right_90.png';

function Portfolio(){
	
	const navHistory = useNavigate();
	
	// using hooks
    const [isLoading, setIsLoading] = useState(true);
    const [isAdd, setAdd] = useState(false);
    const [isEdit, setEdit] = useState(false);
    const [disable, setDisable] = useState(true);
    const [openAlertSaved, setOpenAlertSaved] = useState(false);
    const [openAlertDeleted, setOpenAlertDeleted] = useState(false);
	const [portfolio, setPortfolio] = useState({
		name: '',
		random_id: '',
		data: [
        //{ id: 1, user_id: "", symbol: "", status: "", order: 1, random_id: "", created: "", updated: "" },
        ],
	});
	const [portfolioForCancel, setPortfolioForCancel] = useState({
		data: [
        //{ id: 1, user_id: "", symbol: "", status: "", order: 1, random_id: "", created: "", updated: "" },
        ],
	});
    const [showConfirmAll, setShowConfirmAll] = useState(false);
  	/* NO IMPLEMENTION FOR INDIVIDUAL DELETE
    const [showConfirm, setShowConfirm] = useState(false);
	*/

	const handlePortfolioManagerOpen = (isPortfolioManagerOpen) => {
		if(isPortfolioManagerOpen){
			//hide some elements
		}else{
			//show some elements
		}
	};
	
	const handleApiResponses = (defaultPortfolio, defaultPortfolioData, apiResponses) => {
		
	    // Handle the API responses here
		var portfolioDataWithPrices = [];
		if(apiResponses){
			for (let i = 0; i < apiResponses.length; i++) {
				let responseData = apiResponses[i];
				
				var filteredDefaultPortfolioData = defaultPortfolioData.filter(symbol_obj => symbol_obj.symbol === responseData['Global Quote']['01. symbol']).map(symbol_obj => { return(
					symbol_obj
			  	)});
				
				var symbol_api_data = {
					open: parseFloat(responseData['Global Quote']['02. open'].replace(/,/g, '')).toFixed(2),
					high: parseFloat(responseData['Global Quote']['03. high'].replace(/,/g, '')).toFixed(2),
					low: parseFloat(responseData['Global Quote']['04. low'].replace(/,/g, '')).toFixed(2),
					price: parseFloat(responseData['Global Quote']['05. price'].replace(/,/g, '')).toFixed(2),
					volume: parseInt(responseData['Global Quote']['06. volume']),
					previous_close: parseFloat(responseData['Global Quote']['08. previous close'].replace(/,/g, '')).toFixed(2),
					change: parseFloat(responseData['Global Quote']['09. change'].replace(/,/g, '')).toFixed(2),
					change_percent: parseFloat(responseData['Global Quote']['10. change percent'].replace(/,/g, '').replace('%', '')).toFixed(2),
				};
				
				const merged_data = { ...filteredDefaultPortfolioData[0], ...symbol_api_data };
				
				portfolioDataWithPrices.push(merged_data);
			}
			
			setPortfolio({...portfolio, name: defaultPortfolio.name, random_id: defaultPortfolio.random_id, data: portfolioDataWithPrices});
    
		}else{
			setPortfolio({...portfolio, name: '', random_id: '', data: []});
		}
		
		setIsLoading(false);
	};

	const handlePortfolioData = (defaultPortfolio, defaultPortfolioData) => {//properties coming from PortfolioManager

		if(defaultPortfolioData && defaultPortfolioData.length > 0){
			
			const apiPromises = [];
			
    		defaultPortfolioData.forEach((symbol_obj) => {
				
				const promise = axios.get('https://www.alphavantage.co/query', {
					params: {
						function: 'GLOBAL_QUOTE',
						symbol: symbol_obj.symbol.toUpperCase(),
						apikey: 'YN3NA1LG2J91KYH0'
					},
					withCredentials: false, // Disable credentials mode
					headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					}
				}).then(response => {
					return response.data;
				}).catch(error => {
					console.log('[handlePortfolioData - alphavantage api call] Error: ', error);
				});
				
				apiPromises.push(promise);
				
			});
			
			//resolve all promises together
			Promise.all(apiPromises).then((apiResponses) => {
				handleApiResponses(defaultPortfolio, defaultPortfolioData, apiResponses);
			}).catch((error) => {
				console.log('[handlePortfolioData - Promise.all ] Error: ', error);
				
				setIsLoading(false);
			});
		}else if(defaultPortfolio){
			setPortfolio({...portfolio, name: defaultPortfolio.name, random_id: defaultPortfolio.random_id, data: []});
		}else{
			setPortfolio({...portfolio, name: '', random_id: '', data: []});
		}
		
		setIsLoading(false);
	};

    // Function For closing the alert snackbar
    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenAlertSaved(false);
        setOpenAlertDeleted(false);
    };
  
    // Function For adding new row object
    const handleAdd = () => {
        var list = [...portfolio.data];
        	
		//cache on first click of add button
		if(!isAdd){
			const clonedList = JSON.parse(JSON.stringify(list));
			
			//cache rows before changing for cancelling
			if(list.length === 0){
				setPortfolioForCancel({...portfolioForCancel, data: []});
			}else{
				setPortfolioForCancel({...portfolioForCancel, data: clonedList});
			}
		}
		
		list.push({ id: portfolio.data.length + 1, symbol: ""});
        setPortfolio({...portfolio, data: list});
        
        setAdd(true);
        setEdit(true);
    };

	const handleCancel = () => {
        const list = [...portfolioForCancel.data];
		const clonedList = JSON.parse(JSON.stringify(list));
		
		//set rows to the old cached rows
		setPortfolio({...portfolio, data: clonedList});

        setDisable(true);
        setAdd(!isAdd);
        setEdit(!isEdit);
	}
  
    // The handleInputChange handler can be set up to handle
    // many different inputs in the form, listen for changes 
    // to input elements and record their values in state
    const handleInputChange = (event, index) => {
		event.stopPropagation()
		
        const { name, value } = event.target;
        
        const list = [...portfolio.data];
		
		list[index][name] = value.toUpperCase();
		
		setPortfolio({...portfolio, data: list});
  
        setDisable(false);
    };
  
    // Function to handle save
    const handleSave = () => {
		setPortfolio({...portfolio, data: portfolio.data});

		savePortfolioSymbol();

        setAdd(!isAdd);
        setEdit(!isEdit);
        setDisable(true);

		//remove cached rows  for cancelling
		setPortfolioForCancel([]);
    };

	function savePortfolioSymbol(){
		
		setIsLoading(true);
			
		//values sent to api
		var data = {
			portfolio_random_id: portfolio.random_id,
			//entire rows list converted to string
			portfolio_symbols_json_string: JSON.stringify(portfolio.data),
		}
	
		axios.post('/api/save_symbols', data, {
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
			}
		}).then(response =>{
			
			var portfolio_data;
			var error_message;
			
			if(response.data.status === 200){//HTTP_OK
				portfolio_data = response.data.portfolio_data;
			
				error_message = '';
				for (let i = 0; i < portfolio_data.length; i++) {
					if (portfolio_data[i].hasOwnProperty('error')) {
						error_message = error_message + ' ' + portfolio_data[i]['symbol']+' '+portfolio_data[i]['error'];
						portfolio_data.splice(i, 1);
						i--;
					}
				}
				
				if(error_message){
                	swal("Warning", error_message, "warning");
				}else{
					setOpenAlertSaved(true);
				}
			
				//update all state properties
				setPortfolio({...portfolio, data: portfolio_data});
					
            }else if(response.data.status === 401){//HTTP_UNAUTHORIZED
				
				//user not authenticated on server so remove from local storage
				AuthUtility.clearAuthData();
				/*
	            localStorage.removeItem('auth_token');
	            localStorage.removeItem('auth_role');
	
				if(!isChecked){
	            	localStorage.removeItem('auth_users_name');
	            	localStorage.removeItem('auth_users_last_name');
	            	localStorage.removeItem('auth_email');
	            	localStorage.removeItem('password');
	            	localStorage.removeItem('remember_me');
				}
				*/
            
				swal("Warning",response.data.message,"warning");
				navHistory('/login');

            }else if(response.data.status === 422){//HTTP_UNPROCESSABLE_ENTITY
				portfolio_data = response.data.portfolio_data;
				
				error_message = '';
				for (let i = 0; i < portfolio_data.length; i++) {
					if (portfolio_data[i].hasOwnProperty('error')) {
						error_message = error_message + ' ' + portfolio_data[i]['symbol']+' '+portfolio_data[i]['error'];
						portfolio_data.splice(i, 1);
						i--;
					}
				}
				
				if(error_message){
			
					//update state properties
					setPortfolio({...portfolio, data: portfolio_data});
                	swal("Warning", error_message, "warning");
				}else{
                	swal("Warning", response.data.message, "warning");
				}
            }else{//more errors
            }
            
			setIsLoading(false);
			
		}).catch(function (error) {
			console.log('[savePortfolioSymbol] error: ',error + ' back-end api call error');
		
			setIsLoading(false);
			swal("Error",error,"error");
			navHistory('/portfolio');
		});
	}
	
    // Showing delete all confirmation to users
    const handleConfirmAll = () => {
        setShowConfirmAll(true);
    };
 
    // Delete row of id:i
    const handleRemoveClick = (i) => {
        const list = [...portfolio.data];

		if(list[i]['random_id'] && list[i]['random_id'] !== ''){
			deletePortfolioSymbol(list[i]['random_id']);//send a specific unique ID to delete
		}
    };

    const handleRemoveAllClick = () => {

		// No unique ID to delete all
		deletePortfolioSymbol();
        setShowConfirmAll(false);
    };

    // Handle delete confirmation  where user click no 
    const handleNoAll = () => {
        setShowConfirmAll(false);
    };

	function deletePortfolioSymbol(portfolio_symbol_random_id){
		
		setIsLoading(true);

		/*
		//values sent to api for an individual list item delete
		var data;
		if(!portfolio_symbol_random_id || portfolio_symbol_random_id === ''){
			data = {
			portfolio_random_id: portfolio.random_id,
			}
		}else{
			data = {
			portfolio_random_id: portfolio.random_id,
			portfolio_symbol_random_id: portfolio_symbol_random_id,
			}
		}
		*/
		if(!portfolio_symbol_random_id || portfolio_symbol_random_id === ''){
			portfolio_symbol_random_id = 'none';
		}
			
		axios.delete('/api/delete_symbol/'+portfolio.random_id+'/'+portfolio_symbol_random_id, {
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
			}
		}).then(response =>{
			if(response.data.status === 200){//HTTP_OK
			
				var list = [];
				
				if(portfolio_symbol_random_id && portfolio_symbol_random_id !== 'none'){
				
			        list = [...portfolio.data];
			        
					for (let i = 0; i < list.length; i++) {
						if (list[i]['random_id'] === portfolio_symbol_random_id) {
							list.splice(i, 1);
							break;
						}
					}
				}
			
				//update all state properties
				setPortfolio({...portfolio, data: list});
					
            }else if(response.data.status === 401){//HTTP_UNAUTHORIZED
				
				//user not authenticated on server so remove from local storage
				AuthUtility.clearAuthData();
				/*
	            localStorage.removeItem('auth_token');
	            localStorage.removeItem('auth_role');
	
				if(!isChecked){
	            	localStorage.removeItem('auth_users_name');
	            	localStorage.removeItem('auth_users_last_name');
	            	localStorage.removeItem('auth_email');
	            	localStorage.removeItem('password');
	            	localStorage.removeItem('remember_me');
				}
				*/
            
				swal("Warning",response.data.message,"warning");
				navHistory('/login');
				
            }else if(response.data.status === 422){//HTTP_UNPROCESSABLE_ENTITY
                swal("Warning",response.data.message,"warning");
            }else{//more errors
            }
            
			setIsLoading(false);
	
		}).catch(function (error) {
			console.log('[deletePortfolioSymbol] error: ',error + ' back-end api call error');
		
			setIsLoading(false);
			swal("Error",error,"error");
			navHistory('/stock_market');
		});
	}
	
	return(
		<div className="body-content z-index-0 bg-fff pt-70l-110m-50s pb-20l-10s">
		
			<Snackbar open={openAlertSaved} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }} style={{ marginTop: "70px" }}>
				<Alert onClose={handleClose} severity="success">Symbol Saved Successfully!</Alert>
			</Snackbar>
			<Snackbar open={openAlertDeleted} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }} style={{ marginTop: "70px" }}>
				<Alert onClose={handleClose} severity="error">Symbol Deleted Successfully!</Alert>
			</Snackbar>
		
			<div className="panel largeX ptb-20l-10s plr-20l-10s">
			
				<div className="grid-x">
				
					<div className="large-11 medium-11 small-10 cell text-left">
						<div className="font-raleway page-header font-weight-800 italic txt-dark-blue bb2-dark-blue uppercase pb-5">Portfolio</div>
						<div className="pt-5">
							<span className="font-raleway font-text font-weight-600">
							{portfolio.name}
							</span>
						</div>
					</div>
					<div className="large-1 medium-1 small-2 cell text-right">
						<PortfolioManager onPortfolioData={handlePortfolioData} onPortfolioManagerOpen={handlePortfolioManagerOpen} />
					</div>
					
					{portfolio.name  ? (
					<div className="large-12 medium-12 small-12 cell ptb-10">
				        {isEdit ? (
						<div className="clearfix">
							<span className="left">
				            <Link onClick={handleAdd} className=" icon-with-text no-underline">
				            	<img src={add_icon} className="" width="20" alt="add symbol"/> <span className="txt-blue">ADD</span>
				            </Link>
				            </span>
				            {portfolio.data.length > 0 && (
							<span className="left pl-20">
				                {disable ? (
									<Link disabled className="icon-with-text hover-opacity-50 no-underline disabled">
										<img src={check_icon_disabled} className="" width="20" alt="save items"/> <span className="txt-ccc">SAVE</span>
									</Link>
				                ) : (
									<Link onClick={handleSave} className="icon-with-text hover-opacity-50 no-underline">
										<img src={check_icon} className="" width="20" alt="save items"/> <span className="txt-blue">SAVE</span>
									</Link>
				                )}
								<span className="pl-20">
								<Link onClick={handleCancel} className="icon-with-text hover-opacity-50 no-underline">
									<img src={cancel_icon} className="" width="20" alt="cancel add items"/> <span className="txt-blue">CANCEL</span>
								</Link>
								</span>
							</span>
				            )}
						</div>
				        ) : (
						<div className="clearfix">
							<span className="left">
				            <Link onClick={handleAdd} className=" icon-with-text no-underline">
				            	<img src={add_icon} className="" width="20" alt="add symbol"/> <span className="txt-blue">ADD</span>
				            </Link>
				            </span>
							<span className="right pl-20">
				            	{portfolio.data.length > 0 && (
				            	<Link onClick={handleConfirmAll} onTouchEnd={handleConfirmAll}  className="hover-opacity-50 no-underline icon-with-text">
									<img src={delete_icon} className="" width="17" alt="delete check list"/> <span className="txt-red">DELETE ALL</span>
								</Link>
				            	)}
				                {showConfirmAll && (
									<Dialog open={showConfirmAll} onClose={handleNoAll} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
										<DialogTitle id="alert-dialog-title" style={{padding:"0px",paddingTop:"20px", }}><DialogContentText style={{fontFamily:"Raleway",fontSize:20,fontWeight:800,color:"#0E1F2F", fontStyle:"italic",letterSpacing:1,textDecoration:"underline",textTransform:"uppercase"}}>Confirm Delete All</DialogContentText></DialogTitle>
										<DialogContent><DialogContentText id="alert-dialog-description" style={{fontFamily:'Raleway',fontSize:14,fontWeight:500,color:"#0E1F2F"}}>Are you sure you want to delete all symbols from the portfolio?</DialogContentText></DialogContent>
										<DialogActions>
											<Button onClick={handleRemoveAllClick} autoFocus style={{fontFamily:"Raleway",fontSize:12, padding:7}} className="button tiny">Yes</Button>
											<Button onClick={handleNoAll} autoFocus style={{fontFamily:"Raleway",fontSize:12, padding:7}} className="button tiny">No</Button>
										</DialogActions>
									</Dialog>
				                )}
							</span>
						</div>
						)}
					</div>
					) : (
						<></>
					)}
					
					{portfolio.data.length > 0  ? (
					<div id="fportfolio_data" className="large-12 medium-12 small-12 cell ">
						<table key={portfolio.name} className="">
							<tbody>
								{portfolio.data.map((data_item,i) => (
									isEdit ? (
										data_item.random_id ? (
											<tr key={i}>
												<td key={data_item.random_id+'_1'} className="font-raleway font-large font-weight-600 ptb-10 pl-5">{data_item.symbol}</td>
												<td key={data_item.random_id+'_2'} className={data_item.change < 0 ? "font-raleway font-large font-weight-600 txt-red ptb-10 pl-5" : "font-raleway font-large font-weight-600 txt-green ptb-10 pl-5"}>{data_item.price}</td>
												<td key={data_item.random_id+'_3'} className={data_item.change < 0 ? "font-raleway font-text font-weight-600 txt-red ptb-10 pl-5" : "font-raleway font-text font-weight-600 txt-green ptb-10 pl-5"} align="right">{data_item.change < 0 ? '' : '+'}{data_item.change}</td>
												<td key={data_item.random_id+'_4'} className={data_item.change < 0 ? "font-raleway font-text font-weight-600 txt-red ptb-10 pl-5" : "font-raleway font-text font-weight-600 txt-green ptb-10 pr-5"} align="right">{data_item.change < 0 ? '' : '+'}{data_item.change_percent}%</td>
												<td key={data_item.random_id+'_5'} className="font-source-sans page-text font-weight-400 txt-333 text-right plr-10">
													<Link onClick={() => handleRemoveClick(i)} onTouchEnd={() => handleRemoveClick(i)}  className="hover-opacity-50">
														<img src={delete_icon} className="" width="17" alt="delete portfolio"/>
													</Link>
												</td>
											</tr>
										) : (
											<tr key={i}>
												<td key={data_item.id+'_1'} colSpan="2" className="ptb-10 pl-5"><input type="text" className="small width-200px uppercase" value={data_item.symbol} name="symbol" onChange={(e) => handleInputChange(e, i)} placeholder="Symbol"/></td>
												<td colSpan="3"></td>
											</tr>
										)
									) : (
									<tr key={i}>
										<td key={data_item.random_id+'_1'} className="font-raleway font-large font-weight-600 ptb-10 pl-5">{data_item.symbol}</td>
										<td key={data_item.random_id+'_2'} className={data_item.change < 0 ? "font-raleway font-large font-weight-600 txt-red ptb-10 pl-5" : "font-raleway font-large font-weight-600 txt-green ptb-10 pl-5"}>{data_item.price}</td>
										<td key={data_item.random_id+'_3'} className={data_item.change < 0 ? "font-raleway font-text font-weight-600 txt-red ptb-10 pl-5" : "font-raleway font-text font-weight-600 txt-green ptb-10 pl-5"} align="right">{data_item.change < 0 ? '' : '+'}{data_item.change}</td>
										<td key={data_item.random_id+'_4'} className={data_item.change < 0 ? "font-raleway font-text font-weight-600 txt-red ptb-10 pl-5" : "font-raleway font-text font-weight-600 txt-green ptb-10 pr-5"} align="right">{data_item.change < 0 ? '' : '+'}{data_item.change_percent}%</td>
										<td key={data_item.random_id+'_5'} className="font-source-sans page-text font-weight-400 txt-333 text-right plr-10">
											<Link onClick={() => handleRemoveClick(i)} onTouchEnd={() => handleRemoveClick(i)}  className="hover-opacity-50">
												<img src={delete_icon} className="" width="17" alt="delete portfolio"/>
											</Link>
										</td>
									</tr>
									)
						    	))}
					    	</tbody>
					    </table>
					</div>
					): (
					<div className="large-12 medium-12 small-12 cell">
						{portfolio.name  ? (
							portfolio.data.length > 0  ? (
							<></>
							) : (
							<div className="clearfix vertical-center-content pr-5">
								<span className="font-raleway page-standard font-weight-600 txt-333 left"><img src={arrow_left_90} width="35" alt="note for order"/> Add Symbols</span>
							</div>
							)
						) : (
						<div>
						<div className="clearfix vertical-center-content pt-10 pr-5">
							<span className="font-raleway page-text font-weight-600 txt-333 left">No Portfolio Selected</span>
							<span className="font-raleway page-standard font-weight-600 txt-333 right">Add Portfolio <img src={arrow_right_90} width="35" alt="note for order"/></span>
						</div>
						<div className="text-center p-20 b1-ccc bg-fafafa mt-20">
							<span className="font-raleway page-text font-weight-600 txt-333">Data Provided by AlphaVantage API</span>
						</div>
						</div>
						)}
					</div>
					)
					}
					
					{isLoading && 
					<div className="large-12 medium-12 small-12 cell text-center">
					<LoadingSpinner paddingClass="p-20l-10s" />
					</div>
					}
				</div>
			</div>
			
		</div>
	);
}

export default Portfolio;