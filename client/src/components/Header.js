import React from "react";
import {connect} from "react-redux"
import {Link} from "react-router-dom";
import {logout} from "../actions";

const Header = ({isLoggedIn, sets, logout}) => {
	const onLogoutClick = (e) => {
		e.preventDefault();
		logout();
		if(process.env.REACT_APP_GOOGLE_CLIENTID && window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
			window.gapi.auth2.getAuthInstance().signOut();
		};
	};

	const renderAuth = () => {
		if(isLoggedIn === null) {
			return;
		} else if(isLoggedIn) {
			return <Link to="#" className="item" onClick={(e) => onLogoutClick(e)}>Logout</Link>
		} else {
			return (
				<React.Fragment>
					<Link to="/login" className="item">Login</Link>
					<Link to="/register" className="item">Sign Up</Link>
				</React.Fragment>
			);
		};
	};

	return (
		<div className="ui inverted secondary pointing menu" id="header">
			<div className="ui container">
				<Link to="/" className="item">KnickKnackr</Link>
				<div className="right menu">
					{renderAuth()}
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {isLoggedIn: state.auth.isLoggedIn}
};

export default connect(mapStateToProps, {logout})(Header);