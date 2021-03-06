import React, {useEffect} from "react";
import {connect} from "react-redux";
import axios from "axios";
import {loadStripe} from "@stripe/stripe-js";
import {fetchProducts, error} from "../actions";
import Cart from "../components/Cart";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE);

const CartContainer = ({fetchProducts, error, user, products, total}) => {
	useEffect(() => {
		if(user) {
			fetchProducts(user._id, "cart");
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

	return <Cart 
				cart={user.cart} 
				products={products} 
				total={total} 
				onCheckoutClick={() => onCheckoutClick()} />
};

const mapStateToProps = (state) => {
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

export default connect(mapStateToProps, {fetchProducts, error})(CartContainer);