import React from "react";
import {Field} from "redux-form";
import {Link} from "react-router-dom";
import Input from "./Input";
import Price from "./Price";
import Dropdown from "./Dropdown";

const CartForm = ({handleSubmit, alterCart, match, product, user, loading, onRemoveClick}) => {
	const addButtonContent = loading 
		  ? <div className="ui mini active inverted inline loader"></div> 
		  : "Add to Cart";

	//Conditionally renders button in cart form
	const renderCartButton = () => {
		if(!user.isLoggedIn) {
			return <Link to="/login" className="ui button">Sign in to add to cart</Link>
		} else if(user.cart && user.cart.filter(item => item.product === match.params.productId).length > 0) {
			return <button onClick={e => onRemoveClick(e)} className="ui red button">Remove from Cart</button>
		} else {
			return (
				<button className="ui blue button">{addButtonContent}</button>
			);
		};
	};

	return (
		<form className="cartForm" onSubmit={handleSubmit(formValues => alterCart(formValues))}>
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
		</form>
	);
};

export default CartForm;