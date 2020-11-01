import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import history from "../history";
import {logout} from "../actions";

const Header = ({isLoggedIn, userId, isAdmin, sets, logout}) => {
	const onLogoutClick = (e) => {
		e.preventDefault();
		logout();
		if(process.env.REACT_APP_GOOGLE_CLIENTID && window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
			window.gapi.auth2.getAuthInstance().signOut();
		};
		history.push("/products");
	};

	const renderCreate = () => {
		if(isAdmin) {
			return <Link to="/products/new" className="create item"><i className="plus icon" /></Link>
		};
	};

	const renderAuth = () => {
		if(isLoggedIn === null) {
			return;
		} else if(isLoggedIn) {
			return (
				<React.Fragment>
					<Link to="/cart" className="item"><i className="shopping cart icon"/></Link>
					<Link to="#" className="item" onClick={(e) => onLogoutClick(e)}>Logout</Link>
				</React.Fragment>
			);
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
				<Link to="/" className="item">GenShop</Link>
				<div className="right menu">
					{renderCreate()}
					{renderAuth()}
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {isLoggedIn: state.user.isLoggedIn, isAdmin: state.user.isAdmin};
};

export default connect(mapStateToProps, {logout})(Header);