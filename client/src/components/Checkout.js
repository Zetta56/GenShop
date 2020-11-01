import React from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {resetCart} from "../actions";

const Checkout = ({resetCart, match}) => {
	let message = "";

	switch(window.location.search) {
		case "?success=true":
			message = "Your order has been placed! Thanks for shopping!";
			resetCart();
			break;
		case "?cancel=true":
			message = "Order canceled. Please come back when you're ready!"
			break;
		default:
			return <Redirect to="/" />
	};

	return (
		<div>
			<h1>Checkout</h1>
			{message}
		</div>
	);
};

export default connect(null, {resetCart})(Checkout);