import React from "react";
import {connect} from "react-redux";
import {Redirect, Link} from "react-router-dom";
import history from "../../history";
import {resetCart} from "../../actions";
import Modal from "../Modal";

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

	const renderButton = () => {
		return <Link to="/" className="ui button">Close</Link>
	};

	return (
		<Modal 
			header="Checkout"
			content={`${message}`}
			actions={renderButton()} />
	);
};

export default connect(null, {resetCart})(Checkout);