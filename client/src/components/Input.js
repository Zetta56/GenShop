import React from "react"

const Input = ({input, meta, label, inputType, min, step, icon}) => {
	//Renders error if error exists and user tried to fill in input
	const error = meta.error && meta.touched ? "red" : "";
	
	const renderError = () => {
		if(meta.touched && meta.error) {
			return <div className="errorLabel">{meta.error}</div>
		};
	};

	if(icon) {
		//Icon Input
		return (
			<div className={`${error} ui left icon input field`}>
				<input 
					{...input} 
					type={inputType} 
					placeholder={label} 
					min={min || 0}
					step={step || "any"}
					required />
				<i className={`${icon} icon`} />
				{renderError()}
			</div>
		);
	} else {
		//Text Label Input
		return (
			<div className={`${error} field`}>
				<label>{label}</label>
				<input 
					{...input} 
					type={inputType} 
					placeholder={label} 
					min={min || 0}
					step={step || "any"} 
					required />
				{renderError()}
			</div>
		);
	}
};

export default Input;