import React from "react";
import {Field} from "redux-form";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {reduxForm} from "redux-form";
import {editCart, editWatchlist} from "../actions";
import Input from "./Input";
import Price from "./Price";
import Dropdown from "./Dropdown";
import "./CartForm.css";

//Props: product
const CartForm = ({handleSubmit, user, editCart, editWatchlist, product}) => {
	//Conditionally render buttons in cart form
	const renderCartButton = () => {
		if(!user.isLoggedIn) {
			return <Link to="/login" className="ui button">Sign in to add to cart</Link>
		} else if(user.cart && user.cart.find(item => item.product === product._id)) {
			return <button className="ui red button">Remove from Cart</button>
		} else {
			return <button className="ui blue button">Add to Cart</button>
		};
	};

	const renderWatchlistButton = () => {
		if(!user.isLoggedIn) {
			return null;
		} else if(user.watchlist && user.watchlist.find(item => item === product._id)) {
			return <button type="button" onClick={() => editWatchlist(product._id)} className="ui red watchlist button">Remove from Watchlist</button>
		} else {
			return <button type="button" onClick={() => editWatchlist(product._id)} className="ui blue watchlist button">Add to Watchlist</button>
		}
	};

	return (
		<form className="cartForm" onSubmit={handleSubmit(formValues => editCart(product._id, formValues))}>
			<div className="price">
				Unit Price: 
				<Price product={product} />
			</div>
			<Field 
				name="variation" 
				component={Dropdown} 
				label="Variation:" 
				options={product.variations} />
			<Field 
				name="quantity" 
				component={Input} 
				label="Quantity: "
				placeholder="Qty." 
				inputType="number"
				min={0}
				step={1}
				required />
			{renderCartButton()}
			{renderWatchlistButton()}
		</form>
	);
};

const formWrapped = reduxForm({
	form: "EditCart",
	enableReinitialize: true
})(CartForm);

const mapStateToProps = (state, ownProps) => {
	const cartItem = state.user.cart 
		? state.user.cart.find(item => item.product === ownProps.product._id) 
		: null;
	const initialVariations = cartItem
		? cartItem.variation
		: ownProps.product.variations
			? ownProps.product.variations[0]
			: null;

	return {
		initialValues: {
			quantity: cartItem ? cartItem.quantity : 1, 
			variation: initialVariations
		},
		user: state.user
	};
};

export default connect(mapStateToProps, {editCart, editWatchlist})(formWrapped);