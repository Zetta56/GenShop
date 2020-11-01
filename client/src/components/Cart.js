import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {fetchProduct, addToCart, error} from "../actions";
import axios from "axios";
import {loadStripe} from "@stripe/stripe-js";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE);

const Cart = ({fetchProduct, addToCart, error, match, cartItems}) => {
	const onCheckoutClick = async () => {
		//Waits for stripe to finish loading
		const stripe = await stripePromise;
		//Create and navigate to checkout session
		const response = await axios.post("/api/checkout");
		const result = await stripe.redirectToCheckout({
			sessionId: response.data
		});

		if(result.err) {
			await error(result.error.message);
		}
	};

	const renderList = () => {
		return cartItems.map(product => {
			return (
				<div key={product._id}>
					<Link to={`/products/${product._id}`}>{product.title}</Link>
					{product.price}
				</div>
			);
		});
	};
	
	return (
		<div>
			{renderList()}
			<button className="ui blue button" onClick={onCheckoutClick}>Checkout</button>
		</div>
	);
};

const mapStateToProps = (state, ownProps) => {
	return {cartItems: state.user.cart};
};

export default connect(mapStateToProps, {fetchProduct, addToCart, error})(Cart);