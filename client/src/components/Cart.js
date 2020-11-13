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
				<tr key={product._id}>
					<td className="image">
						<img 
							src={`data:${product.image.contentType};base64,${product.image}`} 
							alt={product.title}
							id="productImage" />
					</td>
					<td className="name">
						<strong>
							<Link to={`/products/${product._id}`}>{product.title}</Link>
						</strong>
					</td>
					<td className="price">
						<span className="label">Price: </span>${product.price}
					</td>
					<td className="quantity">
						<span className="label">Quantity: </span>{cartQuantity}
					</td>
					<td className="subtotal">
						<span className="label">Subtotal: </span>${cartQuantity * product.price}
					</td>
					<td className="remove">
						<button onClick={e => alterCart(false, product._id, null)} className="ui red button">
							<i className="trash icon" />
						</button>
					</td>
				</tr>
			);
		});
	};

	const renderTable = () => {
		if(products.length > 0)
			return (
				<table className="ui table">
					<thead>
						<tr>
							<th>Image</th>
							<th>Name</th>
							<th>Price</th>
							<th>Qty.</th>
							<th>Item Total</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{renderList()}
						<tr>
							<td colspan="5">
								<div className="total">Total: ${total}</div>
							</td>
						</tr>
					</tbody>
				</table>
			);
		else {
			return <div className="empty">Your cart is empty</div>
		};
	};

	const renderCheckout = () => {
		if(products.length > 0) {
			return (
				<button className="ui blue button" onClick={onCheckoutClick}>
					Checkout <i className="angle right icon" />
				</button>
			);
		}
	};

	return (
		<div id="cart">
			<h2 className="header">
				<span>My Cart</span>
				{renderCheckout()}
			</h2>
			{renderTable()}
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