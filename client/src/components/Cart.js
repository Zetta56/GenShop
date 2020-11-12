import React, {useEffect} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import axios from "axios";
import {loadStripe} from "@stripe/stripe-js";
import {fetchProducts, alterCart, error} from "../actions";
import "./Cart.css";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE);

const Cart = ({fetchProducts, alterCart, error, match, user, products, total}) => {
	useEffect(() => {
		if(user) {
			fetchProducts(user._id);
		};
	}, [fetchProducts, user]);

	const onRemoveClick = (e, product) => {
		e.preventDefault();
		alterCart(false, product._id, null);
	};

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
			const cartQuantity = user.cart.find(item => item.product === product._id).quantity;

			return (
				<div className="item" key={product._id}>
					<div className="image">
						<img 
							src={`data:${product.image.contentType};base64,${product.image}`} 
							alt={product.title}
							id="productImage" />
						<button onClick={e => onRemoveClick(e, product)} className="ui red button">Remove from Cart</button>
					</div>
					<div className="middle aligned content">
						<div className="header">
							<Link to={`/products/${product._id}`}>{product.title}</Link>
						</div>
						<div className="description">
							<div>Unit Price: ${product.price}</div>
							<div>Quantity: {cartQuantity}</div>
							<div className="right floated content">${cartQuantity * product.price}</div>
						</div>
					</div>
				</div>
			);
		});
	};
	
	if(!products || !user) {
		return <div className="ui active centered inline loader"></div>
	}

	return (
		<div id="cart">
			<div className="ui divided items">
				{renderList()}
				<div className="total item">Total: ${total}</div>
			</div>
			<button className="ui blue button" onClick={onCheckoutClick}>Checkout</button>
		</div>
	);
};

const mapStateToProps = (state, ownProps) => {
	const cartIds = state.user.cart.map(item => item.product);
	
	//Calculates grand total based on quantities and matching prices
	let total = 0;
	for(const item of state.user.cart) {
		const matchingProduct = Object.values(state.products).filter(product => product._id === item.product);
		if(matchingProduct[0]) {
			total += item.quantity * matchingProduct[0].price;
		}
	};

	return {
		user: state.user,
		products: Object.values(state.products).filter(product => cartIds.includes(product._id)),
		total: total
	};
};

export default connect(mapStateToProps, {fetchProducts, alterCart, error})(Cart);