import React from "react";
import {connect} from "react-redux";
import {Route, Redirect} from "react-router-dom";

const ProtectedRoute = ({isLoggedIn, isAdmin, authenticateReq, adminReq, path, component}) => {
	const redirectUrl = isLoggedIn ? "/" : "/login";
		  authenticateReq = authenticateReq ? true : false;

	if(isLoggedIn === null) {
		return null;
	} else if((adminReq && isAdmin) || (!adminReq && authenticateReq === isLoggedIn)) {
		return <Route path={path} component={component}></Route>
	} else {
		return <Redirect to={redirectUrl} />
	}
};

const mapStateToProps = (state) => {
	return {isLoggedIn: state.user.isLoggedIn, isAdmin: state.user.isAdmin};
};

export default connect(mapStateToProps)(ProtectedRoute);