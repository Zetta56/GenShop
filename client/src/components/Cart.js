import React, {useEffect} from "react";
import {loadStripe} from "@stripe/stripe-js";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {fetchProduct, addToCart} from "../actions";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE);

const Cart = ({fetchProduct, addToCart, match, cartItems}) => {
	const renderList = () => {
		return cartItems.map(product => {
			return (
				<div key={product._id}>
					{product.title}
					{product.price}
				</div>
			);
		});
	};
	
	return (
		<div>
			cart
			{renderList()}
		</div>
	);
};

const mapStateToProps = (state, ownProps) => {
	return {cartItems: state.user.cart};
};

export default connect(mapStateToProps, {fetchProduct, addToCart})(Cart);