import React, {useEffect, useRef} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {fetchProduct, addToCart, error} from "../actions";
import axios from "axios";
import {loadStripe} from "@stripe/stripe-js";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE);

const Cart = ({fetchProduct, addToCart, error, match, cartItems, products}) => {
	const cartRef = useRef(cartItems);

	useEffect(() => {
		cartRef.current.forEach(item => {
			fetchProduct(item.product);
		});
	}, [fetchProduct, cartRef]);

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
		return products.map(product => {
			const cartQuantity = cartItems.find(item => item.product === product._id).quantity;

			return (
				<div key={product._id}>
					<img src={`data:${product.image.contentType};base64,${product.image}`} alt={product.title} />
					<Link to={`/products/${product._id}`}>{product.title}</Link>
					<br />
					{product.price}
					<br />
					{cartQuantity}
				</div>
			);
		});
	};
	
	if(!products) {
		return null;
	}

	return (
		<div>
			{renderList()}
			<button className="ui blue button" onClick={onCheckoutClick}>Checkout</button>
		</div>
	);
};

const mapStateToProps = (state, ownProps) => {
	const cartIds = state.user.cart.map(item => {
		return item.product;
	});

	return {
		cartItems: state.user.cart, 
		products: Object.values(state.products).filter(product => {
			return cartIds.includes(product._id)
		})
	};
};

export default connect(mapStateToProps, {fetchProduct, addToCart, error})(Cart);