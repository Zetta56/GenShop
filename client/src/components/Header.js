import React, {useState} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import history from "../history";
import {logout} from "../actions";
import "./Header.css";

const Header = ({isLoggedIn, userId, isAdmin, sets, logout}) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const onLogoutClick = (e) => {
		e.preventDefault();
		logout();
		if(process.env.REACT_APP_GOOGLE_CLIENTID && window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
			window.gapi.auth2.getAuthInstance().signOut();
		};
		history.push("/products");
	};

	//Renders product create button for admins
	const renderCreate = () => {
		if(isAdmin) {
			return <Link to="/products/new" className="create item"><i className="plus icon" /></Link>
		};
	};

	//Renders login & logout buttons
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
		<React.Fragment>
			<div className="ui inverted secondary pointing menu" id="header">
				<Link to="/" className="item">GenShop</Link>
				<div className="ui search">
					<div className="ui icon input">
						<input type="text" placeholder="Search..." />
						<i className="ui search icon" />
					</div>
				</div>
				<div className="right menu">
					{renderCreate()}
					{renderAuth()}
				</div>
			</div>
			<div className="ui right sidebar vertical menu" id="sidebar">
				<i className="fas fa-bars"></i>
				{renderCreate()}
				{renderAuth()}
			</div>
		</React.Fragment>
	);
};

const mapStateToProps = (state) => {
	return {isLoggedIn: state.user.isLoggedIn, isAdmin: state.user.isAdmin};
};

export default connect(mapStateToProps, {logout})(Header);