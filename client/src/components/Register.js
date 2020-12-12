import React from "react";
import {reduxForm, Field} from "redux-form";
import {connect} from "react-redux";
import {createUser} from "../actions";
import Input from "./Input";
import "./UserForm.css";

const Register = ({handleSubmit, createUser}) => {
	return (
		<div className="ui one column stackable grid" id="userForm">
			<div className="column">
				<h2>Create An Account</h2>
				<form className="ui form" onSubmit={handleSubmit(({email, username, password}) => createUser({email, username, password}))}>
					<Field name="email" component={Input} label="Email" inputType="email" icon="envelope" />
					<Field name="username" component={Input} label="Username" inputType="text" icon="user" />
					<Field name="password" component={Input} label="Password" inputType="password" icon="lock" />
					<Field name="confirmPassword" component={Input} label="Confirm Password" inputType="password" icon="lock" />
					<button className="ui blue submit button" id="submitButton">Create</button>
				</form>
			</div>
		</div>
	);
};

//Checks if all fields are valid
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