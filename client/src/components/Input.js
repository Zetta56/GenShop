import React from "react";

//Props: input, meta, input attributes
const Input = (props) => {
	const error = props.meta.error && props.meta.touched ? "red" : "";

	const renderInput = () => {
		return (
			<React.Fragment>
				<input 
					{...props.input} 
					type={props.inputType} 
					placeholder={props.placeholder || props.label} 
					min={props.min || 0}
					max={props.max}
					step={props.step || "any"}
					required={!props.required ? false : true} />
				{props.meta.touched && props.meta.error &&
					<div className="errorLabel">{props.meta.error}</div>
				}
			</React.Fragment>
		);
	};

	if(props.icon) {
		//Icon Input
		return (
			<div className={`${error} ui left icon input field`}>
				{renderInput()}
				<i className={`${props.icon} icon`} />
			</div>
		);
	} else {
		//Text Label Input
		return (
			<div className={`${error} field`}>
				<label>{props.label}</label>
				{renderInput()}
			</div>
		);
	}
};

export default Input;