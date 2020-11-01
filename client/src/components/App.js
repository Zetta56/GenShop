import React, {useEffect, useCallback} from "react";
import {Router, Switch, Route} from "react-router-dom";
import {connect} from "react-redux";
import axios from "axios"
import history from "../history";
import {resetAlerts, login, logout} from "../actions";
import ProtectedRoute from "./ProtectedRoute";
import Header from "./Header";
// import Landing from "./Landing";
import Register from "./auth/Register";
import Login from "./auth/Login";
import Cart from "./Cart";
import ProductList from "./products/ProductList";
import ProductCreate from "./products/ProductCreate";
import ProductEdit from "./products/ProductEdit";
import ProductDetails from "./products/ProductDetails";
import ProductDelete from "./products/ProductDelete";
import "./App.css";

const App = ({error, confirm, resetAlerts, login, logout}) => {
	const loadAuth = useCallback(() => {
		const loadAuth = async () => {
			await axios.post("/api/refresh");
			const response = await axios.get("/api/access");

			if(response.data) {
				login(response.data, true);
			} else if(process.env.REACT_APP_GOOGLE_CLIENTID && window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
				login({googleId: window.gapi.auth2.getAuthInstance().currentUser.get()});
			} else {
				logout();
			};
		};
		
		//Loads auth2 client and checks login status
		if(process.env.REACT_APP_GOOGLE_CLIENTID) {
			window.gapi.load("client:auth2", () => {
				window.gapi.client.init({
					clientId: process.env.REACT_APP_GOOGLE_CLIENTID,
					scope: "email"
				}).then(() => loadAuth());
			});
		} else {
			loadAuth();
		};
		
		//Removes error messages upon navigation
		history.listen(async (location) => {
			resetAlerts();
		});
	}, [resetAlerts, login, logout]);

	useEffect(() => {
		loadAuth();
	}, [loadAuth]);

	const renderMessage = () => {
		if(error) {
			return <div className="ui negative message alertMessage">{error}</div>
		};
		if(confirm) {
			return <div className="ui positive message alertMessage">{confirm}</div>
		};
	};
	
	return (
		<Router history={history}>
			{renderMessage()}
			<Header />
			<div className="ui main container">
				<Switch>
					<Route path="/" exact component={ProductList}></Route>
					<ProtectedRoute path="/register" exact component={Register}></ProtectedRoute>
					<ProtectedRoute path="/login" exact component={Login}></ProtectedRoute>
					<ProtectedRoute path="/cart" exact component={Cart} authenticateReq></ProtectedRoute>
					<Route path="/products" exact component={ProductList}></Route>
					<ProtectedRoute path="/products/new" exact component={ProductCreate} adminReq></ProtectedRoute>
					<ProtectedRoute path="/products/:productId/edit" exact component={ProductEdit} adminReq></ProtectedRoute>
					<ProtectedRoute path="/products/:productId/delete" exact component={ProductDelete} adminReq></ProtectedRoute>
					<Route path="/products/:productId" exact component={ProductDetails}></Route>
				</Switch>
			</div>
		</Router>
	);
};

const mapStateToProps = (state) => {
	return {error: state.alert.error, confirm: state.alert.confirm}
};

export default connect(mapStateToProps, {resetAlerts, login, logout})(App);