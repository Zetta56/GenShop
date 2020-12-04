import React, {useCallback} from "react";
import {connect} from "react-redux";
import {Field, reduxForm} from "redux-form";
import {Link} from "react-router-dom";
import {alterCart} from "../../actions";
import Input from "../Input";
import Price from "../Price";
import { stat } from "fs";

const CartForm = ({handleSubmit, alterCart, match, product, user, loading}) => {
	const addButtonContent = loading 
		  ? <div className="ui mini active inverted inline loader"></div> 
		  : "Add to Cart";

	//Removes product from cart
	const onRemoveClick = (e) => {
		e.preventDefault();
		alterCart(false, match.params.productId, null);
	};

	const renderDropdown = useCallback(({input, label}) => {
		if(product.variations && product.variations.length > 0) {
			return (
				<span>
					<label>{label}</label>
					<select {...input} className="ui selection dropdown menu">
						{
							product.variations.map(variation => {
								return (
									<option className="item" value={variation} key={variation}>
										{variation}
									</option>
								);
							})
						}
					</select>
				</span>
			)
		} else {
			return null;
		}
	}, [product]);

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
		<form className="cartForm" onSubmit={handleSubmit(formValues => alterCart(true, match.params.productId, formValues))}>
			<div className="price">
				Unit Price: 
				<Price product={product} />
			</div>
			<Field name="variation" component={renderDropdown} label="Variation:" />
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

const formWrapped = reduxForm({
	form: "AlterCart",
	enableReinitialize: true
})(CartForm);

const mapStateToProps = (state, ownProps) => {
	const quantity = state.user.cart ? state.user.cart.find(item => item.product === ownProps.product._id).quantity : null;

	return {
		initialValues: {
			quantity: quantity ? quantity : 1, 
			variation: ownProps.product.variations ? ownProps.product.variations[0] : null 
		},
		loading: state.alert.loading
	};
};

export default connect(mapStateToProps, {alterCart})(formWrapped);