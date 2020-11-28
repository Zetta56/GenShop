import React from "react"

const Input = ({input, meta, label, placeholder, inputType, min, max, step, required, icon}) => {
	const finalPlaceholder = placeholder && placeholder.length > 0 ? placeholder : label;
	//Renders error if error exists and user tried to fill in input
	const error = meta.error && meta.touched ? "red" : "";
	
	const renderError = () => {
		if(meta.touched && meta.error) {
			return <div className="errorLabel">{meta.error}</div>
		};
	};

	const renderInput = () => {
		return (
			<input 
				{...input} 
				type={inputType} 
				placeholder={finalPlaceholder} 
				min={min || 0}
				max={max}
				step={step || "any"}
				required={!required ? false : true} />
		);
	};

	if(icon) {
		//Icon Input
		return (
			<div className={`${error} ui left icon input field`}>
				{renderInput()}
				<i className={`${icon} icon`} />
				{renderError()}
			</div>
		);
	} else {
		//Text Label Input
		return (
			<div className={`${error} field`}>
				<label>{label}</label>
				{renderInput()}
				{renderError()}
			</div>
		);
	}
};

export default Input;