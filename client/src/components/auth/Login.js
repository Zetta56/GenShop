import React from "react";
import {reduxForm, Field} from "redux-form";
import {connect} from "react-redux";
import {login} from "../../actions";
import GoogleAuth from "../GoogleAuth";
import Input from "../Input";
import "./UserForm.css";

const Login = ({handleSubmit, login, match}) => {
	return (
		<div className="ui one column stackable grid" id="userForm">
			<div className="column">
				<h2>Login</h2>
				<form className="ui form" onSubmit={handleSubmit((formValues) => login(formValues))}>
					<Field name="username" component={Input} label="Username" inputType="text" icon="user" />
					<Field name="password" component={Input} label="Password" inputType="password" icon="lock" />
					<button className="ui blue submit button" id="submitButton">Submit</button>
				</form>
				<GoogleAuth type="login" />
			</div>
		</div>
	);
};

const formWrapped = reduxForm({
	form: "Login"
})(Login);

export default connect(null, {login})(formWrapped);