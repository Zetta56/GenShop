import React, {useCallback} from "react";
import {reduxForm, Field} from "redux-form";
import {connect} from "react-redux";
import {login} from "../../actions";
import "./UserForm.css";

const Login = ({handleSubmit, login, match}) => {
	const renderGoogle = () => {
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

	const renderInput = useCallback(({input, label, inputType}) => {
		return (
			<div className="field">
				<label>{label}</label>
				<input {...input}  type={inputType} placeholder={label} required />
			</div>
		)
	}, []);
	
	return (
		<div className="login ui one column stackable grid" id="userForm">
			<div className="column">
				<h2>Login</h2>
				{renderGoogle()}
				<form className="ui form" onSubmit={handleSubmit((formValues) => login(formValues))}>
					<Field name="username" component={renderInput} label="Username" inputType="text" />
					<Field name="password" component={renderInput} label="Password" inputType="password" />
					<button className="ui blue submit button" id="submitButton">Submit</button>
				</form>
			</div>
		</div>
	);
};

const reduxWrapped = reduxForm({
	form: "Login"
})(Login);

export default connect(null, {login})(reduxWrapped);