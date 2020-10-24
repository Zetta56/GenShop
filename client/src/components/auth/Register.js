import React, {useCallback} from "react";
import {reduxForm, Field} from "redux-form";
import {connect} from "react-redux";
import {createUser} from "../../actions";
import "./UserForm.css";

const Register = ({handleSubmit, createUser}) => {
	const renderError = ({touched, error}) => {
		if(touched && error) {
			return <div className="errorLabel">{error}</div>
		};
	};

	//useCallback prevents renderInput from constantly re-rendering
	const renderInput = useCallback(({input, label, inputType, meta}) => {
		const error = meta.error && meta.touched ? "red" : "";

		return (
			<div className={`${error} field`}>
				<label>{label}</label>
				<input {...input}  type={inputType} placeholder={label} required />
				{renderError(meta)}
			</div>
		);
	}, []);
	
	return (
		<div className="register ui one column stackable grid" id="userForm">
			<div className="column">
				<h2>Create An Account</h2>
				<form className="ui form" onSubmit={handleSubmit(({username, password}) => createUser({username, password}))}>
					<Field name="email" component={renderInput} label="Email" inputType="email" />
					<Field name="username" component={renderInput} label="Username" inputType="text" />
					<Field name="password" component={renderInput} label="Password" inputType="password" />
					<Field name="confirmPassword" component={renderInput} label="Confirm Password" inputType="password" />
					<button className="ui blue submit button" id="submitButton">Create</button>
				</form>
			</div>
		</div>
	);
};

const validate = ({email, username, password, confirmPassword}) => {
	const err = {};
	const emailRegex = RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g);
	const passRegex = RegExp(/^(?=.*\d)(?=.*[\W])(?=.*[a-zA-Z]).{6,}$/g);
	
	if(!emailRegex.test(email)) {
		err.email = "Email must be in a valid format";
	};
	
	if(!email) {
		err.email = "You must enter an email";
	};
	
	if(!username) {
		err.username = "You must enter a username";
	};
	
	if(!passRegex.test(password)) {
		err.password = "Password must be 6+ characters long with 1+ number and special character";
	};
	
	if(!password) {
		err.password = "You must enter a password";
	};
	
	if(password !== confirmPassword) {
		err.confirmPassword = "Your password and confirmed password do not match"
	}
	
	if(!confirmPassword) {
		err.confirmPassword = "You must confirm your password";
	}
	
	return err;
};

const formWrapped = reduxForm({
	form: "Register",
	validate: validate
})(Register);

export default connect(null, {createUser})(formWrapped);