import React from "react";
import {connect} from "react-redux";
import {reduxForm} from "redux-form";
import {alterCart} from "../actions";
import CartForm from "../components/CartForm";

const CartFormContainer = ({handleSubmit, alterCart, match, product, user, loading}) => {
	//Removes product from cart
	const onRemoveClick = (e) => {
		e.preventDefault();
		alterCart(false, match.params.productId, null);
	};

	return <CartForm 
				onRemoveClick={onRemoveClick}
				alterCart={(formValues) => alterCart(true, match.params.productId, formValues)}
				match={match}
				product={product}
				user={user}
				loading={loading}
				handleSubmit={handleSubmit} />
};

const formWrapped = reduxForm({
	form: "AlterCart",
	enableReinitialize: true
})(CartFormContainer);

const mapStateToProps = (state, ownProps) => {
	const cartItem = state.user.cart ? state.user.cart.find(item => item.product === ownProps.product._id) : null;
	let initialVariations;
	if(cartItem) {
		initialVariations = cartItem.variation;
	} else if(ownProps.product.variations) {
		initialVariations = ownProps.product.variations[0];
	} else {
		initialVariations = null;
	}

	return {
		initialValues: {
			quantity: cartItem ? cartItem.quantity : 1, 
			variation: initialVariations
		},
		loading: state.alert.loading
	};
};

export default connect(mapStateToProps, {alterCart})(formWrapped);