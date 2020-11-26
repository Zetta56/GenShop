import React from "react";
import {reduxForm, Field} from "redux-form";
import {connect} from "react-redux";
import {login} from "../../actions";
import Input from "../Input";
import "./UserForm.css";

const Login = ({handleSubmit, login, match}) => {
	const renderGoogle = () => {
		//Loads google oauth2 client
		if(process.env.REACT_APP_GOOGLE_CLIENTID && match && match.path === "/login") {
			const onGoogleClick = async () => {
				await window.gapi.auth2.getAuthInstance().signIn();
				login({googleToken: window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token});
			};

			return (
				<React.Fragment>
					<button className="googleLogin" onClick={() => onGoogleClick()}></button>
					<div className="ui inverted horizontal divider">Or</div>
				</React.Fragment>
			);
		};
	};
	
	return (
		<div className="ui one column stackable grid" id="userForm">
			<div className="column">
				<h2>Login</h2>
				{renderGoogle()}
				<form className="ui form" onSubmit={handleSubmit((formValues) => login(formValues))}>
					<Field name="username" component={Input} label="Username" inputType="text" icon="user" />
					<Field name="password" component={Input} label="Password" inputType="password" icon="lock" />
					<button className="ui blue submit button" id="submitButton">Submit</button>
				</form>
			</div>
		</div>
	);
};

const formWrapped = reduxForm({
	form: "Login"
})(Login);

export default connect(null, {login})(formWrapped);