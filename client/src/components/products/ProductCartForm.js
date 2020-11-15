import React from "react";
import {connect} from "react-redux";
import {Field, reduxForm} from "redux-form";
import {Link} from "react-router-dom";
import {alterCart} from "../../actions";
import Input from "../Input";

const ProductCartForm = ({handleSubmit, alterCart, match, product, user, loading}) => {
	const addButtonContent = loading 
		  ? <div className="ui mini active inverted inline loader"></div> 
		  : "Add to Cart";

	//Removes product from cart
	const onRemoveClick = (e) => {
		e.preventDefault();
		alterCart(false, match.params.productId, null);
	};

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
		}
	}

	return (
		<form className="cartForm" onSubmit={handleSubmit(formValues => alterCart(true, match.params.productId, formValues))}>
			<div className="price">Unit Price: ${product.price}</div>
			<Field 
				name="quantity" 
				component={Input} 
				label="Quantity: " 
				inputType="number"
				min={0}
				step={1}
				required />
			{renderCartButton()}
		</form>
	);
};

const formWrapped = reduxForm({
	form: "alterCart"
})(ProductCartForm);

const mapStateToProps = (state, ownProps) => {
	return {
		initialValues: {quantity: 1},
		loading: state.alert.loading
	};
};

export default connect(mapStateToProps, {alterCart})(formWrapped);