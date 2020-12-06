import React, {useEffect, useCallback} from "react";
import {Router, Switch, Route} from "react-router-dom";
import {connect} from "react-redux";
import axios from "axios"
import history from "../history";
import {resetAlerts, login, logout} from "../actions";
import ProtectedRoute from "./ProtectedRoute";
import GoogleAuth from "./GoogleAuth";
import Header from "./Header";
import Register from "./auth/Register";
import Login from "./auth/Login";
import Cart from "./commerce/Cart";
import Checkout from "./commerce/Checkout";
import ProductList from "./products/ProductList";
import ProductCreate from "./products/ProductCreate";
import ProductEdit from "./products/ProductEdit";
import ProductDetails from "./products/ProductDetails";
import ProductDelete from "./products/ProductDelete";
import ReviewDelete from "./reviews/ReviewDelete";
import "./App.css";

const App = ({error, confirm, resetAlerts, login, logout}) => {
	const loadAuth = useCallback(async () => {
		await axios.post("/api/refresh");
		const response = await axios.get("/api/access");

		if(response.data) {
			login(response.data, true);
		} else {
			logout();
		};

		//Removes error messages upon navigation
		history.listen(async () => {
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
			<GoogleAuth />
			<Header />
			<div className="main container">
				<Switch>
					<Route path="/" exact component={ProductList}></Route>
					<ProtectedRoute path="/register" exact component={Register} noAuthenticateReq></ProtectedRoute>
					<ProtectedRoute path="/login" exact component={Login} noAuthenticateReq></ProtectedRoute>
					<ProtectedRoute path="/cart" exact component={Cart}></ProtectedRoute>
					<ProtectedRoute path="/checkout" exact component={Checkout}></ProtectedRoute>
					<ProtectedRoute path="/products/new" exact component={ProductCreate} adminReq></ProtectedRoute>
					<ProtectedRoute path="/products/:productId/edit" exact component={ProductEdit} adminReq></ProtectedRoute>
					<ProtectedRoute path="/products/:productId/delete" exact component={ProductDelete} adminReq></ProtectedRoute>
					<ProtectedRoute path="/products/:productId/reviews/:reviewId/delete" exact component={ReviewDelete}></ProtectedRoute>
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