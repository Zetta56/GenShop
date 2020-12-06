import React from "react";
import {connect} from "react-redux";
import {Route, Redirect} from "react-router-dom";

const ProtectedRoute = ({isLoggedIn, isAdmin, noAuthenticateReq, adminReq, path, component}) => {
	if(isLoggedIn === null) {
		return null;
	} else if((adminReq && !isAdmin) || (!adminReq && !noAuthenticateReq && !isLoggedIn)) {
		return <Redirect to="/login" />
	} else if(!adminReq && noAuthenticateReq && isLoggedIn) {
		return <Redirect to="/" />
	} else {
		return <Route path={path} component={component}></Route>
	};
};

const mapStateToProps = (state) => {
	return {isLoggedIn: state.user.isLoggedIn, isAdmin: state.user.isAdmin};
};

export default connect(mapStateToProps)(ProtectedRoute);