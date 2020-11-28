import React, {useEffect} from "react";
import {connect} from "react-redux";
import axios from "axios";
import {loadStripe} from "@stripe/stripe-js";
import {fetchProducts, error} from "../../actions";
import CartTable from "./CartTable";
import "./Cart.css";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE);

const Cart = ({fetchProducts, error, user, products, total}) => {
	useEffect(() => {
		if(user) {
			fetchProducts({user: user._id});
		};
	}, [fetchProducts, user]);

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

	const renderCheckoutButton = () => {
		if(products.length > 0) {
			return (
				<button className="ui blue button" onClick={onCheckoutClick}>
					Checkout <i className="angle right icon" />
				</button>
			);
		}
	};

	if(!products || products.length < 1) {
		return <div className="emptyMessage">Your cart is empty.</div>
	};

	return (
		<div id="cart">
			<CartTable products={products} user={user} total={total} />
			<div className="checkout">{renderCheckoutButton()}</div>
		</div>
	);
};

const mapStateToProps = (state, ownProps) => {
	const cartIds = state.user.cart.map(item => item.product);
	
	//Adds product of each product's price and quantity to get grand total
	let total = 0;
	for(const item of state.user.cart) {
		const matchingProduct = Object.values(state.products).find(product => product._id === item.product);
		const discountPercent = matchingProduct && matchingProduct.discount ? matchingProduct.discount / 100 : 0;
		if(matchingProduct) {
			total += item.quantity * (matchingProduct.price - matchingProduct.price * discountPercent);
		}
	};

	return {
		user: state.user,
		products: Object.values(state.products).filter(product => cartIds.includes(product._id)),
		total: Math.round(total * 100) / 100
	};
};

export default connect(mapStateToProps, {fetchProducts, error})(Cart);