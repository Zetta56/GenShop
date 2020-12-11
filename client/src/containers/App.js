import React, {useEffect, useCallback} from "react";
import {Router, Switch, Route} from "react-router-dom";
import {connect} from "react-redux";
import axios from "axios"
import history from "../history";
import {resetAlerts, login, logout} from "../actions";
import ProtectedRoute from "../components/ProtectedRoute";
import GoogleAuth from "../components/GoogleAuth";
import Header from "../components/Header";
import Register from "./Register";
import Login from "./Login";
import Watchlist from "./Watchlist";
import Cart from "./CartContainer";
import Checkout from "./Checkout";
import ProductList from "./ProductList";
import ProductCreate from "./ProductCreate";
import ProductEdit from "./ProductEdit";
import ProductDetails from "./ProductDetails";
import ProductDelete from "./ProductDelete";
import ReviewDelete from "./ReviewDelete";
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
					<ProtectedRoute path="/watchlist" exact component={Watchlist}></ProtectedRoute>
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