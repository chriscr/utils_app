import React from 'react';

const LoadingSpinner = ({ paddingClass }) => {
  const spinnerClassName = paddingClass === 'none' || '' ? 'center-everything' : 'center-everything '+paddingClass;
  
  return (
	<div className={spinnerClassName}>
    	<span className="loading"></span>
	</div>
  );
}

export default LoadingSpinner;